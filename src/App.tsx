import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { wrap, proxy, releaseProxy, ProxyMethods, Remote } from "comlink";
import { mandelbrotWorker, type MandelbrotWorker } from "./worker";
import DigitalClock from "./DigitalClock.tsx";
import { AppRuntimeType } from "./AppRuntimeType.ts";
import ReactGithubCorner from "react-github-corner";

// Mandelbrot パラメータ
const MANDELBROT_PARAMS = {
  width: 800,
  height: 800,
  maxIteration: 4096,
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
    MandelbrotWorker & ProxyMethods
  > | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [appRuntime, setAppRuntime] = useState<AppRuntimeType>(
    AppRuntimeType.JS_WHOLE,
  );
  const [maxIteration, setMaxIteration] = useState(
    MANDELBROT_PARAMS.maxIteration,
  );
  const [progress, setProgress] = useState(-1);
  const [elapsedTime, setElapsedTime] = useState(-1);
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
    console.log(
      `runtime=${appRuntime} maxIteration=${maxIteration} ${elapsedTime.toFixed(0)} msec`,
    );
  }, [appRuntime, maxIteration, elapsedTime]);

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
      if (workerIdRef.current !== workerId) {
        console.log("callback ignored");
        return;
      }
      setElapsedTime(performance.now() - startTime);
      setProgress(row);
      requestAnimationFrame(() => {
        // rowData は row1行分の RGBA (Uint8ClampedArray)
        // ImageDataに変換し、該当行に描画
        // y位置は row
        const imageData = new ImageData(rowData, MANDELBROT_PARAMS.width, 1);
        contextRef.current?.putImageData(imageData, 0, row);
      });
    }

    function onWholeData(workerId: number, image: Uint8ClampedArray): void {
      if (workerIdRef.current !== workerId) {
        console.log("callback ignored");
        return;
      }
      setElapsedTime(performance.now() - startTime);
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
      case AppRuntimeType.JS_WHOLE:
      case AppRuntimeType.WASM_WHOLE:
      case AppRuntimeType.WEBGPU_WHOLE: {
        mandelbrotWorker.generateWholeMandelbrot(
          workerIdRef.current,
          appRuntime,
          { ...MANDELBROT_PARAMS, maxIteration },
          onWholeData,
          onFinish,
        );
        break;
      }
      case AppRuntimeType.JS:
      case AppRuntimeType.WASM:
      case AppRuntimeType.JS_TIMEOUT:
      case AppRuntimeType.WASM_TIMEOUT: {
        mandelbrotWorker.generatePartialMandelbrot(
          workerIdRef.current,
          appRuntime,
          { ...MANDELBROT_PARAMS, maxIteration },
          // コールバックを Comlink.proxy で包まずに、そのまま渡す
          onPartialRowData,
          onFinish,
          onCancel,
        );
        break;
      }
      case AppRuntimeType.JS_WORKER:
      case AppRuntimeType.WASM_WORKER:
        comlinkWorkerRef.current?.generatePartialMandelbrot(
          workerIdRef.current,
          appRuntime,
          { ...MANDELBROT_PARAMS, maxIteration },
          // コールバックを Comlink.proxy で包んだものを渡す
          proxy(onPartialRowData),
          proxy(onFinish),
          proxy(onCancel),
        );
        break;
      default:
        throw new Error(`unknown runtime: ${appRuntime}`);
    }
  }, [appRuntime, maxIteration, onFinish, onCancel]);

  const cancel = useCallback(() => {
    switch (appRuntime) {
      case AppRuntimeType.JS:
      case AppRuntimeType.WASM:
      case AppRuntimeType.JS_TIMEOUT:
      case AppRuntimeType.WASM_TIMEOUT:
        mandelbrotWorker.cancel();
        break;
      case AppRuntimeType.JS_WORKER:
      case AppRuntimeType.WASM_WORKER:
        comlinkWorkerRef.current?.cancel();
        comlinkWorkerRef.current?.[releaseProxy]();
        workerRef.current?.terminate();
        initWorker();
        break;
      case AppRuntimeType.WEBGPU_WHOLE:
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
      <ReactGithubCorner href="https://github.com/kubohiroya/benchmark-webworker-wasm-webgpu"/>
      <DigitalClock />
      <div style={{ display: "flex", gap: "20px", padding: "5px" }}>
        {[
          [
            AppRuntimeType.JS_WHOLE,
            AppRuntimeType.WASM_WHOLE,
            AppRuntimeType.WEBGPU_WHOLE,
          ],
          [AppRuntimeType.JS, AppRuntimeType.WASM],
          [AppRuntimeType.JS_TIMEOUT, AppRuntimeType.WASM_TIMEOUT],
          [AppRuntimeType.JS_WORKER, AppRuntimeType.WASM_WORKER],
        ].map((items, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              {items.map((item, index) => {
                return (
                  <div key={index}>
                    <input
                      defaultChecked={appRuntime === item}
                      disabled={
                        isRunning ||
                        (item === AppRuntimeType.WEBGPU_WHOLE &&
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
                      style={{
                        color:
                          item === AppRuntimeType.WEBGPU_WHOLE &&
                          navigator.gpu === undefined
                            ? "lightgrey"
                            : item === AppRuntimeType.JS_WHOLE ||
                                item === AppRuntimeType.WASM_WHOLE ||
                                item === AppRuntimeType.JS ||
                                item === AppRuntimeType.WASM
                              ? "red"
                              : "black",
                      }}
                    >
                      {item}
                    </label>
                  </div>
                );
              })}
            </div>
          );
        })}
        <select
          disabled={isRunning}
          name="maxIteration"
          value={maxIteration}
          onChange={(e) => setMaxIteration(parseInt(e.currentTarget.value))}
        >
          {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => (
            <option key={n}>{Math.pow(2, n)}</option>
          ))}
        </select>
        <button
          disabled={isRunning}
          onClick={start}
          style={{ fontSize: "20px" }}
        >
          start
        </button>
        <button onClick={cancel}>cancel</button>
        <button onClick={reset}>reset</button>
        <div>
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
                fontSize: "30px",
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
