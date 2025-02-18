// mandelbrot.ts

let imageWidth: u32 = 0;
let imageHeight: u32 = 0;
let imageData: StaticArray<u8> = new StaticArray<u8>(0);

/**
 * 画像データを初期化する
 */
export function initCanvas(width: u32, height: u32): void {
  imageWidth = width;
  imageHeight = height;
  imageData = new StaticArray<u8>(width * height * 4);
}

/**
 * マンデルブロ集合のを計算する。
 * - maxIteration はマンデルブロ計算パラメータ
 * - (minX, maxX, minY, maxY) は可視領域（複素平面上の範囲）
 * @return {u32} 行の先頭アドレス
 */
export function calculate(
  maxIterations: u32,
  minX: f64,
  maxX: f64,
  minY: f64,
  maxY: f64,
): u32 {
  for (let row: u32 = 0; row < imageWidth; row++) {
    calculateRow(row, maxIterations, minX, maxX, minY, maxY);
  }
  return changetype<u32>(imageData);
}

/**
 * マンデルブロ集合の一行 (row) を計算する。
 * - row, maxIteration はマンデルブロ計算パラメータ
 * - (minX, maxX, minY, maxY) は可視領域（複素平面上の範囲）
 * @return {u32} 行の先頭アドレス
 */
export function calculateRow(
  row: u32,
  maxIteration: u32,
  minX: f64,
  maxX: f64,
  minY: f64,
  maxY: f64,
): u32 {
  if (imageData.length === 0) {
    return 0;
  }

  // row (縦方向) に対応する座標 (imag軸)
  const cy = minY + ((maxY - minY) * row) / imageHeight;

  for (let col: u32 = 0; col < imageWidth; col++) {
    // col (横方向) に対応する座標 (real軸)
    const cx = minX + ((maxX - minX) * col) / imageWidth;

    let x = 0.0;
    let y = 0.0;
    let iteration: u32 = 0;

    while (x * x + y * y <= 4.0 && iteration < maxIteration) {
      const _x = x * x - y * y + cx;
      y = 2.0 * x * y + cy;
      x = _x;
      iteration++;
    }

    // RGBA のインデックス (1ピクセル4バイト)
    const index = (row * imageWidth + col) << 2;

    if (iteration == maxIteration) {
      // 集合内：黒
      unchecked((imageData[index] = 0)); // R
      unchecked((imageData[index + 1] = 0)); // G
      unchecked((imageData[index + 2] = 0)); // B
      unchecked((imageData[index + 3] = 255)); // A
    } else {
      // 集合外：iterationに応じた簡易グラデーション（緑系）
      const color: u32 = (iteration * 12) % 256;
      unchecked((imageData[index] = (color >> 2) as u8)); // R (少し暗め)
      unchecked((imageData[index + 1] = color as u8)); // G
      unchecked((imageData[index + 2] = (color >> 1) as u8)); // B (さらに暗め)
      unchecked((imageData[index + 3] = 255 as u8)); // A
    }
  }

  const offset = row * imageWidth * 4;
  return changetype<u32>(imageData) + offset;
}

/**
 * 画像データ (RGBA配列) の先頭アドレスを返す。
 */
export function getImageDataPointer(): u32 {
  return changetype<u32>(imageData);
}
