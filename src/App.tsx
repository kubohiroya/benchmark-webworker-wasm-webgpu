import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { wrap, releaseProxy, ProxyMethods, Remote, proxy} from "comlink";
import {MandelbrotService} from "./MandelbrotService";

import DigitalClock from "./DigitalClock.tsx";
import ReactGithubCorner from "react-github-corner";
import { AppTypeNames } from "./AppTypeNames.ts";
import { AppTypes, CancellableType, ThreadType } from "./AppType.ts";

// Mandelbrot パラメータ
const MANDELBROT_PARAMS = {
  width: 800,
  height: 800,
  maxIterations: 4096,
  minX: -2.0,
  maxX: 1.0,
  minY: -1.2,
  maxY: 1.2,
};

enum AppState {
  STOPPED,
  RUNNING,
}

const AppSelector = ({
  appTypeNames,
  isRunning,
  appTypeName: currentAppTypeName,
                       handleAppTypeNameChange,
  elapsedTimeMap,
}: {
  appTypeNames: Array<AppTypeNames>;
  isRunning: boolean;
  appTypeName: AppTypeNames;
  handleAppTypeNameChange: (appTypeName: AppTypeNames) => void;
  elapsedTimeMap: Record<string,number>;
}) => {
  return appTypeNames.map((appTypeName, index) => {
    return appTypeName != null ? (
      <td
        key={index}
        style={{
          backgroundColor:
            appTypeName === AppTypeNames.WEBGPU_SINGLE &&
            navigator.gpu === undefined
              ? "lightgrey"
              : appTypeName === AppTypeNames.JS_SINGLE ||
                  appTypeName === AppTypeNames.WASM_SINGLE ||
                  appTypeName === AppTypeNames.JS_MULTI ||
                  appTypeName === AppTypeNames.WASM_MULTI
                ? "#eaa"
                : "#aea",
        }}
      >
        <input
          defaultChecked={appTypeName === currentAppTypeName}
          disabled={
            isRunning ||
            (appTypeName === AppTypeNames.WEBGPU_SINGLE &&
              navigator.gpu === undefined)
          }
          type="radio"
          name="app"
          id={`${appTypeName}`}
          value={appTypeName}
          onClick={() => handleAppTypeNameChange(appTypeName)}
        />
        <label htmlFor={`${appTypeName}`} style={{ paddingRight: "4px" }}>
          {elapsedTimeMap[appTypeName] !== undefined
            ? elapsedTimeMap[appTypeName]!.toFixed(0) + " msec"
            : "------------"}
        </label>
      </td>
    ) : (
      <td key={index}></td>
    );
  });
};

