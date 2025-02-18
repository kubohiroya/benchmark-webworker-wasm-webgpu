import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import assemblyScriptPlugin from "vite-plugin-assemblyscript-asc";
import { comlink } from "vite-plugin-comlink";
import ViteRestart from "vite-plugin-restart";

const projectName = "benchmark-webworker-wasm-webgpu";

export default defineConfig({
  base: `/${projectName}/`,

  plugins: [
    react(),
    assemblyScriptPlugin({
      projectRoot: ".",
      configFile: "asconfig.json",
      srcMatch: "src/as/assembly",
      srcEntryFile: "src/as/assembly/index.ts",
      targetWasmFile: `./build/${projectName}/assets/index.wasm`,
      distFolder: "dist",
    }),
    comlink(),
    ViteRestart({}),
  ],

  worker: {
    rollupOptions: {
      output: {
        format: "es",
      },
    },
    format: "es",
    plugins: () => [comlink()],
  },

  build: {
    target: "esnext",
    outDir: `./dist/${projectName}`,
    emitAssets: true,
    rollupOptions: {
      external: [],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
      input: {
        main: "index.html",
      },
    },
  },
});
