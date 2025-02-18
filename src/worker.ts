import * as wasm from "../build/benchmark-webworker-wasm-webgpu/assets";
import * as js from "./mandelbrot";
import { expose, transfer, finalizer } from "comlink";
import { AppRuntimeType } from "./AppRuntimeType.ts";
import { initWebGPU, generateMandelbrotGPU } from "./webgpu";

type MandelbrotProps = {
  width: number;
  height: number;
  maxIteration: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export type MandelbrotWorker = {
  generateWholeMandelbrot(
    workerId: number,
    runtime: AppRuntimeType,
    params: MandelbrotProps,
    onFullImage: (workerId: number, image: Uint8ClampedArray) => void,
    onFinish: () => void,
  ): void;

  generatePartialMandelbrot(
    workerId: number,
    runtime: AppRuntimeType,
    params: MandelbrotProps,
    onPartialRow: (
      workerId: number,
      row: number,
      rowData: Uint8ClampedArray,
    ) => void,
    onFinish: () => void,
    onCancel: () => void,
  ): void;
  hasCanceled: boolean;
  cancel(): void;
  [finalizer](): void;
};

/**
 * Worker 内で呼び出される関数を Comlink で公開する
 */
export const mandelbrotWorker: MandelbrotWorker = {
  /**
   * マンデルブロ計算を実行する
   * @param {number} workerId
   * @param {AppRuntimeType} runtime
   * @param {Object} params
   *   - width, height, maxIter, minX, maxX, minY, maxY, wasmUrl
   * @param {(image: Uint8ClampedArray) => void} onFullImage
   *  - 画像が完成したときに呼び出されるコールバック（メインスレッド側）
   * @param {() => void} onFinish
   *   - 計算が終了したときに呼び出されるコールバック（メインスレッド側）
   * @returns {Promise<void>}
   */
  async generateWholeMandelbrot(
    workerId: number,
    runtime: AppRuntimeType,
    params: {
      width: number;
      height: number;
      maxIteration: number;
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
    },
    onFullImage: (workerId: number, image: Uint8ClampedArray) => void,
    onFinish: () => void,
  ): Promise<void> {
    const { width, height, maxIteration, minX, maxX, minY, maxY } = params;
    this.hasCanceled = false;
    // 2) 画像バッファの初期化
    switch (runtime) {
      case AppRuntimeType.JS_WHOLE: {
        js.initCanvas(width, height);
        js.calculate(maxIteration, minX, maxX, minY, maxY);
        // ここではシンプルにコピーしたものを渡す。
        onFullImage(workerId, js.imageData);
        break;
      }
      case AppRuntimeType.WASM_WHOLE: {
        wasm.initCanvas(width, height);
        const ptr = wasm.calculate(maxIteration, minX, maxX, minY, maxY);
        // WASM 側から、画像全体をコピーした配列のビューを作成する
        const imageData = new Uint8ClampedArray(
          wasm.memory.buffer,
          ptr,
          width * height * 4,
        );
        // これは WASM 側のメモリを参照した配列のビューなので、所有権移転をせずにそのままを渡す。Workerの場合はコピー渡しになる。
        onFullImage(workerId, imageData);
        break;
      }
      case AppRuntimeType.WEBGPU_WHOLE: {
        await initWebGPU(width, height);
        const data = await generateMandelbrotGPU(
          maxIteration,
          minX,
          maxX,
          minY,
          maxY,
        );
        onFullImage(workerId, data);
        break;
      }
      default:
        throw new Error(`unknown runtime: ${runtime}`);
    }
    onFinish();
  },

  /**
   * マンデルブロ計算を行ごとに実行する
   * @param {number} workerId
   * @param {AppRuntimeType} runtime
   * @param {Object} params
   *   - width, height, maxIter, minX, maxX, minY, maxY, wasmUrl
   * @param {(row: number, rowData: Uint8ClampedArray) => void} onPartialRow
   *   - 行が計算されるたびに呼び出されるコールバック（メインスレッド側）
   * @param {() => void} onFinish
   *   - 計算が終了したときに呼び出されるコールバック（メインスレッド側）
   * @param {() => void} onCancel
   *   - 計算がキャンセルされたときに呼び出されるコールバック（メインスレッド側）
   * @returns {Promise<void>}
   */
  async generatePartialMandelbrot(
    workerId: number,
    runtime: AppRuntimeType,
    params: {
      width: number;
      height: number;
      maxIteration: number;
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
    },
    onPartialRow: (
      workerId: number,
      row: number,
      rowData: Uint8ClampedArray,
    ) => void,
    onFinish: () => void,
    onCancel: () => void,
  ): Promise<void> {
    const { width, height, maxIteration, minX, maxX, minY, maxY } = params;

    // JS 側メモリ参照
    const memory = wasm.memory;
    this.hasCanceled = false;

    // 2) 画像バッファの初期化
    switch (runtime) {
      case AppRuntimeType.JS:
      case AppRuntimeType.JS_TIMEOUT:
      case AppRuntimeType.JS_WORKER:
        js.initCanvas(width, height);
        break;
      case AppRuntimeType.WASM:
      case AppRuntimeType.WASM_TIMEOUT:
      case AppRuntimeType.WASM_WORKER:
        wasm.initCanvas(width, height);
        break;
      default:
        throw new Error(`unknown runtime: ${runtime}`);
    }

    // 3) 行ごとの計算
    const rowSize = width * 4; // RGBA * width
    for (let row = 0; row < height; row++) {
      switch (runtime) {
        case AppRuntimeType.JS_TIMEOUT:
        case AppRuntimeType.JS_WORKER:
        case AppRuntimeType.WASM_TIMEOUT:
        case AppRuntimeType.WASM_WORKER:
          if (this.hasCanceled) {
            // 実際には、this.hasCanceledの変更を検出できるのは、*_TIMEOUTの場合のみ
            onCancel();
            return;
          }
      }

      // 行を計算
      switch (runtime) {
        case AppRuntimeType.JS:
        case AppRuntimeType.JS_TIMEOUT:
        case AppRuntimeType.JS_WORKER: {
          js.calculateRow(row, maxIteration, minX, maxX, minY, maxY);
          // 一行分だけをコピーした配列を作成する
          const rowData = js.imageData.slice(
            row * rowSize,
            row * rowSize + rowSize,
          );
          if (runtime === AppRuntimeType.JS_WORKER) {
            // Workerの場合には、作成した配列の所有権を移転をしたほうが効率的なので、Comlinkの`transfer`を使う
            onPartialRow(workerId, row, transfer(rowData, [rowData.buffer]));
          } else {
            // ここではシンプルにコピーしたものを渡す。
            onPartialRow(workerId, row, rowData);
          }
          break;
        }
        case AppRuntimeType.WASM:
        case AppRuntimeType.WASM_TIMEOUT:
        case AppRuntimeType.WASM_WORKER: {
          const rowPtr = wasm.calculateRow(
            row,
            maxIteration,
            minX,
            maxX,
            minY,
            maxY,
          );
          // WASM 側から、一行分だけをコピーした配列のビューを作成する
          const rowData = new Uint8ClampedArray(memory.buffer, rowPtr, rowSize);
          // これは WASM 側のメモリを参照した配列のビューなので、所有権移転をせずにそのままを渡す。Workerの場合はコピー渡しになる。
          onPartialRow(workerId, row, rowData);
          break;
        }
        default:
          throw new Error(`unknown runtime: ${runtime}`);
      }

      // *_TIMEOUTでは、UI ブロックを避けるために、setTimeout を入れる。
      switch (runtime) {
        case AppRuntimeType.JS_TIMEOUT:
        case AppRuntimeType.WASM_TIMEOUT:
          await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    onFinish();
  },

  hasCanceled: false, // *_TIMEOUTの場合のみ使用

  cancel() {
    // *_TIMEOUTの場合のみ使用
    console.log("cancel");
    this.hasCanceled = true;
  },

  // Comlinkのfinalizerは期待通り動作せず、この関数は呼び出してもらえない
  [finalizer]() {
    console.log("finalizer");
    this.cancel();
  },
};

// Comlink で公開
expose(mandelbrotWorker);
