import { AppTypeNames } from "./AppTypeNames";

export enum RuntimeType {
  JavaScript = 0,
  Wasm = 1,
  WebGPU = 2,
}

export enum PassType {
  Single = 0,
  Multi = 1,
}

export enum CancellableType {
  NonCancellable = 0,
  Cancellable = 1,
}

export enum ThreadType {
  Main = 0,
  Worker = 1,
}

export type AppType = {
  runtimeType: RuntimeType,
  passType: PassType,
  cancellableType: CancellableType,
  threadType: ThreadType,
}

export const AppTypes: Record<AppTypeNames, AppType> = {
  [AppTypeNames.JS_SINGLE]: {
    runtimeType: RuntimeType.JavaScript,
    passType: PassType.Single,
    cancellableType: CancellableType.NonCancellable,
    threadType: ThreadType.Main,
  },
  [AppTypeNames.WASM_SINGLE]: {
    runtimeType: RuntimeType.Wasm,
    passType: PassType.Single,
    cancellableType: CancellableType.NonCancellable,
    threadType: ThreadType.Main,
  },
  [AppTypeNames.WEBGPU_SINGLE]: {
    runtimeType: RuntimeType.WebGPU,
    passType: PassType.Single,
    cancellableType: CancellableType.NonCancellable,
    threadType: ThreadType.Main,
  },
  [AppTypeNames.JS_MULTI]: {
    runtimeType: RuntimeType.JavaScript,
    passType: PassType.Multi,
    cancellableType: CancellableType.NonCancellable,
    threadType: ThreadType.Main,
  },
  [AppTypeNames.WASM_MULTI]: {
    runtimeType: RuntimeType.Wasm,
    passType: PassType.Multi,
    cancellableType: CancellableType.NonCancellable,
    threadType: ThreadType.Main,
  },
  [AppTypeNames.JS_MULTI_CANCELLABLE]: {
    runtimeType: RuntimeType.JavaScript,
    passType: PassType.Multi,
    cancellableType: CancellableType.Cancellable,
    threadType: ThreadType.Main,
  },
  [AppTypeNames.WASM_MULTI_CANCELLABLE]: {
    runtimeType: RuntimeType.Wasm,
    passType: PassType.Multi,
    cancellableType: CancellableType.Cancellable,
    threadType: ThreadType.Main,
  },
  [AppTypeNames.JS_WORKER]: {
    runtimeType: RuntimeType.JavaScript,
    passType: PassType.Multi,
    cancellableType: CancellableType.Cancellable,
    threadType: ThreadType.Worker,
  },
  [AppTypeNames.WASM_WORKER]: {
    runtimeType: RuntimeType.Wasm,
    passType: PassType.Multi,
    cancellableType: CancellableType.Cancellable,
    threadType: ThreadType.Worker,
  },
}
