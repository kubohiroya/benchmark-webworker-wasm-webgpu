import code from "./mandelbrot.wgsl?raw";

let device: GPUDevice;
let context: GPUCanvasContext;
let pipeline: GPUComputePipeline;
let params: ArrayBuffer;
let uniformBuffer: GPUBuffer;
let bindGroup: GPUBindGroup;
let outputBuffer: GPUBuffer;
let outputBufferSize: number;
let readBuffer: GPUBuffer;
let canvasWidth: number;
let canvasHeight: number;

export async function initWebGPU(width: number, height: number) {
  if (navigator.gpu === undefined) {
    console.error("WebGPU is not supported");
    return;
  }
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error("Failed to get GPU adapter");
  }

  device = await adapter.requestDevice();

  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = width;
  canvas.height = height;
  canvasWidth = width;
  canvasHeight = height;

  context = canvas.getContext("webgpu") as GPUCanvasContext;
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device: device,
    format: format,
    alphaMode: "opaque",
  });

  const shaderModule = device.createShaderModule({
    code,
  });

  pipeline = device.createComputePipeline({
    layout: "auto",
    compute: {
      module: shaderModule,
      entryPoint: "main",
    },
  });

  params = new ArrayBuffer(7 * 4);

  uniformBuffer = device.createBuffer({
    size: params.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  outputBufferSize = width * height * 4;
  outputBuffer = device.createBuffer({
    size: outputBufferSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });
  // 新しいバッファを作成してコピー先に指定
  readBuffer = device.createBuffer({
    size: outputBufferSize,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  bindGroup = device.createBindGroup({
    label: "bindGroup",
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniformBuffer } },
      { binding: 1, resource: { buffer: outputBuffer } },
    ],
  });
}

export async function generateMandelbrotGPU(
  maxIterations: number,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
): Promise<Uint8ClampedArray> {
  const u32View = new Uint32Array(params);
  const f32View = new Float32Array(params);
  u32View.set([canvasWidth, canvasHeight, maxIterations], 0);
  f32View.set([minX, maxX, minY, maxY], 3);
  device.queue.writeBuffer(uniformBuffer, 0, params);

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.dispatchWorkgroups(
    Math.ceil(canvasWidth / 8),
    Math.ceil(canvasHeight / 8),
    1,
  );
  passEncoder.end();

  commandEncoder.copyBufferToBuffer(
    outputBuffer,
    0,
    readBuffer,
    0,
    outputBufferSize,
  );
  const commands = commandEncoder.finish();
  device.queue.submit([commands]);

  await device.queue.onSubmittedWorkDone();
  await readBuffer.mapAsync(GPUMapMode.READ);
  const data = new Uint8ClampedArray(readBuffer.getMappedRange().slice(0, outputBufferSize));
  readBuffer.unmap();
  return data;
}
