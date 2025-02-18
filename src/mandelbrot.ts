// mandelbrot.ts

let imageWidth: number = 0;
let imageHeight: number = 0;
export let imageData: Uint8ClampedArray = new Uint8ClampedArray(0);

/**
 * 画像データを初期化する
 */
export function initCanvas(width: number, height: number): void {
  imageWidth = width;
  imageHeight = height;
  imageData = new Uint8ClampedArray(width * height * 4);
}

/**
 * マンデルブロ集合を計算する。
 * - (row, maxIter) はマンデルブロ計算パラメータ
 * - (minX, maxX, minY, maxY) は可視領域（複素平面上の範囲）
 */
export function calculate(
  maxIterations: number,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
) {
  for (let row = 0; row < imageWidth; row++) {
    calculateRow(row, maxIterations, minX, maxX, minY, maxY);
  }
}

/**
 * マンデルブロ集合の一行 (row) を計算する。
 *
 * - (row, maxIter) はマンデルブロ計算パラメータ
 * - (minX, maxX, minY, maxY) は可視領域（複素平面上の範囲）
 */
export function calculateRow(
  row: number,
  maxIterations: number,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
): void {
  if (imageData.length === 0) {
    return;
  }

  // row (縦方向) に対応する座標 (imag軸)
  const cy = minY + ((maxY - minY) * row) / imageHeight;

  for (let col = 0; col < imageWidth; col++) {
    // col (横方向) に対応する座標 (real軸)
    const cx = minX + ((maxX - minX) * col) / imageWidth;

    let x = 0.0;
    let y = 0.0;
    let iteration = 0;

    while (x * x + y * y <= 4.0 && iteration < maxIterations) {
      const _x = x * x - y * y + cx;
      y = 2.0 * x * y + cy;
      x = _x;
      iteration++;
    }

    // RGBA のインデックス (1ピクセル4バイト)
    const index = (row * imageWidth + col) << 2;

    if (iteration == maxIterations) {
      // 集合内：黒
      imageData[index] = 0; // R
      imageData[index + 1] = 0; // G
      imageData[index + 2] = 0; // B
      imageData[index + 3] = 255; // A
    } else {
      // 集合外：iterationに応じた簡易グラデーション（赤系）
      const color = (iteration * 12) % 256;
      imageData[index] = color; // R
      imageData[index + 1] = color >> 1; // G (少し暗め)
      imageData[index + 2] = color >> 2; // B (さらに暗め)
      imageData[index + 3] = 255; // A
    }
  }
}
