import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { wrap, proxy, releaseProxy, ProxyMethods, Remote } from "comlink";
import { mandelbrotService, type MandelbrotService } from "./worker";
import DigitalClock from "./DigitalClock.tsx";
import { AppRuntimeType } from "./AppRuntimeType.ts";
import ReactGithubCorner from "react-github-corner";

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

function App() {
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const workerIdRef = useRef<number>(0);
  const workerRef = useRef<Worker | null>(null);
  const comlinkWorkerRef = useRef<Remote<
    MandelbrotService & ProxyMethods
  > | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [appRuntime, setAppRuntime] = useState<AppRuntimeType>(
    AppRuntimeType.JS_SINGLE,
  );
  const [maxIterations, setMaxIterations] = useState(
    MANDELBROT_PARAMS.maxIterations,
  );
  const [progress, setProgress] = useState(-1);
  const [elapsedTime, setElapsedTime] = useState(-1);
  const [elapsedTimeMap, setElapsedTimeMap] = useState<{[key:string]:number}>({});
  const [appState, setAppState] = useState<AppState>(AppState.STOPPED);

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
  }, [initWorker]);

  useLayoutEffect(() => {
    contextRef.current = canvasRef.current?.getContext("2d") ?? null;
  }, []);

  const onFinish = useCallback(() => {
    setAppState(AppState.STOPPED);
  }, [appRuntime, maxIterations, elapsedTime, elapsedTimeMap]);

  const onCancel = useCallback(() => {
    setAppState(AppState.STOPPED);
    console.log(`canceled`);
  }, []);

  const generateMandelbrot = useCallback(() => {
    setProgress(0);
    setAppState(AppState.RUNNING);

    const startTime = performance.now();

    function onPartialRowData(
      workerId: number,
      row: number,
      rowData: Uint8ClampedArray,
    ): void {
      // ユーザによるキャンセルのためにworkerが作り直された場合には、過去のworkerからのコールバックは無視する。
      // そのため、最新のworkerIdとの一致を確認する。
      if (workerIdRef.current !== workerId) {
        console.log("callback ignored");
        return;
      }
      const newElapsedTime = performance.now() - startTime;
      setElapsedTime(newElapsedTime );
      setElapsedTimeMap({...elapsedTimeMap, [appRuntime]:newElapsedTime});

      setProgress(row);
      requestAnimationFrame(() => {
        // rowData は row1行分の RGBA (Uint8ClampedArray)、ImageDataに変換
        const imageData = new ImageData(rowData, MANDELBROT_PARAMS.width, 1);
        // 該当行(y位置は row)に描画
        contextRef.current?.putImageData(imageData, 0, row);
      });
    }

    function onWholeData(workerId: number, image: Uint8ClampedArray): void {
      // ユーザによるキャンセルのためにworkerが作り直された場合には、過去のworkerからのコールバックは無視する。
      // そのため、最新のworkerIdとの一致を確認する。
      if (workerIdRef.current !== workerId) {
        console.log("callback ignored");
        return;
      }
      const newElapsedTime = performance.now() - startTime;
      setElapsedTime(newElapsedTime );
      setElapsedTimeMap({...elapsedTimeMap, [appRuntime]:newElapsedTime});
      setProgress(MANDELBROT_PARAMS.height - 1);
      requestAnimationFrame(() => {
        const imageData = new ImageData(
          image,
          MANDELBROT_PARAMS.width,
          MANDELBROT_PARAMS.height,
        );
        contextRef.current?.putImageData(imageData, 0, 0);
      });
    }

    switch (appRuntime) {
      case AppRuntimeType.JS_SINGLE:
      case AppRuntimeType.WASM_SINGLE:
      case AppRuntimeType.WEBGPU_SINGLE: {
        mandelbrotService.generateMandelbrotSingle(
          workerIdRef.current,
          appRuntime,
          { ...MANDELBROT_PARAMS, maxIterations },
          onWholeData,
          onFinish,
        );
        break;
      }
      case AppRuntimeType.JS_MULTI:
      case AppRuntimeType.WASM_MULTI:
      case AppRuntimeType.JS_MULTI_CANCELLABLE:
      case AppRuntimeType.WASM_MULTI_CANCELLABLE: {
        mandelbrotService.generateMandelbrotLineByLine(
          workerIdRef.current,
          appRuntime,
          { ...MANDELBROT_PARAMS, maxIterations },
          // コールバックを Comlink.proxy で包まずに、そのまま渡す
          onPartialRowData,
          onFinish,
          onCancel,
        );
        break;
      }
      case AppRuntimeType.JS_WORKER:
      case AppRuntimeType.WASM_WORKER:
        comlinkWorkerRef.current?.generateMandelbrotLineByLine(
          workerIdRef.current,
          appRuntime,
          { ...MANDELBROT_PARAMS, maxIterations },
          // コールバックを Comlink.proxy で包んだものを渡す
          proxy(onPartialRowData),
          proxy(onFinish),
          proxy(onCancel),
        );
        break;
      default:
        throw new Error(`unknown runtime: ${appRuntime}`);
    }
  }, [appRuntime, maxIterations, onFinish, onCancel]);

  const cancel = useCallback(() => {
    switch (appRuntime) {
      case AppRuntimeType.JS_MULTI:
      case AppRuntimeType.WASM_MULTI:
      case AppRuntimeType.JS_MULTI_CANCELLABLE:
      case AppRuntimeType.WASM_MULTI_CANCELLABLE:
        mandelbrotService.cancel();
        break;
      case AppRuntimeType.JS_WORKER:
      case AppRuntimeType.WASM_WORKER:
        comlinkWorkerRef.current?.cancel();
        comlinkWorkerRef.current?.[releaseProxy]();
        workerRef.current?.terminate();
        initWorker();
        break;
      case AppRuntimeType.WEBGPU_SINGLE:
        break;
      default:
        throw new Error(`unknown runtime: ${appRuntime}`);
    }
    setAppState(AppState.STOPPED);
  }, [appRuntime, initWorker]);

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

  const runtimeSelector = useCallback(items=>{
     return items.map((item, index) => {
      return (
        item != null ?
          <td key={index}
              style={{
                backgroundColor:
                  item === AppRuntimeType.WEBGPU_SINGLE &&
                  navigator.gpu === undefined
                    ? "lightgrey"
                    : item === AppRuntimeType.JS_SINGLE ||
                    item === AppRuntimeType.WASM_SINGLE ||
                    item === AppRuntimeType.JS_MULTI ||
                    item === AppRuntimeType.WASM_MULTI
                      ? "#eaa"
                      : "#aea",
              }}
          >
            <input
              defaultChecked={appRuntime === item}
              disabled={
                isRunning ||
                (item === AppRuntimeType.WEBGPU_SINGLE &&
                  navigator.gpu === undefined)
              }
              type="radio"
              name="runtime"
              id={`${item}`}
              value={item}
              onClick={() => setAppRuntime(item)}
            />
            <label
              htmlFor={`${item}`}
              style={{paddingRight: '4px'}}
            >
              {elapsedTimeMap[item] !== undefined ? elapsedTimeMap[item]!.toFixed(0)+" msec" : "----------"}
            </label>
          </td>
          :
          <td key={index}></td>
      );
    });
  }, [
    appRuntime,
    isRunning,
    elapsedTimeMap,
  ]);

  return (
    <div style={{ alignItems: "center", textAlign: "center" }}>
      <ReactGithubCorner href="https://github.com/kubohiroya/benchmark-webworker-wasm-webgpu"/>
      <DigitalClock />
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", padding: "5px" }}>
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
            [AppRuntimeType.JS_SINGLE,AppRuntimeType.JS_MULTI,AppRuntimeType.JS_MULTI_CANCELLABLE,AppRuntimeType.JS_WORKER],
            [ AppRuntimeType.WASM_SINGLE, AppRuntimeType.WASM_MULTI, AppRuntimeType.WASM_MULTI_CANCELLABLE, AppRuntimeType.WASM_WORKER],
          ].map((items, index) => {
            return (
              <tr
                key={index}
              >
                <th>{['JavaScript', 'Wasm'][index]}</th>
                {runtimeSelector(items)}
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
          {[
            [AppRuntimeType.WEBGPU_SINGLE]
          ].map((items, index) => {
            return (
              <tr
                key={index}
              >
                <th>{['WebGPU'][index]}</th>
                {runtimeSelector(items)}
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", justifyContent:'center', alignItems: "center", gap: "20px", padding: "5px" }}>
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
          style={{ marginLeft: '20px', fontSize: "22px" }}
        >
          START
        </button>
        <button onClick={cancel}>CANCEL</button>
        <button onClick={reset}>RESET</button>
        <div style={{ width:"25%", display: "flex", paddingLeft: '30px', gap: "20px" }}>
          <div style={{ alignSelf: 'center' }}>
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
