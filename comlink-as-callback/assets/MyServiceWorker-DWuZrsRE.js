/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const I=Symbol("Comlink.proxy"),G=Symbol("Comlink.endpoint"),H=Symbol("Comlink.releaseProxy"),C=Symbol("Comlink.finalizer"),m=Symbol("Comlink.thrown"),k=e=>typeof e=="object"&&e!==null||typeof e=="function",R={canHandle:e=>k(e)&&e[I],serialize(e){const{port1:t,port2:r}=new MessageChannel;return B(e,t),[r,[r]]},deserialize(e){return e.start(),v(e)}},T={canHandle:e=>k(e)&&m in e,serialize({value:e}){let t;return e instanceof Error?t={isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:t={isError:!1,value:e},[t,[]]},deserialize(e){throw e.isError?Object.assign(new Error(e.value.message),e.value):e.value}},M=new Map([["proxy",R],["throw",T]]);function O(e,t){for(const r of e)if(t===r||r==="*"||r instanceof RegExp&&r.test(t))return!0;return!1}function B(e,t=globalThis,r=["*"]){t.addEventListener("message",function u(a){if(!a||!a.data)return;if(!O(r,a.origin)){console.warn(`Invalid origin '${a.origin}' for comlink proxy`);return}const{id:o,type:s,path:A}=Object.assign({path:[]},a.data),i=(a.data.argumentList||[]).map(g);let n;try{const c=A.slice(0,-1).reduce((l,w)=>l[w],e),f=A.reduce((l,w)=>l[w],e);switch(s){case"GET":n=f;break;case"SET":c[A.slice(-1)[0]]=g(a.data.value),n=!0;break;case"APPLY":n=f.apply(c,i);break;case"CONSTRUCT":{const l=new f(...i);n=U(l)}break;case"ENDPOINT":{const{port1:l,port2:w}=new MessageChannel;B(e,w),n=F(l,[l])}break;case"RELEASE":n=void 0;break;default:return}}catch(c){n={value:c,[m]:0}}Promise.resolve(n).catch(c=>({value:c,[m]:0})).then(c=>{const[f,l]=h(c);t.postMessage(Object.assign(Object.assign({},f),{id:o}),l),s==="RELEASE"&&(t.removeEventListener("message",u),S(t),C in e&&typeof e[C]=="function"&&e[C]())}).catch(c=>{const[f,l]=h({value:new TypeError("Unserializable return value"),[m]:0});t.postMessage(Object.assign(Object.assign({},f),{id:o}),l)})}),t.start&&t.start()}function L(e){return e.constructor.name==="MessagePort"}function S(e){L(e)&&e.close()}function v(e,t){const r=new Map;return e.addEventListener("message",function(a){const{data:o}=a;if(!o||!o.id)return;const s=r.get(o.id);if(s)try{s(o)}finally{r.delete(o.id)}}),Q(e,r,[],t)}function E(e){if(e)throw new Error("Proxy has been released and is not useable")}function _(e){return y(e,new Map,{type:"RELEASE"}).then(()=>{S(e)})}const b=new WeakMap,d="FinalizationRegistry"in globalThis&&new FinalizationRegistry(e=>{const t=(b.get(e)||0)-1;b.set(e,t),t===0&&_(e)});function D(e,t){const r=(b.get(t)||0)+1;b.set(t,r),d&&d.register(e,t,e)}function W(e){d&&d.unregister(e)}function Q(e,t,r=[],u=function(){}){let a=!1;const o=new Proxy(u,{get(s,A){if(E(a),A===H)return()=>{W(o),_(e),t.clear(),a=!0};if(A==="then"){if(r.length===0)return{then:()=>o};const i=y(e,t,{type:"GET",path:r.map(n=>n.toString())}).then(g);return i.then.bind(i)}return Q(e,t,[...r,A])},set(s,A,i){E(a);const[n,c]=h(i);return y(e,t,{type:"SET",path:[...r,A].map(f=>f.toString()),value:n},c).then(g)},apply(s,A,i){E(a);const n=r[r.length-1];if(n===G)return y(e,t,{type:"ENDPOINT"}).then(g);if(n==="bind")return Q(e,t,r.slice(0,-1));const[c,f]=p(i);return y(e,t,{type:"APPLY",path:r.map(l=>l.toString()),argumentList:c},f).then(g)},construct(s,A){E(a);const[i,n]=p(A);return y(e,t,{type:"CONSTRUCT",path:r.map(c=>c.toString()),argumentList:i},n).then(g)}});return D(o,e),o}function z(e){return Array.prototype.concat.apply([],e)}function p(e){const t=e.map(h);return[t.map(r=>r[0]),z(t.map(r=>r[1]))]}const P=new WeakMap;function F(e,t){return P.set(e,t),e}function U(e){return Object.assign(e,{[I]:!0})}function h(e){for(const[t,r]of M)if(r.canHandle(e)){const[u,a]=r.serialize(e);return[{type:"HANDLER",name:t,value:u},a]}return[{type:"RAW",value:e},P.get(e)||[]]}function g(e){switch(e.type){case"HANDLER":return M.get(e.name).deserialize(e.value);case"RAW":return e.value}}function y(e,t,r,u){return new Promise(a=>{const o=V();t.set(o,a),e.start&&e.start(),e.postMessage(Object.assign({id:o},r),u)})}function V(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}async function Y(e,t={}){const r={env:Object.assign(Object.create(globalThis),t.env||{},{myCallbackProxy(s){return s=s>>>0,myCallbackProxy(s)},abort(s,A,i,n){s=o(s>>>0),A=o(A>>>0),i=i>>>0,n=n>>>0,(()=>{throw Error(`${s} in ${A}:${i}:${n}`)})()}})},{exports:u}=await WebAssembly.instantiate(e,r),a=u.memory||t.env.memory;function o(s){if(!s)return null;const A=s+new Uint32Array(a.buffer)[s-4>>>2]>>>1,i=new Uint16Array(a.buffer);let n=s>>>1,c="";for(;A-n>1024;)c+=String.fromCharCode(...i.subarray(n,n+=1024));return c+String.fromCharCode(...i.subarray(n,A))}return u}const{memory:Z,__new:J,__pin:$,__unpin:q,__collect:K,__rtti_base:ee,doSomething:j}=await(async e=>Y(await(async()=>typeof process<"u"&&process.versions!=null&&(process.versions.node!=null||process.versions.bun!=null)?globalThis.WebAssembly.compile(await(await Promise.resolve().then(function(){return X})).readFile(e)):await globalThis.WebAssembly.compileStreaming(globalThis.fetch(e)))(),{}))(new URL("data:application/wasm;base64,AGFzbQEAAAABHwZgAX8BfGAAAGAEf39/fwBgAn9/AX9gAX8Bf2ABfwACIwIDZW52D215Q2FsbGJhY2tQcm94eQAAA2VudgVhYm9ydAACAwcGAAMEBQEBBQMBAAEGDAJ/AUEAC38AQZAJCwdMBwtkb1NvbWV0aGluZwACBV9fbmV3AAMFX19waW4ABAdfX3VucGluAAUJX19jb2xsZWN0AAYLX19ydHRpX2Jhc2UDAQZtZW1vcnkCAAgBBwwBBQqAAgYdACAAEAAaIABBAXQQABogAEEDbBAAGiAAIABsuAvKAQEGfyAAQez///8DSwRAQaAIQeAIQdYAQR4QAQALIABBEGoiBEH8////A0sEQEGgCEHgCEEhQR0QAQALIwAhAyMAQQRqIgIgBEETakFwcUEEayIEaiIFPwAiBkEQdEEPakFwcSIHSwRAIAYgBSAHa0H//wNqQYCAfHFBEHYiByAGIAdKG0AAQQBIBEAgB0AAQQBIBEAACwsLIAUkACADIAQ2AgAgAkEEayIDQQA2AgQgA0EANgIIIAMgATYCDCADIAA2AhAgAkEQagsEACAACwMAAQsDAAELBwBBrAkkAAsLggEFAEGMCAsBPABBmAgLLwIAAAAoAAAAQQBsAGwAbwBjAGEAdABpAG8AbgAgAHQAbwBvACAAbABhAHIAZwBlAEHMCAsBPABB2AgLJQIAAAAeAAAAfgBsAGkAYgAvAHIAdAAvAHMAdAB1AGIALgB0AHMAQZAJCw0EAAAAIAAAACAAAAAg",import.meta.url));class x{registCallback(t){globalThis.myCallbackProxy=r=>{t(r)}}doSomethingWithWasm(t){return j(t)}}B(new x);var N=Object.freeze({__proto__:null,MyService:x});B(N);var X=Object.freeze({__proto__:null});
