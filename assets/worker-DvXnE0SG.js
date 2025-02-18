async function ne(e,n={}){const t={env:Object.assign(Object.create(globalThis),n.env||{},{abort(A,s,r,a){A=f(A>>>0),s=f(s>>>0),r=r>>>0,a=a>>>0,(()=>{throw Error(`${A} in ${s}:${r}:${a}`)})()}})},{exports:c}=await WebAssembly.instantiate(e,t),o=c.memory||n.env.memory,i=Object.setPrototypeOf({calculate(A,s,r,a,l){return c.calculate(A,s,r,a,l)>>>0},calculateRow(A,s,r,a,l,u){return c.calculateRow(A,s,r,a,l,u)>>>0},getImageDataPointer(){return c.getImageDataPointer()>>>0}},c);function f(A){if(!A)return null;const s=A+new Uint32Array(o.buffer)[A-4>>>2]>>>1,r=new Uint16Array(o.buffer);let a=A>>>1,l="";for(;s-a>1024;)l+=String.fromCharCode(...r.subarray(a,a+=1024));return l+String.fromCharCode(...r.subarray(a,s))}return i}const{memory:F,__new:he,__pin:Ce,__unpin:Ie,__collect:pe,__rtti_base:Se,initCanvas:T,calculate:te,calculateRow:re,getImageDataPointer:Me}=await(async e=>ne(await(async()=>typeof process<"u"&&process.versions!=null&&(process.versions.node!=null||process.versions.bun!=null)?globalThis.WebAssembly.compile(await(await Promise.resolve().then(function(){return Qe})).readFile(e)):await globalThis.WebAssembly.compileStreaming(globalThis.fetch(e)))(),{}))(new URL("data:application/wasm;base64,AGFzbQEAAAABNglgAX8Bf2AAAGAEf39/fwBgAn9/AX9gAn9/AGAGf398fHx8AX9gBX98fHx8AX9gAAF/YAF/AAINAQNlbnYFYWJvcnQAAgMLCgMABAUGBwAIAQEFAwEAAQYbBX8BQQALfwFBAAt/AUEAC38BQQALfwBBgAoLB3wKCmluaXRDYW52YXMAAwljYWxjdWxhdGUABQxjYWxjdWxhdGVSb3cABBNnZXRJbWFnZURhdGFQb2ludGVyAAYFX19uZXcAAQVfX3BpbgAHB19fdW5waW4ACAlfX2NvbGxlY3QACQtfX3J0dGlfYmFzZQMEBm1lbW9yeQIACAEKDAEJCpwFCsoBAQZ/IABB7P///wNLBEBBkAlB0AlB1gBBHhAAAAsgAEEQaiIEQfz///8DSwRAQZAJQdAJQSFBHRAAAAsjAiEDIwJBBGoiAiAEQRNqQXBxQQRrIgRqIgU/ACIGQRB0QQ9qQXBxIgdLBEAgBiAFIAdrQf//A2pBgIB8cUEQdiIHIAYgB0obQABBAEgEQCAHQABBAEgEQAALCwsgBSQCIAMgBDYCACACQQRrIgNBADYCBCADQQA2AgggAyABNgIMIAMgADYCECACQRBqCy4BAX8gAEH8////A0sEQEGgCEHQCEEzQTwQAAALIABBBBABIgFBACAA/AsAIAELFgAgACQAIAEkASAAIAFsQQJ0EAIkAwu9AgIDfwN8IwNBFGsoAhBFBEBBAA8LIAQgBSAEoSAAuKIjAbijoCEKA0AgCCMASQRAIAIgAyACoSAIuKIjALijoCELRAAAAAAAAAAAIQREAAAAAAAAAAAhCUEAIQYDQCABIAZLBH8gBCAEoiAJIAmioEQAAAAAAAAQQGUFQQALBEAgBCAEoiAJIAmioSALoCEFIAQgBKAgCaIgCqAhCSAFIQQgBkEBaiEGDAELCyAAIwBsIAhqQQJ0IQcgASAGRgRAIwMgB2pBADoAACMDIAdBAWpqQQA6AAAjAyAHQQJqakEAOgAABSMDIAdqIAZBDGxB/wFxIgZBAnY6AAAjAyAHQQFqaiAGOgAAIwMgB0ECamogBkEBdjoAAAsjAyAHQQNqakH/AToAACAIQQFqIQgMAQsLIwMgACMAbEECdGoLKQEBfwNAIAUjAEkEQCAFIAAgASACIAMgBBAEGiAFQQFqIQUMAQsLIwMLBAAjAwsEACAACwMAAQsDAAELDQBBnAokAkEAEAIkAwsL9AEJAEGMCAsBLABBmAgLIwIAAAAcAAAASQBuAHYAYQBsAGkAZAAgAGwAZQBuAGcAdABoAEG8CAsBPABByAgLLQIAAAAmAAAAfgBsAGkAYgAvAHMAdABhAHQAaQBjAGEAcgByAGEAeQAuAHQAcwBB/AgLATwAQYgJCy8CAAAAKAAAAEEAbABsAG8AYwBhAHQAaQBvAG4AIAB0AG8AbwAgAGwAYQByAGcAZQBBvAkLATwAQcgJCyUCAAAAHgAAAH4AbABpAGIALwByAHQALwBzAHQAdQBiAC4AdABzAEGACgsVBQAAACAAAAAgAAAAIAAAAAAAAABk",import.meta.url));let h=0,D=0,d=new Uint8ClampedArray(0);function H(e,n){h=e,D=n,d=new Uint8ClampedArray(e*n*4)}function ae(e,n,t,c,o){for(let i=0;i<h;i++)J(i,e,n,t,c,o)}function J(e,n,t,c,o,i){if(d.length===0)return;const f=o+(i-o)*e/D;for(let A=0;A<h;A++){const s=t+(c-t)*A/h;let r=0,a=0,l=0;for(;r*r+a*a<=4&&l<n;){const B=r*r-a*a+s;a=2*r*a+f,r=B,l++}const u=e*h+A<<2;if(l==n)d[u]=0,d[u+1]=0,d[u+2]=0,d[u+3]=255;else{const B=l*12%256;d[u]=B,d[u+1]=B>>1,d[u+2]=B>>2,d[u+3]=255}}}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const X=Symbol("Comlink.proxy"),Ae=Symbol("Comlink.endpoint"),se=Symbol("Comlink.releaseProxy"),S=Symbol("Comlink.finalizer"),M=Symbol("Comlink.thrown"),j=e=>typeof e=="object"&&e!==null||typeof e=="function",oe={canHandle:e=>j(e)&&e[X],serialize(e){const{port1:n,port2:t}=new MessageChannel;return v(e,n),[t,[t]]},deserialize(e){return e.start(),le(e)}},ie={canHandle:e=>j(e)&&M in e,serialize({value:e}){let n;return e instanceof Error?n={isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:n={isError:!1,value:e},[n,[]]},deserialize(e){throw e.isError?Object.assign(new Error(e.value.message),e.value):e.value}},q=new Map([["proxy",oe],["throw",ie]]);function ce(e,n){for(const t of e)if(n===t||t==="*"||t instanceof RegExp&&t.test(n))return!0;return!1}function v(e,n=globalThis,t=["*"]){n.addEventListener("message",function c(o){if(!o||!o.data)return;if(!ce(t,o.origin)){console.warn(`Invalid origin '${o.origin}' for comlink proxy`);return}const{id:i,type:f,path:A}=Object.assign({path:[]},o.data),s=(o.data.argumentList||[]).map(y);let r;try{const a=A.slice(0,-1).reduce((u,B)=>u[B],e),l=A.reduce((u,B)=>u[B],e);switch(f){case"GET":r=l;break;case"SET":a[A.slice(-1)[0]]=y(o.data.value),r=!0;break;case"APPLY":r=l.apply(a,s);break;case"CONSTRUCT":{const u=new l(...s);r=de(u)}break;case"ENDPOINT":{const{port1:u,port2:B}=new MessageChannel;v(e,B),r=Z(u,[u])}break;case"RELEASE":r=void 0;break;default:return}}catch(a){r={value:a,[M]:0}}Promise.resolve(r).catch(a=>({value:a,[M]:0})).then(a=>{const[l,u]=_(a);n.postMessage(Object.assign(Object.assign({},l),{id:i}),u),f==="RELEASE"&&(n.removeEventListener("message",c),N(n),S in e&&typeof e[S]=="function"&&e[S]())}).catch(a=>{const[l,u]=_({value:new TypeError("Unserializable return value"),[M]:0});n.postMessage(Object.assign(Object.assign({},l),{id:i}),u)})}),n.start&&n.start()}function ue(e){return e.constructor.name==="MessagePort"}function N(e){ue(e)&&e.close()}function le(e,n){const t=new Map;return e.addEventListener("message",function(o){const{data:i}=o;if(!i||!i.id)return;const f=t.get(i.id);if(f)try{f(i)}finally{t.delete(i.id)}}),U(e,t,[],n)}function p(e){if(e)throw new Error("Proxy has been released and is not useable")}function K(e){return b(e,new Map,{type:"RELEASE"}).then(()=>{N(e)})}const W=new WeakMap,G="FinalizationRegistry"in globalThis&&new FinalizationRegistry(e=>{const n=(W.get(e)||0)-1;W.set(e,n),n===0&&K(e)});function fe(e,n){const t=(W.get(n)||0)+1;W.set(n,t),G&&G.register(e,n,e)}function ge(e){G&&G.unregister(e)}function U(e,n,t=[],c=function(){}){let o=!1;const i=new Proxy(c,{get(f,A){if(p(o),A===se)return()=>{ge(i),K(e),n.clear(),o=!0};if(A==="then"){if(t.length===0)return{then:()=>i};const s=b(e,n,{type:"GET",path:t.map(r=>r.toString())}).then(y);return s.then.bind(s)}return U(e,n,[...t,A])},set(f,A,s){p(o);const[r,a]=_(s);return b(e,n,{type:"SET",path:[...t,A].map(l=>l.toString()),value:r},a).then(y)},apply(f,A,s){p(o);const r=t[t.length-1];if(r===Ae)return b(e,n,{type:"ENDPOINT"}).then(y);if(r==="bind")return U(e,n,t.slice(0,-1));const[a,l]=z(s);return b(e,n,{type:"APPLY",path:t.map(u=>u.toString()),argumentList:a},l).then(y)},construct(f,A){p(o);const[s,r]=z(A);return b(e,n,{type:"CONSTRUCT",path:t.map(a=>a.toString()),argumentList:s},r).then(y)}});return fe(i,e),i}function Be(e){return Array.prototype.concat.apply([],e)}function z(e){const n=e.map(_);return[n.map(t=>t[0]),Be(n.map(t=>t[1]))]}const V=new WeakMap;function Z(e,n){return V.set(e,n),e}function de(e){return Object.assign(e,{[X]:!0})}function _(e){for(const[n,t]of q)if(t.canHandle(e)){const[c,o]=t.serialize(e);return[{type:"HANDLER",name:n,value:c},o]}return[{type:"RAW",value:e},V.get(e)||[]]}function y(e){switch(e.type){case"HANDLER":return q.get(e.name).deserialize(e.value);case"RAW":return e.value}}function b(e,n,t,c){return new Promise(o=>{const i=me();n.set(i,o),e.start&&e.start(),e.postMessage(Object.assign({id:i},t),c)})}function me(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}var g=(e=>(e.JS="JavaScript",e.WASM="Wasm",e.JS_TIMEOUT="JavaScript-Timeout",e.WASM_TIMEOUT="Wasm-Timeout",e.JS_WORKER="JavaScript-Worker",e.WASM_WORKER="Wasm-Worker",e.JS_WHOLE="JavaScript-Whole",e.WASM_WHOLE="Wasm-Whole",e.WEBGPU_WHOLE="WebGPU-Whole",e))(g||{}),Ee=`struct Uniforms {
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
@compute @workgroup_size(16, 16)
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
}`;let m,Y,R,C,O,$,P,x,Q,L,k;async function we(e,n){if(navigator.gpu===void 0){console.error("WebGPU is not supported");return}const t=await navigator.gpu.requestAdapter();if(!t)throw new Error("Failed to get GPU adapter");m=await t.requestDevice();const c=document.createElement("canvas");document.body.appendChild(c),c.width=e,c.height=n,L=e,k=n,Y=c.getContext("webgpu");const o=navigator.gpu.getPreferredCanvasFormat();Y.configure({device:m,format:o,alphaMode:"opaque"});const i=m.createShaderModule({code:Ee});R=m.createComputePipeline({layout:"auto",compute:{module:i,entryPoint:"main"}}),C=new ArrayBuffer(7*4),O=m.createBuffer({size:C.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),x=e*n*4,P=m.createBuffer({size:x,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),Q=m.createBuffer({size:x,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),$=m.createBindGroup({label:"bindGroup",layout:R.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:O}},{binding:1,resource:{buffer:P}}]})}async function ye(e,n,t,c,o){const i=new Uint32Array(C),f=new Float32Array(C);i.set([L,k,e],0),f.set([n,t,c,o],3),m.queue.writeBuffer(O,0,C);const A=m.createCommandEncoder(),s=A.beginComputePass();s.setPipeline(R),s.setBindGroup(0,$),s.dispatchWorkgroups(Math.ceil(L/16),Math.ceil(k/16),1),s.end(),A.copyBufferToBuffer(P,0,Q,0,x);const r=A.finish();m.queue.submit([r]),await m.queue.onSubmittedWorkDone(),await Q.mapAsync(GPUMapMode.READ);const a=new Uint8ClampedArray(Q.getMappedRange().slice());return Q.unmap(),a}const be={async generateWholeMandelbrot(e,n,t,c,o){const{width:i,height:f,maxIteration:A,minX:s,maxX:r,minY:a,maxY:l}=t;switch(this.hasCanceled=!1,n){case g.JS_WHOLE:{H(i,f),ae(A,s,r,a,l),c(e,d);break}case g.WASM_WHOLE:{T(i,f);const u=te(A,s,r,a,l),B=new Uint8ClampedArray(F.buffer,u,i*f*4);c(e,B);break}case g.WEBGPU_WHOLE:{await we(i,f);const u=await ye(A,s,r,a,l);c(e,u);break}default:throw new Error(`unknown runtime: ${n}`)}o()},async generatePartialMandelbrot(e,n,t,c,o,i){const{width:f,height:A,maxIteration:s,minX:r,maxX:a,minY:l,maxY:u}=t,B=F;switch(this.hasCanceled=!1,n){case g.JS:case g.JS_TIMEOUT:case g.JS_WORKER:H(f,A);break;case g.WASM:case g.WASM_TIMEOUT:case g.WASM_WORKER:T(f,A);break;default:throw new Error(`unknown runtime: ${n}`)}const I=f*4;for(let E=0;E<A;E++){switch(n){case g.JS_TIMEOUT:case g.JS_WORKER:case g.WASM_TIMEOUT:case g.WASM_WORKER:if(this.hasCanceled){i();return}}switch(n){case g.JS:case g.JS_TIMEOUT:case g.JS_WORKER:{J(E,s,r,a,l,u);const w=d.slice(E*I,E*I+I);n===g.JS_WORKER?c(e,E,Z(w,[w.buffer])):c(e,E,w);break}case g.WASM:case g.WASM_TIMEOUT:case g.WASM_WORKER:{const w=re(E,s,r,a,l,u),ee=new Uint8ClampedArray(B.buffer,w,I);c(e,E,ee);break}default:throw new Error(`unknown runtime: ${n}`)}switch(n){case g.JS_TIMEOUT:case g.WASM_TIMEOUT:await new Promise(w=>setTimeout(w,0))}}o()},hasCanceled:!1,cancel(){console.log("cancel"),this.hasCanceled=!0},[S](){console.log("finalizer"),this.cancel()}};v(be);var Qe=Object.freeze({__proto__:null});