function App() {

  const serviceRef = useRef<MandelbrotService>(new MandelbrotService());

  const workerIdRef = useRef<number>(0);
  const workerRef = useRef<Worker | null>(null);
  const comlinkWorkerRef = useRef<Remote<
    MandelbrotService & ProxyMethods
  > | null>(null);

  const [appTypeName, setAppTypeName] = useState<AppTypeNames>(
    AppTypeNames.JS_SINGLE,
  );
  const handleAppTypeNameChange = useCallback((appTypeName: AppTypeNames) => {
    setAppTypeName(appTypeName);
  }, []);

  const appType = useMemo(() => AppTypes[appTypeName], [appTypeName]);

  const [maxIterations, setMaxIterations] = useState(
    MANDELBROT_PARAMS.maxIterations,
  );
  const [progress, setProgress] = useState(-1);
  const [elapsedTime, setElapsedTime] = useState(-1);
  const [elapsedTimeMap, setElapsedTimeMap] = useState<Record<string, number>>(
    {},
  );
  const [appState, setAppState] = useState<AppState>(AppState.STOPPED);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const initWorker = useCallback(() => {
    workerIdRef.current++;
    workerRef.current = new Worker(new URL("./worker", import.meta.url), {
      type: "module",
    });
    comlinkWorkerRef.current = wrap(workerRef.current);
    console.log("worker initialized");
  }, []);

  useEffect(() => {
    initWorker();
  }, []);

  useLayoutEffect(() => {
    contextRef.current = canvasRef.current?.getContext("2d") ?? null;
  }, []);

  const onFinish = useCallback(() => {
    setAppState(AppState.STOPPED);
  }, []);

  const onCancel = useCallback(() => {
    setAppState(AppState.STOPPED);
    console.log(`canceled`);
  }, []);

  const generateMandelbrot = useCallback(() => {

    function onRowImage  (
      workerId: number,
      startTime: number,
      rowIndex: number,
      rowImage: Uint8ClampedArray,
    ): void {
      // ユーザによるキャンセルのためにworkerが作り直された場合には、過去のworkerからのコールバックは無視する。
      // そのため、最新のworkerIdとの一致を確認する。
      if (workerIdRef.current !== workerId) {
        console.log("callback ignored");
        return;
      }
      const newElapsedTime = performance.now() - startTime;
      setElapsedTime(newElapsedTime);
      setElapsedTimeMap({ ...elapsedTimeMap, [appTypeName]: newElapsedTime });

      setProgress(rowIndex);
      requestAnimationFrame(() => {
        // rowData は row1行分の RGBA (Uint8ClampedArray)、ImageDataに変換
        const imageData = new ImageData(rowImage, MANDELBROT_PARAMS.width, 1);
        // 該当行(y位置は row)に描画
        contextRef.current?.putImageData(imageData, 0, rowIndex);
      });
    };

    function onFullImage (workerId: number, startTime: number, fullImage: Uint8ClampedArray): void {
      // ユーザによるキャンセルのためにworkerが作り直された場合には、過去のworkerからのコールバックは無視する。
      // そのため、最新のworkerIdとの一致を確認する。
      if (workerIdRef.current !== workerId) {
        console.log("callback ignored");
        return;
      }
      const newElapsedTime = performance.now() - startTime;
      setElapsedTime(newElapsedTime);
      setElapsedTimeMap({ ...elapsedTimeMap, [appTypeName]: newElapsedTime });
      setProgress(MANDELBROT_PARAMS.height - 1);
      requestAnimationFrame(() => {
        const imageData = new ImageData(
          fullImage,
          MANDELBROT_PARAMS.width,
          MANDELBROT_PARAMS.height,
        );
        contextRef.current?.putImageData(imageData, 0, 0);
      });
    };

    setProgress(0);
    setAppState(AppState.RUNNING);

    if (appType.threadType === ThreadType.Worker) {
      comlinkWorkerRef.current?.generateMandelbrot(
        workerIdRef.current,
        performance.now(),
        appType,
        { ...MANDELBROT_PARAMS, maxIterations },
        // コールバックを Comlink.proxy で包んだものを渡す
        proxy(onFinish),
        proxy(onCancel),
        proxy(onFullImage),
        proxy(onRowImage),
      );
    } else {
      serviceRef.current.generateMandelbrot(
        workerIdRef.current,
        performance.now(),
        appType,
        { ...MANDELBROT_PARAMS, maxIterations },
        onFinish,
        onCancel,
        onFullImage,
        onRowImage
      );
    }
  }, [appType, appTypeName, maxIterations, onFinish, onCancel]);

  const cancel = useCallback(() => {
    if (appType.threadType === ThreadType.Worker) {
      comlinkWorkerRef.current?.cancel();
      comlinkWorkerRef.current?.[releaseProxy]();
      workerRef.current?.terminate();
      initWorker();
    } else if (appType.cancellableType === CancellableType.Cancellable) {
      serviceRef.current.cancel();
    }
    setAppState(AppState.STOPPED);
  }, [appType, initWorker]);

  const clearBackground = useCallback(() => {
    if (contextRef.current) {
      contextRef.current?.clearRect(
        0,
        0,
        MANDELBROT_PARAMS.width,
        MANDELBROT_PARAMS.height,
      );
    }
  }, []);

  const showBackground = useCallback(() => {
    if (contextRef.current) {
      contextRef.current.fillStyle = "lightGrey";
      contextRef.current.fillRect(
        0,
        0,
        MANDELBROT_PARAMS.width,
        MANDELBROT_PARAMS.height,
      );
      contextRef.current.fillStyle = "grey";
      contextRef.current.font = "30px serif";
      contextRef.current.fillText("Wait a moment.", 300, 380);
    }
  }, []);

  const reset = useCallback(() => {
    clearBackground();
    setElapsedTime(-1);
    setProgress(-1);
    setAppState(AppState.STOPPED);
  }, [clearBackground]);

  const start = useCallback(() => {
    reset();
    showBackground();
    requestIdleCallback(generateMandelbrot);
  }, [reset, showBackground, generateMandelbrot]);

  const isRunning = appState == AppState.RUNNING;

  return (
    <div style={{ alignItems: "center", textAlign: "center" }}>
      <ReactGithubCorner href="https://github.com/kubohiroya/benchmark-webworker-wasm-webgpu" />
      <DigitalClock />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          padding: "5px",
        }}
      >
        <table border={1}>
          <thead>
            <tr>
              <th rowSpan={4}></th>
              <th colSpan={1}>Single-pass</th>
              <th colSpan={3}>Line-by-line</th>
            </tr>
            <tr>
              <th colSpan={3}>UI Thread</th>
              <th colSpan={1}>Worker Thread</th>
            </tr>
            <tr>
              <th colSpan={2}>Blocking</th>
              <th colSpan={2}>Non-blocking</th>
            </tr>
            <tr>
              <th colSpan={2}>Non-Cancellable</th>
              <th colSpan={2}>Cancellable</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                AppTypeNames.JS_SINGLE,
                AppTypeNames.JS_MULTI,
                AppTypeNames.JS_MULTI_CANCELLABLE,
                AppTypeNames.JS_WORKER,
              ],
              [
                AppTypeNames.WASM_SINGLE,
                AppTypeNames.WASM_MULTI,
                AppTypeNames.WASM_MULTI_CANCELLABLE,
                AppTypeNames.WASM_WORKER,
              ],
            ].map((appTypeNames, index) => {
              return (
                <tr key={index}>
                  <th>{["JavaScript", "Wasm"][index]}</th>
                  <AppSelector
                    {...{
                      appTypeNames,
                      isRunning,
                      appTypeName,
                      handleAppTypeNameChange,
                      elapsedTimeMap,
                    }}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
        <table border={1}>
          <thead>
            <tr>
              <th rowSpan={4}></th>
              <th colSpan={1}>64 workgroups</th>
            </tr>
            <tr>
              <th colSpan={1}>UI Thread</th>
            </tr>
            <tr>
              <th colSpan={1}>Non-blocking</th>
            </tr>
            <tr>
              <th colSpan={1}>Non-Cancellable</th>
            </tr>
          </thead>
          <tbody>
            {[[AppTypeNames.WEBGPU_SINGLE]].map((appTypeNames, index) => {
              return (
                <tr key={index}>
                  <th>{["WebGPU"][index]}</th>
                  <AppSelector
                    {...{
                      appTypeNames,
                      isRunning,
                      appTypeName,
                      handleAppTypeNameChange,
                      elapsedTimeMap,
                    }}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          padding: "5px",
        }}
      >
        <label htmlFor="maxIterations">Max iterations:</label>
        <select
          disabled={isRunning}
          name="maxIterations"
          value={maxIterations}
          onChange={(e) => setMaxIterations(parseInt(e.currentTarget.value))}
        >
          {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => (
            <option key={n}>{Math.pow(2, n)}</option>
          ))}
        </select>
        <button
          disabled={isRunning}
          onClick={start}
          style={{ marginLeft: "20px", fontSize: "22px" }}
        >
          START
        </button>
        <button onClick={cancel}>CANCEL</button>
        <button onClick={reset}>RESET</button>
        <div
          style={{
            width: "25%",
            display: "flex",
            paddingLeft: "30px",
            gap: "20px",
          }}
        >
          <div style={{ alignSelf: "center" }}>
            {progress > 0 && (
              <span>
                {progress + 1} / {MANDELBROT_PARAMS.height}{" "}
              </span>
            )}
          </div>
          <div>
            {elapsedTime >= 0 && (
              <span
                style={{
                  fontSize: "24px",
                  color:
                    progress + 1 === MANDELBROT_PARAMS.height
                      ? "blue"
                      : "lightgrey",
                }}
              >
                {elapsedTime.toFixed(0)} msec
              </span>
            )}
          </div>
        </div>
      </div>
      <canvas
        style={{ border: "1px solid black" }}
        width={MANDELBROT_PARAMS.width}
        height={MANDELBROT_PARAMS.height}
        ref={canvasRef}
      ></canvas>
    </div>
  );
}

export default App;
