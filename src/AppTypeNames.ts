export enum AppTypeNames {
  JS_SINGLE = "JavaScript (Single-pass)",
  WASM_SINGLE = "Wasm (Single-pass)",
  WEBGPU_SINGLE = "WebGPU",
  JS_MULTI = "JavaScript (Line-by-line)",
  WASM_MULTI = "Wasm (Line-by-line)",
  JS_MULTI_CANCELLABLE = "JavaScript (Line-by-line, Cancellable)",
  WASM_MULTI_CANCELLABLE = "Wasm (Line-by-line, Cancellable)",
  JS_WORKER = "JavaScript (Line-by-line, Worker+Cancellable)",
  WASM_WORKER = "Wasm (Line-by-line, Worker+Cancellable)",
}
