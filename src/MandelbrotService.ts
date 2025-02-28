import * as wasm from "../build/benchmark-webworker-wasm-webgpu/assets";
import * as js from "./mandelbrot";
import { finalizer, transfer } from "comlink";
import {
  AppType,
  CancellableType,
  PassType,
  RuntimeType,
  ThreadType,
} from "./AppType";
import { generateMandelbrotGPU, initWebGPU } from "./webgpu";

type GenerateMandelbrotParams = {
  width: number;
  height: number;
  maxIterations: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

async function singlePassMandelbrot({
  workerId,
  appType,
  startTime,
  params,
  onFullImage,
}: {
  workerId: number;
  appType: AppType;
  startTime: number,
  params: GenerateMandelbrotParams;
  onFullImage: (workerId: number, startTime: number, image: Uint8ClampedArray) => void;
}) {
  const { width, height, maxIterations, minX, maxX, minY, maxY } = params;
  switch (appType.runtimeType) {
    case RuntimeType.JavaScript: {
      js.initCanvas(width, height); // (1)
      js.calculate(maxIterations, minX, maxX, minY, maxY); // (2)
      onFullImage(workerId, startTime, js.imageData); // (3)
      break;
    }
    case RuntimeType.Wasm: {
      wasm.initCanvas(width, height); // (1)
      const ptr = wasm.calculate(maxIterations, minX, maxX, minY, maxY); // (2)
      // WASM 側のメモリを参照する配列のビューを作成する
      const imageData = new Uint8ClampedArray( // (3)
        wasm.memory.buffer,
        ptr,
        width * height * 4,
      );
      // 配列のビューを渡す。Workerからのコールバックで配列の所有権移転をしない場合はコピー渡しになる。
      onFullImage(workerId, startTime, imageData);
      break;
    }
    case RuntimeType.WebGPU: {
      await initWebGPU(width, height);
      const data = await generateMandelbrotGPU(
        maxIterations,
        minX,
        maxX,
        minY,
        maxY,
      );
      onFullImage(workerId, startTime, data);
      break;
    }
    default:
      throw new Error(`unknown runtime: ${appType}`);
  }
}

async function lineByLineMandelbrot({
  workerId,
  appType,
  startTime,
  params,
  onRowImage,
  hasCancelled,
  onCancel,
}: {
  workerId: number;
  appType: AppType;
  startTime: number,
  params: GenerateMandelbrotParams;
  onRowImage: (
    workerId: number,
    startTime: number,
    rowIndex: number,
    image: Uint8ClampedArray,
  ) => void;
  hasCancelled: () => boolean;
  onCancel: () => void;
}): Promise<void> {
  const { width, height, maxIterations, minX, maxX, minY, maxY } = params;
  // (1)画像バッファの初期化→ (2)行ごと繰り返し・キャンセルチェック・マンデルブロ計算・行ごとのコールバック (3) 完成コールバック
  switch (appType.runtimeType) {
    case RuntimeType.JavaScript:
      js.initCanvas(width, height); // (1)
      break;
    case RuntimeType.Wasm:
      wasm.initCanvas(width, height); // (1)
      break;
    default:
      throw new Error(`unknown runtime: ${appType}`);
  }

  const rowSize = width * 4; // RGBA * width
  // (2) 行ごとの繰り返し
  for (let rowIndex = 0; rowIndex < height; rowIndex++) {
    switch (appType.cancellableType) {
      case CancellableType.Cancellable: {
        if (hasCancelled()) {
          // キャンセルチェック
          onCancel();
          return;
        }
        break;
      }
    }

    const rowData = ((appType: AppType): Uint8ClampedArray => {
      switch (appType.runtimeType) {
        case RuntimeType.JavaScript: {
          // JavaScriptで計算する
          js.calculateRow(rowIndex, maxIterations, minX, maxX, minY, maxY);
          // JavaScriptの計算結果の中から、一行分だけを「コピー」した配列を作成する
          return js.imageData.slice(
            rowIndex * rowSize,
            rowIndex * rowSize + rowSize,
          );
        }
        case RuntimeType.Wasm: {
          // Wasmで計算する
          const rowPtr = wasm.calculateRow(
            rowIndex,
            maxIterations,
            minX,
            maxX,
            minY,
            maxY,
          );
          // Wasmの計算結果の中から、一行分だけを「参照」する形で、WASM 側のメモリを参照する配列のビューを作成し、これをコピーする
          return new Uint8ClampedArray(
            wasm.memory.buffer,
            rowPtr,
            rowSize,
          ).slice();
        }
        default:
          throw new Error(`unknown runtime: ${appType}`);
      }
    })(appType);

    switch (
      appType.threadType //一行分の計算完了をコールバックする
    ) {
      case ThreadType.Main: {
        // メインスレッドで動作中の場合は、一行分の配列データ自体を返す。
        onRowImage(workerId, startTime, rowIndex, rowData);
        break;
      }
      case ThreadType.Worker: {
        // ワーカースレッドで動作中の場合は、一行分の配列データ自体を返すのではなく、
        // Comlinkの`transfer`を使い、作成した配列の所有権をメインスレッドに移転することで効率化する。
        onRowImage(workerId, startTime, rowIndex, transfer(rowData, [rowData.buffer]));
        break;
      }
      default:
        throw new Error(`unknown thread type: ${appType}`);
    }

    if (
      appType.cancellableType == CancellableType.Cancellable &&
      appType.threadType != ThreadType.Worker
    ) {
      // UI ブロックを避けるために、setTimeout を入れる。Workerでは不要。
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
}

export class MandelbrotService {

  hasCanceled: boolean = false;

  /**
   * マンデルブロ計算を行ごとに実行する
   * @param {number} workerId
   * @param {number} startTime
   * @param {AppType} appType
   * @param {Object} params
   *   - width, height, maxIter, minX, maxX, minY, maxY, wasmUrl
   * @param {(workerId: number, row: number, rowData: Uint8ClampedArray) => void} onRowImage
   *   - 行が計算されるたびに呼び出されるコールバック（メインスレッド側）
   * @param {(workerId: number, image: Uint8ClampedArray) => void} onFullImage
   *   - 全体の計算が完了すると呼び出されるコールバック（メインスレッド側）
   * @param {() => void} onFinish
   *   - 計算が終了したときに呼び出されるコールバック（メインスレッド側）
   * @param {() => void} onCancel
   *   - 計算がキャンセルされたときに呼び出されるコールバック（メインスレッド側）
   * @returns {Promise<void>}
   */
  async generateMandelbrot(
    workerId: number,
    startTime: number,
    appType: AppType,
    params: GenerateMandelbrotParams,
    onFinish: () => void,
    onCancel: () => void,
    onFullImage: (workerId: number,
                   startTime: number, image: Uint8ClampedArray) => void,
    onRowImage: (
      workerId: number,
      startTime: number,
      rowIndex: number,
      rowData: Uint8ClampedArray,
    ) => void,
  ): Promise<void> {
    switch (appType.passType) {
      case PassType.Single: {
        singlePassMandelbrot({
          workerId,
          appType,
          startTime,
          params,
          onFullImage,
        });
        break;
      }
      case PassType.Multi: {
        this.hasCanceled = false;
        lineByLineMandelbrot({
          workerId,
          appType,
          startTime,
          params,
          onRowImage,
          onCancel,
          hasCancelled: () => this.hasCanceled,
        });
        break;
      }
      default:
        throw new Error(`unknown pass type: ${appType}`);
    }
    onFinish();
  }

  cancel() {
    // TIMEOUTの場合のみ使用
    console.log("cancel");
    this.hasCanceled = true;
  }

  [finalizer]() {
    console.log("finalizer");
    this.cancel();
  }
};
