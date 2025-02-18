async function ee(e,n={}){const t={env:Object.assign(Object.create(globalThis),n.env||{},{abort(A,s,r,a){A=f(A>>>0),s=f(s>>>0),r=r>>>0,a=a>>>0,(()=>{throw Error(`${A} in ${s}:${r}:${a}`)})()}})},{exports:c}=await WebAssembly.instantiate(e,t),o=c.memory||n.env.memory,i=Object.setPrototypeOf({calculate(A,s,r,a,u){return c.calculate(A,s,r,a,u)>>>0},calculateRow(A,s,r,a,u,l){return c.calculateRow(A,s,r,a,u,l)>>>0},getImageDataPointer(){return c.getImageDataPointer()>>>0}},c);function f(A){if(!A)return null;const s=A+new Uint32Array(o.buffer)[A-4>>>2]>>>1,r=new Uint16Array(o.buffer);let a=A>>>1,u="";for(;s-a>1024;)u+=String.fromCharCode(...r.subarray(a,a+=1024));return u+String.fromCharCode(...r.subarray(a,s))}return i}const{memory:Y,__new:ye,__pin:Qe,__unpin:Le,__collect:Ie,__rtti_base:he,initCanvas:O,calculate:ne,calculateRow:te,getImageDataPointer:Se}=await(async e=>ee(await(async()=>typeof process<"u"&&process.versions!=null&&(process.versions.node!=null||process.versions.bun!=null)?globalThis.WebAssembly.compile(await(await Promise.resolve().then(function(){return be})).readFile(e)):await globalThis.WebAssembly.compileStreaming(globalThis.fetch(e)))(),{}))(new URL("data:application/wasm;base64,AGFzbQEAAAABNglgAX8Bf2AAAGAEf39/fwBgAn9/AX9gAn9/AGAGf398fHx8AX9gBX98fHx8AX9gAAF/YAF/AAINAQNlbnYFYWJvcnQAAgMLCgMABAUGBwAIAQEFAwEAAQYbBX8BQQALfwFBAAt/AUEAC38BQQALfwBBgAoLB3wKCmluaXRDYW52YXMAAwljYWxjdWxhdGUABQxjYWxjdWxhdGVSb3cABBNnZXRJbWFnZURhdGFQb2ludGVyAAYFX19uZXcAAQVfX3BpbgAHB19fdW5waW4ACAlfX2NvbGxlY3QACQtfX3J0dGlfYmFzZQMEBm1lbW9yeQIACAEKDAEJCpwFCsoBAQZ/IABB7P///wNLBEBBkAlB0AlB1gBBHhAAAAsgAEEQaiIEQfz///8DSwRAQZAJQdAJQSFBHRAAAAsjAiEDIwJBBGoiAiAEQRNqQXBxQQRrIgRqIgU/ACIGQRB0QQ9qQXBxIgdLBEAgBiAFIAdrQf//A2pBgIB8cUEQdiIHIAYgB0obQABBAEgEQCAHQABBAEgEQAALCwsgBSQCIAMgBDYCACACQQRrIgNBADYCBCADQQA2AgggAyABNgIMIAMgADYCECACQRBqCy4BAX8gAEH8////A0sEQEGgCEHQCEEzQTwQAAALIABBBBABIgFBACAA/AsAIAELFgAgACQAIAEkASAAIAFsQQJ0EAIkAwu9AgIDfwN8IwNBFGsoAhBFBEBBAA8LIAQgBSAEoSAAuKIjAbijoCEKA0AgCCMASQRAIAIgAyACoSAIuKIjALijoCELRAAAAAAAAAAAIQREAAAAAAAAAAAhCUEAIQYDQCABIAZLBH8gBCAEoiAJIAmioEQAAAAAAAAQQGUFQQALBEAgBCAEoiAJIAmioSALoCEFIAQgBKAgCaIgCqAhCSAFIQQgBkEBaiEGDAELCyAAIwBsIAhqQQJ0IQcgASAGRgRAIwMgB2pBADoAACMDIAdBAWpqQQA6AAAjAyAHQQJqakEAOgAABSMDIAdqIAZBDGxB/wFxIgZBAnY6AAAjAyAHQQFqaiAGOgAAIwMgB0ECamogBkEBdjoAAAsjAyAHQQNqakH/AToAACAIQQFqIQgMAQsLIwMgACMAbEECdGoLKQEBfwNAIAUjAEkEQCAFIAAgASACIAMgBBAEGiAFQQFqIQUMAQsLIwMLBAAjAwsEACAACwMAAQsDAAELDQBBnAokAkEAEAIkAwsL9AEJAEGMCAsBLABBmAgLIwIAAAAcAAAASQBuAHYAYQBsAGkAZAAgAGwAZQBuAGcAdABoAEG8CAsBPABByAgLLQIAAAAmAAAAfgBsAGkAYgAvAHMAdABhAHQAaQBjAGEAcgByAGEAeQAuAHQAcwBB/AgLATwAQYgJCy8CAAAAKAAAAEEAbABsAG8AYwBhAHQAaQBvAG4AIAB0AG8AbwAgAGwAYQByAGcAZQBBvAkLATwAQcgJCyUCAAAAHgAAAH4AbABpAGIALwByAHQALwBzAHQAdQBiAC4AdABzAEGACgsVBQAAACAAAAAgAAAAIAAAAAAAAABk",import.meta.url));let Q=0,D=0,E=new Uint8ClampedArray(0);function T(e,n){Q=e,D=n,E=new Uint8ClampedArray(e*n*4)}function re(e,n,t,c,o){for(let i=0;i<Q;i++)J(i,e,n,t,c,o)}function J(e,n,t,c,o,i){if(E.length===0)return;const f=o+(i-o)*e/D;for(let A=0;A<Q;A++){const s=t+(c-t)*A/Q;let r=0,a=0,u=0;for(;r*r+a*a<=4&&u<n;){const B=r*r-a*a+s;a=2*r*a+f,r=B,u++}const l=e*Q+A<<2;if(u==n)E[l]=0,E[l+1]=0,E[l+2]=0,E[l+3]=255;else{const B=u*12%256;E[l]=B,E[l+1]=B>>1,E[l+2]=B>>2,E[l+3]=255}}}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const X=Symbol("Comlink.proxy"),ae=Symbol("Comlink.endpoint"),Ae=Symbol("Comlink.releaseProxy"),S=Symbol("Comlink.finalizer"),M=Symbol("Comlink.thrown"),j=e=>typeof e=="object"&&e!==null||typeof e=="function",se={canHandle:e=>j(e)&&e[X],serialize(e){const{port1:n,port2:t}=new MessageChannel;return F(e,n),[t,[t]]},deserialize(e){return e.start(),le(e)}},oe={canHandle:e=>j(e)&&M in e,serialize({value:e}){let n;return e instanceof Error?n={isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:n={isError:!1,value:e},[n,[]]},deserialize(e){throw e.isError?Object.assign(new Error(e.value.message),e.value):e.value}},q=new Map([["proxy",se],["throw",oe]]);function ie(e,n){for(const t of e)if(n===t||t==="*"||t instanceof RegExp&&t.test(n))return!0;return!1}function F(e,n=globalThis,t=["*"]){n.addEventListener("message",function c(o){if(!o||!o.data)return;if(!ie(t,o.origin)){console.warn(`Invalid origin '${o.origin}' for comlink proxy`);return}const{id:i,type:f,path:A}=Object.assign({path:[]},o.data),s=(o.data.argumentList||[]).map(C);let r;try{const a=A.slice(0,-1).reduce((l,B)=>l[B],e),u=A.reduce((l,B)=>l[B],e);switch(f){case"GET":r=u;break;case"SET":a[A.slice(-1)[0]]=C(o.data.value),r=!0;break;case"APPLY":r=u.apply(a,s);break;case"CONSTRUCT":{const l=new u(...s);r=Be(l)}break;case"ENDPOINT":{const{port1:l,port2:B}=new MessageChannel;F(e,B),r=U(l,[l])}break;case"RELEASE":r=void 0;break;default:return}}catch(a){r={value:a,[M]:0}}Promise.resolve(r).catch(a=>({value:a,[M]:0})).then(a=>{const[u,l]=x(a);n.postMessage(Object.assign(Object.assign({},u),{id:i}),l),f==="RELEASE"&&(n.removeEventListener("message",c),K(n),S in e&&typeof e[S]=="function"&&e[S]())}).catch(a=>{const[u,l]=x({value:new TypeError("Unserializable return value"),[M]:0});n.postMessage(Object.assign(Object.assign({},u),{id:i}),l)})}),n.start&&n.start()}function ce(e){return e.constructor.name==="MessagePort"}function K(e){ce(e)&&e.close()}function le(e,n){const t=new Map;return e.addEventListener("message",function(o){const{data:i}=o;if(!i||!i.id)return;const f=t.get(i.id);if(f)try{f(i)}finally{t.delete(i.id)}}),G(e,t,[],n)}function h(e){if(e)throw new Error("Proxy has been released and is not useable")}function V(e){return b(e,new Map,{type:"RELEASE"}).then(()=>{K(e)})}const p=new WeakMap,_="FinalizationRegistry"in globalThis&&new FinalizationRegistry(e=>{const n=(p.get(e)||0)-1;p.set(e,n),n===0&&V(e)});function ue(e,n){const t=(p.get(n)||0)+1;p.set(n,t),_&&_.register(e,n,e)}function fe(e){_&&_.unregister(e)}function G(e,n,t=[],c=function(){}){let o=!1;const i=new Proxy(c,{get(f,A){if(h(o),A===Ae)return()=>{fe(i),V(e),n.clear(),o=!0};if(A==="then"){if(t.length===0)return{then:()=>i};const s=b(e,n,{type:"GET",path:t.map(r=>r.toString())}).then(C);return s.then.bind(s)}return G(e,n,[...t,A])},set(f,A,s){h(o);const[r,a]=x(s);return b(e,n,{type:"SET",path:[...t,A].map(u=>u.toString()),value:r},a).then(C)},apply(f,A,s){h(o);const r=t[t.length-1];if(r===ae)return b(e,n,{type:"ENDPOINT"}).then(C);if(r==="bind")return G(e,n,t.slice(0,-1));const[a,u]=H(s);return b(e,n,{type:"APPLY",path:t.map(l=>l.toString()),argumentList:a},u).then(C)},construct(f,A){h(o);const[s,r]=H(A);return b(e,n,{type:"CONSTRUCT",path:t.map(a=>a.toString()),argumentList:s},r).then(C)}});return ue(i,e),i}function ge(e){return Array.prototype.concat.apply([],e)}function H(e){const n=e.map(x);return[n.map(t=>t[0]),ge(n.map(t=>t[1]))]}const Z=new WeakMap;function U(e,n){return Z.set(e,n),e}function Be(e){return Object.assign(e,{[X]:!0})}function x(e){for(const[n,t]of q)if(t.canHandle(e)){const[c,o]=t.serialize(e);return[{type:"HANDLER",name:n,value:c},o]}return[{type:"RAW",value:e},Z.get(e)||[]]}function C(e){switch(e.type){case"HANDLER":return q.get(e.name).deserialize(e.value);case"RAW":return e.value}}function b(e,n,t,c){return new Promise(o=>{const i=Ee();n.set(i,o),e.start&&e.start(),e.postMessage(Object.assign({id:i},t),c)})}function Ee(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}var g=(e=>(e.JS_SINGLE="JavaScript (Single-pass)",e.WASM_SINGLE="Wasm (Single-pass)",e.WEBGPU_SINGLE="WebGPU",e.JS_MULTI="JavaScript (Line-by-line)",e.WASM_MULTI="Wasm (Line-by-line)",e.JS_MULTI_CANCELLABLE="JavaScript (Line-by-line, Cancellable)",e.WASM_MULTI_CANCELLABLE="Wasm (Line-by-line, Cancellable)",e.JS_WORKER="JavaScript (Line-by-line, Worker+Cancellable)",e.WASM_WORKER="Wasm (Line-by-line, Worker+Cancellable)",e))(g||{}),de=`struct Uniforms {
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
}`;let d,N,W,L,R,$,P,I,y,v,k;async function me(e,n){if(navigator.gpu===void 0){console.error("WebGPU is not supported");return}const t=await navigator.gpu.requestAdapter();if(!t)throw new Error("Failed to get GPU adapter");d=await t.requestDevice();const c=document.createElement("canvas");document.body.appendChild(c),c.width=e,c.height=n,v=e,k=n,N=c.getContext("webgpu");const o=navigator.gpu.getPreferredCanvasFormat();N.configure({device:d,format:o,alphaMode:"opaque"});const i=d.createShaderModule({code:de});W=d.createComputePipeline({layout:"auto",compute:{module:i,entryPoint:"main"}}),L=new ArrayBuffer(7*4),R=d.createBuffer({size:L.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),I=e*n*4,P=d.createBuffer({size:I,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),y=d.createBuffer({size:I,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),$=d.createBindGroup({label:"bindGroup",layout:W.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:R}},{binding:1,resource:{buffer:P}}]})}async function we(e,n,t,c,o){const i=new Uint32Array(L),f=new Float32Array(L);i.set([v,k,e],0),f.set([n,t,c,o],3),d.queue.writeBuffer(R,0,L);const A=d.createCommandEncoder(),s=A.beginComputePass();s.setPipeline(W),s.setBindGroup(0,$),s.dispatchWorkgroups(Math.ceil(v/8),Math.ceil(k/8),1),s.end(),A.copyBufferToBuffer(P,0,y,0,I);const r=A.finish();d.queue.submit([r]),await d.queue.onSubmittedWorkDone(),await y.mapAsync(GPUMapMode.READ);const a=new Uint8ClampedArray(y.getMappedRange().slice(0,I));return y.unmap(),a}const Ce={async generateMandelbrotSingle(e,n,t,c,o){const{width:i,height:f,maxIterations:A,minX:s,maxX:r,minY:a,maxY:u}=t;switch(this.hasCanceled=!1,n){case g.JS_SINGLE:{T(i,f),re(A,s,r,a,u),c(e,E);break}case g.WASM_SINGLE:{O(i,f);const l=ne(A,s,r,a,u),B=new Uint8ClampedArray(Y.buffer,l,i*f*4);c(e,B);break}case g.WEBGPU_SINGLE:{await me(i,f);const l=await we(A,s,r,a,u);c(e,l);break}default:throw new Error(`unknown runtime: ${n}`)}o()},async generateMandelbrotLineByLine(e,n,t,c,o,i){const{width:f,height:A,maxIterations:s,minX:r,maxX:a,minY:u,maxY:l}=t;switch(this.hasCanceled=!1,n){case g.JS_MULTI:case g.JS_MULTI_CANCELLABLE:case g.JS_WORKER:T(f,A);break;case g.WASM_MULTI:case g.WASM_MULTI_CANCELLABLE:case g.WASM_WORKER:O(f,A);break;default:throw new Error(`unknown runtime: ${n}`)}const B=f*4;for(let m=0;m<A;m++){switch(n){case g.JS_MULTI_CANCELLABLE:case g.JS_WORKER:case g.WASM_MULTI_CANCELLABLE:case g.WASM_WORKER:if(this.hasCanceled){i();return}}switch(n){case g.JS_MULTI:case g.JS_MULTI_CANCELLABLE:case g.JS_WORKER:{J(m,s,r,a,u,l);const w=E.slice(m*B,m*B+B);n===g.JS_WORKER?c(e,m,U(w,[w.buffer])):c(e,m,w);break}case g.WASM_MULTI:case g.WASM_MULTI_CANCELLABLE:case g.WASM_WORKER:{const w=te(m,s,r,a,u,l),z=new Uint8ClampedArray(Y.buffer,w,B).slice();c(e,m,U(z,[z.buffer]));break}default:throw new Error(`unknown runtime: ${n}`)}switch(n){case g.JS_MULTI_CANCELLABLE:case g.WASM_MULTI_CANCELLABLE:await new Promise(w=>setTimeout(w,0))}}o()},hasCanceled:!1,cancel(){console.log("cancel"),this.hasCanceled=!0},[S](){console.log("finalizer"),this.cancel()}};F(Ce);var be=Object.freeze({__proto__:null});
