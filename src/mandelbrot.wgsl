struct Uniforms {
    screenWidth  : u32,    // 画面幅
    screenHeight : u32,    // 画面高さ
    maxIterations: u32,    // マンデルブロの最大反復回数

    // 描画範囲を指定 (最小 X, 最小 Y, 最大 X, 最大 Y)
    minX : f32,
    maxX : f32,
    minY : f32,
    maxY : f32,
};

@group(0) @binding(0) var<uniform> uniforms : Uniforms;

// マンデルブロ計算結果を直接書き込むためのテクスチャ (rgba8unorm)
@group(0) @binding(1) var<storage,read_write> output: array<u32>;

// ワークグループを (16,16) と仮定
@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) globalId : vec3<u32>) {
    let x = globalId.x;
    let y = globalId.y;

    // 画面外のスレッドはスキップ
    if (x >= uniforms.screenWidth || y >= uniforms.screenHeight) {
        return;
    }

    // (x, y) を [minX, maxX], [minY, maxY] に射影
    let fx = uniforms.minX + (f32(x) / f32(uniforms.screenWidth))
                          * (uniforms.maxX - uniforms.minX);

    let fy = uniforms.minY + (f32(y) / f32(uniforms.screenHeight))
                          * (uniforms.maxY - uniforms.minY);

    // マンデルブロ計算 (z0 = 0 + 0i)
    var zx = 0.0;
    var zy = 0.0;
    var iteration = 0u;
    while ((zx * zx + zy * zy) < 4.0 && iteration < uniforms.maxIterations) {
        let tmp = zx * zx - zy * zy + fx;
        zy = 2.0 * zx * zy + fy;
        zx = tmp;
        iteration = iteration + 1u;
    }

// RGBA の各チャンネルを 0..255 に変換
    var r : u32 = 0;
    var g : u32 = 0;
    var b : u32 = 0;
    var a : u32 = 255; // 不透明

    if (iteration == uniforms.maxIterations) {
        // 発散しきらず: 黒
        r = 0;
        g = 0;
        b = 0;
    } else {
        // 発散した場合: iteration に応じた簡易的なグラデーション例
        let t = f32((iteration * 12) % 256);
        r = u32(0);
        g = u32(t);
        b = u32(t);
    }

    // 1ピクセル分を 32bit (u32) にパック (リトルエンディアンで RGBA の順に並ぶ)
    //   メモリ中ではバイト列 [R, G, B, A] となる
    let rgba = (r & 0xFFu)
             | ((g & 0xFFu) << 8)
             | ((b & 0xFFu) << 16)
             | ((a & 0xFFu) << 24);

    // output バッファに書き込み
    output[y * uniforms.screenWidth + x] = rgba;
}