/*!
 * ONNX Runtime Web v1.27.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var i$=Object.create,Gi=Object.defineProperty,o$=Object.getOwnPropertyDescriptor,a$=Object.getOwnPropertyNames,s$=Object.getPrototypeOf,u$=Object.prototype.hasOwnProperty,Za=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,n)=>(typeof require<"u"?require:t)[n]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),C=(e,t)=>()=>(e&&(t=e(e=0)),t),re=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Ur=(e,t)=>{for(var n in t)Gi(e,n,{get:t[n],enumerable:!0})},Pm=(e,t,n,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let u of a$(t))!u$.call(e,u)&&u!==n&&Gi(e,u,{get:()=>t[u],enumerable:!(s=o$(t,u))||s.enumerable});return e},de=(e,t,n)=>(n=e!=null?i$(s$(e)):{},Pm(!e||!e.__esModule?Gi(n,"default",{value:e,enumerable:!0}):n,e)),rn=e=>Pm(Gi({},"__esModule",{value:!0}),e),gn,Jt,Rr,Dd,Am,km=C(()=>{gn=new Map,Jt=[],Rr=(e,t,n)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let s=gn.get(e);if(s===void 0)gn.set(e,{backend:t,priority:n});else{if(s.priority>n)return;if(s.priority===n&&s.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${n}`)}if(n>=0){let u=Jt.indexOf(e);u!==-1&&Jt.splice(u,1);for(let d=0;d<Jt.length;d++)if(gn.get(Jt[d]).priority<=n){Jt.splice(d,0,e);return}Jt.push(e)}return}throw new TypeError("not a valid backend")},Dd=async e=>{let t=gn.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let n=!!t.initPromise;try{return n||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(s){return n||(t.error=`${s}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},Am=async e=>{let t=e.executionProviders||[],n=t.map(o=>typeof o=="string"?o:o.name),s=n.length===0?Jt:n,u,d=[],l=new Set;for(let o of s){let r=await Dd(o);typeof r=="string"?d.push({name:o,err:r}):(u||(u=r),u===r&&l.add(o))}if(!u)throw new Error(`no available backend found. ERR: ${d.map(o=>`[${o.name}] ${o.err}`).join(", ")}`);for(let{name:o,err:r}of d)n.includes(o)&&console.warn(`removing requested execution provider "${o}" from session options because it is not available: ${r}`);let p=t.filter(o=>l.has(typeof o=="string"?o:o.name));return[u,new Proxy(e,{get:(o,r)=>r==="executionProviders"?p:Reflect.get(o,r)})]}}),l$=C(()=>{km()}),Dm,d$=C(()=>{Dm="1.27.0"}),To,Ke,Nm=C(()=>{d$(),To="warning",Ke={wasm:{},webgl:{},webgpu:{},versions:{common:Dm},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);To=e}},get logLevel(){return To}},Object.defineProperty(Ke,"logLevel",{enumerable:!0})}),he,p$=C(()=>{Nm(),he=Ke}),Cm,zm,c$=C(()=>{Cm=(e,t)=>{let n=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);n.width=e.dims[3],n.height=e.dims[2];let s=n.getContext("2d");if(s!=null){let u,d;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(u=e.dims[2],d=e.dims[3]):(u=e.dims[3],d=e.dims[2]);let l=t?.format!==void 0?t.format:"RGB",p=t?.norm,o,r;p===void 0||p.mean===void 0?o=[255,255,255,255]:typeof p.mean=="number"?o=[p.mean,p.mean,p.mean,p.mean]:(o=[p.mean[0],p.mean[1],p.mean[2],0],p.mean[3]!==void 0&&(o[3]=p.mean[3])),p===void 0||p.bias===void 0?r=[0,0,0,0]:typeof p.bias=="number"?r=[p.bias,p.bias,p.bias,p.bias]:(r=[p.bias[0],p.bias[1],p.bias[2],0],p.bias[3]!==void 0&&(r[3]=p.bias[3]));let i=d*u,a=0,c=i,h=i*2,g=-1;l==="RGBA"?(a=0,c=i,h=i*2,g=i*3):l==="RGB"?(a=0,c=i,h=i*2):l==="RBG"&&(a=0,h=i,c=i*2);for(let b=0;b<d;b++)for(let x=0;x<u;x++){let $=(e.data[a++]-r[0])*o[0],_=(e.data[c++]-r[1])*o[1],O=(e.data[h++]-r[2])*o[2],I=g===-1?255:(e.data[g++]-r[3])*o[3];s.fillStyle="rgba("+$+","+_+","+O+","+I+")",s.fillRect(x,b,1,1)}if("toDataURL"in n)return n.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},zm=(e,t)=>{let n=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),s;if(n!=null){let u,d,l;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(u=e.dims[2],d=e.dims[1],l=e.dims[3]):(u=e.dims[3],d=e.dims[2],l=e.dims[1]);let p=t!==void 0&&t.format!==void 0?t.format:"RGB",o=t?.norm,r,i;o===void 0||o.mean===void 0?r=[255,255,255,255]:typeof o.mean=="number"?r=[o.mean,o.mean,o.mean,o.mean]:(r=[o.mean[0],o.mean[1],o.mean[2],255],o.mean[3]!==void 0&&(r[3]=o.mean[3])),o===void 0||o.bias===void 0?i=[0,0,0,0]:typeof o.bias=="number"?i=[o.bias,o.bias,o.bias,o.bias]:(i=[o.bias[0],o.bias[1],o.bias[2],0],o.bias[3]!==void 0&&(i[3]=o.bias[3]));let a=d*u;if(t!==void 0&&(t.format!==void 0&&l===4&&t.format!=="RGBA"||l===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let c=4,h=0,g=1,b=2,x=3,$=0,_=a,O=a*2,I=-1;p==="RGBA"?($=0,_=a,O=a*2,I=a*3):p==="RGB"?($=0,_=a,O=a*2):p==="RBG"&&($=0,O=a,_=a*2),s=n.createImageData(u,d);for(let E=0;E<d*u;h+=c,g+=c,b+=c,x+=c,E++)s.data[h]=(e.data[$++]-i[0])*r[0],s.data[g]=(e.data[_++]-i[1])*r[1],s.data[b]=(e.data[O++]-i[2])*r[2],s.data[x]=I===-1?255:(e.data[I++]-i[3])*r[3]}else throw new Error("Can not access image data");return s}}),hi,Rm,Bm,Mm,jm,Fm,h$=C(()=>{nu(),hi=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:n,width:s}=t,u=t.norm??{mean:255,bias:0},d,l;typeof u.mean=="number"?d=[u.mean,u.mean,u.mean,u.mean]:d=[u.mean[0],u.mean[1],u.mean[2],u.mean[3]??255],typeof u.bias=="number"?l=[u.bias,u.bias,u.bias,u.bias]:l=[u.bias[0],u.bias[1],u.bias[2],u.bias[3]??0];let p=t.format!==void 0?t.format:"RGBA",o=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",r=n*s,i=o==="RGBA"?new Float32Array(r*4):new Float32Array(r*3),a=4,c=0,h=1,g=2,b=3,x=0,$=r,_=r*2,O=-1;p==="RGB"&&(a=3,c=0,h=1,g=2,b=-1),o==="RGBA"?O=r*3:o==="RBG"?(x=0,_=r,$=r*2):o==="BGR"&&(_=0,$=r,x=r*2);for(let I=0;I<r;I++,c+=a,g+=a,h+=a,b+=a)i[x++]=(e[c]+l[0])/d[0],i[$++]=(e[h]+l[1])/d[1],i[_++]=(e[g]+l[2])/d[2],O!==-1&&b!==-1&&(i[O++]=(e[b]+l[3])/d[3]);return o==="RGBA"?new ut("float32",i,[1,4,n,s]):new ut("float32",i,[1,3,n,s])},Rm=async(e,t)=>{let n=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,s=typeof ImageData<"u"&&e instanceof ImageData,u=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,d=typeof e=="string",l,p=t??{},o=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},r=i=>typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||i instanceof OffscreenCanvas?i.getContext("2d"):null;if(n){let i=o();i.width=e.width,i.height=e.height;let a=r(i);if(a!=null){let c=e.height,h=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(c=t.resizedHeight,h=t.resizedWidth),t!==void 0){if(p=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");p.tensorFormat="RGBA",p.height=c,p.width=h}else p.tensorFormat="RGBA",p.height=c,p.width=h;a.drawImage(e,0,0),l=a.getImageData(0,0,h,c).data}else throw new Error("Can not access image data")}else if(s){let i,a;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(i=t.resizedHeight,a=t.resizedWidth):(i=e.height,a=e.width),t!==void 0&&(p=t),p.format="RGBA",p.height=i,p.width=a,t!==void 0){let c=o();c.width=a,c.height=i;let h=r(c);if(h!=null)h.putImageData(e,0,0),l=h.getImageData(0,0,a,i).data;else throw new Error("Can not access image data")}else l=e.data}else if(u){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let i=o();i.width=e.width,i.height=e.height;let a=r(i);if(a!=null){let c=e.height,h=e.width;return a.drawImage(e,0,0,h,c),l=a.getImageData(0,0,h,c).data,p.height=c,p.width=h,hi(l,p)}else throw new Error("Can not access image data")}else{if(d)return new Promise((i,a)=>{let c=o(),h=r(c);if(!e||!h)return a();let g=new Image;g.crossOrigin="Anonymous",g.src=e,g.onload=()=>{c.width=g.width,c.height=g.height,h.drawImage(g,0,0,c.width,c.height);let b=h.getImageData(0,0,c.width,c.height);p.height=c.height,p.width=c.width,i(hi(b.data,p))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(l!==void 0)return hi(l,p);throw new Error("Input data provided is not supported - aborted tensor creation")},Bm=(e,t)=>{let{width:n,height:s,download:u,dispose:d}=t,l=[1,s,n,4];return new ut({location:"texture",type:"float32",texture:e,dims:l,download:u,dispose:d})},Mm=(e,t)=>{let{dataType:n,dims:s,download:u,dispose:d}=t;return new ut({location:"gpu-buffer",type:n??"float32",gpuBuffer:e,dims:s,download:u,dispose:d})},jm=(e,t)=>{let{dataType:n,dims:s,download:u,dispose:d}=t;return new ut({location:"ml-tensor",type:n??"float32",mlTensor:e,dims:s,download:u,dispose:d})},Fm=(e,t,n)=>new ut({location:"cpu-pinned",type:e,data:t,dims:n??[t.length]})}),kr,kn,So,Lm,f$=C(()=>{kr=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),kn=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),So=!1,Lm=()=>{if(!So){So=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,n=globalThis.Float16Array,s=typeof n<"u"&&n.from;e&&(kr.set("int64",BigInt64Array),kn.set(BigInt64Array,"int64")),t&&(kr.set("uint64",BigUint64Array),kn.set(BigUint64Array,"uint64")),s?(kr.set("float16",n),kn.set(n,"float16")):kr.set("float16",Uint16Array)}}}),Vm,Um,g$=C(()=>{nu(),Vm=e=>{let t=1;for(let n=0;n<e.length;n++){let s=e[n];if(typeof s!="number"||!Number.isSafeInteger(s))throw new TypeError(`dims[${n}] must be an integer, got: ${s}`);if(s<0)throw new RangeError(`dims[${n}] must be a non-negative integer, got: ${s}`);t*=s}return t},Um=(e,t)=>{switch(e.location){case"cpu":return new ut(e.type,e.data,t);case"cpu-pinned":return new ut({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new ut({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new ut({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new ut({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),ut,nu=C(()=>{c$(),h$(),f$(),g$(),ut=class{constructor(e,t,n){Lm();let s,u;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,s=e.type,u=e.dims,e.location){case"cpu-pinned":{let l=kr.get(s);if(!l)throw new TypeError(`unsupported type "${s}" to create tensor from pinned buffer`);if(!(e.data instanceof l))throw new TypeError(`buffer should be of type ${l.name}`);this.cpuData=e.data;break}case"texture":{if(s!=="float32")throw new TypeError(`unsupported type "${s}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(s!=="float32"&&s!=="float16"&&s!=="int32"&&s!=="int64"&&s!=="uint32"&&s!=="uint8"&&s!=="bool"&&s!=="uint4"&&s!=="int4")throw new TypeError(`unsupported type "${s}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(s!=="float32"&&s!=="float16"&&s!=="int32"&&s!=="int64"&&s!=="uint32"&&s!=="uint64"&&s!=="int8"&&s!=="uint8"&&s!=="bool"&&s!=="uint4"&&s!=="int4")throw new TypeError(`unsupported type "${s}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let l,p;if(typeof e=="string")if(s=e,p=n,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");l=t}else{let o=kr.get(e);if(o===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&o===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${o.name} as data.`);e==="uint64"||e==="int64"?l=o.from(t,BigInt):l=o.from(t)}else if(t instanceof o)l=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")l=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&o!==Uint16Array)l=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${s} tensor's data must be type of ${o}`)}else if(p=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let o=typeof e[0];if(o==="string")s="string",l=e;else if(o==="boolean")s="bool",l=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${o}.`)}else if(e instanceof Uint8ClampedArray)s="uint8",l=Uint8Array.from(e);else{let o=kn.get(e.constructor);if(o===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);s=o,l=e}if(p===void 0)p=[l.length];else if(!Array.isArray(p))throw new TypeError("A tensor's dims must be a number array");u=p,this.cpuData=l,this.dataLocation="cpu"}let d=Vm(u);if(this.cpuData&&d!==this.cpuData.length&&!((s==="uint4"||s==="int4")&&Math.ceil(d/2)===this.cpuData.length))throw new Error(`Tensor's size(${d}) does not match data length(${this.cpuData.length}).`);this.type=s,this.dims=u,this.size=d}static async fromImage(e,t){return Rm(e,t)}static fromTexture(e,t){return Bm(e,t)}static fromGpuBuffer(e,t){return Mm(e,t)}static fromMLTensor(e,t){return jm(e,t)}static fromPinnedBuffer(e,t,n){return Fm(e,t,n)}toDataURL(e){return Cm(this,e)}toImageData(e){return zm(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return Um(this,e)}}}),Ot,qm=C(()=>{nu(),Ot=ut}),Ci,Io,Bt,Et,Br,Mr,Gm=C(()=>{Nm(),Ci=(e,t)=>{(typeof Ke.trace>"u"?!Ke.wasm.trace:!Ke.trace)||console.timeStamp(`${e}::ORT::${t}`)},Io=(e,t)=>{let n=new Error().stack?.split(/\r\n|\r|\n/g)||[],s=!1;for(let u=0;u<n.length;u++){if(s&&!n[u].includes("TRACE_FUNC")){let d=`FUNC_${e}::${n[u].trim().split(" ")[1]}`;t&&(d+=`::${t}`),Ci("CPU",d);return}n[u].includes("TRACE_FUNC")&&(s=!0)}},Bt=e=>{(typeof Ke.trace>"u"?!Ke.wasm.trace:!Ke.trace)||Io("BEGIN",e)},Et=e=>{(typeof Ke.trace>"u"?!Ke.wasm.trace:!Ke.trace)||Io("END",e)},Br=e=>{(typeof Ke.trace>"u"?!Ke.wasm.trace:!Ke.trace)||console.time(`ORT::${e}`)},Mr=e=>{(typeof Ke.trace>"u"?!Ke.wasm.trace:!Ke.trace)||console.timeEnd(`ORT::${e}`)}}),Hm,m$=C(()=>{km(),qm(),Gm(),Hm=class Wm{constructor(t){this.handler=t}async run(t,n,s){Bt(),Br("InferenceSession.run");let u={},d={};if(typeof t!="object"||t===null||t instanceof Ot||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let l=!0;if(typeof n=="object"){if(n===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(n instanceof Ot)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(n)){if(n.length===0)throw new TypeError("'fetches' cannot be an empty array.");l=!1;for(let r of n){if(typeof r!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(r)===-1)throw new RangeError(`'fetches' contains invalid output name: ${r}.`);u[r]=null}if(typeof s=="object"&&s!==null)d=s;else if(typeof s<"u")throw new TypeError("'options' must be an object.")}else{let r=!1,i=Object.getOwnPropertyNames(n);for(let a of this.outputNames)if(i.indexOf(a)!==-1){let c=n[a];(c===null||c instanceof Ot)&&(r=!0,l=!1,u[a]=c)}if(r){if(typeof s=="object"&&s!==null)d=s;else if(typeof s<"u")throw new TypeError("'options' must be an object.")}else d=n}}else if(typeof n<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let r of this.inputNames)if(typeof t[r]>"u")throw new Error(`input '${r}' is missing in 'feeds'.`);if(l)for(let r of this.outputNames)u[r]=null;let p=await this.handler.run(t,u,d),o={};for(let r in p)if(Object.hasOwnProperty.call(p,r)){let i=p[r];i instanceof Ot?o[r]=i:o[r]=new Ot(i.type,i.data,i.dims)}return Mr("InferenceSession.run"),Et(),o}async release(){return this.handler.dispose()}static async create(t,n,s,u){Bt(),Br("InferenceSession.create");let d,l={};if(typeof t=="string"){if(d=t,typeof n=="object"&&n!==null)l=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(d=t,typeof n=="object"&&n!==null)l=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let i=t,a=0,c=t.byteLength;if(typeof n=="object"&&n!==null)l=n;else if(typeof n=="number"){if(a=n,!Number.isSafeInteger(a))throw new RangeError("'byteOffset' must be an integer.");if(a<0||a>=i.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${i.byteLength}).`);if(c=t.byteLength-a,typeof s=="number"){if(c=s,!Number.isSafeInteger(c))throw new RangeError("'byteLength' must be an integer.");if(c<=0||a+c>i.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${i.byteLength-a}].`);if(typeof u=="object"&&u!==null)l=u;else if(typeof u<"u")throw new TypeError("'options' must be an object.")}else if(typeof s<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof n<"u")throw new TypeError("'options' must be an object.");d=new Uint8Array(i,a,c)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[p,o]=await Am(l),r=await p.createInferenceSessionHandler(d,o);return Mr("InferenceSession.create"),Et(),new Wm(r)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Km,b$=C(()=>{m$(),Km=Hm}),y$=C(()=>{}),_$=C(()=>{}),v$=C(()=>{}),w$=C(()=>{}),Xm={};Ur(Xm,{InferenceSession:()=>Km,TRACE:()=>Ci,TRACE_EVENT_BEGIN:()=>Br,TRACE_EVENT_END:()=>Mr,TRACE_FUNC_BEGIN:()=>Bt,TRACE_FUNC_END:()=>Et,Tensor:()=>Ot,env:()=>he,registerBackend:()=>Rr});var et=C(()=>{l$(),p$(),b$(),qm(),y$(),_$(),Gm(),v$(),w$()});function Dr(e,t,n,s){if(t===void 0)return x$(e);if(n===void 0)fi(e,t);else if(typeof n=="number"&&s===void 0)fi(e,t);else if(typeof n=="string"&&s===void 0)fi(e,n,1,t);else if(typeof n=="string"&&typeof s=="number")fi(e,n,s,t);else throw new TypeError("input is valid")}function x$(e){return{verbose:Dr.verbose.bind(null,e),info:Dr.info.bind(null,e),warning:Dr.warning.bind(null,e),error:Dr.error.bind(null,e),fatal:Dr.fatal.bind(null,e)}}function fi(e,t,n,s){let u=en[s||""]||en[""];Ja[e]<Ja[u.minimalSeverity]||(u.logDateTime&&(t=`${new Date().toISOString()}|${t}`),u.logSourceLocation,Zm[u.provider].log(e,t,s))}var Nd,Cd,Ja,Zm,Oo,en,qe,Eo,Po,Jm,mn,Pt=C(()=>{Nd=class{log(e,t,n){}},Cd=class{log(e,t,n){console.log(`${this.color(e)} ${n?"\x1B[35m"+n+"\x1B[0m ":""}${t}`)}color(e){switch(e){case"verbose":return"\x1B[34;40mv\x1B[0m";case"info":return"\x1B[32mi\x1B[0m";case"warning":return"\x1B[30;43mw\x1B[0m";case"error":return"\x1B[31;40me\x1B[0m";case"fatal":return"\x1B[101mf\x1B[0m";default:throw new Error(`unsupported severity: ${e}`)}}},Ja={verbose:1e3,info:2e3,warning:4e3,error:5e3,fatal:6e3},Zm={none:new Nd,console:new Cd},Oo={provider:"console",minimalSeverity:"warning",logDateTime:!0,logSourceLocation:!1},en={"":Oo},(e=>{function t(r,i){e("verbose",r,i)}e.verbose=t;function n(r,i){e("info",r,i)}e.info=n;function s(r,i){e("warning",r,i)}e.warning=s;function u(r,i){e("error",r,i)}e.error=u;function d(r,i){e("fatal",r,i)}e.fatal=d;function l(r){en={},p("",r||{})}e.reset=l;function p(r,i){if(r==="*")l(i);else{let a=en[r]||Oo;en[r]={provider:i.provider||a.provider,minimalSeverity:i.minimalSeverity||a.minimalSeverity,logDateTime:i.logDateTime===void 0?a.logDateTime:i.logDateTime,logSourceLocation:i.logSourceLocation===void 0?a.logSourceLocation:i.logSourceLocation}}}e.set=p;function o(r){let i={};r.logLevel&&(i.minimalSeverity=r.logLevel),p("",i)}e.setWithEnv=o})(Dr||={}),qe=Dr,Eo=class{constructor(e,t,n,s,u,d){this.category=e,this.name=t,this.startTime=n,this.endCallback=s,this.timer=u,this.ctx=d}async end(){return this.endCallback(this)}async checkTimer(){if(this.ctx===void 0||this.timer===void 0)throw new Error("No webgl timer found");return this.ctx.endTimer(),this.ctx.waitForQueryAndGetTime(this.timer)}},Po=class{constructor(e,t,n,s){this.category=e,this.name=t,this.startTime=n,this.endTime=s}},Jm=class{constructor(e,t,n){this._started=!1,this._flushPointer=0,this._started=!1,this._maxNumberEvents=e===void 0?1e4:e,this._flushBatchSize=t===void 0?10:t,this._flushIntervalInMilliseconds=n===void 0?5e3:n}static create(e){return e===void 0?new this:new this(e.maxNumberEvents,e.flushBatchSize,e.flushIntervalInMilliseconds)}start(){this._started=!0,this._timingEvents=[],this._flushTime=mn(),this._flushPointer=0}stop(){for(this._started=!1;this._flushPointer<this._timingEvents.length;this._flushPointer++)this.logOneEvent(this._timingEvents[this._flushPointer])}event(e,t,n,s){let u=this._started?this.begin(e,t,s):void 0,d=!1,l=n();if(l&&typeof l.then=="function")return d=!0,new Promise((p,o)=>{l.then(async r=>{u&&await u.end(),p(r)},async r=>{u&&await u.end(),o(r)})});if(!d&&u){let p=u.end();if(p&&typeof p.then=="function")return new Promise((o,r)=>{p.then(()=>{o(l)},i=>{r(i)})})}return l}begin(e,t,n){if(!this._started)throw new Error("profiler is not started yet");if(n===void 0){let s=mn();return this.flush(s),new Eo(e,t,s,u=>this.endSync(u))}else{let s=n.beginTimer();return new Eo(e,t,0,async u=>this.end(u),s,n)}}async end(e){let t=await e.checkTimer();this._timingEvents.length<this._maxNumberEvents&&(this._timingEvents.push(new Po(e.category,e.name,e.startTime,t)),this.flush(t))}endSync(e){let t=mn();this._timingEvents.length<this._maxNumberEvents&&(this._timingEvents.push(new Po(e.category,e.name,e.startTime,t)),this.flush(t))}logOneEvent(e){qe.verbose(`Profiler.${e.category}`,`${(e.endTime-e.startTime).toFixed(2)}ms on event '${e.name}' at ${e.endTime.toFixed(2)}`)}flush(e){if(this._timingEvents.length-this._flushPointer>=this._flushBatchSize||e-this._flushTime>=this._flushIntervalInMilliseconds){for(let t=this._flushPointer;this._flushPointer<t+this._flushBatchSize&&this._flushPointer<this._timingEvents.length;this._flushPointer++)this.logOneEvent(this._timingEvents[this._flushPointer]);this._flushTime=mn()}}get started(){return this._started}},mn=typeof performance<"u"&&performance.now?()=>performance.now():Date.now});function $$(e,t,n){for(let s of n){let u=s[0],d=s[1],l=s[2],p=s[3],o=s[4];if(e.opType===u){for(let r of t)if((r.domain===d||r.domain==="ai.onnx"&&d==="")&&T$(r.version,l))return{opImpl:p,opInit:o}}}throw new TypeError(`cannot resolve operator '${e.opType}' with opsets: ${t.map(s=>`${s.domain||"ai.onnx"} v${s.version}`).join(", ")}`)}function T$(e,t){if(t.endsWith("+")){let n=Number.parseInt(t.substring(0,t.length-1),10);return!isNaN(n)&&n<=e}else if(t.split("-").length===2){let n=t.split("-"),s=Number.parseInt(n[0],10),u=Number.parseInt(n[1],10);return!isNaN(s)&&!isNaN(u)&&s<=e&&e<=u}else return Number.parseInt(t,10)===e}var S$=C(()=>{}),I$=re(e=>{e.__esModule=!0;var t=function(){function n(s){if(!s)throw new TypeError("Invalid argument; `value` has no value.");this.value=n.EMPTY,s&&n.isGuid(s)&&(this.value=s)}return n.isGuid=function(s){var u=s.toString();return s&&(s instanceof n||n.validator.test(u))},n.create=function(){return new n([n.gen(2),n.gen(1),n.gen(1),n.gen(1),n.gen(3)].join("-"))},n.createEmpty=function(){return new n("emptyguid")},n.parse=function(s){return new n(s)},n.raw=function(){return[n.gen(2),n.gen(1),n.gen(1),n.gen(1),n.gen(3)].join("-")},n.gen=function(s){for(var u="",d=0;d<s;d++)u+=((1+Math.random())*65536|0).toString(16).substring(1);return u},n.prototype.equals=function(s){return n.isGuid(s)&&this.value===s.toString()},n.prototype.isEmpty=function(){return this.value===n.EMPTY},n.prototype.toString=function(){return this.value},n.prototype.toJSON=function(){return{value:this.value}},n.validator=new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$","i"),n.EMPTY="00000000-0000-0000-0000-000000000000",n}();e.Guid=t});function Ne(e,t,n){this.low=e|0,this.high=t|0,this.unsigned=!!n}function Qe(e){return(e&&e.__isLong__)===!0}function zd(e){var t=Math.clz32(e&-e);return e?31-t:t}function hr(e,t){var n,s,u;return t?(e>>>=0,(u=0<=e&&e<256)&&(s=Ya[e],s)?s:(n=Te(e,0,!0),u&&(Ya[e]=n),n)):(e|=0,(u=-128<=e&&e<128)&&(s=Qa[e],s)?s:(n=Te(e,e<0?-1:0,!1),u&&(Qa[e]=n),n))}function bt(e,t){if(isNaN(e))return t?zt:mt;if(t){if(e<0)return zt;if(e>=es)return ns}else{if(e<=-ts)return nt;if(e+1>=ts)return rs}return e<0?bt(-e,t).neg():Te(e%Nr|0,e/Nr|0,t)}function Te(e,t,n){return new Ne(e,t,n)}function iu(e,t,n){if(e.length===0)throw Error("empty string");if(typeof t=="number"?(n=t,t=!1):t=!!t,e==="NaN"||e==="Infinity"||e==="+Infinity"||e==="-Infinity")return t?zt:mt;if(n=n||10,n<2||36<n)throw RangeError("radix");var s;if((s=e.indexOf("-"))>0)throw Error("interior hyphen");if(s===0)return iu(e.substring(1),t,n).neg();for(var u=bt(Ln(n,8)),d=mt,l=0;l<e.length;l+=8){var p=Math.min(8,e.length-l),o=parseInt(e.substring(l,l+p),n);if(p<8){var r=bt(Ln(n,p));d=d.mul(r).add(bt(o))}else d=d.mul(u),d=d.add(bt(o))}return d.unsigned=t,d}function ct(e,t){return typeof e=="number"?bt(e,t):typeof e=="string"?iu(e,t):Te(e.low,e.high,typeof t=="boolean"?t:e.unsigned)}var it,Qa,Ya,Ln,Ao,Rd,Nr,es,ts,ko,mt,zt,fr,Do,gi,rs,ns,nt,V,jr,Qm=C(()=>{it=null;try{it=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}Ne.prototype.__isLong__,Object.defineProperty(Ne.prototype,"__isLong__",{value:!0}),Ne.isLong=Qe,Qa={},Ya={},Ne.fromInt=hr,Ne.fromNumber=bt,Ne.fromBits=Te,Ln=Math.pow,Ne.fromString=iu,Ne.fromValue=ct,Ao=65536,Rd=1<<24,Nr=Ao*Ao,es=Nr*Nr,ts=es/2,ko=hr(Rd),mt=hr(0),Ne.ZERO=mt,zt=hr(0,!0),Ne.UZERO=zt,fr=hr(1),Ne.ONE=fr,Do=hr(1,!0),Ne.UONE=Do,gi=hr(-1),Ne.NEG_ONE=gi,rs=Te(-1,2147483647,!1),Ne.MAX_VALUE=rs,ns=Te(-1,-1,!0),Ne.MAX_UNSIGNED_VALUE=ns,nt=Te(0,-2147483648,!1),Ne.MIN_VALUE=nt,V=Ne.prototype,V.toInt=function(){return this.unsigned?this.low>>>0:this.low},V.toNumber=function(){return this.unsigned?(this.high>>>0)*Nr+(this.low>>>0):this.high*Nr+(this.low>>>0)},V.toString=function(e){if(e=e||10,e<2||36<e)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative())if(this.eq(nt)){var t=bt(e),n=this.div(t),s=n.mul(t).sub(this);return n.toString(e)+s.toInt().toString(e)}else return"-"+this.neg().toString(e);for(var u=bt(Ln(e,6),this.unsigned),d=this,l="";;){var p=d.div(u),o=d.sub(p.mul(u)).toInt()>>>0,r=o.toString(e);if(d=p,d.isZero())return r+l;for(;r.length<6;)r="0"+r;l=""+r+l}},V.getHighBits=function(){return this.high},V.getHighBitsUnsigned=function(){return this.high>>>0},V.getLowBits=function(){return this.low},V.getLowBitsUnsigned=function(){return this.low>>>0},V.getNumBitsAbs=function(){if(this.isNegative())return this.eq(nt)?64:this.neg().getNumBitsAbs();for(var e=this.high!=0?this.high:this.low,t=31;t>0&&!(e&1<<t);t--);return this.high!=0?t+33:t+1},V.isSafeInteger=function(){var e=this.high>>21;return e?this.unsigned?!1:e===-1&&!(this.low===0&&this.high===-2097152):!0},V.isZero=function(){return this.high===0&&this.low===0},V.eqz=V.isZero,V.isNegative=function(){return!this.unsigned&&this.high<0},V.isPositive=function(){return this.unsigned||this.high>=0},V.isOdd=function(){return(this.low&1)===1},V.isEven=function(){return(this.low&1)===0},V.equals=function(e){return Qe(e)||(e=ct(e)),this.unsigned!==e.unsigned&&this.high>>>31===1&&e.high>>>31===1?!1:this.high===e.high&&this.low===e.low},V.eq=V.equals,V.notEquals=function(e){return!this.eq(e)},V.neq=V.notEquals,V.ne=V.notEquals,V.lessThan=function(e){return this.comp(e)<0},V.lt=V.lessThan,V.lessThanOrEqual=function(e){return this.comp(e)<=0},V.lte=V.lessThanOrEqual,V.le=V.lessThanOrEqual,V.greaterThan=function(e){return this.comp(e)>0},V.gt=V.greaterThan,V.greaterThanOrEqual=function(e){return this.comp(e)>=0},V.gte=V.greaterThanOrEqual,V.ge=V.greaterThanOrEqual,V.compare=function(e){if(Qe(e)||(e=ct(e)),this.eq(e))return 0;var t=this.isNegative(),n=e.isNegative();return t&&!n?-1:!t&&n?1:this.unsigned?e.high>>>0>this.high>>>0||e.high===this.high&&e.low>>>0>this.low>>>0?-1:1:this.sub(e).isNegative()?-1:1},V.comp=V.compare,V.negate=function(){return!this.unsigned&&this.eq(nt)?nt:this.not().add(fr)},V.neg=V.negate,V.add=function(e){Qe(e)||(e=ct(e));var t=this.high>>>16,n=this.high&65535,s=this.low>>>16,u=this.low&65535,d=e.high>>>16,l=e.high&65535,p=e.low>>>16,o=e.low&65535,r=0,i=0,a=0,c=0;return c+=u+o,a+=c>>>16,c&=65535,a+=s+p,i+=a>>>16,a&=65535,i+=n+l,r+=i>>>16,i&=65535,r+=t+d,r&=65535,Te(a<<16|c,r<<16|i,this.unsigned)},V.subtract=function(e){return Qe(e)||(e=ct(e)),this.add(e.neg())},V.sub=V.subtract,V.multiply=function(e){if(this.isZero())return this;if(Qe(e)||(e=ct(e)),it){var t=it.mul(this.low,this.high,e.low,e.high);return Te(t,it.get_high(),this.unsigned)}if(e.isZero())return this.unsigned?zt:mt;if(this.eq(nt))return e.isOdd()?nt:mt;if(e.eq(nt))return this.isOdd()?nt:mt;if(this.isNegative())return e.isNegative()?this.neg().mul(e.neg()):this.neg().mul(e).neg();if(e.isNegative())return this.mul(e.neg()).neg();if(this.lt(ko)&&e.lt(ko))return bt(this.toNumber()*e.toNumber(),this.unsigned);var n=this.high>>>16,s=this.high&65535,u=this.low>>>16,d=this.low&65535,l=e.high>>>16,p=e.high&65535,o=e.low>>>16,r=e.low&65535,i=0,a=0,c=0,h=0;return h+=d*r,c+=h>>>16,h&=65535,c+=u*r,a+=c>>>16,c&=65535,c+=d*o,a+=c>>>16,c&=65535,a+=s*r,i+=a>>>16,a&=65535,a+=u*o,i+=a>>>16,a&=65535,a+=d*p,i+=a>>>16,a&=65535,i+=n*r+s*o+u*p+d*l,i&=65535,Te(c<<16|h,i<<16|a,this.unsigned)},V.mul=V.multiply,V.divide=function(e){if(Qe(e)||(e=ct(e)),e.isZero())throw Error("division by zero");if(it){if(!this.unsigned&&this.high===-2147483648&&e.low===-1&&e.high===-1)return this;var t=(this.unsigned?it.div_u:it.div_s)(this.low,this.high,e.low,e.high);return Te(t,it.get_high(),this.unsigned)}if(this.isZero())return this.unsigned?zt:mt;var n,s,u;if(this.unsigned){if(e.unsigned||(e=e.toUnsigned()),e.gt(this))return zt;if(e.gt(this.shru(1)))return Do;u=zt}else{if(this.eq(nt)){if(e.eq(fr)||e.eq(gi))return nt;if(e.eq(nt))return fr;var d=this.shr(1);return n=d.div(e).shl(1),n.eq(mt)?e.isNegative()?fr:gi:(s=this.sub(e.mul(n)),u=n.add(s.div(e)),u)}else if(e.eq(nt))return this.unsigned?zt:mt;if(this.isNegative())return e.isNegative()?this.neg().div(e.neg()):this.neg().div(e).neg();if(e.isNegative())return this.div(e.neg()).neg();u=mt}for(s=this;s.gte(e);){n=Math.max(1,Math.floor(s.toNumber()/e.toNumber()));for(var l=Math.ceil(Math.log(n)/Math.LN2),p=l<=48?1:Ln(2,l-48),o=bt(n),r=o.mul(e);r.isNegative()||r.gt(s);)n-=p,o=bt(n,this.unsigned),r=o.mul(e);o.isZero()&&(o=fr),u=u.add(o),s=s.sub(r)}return u},V.div=V.divide,V.modulo=function(e){if(Qe(e)||(e=ct(e)),it){var t=(this.unsigned?it.rem_u:it.rem_s)(this.low,this.high,e.low,e.high);return Te(t,it.get_high(),this.unsigned)}return this.sub(this.div(e).mul(e))},V.mod=V.modulo,V.rem=V.modulo,V.not=function(){return Te(~this.low,~this.high,this.unsigned)},V.countLeadingZeros=function(){return this.high?Math.clz32(this.high):Math.clz32(this.low)+32},V.clz=V.countLeadingZeros,V.countTrailingZeros=function(){return this.low?zd(this.low):zd(this.high)+32},V.ctz=V.countTrailingZeros,V.and=function(e){return Qe(e)||(e=ct(e)),Te(this.low&e.low,this.high&e.high,this.unsigned)},V.or=function(e){return Qe(e)||(e=ct(e)),Te(this.low|e.low,this.high|e.high,this.unsigned)},V.xor=function(e){return Qe(e)||(e=ct(e)),Te(this.low^e.low,this.high^e.high,this.unsigned)},V.shiftLeft=function(e){return Qe(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?Te(this.low<<e,this.high<<e|this.low>>>32-e,this.unsigned):Te(0,this.low<<e-32,this.unsigned)},V.shl=V.shiftLeft,V.shiftRight=function(e){return Qe(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?Te(this.low>>>e|this.high<<32-e,this.high>>e,this.unsigned):Te(this.high>>e-32,this.high>=0?0:-1,this.unsigned)},V.shr=V.shiftRight,V.shiftRightUnsigned=function(e){return Qe(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?Te(this.low>>>e|this.high<<32-e,this.high>>>e,this.unsigned):e===32?Te(this.high,0,this.unsigned):Te(this.high>>>e-32,0,this.unsigned)},V.shru=V.shiftRightUnsigned,V.shr_u=V.shiftRightUnsigned,V.rotateLeft=function(e){var t;return Qe(e)&&(e=e.toInt()),(e&=63)===0?this:e===32?Te(this.high,this.low,this.unsigned):e<32?(t=32-e,Te(this.low<<e|this.high>>>t,this.high<<e|this.low>>>t,this.unsigned)):(e-=32,t=32-e,Te(this.high<<e|this.low>>>t,this.low<<e|this.high>>>t,this.unsigned))},V.rotl=V.rotateLeft,V.rotateRight=function(e){var t;return Qe(e)&&(e=e.toInt()),(e&=63)===0?this:e===32?Te(this.high,this.low,this.unsigned):e<32?(t=32-e,Te(this.high<<t|this.low>>>e,this.low<<t|this.high>>>e,this.unsigned)):(e-=32,t=32-e,Te(this.low<<t|this.high>>>e,this.high<<t|this.low>>>e,this.unsigned))},V.rotr=V.rotateRight,V.toSigned=function(){return this.unsigned?Te(this.low,this.high,!1):this},V.toUnsigned=function(){return this.unsigned?this:Te(this.low,this.high,!0)},V.toBytes=function(e){return e?this.toBytesLE():this.toBytesBE()},V.toBytesLE=function(){var e=this.high,t=this.low;return[t&255,t>>>8&255,t>>>16&255,t>>>24,e&255,e>>>8&255,e>>>16&255,e>>>24]},V.toBytesBE=function(){var e=this.high,t=this.low;return[e>>>24,e>>>16&255,e>>>8&255,e&255,t>>>24,t>>>16&255,t>>>8&255,t&255]},Ne.fromBytes=function(e,t,n){return n?Ne.fromBytesLE(e,t):Ne.fromBytesBE(e,t)},Ne.fromBytesLE=function(e,t){return new Ne(e[0]|e[1]<<8|e[2]<<16|e[3]<<24,e[4]|e[5]<<8|e[6]<<16|e[7]<<24,t)},Ne.fromBytesBE=function(e,t){return new Ne(e[4]<<24|e[5]<<16|e[6]<<8|e[7],e[0]<<24|e[1]<<16|e[2]<<8|e[3],t)},typeof BigInt=="function"&&(Ne.fromBigInt=function(e,t){var n=Number(BigInt.asIntN(32,e)),s=Number(BigInt.asIntN(32,e>>BigInt(32)));return Te(n,s,t)},Ne.fromValue=function(e,t){return typeof e=="bigint"?Ne.fromBigInt(e,t):ct(e,t)},V.toBigInt=function(){var e=BigInt(this.low>>>0),t=BigInt(this.unsigned?this.high>>>0:this.high);return t<<BigInt(32)|e}),jr=Ne}),Ym=re(e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ArgType=void 0;var t;(function(n){n[n.INPUT=0]="INPUT",n[n.OUTPUT=1]="OUTPUT"})(t||(e.ArgType=t={}))}),ou=re(e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.SIZE_PREFIX_LENGTH=e.FILE_IDENTIFIER_LENGTH=e.SIZEOF_INT=e.SIZEOF_SHORT=void 0,e.SIZEOF_SHORT=2,e.SIZEOF_INT=4,e.FILE_IDENTIFIER_LENGTH=4,e.SIZE_PREFIX_LENGTH=4}),eb=re(e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.isLittleEndian=e.float64=e.float32=e.int32=void 0,e.int32=new Int32Array(2),e.float32=new Float32Array(e.int32.buffer),e.float64=new Float64Array(e.int32.buffer),e.isLittleEndian=new Uint16Array(new Uint8Array([1,0]).buffer)[0]===1}),tb=re(e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Encoding=void 0;var t;(function(n){n[n.UTF8_BYTES=1]="UTF8_BYTES",n[n.UTF16_STRING=2]="UTF16_STRING"})(t||(e.Encoding=t={}))}),rb=re(e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ByteBuffer=void 0;var t=ou(),n=tb(),s=eb(),u=class nb{constructor(l){this.bytes_=l,this.position_=0,this.text_decoder_=new TextDecoder}static allocate(l){return new nb(new Uint8Array(l))}clear(){this.position_=0}bytes(){return this.bytes_}position(){return this.position_}setPosition(l){this.position_=l}capacity(){return this.bytes_.length}readInt8(l){return this.readUint8(l)<<24>>24}readUint8(l){return this.bytes_[l]}readInt16(l){return this.readUint16(l)<<16>>16}readUint16(l){return this.bytes_[l]|this.bytes_[l+1]<<8}readInt32(l){return this.bytes_[l]|this.bytes_[l+1]<<8|this.bytes_[l+2]<<16|this.bytes_[l+3]<<24}readUint32(l){return this.readInt32(l)>>>0}readInt64(l){return BigInt.asIntN(64,BigInt(this.readUint32(l))+(BigInt(this.readUint32(l+4))<<BigInt(32)))}readUint64(l){return BigInt.asUintN(64,BigInt(this.readUint32(l))+(BigInt(this.readUint32(l+4))<<BigInt(32)))}readFloat32(l){return s.int32[0]=this.readInt32(l),s.float32[0]}readFloat64(l){return s.int32[s.isLittleEndian?0:1]=this.readInt32(l),s.int32[s.isLittleEndian?1:0]=this.readInt32(l+4),s.float64[0]}writeInt8(l,p){this.bytes_[l]=p}writeUint8(l,p){this.bytes_[l]=p}writeInt16(l,p){this.bytes_[l]=p,this.bytes_[l+1]=p>>8}writeUint16(l,p){this.bytes_[l]=p,this.bytes_[l+1]=p>>8}writeInt32(l,p){this.bytes_[l]=p,this.bytes_[l+1]=p>>8,this.bytes_[l+2]=p>>16,this.bytes_[l+3]=p>>24}writeUint32(l,p){this.bytes_[l]=p,this.bytes_[l+1]=p>>8,this.bytes_[l+2]=p>>16,this.bytes_[l+3]=p>>24}writeInt64(l,p){this.writeInt32(l,Number(BigInt.asIntN(32,p))),this.writeInt32(l+4,Number(BigInt.asIntN(32,p>>BigInt(32))))}writeUint64(l,p){this.writeUint32(l,Number(BigInt.asUintN(32,p))),this.writeUint32(l+4,Number(BigInt.asUintN(32,p>>BigInt(32))))}writeFloat32(l,p){s.float32[0]=p,this.writeInt32(l,s.int32[0])}writeFloat64(l,p){s.float64[0]=p,this.writeInt32(l,s.int32[s.isLittleEndian?0:1]),this.writeInt32(l+4,s.int32[s.isLittleEndian?1:0])}getBufferIdentifier(){if(this.bytes_.length<this.position_+t.SIZEOF_INT+t.FILE_IDENTIFIER_LENGTH)throw new Error("FlatBuffers: ByteBuffer is too short to contain an identifier.");let l="";for(let p=0;p<t.FILE_IDENTIFIER_LENGTH;p++)l+=String.fromCharCode(this.readInt8(this.position_+t.SIZEOF_INT+p));return l}__offset(l,p){let o=l-this.readInt32(l);return p<this.readInt16(o)?this.readInt16(o+p):0}__union(l,p){return l.bb_pos=p+this.readInt32(p),l.bb=this,l}__string(l,p){l+=this.readInt32(l);let o=this.readInt32(l);l+=t.SIZEOF_INT;let r=this.bytes_.subarray(l,l+o);return p===n.Encoding.UTF8_BYTES?r:this.text_decoder_.decode(r)}__union_with_string(l,p){return typeof l=="string"?this.__string(p):this.__union(l,p)}__indirect(l){return l+this.readInt32(l)}__vector(l){return l+this.readInt32(l)+t.SIZEOF_INT}__vector_len(l){return this.readInt32(l+this.readInt32(l))}__has_identifier(l){if(l.length!=t.FILE_IDENTIFIER_LENGTH)throw new Error("FlatBuffers: file identifier must be length "+t.FILE_IDENTIFIER_LENGTH);for(let p=0;p<t.FILE_IDENTIFIER_LENGTH;p++)if(l.charCodeAt(p)!=this.readInt8(this.position()+t.SIZEOF_INT+p))return!1;return!0}createScalarList(l,p){let o=[];for(let r=0;r<p;++r){let i=l(r);i!==null&&o.push(i)}return o}createObjList(l,p){let o=[];for(let r=0;r<p;++r){let i=l(r);i!==null&&o.push(i.unpack())}return o}};e.ByteBuffer=u}),O$=re(e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Builder=void 0;var t=rb(),n=ou(),s=class ib{constructor(d){this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1,this.string_maps=null,this.text_encoder=new TextEncoder;let l;d?l=d:l=1024,this.bb=t.ByteBuffer.allocate(l),this.space=l}clear(){this.bb.clear(),this.space=this.bb.capacity(),this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1,this.string_maps=null}forceDefaults(d){this.force_defaults=d}dataBuffer(){return this.bb}asUint8Array(){return this.bb.bytes().subarray(this.bb.position(),this.bb.position()+this.offset())}prep(d,l){d>this.minalign&&(this.minalign=d);let p=~(this.bb.capacity()-this.space+l)+1&d-1;for(;this.space<p+d+l;){let o=this.bb.capacity();this.bb=ib.growByteBuffer(this.bb),this.space+=this.bb.capacity()-o}this.pad(p)}pad(d){for(let l=0;l<d;l++)this.bb.writeInt8(--this.space,0)}writeInt8(d){this.bb.writeInt8(this.space-=1,d)}writeInt16(d){this.bb.writeInt16(this.space-=2,d)}writeInt32(d){this.bb.writeInt32(this.space-=4,d)}writeInt64(d){this.bb.writeInt64(this.space-=8,d)}writeFloat32(d){this.bb.writeFloat32(this.space-=4,d)}writeFloat64(d){this.bb.writeFloat64(this.space-=8,d)}addInt8(d){this.prep(1,0),this.writeInt8(d)}addInt16(d){this.prep(2,0),this.writeInt16(d)}addInt32(d){this.prep(4,0),this.writeInt32(d)}addInt64(d){this.prep(8,0),this.writeInt64(d)}addFloat32(d){this.prep(4,0),this.writeFloat32(d)}addFloat64(d){this.prep(8,0),this.writeFloat64(d)}addFieldInt8(d,l,p){(this.force_defaults||l!=p)&&(this.addInt8(l),this.slot(d))}addFieldInt16(d,l,p){(this.force_defaults||l!=p)&&(this.addInt16(l),this.slot(d))}addFieldInt32(d,l,p){(this.force_defaults||l!=p)&&(this.addInt32(l),this.slot(d))}addFieldInt64(d,l,p){(this.force_defaults||l!==p)&&(this.addInt64(l),this.slot(d))}addFieldFloat32(d,l,p){(this.force_defaults||l!=p)&&(this.addFloat32(l),this.slot(d))}addFieldFloat64(d,l,p){(this.force_defaults||l!=p)&&(this.addFloat64(l),this.slot(d))}addFieldOffset(d,l,p){(this.force_defaults||l!=p)&&(this.addOffset(l),this.slot(d))}addFieldStruct(d,l,p){l!=p&&(this.nested(l),this.slot(d))}nested(d){if(d!=this.offset())throw new TypeError("FlatBuffers: struct must be serialized inline.")}notNested(){if(this.isNested)throw new TypeError("FlatBuffers: object serialization must not be nested.")}slot(d){this.vtable!==null&&(this.vtable[d]=this.offset())}offset(){return this.bb.capacity()-this.space}static growByteBuffer(d){let l=d.capacity();if(l&3221225472)throw new Error("FlatBuffers: cannot grow buffer beyond 2 gigabytes.");let p=l<<1,o=t.ByteBuffer.allocate(p);return o.setPosition(p-l),o.bytes().set(d.bytes(),p-l),o}addOffset(d){this.prep(n.SIZEOF_INT,0),this.writeInt32(this.offset()-d+n.SIZEOF_INT)}startObject(d){this.notNested(),this.vtable==null&&(this.vtable=[]),this.vtable_in_use=d;for(let l=0;l<d;l++)this.vtable[l]=0;this.isNested=!0,this.object_start=this.offset()}endObject(){if(this.vtable==null||!this.isNested)throw new Error("FlatBuffers: endObject called without startObject");this.addInt32(0);let d=this.offset(),l=this.vtable_in_use-1;for(;l>=0&&this.vtable[l]==0;l--);let p=l+1;for(;l>=0;l--)this.addInt16(this.vtable[l]!=0?d-this.vtable[l]:0);let o=2;this.addInt16(d-this.object_start);let r=(p+o)*n.SIZEOF_SHORT;this.addInt16(r);let i=0,a=this.space;e:for(l=0;l<this.vtables.length;l++){let c=this.bb.capacity()-this.vtables[l];if(r==this.bb.readInt16(c)){for(let h=n.SIZEOF_SHORT;h<r;h+=n.SIZEOF_SHORT)if(this.bb.readInt16(a+h)!=this.bb.readInt16(c+h))continue e;i=this.vtables[l];break}}return i?(this.space=this.bb.capacity()-d,this.bb.writeInt32(this.space,i-d)):(this.vtables.push(this.offset()),this.bb.writeInt32(this.bb.capacity()-d,this.offset()-d)),this.isNested=!1,d}finish(d,l,p){let o=p?n.SIZE_PREFIX_LENGTH:0;if(l){let r=l;if(this.prep(this.minalign,n.SIZEOF_INT+n.FILE_IDENTIFIER_LENGTH+o),r.length!=n.FILE_IDENTIFIER_LENGTH)throw new TypeError("FlatBuffers: file identifier must be length "+n.FILE_IDENTIFIER_LENGTH);for(let i=n.FILE_IDENTIFIER_LENGTH-1;i>=0;i--)this.writeInt8(r.charCodeAt(i))}this.prep(this.minalign,n.SIZEOF_INT+o),this.addOffset(d),o&&this.addInt32(this.bb.capacity()-this.space),this.bb.setPosition(this.space)}finishSizePrefixed(d,l){this.finish(d,l,!0)}requiredField(d,l){let p=this.bb.capacity()-d,o=p-this.bb.readInt32(p);if(!(l<this.bb.readInt16(o)&&this.bb.readInt16(o+l)!=0))throw new TypeError("FlatBuffers: field "+l+" must be set")}startVector(d,l,p){this.notNested(),this.vector_num_elems=l,this.prep(n.SIZEOF_INT,d*l),this.prep(p,d*l)}endVector(){return this.writeInt32(this.vector_num_elems),this.offset()}createSharedString(d){if(!d)return 0;if(this.string_maps||(this.string_maps=new Map),this.string_maps.has(d))return this.string_maps.get(d);let l=this.createString(d);return this.string_maps.set(d,l),l}createString(d){if(d==null)return 0;let l;return d instanceof Uint8Array?l=d:l=this.text_encoder.encode(d),this.addInt8(0),this.startVector(1,l.length,1),this.bb.setPosition(this.space-=l.length),this.bb.bytes().set(l,this.space),this.endVector()}createByteVector(d){return d==null?0:(this.startVector(1,d.length,1),this.bb.setPosition(this.space-=d.length),this.bb.bytes().set(d,this.space),this.endVector())}createObjectOffset(d){return d===null?0:typeof d=="string"?this.createString(d):d.pack(this)}createObjectOffsetList(d){let l=[];for(let p=0;p<d.length;++p){let o=d[p];if(o!==null)l.push(this.createObjectOffset(o));else throw new TypeError("FlatBuffers: Argument for createObjectOffsetList cannot contain null.")}return l}createStructOffsetList(d,l){return l(this,d.length),this.createObjectOffsetList(d.slice().reverse()),this.endVector()}};e.Builder=s}),Pe=re(e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Encoding=e.ByteBuffer=e.Builder=e.isLittleEndian=e.int32=e.float64=e.float32=e.SIZE_PREFIX_LENGTH=e.SIZEOF_SHORT=e.SIZEOF_INT=e.FILE_IDENTIFIER_LENGTH=void 0;var t=ou();Object.defineProperty(e,"FILE_IDENTIFIER_LENGTH",{enumerable:!0,get:function(){return t.FILE_IDENTIFIER_LENGTH}}),Object.defineProperty(e,"SIZEOF_INT",{enumerable:!0,get:function(){return t.SIZEOF_INT}}),Object.defineProperty(e,"SIZEOF_SHORT",{enumerable:!0,get:function(){return t.SIZEOF_SHORT}}),Object.defineProperty(e,"SIZE_PREFIX_LENGTH",{enumerable:!0,get:function(){return t.SIZE_PREFIX_LENGTH}});var n=eb();Object.defineProperty(e,"float32",{enumerable:!0,get:function(){return n.float32}}),Object.defineProperty(e,"float64",{enumerable:!0,get:function(){return n.float64}}),Object.defineProperty(e,"int32",{enumerable:!0,get:function(){return n.int32}}),Object.defineProperty(e,"isLittleEndian",{enumerable:!0,get:function(){return n.isLittleEndian}});var s=O$();Object.defineProperty(e,"Builder",{enumerable:!0,get:function(){return s.Builder}});var u=rb();Object.defineProperty(e,"ByteBuffer",{enumerable:!0,get:function(){return u.ByteBuffer}});var d=tb();Object.defineProperty(e,"Encoding",{enumerable:!0,get:function(){return d.Encoding}})}),ob=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.ArgTypeAndIndex=void 0;var u=s(Pe()),d=Ym(),l=class vr{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsArgTypeAndIndex(o,r){return(r||new vr).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsArgTypeAndIndex(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new vr).__init(o.readInt32(o.position())+o.position(),o)}argType(){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.readInt8(this.bb_pos+o):d.ArgType.INPUT}index(){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.readUint32(this.bb_pos+o):0}static startArgTypeAndIndex(o){o.startObject(2)}static addArgType(o,r){o.addFieldInt8(0,r,d.ArgType.INPUT)}static addIndex(o,r){o.addFieldInt32(1,r,0)}static endArgTypeAndIndex(o){return o.endObject()}static createArgTypeAndIndex(o,r,i){return vr.startArgTypeAndIndex(o),vr.addArgType(o,r),vr.addIndex(o,i),vr.endArgTypeAndIndex(o)}};e.ArgTypeAndIndex=l}),ab=re(e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.AttributeType=void 0;var t;(function(n){n[n.UNDEFINED=0]="UNDEFINED",n[n.FLOAT=1]="FLOAT",n[n.INT=2]="INT",n[n.STRING=3]="STRING",n[n.TENSOR=4]="TENSOR",n[n.GRAPH=5]="GRAPH",n[n.FLOATS=6]="FLOATS",n[n.INTS=7]="INTS",n[n.STRINGS=8]="STRINGS",n[n.TENSORS=9]="TENSORS",n[n.GRAPHS=10]="GRAPHS",n[n.SPARSE_TENSOR=11]="SPARSE_TENSOR",n[n.SPARSE_TENSORS=12]="SPARSE_TENSORS"})(t||(e.AttributeType=t={}))}),sb=re(e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.NodeType=void 0;var t;(function(n){n[n.Primitive=0]="Primitive",n[n.Fused=1]="Fused"})(t||(e.NodeType=t={}))}),ub=re(e=>{var t=e&&e.__createBinding||(Object.create?function(o,r,i,a){a===void 0&&(a=i);var c=Object.getOwnPropertyDescriptor(r,i);(!c||("get"in c?!r.__esModule:c.writable||c.configurable))&&(c={enumerable:!0,get:function(){return r[i]}}),Object.defineProperty(o,a,c)}:function(o,r,i,a){a===void 0&&(a=i),o[a]=r[i]}),n=e&&e.__setModuleDefault||(Object.create?function(o,r){Object.defineProperty(o,"default",{enumerable:!0,value:r})}:function(o,r){o.default=r}),s=e&&e.__importStar||function(){var o=function(r){return o=Object.getOwnPropertyNames||function(i){var a=[];for(var c in i)Object.prototype.hasOwnProperty.call(i,c)&&(a[a.length]=c);return a},o(r)};return function(r){if(r&&r.__esModule)return r;var i={};if(r!=null)for(var a=o(r),c=0;c<a.length;c++)a[c]!=="default"&&t(i,r,a[c]);return n(i,r),i}}();Object.defineProperty(e,"__esModule",{value:!0}),e.Node=void 0;var u=s(Pe()),d=Sb(),l=sb(),p=class We{constructor(){this.bb=null,this.bb_pos=0}__init(r,i){return this.bb_pos=r,this.bb=i,this}static getRootAsNode(r,i){return(i||new We).__init(r.readInt32(r.position())+r.position(),r)}static getSizePrefixedRootAsNode(r,i){return r.setPosition(r.position()+u.SIZE_PREFIX_LENGTH),(i||new We).__init(r.readInt32(r.position())+r.position(),r)}name(r){let i=this.bb.__offset(this.bb_pos,4);return i?this.bb.__string(this.bb_pos+i,r):null}docString(r){let i=this.bb.__offset(this.bb_pos,6);return i?this.bb.__string(this.bb_pos+i,r):null}domain(r){let i=this.bb.__offset(this.bb_pos,8);return i?this.bb.__string(this.bb_pos+i,r):null}sinceVersion(){let r=this.bb.__offset(this.bb_pos,10);return r?this.bb.readInt32(this.bb_pos+r):0}index(){let r=this.bb.__offset(this.bb_pos,12);return r?this.bb.readUint32(this.bb_pos+r):0}opType(r){let i=this.bb.__offset(this.bb_pos,14);return i?this.bb.__string(this.bb_pos+i,r):null}type(){let r=this.bb.__offset(this.bb_pos,16);return r?this.bb.readInt32(this.bb_pos+r):l.NodeType.Primitive}executionProviderType(r){let i=this.bb.__offset(this.bb_pos,18);return i?this.bb.__string(this.bb_pos+i,r):null}inputs(r,i){let a=this.bb.__offset(this.bb_pos,20);return a?this.bb.__string(this.bb.__vector(this.bb_pos+a)+r*4,i):null}inputsLength(){let r=this.bb.__offset(this.bb_pos,20);return r?this.bb.__vector_len(this.bb_pos+r):0}outputs(r,i){let a=this.bb.__offset(this.bb_pos,22);return a?this.bb.__string(this.bb.__vector(this.bb_pos+a)+r*4,i):null}outputsLength(){let r=this.bb.__offset(this.bb_pos,22);return r?this.bb.__vector_len(this.bb_pos+r):0}attributes(r,i){let a=this.bb.__offset(this.bb_pos,24);return a?(i||new d.Attribute).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+a)+r*4),this.bb):null}attributesLength(){let r=this.bb.__offset(this.bb_pos,24);return r?this.bb.__vector_len(this.bb_pos+r):0}inputArgCounts(r){let i=this.bb.__offset(this.bb_pos,26);return i?this.bb.readInt32(this.bb.__vector(this.bb_pos+i)+r*4):0}inputArgCountsLength(){let r=this.bb.__offset(this.bb_pos,26);return r?this.bb.__vector_len(this.bb_pos+r):0}inputArgCountsArray(){let r=this.bb.__offset(this.bb_pos,26);return r?new Int32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+r),this.bb.__vector_len(this.bb_pos+r)):null}implicitInputs(r,i){let a=this.bb.__offset(this.bb_pos,28);return a?this.bb.__string(this.bb.__vector(this.bb_pos+a)+r*4,i):null}implicitInputsLength(){let r=this.bb.__offset(this.bb_pos,28);return r?this.bb.__vector_len(this.bb_pos+r):0}static startNode(r){r.startObject(13)}static addName(r,i){r.addFieldOffset(0,i,0)}static addDocString(r,i){r.addFieldOffset(1,i,0)}static addDomain(r,i){r.addFieldOffset(2,i,0)}static addSinceVersion(r,i){r.addFieldInt32(3,i,0)}static addIndex(r,i){r.addFieldInt32(4,i,0)}static addOpType(r,i){r.addFieldOffset(5,i,0)}static addType(r,i){r.addFieldInt32(6,i,l.NodeType.Primitive)}static addExecutionProviderType(r,i){r.addFieldOffset(7,i,0)}static addInputs(r,i){r.addFieldOffset(8,i,0)}static createInputsVector(r,i){r.startVector(4,i.length,4);for(let a=i.length-1;a>=0;a--)r.addOffset(i[a]);return r.endVector()}static startInputsVector(r,i){r.startVector(4,i,4)}static addOutputs(r,i){r.addFieldOffset(9,i,0)}static createOutputsVector(r,i){r.startVector(4,i.length,4);for(let a=i.length-1;a>=0;a--)r.addOffset(i[a]);return r.endVector()}static startOutputsVector(r,i){r.startVector(4,i,4)}static addAttributes(r,i){r.addFieldOffset(10,i,0)}static createAttributesVector(r,i){r.startVector(4,i.length,4);for(let a=i.length-1;a>=0;a--)r.addOffset(i[a]);return r.endVector()}static startAttributesVector(r,i){r.startVector(4,i,4)}static addInputArgCounts(r,i){r.addFieldOffset(11,i,0)}static createInputArgCountsVector(r,i){r.startVector(4,i.length,4);for(let a=i.length-1;a>=0;a--)r.addInt32(i[a]);return r.endVector()}static startInputArgCountsVector(r,i){r.startVector(4,i,4)}static addImplicitInputs(r,i){r.addFieldOffset(12,i,0)}static createImplicitInputsVector(r,i){r.startVector(4,i.length,4);for(let a=i.length-1;a>=0;a--)r.addOffset(i[a]);return r.endVector()}static startImplicitInputsVector(r,i){r.startVector(4,i,4)}static endNode(r){return r.endObject()}static createNode(r,i,a,c,h,g,b,x,$,_,O,I,E,A){return We.startNode(r),We.addName(r,i),We.addDocString(r,a),We.addDomain(r,c),We.addSinceVersion(r,h),We.addIndex(r,g),We.addOpType(r,b),We.addType(r,x),We.addExecutionProviderType(r,$),We.addInputs(r,_),We.addOutputs(r,O),We.addAttributes(r,I),We.addInputArgCounts(r,E),We.addImplicitInputs(r,A),We.endNode(r)}};e.Node=p}),lb=re(e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.EdgeEnd=void 0;var t=class{constructor(){this.bb=null,this.bb_pos=0}__init(n,s){return this.bb_pos=n,this.bb=s,this}nodeIndex(){return this.bb.readUint32(this.bb_pos)}srcArgIndex(){return this.bb.readInt32(this.bb_pos+4)}dstArgIndex(){return this.bb.readInt32(this.bb_pos+8)}static sizeOf(){return 12}static createEdgeEnd(n,s,u,d){return n.prep(4,12),n.writeInt32(d),n.writeInt32(u),n.writeInt32(s),n.offset()}};e.EdgeEnd=t}),db=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.NodeEdge=void 0;var u=s(Pe()),d=lb(),l=class tr{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsNodeEdge(o,r){return(r||new tr).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsNodeEdge(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new tr).__init(o.readInt32(o.position())+o.position(),o)}nodeIndex(){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.readUint32(this.bb_pos+o):0}inputEdges(o,r){let i=this.bb.__offset(this.bb_pos,6);return i?(r||new d.EdgeEnd).__init(this.bb.__vector(this.bb_pos+i)+o*12,this.bb):null}inputEdgesLength(){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.__vector_len(this.bb_pos+o):0}outputEdges(o,r){let i=this.bb.__offset(this.bb_pos,8);return i?(r||new d.EdgeEnd).__init(this.bb.__vector(this.bb_pos+i)+o*12,this.bb):null}outputEdgesLength(){let o=this.bb.__offset(this.bb_pos,8);return o?this.bb.__vector_len(this.bb_pos+o):0}static startNodeEdge(o){o.startObject(3)}static addNodeIndex(o,r){o.addFieldInt32(0,r,0)}static addInputEdges(o,r){o.addFieldOffset(1,r,0)}static startInputEdgesVector(o,r){o.startVector(12,r,4)}static addOutputEdges(o,r){o.addFieldOffset(2,r,0)}static startOutputEdgesVector(o,r){o.startVector(12,r,4)}static endNodeEdge(o){return o.endObject()}static createNodeEdge(o,r,i,a){return tr.startNodeEdge(o),tr.addNodeIndex(o,r),tr.addInputEdges(o,i),tr.addOutputEdges(o,a),tr.endNodeEdge(o)}};e.NodeEdge=l}),pb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(l,p,o,r){r===void 0&&(r=o);var i=Object.getOwnPropertyDescriptor(p,o);(!i||("get"in i?!p.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return p[o]}}),Object.defineProperty(l,r,i)}:function(l,p,o,r){r===void 0&&(r=o),l[r]=p[o]}),n=e&&e.__setModuleDefault||(Object.create?function(l,p){Object.defineProperty(l,"default",{enumerable:!0,value:p})}:function(l,p){l.default=p}),s=e&&e.__importStar||function(){var l=function(p){return l=Object.getOwnPropertyNames||function(o){var r=[];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(r[r.length]=i);return r},l(p)};return function(p){if(p&&p.__esModule)return p;var o={};if(p!=null)for(var r=l(p),i=0;i<r.length;i++)r[i]!=="default"&&t(o,p,r[i]);return n(o,p),o}}();Object.defineProperty(e,"__esModule",{value:!0}),e.NodesToOptimizeIndices=void 0;var u=s(Pe()),d=class ft{constructor(){this.bb=null,this.bb_pos=0}__init(p,o){return this.bb_pos=p,this.bb=o,this}static getRootAsNodesToOptimizeIndices(p,o){return(o||new ft).__init(p.readInt32(p.position())+p.position(),p)}static getSizePrefixedRootAsNodesToOptimizeIndices(p,o){return p.setPosition(p.position()+u.SIZE_PREFIX_LENGTH),(o||new ft).__init(p.readInt32(p.position())+p.position(),p)}nodeIndices(p){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.readUint32(this.bb.__vector(this.bb_pos+o)+p*4):0}nodeIndicesLength(){let p=this.bb.__offset(this.bb_pos,4);return p?this.bb.__vector_len(this.bb_pos+p):0}nodeIndicesArray(){let p=this.bb.__offset(this.bb_pos,4);return p?new Uint32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+p),this.bb.__vector_len(this.bb_pos+p)):null}numInputs(){let p=this.bb.__offset(this.bb_pos,6);return p?this.bb.readUint32(this.bb_pos+p):0}numOutputs(){let p=this.bb.__offset(this.bb_pos,8);return p?this.bb.readUint32(this.bb_pos+p):0}hasVariadicInput(){let p=this.bb.__offset(this.bb_pos,10);return p?!!this.bb.readInt8(this.bb_pos+p):!1}hasVariadicOutput(){let p=this.bb.__offset(this.bb_pos,12);return p?!!this.bb.readInt8(this.bb_pos+p):!1}numVariadicInputs(){let p=this.bb.__offset(this.bb_pos,14);return p?this.bb.readUint32(this.bb_pos+p):0}numVariadicOutputs(){let p=this.bb.__offset(this.bb_pos,16);return p?this.bb.readUint32(this.bb_pos+p):0}static startNodesToOptimizeIndices(p){p.startObject(7)}static addNodeIndices(p,o){p.addFieldOffset(0,o,0)}static createNodeIndicesVector(p,o){p.startVector(4,o.length,4);for(let r=o.length-1;r>=0;r--)p.addInt32(o[r]);return p.endVector()}static startNodeIndicesVector(p,o){p.startVector(4,o,4)}static addNumInputs(p,o){p.addFieldInt32(1,o,0)}static addNumOutputs(p,o){p.addFieldInt32(2,o,0)}static addHasVariadicInput(p,o){p.addFieldInt8(3,+o,0)}static addHasVariadicOutput(p,o){p.addFieldInt8(4,+o,0)}static addNumVariadicInputs(p,o){p.addFieldInt32(5,o,0)}static addNumVariadicOutputs(p,o){p.addFieldInt32(6,o,0)}static endNodesToOptimizeIndices(p){return p.endObject()}static createNodesToOptimizeIndices(p,o,r,i,a,c,h,g){return ft.startNodesToOptimizeIndices(p),ft.addNodeIndices(p,o),ft.addNumInputs(p,r),ft.addNumOutputs(p,i),ft.addHasVariadicInput(p,a),ft.addHasVariadicOutput(p,c),ft.addNumVariadicInputs(p,h),ft.addNumVariadicOutputs(p,g),ft.endNodesToOptimizeIndices(p)}};e.NodesToOptimizeIndices=d}),cb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.RuntimeOptimizationRecord=void 0;var u=s(Pe()),d=pb(),l=class is{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsRuntimeOptimizationRecord(o,r){return(r||new is).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsRuntimeOptimizationRecord(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new is).__init(o.readInt32(o.position())+o.position(),o)}actionId(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}nodesToOptimizeIndices(o){let r=this.bb.__offset(this.bb_pos,6);return r?(o||new d.NodesToOptimizeIndices).__init(this.bb.__indirect(this.bb_pos+r),this.bb):null}producedOpIds(o,r){let i=this.bb.__offset(this.bb_pos,10);return i?this.bb.__string(this.bb.__vector(this.bb_pos+i)+o*4,r):null}producedOpIdsLength(){let o=this.bb.__offset(this.bb_pos,10);return o?this.bb.__vector_len(this.bb_pos+o):0}static startRuntimeOptimizationRecord(o){o.startObject(4)}static addActionId(o,r){o.addFieldOffset(0,r,0)}static addNodesToOptimizeIndices(o,r){o.addFieldOffset(1,r,0)}static addProducedOpIds(o,r){o.addFieldOffset(3,r,0)}static createProducedOpIdsVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startProducedOpIdsVector(o,r){o.startVector(4,r,4)}static endRuntimeOptimizationRecord(o){return o.endObject()}};e.RuntimeOptimizationRecord=l}),hb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.RuntimeOptimizationRecordContainerEntry=void 0;var u=s(Pe()),d=cb(),l=class wr{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsRuntimeOptimizationRecordContainerEntry(o,r){return(r||new wr).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsRuntimeOptimizationRecordContainerEntry(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new wr).__init(o.readInt32(o.position())+o.position(),o)}optimizerName(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}runtimeOptimizationRecords(o,r){let i=this.bb.__offset(this.bb_pos,6);return i?(r||new d.RuntimeOptimizationRecord).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+o*4),this.bb):null}runtimeOptimizationRecordsLength(){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.__vector_len(this.bb_pos+o):0}static startRuntimeOptimizationRecordContainerEntry(o){o.startObject(2)}static addOptimizerName(o,r){o.addFieldOffset(0,r,0)}static addRuntimeOptimizationRecords(o,r){o.addFieldOffset(1,r,0)}static createRuntimeOptimizationRecordsVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startRuntimeOptimizationRecordsVector(o,r){o.startVector(4,r,4)}static endRuntimeOptimizationRecordContainerEntry(o){let r=o.endObject();return o.requiredField(r,4),r}static createRuntimeOptimizationRecordContainerEntry(o,r,i){return wr.startRuntimeOptimizationRecordContainerEntry(o),wr.addOptimizerName(o,r),wr.addRuntimeOptimizationRecords(o,i),wr.endRuntimeOptimizationRecordContainerEntry(o)}};e.RuntimeOptimizationRecordContainerEntry=l}),fb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.RuntimeOptimizations=void 0;var u=s(Pe()),d=hb(),l=class Zr{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsRuntimeOptimizations(o,r){return(r||new Zr).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsRuntimeOptimizations(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new Zr).__init(o.readInt32(o.position())+o.position(),o)}records(o,r){let i=this.bb.__offset(this.bb_pos,4);return i?(r||new d.RuntimeOptimizationRecordContainerEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+o*4),this.bb):null}recordsLength(){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.__vector_len(this.bb_pos+o):0}static startRuntimeOptimizations(o){o.startObject(1)}static addRecords(o,r){o.addFieldOffset(0,r,0)}static createRecordsVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startRecordsVector(o,r){o.startVector(4,r,4)}static endRuntimeOptimizations(o){return o.endObject()}static createRuntimeOptimizations(o,r){return Zr.startRuntimeOptimizations(o),Zr.addRecords(o,r),Zr.endRuntimeOptimizations(o)}};e.RuntimeOptimizations=l}),Hi=re(e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.TensorDataType=void 0;var t;(function(n){n[n.UNDEFINED=0]="UNDEFINED",n[n.FLOAT=1]="FLOAT",n[n.UINT8=2]="UINT8",n[n.INT8=3]="INT8",n[n.UINT16=4]="UINT16",n[n.INT16=5]="INT16",n[n.INT32=6]="INT32",n[n.INT64=7]="INT64",n[n.STRING=8]="STRING",n[n.BOOL=9]="BOOL",n[n.FLOAT16=10]="FLOAT16",n[n.DOUBLE=11]="DOUBLE",n[n.UINT32=12]="UINT32",n[n.UINT64=13]="UINT64",n[n.COMPLEX64=14]="COMPLEX64",n[n.COMPLEX128=15]="COMPLEX128",n[n.BFLOAT16=16]="BFLOAT16",n[n.FLOAT8E4M3FN=17]="FLOAT8E4M3FN",n[n.FLOAT8E4M3FNUZ=18]="FLOAT8E4M3FNUZ",n[n.FLOAT8E5M2=19]="FLOAT8E5M2",n[n.FLOAT8E5M2FNUZ=20]="FLOAT8E5M2FNUZ"})(t||(e.TensorDataType=t={}))}),Wi=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.Tensor=void 0;var u=s(Pe()),d=Hi(),l=class gt{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsTensor(o,r){return(r||new gt).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsTensor(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new gt).__init(o.readInt32(o.position())+o.position(),o)}name(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}docString(o){let r=this.bb.__offset(this.bb_pos,6);return r?this.bb.__string(this.bb_pos+r,o):null}dims(o){let r=this.bb.__offset(this.bb_pos,8);return r?this.bb.readInt64(this.bb.__vector(this.bb_pos+r)+o*8):BigInt(0)}dimsLength(){let o=this.bb.__offset(this.bb_pos,8);return o?this.bb.__vector_len(this.bb_pos+o):0}dataType(){let o=this.bb.__offset(this.bb_pos,10);return o?this.bb.readInt32(this.bb_pos+o):d.TensorDataType.UNDEFINED}rawData(o){let r=this.bb.__offset(this.bb_pos,12);return r?this.bb.readUint8(this.bb.__vector(this.bb_pos+r)+o):0}rawDataLength(){let o=this.bb.__offset(this.bb_pos,12);return o?this.bb.__vector_len(this.bb_pos+o):0}rawDataArray(){let o=this.bb.__offset(this.bb_pos,12);return o?new Uint8Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+o),this.bb.__vector_len(this.bb_pos+o)):null}stringData(o,r){let i=this.bb.__offset(this.bb_pos,14);return i?this.bb.__string(this.bb.__vector(this.bb_pos+i)+o*4,r):null}stringDataLength(){let o=this.bb.__offset(this.bb_pos,14);return o?this.bb.__vector_len(this.bb_pos+o):0}externalDataOffset(){let o=this.bb.__offset(this.bb_pos,16);return o?this.bb.readInt64(this.bb_pos+o):BigInt("-1")}static startTensor(o){o.startObject(7)}static addName(o,r){o.addFieldOffset(0,r,0)}static addDocString(o,r){o.addFieldOffset(1,r,0)}static addDims(o,r){o.addFieldOffset(2,r,0)}static createDimsVector(o,r){o.startVector(8,r.length,8);for(let i=r.length-1;i>=0;i--)o.addInt64(r[i]);return o.endVector()}static startDimsVector(o,r){o.startVector(8,r,8)}static addDataType(o,r){o.addFieldInt32(3,r,d.TensorDataType.UNDEFINED)}static addRawData(o,r){o.addFieldOffset(4,r,0)}static createRawDataVector(o,r){o.startVector(1,r.length,1);for(let i=r.length-1;i>=0;i--)o.addInt8(r[i]);return o.endVector()}static startRawDataVector(o,r){o.startVector(1,r,1)}static addStringData(o,r){o.addFieldOffset(5,r,0)}static createStringDataVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startStringDataVector(o,r){o.startVector(4,r,4)}static addExternalDataOffset(o,r){o.addFieldInt64(6,r,BigInt("-1"))}static endTensor(o){return o.endObject()}static createTensor(o,r,i,a,c,h,g,b){return gt.startTensor(o),gt.addName(o,r),gt.addDocString(o,i),gt.addDims(o,a),gt.addDataType(o,c),gt.addRawData(o,h),gt.addStringData(o,g),gt.addExternalDataOffset(o,b),gt.endTensor(o)}};e.Tensor=l}),gb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.SparseTensor=void 0;var u=s(Pe()),d=Wi(),l=class os{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsSparseTensor(o,r){return(r||new os).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsSparseTensor(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new os).__init(o.readInt32(o.position())+o.position(),o)}values(o){let r=this.bb.__offset(this.bb_pos,4);return r?(o||new d.Tensor).__init(this.bb.__indirect(this.bb_pos+r),this.bb):null}indices(o){let r=this.bb.__offset(this.bb_pos,6);return r?(o||new d.Tensor).__init(this.bb.__indirect(this.bb_pos+r),this.bb):null}dims(o){let r=this.bb.__offset(this.bb_pos,8);return r?this.bb.readInt64(this.bb.__vector(this.bb_pos+r)+o*8):BigInt(0)}dimsLength(){let o=this.bb.__offset(this.bb_pos,8);return o?this.bb.__vector_len(this.bb_pos+o):0}static startSparseTensor(o){o.startObject(3)}static addValues(o,r){o.addFieldOffset(0,r,0)}static addIndices(o,r){o.addFieldOffset(1,r,0)}static addDims(o,r){o.addFieldOffset(2,r,0)}static createDimsVector(o,r){o.startVector(8,r.length,8);for(let i=r.length-1;i>=0;i--)o.addInt64(r[i]);return o.endVector()}static startDimsVector(o,r){o.startVector(8,r,8)}static endSparseTensor(o){return o.endObject()}};e.SparseTensor=l}),mb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(o,r,i,a){a===void 0&&(a=i);var c=Object.getOwnPropertyDescriptor(r,i);(!c||("get"in c?!r.__esModule:c.writable||c.configurable))&&(c={enumerable:!0,get:function(){return r[i]}}),Object.defineProperty(o,a,c)}:function(o,r,i,a){a===void 0&&(a=i),o[a]=r[i]}),n=e&&e.__setModuleDefault||(Object.create?function(o,r){Object.defineProperty(o,"default",{enumerable:!0,value:r})}:function(o,r){o.default=r}),s=e&&e.__importStar||function(){var o=function(r){return o=Object.getOwnPropertyNames||function(i){var a=[];for(var c in i)Object.prototype.hasOwnProperty.call(i,c)&&(a[a.length]=c);return a},o(r)};return function(r){if(r&&r.__esModule)return r;var i={};if(r!=null)for(var a=o(r),c=0;c<a.length;c++)a[c]!=="default"&&t(i,r,a[c]);return n(i,r),i}}();Object.defineProperty(e,"__esModule",{value:!0}),e.MapType=void 0;var u=s(Pe()),d=Hi(),l=Ki(),p=class as{constructor(){this.bb=null,this.bb_pos=0}__init(r,i){return this.bb_pos=r,this.bb=i,this}static getRootAsMapType(r,i){return(i||new as).__init(r.readInt32(r.position())+r.position(),r)}static getSizePrefixedRootAsMapType(r,i){return r.setPosition(r.position()+u.SIZE_PREFIX_LENGTH),(i||new as).__init(r.readInt32(r.position())+r.position(),r)}keyType(){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.readInt32(this.bb_pos+r):d.TensorDataType.UNDEFINED}valueType(r){let i=this.bb.__offset(this.bb_pos,6);return i?(r||new l.TypeInfo).__init(this.bb.__indirect(this.bb_pos+i),this.bb):null}static startMapType(r){r.startObject(2)}static addKeyType(r,i){r.addFieldInt32(0,i,d.TensorDataType.UNDEFINED)}static addValueType(r,i){r.addFieldOffset(1,i,0)}static endMapType(r){return r.endObject()}};e.MapType=p}),bb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.SequenceType=void 0;var u=s(Pe()),d=Ki(),l=class Jr{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsSequenceType(o,r){return(r||new Jr).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsSequenceType(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new Jr).__init(o.readInt32(o.position())+o.position(),o)}elemType(o){let r=this.bb.__offset(this.bb_pos,4);return r?(o||new d.TypeInfo).__init(this.bb.__indirect(this.bb_pos+r),this.bb):null}static startSequenceType(o){o.startObject(1)}static addElemType(o,r){o.addFieldOffset(0,r,0)}static endSequenceType(o){return o.endObject()}static createSequenceType(o,r){return Jr.startSequenceType(o),Jr.addElemType(o,r),Jr.endSequenceType(o)}};e.SequenceType=l}),yb=re(e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.DimensionValueType=void 0;var t;(function(n){n[n.UNKNOWN=0]="UNKNOWN",n[n.VALUE=1]="VALUE",n[n.PARAM=2]="PARAM"})(t||(e.DimensionValueType=t={}))}),_b=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.DimensionValue=void 0;var u=s(Pe()),d=yb(),l=class rr{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsDimensionValue(o,r){return(r||new rr).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsDimensionValue(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new rr).__init(o.readInt32(o.position())+o.position(),o)}dimType(){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.readInt8(this.bb_pos+o):d.DimensionValueType.UNKNOWN}dimValue(){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.readInt64(this.bb_pos+o):BigInt("0")}dimParam(o){let r=this.bb.__offset(this.bb_pos,8);return r?this.bb.__string(this.bb_pos+r,o):null}static startDimensionValue(o){o.startObject(3)}static addDimType(o,r){o.addFieldInt8(0,r,d.DimensionValueType.UNKNOWN)}static addDimValue(o,r){o.addFieldInt64(1,r,BigInt("0"))}static addDimParam(o,r){o.addFieldOffset(2,r,0)}static endDimensionValue(o){return o.endObject()}static createDimensionValue(o,r,i,a){return rr.startDimensionValue(o),rr.addDimType(o,r),rr.addDimValue(o,i),rr.addDimParam(o,a),rr.endDimensionValue(o)}};e.DimensionValue=l}),vb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.Dimension=void 0;var u=s(Pe()),d=_b(),l=class xr{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsDimension(o,r){return(r||new xr).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsDimension(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new xr).__init(o.readInt32(o.position())+o.position(),o)}value(o){let r=this.bb.__offset(this.bb_pos,4);return r?(o||new d.DimensionValue).__init(this.bb.__indirect(this.bb_pos+r),this.bb):null}denotation(o){let r=this.bb.__offset(this.bb_pos,6);return r?this.bb.__string(this.bb_pos+r,o):null}static startDimension(o){o.startObject(2)}static addValue(o,r){o.addFieldOffset(0,r,0)}static addDenotation(o,r){o.addFieldOffset(1,r,0)}static endDimension(o){return o.endObject()}static createDimension(o,r,i){return xr.startDimension(o),xr.addValue(o,r),xr.addDenotation(o,i),xr.endDimension(o)}};e.Dimension=l}),wb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.Shape=void 0;var u=s(Pe()),d=vb(),l=class Qr{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsShape(o,r){return(r||new Qr).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsShape(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new Qr).__init(o.readInt32(o.position())+o.position(),o)}dim(o,r){let i=this.bb.__offset(this.bb_pos,4);return i?(r||new d.Dimension).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+o*4),this.bb):null}dimLength(){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.__vector_len(this.bb_pos+o):0}static startShape(o){o.startObject(1)}static addDim(o,r){o.addFieldOffset(0,r,0)}static createDimVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startDimVector(o,r){o.startVector(4,r,4)}static endShape(o){return o.endObject()}static createShape(o,r){return Qr.startShape(o),Qr.addDim(o,r),Qr.endShape(o)}};e.Shape=l}),xb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(o,r,i,a){a===void 0&&(a=i);var c=Object.getOwnPropertyDescriptor(r,i);(!c||("get"in c?!r.__esModule:c.writable||c.configurable))&&(c={enumerable:!0,get:function(){return r[i]}}),Object.defineProperty(o,a,c)}:function(o,r,i,a){a===void 0&&(a=i),o[a]=r[i]}),n=e&&e.__setModuleDefault||(Object.create?function(o,r){Object.defineProperty(o,"default",{enumerable:!0,value:r})}:function(o,r){o.default=r}),s=e&&e.__importStar||function(){var o=function(r){return o=Object.getOwnPropertyNames||function(i){var a=[];for(var c in i)Object.prototype.hasOwnProperty.call(i,c)&&(a[a.length]=c);return a},o(r)};return function(r){if(r&&r.__esModule)return r;var i={};if(r!=null)for(var a=o(r),c=0;c<a.length;c++)a[c]!=="default"&&t(i,r,a[c]);return n(i,r),i}}();Object.defineProperty(e,"__esModule",{value:!0}),e.TensorTypeAndShape=void 0;var u=s(Pe()),d=wb(),l=Hi(),p=class ss{constructor(){this.bb=null,this.bb_pos=0}__init(r,i){return this.bb_pos=r,this.bb=i,this}static getRootAsTensorTypeAndShape(r,i){return(i||new ss).__init(r.readInt32(r.position())+r.position(),r)}static getSizePrefixedRootAsTensorTypeAndShape(r,i){return r.setPosition(r.position()+u.SIZE_PREFIX_LENGTH),(i||new ss).__init(r.readInt32(r.position())+r.position(),r)}elemType(){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.readInt32(this.bb_pos+r):l.TensorDataType.UNDEFINED}shape(r){let i=this.bb.__offset(this.bb_pos,6);return i?(r||new d.Shape).__init(this.bb.__indirect(this.bb_pos+i),this.bb):null}static startTensorTypeAndShape(r){r.startObject(2)}static addElemType(r,i){r.addFieldInt32(0,i,l.TensorDataType.UNDEFINED)}static addShape(r,i){r.addFieldOffset(1,i,0)}static endTensorTypeAndShape(r){return r.endObject()}};e.TensorTypeAndShape=p}),$b=re(e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.TypeInfoValue=void 0,e.unionToTypeInfoValue=d,e.unionListToTypeInfoValue=l;var t=mb(),n=bb(),s=xb(),u;(function(p){p[p.NONE=0]="NONE",p[p.tensor_type=1]="tensor_type",p[p.sequence_type=2]="sequence_type",p[p.map_type=3]="map_type"})(u||(e.TypeInfoValue=u={}));function d(p,o){switch(u[p]){case"NONE":return null;case"tensor_type":return o(new s.TensorTypeAndShape);case"sequence_type":return o(new n.SequenceType);case"map_type":return o(new t.MapType);default:return null}}function l(p,o,r){switch(u[p]){case"NONE":return null;case"tensor_type":return o(r,new s.TensorTypeAndShape);case"sequence_type":return o(r,new n.SequenceType);case"map_type":return o(r,new t.MapType);default:return null}}}),Ki=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.TypeInfo=void 0;var u=s(Pe()),d=$b(),l=class nr{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsTypeInfo(o,r){return(r||new nr).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsTypeInfo(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new nr).__init(o.readInt32(o.position())+o.position(),o)}denotation(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}valueType(){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.readUint8(this.bb_pos+o):d.TypeInfoValue.NONE}value(o){let r=this.bb.__offset(this.bb_pos,8);return r?this.bb.__union(o,this.bb_pos+r):null}static startTypeInfo(o){o.startObject(3)}static addDenotation(o,r){o.addFieldOffset(0,r,0)}static addValueType(o,r){o.addFieldInt8(1,r,d.TypeInfoValue.NONE)}static addValue(o,r){o.addFieldOffset(2,r,0)}static endTypeInfo(o){return o.endObject()}static createTypeInfo(o,r,i,a){return nr.startTypeInfo(o),nr.addDenotation(o,r),nr.addValueType(o,i),nr.addValue(o,a),nr.endTypeInfo(o)}};e.TypeInfo=l}),Tb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.ValueInfo=void 0;var u=s(Pe()),d=Ki(),l=class us{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsValueInfo(o,r){return(r||new us).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsValueInfo(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new us).__init(o.readInt32(o.position())+o.position(),o)}name(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}docString(o){let r=this.bb.__offset(this.bb_pos,6);return r?this.bb.__string(this.bb_pos+r,o):null}type(o){let r=this.bb.__offset(this.bb_pos,8);return r?(o||new d.TypeInfo).__init(this.bb.__indirect(this.bb_pos+r),this.bb):null}static startValueInfo(o){o.startObject(3)}static addName(o,r){o.addFieldOffset(0,r,0)}static addDocString(o,r){o.addFieldOffset(1,r,0)}static addType(o,r){o.addFieldOffset(2,r,0)}static endValueInfo(o){return o.endObject()}};e.ValueInfo=l}),au=re(e=>{var t=e&&e.__createBinding||(Object.create?function(c,h,g,b){b===void 0&&(b=g);var x=Object.getOwnPropertyDescriptor(h,g);(!x||("get"in x?!h.__esModule:x.writable||x.configurable))&&(x={enumerable:!0,get:function(){return h[g]}}),Object.defineProperty(c,b,x)}:function(c,h,g,b){b===void 0&&(b=g),c[b]=h[g]}),n=e&&e.__setModuleDefault||(Object.create?function(c,h){Object.defineProperty(c,"default",{enumerable:!0,value:h})}:function(c,h){c.default=h}),s=e&&e.__importStar||function(){var c=function(h){return c=Object.getOwnPropertyNames||function(g){var b=[];for(var x in g)Object.prototype.hasOwnProperty.call(g,x)&&(b[b.length]=x);return b},c(h)};return function(h){if(h&&h.__esModule)return h;var g={};if(h!=null)for(var b=c(h),x=0;x<b.length;x++)b[x]!=="default"&&t(g,h,b[x]);return n(g,h),g}}();Object.defineProperty(e,"__esModule",{value:!0}),e.Graph=void 0;var u=s(Pe()),d=ub(),l=db(),p=fb(),o=gb(),r=Wi(),i=Tb(),a=class ls{constructor(){this.bb=null,this.bb_pos=0}__init(h,g){return this.bb_pos=h,this.bb=g,this}static getRootAsGraph(h,g){return(g||new ls).__init(h.readInt32(h.position())+h.position(),h)}static getSizePrefixedRootAsGraph(h,g){return h.setPosition(h.position()+u.SIZE_PREFIX_LENGTH),(g||new ls).__init(h.readInt32(h.position())+h.position(),h)}initializers(h,g){let b=this.bb.__offset(this.bb_pos,4);return b?(g||new r.Tensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+b)+h*4),this.bb):null}initializersLength(){let h=this.bb.__offset(this.bb_pos,4);return h?this.bb.__vector_len(this.bb_pos+h):0}nodeArgs(h,g){let b=this.bb.__offset(this.bb_pos,6);return b?(g||new i.ValueInfo).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+b)+h*4),this.bb):null}nodeArgsLength(){let h=this.bb.__offset(this.bb_pos,6);return h?this.bb.__vector_len(this.bb_pos+h):0}nodes(h,g){let b=this.bb.__offset(this.bb_pos,8);return b?(g||new d.Node).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+b)+h*4),this.bb):null}nodesLength(){let h=this.bb.__offset(this.bb_pos,8);return h?this.bb.__vector_len(this.bb_pos+h):0}maxNodeIndex(){let h=this.bb.__offset(this.bb_pos,10);return h?this.bb.readUint32(this.bb_pos+h):0}nodeEdges(h,g){let b=this.bb.__offset(this.bb_pos,12);return b?(g||new l.NodeEdge).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+b)+h*4),this.bb):null}nodeEdgesLength(){let h=this.bb.__offset(this.bb_pos,12);return h?this.bb.__vector_len(this.bb_pos+h):0}inputs(h,g){let b=this.bb.__offset(this.bb_pos,14);return b?this.bb.__string(this.bb.__vector(this.bb_pos+b)+h*4,g):null}inputsLength(){let h=this.bb.__offset(this.bb_pos,14);return h?this.bb.__vector_len(this.bb_pos+h):0}outputs(h,g){let b=this.bb.__offset(this.bb_pos,16);return b?this.bb.__string(this.bb.__vector(this.bb_pos+b)+h*4,g):null}outputsLength(){let h=this.bb.__offset(this.bb_pos,16);return h?this.bb.__vector_len(this.bb_pos+h):0}sparseInitializers(h,g){let b=this.bb.__offset(this.bb_pos,18);return b?(g||new o.SparseTensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+b)+h*4),this.bb):null}sparseInitializersLength(){let h=this.bb.__offset(this.bb_pos,18);return h?this.bb.__vector_len(this.bb_pos+h):0}runtimeOptimizations(h){let g=this.bb.__offset(this.bb_pos,20);return g?(h||new p.RuntimeOptimizations).__init(this.bb.__indirect(this.bb_pos+g),this.bb):null}static startGraph(h){h.startObject(9)}static addInitializers(h,g){h.addFieldOffset(0,g,0)}static createInitializersVector(h,g){h.startVector(4,g.length,4);for(let b=g.length-1;b>=0;b--)h.addOffset(g[b]);return h.endVector()}static startInitializersVector(h,g){h.startVector(4,g,4)}static addNodeArgs(h,g){h.addFieldOffset(1,g,0)}static createNodeArgsVector(h,g){h.startVector(4,g.length,4);for(let b=g.length-1;b>=0;b--)h.addOffset(g[b]);return h.endVector()}static startNodeArgsVector(h,g){h.startVector(4,g,4)}static addNodes(h,g){h.addFieldOffset(2,g,0)}static createNodesVector(h,g){h.startVector(4,g.length,4);for(let b=g.length-1;b>=0;b--)h.addOffset(g[b]);return h.endVector()}static startNodesVector(h,g){h.startVector(4,g,4)}static addMaxNodeIndex(h,g){h.addFieldInt32(3,g,0)}static addNodeEdges(h,g){h.addFieldOffset(4,g,0)}static createNodeEdgesVector(h,g){h.startVector(4,g.length,4);for(let b=g.length-1;b>=0;b--)h.addOffset(g[b]);return h.endVector()}static startNodeEdgesVector(h,g){h.startVector(4,g,4)}static addInputs(h,g){h.addFieldOffset(5,g,0)}static createInputsVector(h,g){h.startVector(4,g.length,4);for(let b=g.length-1;b>=0;b--)h.addOffset(g[b]);return h.endVector()}static startInputsVector(h,g){h.startVector(4,g,4)}static addOutputs(h,g){h.addFieldOffset(6,g,0)}static createOutputsVector(h,g){h.startVector(4,g.length,4);for(let b=g.length-1;b>=0;b--)h.addOffset(g[b]);return h.endVector()}static startOutputsVector(h,g){h.startVector(4,g,4)}static addSparseInitializers(h,g){h.addFieldOffset(7,g,0)}static createSparseInitializersVector(h,g){h.startVector(4,g.length,4);for(let b=g.length-1;b>=0;b--)h.addOffset(g[b]);return h.endVector()}static startSparseInitializersVector(h,g){h.startVector(4,g,4)}static addRuntimeOptimizations(h,g){h.addFieldOffset(8,g,0)}static endGraph(h){return h.endObject()}};e.Graph=a}),Sb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(r,i,a,c){c===void 0&&(c=a);var h=Object.getOwnPropertyDescriptor(i,a);(!h||("get"in h?!i.__esModule:h.writable||h.configurable))&&(h={enumerable:!0,get:function(){return i[a]}}),Object.defineProperty(r,c,h)}:function(r,i,a,c){c===void 0&&(c=a),r[c]=i[a]}),n=e&&e.__setModuleDefault||(Object.create?function(r,i){Object.defineProperty(r,"default",{enumerable:!0,value:i})}:function(r,i){r.default=i}),s=e&&e.__importStar||function(){var r=function(i){return r=Object.getOwnPropertyNames||function(a){var c=[];for(var h in a)Object.prototype.hasOwnProperty.call(a,h)&&(c[c.length]=h);return c},r(i)};return function(i){if(i&&i.__esModule)return i;var a={};if(i!=null)for(var c=r(i),h=0;h<c.length;h++)c[h]!=="default"&&t(a,i,c[h]);return n(a,i),a}}();Object.defineProperty(e,"__esModule",{value:!0}),e.Attribute=void 0;var u=s(Pe()),d=ab(),l=au(),p=Wi(),o=class ds{constructor(){this.bb=null,this.bb_pos=0}__init(i,a){return this.bb_pos=i,this.bb=a,this}static getRootAsAttribute(i,a){return(a||new ds).__init(i.readInt32(i.position())+i.position(),i)}static getSizePrefixedRootAsAttribute(i,a){return i.setPosition(i.position()+u.SIZE_PREFIX_LENGTH),(a||new ds).__init(i.readInt32(i.position())+i.position(),i)}name(i){let a=this.bb.__offset(this.bb_pos,4);return a?this.bb.__string(this.bb_pos+a,i):null}docString(i){let a=this.bb.__offset(this.bb_pos,6);return a?this.bb.__string(this.bb_pos+a,i):null}type(){let i=this.bb.__offset(this.bb_pos,8);return i?this.bb.readInt32(this.bb_pos+i):d.AttributeType.UNDEFINED}f(){let i=this.bb.__offset(this.bb_pos,10);return i?this.bb.readFloat32(this.bb_pos+i):0}i(){let i=this.bb.__offset(this.bb_pos,12);return i?this.bb.readInt64(this.bb_pos+i):BigInt("0")}s(i){let a=this.bb.__offset(this.bb_pos,14);return a?this.bb.__string(this.bb_pos+a,i):null}t(i){let a=this.bb.__offset(this.bb_pos,16);return a?(i||new p.Tensor).__init(this.bb.__indirect(this.bb_pos+a),this.bb):null}g(i){let a=this.bb.__offset(this.bb_pos,18);return a?(i||new l.Graph).__init(this.bb.__indirect(this.bb_pos+a),this.bb):null}floats(i){let a=this.bb.__offset(this.bb_pos,20);return a?this.bb.readFloat32(this.bb.__vector(this.bb_pos+a)+i*4):0}floatsLength(){let i=this.bb.__offset(this.bb_pos,20);return i?this.bb.__vector_len(this.bb_pos+i):0}floatsArray(){let i=this.bb.__offset(this.bb_pos,20);return i?new Float32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+i),this.bb.__vector_len(this.bb_pos+i)):null}ints(i){let a=this.bb.__offset(this.bb_pos,22);return a?this.bb.readInt64(this.bb.__vector(this.bb_pos+a)+i*8):BigInt(0)}intsLength(){let i=this.bb.__offset(this.bb_pos,22);return i?this.bb.__vector_len(this.bb_pos+i):0}strings(i,a){let c=this.bb.__offset(this.bb_pos,24);return c?this.bb.__string(this.bb.__vector(this.bb_pos+c)+i*4,a):null}stringsLength(){let i=this.bb.__offset(this.bb_pos,24);return i?this.bb.__vector_len(this.bb_pos+i):0}tensors(i,a){let c=this.bb.__offset(this.bb_pos,26);return c?(a||new p.Tensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+c)+i*4),this.bb):null}tensorsLength(){let i=this.bb.__offset(this.bb_pos,26);return i?this.bb.__vector_len(this.bb_pos+i):0}graphs(i,a){let c=this.bb.__offset(this.bb_pos,28);return c?(a||new l.Graph).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+c)+i*4),this.bb):null}graphsLength(){let i=this.bb.__offset(this.bb_pos,28);return i?this.bb.__vector_len(this.bb_pos+i):0}static startAttribute(i){i.startObject(13)}static addName(i,a){i.addFieldOffset(0,a,0)}static addDocString(i,a){i.addFieldOffset(1,a,0)}static addType(i,a){i.addFieldInt32(2,a,d.AttributeType.UNDEFINED)}static addF(i,a){i.addFieldFloat32(3,a,0)}static addI(i,a){i.addFieldInt64(4,a,BigInt("0"))}static addS(i,a){i.addFieldOffset(5,a,0)}static addT(i,a){i.addFieldOffset(6,a,0)}static addG(i,a){i.addFieldOffset(7,a,0)}static addFloats(i,a){i.addFieldOffset(8,a,0)}static createFloatsVector(i,a){i.startVector(4,a.length,4);for(let c=a.length-1;c>=0;c--)i.addFloat32(a[c]);return i.endVector()}static startFloatsVector(i,a){i.startVector(4,a,4)}static addInts(i,a){i.addFieldOffset(9,a,0)}static createIntsVector(i,a){i.startVector(8,a.length,8);for(let c=a.length-1;c>=0;c--)i.addInt64(a[c]);return i.endVector()}static startIntsVector(i,a){i.startVector(8,a,8)}static addStrings(i,a){i.addFieldOffset(10,a,0)}static createStringsVector(i,a){i.startVector(4,a.length,4);for(let c=a.length-1;c>=0;c--)i.addOffset(a[c]);return i.endVector()}static startStringsVector(i,a){i.startVector(4,a,4)}static addTensors(i,a){i.addFieldOffset(11,a,0)}static createTensorsVector(i,a){i.startVector(4,a.length,4);for(let c=a.length-1;c>=0;c--)i.addOffset(a[c]);return i.endVector()}static startTensorsVector(i,a){i.startVector(4,a,4)}static addGraphs(i,a){i.addFieldOffset(12,a,0)}static createGraphsVector(i,a){i.startVector(4,a.length,4);for(let c=a.length-1;c>=0;c--)i.addOffset(a[c]);return i.endVector()}static startGraphsVector(i,a){i.startVector(4,a,4)}static endAttribute(i){return i.endObject()}};e.Attribute=o}),Ib=re(e=>{var t=e&&e.__createBinding||(Object.create?function(l,p,o,r){r===void 0&&(r=o);var i=Object.getOwnPropertyDescriptor(p,o);(!i||("get"in i?!p.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return p[o]}}),Object.defineProperty(l,r,i)}:function(l,p,o,r){r===void 0&&(r=o),l[r]=p[o]}),n=e&&e.__setModuleDefault||(Object.create?function(l,p){Object.defineProperty(l,"default",{enumerable:!0,value:p})}:function(l,p){l.default=p}),s=e&&e.__importStar||function(){var l=function(p){return l=Object.getOwnPropertyNames||function(o){var r=[];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(r[r.length]=i);return r},l(p)};return function(p){if(p&&p.__esModule)return p;var o={};if(p!=null)for(var r=l(p),i=0;i<r.length;i++)r[i]!=="default"&&t(o,p,r[i]);return n(o,p),o}}();Object.defineProperty(e,"__esModule",{value:!0}),e.DeprecatedKernelCreateInfos=void 0;var u=s(Pe()),d=class $r{constructor(){this.bb=null,this.bb_pos=0}__init(p,o){return this.bb_pos=p,this.bb=o,this}static getRootAsDeprecatedKernelCreateInfos(p,o){return(o||new $r).__init(p.readInt32(p.position())+p.position(),p)}static getSizePrefixedRootAsDeprecatedKernelCreateInfos(p,o){return p.setPosition(p.position()+u.SIZE_PREFIX_LENGTH),(o||new $r).__init(p.readInt32(p.position())+p.position(),p)}nodeIndices(p){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.readUint32(this.bb.__vector(this.bb_pos+o)+p*4):0}nodeIndicesLength(){let p=this.bb.__offset(this.bb_pos,4);return p?this.bb.__vector_len(this.bb_pos+p):0}nodeIndicesArray(){let p=this.bb.__offset(this.bb_pos,4);return p?new Uint32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+p),this.bb.__vector_len(this.bb_pos+p)):null}kernelDefHashes(p){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.readUint64(this.bb.__vector(this.bb_pos+o)+p*8):BigInt(0)}kernelDefHashesLength(){let p=this.bb.__offset(this.bb_pos,6);return p?this.bb.__vector_len(this.bb_pos+p):0}static startDeprecatedKernelCreateInfos(p){p.startObject(2)}static addNodeIndices(p,o){p.addFieldOffset(0,o,0)}static createNodeIndicesVector(p,o){p.startVector(4,o.length,4);for(let r=o.length-1;r>=0;r--)p.addInt32(o[r]);return p.endVector()}static startNodeIndicesVector(p,o){p.startVector(4,o,4)}static addKernelDefHashes(p,o){p.addFieldOffset(1,o,0)}static createKernelDefHashesVector(p,o){p.startVector(8,o.length,8);for(let r=o.length-1;r>=0;r--)p.addInt64(o[r]);return p.endVector()}static startKernelDefHashesVector(p,o){p.startVector(8,o,8)}static endDeprecatedKernelCreateInfos(p){return p.endObject()}static createDeprecatedKernelCreateInfos(p,o,r){return $r.startDeprecatedKernelCreateInfos(p),$r.addNodeIndices(p,o),$r.addKernelDefHashes(p,r),$r.endDeprecatedKernelCreateInfos(p)}};e.DeprecatedKernelCreateInfos=d}),E$=re(e=>{var t=e&&e.__createBinding||(Object.create?function(l,p,o,r){r===void 0&&(r=o);var i=Object.getOwnPropertyDescriptor(p,o);(!i||("get"in i?!p.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return p[o]}}),Object.defineProperty(l,r,i)}:function(l,p,o,r){r===void 0&&(r=o),l[r]=p[o]}),n=e&&e.__setModuleDefault||(Object.create?function(l,p){Object.defineProperty(l,"default",{enumerable:!0,value:p})}:function(l,p){l.default=p}),s=e&&e.__importStar||function(){var l=function(p){return l=Object.getOwnPropertyNames||function(o){var r=[];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(r[r.length]=i);return r},l(p)};return function(p){if(p&&p.__esModule)return p;var o={};if(p!=null)for(var r=l(p),i=0;i<r.length;i++)r[i]!=="default"&&t(o,p,r[i]);return n(o,p),o}}();Object.defineProperty(e,"__esModule",{value:!0}),e.DeprecatedNodeIndexAndKernelDefHash=void 0;var u=s(Pe()),d=class Tr{constructor(){this.bb=null,this.bb_pos=0}__init(p,o){return this.bb_pos=p,this.bb=o,this}static getRootAsDeprecatedNodeIndexAndKernelDefHash(p,o){return(o||new Tr).__init(p.readInt32(p.position())+p.position(),p)}static getSizePrefixedRootAsDeprecatedNodeIndexAndKernelDefHash(p,o){return p.setPosition(p.position()+u.SIZE_PREFIX_LENGTH),(o||new Tr).__init(p.readInt32(p.position())+p.position(),p)}nodeIndex(){let p=this.bb.__offset(this.bb_pos,4);return p?this.bb.readUint32(this.bb_pos+p):0}kernelDefHash(){let p=this.bb.__offset(this.bb_pos,6);return p?this.bb.readUint64(this.bb_pos+p):BigInt("0")}static startDeprecatedNodeIndexAndKernelDefHash(p){p.startObject(2)}static addNodeIndex(p,o){p.addFieldInt32(0,o,0)}static addKernelDefHash(p,o){p.addFieldInt64(1,o,BigInt("0"))}static endDeprecatedNodeIndexAndKernelDefHash(p){return p.endObject()}static createDeprecatedNodeIndexAndKernelDefHash(p,o,r){return Tr.startDeprecatedNodeIndexAndKernelDefHash(p),Tr.addNodeIndex(p,o),Tr.addKernelDefHash(p,r),Tr.endDeprecatedNodeIndexAndKernelDefHash(p)}};e.DeprecatedNodeIndexAndKernelDefHash=d}),Ob=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.DeprecatedSubGraphSessionState=void 0;var u=s(Pe()),d=Eb(),l=class ps{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsDeprecatedSubGraphSessionState(o,r){return(r||new ps).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsDeprecatedSubGraphSessionState(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new ps).__init(o.readInt32(o.position())+o.position(),o)}graphId(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}sessionState(o){let r=this.bb.__offset(this.bb_pos,6);return r?(o||new d.DeprecatedSessionState).__init(this.bb.__indirect(this.bb_pos+r),this.bb):null}static startDeprecatedSubGraphSessionState(o){o.startObject(2)}static addGraphId(o,r){o.addFieldOffset(0,r,0)}static addSessionState(o,r){o.addFieldOffset(1,r,0)}static endDeprecatedSubGraphSessionState(o){let r=o.endObject();return o.requiredField(r,4),r}};e.DeprecatedSubGraphSessionState=l}),Eb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(o,r,i,a){a===void 0&&(a=i);var c=Object.getOwnPropertyDescriptor(r,i);(!c||("get"in c?!r.__esModule:c.writable||c.configurable))&&(c={enumerable:!0,get:function(){return r[i]}}),Object.defineProperty(o,a,c)}:function(o,r,i,a){a===void 0&&(a=i),o[a]=r[i]}),n=e&&e.__setModuleDefault||(Object.create?function(o,r){Object.defineProperty(o,"default",{enumerable:!0,value:r})}:function(o,r){o.default=r}),s=e&&e.__importStar||function(){var o=function(r){return o=Object.getOwnPropertyNames||function(i){var a=[];for(var c in i)Object.prototype.hasOwnProperty.call(i,c)&&(a[a.length]=c);return a},o(r)};return function(r){if(r&&r.__esModule)return r;var i={};if(r!=null)for(var a=o(r),c=0;c<a.length;c++)a[c]!=="default"&&t(i,r,a[c]);return n(i,r),i}}();Object.defineProperty(e,"__esModule",{value:!0}),e.DeprecatedSessionState=void 0;var u=s(Pe()),d=Ib(),l=Ob(),p=class Sr{constructor(){this.bb=null,this.bb_pos=0}__init(r,i){return this.bb_pos=r,this.bb=i,this}static getRootAsDeprecatedSessionState(r,i){return(i||new Sr).__init(r.readInt32(r.position())+r.position(),r)}static getSizePrefixedRootAsDeprecatedSessionState(r,i){return r.setPosition(r.position()+u.SIZE_PREFIX_LENGTH),(i||new Sr).__init(r.readInt32(r.position())+r.position(),r)}kernels(r){let i=this.bb.__offset(this.bb_pos,4);return i?(r||new d.DeprecatedKernelCreateInfos).__init(this.bb.__indirect(this.bb_pos+i),this.bb):null}subGraphSessionStates(r,i){let a=this.bb.__offset(this.bb_pos,6);return a?(i||new l.DeprecatedSubGraphSessionState).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+a)+r*4),this.bb):null}subGraphSessionStatesLength(){let r=this.bb.__offset(this.bb_pos,6);return r?this.bb.__vector_len(this.bb_pos+r):0}static startDeprecatedSessionState(r){r.startObject(2)}static addKernels(r,i){r.addFieldOffset(0,i,0)}static addSubGraphSessionStates(r,i){r.addFieldOffset(1,i,0)}static createSubGraphSessionStatesVector(r,i){r.startVector(4,i.length,4);for(let a=i.length-1;a>=0;a--)r.addOffset(i[a]);return r.endVector()}static startSubGraphSessionStatesVector(r,i){r.startVector(4,i,4)}static endDeprecatedSessionState(r){return r.endObject()}static createDeprecatedSessionState(r,i,a){return Sr.startDeprecatedSessionState(r),Sr.addKernels(r,i),Sr.addSubGraphSessionStates(r,a),Sr.endDeprecatedSessionState(r)}};e.DeprecatedSessionState=p}),Pb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.KernelTypeStrArgsEntry=void 0;var u=s(Pe()),d=ob(),l=class Ir{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsKernelTypeStrArgsEntry(o,r){return(r||new Ir).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsKernelTypeStrArgsEntry(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new Ir).__init(o.readInt32(o.position())+o.position(),o)}kernelTypeStr(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}args(o,r){let i=this.bb.__offset(this.bb_pos,6);return i?(r||new d.ArgTypeAndIndex).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+o*4),this.bb):null}argsLength(){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.__vector_len(this.bb_pos+o):0}static startKernelTypeStrArgsEntry(o){o.startObject(2)}static addKernelTypeStr(o,r){o.addFieldOffset(0,r,0)}static addArgs(o,r){o.addFieldOffset(1,r,0)}static createArgsVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startArgsVector(o,r){o.startVector(4,r,4)}static endKernelTypeStrArgsEntry(o){let r=o.endObject();return o.requiredField(r,4),r}static createKernelTypeStrArgsEntry(o,r,i){return Ir.startKernelTypeStrArgsEntry(o),Ir.addKernelTypeStr(o,r),Ir.addArgs(o,i),Ir.endKernelTypeStrArgsEntry(o)}};e.KernelTypeStrArgsEntry=l}),Ab=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.OpIdKernelTypeStrArgsEntry=void 0;var u=s(Pe()),d=Pb(),l=class Or{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsOpIdKernelTypeStrArgsEntry(o,r){return(r||new Or).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsOpIdKernelTypeStrArgsEntry(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new Or).__init(o.readInt32(o.position())+o.position(),o)}opId(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}kernelTypeStrArgs(o,r){let i=this.bb.__offset(this.bb_pos,6);return i?(r||new d.KernelTypeStrArgsEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+o*4),this.bb):null}kernelTypeStrArgsLength(){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.__vector_len(this.bb_pos+o):0}static startOpIdKernelTypeStrArgsEntry(o){o.startObject(2)}static addOpId(o,r){o.addFieldOffset(0,r,0)}static addKernelTypeStrArgs(o,r){o.addFieldOffset(1,r,0)}static createKernelTypeStrArgsVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startKernelTypeStrArgsVector(o,r){o.startVector(4,r,4)}static endOpIdKernelTypeStrArgsEntry(o){let r=o.endObject();return o.requiredField(r,4),r}static createOpIdKernelTypeStrArgsEntry(o,r,i){return Or.startOpIdKernelTypeStrArgsEntry(o),Or.addOpId(o,r),Or.addKernelTypeStrArgs(o,i),Or.endOpIdKernelTypeStrArgsEntry(o)}};e.OpIdKernelTypeStrArgsEntry=l}),kb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(p,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(p,i,a)}:function(p,o,r,i){i===void 0&&(i=r),p[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(p,o){Object.defineProperty(p,"default",{enumerable:!0,value:o})}:function(p,o){p.default=o}),s=e&&e.__importStar||function(){var p=function(o){return p=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},p(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=p(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}}();Object.defineProperty(e,"__esModule",{value:!0}),e.KernelTypeStrResolver=void 0;var u=s(Pe()),d=Ab(),l=class Yr{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsKernelTypeStrResolver(o,r){return(r||new Yr).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsKernelTypeStrResolver(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new Yr).__init(o.readInt32(o.position())+o.position(),o)}opKernelTypeStrArgs(o,r){let i=this.bb.__offset(this.bb_pos,4);return i?(r||new d.OpIdKernelTypeStrArgsEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+o*4),this.bb):null}opKernelTypeStrArgsLength(){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.__vector_len(this.bb_pos+o):0}static startKernelTypeStrResolver(o){o.startObject(1)}static addOpKernelTypeStrArgs(o,r){o.addFieldOffset(0,r,0)}static createOpKernelTypeStrArgsVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startOpKernelTypeStrArgsVector(o,r){o.startVector(4,r,4)}static endKernelTypeStrResolver(o){return o.endObject()}static createKernelTypeStrResolver(o,r){return Yr.startKernelTypeStrResolver(o),Yr.addOpKernelTypeStrArgs(o,r),Yr.endKernelTypeStrResolver(o)}};e.KernelTypeStrResolver=l}),Db=re(e=>{var t=e&&e.__createBinding||(Object.create?function(l,p,o,r){r===void 0&&(r=o);var i=Object.getOwnPropertyDescriptor(p,o);(!i||("get"in i?!p.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return p[o]}}),Object.defineProperty(l,r,i)}:function(l,p,o,r){r===void 0&&(r=o),l[r]=p[o]}),n=e&&e.__setModuleDefault||(Object.create?function(l,p){Object.defineProperty(l,"default",{enumerable:!0,value:p})}:function(l,p){l.default=p}),s=e&&e.__importStar||function(){var l=function(p){return l=Object.getOwnPropertyNames||function(o){var r=[];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(r[r.length]=i);return r},l(p)};return function(p){if(p&&p.__esModule)return p;var o={};if(p!=null)for(var r=l(p),i=0;i<r.length;i++)r[i]!=="default"&&t(o,p,r[i]);return n(o,p),o}}();Object.defineProperty(e,"__esModule",{value:!0}),e.OperatorSetId=void 0;var u=s(Pe()),d=class Er{constructor(){this.bb=null,this.bb_pos=0}__init(p,o){return this.bb_pos=p,this.bb=o,this}static getRootAsOperatorSetId(p,o){return(o||new Er).__init(p.readInt32(p.position())+p.position(),p)}static getSizePrefixedRootAsOperatorSetId(p,o){return p.setPosition(p.position()+u.SIZE_PREFIX_LENGTH),(o||new Er).__init(p.readInt32(p.position())+p.position(),p)}domain(p){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.__string(this.bb_pos+o,p):null}version(){let p=this.bb.__offset(this.bb_pos,6);return p?this.bb.readInt64(this.bb_pos+p):BigInt("0")}static startOperatorSetId(p){p.startObject(2)}static addDomain(p,o){p.addFieldOffset(0,o,0)}static addVersion(p,o){p.addFieldInt64(1,o,BigInt("0"))}static endOperatorSetId(p){return p.endObject()}static createOperatorSetId(p,o,r){return Er.startOperatorSetId(p),Er.addDomain(p,o),Er.addVersion(p,r),Er.endOperatorSetId(p)}};e.OperatorSetId=d}),Nb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(l,p,o,r){r===void 0&&(r=o);var i=Object.getOwnPropertyDescriptor(p,o);(!i||("get"in i?!p.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return p[o]}}),Object.defineProperty(l,r,i)}:function(l,p,o,r){r===void 0&&(r=o),l[r]=p[o]}),n=e&&e.__setModuleDefault||(Object.create?function(l,p){Object.defineProperty(l,"default",{enumerable:!0,value:p})}:function(l,p){l.default=p}),s=e&&e.__importStar||function(){var l=function(p){return l=Object.getOwnPropertyNames||function(o){var r=[];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(r[r.length]=i);return r},l(p)};return function(p){if(p&&p.__esModule)return p;var o={};if(p!=null)for(var r=l(p),i=0;i<r.length;i++)r[i]!=="default"&&t(o,p,r[i]);return n(o,p),o}}();Object.defineProperty(e,"__esModule",{value:!0}),e.StringStringEntry=void 0;var u=s(Pe()),d=class Pr{constructor(){this.bb=null,this.bb_pos=0}__init(p,o){return this.bb_pos=p,this.bb=o,this}static getRootAsStringStringEntry(p,o){return(o||new Pr).__init(p.readInt32(p.position())+p.position(),p)}static getSizePrefixedRootAsStringStringEntry(p,o){return p.setPosition(p.position()+u.SIZE_PREFIX_LENGTH),(o||new Pr).__init(p.readInt32(p.position())+p.position(),p)}key(p){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.__string(this.bb_pos+o,p):null}value(p){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.__string(this.bb_pos+o,p):null}static startStringStringEntry(p){p.startObject(2)}static addKey(p,o){p.addFieldOffset(0,o,0)}static addValue(p,o){p.addFieldOffset(1,o,0)}static endStringStringEntry(p){return p.endObject()}static createStringStringEntry(p,o,r){return Pr.startStringStringEntry(p),Pr.addKey(p,o),Pr.addValue(p,r),Pr.endStringStringEntry(p)}};e.StringStringEntry=d}),Cb=re(e=>{var t=e&&e.__createBinding||(Object.create?function(r,i,a,c){c===void 0&&(c=a);var h=Object.getOwnPropertyDescriptor(i,a);(!h||("get"in h?!i.__esModule:h.writable||h.configurable))&&(h={enumerable:!0,get:function(){return i[a]}}),Object.defineProperty(r,c,h)}:function(r,i,a,c){c===void 0&&(c=a),r[c]=i[a]}),n=e&&e.__setModuleDefault||(Object.create?function(r,i){Object.defineProperty(r,"default",{enumerable:!0,value:i})}:function(r,i){r.default=i}),s=e&&e.__importStar||function(){var r=function(i){return r=Object.getOwnPropertyNames||function(a){var c=[];for(var h in a)Object.prototype.hasOwnProperty.call(a,h)&&(c[c.length]=h);return c},r(i)};return function(i){if(i&&i.__esModule)return i;var a={};if(i!=null)for(var c=r(i),h=0;h<c.length;h++)c[h]!=="default"&&t(a,i,c[h]);return n(a,i),a}}();Object.defineProperty(e,"__esModule",{value:!0}),e.Model=void 0;var u=s(Pe()),d=au(),l=Db(),p=Nb(),o=class cs{constructor(){this.bb=null,this.bb_pos=0}__init(i,a){return this.bb_pos=i,this.bb=a,this}static getRootAsModel(i,a){return(a||new cs).__init(i.readInt32(i.position())+i.position(),i)}static getSizePrefixedRootAsModel(i,a){return i.setPosition(i.position()+u.SIZE_PREFIX_LENGTH),(a||new cs).__init(i.readInt32(i.position())+i.position(),i)}irVersion(){let i=this.bb.__offset(this.bb_pos,4);return i?this.bb.readInt64(this.bb_pos+i):BigInt("0")}opsetImport(i,a){let c=this.bb.__offset(this.bb_pos,6);return c?(a||new l.OperatorSetId).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+c)+i*4),this.bb):null}opsetImportLength(){let i=this.bb.__offset(this.bb_pos,6);return i?this.bb.__vector_len(this.bb_pos+i):0}producerName(i){let a=this.bb.__offset(this.bb_pos,8);return a?this.bb.__string(this.bb_pos+a,i):null}producerVersion(i){let a=this.bb.__offset(this.bb_pos,10);return a?this.bb.__string(this.bb_pos+a,i):null}domain(i){let a=this.bb.__offset(this.bb_pos,12);return a?this.bb.__string(this.bb_pos+a,i):null}modelVersion(){let i=this.bb.__offset(this.bb_pos,14);return i?this.bb.readInt64(this.bb_pos+i):BigInt("0")}docString(i){let a=this.bb.__offset(this.bb_pos,16);return a?this.bb.__string(this.bb_pos+a,i):null}graph(i){let a=this.bb.__offset(this.bb_pos,18);return a?(i||new d.Graph).__init(this.bb.__indirect(this.bb_pos+a),this.bb):null}graphDocString(i){let a=this.bb.__offset(this.bb_pos,20);return a?this.bb.__string(this.bb_pos+a,i):null}metadataProps(i,a){let c=this.bb.__offset(this.bb_pos,22);return c?(a||new p.StringStringEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+c)+i*4),this.bb):null}metadataPropsLength(){let i=this.bb.__offset(this.bb_pos,22);return i?this.bb.__vector_len(this.bb_pos+i):0}static startModel(i){i.startObject(10)}static addIrVersion(i,a){i.addFieldInt64(0,a,BigInt("0"))}static addOpsetImport(i,a){i.addFieldOffset(1,a,0)}static createOpsetImportVector(i,a){i.startVector(4,a.length,4);for(let c=a.length-1;c>=0;c--)i.addOffset(a[c]);return i.endVector()}static startOpsetImportVector(i,a){i.startVector(4,a,4)}static addProducerName(i,a){i.addFieldOffset(2,a,0)}static addProducerVersion(i,a){i.addFieldOffset(3,a,0)}static addDomain(i,a){i.addFieldOffset(4,a,0)}static addModelVersion(i,a){i.addFieldInt64(5,a,BigInt("0"))}static addDocString(i,a){i.addFieldOffset(6,a,0)}static addGraph(i,a){i.addFieldOffset(7,a,0)}static addGraphDocString(i,a){i.addFieldOffset(8,a,0)}static addMetadataProps(i,a){i.addFieldOffset(9,a,0)}static createMetadataPropsVector(i,a){i.startVector(4,a.length,4);for(let c=a.length-1;c>=0;c--)i.addOffset(a[c]);return i.endVector()}static startMetadataPropsVector(i,a){i.startVector(4,a,4)}static endModel(i){return i.endObject()}};e.Model=o}),P$=re(e=>{var t=e&&e.__createBinding||(Object.create?function(o,r,i,a){a===void 0&&(a=i);var c=Object.getOwnPropertyDescriptor(r,i);(!c||("get"in c?!r.__esModule:c.writable||c.configurable))&&(c={enumerable:!0,get:function(){return r[i]}}),Object.defineProperty(o,a,c)}:function(o,r,i,a){a===void 0&&(a=i),o[a]=r[i]}),n=e&&e.__setModuleDefault||(Object.create?function(o,r){Object.defineProperty(o,"default",{enumerable:!0,value:r})}:function(o,r){o.default=r}),s=e&&e.__importStar||function(){var o=function(r){return o=Object.getOwnPropertyNames||function(i){var a=[];for(var c in i)Object.prototype.hasOwnProperty.call(i,c)&&(a[a.length]=c);return a},o(r)};return function(r){if(r&&r.__esModule)return r;var i={};if(r!=null)for(var a=o(r),c=0;c<a.length;c++)a[c]!=="default"&&t(i,r,a[c]);return n(i,r),i}}();Object.defineProperty(e,"__esModule",{value:!0}),e.InferenceSession=void 0;var u=s(Pe()),d=kb(),l=Cb(),p=class hs{constructor(){this.bb=null,this.bb_pos=0}__init(r,i){return this.bb_pos=r,this.bb=i,this}static getRootAsInferenceSession(r,i){return(i||new hs).__init(r.readInt32(r.position())+r.position(),r)}static getSizePrefixedRootAsInferenceSession(r,i){return r.setPosition(r.position()+u.SIZE_PREFIX_LENGTH),(i||new hs).__init(r.readInt32(r.position())+r.position(),r)}static bufferHasIdentifier(r){return r.__has_identifier("ORTM")}ortVersion(r){let i=this.bb.__offset(this.bb_pos,4);return i?this.bb.__string(this.bb_pos+i,r):null}model(r){let i=this.bb.__offset(this.bb_pos,6);return i?(r||new l.Model).__init(this.bb.__indirect(this.bb_pos+i),this.bb):null}kernelTypeStrResolver(r){let i=this.bb.__offset(this.bb_pos,10);return i?(r||new d.KernelTypeStrResolver).__init(this.bb.__indirect(this.bb_pos+i),this.bb):null}static startInferenceSession(r){r.startObject(4)}static addOrtVersion(r,i){r.addFieldOffset(0,i,0)}static addModel(r,i){r.addFieldOffset(1,i,0)}static addKernelTypeStrResolver(r,i){r.addFieldOffset(3,i,0)}static endInferenceSession(r){return r.endObject()}static finishInferenceSessionBuffer(r,i){r.finish(i,"ORTM")}static finishSizePrefixedInferenceSessionBuffer(r,i){r.finish(i,"ORTM",!0)}};e.InferenceSession=p}),fs,St,zb,Rb,Bb,Ai,Mb,jb,A$=C(()=>{de(Ym()),de(ob()),fs=de(Sb()),St=de(ab()),de(Ib()),de(E$()),de(Eb()),de(Ob()),de(vb()),de(_b()),de(yb()),de(lb()),zb=de(au()),Rb=de(P$()),de(Pb()),de(kb()),de(mb()),de(Cb()),Bb=de(ub()),de(db()),de(sb()),de(pb()),de(Ab()),de(Db()),de(cb()),de(hb()),de(fb()),de(bb()),de(wb()),de(gb()),de(Nb()),de(Wi()),Ai=de(Hi()),Mb=de(xb()),de(Ki()),jb=de($b()),de(Tb())}),Xi=C(()=>{A$()}),k$=re((e,t)=>{t.exports=n;function n(s,u){for(var d=new Array(arguments.length-1),l=0,p=2,o=!0;p<arguments.length;)d[l++]=arguments[p++];return new Promise(function(r,i){d[l]=function(a){if(o)if(o=!1,a)i(a);else{for(var c=new Array(arguments.length-1),h=0;h<c.length;)c[h++]=arguments[h];r.apply(null,c)}};try{s.apply(u||null,d)}catch(a){o&&(o=!1,i(a))}})}}),D$=re(e=>{var t=e;t.length=function(l){var p=l.length;if(!p)return 0;for(var o=0;--p%4>1&&l.charAt(p)==="=";)++o;return Math.ceil(l.length*3)/4-o};var n=new Array(64),s=new Array(123);for(u=0;u<64;)s[n[u]=u<26?u+65:u<52?u+71:u<62?u-4:u-59|43]=u++;var u;t.encode=function(l,p,o){for(var r=null,i=[],a=0,c=0,h;p<o;){var g=l[p++];switch(c){case 0:i[a++]=n[g>>2],h=(g&3)<<4,c=1;break;case 1:i[a++]=n[h|g>>4],h=(g&15)<<2,c=2;break;case 2:i[a++]=n[h|g>>6],i[a++]=n[g&63],c=0;break}a>8191&&((r||(r=[])).push(String.fromCharCode.apply(String,i)),a=0)}return c&&(i[a++]=n[h],i[a++]=61,c===1&&(i[a++]=61)),r?(a&&r.push(String.fromCharCode.apply(String,i.slice(0,a))),r.join("")):String.fromCharCode.apply(String,i.slice(0,a))};var d="invalid encoding";t.decode=function(l,p,o){for(var r=o,i=0,a,c=0;c<l.length;){var h=l.charCodeAt(c++);if(h===61&&i>1)break;if((h=s[h])===void 0)throw Error(d);switch(i){case 0:a=h,i=1;break;case 1:p[o++]=a<<2|(h&48)>>4,a=h,i=2;break;case 2:p[o++]=(a&15)<<4|(h&60)>>2,a=h,i=3;break;case 3:p[o++]=(a&3)<<6|h,i=0;break}}if(i===1)throw Error(d);return o-r},t.test=function(l){return/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(l)}}),N$=re((e,t)=>{t.exports=n;function n(){this._listeners={}}n.prototype.on=function(s,u,d){return(this._listeners[s]||(this._listeners[s]=[])).push({fn:u,ctx:d||this}),this},n.prototype.off=function(s,u){if(s===void 0)this._listeners={};else if(u===void 0)this._listeners[s]=[];else for(var d=this._listeners[s],l=0;l<d.length;)d[l].fn===u?d.splice(l,1):++l;return this},n.prototype.emit=function(s){var u=this._listeners[s];if(u){for(var d=[],l=1;l<arguments.length;)d.push(arguments[l++]);for(l=0;l<u.length;)u[l].fn.apply(u[l++].ctx,d)}return this}}),C$=re((e,t)=>{t.exports=n(n);function n(p){return typeof Float32Array<"u"?function(){var o=new Float32Array([-0]),r=new Uint8Array(o.buffer),i=r[3]===128;function a(b,x,$){o[0]=b,x[$]=r[0],x[$+1]=r[1],x[$+2]=r[2],x[$+3]=r[3]}function c(b,x,$){o[0]=b,x[$]=r[3],x[$+1]=r[2],x[$+2]=r[1],x[$+3]=r[0]}p.writeFloatLE=i?a:c,p.writeFloatBE=i?c:a;function h(b,x){return r[0]=b[x],r[1]=b[x+1],r[2]=b[x+2],r[3]=b[x+3],o[0]}function g(b,x){return r[3]=b[x],r[2]=b[x+1],r[1]=b[x+2],r[0]=b[x+3],o[0]}p.readFloatLE=i?h:g,p.readFloatBE=i?g:h}():function(){function o(i,a,c,h){var g=a<0?1:0;if(g&&(a=-a),a===0)i(1/a>0?0:2147483648,c,h);else if(isNaN(a))i(2143289344,c,h);else if(a>34028234663852886e22)i((g<<31|2139095040)>>>0,c,h);else if(a<11754943508222875e-54)i((g<<31|Math.round(a/1401298464324817e-60))>>>0,c,h);else{var b=Math.floor(Math.log(a)/Math.LN2),x=Math.round(a*Math.pow(2,-b)*8388608)&8388607;i((g<<31|b+127<<23|x)>>>0,c,h)}}p.writeFloatLE=o.bind(null,s),p.writeFloatBE=o.bind(null,u);function r(i,a,c){var h=i(a,c),g=(h>>31)*2+1,b=h>>>23&255,x=h&8388607;return b===255?x?NaN:g*(1/0):b===0?g*1401298464324817e-60*x:g*Math.pow(2,b-150)*(x+8388608)}p.readFloatLE=r.bind(null,d),p.readFloatBE=r.bind(null,l)}(),typeof Float64Array<"u"?function(){var o=new Float64Array([-0]),r=new Uint8Array(o.buffer),i=r[7]===128;function a(b,x,$){o[0]=b,x[$]=r[0],x[$+1]=r[1],x[$+2]=r[2],x[$+3]=r[3],x[$+4]=r[4],x[$+5]=r[5],x[$+6]=r[6],x[$+7]=r[7]}function c(b,x,$){o[0]=b,x[$]=r[7],x[$+1]=r[6],x[$+2]=r[5],x[$+3]=r[4],x[$+4]=r[3],x[$+5]=r[2],x[$+6]=r[1],x[$+7]=r[0]}p.writeDoubleLE=i?a:c,p.writeDoubleBE=i?c:a;function h(b,x){return r[0]=b[x],r[1]=b[x+1],r[2]=b[x+2],r[3]=b[x+3],r[4]=b[x+4],r[5]=b[x+5],r[6]=b[x+6],r[7]=b[x+7],o[0]}function g(b,x){return r[7]=b[x],r[6]=b[x+1],r[5]=b[x+2],r[4]=b[x+3],r[3]=b[x+4],r[2]=b[x+5],r[1]=b[x+6],r[0]=b[x+7],o[0]}p.readDoubleLE=i?h:g,p.readDoubleBE=i?g:h}():function(){function o(i,a,c,h,g,b){var x=h<0?1:0;if(x&&(h=-h),h===0)i(0,g,b+a),i(1/h>0?0:2147483648,g,b+c);else if(isNaN(h))i(0,g,b+a),i(2146959360,g,b+c);else if(h>17976931348623157e292)i(0,g,b+a),i((x<<31|2146435072)>>>0,g,b+c);else{var $;if(h<22250738585072014e-324)$=h/5e-324,i($>>>0,g,b+a),i((x<<31|$/4294967296)>>>0,g,b+c);else{var _=Math.floor(Math.log(h)/Math.LN2);_===1024&&(_=1023),$=h*Math.pow(2,-_),i($*4503599627370496>>>0,g,b+a),i((x<<31|_+1023<<20|$*1048576&1048575)>>>0,g,b+c)}}}p.writeDoubleLE=o.bind(null,s,0,4),p.writeDoubleBE=o.bind(null,u,4,0);function r(i,a,c,h,g){var b=i(h,g+a),x=i(h,g+c),$=(x>>31)*2+1,_=x>>>20&2047,O=4294967296*(x&1048575)+b;return _===2047?O?NaN:$*(1/0):_===0?$*5e-324*O:$*Math.pow(2,_-1075)*(O+4503599627370496)}p.readDoubleLE=r.bind(null,d,0,4),p.readDoubleBE=r.bind(null,l,4,0)}(),p}function s(p,o,r){o[r]=p&255,o[r+1]=p>>>8&255,o[r+2]=p>>>16&255,o[r+3]=p>>>24}function u(p,o,r){o[r]=p>>>24,o[r+1]=p>>>16&255,o[r+2]=p>>>8&255,o[r+3]=p&255}function d(p,o){return(p[o]|p[o+1]<<8|p[o+2]<<16|p[o+3]<<24)>>>0}function l(p,o){return(p[o]<<24|p[o+1]<<16|p[o+2]<<8|p[o+3])>>>0}}),z$=re((e,t)=>{t.exports=n;function n(s){try{if(typeof Za!="function")return null;var u=Za(s);return u&&(u.length||Object.keys(u).length)?u:null}catch{return null}}}),R$=re(e=>{var t=e,n="�";t.length=function(s){for(var u=0,d=0,l=0;l<s.length;++l)d=s.charCodeAt(l),d<128?u+=1:d<2048?u+=2:(d&64512)===55296&&(s.charCodeAt(l+1)&64512)===56320?(++l,u+=4):u+=3;return u},t.read=function(s,u,d){if(d-u<1)return"";for(var l="",p=u;p<d;){var o=s[p++];if(o<=127)l+=String.fromCharCode(o);else if(o>=192&&o<224){var r=(o&31)<<6|s[p++]&63;l+=r>=128?String.fromCharCode(r):n}else if(o>=224&&o<240){var i=(o&15)<<12|(s[p++]&63)<<6|s[p++]&63;l+=i>=2048?String.fromCharCode(i):n}else if(o>=240){var a=(o&7)<<18|(s[p++]&63)<<12|(s[p++]&63)<<6|s[p++]&63;a<65536||a>1114111?l+=n:(a-=65536,l+=String.fromCharCode(55296+(a>>10)),l+=String.fromCharCode(56320+(a&1023)))}}return l},t.write=function(s,u,d){for(var l=d,p,o,r=0;r<s.length;++r)p=s.charCodeAt(r),p<128?u[d++]=p:p<2048?(u[d++]=p>>6|192,u[d++]=p&63|128):(p&64512)===55296&&((o=s.charCodeAt(r+1))&64512)===56320?(p=65536+((p&1023)<<10)+(o&1023),++r,u[d++]=p>>18|240,u[d++]=p>>12&63|128,u[d++]=p>>6&63|128,u[d++]=p&63|128):(u[d++]=p>>12|224,u[d++]=p>>6&63|128,u[d++]=p&63|128);return d-l}}),B$=re((e,t)=>{t.exports=n;function n(s,u,d){var l=d||8192,p=l>>>1,o=null,r=l;return function(i){if(i<1||i>p)return s(i);r+i>l&&(o=s(l),r=0);var a=u.call(o,r,r+=i);return r&7&&(r=(r|7)+1),a}}}),M$=re((e,t)=>{t.exports=s;var n=qr();function s(p,o){this.lo=p>>>0,this.hi=o>>>0}var u=s.zero=new s(0,0);u.toNumber=function(){return 0},u.zzEncode=u.zzDecode=function(){return this},u.length=function(){return 1};var d=s.zeroHash="\0\0\0\0\0\0\0\0";s.fromNumber=function(p){if(p===0)return u;var o=p<0;o&&(p=-p);var r=p>>>0,i=(p-r)/4294967296>>>0;return o&&(i=~i>>>0,r=~r>>>0,++r>4294967295&&(r=0,++i>4294967295&&(i=0))),new s(r,i)},s.from=function(p){if(typeof p=="number")return s.fromNumber(p);if(n.isString(p))if(n.Long)p=n.Long.fromString(p);else return s.fromNumber(parseInt(p,10));return p.low||p.high?new s(p.low>>>0,p.high>>>0):u},s.prototype.toNumber=function(p){if(!p&&this.hi>>>31){var o=~this.lo+1>>>0,r=~this.hi>>>0;return o||(r=r+1>>>0),-(o+r*4294967296)}return this.lo+this.hi*4294967296},s.prototype.toLong=function(p){return n.Long?new n.Long(this.lo|0,this.hi|0,!!p):{low:this.lo|0,high:this.hi|0,unsigned:!!p}};var l=String.prototype.charCodeAt;s.fromHash=function(p){return p===d?u:new s((l.call(p,0)|l.call(p,1)<<8|l.call(p,2)<<16|l.call(p,3)<<24)>>>0,(l.call(p,4)|l.call(p,5)<<8|l.call(p,6)<<16|l.call(p,7)<<24)>>>0)},s.prototype.toHash=function(){return String.fromCharCode(this.lo&255,this.lo>>>8&255,this.lo>>>16&255,this.lo>>>24,this.hi&255,this.hi>>>8&255,this.hi>>>16&255,this.hi>>>24)},s.prototype.zzEncode=function(){var p=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^p)>>>0,this.lo=(this.lo<<1^p)>>>0,this},s.prototype.zzDecode=function(){var p=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^p)>>>0,this.hi=(this.hi>>>1^p)>>>0,this},s.prototype.length=function(){var p=this.lo,o=(this.lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;return r===0?o===0?p<16384?p<128?1:2:p<2097152?3:4:o<16384?o<128?5:6:o<2097152?7:8:r<128?9:10}}),j$=re((e,t)=>{(function(n,s){function u(d){return d.default||d}typeof define=="function"&&define.amd?define([],function(){var d={};return s(d),u(d)}):typeof e=="object"?(s(e),typeof t=="object"&&(t.exports=u(e))):function(){var d={};s(d),n.Long=u(d)}()})(typeof globalThis<"u"?globalThis:typeof self<"u"?self:e,function(n){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var s=null;try{s=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}function u(w,k,F){this.low=w|0,this.high=k|0,this.unsigned=!!F}u.prototype.__isLong__,Object.defineProperty(u.prototype,"__isLong__",{value:!0});function d(w){return(w&&w.__isLong__)===!0}function l(w){var k=Math.clz32(w&-w);return w?31-k:k}u.isLong=d;var p={},o={};function r(w,k){var F,W,X;return k?(w>>>=0,(X=0<=w&&w<256)&&(W=o[w],W)?W:(F=a(w,0,!0),X&&(o[w]=F),F)):(w|=0,(X=-128<=w&&w<128)&&(W=p[w],W)?W:(F=a(w,w<0?-1:0,!1),X&&(p[w]=F),F))}u.fromInt=r;function i(w,k){if(isNaN(w))return k?A:E;if(k){if(w<0)return A;if(w>=_)return ie}else{if(w<=-O)return K;if(w+1>=O)return U}return w<0?i(-w,k).neg():a(w%$|0,w/$|0,k)}u.fromNumber=i;function a(w,k,F){return new u(w,k,F)}u.fromBits=a;var c=Math.pow;function h(w,k,F){if(w.length===0)throw Error("empty string");if(typeof k=="number"?(F=k,k=!1):k=!!k,w==="NaN"||w==="Infinity"||w==="+Infinity"||w==="-Infinity")return k?A:E;if(F=F||10,F<2||36<F)throw RangeError("radix");var W;if((W=w.indexOf("-"))>0)throw Error("interior hyphen");if(W===0)return h(w.substring(1),k,F).neg();for(var X=i(c(F,8)),Z=E,oe=0;oe<w.length;oe+=8){var j=Math.min(8,w.length-oe),J=parseInt(w.substring(oe,oe+j),F);if(j<8){var H=i(c(F,j));Z=Z.mul(H).add(i(J))}else Z=Z.mul(X),Z=Z.add(i(J))}return Z.unsigned=k,Z}u.fromString=h;function g(w,k){return typeof w=="number"?i(w,k):typeof w=="string"?h(w,k):a(w.low,w.high,typeof k=="boolean"?k:w.unsigned)}u.fromValue=g;var b=65536,x=1<<24,$=b*b,_=$*$,O=_/2,I=r(x),E=r(0);u.ZERO=E;var A=r(0,!0);u.UZERO=A;var D=r(1);u.ONE=D;var S=r(1,!0);u.UONE=S;var L=r(-1);u.NEG_ONE=L;var U=a(-1,2147483647,!1);u.MAX_VALUE=U;var ie=a(-1,-1,!0);u.MAX_UNSIGNED_VALUE=ie;var K=a(0,-2147483648,!1);u.MIN_VALUE=K;var z=u.prototype;z.toInt=function(){return this.unsigned?this.low>>>0:this.low},z.toNumber=function(){return this.unsigned?(this.high>>>0)*$+(this.low>>>0):this.high*$+(this.low>>>0)},z.toString=function(w){if(w=w||10,w<2||36<w)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative())if(this.eq(K)){var k=i(w),F=this.div(k),W=F.mul(k).sub(this);return F.toString(w)+W.toInt().toString(w)}else return"-"+this.neg().toString(w);for(var X=i(c(w,6),this.unsigned),Z=this,oe="";;){var j=Z.div(X),J=Z.sub(j.mul(X)).toInt()>>>0,H=J.toString(w);if(Z=j,Z.isZero())return H+oe;for(;H.length<6;)H="0"+H;oe=""+H+oe}},z.getHighBits=function(){return this.high},z.getHighBitsUnsigned=function(){return this.high>>>0},z.getLowBits=function(){return this.low},z.getLowBitsUnsigned=function(){return this.low>>>0},z.getNumBitsAbs=function(){if(this.isNegative())return this.eq(K)?64:this.neg().getNumBitsAbs();for(var w=this.high!=0?this.high:this.low,k=31;k>0&&!(w&1<<k);k--);return this.high!=0?k+33:k+1},z.isSafeInteger=function(){var w=this.high>>21;return w?this.unsigned?!1:w===-1&&!(this.low===0&&this.high===-2097152):!0},z.isZero=function(){return this.high===0&&this.low===0},z.eqz=z.isZero,z.isNegative=function(){return!this.unsigned&&this.high<0},z.isPositive=function(){return this.unsigned||this.high>=0},z.isOdd=function(){return(this.low&1)===1},z.isEven=function(){return(this.low&1)===0},z.equals=function(w){return d(w)||(w=g(w)),this.unsigned!==w.unsigned&&this.high>>>31===1&&w.high>>>31===1?!1:this.high===w.high&&this.low===w.low},z.eq=z.equals,z.notEquals=function(w){return!this.eq(w)},z.neq=z.notEquals,z.ne=z.notEquals,z.lessThan=function(w){return this.comp(w)<0},z.lt=z.lessThan,z.lessThanOrEqual=function(w){return this.comp(w)<=0},z.lte=z.lessThanOrEqual,z.le=z.lessThanOrEqual,z.greaterThan=function(w){return this.comp(w)>0},z.gt=z.greaterThan,z.greaterThanOrEqual=function(w){return this.comp(w)>=0},z.gte=z.greaterThanOrEqual,z.ge=z.greaterThanOrEqual,z.compare=function(w){if(d(w)||(w=g(w)),this.eq(w))return 0;var k=this.isNegative(),F=w.isNegative();return k&&!F?-1:!k&&F?1:this.unsigned?w.high>>>0>this.high>>>0||w.high===this.high&&w.low>>>0>this.low>>>0?-1:1:this.sub(w).isNegative()?-1:1},z.comp=z.compare,z.negate=function(){return!this.unsigned&&this.eq(K)?K:this.not().add(D)},z.neg=z.negate,z.add=function(w){d(w)||(w=g(w));var k=this.high>>>16,F=this.high&65535,W=this.low>>>16,X=this.low&65535,Z=w.high>>>16,oe=w.high&65535,j=w.low>>>16,J=w.low&65535,H=0,q=0,me=0,Oe=0;return Oe+=X+J,me+=Oe>>>16,Oe&=65535,me+=W+j,q+=me>>>16,me&=65535,q+=F+oe,H+=q>>>16,q&=65535,H+=k+Z,H&=65535,a(me<<16|Oe,H<<16|q,this.unsigned)},z.subtract=function(w){return d(w)||(w=g(w)),this.add(w.neg())},z.sub=z.subtract,z.multiply=function(w){if(this.isZero())return this;if(d(w)||(w=g(w)),s){var k=s.mul(this.low,this.high,w.low,w.high);return a(k,s.get_high(),this.unsigned)}if(w.isZero())return this.unsigned?A:E;if(this.eq(K))return w.isOdd()?K:E;if(w.eq(K))return this.isOdd()?K:E;if(this.isNegative())return w.isNegative()?this.neg().mul(w.neg()):this.neg().mul(w).neg();if(w.isNegative())return this.mul(w.neg()).neg();if(this.lt(I)&&w.lt(I))return i(this.toNumber()*w.toNumber(),this.unsigned);var F=this.high>>>16,W=this.high&65535,X=this.low>>>16,Z=this.low&65535,oe=w.high>>>16,j=w.high&65535,J=w.low>>>16,H=w.low&65535,q=0,me=0,Oe=0,ke=0;return ke+=Z*H,Oe+=ke>>>16,ke&=65535,Oe+=X*H,me+=Oe>>>16,Oe&=65535,Oe+=Z*J,me+=Oe>>>16,Oe&=65535,me+=W*H,q+=me>>>16,me&=65535,me+=X*J,q+=me>>>16,me&=65535,me+=Z*j,q+=me>>>16,me&=65535,q+=F*H+W*J+X*j+Z*oe,q&=65535,a(Oe<<16|ke,q<<16|me,this.unsigned)},z.mul=z.multiply,z.divide=function(w){if(d(w)||(w=g(w)),w.isZero())throw Error("division by zero");if(s){if(!this.unsigned&&this.high===-2147483648&&w.low===-1&&w.high===-1)return this;var k=(this.unsigned?s.div_u:s.div_s)(this.low,this.high,w.low,w.high);return a(k,s.get_high(),this.unsigned)}if(this.isZero())return this.unsigned?A:E;var F,W,X;if(this.unsigned){if(w.unsigned||(w=w.toUnsigned()),w.gt(this))return A;if(w.gt(this.shru(1)))return S;X=A}else{if(this.eq(K)){if(w.eq(D)||w.eq(L))return K;if(w.eq(K))return D;var Z=this.shr(1);return F=Z.div(w).shl(1),F.eq(E)?w.isNegative()?D:L:(W=this.sub(w.mul(F)),X=F.add(W.div(w)),X)}else if(w.eq(K))return this.unsigned?A:E;if(this.isNegative())return w.isNegative()?this.neg().div(w.neg()):this.neg().div(w).neg();if(w.isNegative())return this.div(w.neg()).neg();X=E}for(W=this;W.gte(w);){F=Math.max(1,Math.floor(W.toNumber()/w.toNumber()));for(var oe=Math.ceil(Math.log(F)/Math.LN2),j=oe<=48?1:c(2,oe-48),J=i(F),H=J.mul(w);H.isNegative()||H.gt(W);)F-=j,J=i(F,this.unsigned),H=J.mul(w);J.isZero()&&(J=D),X=X.add(J),W=W.sub(H)}return X},z.div=z.divide,z.modulo=function(w){if(d(w)||(w=g(w)),s){var k=(this.unsigned?s.rem_u:s.rem_s)(this.low,this.high,w.low,w.high);return a(k,s.get_high(),this.unsigned)}return this.sub(this.div(w).mul(w))},z.mod=z.modulo,z.rem=z.modulo,z.not=function(){return a(~this.low,~this.high,this.unsigned)},z.countLeadingZeros=function(){return this.high?Math.clz32(this.high):Math.clz32(this.low)+32},z.clz=z.countLeadingZeros,z.countTrailingZeros=function(){return this.low?l(this.low):l(this.high)+32},z.ctz=z.countTrailingZeros,z.and=function(w){return d(w)||(w=g(w)),a(this.low&w.low,this.high&w.high,this.unsigned)},z.or=function(w){return d(w)||(w=g(w)),a(this.low|w.low,this.high|w.high,this.unsigned)},z.xor=function(w){return d(w)||(w=g(w)),a(this.low^w.low,this.high^w.high,this.unsigned)},z.shiftLeft=function(w){return d(w)&&(w=w.toInt()),(w&=63)===0?this:w<32?a(this.low<<w,this.high<<w|this.low>>>32-w,this.unsigned):a(0,this.low<<w-32,this.unsigned)},z.shl=z.shiftLeft,z.shiftRight=function(w){return d(w)&&(w=w.toInt()),(w&=63)===0?this:w<32?a(this.low>>>w|this.high<<32-w,this.high>>w,this.unsigned):a(this.high>>w-32,this.high>=0?0:-1,this.unsigned)},z.shr=z.shiftRight,z.shiftRightUnsigned=function(w){return d(w)&&(w=w.toInt()),(w&=63)===0?this:w<32?a(this.low>>>w|this.high<<32-w,this.high>>>w,this.unsigned):w===32?a(this.high,0,this.unsigned):a(this.high>>>w-32,0,this.unsigned)},z.shru=z.shiftRightUnsigned,z.shr_u=z.shiftRightUnsigned,z.rotateLeft=function(w){var k;return d(w)&&(w=w.toInt()),(w&=63)===0?this:w===32?a(this.high,this.low,this.unsigned):w<32?(k=32-w,a(this.low<<w|this.high>>>k,this.high<<w|this.low>>>k,this.unsigned)):(w-=32,k=32-w,a(this.high<<w|this.low>>>k,this.low<<w|this.high>>>k,this.unsigned))},z.rotl=z.rotateLeft,z.rotateRight=function(w){var k;return d(w)&&(w=w.toInt()),(w&=63)===0?this:w===32?a(this.high,this.low,this.unsigned):w<32?(k=32-w,a(this.high<<k|this.low>>>w,this.low<<k|this.high>>>w,this.unsigned)):(w-=32,k=32-w,a(this.low<<k|this.high>>>w,this.high<<k|this.low>>>w,this.unsigned))},z.rotr=z.rotateRight,z.toSigned=function(){return this.unsigned?a(this.low,this.high,!1):this},z.toUnsigned=function(){return this.unsigned?this:a(this.low,this.high,!0)},z.toBytes=function(w){return w?this.toBytesLE():this.toBytesBE()},z.toBytesLE=function(){var w=this.high,k=this.low;return[k&255,k>>>8&255,k>>>16&255,k>>>24,w&255,w>>>8&255,w>>>16&255,w>>>24]},z.toBytesBE=function(){var w=this.high,k=this.low;return[w>>>24,w>>>16&255,w>>>8&255,w&255,k>>>24,k>>>16&255,k>>>8&255,k&255]},u.fromBytes=function(w,k,F){return F?u.fromBytesLE(w,k):u.fromBytesBE(w,k)},u.fromBytesLE=function(w,k){return new u(w[0]|w[1]<<8|w[2]<<16|w[3]<<24,w[4]|w[5]<<8|w[6]<<16|w[7]<<24,k)},u.fromBytesBE=function(w,k){return new u(w[4]<<24|w[5]<<16|w[6]<<8|w[7],w[0]<<24|w[1]<<16|w[2]<<8|w[3],k)},typeof BigInt=="function"&&(u.fromBigInt=function(w,k){var F=Number(BigInt.asIntN(32,w)),W=Number(BigInt.asIntN(32,w>>BigInt(32)));return a(F,W,k)},u.fromValue=function(w,k){return typeof w=="bigint"?u.fromBigInt(w,k):g(w,k)},z.toBigInt=function(){var w=BigInt(this.low>>>0),k=BigInt(this.unsigned?this.high>>>0:this.high);return k<<BigInt(32)|w}),n.default=u})}),qr=re(e=>{var t=e;t.asPromise=k$(),t.base64=D$(),t.EventEmitter=N$(),t.float=C$(),t.inquire=z$(),t.utf8=R$(),t.pool=B$(),t.LongBits=M$(),t.isNode=!!(typeof global<"u"&&global&&global.process&&global.process.versions&&global.process.versions.node),t.global=t.isNode&&global||typeof window<"u"&&window||typeof self<"u"&&self||e,t.emptyArray=Object.freeze?Object.freeze([]):[],t.emptyObject=Object.freeze?Object.freeze({}):{},t.isInteger=Number.isInteger||function(u){return typeof u=="number"&&isFinite(u)&&Math.floor(u)===u},t.isString=function(u){return typeof u=="string"||u instanceof String},t.isObject=function(u){return u&&typeof u=="object"},t.isset=t.isSet=function(u,d){var l=u[d];return l!=null&&u.hasOwnProperty(d)?typeof l!="object"||(Array.isArray(l)?l.length:Object.keys(l).length)>0:!1},t.Buffer=function(){try{var u=t.global.Buffer;return u.prototype.utf8Write?u:null}catch{return null}}(),t._Buffer_from=null,t._Buffer_allocUnsafe=null,t.newBuffer=function(u){return typeof u=="number"?t.Buffer?t._Buffer_allocUnsafe(u):new t.Array(u):t.Buffer?t._Buffer_from(u):typeof Uint8Array>"u"?u:new Uint8Array(u)},t.Array=typeof Uint8Array<"u"?Uint8Array:Array,t.Long=t.global.dcodeIO&&t.global.dcodeIO.Long||t.global.Long||function(){try{var u=j$();return u&&u.isLong?u:null}catch{return null}}(),t.key2Re=/^true|false|0|1$/,t.key32Re=/^-?(?:0|[1-9][0-9]*)$/,t.key64Re=/^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/,t.longToHash=function(u){return u?t.LongBits.from(u).toHash():t.LongBits.zeroHash},t.longFromHash=function(u,d){var l=t.LongBits.fromHash(u);return t.Long?t.Long.fromBits(l.lo,l.hi,d):l.toNumber(!!d)};function n(u,d,l){for(var p=Object.keys(d),o=0;o<p.length;++o)(u[p[o]]===void 0||!l)&&p[o]!=="__proto__"&&(u[p[o]]=d[p[o]]);return u}t.merge=n,t.recursionLimit=100,t.makeProp=function(u,d){Object.defineProperty(u,d,{enumerable:!0,configurable:!0,writable:!0})},t.lcFirst=function(u){return u.charAt(0).toLowerCase()+u.substring(1)};function s(u){function d(l,p){if(!(this instanceof d))return new d(l,p);Object.defineProperty(this,"message",{get:function(){return l}}),Error.captureStackTrace?Error.captureStackTrace(this,d):Object.defineProperty(this,"stack",{value:new Error().stack||""}),p&&n(this,p)}return d.prototype=Object.create(Error.prototype,{constructor:{value:d,writable:!0,enumerable:!1,configurable:!0},name:{get:function(){return u},set:void 0,enumerable:!1,configurable:!0},toString:{value:function(){return this.name+": "+this.message},writable:!0,enumerable:!1,configurable:!0}}),d}t.newError=s,t.ProtocolError=s("ProtocolError"),t.oneOfGetter=function(u){for(var d={},l=0;l<u.length;++l)d[u[l]]=1;return function(){for(var p=Object.keys(this),o=p.length-1;o>-1;--o)if(d[p[o]]===1&&this[p[o]]!==void 0&&this[p[o]]!==null)return p[o]}},t.oneOfSetter=function(u){return function(d){for(var l=0;l<u.length;++l)u[l]!==d&&delete this[u[l]]}},t.toJSONOptions={longs:String,enums:String,bytes:String,json:!0},t._configure=function(){var u=t.Buffer;if(!u){t._Buffer_from=t._Buffer_allocUnsafe=null;return}t._Buffer_from=u.from!==Uint8Array.from&&u.from||function(d,l){return new u(d,l)},t._Buffer_allocUnsafe=u.allocUnsafe||function(d){return new u(d)}}}),Fb=re((e,t)=>{t.exports=i;var n=qr(),s,u=n.LongBits,d=n.base64,l=n.utf8;function p(_,O,I){this.fn=_,this.len=O,this.next=void 0,this.val=I}function o(){}function r(_){this.head=_.head,this.tail=_.tail,this.len=_.len,this.next=_.states}function i(){this.len=0,this.head=new p(o,0,0),this.tail=this.head,this.states=null}var a=function(){return n.Buffer?function(){return(i.create=function(){return new s})()}:function(){return new i}};i.create=a(),i.alloc=function(_){return new n.Array(_)},n.Array!==Array&&(i.alloc=n.pool(i.alloc,n.Array.prototype.subarray)),i.prototype._push=function(_,O,I){return this.tail=this.tail.next=new p(_,O,I),this.len+=O,this};function c(_,O,I){O[I]=_&255}function h(_,O,I){for(;_>127;)O[I++]=_&127|128,_>>>=7;O[I]=_}function g(_,O){this.len=_,this.next=void 0,this.val=O}g.prototype=Object.create(p.prototype),g.prototype.fn=h,i.prototype.uint32=function(_){return this.len+=(this.tail=this.tail.next=new g((_=_>>>0)<128?1:_<16384?2:_<2097152?3:_<268435456?4:5,_)).len,this},i.prototype.int32=function(_){return _<0?this._push(b,10,u.fromNumber(_)):this.uint32(_)},i.prototype.sint32=function(_){return this.uint32((_<<1^_>>31)>>>0)};function b(_,O,I){for(;_.hi;)O[I++]=_.lo&127|128,_.lo=(_.lo>>>7|_.hi<<25)>>>0,_.hi>>>=7;for(;_.lo>127;)O[I++]=_.lo&127|128,_.lo=_.lo>>>7;O[I++]=_.lo}i.prototype.uint64=function(_){var O=u.from(_);return this._push(b,O.length(),O)},i.prototype.int64=i.prototype.uint64,i.prototype.sint64=function(_){var O=u.from(_).zzEncode();return this._push(b,O.length(),O)},i.prototype.bool=function(_){return this._push(c,1,_?1:0)};function x(_,O,I){O[I]=_&255,O[I+1]=_>>>8&255,O[I+2]=_>>>16&255,O[I+3]=_>>>24}i.prototype.fixed32=function(_){return this._push(x,4,_>>>0)},i.prototype.sfixed32=i.prototype.fixed32,i.prototype.fixed64=function(_){var O=u.from(_);return this._push(x,4,O.lo)._push(x,4,O.hi)},i.prototype.sfixed64=i.prototype.fixed64,i.prototype.float=function(_){return this._push(n.float.writeFloatLE,4,_)},i.prototype.double=function(_){return this._push(n.float.writeDoubleLE,8,_)};var $=n.Array.prototype.set?function(_,O,I){O.set(_,I)}:function(_,O,I){for(var E=0;E<_.length;++E)O[I+E]=_[E]};i.prototype.bytes=function(_){var O=_.length>>>0;if(!O)return this._push(c,1,0);if(n.isString(_)){var I=i.alloc(O=d.length(_));d.decode(_,I,0),_=I}return this.uint32(O)._push($,O,_)},i.prototype.string=function(_){var O=l.length(_);return O?this.uint32(O)._push(l.write,O,_):this._push(c,1,0)},i.prototype.fork=function(){return this.states=new r(this),this.head=this.tail=new p(o,0,0),this.len=0,this},i.prototype.reset=function(){return this.states?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new p(o,0,0),this.len=0),this},i.prototype.ldelim=function(){var _=this.head,O=this.tail,I=this.len;return this.reset().uint32(I),I&&(this.tail.next=_.next,this.tail=O,this.len+=I),this},i.prototype.finish=function(){for(var _=this.head.next,O=this.constructor.alloc(this.len),I=0;_;)_.fn(_.val,O,I),I+=_.len,_=_.next;return O},i._configure=function(_){s=_,i.create=a(),s._configure()}}),F$=re((e,t)=>{t.exports=u;var n=Fb();(u.prototype=Object.create(n.prototype)).constructor=u;var s=qr();function u(){n.call(this)}u._configure=function(){u.alloc=s._Buffer_allocUnsafe,u.writeBytesBuffer=s.Buffer&&s.Buffer.prototype instanceof Uint8Array&&s.Buffer.prototype.set.name==="set"?function(l,p,o){p.set(l,o)}:function(l,p,o){if(l.copy)l.copy(p,o,0,l.length);else for(var r=0;r<l.length;)p[o++]=l[r++]}},u.prototype.bytes=function(l){s.isString(l)&&(l=s._Buffer_from(l,"base64"));var p=l.length>>>0;return this.uint32(p),p&&this._push(u.writeBytesBuffer,p,l),this};function d(l,p,o){l.length<40?s.utf8.write(l,p,o):p.utf8Write?p.utf8Write(l,o):p.write(l,o)}u.prototype.string=function(l){var p=s.Buffer.byteLength(l);return this.uint32(p),p&&this._push(d,p,l),this},u._configure()}),Lb=re((e,t)=>{t.exports=p;var n=qr(),s,u=n.LongBits,d=n.utf8;function l(h,g){return RangeError("index out of range: "+h.pos+" + "+(g||1)+" > "+h.len)}function p(h){this.buf=h,this.pos=0,this.len=h.length}var o=typeof Uint8Array<"u"?function(h){if(h instanceof Uint8Array||Array.isArray(h))return new p(h);throw Error("illegal buffer")}:function(h){if(Array.isArray(h))return new p(h);throw Error("illegal buffer")},r=function(){return n.Buffer?function(h){return(p.create=function(g){return n.Buffer.isBuffer(g)?new s(g):o(g)})(h)}:o};p.create=r(),p.prototype._slice=n.Array.prototype.subarray||n.Array.prototype.slice,p.prototype.uint32=function(){var h=4294967295;return function(){if(h=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(h=(h|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(h=(h|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(h=(h|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(h=(h|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return h;if((this.pos+=5)>this.len)throw this.pos=this.len,l(this,10);return h}}(),p.prototype.int32=function(){return this.uint32()|0},p.prototype.sint32=function(){var h=this.uint32();return h>>>1^-(h&1)|0};function i(){var h=new u(0,0),g=0;if(this.len-this.pos>4){for(;g<4;++g)if(h.lo=(h.lo|(this.buf[this.pos]&127)<<g*7)>>>0,this.buf[this.pos++]<128)return h;if(h.lo=(h.lo|(this.buf[this.pos]&127)<<28)>>>0,h.hi=(h.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return h;g=0}else{for(;g<3;++g){if(this.pos>=this.len)throw l(this);if(h.lo=(h.lo|(this.buf[this.pos]&127)<<g*7)>>>0,this.buf[this.pos++]<128)return h}return h.lo=(h.lo|(this.buf[this.pos++]&127)<<g*7)>>>0,h}if(this.len-this.pos>4){for(;g<5;++g)if(h.hi=(h.hi|(this.buf[this.pos]&127)<<g*7+3)>>>0,this.buf[this.pos++]<128)return h}else for(;g<5;++g){if(this.pos>=this.len)throw l(this);if(h.hi=(h.hi|(this.buf[this.pos]&127)<<g*7+3)>>>0,this.buf[this.pos++]<128)return h}throw Error("invalid varint encoding")}p.prototype.bool=function(){return this.uint32()!==0};function a(h,g){return(h[g-4]|h[g-3]<<8|h[g-2]<<16|h[g-1]<<24)>>>0}p.prototype.fixed32=function(){if(this.pos+4>this.len)throw l(this,4);return a(this.buf,this.pos+=4)},p.prototype.sfixed32=function(){if(this.pos+4>this.len)throw l(this,4);return a(this.buf,this.pos+=4)|0};function c(){if(this.pos+8>this.len)throw l(this,8);return new u(a(this.buf,this.pos+=4),a(this.buf,this.pos+=4))}p.prototype.float=function(){if(this.pos+4>this.len)throw l(this,4);var h=n.float.readFloatLE(this.buf,this.pos);return this.pos+=4,h},p.prototype.double=function(){if(this.pos+8>this.len)throw l(this,4);var h=n.float.readDoubleLE(this.buf,this.pos);return this.pos+=8,h},p.prototype.bytes=function(){var h=this.uint32(),g=this.pos,b=this.pos+h;if(b>this.len)throw l(this,h);if(this.pos+=h,Array.isArray(this.buf))return this.buf.slice(g,b);if(g===b){var x=n.Buffer;return x?x.alloc(0):new this.buf.constructor(0)}return this._slice.call(this.buf,g,b)},p.prototype.string=function(){var h=this.bytes();return d.read(h,0,h.length)},p.prototype.skip=function(h){if(typeof h=="number"){if(this.pos+h>this.len)throw l(this,h);this.pos+=h}else do if(this.pos>=this.len)throw l(this);while(this.buf[this.pos++]&128);return this},p.recursionLimit=n.recursionLimit,p.prototype.skipType=function(h,g){if(g===void 0&&(g=0),g>p.recursionLimit)throw Error("maximum nesting depth exceeded");switch(h){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(h=this.uint32()&7)!==4;)this.skipType(h,g+1);break;case 5:this.skip(4);break;default:throw Error("invalid wire type "+h+" at offset "+this.pos)}return this},p._configure=function(h){s=h,p.create=r(),s._configure();var g=n.Long?"toLong":"toNumber";n.merge(p.prototype,{int64:function(){return i.call(this)[g](!1)},uint64:function(){return i.call(this)[g](!0)},sint64:function(){return i.call(this).zzDecode()[g](!1)},fixed64:function(){return c.call(this)[g](!0)},sfixed64:function(){return c.call(this)[g](!1)}})}}),L$=re((e,t)=>{t.exports=u;var n=Lb();(u.prototype=Object.create(n.prototype)).constructor=u;var s=qr();function u(d){n.call(this,d)}u._configure=function(){s.Buffer&&(u.prototype._slice=s.Buffer.prototype.slice)},u.prototype.string=function(){var d=this.uint32();return this.buf.utf8Slice?this.buf.utf8Slice(this.pos,this.pos=Math.min(this.pos+d,this.len)):this.buf.toString("utf-8",this.pos,this.pos=Math.min(this.pos+d,this.len))},u._configure()}),V$=re((e,t)=>{t.exports=s;var n=qr();(s.prototype=Object.create(n.EventEmitter.prototype)).constructor=s;function s(u,d,l){if(typeof u!="function")throw TypeError("rpcImpl must be a function");n.EventEmitter.call(this),this.rpcImpl=u,this.requestDelimited=!!d,this.responseDelimited=!!l}s.prototype.rpcCall=function u(d,l,p,o,r){if(!o)throw TypeError("request must be specified");var i=this;if(!r)return n.asPromise(u,i,d,l,p,o);if(!i.rpcImpl){setTimeout(function(){r(Error("already ended"))},0);return}try{return i.rpcImpl(d,l[i.requestDelimited?"encodeDelimited":"encode"](o).finish(),function(a,c){if(a)return i.emit("error",a,d),r(a);if(c===null){i.end(!0);return}if(!(c instanceof p))try{c=p[i.responseDelimited?"decodeDelimited":"decode"](c)}catch(h){return i.emit("error",h,d),r(h)}return i.emit("data",c,d),r(null,c)})}catch(a){i.emit("error",a,d),setTimeout(function(){r(a)},0);return}},s.prototype.end=function(u){return this.rpcImpl&&(u||this.rpcImpl(null,null,null),this.rpcImpl=null,this.emit("end").off()),this}}),U$=re(e=>{var t=e;t.Service=V$()}),q$=re((e,t)=>{t.exports={}}),G$=re(e=>{var t=e;t.build="minimal",t.Writer=Fb(),t.BufferWriter=F$(),t.Reader=Lb(),t.BufferReader=L$(),t.util=qr(),t.rpc=U$(),t.roots=q$(),t.configure=n;function n(){t.util._configure(),t.Writer._configure(t.BufferWriter),t.Reader._configure(t.BufferReader)}n()}),H$=re((e,t)=>{t.exports=G$()}),Zn=re((e,t)=>{var n=H$(),s=n.Reader,u=n.Writer,d=n.util,l=n.roots.default||(n.roots.default={});l.onnx=function(){var p={};return p.Version=function(){var o={},r=Object.create(o);return r[o[0]="_START_VERSION"]=0,r[o[1]="IR_VERSION_2017_10_10"]=1,r[o[2]="IR_VERSION_2017_10_30"]=2,r[o[3]="IR_VERSION_2017_11_3"]=3,r[o[4]="IR_VERSION_2019_1_22"]=4,r[o[5]="IR_VERSION_2019_3_18"]=5,r[o[6]="IR_VERSION_2019_9_19"]=6,r[o[7]="IR_VERSION_2020_5_8"]=7,r[o[8]="IR_VERSION_2021_7_30"]=8,r[o[9]="IR_VERSION"]=9,r}(),p.AttributeProto=function(){function o(r){if(this.floats=[],this.ints=[],this.strings=[],this.tensors=[],this.graphs=[],this.sparseTensors=[],this.typeProtos=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.name="",o.prototype.refAttrName="",o.prototype.docString="",o.prototype.type=0,o.prototype.f=0,o.prototype.i=d.Long?d.Long.fromBits(0,0,!1):0,o.prototype.s=d.newBuffer([]),o.prototype.t=null,o.prototype.g=null,o.prototype.sparseTensor=null,o.prototype.tp=null,o.prototype.floats=d.emptyArray,o.prototype.ints=d.emptyArray,o.prototype.strings=d.emptyArray,o.prototype.tensors=d.emptyArray,o.prototype.graphs=d.emptyArray,o.prototype.sparseTensors=d.emptyArray,o.prototype.typeProtos=d.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.name!=null&&Object.hasOwnProperty.call(r,"name")&&i.uint32(10).string(r.name),r.f!=null&&Object.hasOwnProperty.call(r,"f")&&i.uint32(21).float(r.f),r.i!=null&&Object.hasOwnProperty.call(r,"i")&&i.uint32(24).int64(r.i),r.s!=null&&Object.hasOwnProperty.call(r,"s")&&i.uint32(34).bytes(r.s),r.t!=null&&Object.hasOwnProperty.call(r,"t")&&l.onnx.TensorProto.encode(r.t,i.uint32(42).fork()).ldelim(),r.g!=null&&Object.hasOwnProperty.call(r,"g")&&l.onnx.GraphProto.encode(r.g,i.uint32(50).fork()).ldelim(),r.floats!=null&&r.floats.length){i.uint32(58).fork();for(var a=0;a<r.floats.length;++a)i.float(r.floats[a]);i.ldelim()}if(r.ints!=null&&r.ints.length){i.uint32(66).fork();for(var a=0;a<r.ints.length;++a)i.int64(r.ints[a]);i.ldelim()}if(r.strings!=null&&r.strings.length)for(var a=0;a<r.strings.length;++a)i.uint32(74).bytes(r.strings[a]);if(r.tensors!=null&&r.tensors.length)for(var a=0;a<r.tensors.length;++a)l.onnx.TensorProto.encode(r.tensors[a],i.uint32(82).fork()).ldelim();if(r.graphs!=null&&r.graphs.length)for(var a=0;a<r.graphs.length;++a)l.onnx.GraphProto.encode(r.graphs[a],i.uint32(90).fork()).ldelim();if(r.docString!=null&&Object.hasOwnProperty.call(r,"docString")&&i.uint32(106).string(r.docString),r.tp!=null&&Object.hasOwnProperty.call(r,"tp")&&l.onnx.TypeProto.encode(r.tp,i.uint32(114).fork()).ldelim(),r.typeProtos!=null&&r.typeProtos.length)for(var a=0;a<r.typeProtos.length;++a)l.onnx.TypeProto.encode(r.typeProtos[a],i.uint32(122).fork()).ldelim();if(r.type!=null&&Object.hasOwnProperty.call(r,"type")&&i.uint32(160).int32(r.type),r.refAttrName!=null&&Object.hasOwnProperty.call(r,"refAttrName")&&i.uint32(170).string(r.refAttrName),r.sparseTensor!=null&&Object.hasOwnProperty.call(r,"sparseTensor")&&l.onnx.SparseTensorProto.encode(r.sparseTensor,i.uint32(178).fork()).ldelim(),r.sparseTensors!=null&&r.sparseTensors.length)for(var a=0;a<r.sparseTensors.length;++a)l.onnx.SparseTensorProto.encode(r.sparseTensors[a],i.uint32(186).fork()).ldelim();return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new l.onnx.AttributeProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.name=r.string();break}case 21:{c.refAttrName=r.string();break}case 13:{c.docString=r.string();break}case 20:{c.type=r.int32();break}case 2:{c.f=r.float();break}case 3:{c.i=r.int64();break}case 4:{c.s=r.bytes();break}case 5:{c.t=l.onnx.TensorProto.decode(r,r.uint32());break}case 6:{c.g=l.onnx.GraphProto.decode(r,r.uint32());break}case 22:{c.sparseTensor=l.onnx.SparseTensorProto.decode(r,r.uint32());break}case 14:{c.tp=l.onnx.TypeProto.decode(r,r.uint32());break}case 7:{if(c.floats&&c.floats.length||(c.floats=[]),(h&7)===2)for(var g=r.uint32()+r.pos;r.pos<g;)c.floats.push(r.float());else c.floats.push(r.float());break}case 8:{if(c.ints&&c.ints.length||(c.ints=[]),(h&7)===2)for(var g=r.uint32()+r.pos;r.pos<g;)c.ints.push(r.int64());else c.ints.push(r.int64());break}case 9:{c.strings&&c.strings.length||(c.strings=[]),c.strings.push(r.bytes());break}case 10:{c.tensors&&c.tensors.length||(c.tensors=[]),c.tensors.push(l.onnx.TensorProto.decode(r,r.uint32()));break}case 11:{c.graphs&&c.graphs.length||(c.graphs=[]),c.graphs.push(l.onnx.GraphProto.decode(r,r.uint32()));break}case 23:{c.sparseTensors&&c.sparseTensors.length||(c.sparseTensors=[]),c.sparseTensors.push(l.onnx.SparseTensorProto.decode(r,r.uint32()));break}case 15:{c.typeProtos&&c.typeProtos.length||(c.typeProtos=[]),c.typeProtos.push(l.onnx.TypeProto.decode(r,r.uint32()));break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.name!=null&&r.hasOwnProperty("name")&&!d.isString(r.name))return"name: string expected";if(r.refAttrName!=null&&r.hasOwnProperty("refAttrName")&&!d.isString(r.refAttrName))return"refAttrName: string expected";if(r.docString!=null&&r.hasOwnProperty("docString")&&!d.isString(r.docString))return"docString: string expected";if(r.type!=null&&r.hasOwnProperty("type"))switch(r.type){default:return"type: enum value expected";case 0:case 1:case 2:case 3:case 4:case 5:case 11:case 13:case 6:case 7:case 8:case 9:case 10:case 12:case 14:break}if(r.f!=null&&r.hasOwnProperty("f")&&typeof r.f!="number")return"f: number expected";if(r.i!=null&&r.hasOwnProperty("i")&&!d.isInteger(r.i)&&!(r.i&&d.isInteger(r.i.low)&&d.isInteger(r.i.high)))return"i: integer|Long expected";if(r.s!=null&&r.hasOwnProperty("s")&&!(r.s&&typeof r.s.length=="number"||d.isString(r.s)))return"s: buffer expected";if(r.t!=null&&r.hasOwnProperty("t")){var i=l.onnx.TensorProto.verify(r.t);if(i)return"t."+i}if(r.g!=null&&r.hasOwnProperty("g")){var i=l.onnx.GraphProto.verify(r.g);if(i)return"g."+i}if(r.sparseTensor!=null&&r.hasOwnProperty("sparseTensor")){var i=l.onnx.SparseTensorProto.verify(r.sparseTensor);if(i)return"sparseTensor."+i}if(r.tp!=null&&r.hasOwnProperty("tp")){var i=l.onnx.TypeProto.verify(r.tp);if(i)return"tp."+i}if(r.floats!=null&&r.hasOwnProperty("floats")){if(!Array.isArray(r.floats))return"floats: array expected";for(var a=0;a<r.floats.length;++a)if(typeof r.floats[a]!="number")return"floats: number[] expected"}if(r.ints!=null&&r.hasOwnProperty("ints")){if(!Array.isArray(r.ints))return"ints: array expected";for(var a=0;a<r.ints.length;++a)if(!d.isInteger(r.ints[a])&&!(r.ints[a]&&d.isInteger(r.ints[a].low)&&d.isInteger(r.ints[a].high)))return"ints: integer|Long[] expected"}if(r.strings!=null&&r.hasOwnProperty("strings")){if(!Array.isArray(r.strings))return"strings: array expected";for(var a=0;a<r.strings.length;++a)if(!(r.strings[a]&&typeof r.strings[a].length=="number"||d.isString(r.strings[a])))return"strings: buffer[] expected"}if(r.tensors!=null&&r.hasOwnProperty("tensors")){if(!Array.isArray(r.tensors))return"tensors: array expected";for(var a=0;a<r.tensors.length;++a){var i=l.onnx.TensorProto.verify(r.tensors[a]);if(i)return"tensors."+i}}if(r.graphs!=null&&r.hasOwnProperty("graphs")){if(!Array.isArray(r.graphs))return"graphs: array expected";for(var a=0;a<r.graphs.length;++a){var i=l.onnx.GraphProto.verify(r.graphs[a]);if(i)return"graphs."+i}}if(r.sparseTensors!=null&&r.hasOwnProperty("sparseTensors")){if(!Array.isArray(r.sparseTensors))return"sparseTensors: array expected";for(var a=0;a<r.sparseTensors.length;++a){var i=l.onnx.SparseTensorProto.verify(r.sparseTensors[a]);if(i)return"sparseTensors."+i}}if(r.typeProtos!=null&&r.hasOwnProperty("typeProtos")){if(!Array.isArray(r.typeProtos))return"typeProtos: array expected";for(var a=0;a<r.typeProtos.length;++a){var i=l.onnx.TypeProto.verify(r.typeProtos[a]);if(i)return"typeProtos."+i}}return null},o.fromObject=function(r){if(r instanceof l.onnx.AttributeProto)return r;var i=new l.onnx.AttributeProto;switch(r.name!=null&&(i.name=String(r.name)),r.refAttrName!=null&&(i.refAttrName=String(r.refAttrName)),r.docString!=null&&(i.docString=String(r.docString)),r.type){default:if(typeof r.type=="number"){i.type=r.type;break}break;case"UNDEFINED":case 0:i.type=0;break;case"FLOAT":case 1:i.type=1;break;case"INT":case 2:i.type=2;break;case"STRING":case 3:i.type=3;break;case"TENSOR":case 4:i.type=4;break;case"GRAPH":case 5:i.type=5;break;case"SPARSE_TENSOR":case 11:i.type=11;break;case"TYPE_PROTO":case 13:i.type=13;break;case"FLOATS":case 6:i.type=6;break;case"INTS":case 7:i.type=7;break;case"STRINGS":case 8:i.type=8;break;case"TENSORS":case 9:i.type=9;break;case"GRAPHS":case 10:i.type=10;break;case"SPARSE_TENSORS":case 12:i.type=12;break;case"TYPE_PROTOS":case 14:i.type=14;break}if(r.f!=null&&(i.f=Number(r.f)),r.i!=null&&(d.Long?(i.i=d.Long.fromValue(r.i)).unsigned=!1:typeof r.i=="string"?i.i=parseInt(r.i,10):typeof r.i=="number"?i.i=r.i:typeof r.i=="object"&&(i.i=new d.LongBits(r.i.low>>>0,r.i.high>>>0).toNumber())),r.s!=null&&(typeof r.s=="string"?d.base64.decode(r.s,i.s=d.newBuffer(d.base64.length(r.s)),0):r.s.length>=0&&(i.s=r.s)),r.t!=null){if(typeof r.t!="object")throw TypeError(".onnx.AttributeProto.t: object expected");i.t=l.onnx.TensorProto.fromObject(r.t)}if(r.g!=null){if(typeof r.g!="object")throw TypeError(".onnx.AttributeProto.g: object expected");i.g=l.onnx.GraphProto.fromObject(r.g)}if(r.sparseTensor!=null){if(typeof r.sparseTensor!="object")throw TypeError(".onnx.AttributeProto.sparseTensor: object expected");i.sparseTensor=l.onnx.SparseTensorProto.fromObject(r.sparseTensor)}if(r.tp!=null){if(typeof r.tp!="object")throw TypeError(".onnx.AttributeProto.tp: object expected");i.tp=l.onnx.TypeProto.fromObject(r.tp)}if(r.floats){if(!Array.isArray(r.floats))throw TypeError(".onnx.AttributeProto.floats: array expected");i.floats=[];for(var a=0;a<r.floats.length;++a)i.floats[a]=Number(r.floats[a])}if(r.ints){if(!Array.isArray(r.ints))throw TypeError(".onnx.AttributeProto.ints: array expected");i.ints=[];for(var a=0;a<r.ints.length;++a)d.Long?(i.ints[a]=d.Long.fromValue(r.ints[a])).unsigned=!1:typeof r.ints[a]=="string"?i.ints[a]=parseInt(r.ints[a],10):typeof r.ints[a]=="number"?i.ints[a]=r.ints[a]:typeof r.ints[a]=="object"&&(i.ints[a]=new d.LongBits(r.ints[a].low>>>0,r.ints[a].high>>>0).toNumber())}if(r.strings){if(!Array.isArray(r.strings))throw TypeError(".onnx.AttributeProto.strings: array expected");i.strings=[];for(var a=0;a<r.strings.length;++a)typeof r.strings[a]=="string"?d.base64.decode(r.strings[a],i.strings[a]=d.newBuffer(d.base64.length(r.strings[a])),0):r.strings[a].length>=0&&(i.strings[a]=r.strings[a])}if(r.tensors){if(!Array.isArray(r.tensors))throw TypeError(".onnx.AttributeProto.tensors: array expected");i.tensors=[];for(var a=0;a<r.tensors.length;++a){if(typeof r.tensors[a]!="object")throw TypeError(".onnx.AttributeProto.tensors: object expected");i.tensors[a]=l.onnx.TensorProto.fromObject(r.tensors[a])}}if(r.graphs){if(!Array.isArray(r.graphs))throw TypeError(".onnx.AttributeProto.graphs: array expected");i.graphs=[];for(var a=0;a<r.graphs.length;++a){if(typeof r.graphs[a]!="object")throw TypeError(".onnx.AttributeProto.graphs: object expected");i.graphs[a]=l.onnx.GraphProto.fromObject(r.graphs[a])}}if(r.sparseTensors){if(!Array.isArray(r.sparseTensors))throw TypeError(".onnx.AttributeProto.sparseTensors: array expected");i.sparseTensors=[];for(var a=0;a<r.sparseTensors.length;++a){if(typeof r.sparseTensors[a]!="object")throw TypeError(".onnx.AttributeProto.sparseTensors: object expected");i.sparseTensors[a]=l.onnx.SparseTensorProto.fromObject(r.sparseTensors[a])}}if(r.typeProtos){if(!Array.isArray(r.typeProtos))throw TypeError(".onnx.AttributeProto.typeProtos: array expected");i.typeProtos=[];for(var a=0;a<r.typeProtos.length;++a){if(typeof r.typeProtos[a]!="object")throw TypeError(".onnx.AttributeProto.typeProtos: object expected");i.typeProtos[a]=l.onnx.TypeProto.fromObject(r.typeProtos[a])}}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.floats=[],a.ints=[],a.strings=[],a.tensors=[],a.graphs=[],a.typeProtos=[],a.sparseTensors=[]),i.defaults){if(a.name="",a.f=0,d.Long){var c=new d.Long(0,0,!1);a.i=i.longs===String?c.toString():i.longs===Number?c.toNumber():c}else a.i=i.longs===String?"0":0;i.bytes===String?a.s="":(a.s=[],i.bytes!==Array&&(a.s=d.newBuffer(a.s))),a.t=null,a.g=null,a.docString="",a.tp=null,a.type=i.enums===String?"UNDEFINED":0,a.refAttrName="",a.sparseTensor=null}if(r.name!=null&&r.hasOwnProperty("name")&&(a.name=r.name),r.f!=null&&r.hasOwnProperty("f")&&(a.f=i.json&&!isFinite(r.f)?String(r.f):r.f),r.i!=null&&r.hasOwnProperty("i")&&(typeof r.i=="number"?a.i=i.longs===String?String(r.i):r.i:a.i=i.longs===String?d.Long.prototype.toString.call(r.i):i.longs===Number?new d.LongBits(r.i.low>>>0,r.i.high>>>0).toNumber():r.i),r.s!=null&&r.hasOwnProperty("s")&&(a.s=i.bytes===String?d.base64.encode(r.s,0,r.s.length):i.bytes===Array?Array.prototype.slice.call(r.s):r.s),r.t!=null&&r.hasOwnProperty("t")&&(a.t=l.onnx.TensorProto.toObject(r.t,i)),r.g!=null&&r.hasOwnProperty("g")&&(a.g=l.onnx.GraphProto.toObject(r.g,i)),r.floats&&r.floats.length){a.floats=[];for(var h=0;h<r.floats.length;++h)a.floats[h]=i.json&&!isFinite(r.floats[h])?String(r.floats[h]):r.floats[h]}if(r.ints&&r.ints.length){a.ints=[];for(var h=0;h<r.ints.length;++h)typeof r.ints[h]=="number"?a.ints[h]=i.longs===String?String(r.ints[h]):r.ints[h]:a.ints[h]=i.longs===String?d.Long.prototype.toString.call(r.ints[h]):i.longs===Number?new d.LongBits(r.ints[h].low>>>0,r.ints[h].high>>>0).toNumber():r.ints[h]}if(r.strings&&r.strings.length){a.strings=[];for(var h=0;h<r.strings.length;++h)a.strings[h]=i.bytes===String?d.base64.encode(r.strings[h],0,r.strings[h].length):i.bytes===Array?Array.prototype.slice.call(r.strings[h]):r.strings[h]}if(r.tensors&&r.tensors.length){a.tensors=[];for(var h=0;h<r.tensors.length;++h)a.tensors[h]=l.onnx.TensorProto.toObject(r.tensors[h],i)}if(r.graphs&&r.graphs.length){a.graphs=[];for(var h=0;h<r.graphs.length;++h)a.graphs[h]=l.onnx.GraphProto.toObject(r.graphs[h],i)}if(r.docString!=null&&r.hasOwnProperty("docString")&&(a.docString=r.docString),r.tp!=null&&r.hasOwnProperty("tp")&&(a.tp=l.onnx.TypeProto.toObject(r.tp,i)),r.typeProtos&&r.typeProtos.length){a.typeProtos=[];for(var h=0;h<r.typeProtos.length;++h)a.typeProtos[h]=l.onnx.TypeProto.toObject(r.typeProtos[h],i)}if(r.type!=null&&r.hasOwnProperty("type")&&(a.type=i.enums===String?l.onnx.AttributeProto.AttributeType[r.type]===void 0?r.type:l.onnx.AttributeProto.AttributeType[r.type]:r.type),r.refAttrName!=null&&r.hasOwnProperty("refAttrName")&&(a.refAttrName=r.refAttrName),r.sparseTensor!=null&&r.hasOwnProperty("sparseTensor")&&(a.sparseTensor=l.onnx.SparseTensorProto.toObject(r.sparseTensor,i)),r.sparseTensors&&r.sparseTensors.length){a.sparseTensors=[];for(var h=0;h<r.sparseTensors.length;++h)a.sparseTensors[h]=l.onnx.SparseTensorProto.toObject(r.sparseTensors[h],i)}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.AttributeProto"},o.AttributeType=function(){var r={},i=Object.create(r);return i[r[0]="UNDEFINED"]=0,i[r[1]="FLOAT"]=1,i[r[2]="INT"]=2,i[r[3]="STRING"]=3,i[r[4]="TENSOR"]=4,i[r[5]="GRAPH"]=5,i[r[11]="SPARSE_TENSOR"]=11,i[r[13]="TYPE_PROTO"]=13,i[r[6]="FLOATS"]=6,i[r[7]="INTS"]=7,i[r[8]="STRINGS"]=8,i[r[9]="TENSORS"]=9,i[r[10]="GRAPHS"]=10,i[r[12]="SPARSE_TENSORS"]=12,i[r[14]="TYPE_PROTOS"]=14,i}(),o}(),p.ValueInfoProto=function(){function o(r){if(r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.name="",o.prototype.type=null,o.prototype.docString="",o.create=function(r){return new o(r)},o.encode=function(r,i){return i||(i=u.create()),r.name!=null&&Object.hasOwnProperty.call(r,"name")&&i.uint32(10).string(r.name),r.type!=null&&Object.hasOwnProperty.call(r,"type")&&l.onnx.TypeProto.encode(r.type,i.uint32(18).fork()).ldelim(),r.docString!=null&&Object.hasOwnProperty.call(r,"docString")&&i.uint32(26).string(r.docString),i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new l.onnx.ValueInfoProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.name=r.string();break}case 2:{c.type=l.onnx.TypeProto.decode(r,r.uint32());break}case 3:{c.docString=r.string();break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.name!=null&&r.hasOwnProperty("name")&&!d.isString(r.name))return"name: string expected";if(r.type!=null&&r.hasOwnProperty("type")){var i=l.onnx.TypeProto.verify(r.type);if(i)return"type."+i}return r.docString!=null&&r.hasOwnProperty("docString")&&!d.isString(r.docString)?"docString: string expected":null},o.fromObject=function(r){if(r instanceof l.onnx.ValueInfoProto)return r;var i=new l.onnx.ValueInfoProto;if(r.name!=null&&(i.name=String(r.name)),r.type!=null){if(typeof r.type!="object")throw TypeError(".onnx.ValueInfoProto.type: object expected");i.type=l.onnx.TypeProto.fromObject(r.type)}return r.docString!=null&&(i.docString=String(r.docString)),i},o.toObject=function(r,i){i||(i={});var a={};return i.defaults&&(a.name="",a.type=null,a.docString=""),r.name!=null&&r.hasOwnProperty("name")&&(a.name=r.name),r.type!=null&&r.hasOwnProperty("type")&&(a.type=l.onnx.TypeProto.toObject(r.type,i)),r.docString!=null&&r.hasOwnProperty("docString")&&(a.docString=r.docString),a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.ValueInfoProto"},o}(),p.NodeProto=function(){function o(r){if(this.input=[],this.output=[],this.attribute=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.input=d.emptyArray,o.prototype.output=d.emptyArray,o.prototype.name="",o.prototype.opType="",o.prototype.domain="",o.prototype.attribute=d.emptyArray,o.prototype.docString="",o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.input!=null&&r.input.length)for(var a=0;a<r.input.length;++a)i.uint32(10).string(r.input[a]);if(r.output!=null&&r.output.length)for(var a=0;a<r.output.length;++a)i.uint32(18).string(r.output[a]);if(r.name!=null&&Object.hasOwnProperty.call(r,"name")&&i.uint32(26).string(r.name),r.opType!=null&&Object.hasOwnProperty.call(r,"opType")&&i.uint32(34).string(r.opType),r.attribute!=null&&r.attribute.length)for(var a=0;a<r.attribute.length;++a)l.onnx.AttributeProto.encode(r.attribute[a],i.uint32(42).fork()).ldelim();return r.docString!=null&&Object.hasOwnProperty.call(r,"docString")&&i.uint32(50).string(r.docString),r.domain!=null&&Object.hasOwnProperty.call(r,"domain")&&i.uint32(58).string(r.domain),i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new l.onnx.NodeProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.input&&c.input.length||(c.input=[]),c.input.push(r.string());break}case 2:{c.output&&c.output.length||(c.output=[]),c.output.push(r.string());break}case 3:{c.name=r.string();break}case 4:{c.opType=r.string();break}case 7:{c.domain=r.string();break}case 5:{c.attribute&&c.attribute.length||(c.attribute=[]),c.attribute.push(l.onnx.AttributeProto.decode(r,r.uint32()));break}case 6:{c.docString=r.string();break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.input!=null&&r.hasOwnProperty("input")){if(!Array.isArray(r.input))return"input: array expected";for(var i=0;i<r.input.length;++i)if(!d.isString(r.input[i]))return"input: string[] expected"}if(r.output!=null&&r.hasOwnProperty("output")){if(!Array.isArray(r.output))return"output: array expected";for(var i=0;i<r.output.length;++i)if(!d.isString(r.output[i]))return"output: string[] expected"}if(r.name!=null&&r.hasOwnProperty("name")&&!d.isString(r.name))return"name: string expected";if(r.opType!=null&&r.hasOwnProperty("opType")&&!d.isString(r.opType))return"opType: string expected";if(r.domain!=null&&r.hasOwnProperty("domain")&&!d.isString(r.domain))return"domain: string expected";if(r.attribute!=null&&r.hasOwnProperty("attribute")){if(!Array.isArray(r.attribute))return"attribute: array expected";for(var i=0;i<r.attribute.length;++i){var a=l.onnx.AttributeProto.verify(r.attribute[i]);if(a)return"attribute."+a}}return r.docString!=null&&r.hasOwnProperty("docString")&&!d.isString(r.docString)?"docString: string expected":null},o.fromObject=function(r){if(r instanceof l.onnx.NodeProto)return r;var i=new l.onnx.NodeProto;if(r.input){if(!Array.isArray(r.input))throw TypeError(".onnx.NodeProto.input: array expected");i.input=[];for(var a=0;a<r.input.length;++a)i.input[a]=String(r.input[a])}if(r.output){if(!Array.isArray(r.output))throw TypeError(".onnx.NodeProto.output: array expected");i.output=[];for(var a=0;a<r.output.length;++a)i.output[a]=String(r.output[a])}if(r.name!=null&&(i.name=String(r.name)),r.opType!=null&&(i.opType=String(r.opType)),r.domain!=null&&(i.domain=String(r.domain)),r.attribute){if(!Array.isArray(r.attribute))throw TypeError(".onnx.NodeProto.attribute: array expected");i.attribute=[];for(var a=0;a<r.attribute.length;++a){if(typeof r.attribute[a]!="object")throw TypeError(".onnx.NodeProto.attribute: object expected");i.attribute[a]=l.onnx.AttributeProto.fromObject(r.attribute[a])}}return r.docString!=null&&(i.docString=String(r.docString)),i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.input=[],a.output=[],a.attribute=[]),i.defaults&&(a.name="",a.opType="",a.docString="",a.domain=""),r.input&&r.input.length){a.input=[];for(var c=0;c<r.input.length;++c)a.input[c]=r.input[c]}if(r.output&&r.output.length){a.output=[];for(var c=0;c<r.output.length;++c)a.output[c]=r.output[c]}if(r.name!=null&&r.hasOwnProperty("name")&&(a.name=r.name),r.opType!=null&&r.hasOwnProperty("opType")&&(a.opType=r.opType),r.attribute&&r.attribute.length){a.attribute=[];for(var c=0;c<r.attribute.length;++c)a.attribute[c]=l.onnx.AttributeProto.toObject(r.attribute[c],i)}return r.docString!=null&&r.hasOwnProperty("docString")&&(a.docString=r.docString),r.domain!=null&&r.hasOwnProperty("domain")&&(a.domain=r.domain),a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.NodeProto"},o}(),p.TrainingInfoProto=function(){function o(r){if(this.initializationBinding=[],this.updateBinding=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.initialization=null,o.prototype.algorithm=null,o.prototype.initializationBinding=d.emptyArray,o.prototype.updateBinding=d.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.initialization!=null&&Object.hasOwnProperty.call(r,"initialization")&&l.onnx.GraphProto.encode(r.initialization,i.uint32(10).fork()).ldelim(),r.algorithm!=null&&Object.hasOwnProperty.call(r,"algorithm")&&l.onnx.GraphProto.encode(r.algorithm,i.uint32(18).fork()).ldelim(),r.initializationBinding!=null&&r.initializationBinding.length)for(var a=0;a<r.initializationBinding.length;++a)l.onnx.StringStringEntryProto.encode(r.initializationBinding[a],i.uint32(26).fork()).ldelim();if(r.updateBinding!=null&&r.updateBinding.length)for(var a=0;a<r.updateBinding.length;++a)l.onnx.StringStringEntryProto.encode(r.updateBinding[a],i.uint32(34).fork()).ldelim();return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new l.onnx.TrainingInfoProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.initialization=l.onnx.GraphProto.decode(r,r.uint32());break}case 2:{c.algorithm=l.onnx.GraphProto.decode(r,r.uint32());break}case 3:{c.initializationBinding&&c.initializationBinding.length||(c.initializationBinding=[]),c.initializationBinding.push(l.onnx.StringStringEntryProto.decode(r,r.uint32()));break}case 4:{c.updateBinding&&c.updateBinding.length||(c.updateBinding=[]),c.updateBinding.push(l.onnx.StringStringEntryProto.decode(r,r.uint32()));break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.initialization!=null&&r.hasOwnProperty("initialization")){var i=l.onnx.GraphProto.verify(r.initialization);if(i)return"initialization."+i}if(r.algorithm!=null&&r.hasOwnProperty("algorithm")){var i=l.onnx.GraphProto.verify(r.algorithm);if(i)return"algorithm."+i}if(r.initializationBinding!=null&&r.hasOwnProperty("initializationBinding")){if(!Array.isArray(r.initializationBinding))return"initializationBinding: array expected";for(var a=0;a<r.initializationBinding.length;++a){var i=l.onnx.StringStringEntryProto.verify(r.initializationBinding[a]);if(i)return"initializationBinding."+i}}if(r.updateBinding!=null&&r.hasOwnProperty("updateBinding")){if(!Array.isArray(r.updateBinding))return"updateBinding: array expected";for(var a=0;a<r.updateBinding.length;++a){var i=l.onnx.StringStringEntryProto.verify(r.updateBinding[a]);if(i)return"updateBinding."+i}}return null},o.fromObject=function(r){if(r instanceof l.onnx.TrainingInfoProto)return r;var i=new l.onnx.TrainingInfoProto;if(r.initialization!=null){if(typeof r.initialization!="object")throw TypeError(".onnx.TrainingInfoProto.initialization: object expected");i.initialization=l.onnx.GraphProto.fromObject(r.initialization)}if(r.algorithm!=null){if(typeof r.algorithm!="object")throw TypeError(".onnx.TrainingInfoProto.algorithm: object expected");i.algorithm=l.onnx.GraphProto.fromObject(r.algorithm)}if(r.initializationBinding){if(!Array.isArray(r.initializationBinding))throw TypeError(".onnx.TrainingInfoProto.initializationBinding: array expected");i.initializationBinding=[];for(var a=0;a<r.initializationBinding.length;++a){if(typeof r.initializationBinding[a]!="object")throw TypeError(".onnx.TrainingInfoProto.initializationBinding: object expected");i.initializationBinding[a]=l.onnx.StringStringEntryProto.fromObject(r.initializationBinding[a])}}if(r.updateBinding){if(!Array.isArray(r.updateBinding))throw TypeError(".onnx.TrainingInfoProto.updateBinding: array expected");i.updateBinding=[];for(var a=0;a<r.updateBinding.length;++a){if(typeof r.updateBinding[a]!="object")throw TypeError(".onnx.TrainingInfoProto.updateBinding: object expected");i.updateBinding[a]=l.onnx.StringStringEntryProto.fromObject(r.updateBinding[a])}}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.initializationBinding=[],a.updateBinding=[]),i.defaults&&(a.initialization=null,a.algorithm=null),r.initialization!=null&&r.hasOwnProperty("initialization")&&(a.initialization=l.onnx.GraphProto.toObject(r.initialization,i)),r.algorithm!=null&&r.hasOwnProperty("algorithm")&&(a.algorithm=l.onnx.GraphProto.toObject(r.algorithm,i)),r.initializationBinding&&r.initializationBinding.length){a.initializationBinding=[];for(var c=0;c<r.initializationBinding.length;++c)a.initializationBinding[c]=l.onnx.StringStringEntryProto.toObject(r.initializationBinding[c],i)}if(r.updateBinding&&r.updateBinding.length){a.updateBinding=[];for(var c=0;c<r.updateBinding.length;++c)a.updateBinding[c]=l.onnx.StringStringEntryProto.toObject(r.updateBinding[c],i)}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.TrainingInfoProto"},o}(),p.ModelProto=function(){function o(r){if(this.opsetImport=[],this.metadataProps=[],this.trainingInfo=[],this.functions=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.irVersion=d.Long?d.Long.fromBits(0,0,!1):0,o.prototype.opsetImport=d.emptyArray,o.prototype.producerName="",o.prototype.producerVersion="",o.prototype.domain="",o.prototype.modelVersion=d.Long?d.Long.fromBits(0,0,!1):0,o.prototype.docString="",o.prototype.graph=null,o.prototype.metadataProps=d.emptyArray,o.prototype.trainingInfo=d.emptyArray,o.prototype.functions=d.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.irVersion!=null&&Object.hasOwnProperty.call(r,"irVersion")&&i.uint32(8).int64(r.irVersion),r.producerName!=null&&Object.hasOwnProperty.call(r,"producerName")&&i.uint32(18).string(r.producerName),r.producerVersion!=null&&Object.hasOwnProperty.call(r,"producerVersion")&&i.uint32(26).string(r.producerVersion),r.domain!=null&&Object.hasOwnProperty.call(r,"domain")&&i.uint32(34).string(r.domain),r.modelVersion!=null&&Object.hasOwnProperty.call(r,"modelVersion")&&i.uint32(40).int64(r.modelVersion),r.docString!=null&&Object.hasOwnProperty.call(r,"docString")&&i.uint32(50).string(r.docString),r.graph!=null&&Object.hasOwnProperty.call(r,"graph")&&l.onnx.GraphProto.encode(r.graph,i.uint32(58).fork()).ldelim(),r.opsetImport!=null&&r.opsetImport.length)for(var a=0;a<r.opsetImport.length;++a)l.onnx.OperatorSetIdProto.encode(r.opsetImport[a],i.uint32(66).fork()).ldelim();if(r.metadataProps!=null&&r.metadataProps.length)for(var a=0;a<r.metadataProps.length;++a)l.onnx.StringStringEntryProto.encode(r.metadataProps[a],i.uint32(114).fork()).ldelim();if(r.trainingInfo!=null&&r.trainingInfo.length)for(var a=0;a<r.trainingInfo.length;++a)l.onnx.TrainingInfoProto.encode(r.trainingInfo[a],i.uint32(162).fork()).ldelim();if(r.functions!=null&&r.functions.length)for(var a=0;a<r.functions.length;++a)l.onnx.FunctionProto.encode(r.functions[a],i.uint32(202).fork()).ldelim();return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new l.onnx.ModelProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.irVersion=r.int64();break}case 8:{c.opsetImport&&c.opsetImport.length||(c.opsetImport=[]),c.opsetImport.push(l.onnx.OperatorSetIdProto.decode(r,r.uint32()));break}case 2:{c.producerName=r.string();break}case 3:{c.producerVersion=r.string();break}case 4:{c.domain=r.string();break}case 5:{c.modelVersion=r.int64();break}case 6:{c.docString=r.string();break}case 7:{c.graph=l.onnx.GraphProto.decode(r,r.uint32());break}case 14:{c.metadataProps&&c.metadataProps.length||(c.metadataProps=[]),c.metadataProps.push(l.onnx.StringStringEntryProto.decode(r,r.uint32()));break}case 20:{c.trainingInfo&&c.trainingInfo.length||(c.trainingInfo=[]),c.trainingInfo.push(l.onnx.TrainingInfoProto.decode(r,r.uint32()));break}case 25:{c.functions&&c.functions.length||(c.functions=[]),c.functions.push(l.onnx.FunctionProto.decode(r,r.uint32()));break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.irVersion!=null&&r.hasOwnProperty("irVersion")&&!d.isInteger(r.irVersion)&&!(r.irVersion&&d.isInteger(r.irVersion.low)&&d.isInteger(r.irVersion.high)))return"irVersion: integer|Long expected";if(r.opsetImport!=null&&r.hasOwnProperty("opsetImport")){if(!Array.isArray(r.opsetImport))return"opsetImport: array expected";for(var i=0;i<r.opsetImport.length;++i){var a=l.onnx.OperatorSetIdProto.verify(r.opsetImport[i]);if(a)return"opsetImport."+a}}if(r.producerName!=null&&r.hasOwnProperty("producerName")&&!d.isString(r.producerName))return"producerName: string expected";if(r.producerVersion!=null&&r.hasOwnProperty("producerVersion")&&!d.isString(r.producerVersion))return"producerVersion: string expected";if(r.domain!=null&&r.hasOwnProperty("domain")&&!d.isString(r.domain))return"domain: string expected";if(r.modelVersion!=null&&r.hasOwnProperty("modelVersion")&&!d.isInteger(r.modelVersion)&&!(r.modelVersion&&d.isInteger(r.modelVersion.low)&&d.isInteger(r.modelVersion.high)))return"modelVersion: integer|Long expected";if(r.docString!=null&&r.hasOwnProperty("docString")&&!d.isString(r.docString))return"docString: string expected";if(r.graph!=null&&r.hasOwnProperty("graph")){var a=l.onnx.GraphProto.verify(r.graph);if(a)return"graph."+a}if(r.metadataProps!=null&&r.hasOwnProperty("metadataProps")){if(!Array.isArray(r.metadataProps))return"metadataProps: array expected";for(var i=0;i<r.metadataProps.length;++i){var a=l.onnx.StringStringEntryProto.verify(r.metadataProps[i]);if(a)return"metadataProps."+a}}if(r.trainingInfo!=null&&r.hasOwnProperty("trainingInfo")){if(!Array.isArray(r.trainingInfo))return"trainingInfo: array expected";for(var i=0;i<r.trainingInfo.length;++i){var a=l.onnx.TrainingInfoProto.verify(r.trainingInfo[i]);if(a)return"trainingInfo."+a}}if(r.functions!=null&&r.hasOwnProperty("functions")){if(!Array.isArray(r.functions))return"functions: array expected";for(var i=0;i<r.functions.length;++i){var a=l.onnx.FunctionProto.verify(r.functions[i]);if(a)return"functions."+a}}return null},o.fromObject=function(r){if(r instanceof l.onnx.ModelProto)return r;var i=new l.onnx.ModelProto;if(r.irVersion!=null&&(d.Long?(i.irVersion=d.Long.fromValue(r.irVersion)).unsigned=!1:typeof r.irVersion=="string"?i.irVersion=parseInt(r.irVersion,10):typeof r.irVersion=="number"?i.irVersion=r.irVersion:typeof r.irVersion=="object"&&(i.irVersion=new d.LongBits(r.irVersion.low>>>0,r.irVersion.high>>>0).toNumber())),r.opsetImport){if(!Array.isArray(r.opsetImport))throw TypeError(".onnx.ModelProto.opsetImport: array expected");i.opsetImport=[];for(var a=0;a<r.opsetImport.length;++a){if(typeof r.opsetImport[a]!="object")throw TypeError(".onnx.ModelProto.opsetImport: object expected");i.opsetImport[a]=l.onnx.OperatorSetIdProto.fromObject(r.opsetImport[a])}}if(r.producerName!=null&&(i.producerName=String(r.producerName)),r.producerVersion!=null&&(i.producerVersion=String(r.producerVersion)),r.domain!=null&&(i.domain=String(r.domain)),r.modelVersion!=null&&(d.Long?(i.modelVersion=d.Long.fromValue(r.modelVersion)).unsigned=!1:typeof r.modelVersion=="string"?i.modelVersion=parseInt(r.modelVersion,10):typeof r.modelVersion=="number"?i.modelVersion=r.modelVersion:typeof r.modelVersion=="object"&&(i.modelVersion=new d.LongBits(r.modelVersion.low>>>0,r.modelVersion.high>>>0).toNumber())),r.docString!=null&&(i.docString=String(r.docString)),r.graph!=null){if(typeof r.graph!="object")throw TypeError(".onnx.ModelProto.graph: object expected");i.graph=l.onnx.GraphProto.fromObject(r.graph)}if(r.metadataProps){if(!Array.isArray(r.metadataProps))throw TypeError(".onnx.ModelProto.metadataProps: array expected");i.metadataProps=[];for(var a=0;a<r.metadataProps.length;++a){if(typeof r.metadataProps[a]!="object")throw TypeError(".onnx.ModelProto.metadataProps: object expected");i.metadataProps[a]=l.onnx.StringStringEntryProto.fromObject(r.metadataProps[a])}}if(r.trainingInfo){if(!Array.isArray(r.trainingInfo))throw TypeError(".onnx.ModelProto.trainingInfo: array expected");i.trainingInfo=[];for(var a=0;a<r.trainingInfo.length;++a){if(typeof r.trainingInfo[a]!="object")throw TypeError(".onnx.ModelProto.trainingInfo: object expected");i.trainingInfo[a]=l.onnx.TrainingInfoProto.fromObject(r.trainingInfo[a])}}if(r.functions){if(!Array.isArray(r.functions))throw TypeError(".onnx.ModelProto.functions: array expected");i.functions=[];for(var a=0;a<r.functions.length;++a){if(typeof r.functions[a]!="object")throw TypeError(".onnx.ModelProto.functions: object expected");i.functions[a]=l.onnx.FunctionProto.fromObject(r.functions[a])}}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.opsetImport=[],a.metadataProps=[],a.trainingInfo=[],a.functions=[]),i.defaults){if(d.Long){var c=new d.Long(0,0,!1);a.irVersion=i.longs===String?c.toString():i.longs===Number?c.toNumber():c}else a.irVersion=i.longs===String?"0":0;if(a.producerName="",a.producerVersion="",a.domain="",d.Long){var c=new d.Long(0,0,!1);a.modelVersion=i.longs===String?c.toString():i.longs===Number?c.toNumber():c}else a.modelVersion=i.longs===String?"0":0;a.docString="",a.graph=null}if(r.irVersion!=null&&r.hasOwnProperty("irVersion")&&(typeof r.irVersion=="number"?a.irVersion=i.longs===String?String(r.irVersion):r.irVersion:a.irVersion=i.longs===String?d.Long.prototype.toString.call(r.irVersion):i.longs===Number?new d.LongBits(r.irVersion.low>>>0,r.irVersion.high>>>0).toNumber():r.irVersion),r.producerName!=null&&r.hasOwnProperty("producerName")&&(a.producerName=r.producerName),r.producerVersion!=null&&r.hasOwnProperty("producerVersion")&&(a.producerVersion=r.producerVersion),r.domain!=null&&r.hasOwnProperty("domain")&&(a.domain=r.domain),r.modelVersion!=null&&r.hasOwnProperty("modelVersion")&&(typeof r.modelVersion=="number"?a.modelVersion=i.longs===String?String(r.modelVersion):r.modelVersion:a.modelVersion=i.longs===String?d.Long.prototype.toString.call(r.modelVersion):i.longs===Number?new d.LongBits(r.modelVersion.low>>>0,r.modelVersion.high>>>0).toNumber():r.modelVersion),r.docString!=null&&r.hasOwnProperty("docString")&&(a.docString=r.docString),r.graph!=null&&r.hasOwnProperty("graph")&&(a.graph=l.onnx.GraphProto.toObject(r.graph,i)),r.opsetImport&&r.opsetImport.length){a.opsetImport=[];for(var h=0;h<r.opsetImport.length;++h)a.opsetImport[h]=l.onnx.OperatorSetIdProto.toObject(r.opsetImport[h],i)}if(r.metadataProps&&r.metadataProps.length){a.metadataProps=[];for(var h=0;h<r.metadataProps.length;++h)a.metadataProps[h]=l.onnx.StringStringEntryProto.toObject(r.metadataProps[h],i)}if(r.trainingInfo&&r.trainingInfo.length){a.trainingInfo=[];for(var h=0;h<r.trainingInfo.length;++h)a.trainingInfo[h]=l.onnx.TrainingInfoProto.toObject(r.trainingInfo[h],i)}if(r.functions&&r.functions.length){a.functions=[];for(var h=0;h<r.functions.length;++h)a.functions[h]=l.onnx.FunctionProto.toObject(r.functions[h],i)}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.ModelProto"},o}(),p.StringStringEntryProto=function(){function o(r){if(r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.key="",o.prototype.value="",o.create=function(r){return new o(r)},o.encode=function(r,i){return i||(i=u.create()),r.key!=null&&Object.hasOwnProperty.call(r,"key")&&i.uint32(10).string(r.key),r.value!=null&&Object.hasOwnProperty.call(r,"value")&&i.uint32(18).string(r.value),i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new l.onnx.StringStringEntryProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.key=r.string();break}case 2:{c.value=r.string();break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){return typeof r!="object"||r===null?"object expected":r.key!=null&&r.hasOwnProperty("key")&&!d.isString(r.key)?"key: string expected":r.value!=null&&r.hasOwnProperty("value")&&!d.isString(r.value)?"value: string expected":null},o.fromObject=function(r){if(r instanceof l.onnx.StringStringEntryProto)return r;var i=new l.onnx.StringStringEntryProto;return r.key!=null&&(i.key=String(r.key)),r.value!=null&&(i.value=String(r.value)),i},o.toObject=function(r,i){i||(i={});var a={};return i.defaults&&(a.key="",a.value=""),r.key!=null&&r.hasOwnProperty("key")&&(a.key=r.key),r.value!=null&&r.hasOwnProperty("value")&&(a.value=r.value),a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.StringStringEntryProto"},o}(),p.TensorAnnotation=function(){function o(r){if(this.quantParameterTensorNames=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.tensorName="",o.prototype.quantParameterTensorNames=d.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.tensorName!=null&&Object.hasOwnProperty.call(r,"tensorName")&&i.uint32(10).string(r.tensorName),r.quantParameterTensorNames!=null&&r.quantParameterTensorNames.length)for(var a=0;a<r.quantParameterTensorNames.length;++a)l.onnx.StringStringEntryProto.encode(r.quantParameterTensorNames[a],i.uint32(18).fork()).ldelim();return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new l.onnx.TensorAnnotation;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.tensorName=r.string();break}case 2:{c.quantParameterTensorNames&&c.quantParameterTensorNames.length||(c.quantParameterTensorNames=[]),c.quantParameterTensorNames.push(l.onnx.StringStringEntryProto.decode(r,r.uint32()));break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.tensorName!=null&&r.hasOwnProperty("tensorName")&&!d.isString(r.tensorName))return"tensorName: string expected";if(r.quantParameterTensorNames!=null&&r.hasOwnProperty("quantParameterTensorNames")){if(!Array.isArray(r.quantParameterTensorNames))return"quantParameterTensorNames: array expected";for(var i=0;i<r.quantParameterTensorNames.length;++i){var a=l.onnx.StringStringEntryProto.verify(r.quantParameterTensorNames[i]);if(a)return"quantParameterTensorNames."+a}}return null},o.fromObject=function(r){if(r instanceof l.onnx.TensorAnnotation)return r;var i=new l.onnx.TensorAnnotation;if(r.tensorName!=null&&(i.tensorName=String(r.tensorName)),r.quantParameterTensorNames){if(!Array.isArray(r.quantParameterTensorNames))throw TypeError(".onnx.TensorAnnotation.quantParameterTensorNames: array expected");i.quantParameterTensorNames=[];for(var a=0;a<r.quantParameterTensorNames.length;++a){if(typeof r.quantParameterTensorNames[a]!="object")throw TypeError(".onnx.TensorAnnotation.quantParameterTensorNames: object expected");i.quantParameterTensorNames[a]=l.onnx.StringStringEntryProto.fromObject(r.quantParameterTensorNames[a])}}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.quantParameterTensorNames=[]),i.defaults&&(a.tensorName=""),r.tensorName!=null&&r.hasOwnProperty("tensorName")&&(a.tensorName=r.tensorName),r.quantParameterTensorNames&&r.quantParameterTensorNames.length){a.quantParameterTensorNames=[];for(var c=0;c<r.quantParameterTensorNames.length;++c)a.quantParameterTensorNames[c]=l.onnx.StringStringEntryProto.toObject(r.quantParameterTensorNames[c],i)}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.TensorAnnotation"},o}(),p.GraphProto=function(){function o(r){if(this.node=[],this.initializer=[],this.sparseInitializer=[],this.input=[],this.output=[],this.valueInfo=[],this.quantizationAnnotation=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.node=d.emptyArray,o.prototype.name="",o.prototype.initializer=d.emptyArray,o.prototype.sparseInitializer=d.emptyArray,o.prototype.docString="",o.prototype.input=d.emptyArray,o.prototype.output=d.emptyArray,o.prototype.valueInfo=d.emptyArray,o.prototype.quantizationAnnotation=d.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.node!=null&&r.node.length)for(var a=0;a<r.node.length;++a)l.onnx.NodeProto.encode(r.node[a],i.uint32(10).fork()).ldelim();if(r.name!=null&&Object.hasOwnProperty.call(r,"name")&&i.uint32(18).string(r.name),r.initializer!=null&&r.initializer.length)for(var a=0;a<r.initializer.length;++a)l.onnx.TensorProto.encode(r.initializer[a],i.uint32(42).fork()).ldelim();if(r.docString!=null&&Object.hasOwnProperty.call(r,"docString")&&i.uint32(82).string(r.docString),r.input!=null&&r.input.length)for(var a=0;a<r.input.length;++a)l.onnx.ValueInfoProto.encode(r.input[a],i.uint32(90).fork()).ldelim();if(r.output!=null&&r.output.length)for(var a=0;a<r.output.length;++a)l.onnx.ValueInfoProto.encode(r.output[a],i.uint32(98).fork()).ldelim();if(r.valueInfo!=null&&r.valueInfo.length)for(var a=0;a<r.valueInfo.length;++a)l.onnx.ValueInfoProto.encode(r.valueInfo[a],i.uint32(106).fork()).ldelim();if(r.quantizationAnnotation!=null&&r.quantizationAnnotation.length)for(var a=0;a<r.quantizationAnnotation.length;++a)l.onnx.TensorAnnotation.encode(r.quantizationAnnotation[a],i.uint32(114).fork()).ldelim();if(r.sparseInitializer!=null&&r.sparseInitializer.length)for(var a=0;a<r.sparseInitializer.length;++a)l.onnx.SparseTensorProto.encode(r.sparseInitializer[a],i.uint32(122).fork()).ldelim();return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new l.onnx.GraphProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.node&&c.node.length||(c.node=[]),c.node.push(l.onnx.NodeProto.decode(r,r.uint32()));break}case 2:{c.name=r.string();break}case 5:{c.initializer&&c.initializer.length||(c.initializer=[]),c.initializer.push(l.onnx.TensorProto.decode(r,r.uint32()));break}case 15:{c.sparseInitializer&&c.sparseInitializer.length||(c.sparseInitializer=[]),c.sparseInitializer.push(l.onnx.SparseTensorProto.decode(r,r.uint32()));break}case 10:{c.docString=r.string();break}case 11:{c.input&&c.input.length||(c.input=[]),c.input.push(l.onnx.ValueInfoProto.decode(r,r.uint32()));break}case 12:{c.output&&c.output.length||(c.output=[]),c.output.push(l.onnx.ValueInfoProto.decode(r,r.uint32()));break}case 13:{c.valueInfo&&c.valueInfo.length||(c.valueInfo=[]),c.valueInfo.push(l.onnx.ValueInfoProto.decode(r,r.uint32()));break}case 14:{c.quantizationAnnotation&&c.quantizationAnnotation.length||(c.quantizationAnnotation=[]),c.quantizationAnnotation.push(l.onnx.TensorAnnotation.decode(r,r.uint32()));break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.node!=null&&r.hasOwnProperty("node")){if(!Array.isArray(r.node))return"node: array expected";for(var i=0;i<r.node.length;++i){var a=l.onnx.NodeProto.verify(r.node[i]);if(a)return"node."+a}}if(r.name!=null&&r.hasOwnProperty("name")&&!d.isString(r.name))return"name: string expected";if(r.initializer!=null&&r.hasOwnProperty("initializer")){if(!Array.isArray(r.initializer))return"initializer: array expected";for(var i=0;i<r.initializer.length;++i){var a=l.onnx.TensorProto.verify(r.initializer[i]);if(a)return"initializer."+a}}if(r.sparseInitializer!=null&&r.hasOwnProperty("sparseInitializer")){if(!Array.isArray(r.sparseInitializer))return"sparseInitializer: array expected";for(var i=0;i<r.sparseInitializer.length;++i){var a=l.onnx.SparseTensorProto.verify(r.sparseInitializer[i]);if(a)return"sparseInitializer."+a}}if(r.docString!=null&&r.hasOwnProperty("docString")&&!d.isString(r.docString))return"docString: string expected";if(r.input!=null&&r.hasOwnProperty("input")){if(!Array.isArray(r.input))return"input: array expected";for(var i=0;i<r.input.length;++i){var a=l.onnx.ValueInfoProto.verify(r.input[i]);if(a)return"input."+a}}if(r.output!=null&&r.hasOwnProperty("output")){if(!Array.isArray(r.output))return"output: array expected";for(var i=0;i<r.output.length;++i){var a=l.onnx.ValueInfoProto.verify(r.output[i]);if(a)return"output."+a}}if(r.valueInfo!=null&&r.hasOwnProperty("valueInfo")){if(!Array.isArray(r.valueInfo))return"valueInfo: array expected";for(var i=0;i<r.valueInfo.length;++i){var a=l.onnx.ValueInfoProto.verify(r.valueInfo[i]);if(a)return"valueInfo."+a}}if(r.quantizationAnnotation!=null&&r.hasOwnProperty("quantizationAnnotation")){if(!Array.isArray(r.quantizationAnnotation))return"quantizationAnnotation: array expected";for(var i=0;i<r.quantizationAnnotation.length;++i){var a=l.onnx.TensorAnnotation.verify(r.quantizationAnnotation[i]);if(a)return"quantizationAnnotation."+a}}return null},o.fromObject=function(r){if(r instanceof l.onnx.GraphProto)return r;var i=new l.onnx.GraphProto;if(r.node){if(!Array.isArray(r.node))throw TypeError(".onnx.GraphProto.node: array expected");i.node=[];for(var a=0;a<r.node.length;++a){if(typeof r.node[a]!="object")throw TypeError(".onnx.GraphProto.node: object expected");i.node[a]=l.onnx.NodeProto.fromObject(r.node[a])}}if(r.name!=null&&(i.name=String(r.name)),r.initializer){if(!Array.isArray(r.initializer))throw TypeError(".onnx.GraphProto.initializer: array expected");i.initializer=[];for(var a=0;a<r.initializer.length;++a){if(typeof r.initializer[a]!="object")throw TypeError(".onnx.GraphProto.initializer: object expected");i.initializer[a]=l.onnx.TensorProto.fromObject(r.initializer[a])}}if(r.sparseInitializer){if(!Array.isArray(r.sparseInitializer))throw TypeError(".onnx.GraphProto.sparseInitializer: array expected");i.sparseInitializer=[];for(var a=0;a<r.sparseInitializer.length;++a){if(typeof r.sparseInitializer[a]!="object")throw TypeError(".onnx.GraphProto.sparseInitializer: object expected");i.sparseInitializer[a]=l.onnx.SparseTensorProto.fromObject(r.sparseInitializer[a])}}if(r.docString!=null&&(i.docString=String(r.docString)),r.input){if(!Array.isArray(r.input))throw TypeError(".onnx.GraphProto.input: array expected");i.input=[];for(var a=0;a<r.input.length;++a){if(typeof r.input[a]!="object")throw TypeError(".onnx.GraphProto.input: object expected");i.input[a]=l.onnx.ValueInfoProto.fromObject(r.input[a])}}if(r.output){if(!Array.isArray(r.output))throw TypeError(".onnx.GraphProto.output: array expected");i.output=[];for(var a=0;a<r.output.length;++a){if(typeof r.output[a]!="object")throw TypeError(".onnx.GraphProto.output: object expected");i.output[a]=l.onnx.ValueInfoProto.fromObject(r.output[a])}}if(r.valueInfo){if(!Array.isArray(r.valueInfo))throw TypeError(".onnx.GraphProto.valueInfo: array expected");i.valueInfo=[];for(var a=0;a<r.valueInfo.length;++a){if(typeof r.valueInfo[a]!="object")throw TypeError(".onnx.GraphProto.valueInfo: object expected");i.valueInfo[a]=l.onnx.ValueInfoProto.fromObject(r.valueInfo[a])}}if(r.quantizationAnnotation){if(!Array.isArray(r.quantizationAnnotation))throw TypeError(".onnx.GraphProto.quantizationAnnotation: array expected");i.quantizationAnnotation=[];for(var a=0;a<r.quantizationAnnotation.length;++a){if(typeof r.quantizationAnnotation[a]!="object")throw TypeError(".onnx.GraphProto.quantizationAnnotation: object expected");i.quantizationAnnotation[a]=l.onnx.TensorAnnotation.fromObject(r.quantizationAnnotation[a])}}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.node=[],a.initializer=[],a.input=[],a.output=[],a.valueInfo=[],a.quantizationAnnotation=[],a.sparseInitializer=[]),i.defaults&&(a.name="",a.docString=""),r.node&&r.node.length){a.node=[];for(var c=0;c<r.node.length;++c)a.node[c]=l.onnx.NodeProto.toObject(r.node[c],i)}if(r.name!=null&&r.hasOwnProperty("name")&&(a.name=r.name),r.initializer&&r.initializer.length){a.initializer=[];for(var c=0;c<r.initializer.length;++c)a.initializer[c]=l.onnx.TensorProto.toObject(r.initializer[c],i)}if(r.docString!=null&&r.hasOwnProperty("docString")&&(a.docString=r.docString),r.input&&r.input.length){a.input=[];for(var c=0;c<r.input.length;++c)a.input[c]=l.onnx.ValueInfoProto.toObject(r.input[c],i)}if(r.output&&r.output.length){a.output=[];for(var c=0;c<r.output.length;++c)a.output[c]=l.onnx.ValueInfoProto.toObject(r.output[c],i)}if(r.valueInfo&&r.valueInfo.length){a.valueInfo=[];for(var c=0;c<r.valueInfo.length;++c)a.valueInfo[c]=l.onnx.ValueInfoProto.toObject(r.valueInfo[c],i)}if(r.quantizationAnnotation&&r.quantizationAnnotation.length){a.quantizationAnnotation=[];for(var c=0;c<r.quantizationAnnotation.length;++c)a.quantizationAnnotation[c]=l.onnx.TensorAnnotation.toObject(r.quantizationAnnotation[c],i)}if(r.sparseInitializer&&r.sparseInitializer.length){a.sparseInitializer=[];for(var c=0;c<r.sparseInitializer.length;++c)a.sparseInitializer[c]=l.onnx.SparseTensorProto.toObject(r.sparseInitializer[c],i)}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.GraphProto"},o}(),p.TensorProto=function(){function o(r){if(this.dims=[],this.floatData=[],this.int32Data=[],this.stringData=[],this.int64Data=[],this.externalData=[],this.doubleData=[],this.uint64Data=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.dims=d.emptyArray,o.prototype.dataType=0,o.prototype.segment=null,o.prototype.floatData=d.emptyArray,o.prototype.int32Data=d.emptyArray,o.prototype.stringData=d.emptyArray,o.prototype.int64Data=d.emptyArray,o.prototype.name="",o.prototype.docString="",o.prototype.rawData=d.newBuffer([]),o.prototype.externalData=d.emptyArray,o.prototype.dataLocation=0,o.prototype.doubleData=d.emptyArray,o.prototype.uint64Data=d.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.dims!=null&&r.dims.length){i.uint32(10).fork();for(var a=0;a<r.dims.length;++a)i.int64(r.dims[a]);i.ldelim()}if(r.dataType!=null&&Object.hasOwnProperty.call(r,"dataType")&&i.uint32(16).int32(r.dataType),r.segment!=null&&Object.hasOwnProperty.call(r,"segment")&&l.onnx.TensorProto.Segment.encode(r.segment,i.uint32(26).fork()).ldelim(),r.floatData!=null&&r.floatData.length){i.uint32(34).fork();for(var a=0;a<r.floatData.length;++a)i.float(r.floatData[a]);i.ldelim()}if(r.int32Data!=null&&r.int32Data.length){i.uint32(42).fork();for(var a=0;a<r.int32Data.length;++a)i.int32(r.int32Data[a]);i.ldelim()}if(r.stringData!=null&&r.stringData.length)for(var a=0;a<r.stringData.length;++a)i.uint32(50).bytes(r.stringData[a]);if(r.int64Data!=null&&r.int64Data.length){i.uint32(58).fork();for(var a=0;a<r.int64Data.length;++a)i.int64(r.int64Data[a]);i.ldelim()}if(r.name!=null&&Object.hasOwnProperty.call(r,"name")&&i.uint32(66).string(r.name),r.rawData!=null&&Object.hasOwnProperty.call(r,"rawData")&&i.uint32(74).bytes(r.rawData),r.doubleData!=null&&r.doubleData.length){i.uint32(82).fork();for(var a=0;a<r.doubleData.length;++a)i.double(r.doubleData[a]);i.ldelim()}if(r.uint64Data!=null&&r.uint64Data.length){i.uint32(90).fork();for(var a=0;a<r.uint64Data.length;++a)i.uint64(r.uint64Data[a]);i.ldelim()}if(r.docString!=null&&Object.hasOwnProperty.call(r,"docString")&&i.uint32(98).string(r.docString),r.externalData!=null&&r.externalData.length)for(var a=0;a<r.externalData.length;++a)l.onnx.StringStringEntryProto.encode(r.externalData[a],i.uint32(106).fork()).ldelim();return r.dataLocation!=null&&Object.hasOwnProperty.call(r,"dataLocation")&&i.uint32(112).int32(r.dataLocation),i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new l.onnx.TensorProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{if(c.dims&&c.dims.length||(c.dims=[]),(h&7)===2)for(var g=r.uint32()+r.pos;r.pos<g;)c.dims.push(r.int64());else c.dims.push(r.int64());break}case 2:{c.dataType=r.int32();break}case 3:{c.segment=l.onnx.TensorProto.Segment.decode(r,r.uint32());break}case 4:{if(c.floatData&&c.floatData.length||(c.floatData=[]),(h&7)===2)for(var g=r.uint32()+r.pos;r.pos<g;)c.floatData.push(r.float());else c.floatData.push(r.float());break}case 5:{if(c.int32Data&&c.int32Data.length||(c.int32Data=[]),(h&7)===2)for(var g=r.uint32()+r.pos;r.pos<g;)c.int32Data.push(r.int32());else c.int32Data.push(r.int32());break}case 6:{c.stringData&&c.stringData.length||(c.stringData=[]),c.stringData.push(r.bytes());break}case 7:{if(c.int64Data&&c.int64Data.length||(c.int64Data=[]),(h&7)===2)for(var g=r.uint32()+r.pos;r.pos<g;)c.int64Data.push(r.int64());else c.int64Data.push(r.int64());break}case 8:{c.name=r.string();break}case 12:{c.docString=r.string();break}case 9:{c.rawData=r.bytes();break}case 13:{c.externalData&&c.externalData.length||(c.externalData=[]),c.externalData.push(l.onnx.StringStringEntryProto.decode(r,r.uint32()));break}case 14:{c.dataLocation=r.int32();break}case 10:{if(c.doubleData&&c.doubleData.length||(c.doubleData=[]),(h&7)===2)for(var g=r.uint32()+r.pos;r.pos<g;)c.doubleData.push(r.double());else c.doubleData.push(r.double());break}case 11:{if(c.uint64Data&&c.uint64Data.length||(c.uint64Data=[]),(h&7)===2)for(var g=r.uint32()+r.pos;r.pos<g;)c.uint64Data.push(r.uint64());else c.uint64Data.push(r.uint64());break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.dims!=null&&r.hasOwnProperty("dims")){if(!Array.isArray(r.dims))return"dims: array expected";for(var i=0;i<r.dims.length;++i)if(!d.isInteger(r.dims[i])&&!(r.dims[i]&&d.isInteger(r.dims[i].low)&&d.isInteger(r.dims[i].high)))return"dims: integer|Long[] expected"}if(r.dataType!=null&&r.hasOwnProperty("dataType")&&!d.isInteger(r.dataType))return"dataType: integer expected";if(r.segment!=null&&r.hasOwnProperty("segment")){var a=l.onnx.TensorProto.Segment.verify(r.segment);if(a)return"segment."+a}if(r.floatData!=null&&r.hasOwnProperty("floatData")){if(!Array.isArray(r.floatData))return"floatData: array expected";for(var i=0;i<r.floatData.length;++i)if(typeof r.floatData[i]!="number")return"floatData: number[] expected"}if(r.int32Data!=null&&r.hasOwnProperty("int32Data")){if(!Array.isArray(r.int32Data))return"int32Data: array expected";for(var i=0;i<r.int32Data.length;++i)if(!d.isInteger(r.int32Data[i]))return"int32Data: integer[] expected"}if(r.stringData!=null&&r.hasOwnProperty("stringData")){if(!Array.isArray(r.stringData))return"stringData: array expected";for(var i=0;i<r.stringData.length;++i)if(!(r.stringData[i]&&typeof r.stringData[i].length=="number"||d.isString(r.stringData[i])))return"stringData: buffer[] expected"}if(r.int64Data!=null&&r.hasOwnProperty("int64Data")){if(!Array.isArray(r.int64Data))return"int64Data: array expected";for(var i=0;i<r.int64Data.length;++i)if(!d.isInteger(r.int64Data[i])&&!(r.int64Data[i]&&d.isInteger(r.int64Data[i].low)&&d.isInteger(r.int64Data[i].high)))return"int64Data: integer|Long[] expected"}if(r.name!=null&&r.hasOwnProperty("name")&&!d.isString(r.name))return"name: string expected";if(r.docString!=null&&r.hasOwnProperty("docString")&&!d.isString(r.docString))return"docString: string expected";if(r.rawData!=null&&r.hasOwnProperty("rawData")&&!(r.rawData&&typeof r.rawData.length=="number"||d.isString(r.rawData)))return"rawData: buffer expected";if(r.externalData!=null&&r.hasOwnProperty("externalData")){if(!Array.isArray(r.externalData))return"externalData: array expected";for(var i=0;i<r.externalData.length;++i){var a=l.onnx.StringStringEntryProto.verify(r.externalData[i]);if(a)return"externalData."+a}}if(r.dataLocation!=null&&r.hasOwnProperty("dataLocation"))switch(r.dataLocation){default:return"dataLocation: enum value expected";case 0:case 1:break}if(r.doubleData!=null&&r.hasOwnProperty("doubleData")){if(!Array.isArray(r.doubleData))return"doubleData: array expected";for(var i=0;i<r.doubleData.length;++i)if(typeof r.doubleData[i]!="number")return"doubleData: number[] expected"}if(r.uint64Data!=null&&r.hasOwnProperty("uint64Data")){if(!Array.isArray(r.uint64Data))return"uint64Data: array expected";for(var i=0;i<r.uint64Data.length;++i)if(!d.isInteger(r.uint64Data[i])&&!(r.uint64Data[i]&&d.isInteger(r.uint64Data[i].low)&&d.isInteger(r.uint64Data[i].high)))return"uint64Data: integer|Long[] expected"}return null},o.fromObject=function(r){if(r instanceof l.onnx.TensorProto)return r;var i=new l.onnx.TensorProto;if(r.dims){if(!Array.isArray(r.dims))throw TypeError(".onnx.TensorProto.dims: array expected");i.dims=[];for(var a=0;a<r.dims.length;++a)d.Long?(i.dims[a]=d.Long.fromValue(r.dims[a])).unsigned=!1:typeof r.dims[a]=="string"?i.dims[a]=parseInt(r.dims[a],10):typeof r.dims[a]=="number"?i.dims[a]=r.dims[a]:typeof r.dims[a]=="object"&&(i.dims[a]=new d.LongBits(r.dims[a].low>>>0,r.dims[a].high>>>0).toNumber())}if(r.dataType!=null&&(i.dataType=r.dataType|0),r.segment!=null){if(typeof r.segment!="object")throw TypeError(".onnx.TensorProto.segment: object expected");i.segment=l.onnx.TensorProto.Segment.fromObject(r.segment)}if(r.floatData){if(!Array.isArray(r.floatData))throw TypeError(".onnx.TensorProto.floatData: array expected");i.floatData=[];for(var a=0;a<r.floatData.length;++a)i.floatData[a]=Number(r.floatData[a])}if(r.int32Data){if(!Array.isArray(r.int32Data))throw TypeError(".onnx.TensorProto.int32Data: array expected");i.int32Data=[];for(var a=0;a<r.int32Data.length;++a)i.int32Data[a]=r.int32Data[a]|0}if(r.stringData){if(!Array.isArray(r.stringData))throw TypeError(".onnx.TensorProto.stringData: array expected");i.stringData=[];for(var a=0;a<r.stringData.length;++a)typeof r.stringData[a]=="string"?d.base64.decode(r.stringData[a],i.stringData[a]=d.newBuffer(d.base64.length(r.stringData[a])),0):r.stringData[a].length>=0&&(i.stringData[a]=r.stringData[a])}if(r.int64Data){if(!Array.isArray(r.int64Data))throw TypeError(".onnx.TensorProto.int64Data: array expected");i.int64Data=[];for(var a=0;a<r.int64Data.length;++a)d.Long?(i.int64Data[a]=d.Long.fromValue(r.int64Data[a])).unsigned=!1:typeof r.int64Data[a]=="string"?i.int64Data[a]=parseInt(r.int64Data[a],10):typeof r.int64Data[a]=="number"?i.int64Data[a]=r.int64Data[a]:typeof r.int64Data[a]=="object"&&(i.int64Data[a]=new d.LongBits(r.int64Data[a].low>>>0,r.int64Data[a].high>>>0).toNumber())}if(r.name!=null&&(i.name=String(r.name)),r.docString!=null&&(i.docString=String(r.docString)),r.rawData!=null&&(typeof r.rawData=="string"?d.base64.decode(r.rawData,i.rawData=d.newBuffer(d.base64.length(r.rawData)),0):r.rawData.length>=0&&(i.rawData=r.rawData)),r.externalData){if(!Array.isArray(r.externalData))throw TypeError(".onnx.TensorProto.externalData: array expected");i.externalData=[];for(var a=0;a<r.externalData.length;++a){if(typeof r.externalData[a]!="object")throw TypeError(".onnx.TensorProto.externalData: object expected");i.externalData[a]=l.onnx.StringStringEntryProto.fromObject(r.externalData[a])}}switch(r.dataLocation){default:if(typeof r.dataLocation=="number"){i.dataLocation=r.dataLocation;break}break;case"DEFAULT":case 0:i.dataLocation=0;break;case"EXTERNAL":case 1:i.dataLocation=1;break}if(r.doubleData){if(!Array.isArray(r.doubleData))throw TypeError(".onnx.TensorProto.doubleData: array expected");i.doubleData=[];for(var a=0;a<r.doubleData.length;++a)i.doubleData[a]=Number(r.doubleData[a])}if(r.uint64Data){if(!Array.isArray(r.uint64Data))throw TypeError(".onnx.TensorProto.uint64Data: array expected");i.uint64Data=[];for(var a=0;a<r.uint64Data.length;++a)d.Long?(i.uint64Data[a]=d.Long.fromValue(r.uint64Data[a])).unsigned=!0:typeof r.uint64Data[a]=="string"?i.uint64Data[a]=parseInt(r.uint64Data[a],10):typeof r.uint64Data[a]=="number"?i.uint64Data[a]=r.uint64Data[a]:typeof r.uint64Data[a]=="object"&&(i.uint64Data[a]=new d.LongBits(r.uint64Data[a].low>>>0,r.uint64Data[a].high>>>0).toNumber(!0))}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.dims=[],a.floatData=[],a.int32Data=[],a.stringData=[],a.int64Data=[],a.doubleData=[],a.uint64Data=[],a.externalData=[]),i.defaults&&(a.dataType=0,a.segment=null,a.name="",i.bytes===String?a.rawData="":(a.rawData=[],i.bytes!==Array&&(a.rawData=d.newBuffer(a.rawData))),a.docString="",a.dataLocation=i.enums===String?"DEFAULT":0),r.dims&&r.dims.length){a.dims=[];for(var c=0;c<r.dims.length;++c)typeof r.dims[c]=="number"?a.dims[c]=i.longs===String?String(r.dims[c]):r.dims[c]:a.dims[c]=i.longs===String?d.Long.prototype.toString.call(r.dims[c]):i.longs===Number?new d.LongBits(r.dims[c].low>>>0,r.dims[c].high>>>0).toNumber():r.dims[c]}if(r.dataType!=null&&r.hasOwnProperty("dataType")&&(a.dataType=r.dataType),r.segment!=null&&r.hasOwnProperty("segment")&&(a.segment=l.onnx.TensorProto.Segment.toObject(r.segment,i)),r.floatData&&r.floatData.length){a.floatData=[];for(var c=0;c<r.floatData.length;++c)a.floatData[c]=i.json&&!isFinite(r.floatData[c])?String(r.floatData[c]):r.floatData[c]}if(r.int32Data&&r.int32Data.length){a.int32Data=[];for(var c=0;c<r.int32Data.length;++c)a.int32Data[c]=r.int32Data[c]}if(r.stringData&&r.stringData.length){a.stringData=[];for(var c=0;c<r.stringData.length;++c)a.stringData[c]=i.bytes===String?d.base64.encode(r.stringData[c],0,r.stringData[c].length):i.bytes===Array?Array.prototype.slice.call(r.stringData[c]):r.stringData[c]}if(r.int64Data&&r.int64Data.length){a.int64Data=[];for(var c=0;c<r.int64Data.length;++c)typeof r.int64Data[c]=="number"?a.int64Data[c]=i.longs===String?String(r.int64Data[c]):r.int64Data[c]:a.int64Data[c]=i.longs===String?d.Long.prototype.toString.call(r.int64Data[c]):i.longs===Number?new d.LongBits(r.int64Data[c].low>>>0,r.int64Data[c].high>>>0).toNumber():r.int64Data[c]}if(r.name!=null&&r.hasOwnProperty("name")&&(a.name=r.name),r.rawData!=null&&r.hasOwnProperty("rawData")&&(a.rawData=i.bytes===String?d.base64.encode(r.rawData,0,r.rawData.length):i.bytes===Array?Array.prototype.slice.call(r.rawData):r.rawData),r.doubleData&&r.doubleData.length){a.doubleData=[];for(var c=0;c<r.doubleData.length;++c)a.doubleData[c]=i.json&&!isFinite(r.doubleData[c])?String(r.doubleData[c]):r.doubleData[c]}if(r.uint64Data&&r.uint64Data.length){a.uint64Data=[];for(var c=0;c<r.uint64Data.length;++c)typeof r.uint64Data[c]=="number"?a.uint64Data[c]=i.longs===String?String(r.uint64Data[c]):r.uint64Data[c]:a.uint64Data[c]=i.longs===String?d.Long.prototype.toString.call(r.uint64Data[c]):i.longs===Number?new d.LongBits(r.uint64Data[c].low>>>0,r.uint64Data[c].high>>>0).toNumber(!0):r.uint64Data[c]}if(r.docString!=null&&r.hasOwnProperty("docString")&&(a.docString=r.docString),r.externalData&&r.externalData.length){a.externalData=[];for(var c=0;c<r.externalData.length;++c)a.externalData[c]=l.onnx.StringStringEntryProto.toObject(r.externalData[c],i)}return r.dataLocation!=null&&r.hasOwnProperty("dataLocation")&&(a.dataLocation=i.enums===String?l.onnx.TensorProto.DataLocation[r.dataLocation]===void 0?r.dataLocation:l.onnx.TensorProto.DataLocation[r.dataLocation]:r.dataLocation),a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.TensorProto"},o.DataType=function(){var r={},i=Object.create(r);return i[r[0]="UNDEFINED"]=0,i[r[1]="FLOAT"]=1,i[r[2]="UINT8"]=2,i[r[3]="INT8"]=3,i[r[4]="UINT16"]=4,i[r[5]="INT16"]=5,i[r[6]="INT32"]=6,i[r[7]="INT64"]=7,i[r[8]="STRING"]=8,i[r[9]="BOOL"]=9,i[r[10]="FLOAT16"]=10,i[r[11]="DOUBLE"]=11,i[r[12]="UINT32"]=12,i[r[13]="UINT64"]=13,i[r[14]="COMPLEX64"]=14,i[r[15]="COMPLEX128"]=15,i[r[16]="BFLOAT16"]=16,i[r[17]="FLOAT8E4M3FN"]=17,i[r[18]="FLOAT8E4M3FNUZ"]=18,i[r[19]="FLOAT8E5M2"]=19,i[r[20]="FLOAT8E5M2FNUZ"]=20,i}(),o.Segment=function(){function r(i){if(i)for(var a=Object.keys(i),c=0;c<a.length;++c)i[a[c]]!=null&&(this[a[c]]=i[a[c]])}return r.prototype.begin=d.Long?d.Long.fromBits(0,0,!1):0,r.prototype.end=d.Long?d.Long.fromBits(0,0,!1):0,r.create=function(i){return new r(i)},r.encode=function(i,a){return a||(a=u.create()),i.begin!=null&&Object.hasOwnProperty.call(i,"begin")&&a.uint32(8).int64(i.begin),i.end!=null&&Object.hasOwnProperty.call(i,"end")&&a.uint32(16).int64(i.end),a},r.encodeDelimited=function(i,a){return this.encode(i,a).ldelim()},r.decode=function(i,a){i instanceof s||(i=s.create(i));for(var c=a===void 0?i.len:i.pos+a,h=new l.onnx.TensorProto.Segment;i.pos<c;){var g=i.uint32();switch(g>>>3){case 1:{h.begin=i.int64();break}case 2:{h.end=i.int64();break}default:i.skipType(g&7);break}}return h},r.decodeDelimited=function(i){return i instanceof s||(i=new s(i)),this.decode(i,i.uint32())},r.verify=function(i){return typeof i!="object"||i===null?"object expected":i.begin!=null&&i.hasOwnProperty("begin")&&!d.isInteger(i.begin)&&!(i.begin&&d.isInteger(i.begin.low)&&d.isInteger(i.begin.high))?"begin: integer|Long expected":i.end!=null&&i.hasOwnProperty("end")&&!d.isInteger(i.end)&&!(i.end&&d.isInteger(i.end.low)&&d.isInteger(i.end.high))?"end: integer|Long expected":null},r.fromObject=function(i){if(i instanceof l.onnx.TensorProto.Segment)return i;var a=new l.onnx.TensorProto.Segment;return i.begin!=null&&(d.Long?(a.begin=d.Long.fromValue(i.begin)).unsigned=!1:typeof i.begin=="string"?a.begin=parseInt(i.begin,10):typeof i.begin=="number"?a.begin=i.begin:typeof i.begin=="object"&&(a.begin=new d.LongBits(i.begin.low>>>0,i.begin.high>>>0).toNumber())),i.end!=null&&(d.Long?(a.end=d.Long.fromValue(i.end)).unsigned=!1:typeof i.end=="string"?a.end=parseInt(i.end,10):typeof i.end=="number"?a.end=i.end:typeof i.end=="object"&&(a.end=new d.LongBits(i.end.low>>>0,i.end.high>>>0).toNumber())),a},r.toObject=function(i,a){a||(a={});var c={};if(a.defaults){if(d.Long){var h=new d.Long(0,0,!1);c.begin=a.longs===String?h.toString():a.longs===Number?h.toNumber():h}else c.begin=a.longs===String?"0":0;if(d.Long){var h=new d.Long(0,0,!1);c.end=a.longs===String?h.toString():a.longs===Number?h.toNumber():h}else c.end=a.longs===String?"0":0}return i.begin!=null&&i.hasOwnProperty("begin")&&(typeof i.begin=="number"?c.begin=a.longs===String?String(i.begin):i.begin:c.begin=a.longs===String?d.Long.prototype.toString.call(i.begin):a.longs===Number?new d.LongBits(i.begin.low>>>0,i.begin.high>>>0).toNumber():i.begin),i.end!=null&&i.hasOwnProperty("end")&&(typeof i.end=="number"?c.end=a.longs===String?String(i.end):i.end:c.end=a.longs===String?d.Long.prototype.toString.call(i.end):a.longs===Number?new d.LongBits(i.end.low>>>0,i.end.high>>>0).toNumber():i.end),c},r.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},r.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TensorProto.Segment"},r}(),o.DataLocation=function(){var r={},i=Object.create(r);return i[r[0]="DEFAULT"]=0,i[r[1]="EXTERNAL"]=1,i}(),o}(),p.SparseTensorProto=function(){function o(r){if(this.dims=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.values=null,o.prototype.indices=null,o.prototype.dims=d.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.values!=null&&Object.hasOwnProperty.call(r,"values")&&l.onnx.TensorProto.encode(r.values,i.uint32(10).fork()).ldelim(),r.indices!=null&&Object.hasOwnProperty.call(r,"indices")&&l.onnx.TensorProto.encode(r.indices,i.uint32(18).fork()).ldelim(),r.dims!=null&&r.dims.length){i.uint32(26).fork();for(var a=0;a<r.dims.length;++a)i.int64(r.dims[a]);i.ldelim()}return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new l.onnx.SparseTensorProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.values=l.onnx.TensorProto.decode(r,r.uint32());break}case 2:{c.indices=l.onnx.TensorProto.decode(r,r.uint32());break}case 3:{if(c.dims&&c.dims.length||(c.dims=[]),(h&7)===2)for(var g=r.uint32()+r.pos;r.pos<g;)c.dims.push(r.int64());else c.dims.push(r.int64());break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.values!=null&&r.hasOwnProperty("values")){var i=l.onnx.TensorProto.verify(r.values);if(i)return"values."+i}if(r.indices!=null&&r.hasOwnProperty("indices")){var i=l.onnx.TensorProto.verify(r.indices);if(i)return"indices."+i}if(r.dims!=null&&r.hasOwnProperty("dims")){if(!Array.isArray(r.dims))return"dims: array expected";for(var a=0;a<r.dims.length;++a)if(!d.isInteger(r.dims[a])&&!(r.dims[a]&&d.isInteger(r.dims[a].low)&&d.isInteger(r.dims[a].high)))return"dims: integer|Long[] expected"}return null},o.fromObject=function(r){if(r instanceof l.onnx.SparseTensorProto)return r;var i=new l.onnx.SparseTensorProto;if(r.values!=null){if(typeof r.values!="object")throw TypeError(".onnx.SparseTensorProto.values: object expected");i.values=l.onnx.TensorProto.fromObject(r.values)}if(r.indices!=null){if(typeof r.indices!="object")throw TypeError(".onnx.SparseTensorProto.indices: object expected");i.indices=l.onnx.TensorProto.fromObject(r.indices)}if(r.dims){if(!Array.isArray(r.dims))throw TypeError(".onnx.SparseTensorProto.dims: array expected");i.dims=[];for(var a=0;a<r.dims.length;++a)d.Long?(i.dims[a]=d.Long.fromValue(r.dims[a])).unsigned=!1:typeof r.dims[a]=="string"?i.dims[a]=parseInt(r.dims[a],10):typeof r.dims[a]=="number"?i.dims[a]=r.dims[a]:typeof r.dims[a]=="object"&&(i.dims[a]=new d.LongBits(r.dims[a].low>>>0,r.dims[a].high>>>0).toNumber())}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.dims=[]),i.defaults&&(a.values=null,a.indices=null),r.values!=null&&r.hasOwnProperty("values")&&(a.values=l.onnx.TensorProto.toObject(r.values,i)),r.indices!=null&&r.hasOwnProperty("indices")&&(a.indices=l.onnx.TensorProto.toObject(r.indices,i)),r.dims&&r.dims.length){a.dims=[];for(var c=0;c<r.dims.length;++c)typeof r.dims[c]=="number"?a.dims[c]=i.longs===String?String(r.dims[c]):r.dims[c]:a.dims[c]=i.longs===String?d.Long.prototype.toString.call(r.dims[c]):i.longs===Number?new d.LongBits(r.dims[c].low>>>0,r.dims[c].high>>>0).toNumber():r.dims[c]}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.SparseTensorProto"},o}(),p.TensorShapeProto=function(){function o(r){if(this.dim=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.dim=d.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.dim!=null&&r.dim.length)for(var a=0;a<r.dim.length;++a)l.onnx.TensorShapeProto.Dimension.encode(r.dim[a],i.uint32(10).fork()).ldelim();return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new l.onnx.TensorShapeProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.dim&&c.dim.length||(c.dim=[]),c.dim.push(l.onnx.TensorShapeProto.Dimension.decode(r,r.uint32()));break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.dim!=null&&r.hasOwnProperty("dim")){if(!Array.isArray(r.dim))return"dim: array expected";for(var i=0;i<r.dim.length;++i){var a=l.onnx.TensorShapeProto.Dimension.verify(r.dim[i]);if(a)return"dim."+a}}return null},o.fromObject=function(r){if(r instanceof l.onnx.TensorShapeProto)return r;var i=new l.onnx.TensorShapeProto;if(r.dim){if(!Array.isArray(r.dim))throw TypeError(".onnx.TensorShapeProto.dim: array expected");i.dim=[];for(var a=0;a<r.dim.length;++a){if(typeof r.dim[a]!="object")throw TypeError(".onnx.TensorShapeProto.dim: object expected");i.dim[a]=l.onnx.TensorShapeProto.Dimension.fromObject(r.dim[a])}}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.dim=[]),r.dim&&r.dim.length){a.dim=[];for(var c=0;c<r.dim.length;++c)a.dim[c]=l.onnx.TensorShapeProto.Dimension.toObject(r.dim[c],i)}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.TensorShapeProto"},o.Dimension=function(){function r(a){if(a)for(var c=Object.keys(a),h=0;h<c.length;++h)a[c[h]]!=null&&(this[c[h]]=a[c[h]])}r.prototype.dimValue=null,r.prototype.dimParam=null,r.prototype.denotation="";var i;return Object.defineProperty(r.prototype,"value",{get:d.oneOfGetter(i=["dimValue","dimParam"]),set:d.oneOfSetter(i)}),r.create=function(a){return new r(a)},r.encode=function(a,c){return c||(c=u.create()),a.dimValue!=null&&Object.hasOwnProperty.call(a,"dimValue")&&c.uint32(8).int64(a.dimValue),a.dimParam!=null&&Object.hasOwnProperty.call(a,"dimParam")&&c.uint32(18).string(a.dimParam),a.denotation!=null&&Object.hasOwnProperty.call(a,"denotation")&&c.uint32(26).string(a.denotation),c},r.encodeDelimited=function(a,c){return this.encode(a,c).ldelim()},r.decode=function(a,c){a instanceof s||(a=s.create(a));for(var h=c===void 0?a.len:a.pos+c,g=new l.onnx.TensorShapeProto.Dimension;a.pos<h;){var b=a.uint32();switch(b>>>3){case 1:{g.dimValue=a.int64();break}case 2:{g.dimParam=a.string();break}case 3:{g.denotation=a.string();break}default:a.skipType(b&7);break}}return g},r.decodeDelimited=function(a){return a instanceof s||(a=new s(a)),this.decode(a,a.uint32())},r.verify=function(a){if(typeof a!="object"||a===null)return"object expected";var c={};if(a.dimValue!=null&&a.hasOwnProperty("dimValue")&&(c.value=1,!d.isInteger(a.dimValue)&&!(a.dimValue&&d.isInteger(a.dimValue.low)&&d.isInteger(a.dimValue.high))))return"dimValue: integer|Long expected";if(a.dimParam!=null&&a.hasOwnProperty("dimParam")){if(c.value===1)return"value: multiple values";if(c.value=1,!d.isString(a.dimParam))return"dimParam: string expected"}return a.denotation!=null&&a.hasOwnProperty("denotation")&&!d.isString(a.denotation)?"denotation: string expected":null},r.fromObject=function(a){if(a instanceof l.onnx.TensorShapeProto.Dimension)return a;var c=new l.onnx.TensorShapeProto.Dimension;return a.dimValue!=null&&(d.Long?(c.dimValue=d.Long.fromValue(a.dimValue)).unsigned=!1:typeof a.dimValue=="string"?c.dimValue=parseInt(a.dimValue,10):typeof a.dimValue=="number"?c.dimValue=a.dimValue:typeof a.dimValue=="object"&&(c.dimValue=new d.LongBits(a.dimValue.low>>>0,a.dimValue.high>>>0).toNumber())),a.dimParam!=null&&(c.dimParam=String(a.dimParam)),a.denotation!=null&&(c.denotation=String(a.denotation)),c},r.toObject=function(a,c){c||(c={});var h={};return c.defaults&&(h.denotation=""),a.dimValue!=null&&a.hasOwnProperty("dimValue")&&(typeof a.dimValue=="number"?h.dimValue=c.longs===String?String(a.dimValue):a.dimValue:h.dimValue=c.longs===String?d.Long.prototype.toString.call(a.dimValue):c.longs===Number?new d.LongBits(a.dimValue.low>>>0,a.dimValue.high>>>0).toNumber():a.dimValue,c.oneofs&&(h.value="dimValue")),a.dimParam!=null&&a.hasOwnProperty("dimParam")&&(h.dimParam=a.dimParam,c.oneofs&&(h.value="dimParam")),a.denotation!=null&&a.hasOwnProperty("denotation")&&(h.denotation=a.denotation),h},r.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},r.getTypeUrl=function(a){return a===void 0&&(a="type.googleapis.com"),a+"/onnx.TensorShapeProto.Dimension"},r}(),o}(),p.TypeProto=function(){function o(i){if(i)for(var a=Object.keys(i),c=0;c<a.length;++c)i[a[c]]!=null&&(this[a[c]]=i[a[c]])}o.prototype.tensorType=null,o.prototype.sequenceType=null,o.prototype.mapType=null,o.prototype.optionalType=null,o.prototype.sparseTensorType=null,o.prototype.denotation="";var r;return Object.defineProperty(o.prototype,"value",{get:d.oneOfGetter(r=["tensorType","sequenceType","mapType","optionalType","sparseTensorType"]),set:d.oneOfSetter(r)}),o.create=function(i){return new o(i)},o.encode=function(i,a){return a||(a=u.create()),i.tensorType!=null&&Object.hasOwnProperty.call(i,"tensorType")&&l.onnx.TypeProto.Tensor.encode(i.tensorType,a.uint32(10).fork()).ldelim(),i.sequenceType!=null&&Object.hasOwnProperty.call(i,"sequenceType")&&l.onnx.TypeProto.Sequence.encode(i.sequenceType,a.uint32(34).fork()).ldelim(),i.mapType!=null&&Object.hasOwnProperty.call(i,"mapType")&&l.onnx.TypeProto.Map.encode(i.mapType,a.uint32(42).fork()).ldelim(),i.denotation!=null&&Object.hasOwnProperty.call(i,"denotation")&&a.uint32(50).string(i.denotation),i.sparseTensorType!=null&&Object.hasOwnProperty.call(i,"sparseTensorType")&&l.onnx.TypeProto.SparseTensor.encode(i.sparseTensorType,a.uint32(66).fork()).ldelim(),i.optionalType!=null&&Object.hasOwnProperty.call(i,"optionalType")&&l.onnx.TypeProto.Optional.encode(i.optionalType,a.uint32(74).fork()).ldelim(),a},o.encodeDelimited=function(i,a){return this.encode(i,a).ldelim()},o.decode=function(i,a){i instanceof s||(i=s.create(i));for(var c=a===void 0?i.len:i.pos+a,h=new l.onnx.TypeProto;i.pos<c;){var g=i.uint32();switch(g>>>3){case 1:{h.tensorType=l.onnx.TypeProto.Tensor.decode(i,i.uint32());break}case 4:{h.sequenceType=l.onnx.TypeProto.Sequence.decode(i,i.uint32());break}case 5:{h.mapType=l.onnx.TypeProto.Map.decode(i,i.uint32());break}case 9:{h.optionalType=l.onnx.TypeProto.Optional.decode(i,i.uint32());break}case 8:{h.sparseTensorType=l.onnx.TypeProto.SparseTensor.decode(i,i.uint32());break}case 6:{h.denotation=i.string();break}default:i.skipType(g&7);break}}return h},o.decodeDelimited=function(i){return i instanceof s||(i=new s(i)),this.decode(i,i.uint32())},o.verify=function(i){if(typeof i!="object"||i===null)return"object expected";var a={};if(i.tensorType!=null&&i.hasOwnProperty("tensorType")){a.value=1;{var c=l.onnx.TypeProto.Tensor.verify(i.tensorType);if(c)return"tensorType."+c}}if(i.sequenceType!=null&&i.hasOwnProperty("sequenceType")){if(a.value===1)return"value: multiple values";a.value=1;{var c=l.onnx.TypeProto.Sequence.verify(i.sequenceType);if(c)return"sequenceType."+c}}if(i.mapType!=null&&i.hasOwnProperty("mapType")){if(a.value===1)return"value: multiple values";a.value=1;{var c=l.onnx.TypeProto.Map.verify(i.mapType);if(c)return"mapType."+c}}if(i.optionalType!=null&&i.hasOwnProperty("optionalType")){if(a.value===1)return"value: multiple values";a.value=1;{var c=l.onnx.TypeProto.Optional.verify(i.optionalType);if(c)return"optionalType."+c}}if(i.sparseTensorType!=null&&i.hasOwnProperty("sparseTensorType")){if(a.value===1)return"value: multiple values";a.value=1;{var c=l.onnx.TypeProto.SparseTensor.verify(i.sparseTensorType);if(c)return"sparseTensorType."+c}}return i.denotation!=null&&i.hasOwnProperty("denotation")&&!d.isString(i.denotation)?"denotation: string expected":null},o.fromObject=function(i){if(i instanceof l.onnx.TypeProto)return i;var a=new l.onnx.TypeProto;if(i.tensorType!=null){if(typeof i.tensorType!="object")throw TypeError(".onnx.TypeProto.tensorType: object expected");a.tensorType=l.onnx.TypeProto.Tensor.fromObject(i.tensorType)}if(i.sequenceType!=null){if(typeof i.sequenceType!="object")throw TypeError(".onnx.TypeProto.sequenceType: object expected");a.sequenceType=l.onnx.TypeProto.Sequence.fromObject(i.sequenceType)}if(i.mapType!=null){if(typeof i.mapType!="object")throw TypeError(".onnx.TypeProto.mapType: object expected");a.mapType=l.onnx.TypeProto.Map.fromObject(i.mapType)}if(i.optionalType!=null){if(typeof i.optionalType!="object")throw TypeError(".onnx.TypeProto.optionalType: object expected");a.optionalType=l.onnx.TypeProto.Optional.fromObject(i.optionalType)}if(i.sparseTensorType!=null){if(typeof i.sparseTensorType!="object")throw TypeError(".onnx.TypeProto.sparseTensorType: object expected");a.sparseTensorType=l.onnx.TypeProto.SparseTensor.fromObject(i.sparseTensorType)}return i.denotation!=null&&(a.denotation=String(i.denotation)),a},o.toObject=function(i,a){a||(a={});var c={};return a.defaults&&(c.denotation=""),i.tensorType!=null&&i.hasOwnProperty("tensorType")&&(c.tensorType=l.onnx.TypeProto.Tensor.toObject(i.tensorType,a),a.oneofs&&(c.value="tensorType")),i.sequenceType!=null&&i.hasOwnProperty("sequenceType")&&(c.sequenceType=l.onnx.TypeProto.Sequence.toObject(i.sequenceType,a),a.oneofs&&(c.value="sequenceType")),i.mapType!=null&&i.hasOwnProperty("mapType")&&(c.mapType=l.onnx.TypeProto.Map.toObject(i.mapType,a),a.oneofs&&(c.value="mapType")),i.denotation!=null&&i.hasOwnProperty("denotation")&&(c.denotation=i.denotation),i.sparseTensorType!=null&&i.hasOwnProperty("sparseTensorType")&&(c.sparseTensorType=l.onnx.TypeProto.SparseTensor.toObject(i.sparseTensorType,a),a.oneofs&&(c.value="sparseTensorType")),i.optionalType!=null&&i.hasOwnProperty("optionalType")&&(c.optionalType=l.onnx.TypeProto.Optional.toObject(i.optionalType,a),a.oneofs&&(c.value="optionalType")),c},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TypeProto"},o.Tensor=function(){function i(a){if(a)for(var c=Object.keys(a),h=0;h<c.length;++h)a[c[h]]!=null&&(this[c[h]]=a[c[h]])}return i.prototype.elemType=0,i.prototype.shape=null,i.create=function(a){return new i(a)},i.encode=function(a,c){return c||(c=u.create()),a.elemType!=null&&Object.hasOwnProperty.call(a,"elemType")&&c.uint32(8).int32(a.elemType),a.shape!=null&&Object.hasOwnProperty.call(a,"shape")&&l.onnx.TensorShapeProto.encode(a.shape,c.uint32(18).fork()).ldelim(),c},i.encodeDelimited=function(a,c){return this.encode(a,c).ldelim()},i.decode=function(a,c){a instanceof s||(a=s.create(a));for(var h=c===void 0?a.len:a.pos+c,g=new l.onnx.TypeProto.Tensor;a.pos<h;){var b=a.uint32();switch(b>>>3){case 1:{g.elemType=a.int32();break}case 2:{g.shape=l.onnx.TensorShapeProto.decode(a,a.uint32());break}default:a.skipType(b&7);break}}return g},i.decodeDelimited=function(a){return a instanceof s||(a=new s(a)),this.decode(a,a.uint32())},i.verify=function(a){if(typeof a!="object"||a===null)return"object expected";if(a.elemType!=null&&a.hasOwnProperty("elemType")&&!d.isInteger(a.elemType))return"elemType: integer expected";if(a.shape!=null&&a.hasOwnProperty("shape")){var c=l.onnx.TensorShapeProto.verify(a.shape);if(c)return"shape."+c}return null},i.fromObject=function(a){if(a instanceof l.onnx.TypeProto.Tensor)return a;var c=new l.onnx.TypeProto.Tensor;if(a.elemType!=null&&(c.elemType=a.elemType|0),a.shape!=null){if(typeof a.shape!="object")throw TypeError(".onnx.TypeProto.Tensor.shape: object expected");c.shape=l.onnx.TensorShapeProto.fromObject(a.shape)}return c},i.toObject=function(a,c){c||(c={});var h={};return c.defaults&&(h.elemType=0,h.shape=null),a.elemType!=null&&a.hasOwnProperty("elemType")&&(h.elemType=a.elemType),a.shape!=null&&a.hasOwnProperty("shape")&&(h.shape=l.onnx.TensorShapeProto.toObject(a.shape,c)),h},i.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},i.getTypeUrl=function(a){return a===void 0&&(a="type.googleapis.com"),a+"/onnx.TypeProto.Tensor"},i}(),o.Sequence=function(){function i(a){if(a)for(var c=Object.keys(a),h=0;h<c.length;++h)a[c[h]]!=null&&(this[c[h]]=a[c[h]])}return i.prototype.elemType=null,i.create=function(a){return new i(a)},i.encode=function(a,c){return c||(c=u.create()),a.elemType!=null&&Object.hasOwnProperty.call(a,"elemType")&&l.onnx.TypeProto.encode(a.elemType,c.uint32(10).fork()).ldelim(),c},i.encodeDelimited=function(a,c){return this.encode(a,c).ldelim()},i.decode=function(a,c){a instanceof s||(a=s.create(a));for(var h=c===void 0?a.len:a.pos+c,g=new l.onnx.TypeProto.Sequence;a.pos<h;){var b=a.uint32();switch(b>>>3){case 1:{g.elemType=l.onnx.TypeProto.decode(a,a.uint32());break}default:a.skipType(b&7);break}}return g},i.decodeDelimited=function(a){return a instanceof s||(a=new s(a)),this.decode(a,a.uint32())},i.verify=function(a){if(typeof a!="object"||a===null)return"object expected";if(a.elemType!=null&&a.hasOwnProperty("elemType")){var c=l.onnx.TypeProto.verify(a.elemType);if(c)return"elemType."+c}return null},i.fromObject=function(a){if(a instanceof l.onnx.TypeProto.Sequence)return a;var c=new l.onnx.TypeProto.Sequence;if(a.elemType!=null){if(typeof a.elemType!="object")throw TypeError(".onnx.TypeProto.Sequence.elemType: object expected");c.elemType=l.onnx.TypeProto.fromObject(a.elemType)}return c},i.toObject=function(a,c){c||(c={});var h={};return c.defaults&&(h.elemType=null),a.elemType!=null&&a.hasOwnProperty("elemType")&&(h.elemType=l.onnx.TypeProto.toObject(a.elemType,c)),h},i.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},i.getTypeUrl=function(a){return a===void 0&&(a="type.googleapis.com"),a+"/onnx.TypeProto.Sequence"},i}(),o.Map=function(){function i(a){if(a)for(var c=Object.keys(a),h=0;h<c.length;++h)a[c[h]]!=null&&(this[c[h]]=a[c[h]])}return i.prototype.keyType=0,i.prototype.valueType=null,i.create=function(a){return new i(a)},i.encode=function(a,c){return c||(c=u.create()),a.keyType!=null&&Object.hasOwnProperty.call(a,"keyType")&&c.uint32(8).int32(a.keyType),a.valueType!=null&&Object.hasOwnProperty.call(a,"valueType")&&l.onnx.TypeProto.encode(a.valueType,c.uint32(18).fork()).ldelim(),c},i.encodeDelimited=function(a,c){return this.encode(a,c).ldelim()},i.decode=function(a,c){a instanceof s||(a=s.create(a));for(var h=c===void 0?a.len:a.pos+c,g=new l.onnx.TypeProto.Map;a.pos<h;){var b=a.uint32();switch(b>>>3){case 1:{g.keyType=a.int32();break}case 2:{g.valueType=l.onnx.TypeProto.decode(a,a.uint32());break}default:a.skipType(b&7);break}}return g},i.decodeDelimited=function(a){return a instanceof s||(a=new s(a)),this.decode(a,a.uint32())},i.verify=function(a){if(typeof a!="object"||a===null)return"object expected";if(a.keyType!=null&&a.hasOwnProperty("keyType")&&!d.isInteger(a.keyType))return"keyType: integer expected";if(a.valueType!=null&&a.hasOwnProperty("valueType")){var c=l.onnx.TypeProto.verify(a.valueType);if(c)return"valueType."+c}return null},i.fromObject=function(a){if(a instanceof l.onnx.TypeProto.Map)return a;var c=new l.onnx.TypeProto.Map;if(a.keyType!=null&&(c.keyType=a.keyType|0),a.valueType!=null){if(typeof a.valueType!="object")throw TypeError(".onnx.TypeProto.Map.valueType: object expected");c.valueType=l.onnx.TypeProto.fromObject(a.valueType)}return c},i.toObject=function(a,c){c||(c={});var h={};return c.defaults&&(h.keyType=0,h.valueType=null),a.keyType!=null&&a.hasOwnProperty("keyType")&&(h.keyType=a.keyType),a.valueType!=null&&a.hasOwnProperty("valueType")&&(h.valueType=l.onnx.TypeProto.toObject(a.valueType,c)),h},i.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},i.getTypeUrl=function(a){return a===void 0&&(a="type.googleapis.com"),a+"/onnx.TypeProto.Map"},i}(),o.Optional=function(){function i(a){if(a)for(var c=Object.keys(a),h=0;h<c.length;++h)a[c[h]]!=null&&(this[c[h]]=a[c[h]])}return i.prototype.elemType=null,i.create=function(a){return new i(a)},i.encode=function(a,c){return c||(c=u.create()),a.elemType!=null&&Object.hasOwnProperty.call(a,"elemType")&&l.onnx.TypeProto.encode(a.elemType,c.uint32(10).fork()).ldelim(),c},i.encodeDelimited=function(a,c){return this.encode(a,c).ldelim()},i.decode=function(a,c){a instanceof s||(a=s.create(a));for(var h=c===void 0?a.len:a.pos+c,g=new l.onnx.TypeProto.Optional;a.pos<h;){var b=a.uint32();switch(b>>>3){case 1:{g.elemType=l.onnx.TypeProto.decode(a,a.uint32());break}default:a.skipType(b&7);break}}return g},i.decodeDelimited=function(a){return a instanceof s||(a=new s(a)),this.decode(a,a.uint32())},i.verify=function(a){if(typeof a!="object"||a===null)return"object expected";if(a.elemType!=null&&a.hasOwnProperty("elemType")){var c=l.onnx.TypeProto.verify(a.elemType);if(c)return"elemType."+c}return null},i.fromObject=function(a){if(a instanceof l.onnx.TypeProto.Optional)return a;var c=new l.onnx.TypeProto.Optional;if(a.elemType!=null){if(typeof a.elemType!="object")throw TypeError(".onnx.TypeProto.Optional.elemType: object expected");c.elemType=l.onnx.TypeProto.fromObject(a.elemType)}return c},i.toObject=function(a,c){c||(c={});var h={};return c.defaults&&(h.elemType=null),a.elemType!=null&&a.hasOwnProperty("elemType")&&(h.elemType=l.onnx.TypeProto.toObject(a.elemType,c)),h},i.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},i.getTypeUrl=function(a){return a===void 0&&(a="type.googleapis.com"),a+"/onnx.TypeProto.Optional"},i}(),o.SparseTensor=function(){function i(a){if(a)for(var c=Object.keys(a),h=0;h<c.length;++h)a[c[h]]!=null&&(this[c[h]]=a[c[h]])}return i.prototype.elemType=0,i.prototype.shape=null,i.create=function(a){return new i(a)},i.encode=function(a,c){return c||(c=u.create()),a.elemType!=null&&Object.hasOwnProperty.call(a,"elemType")&&c.uint32(8).int32(a.elemType),a.shape!=null&&Object.hasOwnProperty.call(a,"shape")&&l.onnx.TensorShapeProto.encode(a.shape,c.uint32(18).fork()).ldelim(),c},i.encodeDelimited=function(a,c){return this.encode(a,c).ldelim()},i.decode=function(a,c){a instanceof s||(a=s.create(a));for(var h=c===void 0?a.len:a.pos+c,g=new l.onnx.TypeProto.SparseTensor;a.pos<h;){var b=a.uint32();switch(b>>>3){case 1:{g.elemType=a.int32();break}case 2:{g.shape=l.onnx.TensorShapeProto.decode(a,a.uint32());break}default:a.skipType(b&7);break}}return g},i.decodeDelimited=function(a){return a instanceof s||(a=new s(a)),this.decode(a,a.uint32())},i.verify=function(a){if(typeof a!="object"||a===null)return"object expected";if(a.elemType!=null&&a.hasOwnProperty("elemType")&&!d.isInteger(a.elemType))return"elemType: integer expected";if(a.shape!=null&&a.hasOwnProperty("shape")){var c=l.onnx.TensorShapeProto.verify(a.shape);if(c)return"shape."+c}return null},i.fromObject=function(a){if(a instanceof l.onnx.TypeProto.SparseTensor)return a;var c=new l.onnx.TypeProto.SparseTensor;if(a.elemType!=null&&(c.elemType=a.elemType|0),a.shape!=null){if(typeof a.shape!="object")throw TypeError(".onnx.TypeProto.SparseTensor.shape: object expected");c.shape=l.onnx.TensorShapeProto.fromObject(a.shape)}return c},i.toObject=function(a,c){c||(c={});var h={};return c.defaults&&(h.elemType=0,h.shape=null),a.elemType!=null&&a.hasOwnProperty("elemType")&&(h.elemType=a.elemType),a.shape!=null&&a.hasOwnProperty("shape")&&(h.shape=l.onnx.TensorShapeProto.toObject(a.shape,c)),h},i.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},i.getTypeUrl=function(a){return a===void 0&&(a="type.googleapis.com"),a+"/onnx.TypeProto.SparseTensor"},i}(),o}(),p.OperatorSetIdProto=function(){function o(r){if(r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.domain="",o.prototype.version=d.Long?d.Long.fromBits(0,0,!1):0,o.create=function(r){return new o(r)},o.encode=function(r,i){return i||(i=u.create()),r.domain!=null&&Object.hasOwnProperty.call(r,"domain")&&i.uint32(10).string(r.domain),r.version!=null&&Object.hasOwnProperty.call(r,"version")&&i.uint32(16).int64(r.version),i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new l.onnx.OperatorSetIdProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.domain=r.string();break}case 2:{c.version=r.int64();break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){return typeof r!="object"||r===null?"object expected":r.domain!=null&&r.hasOwnProperty("domain")&&!d.isString(r.domain)?"domain: string expected":r.version!=null&&r.hasOwnProperty("version")&&!d.isInteger(r.version)&&!(r.version&&d.isInteger(r.version.low)&&d.isInteger(r.version.high))?"version: integer|Long expected":null},o.fromObject=function(r){if(r instanceof l.onnx.OperatorSetIdProto)return r;var i=new l.onnx.OperatorSetIdProto;return r.domain!=null&&(i.domain=String(r.domain)),r.version!=null&&(d.Long?(i.version=d.Long.fromValue(r.version)).unsigned=!1:typeof r.version=="string"?i.version=parseInt(r.version,10):typeof r.version=="number"?i.version=r.version:typeof r.version=="object"&&(i.version=new d.LongBits(r.version.low>>>0,r.version.high>>>0).toNumber())),i},o.toObject=function(r,i){i||(i={});var a={};if(i.defaults)if(a.domain="",d.Long){var c=new d.Long(0,0,!1);a.version=i.longs===String?c.toString():i.longs===Number?c.toNumber():c}else a.version=i.longs===String?"0":0;return r.domain!=null&&r.hasOwnProperty("domain")&&(a.domain=r.domain),r.version!=null&&r.hasOwnProperty("version")&&(typeof r.version=="number"?a.version=i.longs===String?String(r.version):r.version:a.version=i.longs===String?d.Long.prototype.toString.call(r.version):i.longs===Number?new d.LongBits(r.version.low>>>0,r.version.high>>>0).toNumber():r.version),a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.OperatorSetIdProto"},o}(),p.OperatorStatus=function(){var o={},r=Object.create(o);return r[o[0]="EXPERIMENTAL"]=0,r[o[1]="STABLE"]=1,r}(),p.FunctionProto=function(){function o(r){if(this.input=[],this.output=[],this.attribute=[],this.attributeProto=[],this.node=[],this.opsetImport=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.name="",o.prototype.input=d.emptyArray,o.prototype.output=d.emptyArray,o.prototype.attribute=d.emptyArray,o.prototype.attributeProto=d.emptyArray,o.prototype.node=d.emptyArray,o.prototype.docString="",o.prototype.opsetImport=d.emptyArray,o.prototype.domain="",o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.name!=null&&Object.hasOwnProperty.call(r,"name")&&i.uint32(10).string(r.name),r.input!=null&&r.input.length)for(var a=0;a<r.input.length;++a)i.uint32(34).string(r.input[a]);if(r.output!=null&&r.output.length)for(var a=0;a<r.output.length;++a)i.uint32(42).string(r.output[a]);if(r.attribute!=null&&r.attribute.length)for(var a=0;a<r.attribute.length;++a)i.uint32(50).string(r.attribute[a]);if(r.node!=null&&r.node.length)for(var a=0;a<r.node.length;++a)l.onnx.NodeProto.encode(r.node[a],i.uint32(58).fork()).ldelim();if(r.docString!=null&&Object.hasOwnProperty.call(r,"docString")&&i.uint32(66).string(r.docString),r.opsetImport!=null&&r.opsetImport.length)for(var a=0;a<r.opsetImport.length;++a)l.onnx.OperatorSetIdProto.encode(r.opsetImport[a],i.uint32(74).fork()).ldelim();if(r.domain!=null&&Object.hasOwnProperty.call(r,"domain")&&i.uint32(82).string(r.domain),r.attributeProto!=null&&r.attributeProto.length)for(var a=0;a<r.attributeProto.length;++a)l.onnx.AttributeProto.encode(r.attributeProto[a],i.uint32(90).fork()).ldelim();return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new l.onnx.FunctionProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.name=r.string();break}case 4:{c.input&&c.input.length||(c.input=[]),c.input.push(r.string());break}case 5:{c.output&&c.output.length||(c.output=[]),c.output.push(r.string());break}case 6:{c.attribute&&c.attribute.length||(c.attribute=[]),c.attribute.push(r.string());break}case 11:{c.attributeProto&&c.attributeProto.length||(c.attributeProto=[]),c.attributeProto.push(l.onnx.AttributeProto.decode(r,r.uint32()));break}case 7:{c.node&&c.node.length||(c.node=[]),c.node.push(l.onnx.NodeProto.decode(r,r.uint32()));break}case 8:{c.docString=r.string();break}case 9:{c.opsetImport&&c.opsetImport.length||(c.opsetImport=[]),c.opsetImport.push(l.onnx.OperatorSetIdProto.decode(r,r.uint32()));break}case 10:{c.domain=r.string();break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.name!=null&&r.hasOwnProperty("name")&&!d.isString(r.name))return"name: string expected";if(r.input!=null&&r.hasOwnProperty("input")){if(!Array.isArray(r.input))return"input: array expected";for(var i=0;i<r.input.length;++i)if(!d.isString(r.input[i]))return"input: string[] expected"}if(r.output!=null&&r.hasOwnProperty("output")){if(!Array.isArray(r.output))return"output: array expected";for(var i=0;i<r.output.length;++i)if(!d.isString(r.output[i]))return"output: string[] expected"}if(r.attribute!=null&&r.hasOwnProperty("attribute")){if(!Array.isArray(r.attribute))return"attribute: array expected";for(var i=0;i<r.attribute.length;++i)if(!d.isString(r.attribute[i]))return"attribute: string[] expected"}if(r.attributeProto!=null&&r.hasOwnProperty("attributeProto")){if(!Array.isArray(r.attributeProto))return"attributeProto: array expected";for(var i=0;i<r.attributeProto.length;++i){var a=l.onnx.AttributeProto.verify(r.attributeProto[i]);if(a)return"attributeProto."+a}}if(r.node!=null&&r.hasOwnProperty("node")){if(!Array.isArray(r.node))return"node: array expected";for(var i=0;i<r.node.length;++i){var a=l.onnx.NodeProto.verify(r.node[i]);if(a)return"node."+a}}if(r.docString!=null&&r.hasOwnProperty("docString")&&!d.isString(r.docString))return"docString: string expected";if(r.opsetImport!=null&&r.hasOwnProperty("opsetImport")){if(!Array.isArray(r.opsetImport))return"opsetImport: array expected";for(var i=0;i<r.opsetImport.length;++i){var a=l.onnx.OperatorSetIdProto.verify(r.opsetImport[i]);if(a)return"opsetImport."+a}}return r.domain!=null&&r.hasOwnProperty("domain")&&!d.isString(r.domain)?"domain: string expected":null},o.fromObject=function(r){if(r instanceof l.onnx.FunctionProto)return r;var i=new l.onnx.FunctionProto;if(r.name!=null&&(i.name=String(r.name)),r.input){if(!Array.isArray(r.input))throw TypeError(".onnx.FunctionProto.input: array expected");i.input=[];for(var a=0;a<r.input.length;++a)i.input[a]=String(r.input[a])}if(r.output){if(!Array.isArray(r.output))throw TypeError(".onnx.FunctionProto.output: array expected");i.output=[];for(var a=0;a<r.output.length;++a)i.output[a]=String(r.output[a])}if(r.attribute){if(!Array.isArray(r.attribute))throw TypeError(".onnx.FunctionProto.attribute: array expected");i.attribute=[];for(var a=0;a<r.attribute.length;++a)i.attribute[a]=String(r.attribute[a])}if(r.attributeProto){if(!Array.isArray(r.attributeProto))throw TypeError(".onnx.FunctionProto.attributeProto: array expected");i.attributeProto=[];for(var a=0;a<r.attributeProto.length;++a){if(typeof r.attributeProto[a]!="object")throw TypeError(".onnx.FunctionProto.attributeProto: object expected");i.attributeProto[a]=l.onnx.AttributeProto.fromObject(r.attributeProto[a])}}if(r.node){if(!Array.isArray(r.node))throw TypeError(".onnx.FunctionProto.node: array expected");i.node=[];for(var a=0;a<r.node.length;++a){if(typeof r.node[a]!="object")throw TypeError(".onnx.FunctionProto.node: object expected");i.node[a]=l.onnx.NodeProto.fromObject(r.node[a])}}if(r.docString!=null&&(i.docString=String(r.docString)),r.opsetImport){if(!Array.isArray(r.opsetImport))throw TypeError(".onnx.FunctionProto.opsetImport: array expected");i.opsetImport=[];for(var a=0;a<r.opsetImport.length;++a){if(typeof r.opsetImport[a]!="object")throw TypeError(".onnx.FunctionProto.opsetImport: object expected");i.opsetImport[a]=l.onnx.OperatorSetIdProto.fromObject(r.opsetImport[a])}}return r.domain!=null&&(i.domain=String(r.domain)),i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.input=[],a.output=[],a.attribute=[],a.node=[],a.opsetImport=[],a.attributeProto=[]),i.defaults&&(a.name="",a.docString="",a.domain=""),r.name!=null&&r.hasOwnProperty("name")&&(a.name=r.name),r.input&&r.input.length){a.input=[];for(var c=0;c<r.input.length;++c)a.input[c]=r.input[c]}if(r.output&&r.output.length){a.output=[];for(var c=0;c<r.output.length;++c)a.output[c]=r.output[c]}if(r.attribute&&r.attribute.length){a.attribute=[];for(var c=0;c<r.attribute.length;++c)a.attribute[c]=r.attribute[c]}if(r.node&&r.node.length){a.node=[];for(var c=0;c<r.node.length;++c)a.node[c]=l.onnx.NodeProto.toObject(r.node[c],i)}if(r.docString!=null&&r.hasOwnProperty("docString")&&(a.docString=r.docString),r.opsetImport&&r.opsetImport.length){a.opsetImport=[];for(var c=0;c<r.opsetImport.length;++c)a.opsetImport[c]=l.onnx.OperatorSetIdProto.toObject(r.opsetImport[c],i)}if(r.domain!=null&&r.hasOwnProperty("domain")&&(a.domain=r.domain),r.attributeProto&&r.attributeProto.length){a.attributeProto=[];for(var c=0;c<r.attributeProto.length;++c)a.attributeProto[c]=l.onnx.AttributeProto.toObject(r.attributeProto[c],i)}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.FunctionProto"},o}(),p}(),t.exports=l});function Vb(e,t){if(!e)throw new Error(typeof t=="string"?t:t())}function gs(e){return new TextDecoder().decode(e)}var Be,Dn,Bd,Mt,Ub,st,Rt,pe,ms,zi,Hn,Wn,Ae=C(()=>{Qm(),Be=de(Zn()),sn(),Dn=class{static arraysEqual(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}},Bd=class{static preprocessInputShapes(e,t){let n=e.length===1?[1,e[0]]:e,s=t.length===1?[t[0],1]:t;return[n,s]}static postprocessOutputShape(e,t,n){t===1&&e.splice(e.length-2,1),n===1&&e.pop()}static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Mt=class Nn{static calcShape(t,n,s=!1){let u=t.length,d=n.length;if(u===0)return n;if(d===0)return t;let l=Math.max(t.length,n.length),p=new Array(l);if(s){if(u<2||d<2)return;let o=Bd.calcMatMulShape([t[u-2],t[u-1]],[n[d-2],n[d-1]]);if(o===void 0)return;[p[l-2],p[l-1]]=o}for(let o=s?3:1;o<=l;o++){let r=u-o<0?1:t[u-o],i=d-o<0?1:n[d-o];if(r!==i&&r>1&&i>1)return;p[l-o]=Math.max(r,i)}return p}static index(t,n){let s=new Array(n.length);return Nn.fillIndex(t,n,s),s}static fillIndex(t,n,s){let u=t.length-n.length;for(let d=0;d<n.length;d++)s[d]=t[u+d]%n[d]}static calc(t,n,s,u,d){let l=Nn.calcShape(t.dims,n.dims);if(l){if(u&&!pe.areEqual(l,t.dims))return;let p=pe.size(l),o=u?t:new lt(l,d||t.type);if(l.length===0)o.set([],s(t.get([]),n.get([])));else{let r=new Array(l.length),i=new Array(t.dims.length),a=new Array(n.dims.length),c=0,h=0,g=!1,b=!1;t.dims.length===0&&(c=t.get([]),g=!0),n.dims.length===0&&(h=n.get([]),b=!0);let x;for(let $=0;$<p;$++){x=$;for(let _=l.length-1;_>=0;_--)r[_]=x%l[_],x=Math.floor(x/l[_]);g||(Nn.fillIndex(r,t.dims,i),c=t.get(i)),b||(Nn.fillIndex(r,n.dims,a),h=n.get(a)),o.set(r,s(c,h))}}return o}}static isValidBroadcast(t,n){let s=t.length,u=n.length;if(s>u)return!1;for(let d=1;d<=s;d++)if(t[s-d]!==1&&t[s-d]!==n[u-d])return!1;return!0}static getBroadcastDims(t,n){let s=t.length,u=[];for(let d=0;d<s;d++){let l=s-1-d,p=t[l]||1;(n[n.length-1-d]||1)>1&&p===1&&u.unshift(l)}return u}},Ub=class{static getShapeOfGemmResult(e,t,n,s,u){if(e.length!==2||n.length!==2)throw new Error("shape need to be of size 2");let d,l,p;t?(d=e[1],l=e[0]):(d=e[0],l=e[1]);let o=-1;if(s?(p=n[0],o=1):(p=n[1],o=0),n[o]!==l)throw new Error("dimension mismatch");if(d<=0||p<=0||l<=0)throw new Error("invalid shape specified");if(u&&!Mt.isValidBroadcast(u,[d,p]))throw new Error("gemm: invalid bias shape for broadcast");return[d,p,l]}},st=class bs{static tensorDataTypeFromProto(t){switch(t){case Be.onnx.TensorProto.DataType.INT8:return"int8";case Be.onnx.TensorProto.DataType.UINT8:return"uint8";case Be.onnx.TensorProto.DataType.BOOL:return"bool";case Be.onnx.TensorProto.DataType.INT16:return"int16";case Be.onnx.TensorProto.DataType.UINT16:return"uint16";case Be.onnx.TensorProto.DataType.INT32:return"int32";case Be.onnx.TensorProto.DataType.UINT32:return"uint32";case Be.onnx.TensorProto.DataType.FLOAT:return"float32";case Be.onnx.TensorProto.DataType.DOUBLE:return"float64";case Be.onnx.TensorProto.DataType.STRING:return"string";case Be.onnx.TensorProto.DataType.INT64:return"int32";case Be.onnx.TensorProto.DataType.UINT64:return"uint32";default:throw new Error(`unsupported data type: ${Be.onnx.TensorProto.DataType[t]}`)}}static tensorDataTypeStringToEnum(t){switch(t){case"int8":return Be.onnx.TensorProto.DataType.INT8;case"uint8":return Be.onnx.TensorProto.DataType.UINT8;case"bool":return Be.onnx.TensorProto.DataType.BOOL;case"int16":return Be.onnx.TensorProto.DataType.INT16;case"uint16":return Be.onnx.TensorProto.DataType.UINT16;case"int32":return Be.onnx.TensorProto.DataType.INT32;case"uint32":return Be.onnx.TensorProto.DataType.UINT32;case"float32":return Be.onnx.TensorProto.DataType.FLOAT;case"float64":return Be.onnx.TensorProto.DataType.DOUBLE;case"string":return Be.onnx.TensorProto.DataType.STRING;case"int64":return Be.onnx.TensorProto.DataType.INT64;case"uint64":return Be.onnx.TensorProto.DataType.UINT64;default:throw new Error(`unsupported data type: ${t}`)}}static tensorDimsFromProto(t){return t.map(n=>jr.isLong(n)?n.toNumber():n)}static tensorValueTypeFromProto(t){return{tensorType:bs.tensorDataTypeFromProto(t.elemType),shape:{dims:bs.tensorDimsFromProto(t.shape.dim.map(n=>n.dimValue))}}}static tensorDimsFromORTFormat(t){let n=[];for(let s=0;s<t.dimsLength();s++)n.push(Rt.longToNumber(t.dims(s)));return n}static tensorAttributesFromORTFormat(t){let n=[];for(let s=0;s<t.attributesLength();s++)n.push(t.attributes(s));return n}},Rt=class{static longToNumber(e){return jr.isLong(e)?e.toNumber():typeof e=="bigint"?Number(e):e}static isLong(e){return jr.isLong(e)||typeof e=="bigint"}},pe=class ir{static size(t){return ir.getSizeFromDimensionRange(t,0,t.length)}static sizeFromDimension(t,n){if(n<0||n>t.length)throw new Error(`invalid dimension of ${n} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return ir.getSizeFromDimensionRange(t,n,t.length)}static sizeToDimension(t,n){if(n<0||n>t.length)throw new Error(`invalid dimension of ${n} for sizeToDimension as Tensor has ${t.length} dimensions.`);return ir.getSizeFromDimensionRange(t,0,n)}static getSizeFromDimensionRange(t,n,s){let u=1;for(let d=n;d<s;d++){if(t[d]<=0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains 0 or negative values in them.");u*=t[d]}return u}static computeStrides(t){let n=t.length;if(n===0)return[];if(n===1)return[1];let s=new Array(n);s[n-1]=1,s[n-2]=t[n-1];for(let u=n-3;u>=0;--u)s[u]=s[u+1]*t[u+1];return s}static transpose(t){return t.slice().reverse()}static indicesToOffset(t,n,s){s===void 0&&(s=t.length);let u=0;for(let d=0;d<s;++d)u+=n[d]*t[d];return u}static offsetToIndices(t,n){let s=n.length;if(s===0)return[];if(s===1)return[t*n[0]];let u=new Array(n.length);for(let d=0;d<u.length-1;++d)u[d]=Math.floor(t/n[d]),t-=u[d]*n[d];return u[u.length-1]=t,u}static normalizeAxis(t,n){if(t<-n&&t>=n)throw new Error("unsupported axis for this operation.");return t<0?t+n:t}static normalizeAxes(t,n){return t.map(s=>this.normalizeAxis(s,n))}static incrementIndex(t,n,s){if(n.length===0||t.length===0)throw new Error("Index incrementing unsupported for scalar Tensor");if(s===void 0)s=n.length;else if(s<=0||s>n.length)throw new Error("Incorrect axis to increment on");for(let u=s-1;u>=0&&(t[u]++,!(t[u]<n[u]));--u)t[u]=0}static calculateReshapedDims(t,n){if(n.length===0){if(t.length===0||ir.size(t)===1)return[];throw new Error("cannot reshape to a scalar Tensor")}let s=n.length,u=new Array(s),d=-1,l=1;for(let o=0;o<s;o++){if(n[o]<-1)throw new Error("a dimension in shape hints cannot be less than -1");if(n[o]===-1){if(d!==-1)throw new Error("at most one dimension in shape hints can be -1");d=o}else{if(n[o]===0){if(o>=t.length)throw new Error("the dimension with value zero exceeds the dimension size of the input tensor");u[o]=t[o]}else u[o]=n[o];l*=u[o]}}let p=ir.size(t);if(d!==-1){if(p%l!==0)throw new Error(`the input tensor cannot be reshaped to the requested shape. Input shape: [${t}] Output shape: [${n}]`);u[d]=p/l}else if(l!==p)throw new Error("reshapedDims and originalDims don't have matching sizes");return u}static sortBasedOnPerm(t,n){return n?n.map(s=>t[s]):t.slice().reverse()}static padShape(t,n){let s=t.length;return t.map((u,d)=>u+n[d]+n[d+s])}static areEqual(t,n){return t.length!==n.length?!1:t.every((s,u)=>s===n[u])}static validateDimsAndCalcSize(t){if(t.length>6)throw new TypeError("Only rank 0 to 6 is supported for tensor shape.");let n=1;for(let s of t){if(!Number.isInteger(s))throw new TypeError(`Invalid shape: ${s} is not an integer`);if(s<0||s>2147483647)throw new TypeError(`Invalid shape: length ${s} is not allowed`);n*=s}return n}static flattenShape(t,n){n<0&&(n+=t.length);let s=t.reduce((d,l)=>d*l,1),u=t.slice(n).reduce((d,l)=>d*l,1);return[s/u,u]}static squeezeShape(t,n){let s=new Array;n=ir.normalizeAxes(n,t.length);for(let u=0;u<t.length;u++){let d=n.indexOf(u)>=0;if(d&&t[u]!==1)throw new Error("squeeze an axis of size different than 1");(n.length===0&&t[u]>1||n.length>0&&!d)&&s.push(t[u])}return s}static unsqueezeShape(t,n){let s=new Array(t.length+n.length);s.fill(0);for(let d=0;d<n.length;d++){let l=ir.normalizeAxis(n[d],s.length);if(l>=s.length)throw new Error("'axes' has an out of range axis");if(s[l]!==0)throw new Error("'axes' has a duplicate axis");s[l]=1}let u=0;for(let d=0;d<s.length;d++)s[d]===0&&(s[d]=t[u++]);if(u!==t.length)throw new Error("the unsqueezed dimension could not be established");return s}},ms=class qb{static splitShape(t,n,s,u){if(s.length===0){if(!u)throw new Error("need to know number of outputs when the 'split' attribute is not specified");qb.determineSplit(t[n],u,s)}let d=[],l=[0];for(let p=0;p<s.length;++p){p!==0&&l.push(l[p-1]+s[p-1]);let o=t.slice();o[n]=s[p],d.push(o)}return[d,l]}static determineSplit(t,n,s){if(t%n!==0)throw new Error("cannot split tensor to equal sized parts");for(let u=0;u<n;++u)s.push(t/n)}},zi=class Cn{static adjustPoolAttributes(t,n,s,u,d,l){if(!t&&s.length!==n.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let p=0;p<n.length-2;p++)p>=s.length?s.push(n[p+2]):s[p]=n[p+2];for(let p=0;p<s.length;p++)if(p<u.length){if(u[p]<0)throw new Error("strides should be greater than or equal to 1")}else u.push(1);for(let p=0;p<s.length;p++)if(p<d.length){if(d[p]<0)throw new Error("dilations should be greater than or equal to 1")}else d.push(1);for(let p=0;p<s.length*2;p++)if(p<l.length){if(l[p]<0)throw new Error("pad should be greater than or equal to 1")}else l.push(0);for(let p=0;p<s.length;p++){if(s[p]<=0)throw new Error("kernel shapes need to be greater than 0");if(l[p]>=s[p]||l[p+s.length]>=s[p])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,n,s,u,d,l){if(l){if(d.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(u.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let p=0;p<t.length-2;p++)Cn.adjustPadAndReturnShape(t[p+2],n[p],s[p],u[p],d,p,p+t.length-2,l)}}static computePoolOutputShape(t,n,s,u,d,l,p){if(n.length<=0)throw new Error("input shape must be of size greater than 0");let o=[n[0],n[1]];return Cn.computeShapeHelper(t,n,o,s,u,d,l,p),o}static computeConvOutputShape(t,n,s,u,d,l,p){if(t.length<=0||n.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let o=[t[0],n[0]];return Cn.computeShapeHelper(!1,t,o,s,u,d,l,p),o}static computeShapeHelper(t,n,s,u,d,l,p,o){if(t)for(let r=0;r<n.length-2;r++)s.push(1);else for(let r=0;r<n.length-2;r++)s.push(Cn.adjustPadAndReturnShape(n[r+2],u[r],d[r],l[r],p,r,r+n.length-2,o))}static adjustPadAndReturnShape(t,n,s,u,d,l,p,o){let r=s*(u-1)+1;if(o&&o!=="NOTSET")switch(o){case"VALID":return d[l]=0,d[p]=0,Math.floor((t-r)/n+1);case"SAME_LOWER":case"SAME_UPPER":if(s!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let i=((t+n-1)/n-1)*n+u-t;return d[l]=Math.floor(o==="SAME_LOWER"?(i+1)/2:i/2),d[p]=i-d[l],Math.floor((t+i-u)/n+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+d[l]+d[p]-r)/n+1)}},Hn=-34028234663852886e22,Wn=34028234663852886e22});function W$(e){switch(e){case"bool":case"int8":case"uint8":return 1;case"int16":case"uint16":return 2;case"int32":case"uint32":case"float32":return 4;case"float64":return 8;default:throw new Error(`cannot calculate sizeof() on type ${e}`)}}function Md(e){switch(e){case ge.onnx.TensorProto.DataType.UINT8:case ge.onnx.TensorProto.DataType.INT8:case ge.onnx.TensorProto.DataType.BOOL:return 1;case ge.onnx.TensorProto.DataType.UINT16:case ge.onnx.TensorProto.DataType.INT16:return 2;case ge.onnx.TensorProto.DataType.FLOAT:case ge.onnx.TensorProto.DataType.INT32:case ge.onnx.TensorProto.DataType.UINT32:return 4;case ge.onnx.TensorProto.DataType.INT64:case ge.onnx.TensorProto.DataType.DOUBLE:case ge.onnx.TensorProto.DataType.UINT64:return 8;default:throw new Error(`cannot calculate sizeof() on type ${ge.onnx.TensorProto.DataType[e]}`)}}function K$(e,t){return new(Gb(t))(e)}function Gb(e){switch(e){case"bool":case"uint8":return Uint8Array;case"int8":return Int8Array;case"int16":return Int16Array;case"uint16":return Uint16Array;case"int32":return Int32Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"float32":return Float32Array;case"float64":return Float64Array;default:throw new Error("unspecified error")}}function ys(e,t){if(t===ge.onnx.TensorProto.DataType.INT64||t===Ai.TensorDataType.INT64){if(e.greaterThanOrEqual(2147483648)||e.lessThan(-2147483648))throw new TypeError("int64 is not supported")}else if(t===ge.onnx.TensorProto.DataType.UINT32||t===Ai.TensorDataType.UINT32||t===ge.onnx.TensorProto.DataType.UINT64||t===Ai.TensorDataType.UINT64){if(e.greaterThanOrEqual(4294967296)||e.lessThan(0))throw new TypeError("uint64 is not supported")}else throw new TypeError(`not a LONG type: ${ge.onnx.TensorProto.DataType[t]}`);return e.toNumber()}function jd(e,t,n){switch(t){case ge.onnx.TensorProto.DataType.BOOL:case ge.onnx.TensorProto.DataType.UINT8:return e.getUint8(n);case ge.onnx.TensorProto.DataType.INT8:return e.getInt8(n);case ge.onnx.TensorProto.DataType.UINT16:return e.getUint16(n,!0);case ge.onnx.TensorProto.DataType.INT16:return e.getInt16(n,!0);case ge.onnx.TensorProto.DataType.FLOAT:return e.getFloat32(n,!0);case ge.onnx.TensorProto.DataType.INT32:return e.getInt32(n,!0);case ge.onnx.TensorProto.DataType.UINT32:return e.getUint32(n,!0);case ge.onnx.TensorProto.DataType.INT64:return ys(jr.fromBits(e.getUint32(n,!0),e.getUint32(n+4,!0),!1),t);case ge.onnx.TensorProto.DataType.DOUBLE:return e.getFloat64(n,!0);case ge.onnx.TensorProto.DataType.UINT64:return ys(jr.fromBits(e.getUint32(n,!0),e.getUint32(n+4,!0),!0),t);default:throw new Error(`cannot read from DataView for type ${ge.onnx.TensorProto.DataType[t]}`)}}var Fd,ge,lt,sn=C(()=>{Fd=de(I$()),Qm(),Xi(),ge=de(Zn()),Ae(),lt=class ki{constructor(t,n,s,u,d,l=Fd.Guid.create()){this.dims=t,this.type=n,this.dataProvider=s,this.asyncDataProvider=u,this.cache=d,this.dataId=l,this.size=pe.validateDimsAndCalcSize(t);let p=this.size,o=s===void 0&&u===void 0&&d===void 0;if(d!==void 0&&d.length!==p)throw new RangeError("Input dims doesn't match data length.");if(n==="string"){if(d!==void 0&&(!Array.isArray(d)||!d.every(r=>typeof r=="string")))throw new TypeError("cache should be a string array");o&&(this.cache=new Array(p))}else{if(d!==void 0){let r=Gb(n);if(!(d instanceof r))throw new TypeError(`cache should be type ${r.name}`)}if(o){let r=new ArrayBuffer(p*W$(n));this.cache=K$(r,n)}}}get data(){if(this.cache===void 0){let t=this.dataProvider(this.dataId);if(t.length!==this.size)throw new Error("Length of data provided by the Data Provider is inconsistent with the dims of this Tensor.");this.cache=t}return this.cache}get stringData(){if(this.type!=="string")throw new TypeError("data type is not string");return this.data}get integerData(){switch(this.type){case"uint8":case"int8":case"uint16":case"int16":case"int32":case"uint32":case"bool":return this.data;default:throw new TypeError("data type is not integer (uint8, int8, uint16, int16, int32, uint32, bool)")}}get floatData(){switch(this.type){case"float32":case"float64":return this.data;default:throw new TypeError("data type is not float (float32, float64)")}}get numberData(){if(this.type!=="string")return this.data;throw new TypeError("type cannot be non-number (string)")}get(t){return this.data[pe.indicesToOffset(t,this.strides)]}set(t,n){this.data[pe.indicesToOffset(t,this.strides)]=n}async getData(){return this.cache===void 0&&(this.cache=await this.asyncDataProvider(this.dataId)),this.cache}get strides(){return this._strides||(this._strides=pe.computeStrides(this.dims)),this._strides}static fromProto(t){if(!t)throw new Error("cannot construct Value from an empty tensor");let n=st.tensorDataTypeFromProto(t.dataType),s=st.tensorDimsFromProto(t.dims),u=new ki(s,n);if(n==="string")t.stringData.forEach((d,l)=>{u.data[l]=gs(d)});else if(t.rawData&&typeof t.rawData.byteLength=="number"&&t.rawData.byteLength>0){let d=u.data,l=new DataView(t.rawData.buffer,t.rawData.byteOffset,t.rawData.byteLength),p=Md(t.dataType),o=t.rawData.byteLength/p;if(t.rawData.byteLength%p!==0)throw new Error("invalid buffer length");if(d.length!==o)throw new Error("buffer length mismatch");for(let r=0;r<o;r++){let i=jd(l,t.dataType,r*p);d[r]=i}}else{let d;switch(t.dataType){case ge.onnx.TensorProto.DataType.FLOAT:d=t.floatData;break;case ge.onnx.TensorProto.DataType.INT32:case ge.onnx.TensorProto.DataType.INT16:case ge.onnx.TensorProto.DataType.UINT16:case ge.onnx.TensorProto.DataType.INT8:case ge.onnx.TensorProto.DataType.UINT8:case ge.onnx.TensorProto.DataType.BOOL:d=t.int32Data;break;case ge.onnx.TensorProto.DataType.INT64:d=t.int64Data;break;case ge.onnx.TensorProto.DataType.DOUBLE:d=t.doubleData;break;case ge.onnx.TensorProto.DataType.UINT32:case ge.onnx.TensorProto.DataType.UINT64:d=t.uint64Data;break;default:throw new Error("unspecific error")}if(d==null)throw new Error("failed to populate data from a tensorproto value");let l=u.data;if(l.length!==d.length)throw new Error("array length mismatch");for(let p=0;p<d.length;p++){let o=d[p];jr.isLong(o)?l[p]=ys(o,t.dataType):l[p]=o}}return u}static fromData(t,n,s){return new ki(n,s,void 0,void 0,t)}static fromOrtTensor(t){if(!t)throw new Error("cannot construct Value from an empty tensor");let n=st.tensorDimsFromORTFormat(t),s=st.tensorDataTypeFromProto(t.dataType()),u=new ki(n,s);if(s==="string")for(let d=0;d<t.stringDataLength();d++)u.data[d]=t.stringData(d);else if(t.rawDataArray()&&typeof t.rawDataLength()=="number"&&t.rawDataLength()>0){let d=u.data,l=new DataView(t.rawDataArray().buffer,t.rawDataArray().byteOffset,t.rawDataLength()),p=Md(t.dataType()),o=t.rawDataLength()/p;if(t.rawDataLength()%p!==0)throw new Error("invalid buffer length");if(d.length!==o)throw new Error("buffer length mismatch");for(let r=0;r<o;r++){let i=jd(l,t.dataType(),r*p);d[r]=i}}return u}}});function we(e){return e===1?Hb:Wb}function X$(e){let t=we(e);return`${t.version}
      precision highp float;
      ${t.attribute} vec3 position;
      ${t.attribute} vec2 textureCoord;

      ${t.varyingVertex} vec2 TexCoords;

      void main()
      {
          gl_Position = vec4(position, 1.0);
          TexCoords = textureCoord;
      }`}function Z$(e){let t=we(e);return`${t.version}
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    ${t.varyingFrag} vec2 TexCoords;
    ${t.outputDeclaration}
    const vec2 halfCR = vec2(0.5, 0.5);

    // Custom vector types to handle higher dimenalities.
    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    `}function J$(e,t){let n=we(e);return`
  void main() {
    int indices[${t}];
    toVec(TexCoords, indices);
    vec4 result = vec4(process(indices));
    ${n.output} = result;
  }
  `}var Hb,Wb,Le=C(()=>{Hb={version:"",attribute:"attribute",varyingVertex:"varying",varyingFrag:"varying",texture2D:"texture2D",output:"gl_FragColor",outputDeclaration:""},Wb={version:"#version 300 es",attribute:"in",varyingVertex:"out",varyingFrag:"in",texture2D:"texture",output:"outputColor",outputDeclaration:"out vec4 outputColor;"}}),$e=C(()=>{});async function Ld(e,t=s=>0,n){return new Promise((s,u)=>{let d=0,l=()=>{if(e()){s();return}d++;let p=t(d);setTimeout(l,p)};l()})}function No(e){return Vb(typeof e<"u"&&e.length!==0,()=>"empty string found for sampler name"),"get"+e.charAt(0).toUpperCase()+e.slice(1)}function Q$(e){return Vb(typeof e<"u"&&e.length!==0,()=>"empty string found for sampler name"),"get"+e.charAt(0).toUpperCase()+e.slice(1)+"AtOutCoords"}function bn(e,t){let n=JSON.parse(JSON.stringify(e));return n=t,n}function yn(e,t){return t.map(n=>e[n]).join(", ")}function ar(e){if(e<=1)return"int";if(e===2)return"ivec2";if(e===3)return"ivec3";if(e===4)return"ivec4";if(e===5)return"ivec5";if(e===6)return"ivec6";throw Error(`GPU for rank ${e} is not yet supported`)}function nn(e=6){return["x","y","z","w","u","v"].slice(0,e)}var qt=C(()=>{Ae()});function Y$(e,t){return nn(t).map(n=>`${e}.${n}`)}function su(e,t){return t===1?[e]:Y$(e,t)}function Jn(){return`
    float getChannel(vec4 frag, int dim) {
      int modCoord = imod(dim, 2);
      return modCoord == 0 ? frag.r : frag.g;
    }

    float getChannel(vec4 frag, vec2 innerDims) {
      vec2 modCoord = mod(innerDims, 2.);
      return modCoord.x == 0. ?
        (modCoord.y == 0. ? frag.r : frag.g) :
        (modCoord.y == 0. ? frag.b : frag.a);
    }
  `}var un=C(()=>{qt()});function eT(e,t,n){if(e===0)return"false";if(e===1)return`rc > ${t[0]}`;let s="";for(let u=e-2;u<e;u++)s+=`${n[u]} >= ${t[u-e+2]}`,u<e-1&&(s+="||");return s}function tT(e,t){let n=e.length;if(n===0)return"getA(), 0, 0, 0";if(n===1)return`getA(rc),
            rc + 1 >= ${e[0]} ? 0. : getA(rc + 1),
            0, 0`;let s="r, c",u="r, cp1",d="rp1, c",l="rp1, cp1",p="";if(n>2)for(let o=0;o<n-2;++o)p=p+`${t[o]},`;return`getA(${p}${s}),
          rEdge ? 0. : getA(${p}${d}),
          cEdge ? 0. : getA(${p}${u}),
          rEdge || cEdge ? 0. : getA(${p}${l})`}function rT(e,t,n,s){return e===0||e===1?"":`
    int r = ${t[e-2]};
    int c = ${t[e-1]};
    int rp1 = ${t[e-2]} + 1;
    int cp1 = ${t[e-1]} + 1;
    bool rEdge = rp1 >= ${s};
    bool cEdge = cp1 >= ${n};
    `}var Co,Vd,Kb,nT=C(()=>{Le(),$e(),qt(),un(),Co={name:"pack",inputNames:["A"],inputTypes:[1]},Vd=(e,t)=>{let n=we(e.session.backend.glContext.version),s=t.dims,u=s.length,d=t.dims.length,l=ar(d),p=su("rc",d),o=rT(d,p,s[s.length-2],s[s.length-1]),r;u===0?r=[1,1]:u===1?r=[s[0],1]:r=[s[d-1],s[d-2]];let i=eT(d,r,p),a=tT(s,p),c=`
        void main() {
          ${l} rc = getOutputCoords();

          if(${i}) {
            ${n.output} = vec4(0);
          } else {
            ${o}

            ${n.output} = vec4(${a});
          }
        }
      `;return{...Co,hasMain:!0,output:{dims:t.dims,type:t.type,textureType:2},shaderSource:c}},Kb=(e,t)=>({...Co,get:()=>Vd(e,t)})});function Ud(e){if(e.length===0)return[1,1,1];let t=1;for(let n=0;n<e.length-2;++n)t*=e[n];return[t,e.length>1?e[e.length-2]:1,e[e.length-1]]}function iT(e,t){let n=!1;return e.length===0||t.length===0?n=!0:e.length<2||t.length<2?n=e[e.length-1]===t[t.length-1]:n=e[e.length-1]===t[t.length-1]&&e[e.length-2]===t[t.length-2],n}function oT(e){let t=pe.computeStrides(e),n=["b","r","c"],s="index";return`
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${t.map((u,d)=>{let l=`int ${n[d]} = ${s} / ${u}`,p=d===t.length-1?`int ${n[d+1]} = ${s} - ${n[d]} * ${u}`:`index -= ${n[d]} * ${u}`;return`${l}; ${p};`}).join("")}
      return ivec3(b, r, c);
    }
  `}function aT(e){let t=pe.computeStrides(e);return`
  int getFlattenedIndex(ivec3 coords) {
    // reverse y, z order
    return coords.x * ${t[0]} + coords.z * ${t[1]} + coords.y;
  }
`}var qd,Gd,Xb,sT=C(()=>{Ae(),Le(),$e(),un(),qd=e=>({name:"Reshape (packed)",inputTypes:[2],inputNames:["A"],cacheHint:`${e}`}),Gd=(e,t,n,s)=>{let u=t.dims,d=s,l="";for(let r=0;r<4;r++){let i="";switch(r){case 0:i="outputCoords = rc;";break;case 1:i="outputCoords = ivec3(rc.x, rc.y+1, rc.z);";break;case 2:i="outputCoords = ivec3(rc.x, rc.y, rc.z+1);";break;case 3:i="outputCoords = ivec3(rc.x, rc.y+1, rc.z+1);";break;default:throw new Error}l+=`
        ${i}
        ${r>0?"if(outputCoords.y < rows && outputCoords.z < cols){":""}
          int flattenedIndex = getFlattenedIndex(outputCoords);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flattenedIndex);
          vec2 innerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${r}] = getChannel(getA(inputRC.x, inputRC.y, inputRC.z), innerDims);

        ${r>0?"}":""}
      `}let p=we(e.session.backend.glContext.version),o=`
      ${oT(u)}
      ${aT(d)}
      ${Jn()}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.0);

        ivec3 outputCoords;
        int rows = ${d[2]};
        int cols = ${d[1]};

        ${l}
        ${p.output} = result;
      }
    `;return{...n,output:{dims:d,type:t.type,textureType:2},shaderSource:o,hasMain:!0}},Xb=(e,t,n)=>{let s=qd(n);return{...s,get:()=>Gd(e,t,s,n)}}}),_s,uT=C(()=>{Le(),$e(),_s=(e,t)=>{let n=t.shape,s=we(e.session.backend.glContext.version),u=`
    const float FLOAT_MAX = 1.70141184e38;
    const float FLOAT_MIN = 1.17549435e-38;

    bool isNaN(float val) {
      return (val < 1.0 || 0.0 < val || val == 0.0) ? false : true;
    }

    highp vec4 encodeAsUint8(highp float v) {
      if (isNaN(v)) {
        return vec4(255, 255, 255, 255);
      }

      highp float av = abs(v);

      if(av < FLOAT_MIN) {
        return vec4(0.0, 0.0, 0.0, 0.0);
      } else if(v > FLOAT_MAX) {
        return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
      } else if(v < -FLOAT_MAX) {
        return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
      }

      highp vec4 c = vec4(0,0,0,0);

      highp float e = floor(log2(av));
      highp float m = exp2(fract(log2(av))) - 1.0;

      c[2] = floor(128.0 * m);
      m -= c[2] / 128.0;
      c[1] = floor(32768.0 * m);
      m -= c[1] / 32768.0;
      c[0] = floor(8388608.0 * m);

      highp float ebias = e + 127.0;
      c[3] = floor(ebias / 2.0);
      ebias -= c[3] * 2.0;
      c[2] += floor(ebias) * 128.0;

      c[3] += 128.0 * step(0.0, -v);

      return c / 255.0;
    }

    void main() {
      float value = ${s.texture2D}(X,TexCoords).r;
      ${s.output} = encodeAsUint8(value);
    }`,d={name:"Uint8Encode",inputTypes:[0],inputNames:["X"],output:{dims:n,type:t.tensor.type,textureType:3},shaderSource:u,hasMain:!0};return e.executeProgram(d,[t.tensor])}});function lT(e,t){if(e===1)return"rc";let n="";for(let s=0;s<e;s++)n+=t[s],s<e-1&&(n+=",");return n}var zo,Hd,Zb,dT=C(()=>{Le(),$e(),qt(),un(),zo={name:"unpack",inputNames:["A"],inputTypes:[2]},Hd=(e,t)=>{let n=t.dims.length,s=su("rc",n),u=s.slice(-2),d=ar(n),l=Jn(),p=t.dims.length===0?"":lT(n,s),o=n<=1?"rc":`vec2(${u.join(",")})`,r=we(e.session.backend.glContext.version),i=`
    ${l}
    void main() {
      ${d} rc = getOutputCoords();

       // Sample the texture with the coords to get the rgba channel value.
       vec4 packedInput = getA(${p});

       ${r.output} = vec4(getChannel(packedInput, ${o}), 0, 0, 0);
     }
   `;return{...zo,hasMain:!0,output:{dims:t.dims,type:t.type,textureType:0},shaderSource:i}},Zb=(e,t)=>({...zo,get:()=>Hd(e,t)})}),Jb,vs,Qb,Ri=C(()=>{Pt(),Jb=class{constructor(e,t=1){if(t===1)this.internalFormat=e.R32F,this.format=e.RED,this.textureType=e.FLOAT,this.channelSize=t;else if(t===4)this.internalFormat=e.RGBA32F,this.format=e.RGBA,this.textureType=e.FLOAT,this.channelSize=t;else throw new Error(`Invalid number of channels: ${t}`)}encode(e,t){let n,s;return e.constructor!==Float32Array&&(qe.warning("Encoder","data was not of type Float32; creating new Float32Array"),s=new Float32Array(e)),t*this.channelSize>e.length?(qe.warning("Encoder","Source data too small. Allocating larger array"),s=e,n=this.allocate(t*this.channelSize),s.forEach((u,d)=>n[d]=u)):(s=e,n=s),n}allocate(e){return new Float32Array(e*4)}decode(e,t){return this.channelSize===1?e.filter((n,s)=>s%4===0).subarray(0,t):e.subarray(0,t)}},vs=class{constructor(e,t=1,n){if(t!==1&&t!==4)throw new Error(`Invalid number of channels: ${t}`);this.internalFormat=e.RGBA,this.format=e.RGBA,this.channelSize=t,this.textureType=n||e.FLOAT}encode(e,t){let n=e;return this.channelSize===1&&(qe.verbose("Encoder","Exploding into a larger array"),n=this.allocate(t),e.forEach((s,u)=>n[u*4]=s)),n}allocate(e){return new Float32Array(e*4)}decode(e,t){return this.channelSize===1?e.filter((n,s)=>s%4===0).subarray(0,t):e.subarray(0,t)}},Qb=class{constructor(e,t=1){if(this.channelSize=4,t===1)this.internalFormat=e.ALPHA,this.format=e.ALPHA,this.textureType=e.UNSIGNED_BYTE,this.channelSize=t;else if(t===4)this.internalFormat=e.RGBA,this.format=e.RGBA,this.textureType=e.UNSIGNED_BYTE,this.channelSize=t;else throw new Error(`Invalid number of channels: ${t}`)}encode(e,t){return new Uint8Array(e.buffer,e.byteOffset,e.byteLength)}allocate(e){return new Uint8Array(e*this.channelSize)}decode(e,t){if(e instanceof Uint8Array)return e.subarray(0,t);throw new Error(`Invalid array type: ${e.constructor}`)}}}),Vn,Yb,ws,pT=C(()=>{Ae(),$e(),Vn=(e,t,n)=>{let s=n===0||n===1?1:4,u=n===2,d=n===1||n===2,l=n===4?t.length-1:void 0,p=n===4?t.map((o,r)=>r===t.length-1?o*4:o):void 0;return ws(e,t,s,p,{isPacked:u,reverseWH:d,breakAxis:l})},Yb=(e,t,n)=>{let s=Vn(e,t,n);return[s.width,s.height]},ws=(e,t,n=1,s,u)=>{let d=!!(u&&u.isPacked),[l,p]=e.computeTextureWH(d&&s||t,u),o=t.length,r=t.slice(0);if(o===0&&(r=[1]),n===1)s=t;else if(d){if(n!==4)throw new Error("a packed texture must be 4-channel");s=t,o>0&&(r[o-1]=Math.ceil(r[o-1]/2)),o>1&&(r[o-2]=Math.ceil(r[o-2]/2))}else if(!s)throw new Error("Unpacked shape is needed when using channels > 1");return{width:l,height:p,channels:n,isPacked:d,shape:r,strides:pe.computeStrides(r),unpackedShape:s,reversedWH:u&&u.reverseWH}}}),Wd,ey,cT=C(()=>{Pt(),sn(),Ae(),nT(),sT(),uT(),dT(),Ri(),pT(),$e(),Wd=(e,t)=>{let n=t.map(u=>`${u.unpackedShape.join(",")};${u.width}x${u.height}`).join("_"),s=e.name;return e.cacheHint&&(s+="["+e.cacheHint+"]"),s+=":"+n,s},ey=class{constructor(e){this.session=e,this.packedTextureDataCache=new Map,this.unpackedTextureDataCache=new Map}calculateTextureWidthAndHeight(e,t){return Yb(this.session.layoutStrategy,e,t)}executeProgram(e,t){if(t.length<e.inputNames.length)throw new Error(`Input size mustn't be less than ${e.inputNames.length}.`);if(e.inputNames.length!==e.inputTypes.length)throw new Error("input names size does not match input types");let n=[];for(let o=0;o<e.inputNames.length;++o)n[o]=this.getOrCreateTextureData(t[o],e.inputTypes[o]);let s=Wd(e,n),u=this.session.programManager.getArtifact(s),d=u?u.programInfo:typeof e.get=="function"?e.get():e,l=Vn(this.session.layoutStrategy,d.output.dims,d.output.textureType),p=this.createTextureData(l,d.output.type);return u||(u=this.session.programManager.build(d,n,p),this.session.programManager.setArtifact(s,u)),this.runProgram(u,n,p),p}run(e,t){return this.executeProgram(e,t).tensor}runProgram(e,t,n){for(let s=0;s<t.length;++s)if(!!t[s].isPacked!=(e.programInfo.inputTypes[s]===2))throw new Error(`input[${s}] property packed inconsistent`);if(!!n.isPacked!=(e.programInfo.output.textureType===2))throw new Error("output property packed inconsistent");this.session.programManager.run(e,t,n)}getOrCreateTextureData(e,t){let n=this.getTextureData(e.dataId,t===2);if(!n&&(n=this.getTextureData(e.dataId,t!==2),n))return t===2?this.pack(n):this.unpack(n);if(!n){let s=Vn(this.session.layoutStrategy,e.dims,t);if(t===4){let u=e.dims;if(u.length===4){let d=[u[0],Math.ceil(u[1]*u[2]*u[3]/4)],l=Vn(this.session.layoutStrategy,d,t),p=e.numberData;if(u[1]*u[2]*u[3]%4!==0){let o=u[0],r=u[1]*u[2]*u[3],i=Math.ceil(r*1/4)*4,a=o*i;p=new Float32Array(a);for(let c=0;c<o;++c){let h=c*r,g=c*i+c%1*r;p.set(e.numberData.subarray(h,h+r),g)}}return this.createTextureData(l,e.type,p,e,1)}}if(t===2){let u=ws(this.session.layoutStrategy,e.dims,1,[],{reverseWH:!0}),d=this.createTextureData(u,e.type,e.numberData,e,1);n=this.pack(d)}else n=this.createTextureData(s,e.type,e.numberData,e,1)}return n}createTextureDataFromLayoutBindTensor(e,t,n,s){return this.createTextureData(e,t,n,s,1)}createTextureData(e,t,n,s,u){qe.verbose("InferenceHandler",`Creating TextureData: layout:[${JSON.stringify(e)}]`);let d=this.session.textureManager.createTextureFromLayout(t,e,n,u);return this.createTextureDataFromTexture(e,t,d,s)}reshapeUnpacked(e,t){let n=this.getOrCreateTextureData(e,0),s={channels:n.channels,height:n.height,width:n.width,shape:t.length!==0?t:[1],strides:pe.computeStrides(t),unpackedShape:t};return this.createTextureDataFromTexture(s,e.type,n.texture).tensor}reshapePacked(e,t){let n=this.getOrCreateTextureData(e,2);if(iT(e.dims,t)){let p={channels:n.channels,height:n.height,width:n.width,shape:t.length!==0?t:[1],strides:pe.computeStrides(t),unpackedShape:t,isPacked:!0};return this.createTextureDataFromTexture(p,e.type,n.texture).tensor}let s=Ud(e.dims),u=Ud(t),d=this.reshapePacked(e,s),l=this.run(Xb(this,d,u),[d]);return this.reshapePacked(l,t)}cast(e,t){let n=this.getOrCreateTextureData(e,0);return this.createTextureDataFromTexture(n,t,n.texture).tensor}createTextureDataFromTexture(e,t,n,s,u){let d={...e,tensor:s||new lt(e.unpackedShape,t,l=>this.readTexture(d),async l=>this.readTextureAsync(d),void 0,u),texture:n};return this.setTextureData(d.tensor.dataId,d,e.isPacked),d}getTextureData(e,t=!1){return this.session.isInitializer(e)?this.session.getTextureData(e,t):t?this.packedTextureDataCache.get(e):this.unpackedTextureDataCache.get(e)}setTextureData(e,t,n=!1){this.session.isInitializer(e)?this.session.setTextureData(e,t,n):(n?this.packedTextureDataCache:this.unpackedTextureDataCache).set(e,t)}isTextureLayoutCached(e,t=!1){return!!this.getTextureData(e.dataId,t)}dispose(){this.session.textureManager.clearActiveTextures(),this.packedTextureDataCache.forEach(e=>this.session.textureManager.releaseTexture(e)),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache.forEach(e=>this.session.textureManager.releaseTexture(e)),this.unpackedTextureDataCache=new Map}readTexture(e){return e.isPacked?this.readTexture(this.unpack(e)):this.session.backend.glContext.isFloat32DownloadSupported?this.session.textureManager.readTexture(e,e.tensor.type,e.channels):this.session.textureManager.readUint8TextureAsFloat(_s(this,e))}async readTextureAsync(e){return e.isPacked?this.readTextureAsync(this.unpack(e)):this.session.backend.glContext.isFloat32DownloadSupported?this.session.textureManager.readTextureAsync(e,e.tensor.type,e.channels):this.session.textureManager.readUint8TextureAsFloat(_s(this,e))}pack(e){return this.executeProgram(Kb(this,e.tensor),[e.tensor])}unpack(e){return this.executeProgram(Zb(this,e.tensor),[e.tensor])}}}),Kd,Me,Je=C(()=>{Kd=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},Me=e=>new Kd(e)}),Ro,ty,ry,Xd,Zd,hT=C(()=>{Je(),Le(),$e(),Ro={name:"BatchNormalization",inputNames:["A","Scale","B","Mean","Variance"],inputTypes:[0,0,0,0,0]},ty=(e,t,n)=>(Zd(t),[e.run({...Ro,cacheHint:n.cacheKey,get:()=>Xd(e,t,n)},t)]),ry=e=>{let t=e.attributes.getFloat("epsilon",1e-5),n=e.attributes.getFloat("momentum",.9),s=e.attributes.getInt("spatial",1);return Me({epsilon:t,momentum:n,spatial:s})},Xd=(e,t,n)=>{let s=we(e.session.backend.glContext.version),u=t[0].dims.length,[d,l]=e.calculateTextureWidthAndHeight(t[1].dims,0),p=`
  float process(int[${u}] indices) {
    vec2 position = offsetToCoords(indices[1], ${d}, ${l});
    float scale = getColorAsFloat(${s.texture2D}(Scale, position));
    float mean = getColorAsFloat(${s.texture2D}(Mean, position));
    float variance = getColorAsFloat(${s.texture2D}(Variance, position));
    float b = getColorAsFloat(${s.texture2D}(B, position));

    return scale * ( (_A(indices) - mean) / sqrt(variance + float(${n.epsilon})) ) + b;
  }`;return{...Ro,output:{dims:t[0].dims,type:t[0].type,textureType:0},shaderSource:p}},Zd=e=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs.");let t=e[0],n=e[1],s=e[2],u=e[3],d=e[4];if(t.dims.length<3||n.dims.length!==1||s.dims.length!==1||u.dims.length!==1||d.dims.length!==1)throw new Error("invalid input shape.");if(n.dims[0]!==t.dims[1]||s.dims[0]!==t.dims[1]||u.dims[0]!==t.dims[1]||d.dims[0]!==t.dims[1])throw new Error("invalid input shape.");if(t.type!=="float32"&&t.type!=="float64"||n.type!=="float32"&&n.type!=="float64"||s.type!=="float32"&&s.type!=="float64"||u.type!=="float32"&&u.type!=="float64"||d.type!=="float32"&&d.type!=="float64")throw new Error("invalid input tensor types.")}}),ny,ln,Y,xs,iy,ur=C(()=>{ny=class{constructor(e,t,n,s){this.glContext=e,this.programInfo=t,this.inputTextureLayouts=n,this.outputTextureLayout=s}},ln=class{constructor(e){this.context=e}},Y=class{constructor(e,t){this.routineBody=e,this.dependencies=t}},xs=class{constructor(e,t,n){this.name=e,n?this.dependencies=n:this.dependencies=[],t&&(this.routineBody=t)}addDependency(e){e&&this.dependencies.push(e)}},iy=class{static returnOrderedNodes(e){if(!e||e.length===0)return[];if(e.length===1)return e;let t=new Set,n=new Set,s=new Array;return this.createOrderedNodes(e,t,n,s),s}static createOrderedNodes(e,t,n,s){for(let u=0;u<e.length;++u)this.dfsTraverse(e[u],t,n,s)}static dfsTraverse(e,t,n,s){if(!e||n.has(e.name))return;if(t.has(e.name))throw new Error("Cyclic dependency detected. Can't topologically sort routines needed for shader.");t.add(e.name);let u=e.dependencies;if(u&&u.length>0)for(let d=0;d<u.length;++d)this.dfsTraverse(u[d],t,n,s);s.push(e),n.add(e.name),t.delete(e.name)}}});function fT(){let e="add_";return{body:`
  float ${e}(float a, float b) {
    return a + b;
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return v1 + v2;
  }
  `,name:e,type:0}}function gT(){let e="div_";return{body:`
  float ${e}(float a, float b) {
    return a / b;
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return v1 / v2;
  }
  `,name:e,type:0}}function mT(){let e="mul_";return{body:`
  float ${e}(float a, float b) {
    return a * b;
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return v1 * v2;
  }
  `,name:e,type:0}}function bT(){let e="sub_";return{body:`
  float ${e}(float a, float b) {
    return a - b;
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return v1 - v2;
  }
  `,name:e,type:0}}function yT(){let e="equal_";return{body:`
  float ${e}(float a, float b) {
    return float(a == b);
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return vec4(equal(v1, v2));
  }
  `,name:e,type:0}}function _T(){let e="greater_";return{body:`
  float ${e}(float a, float b) {
    return float(a > b);
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return vec4( v1.r > v2.r ,
      v1.g > v2.g,
      v1.b > v2.b,
      v1.a > v2.a );
  }
  `,name:e,type:0}}function vT(){let e="less_";return{body:`
  float ${e}(float a, float b) {
    return float(a < b);
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return vec4( v1.r < v2.r ,
                v1.g < v2.g,
                v1.b < v2.b,
                v1.a < v2.a );
  }
  `,name:e,type:0}}function wT(){let e="and_";return{body:`
  float ${e}(float a, float b) {
    return float( bool(a) && bool(b) );
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r && b2.r ,
                b1.g && b2.g,
                b1.b && b2.b,
                b1.a && b2.a );
  }
  `,name:e,type:0}}function xT(){return{body:`
  float or_(float a, float b) {
    return float( bool(a) || bool(b) );
  }
  vec4 or_(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r || b2.r ,
                b1.g || b2.g,
                b1.b || b2.b,
                b1.a || b2.a );
  }
  `,name:"or_",type:0}}function $T(){let e="xor_";return{body:`
  float ${e}(float a, float b) {
    return float( bool(a) ^^ bool(b) );
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r ^^ b2.r ,
                b1.g ^^ b2.g,
                b1.b ^^ b2.b,
                b1.a ^^ b2.a );
  }
  `,name:e,type:0}}function TT(){return IT("pow")}function ST(){let e="prelu_";return{body:`
  float ${e}(float a, float b) {
    return a < 0.0 ? a * b: a;
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return vec4(
      v1.r < 0.0 ? v1.r * v2.r: v1.r,
      v1.g < 0.0 ? v1.g * v2.g: v1.g,
      v1.b < 0.0 ? v1.b * v2.b: v1.b,
      v1.a < 0.0 ? v1.a * v2.a: v1.a
      );
  }
  `,name:e,type:0}}function IT(e){let t=`${e}_`;return{body:`
  float ${t}(float a, float b) {
    return ${e}(a, b);
  }
  vec4 ${t}(vec4 v1, vec4 v2) {
    return ${e}(v1, v2);
  }
  `,name:t,type:0}}var ot,Jd,oy,ay,sy,uy,ly,dy,py,cy,hy,fy,gy,my,OT=C(()=>{Ae(),ur(),Le(),$e(),ot=(e,t,n,s=t[0].type,u)=>{let d=e.session.pack?2:0;return{name:n.name,inputNames:["A","B"],inputTypes:[d,d],cacheHint:u,get:()=>Jd(e,t,n,s)}},Jd=(e,t,n,s=t[0].type)=>{let u=e.session.pack?2:0,d=!pe.areEqual(t[0].dims,t[1].dims),l=t[0].dims,p=e.session.pack;if(d){let i=Mt.calcShape(t[0].dims,t[1].dims,!1);if(!i)throw new Error("Can't perform binary op on the given tensors");l=i;let a=l.length,c=t[0].dims.length!==0?t[0].dims.length:1,h=t[1].dims.length!==0?t[1].dims.length:1,g=t[0].dims.length!==0?"bcastIndices_A(indices, aindices);":"aindices[0] = 0;",b=t[1].dims.length!==0?"bcastIndices_B(indices, bindices);":"bindices[0] = 0;",x=we(e.session.backend.glContext.version),$=p?`
      ${n.body}
      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();
        vec4 result = ${n.name}(a, b);
        ${x.output} = result;
      }`:`
      ${n.body}
      float process(int indices[${a}]) {
        int aindices[${c}];
        int bindices[${h}];
        ${g}
        ${b}
        return ${n.name}(_A(aindices), _B(bindices));
      }`;return{name:n.name,inputNames:["A","B"],inputTypes:[u,u],output:{dims:l,type:s,textureType:u},shaderSource:$,hasMain:p}}let o=we(e.session.backend.glContext.version),r=`
    ${n.body}
    void main() {
      vec4 v1 = ${o.texture2D}(A, TexCoords);
      vec4 v2 = ${o.texture2D}(B, TexCoords);
      vec4 result = ${n.name}(v1, v2);
      ${o.output} = result;
    }
    `;return{name:n.name,inputNames:["A","B"],inputTypes:[u,u],output:{dims:t[0].dims,type:s,textureType:u},shaderSource:r,hasMain:!0}},oy=(e,t)=>[e.run(ot(e,t,fT()),t)],ay=(e,t)=>[e.run(ot(e,t,wT(),"bool"),t)],sy=(e,t)=>[e.run(ot(e,t,gT()),t)],uy=(e,t)=>[e.run(ot(e,t,yT(),"bool"),t)],ly=(e,t)=>[e.run(ot(e,t,_T(),"bool"),t)],dy=(e,t)=>[e.run(ot(e,t,vT(),"bool"),t)],py=(e,t)=>[e.run(ot(e,t,mT()),t)],cy=(e,t)=>[e.run(ot(e,t,xT(),"bool"),t)],hy=(e,t)=>[e.run(ot(e,t,TT()),t)],fy=(e,t)=>[e.run(ot(e,t,ST()),t)],gy=(e,t)=>[e.run(ot(e,t,bT()),t)],my=(e,t)=>[e.run(ot(e,t,$T(),"bool"),t)]}),by,yy,Qd,ET=C(()=>{Ae(),by=(e,t,n)=>(Qd(t),[e.cast(t[0],n)]),yy=e=>st.tensorDataTypeFromProto(e.attributes.getInt("to")),Qd=e=>{if(!e||e.length!==1)throw new Error("Cast requires 1 input.");if(e[0].type==="string")throw new Error("Invalid input type.")}}),Yd,ep,_y,_n,PT=C(()=>{Le(),$e(),qt(),un(),Yd=(e,t)=>({name:"Concat (packed)",inputNames:Array.from({length:e},(n,s)=>`X${s}`),inputTypes:Array(e).fill(2),cacheHint:t}),ep=(e,t,n,s)=>{let u=n[0].dims.slice();if(s>=u.length||s<-1*u.length)throw new Error("axis specified for concat doesn't match input dimensionality");s<0&&(s=u.length+s);let d=u.slice(0);for(let E=1;E<n.length;E++){let A=n[E].dims.slice();for(let D=0;D<u.length;D++)if(D===s)d[s]+=A[D];else if(u[D]!==A[D])throw new Error("non concat dimensions must match")}let l=d.length,p=su("coords",l),o=ar(l),r=Jn(),i=n.map(E=>E.dims),a=nn(l),c=new Array(i.length-1);c[0]=i[0][s];for(let E=1;E<c.length;E++)c[E]=c[E-1]+i[E][s];let h=a[s],g=a.slice(-2),b=a.join(),x=`if (${h} < ${c[0]}) {
        return getChannel(
            getX0(${b}), vec2(${g.join()}));
        }`;for(let E=1;E<c.length;E++){let A=c[E-1];x+=`
            if (${h} < ${c[E]}  && ${h} >= ${c[E-1]}) {
              return getChannel(
                getX${E}(${_n(a,h,A)}),
                vec2(${_n(g,h,A)}));
            }`}let $=c.length,_=c[c.length-1];x+=`
            return getChannel(
              getX${$}(${_n(a,h,_)}),
              vec2(${_n(g,h,_)}));`;let O=we(e.session.backend.glContext.version),I=`
          ${r}
          float getValue(${a.map(E=>"int "+E)}) {
            ${x}
          }

          void main() {
            ${o} coords = getOutputCoords();
            int lastDim = coords.${a[l-1]};
            coords.${a[l-1]} = coords.${a[l-2]};
            coords.${a[l-2]} = lastDim;

            vec4 result = vec4(getValue(${p}), 0., 0., 0.);

            ${p[l-1]} = ${p[l-1]} + 1;
            if (${p[l-1]} < ${d[l-1]}) {
              result.g = getValue(${p});
            }

            ${p[l-2]} = ${p[l-2]} + 1;
            if (${p[l-2]} < ${d[l-2]}) {
              result.a = getValue(${p});
            }

            ${p[l-1]} = ${p[l-1]} - 1;
            if (${p[l-2]} < ${d[l-2]} &&
                ${p[l-1]} < ${d[l-1]}) {
              result.b = getValue(${p});
            }
            ${O.output} = result;
          }
        `;return{...t,output:{dims:d,type:n[0].type,textureType:2},shaderSource:I,hasMain:!0}},_y=(e,t,n)=>{let s=Yd(t.length,n.cacheKey);return{...s,get:()=>ep(e,s,t,n.axis)}},_n=(e,t,n)=>{let s=e.indexOf(t);return e.map((u,d)=>d===s?`${u} - ${n}`:u).join()}}),vy,tp,rp,np,Bo,ip,op,ap,wy,sp,AT=C(()=>{Je(),$e(),PT(),vy=(e,t,n)=>(sp(t),e.session.pack&&t[0].dims.length>1?[e.run(_y(e,t,n),t)]:[e.run(np(e,t,n),t)]),tp=(e,t)=>({name:"Concat",inputNames:Array.from({length:e},(n,s)=>`X${s}`),inputTypes:Array(e).fill(0),cacheHint:t}),rp=(e,t,n,s)=>{let u=n[0].dims.slice();if(s>=u.length||s<-1*u.length)throw new Error("axis specified for concat doesn't match input dimensionality");s<0&&(s=u.length+s);let d=u.slice(0);for(let h=1;h<n.length;h++){let g=n[h].dims.slice();for(let b=0;b<u.length;b++)if(b===s)d[s]+=g[b];else if(u[b]!==g[b])throw new Error("non concat dimensions must match")}let l=d.length,p=new Array(n.length),o=0;for(let h=0;h<p.length;++h)o+=n[h].dims[s],p[h]=o;let r="";n.length<5?r=Bo(p):r=ip(p);let i=op(n.length,l),a=ap(p),c=`
        ${i}
        ${a}
        ${r}
        float process(int indices[${l}]) {
          int textureIndex = getTextureWhereDataResides (indices[${s}]);

          if(textureIndex != 0) {
            indices[${s}] = indices[${s}] - int(getSizeInConcatAxisValueFromIndex(textureIndex-int(1)));
          }

          return fetchDataFromCorrectTexture(textureIndex, indices);
        }`;return{...t,output:{dims:d,type:n[0].type,textureType:0},shaderSource:c}},np=(e,t,n)=>{let s=tp(t.length,n.cacheKey);return{...s,get:()=>rp(e,s,t,n.axis)}},Bo=e=>`int getTextureWhereDataResides(int index) {
      ${e.map((t,n)=>`if(index<${t}) {return ${n};}
`).join("")}
    }`,ip=e=>Bo(e),op=(e,t)=>{let n=[`float fetchDataFromCorrectTexture(int textureIndex, int indices[${t}]) {`];for(let s=0;s<e;++s)s===0?n.push(`	if (textureIndex == ${s}) { return _X${s}(indices); }`):s===e-1?n.push(`	else { return _X${s}(indices); }`):n.push(`	else if (textureIndex == ${s}) { return _X${s}(indices); }`);return n.push("	}"),n.join(`
`)},ap=e=>{let t=["int getSizeInConcatAxisValueFromIndex(int index) {"];for(let n=0;n<e.length;++n)n===0?t.push(`	if (index == ${n}) { return ${e[n]}; }`):n===e.length-1?t.push(`	else { return ${e[n]}; }`):t.push(`	else if (index == ${n}) { return ${e[n]}; }`);return t.push("	}"),t.join(`
`)},wy=e=>Me({axis:e.attributes.getInt("axis")}),sp=e=>{if(!e||e.length<1)throw new Error("too few inputs");let t=e[0].type,n=e[0].dims.length;if(t==="string")throw new Error("string tensor is not supported yet");for(let s of e){if(s.type!==t)throw new Error("input tensors should be one type");if(s.dims.length!==n)throw new Error("input tensors should have the same shape")}}});function kT(){return yt("abs")}function DT(){return yt("acos")}function NT(){return yt("asin")}function CT(){return yt("atan")}function zT(){return yt("ceil")}function RT(){return yt("cos")}function BT(e){return{body:`
  const float alpha = float(${e});

  float elu_(float a) {
    return a >= 0.0 ? a: (exp(a) - 1.0) * alpha;
  }
  vec4 elu_(vec4 v) {
    return vec4(elu_(v.x), elu_(v.y), elu_(v.z), elu_(v.w));
  }
  `,name:"elu",type:0}}function MT(){return yt("exp")}function jT(){return yt("floor")}function xy(e,t){let n="clip";return{body:`
  const float min = float(${e});
  const float max = float(${t});

  float ${n}_(float a) {
    return clamp(a, min, max);
  }
  vec4 ${n}_(vec4 v) {
    return clamp(v, min, max);
  }
  `,name:n,type:0}}function FT(){let e="indentity";return{body:`
  float ${e}_(float a) {
    return a;
  }
  vec4 ${e}_(vec4 v) {
    return v;
  }
  `,name:e,type:0}}function LT(e){let t="leakyRelu";return{body:`
  const float alpha = float(${e});

  float ${t}_(float a) {
    return a < 0.0 ? a * alpha : a;
  }
  vec4 ${t}_(vec4 v) {
    return vec4(${t}_(v.x), ${t}_(v.y), ${t}_(v.z), ${t}_(v.w));
  }
  `,name:t,type:0}}function VT(){return yt("log")}function UT(){return{body:`
  float neg_(float a) {
    return -a;
  }
  vec4 neg_(vec4 v) {
    return -v;
  }
  `,name:"neg",type:0}}function qT(){return{body:`
  float not_(float a) {
    return float( ! bool(a) );
  }
  bool not_(bool a) {
    return !a;
  }
  vec4 not_(vec4 v) {
    return vec4(!bool(v.x), !bool(v.y), !bool(v.z), !bool(v.w));
  }
  bvec4 not_(bvec4 v) {
    return bvec4(!v.x, !v.y, !v.z, !v.w);
  }
  `,name:"not",type:0}}function GT(){return yt("sin")}function $y(){let e="relu";return{body:`
  float ${e}_(float a) {
    return max( a, 0.0 );
  }
  vec4 ${e}_(vec4 v) {
    return max( v, 0.0 );
  }
  `,name:e,type:0}}function Ty(){let e="sigmoid";return{body:`
  float ${e}_(float a) {
    return 1.0 / (1.0 + exp(-a));
  }
  vec4 ${e}_(vec4 v) {
    return 1.0 / (1.0 + exp(-v));
  }
  `,name:e,type:0}}function HT(){return yt("sqrt")}function WT(){return yt("tan")}function KT(){let e="tanh";return{body:`
  float ${e}_(float a) {
    a = clamp(a, -10., 10.);
    a = exp(2.*a);
    return (a - 1.) / (a + 1.);
  }
  vec4 ${e}_(vec4 v) {
    v = clamp(v, -10., 10.);
    v = exp(2.*v);
    return (v - 1.) / (v + 1.);
  }
  `,name:e,type:0}}function yt(e){return{body:`
  float ${e}_(float a) {
    return ${e}(a);
  }
  vec4 ${e}_(vec4 v) {
    return ${e}(v);
  }
  `,name:e,type:0}}var up,Ue,Sy,Iy,Oy,Ey,$s,Py,Ay,lp,ky,Dy,Ny,Cy,zy,Ry,Ts,By,My,jy,Fy,Ly,Vy,Uy,qy,Gy,Hy,Wy,Ky=C(()=>{Je(),Ae(),ur(),Le(),$e(),up=(e,t,n,s)=>{let u=e.session.pack?2:0,d=we(e.session.backend.glContext.version);return{...t,output:{dims:n.dims,type:n.type,textureType:u},shaderSource:`
     ${s.body}
     void main() {
       vec4 v = ${d.texture2D}(A, TexCoords);
       v = ${s.name}_(v);
       ${d.output} = v;
     }
     `,hasMain:!0}},Ue=(e,t,n,s)=>{let u=e.session.pack?2:0,d={name:n.name,inputTypes:[u],inputNames:["A"],cacheHint:s};return{...d,get:()=>up(e,d,t,n)}},Sy=(e,t)=>[e.run(Ue(e,t[0],kT()),t)],Iy=(e,t)=>[e.run(Ue(e,t[0],DT()),t)],Oy=(e,t)=>[e.run(Ue(e,t[0],NT()),t)],Ey=(e,t)=>[e.run(Ue(e,t[0],CT()),t)],$s=(e,t,n)=>[e.run(Ue(e,t[0],xy(n.min,n.max),n.cacheKey),t)],Py=e=>Me({min:e.attributes.getFloat("min",Hn),max:e.attributes.getFloat("max",Wn)}),Ay=(e,t)=>{let n=lp(e,t);return $s(e,[t[0]],n)},lp=(e,t)=>{if(t.length>=3&&(!e.session.isInitializer(t[1].dataId)||!e.session.isInitializer(t[2].dataId)))throw new Error("dynamic clip attributes are not allowed");let n=t.length>=3?t[1].numberData[0]:Hn,s=t.length>=3?t[2].numberData[0]:Wn;return Me({min:n,max:s})},ky=(e,t)=>[e.run(Ue(e,t[0],zT()),t)],Dy=(e,t)=>[e.run(Ue(e,t[0],RT()),t)],Ny=(e,t,n)=>[e.run(Ue(e,t[0],BT(n.alpha),n.cacheKey),t)],Cy=e=>Me({alpha:e.attributes.getFloat("alpha",1)}),zy=(e,t)=>[e.run(Ue(e,t[0],MT()),t)],Ry=(e,t)=>[e.run(Ue(e,t[0],jT()),t)],Ts=(e,t)=>[e.run(Ue(e,t[0],FT()),t)],By=(e,t,n)=>[e.run(Ue(e,t[0],LT(n.alpha),n.cacheKey),t)],My=e=>Me({alpha:e.attributes.getFloat("alpha",.01)}),jy=(e,t)=>[e.run(Ue(e,t[0],VT()),t)],Fy=(e,t)=>[e.run(Ue(e,t[0],UT()),t)],Ly=(e,t)=>[e.run(Ue(e,t[0],qT()),t)],Vy=(e,t)=>[e.run(Ue(e,t[0],$y()),t)],Uy=(e,t)=>[e.run(Ue(e,t[0],Ty()),t)],qy=(e,t)=>[e.run(Ue(e,t[0],GT()),t)],Gy=(e,t)=>[e.run(Ue(e,t[0],HT()),t)],Hy=(e,t)=>[e.run(Ue(e,t[0],WT()),t)],Wy=(e,t)=>[e.run(Ue(e,t[0],KT()),t)]});function Qn(e){let t;switch(e.activation){case"Relu":t=$y();break;case"Sigmoid":t=Ty();break;case"Clip":t=xy(e.clipMin,e.clipMax);break;default:return{activationFunction:"",applyActivation:""}}let n=t.name,s=t.body,u=`value = ${n}_(value);`;return{activationFunction:s,applyActivation:u}}var Zi,dn=C(()=>{Ae(),Ky(),Zi=e=>{let t=e.getString("activation","");if(t==="Clip"){let[n,s]=e.getFloats("activation_params",[Hn,Wn]);return{activation:t,clipMax:s,clipMin:n,activationCacheKey:`${t}:${n},${s}`}}return{activation:t,activationCacheKey:t}}}),dp,pp,Xy,XT=C(()=>{Pt(),Le(),$e(),du(),dn(),dp=(e,t)=>({name:"GroupedConv",inputNames:e?["X","W","Bias"]:["X","W"],inputTypes:e?[0,0,0]:[0,0],cacheHint:t}),pp=(e,t,n,s)=>{let u=t.length>2?"value += getBias(output_channel);":"",d=t[0].dims.slice(),l=t[1].dims.slice(),p=l[0]/s.group;qe.verbose("GroupedConv",`autpPad:${s.autoPad}, dilations:${s.dilations}, group:${s.group}, kernelShape:${s.kernelShape}, pads:${s.pads}, strides:${s.strides}`);let o=Un(d,l,s.dilations,s.pads,s.strides),r=we(e.session.backend.glContext.version),{activationFunction:i,applyActivation:a}=Qn(s),c=`
  const ivec2 strides = ivec2(${s.strides[0]}, ${s.strides[1]});
  const ivec2 pads = ivec2(${s.pads[0]}, ${s.pads[1]});
  ${i}
  void main() {
    ivec4 coords = getOutputCoords();
    int batch = coords.x;
    int output_channel = coords.y;
    ivec2 xRCCorner = coords.zw * strides - pads;
    int group_id = output_channel / ${p};

    float value = 0.0;
    for (int wInChannel = 0; wInChannel < ${l[1]}; wInChannel++) {
      int input_channel = group_id * ${l[1]} + wInChannel;
      for (int wHeight = 0; wHeight < ${l[2]}; wHeight++) {
        int xHeight = xRCCorner.x + wHeight * ${s.dilations[0]};

        if (xHeight < 0 || xHeight >= ${d[2]}) {
          continue;
        }

        for (int wWidth = 0; wWidth < ${l[3]}; wWidth++) {
          int xWidth = xRCCorner.y + wWidth * ${s.dilations[1]};
          if (xWidth < 0 || xWidth >= ${d[3]}) {
            continue;
          }

          float xVal = getX(batch, input_channel, xWidth, xHeight);
          float wVal = getW(output_channel, wInChannel, wWidth, wHeight);
          value += xVal*wVal;
        }
      }
    }
    ${u}
    ${a}
    ${r.output} = vec4(value, .0, .0, .0);
  }
`;return{...n,output:{dims:o,type:t[0].type,textureType:0},shaderSource:c,hasMain:!0}},Xy=(e,t,n)=>{let s=dp(t.length>2,n.cacheKey);return{...s,get:()=>pp(e,t,s,n)}}}),cp,hp,Zy,ZT=C(()=>{Le(),$e(),un(),cp=e=>({name:"Im2Col (packed)",inputNames:["A"],inputTypes:[2],cacheHint:e}),hp=(e,t,n,s,u,d)=>{let l=n.dims,p=s.dims,o=2,r=3,i=u.length,a=[p[1]*p[2]*p[3],u[2]*u[3]],c=p[2]*p[3],h=Jn(),g=we(e.session.backend.glContext.version),b="";for(let $=0;$<=1;$++)for(let _=0;_<=1;_++)b+=`
            blockIndex = rc.x + ${_};
            pos = rc.y + ${$};

            if(blockIndex < ${a[1]} && pos < ${a[0]}) {
              offsetY = int(blockIndex / (${u[i-1]})) * ${d.strides[0]} -
                ${d.pads[0]};
              d0 = offsetY + ${d.dilations[0]} * (imod(pos, ${c}) / ${p[2]});

              if(d0 < ${l[o]} && d0 >= 0) {
                offsetX = imod(blockIndex, ${u[i-1]}) * ${d.strides[1]} -
                  ${d.pads[1]};
                d1 = offsetX + ${d.dilations[1]} * imod(imod(pos, ${c}), ${p[2]});

                if(d1 < ${l[r]} && d1 >= 0) {

                  ch = int(float(pos)/ ${c}.);
                    innerDims = vec2(d0, d1);
                    result[${$*2+_}] = getChannel(
                      getA(0, ch, int(innerDims.x),
                      int(innerDims.y)), innerDims);
                }
              }
            }

          `;let x=`
      ${h}

      void main() {
        ivec2 rc = getOutputCoords();
          vec4 result = vec4(0.0);
          int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
          vec2 innerDims;
          ${b}
          ${g.output} = result;
      }
            `;return{...t,output:{dims:a,type:n.type,textureType:2},shaderSource:x,hasMain:!0}},Zy=(e,t,n,s,u)=>{let d=cp(u.cacheKey);return{...d,get:()=>hp(e,d,t,n,s,u)}}});function JT(e,t,n){let s=t[0].dims,u=t[1].dims,d=Mt.calcShape(s,u,!0);if(!d)throw new Error("Can't use matmul on the given tensors");let l=ar(d.length),p=nn(),{activationFunction:o,applyActivation:r}=Qn(n),i=t.length>2,a=i?"value += getBiasForMatmul();":"",c=i?`${Qy(l,p,t[2].dims,d,!1)}`:"",h=d.length,g=s.length,b=u.length,x=s[s.length-1],$=`
    ${o}
    ${c}
    float process(int indices[${h}]) {
        int a[${g}];
        int b[${b}];
        bcastMatmulIndices_A(indices, a);
        bcastMatmulIndices_B(indices, b);

        float value;
        for (int k=0; k<${x}; ++k) {
            a[${g-1}] = k;
            b[${b-2}] = k;
            value += _A(a) * _B(b);
        }
        ${a}
        ${r}
        return value;
    }`;return{...e,output:{dims:d,type:t[0].type,textureType:0},shaderSource:$}}function Jy(e,t){let n=t0(e.length>2,t.activationCacheKey);return{...n,get:()=>JT(n,e,t)}}function Qy(e,t,n,s,u){let d="",l=n.length,p=s.length,o=p-l;p<2&&l>0?d="coords":d=n.map((c,h)=>`coords.${t[h+o]}`).join(", ");let r=Mt.getBroadcastDims(n,s).map(c=>`coords.${t[c+o]} = 0;`).join(`
`),i=pe.size(n)===1,a="vec4(outputValue.xx, outputValue.yy)";return i&&(a="vec4(outputValue.x)"),u?`
vec4 getBiasForMatmul() {
  ${e} coords = getOutputCoords();
  ${r}
  vec4 outputValue = getBias(${d});
  return ${a};
}`:`
float getBiasForMatmul() {
  ${e} coords = getOutputCoords();
  ${r}
  return getBias(coords.x);
}`}var Yy,e0,t0,fp,uu=C(()=>{Ae(),$e(),qt(),dn(),r0(),Yy=(e,t,n)=>(fp(t),e.session.pack?[e.run(lu(e,t,n),t)]:[e.run(Jy(t,n),t)]),e0=e=>Zi(e.attributes),t0=(e,t)=>({name:"MatMul",inputNames:e?["A","B","Bias"]:["A","B"],inputTypes:e?[0,0,0]:[0,0],cacheHint:t}),fp=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.");if(e[0].type!=="float32"&&e[0].type!=="float64"||e[1].type!=="float32"&&e[1].type!=="float64")throw new Error("inputs should be float type");if(e[0].type!==e[1].type)throw new Error("inputs types should match")}});function QT(e,t,n,s){let u=[],d=[],l=n[0].dims,p=n[1].dims,o=l.length,r=p.length,i=s.length,a=i-o,c=i-r;u=l.map((_,O)=>`coords.${t[O+a]}`),u[o-1]="i*2",u.join(", "),d=p.map((_,O)=>`coords.${t[O+c]}`),d[r-2]="i*2",d.join(", ");let h=Mt.getBroadcastDims(l,s),g=Mt.getBroadcastDims(p,s),b=h.map(_=>`coords.${t[_+a]} = 0;`).join(`
`),x=g.map(_=>`coords.${t[_+c]} = 0;`).join(`
`),$=`int lastDim = coords.${t[i-1]};
  coords.${t[i-1]} = coords.${t[i-2]};
  coords.${t[i-2]} = lastDim;`;return`
vec4 getAAtOutCoordsMatmul(int i) {
  ${e} coords = getOutputCoords();
  ${$}
  ${b}
  vec4 outputValue = getA(${u});
  return outputValue;
}

vec4 getBAtOutCoordsMatmul(int i) {
  ${e} coords = getOutputCoords();
  ${$}
  ${x}
  vec4 outputValue = getB(${d});
  return outputValue;
}`}function YT(e,t){let n="";for(let s=0;s<t-2;s++)n+=`rc.${e[s]}, `;return n+=`rc.${e[t-2]}, i*2`,n}function e3(e,t){let n="";for(let s=0;s<t-2;s++)n+=`rc.${e[s]}, `;return n+=`i*2, rc.${e[t-1]}`,n}var gp,mp,lu,r0=C(()=>{Ae(),Le(),$e(),qt(),dn(),uu(),gp=(e,t)=>({name:"MatMul (packed)",inputNames:e?["A","B","Bias"]:["A","B"],inputTypes:e?[2,2,2]:[2,2],cacheHint:t}),mp=(e,t,n,s)=>{let u=n.length>2,d=u?"value += getBiasForMatmul();":"",l=n[0].dims,p=n[1].dims,o=Mt.calcShape(l,p,!0),r=!pe.areEqual(n[0].dims,n[1].dims);if(!o)throw new Error("Can't use matmul on the given tensors");let i=l[l.length-1],a=Math.ceil(i/2),c=l.length,h=p.length,g=we(e.session.backend.glContext.version),b=ar(o.length),x=o.length,$=nn(),{activationFunction:_,applyActivation:O}=Qn(s),I=u?`${Qy(b,$,n[2].dims,o,!0)}`:"",E=r?`${QT(b,$,n,o)}`:"",A=r?"getAAtOutCoordsMatmul(i)":`getA(${YT($,c)})`,D=r?"getBAtOutCoordsMatmul(i)":`getB(${e3($,h)})`,S=r?"":`${b} rc =
          getOutputCoords(); int lastDim = rc.${$[x-1]}; rc.${$[x-1]} =
          rc.${$[x-2]}; rc.${$[x-2]} = lastDim;
      `,L=`
            ${E}
            ${I}
            ${_}
            void main() {
              ${S}

              vec4 value = vec4(0);
              for (int i = 0; i < ${a}; i++) {
                vec4 a = ${A};
                vec4 b = ${D};

                value += (a.rrbb * b.rgrg);
                value += (a.ggaa * b.baba);
              }
              ${d}
              ${O}
              ${g.output} = value;
            }`;return{...t,output:{dims:o,type:n[0].type,textureType:2},shaderSource:L,hasMain:!0}},lu=(e,t,n)=>{let s=gp(t.length>2,n.activationCacheKey);return{...s,get:()=>mp(e,s,t,n)}}}),n0,t3=C(()=>{du(),ZT(),r0(),n0=(e,t,n)=>{let s=t[0].dims,u=t[1].dims,d=Un(s,u,n.dilations,n.pads,n.strides),l=e.run(Zy(e,t[0],t[1],d,n),[t[0]]),p=e.reshapePacked(t[1],[u[0],u[1]*u[2]*u[3]]),o=t.length===3?[p,l,t[2]]:[p,l],r=e.run(lu(e,o,n),o);return e.reshapePacked(r,d)}}),bp,yp,i0,Ss,o0=C(()=>{$e(),bp=e=>({name:"Im2Col",inputNames:["X"],inputTypes:[0],cacheHint:e}),yp=(e,t,n,s,u,d)=>{let l=n.dims,p=s.dims,o=u.length,r=Ss(l,p,u,4),i=`
        const int XC = ${l[1]};
        const int XH = ${l[2]};
        const int XW = ${l[3]};
        const int KH = ${d.kernelShape[0]};
        const int KW = ${d.kernelShape[1]};
        const int dilationH = ${d.dilations[0]};
        const int dilationW = ${d.dilations[1]};
        const int strideH = ${d.strides[0]};
        const int strideW = ${d.strides[1]};
        const int padH = ${d.pads[0]};
        const int padW = ${d.pads[1]};
        const int KHKW = KH*KW;
        const int XCKHKW = XC * KHKW;
        const int outputChannels = 4;
        vec4 process(int indices[${o}]) {
          int b  = indices[0]; // batch size
          int oh = indices[1] * strideH - padH; //output height
          int ow = indices[2] * strideW - padW; //output width
          int p = indices[3] * outputChannels; //patch
          vec4 value = vec4(0.0);
          for(int i=0; i < outputChannels; ++i) {
            if(p < XCKHKW) {
              int patchC = p / KHKW;
              int patchH = (p - patchC*KHKW) / KW;
              int patchW = (p - patchC*KHKW) - patchH * KW;
              int xh2 = oh + patchH * dilationH;
              int xw2 = ow + patchW * dilationW;
              int x[${l.length}];
              x[0] = b;
              x[1] = patchC;
              x[2] = xh2;
              x[3] = xw2;
              if(xh2 >= 0 &&
                  xh2 < XH &&
                  xw2 >= 0 &&
                  xw2 < XW) {
                value[i] = _X(x);
              }
            }
            ++p;
          }
          return value;
        }
        `;return{...t,output:{dims:r,type:n.type,textureType:4},shaderSource:i}},i0=(e,t,n,s,u)=>{let d=bp(u.cacheKey);return{...d,get:()=>yp(e,d,t,n,s,u)}},Ss=(e,t,n,s=4)=>[n[0],n[2],n[3],Math.ceil(e[1]*t[2]*t[3]/s)]}),_p,vp,a0,r3=C(()=>{Ae(),Le(),$e(),dn(),o0(),_p=(e,t)=>({name:"ConvDotProduct",inputNames:e?["Im2Col","K","B"]:["Im2Col","K"],inputTypes:e?[0,4,0]:[0,4],cacheKey:t.activationCacheKey}),vp=(e,t,n,s,u)=>{let d=n[0].dims,l=n[1].dims,p=[l[0],Math.ceil(d[1]*l[2]*l[3]/4)],o=Ss(d,l,s),[r,i]=e.calculateTextureWidthAndHeight(p,4),a=pe.computeStrides(o),[c,h]=e.calculateTextureWidthAndHeight(o,4),g=s.length,b=n.length<3?"0.0":"_B(b)",x=Math.ceil(d[1]*l[2]*l[3]/4),{activationFunction:$,applyActivation:_}=Qn(u),O=we(e.session.backend.glContext.version),I=`
${$}
float process(int indices[${g}]) {
  int b[1];
  b[0] = indices[1];
  int im2col[4];
  im2col[0] = indices[0];
  im2col[1] = indices[2];
  im2col[2] = indices[3];
  int im2colOffset = im2col[0] * ${a[0]} + im2col[1] * ${a[1]} + im2col[2] * ${a[2]};
  int kernelOffset = indices[1] * ${p[1]};
  float value = ${b};
  for (int i = 0; i < ${x}; ++i) {
    vec2 im2colCoords = offsetToCoords(im2colOffset, ${c}, ${h});
    vec2 kernelCoords = offsetToCoords(kernelOffset, ${r}, ${i});
    value += dot(${O.texture2D}(Im2Col, im2colCoords), ${O.texture2D}(K, kernelCoords));
    ++im2colOffset;
    ++kernelOffset;
  }
  ${_}
  return value;
}`;return{...t,output:{dims:s,type:n[0].type,textureType:0},shaderSource:I}},a0=(e,t,n,s)=>{let u=_p(t.length>2,s);return{...u,get:()=>vp(e,u,t,n,s)}}}),Un,Is,wp,xp,$p,Tp,Os,Sp,du=C(()=>{Je(),Ae(),XT(),t3(),r3(),dn(),o0(),uu(),Un=(e,t,n,s,u)=>{let d=e[0],l=e.slice(2),p=l.length,o=t[0],r=t.slice(2).map((a,c)=>a+(a-1)*(n[c]-1)),i=l.map((a,c)=>a+s[c]+s[c+p]).map((a,c)=>Math.floor((a-r[c]+u[c])/u[c]));return[d,o].concat(...i)},Is=(e,t,n)=>(Sp(t,n),wp(e,t,n)),wp=(e,t,n)=>{let s=Tp(n,t),u=e.session.pack,d=s.kernelShape[0]===1&&s.kernelShape[1]===1;return s.group>1?[e.run(Xy(e,t,s),t)]:d&&u?[xp(e,t,s)]:u&&t[0].dims.length===4&&t[0].dims[0]===1&&!d?[n0(e,t,s)]:[$p(e,t,s)]},xp=(e,t,n)=>{let s=t[0].dims,u=t[1].dims,d=Un(s,u,n.dilations,n.pads,n.strides),l=e.reshapeUnpacked(t[0],[s[1],s[2]*s[3]]),p=e.reshapeUnpacked(t[1],[u[0],u[1]]),o=t.length>2?[p,l,t[2]]:[p,l],r=e.run(Jy(o,n),o);return e.reshapeUnpacked(r,d)},$p=(e,t,n)=>{let s=t[0].dims,u=t[1].dims,d=Un(s,u,n.dilations,n.pads,n.strides),l=e.run(i0(e,t[0],t[1],d,n),[t[0]]),p=t.length===3?[l,t[1],t[2]]:[l,t[1]];return e.run(a0(e,t,d,n),p)},Tp=(e,t)=>{let n=e.kernelShape.slice();if(e.kernelShape.length===0)for(let d=2;d<t[1].dims.length;++d)n.push(t[1].dims[d]);let s=e.pads.slice();zi.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,n,s,e.autoPad);let u=Object.assign({},e);return Object.assign(u,{kernelShape:n,pads:s,cacheKey:e.cacheKey}),u},Os=e=>{let t=e.attributes,n=Zi(t),s=t.getString("auto_pad","NOTSET"),u=t.getInts("dilations",[1,1]),d=t.getInt("group",1),l=t.getInts("kernel_shape",[]),p=t.getInts("pads",[0,0,0,0]),o=t.getInts("strides",[1,1]);return Me({autoPad:s,dilations:u,group:d,kernelShape:l,pads:p,strides:o,...n})},Sp=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4||e[1].dims.length!==4)throw new Error("currently only support 2-dimensional conv");let n=e[0].dims[1],s=e[1].dims[1]*t.group;if(n!==s)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let u=e[0].dims.length-2;if(t.dilations.length!==u)throw new Error(`dilations should be ${u}D`);if(t.strides.length!==u)throw new Error(`strides should be ${u}D`);if(t.pads.length!==u*2)throw new Error(`pads should be ${u*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(e[0].type!=="float32"||e[1].type!=="float32")throw new Error("Conv input(X,W) should be float tensor");if(e.length===3&&e[2].type!=="float32")throw new Error("Conv input(bias) should be float tensor")}}),Ip,Op,Ep,s0,Pp,Ap,kp,Dp,Np,Cp,u0,zp,n3=C(()=>{Je(),Le(),$e(),dn(),Ip=(e,t,n,s,u,d)=>(e-1)*t+n+(s-1)*u+1-d,Op=(e,t,n,s,u)=>{let d=Math.floor(e/2);t==="SAME_UPPER"?(n[s]=d,n[u]=e-d):t==="SAME_LOWER"&&(n[s]=e-d,n[u]=d)},Ep=(e,t,n,s,u,d,l,p)=>{let o=e.length-2,r=p.length===0;for(let i=0;i<o;++i){let a=r?e[i+2]*d[i]:p[i],c=Ip(e[i+2],d[i],u[i],t[i],n[i],a);Op(c,s,u,i,i+o),r&&p.push(d[i]*(e[i+2]-1)+l[i]+(t[i]-1)*n[i]+1-u[i]-u[i+o])}},s0=(e,t,n)=>(zp(t,n),Pp(e,t,n)),Pp=(e,t,n)=>{let s=Cp(n,t);return[Np(e,t,s)]},Ap=(e,t)=>({name:"ConvTranspose",inputNames:e?["X","W","B"]:["X","W"],inputTypes:e?[0,0,0]:[0,0],cacheHint:t}),kp=(e,t,n,s)=>{let u=t.length>2?"getB(output_channel)":"0.0",d=t[0].dims,l=t[1].dims,p=l[1],o=l[0]/s.group,r=[t[0].dims[0],t[1].dims[1]*s.group,...s.outputShape],i=we(e.session.backend.glContext.version),{activationFunction:a,applyActivation:c}=Qn(s),h=`
  const ivec2 strides = ivec2(${s.strides[0]}, ${s.strides[1]});
  const ivec2 pads = ivec2(${s.pads[0]}, ${s.pads[1]});
  ${a}
  void main() {
    ivec4 coords = getOutputCoords();
    int batch = coords.x;
    int output_channel = coords.y;

    ivec2 loc = coords.zw + pads;

    int group_id = output_channel / ${p};
    int wOutChannel = output_channel - group_id * ${p};

    float value = ${u};
    for (int inChannelOffset = 0; inChannelOffset < ${o}; inChannelOffset++) {
      int input_channel = group_id * ${o} + inChannelOffset;
      for (int wWOff = 0; wWOff < ${l[2]}; wWOff++) {
        for (int wHOff = 0; wHOff < ${l[3]}; wHOff++) {
          ivec2 wOff = ivec2(wWOff * ${s.dilations[0]}, wHOff * ${s.dilations[1]});
          ivec2 wLoc = loc - wOff;
          ivec2 wLocIn = wLoc / strides;
          if (
            wLocIn * strides == wLoc &&
            wLocIn.x >= 0 && wLocIn.x < ${d[2]} &&
            wLocIn.y >= 0 && wLocIn.y < ${d[3]}
          ) {
            float xVal = getX(batch, input_channel, wLocIn.y, wLocIn.x);
            float wVal = getW(input_channel, wOutChannel, wHOff, wWOff);
            value += xVal * wVal;
          }
        }
      }
    }
    ${c}
    ${i.output} = vec4(value, .0, .0, .0);
  }
`;return{...n,output:{dims:r,type:t[0].type,textureType:0},shaderSource:h,hasMain:!0}},Dp=(e,t,n)=>{let s=Ap(t.length>2,n.cacheKey);return{...s,get:()=>kp(e,t,s,n)}},Np=(e,t,n)=>e.run(Dp(e,t,n),t),Cp=(e,t)=>{let n=e.kernelShape.slice();if(e.kernelShape.length===0)for(let p=2;p<t[1].dims.length;++p)n.push(t[1].dims[p]);let s=e.pads.slice(),u=e.outputShape.slice(),d=t[0].dims;Ep(d,n,e.dilations,e.autoPad,s,e.strides,e.outputPadding,u);let l=Object.assign({},e);return Object.assign(l,{kernelShape:n,pads:s,outputShape:u,cacheKey:e.cacheKey}),l},u0=e=>{let t=e.attributes,n=Zi(t),s=t.getString("auto_pad","NOTSET"),u=t.getInts("dilations",[1,1]),d=t.getInt("group",1),l=t.getInts("kernel_shape",[]),p=t.getInts("output_padding",[0,0]),o=t.getInts("output_shape",[]),r=t.getInts("pads",[0,0,0,0]),i=t.getInts("strides",[1,1]);return Me({autoPad:s,dilations:u,group:d,kernelShape:l,outputPadding:p,outputShape:o,pads:r,strides:i,...n})},zp=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4||e[1].dims.length!==4)throw new Error("currently only support 2-dimensional conv");let n=e[0].dims[1],s=e[1].dims[0];if(n!==s)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let u=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==u))throw new Error("invalid bias");let d=e[0].dims.length-2;if(t.dilations.length!==d)throw new Error(`dilations should be ${d}D`);if(t.strides.length!==d)throw new Error(`strides should be ${d}D`);if(t.pads.length!==d*2)throw new Error(`pads should be ${d*2}D`);if(t.outputPadding.length!==d)throw new Error(`output_padding should be ${d}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape");if(e[0].type!=="float32"||e[1].type!=="float32")throw new Error("ConvTranspose input(X,W) should be float tensor");if(e.length===3&&e[2].type!=="float32")throw new Error("ConvTranspose input(bias) should be float tensor")}}),Mo,Kn,l0,Rp,jo,Bp,Mp,jp,pu=C(()=>{Je(),Ae(),$e(),Mo={name:"Transpose",inputNames:["A"],inputTypes:[0]},Kn=(e,t,n)=>(jp(t),[e.run({...Mo,cacheHint:n.cacheKey,get:()=>Rp(e,t[0],n.perm)},t)]),l0=e=>Me({perm:e.attributes.getInts("perm",[])}),Rp=(e,t,n)=>{let s=t.dims;n=jo(s,n);let u=Bp(s,n),d=s.length,l=`
      ${Mp("perm",n,d)}
      float process(int indices[${d}]) {
        int a[${d}];
        perm(a, indices);
        return _A(a);
      }`;return{...Mo,output:{dims:u,type:t.type,textureType:0},shaderSource:l}},jo=(e,t)=>(t&&t.length!==e.length&&(t=[...e.keys()].reverse()),t),Bp=(e,t)=>(t=jo(e,t),pe.sortBasedOnPerm(e,t)),Mp=(e,t,n)=>{let s=[];s.push(`void ${e}(out int a[${n}], int src[${n}]) {`);for(let u=0;u<n;++u)s.push(`	a[${t[u]}]=src[${u}];`);return s.push("	}"),s.join(`
`)},jp=e=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(e[0].type!=="float32"&&e[0].type!=="float64")throw new Error("input should be float tensor")}}),d0,p0,Fp,i3=C(()=>{pu(),d0=(e,t,n)=>{Fp(t);let s=n.blocksize,u=s*s,d=n.mode==="DCR"?[0,3,4,1,5,2]:[0,1,4,2,5,3],l=n.mode==="DCR"?[t[0].dims[0],s,s,t[0].dims[1]/u,t[0].dims[2],t[0].dims[3]]:[t[0].dims[0],t[0].dims[1]/u,s,s,t[0].dims[2],t[0].dims[3]],p=e.reshapeUnpacked(t[0],l),o={perm:d,cacheKey:`${d}`},[r]=Kn(e,[p],o),i=[t[0].dims[0],t[0].dims[1]/u,t[0].dims[2]*s,t[0].dims[3]*s];return[e.reshapeUnpacked(r,i)]},p0=e=>{let t=e.attributes.getInt("blocksize");if(t<1)throw new Error(`blocksize must be >= 1, but got : ${t} for DepthToSpace`);let n=e.attributes.getString("mode","DCR");if(n!=="DCR"&&n!=="CRD")throw new Error(`unrecognized mode: ${n} for DepthToSpace`);return{mode:n,blocksize:t}},Fp=e=>{if(e.length!==1)throw new Error(`DepthToSpace expect 1 inputs, but got ${e.length}`);if(e[0].type==="string"||e[0].dims.length!==4)throw new TypeError("DepthToSpace input should be a 4-D numeric tensor")}}),c0,h0,Lp,o3=C(()=>{Ae(),c0=(e,t,n)=>{Lp(t,n);let s=pe.flattenShape(t[0].dims,n);return[e.reshapeUnpacked(t[0],s)]},h0=e=>e.attributes.getInt("axis",1),Lp=(e,t)=>{if(!e||e.length!==1)throw new Error("Flatten requires 1 input.");let n=e[0].dims.length;if(n===0)throw new Error("scalar tensor is not supported.");if(t<-n||t>n)throw new Error("Invalid axis");if(e[0].type==="string")throw new Error("string tensor is not supported.")}}),Yn,Ji=C(()=>{Yn=["float32","float64","int32","int16","int8","uint16","uint32","uint8"]}),f0,g0,Vp,Up,qp,Gp,a3=C(()=>{Je(),Ji(),Ae(),$e(),f0=(e,t,n)=>(Gp(t,n.axis),[e.run(qp(e,t,n),t)]),g0=e=>Me({axis:e.attributes.getInt("axis",0)}),Vp={name:"Gather",inputNames:["A","B"],inputTypes:[0,0]},Up=(e,t,n,s)=>{let u=n[0].dims.slice(),d=n[1].dims.slice(),l=new Array(u.length+d.length-1);s=pe.normalizeAxis(s,u.length);let p=[];for(let c=0;c<l.length;c++)c<s?(l[c]=u[c],p.push(`inputIdx[${c}] = outputIdx[${c}];`)):c<s+d.length?(l[c]=d[c-s],p.push(`indexDataIdx[${c-s}] = outputIdx[${c}];`)):(l[c]=u[c-d.length+1],p.push(`inputIdx[${c-d.length+1}] = outputIdx[${c}];`));let o=l.length||1,r=u.length,i=d.length||1,a=`
      float process(int outputIdx[${o}]) {
        int inputIdx[${r}];
        int indexDataIdx[${i}];
        indexDataIdx[0] = 0;
        ${p.join(`
        `)}
        int idx = int(_B(indexDataIdx));
        inputIdx[${s}] = idx < 0 ? idx + ${u[s]} : idx;
        return _A(inputIdx);
      }`;return{...t,output:{dims:l,type:n[0].type,textureType:0},shaderSource:a}},qp=(e,t,n)=>{let s={...Vp,cacheHint:n.cacheKey};return{...s,get:()=>Up(e,s,t,n.axis)}},Gp=(e,t)=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.");let n=e[0].dims.length;if(n<1)throw new Error("Invalid input shape.");if(t<-n||t>n-1)throw new Error("Invalid axis.");if(Yn.indexOf(e[0].type)===-1)throw new Error("Invaid input type.");if(e[1].type!=="int32"&&e[1].type!=="int16")throw new Error("Invaid input type.")}}),Es,Fo,m0,b0,Hp,Wp,Kp,s3=C(()=>{Je(),Ae(),$e(),Es=(e,t,n)=>(Kp(t,n),[e.run(Hp(t,n),t)]),Fo=(e,t)=>{let n=e.attributes.getInt("transA",0)!==0,s=e.attributes.getInt("transB",0)!==0,u=e.attributes.getFloat("alpha",1),d=e.attributes.getFloat("beta",1);return Me({transA:n,transB:s,alpha:u,beta:d,isOptionalC:t})},m0=e=>Fo(e,!1),b0=e=>Fo(e,!0),Hp=(e,t)=>{let n={name:"Gemm",inputNames:e.length===3?["A","B","C"]:["A","B"],inputTypes:e.length===3?[0,0,0]:[0,0],key:t.cacheKey};return{...n,get:()=>Wp(n,e,t)}},Wp=(e,t,n)=>{let s=t[0].dims.slice(),u=t[1].dims.slice(),[d,l]=Ub.getShapeOfGemmResult(s,n.transA,u,n.transB,t.length===3?t[2].dims:void 0),p=[d,l];if(!p)throw new Error("Can't use gemm on the given tensors");let o=s[s.length-1],r="";n.transA&&(o=s[0]),n.transA&&n.transB?r="value += _A_T(a) * _B_T(b);":n.transA&&!n.transB?r="value += _A_T(a) * _B(b);":!n.transA&&n.transB?r="value += _A(a) * _B_T(b);":!n.transA&&!n.transB&&(r="value += _A(a) * _B(b);");let i=p.length,a=t.length===3?`int c[${t[2].dims.length}];`:"",c=t.length===3?"bcastIndices_C(indices, c);":"",h=t.length===3?"value += beta * _C(c);":"",g=`
      float process(int indices[${i}]) {
          int a[${i}];
          int b[${i}];
          ${a}

          copyVec(indices, a);
          copyVec(indices, b);
          ${c}

          float value = 0.0;
          for (int k=0; k<${o}; ++k) {
              a[${i-1}] = k;
              b[${i-2}] = k;
              ${r}
          }

          value = value * alpha;
          ${h}
          return value;
      }`;return{...e,output:{dims:p,type:t[0].type,textureType:0},variables:[{name:"alpha",type:"float",data:n.alpha},{name:"beta",type:"float",data:n.beta}],shaderSource:g}},Kp=(e,t)=>{if(!e)throw new Error("Input is missing");if(t.isOptionalC&&(e.length<2||e.length>3))throw new Error("Invaid input shape.");if(!t.isOptionalC&&e.length!==3)throw new Error("Gemm requires 3 inputs");if(e.length===3&&e[2].dims.length!==1&&e[2].dims.length!==2)throw new Error("Invalid input shape of C");if(e[0].type!=="float32"&&e[0].type!=="float64"||e[1].type!=="float32"&&e[1].type!=="float64"||e.length===3&&e[2].type!=="float32"&&e[2].type!=="float64")throw new Error("Invalid input type.");if(e[0].type!==e[1].type||e.length===3&&e[0].type!==e[2].type)throw new Error("Input types are mismatched")}}),y0,_0,Xp,Zp,Jp,Qp,Yp,u3=C(()=>{Je(),$e(),y0=(e,t,n)=>(Yp(t),[e.run(Jp(e,t,n),t)]),_0=e=>{let t=e.attributes.getFloat("scale"),n=e.attributes.getFloats("bias");return Me({scale:t,bias:n})},Xp={name:"ImageScaler",inputNames:["X"],inputTypes:[0]},Zp=(e,t,n,s)=>{let u=n[0].dims.slice(),d=u.length,l=`
      ${Qp(s.bias.length)}
      float process(int indices[${d}]) {
        return _X(indices) * scale + getBias(bias, indices[1]);
      }`;return{...t,output:{dims:u,type:n[0].type,textureType:0},variables:[{name:"bias",type:"float",arrayLength:s.bias.length,data:s.bias},{name:"scale",type:"float",data:s.scale}],shaderSource:l}},Jp=(e,t,n)=>{let s={...Xp,cacheHint:n.cacheKey};return{...s,get:()=>Zp(e,s,t,n)}},Qp=e=>{let t=[`float getBias(float bias[${e}], int channel) {`];for(let n=0;n<e;++n)n===0?t.push(`	if (channel == ${n}) { return bias[${n}]; }`):n===e-1?t.push(`	else { return bias[${n}]; }`):t.push(`	else if (channel == ${n}) { return bias[${n}]; }`);return t.push("	}"),t.join(`
`)},Yp=e=>{if(!e||e.length!==1)throw new Error("ImageScaler requires 1 input.");if(e[0].dims.length!==4)throw new Error("Invalid input shape.");if(e[0].type!=="float32"&&e[0].type!=="float64")throw new Error("Invalid input type.")}}),v0,w0,Lo,ec,tc,rc,nc,ic,oc,l3=C(()=>{Le(),$e(),v0=(e,t,n)=>{oc(t);let s=e.run(tc(t[0]),t);return[e.run(ic(e,t[0],n,s.dims),[t[0],s,t[1],t[2]])]},w0=e=>e.attributes.getFloat("epsilon",1e-5),Lo={name:"InstanceNormalization_MeanAndVariance",inputNames:["X"],inputTypes:[0]},ec=(e,t)=>{let n=t.dims.slice(),s=n[1],u=n[2]*n[3],d=[n[0],s],l=`
      vec4 process(int[2] indices) {
        vec4 v = vec4(0.0);
        int a[4];
        a[0] = indices[0];
        a[1] = indices[1];
        float temp = 0.0;
        for(int a2=0; a2<${n[2]}; a2++) {
          a[2] = a2;
          for(int a3=0; a3<${n[3]}; a3++) {
            a[3] = a3;
            float x = _X(a);
            temp += x;
          }
        }
        float mean = temp / float(${u});
        temp = 0.0;
        for(int a2=0; a2<${n[2]}; a2++) {
          a[2] = a2;
          for(int a3=0; a3<${n[3]}; a3++) {
            a[3] = a3;
            float x = _X(a);
            temp += (x - mean) * (x - mean);
          }
        }
        v.r = mean;
        v.g = temp / float(${u});

        return v;
      }`;return{...e,output:{dims:d,type:t.type,textureType:4},shaderSource:l}},tc=e=>({...Lo,get:()=>ec(Lo,e)}),rc={name:"InstanceNormalization_ComputeOutput",inputNames:["X","MeanAndVariance","Scale","B"],inputTypes:[0,4,0,0]},nc=(e,t,n,s,u)=>{let d=we(e.session.backend.glContext.version),[l,p]=e.calculateTextureWidthAndHeight(u,4),[o,r]=[l/4,p],i=`
      vec4 get_MeanAndVariance(int[2] mv) {
        int offset = indicesToOffset_MeanAndVariance(mv);
        vec2 coords = offsetToCoords(offset, ${o}, ${r});
        return ${d.texture2D}(MeanAndVariance, coords);
      }

      float process(int[4] indices) {
        int mv[2];
        mv[0] = indices[0];
        mv[1] = indices[1];
        vec4 mean_and_variance = get_MeanAndVariance(mv);
        float mean = mean_and_variance.r;
        float variance = mean_and_variance.g;

        int sb[1];
        sb[0] = indices[1];
        float scale = _Scale(sb);
        float b = _B(sb);

        return scale * (_X(indices) - mean) / sqrt(variance + epsilon) + b;
      }`;return{...t,output:{dims:n.dims,type:n.type,textureType:0},variables:[{name:"epsilon",type:"float",data:s}],shaderSource:i}},ic=(e,t,n,s)=>{let u={...rc,cacheHint:`${n}`};return{...u,get:()=>nc(e,u,t,n,s)}},oc=e=>{if(!e||e.length!==3)throw new Error("InstanceNormalization requires 3 inputs.");let t=e[0],n=e[1],s=e[2];if(t.dims.length<3||n.dims.length!==1||s.dims.length!==1)throw new Error("Invalid input shape.");if(n.dims[0]!==t.dims[1]||s.dims[0]!==t.dims[1])throw new Error("Input shapes are mismatched.");if(t.type!=="float32"&&t.type!=="float64"||n.type!=="float32"&&n.type!=="float64"||s.type!=="float32"&&s.type!=="float64")throw new Error("Invalid input type.");if(e[0].dims.length!==4)throw new Error("Only support 4-D input shape.")}});function d3(e,t){let n=e[0].dims[1],s=e[0].dims.length,u=-Math.floor((t.size-1)/2),d=Math.ceil((t.size-1)/2),l=`float(${t.alpha}) / float(${t.size})`,p=`float(${t.bias})`,o=`float(${t.beta})`,r=`
    float process(int indices[${s}]) {
        int c = indices[1];
        float x = _X(indices);
        float square_sum = 0.0;

        for (int i = ${u}; i <= ${d}; i++) {
          int idx = c + i;
          if (c >= 0 && c < ${n}) {
            indices[1] = idx;
            float j = _X(indices);
            square_sum += j * j;
          }
        }
        return x / pow(${p} + ${l} * square_sum, ${o});
    }`;return{...cu,cacheHint:t.cacheKey,output:{dims:e[0].dims,type:e[0].type,textureType:0},shaderSource:r}}function p3(e,t){return{...cu,cacheHint:t.cacheKey,get:()=>d3(e,t)}}var x0,$0,cu,ac,c3=C(()=>{Je(),$e(),x0=(e,t,n)=>(ac(t),[e.run(p3(t,n),t)]),$0=e=>{let t=e.attributes.getFloat("alpha",1e-4),n=e.attributes.getFloat("beta",.75),s=e.attributes.getFloat("bias",1),u=e.attributes.getInt("size");return Me({alpha:t,beta:n,bias:s,size:u})},cu={name:"LRN",inputNames:["X"],inputTypes:[0]},ac=e=>{if(!e||e.length!==1)throw new Error("LRN requires 1 input.");if(e[0].dims.length!==4)throw new Error('currently only support LRN for input with "NCHW" format');if(e[0].type!=="float32")throw new Error("input should be float type")}}),sc,Ps,T0,S0,I0,uc,lc,dc,pc,cc,hc,fc,gc,h3=C(()=>{Je(),Ae(),Le(),$e(),sc={name:"Pad",inputNames:["A"],inputTypes:[0]},Ps=(e,t,n)=>(dc(t),[e.run({...sc,cacheHint:n.cacheKey,get:()=>lc(e,t[0],n)},t)]),T0=e=>{let t=e.attributes.getString("mode","constant"),n=e.attributes.getFloat("value",0),s=e.attributes.getInts("pads");return Me({mode:t,value:n,pads:s})},S0=(e,t,n)=>{pc(t);let s=uc(e,t,n);return Ps(e,[t[0]],s)},I0=e=>e.attributes.getString("mode","constant"),uc=(e,t,n)=>{if(!e.session.isInitializer(t[1].dataId)||t.length>=3&&!e.session.isInitializer(t[2].dataId))throw new Error("dynamic pad attributes are not allowed");let s=Array.from(t[1].integerData),u=t.length>=3?t[2].floatData[0]:0;return Me({mode:n,pads:s,value:u})},lc=(e,t,n)=>{let s=pe.padShape(t.dims.slice(),n.pads),u=s.length,d=`
      ${cc(e,t,n)}
      float process(int[${u}] indices) {
          return padA(indices);
      }`;return{name:"Pad",inputNames:["A"],inputTypes:[0],output:{dims:s,type:t.type,textureType:0},shaderSource:d}},dc=e=>{if(!e||e.length!==1)throw new Error("Pad requires 1 input");if(e[0].type!=="float32"&&e[0].type!=="float64")throw new Error("Invalid input type.")},pc=e=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Pad requires 2 or 3 inputs");if(e[1].type!=="int32")throw new Error("Invalid input type.");if(e.length>=3&&e[2].type==="string")throw new Error("Invalid input type.")},cc=(e,t,n)=>{let s=we(e.session.backend.glContext.version),[u,d]=e.calculateTextureWidthAndHeight(t.dims,0),l=pe.computeStrides(t.dims);switch(n.mode){case"constant":return hc(s,t.dims,l,u,d,n.pads,n.value);case"reflect":return fc(s,t.dims,l,u,d,n.pads);case"edge":return gc(s,t.dims,l,u,d,n.pads);default:throw new Error("Invalid mode")}},hc=(e,t,n,s,u,d,l)=>{let p=t.length,o="";for(let r=p-1;r>=0;--r)o+=`
        k = m[${r}] - ${d[r]};
        if (k < 0)  return constant;
        if (k >= ${t[r]}) return constant;
        offset += k * ${n[r]};
        `;return`
      float padA(int m[${p}]) {
        const float constant = float(${l});
        int offset = 0;
        int k = 0;
        ${o}
        vec2 coords = offsetToCoords(offset, ${s}, ${u});
        float value = getColorAsFloat(${e.texture2D}(A, coords));
        return value;
      }
      `},fc=(e,t,n,s,u,d)=>{let l=t.length,p="";for(let o=l-1;o>=0;--o)p+=`
        k = m[${o}] - ${d[o]};
        if (k < 0) { k = -k; }
        {
          const int _2n_1 = ${2*(t[o]-1)};
          k = int( mod( float(k), float(_2n_1) ) ) ;
          if(k >= ${t[o]}) { k = _2n_1 - k; }
        }
        offset += k * ${n[o]};
        `;return`
      float padA(int m[${l}]) {
        int offset = 0;
        int k = 0;
        ${p}
        vec2 coords = offsetToCoords(offset, ${s}, ${u});
        float value = getColorAsFloat(${e.texture2D}(A, coords));
        return value;
      }
      `},gc=(e,t,n,s,u,d)=>{let l=t.length,p="";for(let o=l-1;o>=0;--o)p+=`
        k = m[${o}] - ${d[o]};
        if (k < 0)  k = 0;
        if (k >= ${t[o]}) k = ${t[o]-1};
        offset += k * ${n[o]};
      `;return`
      float padA(int m[${l}]) {
        int offset = 0;
        int k = 0;
        ${p}
        vec2 coords = offsetToCoords(offset, ${s}, ${u});
        float value = getColorAsFloat(${e.texture2D}(A, coords));
        return value;
      }
      `}}),O0,E0,Vo,P0,A0,k0,D0,Uo,qo,mc,Go,N0,vn,Ho,wn,bc,f3=C(()=>{Je(),Ae(),$e(),O0=(e,t,n)=>{vn(t);let s={name:"AveragePool",inputNames:["X"],inputTypes:[0],cacheHint:n.cacheKey};return[e.run({...s,get:()=>Vo(t,s,!1,n)},t)]},E0=e=>{let t=e.attributes.getString("auto_pad","NOTSET"),n=e.attributes.getInt("ceil_mode",0),s=e.attributes.getInt("count_include_pad",0)!==0,u=e.attributes.getInts("kernel_shape"),d=e.attributes.getInts("strides",[]),l=e.attributes.getInts("pads",[]);if(n!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");return Me({autoPad:t,ceilMode:n,countIncludePad:s,kernelShape:u,strides:d,pads:l})},Vo=(e,t,n,s)=>{let[u,d]=qo(e,s,n),l=pe.size(u.kernelShape),p="value += _X(x);",o="";u.countIncludePad?o+=`value /= float(${l});`:o+=`value /= float(${l} - pad);`;let r=`
        ${Ho(e[0].dims,u,p,o,"0.0")}
      `;return{...t,output:{dims:d,type:e[0].type,textureType:0},shaderSource:r}},P0=(e,t,n)=>{vn(t);let s={name:"GlobalAveragePool",inputNames:["X"],inputTypes:[0],cacheHint:`${n.countIncludePad}`};return[e.run({...s,get:()=>Vo(t,s,!0,n)},t)]},A0=e=>{let t=e.attributes.getInt("count_include_pad",0)!==0;return Me({autoPad:"",ceilMode:0,countIncludePad:t,kernelShape:[],strides:[],pads:[]})},k0=(e,t,n)=>{vn(t);let s={name:"MaxPool",inputNames:["X"],inputTypes:[0],cacheHint:n.cacheKey};return[e.run({...s,get:()=>Uo(t,s,!1,n)},t)]},D0=e=>{let t=e.attributes.getString("auto_pad","NOTSET"),n=e.attributes.getInt("ceil_mode",0),s=e.attributes.getInts("kernel_shape"),u=e.attributes.getInts("strides",[]),d=e.attributes.getInts("pads",[]),l=e.attributes.getInt("storage_order",0),p=e.attributes.getInts("dilations",[]);if(l!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(n!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");return Me({autoPad:t,ceilMode:n,countIncludePad:!1,kernelShape:s,strides:u,pads:d,storageOrder:l,dilations:p})},Uo=(e,t,n,s)=>{let[u,d]=qo(e,s,n),l=`
      ${Ho(e[0].dims,u,`
      value = max(_X(x), value);
    `,"","-1e5")}
    `;return{...t,output:{dims:d,type:e[0].type,textureType:0},shaderSource:l}},qo=(e,t,n)=>{let s=e[0].dims.slice(),u=Object.hasOwnProperty.call(t,"dilations"),d=t.kernelShape.slice(),l=t.strides.slice(),p=u?t.dilations.slice():[],o=t.pads.slice();zi.adjustPoolAttributes(n,s,d,l,p,o);let r=zi.computePoolOutputShape(n,s,l,p,d,o,t.autoPad),i=Object.assign({},t);return u?Object.assign(i,{kernelShape:d,strides:l,pads:o,dilations:p,cacheKey:t.cacheKey}):Object.assign(i,{kernelShape:d,strides:l,pads:o,cacheKey:t.cacheKey}),[i,r]},mc={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[],cacheKey:""},Go={name:"GlobalMaxPool",inputNames:["X"],inputTypes:[0]},N0=(e,t)=>(vn(t),[e.run({...Go,get:()=>Uo(t,Go,!0,mc)},t)]),vn=e=>{if(!e||e.length!==1)throw new Error("Pool ops requires 1 input.");if(e[0].type!=="float32"&&e[0].type!=="float64")throw new Error("Invalid input type.")},Ho=(e,t,n,s,u)=>{let d=e.length;if(t.kernelShape.length<=2){let l=t.kernelShape[t.kernelShape.length-1],p=t.strides[t.strides.length-1],o=t.pads[t.pads.length/2-1],r=t.pads[t.pads.length-1],i=e[d-1],a="",c="",h="";if(o+r!==0?a=`
          for (int i = 0; i < ${l}; i++) {
            x[${d} - 1] = indices[${d} - 1] * ${p} - ${o} + i;
            if (x[${d} - 1] < 0 || x[${d} - 1] >= ${i}) {
              pad++;
              continue;
            }
            ${n}
          }`:a=`
          for (int i = 0; i < ${l}; i++) {
            x[${d} - 1] = indices[${d} - 1] * ${p} - ${o} + i;
            ${n}
          }`,t.kernelShape.length===2){let g=t.kernelShape[t.kernelShape.length-2],b=t.strides[t.strides.length-2],x=t.pads[t.pads.length/2-2],$=t.pads[t.pads.length-2],_=e[d-2];x+$!==0?c=`
            for (int j = 0; j < ${g}; j++) {
              x[${d} - 2] = indices[${d} - 2] * ${b} - ${x} + j;
              if (x[${d} - 2] < 0 || x[${d} - 2] >= ${_}) {
                pad+= ${l};
                continue;
              }
          `:c=`
            for (int j = 0; j < ${g}; j++) {
              x[${d} - 2] = indices[${d} - 2] * ${b} - ${x} + j;
            `,h=`
          }
        `}return`
        float process(int indices[${d}]) {
          int x[${d}];
          copyVec(indices, x);

          float value = ${u};
          int pad = 0;
          ${c}
          ${a}
          ${h}
          ${s}
          return value;
        }
      `}else{let l=pe.size(t.kernelShape),p=pe.computeStrides(t.kernelShape),o=p.length,r=t.pads.length,i=bc(o),a=wn(e,"inputDims"),c=wn(t.pads,"pads"),h=wn(p,"kernelStrides"),g=wn(t.strides,"strides"),b=t.pads.reduce(($,_)=>$+_),x="";return b?x=`
            if (x[j] >= inputDims[j] || x[j] < 0) {
              pad++;
              isPad = true;
              break;
            }
          }
          if (!isPad) {
            ${n}
          }`:x=`
          }
          ${n}
        `,`
        ${i}
        float process(int indices[${d}]) {
          int x[${d}];
          copyVec(indices, x);
          int offset[${o}];
          int pads[${r}];
          int inputDims[${d}];
          int kernelStrides[${o}];
          int strides[${o}];
          ${c}
          ${a}
          ${g}
          ${h}

          float value = ${u};
          int pad = 0;
          bool isPad = false;
          for (int i = 0; i < ${l}; i++) {
            offsetToIndices(i, kernelStrides, offset);
            isPad = false;
            for (int j = ${d} - ${o}; j < ${d}; j++) {
              x[j] = indices[j] * strides[j - ${d} + ${o}]
                + offset[j - ${d} + ${o}] - pads[j - 2];
              ${x}
          }
          ${s}

          return value;
        }
      `}},wn=(e,t)=>{let n="";for(let s=0;s<e.length;s++)n+=`
      ${t}[${s}] = ${e[s]};
    `;return n},bc=e=>`
  void offsetToIndices(int offset, int[${e}] strides, out int[${e}] indices) {
    if (${e} == 0) {
      return;
    }
    for (int i = 0; i < ${e} - 1; ++i) {
      indices[i] = offset / strides[i];
      offset -= indices[i] * strides[i];
    }
    indices[${e} - 1] = offset;
  }`}),Qt,or,yc,_c,C0,z0,R0,B0,M0,j0,F0,g3=C(()=>{Je(),Ji(),Ae(),$e(),Qt=(e,t,n,s,u)=>{_c(t);let d={name:s,inputNames:["A"],inputTypes:[0]};return[e.run({...d,cacheHint:n.cacheKey,get:()=>yc(e,t,n,s,u,d)},t)]},or=e=>{let t=e.attributes.getInts("axes",[]),n=e.attributes.getInt("keepdims",1)===1;return Me({axes:t,keepDims:n})},yc=(e,t,n,s,u,d)=>{let l=[],p=t[0].dims.length||1,o=[],r=pe.normalizeAxes(n.axes,t[0].dims.length),i=u(t,r),a=i[1];for(let h=0;h<t[0].dims.length;h++)r.indexOf(h)>=0||r.length===0?(n.keepDims&&l.push(1),a=`
          for(int j${h} = 0; j${h} < ${t[0].dims[h]}; j${h}++) {
            inputIdx[${h}] = j${h};
            ${a}
          }`):(o.push(`inputIdx[${h}] = outputIdx[${l.length}];`),l.push(t[0].dims[h]));let c=`
      float process(int outputIdx[${l.length||1}]) {
        float value;                 // final result
        int inputIdx[${p}];      // addressing input data
        ${o.join(`
`)}
        ${i[0]}       // init ops for reduce max/min
        ${a}
        ${i[2]}       // final computation for reduce mean
        return value;
      }`;return{...d,output:{dims:l,type:t[0].type,textureType:0},shaderSource:c}},_c=e=>{if(!e||e.length!==1)throw new Error("Reduce op requires 1 input.");if(Yn.indexOf(e[0].type)===-1)throw new Error("Invalid input type.")},C0=(e,t,n)=>Qt(e,t,n,"ReduceSum",()=>["value = 0.0;","value += _A(inputIdx);",""]),z0=(e,t,n)=>Qt(e,t,n,"ReduceMean",(s,u)=>{let d=1;for(let l=0;l<s[0].dims.length;l++)(u.indexOf(l)>=0||u.length===0)&&(d*=s[0].dims[l]);return["value = 0.0;","value += _A(inputIdx);",`value /= ${d}.;`]}),R0=(e,t,n)=>Qt(e,t,n,"ReduceMax",(s,u)=>{let d=[];for(let l=0;l<s[0].dims.length;l++)(u.indexOf(l)>=0||u.length===0)&&d.push(`inputIdx[${l}] = 0;`);return[`${d.join(`
`)}
value = _A(inputIdx);`,"value = max(value, _A(inputIdx));",""]}),B0=(e,t,n)=>Qt(e,t,n,"ReduceMin",(s,u)=>{let d=[];for(let l=0;l<s[0].dims.length;l++)(u.indexOf(l)>=0||u.length===0)&&d.push(`inputIdx[${l}] = 0;`);return[`${d.join(`
`)}
value = _A(inputIdx);`,"value = min(value, _A(inputIdx));",""]}),M0=(e,t,n)=>Qt(e,t,n,"ReduceProd",()=>["value = 1.0;","value *= _A(inputIdx);",""]),j0=(e,t,n)=>Qt(e,t,n,"ReduceLogSum",()=>["value = 0.0;","value += _A(inputIdx);","value = log(value);"]),F0=(e,t,n)=>Qt(e,t,n,"ReduceLogSumSquare",()=>["float t; value = 0.0;","t = _A(inputIdx); value += t * t;",""])}),L0,m3=C(()=>{Ae(),L0=(e,t)=>{let n=pe.calculateReshapedDims(t[0].dims,t[1].integerData);return e.session.pack?[e.reshapePacked(t[0],n)]:[e.reshapeUnpacked(t[0],n)]}}),Wo,As,V0,U0,qn,vc,ks,Bi,q0=C(()=>{Je(),Le(),$e(),Wo={name:"Upsample",inputNames:["X"],inputTypes:[0]},As=(e,t,n)=>(ks(t,n),[e.run({...Wo,cacheHint:n.cacheKey,get:()=>vc(e,t,n)},t)]),V0=e=>qn(e,7),U0=e=>qn(e,9),qn=(e,t)=>{let n=t>=10,s=e.attributes.getString("mode","nearest");if(s!=="nearest"&&s!=="linear"&&(t<11||s!=="cubic"))throw new Error(`unrecognized mode: ${s}`);let u=[];t<9&&(u=e.attributes.getFloats("scales"),Bi(u,s,n));let d=e.attributes.getFloat("extrapolation_value",0),l=t>10?e.attributes.getString("coordinate_transformation_mode","half_pixel"):"asymmetric";if(["asymmetric","pytorch_half_pixel","tf_half_pixel_for_nn","align_corners","tf_crop_and_resize","half_pixel"].indexOf(l)===-1)throw new Error(`coordinate_transform_mode '${l}' is not supported`);let p=l==="tf_crop_and_resize",o=p,r=s==="nearest"&&t>=11?e.attributes.getString("nearest_mode","round_prefer_floor"):"";if(["round_prefer_floor","round_prefer_ceil","floor","ceil",""].indexOf(r)===-1)throw new Error(`nearest_mode '${r}' is not supported`);let i=e.attributes.getFloat("cubic_coeff_a",-.75),a=e.attributes.getInt("exclude_outside",0)!==0;if(a&&s!=="cubic")throw new Error("exclude_outside can be set to 1 only when mode is CUBIC.");let c=t<11?!0:s==="nearest"&&l==="asymmetric"&&r==="floor",h=0,g=0,b=0;return t>10?e.inputs.length>2?(h=1,g=2,b=3):(g=1,b=2):t===9&&(g=1),Me({opset:t,isResize:n,mode:s,scales:u,extrapolationValue:d,coordinateTransformMode:l,useExtrapolation:o,needRoiInput:p,nearestMode:r,cubicCoefficientA:i,excludeOutside:a,useNearest2xOptimization:c,roiInputIdx:h,scalesInputIdx:g,sizesInputIdx:b})},vc=(e,t,n)=>{let s=we(e.session.backend.glContext.version),[u,d]=e.calculateTextureWidthAndHeight(t[0].dims,0),l=t[0].dims.map((b,x)=>Math.floor(b*n.scales[x])),[p,o]=e.calculateTextureWidthAndHeight(l,0),r=l.length,i=new Array(r),a=new Array(r),c=`
      int output_pitches[${r}];
      int input_pitches[${r}];
      `;for(let b=r-1;b>=0;b--)i[b]=b===r-1?1:i[b+1]*l[b+1],a[b]=b===r-1?1:a[b+1]*t[0].dims[b+1],c+=`
        output_pitches[${b}] = ${i[b]};
        input_pitches[${b}] = ${a[b]};
        `;let h=`
      float getInputFloat(int index) {
        vec2 coords = offsetToCoords(index, ${u}, ${d});
        float value = getColorAsFloat(${s.texture2D}(X, coords));
        return value;
      }
      `,g=n.mode==="nearest"?`
    ${h}
    float process(int indices[${r}]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${p}, ${o});

      ${c}

      int d, m;
      for (int dim = 0; dim < ${r}; ++dim) {
        d = output_index / output_pitches[dim];
        m = output_index - d * output_pitches[dim];
        output_index = m;

        if (scales[dim] != 1 && d > 0) {
          int d2 = d / scales[dim];
          m = d - d2 * scales[dim];
          d = d2;
        }
        input_index += input_pitches[dim] * d;
      }

      return getInputFloat(input_index);
    }`:r===4?`
    ${h}
    float process(int indices[4]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${p}, ${o});

      ${c}

      int m;
      int index_of_dim0, index_of_dim1, index_of_dim2, index_of_dim3;
      index_of_dim0 = output_index / output_pitches[0];
      m = output_index - index_of_dim0 * output_pitches[0];
      index_of_dim1 = m / output_pitches[1];
      m = m - index_of_dim1 * output_pitches[1];
      index_of_dim2 = m / output_pitches[2];
      m = m - index_of_dim2 * output_pitches[2];
      index_of_dim3 = m;

      int index_of_input_dim2, index_of_input_dim3, x_offset, y_offset;
      index_of_input_dim2 = index_of_dim2 / scales[2];
      y_offset = index_of_dim2 - index_of_input_dim2 * scales[2];
      index_of_input_dim3 = index_of_dim3 / scales[3];
      x_offset = index_of_dim3 - index_of_input_dim3 * scales[3];

      input_index = index_of_dim0 * input_pitches[0] +
            index_of_dim1 * input_pitches[1] +
            index_of_input_dim2 * input_pitches[2] +
            index_of_input_dim3;

      float x00 = getInputFloat(input_index);
      float x10, x01, x11;

      bool end_of_dim2 = false;
      if (index_of_input_dim2 == (${t[0].dims[2]} - 1)) {
        // It's the end in dimension 2
        x01 = x00;
        end_of_dim2 = true;
      } else {
        x01 = getInputFloat(input_index + input_pitches[2]);
      }

      if (index_of_input_dim3 == (input_pitches[2] - 1)) {
        // It's the end in dimension 3
        x10 = x00;
        x11 = x01;
      }
      else {
        x10 = getInputFloat(input_index + 1);
        x11 = end_of_dim2 ? x10 : getInputFloat(input_index + input_pitches[2] + 1);
      }

      float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[2]);
      float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[2]);
      return y0 + float(x_offset) * (y1 - y0) / float(scales[3]);
    }`:`
    ${h}
    float process(int indices[2]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${p}, ${o});

      ${c}

      int m;
      int index_of_dim0, index_of_dim1;
      index_of_dim0 = output_index / output_pitches[0];
      m = output_index - index_of_dim0 * output_pitches[0];
      index_of_dim1 = m;

      int index_of_input_dim0, index_of_input_dim1, x_offset, y_offset;
      index_of_input_dim0 = index_of_dim0 / scales[0];
      y_offset = index_of_dim0 - index_of_input_dim0 * scales[0];
      index_of_input_dim1 = index_of_dim1 / scales[1];
      x_offset = index_of_dim1 - index_of_input_dim1 * scales[1];

      input_index = index_of_input_dim0 * input_pitches[0] + index_of_input_dim1;

      float x00 = getInputFloat(input_index);
      float x10, x01, x11;

      bool end_of_dim0 = false;
      if (index_of_input_dim0 == (${t[0].dims[0]} - 1)) {
        // It's the end in dimension 0
        x01 = x00;
        end_of_dim0 = true;
      } else {
        x01 = getInputFloat(input_index + input_pitches[0]);
      }

      if (index_of_input_dim1 == (input_pitches[0] - 1)) {
        // It's the end in dimension 1
        x10 = x00;
        x11 = x01;
      }
      else {
        x10 = getInputFloat(input_index + 1);
        x11 = end_of_dim0 ? x10 : getInputFloat(input_index + input_pitches[0] + 1);
      }

      float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[0]);
      float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[0]);
      return y0 + float(x_offset) * (y1 - y0) / float(scales[1]);
    }`;return{...Wo,output:{dims:l,type:t[0].type,textureType:0},shaderSource:g,variables:[{name:"scales",type:"int",arrayLength:n.scales.length,data:n.scales.map(b=>Math.ceil(b))}]}},ks=(e,t)=>{if(!e||t.opset<9&&e.length!==1||t.opset>=9&&t.opset<11&&e.length!==2||t.opset>=11&&e.length<2)throw new Error("invalid inputs.");if(t.scales.length>0&&e[0].dims.length!==t.scales.length)throw new Error("Invalid input shape.");if(e[0].type==="string")throw new Error("Invalid input tensor types.")},Bi=(e,t,n)=>{if(n){for(let s of e)if(s<=0)throw new Error("Scale value should be greater than 0.")}else for(let s of e)if(s<1)throw new Error("Scale value should be greater than or equal to 1.");if((t==="linear"||t==="cubic")&&e.length!==2&&(e.length!==4||e[0]!==1||e[1]!==1))throw new Error(`'Linear' mode and 'Cubic' mode only support 2-D inputs ('Bilinear', 'Bicubic')         or 4-D inputs with the corresponding outermost 2 scale values being 1         in the ${n?"Resize":"Upsample"} opeartor.`)}}),mi,Ds,G0,H0,wc,xc,$c,Tc,b3=C(()=>{Le(),$e(),qt(),un(),q0(),mi={name:"Resize",inputNames:["A"],inputTypes:[2]},Ds=(e,t,n)=>(ks(t,n),[e.run({...mi,cacheHint:n.cacheKey,get:()=>wc(e,t,n)},t)]),G0=e=>qn(e,10),H0=e=>qn(e,11),wc=(e,t,n)=>{let s=we(e.session.backend.glContext.version),[u,d]=xc(t,n);if(u.every(_=>_===1)&&n.coordinateTransformMode!=="tf_crop_and_resize")return{...mi,output:{dims:d,type:t[0].type,textureType:2},hasMain:!0,shaderSource:`void main() {
                    vec4 v = ${s.texture2D}(X, TexCoords);
                    ${s.output} = v;
                }`};let l=d.length;if(l<2)throw new Error(`output dimension should be at least 2, but got ${l}`);let p=d[l-2],o=d[l-1],r=t[0].dims;if(l!==r.length)throw new Error(`output dimension should match input ${r.length}, but got ${l}`);let i=r[l-2],a=r[l-1],c=u[l-2],h=u[l-1],g="";if(n.mode!=="linear")throw new Error(`resize (packed) does not support mode: '${n.mode}'`);switch(n.coordinateTransformMode){case"asymmetric":g=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        return vec4(coords) / scaleWHWH;
                    }
                `;break;case"half_pixel":g=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        return (vec4(coords) + 0.5) / scaleWHWH - 0.5;
                    }
                `;break;case"pytorch_half_pixel":g=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        vec4 fcoords = vec4(coords);
                        return vec4(
                            ${o}.0 > 1.0 ? (fcoords.x + 0.5) / scaleWHWH.x - 0.5 : 0.0,
                            ${p}.0 > 1.0 ? (fcoords.y + 0.5) / scaleWHWH.y - 0.5 : 0.0,
                            ${o}.0 > 1.0 ? (fcoords.z + 0.5) / scaleWHWH.z - 0.5 : 0.0,
                            ${p}.0 > 1.0 ? (fcoords.w + 0.5) / scaleWHWH.w - 0.5 : 0.0
                          );
                    }
                `;break;case"align_corners":g=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        vec4 resized = vec4(${o}.0 - 1.0, ${p}.0 - 1.0, ${o}.0 - 1.0,
                            ${p}.0 - 1.0);
                        vec4 original = vec4(${a}.0 - 1.0, ${i}.0 - 1.0, ${a}.0 - 1.0,
                            ${i}.0 - 1.0);
                        vec4 new_scale = original / resized;
                        return vec4(coords) * new_scale;
                    }
                `;break;default:throw new Error(`resize (packed) does not support coordinateTransformMode:                                 '${n.coordinateTransformMode}'`)}let b=ar(l),x=Jn(),$=`
            const vec2 inputWH = vec2(${i}.0, ${a}.0);
            const vec4 scaleWHWH = vec4(float(${c}), float(${h}), float(${c}), float(${h}));
            ${x}
            ${g}
            float getAValue(int x10, int r, int c, int d) {
                return getChannel(getA(x10, r, c, d), vec2(c, d));
            }
            void main() {
                ${b} rc = getOutputCoords();

                int batch = rc[0];
                int depth = rc[1];

                // retrieve the 4 coordinates that is used in the 4 packed output values.
                ivec4 coords = ivec4(rc.wz, rc.w + 1, rc.z + 1);

                // calculate the source index in fraction
                vec4 sourceFrac = getSourceFracIndex(coords);

                // get the lower and upper bound of the 4 values that will be packed into one texel.
                ivec4 x00 = ivec4(max(sourceFrac.xy, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.xy)));
                ivec4 x01 = ivec4(max(sourceFrac.xw, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.xw)));
                ivec4 x10 = ivec4(max(sourceFrac.zy, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.zy)));
                ivec4 x11 = ivec4(max(sourceFrac.zw, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.zw)));

                bool hasNextRow = rc.w < ${p-1};
                bool hasNextCol = rc.z < ${o-1};

                // pack x00, x01, x10, x11's top-left corner into one vec4 structure
                vec4 topLeft = vec4(
                    getAValue(batch, depth, x00.x, x00.y),
                    hasNextCol ? getAValue(batch, depth, x01.x, x01.y) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.x, x10.y) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.x, x11.y) : 0.0);

                // pack x00, x01, x10, x11's top-right corner into one vec4 structure
                vec4 topRight = vec4(
                    getAValue(batch, depth, x00.x, x00.w),
                    hasNextCol ? getAValue(batch, depth, x01.x, x01.w) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.x, x10.w) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.x, x11.w) : 0.0);

                // pack x00, x01, x10, x11's bottom-left corner into one vec4 structure
                vec4 bottomLeft = vec4(
                    getAValue(batch, depth, x00.z, x00.y),
                    hasNextCol ? getAValue(batch, depth, x01.z, x01.y) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.z, x10.y) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.z, x11.y) : 0.0);

                // pack x00, x01, x10, x11's bottom-right corner into one vec4 structure
                vec4 bottomRight = vec4(
                    getAValue(batch, depth, x00.z, x00.w),
                    hasNextCol ? getAValue(batch, depth, x01.z, x01.w) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.z, x10.w) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.z, x11.w) : 0.0);

                // calculate the interpolation fraction on u and v direction
                vec4 frac = vec4(sourceFrac) - floor(sourceFrac);
                vec4 clampFrac = clamp(frac, vec4(0.0), vec4(1.0));

                vec4 top = mix(topLeft, topRight, clampFrac.ywyw);
                vec4 bottom = mix(bottomLeft, bottomRight, clampFrac.ywyw);
                vec4 newValue = mix(top, bottom, clampFrac.xxzz);

                ${s.output} = vec4(newValue);
            }
        `;return{...mi,output:{dims:d,type:t[0].type,textureType:2},hasMain:!0,shaderSource:$}},xc=(e,t)=>{let n=e[0].dims,s=t.scales,u;if(s.length===0){let l=e[t.scalesInputIdx];if(l&&l.size!==0){if(e[t.sizesInputIdx])throw new Error("Only one of scales or sizes must be provided as input.");s=$c(l,t.mode,t.isResize)}else{let p=e[t.sizesInputIdx];if(!p||p.size===0)throw new Error("Either scales or sizes MUST be provided as input.");u=Array.from(p.integerData),s=Tc(u,n,t.mode,t.isResize)}}else if(e[t.sizesInputIdx])throw new Error("Only one of scales or sizes must be provided as input.");let d=u||n.map((l,p)=>Math.floor(l*s[p]));return[s,d]},$c=(e,t,n)=>{let s=Array.from(e.floatData);return Bi(s,t,n),s},Tc=(e,t,n,s)=>{let u=t.length,d=new Array(u);for(let l=0,p=u;l<p;l++)if(t[l]===0){if(e[l]!==0)throw new Error("Input dim is zero but required output dim is non-zero.");d[l]=1}else d[l]=e[l]/t[l];return Bi(d,n,s),d}}),W0,Sc,y3=C(()=>{sn(),W0=(e,t)=>(Sc(t),[new lt([t[0].dims.length],"int32",void 0,void 0,new Int32Array(t[0].dims))]),Sc=e=>{if(!e||e.length!==1)throw new Error("Shape requires 1 input.")}}),bi,K0,X0,Ko,Ic,Z0,Oc,Ec,_3=C(()=>{Je(),Ji(),Ae(),$e(),bi={name:"Slice",inputNames:["A"],inputTypes:[0]},K0=(e,t,n)=>(Ic(t),[e.run({...bi,cacheHint:n.cacheKey,get:()=>Ko(e,t[0],n)},t)]),X0=e=>{let t=e.attributes.getInts("starts"),n=e.attributes.getInts("ends"),s=e.attributes.getInts("axes",[]);return Me({starts:t,ends:n,axes:s})},Ko=(e,t,n)=>{let s=n.axes.length===0?t.dims.slice(0).map((i,a)=>a):n.axes,u=pe.normalizeAxes(s,t.dims.length),d=n.starts.map((i,a)=>i>t.dims[u[a]]-1?t.dims[u[a]]:pe.normalizeAxis(i,t.dims[u[a]])),l=n.ends.map((i,a)=>i>t.dims[u[a]]-1?t.dims[u[a]]:pe.normalizeAxis(i,t.dims[u[a]])),p=t.dims.slice(),o=[];for(let i=0;i<u.length;i++)p[u[i]]=l[i]-d[i],d[i]>0&&o.push(`outputIdx[${u[i]}] += ${d[i]};`);let r=`
      float process(int outputIdx[${p.length}]) {
        ${o.join(`
      `)}
        return _A(outputIdx);
      }`;return{...bi,output:{dims:p,type:t.type,textureType:0},shaderSource:r}},Ic=e=>{if(!e||e.length!==1)throw new Error("Slice requires 1 input.");if(Yn.indexOf(e[0].type)===-1)throw new Error("Invalid input type.")},Z0=(e,t)=>{Ec(t);let n=Oc(e,t);return[e.run({...bi,cacheHint:n.cacheKey,get:()=>Ko(e,t[0],n)},[t[0]])]},Oc=(e,t)=>{if(!e.session.isInitializer(t[1].dataId)||!e.session.isInitializer(t[2].dataId)||t.length>=4&&!e.session.isInitializer(t[3].dataId)||t.length>=5&&!e.session.isInitializer(t[4].dataId))throw new Error("dynamic slice attributes are not allowed");if(t.length>=5&&t[4].integerData.some(l=>l!==1))throw new Error("currently non-1 steps is not supported for Slice");let n=Array.from(t[1].integerData),s=Array.from(t[2].integerData),u=t.length>=4?Array.from(t[3].integerData):[],d=`${u};${n};${s}`;return{starts:n,ends:s,axes:u,cacheKey:d}},Ec=e=>{if(!e||e.length<3||e.length>5)throw new Error("Invalid input number.");if(e[1].type!=="int32"||e[1].dims.length!==1)throw new Error("Invalid input type.");if(e[2].type!=="int32"||e[2].dims.length!==1)throw new Error("Invalid input type.");if(e.length>=4&&(e[3].type!=="int32"||e[3].dims.length!==1))throw new Error("Invalid input type.");if(e.length>=5&&(e[4].type!=="int32"||e[4].dims.length!==1))throw new Error("Invalid input type.")}}),Xo,Zo,Jo,J0,Q0,Y0,e_,Qo,Pc,Ac,kc,Yo,v3=C(()=>{Je(),Ae(),Le(),$e(),pu(),Xo={name:"SoftmaxComputeMax",inputNames:["A"],inputTypes:[0]},Zo={name:"SoftmaxComputeScale",inputNames:["A","Max"],inputTypes:[0,0]},Jo={name:"SoftMax",inputNames:["A","Max","Norm"],inputTypes:[0,0,0]},J0=(e,t,n)=>{Yo(t);let s=t[0].dims.slice(),u=pe.normalizeAxis(n.axis,s.length),d=pe.sizeToDimension(s,u),l=pe.sizeFromDimension(s,u);return Qo(e,t,n,d,l)},Q0=e=>Me({axis:e.attributes.getInt("axis",1)}),Y0=e=>Me({axis:e.attributes.getInt("axis",-1)}),e_=(e,t,n)=>{Yo(t);let s=t[0].dims.slice(),u=pe.normalizeAxis(n.axis,s.length),d=s.length,l=u!==d-1,p=[],o=[],r=[],i;l&&(o=Array.from({length:d}).map((g,b)=>b),o[u]=d-1,o[d-1]=u,o.map(g=>p.push(s[g])),i=Me({perm:o}),r=Kn(e,t,i));let a=l?pe.sizeToDimension(p,d-1):pe.sizeToDimension(s,d-1),c=l?pe.sizeFromDimension(p,d-1):pe.sizeFromDimension(s,d-1),h=Qo(e,l?r:t,n,a,c);return l?Kn(e,h,i):h},Qo=(e,t,n,s,u)=>{let d=Pc(e,t[0],s,u,[s]),l=e.run({...Xo,cacheHint:n.cacheKey,get:()=>d},t),p=Ac(e,t[0],s,u,d.output.dims,[s]),o=e.run({...Zo,cacheHint:n.cacheKey,get:()=>p},[t[0],l]),r=kc(e,t[0],s,u,d.output.dims,p.output.dims);return[e.run({...Jo,cacheHint:n.cacheKey,get:()=>r},[t[0],l,o])]},Pc=(e,t,n,s,u)=>{let[d,l]=e.calculateTextureWidthAndHeight(t.dims,0),p=u.length;if(n<1||s<1)throw new Error("Logical row count N and feature count D must be greater than or equal to 1");if(u.length!==1)throw new Error("Dimensionality of the output should be 1");if(u[0]!==n)throw new Error("Shape of the output should be equal to logical row count");let o=we(e.session.backend.glContext.version),r=`
      float process(int[${p}] indices) {
        int logical_row_start_offset = indices[0] * ${s};

        float max = getColorAsFloat(${o.texture2D}(A, offsetToCoords(logical_row_start_offset, ${d},
        ${l} )));
        for(int i=1; i<${s}; ++i)
        {
          float current = getColorAsFloat(${o.texture2D}(A, offsetToCoords(logical_row_start_offset + i,
            ${d}, ${l})));
          if(current > max)
          max = current;
        }

        return max;
      }`;return{...Xo,output:{dims:u,type:t.type,textureType:0},shaderSource:r}},Ac=(e,t,n,s,u,d)=>{let[l,p]=e.calculateTextureWidthAndHeight(t.dims,0),o=d.length;if(n<1||s<1)throw new Error("Logical row count N and feature count D must be greater than or equal to 1");if(d.length!==1)throw new Error("Dimensionality of the output should be 1");if(d[0]!==n)throw new Error("Shape of the output should be equal to logical row count");if(u.length!==1)throw new Error("Dimensionality of the intermediate results should be 1");if(u[0]!==n)throw new Error("Shape of the intermediate results should be equal to logical row count");let r=we(e.session.backend.glContext.version),i=`
      float process(int[${o}] indices) {
        int logical_row_start_offset = indices[0] * ${s};

        float norm_factor = 0.0;
        float max = _Max(indices);
        for(int i=0; i<${s}; ++i)
        {
          norm_factor += exp(getColorAsFloat(${r.texture2D}(A, offsetToCoords(logical_row_start_offset + i,
            ${l}, ${p}))) - max);
        }

        return norm_factor;
      }`;return{...Zo,output:{dims:d,type:t.type,textureType:0},shaderSource:i}},kc=(e,t,n,s,u,d)=>{let[l,p]=e.calculateTextureWidthAndHeight(t.dims,0),o=t.dims.length;if(n<1||s<1)throw new Error("Logical row count N and feature count D must be greater than or equal to 1");if(u.length!==1||d.length!==1)throw new Error("Dimensionality of the intermediate results should be 1");if(u[0]!==n||d[0]!==n)throw new Error("Shape of the intermediate results should be equal to logical row count");let r=`
      float process(int[${o}] indices) {

      // get offset of current logical tensor index from the 2-D texture coordinates (TexCoords)
      int offset = coordsToOffset(TexCoords, ${l}, ${p});

      //determine the logical row for this index
      int logical_row_index[1];
      logical_row_index[0] = offset / ${s};

      float norm_factor = _Norm(logical_row_index);

      // avoid possible division by 0
      // if norm_facor is 0, all elements are zero
      // if so, return 0
      if(norm_factor == 0.0)
        return 0.0;

      return exp(_A(indices) - _Max(logical_row_index)) / norm_factor;
    }`;return{...Jo,output:{dims:t.dims,type:t.type,textureType:0},shaderSource:r}},Yo=e=>{if(!e||e.length!==1)throw new Error("Softmax requires 1 input.");if(e[0].type!=="float32"&&e[0].type!=="float64")throw new Error("Invalid input type")}}),ea,t_,r_,Dc,Nc,Cc,w3=C(()=>{Je(),Ae(),$e(),ea={name:"Split",inputNames:["A"],inputTypes:[0]},t_=(e,t,n)=>{Cc(t);let s=pe.normalizeAxis(n.axis,t[0].dims.length),u=Dc(e,t,s,n),d=[];for(let l=0;l<u;++l)d.push(e.run({...ea,cacheHint:`${n.cacheKey};${l}`,get:()=>Nc(e,t[0],n,s,l)},t));return d},r_=e=>{let t=e.attributes.getInt("axis",0),n=e.attributes.getInts("split",[]),s=e.outputs.length;return Me({axis:t,split:n,numOutputs:s})},Dc=(e,t,n,s)=>{let[,u]=ms.splitShape(t[0].dims,n,s.split,s.numOutputs);return u.length},Nc=(e,t,n,s,u)=>{let[d,l]=ms.splitShape(t.dims,s,n.split,n.numOutputs),p=l[u],o=d[u],r=`
      float process(int indices[${o.length}]) {
        indices[${s}] += ${p};
        return _A(indices);
      }
    `;return{...ea,cacheHint:`${n.cacheKey}:${u}`,output:{dims:o,type:t.type,textureType:0},shaderSource:r}},Cc=e=>{if(!e||e.length!==1)throw new Error("Split requires one input.");if(e[0].type!=="int8"&&e[0].type!=="uint8"&&e[0].type!=="int16"&&e[0].type!=="uint16"&&e[0].type!=="int32"&&e[0].type!=="uint32"&&e[0].type!=="float32"&&e[0].type!=="float64"&&e[0].type!=="bool")throw new Error("Invalid input type.")}}),Ns,n_,i_,zc,Rc,x3=C(()=>{Ae(),Ns=(e,t,n)=>{zc(t);let s=pe.squeezeShape(t[0].dims,n);return[e.reshapeUnpacked(t[0],s)]},n_=(e,t)=>(Rc(t),Ns(e,[t[0]],Array.from(t[1].integerData))),i_=e=>e.attributes.getInts("axes"),zc=e=>{if(!e||e.length!==1)throw new Error("Squeeze requires 1 input.");if(e[0].type==="string")throw new Error("invalid input tensor types.")},Rc=e=>{if(!e||e.length!==2)throw new Error("Squeeze requires 2 inputs.");if(e[1].type!=="int32")throw new Error("Invalid input type.")}}),o_,Bc,Mc,$3=C(()=>{Le(),$e(),o_=(e,t)=>{Mc(t);let n={name:"Sum",inputNames:t.map((s,u)=>`X${u}`),inputTypes:new Array(t.length).fill(0)};return[e.run({...n,get:()=>Bc(e,t,n)},t)]},Bc=(e,t,n)=>{let s=we(e.session.backend.glContext.version),u=t[0].dims.slice(),d=`
      void main() {
        vec4 result = ${t.map((l,p)=>`${s.texture2D}(X${p},TexCoords)`).join(" + ")};
        ${s.output} = result;
      }
    `;return{...n,output:{dims:u,type:t[0].type,textureType:0},hasMain:!0,shaderSource:d}},Mc=e=>{if(!e||e.length===0)throw new Error("Sum requires inputs.");let t=e[0].dims.length;for(let n=1;n<e.length;n++){if(t!==e[n].dims.length)throw new Error("Input shapes are mismatched.");for(let s=0;s<t;s++)if(e[0].dims[s]!==e[n].dims[s])throw new Error("Input shapes are not matched.")}if(e[0].type!=="float32"&&e[0].type!=="float64")throw new Error("Invalid input type.");for(let n=1;n<e.length;n++)if(e[0].type!==e[n].type)throw new Error("Input types are not matched.")}}),a_,jc,Fc,T3=C(()=>{Ji(),$e(),a_=(e,t)=>{Fc(t);let n={name:"Tile",inputNames:["A"],inputTypes:[0]};return[e.run({...n,get:()=>jc(e,t,n)},t)]},jc=(e,t,n)=>{let s=t[0].dims.slice(),u=new Array(s.length),d=[];for(let o=0;o<s.length;o++)u[o]=s[o]*t[1].numberData[o],d.push(`inputIdx[${o}] = int(mod(float(outputIdx[${o}]), ${s[o]}.));`);let l=u.length,p=`
      float process(int outputIdx[${l}]) {
        int inputIdx[${l}];
        ${d.join(`
`)}
        return _A(inputIdx);
      }
    `;return{...n,output:{dims:u,type:t[0].type,textureType:0},shaderSource:p}},Fc=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 input.");if(e[1].dims.length!==1)throw new Error("The second input shape must 1 dimension.");if(e[1].dims[0]!==e[0].dims.length)throw new Error("Invalid input shape.");if(Yn.indexOf(e[0].type)===-1)throw new Error("Invalid input type.");if(e[1].type!=="int32"&&e[1].type!=="int16")throw new Error("Invalid repeat type.")}}),Cs,s_,u_,Lc,Vc,S3=C(()=>{Ae(),Cs=(e,t,n)=>{Lc(t);let s=pe.unsqueezeShape(t[0].dims,n);return[e.reshapeUnpacked(t[0],s)]},s_=(e,t)=>(Vc(t),Cs(e,[t[0]],Array.from(t[1].integerData))),u_=e=>e.attributes.getInts("axes"),Lc=e=>{if(!e||e.length!==1)throw new Error("Unsqueeze requires 1 input.");if(e[0].type==="string")throw new Error("invalid input tensor types.")},Vc=e=>{if(!e||e.length!==2)throw new Error("Unsqueeze requires 2 inputs.");if(e[1].type!=="int32")throw new Error("Invalid input type.")}}),l_,I3=C(()=>{hT(),OT(),ET(),AT(),du(),n3(),i3(),o3(),a3(),s3(),u3(),l3(),c3(),uu(),h3(),f3(),g3(),m3(),b3(),y3(),_3(),v3(),w3(),x3(),$3(),T3(),pu(),Ky(),S3(),q0(),l_=[["Abs","","6+",Sy],["Acos","","7+",Iy],["Add","","7+",oy],["And","","7+",ay],["Asin","","7+",Oy],["Atan","","7+",Ey],["AveragePool","","7+",O0,E0],["BatchNormalization","","7+",ty,ry],["Cast","","6+",by,yy],["Ceil","","6+",ky],["Clip","","6-10",$s,Py],["Clip","","11+",Ay],["Concat","","4+",vy,wy],["Conv","","1+",Is,Os],["ConvTranspose","","1+",s0,u0],["Cos","","7+",Dy],["Div","","7+",sy],["Dropout","","7+",Ts],["DepthToSpace","","1+",d0,p0],["Equal","","7+",uy],["Elu","","6+",Ny,Cy],["Exp","","6+",zy],["Flatten","","1+",c0,h0],["Floor","","6+",Ry],["FusedConv","com.microsoft","1+",Is,Os],["Gather","","1+",f0,g0],["Gemm","","7-10",Es,m0],["Gemm","","11+",Es,b0],["GlobalAveragePool","","1+",P0,A0],["GlobalMaxPool","","1+",N0],["Greater","","7+",ly],["Identity","","1+",Ts],["ImageScaler","","1+",y0,_0],["InstanceNormalization","","6+",v0,w0],["LeakyRelu","","6+",By,My],["Less","","7+",dy],["LRN","","1+",x0,$0],["Log","","6+",jy],["MatMul","","1+",Yy,e0],["MaxPool","","1+",k0,D0],["Mul","","7+",py],["Neg","","6+",Fy],["Not","","1+",Ly],["Or","","7+",cy],["Pad","","2-10",Ps,T0],["Pad","","11+",S0,I0],["Pow","","7+",hy],["PRelu","","7+",fy],["ReduceLogSum","","1+",j0,or],["ReduceMax","","1+",R0,or],["ReduceMean","","1+",z0,or],["ReduceMin","","1+",B0,or],["ReduceProd","","1+",M0,or],["ReduceSum","","1-12",C0,or],["ReduceSumSquare","","1+",F0,or],["Relu","","6+",Vy],["Reshape","","5+",L0],["Resize","","10",Ds,G0],["Resize","","11+",Ds,H0],["Shape","","1+",W0],["Sigmoid","","6+",Uy],["Sin","","7+",qy],["Slice","","10+",Z0],["Slice","","1-9",K0,X0],["Softmax","","1-12",J0,Q0],["Softmax","","13+",e_,Y0],["Split","","2-12",t_,r_],["Sqrt","","6+",Gy],["Squeeze","","1-12",Ns,i_],["Squeeze","","13+",n_],["Sub","","7+",gy],["Sum","","6+",o_],["Tan","","7+",Hy],["Tanh","","6+",Wy],["Tile","","6+",a_],["Transpose","","1+",Kn,l0],["Upsample","","7-8",As,V0],["Upsample","","9",As,U0],["Unsqueeze","","1-12",Cs,u_],["Unsqueeze","","13+",s_],["Xor","","7+",my]]});function O3(e){let t={},n;for(;(n=zs.exec(e))!==null;){let s=n[3].split(",").map(u=>{let d=u.trim().split(" ");return d&&d.length===2?{type:d[0],name:d[1]}:null}).filter(u=>u!==null);t[n[2]]={params:s,body:n[4]}}for(let s in t){let u=d_.replace("__FUNC__",s),d=new RegExp(u,"gm");for(;(n=d.exec(e))!==null;){let l=n[1],p=n[2],o=n[3].split(","),r=l?`${l} ${p};`:"",i=t[s].body,a="";t[s].params.forEach((h,g)=>{h&&(a+=`${h.type} ${h.name} = ${o[g]};
`)}),i=`${a}
 ${i}`,i=i.replace("return",`${p} = `);let c=`
      ${r}
      {
        ${i}
      }
      `;e=e.replace(n[0],c)}}return e=e.replace(zs,""),e}var zs,d_,E3=C(()=>{zs=/@inline[\s\n\r]+(\w+)[\s\n\r]+([0-9a-zA-Z_]+)\s*\(([^)]*)\)\s*{(([^}]|[\n\r])*)}/gm,d_="(\\w+)?\\s+([_0-9a-zA-Z]+)\\s+=\\s+__FUNC__\\((.*)\\)\\s*;"});function zn(e,t){let n=[],s=[];for(let u=0;u<e.length;++u)e[u]!==1&&(n.push(e[u]),s.push(u));return{newShape:n,keptDims:s}}function P3(e){if(e.length===0)return 1;let t=e[0];for(let n=1;n<e.length;n++)t*=e[n];return t}function Uc(e){let t=Math.ceil(Math.sqrt(e));return[t,Math.ceil(e/t)]}var p_,c_=C(()=>{Pt(),Ae(),p_=class{constructor(e){this.maxTextureSize=e}computeTextureWH(e,t){let n=this.computeTexture(e,t);return t&&t.isPacked&&(n[0]/=2,n[1]/=2),t&&t.reverseWH?[n[1],n[0]]:n}computeTexture(e,t){let n=t&&t.isPacked;if(e.length===0)return n?[2,2]:[1,1];let s=this.maxTextureSize;if(t&&t.breakAxis!==void 0){let l=t.breakAxis>=e.length?1:e.slice(t.breakAxis).reduce((o,r)=>o*r),p=t.breakAxis<=0?1:e.slice(0,t.breakAxis).reduce((o,r)=>o*r);if(l>s||p>s)qe.verbose("TextureLayout",`Given width/height preferences were unattainable: shape:${e}, breakAxis:${t.breakAxis}`);else return[l,p]}let u=e.slice(0);n&&(s=s*2,u=u.map((l,p)=>p>=u.length-2?u[p]%2===0?u[p]:u[p]+1:u[p]),u.length===1&&(u=[2,u[0]])),u.length!==2&&(u=zn(u).newShape);let d=P3(u);return u.length<=1&&d<=s?[1,d]:u.length===2&&u[0]<=s&&u[1]<=s?u:u.length===3&&u[0]*u[1]<=s&&u[2]<=s?[u[0]*u[1],u[2]]:u.length===3&&u[0]<=s&&u[1]*u[2]<=s?[u[0],u[1]*u[2]]:u.length===4&&u[0]*u[1]*u[2]<=s&&u[3]<=s?[u[0]*u[1]*u[2],u[3]]:u.length===4&&u[0]<=s&&u[1]*u[2]*u[3]<=s?[u[0],u[1]*u[2]*u[3]]:n?Uc(d/4).map(l=>l*2):Uc(d)}}}),h_,A3=C(()=>{Ae(),ur(),Le(),c_(),qt(),h_=class extends ln{constructor(e){super(e)}getFunctions(){return{...this.offsetToCoords(),...this.coordsToOffset(),...this.toVec(),...this.valueFrom(),...this.getCommonUtilFuncs(),...this.getInputsSamplingSnippets(),...this.getOutputSamplingSnippet()}}getCustomTypes(){return{}}offsetToCoords(){let e="offsetToCoords";return{offsetToCoords:new Y(`
      vec2 ${e}(int offset, int width, int height) {
        int t = offset / width;
        int s = offset - t*width;
        vec2 coords = (vec2(s,t) + vec2(0.5,0.5)) / vec2(width, height);
        return coords;
      }
      `)}}coordsToOffset(){let e="coordsToOffset";return{coordsToOffset:new Y(`
      int ${e}(vec2 coords, int width, int height) {
        float s = coords.s * float(width);
        float t = coords.t * float(height);
        int offset = int(t) * width + int(s);
        return offset;
      }
      `)}}getOutputSamplingSnippet(){let e=this.context.outputTextureLayout;return e.isPacked?this.getPackedOutputSamplingSnippet(e):this.getUnpackedOutputSamplingSnippet(e)}getPackedOutputSamplingSnippet(e){let t=e.unpackedShape,n=[e.width,e.height],s={},u="getOutputCoords";switch(t.length){case 0:s[u]=this.getOutputScalarCoords();break;case 1:s[u]=this.getOutputPacked1DCoords(t,n);break;case 2:s[u]=this.getOutputPacked2DCoords(t,n);break;case 3:s[u]=this.getOutputPacked3DCoords(t,n);break;default:s[u]=this.getOutputPackedNDCoords(t,n)}let d=`
      void setOutput(vec4 val) {
        ${we(this.context.glContext.version).output} = val;
      }
    `,l="floatTextureSetRGBA";return s[l]=new Y(d),s}getUnpackedOutputSamplingSnippet(e){let t=e.unpackedShape,n=[e.width,e.height],s={},u="getOutputCoords";switch(t.length){case 0:s[u]=this.getOutputScalarCoords();break;case 1:s[u]=this.getOutputUnpacked1DCoords(t,n);break;case 2:s[u]=this.getOutputUnpacked2DCoords(t,n);break;case 3:s[u]=this.getOutputUnpacked3DCoords(t,n);break;case 4:s[u]=this.getOutputUnpacked4DCoords(t,n);break;case 5:s[u]=this.getOutputUnpacked5DCoords(t,n);break;case 6:s[u]=this.getOutputUnpacked6DCoords(t,n);break;default:throw new Error(`Unsupported output dimensionality: ${t.length}`)}let d=`
        void setOutput(float val) {
          ${we(this.context.glContext.version).output} = vec4(val, 0, 0, 0);
        }
    `,l="floatTextureSetR";return s[l]=new Y(d),s}getOutputScalarCoords(){return new Y(`
      int getOutputCoords() {
        return 0;
      }
    `)}getOutputPacked1DCoords(e,t){let n=t,s="";return n[0]===1?(s=`
          int getOutputCoords() {
            return 2 * int(TexCoords.y * ${n[1]}.0);
          }
        `,new Y(s)):n[1]===1?(s=`
          int getOutputCoords() {
            return 2 * int(TexCoords.x * ${n[0]}.0);
          }
        `,new Y(s)):(s=`
        int getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                 vec2(${n[0]}, ${n[1]}));
          return 2 * (resTexRC.y * ${n[0]} + resTexRC.x);
        }
      `,new Y(s))}getOutputPacked2DCoords(e,t){let n="";if(Dn.arraysEqual(e,t))return n=`
        ivec2 getOutputCoords() {
          return 2 * ivec2(TexCoords.xy * vec2(${t[0]}, ${t[1]}));
        }
      `,new Y(n);let s=t,u=Math.ceil(e[1]/2);return n=`
        ivec2 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${s[0]}, ${s[1]}));

          int index = resTexRC.y * ${s[0]} + resTexRC.x;

          // reverse r and c order for packed texture
          int r = imod(index, ${u}) * 2;
          int c = 2 * (index / ${u});

          return ivec2(r, c);
        }
      `,new Y(n)}getOutputPacked3DCoords(e,t){let n=[t[0],t[1]],s=Math.ceil(e[2]/2),u=s*Math.ceil(e[1]/2),d=`
        ivec3 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${n[0]}, ${n[1]}));
          int index = resTexRC.y * ${n[0]} + resTexRC.x;

          int b = index / ${u};
          index -= b * ${u};

          // reverse r and c order for packed texture
          int r = imod(index, ${s}) * 2;
          int c = 2 * (index / ${s});

          return ivec3(b, r, c);
        }
      `;return new Y(d)}getOutputPackedNDCoords(e,t){let n=[t[0],t[1]],s=Math.ceil(e[e.length-1]/2),u=s*Math.ceil(e[e.length-2]/2),d=u,l="",p="b, r, c";for(let r=2;r<e.length-1;r++)d*=e[e.length-r-1],l=`
      int b${r} = index / ${d};
      index -= b${r} * ${d};
    `+l,p=`b${r}, `+p;let o=`
      ivec${e.length} getOutputCoords() {
        ivec2 resTexRC = ivec2(TexCoords.xy *
                              vec2(${n[0]}, ${n[1]}));
        int index = resTexRC.y * ${n[0]} + resTexRC.x;

        ${l}

        int b = index / ${u};
        index -= b * ${u};

        // reverse r and c order for packed texture
        int r = imod(index, ${s}) * 2;
        int c = 2 * (index / ${s});

        return ivec${e.length}(${p});
      }
    `;return new Y(o)}getOutputUnpacked1DCoords(e,t){let n=`
        int getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          return resTexRC.y * ${t[0]} + resTexRC.x;
        }
      `;return new Y(n)}getOutputUnpacked2DCoords(e,t){let n=`
        ivec2 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          int r = index / ${e[1]};
          int c = index - r * ${e[1]};
          return ivec2(r, c);
        }
      `;return new Y(n)}getOutputUnpacked3DCoords(e,t){let n="",s=e.length,u=null;s<2&&(u=[]),u=new Array(s-1),u[s-2]=e[s-1];for(let p=s-3;p>=0;--p)u[p]=u[p+1]*e[p+1];let d=["r","c","d"],l=u.map((p,o)=>{let r=`int ${d[o]} = index / ${p}`,i=o===u.length-1?`int ${d[o+1]} = index - ${d[o]} * ${p}`:`index -= ${d[o]} * ${p}`;return`${r}; ${i};`}).join("");return n=`
        ivec3 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          ${l}
          return ivec3(r, c, d);
        }
      `,new Y(n)}getOutputUnpacked4DCoords(e,t){let n="",s=e.length,u=null;s<2&&(u=[]),u=new Array(s-1),u[s-2]=e[s-1];for(let p=s-3;p>=0;--p)u[p]=u[p+1]*e[p+1];let d=["r","c","d","d2"],l=u.map((p,o)=>{let r=`int ${d[o]} = index / ${p}`,i=o===u.length-1?`int ${d[o+1]} = index - ${d[o]} * ${p}`:`index -= ${d[o]} * ${p}`;return`${r}; ${i};`}).join("");return n=`
      ivec4 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          ${l}
          return ivec4(r, c, d, d2);
        }
      `,new Y(n)}getOutputUnpacked5DCoords(e,t){let n="",s=e.length,u=null;s<2&&(u=[]),u=new Array(s-1),u[s-2]=e[s-1];for(let p=s-3;p>=0;--p)u[p]=u[p+1]*e[p+1];let d=["r","c","d","d2","d3"],l=u.map((p,o)=>{let r=`int ${d[o]} = index / ${p}`,i=o===u.length-1?`int ${d[o+1]} = index - ${d[o]} * ${p}`:`index -= ${d[o]} * ${p}`;return`${r}; ${i};`}).join("");return n=`
      ivec5 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          ${l}
          return ivec5(r, c, d, d2, d3);
        }
      `,new Y(n)}getOutputUnpacked6DCoords(e,t){let n="",s=e.length,u=null;s<2&&(u=[]),u=new Array(s-1),u[s-2]=e[s-1];for(let p=s-3;p>=0;--p)u[p]=u[p+1]*e[p+1];let d=["r","c","d","d2","d3","d4"],l=u.map((p,o)=>{let r=`int ${d[o]} = index / ${p}`,i=o===u.length-1?`int ${d[o+1]} = index - ${d[o]} * ${p}`:`index -= ${d[o]} * ${p}`;return`${r}; ${i};`}).join("");return n=`
     ivec6 getOutputCoords() {
         ivec2 resTexRC = ivec2(TexCoords.xy *
                               vec2(${t[0]}, ${t[1]}));
         int index = resTexRC.y * ${t[0]} + resTexRC.x;
         ${l}
         return ivec6(r, c, d, d2, d3, d4);
       }
     `,new Y(n)}getCommonUtilFuncs(){let e={},t="uvFromFlat";e[t]=new Y(`
    vec2 uvFromFlat(int texNumR, int texNumC, int index) {
      int texC = index / texNumR;
      int texR = index - texC * texNumR;
      // TODO: swap texR, texC order in following function so row is corresponding to u and column is corresponding to
      //       v.
      return (vec2(texR, texC) + halfCR) / vec2(texNumR, texNumC);
    }
    `),t="packedUVfrom1D",e[t]=new Y(`
      vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
        int texelIndex = index / 2;
        int texR = texelIndex / texNumC;
        int texC = texelIndex - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `),t="packedUVfrom2D",e[t]=new Y(`
      vec2 packedUVfrom2D(int texNumR, int texNumC, int texelsInLogicalRow, int row, int col) {
        int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
        int texR = texelIndex / texNumC;
        int texC = texelIndex - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `),t="packedUVfrom3D",e[t]=new Y(`
      vec2 packedUVfrom3D(int texNumR, int texNumC,
          int texelsInBatch, int texelsInLogicalRow, int b,
          int row, int col) {
        int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
        int texR = index / texNumC;
        int texC = index - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `),t="sampleTexture";let n=we(this.context.glContext.version);return e[t]=new Y(`
        float sampleTexture(sampler2D textureSampler, vec2 uv) {
            return ${n.texture2D}(textureSampler, uv).r;
        }`),e}getInputsSamplingSnippets(){let e={},t=this.context.outputTextureLayout;return this.context.programInfo.inputNames.forEach((n,s)=>{let u=this.context.inputTextureLayouts[s],d=No(n);u.isPacked?e[d]=this.getPackedSamplerFromInput(d,n,u):e[d]=this.getUnpackedSamplerFromInput(d,n,u);let l=Q$(n);u.unpackedShape.length<=t.unpackedShape.length&&(u.isPacked?e[l]=this.getPackedSamplerAtOutputCoords(l,u,t,n):e[l]=this.getUnpackedSamplerAtOutputCoords(l,u,t,n))}),e}getPackedSamplerAtOutputCoords(e,t,n,s){let u=t.unpackedShape,d=n.unpackedShape,l=No(s),p=u.length,o=d.length,r=Mt.getBroadcastDims(u,d),i=ar(o),a=o-p,c,h=nn();p===0?c="":o<2&&r.length>=1?c="coords = 0;":c=r.map(I=>`coords.${h[I+a]} = 0;`).join(`
`);let g="";o<2&&p>0?g="coords":g=u.map((I,E)=>`coords.${h[E+a]}`).join(", ");let b="return outputValue;",x=pe.size(u)===1,$=pe.size(d)===1;if(p===1&&!x&&!$)b=`
        return vec4(outputValue.xy, outputValue.xy);
      `;else if(x&&!$)o===1?b=`
          return vec4(outputValue.x, outputValue.x, 0., 0.);
        `:b=`
          return vec4(outputValue.x);
        `;else if(r.length){let I=p-2,E=p-1;r.indexOf(I)>-1&&r.indexOf(E)>-1?b="return vec4(outputValue.x);":r.indexOf(I)>-1?b="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":r.indexOf(E)>-1&&(b="return vec4(outputValue.xx, outputValue.zz);")}let _=`
        int lastDim = coords.${h[o-1]};
        coords.${h[o-1]} = coords.${h[o-2]};
        coords.${h[o-2]} = lastDim;
      `,O=`
      vec4 ${e}() {
        ${i} coords = getOutputCoords();
        ${_}
        ${c}
        vec4 outputValue = ${l}(${g});
        ${b}
      }
    `;return new Y(O,["coordinates.getOutputCoords"])}getUnpackedSamplerAtOutputCoords(e,t,n,s){let u=[n.width,n.height],d=[t.width,t.height],l=t.unpackedShape.length,p=n.unpackedShape.length,o=t.unpackedShape,r=n.unpackedShape,i=No(s);if(l===p&&Dn.arraysEqual(d,u)){let _=`
          float ${e}() {
            return sampleTexture(${s}, TexCoords);
          }
        `;return new Y(_,["coordinates.sampleTexture"])}let a=ar(p),c=Mt.getBroadcastDims(o,r),h=p-l,g,b=nn();l===0?g="":p<2&&c.length>=1?g="coords = 0;":g=c.map(_=>`coords.${b[_+h]} = 0;`).join(`
`);let x="";p<2&&l>0?x="coords":x=t.unpackedShape.map((_,O)=>`coords.${b[O+h]}`).join(", ");let $=`
        float ${e}() {
          ${a} coords = getOutputCoords();
          ${g}
          return ${i}(${x});
        }
      `;return new Y($,["coordinates.getOutputCoords"])}getPackedSamplerFromInput(e,t,n){switch(n.unpackedShape.length){case 0:return this.getPackedSamplerScalar(e,t);case 1:return this.getPackedSampler1D(e,t,n);case 2:return this.getPackedSampler2D(e,t,n);case 3:return this.getPackedSampler3D(e,t,n);default:return this.getPackedSamplerND(e,t,n)}}getUnpackedSamplerFromInput(e,t,n){let s=n.unpackedShape;switch(s.length){case 0:return this.getUnpackedSamplerScalar(e,t,n);case 1:return this.getUnpackedSampler1D(e,t,n);case 2:return this.getUnpackedSampler2D(e,t,n);case 3:return this.getUnpackedSampler3D(e,t,n);case 4:return this.getUnpackedSampler4D(e,t,n);case 5:return this.getUnpackedSampler5D(e,t,n);case 6:return this.getUnpackedSampler6D(e,t,n);default:throw new Error(`Unsupported dimension ${s.length}-D`)}}getPackedSamplerScalar(e,t){let n=we(this.context.glContext.version),s=`
          vec4 ${e}() {
            return ${n.texture2D}(${t}, halfCR);
          }
        `;return new Y(s)}getPackedSampler1D(e,t,n){let s=[n.width,n.height],u=[s[1],s[0]],d=we(this.context.glContext.version),l=`vec4 ${e}(int index) {
      vec2 uv = packedUVfrom1D(
      ${u[0]}, ${u[1]}, index);
      return ${d.texture2D}(${t}, uv);
    }`;return new Y(l,["coordinates.packedUVfrom1D"])}getPackedSampler2D(e,t,n){let s=n.unpackedShape,u=[n.width,n.height],d=we(this.context.glContext.version),l=u[0],p=u[1];if(u!=null&&Dn.arraysEqual(s,u)){let a=`vec4 ${e}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${p}.0, ${l}.0);
        return ${d.texture2D}(${t}, uv);
      }`;return new Y(a)}let o=u,r=Math.ceil(s[1]/2),i=`vec4 ${e}(int row, int col) {
      vec2 uv = packedUVfrom2D(${o[1]}, ${o[0]}, ${r}, row, col);
      return ${d.texture2D}(${t}, uv);
    }`;return new Y(i,["coordinates.packedUVfrom2D"])}getPackedSampler3D(e,t,n){let s=n.unpackedShape,u=[n.width,n.height],d=[u[0],u[1]],l=we(this.context.glContext.version);if(s[0]===1){let c=s.slice(1),h=[1,2],g=bn(s,c),b=["b","row","col"],x=JSON.parse(JSON.stringify(n));x.unpackedShape=g;let $=this.getPackedSamplerFromInput(e,t,x),_=`${$.routineBody}
      vec4 ${e}(int b, int row, int col) {
        return ${e}(${yn(b,h)});
      } `;return new Y(_,$.dependencies)}let p=d[0],o=d[1],r=Math.ceil(s[2]/2),i=r*Math.ceil(s[1]/2),a=`vec4 ${e}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${o}, ${p}, ${i}, ${r}, b, row, col);
      return ${l.texture2D}(${t}, uv);}`;return new Y(a,["coordinates.packedUVfrom3D"])}getPackedSamplerND(e,t,n){let s=n.unpackedShape,u=s.length,d=[n.width,n.height],l=we(this.context.glContext.version),p=[d[0],d[1]],o=p[1],r=p[0],i=Math.ceil(s[u-1]/2),a=i*Math.ceil(s[u-2]/2),c="int b, int row, int col",h=`b * ${a} + (row / 2) * ${i} + (col / 2)`;for(let b=2;b<u-1;b++)c=`int b${b}, `+c,a*=s[u-b-1],h=`b${b} * ${a} + `+h;let g=`vec4 ${e}(${c}) {
      int index = ${h};
      int texR = index / ${r};
      int texC = index - texR * ${r};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${r}, ${o});
      return ${l.texture2D}(${t}, uv);
    }`;return new Y(g)}getUnpackedSamplerScalar(e,t,n){let[s,u]=[n.width,n.height];if(s===1&&u===1){let l=`
          float ${e}() {
            return sampleTexture(${t}, halfCR);
          }
        `;return new Y(l,["coordinates.sampleTexture"])}let d=`
        float ${e}() {
          int offset_${t} = coordsToOffset(TexCoords, ${s}, ${u});
          vec2 uv = uvFromFlat(${s}, ${u}, offset_${t});
          return sampleTexture(${t}, uv);
        }
      `;return new Y(d,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler1D(e,t,n){let s=n.width,u=n.height;if(u===1&&s===1){let l=`
        float ${e}(int index) {
          return sampleTexture(${t}, halfCR);
        }
      `;return new Y(l,["coordinates.sampleTexture"])}if(u===1){let l=`
          float ${e}(int index) {
            vec2 uv = vec2((float(index) + 0.5) / ${s}.0, 0.5);
            return sampleTexture(${t}, uv);
          }
        `;return new Y(l,["coordinates.sampleTexture"])}if(s===1){let l=`
          float ${e}(int index) {
            vec2 uv = vec2(0.5, (float(index) + 0.5) / ${u}.0);
            return sampleTexture(${t}, uv);
          }
        `;return new Y(l,["coordinates.sampleTexture"])}let d=`
        float ${e}(int index) {
          vec2 uv = uvFromFlat(${s}, ${u}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new Y(d,["coordinates.uvFromFlat","coordinates.sampleTexture"])}getUnpackedSampler2D(e,t,n){let s=n.unpackedShape,u=[n.height,n.width];if(u!=null&&Dn.arraysEqual(s,u)){let a=u[1],c=u[0],h=`
          float ${e}(int row, int col) {
            vec2 uv = (vec2(row, col) + halfCR) / vec2(${a}.0, ${c}.0);
            return sampleTexture(${t}, uv);
          }
        `;return new Y(h,["coordinates.sampleTexture"])}let{newShape:d,keptDims:l}=zn(s),p=d;if(p.length<s.length){let a=bn(s,p),c=JSON.parse(JSON.stringify(n));c.unpackedShape=a;let h=["col","row"],g=`
          ${this.getUnpackedSamplerFromInput(e,t,c).routineBody}
          float ${e}(int row, int col) {
            return ${e}(${yn(h,l)});
          }
        `;return new Y(g,["coordinates.sampleTexture"])}let o=u[1],r=u[0];if(r===1){let a=`
          float ${e}(int row, int col) {
            int offset_${t} = coordsToOffset(TexCoords, ${o}, ${r});
            float index = dot(vec3(row, col, offset_${t}), vec3(${s[1]}, 1, 1));
            vec2 uv = vec2(0.5, (index + 0.5) / ${o}.0);
            return sampleTexture(${t}, uv);
          }
        `;return new Y(a,["coordinates.sampleTexture","coordinates.coordsToOffset"])}if(o===1){let a=`
          float ${e}(int row, int col) {
            int offset_${t} = coordsToOffset(TexCoords, ${o}, ${r});
            float index = dot(vec3(row, col, offset_${t}), vec3(${s[1]}, 1, 1));
            vec2 uv = vec2((index + 0.5) / ${r}.0, 0.5);
            return sampleTexture(${t}, uv);
          }
        `;return new Y(a,["coordinates.sampleTexture","coordinates.coordsToOffset"])}let i=`
        float ${e}(int row, int col) {
          int index = col * ${s[1]} + row;
          vec2 uv = uvFromFlat(${o}, ${r}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new Y(i,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler3D(e,t,n){let s=n.unpackedShape,u=s[1]*s[2],d=s[2],{newShape:l,keptDims:p}=zn(s),o=l;if(o.length<s.length){let c=bn(s,o),h=["batch","col","row"],g=JSON.parse(JSON.stringify(n));g.unpackedShape=c;let b=this.getUnpackedSamplerFromInput(e,t,g),x=p.reverse(),$=`
          ${b.routineBody}
          float ${e}(int batch, int row, int col) {
            return ${e}(${yn(h,x)});
          }
        `;return new Y($,b.dependencies)}let r=n.width,i=n.height,a=`
          float ${e}(int depth, int row, int col) {
            // Explicitly use integer operations as dot() only works on floats.
            int index = depth * ${u} + col * ${d} + row;
            vec2 uv = uvFromFlat(${r}, ${i}, index);
            return sampleTexture(${t}, uv);
          }
      `;return new Y(a,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler4D(e,t,n){let s=n.unpackedShape,u=s[3],d=s[2]*u,l=s[1]*d,p=n.width,o=n.height,r=`
        float ${e}(int row, int col, int depth, int depth2) {
          int index = row * ${l} + col * ${d} +
              depth2 * ${u} + depth;
          vec2 uv = uvFromFlat(${p}, ${o}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new Y(r,["coordinates.uvFromFlat","coordinates.sampleTexture"])}getUnpackedSampler5D(e,t,n){let s=n.unpackedShape,u=s[4],d=s[3]*u,l=s[2]*d,p=s[1]*l,{newShape:o,keptDims:r}=zn(s);if(o.length<s.length){let h=bn(s,o),g=["row","col","depth","depth2","depth3"],b=JSON.parse(JSON.stringify(n));b.unpackedShape=h;let x=`
          ${this.getUnpackedSamplerFromInput(e,t,b).routineBody}
          float ${e}(int row, int col, int depth, int depth2, int depth3) {
            return ${e}(${yn(g,r)});
          }
        `;return new Y(x,["coordinates.sampleTexture","coordinates.uvFromFlat"])}let i=n.width,a=n.height,c=`
        float ${e}(int row, int col, int depth, int depth2, int depth3) {
          int index = row * ${p} + col * ${l} + depth * ${d} +
          depth3 * ${u} + depth2;
          vec2 uv = uvFromFlat(${i}, ${a}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new Y(c,["coordinates.sampleTexture","coordinates.uvFromFlat"])}getUnpackedSampler6D(e,t,n){let s=n.unpackedShape,u=s[5],d=s[4]*u,l=s[3]*d,p=s[2]*l,o=s[1]*p,{newShape:r,keptDims:i}=zn(s);if(r.length<s.length){let g=bn(s,r),b=["row","col","depth","depth2","depth3","depth4"],x=JSON.parse(JSON.stringify(n));x.unpackedShape=g;let $=`
            ${this.getUnpackedSamplerFromInput(e,t,x).routineBody}
            float ${e}(int row, int col, int depth,
              int depth2, int depth3, int depth4) {
              return ${e}(${yn(b,i)});
            }
          `;return new Y($,["coordinates.sampleTexture","coordinates.uvFromFlat"])}let a=n.width,c=n.height,h=`
          float ${e}(int row, int col, int depth,
            int depth2, int depth3, int depth4) {
            int index = row * ${o} + col * ${p} + depth * ${l} +
            depth2 * ${d} + depth3 * ${u} + depth4;
            vec2 uv = uvFromFlat(${a}, ${c}, index);
            return sampleTexture(${t}, uv);
          }
        `;return new Y(h,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}toVec(){let e=this.context.outputTextureLayout,t=e.shape.length,n=e.strides,s=e.width,u=e.height,d=[];for(let p=0;p<t-1;++p)d.push(`
        c[${p}] = offset / ${n[p]};`),d.push(`
        offset -= c[${p}] * ${n[p]};`);d.push(`
        c[${t-1}] = offset;`);let l=`
      void toVec(vec2 texCoords, out int c[${t}]) {
        int offset = coordsToOffset(texCoords, ${s}, ${u});
        ${d.join("")}
      }
      void toVec(int offset, out int c[${t}]) {
        ${d.join("")}
      }
    `;return{toVec:new Y(l,["coordinates.coordsToOffset"])}}valueFrom(){let e={};return this.context.programInfo.inputNames.forEach((t,n)=>{let s=this.context.inputTextureLayouts[n],u=(s.unpackedShape.length>0?s.unpackedShape:s.shape).length,d=`_${t}`;e[d]=new Y(this.getValueFromSingle(t,u,s.width,s.height,!1),[`shapeUtils.indicesToOffset${d}`,"coordinates.offsetToCoords","fragcolor.getColorAsFloat"]),d=d+"_T",e[d]=new Y(this.getValueFromSingle(t,u,s.width,s.height,!0),[`shapeUtils.indicesToOffset${d}`,"coordinates.offsetToCoords","fragcolor.getColorAsFloat"])}),e}getValueFromSingle(e,t,n,s,u){let d=`_${e}`;u&&(d=d+"_T");let l=we(this.context.glContext.version);return`
        float ${d}(int m[${t}]) {
          int offset = indicesToOffset${d}(m);
          vec2 coords = offsetToCoords(offset, ${n}, ${s});
          float value = getColorAsFloat(${l.texture2D}(${e}, coords));
          return value;
        }
        `}getPackedValueFrom(e,t,n,s,u){let d=`_${e}_Pack`;u&&(d=d+"_T");let l=we(this.context.glContext.version);return`
        vec4 ${d}(int m[${t}]) {
          int offset = indicesToOffset_${e}(m);
          vec2 coords = offsetToCoords(offset, ${n}, ${s});
          return ${l.texture2D}(${e}, coords);
        }
        `}}}),f_,k3=C(()=>{ur(),f_=class Rs extends ln{constructor(t){super(t)}getFunctions(){return{...this.encodeFloat32(),...this.decodeFloat32()}}getCustomTypes(){return{}}encodeFloat32(){return{encode:new Y(`highp vec4 encode(highp float f) {
        return vec4(f, 0.0, 0.0, 0.0);
      }
        `)}}decodeFloat32(){return{decode:new Y(`highp float decode(highp vec4 rgba) {
        return rgba.r;
      }
        `)}}encodeUint8(){let t=Rs.isLittleEndian()?"rgba.rgba=rgba.abgr;":"";return{encode:new Y(`
      highp vec4 encode(highp float f) {
        highp float F = abs(f);
        highp float Sign = step(0.0,-f);
        highp float Exponent = floor(log2(F));
        highp float Mantissa = (exp2(- Exponent) * F);
        Exponent = floor(log2(F) + 127.0) + floor(log2(Mantissa));
        highp vec4 rgba;
        rgba[0] = 128.0 * Sign  + floor(Exponent*exp2(-1.0));
        rgba[1] = 128.0 * mod(Exponent,2.0) + mod(floor(Mantissa*128.0),128.0);
        rgba[2] = floor(mod(floor(Mantissa*exp2(23.0 -8.0)),exp2(8.0)));
        rgba[3] = floor(exp2(23.0)*mod(Mantissa,exp2(-15.0)));
        ${t}
        rgba = rgba / 255.0; // values need to be normalized to [0,1]
        return rgba;
    }
        `)}}decodeUint8(){let t=Rs.isLittleEndian()?"rgba.rgba=rgba.abgr;":"";return{decode:new Y(`
        highp float decode(highp vec4 rgba) {
          rgba = rgba * 255.0; // values need to be de-normalized from [0,1] to [0,255]
          ${t}
          highp float Sign = 1.0 - step(128.0,rgba[0])*2.0;
          highp float Exponent = 2.0 * mod(rgba[0],128.0) + step(128.0,rgba[1]) - 127.0;
          highp float Mantissa = mod(rgba[1],128.0)*65536.0 + rgba[2]*256.0 +rgba[3] + float(0x800000);
          highp float Result =  Sign * exp2(Exponent) * (Mantissa * exp2(-23.0 ));
          return Result;
      }
        `)}}static isLittleEndian(){let t=new ArrayBuffer(4),n=new Uint32Array(t),s=new Uint8Array(t);if(n[0]=3735928559,s[0]===239)return!0;if(s[0]===222)return!1;throw new Error("unknown endianness")}}}),g_,D3=C(()=>{ur(),Le(),g_=class extends ln{constructor(e){super(e)}getFunctions(){return{...this.setFragColor(),...this.getColorAsFloat()}}getCustomTypes(){return{}}setFragColor(){let e=we(this.context.glContext.version);return{setFragColor:new Y(`
        void setFragColor(float value) {
            ${e.output} = encode(value);
        }
        `,["encoding.encode"])}}getColorAsFloat(){return{getColorAsFloat:new Y(`
        float getColorAsFloat(vec4 color) {
            return decode(color);
        }
        `,["encoding.decode"])}}}}),m_,N3=C(()=>{ur(),m_=class Rn extends ln{constructor(t){super(t)}getFunctions(){return{...this.bcastIndex(),...this.bcastMatmulIndex(),...this.offsetToIndices(),...this.indicesToOffset(),...this.incrementIndices()}}getCustomTypes(){return{}}bcastIndex(){let t=this.context.outputTextureLayout.shape.length,n={};return this.context.programInfo.inputNames.forEach((s,u)=>{let d=this.context.inputTextureLayouts[u].unpackedShape;if(d.length<=t){let l=d.length,p=t-l,o=`bcastIndices_${s}`,r="";for(let a=0;a<l;++a)r+=`
          realIndices[${a}] = int( mod(float(bcastedIndices[${p+a}]), ${d[a]}.0) );
          `;let i=`
        void ${o} (int bcastedIndices[${t}], out int realIndices[${l}]) {
          ${r}
        }
        `;n[o]=new Y(i)}}),n}bcastMatmulIndex(){let t=this.context.outputTextureLayout.shape.length,n={};return this.context.programInfo.inputNames.forEach((s,u)=>{let d=this.context.inputTextureLayouts[u].shape;if(!(d.length<2||d.length>t)){let l=d.length,p=t-l,o=`bcastMatmulIndices_${s}`,r="";for(let a=0;a<l-2;++a)r+=`
          realIndices[${a}] = int( mod(float(bcastedIndices[${p+a}]), ${d[a]}.0) );
          `;let i=`
        void ${o}(int bcastedIndices[${t}], out int realIndices[${l}]) {
          ${r}
          realIndices[${l-1}] = bcastedIndices[${t-1}];
          realIndices[${l-2}] = bcastedIndices[${t-2}];
        }
        `;n[o]=new Y(i)}}),n}indicesToOffset(){let t={};return this.context.programInfo.inputNames.forEach((n,s)=>{let u=this.context.inputTextureLayouts[s].shape,d=this.context.inputTextureLayouts[s].strides,l=u.length,p=`indicesToOffset_${n}`;t[p]=new Y(Rn.indexToOffsetSingle(p,l,d)),p=`indicesToOffset_${n}_T`,t[p]=new Y(Rn.indexToOffsetSingle(p,l,d.slice().reverse()))}),t}static indexToOffsetSingle(t,n,s){let u="";for(let d=n-1;d>=0;--d)u+=`
        offset += indices[${d}] * ${s[d]};
        `;return`
      int ${t}(int indices[${n}]) {
        int offset = 0;
        ${u}
        return offset;
      }
      `}offsetToIndices(){let t={};return this.context.programInfo.inputNames.forEach((n,s)=>{let u=this.context.inputTextureLayouts[s].shape,d=this.context.inputTextureLayouts[s].strides,l=u.length,p=`offsetToIndices_${n}`;t[p]=new Y(Rn.offsetToIndicesSingle(p,l,d)),p=`offsetToIndices_${n}_T`,t[p]=new Y(Rn.offsetToIndicesSingle(p,l,d.slice().reverse()))}),t}static offsetToIndicesSingle(t,n,s){let u=[];for(let d=0;d<n-1;++d)u.push(`
      indices[${d}] = offset / ${s[d]};`),u.push(`
        offset -= indices[${d}] * ${s[d]};`);return u.push(`
      indices[${n-1}] = offset;`),`
      void ${t}(int offset, out int indices[${n}]) {
        ${u.join("")}
      }
      `}incrementIndices(){let t={};return this.context.programInfo.inputNames.forEach((n,s)=>{let u=this.context.inputTextureLayouts[s].shape,d=u.length,l=`incrementIndices_${n}`,p="";for(let r=0;r<d;++r)p+=`
        shape[${r}] = ${u[r]};`;let o=`
        void ${l}(int axis, out int indices[${d}]) {
          int shape[${d}];
          ${p};
          for(int i = ${d} -1 ; i >= 0; --i) {
            if(i > axis) continue;
            indices[i] += 1;
            if(indices[i] < shape[i]) {
              break;
            }
            indices[i] = 0;
          }
        }
        `;t[l]=new Y(o)}),t}}}),b_,C3=C(()=>{ur(),b_=class extends ln{constructor(e){super(e)}getCustomTypes(){return{}}getFunctions(){return{...this.binaryVecFunctions(),...this.copyVec(),...this.setVecItem(),...this.getVecItem()}}binaryVecFunctions(){let e=this.context.outputTextureLayout.shape.length,t={add:"+=",sub:"-=",mul:"*=",div:"/="},n={};for(let s in t){let u=`${s}Vec`,d="";for(let p=0;p<e;++p)d+=`
          dest[${p}] ${t[s]} src[${p}];
          `;let l=`
        void ${u}(int src[${e}], out int dest[${e}]) {
          ${d}
        }
        `;n[u]=new Y(l)}return n}copyVec(){let e=this.context.outputTextureLayout.shape.length,t="";for(let s=0;s<e;++s)t+=`
        dest[${s}] = src[${s}];
        `;let n=`
      void copyVec(int src[${e}], out int dest[${e}]) {
        ${t}
      }
      `;return{copyVec:new Y(n)}}setVecItem(){let e=this.context.outputTextureLayout.shape.length,t=`
        if(index < 0)
            index =${e} + index;
        if (index == 0)
            m[0] = value;
        `;for(let s=1;s<e-1;++s)t+=`
        else if (index == ${s})
            m[${s}] = value;
            `;t+=`
        else
            m[${e-1}] = value;
        `;let n=`
      void setVecItem(out int m[${e}], int index, int value) {
        ${t}
      }
        `;return{setVecItem:new Y(n)}}getVecItem(){let e=this.context.outputTextureLayout.shape.length,t=`
        if(index < 0)
            index = ${e} + index;
        if (index == 0)
            return m[0];
      `;for(let s=1;s<e-1;++s)t+=`
        else if (index == ${s})
            return m[${s}];
      `;t+=`
        else
            return m[${e-1}];
        `;let n=`
      int getVecItem(int m[${e}], int index) {
        ${t}
      }
    `;return{getVecItem:new Y(n)}}}}),Bs,z3=C(()=>{A3(),k3(),D3(),N3(),C3(),Bs={encoding:f_,fragcolor:g_,vec:b_,shapeUtils:m_,coordinates:h_}}),y_,R3=C(()=>{ur(),E3(),z3(),Le(),y_=class{constructor(e,t,n,s){this.libs={},this.glslLibRoutineDependencyGraph={},this.context=new ny(e,t,n,s),Object.keys(Bs).forEach(d=>{let l=new Bs[d](this.context);this.libs[d]=l});let u=this.glslLibRoutineDependencyGraph;for(let d in this.libs){let l=this.libs[d].getFunctions();for(let p in l){let o=d+"."+p,r;u[o]?(r=u[o],r.routineBody=l[p].routineBody):(r=new xs(o,l[p].routineBody),u[o]=r);let i=l[p].dependencies;if(i)for(let a=0;a<i.length;++a)if(u[i[a]])r.addDependency(u[i[a]]);else{let c=new xs(i[a]);u[i[a]]=c,r.addDependency(c)}}}}preprocess(){let e=this.context.programInfo,t=e.shaderSource;return this.context.programInfo.hasMain||(t=`${t}
      ${J$(this.context.glContext.version,this.context.outputTextureLayout.shape.length)}`),t=O3(t),`${Z$(this.context.glContext.version)}
    ${this.getUniforms(e.inputNames,e.variables)}
    ${this.getImports(t)}
    ${t}`}getImports(e){let t=this.selectGlslLibRoutinesToBeIncluded(e);if(t.length===0)return"";let n="";for(let s=0;s<t.length;++s)if(t[s].routineBody)n+=t[s].routineBody+`
`;else throw new Error(`Missing body for the Glsl Library routine: ${t[s].name}`);return n}selectGlslLibRoutinesToBeIncluded(e){let t=[];return Object.keys(this.glslLibRoutineDependencyGraph).forEach(n=>{let s=n.split(".")[1];e.indexOf(s)!==-1&&t.push(this.glslLibRoutineDependencyGraph[n])}),iy.returnOrderedNodes(t)}getUniforms(e,t){let n=[];if(e)for(let s of e)n.push(`uniform sampler2D ${s};`);if(t)for(let s of t)n.push(`uniform ${s.type} ${s.name}${s.arrayLength?`[${s.arrayLength}]`:""};`);return n.join(`
`)}}}),__,B3=C(()=>{et(),Pt(),R3(),Le(),__=class{constructor(e,t,n){this.profiler=e,this.glContext=t,this.textureLayoutStrategy=n,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,n){this.profiler.event("op",`ProgramManager.run ${e.programInfo.name??"unknown kernel"}`,()=>{let s=this.glContext.gl,u=e.program;s.useProgram(u);try{this.bindOutput(n),this.attributesBound||this.bindAttributes(e.attribLocations),this.bindUniforms(e.uniformLocations,e.programInfo.variables??[],t)}catch(d){throw qe.error("ProgramManager",e.programInfo.shaderSource),d}this.profiler.event("backend","GlContext.draw()",()=>{this.glContext.draw()})},this.glContext)}dispose(){this.vertexShader&&this.glContext.deleteShader(this.vertexShader),this.repo.forEach(e=>this.glContext.deleteProgram(e.program))}build(e,t,n){return this.profiler.event("backend","ProgramManager.build",()=>{let s=new y_(this.glContext,e,t,n),u=s.preprocess(),d=this.compile(u);return{programInfo:e,program:d,uniformLocations:this.getUniformLocations(d,s.context.programInfo.inputNames,s.context.programInfo.variables),attribLocations:this.getAttribLocations(d)}})}compile(e){if(!this.vertexShader){qe.verbose("ProrgramManager","Compiling and caching Vertex shader for the first time");let s=X$(this.glContext.version);this.vertexShader=this.glContext.compileShader(s,this.glContext.gl.VERTEX_SHADER)}he.debug&&qe.verbose("ProrgramManager",`FragShader:
${e}
`);let t=this.glContext.compileShader(e,this.glContext.gl.FRAGMENT_SHADER),n=this.glContext.createProgram(this.vertexShader,t);return this.glContext.deleteShader(t),n}bindOutput(e){let t=e.width,n=e.height;qe.verbose("ProrgramManager",`Binding output texture to Framebuffer: w/h=${t}/${n}, shape=${e.shape}, type=${e.tensor.type}`),this.glContext.attachFramebuffer(e.texture,t,n)}bindAttributes(e){let t=e.position,n=e.textureCoord;this.glContext.setVertexAttributes(t,n),this.attributesBound=!0}bindUniforms(e,t,n){let s=this.glContext.gl,u=0;for(let{name:d,type:l,location:p,arrayLength:o}of e){let r=t.find(i=>i.name===d)?.data;if(l!=="sampler2D"&&!r)throw new Error(`variable '${d}' does not have data defined in program info`);switch(l){case"sampler2D":this.bindTexture(n[u],p,u),u++;break;case"float":o?s.uniform1fv(p,r):s.uniform1f(p,r);break;case"int":o?s.uniform1iv(p,r):s.uniform1i(p,r);break;default:throw new Error(`Uniform not implemented: ${l}`)}}}bindTexture(e,t,n){this.glContext.bindTextureToUniform(e.texture,n,t)}getAttribLocations(e){return{position:this.getAttribLocation(e,"position"),textureCoord:this.getAttribLocation(e,"textureCoord")}}getUniformLocations(e,t,n){let s=[];if(t)for(let u of t)s.push({name:u,type:"sampler2D",location:this.getUniformLocation(e,u)});if(n)for(let u of n)s.push({...u,location:this.getUniformLocation(e,u.name)});return s}getUniformLocation(e,t){let n=this.glContext.gl.getUniformLocation(e,t);if(n===null)throw new Error(`Uniform ${t} not found.`);return n}getAttribLocation(e,t){return this.glContext.gl.getAttribLocation(e,t)}}}),v_,M3=C(()=>{Pt(),Ri(),v_=class{constructor(e,t,n,s){this.glContext=e,this.layoutStrategy=t,this.profiler=n,this.config=s,this.pendingRead=new Map,s.reuseTextures&&(this.inUseTextures=new Map,this.idleTextures=new Map,this.textureLookup=new Map)}createTextureFromLayout(e,t,n,s){let u=this.toEncoderType(e),d=this.glContext.getEncoder(u,t.channels||1,s);if(t.isPacked&&s===1)throw new Error("not implemented");let l=t.width,p=t.height,o,r;if(this.config.reuseTextures){o=`${l}x${p}_${d.format}_${d.internalFormat}_${d.textureType}`,r=this.inUseTextures.get(o),r||(r=[],this.inUseTextures.set(o,r));let a=this.idleTextures.get(o);if(a&&a.length>0){let c=a.pop();return r.push(c),s===1&&this.glContext.updateTexture(c,l,p,d,this.toTextureData(e,n)),c}}qe.verbose("TextureManager",`Creating new texture of size ${t.width}x${t.height}`);let i=this.glContext.allocateTexture(l,p,d,this.toTextureData(e,n));return this.config.reuseTextures&&(r.push(i),this.textureLookup.set(i,o)),i}readTexture(e,t,n){return n||(n=1),this.profiler.event("backend","TextureManager.readTexture",()=>{let s=e.shape.reduce((d,l)=>d*l)*n,u=this.glContext.readTexture(e.texture,e.width,e.height,s,this.toEncoderType(t),n);return this.toTensorData(t,u)})}async readTextureAsync(e,t,n){let s=e.tensor.dataId;if(n||(n=1),this.pendingRead.has(s)){let u=this.pendingRead.get(s);return new Promise(d=>u?.push(d))}return this.profiler.event("backend","TextureManager.readTextureAsync",async()=>{this.pendingRead.set(s,[]);let u=e.shape.reduce((o,r)=>o*r)*n;await this.glContext.createAndWaitForFence();let d=this.glContext.readTexture(e.texture,e.width,e.height,u,this.toEncoderType(t),n),l=this.toTensorData(t,d),p=this.pendingRead.get(s);return this.pendingRead.delete(s),p?.forEach(o=>o(l)),l})}readUint8TextureAsFloat(e){return this.profiler.event("backend","TextureManager.readUint8TextureAsFloat",()=>{let t=e.shape.reduce((s,u)=>s*u),n=this.glContext.readTexture(e.texture,e.width,e.height,t*4,"byte",4);return new Float32Array(n.buffer,n.byteOffset,t)})}releaseTexture(e,t){let n;if(this.config.reuseTextures&&(n=this.textureLookup.get(e.texture),n)){t&&this.textureLookup.delete(n);let s=this.inUseTextures.get(n);if(s){let u=s.indexOf(e.texture);if(u!==-1){s.splice(u,1);let d=this.idleTextures.get(n);d||(d=[],this.idleTextures.set(n,d)),d.push(e.texture)}}}(!n||t)&&(qe.verbose("TextureManager",`Deleting texture of size ${e.width}x${e.height}`),this.glContext.deleteTexture(e.texture))}toTensorData(e,t){switch(e){case"int16":return t instanceof Int16Array?t:Int16Array.from(t);case"int32":return t instanceof Int32Array?t:Int32Array.from(t);case"int8":return t instanceof Int8Array?t:Int8Array.from(t);case"uint16":return t instanceof Uint16Array?t:Uint16Array.from(t);case"uint32":return t instanceof Uint32Array?t:Uint32Array.from(t);case"uint8":case"bool":return t instanceof Uint8Array?t:Uint8Array.from(t);case"float32":return t instanceof Float32Array?t:Float32Array.from(t);case"float64":return t instanceof Float64Array?t:Float64Array.from(t);default:throw new Error(`TensorData type ${e} is not supported`)}}toTextureData(e,t){if(t)return t instanceof Float32Array?t:new Float32Array(t)}toEncoderType(e){return"float"}clearActiveTextures(){this.glContext.clearActiveTextures()}}}),w_,j3=C(()=>{Pt(),S$(),cT(),I3(),B3(),c_(),M3(),w_=class{constructor(e,t){this.backend=e,this.context=t,this.layoutStrategy=new p_(e.glContext.maxTextureSize),this.programManager=new __(this.context.profiler,e.glContext,this.layoutStrategy),this.textureManager=new v_(e.glContext,this.layoutStrategy,this.context.profiler,{reuseTextures:e.textureCacheMode==="full"}),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache=new Map,this.pack=e.pack,this.pack2unpackMap=new Map,this.unpack2packMap=new Map}createInferenceHandler(){return new ey(this)}onGraphInitialized(e){let t=e.getValues().filter(n=>n.from===-1&&n.tensor).map(n=>n.tensor.dataId);this.initializers=new Set(t)}isInitializer(e){return this.initializers?this.initializers.has(e):!1}addInitializer(e){this.initializers.add(e)}getTextureData(e,t){return t?this.packedTextureDataCache.get(e):this.unpackedTextureDataCache.get(e)}setTextureData(e,t,n=!1){qe.verbose("WebGLSessionHandler","Storing Texture data in cache"),n?this.packedTextureDataCache.set(e,t):this.unpackedTextureDataCache.set(e,t)}dispose(){this.programManager.dispose(),this.textureManager.clearActiveTextures(),this.packedTextureDataCache.forEach(e=>this.textureManager.releaseTexture(e,!0)),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache.forEach(e=>this.textureManager.releaseTexture(e,!0)),this.unpackedTextureDataCache=new Map}resolve(e,t,n){let s=$$(e,t,l_);return{impl:s.opImpl,context:s.opInit?s.opInit(e,n):e}}}});function F3(e){let t=0;for(;t<e.length&&e[t]();++t);return t-1}var Ms,L3=C(()=>{et(),Ri(),Ri(),qt(),Ms=class{constructor(e,t){this.frameBufferBound=!1,this.itemsToPoll=[],this.gl=e,this.version=t,this.getExtensions(),this.vertexbuffer=this.createVertexbuffer(),this.framebuffer=this.createFramebuffer(),this.queryVitalParameters()}allocateTexture(e,t,n,s){let u=this.gl,d=u.createTexture();u.bindTexture(u.TEXTURE_2D,d),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MIN_FILTER,u.NEAREST),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MAG_FILTER,u.NEAREST),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_WRAP_S,u.CLAMP_TO_EDGE),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_WRAP_T,u.CLAMP_TO_EDGE);let l=s?n.encode(s,e*t):null;return u.texImage2D(u.TEXTURE_2D,0,n.internalFormat,e,t,0,n.format,n.textureType,l),this.checkError(),d}updateTexture(e,t,n,s,u){let d=this.gl;d.bindTexture(d.TEXTURE_2D,e);let l=s.encode(u,t*n);d.texSubImage2D(d.TEXTURE_2D,0,0,0,t,n,s.format,s.textureType,l),this.checkError()}attachFramebuffer(e,t,n){let s=this.gl;s.bindTexture(s.TEXTURE_2D,e),s.bindFramebuffer(s.FRAMEBUFFER,this.framebuffer),s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,e,0),this.checkError(),s.viewport(0,0,t,n),s.scissor(0,0,t,n)}readTexture(e,t,n,s,u,d){let l=this.gl;d||(d=1),this.frameBufferBound||this.attachFramebuffer(e,t,n);let p=this.getEncoder(u,d),o=p.allocate(t*n);return l.bindTexture(l.TEXTURE_2D,e),l.framebufferTexture2D(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,e,0),l.readPixels(0,0,t,n,l.RGBA,p.textureType,o),this.checkError(),p.decode(o,s)}isFramebufferReady(){return!0}getActiveTexture(){let e=this.gl;return`TEXTURE${e.getParameter(this.gl.ACTIVE_TEXTURE)-e.TEXTURE0}`}getTextureBinding(){return this.gl.getParameter(this.gl.TEXTURE_BINDING_2D)}getFramebufferBinding(){return this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING)}setVertexAttributes(e,t){let n=this.gl;n.vertexAttribPointer(e,3,n.FLOAT,!1,20,0),n.enableVertexAttribArray(e),t!==-1&&(n.vertexAttribPointer(t,2,n.FLOAT,!1,20,12),n.enableVertexAttribArray(t)),this.checkError()}createProgram(e,t){let n=this.gl,s=n.createProgram();return n.attachShader(s,e),n.attachShader(s,t),n.linkProgram(s),s}compileShader(e,t){let n=this.gl,s=n.createShader(t);if(!s)throw new Error(`createShader() returned null with type ${t}`);if(n.shaderSource(s,e),n.compileShader(s),n.getShaderParameter(s,n.COMPILE_STATUS)===!1)throw new Error(`Failed to compile shader: ${n.getShaderInfoLog(s)}
Shader source:
${e}`);return s}deleteShader(e){this.gl.deleteShader(e)}bindTextureToUniform(e,t,n){let s=this.gl;s.activeTexture(s.TEXTURE0+t),this.checkError(),s.bindTexture(s.TEXTURE_2D,e),this.checkError(),s.uniform1i(n,t),this.checkError()}draw(){this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4),this.checkError()}checkError(){if(he.debug){let e=this.gl,t=e.getError(),n="";switch(t){case e.NO_ERROR:return;case e.INVALID_ENUM:n="INVALID_ENUM";break;case e.INVALID_VALUE:n="INVALID_VALUE";break;case e.INVALID_OPERATION:n="INVALID_OPERATION";break;case e.INVALID_FRAMEBUFFER_OPERATION:n="INVALID_FRAMEBUFFER_OPERATION";break;case e.OUT_OF_MEMORY:n="OUT_OF_MEMORY";break;case e.CONTEXT_LOST_WEBGL:n="CONTEXT_LOST_WEBGL";break;default:n=`Unknown WebGL Error: ${t.toString(16)}`}throw new Error(n)}}deleteTexture(e){this.gl.deleteTexture(e)}deleteProgram(e){this.gl.deleteProgram(e)}getEncoder(e,t,n=0){if(this.version===2)return new Jb(this.gl,t);switch(e){case"float":return n===1||this.isRenderFloat32Supported?new vs(this.gl,t):new vs(this.gl,t,this.textureHalfFloatExtension.HALF_FLOAT_OES);case"int":throw new Error("not implemented");case"byte":return new Qb(this.gl,t);default:throw new Error(`Invalid dataType: ${e}`)}}clearActiveTextures(){let e=this.gl;for(let t=0;t<this.maxTextureImageUnits;++t)e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,null)}dispose(){if(this.disposed)return;let e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(this.framebuffer),e.bindBuffer(e.ARRAY_BUFFER,null),e.deleteBuffer(this.vertexbuffer),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null),e.finish(),this.disposed=!0}createDefaultGeometry(){return new Float32Array([-1,1,0,0,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0])}createVertexbuffer(){let e=this.gl,t=e.createBuffer();if(!t)throw new Error("createBuffer() returned null");let n=this.createDefaultGeometry();return e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,n,e.STATIC_DRAW),this.checkError(),t}createFramebuffer(){let e=this.gl.createFramebuffer();if(!e)throw new Error("createFramebuffer returned null");return e}queryVitalParameters(){let e=this.gl;if(this.isFloatTextureAttachableToFrameBuffer=this.checkFloatTextureAttachableToFrameBuffer(),this.isRenderFloat32Supported=this.checkRenderFloat32(),this.isFloat32DownloadSupported=this.checkFloat32Download(),this.version===1&&!this.textureHalfFloatExtension&&!this.isRenderFloat32Supported)throw new Error("both float32 and float16 TextureType are not supported");this.isBlendSupported=!this.isRenderFloat32Supported||this.checkFloat32Blend(),this.maxTextureSize=e.getParameter(e.MAX_TEXTURE_SIZE),this.maxTextureImageUnits=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),this.version}getExtensions(){this.version===2?(this.colorBufferFloatExtension=this.gl.getExtension("EXT_color_buffer_float"),this.disjointTimerQueryWebgl2Extension=this.gl.getExtension("EXT_disjoint_timer_query_webgl2")):(this.textureFloatExtension=this.gl.getExtension("OES_texture_float"),this.textureHalfFloatExtension=this.gl.getExtension("OES_texture_half_float"))}checkFloatTextureAttachableToFrameBuffer(){let e=this.gl,t=e.createTexture();e.bindTexture(e.TEXTURE_2D,t);let n=this.version===2?e.RGBA32F:e.RGBA;e.texImage2D(e.TEXTURE_2D,0,n,1,1,0,e.RGBA,e.FLOAT,null);let s=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,s),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0);let u=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindTexture(e.TEXTURE_2D,null),e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteTexture(t),e.deleteFramebuffer(s),u}checkRenderFloat32(){if(this.version===2){if(!this.colorBufferFloatExtension)return!1}else if(!this.textureFloatExtension)return!1;return this.isFloatTextureAttachableToFrameBuffer}checkFloat32Download(){if(this.version===2){if(!this.colorBufferFloatExtension)return!1}else if(!this.textureFloatExtension||!this.gl.getExtension("WEBGL_color_buffer_float"))return!1;return this.isFloatTextureAttachableToFrameBuffer}checkFloat32Blend(){let e=this.gl,t,n,s,u,d;try{t=e.createTexture(),n=e.createFramebuffer(),e.bindTexture(e.TEXTURE_2D,t);let l=this.version===2?e.RGBA32F:e.RGBA;return e.texImage2D(e.TEXTURE_2D,0,l,1,1,0,e.RGBA,e.FLOAT,null),e.bindFramebuffer(e.FRAMEBUFFER,n),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0),e.enable(e.BLEND),s=e.createShader(e.VERTEX_SHADER),!s||(e.shaderSource(s,"void main(){}"),e.compileShader(s),u=e.createShader(e.FRAGMENT_SHADER),!u)||(e.shaderSource(u,"precision highp float;void main(){gl_FragColor=vec4(0.5);}"),e.compileShader(u),d=e.createProgram(),!d)?!1:(e.attachShader(d,s),e.attachShader(d,u),e.linkProgram(d),e.useProgram(d),e.drawArrays(e.POINTS,0,1),e.getError()===e.NO_ERROR)}finally{e.disable(e.BLEND),d&&e.deleteProgram(d),s&&e.deleteShader(s),u&&e.deleteShader(u),n&&(e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(n)),t&&(e.bindTexture(e.TEXTURE_2D,null),e.deleteTexture(t))}}beginTimer(){if(this.version===2&&this.disjointTimerQueryWebgl2Extension){let e=this.gl,t=this.disjointTimerQueryWebgl2Extension,n=e.createQuery();return e.beginQuery(t.TIME_ELAPSED_EXT,n),n}else throw new Error("WebGL1 profiling currently not supported.")}endTimer(){if(this.version===2&&this.disjointTimerQueryWebgl2Extension){let e=this.gl,t=this.disjointTimerQueryWebgl2Extension;e.endQuery(t.TIME_ELAPSED_EXT);return}else throw new Error("WebGL1 profiling currently not supported")}isTimerResultAvailable(e){let t=!1,n=!1;if(this.version===2&&this.disjointTimerQueryWebgl2Extension){let s=this.gl,u=this.disjointTimerQueryWebgl2Extension;t=s.getQueryParameter(e,s.QUERY_RESULT_AVAILABLE),n=s.getParameter(u.GPU_DISJOINT_EXT)}else throw new Error("WebGL1 profiling currently not supported");return t&&!n}getTimerResult(e){let t=0;if(this.version===2){let n=this.gl;t=n.getQueryParameter(e,n.QUERY_RESULT),n.deleteQuery(e)}else throw new Error("WebGL1 profiling currently not supported");return t/1e6}async waitForQueryAndGetTime(e){return await Ld(()=>this.isTimerResultAvailable(e)),this.getTimerResult(e)}async createAndWaitForFence(){let e=this.createFence(this.gl);return this.pollFence(e)}createFence(e){let t,n=e,s=n.fenceSync(n.SYNC_GPU_COMMANDS_COMPLETE,0);return e.flush(),s===null?t=()=>!0:t=()=>{let u=n.clientWaitSync(s,0,0);return u===n.ALREADY_SIGNALED||u===n.CONDITION_SATISFIED},{query:s,isFencePassed:t}}async pollFence(e){return new Promise(t=>{this.addItemToPoll(()=>e.isFencePassed(),()=>t())})}pollItems(){let e=F3(this.itemsToPoll.map(t=>t.isDoneFn));for(let t=0;t<=e;++t){let{resolveFn:n}=this.itemsToPoll[t];n()}this.itemsToPoll=this.itemsToPoll.slice(e+1)}async addItemToPoll(e,t){this.itemsToPoll.push({isDoneFn:e,resolveFn:t}),!(this.itemsToPoll.length>1)&&await Ld(()=>(this.pollItems(),this.itemsToPoll.length===0))}}});function x_(e){let t;if((!e||e==="webgl2")&&"webgl2"in Ar?t=Ar.webgl2:(!e||e==="webgl")&&"webgl"in Ar&&(t=Ar.webgl),!t)try{let s=U3();t=qc(s,e)}catch{let s=V3();t=qc(s,e)}e=e||t.version===1?"webgl":"webgl2";let n=t.gl;return Ar[e]=t,n.isContextLost()?(delete Ar[e],x_(e)):(n.disable(n.DEPTH_TEST),n.disable(n.STENCIL_TEST),n.disable(n.BLEND),n.disable(n.DITHER),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SAMPLE_COVERAGE),n.enable(n.SCISSOR_TEST),n.enable(n.CULL_FACE),n.cullFace(n.BACK),t)}function qc(e,t){let n={alpha:!1,depth:!1,antialias:!1,stencil:!1,preserveDrawingBuffer:!1,premultipliedAlpha:!1,failIfMajorPerformanceCaveat:!1},s,u=n;if((!t||t==="webgl2")&&(s=e.getContext("webgl2",u),s))try{return new Ms(s,2)}catch(d){qe.warning("GlContextFactory",`failed to create WebGLContext using contextId 'webgl2'. Error: ${d}`)}if((!t||t==="webgl")&&(s=e.getContext("webgl",u)||e.getContext("experimental-webgl",u),s))try{return new Ms(s,1)}catch(d){qe.warning("GlContextFactory",`failed to create WebGLContext using contextId 'webgl' or 'experimental-webgl'. Error: ${d}`)}throw new Error("WebGL is not supported")}function V3(){if(typeof document>"u")throw new TypeError("failed to create canvas: document is not supported");let e=document.createElement("canvas");return e.width=1,e.height=1,e}function U3(){if(typeof OffscreenCanvas>"u")throw new TypeError("failed to create offscreen canvas: OffscreenCanvas is not supported");return new OffscreenCanvas(1,1)}var Ar,q3=C(()=>{Pt(),L3(),Ar={}}),$_,G3=C(()=>{et(),Pt(),j3(),q3(),$_=class{get contextId(){return he.webgl.contextId}set contextId(e){he.webgl.contextId=e}get matmulMaxBatchSize(){return he.webgl.matmulMaxBatchSize}set matmulMaxBatchSize(e){he.webgl.matmulMaxBatchSize=e}get textureCacheMode(){return he.webgl.textureCacheMode}set textureCacheMode(e){he.webgl.textureCacheMode=e}get pack(){return he.webgl.pack}set pack(e){he.webgl.pack=e}get async(){return he.webgl.async}set async(e){he.webgl.async=e}initialize(){try{return this.glContext=x_(this.contextId),typeof this.matmulMaxBatchSize!="number"&&(this.matmulMaxBatchSize=16),typeof this.textureCacheMode!="string"&&(this.textureCacheMode="full"),typeof this.pack!="boolean"&&(this.pack=!1),typeof this.async!="boolean"&&(this.async=!1),qe.setWithEnv(he),he.webgl.context||Object.defineProperty(he.webgl,"context",{value:this.glContext.gl}),qe.verbose("WebGLBackend",`Created WebGLContext: ${typeof this.glContext} with matmulMaxBatchSize: ${this.matmulMaxBatchSize}; textureCacheMode: ${this.textureCacheMode}; pack: ${this.pack}; async: ${this.async}.`),!0}catch(e){return qe.warning("WebGLBackend",`Unable to initialize WebGLBackend. ${e}`),!1}}createSessionHandler(e){return new w_(this,e)}dispose(){this.glContext.dispose()}}});async function T_(e){if(e){let t=typeof e=="string"?[e]:e;for(let n of t){let s=hu.get(n);if(s)return s;let u=await H3(n);if(u)return u}}else return T_(["webgl"]);throw new Error("no available backend to use")}async function H3(e){let t=S_;if(typeof t[e]<"u"&&W3(t[e])){let n=t[e],s=n.initialize();if(typeof s=="object"&&"then"in s&&(s=await s),s)return hu.set(e,n),n}}function W3(e){let t=e;return"initialize"in t&&typeof t.initialize=="function"&&"createSessionHandler"in t&&typeof t.createSessionHandler=="function"&&"dispose"in t&&typeof t.dispose=="function"}var hu,S_,K3=C(()=>{G3(),hu=new Map,S_={webgl:new $_}}),Gc,I_,X3=C(()=>{Pt(),Gc=class{constructor(e,t){this.op=e,this.node=t}},I_=class{constructor(e,t,n){this.graph=e,this.profiler=n,this.initialize(t)}initialize(e){this.profiler.event("session","ExecutionPlan.initialize",()=>{let t=this.graph.getNodes();if(t.length!==e.length)throw new Error("The size of nodes and OPs do not match.");this._ops=e.map((n,s)=>new Gc(n,t[s])),this.reset(),this._starter=[],this._ops.forEach((n,s)=>{let u=!0;for(let d of n.node.inputs)if(!this._values[d]&&this.graph.getInputIndices().indexOf(d)===-1){u=!1;break}u&&this._starter.push(s)})})}reset(){this._values=this.graph.getValues().map(e=>e.tensor)}async execute(e,t){return this.profiler.event("session","ExecutionPlan.execute",async()=>{this.reset();let n=e.createInferenceHandler(),s=this.graph.getInputIndices();if(t.length!==s.length)throw new Error(`number of input tensors don't match the number of inputs to the model: actual: ${t.length} expected: ${s.length}`);t.forEach((r,i)=>{let a=s[i];this._values[a]=r});let u=this._starter.slice(0),d=this.graph.getValues(),l=this.graph.getNodes(),p=0;for(;p<u.length;){let r=u[p++],i=this._ops[r],a=i.node.inputs.map(b=>this._values[b]);if(a.indexOf(void 0)!==-1)throw new Error(`unresolved input detected: op: ${i.node}`);let c=a;qe.verbose("ExecPlan",`Running op:${i.node.name} (${c.map((b,x)=>`'${i.node.inputs[x]}': ${b.type}[${b.dims.join(",")}]`).join(", ")})`);let h=await this.profiler.event("node",i.node.name,async()=>i.op.impl(n,c,i.op.context));if(h.length!==i.node.outputs.length)throw new Error("the size of output does not match model definition.");h.forEach((b,x)=>{let $=i.node.outputs[x];if(this._values[$])throw new Error(`output [${$}] already has value: op:${i.node.name}`);this._values[$]=b});let g=new Set;h.forEach((b,x)=>{let $=i.node.outputs[x];for(let _ of d[$].to){let O=l[_],I=!0;for(let E of O.inputs)if(!this._values[E]){I=!1;break}I&&g.add(_)}}),u.push(...g)}let o=[];for(let r=0;r<this.graph.getOutputIndices().length;r++){let i=this.graph.getOutputIndices()[r],a=this._values[i];if(a===void 0)throw new Error(`required output [${i}] does not have value`);i===0?await a.getData():a.data,o.push(a)}return qe.verbose("ExecPlan","disposing of inferenceHandler"),n.dispose(),o})}}}),ye,js,Z3=C(()=>{Xi(),ye=de(Zn()),sn(),Ae(),js=class Bn{constructor(t){if(this._attributes=new Map,t!=null){for(let n of t)n instanceof ye.onnx.AttributeProto?this._attributes.set(n.name,[Bn.getValue(n),Bn.getType(n)]):n instanceof fs.Attribute&&this._attributes.set(n.name(),[Bn.getValue(n),Bn.getType(n)]);if(this._attributes.size<t.length)throw new Error("duplicated attribute names")}}set(t,n,s){this._attributes.set(t,[s,n])}delete(t){this._attributes.delete(t)}getFloat(t,n){return this.get(t,"float",n)}getInt(t,n){return this.get(t,"int",n)}getString(t,n){return this.get(t,"string",n)}getTensor(t,n){return this.get(t,"tensor",n)}getFloats(t,n){return this.get(t,"floats",n)}getInts(t,n){return this.get(t,"ints",n)}getStrings(t,n){return this.get(t,"strings",n)}getTensors(t,n){return this.get(t,"tensors",n)}get(t,n,s){let u=this._attributes.get(t);if(u===void 0){if(s!==void 0)return s;throw new Error(`required attribute not found: ${t}`)}if(u[1]!==n)throw new Error(`type mismatch: expected ${n} but got ${u[1]}`);return u[0]}static getType(t){let n=t instanceof ye.onnx.AttributeProto?t.type:t.type();switch(n){case ye.onnx.AttributeProto.AttributeType.FLOAT:return"float";case ye.onnx.AttributeProto.AttributeType.INT:return"int";case ye.onnx.AttributeProto.AttributeType.STRING:return"string";case ye.onnx.AttributeProto.AttributeType.TENSOR:return"tensor";case ye.onnx.AttributeProto.AttributeType.FLOATS:return"floats";case ye.onnx.AttributeProto.AttributeType.INTS:return"ints";case ye.onnx.AttributeProto.AttributeType.STRINGS:return"strings";case ye.onnx.AttributeProto.AttributeType.TENSORS:return"tensors";default:throw new Error(`attribute type is not supported yet: ${ye.onnx.AttributeProto.AttributeType[n]}`)}}static getValue(t){let n=t instanceof ye.onnx.AttributeProto?t.type:t.type();if(n===ye.onnx.AttributeProto.AttributeType.GRAPH||n===ye.onnx.AttributeProto.AttributeType.GRAPHS)throw new Error("graph attribute is not supported yet");let s=this.getValueNoCheck(t);if(n===ye.onnx.AttributeProto.AttributeType.INT&&Rt.isLong(s))return Rt.longToNumber(s);if(n===ye.onnx.AttributeProto.AttributeType.INTS){let u=s,d=new Array(u.length);for(let l=0;l<u.length;l++){let p=u[l];d[l]=Rt.longToNumber(p)}return d}if(n===ye.onnx.AttributeProto.AttributeType.TENSOR)return t instanceof ye.onnx.AttributeProto?lt.fromProto(s):lt.fromOrtTensor(s);if(n===ye.onnx.AttributeProto.AttributeType.TENSORS){if(t instanceof ye.onnx.AttributeProto)return s.map(u=>lt.fromProto(u));if(t instanceof fs.Attribute)return s.map(u=>lt.fromOrtTensor(u))}return n===ye.onnx.AttributeProto.AttributeType.STRING&&t instanceof ye.onnx.AttributeProto?gs(s):n===ye.onnx.AttributeProto.AttributeType.STRINGS&&t instanceof ye.onnx.AttributeProto?s.map(gs):s}static getValueNoCheck(t){return t instanceof ye.onnx.AttributeProto?this.getValueNoCheckFromOnnxFormat(t):this.getValueNoCheckFromOrtFormat(t)}static getValueNoCheckFromOnnxFormat(t){switch(t.type){case ye.onnx.AttributeProto.AttributeType.FLOAT:return t.f;case ye.onnx.AttributeProto.AttributeType.INT:return t.i;case ye.onnx.AttributeProto.AttributeType.STRING:return t.s;case ye.onnx.AttributeProto.AttributeType.TENSOR:return t.t;case ye.onnx.AttributeProto.AttributeType.GRAPH:return t.g;case ye.onnx.AttributeProto.AttributeType.FLOATS:return t.floats;case ye.onnx.AttributeProto.AttributeType.INTS:return t.ints;case ye.onnx.AttributeProto.AttributeType.STRINGS:return t.strings;case ye.onnx.AttributeProto.AttributeType.TENSORS:return t.tensors;case ye.onnx.AttributeProto.AttributeType.GRAPHS:return t.graphs;default:throw new Error(`unsupported attribute type: ${ye.onnx.AttributeProto.AttributeType[t.type]}`)}}static getValueNoCheckFromOrtFormat(t){switch(t.type()){case St.AttributeType.FLOAT:return t.f();case St.AttributeType.INT:return t.i();case St.AttributeType.STRING:return t.s();case St.AttributeType.TENSOR:return t.t();case St.AttributeType.GRAPH:return t.g();case St.AttributeType.FLOATS:return t.floatsArray();case St.AttributeType.INTS:{let n=[];for(let s=0;s<t.intsLength();s++)n.push(t.ints(s));return n}case St.AttributeType.STRINGS:{let n=[];for(let s=0;s<t.stringsLength();s++)n.push(t.strings(s));return n}case St.AttributeType.TENSORS:{let n=[];for(let s=0;s<t.tensorsLength();s++)n.push(t.tensors(s));return n}default:throw new Error(`unsupported attribute type: ${St.AttributeType[t.type()]}`)}}}}),ta,Fs,Lt,ra,Hc,J3=C(()=>{Z3(),Xi(),ta=de(Zn()),sn(),Ae(),Fs={from:(e,t)=>new Hc(e,t)},Lt=class{constructor(e){this._from=void 0,this._to=[],this.tensor=void 0,this.type=void 0,e&&(this.type=st.tensorValueTypeFromProto(e.type.tensorType))}get from(){return this._from}get to(){return this._to}},ra=class{constructor(e,t){e instanceof ta.onnx.NodeProto?(this.name=e.name,this.opType=e.opType,this.attributes=new js(e.attribute)):e instanceof Bb.Node&&(this.name=t??e.name(),this.opType=e.opType(),this.attributes=new js(st.tensorAttributesFromORTFormat(e))),this.inputs=[],this.outputs=[],this.executeNode=!0}},Hc=class{constructor(e,t){if(!e)throw new TypeError("graph is empty");this.buildGraph(e),this.transformGraph(t),this.checkIsAcyclic()}getInputIndices(){return this._allInputIndices}getInputNames(){return this._allInputNames}getOutputIndices(){return this._allOutputIndices}getOutputNames(){return this._allOutputNames}getValues(){return this._allData}getNodes(){return this._nodes}buildGraph(e){if(e instanceof ta.onnx.GraphProto)this.buildGraphFromOnnxFormat(e);else if(e instanceof zb.Graph)this.buildGraphFromOrtFormat(e);else throw new TypeError("Graph type is not supported.")}buildGraphFromOnnxFormat(e){let t=new Map;this._allData=[],this._allInputIndices=[],this._allInputNames=[],this._allOutputIndices=[],this._allOutputNames=[],this._nodes=[];let n=new Map;if(!e.input)throw new Error("missing information in graph: input");let s=[];for(let u of e.input){if(t.has(u.name))throw new Error(`duplicated input name: ${u.name}`);let d=this._allData.push(new Lt(u))-1;t.set(u.name,d),s.push(u.name)}if(!e.initializer)throw new Error("missing information in graph: initializer");for(let u of e.initializer){let d=t.get(u.name);if(d===void 0){let l=new Lt;l.type={shape:{dims:st.tensorDimsFromProto(u.dims)},tensorType:st.tensorDataTypeFromProto(u.dataType)},d=this._allData.push(l)-1,t.set(u.name,d)}this._allData[d]._from=-1,this._allData[d].tensor=lt.fromProto(u)}for(let u=0;u<this._allData.length;u++)this._allData[u].tensor||(this._allInputIndices.push(u),this._allInputNames.push(s[u]));if(!e.output)throw new Error("missing information in graph: output");for(let u of e.output){if(t.has(u.name))throw new Error(`duplicated output name: ${u.name}`);let d=this._allData.push(new Lt(u))-1;t.set(u.name,d),this._allOutputIndices.push(d),this._allOutputNames.push(u.name)}if(!e.node)throw new Error("missing information in graph: node");for(let u of e.node){if(!u.name)for(let l=0;;l++){let p=`unnamed_${u.opType}_${l}`;if(!n.has(p)){u.name=p;break}}if(n.has(u.name))throw new Error(`duplicated node name: ${u.name}`);let d=this._nodes.push(new ra(u))-1;n.set(u.name,d)}for(let u=0;u<this._nodes.length;u++){let d=this._nodes[u],l=e.node[u];if(!l.output)throw new Error(`missing output for node: ${l.name}`);for(let p of l.output){let o=t.get(p);if(typeof o>"u"&&(o=this._allData.push(new Lt)-1,t.set(p,o)),d.outputs.push(o),this._allData[o]._from!==void 0)throw new Error(`multiple nodes output to one data value: ${o}`);if(this._allData[o]._from=u,l.opType==="Constant"){if(!l.attribute||l.attribute.length!==1||!l.attribute[0].t)throw new Error("missing attributes or missing tensor value in attributes for this Constant operator");if(!l.output||l.output.length!==1)throw new Error("missing output or incorrect number of outputs for this Constant operator");d.outputs.pop(),d.executeNode=!1,this._allData[o]._from=-1,this._allData[o].tensor=lt.fromProto(l.attribute[0].t)}}}for(let u=0;u<this._nodes.length;u++){let d=this._nodes[u],l=e.node[u];if(!l.input)throw new Error(`missing input for node: ${l.name}`);for(let p of l.input){let o=t.get(p);if(typeof o>"u"){if(p===""&&(l.input.length===3||l.input.length===4)&&l.opType==="Resize")continue;throw new Error(`unrecognized input '${p}' for node: ${l.name}`)}d.inputs.push(o),this._allData[o]._to.push(u)}}return!0}buildGraphFromOrtFormat(e){let t=new Map;this._allData=[],this._allInputIndices=[],this._allInputNames=[],this._allOutputIndices=[],this._allOutputNames=[],this._nodes=[];let n=new Map,s=[];for(let u=0;u<e.inputsLength();u++){let d=e.inputs(u);if(t.has(d))throw new Error(`duplicated input name: ${d}`);for(let l=0;l<e.nodeArgsLength();l++)if(e.nodeArgs(l)?.name()===d){let p=new Lt;if(e.nodeArgs(l)?.type()?.valueType()!==jb.TypeInfoValue.tensor_type)throw new Error("Unexpected value type for the nodeArg.");let o=e.nodeArgs(l).type().value(new Mb.TensorTypeAndShape),r=st.tensorDataTypeFromProto(o.elemType()),i=o.shape(),a=[];for(let h=0;h<i.dimLength();h++)a.push(Rt.longToNumber(i.dim(h).value().dimValue()));p.type={shape:{dims:a},tensorType:r};let c=this._allData.push(p)-1;t.set(d,c),s.push(d)}}for(let u=0;u<e.initializersLength();u++){let d=e.initializers(u),l=t.get(d.name());if(l===void 0){let p=new Lt,o=st.tensorDimsFromORTFormat(d),r=st.tensorDataTypeFromProto(d.dataType());p.type={shape:{dims:o},tensorType:r},l=this._allData.push(p)-1,t.set(d.name(),l)}this._allData[l]._from=-1,this._allData[l].tensor=lt.fromOrtTensor(d)}for(let u=0;u<this._allData.length;u++)this._allData[u].tensor||(this._allInputIndices.push(u),this._allInputNames.push(s[u]));for(let u=0;u<e.outputsLength();u++){let d=e.outputs(u);if(t.has(d))throw new Error(`duplicated output name: ${d}`);let l=this._allData.push(new Lt)-1;t.set(d,l),this._allOutputIndices.push(l),this._allOutputNames.push(d)}if(!e.nodes)throw new Error("missing information in graph: node");for(let u=0;u<e.nodesLength();u++){let d=e.nodes(u),l=d.name();if(!l)for(let o=0;l=`unnamed_${d.opType()}_${o}`,!!n.has(l);o++);if(n.has(l))throw new Error(`duplicated node name: ${l}`);let p=this._nodes.push(new ra(d,l))-1;n.set(l,p)}for(let u=0;u<this._nodes.length;u++){let d=this._nodes[u],l=e.nodes(u);if(l==null)throw new Error(`No node exists at index ${u}`);if(l?.outputsLength()===0)throw new Error(`missing output for node: ${l.name}`);for(let p=0;p<l?.outputsLength();p++){let o=l?.outputs(p),r=t.get(o);if(typeof r>"u"&&(r=this._allData.push(new Lt)-1,t.set(o,r)),d.outputs.push(r),this._allData[r]._from!==void 0)throw new Error(`multiple nodes output to one data value: ${r}`);if(this._allData[r]._from=u,l.opType()==="Constant"){if(l.attributesLength()!==1||!l.attributes(0).t())throw new Error("missing attributes or missing tensor value in attributes for this Constant operator");if(l.outputsLength()!==1)throw new Error("missing output or incorrect number of outputs for this Constant operator");d.outputs.pop(),d.executeNode=!1,this._allData[r]._from=-1,this._allData[r].tensor=lt.fromOrtTensor(l.attributes(0).t())}}}for(let u=0;u<this._nodes.length;u++){let d=this._nodes[u],l=e.nodes(u);if(l.inputsLength()===0)throw new Error(`missing input for node: ${l.name}`);for(let p=0;p<l.inputsLength();p++){let o=l.inputs(p),r=t.get(o);if(typeof r>"u")throw new Error(`unrecognized input '${o}' for node: ${l.name()}`);d.inputs.push(r),this._allData[r]._to.push(u)}}}checkIsAcyclic(){let e=new Set;this._allInputIndices.forEach(s=>{this._allData[s]._to.forEach(u=>{e.add(u)})});let t=Array.from(e),n=new Array(this._nodes.length).fill("white");for(;t.length>0;){let s=t.pop();n[s]==="gray"?n[s]="black":(t.push(s),n[s]="gray",this._nodes[s].outputs.forEach(u=>{let d=this._allData[u];if(typeof d.tensor<"u")throw new Error("node outputs should not be initialized");if(d._from!==s)throw new Error("from property of the Value object doesn't match index of Node being processed");d._to.forEach(l=>{if(n[l]==="gray")throw new Error("model graph is cyclic");n[l]==="white"&&t.push(l)})}))}}transformGraph(e){this.removeAllIdentityNodes(),this.removeAllDropoutNodes(),this.fuseConvActivationNodes(),e&&e.transformGraph(this),this.finalizeGraph()}finalizeGraph(){let e=0,t=new Array(this._nodes.length,0),n=0;for(let s=0;s<this._nodes.length;s++)t[s]=n,this._nodes[s].executeNode?(n!==s&&(this._nodes[n]=this._nodes[s]),n++):this._nodes[s].outputs.forEach(u=>{this._allData[u]._from=-2});this._nodes.splice(n,this._nodes.length-n);for(let s=0;s<this._allData.length;s++){let u=this._allData[s];u._from!==void 0&&u._from!==-1&&u._from!==-2&&(u._from=t[u._from]);for(let d=0;d<u._to.length;d++)if(u._to[d]>=0)u._to[d]=t[u._to[d]];else throw new Error("Trying to update a removed node")}e=0;for(let s=0;s<this._allData.length;s++){if(this._allData[s].from===-2&&this._allOutputIndices.indexOf(s+e)===-1){e++,this._allData.splice(s,1),s--;continue}if(e>0){let u=-1;this._allData[s].from!==void 0&&this._allData[s].from!==-1?(u=this._nodes[this._allData[s].from].outputs.indexOf(s+e),u!==-1&&(this._nodes[this._allData[s].from].outputs[u]=s)):(u=this._allInputIndices.indexOf(s+e),u!==-1&&(this._allInputIndices[u]=s)),this._allData[s].to.forEach(d=>{u=this._nodes[d].inputs.indexOf(s+e),u!==-1&&(this._nodes[d].inputs[u]=s)}),this._allData[s].to.length===0&&(u=this._allOutputIndices.indexOf(s+e),u!==-1&&(this._allOutputIndices[u]=s))}}}deleteNode(e){let t=this._nodes[e];if(t.outputs.length>1){for(let l=1;l<t.outputs.length;l++)if(this._allData[t.outputs[l]].to.length>0)throw new Error("Node deletion with more than one output connected to other nodes is not supported. ")}t.executeNode=!1;let n=t.inputs[0],s=t.outputs[0],u=this._allData[s].to;for(let l=0;l<t.inputs.length;l++){let p=this._allData[t.inputs[l]].to.indexOf(e);if(p===-1)throw new Error("The Value object doesn't have the current Node in it's 'to' property ");this._allData[t.inputs[l]].to.splice(p,1)}this._allData[s]._to=[];let d=this._allOutputIndices.indexOf(s);if(d!==-1&&(this._allOutputIndices[d]=n),u&&u.length>0)for(let l of u){let p=this._nodes[l].inputs.indexOf(s);if(p===-1)throw new Error("The Node object doesn't have the output Value in it's 'inputs' property ");this._nodes[l].inputs[p]=n,this._allData[n].to.push(l)}}removeAllDropoutNodes(){let e=0;for(let t of this._nodes){if(t.opType==="Dropout"){if(t.inputs.length!==1)throw new Error("Dropout nodes should only contain one input. ");if(t.outputs.length!==1&&t.outputs.length!==2)throw new Error("Dropout nodes should contain either 1 or 2 output(s)");if(t.outputs.length===2&&this._allData[t.outputs[1]]._to.length!==0)throw new Error("Dropout nodes's second output should not be referenced by other nodes");this.deleteNode(e)}e++}}removeAllIdentityNodes(){let e=0;for(let t of this._nodes)t.opType==="Identity"&&this.deleteNode(e),e++}isActivation(e){switch(e.opType){case"Relu":case"Sigmoid":case"Clip":return!0;default:return!1}}fuseConvActivationNodes(){for(let e of this._nodes)if(e.opType==="Conv"){let t=this._allData[e.outputs[0]]._to;if(t.length===1&&this.isActivation(this._nodes[t[0]])){let n=this._nodes[t[0]];if(n.opType==="Clip")if(n.inputs.length===1)try{e.attributes.set("activation_params","floats",[n.attributes.getFloat("min"),n.attributes.getFloat("max")])}catch{e.attributes.set("activation_params","floats",[Hn,Wn])}else if(n.inputs.length>=3&&this._allData[n.inputs[1]].tensor!==void 0&&this._allData[n.inputs[2]].tensor!==void 0)e.attributes.set("activation_params","floats",[this._allData[n.inputs[1]].tensor.floatData[0],this._allData[n.inputs[2]].tensor.floatData[0]]);else continue;e.attributes.set("activation","string",n.opType),this.deleteNode(t[0])}}}}}),Wc,Kc,O_,Q3=C(()=>{Wc=de(Pe()),J3(),Xi(),Kc=de(Zn()),Ae(),O_=class{constructor(){}load(e,t,n){let s;if(!n)try{this.loadFromOnnxFormat(e,t);return}catch(u){if(n!==void 0)throw u;s=u}try{this.loadFromOrtFormat(e,t)}catch(u){throw n!==void 0?u:new Error(`Failed to load model as ONNX format: ${s}
as ORT format: ${u}`)}}loadFromOnnxFormat(e,t){let n=Kc.onnx.ModelProto.decode(e);if(Rt.longToNumber(n.irVersion)<3)throw new Error("only support ONNX model with IR_VERSION>=3");this._opsets=n.opsetImport.map(s=>({domain:s.domain,version:Rt.longToNumber(s.version)})),this._graph=Fs.from(n.graph,t)}loadFromOrtFormat(e,t){let n=new Wc.ByteBuffer(e),s=Rb.InferenceSession.getRootAsInferenceSession(n).model();if(Rt.longToNumber(s.irVersion())<3)throw new Error("only support ONNX model with IR_VERSION>=3");this._opsets=[];for(let u=0;u<s.opsetImportLength();u++){let d=s.opsetImport(u);this._opsets.push({domain:d?.domain(),version:Rt.longToNumber(d.version())})}this._graph=Fs.from(s.graph(),t)}get graph(){return this._graph}get opsets(){return this._opsets}}}),E_,Y3=C(()=>{K3(),X3(),Pt(),Q3(),E_=class{constructor(e={}){this._initialized=!1,this.backendHint=e.backendHint,this.profiler=Jm.create(e.profiler),this.context={profiler:this.profiler,graphInputTypes:[],graphInputDims:[]}}get inputNames(){return this._model.graph.getInputNames()}get outputNames(){return this._model.graph.getOutputNames()}startProfiling(){this.profiler.start()}endProfiling(){this.profiler.stop()}async loadModel(e,t,n){await this.profiler.event("session","Session.loadModel",async()=>{let s=await T_(this.backendHint);if(this.sessionHandler=s.createSessionHandler(this.context),this._model=new O_,typeof e=="string"){let u=e.endsWith(".ort");{let d=await(await fetch(e)).arrayBuffer();this.initialize(new Uint8Array(d),u)}}else if(ArrayBuffer.isView(e))this.initialize(e);else{let u=new Uint8Array(e,t||0,n||e.byteLength);this.initialize(u)}})}initialize(e,t){if(this._initialized)throw new Error("already initialized");this.profiler.event("session","Session.initialize",()=>{let n=this.sessionHandler.transformGraph?this.sessionHandler:void 0;this._model.load(e,n,t),this.sessionHandler.onGraphInitialized&&this.sessionHandler.onGraphInitialized(this._model.graph),this.initializeOps(this._model.graph),this._executionPlan=new I_(this._model.graph,this._ops,this.profiler)}),this._initialized=!0}async run(e){if(!this._initialized)throw new Error("session not initialized yet");return this.profiler.event("session","Session.run",async()=>{let t=this.normalizeAndValidateInputs(e),n=await this._executionPlan.execute(this.sessionHandler,t);return this.createOutput(n)})}normalizeAndValidateInputs(e){let t=this._model.graph.getInputNames();if(Array.isArray(e)){if(e.length!==t.length)throw new Error(`incorrect input array length: expected ${t.length} but got ${e.length}`)}else{if(e.size!==t.length)throw new Error(`incorrect input map size: expected ${t.length} but got ${e.size}`);let n=new Array(e.size),s=0;for(let u=0;u<t.length;++u){let d=e.get(t[u]);if(!d)throw new Error(`missing input tensor for: '${name}'`);n[s++]=d}e=n}if(!this.context.graphInputTypes||this.context.graphInputTypes.length===0||!this.context.graphInputDims||this.context.graphInputDims.length===0){let n=this._model.graph.getInputIndices(),s=this._model.graph.getValues(),u=new Array(n.length);for(let d=0;d<n.length;++d){let l=s[n[d]];u[d]=l.type.shape.dims,this.context.graphInputTypes.push(l.type.tensorType),this.context.graphInputDims.push(e[d].dims)}this.validateInputTensorDims(u,e,!0)}else this.validateInputTensorDims(this.context.graphInputDims,e,!1);return this.validateInputTensorTypes(this.context.graphInputTypes,e),e}validateInputTensorTypes(e,t){for(let n=0;n<t.length;n++){let s=e[n],u=t[n].type;if(s!==u)throw new Error(`input tensor[${n}] check failed: expected type '${s}' but got ${u}`)}}validateInputTensorDims(e,t,n){for(let s=0;s<t.length;s++){let u=e[s],d=t[s].dims;if(!this.compareTensorDims(u,d,n))throw new Error(`input tensor[${s}] check failed: expected shape '[${u.join(",")}]' but got [${d.join(",")}]`)}}compareTensorDims(e,t,n){if(e.length!==t.length)return!1;for(let s=0;s<e.length;++s)if(e[s]!==t[s]&&(!n||e[s]!==0))return!1;return!0}createOutput(e){let t=this._model.graph.getOutputNames();if(e.length!==t.length)throw new Error("expected number of outputs do not match number of generated outputs");let n=new Map;for(let s=0;s<t.length;++s)n.set(t[s],e[s]);return n}initializeOps(e){let t=e.getNodes();this._ops=new Array(t.length);for(let n=0;n<t.length;n++)this._ops[n]=this.sessionHandler.resolve(t[n],this._model.opsets,e)}}}),P_,eS=C(()=>{et(),sn(),P_=class{constructor(e){this.session=e,this.inputNames=this.session.inputNames,this.outputNames=this.session.outputNames}get inputMetadata(){throw new Error("Getting model metadata is not supported in webgl backend.")}get outputMetadata(){throw new Error("Getting model metadata is not supported in webgl backend.")}async dispose(){}async run(e,t,n){let s=new Map;for(let l in e)if(Object.hasOwnProperty.call(e,l)){let p=e[l];s.set(l,new lt(p.dims,p.type,void 0,void 0,p.data))}let u=await this.session.run(s),d={};return u.forEach((l,p)=>{d[p]=new Ot(l.type,l.data,l.dims)}),d}startProfiling(){this.session.startProfiling()}endProfiling(){this.session.endProfiling()}}}),A_={};Ur(A_,{onnxjsBackend:()=>k_});var Xc,k_,tS=C(()=>{Y3(),eS(),Xc=class{async init(){}async createInferenceSessionHandler(e,t){let n=new E_(t);return typeof e=="string"?await n.loadModel(e):await n.loadModel(e),new P_(n)}},k_=new Xc}),fu=C(()=>{}),D_={};Ur(D_,{default:()=>N_});var na,ia,N_,rS=C(()=>{M1(),Gr(),gu(),na="ort-wasm-proxy-worker",ia=globalThis.self?.name===na,ia&&(self.onmessage=e=>{let{type:t,in:n}=e.data;try{switch(t){case"init-wasm":mu(n.wasm).then(()=>{Nu(n).then(()=>{postMessage({type:t})},s=>{postMessage({type:t,err:s})})},s=>{postMessage({type:t,err:s})});break;case"init-ep":{let{epName:s,env:u}=n;Cu(u,s).then(()=>{postMessage({type:t})},d=>{postMessage({type:t,err:d})});break}case"copy-from":{let{buffer:s}=n,u=qi(s);postMessage({type:t,out:u});break}case"create":{let{model:s,options:u}=n;zu(s,u).then(d=>{postMessage({type:t,out:d})},d=>{postMessage({type:t,err:d})});break}case"release":Ru(n),postMessage({type:t});break;case"run":{let{sessionId:s,inputIndices:u,inputs:d,outputIndices:l,options:p}=n;Bu(s,u,d,l,new Array(l.length).fill(null),p).then(o=>{o.some(r=>r[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:o},ju([...d,...o]))},o=>{postMessage({type:t,err:o})});break}case"end-profiling":Mu(n),postMessage({type:t});break;default:}}catch(s){postMessage({type:t,err:s})}}),N_=ia?null:e=>new Worker(e??at,{type:"module",name:na})}),C_={};Ur(C_,{default:()=>z_});async function Zc(e={}){var t=e,n=!!globalThis.window,s=!!globalThis.WorkerGlobalScope,u=s&&self.name?.startsWith("em-pthread");t.mountExternalData=(f,m)=>{f.startsWith("./")&&(f=f.substring(2)),(t.Xc||(t.Xc=new Map)).set(f,m)},t.unmountExternalData=()=>{delete t.Xc},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let d=f=>async(...m)=>{try{if(t.Yc)throw Error("Session already started");let v=t.Yc={Kd:m[0],errors:[]},y=await f(...m);if(t.Yc!==v)throw Error("Session mismatch");t.dd?.flush();let T=v.errors;if(0<T.length){let P=await Promise.all(T);if(P=P.filter(N=>N),0<P.length)throw Error(P.join(`
`))}return y}finally{t.Yc=null}};t.jsepInit=(f,m)=>{if(f==="webgpu"){[t.dd,t.Ad,t.Ed,t.ed,t.Dd,t.$b,t.Fd,t.Hd,t.Bd,t.Cd,t.Gd]=m;let v=t.dd;t.jsepRegisterBuffer=(y,T,P,N)=>v.registerBuffer(y,T,P,N),t.jsepGetBuffer=y=>v.getBuffer(y),t.jsepCreateDownloader=(y,T,P)=>v.createDownloader(y,T,P),t.jsepOnCreateSession=y=>{v.onCreateSession(y)},t.jsepOnReleaseSession=y=>{v.onReleaseSession(y)},t.jsepOnRunStart=y=>v.onRunStart(y),t.Id=(y,T)=>{v.upload(y,T)}}else if(f==="webnn"){let v=m[0];[t.Sd,t.sd,t.webnnEnsureTensor,t.td,t.webnnDownloadTensor,t.Rd,t.webnnEnableTraceEvent]=m.slice(1),t.webnnReleaseTensorId=t.sd,t.webnnUploadTensor=t.td,t.webnnRegisterMLContext=t.Rd,t.webnnOnRunStart=y=>v.onRunStart(y),t.webnnOnRunEnd=v.onRunEnd.bind(v),t.webnnOnReleaseSession=y=>{v.onReleaseSession(y)},t.webnnCreateMLTensorDownloader=(y,T)=>v.createMLTensorDownloader(y,T),t.webnnRegisterMLTensor=(y,T,P,N)=>v.registerMLTensor(y,T,P,N),t.webnnCreateMLContext=y=>v.createMLContext(y),t.webnnRegisterMLConstant=(y,T,P,N,B,G)=>v.registerMLConstant(y,T,P,N,B,t.Xc,G),t.webnnRegisterGraphInput=v.registerGraphInput.bind(v),t.webnnIsGraphInput=v.isGraphInput.bind(v),t.webnnRegisterGraphOutput=v.registerGraphOutput.bind(v),t.webnnIsGraphOutput=v.isGraphOutput.bind(v),t.webnnCreateTemporaryTensor=v.createTemporaryTensor.bind(v),t.webnnIsGraphInputOutputTypeSupported=v.isGraphInputOutputTypeSupported.bind(v)}};let l=()=>{let f=m=>(...v)=>{let y=Dt;return v=m(...v),Dt!=y?new Promise((T,P)=>{po={resolve:T,reject:P}}):v};(()=>{for(let m of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])t[m]=f(t[m])})(),d!==void 0&&(t._OrtRun=d(t._OrtRun),t._OrtRunWithBinding=d(t._OrtRunWithBinding)),l=void 0};t.asyncInit=()=>{l?.()};var p,o,r=(f,m)=>{throw m},i=import.meta.url,a="";if(n||s){try{a=new URL(".",i).href}catch{}s&&(o=f=>{var m=new XMLHttpRequest;return m.open("GET",f,!1),m.responseType="arraybuffer",m.send(null),new Uint8Array(m.response)}),p=async f=>{if(D(f))return new Promise((v,y)=>{var T=new XMLHttpRequest;T.open("GET",f,!0),T.responseType="arraybuffer",T.onload=()=>{T.status==200||T.status==0&&T.response?v(T.response):y(T.status)},T.onerror=y,T.send(null)});var m=await fetch(f,{credentials:"same-origin"});if(m.ok)return m.arrayBuffer();throw Error(m.status+" : "+m.url)}}var c,h,g,b,x,$,_=console.log.bind(console),O=console.error.bind(console),I=_,E=O,A=!1,D=f=>f.startsWith("file://");function S(){Wt.buffer!=U.buffer&&J()}if(u){let f=function(m){try{var v=m.data,y=v.Sc;if(y==="load"){let T=[];self.onmessage=P=>T.push(P),$=()=>{postMessage({Sc:"loaded"});for(let P of T)f(P);self.onmessage=f};for(let P of v.xd)t[P]&&!t[P].proxy||(t[P]=(...N)=>{postMessage({Sc:"callHandler",wd:P,args:N})},P=="print"&&(I=t[P]),P=="printErr"&&(E=t[P]));Wt=v.Od,J(),h=v.Pd,Oe(),ci()}else if(y==="run"){(function(T){var P=(S(),k)[T+52>>>2>>>0];T=(S(),k)[T+56>>>2>>>0],Vl(P,P-T),ce(P)})(v.Rc),mo(v.Rc,0,0,1,0,0),Uu(),so(v.Rc),L||(Rl(),L=!0);try{Z1(v.Md,v.bd)}catch(T){if(T!="unwind")throw T}}else v.target!=="setimmediate"&&(y==="checkMailbox"?L&&oi():y&&(E(`worker: received unknown command ${y}`),E(v)))}catch(T){throw Bl(),T}};var L=!1;self.onunhandledrejection=m=>{throw m.reason||m},self.onmessage=f}var U,ie,K,z,w,k,F,W,X,Z,oe,j=!1;function J(){var f=Wt.buffer;t.HEAP8=U=new Int8Array(f),K=new Int16Array(f),t.HEAPU8=ie=new Uint8Array(f),z=new Uint16Array(f),t.HEAP32=w=new Int32Array(f),t.HEAPU32=k=new Uint32Array(f),F=new Float32Array(f),W=new Float64Array(f),X=new BigInt64Array(f),Z=new BigUint64Array(f)}function H(){j=!0,u?$():Ft.sb()}function q(f){throw E(f="Aborted("+f+")"),A=!0,f=new WebAssembly.RuntimeError(f+". Build with -sASSERTIONS for more info."),x?.(f),f}function me(){return{a:{ma:_x,gb:yx,g:J1,J:Q1,f:Y1,o:e2,h:t2,ha:r2,b:n2,T:i2,Ha:Xu,n:o2,$:Yu,Xa:el,Da:tl,Fa:rl,Ya:nl,Va:il,Oa:ol,Ua:al,ka:sl,Ea:ul,Ba:ll,Wa:dl,Ca:pl,bb:a2,ea:s2,wa:u2,ua:d2,da:c2,O:h2,H:f2,va:g2,_:x2,xa:$2,Ra:T2,za:I2,Ia:O2,sa:E2,fa:P2,Qa:so,_a:A2,R:C2,r:j2,c:oo,hb:F2,y:L2,M:V2,D:U2,l:q2,s:_l,ib:G2,I:H2,S:W2,j:K2,u:X2,q:Z2,k:J2,La:Q2,Ma:Y2,Na:ex,Ja:$l,Ka:Tl,ta:Sl,db:rx,ab:ix,v:ox,aa:ax,ga:sx,$a:nx,W:ux,Za:lx,Aa:dx,F:tx,U:px,la:di,ya:hx,fb:cx,eb:fx,Sa:Pl,Ta:Al,Ga:eo,V:kl,ja:Dl,Pa:Nl,ia:Cl,kb:t$,na:Zx,lb:e$,oa:Xx,G:Fx,e:$x,t:wx,w:vx,B:Nx,mb:Hx,K:Bx,x:Ix,pa:Wx,Y:Jx,ba:Gx,nb:qx,ob:Ux,P:Cx,qa:Vx,pb:Lx,N:Mx,Z:Kx,d:xx,A:Sx,m:Tx,jb:r$,p:Ex,z:Px,C:Ox,E:Ax,L:zx,qb:jx,Q:Qx,ca:Rx,X:Yx,rb:Dx,ra:kx,i:mx,a:Wt,cb:Yi}}}async function Oe(){function f(y,T){var P=Ft=y.exports;y={};for(let[N,B]of Object.entries(P))typeof B=="function"?(P=k2(B),y[N]=P):y[N]=B;return Ft=y,Ft=function(){var N=Ft,B=Q=>le=>Q(le)>>>0,G=Q=>()=>Q()>>>0;return(N=Object.assign({},N)).tb=B(N.tb),N.Xb=G(N.Xb),N.Zb=B(N.Zb),N.lc=B(N.lc),N.mc=G(N.mc),N.qc=B(N.qc),N}(),Lu.push(Ft._b),zl=(y=Ft).tb,Rl=y.ub,t._OrtInit=y.vb,t._OrtGetLastError=y.wb,t._OrtCreateSessionOptions=y.xb,t._OrtAppendExecutionProvider=y.yb,t._OrtAddFreeDimensionOverride=y.zb,t._OrtAddSessionConfigEntry=y.Ab,t._OrtReleaseSessionOptions=y.Bb,t._OrtCreateSession=y.Cb,t._OrtReleaseSession=y.Db,t._OrtGetInputOutputCount=y.Eb,t._OrtGetInputOutputMetadata=y.Fb,t._OrtFree=y.Gb,t._OrtCreateTensor=y.Hb,t._OrtGetTensorData=y.Ib,t._OrtReleaseTensor=y.Jb,t._OrtCreateRunOptions=y.Kb,t._OrtAddRunConfigEntry=y.Lb,t._OrtReleaseRunOptions=y.Mb,t._OrtCreateBinding=y.Nb,t._OrtBindInput=y.Ob,t._OrtBindOutput=y.Pb,t._OrtClearBoundOutputs=y.Qb,t._OrtReleaseBinding=y.Rb,t._OrtRunWithBinding=y.Sb,t._OrtRun=y.Tb,t._OrtEndProfiling=y.Ub,t._JsepOutput=y.Vb,t._JsepGetNodeName=y.Wb,pi=y.Xb,Nt=t._free=y.Yb,hn=t._malloc=y.Zb,mo=y.ac,Bl=y.bc,Ml=y.cc,jl=y.dc,bo=y.ec,Fl=y.fc,Ll=y.gc,be=y.hc,fn=y.ic,Vl=y.jc,ce=y.kc,yo=y.lc,fe=y.mc,Ul=y.nc,_o=y.oc,ql=y.pc,Gl=y.qc,Hl=y.rc,vo=y.sc,Wl=y.tc,Kl=y.uc,Xl=y.vc,Zl=y.wc,Jl=y.xc,Ql=y.yc,Yl=y.zc,ed=y.Ac,td=y.Bc,rd=y.Cc,nd=y.Dc,id=y.Ec,od=y.Fc,ad=y.Gc,sd=y.Hc,ud=y.Ic,ld=y.Jc,dd=y.Kc,pd=y.Lc,cd=y.Mc,hd=y.Nc,fd=y.Pc,gd=y.Qc,md=y.$c,bd=y.ad,yd=y.fd,_d=y.jd,vd=y.kd,wd=y.ld,xd=y.md,$d=y.nd,Td=y.od,Sd=y.pd,Id=y.qd,Od=y.vd,Ed=y.Td,Pd=y.Ud,Ad=y.Vd,kd=y.Wd,h=T,Ft}var m,v=me();return t.instantiateWasm?new Promise(y=>{t.instantiateWasm(v,(T,P)=>{y(f(T,P))})}):u?f(new WebAssembly.Instance(h,me()),h):(oe??=t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.jsep.wasm",a):a+"ort-wasm-simd-threaded.jsep.wasm":new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href,m=await async function(y){var T=oe;if(!c&&!D(T))try{var P=fetch(T,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(P,y)}catch(N){E(`wasm streaming compile failed: ${N}`),E("falling back to ArrayBuffer instantiation")}return async function(N,B){try{var G=await async function(Q){if(!c)try{var le=await p(Q);return new Uint8Array(le)}catch{}if(Q==oe&&c)Q=new Uint8Array(c);else{if(!o)throw"both async and sync fetching of the wasm failed";Q=o(Q)}return Q}(N);return await WebAssembly.instantiate(G,B)}catch(Q){E(`failed to asynchronously prepare wasm: ${Q}`),q(Q)}}(T,y)}(v),f(m.instance,m.module))}class ke{name="ExitStatus";constructor(m){this.message=`Program terminated with exit(${m})`,this.status=m}}var Ze=f=>{f.terminate(),f.onmessage=()=>{}},Ee=[],Re=0,tt=null,ei=f=>{Ht.length==0&&(Gu(),qu(Ht[0]));var m=Ht.pop();if(!m)return 6;pn.push(m),dr[f.Rc]=m,m.Rc=f.Rc;var v={Sc:"run",Md:f.Ld,bd:f.bd,Rc:f.Rc};return m.postMessage(v,f.rd),0},At=0,je=(f,m,...v)=>{var y,T=16*v.length,P=fe(),N=yo(T),B=N>>>3;for(y of v)typeof y=="bigint"?((S(),X)[B++>>>0]=1n,(S(),X)[B++>>>0]=y):((S(),X)[B++>>>0]=0n,(S(),W)[B++>>>0]=y);return f=Ml(f,0,T,N,m),ce(P),f};function Yi(f){if(u)return je(0,1,f);if(g=f,!(0<At)){for(var m of pn)Ze(m);for(m of Ht)Ze(m);Ht=[],pn=[],dr={},A=!0}r(0,new ke(f))}function Fu(f){if(u)return je(1,0,f);eo(f)}var eo=f=>{if(g=f,u)throw Fu(f),"unwind";Yi(f)},Ht=[],pn=[],Lu=[],dr={},Vu=f=>{var m=f.Rc;delete dr[m],Ht.push(f),pn.splice(pn.indexOf(f),1),f.Rc=0,jl(m)};function Uu(){Lu.forEach(f=>f())}var qu=f=>new Promise(m=>{f.onmessage=T=>{var P=T.data;if(T=P.Sc,P.Zc&&P.Zc!=pi()){var N=dr[P.Zc];N?N.postMessage(P,P.rd):E(`Internal error! Worker sent a message "${T}" to target pthread ${P.Zc}, but that thread no longer exists!`)}else T==="checkMailbox"?oi():T==="spawnThread"?ei(P):T==="cleanupThread"?ii(()=>{Vu(dr[P.Nd])}):T==="loaded"?(f.loaded=!0,m(f)):P.target==="setimmediate"?f.postMessage(P):T==="uncaughtException"?f.onerror(P.error):T==="callHandler"?t[P.wd](...P.args):T&&E(`worker sent an unknown command ${T}`)},f.onerror=T=>{throw E(`worker sent an error! ${T.filename}:${T.lineno}: ${T.message}`),T};var v,y=[];for(v of[])t.propertyIsEnumerable(v)&&y.push(v);f.postMessage({Sc:"load",xd:y,Od:Wt,Pd:h})});function Gu(){var f=new Worker((()=>{let m=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new m("ort.all.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});Ht.push(f)}var Wt,Z1=(f,m)=>{At=0,f=vo(f,m),0<At?g=f:bo(f)},ti=[],ri=0;function J1(f){var m=new to(f>>>=0);return(S(),U)[m.Tc+12>>>0]==0&&(Hu(m,!0),ri--),Wu(m,!1),ti.push(m),Gl(f)}var Wr=0,Q1=()=>{be(0,0);var f=ti.pop();Ul(f.cd),Wr=0};function Hu(f,m){m=m?1:0,(S(),U)[f.Tc+12>>>0]=m}function Wu(f,m){m=m?1:0,(S(),U)[f.Tc+13>>>0]=m}class to{constructor(m){this.cd=m,this.Tc=m-24}}var ro=f=>{var m=Wr;if(!m)return fn(0),0;var v=new to(m);(S(),k)[v.Tc+16>>>2>>>0]=m;var y=(S(),k)[v.Tc+4>>>2>>>0];if(!y)return fn(0),m;for(var T of f){if(T===0||T===y)break;if(ql(T,y,v.Tc+16))return fn(T),m}return fn(y),m};function Y1(){return ro([])}function e2(f){return ro([f>>>0])}function t2(f,m,v,y){return ro([f>>>0,m>>>0,v>>>0,y>>>0])}var r2=()=>{var f=ti.pop();f||q("no exception to throw");var m=f.cd;throw(S(),U)[f.Tc+13>>>0]==0&&(ti.push(f),Wu(f,!0),Hu(f,!1),ri++),_o(m),Wr=m};function n2(f,m,v){var y=new to(f>>>=0);throw m>>>=0,v>>>=0,(S(),k)[y.Tc+16>>>2>>>0]=0,(S(),k)[y.Tc+4>>>2>>>0]=m,(S(),k)[y.Tc+8>>>2>>>0]=v,_o(f),ri++,Wr=f}var i2=()=>ri;function Ku(f,m,v,y){return u?je(2,1,f,m,v,y):Xu(f,m,v,y)}function Xu(f,m,v,y){if(f>>>=0,m>>>=0,v>>>=0,y>>>=0,!globalThis.SharedArrayBuffer)return 6;var T=[];return u&&T.length===0?Ku(f,m,v,y):(f={Ld:v,Rc:f,bd:y,rd:T},u?(f.Sc="spawnThread",postMessage(f,T),0):ei(f))}function o2(f){throw Wr||=f>>>0,Wr}var Zu=globalThis.TextDecoder&&new TextDecoder,Ju=(f,m,v,y)=>{if(v=m+v,y)return v;for(;f[m]&&!(m>=v);)++m;return m},Qu=(f,m=0,v,y)=>{if(16<(v=Ju(f,m>>>=0,v,y))-m&&f.buffer&&Zu)return Zu.decode(f.buffer instanceof ArrayBuffer?f.subarray(m,v):f.slice(m,v));for(y="";m<v;){var T=f[m++];if(128&T){var P=63&f[m++];if((224&T)==192)y+=String.fromCharCode((31&T)<<6|P);else{var N=63&f[m++];65536>(T=(240&T)==224?(15&T)<<12|P<<6|N:(7&T)<<18|P<<12|N<<6|63&f[m++])?y+=String.fromCharCode(T):(T-=65536,y+=String.fromCharCode(55296|T>>10,56320|1023&T))}}else y+=String.fromCharCode(T)}return y},Ge=(f,m,v)=>(f>>>=0)?Qu((S(),ie),f,m,v):"";function Yu(f,m,v){return u?je(3,1,f,m,v):0}function el(f,m){if(u)return je(4,1,f,m)}function tl(f,m){if(u)return je(5,1,f,m)}function rl(f,m,v){if(u)return je(6,1,f,m,v)}function nl(f,m,v){return u?je(7,1,f,m,v):0}function il(f,m){if(u)return je(8,1,f,m)}function ol(f,m,v){if(u)return je(9,1,f,m,v)}function al(f,m,v,y){if(u)return je(10,1,f,m,v,y)}function sl(f,m,v,y){if(u)return je(11,1,f,m,v,y)}function ul(f,m,v,y){if(u)return je(12,1,f,m,v,y)}function ll(f){if(u)return je(13,1,f)}function dl(f,m){if(u)return je(14,1,f,m)}function pl(f,m,v){if(u)return je(15,1,f,m,v)}var a2=()=>q(""),kt=f=>{f>>>=0;for(var m="";;){var v=(S(),ie)[f++>>>0];if(!v)return m;m+=String.fromCharCode(v)}},no={},io={},Kr=class extends Error{constructor(f){super(f),this.name="BindingError"}};function jt(f,m,v={}){return function(y,T,P={}){var N=T.name;if(!y)throw new Kr(`type "${N}" must have a positive integer typeid pointer`);if(io.hasOwnProperty(y)){if(P.yd)return;throw new Kr(`Cannot register type '${N}' twice`)}io[y]=T,no.hasOwnProperty(y)&&(T=no[y],delete no[y],T.forEach(B=>B()))}(f,m,v)}var cl=(f,m,v)=>{switch(m){case 1:return v?y=>(S(),U)[y>>>0]:y=>(S(),ie)[y>>>0];case 2:return v?y=>(S(),K)[y>>>1>>>0]:y=>(S(),z)[y>>>1>>>0];case 4:return v?y=>(S(),w)[y>>>2>>>0]:y=>(S(),k)[y>>>2>>>0];case 8:return v?y=>(S(),X)[y>>>3>>>0]:y=>(S(),Z)[y>>>3>>>0];default:throw new TypeError(`invalid integer width (${m}): ${f}`)}};function s2(f,m,v,y,T){f>>>=0,v>>>=0,m=kt(m>>>0);let P=N=>N;if(y=y===0n){let N=8*v;P=B=>BigInt.asUintN(N,B),T=P(T)}jt(f,{name:m,Oc:P,Vc:(N,B)=>(typeof B=="number"&&(B=BigInt(B)),B),Uc:cl(m,v,!y),Wc:null})}function u2(f,m,v,y){jt(f>>>=0,{name:m=kt(m>>>0),Oc:function(T){return!!T},Vc:function(T,P){return P?v:y},Uc:function(T){return this.Oc((S(),ie)[T>>>0])},Wc:null})}var hl=[],pr=[0,1,,1,null,1,!0,1,!1,1];function oo(f){9<(f>>>=0)&&--pr[f+1]===0&&(pr[f]=void 0,hl.push(f))}var pt=f=>{if(!f)throw new Kr(`Cannot use deleted val. handle = ${f}`);return pr[f]},_t=f=>{switch(f){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let m=hl.pop()||pr.length;return pr[m]=f,pr[m+1]=1,m}};function ao(f){return this.Oc((S(),k)[f>>>2>>>0])}var l2={name:"emscripten::val",Oc:f=>{var m=pt(f);return oo(f),m},Vc:(f,m)=>_t(m),Uc:ao,Wc:null};function d2(f){return jt(f>>>0,l2)}var p2=(f,m)=>{switch(m){case 4:return function(v){return this.Oc((S(),F)[v>>>2>>>0])};case 8:return function(v){return this.Oc((S(),W)[v>>>3>>>0])};default:throw new TypeError(`invalid float width (${m}): ${f}`)}};function c2(f,m,v){v>>>=0,jt(f>>>=0,{name:m=kt(m>>>0),Oc:y=>y,Vc:(y,T)=>T,Uc:p2(m,v),Wc:null})}function h2(f,m,v,y,T){f>>>=0,v>>>=0,m=kt(m>>>0);let P=B=>B;if(y===0){var N=32-8*v;P=B=>B<<N>>>N,T=P(T)}jt(f,{name:m,Oc:P,Vc:(B,G)=>G,Uc:cl(m,v,y!==0),Wc:null})}function f2(f,m,v){function y(P){var N=(S(),k)[P>>>2>>>0];return P=(S(),k)[P+4>>>2>>>0],new T((S(),U).buffer,P,N)}var T=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][m];jt(f>>>=0,{name:v=kt(v>>>0),Oc:y,Uc:y},{yd:!0})}var Kt=(f,m,v)=>{var y=(S(),ie);if(m>>>=0,0<v){var T=m;v=m+v-1;for(var P=0;P<f.length;++P){var N=f.codePointAt(P);if(127>=N){if(m>=v)break;y[m++>>>0]=N}else if(2047>=N){if(m+1>=v)break;y[m++>>>0]=192|N>>6,y[m++>>>0]=128|63&N}else if(65535>=N){if(m+2>=v)break;y[m++>>>0]=224|N>>12,y[m++>>>0]=128|N>>6&63,y[m++>>>0]=128|63&N}else{if(m+3>=v)break;y[m++>>>0]=240|N>>18,y[m++>>>0]=128|N>>12&63,y[m++>>>0]=128|N>>6&63,y[m++>>>0]=128|63&N,P++}}y[m>>>0]=0,f=m-T}else f=0;return f},ni=f=>{for(var m=0,v=0;v<f.length;++v){var y=f.charCodeAt(v);127>=y?m++:2047>=y?m+=2:55296<=y&&57343>=y?(m+=4,++v):m+=3}return m};function g2(f,m){jt(f>>>=0,{name:m=kt(m>>>0),Oc(v){var y=(S(),k)[v>>>2>>>0];return y=Ge(v+4,y,!0),Nt(v),y},Vc(v,y){y instanceof ArrayBuffer&&(y=new Uint8Array(y));var T=typeof y=="string";if(!(T||ArrayBuffer.isView(y)&&y.BYTES_PER_ELEMENT==1))throw new Kr("Cannot pass non-string to std::string");var P=T?ni(y):y.length,N=hn(4+P+1),B=N+4;return(S(),k)[N>>>2>>>0]=P,T?Kt(y,B,P+1):(S(),ie).set(y,B>>>0),v!==null&&v.push(Nt,N),N},Uc:ao,Wc(v){Nt(v)}})}var fl=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,m2=(f,m,v)=>{if(f>>>=1,16<(m=Ju((S(),z),f,m/2,v))-f&&fl)return fl.decode((S(),z).slice(f,m));for(v="";f<m;++f){var y=(S(),z)[f>>>0];v+=String.fromCharCode(y)}return v},b2=(f,m,v)=>{if(v??=2147483647,2>v)return 0;var y=m;v=(v-=2)<2*f.length?v/2:f.length;for(var T=0;T<v;++T){var P=f.charCodeAt(T);(S(),K)[m>>>1>>>0]=P,m+=2}return(S(),K)[m>>>1>>>0]=0,m-y},y2=f=>2*f.length,_2=(f,m,v)=>{var y="";f>>>=2;for(var T=0;!(T>=m/4);T++){var P=(S(),k)[f+T>>>0];if(!P&&!v)break;y+=String.fromCodePoint(P)}return y},v2=(f,m,v)=>{if(m>>>=0,v??=2147483647,4>v)return 0;var y=m;v=y+v-4;for(var T=0;T<f.length;++T){var P=f.codePointAt(T);if(65535<P&&T++,(S(),w)[m>>>2>>>0]=P,(m+=4)+4>v)break}return(S(),w)[m>>>2>>>0]=0,m-y},w2=f=>{for(var m=0,v=0;v<f.length;++v)65535<f.codePointAt(v)&&v++,m+=4;return m};function x2(f,m,v){if(f>>>=0,m>>>=0,v=kt(v>>>=0),m===2)var y=m2,T=b2,P=y2;else y=_2,T=v2,P=w2;jt(f,{name:v,Oc:N=>{var B=(S(),k)[N>>>2>>>0];return B=y(N+4,B*m,!0),Nt(N),B},Vc:(N,B)=>{if(typeof B!="string")throw new Kr(`Cannot pass non-string to C++ string type ${v}`);var G=P(B),Q=hn(4+G+m);return(S(),k)[Q>>>2>>>0]=G/m,T(B,Q+4,G+m),N!==null&&N.push(Nt,Q),Q},Uc:ao,Wc(N){Nt(N)}})}function $2(f,m){jt(f>>>=0,{zd:!0,name:m=kt(m>>>0),Oc:()=>{},Vc:()=>{}})}function T2(f){mo(f>>>0,!s,1,!n,131072,!1),Uu()}var ii=f=>{if(!A)try{if(f(),!(0<At))try{u?pi()&&bo(g):eo(g)}catch(m){m instanceof ke||m=="unwind"||r(0,m)}}catch(m){m instanceof ke||m=="unwind"||r(0,m)}},S2=!Atomics.waitAsync||globalThis.navigator?.userAgent&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function so(f){f>>>=0,S2||(Atomics.waitAsync((S(),w),f>>>2,f).value.then(oi),f+=128,Atomics.store((S(),w),f>>>2,1))}var oi=()=>ii(()=>{var f=pi();f&&(so(f),Ll())});function I2(f,m){(f>>>=0)==m>>>0?setTimeout(oi):u?postMessage({Zc:f,Sc:"checkMailbox"}):(f=dr[f])&&f.postMessage({Sc:"checkMailbox"})}var uo=[];function O2(f,m,v,y,T){for(m>>>=0,T>>>=0,uo.length=0,v=T>>>3,y=T+y>>>3;v<y;){var P;P=(S(),X)[v++>>>0]?(S(),X)[v++>>>0]:(S(),W)[v++>>>0],uo.push(P)}return(m?wo[m]:bx[f])(...uo)}var E2=()=>{At=0};function P2(f){f>>>=0,u?postMessage({Sc:"cleanupThread",Nd:f}):Vu(dr[f])}function A2(f){}var ai=f=>{try{f()}catch(m){q(m)}};function k2(f){var m=(...v)=>{si.push(f);try{return f(...v)}finally{A||(si.pop(),Dt&&Xt===1&&si.length===0&&(Xt=0,At+=1,ai(Pd),typeof Fibers<"u"&&Fibers.Zd()))}};return bl.set(f,m),m}var Xt=0,Dt=null,gl=0,si=[],lo=new Map,ml=new Map,bl=new Map,D2=0,po=null,N2=[],yl=f=>function(m){if(!A){if(Xt===0){var v=!1,y=!1;m((T=0)=>{if(!A&&(gl=T,v=!0,y)){Xt=2,ai(()=>Ad(Dt)),typeof MainLoop<"u"&&MainLoop.ud&&MainLoop.resume(),T=!1;try{var P=function(){var G=(S(),w)[Dt+8>>>2>>>0];return G=ml.get(G),G=bl.get(G),--At,G()}()}catch(G){P=G,T=!0}var N=!1;if(!Dt){var B=po;B&&(po=null,(T?B.reject:B.resolve)(P),N=!0)}if(T&&!N)throw P}}),y=!0,v||(Xt=1,Dt=function(){var T=hn(65548),P=T+12;if((S(),k)[T>>>2>>>0]=P,(S(),k)[T+4>>>2>>>0]=P+65536,P=si[0],!lo.has(P)){var N=D2++;lo.set(P,N),ml.set(N,P)}return P=lo.get(P),(S(),w)[T+8>>>2>>>0]=P,T}(),typeof MainLoop<"u"&&MainLoop.ud&&MainLoop.pause(),ai(()=>Ed(Dt)))}else Xt===2?(Xt=0,ai(kd),Nt(Dt),Dt=null,N2.forEach(ii)):q(`invalid state: ${Xt}`);return gl}}(m=>{f().then(m)});function C2(f){return f>>>=0,yl(async()=>{var m=await pt(f);return _t(m)})}var co=[],z2=f=>{var m=co.length;return co.push(f),m},R2=(f,m)=>{for(var v=Array(f),y=0;y<f;++y){var T=y,P=(S(),k)[m+4*y>>>2>>>0],N=io[P];if(N===void 0)throw f=`parameter ${y}`,P=zl(P),m=kt(P),Nt(P),new Kr(`${f} has unknown type ${m}`);v[T]=N}return v},B2=(f,m,v)=>{var y=[];return f=f(y,v),y.length&&((S(),k)[m>>>2>>>0]=_t(y)),f},M2={},ui=f=>{var m=M2[f];return m===void 0?kt(f):m};function j2(f,m,v){var[y,...T]=R2(f,m>>>0);m=y.Vc.bind(y);var P=T.map(G=>G.Uc.bind(G));f--;var N={toValue:pt};switch(f=P.map((G,Q)=>{var le=`argFromPtr${Q}`;return N[le]=G,`${le}(args${Q?"+"+8*Q:""})`}),v){case 0:var B="toValue(handle)";break;case 2:B="new (toValue(handle))";break;case 3:B="";break;case 1:N.getStringOrSymbol=ui,B="toValue(handle)[getStringOrSymbol(methodName)]"}return B+=`(${f})`,y.zd||(N.toReturnWire=m,N.emval_returnValue=B2,B=`return emval_returnValue(toReturnWire, destructorsRef, ${B})`),B=`return function (handle, methodName, destructorsRef, args) {
  ${B}
  }`,v=new Function(Object.keys(N),B)(...Object.values(N)),B=`methodCaller<(${T.map(G=>G.name)}) => ${y.name}>`,z2(Object.defineProperty(v,"name",{value:B}))}function F2(f,m){return m>>>=0,(f=pt(f>>>0))==pt(m)}function L2(f){return(f>>>=0)?(f=ui(f),_t(globalThis[f])):_t(globalThis)}function V2(f){return f=ui(f>>>0),_t(t[f])}function U2(f,m){return m>>>=0,f=pt(f>>>0),m=pt(m),_t(f[m])}function q2(f){9<(f>>>=0)&&(pr[f+1]+=1)}function _l(f,m,v,y,T){return co[f>>>0](m>>>0,v>>>0,y>>>0,T>>>0)}function G2(f,m,v,y,T){return _l(f>>>0,m>>>0,v>>>0,y>>>0,T>>>0)}function H2(){return _t([])}function W2(f){f=pt(f>>>0);for(var m=Array(f.length),v=0;v<f.length;v++)m[v]=f[v];return _t(m)}function K2(f){return _t(ui(f>>>0))}function X2(){return _t({})}function Z2(f){for(var m=pt(f>>>=0);m.length;){var v=m.pop();m.pop()(v)}oo(f)}function J2(f,m,v){m>>>=0,v>>>=0,f=pt(f>>>0),m=pt(m),v=pt(v),f[m]=v}function Q2(f,m){f=-9007199254740992>f||9007199254740992<f?NaN:Number(f),m>>>=0,f=new Date(1e3*f),(S(),w)[m>>>2>>>0]=f.getUTCSeconds(),(S(),w)[m+4>>>2>>>0]=f.getUTCMinutes(),(S(),w)[m+8>>>2>>>0]=f.getUTCHours(),(S(),w)[m+12>>>2>>>0]=f.getUTCDate(),(S(),w)[m+16>>>2>>>0]=f.getUTCMonth(),(S(),w)[m+20>>>2>>>0]=f.getUTCFullYear()-1900,(S(),w)[m+24>>>2>>>0]=f.getUTCDay(),f=(f.getTime()-Date.UTC(f.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(S(),w)[m+28>>>2>>>0]=f}var vl=f=>f%4==0&&(f%100!=0||f%400==0),wl=[0,31,60,91,121,152,182,213,244,274,305,335],xl=[0,31,59,90,120,151,181,212,243,273,304,334];function Y2(f,m){f=-9007199254740992>f||9007199254740992<f?NaN:Number(f),m>>>=0,f=new Date(1e3*f),(S(),w)[m>>>2>>>0]=f.getSeconds(),(S(),w)[m+4>>>2>>>0]=f.getMinutes(),(S(),w)[m+8>>>2>>>0]=f.getHours(),(S(),w)[m+12>>>2>>>0]=f.getDate(),(S(),w)[m+16>>>2>>>0]=f.getMonth(),(S(),w)[m+20>>>2>>>0]=f.getFullYear()-1900,(S(),w)[m+24>>>2>>>0]=f.getDay();var v=(vl(f.getFullYear())?wl:xl)[f.getMonth()]+f.getDate()-1|0;(S(),w)[m+28>>>2>>>0]=v,(S(),w)[m+36>>>2>>>0]=-60*f.getTimezoneOffset(),v=new Date(f.getFullYear(),6,1).getTimezoneOffset();var y=new Date(f.getFullYear(),0,1).getTimezoneOffset();f=0|(v!=y&&f.getTimezoneOffset()==Math.min(y,v)),(S(),w)[m+32>>>2>>>0]=f}function ex(f){f>>>=0;var m=new Date((S(),w)[f+20>>>2>>>0]+1900,(S(),w)[f+16>>>2>>>0],(S(),w)[f+12>>>2>>>0],(S(),w)[f+8>>>2>>>0],(S(),w)[f+4>>>2>>>0],(S(),w)[f>>>2>>>0],0),v=(S(),w)[f+32>>>2>>>0],y=m.getTimezoneOffset(),T=new Date(m.getFullYear(),6,1).getTimezoneOffset(),P=new Date(m.getFullYear(),0,1).getTimezoneOffset(),N=Math.min(P,T);return 0>v?(S(),w)[f+32>>>2>>>0]=+(T!=P&&N==y):0<v!=(N==y)&&(T=Math.max(P,T),m.setTime(m.getTime()+6e4*((0<v?N:T)-y))),(S(),w)[f+24>>>2>>>0]=m.getDay(),v=(vl(m.getFullYear())?wl:xl)[m.getMonth()]+m.getDate()-1|0,(S(),w)[f+28>>>2>>>0]=v,(S(),w)[f>>>2>>>0]=m.getSeconds(),(S(),w)[f+4>>>2>>>0]=m.getMinutes(),(S(),w)[f+8>>>2>>>0]=m.getHours(),(S(),w)[f+12>>>2>>>0]=m.getDate(),(S(),w)[f+16>>>2>>>0]=m.getMonth(),(S(),w)[f+20>>>2>>>0]=m.getYear(),f=m.getTime(),BigInt(isNaN(f)?-1:f/1e3)}function $l(f,m,v,y,T,P,N){return u?je(16,1,f,m,v,y,T,P,N):-52}function Tl(f,m,v,y,T,P){if(u)return je(17,1,f,m,v,y,T,P)}var cn={},tx=()=>performance.timeOrigin+performance.now();function Sl(f,m){if(u)return je(18,1,f,m);if(cn[f]&&(clearTimeout(cn[f].id),delete cn[f]),!m)return 0;var v=setTimeout(()=>{delete cn[f],ii(()=>Fl(f,performance.timeOrigin+performance.now()))},m);return cn[f]={id:v,Yd:m},0}function rx(f,m,v,y){f>>>=0,m>>>=0,v>>>=0,y>>>=0;var T=new Date().getFullYear(),P=new Date(T,0,1).getTimezoneOffset();T=new Date(T,6,1).getTimezoneOffset();var N=Math.max(P,T);(S(),k)[f>>>2>>>0]=60*N,(S(),w)[m>>>2>>>0]=+(P!=T),f=(m=B=>{var G=Math.abs(B);return`UTC${0<=B?"-":"+"}${String(Math.floor(G/60)).padStart(2,"0")}${String(G%60).padStart(2,"0")}`})(P),m=m(T),T<P?(Kt(f,v,17),Kt(m,y,17)):(Kt(f,y,17),Kt(m,v,17))}var nx=()=>Date.now();function ix(f,m,v){return v>>>=0,0<=f&&3>=f?(f===0?f=Date.now():f=performance.timeOrigin+performance.now(),f=Math.round(1e6*f),(S(),X)[v>>>3>>>0]=BigInt(f),0):28}var ho=[],Il=(f,m)=>{ho.length=0;for(var v;v=(S(),ie)[f++>>>0];){var y=v!=105;m+=(y&=v!=112)&&m%8?4:0,ho.push(v==112?(S(),k)[m>>>2>>>0]:v==106?(S(),X)[m>>>3>>>0]:v==105?(S(),w)[m>>>2>>>0]:(S(),W)[m>>>3>>>0]),m+=y?8:4}return ho};function ox(f,m,v){return f>>>=0,m=Il(m>>>0,v>>>0),wo[f](...m)}function ax(f,m,v){return f>>>=0,m=Il(m>>>0,v>>>0),wo[f](...m)}var sx=()=>{};function ux(f,m){return E(Ge(f>>>0,m>>>0))}var lx=()=>{throw At+=1,"unwind"};function dx(){return 4294901760}var px=()=>navigator.hardwareConcurrency,cr={},li=f=>{var m;return(m=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(f))?+m[1]:(m=/:(\d+):\d+(?:\)|$)/.exec(f))?2147483648|+m[1]:0},Ol=f=>{for(var m of f)(f=li(m))&&(cr[f]=m)};function cx(){var f=Error().stack.toString().split(`
`);return f[0]=="Error"&&f.shift(),Ol(f),cr.gd=li(f[3]),cr.Jd=f,cr.gd}function di(f){if(!(f=cr[f>>>0]))return 0;var m;if(m=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(f))f=m[1];else if(m=/^\s+at (.*) \(.*\)$/.exec(f))f=m[1];else{if(!(m=/^(.+?)@/.exec(f)))return 0;f=m[1]}Nt(di.hd??0),m=ni(f)+1;var v=hn(m);return v&&Kt(f,v,m),di.hd=v,di.hd}function hx(f){f>>>=0;var m=(S(),ie).length;if(f<=m||4294901760<f)return!1;for(var v=1;4>=v;v*=2){var y=m*(1+.2/v);y=Math.min(y,f+100663296);e:{y=(Math.min(4294901760,65536*Math.ceil(Math.max(f,y)/65536))-Wt.buffer.byteLength+65535)/65536|0;try{Wt.grow(y),J();var T=1;break e}catch{}T=void 0}if(T)return!0}return!1}function fx(f,m,v){if(f>>>=0,m>>>=0,cr.gd==f)var y=cr.Jd;else(y=Error().stack.toString().split(`
`))[0]=="Error"&&y.shift(),Ol(y);for(var T=3;y[T]&&li(y[T])!=f;)++T;for(f=0;f<v&&y[f+T];++f)(S(),w)[m+4*f>>>2>>>0]=li(y[f+T]);return f}var fo,go={},El=()=>{if(!fo){var f,m={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(globalThis.navigator?.language??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(f in go)go[f]===void 0?delete m[f]:m[f]=go[f];var v=[];for(f in m)v.push(`${f}=${m[f]}`);fo=v}return fo};function Pl(f,m){if(u)return je(19,1,f,m);f>>>=0,m>>>=0;var v,y=0,T=0;for(v of El()){var P=m+y;(S(),k)[f+T>>>2>>>0]=P,y+=Kt(v,P,1/0)+1,T+=4}return 0}function Al(f,m){if(u)return je(20,1,f,m);f>>>=0,m>>>=0;var v=El();for(var y of((S(),k)[f>>>2>>>0]=v.length,f=0,v))f+=ni(y)+1;return(S(),k)[m>>>2>>>0]=f,0}function kl(f){return u?je(21,1,f):52}function Dl(f,m,v,y){return u?je(22,1,f,m,v,y):52}function Nl(f,m,v,y){return u?je(23,1,f,m,v,y):70}var gx=[null,[],[]];function Cl(f,m,v,y){if(u)return je(24,1,f,m,v,y);m>>>=0,v>>>=0,y>>>=0;for(var T=0,P=0;P<v;P++){var N=(S(),k)[m>>>2>>>0],B=(S(),k)[m+4>>>2>>>0];m+=8;for(var G=0;G<B;G++){var Q=f,le=(S(),ie)[N+G>>>0],ve=gx[Q];le===0||le===10?((Q===1?I:E)(Qu(ve)),ve.length=0):ve.push(le)}T+=B}return(S(),k)[y>>>2>>>0]=T,0}function mx(f){return f>>>0}u||function(){for(var f=t.numThreads-1;f--;)Gu();Ee.push(async()=>{var m=async function(){if(!u)return Promise.all(Ht.map(qu))}();Re++,await m,--Re==0&&tt&&(m=tt,tt=null,m())})}(),u||(Wt=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),J()),t.wasmBinary&&(c=t.wasmBinary),t.stackSave=()=>fe(),t.stackRestore=f=>ce(f),t.stackAlloc=f=>yo(f),t.setValue=function(f,m,v="i8"){switch(v.endsWith("*")&&(v="*"),v){case"i1":case"i8":(S(),U)[f>>>0]=m;break;case"i16":(S(),K)[f>>>1>>>0]=m;break;case"i32":(S(),w)[f>>>2>>>0]=m;break;case"i64":(S(),X)[f>>>3>>>0]=BigInt(m);break;case"float":(S(),F)[f>>>2>>>0]=m;break;case"double":(S(),W)[f>>>3>>>0]=m;break;case"*":(S(),k)[f>>>2>>>0]=m;break;default:q(`invalid type for setValue: ${v}`)}},t.getValue=function(f,m="i8"){switch(m.endsWith("*")&&(m="*"),m){case"i1":case"i8":return(S(),U)[f>>>0];case"i16":return(S(),K)[f>>>1>>>0];case"i32":return(S(),w)[f>>>2>>>0];case"i64":return(S(),X)[f>>>3>>>0];case"float":return(S(),F)[f>>>2>>>0];case"double":return(S(),W)[f>>>3>>>0];case"*":return(S(),k)[f>>>2>>>0];default:q(`invalid type for getValue: ${m}`)}},t.UTF8ToString=Ge,t.stringToUTF8=Kt,t.lengthBytesUTF8=ni;var zl,Rl,pi,Nt,hn,mo,Bl,Ml,jl,bo,Fl,Ll,be,fn,Vl,ce,yo,fe,Ul,_o,ql,Gl,Hl,vo,Wl,Kl,Xl,Zl,Jl,Ql,Yl,ed,td,rd,nd,id,od,ad,sd,ud,ld,dd,pd,cd,hd,fd,gd,md,bd,yd,_d,vd,wd,xd,$d,Td,Sd,Id,Od,Ed,Pd,Ad,kd,Ft,bx=[Yi,Fu,Ku,Yu,el,tl,rl,nl,il,ol,al,sl,ul,ll,dl,pl,$l,Tl,Sl,Pl,Al,kl,Dl,Nl,Cl],wo={1003524:(f,m,v,y,T)=>{if(t===void 0||!t.Xc)return 1;if((f=Ge(Number(f>>>0))).startsWith("./")&&(f=f.substring(2)),!(f=t.Xc.get(f)))return 2;if(m=Number(m>>>0),v=Number(v>>>0),y=Number(y>>>0),m+v>f.byteLength)return 3;try{let P=f.subarray(m,m+v);switch(T){case 0:(S(),ie).set(P,y>>>0);break;case 1:t.Qd?t.Qd(y,P):t.Id(y,P);break;default:return 4}return 0}catch{return 4}},1004348:(f,m,v)=>{t.td(f,(S(),ie).subarray(m>>>0,m+v>>>0))},1004412:()=>t.Sd(),1004454:f=>{t.sd(f)},1004491:()=>{t.Bd()},1004522:()=>{t.Cd()},1004551:()=>{t.Gd()},1004576:f=>t.Ad(f),1004609:f=>t.Ed(f),1004641:(f,m,v)=>{t.ed(Number(f),Number(m),Number(v),!0)},1004704:(f,m,v)=>{t.ed(Number(f),Number(m),Number(v))},1004761:()=>typeof wasmOffsetConverter<"u",1004818:f=>{t.$b("Abs",f,void 0)},1004869:f=>{t.$b("Neg",f,void 0)},1004920:f=>{t.$b("Floor",f,void 0)},1004973:f=>{t.$b("Ceil",f,void 0)},1005025:f=>{t.$b("Reciprocal",f,void 0)},1005083:f=>{t.$b("Sqrt",f,void 0)},1005135:f=>{t.$b("Exp",f,void 0)},1005186:f=>{t.$b("Erf",f,void 0)},1005237:f=>{t.$b("Sigmoid",f,void 0)},1005292:(f,m,v)=>{t.$b("HardSigmoid",f,{alpha:m,beta:v})},1005371:f=>{t.$b("Log",f,void 0)},1005422:f=>{t.$b("Sin",f,void 0)},1005473:f=>{t.$b("Cos",f,void 0)},1005524:f=>{t.$b("Tan",f,void 0)},1005575:f=>{t.$b("Asin",f,void 0)},1005627:f=>{t.$b("Acos",f,void 0)},1005679:f=>{t.$b("Atan",f,void 0)},1005731:f=>{t.$b("Sinh",f,void 0)},1005783:f=>{t.$b("Cosh",f,void 0)},1005835:f=>{t.$b("Asinh",f,void 0)},1005888:f=>{t.$b("Acosh",f,void 0)},1005941:f=>{t.$b("Atanh",f,void 0)},1005994:f=>{t.$b("Tanh",f,void 0)},1006046:f=>{t.$b("Not",f,void 0)},1006097:(f,m,v)=>{t.$b("Clip",f,{min:m,max:v})},1006166:f=>{t.$b("Clip",f,void 0)},1006218:(f,m)=>{t.$b("Elu",f,{alpha:m})},1006276:f=>{t.$b("Gelu",f,void 0)},1006328:f=>{t.$b("Relu",f,void 0)},1006380:(f,m)=>{t.$b("LeakyRelu",f,{alpha:m})},1006444:(f,m)=>{t.$b("ThresholdedRelu",f,{alpha:m})},1006514:(f,m)=>{t.$b("Cast",f,{to:m})},1006572:f=>{t.$b("Add",f,void 0)},1006623:f=>{t.$b("Sub",f,void 0)},1006674:f=>{t.$b("Mul",f,void 0)},1006725:f=>{t.$b("Div",f,void 0)},1006776:f=>{t.$b("Pow",f,void 0)},1006827:f=>{t.$b("Equal",f,void 0)},1006880:f=>{t.$b("Greater",f,void 0)},1006935:f=>{t.$b("GreaterOrEqual",f,void 0)},1006997:f=>{t.$b("Less",f,void 0)},1007049:f=>{t.$b("LessOrEqual",f,void 0)},1007108:(f,m,v,y,T)=>{t.$b("ReduceMean",f,{keepDims:!!m,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),w).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1007283:(f,m,v,y,T)=>{t.$b("ReduceMax",f,{keepDims:!!m,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),w).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1007457:(f,m,v,y,T)=>{t.$b("ReduceMin",f,{keepDims:!!m,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),w).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1007631:(f,m,v,y,T)=>{t.$b("ReduceProd",f,{keepDims:!!m,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),w).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1007806:(f,m,v,y,T)=>{t.$b("ReduceSum",f,{keepDims:!!m,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),w).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1007980:(f,m,v,y,T)=>{t.$b("ReduceL1",f,{keepDims:!!m,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),w).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1008153:(f,m,v,y,T)=>{t.$b("ReduceL2",f,{keepDims:!!m,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),w).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1008326:(f,m,v,y,T)=>{t.$b("ReduceLogSum",f,{keepDims:!!m,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),w).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1008503:(f,m,v,y,T)=>{t.$b("ReduceSumSquare",f,{keepDims:!!m,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),w).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1008683:(f,m,v,y,T)=>{t.$b("ReduceLogSumExp",f,{keepDims:!!m,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),w).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1008863:f=>{t.$b("Where",f,void 0)},1008916:(f,m,v)=>{t.$b("Transpose",f,{perm:m?Array.from((S(),w).subarray(Number(m)>>>0,Number(v)>>>0)):[]})},1009040:(f,m,v,y)=>{t.$b("DepthToSpace",f,{blocksize:m,mode:Ge(v),format:y?"NHWC":"NCHW"})},1009173:(f,m,v,y)=>{t.$b("DepthToSpace",f,{blocksize:m,mode:Ge(v),format:y?"NHWC":"NCHW"})},1009306:(f,m,v,y,T,P,N,B,G,Q,le,ve,De,ze,Zt)=>{t.$b("ConvTranspose",f,{format:G?"NHWC":"NCHW",autoPad:m,dilations:[v],group:y,kernelShape:[T],pads:[P,N],strides:[B],wIsConst:()=>!!(S(),U)[Q>>>0],outputPadding:le?Array.from((S(),w).subarray(Number(le)>>>0,Number(ve)>>>0)):[],outputShape:De?Array.from((S(),w).subarray(Number(De)>>>0,Number(ze)>>>0)):[],activation:Ge(Zt)})},1009739:(f,m,v,y,T,P,N,B,G,Q,le,ve,De,ze)=>{t.$b("ConvTranspose",f,{format:B?"NHWC":"NCHW",autoPad:m,dilations:Array.from((S(),w).subarray(Number(v)>>>0,(Number(v)>>>0)+2>>>0)),group:y,kernelShape:Array.from((S(),w).subarray(Number(T)>>>0,(Number(T)>>>0)+2>>>0)),pads:Array.from((S(),w).subarray(Number(P)>>>0,(Number(P)>>>0)+4>>>0)),strides:Array.from((S(),w).subarray(Number(N)>>>0,(Number(N)>>>0)+2>>>0)),wIsConst:()=>!!(S(),U)[G>>>0],outputPadding:Q?Array.from((S(),w).subarray(Number(Q)>>>0,Number(le)>>>0)):[],outputShape:ve?Array.from((S(),w).subarray(Number(ve)>>>0,Number(De)>>>0)):[],activation:Ge(ze)})},1010400:(f,m,v,y,T,P,N,B,G,Q,le,ve,De,ze,Zt)=>{t.$b("ConvTranspose",f,{format:G?"NHWC":"NCHW",autoPad:m,dilations:[v],group:y,kernelShape:[T],pads:[P,N],strides:[B],wIsConst:()=>!!(S(),U)[Q>>>0],outputPadding:le?Array.from((S(),w).subarray(Number(le)>>>0,Number(ve)>>>0)):[],outputShape:De?Array.from((S(),w).subarray(Number(De)>>>0,Number(ze)>>>0)):[],activation:Ge(Zt)})},1010833:(f,m,v,y,T,P,N,B,G,Q,le,ve,De,ze)=>{t.$b("ConvTranspose",f,{format:B?"NHWC":"NCHW",autoPad:m,dilations:Array.from((S(),w).subarray(Number(v)>>>0,(Number(v)>>>0)+2>>>0)),group:y,kernelShape:Array.from((S(),w).subarray(Number(T)>>>0,(Number(T)>>>0)+2>>>0)),pads:Array.from((S(),w).subarray(Number(P)>>>0,(Number(P)>>>0)+4>>>0)),strides:Array.from((S(),w).subarray(Number(N)>>>0,(Number(N)>>>0)+2>>>0)),wIsConst:()=>!!(S(),U)[G>>>0],outputPadding:Q?Array.from((S(),w).subarray(Number(Q)>>>0,Number(le)>>>0)):[],outputShape:ve?Array.from((S(),w).subarray(Number(ve)>>>0,Number(De)>>>0)):[],activation:Ge(ze)})},1011494:(f,m)=>{t.$b("GlobalAveragePool",f,{format:m?"NHWC":"NCHW"})},1011585:(f,m,v,y,T,P,N,B,G,Q,le,ve,De,ze)=>{t.$b("AveragePool",f,{format:ze?"NHWC":"NCHW",auto_pad:m,ceil_mode:v,count_include_pad:y,storage_order:T,dilations:P?Array.from((S(),w).subarray(Number(P)>>>0,Number(N)>>>0)):[],kernel_shape:B?Array.from((S(),w).subarray(Number(B)>>>0,Number(G)>>>0)):[],pads:Q?Array.from((S(),w).subarray(Number(Q)>>>0,Number(le)>>>0)):[],strides:ve?Array.from((S(),w).subarray(Number(ve)>>>0,Number(De)>>>0)):[]})},1012064:(f,m)=>{t.$b("GlobalAveragePool",f,{format:m?"NHWC":"NCHW"})},1012155:(f,m,v,y,T,P,N,B,G,Q,le,ve,De,ze)=>{t.$b("AveragePool",f,{format:ze?"NHWC":"NCHW",auto_pad:m,ceil_mode:v,count_include_pad:y,storage_order:T,dilations:P?Array.from((S(),w).subarray(Number(P)>>>0,Number(N)>>>0)):[],kernel_shape:B?Array.from((S(),w).subarray(Number(B)>>>0,Number(G)>>>0)):[],pads:Q?Array.from((S(),w).subarray(Number(Q)>>>0,Number(le)>>>0)):[],strides:ve?Array.from((S(),w).subarray(Number(ve)>>>0,Number(De)>>>0)):[]})},1012634:(f,m)=>{t.$b("GlobalMaxPool",f,{format:m?"NHWC":"NCHW"})},1012721:(f,m,v,y,T,P,N,B,G,Q,le,ve,De,ze)=>{t.$b("MaxPool",f,{format:ze?"NHWC":"NCHW",auto_pad:m,ceil_mode:v,count_include_pad:y,storage_order:T,dilations:P?Array.from((S(),w).subarray(Number(P)>>>0,Number(N)>>>0)):[],kernel_shape:B?Array.from((S(),w).subarray(Number(B)>>>0,Number(G)>>>0)):[],pads:Q?Array.from((S(),w).subarray(Number(Q)>>>0,Number(le)>>>0)):[],strides:ve?Array.from((S(),w).subarray(Number(ve)>>>0,Number(De)>>>0)):[]})},1013196:(f,m)=>{t.$b("GlobalMaxPool",f,{format:m?"NHWC":"NCHW"})},1013283:(f,m,v,y,T,P,N,B,G,Q,le,ve,De,ze)=>{t.$b("MaxPool",f,{format:ze?"NHWC":"NCHW",auto_pad:m,ceil_mode:v,count_include_pad:y,storage_order:T,dilations:P?Array.from((S(),w).subarray(Number(P)>>>0,Number(N)>>>0)):[],kernel_shape:B?Array.from((S(),w).subarray(Number(B)>>>0,Number(G)>>>0)):[],pads:Q?Array.from((S(),w).subarray(Number(Q)>>>0,Number(le)>>>0)):[],strides:ve?Array.from((S(),w).subarray(Number(ve)>>>0,Number(De)>>>0)):[]})},1013758:(f,m,v,y,T)=>{t.$b("Gemm",f,{alpha:m,beta:v,transA:y,transB:T})},1013862:f=>{t.$b("MatMul",f,void 0)},1013916:(f,m,v,y)=>{t.$b("ArgMax",f,{keepDims:!!m,selectLastIndex:!!v,axis:y})},1014024:(f,m,v,y)=>{t.$b("ArgMin",f,{keepDims:!!m,selectLastIndex:!!v,axis:y})},1014132:(f,m)=>{t.$b("Softmax",f,{axis:m})},1014195:(f,m)=>{t.$b("Concat",f,{axis:m})},1014255:(f,m,v,y,T)=>{t.$b("Split",f,{axis:m,numOutputs:v,splitSizes:y?Array.from((S(),w).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1014411:f=>{t.$b("Expand",f,void 0)},1014465:(f,m)=>{t.$b("Gather",f,{axis:Number(m)})},1014536:(f,m)=>{t.$b("GatherElements",f,{axis:Number(m)})},1014615:(f,m)=>{t.$b("GatherND",f,{batch_dims:Number(m)})},1014694:(f,m,v,y,T,P,N,B,G,Q,le)=>{t.$b("Resize",f,{antialias:m,axes:v?Array.from((S(),w).subarray(Number(v)>>>0,Number(y)>>>0)):[],coordinateTransformMode:Ge(T),cubicCoeffA:P,excludeOutside:N,extrapolationValue:B,keepAspectRatioPolicy:Ge(G),mode:Ge(Q),nearestMode:Ge(le)})},1015056:(f,m,v,y,T,P,N)=>{t.$b("Slice",f,{starts:m?Array.from((S(),w).subarray(Number(m)>>>0,Number(v)>>>0)):[],ends:y?Array.from((S(),w).subarray(Number(y)>>>0,Number(T)>>>0)):[],axes:P?Array.from((S(),w).subarray(Number(P)>>>0,Number(N)>>>0)):[]})},1015320:f=>{t.$b("Tile",f,void 0)},1015372:(f,m,v)=>{t.$b("InstanceNormalization",f,{epsilon:m,format:v?"NHWC":"NCHW"})},1015486:(f,m,v)=>{t.$b("InstanceNormalization",f,{epsilon:m,format:v?"NHWC":"NCHW"})},1015600:f=>{t.$b("Range",f,void 0)},1015653:(f,m)=>{t.$b("Einsum",f,{equation:Ge(m)})},1015734:(f,m,v,y,T)=>{t.$b("Pad",f,{mode:m,value:v,pads:y?Array.from((S(),w).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1015877:(f,m,v,y,T,P)=>{t.$b("BatchNormalization",f,{epsilon:m,momentum:v,spatial:!!T,trainingMode:!!y,format:P?"NHWC":"NCHW"})},1016046:(f,m,v,y,T,P)=>{t.$b("BatchNormalization",f,{epsilon:m,momentum:v,spatial:!!T,trainingMode:!!y,format:P?"NHWC":"NCHW"})},1016215:(f,m,v)=>{t.$b("CumSum",f,{exclusive:Number(m),reverse:Number(v)})},1016312:(f,m,v)=>{t.$b("DequantizeLinear",f,{axis:m,blockSize:v})},1016402:(f,m,v,y,T)=>{t.$b("GridSample",f,{align_corners:m,mode:Ge(v),padding_mode:Ge(y),format:T?"NHWC":"NCHW"})},1016572:(f,m,v,y,T)=>{t.$b("GridSample",f,{align_corners:m,mode:Ge(v),padding_mode:Ge(y),format:T?"NHWC":"NCHW"})},1016742:(f,m)=>{t.$b("ScatterND",f,{reduction:Ge(m)})},1016827:(f,m,v,y,T,P,N,B,G)=>{t.$b("Attention",f,{numHeads:m,isUnidirectional:v,maskFilterValue:y,scale:T,doRotary:P,qkvHiddenSizes:N?Array.from((S(),w).subarray(Number(B)>>>0,Number(B)+N>>>0)):[],pastPresentShareBuffer:!!G})},1017099:f=>{t.$b("BiasAdd",f,void 0)},1017154:f=>{t.$b("BiasSplitGelu",f,void 0)},1017215:f=>{t.$b("FastGelu",f,void 0)},1017271:(f,m,v,y,T,P,N,B,G,Q,le,ve,De,ze,Zt,xo)=>{t.$b("Conv",f,{format:ve?"NHWC":"NCHW",auto_pad:m,dilations:v?Array.from((S(),w).subarray(Number(v)>>>0,Number(y)>>>0)):[],group:T,kernel_shape:P?Array.from((S(),w).subarray(Number(P)>>>0,Number(N)>>>0)):[],pads:B?Array.from((S(),w).subarray(Number(B)>>>0,Number(G)>>>0)):[],strides:Q?Array.from((S(),w).subarray(Number(Q)>>>0,Number(le)>>>0)):[],w_is_const:()=>!!(S(),U)[Number(De)>>>0],activation:Ge(ze),activation_params:Zt?Array.from((S(),F).subarray(Number(Zt)>>>0,Number(xo)>>>0)):[]})},1017855:f=>{t.$b("Gelu",f,void 0)},1017907:(f,m,v,y,T,P,N,B,G)=>{t.$b("GroupQueryAttention",f,{numHeads:m,kvNumHeads:v,scale:y,softcap:T,doRotary:P,rotaryInterleaved:N,smoothSoftmax:B,localWindowSize:G})},1018124:(f,m,v,y)=>{t.$b("LayerNormalization",f,{axis:m,epsilon:v,simplified:!!y})},1018235:(f,m,v,y)=>{t.$b("LayerNormalization",f,{axis:m,epsilon:v,simplified:!!y})},1018346:(f,m,v,y,T,P)=>{t.$b("MatMulNBits",f,{k:m,n:v,accuracyLevel:y,bits:T,blockSize:P})},1018473:(f,m,v,y,T,P)=>{t.$b("MultiHeadAttention",f,{numHeads:m,isUnidirectional:v,maskFilterValue:y,scale:T,doRotary:P})},1018632:(f,m)=>{t.$b("QuickGelu",f,{alpha:m})},1018696:(f,m,v,y,T)=>{t.$b("RotaryEmbedding",f,{interleaved:!!m,numHeads:v,rotaryEmbeddingDim:y,scale:T})},1018835:(f,m,v)=>{t.$b("SkipLayerNormalization",f,{epsilon:m,simplified:!!v})},1018937:(f,m,v)=>{t.$b("SkipLayerNormalization",f,{epsilon:m,simplified:!!v})},1019039:(f,m,v,y)=>{t.$b("GatherBlockQuantized",f,{gatherAxis:m,quantizeAxis:v,blockSize:y})},1019160:f=>{t.Fd(f)},1019194:(f,m)=>t.Hd(Number(f),Number(m),t.Yc.Kd,t.Yc.errors)};function yx(f,m,v){return yl(async()=>{await t.Dd(Number(f),Number(m),Number(v))})}function _x(){return typeof wasmOffsetConverter<"u"}function vx(f,m,v,y){var T=fe();try{return ed(f,m,v,y)}catch(P){if(ce(T),P!==P+0)throw P;be(1,0)}}function wx(f,m,v){var y=fe();try{return Zl(f,m,v)}catch(T){if(ce(y),T!==T+0)throw T;be(1,0)}}function xx(f){var m=fe();try{Wl(f)}catch(v){if(ce(m),v!==v+0)throw v;be(1,0)}}function $x(f,m){var v=fe();try{return vo(f,m)}catch(y){if(ce(v),y!==y+0)throw y;be(1,0)}}function Tx(f,m,v){var y=fe();try{Hl(f,m,v)}catch(T){if(ce(y),T!==T+0)throw T;be(1,0)}}function Sx(f,m){var v=fe();try{td(f,m)}catch(y){if(ce(v),y!==y+0)throw y;be(1,0)}}function Ix(f,m,v,y,T,P,N){var B=fe();try{return Ql(f,m,v,y,T,P,N)}catch(G){if(ce(B),G!==G+0)throw G;be(1,0)}}function Ox(f,m,v,y,T,P){var N=fe();try{Kl(f,m,v,y,T,P)}catch(B){if(ce(N),B!==B+0)throw B;be(1,0)}}function Ex(f,m,v,y){var T=fe();try{Yl(f,m,v,y)}catch(P){if(ce(T),P!==P+0)throw P;be(1,0)}}function Px(f,m,v,y,T){var P=fe();try{Xl(f,m,v,y,T)}catch(N){if(ce(P),N!==N+0)throw N;be(1,0)}}function Ax(f,m,v,y,T,P,N){var B=fe();try{nd(f,m,v,y,T,P,N)}catch(G){if(ce(B),G!==G+0)throw G;be(1,0)}}function kx(f,m,v,y,T,P,N){var B=fe();try{id(f,m,v,y,T,P,N)}catch(G){if(ce(B),G!==G+0)throw G;be(1,0)}}function Dx(f,m,v,y,T,P,N,B){var G=fe();try{ud(f,m,v,y,T,P,N,B)}catch(Q){if(ce(G),Q!==Q+0)throw Q;be(1,0)}}function Nx(f,m,v,y,T){var P=fe();try{return rd(f,m,v,y,T)}catch(N){if(ce(P),N!==N+0)throw N;be(1,0)}}function Cx(f,m,v){var y=fe();try{return ld(f,m,v)}catch(T){if(ce(y),T!==T+0)throw T;be(1,0)}}function zx(f,m,v,y,T,P,N,B){var G=fe();try{dd(f,m,v,y,T,P,N,B)}catch(Q){if(ce(G),Q!==Q+0)throw Q;be(1,0)}}function Rx(f,m,v,y,T,P,N,B,G,Q,le,ve){var De=fe();try{od(f,m,v,y,T,P,N,B,G,Q,le,ve)}catch(ze){if(ce(De),ze!==ze+0)throw ze;be(1,0)}}function Bx(f,m,v,y,T,P){var N=fe();try{return ad(f,m,v,y,T,P)}catch(B){if(ce(N),B!==B+0)throw B;be(1,0)}}function Mx(f,m,v){var y=fe();try{return pd(f,m,v)}catch(T){if(ce(y),T!==T+0)throw T;return be(1,0),0n}}function jx(f,m,v,y,T,P,N,B,G){var Q=fe();try{Jl(f,m,v,y,T,P,N,B,G)}catch(le){if(ce(Q),le!==le+0)throw le;be(1,0)}}function Fx(f){var m=fe();try{return cd(f)}catch(v){if(ce(m),v!==v+0)throw v;be(1,0)}}function Lx(f,m){var v=fe();try{return Od(f,m)}catch(y){if(ce(v),y!==y+0)throw y;return be(1,0),0n}}function Vx(f){var m=fe();try{return hd(f)}catch(v){if(ce(m),v!==v+0)throw v;return be(1,0),0n}}function Ux(f,m,v,y){var T=fe();try{return _d(f,m,v,y)}catch(P){if(ce(T),P!==P+0)throw P;be(1,0)}}function qx(f,m,v,y,T){var P=fe();try{return vd(f,m,v,y,T)}catch(N){if(ce(P),N!==N+0)throw N;be(1,0)}}function Gx(f,m,v,y,T,P){var N=fe();try{return wd(f,m,v,y,T,P)}catch(B){if(ce(N),B!==B+0)throw B;be(1,0)}}function Hx(f,m,v,y,T,P){var N=fe();try{return xd(f,m,v,y,T,P)}catch(B){if(ce(N),B!==B+0)throw B;be(1,0)}}function Wx(f,m,v,y,T,P,N,B){var G=fe();try{return sd(f,m,v,y,T,P,N,B)}catch(Q){if(ce(G),Q!==Q+0)throw Q;be(1,0)}}function Kx(f,m,v,y,T){var P=fe();try{return $d(f,m,v,y,T)}catch(N){if(ce(P),N!==N+0)throw N;return be(1,0),0n}}function Xx(f,m,v,y){var T=fe();try{return Td(f,m,v,y)}catch(P){if(ce(T),P!==P+0)throw P;be(1,0)}}function Zx(f,m,v,y){var T=fe();try{return Sd(f,m,v,y)}catch(P){if(ce(T),P!==P+0)throw P;be(1,0)}}function Jx(f,m,v,y,T,P,N,B,G,Q,le,ve){var De=fe();try{return Id(f,m,v,y,T,P,N,B,G,Q,le,ve)}catch(ze){if(ce(De),ze!==ze+0)throw ze;be(1,0)}}function Qx(f,m,v,y,T,P,N,B,G,Q,le){var ve=fe();try{bd(f,m,v,y,T,P,N,B,G,Q,le)}catch(De){if(ce(ve),De!==De+0)throw De;be(1,0)}}function Yx(f,m,v,y,T,P,N,B,G,Q,le,ve,De,ze,Zt,xo){var n$=fe();try{yd(f,m,v,y,T,P,N,B,G,Q,le,ve,De,ze,Zt,xo)}catch($o){if(ce(n$),$o!==$o+0)throw $o;be(1,0)}}function e$(f,m,v){var y=fe();try{return fd(f,m,v)}catch(T){if(ce(y),T!==T+0)throw T;be(1,0)}}function t$(f,m,v){var y=fe();try{return gd(f,m,v)}catch(T){if(ce(y),T!==T+0)throw T;be(1,0)}}function r$(f,m,v,y){var T=fe();try{md(f,m,v,y)}catch(P){if(ce(T),P!==P+0)throw P;be(1,0)}}function ci(){if(0<Re)tt=ci;else if(u)b?.(t),H();else{for(var f=Ee;0<f.length;)f.shift()(t);0<Re?tt=ci:(t.calledRun=!0,A||(H(),b?.(t)))}}return u||(Ft=await Oe(),ci()),t.PTR_SIZE=4,j?t:new Promise((f,m)=>{b=f,x=m})}var z_,Jc,nS=C(()=>{z_=Zc,Jc=globalThis.self?.name?.startsWith("em-pthread"),Jc&&Zc()}),oa,Ls,Qc,at,R_,yi,Yc,eh,aa,th,sa,B_,ua,M_,gu=C(()=>{fu(),oa=typeof location>"u"?void 0:location.origin,Ls=import.meta.url>"file:"&&import.meta.url<"file;",Qc=()=>{{if(Ls){let e=URL;return new URL(new e("ort.all.bundle.min.mjs",import.meta.url).href,oa).href}return import.meta.url}},at=Qc(),R_=()=>{if(at&&!at.startsWith("blob:"))return at.substring(0,at.lastIndexOf("/")+1)},yi=(e,t)=>{try{let n=t??at;return(n?new URL(e,n):new URL(e)).origin===oa}catch{return!1}},Yc=(e,t)=>{let n=t??at;try{return(n?new URL(e,n):new URL(e)).href}catch{return}},eh=(e,t)=>`${t??"./"}${e}`,aa=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},th=async e=>(await import(e)).default,sa=(rS(),rn(D_)).default,B_=async()=>{if(!at)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(yi(at))return[void 0,sa()];let e=await aa(at);return[e,sa(e)]},ua=(nS(),rn(C_)).default,M_=async(e,t,n,s)=>{let u=ua&&!(e||t);if(u)if(at)u=yi(at)||s&&!n;else if(s&&!n)u=!0;else throw new Error("cannot determine the script source URL.");if(u)return[void 0,ua];{let d="ort-wasm-simd-threaded.jsep.mjs",l=e??Yc(d,t),p=n&&l&&!yi(l,t),o=p?await aa(l):l??eh(d,t);return[p?o:void 0,await th(o)]}}}),la,_i,xn,da,rh,nh,ih,mu,Ce,Gr=C(()=>{gu(),_i=!1,xn=!1,da=!1,rh=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},nh=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},ih=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},mu=async e=>{if(_i)return Promise.resolve();if(xn)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(da)throw new Error("previous call to 'initializeWebAssembly()' failed.");xn=!0;let t=e.initTimeout,n=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!ih())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!nh())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let s=rh();n>1&&!s&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+n+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=n=1);let u=e.wasmPaths,d=typeof u=="string"?u:void 0,l=u?.mjs,p=l?.href??l,o=u?.wasm,r=o?.href??o,i=e.wasmBinary,[a,c]=await M_(p,d,n>1,!!i||!!r),h=!1,g=[];if(t>0&&g.push(new Promise(b=>{setTimeout(()=>{h=!0,b()},t)})),g.push(new Promise((b,x)=>{let $={numThreads:n};if(i)$.wasmBinary=i,$.locateFile=_=>_;else if(r||d)$.locateFile=_=>r??d+_;else if(p&&p.indexOf("blob:")!==0)$.locateFile=_=>new URL(_,p).href;else if(a){let _=R_();_&&($.locateFile=O=>_+O)}c($).then(_=>{xn=!1,_i=!0,la=_,b(),a&&URL.revokeObjectURL(a)},_=>{xn=!1,da=!0,x(_)})})),await Promise.race(g),h)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},Ce=()=>{if(_i&&la)return la;throw new Error("WebAssembly is not initialized yet.")}}),It,Mi,Ie,bu=C(()=>{Gr(),It=(e,t)=>{let n=Ce(),s=n.lengthBytesUTF8(e)+1,u=n._malloc(s);return n.stringToUTF8(e,u,s),t.push(u),u},Mi=(e,t,n,s)=>{if(typeof e=="object"&&e!==null){if(n.has(e))throw new Error("Circular reference in options");n.add(e)}Object.entries(e).forEach(([u,d])=>{let l=t?t+u:u;if(typeof d=="object")Mi(d,l+".",n,s);else if(typeof d=="string"||typeof d=="number")s(l,d.toString());else if(typeof d=="boolean")s(l,d?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof d}`)})},Ie=e=>{let t=Ce(),n=t.stackSave();try{let s=t.PTR_SIZE,u=t.stackAlloc(2*s);t._OrtGetLastError(u,u+s);let d=Number(t.getValue(u,s===4?"i32":"i64")),l=t.getValue(u+s,"*"),p=l?t.UTF8ToString(l):"";throw new Error(`${e} ERROR_CODE: ${d}, ERROR_MESSAGE: ${p}`)}finally{t.stackRestore(n)}}}),j_,iS=C(()=>{Gr(),bu(),j_=e=>{let t=Ce(),n=0,s=[],u=e||{};try{if(e?.logSeverityLevel===void 0)u.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)u.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(u.terminate=!1);let d=0;return e?.tag!==void 0&&(d=It(e.tag,s)),n=t._OrtCreateRunOptions(u.logSeverityLevel,u.logVerbosityLevel,!!u.terminate,d),n===0&&Ie("Can't create run options."),e?.extra!==void 0&&Mi(e.extra,"",new WeakSet,(l,p)=>{let o=It(l,s),r=It(p,s);t._OrtAddRunConfigEntry(n,o,r)!==0&&Ie(`Can't set a run config entry: ${l} - ${p}.`)}),[n,s]}catch(d){throw n!==0&&t._OrtReleaseRunOptions(n),s.forEach(l=>t._free(l)),d}}}),oh,ah,sh,gr,uh,F_,oS=C(()=>{Gr(),bu(),oh=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},ah=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},sh=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(n=>(typeof n=="string"?n:n.name)==="webgpu")&&(e.enableMemPattern=!1)},gr=(e,t,n,s)=>{let u=It(t,s),d=It(n,s);Ce()._OrtAddSessionConfigEntry(e,u,d)!==0&&Ie(`Can't set a session config entry: ${t} - ${n}.`)},uh=async(e,t,n)=>{let s=t.executionProviders;for(let u of s){let d=typeof u=="string"?u:u.name,l=[];switch(d){case"webnn":if(d="WEBNN",gr(e,"session.disable_quant_qdq","1",n),gr(e,"session.disable_qdq_constant_folding","1",n),typeof u!="string"){let a=u?.deviceType;a&&gr(e,"deviceType",a,n)}break;case"webgpu":if(d="JS",typeof u!="string"){let a=u;if(a?.preferredLayout){if(a.preferredLayout!=="NCHW"&&a.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${a.preferredLayout}`);gr(e,"preferredLayout",a.preferredLayout,n)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${d}`)}let p=It(d,n),o=l.length,r=0,i=0;if(o>0){r=Ce()._malloc(o*Ce().PTR_SIZE),n.push(r),i=Ce()._malloc(o*Ce().PTR_SIZE),n.push(i);for(let a=0;a<o;a++)Ce().setValue(r+a*Ce().PTR_SIZE,l[a][0],"*"),Ce().setValue(i+a*Ce().PTR_SIZE,l[a][1],"*")}await Ce()._OrtAppendExecutionProvider(e,p,r,i,o)!==0&&Ie(`Can't append execution provider: ${d}.`)}},F_=async e=>{let t=Ce(),n=0,s=[],u=e||{};sh(u);try{let d=oh(u.graphOptimizationLevel??"all"),l=ah(u.executionMode??"sequential"),p=typeof u.logId=="string"?It(u.logId,s):0,o=u.logSeverityLevel??2;if(!Number.isInteger(o)||o<0||o>4)throw new Error(`log severity level is not valid: ${o}`);let r=u.logVerbosityLevel??0;if(!Number.isInteger(r)||r<0||r>4)throw new Error(`log verbosity level is not valid: ${r}`);let i=typeof u.optimizedModelFilePath=="string"?It(u.optimizedModelFilePath,s):0;if(n=t._OrtCreateSessionOptions(d,!!u.enableCpuMemArena,!!u.enableMemPattern,l,!!u.enableProfiling,0,p,o,r,i),n===0&&Ie("Can't create session options."),u.executionProviders&&await uh(n,u,s),u.enableGraphCapture!==void 0){if(typeof u.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${u.enableGraphCapture}`);gr(n,"enableGraphCapture",u.enableGraphCapture.toString(),s)}if(u.freeDimensionOverrides)for(let[a,c]of Object.entries(u.freeDimensionOverrides)){if(typeof a!="string")throw new Error(`free dimension override name must be a string: ${a}`);if(typeof c!="number"||!Number.isInteger(c)||c<0)throw new Error(`free dimension override value must be a non-negative integer: ${c}`);let h=It(a,s);t._OrtAddFreeDimensionOverride(n,h,c)!==0&&Ie(`Can't set a free dimension override: ${a} - ${c}.`)}return u.extra!==void 0&&Mi(u.extra,"",new WeakSet,(a,c)=>{gr(n,a,c,s)}),[n,s]}catch(d){throw n!==0&&t._OrtReleaseSessionOptions(n)!==0&&Ie("Can't release session options."),s.forEach(l=>t._free(l)),d}}}),Cr,Ut,zr,Qi,ji,yu,_u,Vs,ae=C(()=>{Cr=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},Ut=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},zr=(e,t)=>{let n=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],s=typeof t=="number"?t:t.reduce((u,d)=>u*d,1);return n>0?Math.ceil(s*n):void 0},Qi=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},ji=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},yu=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",_u=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Vs=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),vu,L_=C(()=>{fu(),vu=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let n=t.headers.get("Content-Length"),s=n?parseInt(n,10):0;if(s<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let u=t.body.getReader(),d;try{d=new ArrayBuffer(s)}catch(p){if(p instanceof RangeError){let o=Math.ceil(s/65536);d=new WebAssembly.Memory({initial:o,maximum:o}).buffer}else throw p}let l=0;for(;;){let{done:p,value:o}=await u.read();if(p)break;let r=o.byteLength;new Uint8Array(d,l,r).set(o),l+=r}return new Uint8Array(d,0,s)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),lh,dh,ph,ch,wu,hh,_e,Gt=C(()=>{ae(),lh=["V","I","W","E","F"],dh=(e,t)=>{console.log(`[${lh[e]},${new Date().toISOString()}]${t}`)},wu=(e,t)=>{ph=e,ch=t},hh=(e,t)=>{let n=ji(e),s=ji(ph);n>=s&&dh(n,typeof t=="function"?t():t)},_e=(...e)=>{ch&&hh(...e)}}),fh,on,R,Fi,V_,U_,q_,se=C(()=>{fh=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},on=class{static calcShape(e,t,n=!1){let s=e.length,u=t.length;if(s===0)return t;if(u===0)return e;let d=Math.max(e.length,t.length),l=new Array(d);if(n){if(s<2||u<2)return;let p=fh.calcMatMulShape([e[s-2],e[s-1]],[t[u-2],t[u-1]]);if(p===void 0)return;[l[d-2],l[d-1]]=p}for(let p=n?3:1;p<=d;p++){let o=s-p<0?1:e[s-p],r=u-p<0?1:t[u-p];if(o!==r&&o>1&&r>1)return;let i=Math.max(o,r);if(o&&r)l[d-p]=Math.max(o,r);else{if(i>1)return;l[d-p]=0}}return l}static isValidBroadcast(e,t){let n=e.length,s=t.length;if(n>s)return!1;for(let u=1;u<=n;u++)if(e[n-u]!==1&&e[n-u]!==t[s-u])return!1;return!0}},R=class Di{static size(t){return Di.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,n=4){let s=t.length;if(s===0)return[];let u=new Array(s),d=s-1;for(;d>=0;){if(t[d]%n===0){u[d]=t[d]/n;break}if(n%t[d]!==0)throw new Error("cannot convert shape");u[d]=1,n/=t[d],d--}for(d--;d>=0;d--)u[d]=t[d];return u}static sizeFromDimension(t,n){if(n<0||n>t.length)throw new Error(`invalid dimension of ${n} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Di.getSizeFromDimensionRange(t,n,t.length)}static sizeToDimension(t,n){if(n<0||n>t.length)throw new Error(`invalid dimension of ${n} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Di.getSizeFromDimensionRange(t,0,n)}static getSizeFromDimensionRange(t,n,s){let u=1;for(let d=n;d<s;d++){if(t[d]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");u*=Number(t[d])}return u}static computeStrides(t){let n=t.length;if(n===0)return[];if(n===1)return[1];let s=new Array(n);s[n-1]=1,s[n-2]=t[n-1];for(let u=n-3;u>=0;--u)s[u]=s[u+1]*t[u+1];return s}static normalizeAxis(t,n){if(t<-n&&t>=n)throw new Error("unsupported axis for this operation.");return t<0?t+n:t}static normalizeAxes(t,n){return t.map(s=>this.normalizeAxis(s,n??t.length))}static sortBasedOnPerm(t,n){return n?n.map(s=>t[s]):t.slice().reverse()}static padShape(t,n){let s=t.length;return t.map((u,d)=>u+n[d]+n[d+s])}static areEqual(t,n){return t.length!==n.length?!1:t.every((s,u)=>s===n[u])}},Fi=class Mn{static adjustPoolAttributes(t,n,s,u,d,l){if(!t&&s.length!==n.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let p=0;p<n.length-2;p++)p>=s.length?s.push(n[p+2]):s[p]=n[p+2];for(let p=0;p<s.length;p++)if(p<u.length){if(u[p]<0)throw new Error("strides should be greater than or equal to 1")}else u.push(1);for(let p=0;p<s.length;p++)if(p<d.length){if(d[p]<0)throw new Error("dilations should be greater than or equal to 1")}else d.push(1);for(let p=0;p<s.length*2;p++)if(p<l.length){if(l[p]<0)throw new Error("pad should be greater than or equal to 1")}else l.push(0);for(let p=0;p<s.length;p++){if(s[p]<=0)throw new Error("kernel shapes need to be greater than 0");if(l[p]>=s[p]||l[p+s.length]>=s[p])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,n,s,u,d,l,p){if(p){if(d.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(u.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let o=0;o<t.length-2;o++)Mn.adjustPadAndReturnShape(t[o+(l?1:2)],n[o],s[o],u[o],d,o,o+t.length-2,p)}}static computePoolOutputShape(t,n,s,u,d,l,p){if(n.length<=0)throw new Error("input shape must be of size greater than 0");let o=[n[0],n[1]];return Mn.computeShapeHelper(t,n,o,s,u,d,l,p),o}static computeConvOutputShape(t,n,s,u,d,l,p){if(t.length<=0||n.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let o=[t[0],n[0]];return Mn.computeShapeHelper(!1,t,o,s,u,d,l,p),o}static computeShapeHelper(t,n,s,u,d,l,p,o){if(t)for(let r=0;r<n.length-2;r++)s.push(1);else for(let r=0;r<n.length-2;r++)s.push(Mn.adjustPadAndReturnShape(n[r+2],u[r],d[r],l[r],p,r,r+n.length-2,o))}static adjustPadAndReturnShape(t,n,s,u,d,l,p,o){let r=s*(u-1)+1;if(o&&o!=="NOTSET")switch(o){case"VALID":return d[l]=0,d[p]=0,Math.floor((t-r)/n+1);case"SAME_LOWER":case"SAME_UPPER":if(s!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let i=((t+n-1)/n-1)*n+u-t;return d[l]=Math.floor(o==="SAME_LOWER"?(i+1)/2:i/2),d[p]=i-d[l],Math.floor((t+i-u)/n+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+d[l]+d[p]-r)/n+1)}},V_=class{static getShapeOfGemmResult(e,t,n,s,u){if(e.length!==2||n.length!==2)throw new Error("shape need to be of size 2");let d,l,p;t?(d=e[1],l=e[0]):(d=e[0],l=e[1]);let o=-1;if(s?(p=n[0],o=1):(p=n[1],o=0),n[o]!==l)throw new Error("dimension mismatch");if(d<=0||p<=0||l<=0)throw new Error("invalid shape specified");if(u&&!on.isValidBroadcast(u,[d,p]))throw new Error("gemm: invalid bias shape for broadcast");return[d,p,l]}},U_=-34028234663852886e22,q_=34028234663852886e22}),xu,G_=C(()=>{ae(),xu=(e,t)=>new(Qi(t))(e)}),pa,Us,ca,gh,ha,mh,fa,ga,ma,bh,H_,aS=C(()=>{ae(),Gt(),pa=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),Us=(e,t)=>{if(t==="int32")return e;let n=pa.get(t);if(!n)throw new Error(`WebNN backend does not support data type: ${t}`);let s=n/8;if(e.byteLength%s!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${s}.`);let u=e.byteLength/s,d=new(Qi(t))(e.buffer,e.byteOffset,u);switch(t){case"int64":case"uint64":{let l=new Int32Array(u);for(let p=0;p<u;p++){let o=d[p];if(o>2147483647n||o<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");l[p]=Number(o)}return new Uint8Array(l.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&d.some(p=>p>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let l=Int32Array.from(d,Number);return new Uint8Array(l.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},ca=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let n=e.byteLength/4,s=new Int32Array(e.buffer,e.byteOffset,n);switch(t){case"int64":{let u=BigInt64Array.from(s,BigInt);return new Uint8Array(u.buffer)}case"uint64":{if(s.some(d=>d<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let u=BigUint64Array.from(s,BigInt);return new Uint8Array(u.buffer)}case"int8":{if(s.some(d=>d<-128||d>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let u=Int8Array.from(s,Number);return new Uint8Array(u.buffer)}case"uint8":{if(s.some(u=>u<0||u>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(s,Number)}case"uint32":{if(s.some(d=>d<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let u=Uint32Array.from(s,Number);return new Uint8Array(u.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},gh=1,ha=()=>gh++,mh=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),fa=(e,t)=>{let n=pa.get(e);if(!n)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((s,u)=>s*u)*n/8):0},ga=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:n,tensor:s,dataType:u,shape:d,fallbackDataType:l}=e;this.sessionId=t,this.mlContext=n,this.mlTensor=s,this.dataType=u,this.tensorShape=d,this.fallbackDataType=l}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return fa(this.dataType,this.tensorShape)}destroy(){_e("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),n=ca(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(n);return}else return new Uint8Array(n).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,n){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===n.length&&this.tensorShape.every((s,u)=>s===n[u])}setIsDataConverted(e){this.isDataConverted=e}},ma=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,n,s){let u=this.tensorManager.getMLContext(e),d=this.tensorManager.getMLOpSupportLimits(e),l;if(!d?.input.dataTypes.includes(t)){if(l=mh.get(t),!l||d?.input.dataTypes.includes(l))throw new Error(`WebNN backend does not support data type: ${t}`);_e("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${l}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(u,t,n))return this.wrapper.tensor;if(s){if(this.wrapper.byteLength!==fa(t,n))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let p=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,n,p,!0,!0,l),s&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=Us(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else _e("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.activeUpload){let t=this.wrapper?.isDataConverted?ca(this.activeUpload,this.wrapper?.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t);return}else return t.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},bh=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=ha();return this.tensorTrackersById.set(e,new ma(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,n,s,u){_e("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${n}, shape: ${s}, copyOld: ${u}}`);let d=this.tensorTrackersById.get(t);if(!d)throw new Error("Tensor not found.");return d.ensureTensor(e,n,s,u)}upload(e,t){let n=this.tensorTrackersById.get(e);if(!n)throw new Error("Tensor not found.");n.upload(t)}async download(e,t){_e("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let n=this.tensorTrackersById.get(e);if(!n)throw new Error("Tensor not found.");return n.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,n,s){let u=this.getMLContext(e),d=ha(),l=new ga({sessionId:e,context:u,tensor:t,dataType:n,shape:s});return this.tensorTrackersById.set(d,new ma(this,l)),this.externalTensors.add(l),d}async getCachedTensor(e,t,n,s,u,d,l){let p=this.getMLContext(e);for(let[r,i]of this.freeTensors.entries())if(i.canReuseTensor(p,t,n)){_e("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${l?`fallbackDataType: ${l},`:""} shape: ${n}`);let a=this.freeTensors.splice(r,1)[0];return a.sessionId=e,a}_e("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${l?`fallbackDataType: ${l},`:""} shape: ${n}}`);let o=await p.createTensor({dataType:l??t,shape:n,dimensions:n,usage:s,writable:u,readable:d});return new ga({sessionId:e,context:p,tensor:o,dataType:t,shape:n,fallbackDataType:l})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},H_=(...e)=>new bh(...e)}),$n,yh,W_,sS=C(()=>{ae(),Gr(),G_(),aS(),Gt(),$n=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),yh=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let n=Object.keys(e).sort(),s=Object.keys(t).sort();return n.length===s.length&&n.every((u,d)=>u===s[d]&&e[u]===t[u])},W_=class{constructor(e){this.tensorManager=H_(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,wu(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){_e("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){_e("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let n of t)_e("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${n}}`),this.tensorManager.releaseTensorId(n);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let n=this.mlContextCache.findIndex(s=>s.gpuDevice===e);if(n!==-1)return this.mlContextCache[n].mlContext;{let s=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:s}),s}}else if(e===void 0){let n=this.mlContextCache.findIndex(s=>s.options===void 0&&s.gpuDevice===void 0);if(n!==-1)return this.mlContextCache[n].mlContext;{let s=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:s}),s}}let t=this.mlContextCache.findIndex(n=>yh(n.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let n=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:n}),n}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let n=this.sessionIdsByMLContext.get(t);n||(n=new Set,this.sessionIdsByMLContext.set(t,n)),n.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let n=this.sessionIdsByMLContext.get(t);if(n.delete(e),n.size===0){this.sessionIdsByMLContext.delete(t);let s=this.mlContextCache.findIndex(u=>u.mlContext===t);s!==-1&&this.mlContextCache.splice(s,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){_e("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,n,s,u){let d=$n.get(n);if(!d)throw new Error(`Unsupported ONNX data type: ${n}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,d,s,u)}async createTemporaryTensor(e,t,n){_e("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${n}}`);let s=$n.get(t);if(!s)throw new Error(`Unsupported ONNX data type: ${t}`);let u=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,u,s,n,!1);let d=this.temporarySessionTensorIds.get(e);return d?d.push(u):this.temporarySessionTensorIds.set(e,[u]),u}uploadTensor(e,t){if(!Ce().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");_e("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let n=await this.tensorManager.download(e);return xu(n,t)}}registerMLTensor(e,t,n,s){let u=$n.get(n);if(!u)throw new Error(`Unsupported ONNX data type: ${n}`);let d=this.tensorManager.registerTensor(e,t,u,s);return _e("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${u}, dimensions: ${s}} -> {tensorId: ${d}}`),d}registerMLConstant(e,t,n,s,u,d,l=!1){if(!d)throw new Error("External mounted files are not available.");let p=e;e.startsWith("./")&&(p=e.substring(2));let o=d.get(p);if(!o)throw new Error(`File with name ${p} not found in preloaded files.`);if(t+n>o.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let r=o.slice(t,t+n).buffer,i;switch(u.dataType){case"float32":i=new Float32Array(r);break;case"float16":i=typeof Float16Array<"u"?new Float16Array(r):new Uint16Array(r);break;case"int32":i=new Int32Array(r);break;case"uint32":i=new Uint32Array(r);break;case"int64":if(l){let a=Us(new Uint8Array(r),"int64");i=new Int32Array(a.buffer),u.dataType="int32"}else i=new BigInt64Array(r);break;case"uint64":i=new BigUint64Array(r);break;case"int8":i=new Int8Array(r);break;case"int4":case"uint4":case"uint8":i=new Uint8Array(r);break;default:throw new Error(`Unsupported data type: ${u.dataType} in creating WebNN Constant from external data.`)}return _e("verbose",()=>`[WebNN] registerMLConstant {dataType: ${u.dataType}, shape: ${u.shape}}} ${l?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),s.constant(u,i)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let n=this.sessionGraphInputs.get(e);return n?n.includes(t):!1}isGraphOutput(e,t){let n=this.sessionGraphOutputs.get(e);return n?n.includes(t):!1}isGraphInputOutputTypeSupported(e,t,n=!0){let s=$n.get(Cr(t)),u=this.mlOpSupportLimitsBySessionId.get(e);return typeof s>"u"?!1:n?!!u?.input.dataTypes.includes(s):!!u?.output.dataTypes.includes(s)}flush(){}}}),$u=C(()=>{}),ba,vi,wi,_h,vh,ya,qs,wh,K_,uS=C(()=>{Gt(),$u(),ba=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),vi=[],wi=e=>Math.ceil(Number(e)/16)*16,_h=e=>{for(let t=0;t<vi.length;t++){let n=vi[t];if(e<=n)return n}return Math.ceil(e/16)*16},vh=1,ya=()=>vh++,qs=async(e,t,n,s)=>{let u=wi(n),d=e.device.createBuffer({size:u,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let l=e.getCommandEncoder();e.endComputePass(),l.copyBufferToBuffer(t,0,d,0,u),e.flush(),await d.mapAsync(GPUMapMode.READ);let p=d.getMappedRange();if(s){let o=s();return o.set(new Uint8Array(p,0,n)),o}else return new Uint8Array(p.slice(0,n))}finally{d.destroy()}},wh=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of ba)vi.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let n=t.buffer,s=t.byteOffset,u=t.byteLength,d=wi(u),l=this.storageCache.get(e);if(!l)throw new Error("gpu data for uploading does not exist");if(Number(l.originalSize)!==u)throw new Error(`inconsistent data size. gpu data size=${l.originalSize}, data size=${u}`);let p=this.backend.device.createBuffer({mappedAtCreation:!0,size:d,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),o=p.getMappedRange();new Uint8Array(o).set(new Uint8Array(n,s,u)),p.unmap();let r=this.backend.device.createCommandEncoder();r.copyBufferToBuffer(p,0,l.gpuData.buffer,0,d),this.backend.device.queue.submit([r.finish()]),p.destroy(),_e("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let n=this.storageCache.get(e);if(!n)throw new Error("source gpu data for memcpy does not exist");let s=this.storageCache.get(t);if(!s)throw new Error("destination gpu data for memcpy does not exist");if(n.originalSize!==s.originalSize)throw new Error("inconsistent source and destination gpu data size");let u=wi(n.originalSize),d=this.backend.getCommandEncoder();this.backend.endComputePass(),d.copyBufferToBuffer(n.gpuData.buffer,0,s.gpuData.buffer,0,u)}registerExternalBuffer(e,t,n){let s;if(n){if(s=n[0],e===n[1])return _e("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${s}, buffer is the same, skip.`),s;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else s=ya();return this.storageCache.set(s,{gpuData:{id:s,type:0,buffer:e},originalSize:t}),_e("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${s}, registered.`),s}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),_e("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let n=_h(e),s,u=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,d=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(u||d){let p=(u?this.freeBuffers:this.freeUniformBuffers).get(n);p?p.length>0?s=p.pop():s=this.backend.device.createBuffer({size:n,usage:t}):s=this.backend.device.createBuffer({size:n,usage:t})}else s=this.backend.device.createBuffer({size:n,usage:t});let l={id:ya(),type:0,buffer:s};return this.storageCache.set(l.id,{gpuData:l,originalSize:Number(e)}),_e("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${l.id}`),l}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,n=this.storageCache.get(t);if(!n){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return _e("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${n.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(n.gpuData.buffer),n.originalSize}async download(e,t){let n=this.storageCache.get(Number(e));if(!n)throw new Error("data does not exist");await qs(this.backend,n.gpuData.buffer,n.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=ba.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let n=this.freeBuffers.get(e.size)||[];t===void 0||n.length>=t?e.destroy():n.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let n=this.freeUniformBuffers.get(e.size)||[];t===void 0||n.length>=t?e.destroy():n.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(n=>{n.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(_e("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(n=>{n.gpuData.buffer.destroy()}),this.storageCache=new Map)}},K_=(...e)=>new wh(...e)}),xh,Se,Ve=C(()=>{xh=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},Se=e=>new xh(e)}),an,xi,He,Ye,ne,Fe,Gs,tn,sr,te,Tn,M,ee,X_,Tu,$h,Z_,ue=C(()=>{ae(),se(),an=64,xi=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},He=(e,t=1)=>{let n=xi(e,t);return typeof n=="string"?n:n[0]},Ye=(e,t=1)=>{let n=xi(e,t);return typeof n=="string"?n:n[1]},ne=(...e)=>{let t=[];return e.forEach(n=>{n.length!==0&&t.push({type:12,data:n},{type:12,data:R.computeStrides(n)})}),t},Fe=e=>e%4===0?4:e%2===0?2:1,Gs=(e="f32",t,n="0")=>!t||t===1?`${e}(${n})`:`vec${t}<${e}>(${n})`,tn=(e,t,n)=>e==="f32"?n:t===1?`f32(${n})`:`vec${t}<f32>(${n})`,sr=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,te=(e,t,n,s)=>e.startsWith("uniforms.")&&n>4?typeof t=="string"?s==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:s==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:n>1?`${e}[${t}]`:e,Tn=(e,t,n,s,u)=>{let d=typeof n=="number",l=d?n:n.length,p=[...new Array(l).keys()],o=l<2?"u32":l<=4?`vec${l}<u32>`:`array<u32, ${l}>`,r=xi(t,u),i=typeof r=="string"?r:r[1],a=typeof r=="string"?r:r[0],c={indices:o,value:i,storage:a,tensor:t},h=j=>typeof j=="string"?j:`${j}u`,g={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},b=d?"uniforms.":"",x=`${b}${e}_shape`,$=`${b}${e}_strides`,_="";for(let j=0;j<l-1;j++)_+=`
    let dim${j} = current / ${te($,j,l)};
    let rest${j} = current % ${te($,j,l)};
    indices[${j}] = dim${j};
    current = rest${j};
    `;_+=`indices[${l-1}] = current;`;let O=l<2?"":`
  fn o2i_${e}(offset: u32) -> ${c.indices} {
    var indices: ${c.indices};
    var current = offset;
    ${_}
    return indices;
  }`,I=j=>(g.offsetToIndices=!0,l<2?j:`o2i_${e}(${j})`),E=[];if(l>=2)for(let j=l-1;j>=0;j--)E.push(`${te($,j,l)} * (indices[${j}])`);let A=l<2?"":`
  fn i2o_${e}(indices: ${c.indices}) -> u32 {
    return ${E.join("+")};
  }`,D=j=>(g.indicesToOffset=!0,l<2?j:`i2o_${e}(${j})`),S=(...j)=>l===0?"0u":`${c.indices}(${j.map(h).join(",")})`,L=(j,J)=>l<2?`${j}`:`${te(j,J,l)}`,U=(j,J,H)=>l<2?`${j}=${H};`:`${te(j,J,l)}=${H};`,ie={},K=(j,J)=>{g.broadcastedIndicesToOffset=!0;let H=`${J.name}broadcastedIndicesTo${e}Offset`;if(H in ie)return`${H}(${j})`;let q=[];for(let me=l-1;me>=0;me--){let Oe=J.indicesGet("outputIndices",me+J.rank-l);q.push(`${L($,me)} * (${Oe} % ${L(x,me)})`)}return ie[H]=`fn ${H}(outputIndices: ${J.type.indices}) -> u32 {
             return ${q.length>0?q.join("+"):"0u"};
           }`,`${H}(${j})`},z=(j,J)=>(()=>{if(c.storage===c.value)return`${e}[${j}]=${J};`;if(c.storage==="vec2<u32>"&&c.value==="i32")return`${e}[${j}]=vec2<u32>(u32(${J}), select(0u, 0xFFFFFFFFu, ${J} < 0));`;if(c.storage==="vec2<u32>"&&c.value==="u32")return`${e}[${j}]=vec2<u32>(u32(${J}), 0u);`;if(c.storage==="u32"&&c.value==="vec4<bool>")return`${e}[${j}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${J}));`;throw new Error(`not supported combination of storage type ${c.storage} and value type ${c.value} yet`)})(),w=j=>(()=>{if(c.storage===c.value)return`${e}[${j}]`;if(c.storage==="vec2<u32>"&&c.value==="i32")return`i32(${e}[${j}].x)`;if(c.storage==="vec2<u32>"&&c.value==="u32")return`u32(${e}[${j}].x)`;if(c.storage==="u32"&&c.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${j}] & 0xFFu), bool(${e}[${j}] & 0xFF00u), bool(${e}[${j}] & 0xFF0000u), bool(${e}[${j}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${c.storage} and value type ${c.value} yet`)})(),k=l<2?"":`
  fn get_${e}ByIndices(indices: ${c.indices}) -> ${i} {
    return ${w(`i2o_${e}(indices)`)};
  }`,F=l<2?"":(()=>{let j=p.map(H=>`d${H}: u32`).join(", "),J=p.map(H=>`d${H}`).join(", ");return`
  fn get_${e}(${j}) -> ${i} {
    return get_${e}ByIndices(${S(J)});
  }`})(),W=(...j)=>{if(j.length!==l)throw new Error(`indices length must be ${l}`);let J=j.map(h).join(",");return l===0?w("0u"):l===1?w(J[0]):(g.get=!0,g.getByIndices=!0,g.indicesToOffset=!0,`get_${e}(${J})`)},X=j=>l<2?w(j):(g.getByIndices=!0,g.indicesToOffset=!0,`get_${e}ByIndices(${j})`),Z=l<2?"":`
  fn set_${e}ByIndices(indices: ${c.indices}, value: ${i}) {
    ${z(`i2o_${e}(indices)`,"value")}
  }`,oe=l<2?"":(()=>{let j=p.map(H=>`d${H}: u32`).join(", "),J=p.map(H=>`d${H}`).join(", ");return`
  fn set_${e}(${j}, value: ${i}) {
    set_${e}ByIndices(${S(J)}, value);
  }`})();return{impl:()=>{let j=[],J=!1;return g.offsetToIndices&&(j.push(O),J=!0),g.indicesToOffset&&(j.push(A),J=!0),g.broadcastedIndicesToOffset&&(Object.values(ie).forEach(H=>j.push(H)),J=!0),g.set&&(j.push(oe),J=!0),g.setByIndices&&(j.push(Z),J=!0),g.get&&(j.push(F),J=!0),g.getByIndices&&(j.push(k),J=!0),!d&&J&&j.unshift(`const ${x} = ${c.indices}(${n.join(",")});`,`const ${$} = ${c.indices}(${R.computeStrides(n).join(",")});`),j.join(`
`)},type:c,offsetToIndices:I,indicesToOffset:D,broadcastedIndicesToOffset:K,indices:S,indicesGet:L,indicesSet:U,set:(...j)=>{if(j.length!==l+1)throw new Error(`indices length must be ${l}`);let J=j[l];if(typeof J!="string")throw new Error("value must be string");let H=j.slice(0,l).map(h).join(",");return l===0?z("0u",J):l===1?z(H[0],J):(g.set=!0,g.setByIndices=!0,g.indicesToOffset=!0,`set_${e}(${H}, ${J})`)},setByOffset:z,setByIndices:(j,J)=>l<2?z(j,J):(g.setByIndices=!0,g.indicesToOffset=!0,`set_${e}ByIndices(${j}, ${J});`),get:W,getByOffset:w,getByIndices:X,usage:s,name:e,strides:$,shape:x,rank:l}},M=(e,t,n,s=1)=>Tn(e,t,n,"input",s),ee=(e,t,n,s=1)=>Tn(e,t,n,"output",s),X_=(e,t,n)=>Tn(e,t,n,"atomicOutput",1),Tu=(e,t,n,s=1)=>Tn(e,t,n,"internal",s),$h=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=an){let t=typeof e=="number"?e:e[0],n=typeof e=="number"?1:e[1],s=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||n>this.limits.maxComputeWorkgroupSizeY||s>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${n}, ${s}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*n*s>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${n}, ${s}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let u=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,d=u?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,l=u?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*n*s}u + local_idx;`;return`@compute @workgroup_size(${t}, ${n}, ${s})
  fn main(${d}) {
    ${l}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let n=e.usage==="input"?"read":"read_write",s=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${n}> ${e.name}: array<${s}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,n=1){return this.uniforms.push({name:e,type:t,length:n}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:n,length:s}of this.uniforms)if(s&&s>4)n==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${n}>, ${Math.ceil(s/8)}>`):e.push(`${t}:array<vec4<${n}>, ${Math.ceil(s/4)}>`);else{let u=s==null||s===1?n:`vec${s}<${n}>`;e.push(`${t}:${u}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},Z_=(e,t)=>new $h(e,t)}),Th,_a,Sh,Ih,Oh,Eh,dt,J_,Q_,lr=C(()=>{ae(),se(),Ve(),ue(),Th=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},_a=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),Sh=(e,t)=>R.sortBasedOnPerm(e,_a(e.length,t)),Ih=(e,t,n,s)=>{let u=`fn perm(i: ${s.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`;for(let d=0;d<t;++d)u+=`a[${e[d]}]=i[${d}];`;return u+="return a;}"},Oh=(e,t)=>{let n=[],s=[];for(let u=0;u<e.length;++u)e[u]!==1&&n.push(e[u]),e[t[u]]!==1&&s.push(t[u]);return{newShape:n,newPerm:s}},Eh=(e,t)=>{let n=0;for(let s=0;s<e.length;++s)if(t[e[s]]!==1){if(e[s]<n)return!1;n=e[s]}return!0},dt=(e,t)=>{let n=e.dataType,s=e.dims.length,u=_a(s,t),d=Sh(e.dims,u),l=e.dims,p=d,o=s<2||Eh(u,e.dims),r;if(o)return r=g=>{let b=M("input",n,l,4),x=ee("output",n,p,4);return`
  ${g.registerUniform("output_size","u32").declareVariables(b,x)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let g=R.size(d);return{outputs:[{dims:d,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(g/64/4)},programUniforms:[{type:12,data:Math.ceil(g/4)}]}},getShaderSource:r};let{newShape:i,newPerm:a}=Oh(e.dims,u),c=R.areEqual(a,[2,3,1]),h=R.areEqual(a,[3,1,2]);if(i.length===2||c||h){l=c?[i[0],i[1]*i[2]]:h?[i[0]*i[1],i[2]]:i,p=[l[1],l[0]];let g=16;return r=b=>{let x=M("a",n,l.length),$=ee("output",n,p.length);return`
  ${b.registerUniform("output_size","u32").declareVariables(x,$)}
  var<workgroup> tile : array<array<${$.type.value}, ${g+1}>, ${g}>;
  ${b.mainStart([g,g,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${g} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${g}u + local_id.x;
    let input_row = workgroup_id_x * ${g}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${x.getByIndices(`${x.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${g}u + local_id.x;
    let output_row = workgroup_id_y * ${g}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${$.setByIndices(`${$.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let b=R.size(d);return{outputs:[{dims:d,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(p[1]/g),y:Math.ceil(p[0]/g)},programUniforms:[{type:12,data:b},...ne(l,p)]}},getShaderSource:r}}return r=g=>{let b=M("a",n,l.length),x=ee("output",n,p.length);return`
  ${g.registerUniform("output_size","u32").declareVariables(b,x)}

  ${Ih(u,s,b,x)}

  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${x.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${x.setByOffset("global_idx",b.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let g=R.size(d);return{outputs:[{dims:d,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},...ne(l,p)]}},getShaderSource:r}},J_=(e,t)=>{Th(e.inputs,t.perm),e.compute(dt(e.inputs[0],t.perm))},Q_=e=>Se({perm:e.perm})}),Ph,Ah,kh,Dh,Nh,Ch,zh,Rh,Bh,Mh,vt,Y_,ev,tv,rv,nv,iv,ov,av,sv,uv,lS=C(()=>{ae(),se(),ue(),Su(),lr(),Ph={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},Ah={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},kh={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Dh={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},Nh=(e,t)=>{let n=[];for(let s=t-e;s<t;++s)n.push(s);return n},Ch=(e,t)=>{let n=[],s=e.length;for(let d=0;d<s;d++)t.indexOf(d)===-1&&n.push(e[d]);let u=t.map(d=>e[d]);return[n,u]},zh=(e,t)=>{let n=e.length+t.length,s=[],u=0;for(let d=0;d<n;d++)t.indexOf(d)===-1?s.push(e[u++]):s.push(1);return s},Rh=(e,t)=>{for(let n=0;n<e.length;++n)if(e[e.length-n-1]!==t-1-n)return!1;return!0},Bh=(e,t)=>{let n=[];if(!Rh(e,t)){for(let s=0;s<t;++s)e.indexOf(s)===-1&&n.push(s);e.forEach(s=>n.push(s))}return n},Mh=(e,t,n,s,u,d,l)=>{let p=n[0].dims,o=R.size(d),r=R.size(l),i=M("_A",n[0].dataType,p),a=ee("output",u,d),c=64;o===1&&(c=256);let h=`
          var<workgroup> aBestValues : array<f32, ${c}>;
       `,g=b=>`
        ${b.registerUniform("reduceSize","u32").declareVariables(i,a)}
        ${h}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${b.mainStart(c)}

          let outputIndex = global_idx / ${c};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${kh[s]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${c}) {
           let candidate = f32(${i.getByOffset("offset + k")});
           bestValue = ${Ph[s]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${c}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Ah[s]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${a.setByOffset("outputIndex",`${s==="mean"?`${a.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${a.type.storage}(${Dh[s]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${c}`,inputDependencies:["type"]},getShaderSource:g,getRunData:()=>({outputs:[{dims:d,dataType:u}],dispatchGroup:{x:o},programUniforms:[{type:12,data:r}]})}},vt=(e,t,n,s)=>{let u=e.inputs.length===1?n:Hs(e.inputs,n),d=u.axes;d.length===0&&!u.noopWithEmptyAxes&&(d=e.inputs[0].dims.map((h,g)=>g));let l=R.normalizeAxes(d,e.inputs[0].dims.length),p=l,o=e.inputs[0],r=Bh(p,e.inputs[0].dims.length);r.length>0&&(o=e.compute(dt(e.inputs[0],r),{inputs:[0],outputs:[-1]})[0],p=Nh(p.length,o.dims.length));let[i,a]=Ch(o.dims,p),c=i;u.keepDims&&(c=zh(i,l)),e.compute(Mh(t,u.cacheKey,[o],s,e.inputs[0].dataType,c,a),{inputs:[o]})},Y_=(e,t)=>{vt(e,"ReduceMeanShared",t,"mean")},ev=(e,t)=>{vt(e,"ReduceL1Shared",t,"l1")},tv=(e,t)=>{vt(e,"ReduceL2Shared",t,"l2")},rv=(e,t)=>{vt(e,"ReduceLogSumExpShared",t,"logSumExp")},nv=(e,t)=>{vt(e,"ReduceMaxShared",t,"max")},iv=(e,t)=>{vt(e,"ReduceMinShared",t,"min")},ov=(e,t)=>{vt(e,"ReduceProdShared",t,"prod")},av=(e,t)=>{vt(e,"ReduceSumShared",t,"sum")},sv=(e,t)=>{vt(e,"ReduceSumSquareShared",t,"sumSquare")},uv=(e,t)=>{vt(e,"ReduceLogSumShared",t,"logSum")}}),wt,jh,Li,Hs,xt,Fh,Lh,Vh,Uh,qh,Gh,Hh,Wh,Kh,Xh,$t,lv,dv,pv,cv,hv,fv,gv,mv,bv,yv,Su=C(()=>{ae(),se(),Ve(),ue(),lS(),wt=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},jh=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Li=(e,t,n,s,u,d,l=!1,p=!1)=>{let o=[],r=n[0].dims,i=r.length,a=R.normalizeAxes(u,i),c=!p&&a.length===0;r.forEach((b,x)=>{c||a.indexOf(x)>=0?l&&o.push(1):o.push(b)});let h=o.length,g=R.size(o);return{name:e,shaderCache:t,getShaderSource:b=>{let x=[],$=M("_A",n[0].dataType,i),_=ee("output",d,h),O=s($,_,a),I=O[2];for(let E=0,A=0;E<i;E++)c||a.indexOf(E)>=0?(l&&A++,I=`for(var j${E}: u32 = 0; j${E} < ${r[E]}; j${E}++) {
                  ${O[2].includes("last_index")?`let last_index = j${E};`:""}
                  ${$.indicesSet("input_indices",E,`j${E}`)}
                  ${I}
                }`):(x.push(`${$.indicesSet("input_indices",E,_.indicesGet("output_indices",A))};`),A++);return`

        ${b.registerUniform("output_size","u32").declareVariables($,_)}

        ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${$.type.indices};
          let output_indices = ${_.offsetToIndices("global_idx")};

          ${x.join(`
`)}
          ${O[0]}       // init ops for reduce max/min
          ${O[1]}
          ${I}
          ${O[3]}
          ${O.length===4?_.setByOffset("global_idx","value"):O.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:o,dataType:d}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},...ne(r,o)]})}},Hs=(e,t)=>{let n=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(s=>n.push(Number(s))),Se({axes:n,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},xt=(e,t,n,s)=>{let u=e.inputs,d=u.length===1?n:Hs(u,n);e.compute(Li(t,{hint:d.cacheKey,inputDependencies:["rank"]},[u[0]],d.noopWithEmptyAxes&&d.axes.length===0?jh:s,d.axes,u[0].dataType,d.keepDims,d.noopWithEmptyAxes),{inputs:[0]})},Fh=(e,t)=>{wt(e.inputs),xt(e,"ReduceLogSum",t,(n,s)=>[`var value = ${s.type.storage}(0);`,"",`value += ${n.getByIndices("input_indices")};`,"value = log(value);"])},Lh=(e,t)=>{wt(e.inputs),xt(e,"ReduceL1",t,(n,s)=>[`var value = ${s.type.storage}(0);`,"",`value += abs(${n.getByIndices("input_indices")});`,""])},Vh=(e,t)=>{wt(e.inputs),xt(e,"ReduceL2",t,(n,s)=>[`var t = ${s.type.value}(0); var value = ${s.type.value}(0);`,"",`t = ${n.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Uh=(e,t)=>{wt(e.inputs),xt(e,"ReduceLogSumExp",t,(n,s)=>[`var value = ${s.type.storage}(0);`,"",`value += exp(${n.getByIndices("input_indices")});`,"value = log(value);"])},qh=(e,t)=>{wt(e.inputs),xt(e,"ReduceMax",t,(n,s,u)=>{let d=[];for(let l=0;l<n.rank;l++)(u.indexOf(l)>=0||u.length===0)&&d.push(n.indicesSet("input_indices",l,0));return[`${d.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};`,`value = max(value, ${n.getByIndices("input_indices")});`,""]})},Gh=(e,t)=>{wt(e.inputs),xt(e,"ReduceMean",t,(n,s,u)=>{let d=1;for(let l=0;l<n.rank;l++)(u.indexOf(l)>=0||u.length===0)&&(d*=e.inputs[0].dims[l]);return["var sum = f32(0);","",`sum += f32(${n.getByIndices("input_indices")});`,`let value = ${s.type.value}(sum / ${d});`]})},Hh=(e,t)=>{wt(e.inputs),xt(e,"ReduceMin",t,(n,s,u)=>{let d=[];for(let l=0;l<n.rank;l++)(u.indexOf(l)>=0||u.length===0)&&d.push(`input_indices[${l}] = 0;`);return[`${d.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};`,`value = min(value, ${n.getByIndices("input_indices")});`,""]})},Wh=(e,t)=>{wt(e.inputs),xt(e,"ReduceProd",t,(n,s)=>[`var value = ${s.type.storage}(1);`,"",`value *= ${n.getByIndices("input_indices")};`,""])},Kh=(e,t)=>{wt(e.inputs),xt(e,"ReduceSum",t,(n,s)=>[`var value = ${s.type.storage}(0);`,"",`value += ${n.getByIndices("input_indices")};`,""])},Xh=(e,t)=>{wt(e.inputs),xt(e,"ReduceSumSquare",t,(n,s)=>[`var t = ${s.type.value}(0); var value = ${s.type.value}(0);`,"",`t = ${n.getByIndices("input_indices")}; value += t * t;`,""])},$t=(e,t,n)=>{if(t.length===0)return n;let s=1,u=1;for(let d=0;d<t.length;d++)t.indexOf(d)===-1?s*=e[d]:u*=e[d];return u<32&&s>1024},lv=(e,t)=>{$t(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Gh(e,t):Y_(e,t)},dv=(e,t)=>{$t(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Lh(e,t):ev(e,t)},pv=(e,t)=>{$t(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Vh(e,t):tv(e,t)},cv=(e,t)=>{$t(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Uh(e,t):rv(e,t)},hv=(e,t)=>{$t(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?qh(e,t):nv(e,t)},fv=(e,t)=>{$t(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Hh(e,t):iv(e,t)},gv=(e,t)=>{$t(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Wh(e,t):ov(e,t)},mv=(e,t)=>{$t(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Kh(e,t):av(e,t)},bv=(e,t)=>{$t(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Xh(e,t):sv(e,t)},yv=(e,t)=>{$t(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Fh(e,t):uv(e,t)}}),va,_v,vv,Ws,dS=C(()=>{ae(),Ve(),Su(),va=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},_v=(e,t)=>{va(e.inputs);let n=(s,u,d)=>{let l=[];for(let p=0;p<s.rank;p++)(d.indexOf(p)>=0||d.length===0)&&l.push(`input_indices[${p}] = 0;`);return[`${l.join(`
`)}`,`var value = ${s.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${s.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${s.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",u.setByOffset("global_idx","best_index")]};e.compute(Li("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],n,[t.axis],7,t.keepDims),{inputs:[0]})},vv=(e,t)=>{va(e.inputs);let n=(s,u,d)=>{let l=[];for(let p=0;p<s.rank;p++)(d.indexOf(p)>=0||d.length===0)&&l.push(`input_indices[${p}] = 0;`);return[`${l.join(`
`)}`,`var value = ${s.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${s.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${s.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",u.setByOffset("global_idx","best_index")]};e.compute(Li("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],n,[t.axis],7,t.keepDims),{inputs:[0]})},Ws=e=>Se(e)}),Zh,$i,Jh,Qh,Yh,Xn,ef,wv,Iu=C(()=>{ae(),se(),$u(),ue(),Zh=(e,t)=>{let n=e[0],s=e[1],u=e[2],d=e[3],l=e[4],p=e[5];if(l&&p)throw new Error("Attention cannot have both past and attention_bias");if(n.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let o=n.dims[0],r=n.dims[1],i=n.dims[2];if(u.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(s.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(s.dims[0]!==i)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(u.dims[0]!==s.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let a=u.dims[0]/3,c=a,h=c;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let O of t.qkvHiddenSizes)if(O%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");a=t.qkvHiddenSizes[0],c=t.qkvHiddenSizes[1],h=t.qkvHiddenSizes[2]}let g=r;if(a!==c)throw new Error("qkv_hidden_sizes first element should be same as the second");if(u.dims[0]!==a+c+h)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let b=0;if(l){if(c!==h)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(l.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(l.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(l.dims[1]!==o)throw new Error('Input "past" second dimension must be batch_size');if(l.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(l.dims[4]!==c/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(b=l.dims[3])}let x=g+b,$=-1,_=0;if(d)throw new Error("Mask not supported");if(l)throw new Error("past is not supported");if(p){if(p.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(p.dims[0]!==o||p.dims[1]!==t.numHeads||p.dims[2]!==r||p.dims[3]!==x)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:o,sequenceLength:r,pastSequenceLength:b,kvSequenceLength:g,totalSequenceLength:x,maxSequenceLength:$,inputHiddenSize:i,hiddenSize:a,vHiddenSize:h,headSize:Math.floor(a/t.numHeads),vHeadSize:Math.floor(h/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:_,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},$i=(e,t,n)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${n?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,Jh=(e,t,n,s,u,d,l,p)=>{let o=Fe(l?1:d),r=64,i=d/o;i<r&&(r=32);let a=Math.ceil(d/o/r),c=[{type:12,data:t},{type:12,data:n},{type:12,data:s},{type:12,data:u},{type:12,data:i},{type:12,data:a}],h=He(e.dataType,o),g=Ye(1,o),b=["type"];l&&b.push("type"),p&&b.push("type");let x=$=>{let _=ee("x",e.dataType,e.dims,o),O=[_],I=l?M("seq_lens",l.dataType,l.dims):void 0;I&&O.push(I);let E=p?M("total_sequence_length_input",p.dataType,p.dims):void 0;E&&O.push(E);let A=Ye(e.dataType),D=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${r}>;
  var<workgroup> thread_sum: array<f32, ${r}>;
  ${$.registerUniforms(D).declareVariables(...O)}
  ${$.mainStart([r,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${$i(I,E,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${r}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${l?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${g}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${g}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(o){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${o}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${r}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${g}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${g}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(o){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${o}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${r}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${_.type.value}(${A}(1.0) / ${A}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${g}(x[offset + i]);
        x[offset + i] = ${_.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${l?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${_.type.value}(${A}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${r};${h};${o}`,inputDependencies:b},getShaderSource:x,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:u,z:t*n},programUniforms:c})}},Qh=(e,t,n,s,u,d,l,p,o)=>{let r=l+d.kvSequenceLength,i=[d.batchSize,d.numHeads,d.sequenceLength,r],a=e>1&&s,c=d.kvNumHeads?d.kvNumHeads:d.numHeads,h=a?[d.batchSize,c,r,d.headSize]:void 0,g=d.nReps?d.nReps:1,b=d.scale===0?1/Math.sqrt(d.headSize):d.scale,x=Fe(d.headSize),$=d.headSize/x,_=12,O={x:Math.ceil(r/_),y:Math.ceil(d.sequenceLength/_),z:d.batchSize*d.numHeads},I=[{type:12,data:d.sequenceLength},{type:12,data:$},{type:12,data:r},{type:12,data:d.numHeads},{type:12,data:d.headSize},{type:1,data:b},{type:12,data:l},{type:12,data:d.kvSequenceLength},{type:12,data:g}],E=a&&s&&R.size(s.dims)>0,A=["type","type"];E&&A.push("type"),u&&A.push("type"),p&&A.push("type"),o&&A.push("type");let D=[{dims:i,dataType:t.dataType,gpuDataType:0}];a&&D.push({dims:h,dataType:t.dataType,gpuDataType:0});let S=L=>{let U=M("q",t.dataType,t.dims,x),ie=M("key",n.dataType,n.dims,x),K=[U,ie];if(E){let Z=M("past_key",s.dataType,s.dims,x);K.push(Z)}u&&K.push(M("attention_bias",u.dataType,u.dims));let z=p?M("seq_lens",p.dataType,p.dims):void 0;z&&K.push(z);let w=o?M("total_sequence_length_input",o.dataType,o.dims):void 0;w&&K.push(w);let k=ee("output",t.dataType,i),F=[k];a&&F.push(ee("present_key",t.dataType,h,x));let W=Ye(1,x),X=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${_}u;

  var<workgroup> tileQ: array<${U.type.storage}, ${_*_}>;
  var<workgroup> tileK: array<${U.type.storage}, ${_*_}>;
  ${L.registerUniforms(X).declareVariables(...K,...F)}
  ${L.mainStart([_,_,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${g===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${g===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${$i(z,w,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${E&&a?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${a?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${W}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${E&&a?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${a?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${W}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(x){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${x}`)}})()};
        output[outputIdx] = ${k.type.value} (sum * uniforms.alpha) + ${u?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${x};${u!==void 0};${s!==void 0};${e}`,inputDependencies:A},getRunData:()=>({outputs:D,dispatchGroup:O,programUniforms:I}),getShaderSource:S}},Yh=(e,t,n,s,u,d,l=void 0,p=void 0)=>{let o=d+u.kvSequenceLength,r=u.nReps?u.nReps:1,i=u.vHiddenSize*r,a=e>1&&s,c=u.kvNumHeads?u.kvNumHeads:u.numHeads,h=a?[u.batchSize,c,o,u.headSize]:void 0,g=[u.batchSize,u.sequenceLength,i],b=12,x={x:Math.ceil(u.vHeadSize/b),y:Math.ceil(u.sequenceLength/b),z:u.batchSize*u.numHeads},$=[{type:12,data:u.sequenceLength},{type:12,data:o},{type:12,data:u.vHeadSize},{type:12,data:u.numHeads},{type:12,data:u.headSize},{type:12,data:i},{type:12,data:d},{type:12,data:u.kvSequenceLength},{type:12,data:r}],_=a&&s&&R.size(s.dims)>0,O=["type","type"];_&&O.push("type"),l&&O.push("type"),p&&O.push("type");let I=[{dims:g,dataType:t.dataType,gpuDataType:0}];a&&I.push({dims:h,dataType:t.dataType,gpuDataType:0});let E=A=>{let D=M("probs",t.dataType,t.dims),S=M("v",n.dataType,n.dims),L=[D,S];_&&L.push(M("past_value",s.dataType,s.dims));let U=l?M("seq_lens",l.dataType,l.dims):void 0;l&&L.push(U);let ie=p?M("total_sequence_length_input",p.dataType,p.dims):void 0;p&&L.push(ie);let K=[ee("output",t.dataType,g)];a&&K.push(ee("present_value",t.dataType,h));let z=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;
  var<workgroup> tileQ: array<${D.type.value}, ${b*b}>;
  var<workgroup> tileV: array<${D.type.value}, ${b*b}>;
  ${A.registerUniforms(z).declareVariables(...L,...K)}
  ${A.mainStart([b,b,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${r===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${r===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${$i(U,ie,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${_&&a?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${a?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${D.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${_&&a?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${a?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${s!==void 0};${e}`,inputDependencies:O},getRunData:()=>({outputs:I,dispatchGroup:x,programUniforms:$}),getShaderSource:E}},Xn=(e,t,n,s,u,d,l,p,o,r,i=void 0,a=void 0)=>{let c=Math.min(e.outputCount,1+(l?1:0)+(p?1:0)),h=c>1?l:void 0,g=c>1?p:void 0,b=c>1?r.pastSequenceLength:0,x=b+r.kvSequenceLength,$=o&&R.size(o.dims)>0?o:void 0,_=[t,n];h&&R.size(h.dims)>0&&_.push(h),$&&_.push($),i&&_.push(i),a&&_.push(a);let O=e.compute(Qh(c,t,n,h,$,r,b,i,a),{inputs:_,outputs:c>1?[-1,1]:[-1]})[0];e.compute(Jh(O,r.batchSize,r.numHeads,b,r.sequenceLength,x,i,a),{inputs:i&&a?[O,i,a]:[O],outputs:[]});let I=[O,s];g&&R.size(g.dims)>0&&I.push(g),i&&I.push(i),a&&I.push(a),e.compute(Yh(c,O,s,g,r,b,i,a),{inputs:I,outputs:c>1?[0,2]:[0]})},ef=(e,t)=>{let n=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],s=t.sequenceLength,u=t.inputHiddenSize,d=t.headSize,l=12,p={x:Math.ceil(t.headSize/l),y:Math.ceil(t.sequenceLength/l),z:t.batchSize*t.numHeads},o=[e.inputs[0],e.inputs[1],e.inputs[2]],r=[{type:12,data:s},{type:12,data:u},{type:12,data:d},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],i=a=>{let c=ee("output_q",o[0].dataType,n),h=ee("output_k",o[0].dataType,n),g=ee("output_v",o[0].dataType,n),b=M("input",o[0].dataType,o[0].dims),x=M("weight",o[1].dataType,o[1].dims),$=M("bias",o[2].dataType,o[2].dims),_=b.type.storage,O=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${l}u;
  var<workgroup> tileInput: array<${_}, ${l*l}>;
  var<workgroup> tileWeightQ: array<${_}, ${l*l}>;
  var<workgroup> tileWeightK: array<${_}, ${l*l}>;
  var<workgroup> tileWeightV: array<${_}, ${l*l}>;
  ${a.registerUniforms(O).declareVariables(b,x,$,c,h,g)}
  ${a.mainStart([l,l,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${_}(0);
    var valueK = ${_}(0);
    var valueV = ${_}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:p,programUniforms:r}),getShaderSource:i},{inputs:o,outputs:[-1,-1,-1]})},wv=(e,t)=>{let n=Zh(e.inputs,t),[s,u,d]=ef(e,n);return Xn(e,s,u,d,e.inputs[4],void 0,void 0,void 0,e.inputs[5],n)}}),tf,rf,nf,xv,pS=C(()=>{et(),ae(),se(),Ve(),ue(),tf=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let n=(s,u,d)=>{let l=u.length;if(l!==s.length)throw new Error(`${d}: num dimensions != ${l}`);u.forEach((p,o)=>{if(p!==s[o])throw new Error(`${d}: dim[${o}] do not match`)})};if(e[0].dims.length>1){let s=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);n(e[1].dims,s,"Invalid input scale"),n(e[2].dims,s,"Invalid input B"),n(e[3].dims,s,"Invalid input mean"),n(e[4].dims,s,"Invalid input var")}else n(e[1].dims,[1],"Invalid input scale"),n(e[2].dims,[1],"Invalid input B"),n(e[3].dims,[1],"Invalid input mean"),n(e[4].dims,[1],"Invalid input var")},rf=(e,t)=>{let{epsilon:n,spatial:s,format:u}=t,d=e[0].dims,l=s?Fe(d[d.length-1]):1,p=u==="NHWC"&&d.length>1?l:1,o=R.size(d)/l,r=s,i=r?d.length:d,a=M("x",e[0].dataType,e[0].dims,l),c=M("scale",e[1].dataType,e[1].dims,p),h=M("bias",e[2].dataType,e[2].dims,p),g=M("inputMean",e[3].dataType,e[3].dims,p),b=M("inputVar",e[4].dataType,e[4].dims,p),x=ee("y",e[0].dataType,i,l),$=()=>{let O="";if(s)O=`let cOffset = ${d.length===1?"0u":u==="NHWC"?`outputIndices[${d.length-1}] / ${l}`:"outputIndices[1]"};`;else if(u==="NCHW")O=`
            ${x.indicesSet("outputIndices","0","0")}
            let cOffset = ${x.indicesToOffset("outputIndices")};`;else{O=`var cIndices = ${c.type.indices}(0);
                       cIndices[0] = outputIndices[${d.length-1}];`;for(let I=1;I<c.rank;I++)O+=`cIndices[${I}] = outputIndices[${I}];`;O+=`let cOffset = ${c.indicesToOffset("cIndices")};`}return O},_=O=>`
  const epsilon = ${n};
  ${O.registerUniform("outputSize","u32").declareVariables(a,c,h,g,b,x)}
  ${O.mainStart()}
  ${O.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${x.offsetToIndices(`global_idx * ${l}`)};
    ${$()}
    let scale = ${c.getByOffset("cOffset")};
    let bias = ${h.getByOffset("cOffset")};
    let inputMean = ${g.getByOffset("cOffset")};
    let inputVar = ${b.getByOffset("cOffset")};
    let x = ${a.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${x.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${s}_${l}`,inputDependencies:r?["rank","type","type","type","type"]:void 0},getShaderSource:_,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:r?[{type:12,data:o},...ne(d)]:[{type:12,data:o}]})}},nf=e=>Se(e),xv=(e,t)=>{let{inputs:n,outputCount:s}=e,u=nf({...t,outputCount:s});if(he.webgpu.validateInputContent&&tf(n,u),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(rf(n,u))}}),of,af,$v,cS=C(()=>{se(),ue(),of=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},af=e=>{let t=e[0].dims,n=e[0].dims[2],s=R.size(t)/4,u=e[0].dataType,d=M("input",u,t,4),l=M("bias",u,[n],4),p=M("residual",u,t,4),o=ee("output",u,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)}}),getShaderSource:r=>`
  const channels = ${n}u / 4;
  ${r.declareVariables(d,l,p,o)}

  ${r.mainStart()}
    ${r.guardAgainstOutOfBoundsWorkgroupSizes(s)}
    let value = ${d.getByOffset("global_idx")}
      + ${l.getByOffset("global_idx % channels")} + ${p.getByOffset("global_idx")};
    ${o.setByOffset("global_idx","value")}
  }`}},$v=e=>{of(e.inputs),e.compute(af(e.inputs))}}),sf,xe,Tv,Sv,Iv,Ov,Ev,Pv,Av,kv,Dv,uf,Nv,Cv,zv,Rv,jn,Bv,Ni,Mv,jv,Fv,Lv,Vv,Uv,qv,Gv,Hv,Wv,Kv,Xv,Zv,Jv,Qv,Yv,wa,ew,Ks,Xs,tw,rw,nw,lf,df,iw,Ou=C(()=>{ae(),se(),Ve(),ue(),sf=(e,t,n,s,u,d,l)=>{let p=Math.ceil(t/4),o="";typeof u=="string"?o=`${u}(a)`:o=u("a");let r=M("inputData",n,[p],4),i=ee("outputData",s,[p],4),a=[{name:"vec_size",type:"u32"}];return l&&a.push(...l),`
      ${e.registerUniforms(a).declareVariables(r,i)}

  ${d??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${r.getByOffset("global_idx")};
    ${i.setByOffset("global_idx",o)}
  }`},xe=(e,t,n,s,u,d=e.dataType,l,p)=>{let o=[{type:12,data:Math.ceil(R.size(e.dims)/4)}];return l&&o.push(...l),{name:t,shaderCache:{hint:u,inputDependencies:["type"]},getShaderSource:r=>sf(r,R.size(e.dims),e.dataType,d,n,s,p),getRunData:r=>({outputs:[{dims:e.dims,dataType:d}],dispatchGroup:{x:Math.ceil(R.size(r[0].dims)/64/4)},programUniforms:o})}},Tv=e=>{e.compute(xe(e.inputs[0],"Abs","abs"))},Sv=e=>{e.compute(xe(e.inputs[0],"Acos","acos"))},Iv=e=>{e.compute(xe(e.inputs[0],"Acosh","acosh"))},Ov=e=>{e.compute(xe(e.inputs[0],"Asin","asin"))},Ev=e=>{e.compute(xe(e.inputs[0],"Asinh","asinh"))},Pv=e=>{e.compute(xe(e.inputs[0],"Atan","atan"))},Av=e=>{e.compute(xe(e.inputs[0],"Atanh","atanh"))},kv=e=>Se(e),Dv=(e,t)=>{let n;switch(t.to){case 10:n="vec4<f16>";break;case 1:n="vec4<f32>";break;case 12:n="vec4<u32>";break;case 6:n="vec4<i32>";break;case 9:n="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(xe(e.inputs[0],"Cast",n,void 0,t.cacheKey,t.to))},uf=e=>{let t,n,s=e.length>=2&&e[1].data!==0,u=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=s?e[1].getFloat32Array()[0]:-34028234663852886e22,n=u?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=s?e[1].getUint16Array()[0]:64511,n=u?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return Se({min:t,max:n})},Nv=(e,t)=>{let n=t||uf(e.inputs),s=Ye(e.inputs[0].dataType);e.compute(xe(e.inputs[0],"Clip",u=>`clamp(${u}, vec4<${s}>(uniforms.min), vec4<${s}>(uniforms.max))`,void 0,n.cacheKey,void 0,[{type:e.inputs[0].dataType,data:n.min},{type:e.inputs[0].dataType,data:n.max}],[{name:"min",type:s},{name:"max",type:s}]),{inputs:[0]})},Cv=e=>{e.compute(xe(e.inputs[0],"Ceil","ceil"))},zv=e=>{e.compute(xe(e.inputs[0],"Cos","cos"))},Rv=e=>{e.compute(xe(e.inputs[0],"Cosh","cosh"))},jn=e=>Se(e),Bv=(e,t)=>{let n=Ye(e.inputs[0].dataType);e.compute(xe(e.inputs[0],"Elu",s=>`elu_vf32(${s})`,`
  const elu_alpha_ = ${n}(${t.alpha});

  fn elu_f32(a: ${n}) -> ${n} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${n}>) -> vec4<${n}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Ni=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,Mv=e=>{let t=Ye(e.inputs[0].dataType);e.compute(xe(e.inputs[0],"Erf",n=>`erf_vf32(${n})`,Ni(t)))},jv=e=>{e.compute(xe(e.inputs[0],"Exp","exp"))},Fv=e=>{e.compute(xe(e.inputs[0],"Floor","floor"))},Lv=e=>{let t=Ye(e.inputs[0].dataType);e.compute(xe(e.inputs[0],"Gelu",n=>`0.5 * ${n} * (1.0 + erf_vf32(${n} * 0.7071067811865475))`,Ni(t)))},Vv=(e,t)=>{let n=Ye(e.inputs[0].dataType);e.compute(xe(e.inputs[0],"LeakyRelu",s=>`select(leaky_relu_alpha_ * ${s}, ${s}, ${s} >= vec4<${n}>(0.0))`,`const leaky_relu_alpha_ = ${n}(${t.alpha});`,t.cacheKey))},Uv=e=>{e.compute(xe(e.inputs[0],"Not",t=>`!${t}`))},qv=e=>{e.compute(xe(e.inputs[0],"Neg",t=>`-${t}`))},Gv=e=>{e.compute(xe(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},Hv=e=>{let t=Ye(e.inputs[0].dataType);e.compute(xe(e.inputs[0],"Relu",n=>`select(vec4<${t}>(0.0), ${n}, ${n} > vec4<${t}>(0.0))`))},Wv=e=>{e.compute(xe(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},Kv=e=>Se(e),Xv=(e,t)=>{let n=Ye(e.inputs[0].dataType);e.compute(xe(e.inputs[0],"HardSigmoid",s=>`max(vec4<${n}>(0.0), min(vec4<${n}>(1.0), ${t.alpha} * ${s} + vec4<${n}>(${t.beta})))`,void 0,t.cacheKey))},Zv=e=>{e.compute(xe(e.inputs[0],"Sin","sin"))},Jv=e=>{e.compute(xe(e.inputs[0],"Sinh","sinh"))},Qv=e=>{e.compute(xe(e.inputs[0],"Sqrt","sqrt"))},Yv=e=>{e.compute(xe(e.inputs[0],"Tan","tan"))},wa=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,ew=e=>{e.compute(xe(e.inputs[0],"Tanh",wa))},Ks=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${wa("v")};
}
`,Xs=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,tw=e=>{let t=Ye(e.inputs[0].dataType);e.compute(xe(e.inputs[0],"FastGelu",Xs,Ks(t),void 0,e.inputs[0].dataType))},rw=(e,t)=>{let n=Ye(e.inputs[0].dataType);return e.compute(xe(e.inputs[0],"ThresholdedRelu",s=>`select(vec4<${n}>(0.0), ${s}, ${s} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${n}>(${t.alpha});`,t.cacheKey)),0},nw=e=>{e.compute(xe(e.inputs[0],"Log","log"))},lf=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,df=e=>`quick_gelu_impl(${e})`,iw=(e,t)=>{let n=Ye(e.inputs[0].dataType);e.compute(xe(e.inputs[0],"QuickGelu",df,lf(n,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),pf,cf,ow,hS=C(()=>{se(),ue(),Ou(),pf=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},cf=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let n=M("input",e[0].dataType,e[0].dims,4),s=M("bias",e[0].dataType,[e[0].dims[2]],4),u=ee("output",e[0].dataType,t,4),d=R.size(t)/4,l=He(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)}}),getShaderSource:p=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${p.declareVariables(n,s,u)}

  ${Ni(l)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes(d)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${u.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},ow=e=>{pf(e.inputs),e.compute(cf(e.inputs))}}),hf,ff,Tt,aw,sw,uw,lw,dw,pw,cw,hw,fw,gw,fS=C(()=>{ae(),se(),ue(),hf=(e,t,n,s,u,d,l,p,o,r,i,a)=>{let c,h;typeof p=="string"?c=h=(_,O)=>`${p}((${_}),(${O}))`:typeof p=="function"?c=h=p:(c=p.scalar,h=p.vector);let g=ee("outputData",i,s.length,4),b=M("aData",o,t.length,4),x=M("bData",r,n.length,4),$;if(u)if(d){let _=R.size(t)===1,O=R.size(n)===1,I=t.length>0&&t[t.length-1]%4===0,E=n.length>0&&n[n.length-1]%4===0;_||O?$=g.setByOffset("global_idx",h(_?`${b.type.value}(${b.getByOffset("0")}.x)`:b.getByOffset("global_idx"),O?`${x.type.value}(${x.getByOffset("0")}.x)`:x.getByOffset("global_idx"))):$=`
            let outputIndices = ${g.offsetToIndices("global_idx * 4u")};
            let offsetA = ${b.broadcastedIndicesToOffset("outputIndices",g)};
            let offsetB = ${x.broadcastedIndicesToOffset("outputIndices",g)};
            ${g.setByOffset("global_idx",h(l||I?b.getByOffset("offsetA / 4u"):`${b.type.value}(${b.getByOffset("offsetA / 4u")}[offsetA % 4u])`,l||E?x.getByOffset("offsetB / 4u"):`${x.type.value}(${x.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else $=g.setByOffset("global_idx",h(b.getByOffset("global_idx"),x.getByOffset("global_idx")));else{if(!d)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let _=(O,I,E="")=>{let A=`aData[indexA${I}][componentA${I}]`,D=`bData[indexB${I}][componentB${I}]`;return`
            let outputIndices${I} = ${g.offsetToIndices(`global_idx * 4u + ${I}u`)};
            let offsetA${I} = ${b.broadcastedIndicesToOffset(`outputIndices${I}`,g)};
            let offsetB${I} = ${x.broadcastedIndicesToOffset(`outputIndices${I}`,g)};
            let indexA${I} = offsetA${I} / 4u;
            let indexB${I} = offsetB${I} / 4u;
            let componentA${I} = offsetA${I} % 4u;
            let componentB${I} = offsetB${I} % 4u;
            ${O}[${I}] = ${E}(${c(A,D)});
          `};i===9?$=`
            var data = vec4<u32>(0);
            ${_("data",0,"u32")}
            ${_("data",1,"u32")}
            ${_("data",2,"u32")}
            ${_("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:$=`
            ${_("outputData[global_idx]",0)}
            ${_("outputData[global_idx]",1)}
            ${_("outputData[global_idx]",2)}
            ${_("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(b,x,g)}

        ${a??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${$}
      }`},ff=(e,t,n,s,u,d,l=n.dataType)=>{let p=n.dims.map(Number),o=s.dims.map(Number),r=!R.areEqual(p,o),i=p,a=R.size(p),c=!1,h=!1,g=[r];if(r){let b=on.calcShape(p,o,!1);if(!b)throw new Error("Can't perform binary op on the given tensors");i=b.slice(),a=R.size(i);let x=R.size(p)===1,$=R.size(o)===1,_=p.length>0&&p[p.length-1]%4===0,O=o.length>0&&o[o.length-1]%4===0;g.push(x),g.push($),g.push(_),g.push(O);let I=1;for(let E=1;E<i.length;E++){let A=p[p.length-E],D=o[o.length-E];if(A===D)I*=A;else break}I%4===0?(h=!0,c=!0):(x||$||_||O)&&(c=!0)}else c=!0;return g.push(c),{name:e,shaderCache:{hint:t+g.map(b=>b.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:b=>hf(b,p,o,i,c,r,h,u,n.dataType,s.dataType,l,d),getRunData:()=>({outputs:[{dims:i,dataType:l}],dispatchGroup:{x:Math.ceil(a/64/4)},programUniforms:[{type:12,data:Math.ceil(R.size(i)/4)},...ne(p,o,i)]})}},Tt=(e,t,n,s,u,d)=>{e.compute(ff(t,u??"",e.inputs[0],e.inputs[1],n,s,d))},aw=e=>{Tt(e,"Add",(t,n)=>`${t}+${n}`)},sw=e=>{Tt(e,"Div",(t,n)=>`${t}/${n}`)},uw=e=>{Tt(e,"Equal",{scalar:(t,n)=>`u32(${t}==${n})`,vector:(t,n)=>`vec4<u32>(${t}==${n})`},void 0,void 0,9)},lw=e=>{Tt(e,"Mul",(t,n)=>`${t}*${n}`)},dw=e=>{let t=M("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;Tt(e,"Pow",{scalar:(n,s)=>`pow_custom(${n},${s})`,vector:(n,s)=>`pow_vector_custom(${n},${s})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},pw=e=>{Tt(e,"Sub",(t,n)=>`${t}-${n}`)},cw=e=>{Tt(e,"Greater",{scalar:(t,n)=>`u32(${t}>${n})`,vector:(t,n)=>`vec4<u32>(${t}>${n})`},void 0,void 0,9)},hw=e=>{Tt(e,"Less",{scalar:(t,n)=>`u32(${t}<${n})`,vector:(t,n)=>`vec4<u32>(${t}<${n})`},void 0,void 0,9)},fw=e=>{Tt(e,"GreaterOrEqual",{scalar:(t,n)=>`u32(${t}>=${n})`,vector:(t,n)=>`vec4<u32>(${t}>=${n})`},void 0,void 0,9)},gw=e=>{Tt(e,"LessOrEqual",{scalar:(t,n)=>`u32(${t}<=${n})`,vector:(t,n)=>`vec4<u32>(${t}<=${n})`},void 0,void 0,9)}}),gf,mf,bf,yf,mw,bw,gS=C(()=>{ae(),se(),Ve(),ue(),gf=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let n=0,s=e[n],u=s.dataType,d=s.dims.length;e.forEach((l,p)=>{if(p!==n){if(l.dataType!==u)throw new Error("input tensors should be one type");if(l.dims.length!==d)throw new Error("input tensors should have the same shape");l.dims.forEach((o,r)=>{if(r!==t&&o!==s.dims[r])throw new Error("non concat dimensions must match")})}})},mf=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,bf=(e,t)=>{let n=e.length,s=[];for(let u=0;u<n;++u){let d=t.setByOffset("global_idx",e[u].getByIndices("indices"));n===1?s.push(d):u===0?s.push(`if (inputIndex == ${u}u) { ${d} }`):u===n-1?s.push(`else { ${d} }`):s.push(`else if (inputIndex == ${u}) { ${d} }`)}return s.join(`
`)},yf=(e,t,n,s)=>{let u=R.size(n),d=new Array(e.length),l=new Array(e.length),p=0,o=[],r=[],i=[{type:12,data:u}];for(let b=0;b<e.length;++b)p+=e[b].dims[t],d[b]=p,r.push(e[b].dims.length),l[b]=M(`input${b}`,s,r[b]),o.push("rank"),i.push({type:12,data:d[b]});for(let b=0;b<e.length;++b)i.push(...ne(e[b].dims));i.push(...ne(n));let a=ee("output",s,n.length),c=a.indicesGet("indices",t),h=Array.from(Array(d.length).keys()).map(b=>`uniforms.sizeInConcatAxis${b}`).join(","),g=b=>`

  ${(()=>{b.registerUniform("outputSize","u32");for(let x=0;x<e.length;x++)b.registerUniform(`sizeInConcatAxis${x}`,"u32");return b.declareVariables(...l,a)})()}

  ${mf(d.length,h)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${a.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${c});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${d.length}u>(${h});
      ${c} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${bf(l,a)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:o},getRunData:()=>({outputs:[{dims:n,dataType:s}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:i}),getShaderSource:g}},mw=(e,t)=>{let n=e.inputs,s=n[0].dims,u=R.normalizeAxis(t.axis,s.length);gf(n,u);let d=s.slice();d[u]=n.reduce((p,o)=>p+(o.dims.length>u?o.dims[u]:0),0);let l=n.filter(p=>R.size(p.dims)>0);e.compute(yf(l,u,d,n[0].dataType),{inputs:l})},bw=e=>Se({axis:e.axis})}),Fr,Lr,Vr,Eu,Hr=C(()=>{ae(),se(),Fr=(e,t,n="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${n}(uniforms.clip_min)), ${t}(${n}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${n}(uniforms.alpha) * value + ${n}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${n}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Lr=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Vr=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Eu=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[n,s]=e?.activation_params||[.2,.5];return{activation:t,alpha:n,beta:s}}else if(t==="Clip"){let[n,s]=e?.activation_params||[U_,q_];return{activation:t,clipMax:s,clipMin:n}}else if(t==="LeakyRelu"){let[n]=e?.activation_params||[.01];return{activation:t,alpha:n}}return{activation:t}}}),Xe,yw,Pu=C(()=>{Xe=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},yw=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),_w,mS=C(()=>{_w=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),Gn,Au,ku=C(()=>{ae(),se(),ue(),Hr(),Gn=(e,t,n,s,u)=>{let d=s-n;return`
      ${Array.from({length:n}).map((l,p)=>`
      if (${te(t.shape,p,t.rank)} != 1) {
        ${t.indicesSet(e,p,te(u,p+d,s))}
      } else {
        ${t.indicesSet(e,p,0)}
      }`).join("")}
`},Au=(e,t,n,s,u=!1,d)=>{let l=e[0].dims,p=e[1].dims,o=l[l.length-2],r=p[p.length-1],i=l[l.length-1],a=Fe(r),c=Fe(i),h=Fe(o),g=R.size(n)/a/h,b=e.length>2,x=s?s.slice(0,-2):n.slice(0,-2),$=[R.size(x),o,r],_=[{type:12,data:g},{type:12,data:o},{type:12,data:r},{type:12,data:i}];Lr(t,_),_.push(...ne(x,l,p)),b&&_.push(...ne(e[2].dims)),_.push(...ne($));let O=I=>{let E=Tu("batch_dims",e[0].dataType,x.length),A=M("a",e[0].dataType,l.length,c),D=M("b",e[1].dataType,p.length,a),S=ee("output",e[0].dataType,$.length,a),L=He(S.type.tensor),U=Fr(t,S.type.value,L),ie=[A,D],K="";if(b){let k=u?a:1;ie.push(M("bias",e[2].dataType,e[2].dims.length,k)),K=`${u?`value += bias[col / ${k}];`:`value += ${S.type.value}(bias[row + i]);`}`}let z=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Vr(t,z);let w=()=>{let k=`var a_data: ${A.type.value};`;for(let F=0;F<c;F++)k+=`
              let b_data${F} = b[(b_offset + (k + ${F}) * uniforms.N + col) / ${a}];`;for(let F=0;F<h;F++){k+=`a_data = a[(a_offset + (row + ${F}) * uniforms.K + k) / ${c}];`;for(let W=0;W<c;W++)k+=`
            values[${F}] = fma(${D.type.value}(a_data${c===1?"":`[${W}]`}), b_data${W}, values[${F}]);
`}return k};return`
  ${I.registerUniforms(z).registerInternalVariables(E).declareVariables(...ie,S)}
  ${I.mainStart()}
    ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${a})) * ${a};
    var index1 = global_idx / (uniforms.N / ${a});
    let stride1 = uniforms.M / ${h};
    let row = (index1 % stride1) * ${h};
    let batch = index1 / stride1;

    ${n.length===2?"":`let batch_indices = ${E.offsetToIndices("batch")};`}

    var a_indices: ${A.type.indices};
    ${Gn("a_indices",A,A.rank-2,E.rank,"batch_indices")}
    ${A.indicesSet("a_indices",A.rank-2,0)}
    ${A.indicesSet("a_indices",A.rank-1,0)}
    let a_offset = ${A.indicesToOffset("a_indices")};

    var b_indices: ${D.type.indices};
    ${Gn("b_indices",D,D.rank-2,E.rank,"batch_indices")}
    ${D.indicesSet("b_indices",D.rank-2,0)}
    ${D.indicesSet("b_indices",D.rank-1,0)}
    let b_offset = ${D.indicesToOffset("b_indices")};
    var values: array<${S.type.value}, ${h}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${c}) {
      ${w()}
    }
    for (var i = 0u; i < ${h}u; i++) {
      var value = values[i];
      ${K}
      ${U}
      let cur_indices = ${S.type.indices}(batch, row + i, col);
      let offset = ${S.indicesToOffset("cur_indices")};
      ${S.setByOffset(`offset / ${a}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${a};${c};${h};${u}`,inputDependencies:b?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:d?d(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:_}),getShaderSource:O}}}),_f,vf,Zs,xa,wf,Js,xf,Vi,Du=C(()=>{ae(),se(),ue(),Hr(),ku(),Pu(),_f=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,vf=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Zs=(e,t,n="f32",s,u=!1,d=32,l=!1,p=32)=>{let o=t[1]*e[1],r=t[0]*e[0],i=u?o:d,a=u?d:o,c=i/t[0],h=d/t[1];if(!((u&&c===4&&e[1]===4||!u&&(c===3||c===4))&&i%t[0]===0&&d%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${u} is true, innerElementSize ${c} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${c} must be 3 or 4.
  tileAWidth ${i} must be divisible by workgroupSize[0]${t[0]}. tileInner ${d} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${c}<${n}>, ${i/c}>, ${a}>;
var<workgroup> mm_Bsub: array<array<vec4<${n}>, ${r/e[0]}>, ${d}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${c};
const tileInner = ${d};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${l?"0":"i32(globalId.z)"};
  ${s?`let batchIndices = ${s.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${o};

  let num_tiles = ${l?`${Math.ceil(p/d)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${l?`i32(globalId.z) * ${p}`:"0"};

  var acc: array<vec4<${n}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${h};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${_f(u,s)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${h}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${s?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${c===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${vf(u,c)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},xa=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,wf=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Js=(e,t,n="f32",s,u=!1,d=32,l=!1,p=32,o=!1)=>{let r=e[1]*t[1],i=e[0]*t[0],a=u?r:d,c=u?d:r;if(!(c%t[1]===0&&a%t[0]===0&&d%t[1]===0))throw new Error(`tileAHight ${c} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${a} must be divisible by workgroupSize[0]${t[0]}, tileInner ${d} must be divisible by workgroupSize[1]${t[1]}`);let h=c/t[1],g=a/t[0],b=d/t[1],x=o?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${r};
    let globalColStart = i32(workgroupId.x) * ${i};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${c}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${a}; inputCol = inputCol + ${t[0]}) {
          ${xa(u,s)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${d}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${i}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${s?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${n}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${u?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${r};

let tileRowA = i32(localId.y) * ${h};
let tileColA = i32(localId.x) * ${g};
let tileRowB = i32(localId.y) * ${b};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${h}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${g}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${xa(u,s)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${b}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${s?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${n}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${wf(u)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${n}, ${a}>, ${c}>;
  var<workgroup> mm_Bsub : array<array<${n}, ${i}>, ${d}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${d};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${l?"0":"i32(globalId.z)"};
    ${s?`let batchIndices = ${s.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${l?`${Math.ceil(p/d)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${l?`i32(globalId.z) * ${p}`:"0"};

    var acc : array<array<${n}, colPerThread>, rowPerThread>;
    ${x}
  }
`},xf=(e,t,n,s,u=!1)=>{let[d,l,p,o]=s,r=He(s[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${d.type.indices}) -> ${Xe(e,r)} {
      var value = ${Xe(e,r)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${l.type.indices};
        ${Gn("aIndices",l,l.rank-2,d.rank,"batchIndices")}
        ${l.indicesSet("aIndices",l.rank-2,"u32(row)")}
        ${l.indicesSet("aIndices",l.rank-1,"u32(colIn)")}
        value = ${l.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${d.type.indices}) -> ${Xe(e,r)} {
      var value = ${Xe(e,r)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${p.type.indices};
        ${Gn("bIndices",p,p.rank-2,d.rank,"batchIndices")}
        ${p.indicesSet("bIndices",p.rank-2,"u32(row)")}
        ${p.indicesSet("bIndices",p.rank-1,"u32(colIn)")}
        value = ${p.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Xe(e,r)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${u?"bias[colIn]":`${Xe(e,r)}(bias[row])`};`:""}
        ${n}
        ${o.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Vi=(e,t,n,s,u=!1,d)=>{let l=e[0].dims,p=e[1].dims,o=l.slice(0,-2),r=p.slice(0,-2),i=s?s.slice(0,-2):n.slice(0,-2),a=R.size(i),c=l[l.length-2],h=l[l.length-1],g=p[p.length-1],b=h%4===0&&g%4===0,x=c<=8?[4,1,1]:[4,4,1],$=[8,8,1],_=[Math.ceil(g/$[0]/x[0]),Math.ceil(c/$[1]/x[1]),Math.ceil(a/$[2]/x[2])],O=b?4:1,I=[...o,c,h/O],E=I.length,A=[...r,h,g/O],D=A.length,S=[a,c,g/O],L=[{type:6,data:c},{type:6,data:g},{type:6,data:h}];Lr(t,L),L.push(...ne(i,I,A));let U=["rank","rank"],ie=e.length>2;ie&&(L.push(...ne(e[2].dims)),U.push("rank")),L.push(...ne(S));let K=z=>{let w=i.length,k=Tu("batchDims",e[0].dataType,w,1),F=He(e[0].dataType),W=M("a",e[0].dataType,E,O),X=M("b",e[1].dataType,D,O),Z=ee("result",e[0].dataType,S.length,O),oe=[W,X];if(ie){let me=u?O:1;oe.push(M("bias",e[2].dataType,e[2].dims.length,me))}let j=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Vr(t,j);let J=He(Z.type.tensor),H=Fr(t,Z.type.value,J),q=xf(O,ie,H,[k,W,X,Z],u);return`
  ${z.registerUniforms(j).registerInternalVariables(k).declareVariables(...oe,Z)}
  ${q}
  ${b?Zs(x,$,F,k):Js(x,$,F,k)}
                   `};return{name:"MatMul",shaderCache:{hint:`${x};${t.activation};${b};${u}`,inputDependencies:U},getRunData:()=>({outputs:[{dims:d?d(n):n,dataType:e[0].dataType}],dispatchGroup:{x:_[0],y:_[1],z:_[2]},programUniforms:L}),getShaderSource:K}}}),$f,vw,bS=C(()=>{ae(),Gt(),ue(),Hr(),Pu(),mS(),Du(),$f=(e,t,n,s,u=!1,d,l=4,p=4,o=4,r="f32")=>{let i=L=>{switch(L){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${r}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${L} is not supported.`)}},a=L=>{switch(L){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${L} is not supported.`)}},c=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,h=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,g=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",b=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",x=e?"row":"col",$=e?"col":"row",_=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${x} / outWidth;
    let outCol = ${x} % outWidth;

    let WRow = ${$} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${$} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${$} % inChannels;
    var resData = ${Xe(l,r)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${g} && xCol >= 0 && xCol < ${b}) {
      ${c}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${i(l)}
    }
    return resData;`,O=e?t&&s?`
    let col = colIn * ${l};
    ${_}`:`
    let col = colIn * ${l};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${_}
    }
    return ${Xe(l,r)}(0.0);`:s&&n?`
    let col = colIn * ${l};
    ${_}`:`
    let col = colIn * ${l};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${_}
    }
    return ${Xe(l,r)}(0.0);`,I=e?s&&n?a(p):`
    let col = colIn * ${p};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${a(p)}
    }
    return ${Xe(p,r)}(0.0);`:`
    let col = colIn * ${p};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${a(p)}
    }
    return ${Xe(p,r)}(0.0);`,E=Xe(o,r),A=Xe(e?l:p,r),D=Xe(e?p:l,r),S=Fr(d,E,r);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${A} {
      ${e?O:I}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${D} {
      ${e?I:O}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${E}) {
      let col = colIn * ${o};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${h}
      ${yw(u)}
      ${S}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},vw=(e,t,n,s,u,d,l,p,o)=>{let r=t.format==="NHWC",i=r?e[0].dims[3]:e[0].dims[1],a=n[0],c=r?n[2]:n[3],h=r?n[1]:n[2],g=r?n[3]:n[1],b=r&&(i%4===0||i%3===0)&&g%4===0,x=r?g:c*h,$=r?c*h:g,_=[8,8,1],O=s<=8?[4,1,1]:[4,4,1],I=[Math.ceil(x/_[0]/O[0]),Math.ceil($/_[1]/O[1]),Math.ceil(a/_[2]/O[2])];_e("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${I}`);let E=b?r&&i%4!==0?3:4:1,A=_[1]*O[1],D=_[0]*O[0],S=Math.max(_[0]*E,_[1]),L=s%A===0,U=u%D===0,ie=d%S===0,K=b?[E,4,4]:[1,1,1],z=[{type:6,data:s},{type:6,data:u},{type:6,data:d},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Lr(t,z),z.push(...ne(e[0].dims,e[1].dims));let w=["rank","rank"];l&&(z.push(...ne(e[2].dims)),w.push("rank")),z.push(...ne(n));let k=F=>{let W=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Vr(t,W);let X=b?4:1,Z=He(e[0].dataType),oe=`
      fn setOutputAtIndex(flatIndex : i32, value : ${b?`vec4<${Z}>`:Z}) {
        result[flatIndex] = ${b?`vec4<${Z}>`:Z}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${b?`vec4<${Z}>`:Z}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${b?"/ 4":""}, value);
      }`,j=M("x",e[0].dataType,e[0].dims.length,E===3?1:E),J=M("w",e[1].dataType,e[1].dims.length,X),H=[j,J],q=ee("result",e[0].dataType,n.length,X);if(l){let me=M("bias",e[2].dataType,e[2].dims.length,X);H.push(me),oe+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${b?`vec4<${Z}>`:Z} {
          return bias[coords.${r?"w":"y"}${b?"/ 4":""}];
        }`}return`
        ${_w("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${F.registerUniforms(W).declareVariables(...H,q)}
        ${oe}
        ${$f(r,L,U,ie,l,t,K[0],K[1],K[2],Z)}
        ${b?Zs(O,_,Z,void 0,!r,S):Js(O,_,Z,void 0,!r,S,!1,void 0,p)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${E};${b};${L};${U};${ie};${A};${D};${S}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:o?o(n):n,dataType:e[0].dataType}],dispatchGroup:{x:I[0],y:I[1],z:I[2]},programUniforms:z}),getShaderSource:k}}}),Tf,$a,Sn,Sf,Ta,If,ww,xw,yS=C(()=>{ae(),Gt(),se(),ue(),Hr(),Pu(),Tf=e=>{let t=1;for(let n=0;n<e.length;n++)t*=e[n];return t},$a=e=>typeof e=="number"?[e,e,e]:e,Sn=(e,t)=>t<=1?e:e+(e-1)*(t-1),Sf=(e,t,n,s=1)=>{let u=Sn(t,s);return Math.floor((e[0]*(n-1)-n+u)/2)},Ta=(e,t,n,s,u)=>{u==null&&(u=Sf(e,t[0],s[0]));let d=[0,0,0,n];for(let l=0;l<3;l++)e[l]+2*u>=t[l]&&(d[l]=Math.trunc((e[l]-t[l]+2*u)/s[l]+1));return d},If=(e,t,n,s,u,d,l,p,o,r)=>{let i,a,c,h;if(e==="VALID"&&(e=0),typeof e=="number"){i={top:e,bottom:e,left:e,right:e,front:e,back:e};let g=Ta([t,n,s,1],[p,o,r],1,[u,d,l],e);a=g[0],c=g[1],h=g[2]}else if(Array.isArray(e)){if(!e.every((b,x,$)=>b===$[0]))throw Error(`Unsupported padding parameter: ${e}`);i={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let g=Ta([t,n,s,1],[p,o,r],1,[u,d,l],e[0]);a=g[0],c=g[1],h=g[2]}else if(e==="SAME_UPPER"){a=Math.ceil(t/u),c=Math.ceil(n/d),h=Math.ceil(s/l);let g=(a-1)*u+p-t,b=(c-1)*d+o-n,x=(h-1)*l+r-s,$=Math.floor(g/2),_=g-$,O=Math.floor(b/2),I=b-O,E=Math.floor(x/2),A=x-E;i={top:O,bottom:I,left:E,right:A,front:$,back:_}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:i,outDepth:a,outHeight:c,outWidth:h}},ww=(e,t,n,s,u,d=!1,l="channelsLast")=>{let p,o,r,i,a;if(l==="channelsLast")[p,o,r,i,a]=e;else if(l==="channelsFirst")[p,a,o,r,i]=e;else throw new Error(`Unknown dataFormat ${l}`);let[c,,h,g,b]=t,[x,$,_]=$a(n),[O,I,E]=$a(s),A=Sn(h,O),D=Sn(g,I),S=Sn(b,E),{padInfo:L,outDepth:U,outHeight:ie,outWidth:K}=If(u,o,r,i,x,$,_,A,D,S),z=d?c*a:c,w=[0,0,0,0,0];return l==="channelsFirst"?w=[p,z,U,ie,K]:l==="channelsLast"&&(w=[p,U,ie,K,z]),{batchSize:p,dataFormat:l,inDepth:o,inHeight:r,inWidth:i,inChannels:a,outDepth:U,outHeight:ie,outWidth:K,outChannels:z,padInfo:L,strideDepth:x,strideHeight:$,strideWidth:_,filterDepth:h,filterHeight:g,filterWidth:b,effectiveFilterDepth:A,effectiveFilterHeight:D,effectiveFilterWidth:S,dilationDepth:O,dilationHeight:I,dilationWidth:E,inShape:e,outShape:w,filterShape:t}},xw=(e,t,n,s,u,d)=>{let l=d==="channelsLast";l?e[0].dims[3]:e[0].dims[1];let p=[64,1,1],o={x:n.map((x,$)=>$)},r=[Math.ceil(Tf(o.x.map(x=>n[x]))/p[0]),1,1];_e("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${r}`);let i=1,a=R.size(n),c=[{type:12,data:a},{type:12,data:s},{type:12,data:u},{type:12,data:t.strides},{type:12,data:t.dilations}];Lr(t,c),c.push(...ne(e[0].dims,e[1].dims));let h=["rank","rank"],g=e.length===3;g&&(c.push(...ne(e[2].dims)),h.push("rank")),c.push(...ne(n));let b=x=>{let $=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:s.length},{name:"pads",type:"u32",length:u.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Vr(t,$);let _=1,O=He(e[0].dataType),I=M("x",e[0].dataType,e[0].dims.length,i),E=M("W",e[1].dataType,e[1].dims.length,_),A=[I,E],D=ee("result",e[0].dataType,n.length,_),S="";if(g){let ie=M("bias",e[2].dataType,e[2].dims.length,_);A.push(ie),S+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${O} {
          return bias[${l?te("coords",4,5):te("coords",1,5)}];
        }`}let L=Xe(i,O),U=Fr(t,L,O);return`
            ${S}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${I.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${E.getByIndices("aIndices")};
            }
          ${x.registerUniforms($).declareVariables(...A,D)}
          ${x.mainStart()}
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${D.offsetToIndices("global_idx")};
              let batch = ${te("coords",0,I.rank)};
              let d2 = ${l?te("coords",I.rank-1,I.rank):te("coords",1,I.rank)};
              let xFRCCorner = vec3<u32>(${l?te("coords",1,I.rank):te("coords",2,I.rank)},
              ${l?te("coords",2,I.rank):te("coords",3,I.rank)},
              ${l?te("coords",3,I.rank):te("coords",4,I.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${l?te("uniforms.x_shape",1,I.rank):te("uniforms.x_shape",2,I.rank)};
              let xShapeZ = ${l?te("uniforms.x_shape",2,I.rank):te("uniforms.x_shape",3,I.rank)};
              let xShapeW = ${l?te("uniforms.x_shape",3,I.rank):te("uniforms.x_shape",4,I.rank)};
              let xShapeU = ${l?te("uniforms.x_shape",4,I.rank):te("uniforms.x_shape",1,I.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${l?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${l?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${l?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${l?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${g?"value = value + getBiasByOutputCoords(coords)":""};
              ${U}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${l};${i};${g}`,inputDependencies:h},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:r[0],y:r[1],z:r[2]},programUniforms:c}),getShaderSource:b}}}),$w,Tw,_S=C(()=>{ae(),se(),ue(),Hr(),$w=(e,t,n,s)=>{let u=e.length>2,d=u?"value += b[output_channel];":"",l=e[0].dims,p=e[1].dims,o=t.format==="NHWC",r=o?n[3]:n[1],i=r/t.group,a=o&&i>=4?Fe(r):1,c=R.size(n)/a,h=[{type:12,data:c},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:i}];Lr(t,h),h.push(...ne(l,[p[0],p[1],p[2],p[3]/a]));let g=u?["rank","rank","rank"]:["rank","rank"];h.push(...ne([n[0],n[1],n[2],n[3]/a]));let b=x=>{let $=ee("output",e[0].dataType,n.length,a),_=He($.type.tensor),O=Fr(t,$.type.value,_),I=M("x",e[0].dataType,l.length),E=M("w",e[1].dataType,p.length,a),A=[I,E];u&&A.push(M("b",e[2].dataType,e[2].dims,a));let D=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Vr(t,D);let S=o?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${I.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${E.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${I.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${E.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${x.registerUniforms(D).declareVariables(...A,$)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${$.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${o?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${o?1:2}], outputIndices[${o?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${a} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${o?2:1}];

    var value: ${$.type.value} = ${$.type.value}(0);
    ${S}
    ${d}
    ${O}
    ${$.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${a}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:s?s(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:h}),getShaderSource:b}},Tw=(e,t,n,s)=>{let u=e.length>2,d=Fe(n[3]),l=Fe(n[2]),p=R.size(n)/d/l,o=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/d],r=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/d],i=[n[0],n[1],n[2],n[3]/d],a=[{type:12,data:p},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Lr(t,a),a.push(...ne(o,r,i));let c=(l-1)*t.strides[1]+r[1],h=g=>{let b=ee("output",e[0].dataType,i.length,d),x=He(b.type.tensor),$=Fr(t,b.type.value,x),_=M("x",e[0].dataType,o.length,d),O=M("w",e[1].dataType,r.length,d),I=[_,O];u&&I.push(M("b",e[2].dataType,e[2].dims,d));let E=u?"value += b[output_channel];":"",A=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Vr(t,A),`
  ${g.registerUniforms(A).declareVariables(...I,b)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${l}u;
    let col = (index1 % width1) * ${l}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${_.type.value}, ${c}>;
    var values: array<${b.type.value}, ${l}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${r[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${c}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${_.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${_.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${r[1]}; w_width++) {
          let w_val = ${O.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${l}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${l}u; i++) {
      var value = values[i];
      ${E}
      ${$}
      ${b.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${d};${l};${c};${r[0]};${r[1]}`,inputDependencies:u?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:s?s(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:a}),getShaderSource:h}}}),Of,Ti,Ef,Si,Qs,Sa,Pf,Af,Ys,vS=C(()=>{se(),bS(),yS(),Du(),_S(),Hr(),ku(),lr(),Of=(e,t,n,s,u,d)=>{let l=e[0],p=e.slice(d?1:2,d?3:4),o=p.length,r=t[0],i=t.slice(2).map((c,h)=>c+(c-1)*(n[h]-1)),a=p.map((c,h)=>c+s[h]+s[h+o]).map((c,h)=>Math.floor((c-i[h]+u[h])/u[h]));return a.splice(0,0,l),a.splice(d?3:1,0,r),a},Ti=[2,3,1,0],Ef=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let n=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],s=e[1].dims[1]*t.group;if(n!==s)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let u=e[0].dims.length-2;if(t.dilations.length!==u)throw new Error(`dilations should be ${u}D`);if(t.strides.length!==u)throw new Error(`strides should be ${u}D`);if(t.pads.length!==u*2)throw new Error(`pads should be ${u*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Si=(e,t)=>{let n=e.kernelShape.slice();n.length<t[1].dims.length-2&&n.push(...Array(t[1].dims.length-2-n.length).fill(0));for(let d=2;d<t[1].dims.length;++d)n[d-2]===0&&(n[d-2]=t[1].dims[d]);let s=e.pads.slice();Fi.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,n,s,e.format==="NHWC",e.autoPad);let u=Object.assign({},e);return Object.assign(u,{kernelShape:n,pads:s}),u},Qs=e=>{let t=Eu(e),n=e.format,s=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],u=e.dilations,d=e.group,l=e.kernel_shape,p=e.pads,o=e.strides,r=e.w_is_const();return{autoPad:s,format:n,dilations:u,group:d,kernelShape:l,pads:p,strides:o,wIsConst:r,...t,cacheKey:`${e.format};${t.activation};`}},Sa=(e,t,n,s)=>{let u=n.format==="NHWC",d=Of(t[0].dims,t[1].dims,n.dilations,n.pads,n.strides,u);if(n.group!==1){let A=[t[0]];if(u){let D=e.kernelCustomData.wT??e.compute(dt(t[1],Ti),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=D),A.push(D)}else A.push(t[1]);t.length===3&&A.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&u&&t[1].dims[0]===n.group&&t[1].dims[1]===1&&n.dilations[0]===1&&n.dilations[1]===1?e.compute(Tw(A,n,d,s),{inputs:A}):e.compute($w(A,n,d,s),{inputs:A});return}let l=t.length===3,p=t[0].dims[u?1:2],o=t[0].dims[u?2:3],r=t[0].dims[u?3:1],i=t[1].dims[2],a=t[1].dims[3],c=d[u?1:2],h=d[u?2:3],g=d[u?3:1],b=u&&i===p&&a===o&&n.pads[0]===0&&n.pads[1]===0;if(b||i===1&&a===1&&n.dilations[0]===1&&n.dilations[1]===1&&n.strides[0]===1&&n.strides[1]===1&&n.pads[0]===0&&n.pads[1]===0){let A=d[0],D,S,L,U=[];if(u){let z=e.kernelCustomData.wT??e.compute(dt(t[1],Ti),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];if(n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=z),b){let w=p*o*r;D=t[0].reshape([1,A,w]),S=z.reshape([1,w,g]),L=[1,A,g]}else D=t[0].reshape([A,p*o,r]),S=z.reshape([1,r,g]),L=[A,c*h,g];U.push(D),U.push(S)}else D=t[0].reshape([A,r,p*o]),S=t[1].reshape([1,g,r]),L=[A,g,c*h],U.push(S),U.push(D);l&&U.push(t[2]);let ie=L[2],K=U[0].dims[U[0].dims.length-1];ie<8&&K<8?e.compute(Au(U,n,d,L,u,s),{inputs:U}):e.compute(Vi(U,n,d,L,u,s),{inputs:U});return}let x=!0,$=e.kernelCustomData.wT??e.compute(dt(t[1],Ti),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=$);let _=[t[0],$];l&&_.push(t[2]);let O=u?c*h:g,I=u?g:c*h,E=i*a*r;e.compute(vw(_,n,d,O,I,E,l,x,s),{inputs:_})},Pf=(e,t)=>{let n=t.format==="NHWC",s=[e.inputs[0].reshape(n?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&s.push(e.inputs[2]);let u=[0,t.pads[0],0,t.pads[1]],d=[1].concat(t.strides),l=[1].concat(t.dilations),p=[1].concat(t.kernelShape),o=Si({...t,pads:u,strides:d,dilations:l,kernelShape:p},s);Sa(e,s,o,r=>n?[r[0],r[2],r[3]]:[r[0],r[1],r[3]])},Af=(e,t,n)=>{let s=n.format==="NHWC"?"channelsLast":"channelsFirst",u=Si(n,t),d=n.autoPad==="NOTSET"?n.pads:n.autoPad,l=ww(t[0].dims,t[1].dims,n.strides,n.dilations,d,!1,s);e.compute(xw(t,u,l.outShape,[l.filterDepth,l.filterHeight,l.filterWidth],[l.padInfo.front,l.padInfo.top,l.padInfo.left],s))},Ys=(e,t)=>{if(Ef(e.inputs,t),e.inputs[0].dims.length===3)Pf(e,t);else if(e.inputs[0].dims.length===5)Af(e,e.inputs,t);else{let n=Si(t,e.inputs);Sa(e,e.inputs,n)}}}),Sw,wS=C(()=>{ae(),Gt(),se(),ue(),Sw=(e,t,n)=>{let s=e.length>2,u=t.outputShape,d=t.format==="NHWC",l=t.group,p=e[1].dims,o=p[2]/l,r=p[3],i=d?Fe(o):1,a=d&&r===1&&o>=4,c=a?Math.floor(o/4)*4:Math.floor(o/i)*i,h=o-c,g=d?Fe(r):1,b=d?r===1?i:g:1,x=R.size(u)/g,$=[Math.ceil(x/64),1,1];_e("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${$}`);let _=["rank","rank"],O=[t.strides[0],t.strides[1]],I=[t.kernelShape[d?1:2],t.kernelShape[d?2:3]],E=[t.dilations[0],t.dilations[1]],A=[I[0]+(t.dilations[0]<=1?0:(t.kernelShape[d?1:2]-1)*(t.dilations[0]-1)),I[1]+(t.dilations[1]<=1?0:(t.kernelShape[d?2:3]-1)*(t.dilations[1]-1))],D=[A[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),A[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],S=[{type:12,data:x},{type:12,data:O},{type:12,data:I},{type:12,data:E},{type:12,data:A},{type:6,data:D},{type:12,data:c},{type:12,data:o},{type:12,data:r},...ne(e[0].dims,e[1].dims)];s&&(S.push(...ne(e[2].dims)),_.push("rank")),S.push(...ne(u));let L=U=>{let ie=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:O.length},{name:"filter_dims",type:"u32",length:I.length},{name:"dilations",type:"u32",length:I.length},{name:"effective_filter_dims",type:"u32",length:A.length},{name:"pads",type:"i32",length:D.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],K=He(e[0].dataType),z=d?1:2,w=d?2:3,k=d?3:1,F=M("W",e[1].dataType,e[1].dims.length,b),W=M("Dy",e[0].dataType,e[0].dims.length,i),X=[W,F];s&&X.push(M("bias",e[2].dataType,[u[k]].length,g));let Z=ee("result",e[0].dataType,u.length,g),oe=()=>{let H="";if(a)i===4?H+=`
        let xValue = ${W.getByOffset("x_offset")};
        let wValue = ${F.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:i===2?H+=`
          dotProd = dotProd + dot(vec4<${K}>(${W.getByOffset("x_offset")}, ${W.getByOffset("x_offset + 1u")}), vec4<${K}>(${F.getByOffset("w_offset")}, ${F.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:i===1&&(H+=`
          dotProd = dotProd + dot(vec4<${K}>(${W.getByOffset("x_offset")}, ${W.getByOffset("x_offset + 1u")}, ${W.getByOffset("x_offset + 2u")}, ${W.getByOffset("x_offset + 3u")}), vec4<${K}>(${F.getByOffset("w_offset")}, ${F.getByOffset("w_offset + 1u")}, ${F.getByOffset("w_offset + 2u")}, ${F.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(H+=`
                  let xValue = ${d?W.getByOffset(`${W.indicesToOffset(`${W.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${i}`):W.get("batch","inputChannel","idyR","idyC")};
        `,i===1)H+=`
          let w_offset = ${F.indicesToOffset(`${F.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${F.getByOffset(`w_offset / ${b}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let q=0;q<i;q++)H+=`
            let wValue${q} = ${F.getByOffset(`${F.indicesToOffset(`${F.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${q}, wOutChannel)`)} / ${b}`)};
            dotProd = dotProd + xValue[${q}] * wValue${q};`;return H},j=()=>{if(h===0)return"";if(!a)throw new Error(`packInputAs4 ${a} is not true.`);let H="";if(i===1){H+="dotProd = dotProd";for(let q=0;q<h;q++)H+=`
            + ${W.getByOffset(`x_offset + ${q}`)} * ${F.getByOffset(`w_offset + ${q}`)}`;H+=";"}else if(i===2){if(h!==2)throw new Error(`Invalid inputChannelsRemainder ${h}.`);H+=`
          let xValue = ${W.getByOffset("x_offset")};
          let wValue = ${F.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return H},J=`
            let outputIndices = ${Z.offsetToIndices(`global_idx * ${g}`)};
            let batch = ${Z.indicesGet("outputIndices",0)};
            let d1 = ${Z.indicesGet("outputIndices",k)};
            let r = ${Z.indicesGet("outputIndices",z)};
            let c = ${Z.indicesGet("outputIndices",w)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${Z.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${K}(dyRCorner) + ${K}(wR)) / ${K}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${K}(uniforms.Dy_shape[${z}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${K}(dyCCorner) + ${K}(wC)) / ${K}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${K}(uniforms.Dy_shape[${w}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${a?`
                var x_offset = ${W.indicesToOffset(`${W.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${i};
                var w_offset = ${F.indicesToOffset(`${F.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${b};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${a?4:i}) {
                  ${oe()}
                  inputChannel = inputChannel + ${a?4:i};
                }
                ${j()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${s?` + bias[d1 / ${g}]`:""};
            ${Z.setByOffset("global_idx","value")};
          `;return`
    ${U.registerUniforms(ie).declareVariables(...X,Z)}
      ${U.mainStart()}
      ${U.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${J}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${i}${b}${g}${a}${h}`,inputDependencies:_},getRunData:()=>({dispatchGroup:{x:$[0],y:$[1],z:$[2]},outputs:[{dims:n?n(u):u,dataType:e[0].dataType}],programUniforms:S}),getShaderSource:L}}}),kf,Df,Nf,Ia,Iw,Cf,Oa,zf,Ow,xS=C(()=>{wS(),Hr(),lr(),kf=(e,t,n,s,u,d)=>(e-1)*t+n+(s-1)*u+1-d,Df=(e,t,n,s,u)=>{let d=Math.floor(e/2);t==="SAME_UPPER"?(n[s]=d,n[u]=e-d):t==="SAME_LOWER"&&(n[s]=e-d,n[u]=d)},Nf=(e,t,n,s,u,d,l,p,o,r)=>{let i=e.length-2,a=r.length===0;o.length<i&&o.push(...Array(i-o.length).fill(0));let c=e[0],h=t[p?3:1]*u;for(let g=0,b=e.length-i-(p?1:0);g<i;++g,++b){let x=e[b],$=a?x*l[g]:r[g],_=kf(x,l[g],d[g],t[b],n[g],$);Df(_,s,d,g,g+i),a&&r.push(l[g]*(x-1)+o[g]+(t[b]-1)*n[g]+1-d[g]-d[g+i])}r.splice(0,0,c),r.splice(p?3:1,0,h)},Ia=(e,t)=>{let n=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((a,c)=>a*c,1)===0){n.length=0;for(let a=2;a<t[1].dims.length;++a)n.push(t[1].dims[a])}let s=e.format==="NHWC";n.splice(0,0,t[1].dims[0]),n.splice(s?3:1,0,t[1].dims[1]);let u=e.pads.slice(),d=e.outputShape.slice(),l=e.outputPadding.slice(),p=t[0].dims,o=e.dilations.slice();if(o.reduce((a,c)=>a+c,0)===0){let a=t[0].dims.length-2;o=new Array(a).fill(1)}let r=e.strides.slice();if(r.reduce((a,c)=>a+c,0)===0){let a=t[0].dims.length-2;r=new Array(a).fill(1)}Nf(p,n,o,e.autoPad,e.group,u,r,s,l,d);let i=Object.assign({},e);return Object.assign(i,{kernelShape:n,pads:u,outputPadding:l,outputShape:d,dilations:o,strides:r}),i},Iw=e=>{let t=Eu(e),n=e.format,s=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],u=e.dilations,d=e.group??1,l=e.kernelShape,p=e.pads,o=e.strides,r=e.wIsConst(),i=e.outputPadding,a=e.outputShape;return{autoPad:s,format:n,dilations:u,group:d,kernelShape:l,outputPadding:i,outputShape:a,pads:p,strides:o,wIsConst:r,...t,cacheKey:`${e.format};${t.activation};`}},Cf=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let n=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],s=e[1].dims[0];if(n!==s)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let u=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==u))throw new Error("invalid bias");let d=e[0].dims.length-2;if(t.dilations.reduce((l,p)=>l+p,0)>0&&t.dilations.length!==d)throw new Error(`dilations should be ${d}D`);if(t.strides.reduce((l,p)=>l+p,0)>0&&t.strides.length!==d)throw new Error(`strides should be ${d}D`);if(t.pads.reduce((l,p)=>l+p,0)>0&&t.pads.length!==d*2)throw new Error(`pads should be ${d*2}D`);if(t.outputPadding.length!==d&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${d}D`);if(t.kernelShape.reduce((l,p)=>l+p,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Oa=(e,t,n,s)=>{let u=e.kernelCustomData.wT??e.compute(dt(t[1],[2,3,0,1]),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=u);let d=[t[0],u];t.length===3&&d.push(t[2]),e.compute(Sw(d,n,s),{inputs:d})},zf=(e,t)=>{let n=t.format==="NHWC",s=[e.inputs[0].reshape(n?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&s.push(e.inputs[2]);let u=t.kernelShape;(u.length===0||u[0]===0)&&(u=[e.inputs[1].dims[2]]);let d=t.dilations;(d.length===0||d[0]===0)&&(d=[1]);let l=t.strides;(l.length===0||l[0]===0)&&(l=[1]);let p=t.pads;p.length===0&&(p=[0,0]),p=[0,p[0],0,p[1]],l=[1].concat(l),d=[1].concat(d),u=[1].concat(u);let o=t.outputPadding;o=[0].concat(o);let r=Ia({...t,pads:p,strides:l,dilations:d,kernelShape:u,outputPadding:o},s);Oa(e,s,r,i=>n?[i[0],i[2],i[3]]:[i[0],i[1],i[3]])},Ow=(e,t)=>{if(Cf(e.inputs,t),e.inputs[0].dims.length===3)zf(e,t);else{let n=Ia(t,e.inputs);Oa(e,e.inputs,n)}}}),Rf,Ew,Pw,$S=C(()=>{ae(),se(),Ve(),ue(),Rf=(e,t,n,s)=>{let u=R.size(t),d=t.length,l=M("input",e,d),p=ee("output",e,d),o=n.dataType===6?n.getInt32Array()[0]:Number(n.getBigInt64Array()[0]),r=R.normalizeAxis(o,d),i=a=>{let c=` i32(${l.indicesGet("inputIndices","uniforms.axis")}) `,h=te("uniforms.input_shape","uniforms.axis",d),g=s.reverse?c+(s.exclusive?" + 1":""):"0",b=s.reverse?h:c+(s.exclusive?"":" + 1");return`
                ${a.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(l,p)}
                ${a.mainStart()}
                  ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${p.offsetToIndices("global_idx")};
                  var sum = ${p.type.value}(0);
                  let first : i32 = ${g};
                  let last : i32 = ${b};
                  for (var i : i32 = first; i < last; i++) {
                    ${l.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${l.getByIndices("inputIndices")};
                  }
                  ${p.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:s.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:[{type:12,data:u},{type:12,data:r},...ne(t,t)]}),getShaderSource:i}},Ew=(e,t)=>{let n=e.inputs[0].dims,s=e.inputs[0].dataType,u=e.inputs[1];e.compute(Rf(s,n,u,t),{inputs:[0]})},Pw=e=>{let t=e.exclusive===1,n=e.reverse===1;return Se({exclusive:t,reverse:n})}}),Bf,Mf,jf,Aw,kw,TS=C(()=>{ae(),se(),Ve(),ue(),Bf=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},Mf=(e,t,n,s)=>{let u=[];u.push(`fn perm(i: ${s.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`);for(let d=0;d<t;++d)u.push(n.indicesSet("a",e[d],`i[${d}]`));return u.push("return a;}"),u.join(`
`)},jf=(e,t)=>{let n,s,u,d,l,p,o=t.format==="NHWC",r=t.blocksize,i=t.mode==="DCR";o?([n,s,u,d]=e.dims,l=i?[n,s,u,r,r,d/r**2]:[n,s,u,d/r**2,r,r],p=i?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([n,s,u,d]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],l=i?[n,r,r,d/r**2,s,u]:[n,d/r**2,r,r,s,u],p=i?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let a=e.reshape(l),c=a.dims.length,h=e.dataType,g=M("a",h,c),b=ee("output",h,c),x=$=>`
  ${$.registerUniform("output_size","u32").declareVariables(g,b)}

  ${Mf(p,c,g,b)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${b.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${b.setByOffset("global_idx",g.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:$=>{let _=o?[n,s*r,u*r,d/r**2]:[n,d/r**2,s*r,u*r],O=R.size(_),I=a.dims,E=R.sortBasedOnPerm(I,p);return{outputs:[{dims:_,dataType:$[0].dataType}],dispatchGroup:{x:Math.ceil(O/64)},programUniforms:[{type:12,data:O},...ne(I,E)]}},getShaderSource:x}},Aw=(e,t)=>{Bf(e.inputs),e.compute(jf(e.inputs[0],t))},kw=e=>Se({blocksize:e.blocksize,mode:e.mode,format:e.format})}),Ii,In,Ea,Ff,Lf,Vf,Uf,Pa,qf,Dw,Nw,SS=C(()=>{ae(),se(),Ve(),ue(),Ii="[a-zA-Z]|\\.\\.\\.",In="("+Ii+")+",Ea="^"+In+"$",Ff="("+In+",)*"+In,Lf="^"+Ff+"$",Vf=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let n=this.symbolToIndices.get(e);n===void 0?n=[t]:n.push(t),this.symbolToIndices.set(e,n)}},Uf=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[n,s]=t.includes("->")?t.split("->",2):[t,""];if(!n.match(RegExp(Lf)))throw new Error("Invalid LHS term");if(n.split(",").forEach((u,d)=>{let l=e[d].dims.slice();if(!u.match(RegExp(Ea)))throw new Error("Invalid LHS term");let p=this.processTerm(u,!0,l,d);this.lhs.push(p)}),s==="")s+=[...this.symbolToInfo.entries()].filter(([u,d])=>d.count===1||u==="...").map(([u])=>u).join("");else if(!s.match(RegExp(In)))throw new Error("Invalid RHS");s.match(RegExp(Ii,"g"))?.forEach(u=>{if(u==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let d=this.symbolToInfo.get(u);if(d===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(d.dimValue)}}),this.rhs=this.processTerm(s,!1,this.outputDims)}addSymbol(e,t,n){let s=this.symbolToInfo.get(e);if(s!==void 0){if(s.dimValue!==t&&s.count!==1)throw new Error("Dimension mismatch");s.count++,s.inputIndices.push(n)}else s={count:1,dimValue:t,inputIndices:[n]};this.symbolToInfo.set(e,s)}processTerm(e,t,n,s=-1){let u=n.length,d=!1,l=[],p=0;if(!e.match(RegExp(Ea))&&!t&&e!=="")throw new Error("Invalid LHS term");let o=e.match(RegExp(Ii,"g")),r=new Vf(s);return o?.forEach((i,a)=>{if(i==="..."){if(d)throw new Error("Only one ellipsis is allowed per input term");d=!0;let c=u-o.length+1;if(c<0)throw new Error("Ellipsis out of bounds");if(l=n.slice(p,p+c),this.hasEllipsis){if(this.ellipsisDims.length!==l.length||this.ellipsisDims.toString()!==l.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=l;else throw new Error("Ellipsis must be specified in the LHS");for(let h=0;h<l.length;h++){let g=String.fromCharCode(48+h);r.addSymbol(g,a+h),this.addSymbol(g,n[p++],s)}}else r.addSymbol(i,a+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(i,n[p++],s)}),r}},Pa=e=>e+"_max",qf=(e,t,n,s)=>{let u=e.map(r=>r.length).map((r,i)=>M(`input${i}`,t,r)),d=R.size(s),l=ee("output",t,s.length),p=[...n.symbolToInfo.keys()].filter(r=>!n.rhs.symbolToIndices.has(r)),o=r=>{let i=[],a="var prod = 1.0;",c="var sum = 0.0;",h="sum += prod;",g=[],b=[],x=[],$=[],_=n.symbolToInfo.size===n.rhs.symbolToIndices.size;n.symbolToInfo.forEach((I,E)=>{if(n.rhs.symbolToIndices.has(E)){let A=n.rhs.symbolToIndices.get(E)?.[0];A!==void 0&&n.lhs.forEach((D,S)=>{if(I.inputIndices.includes(S)){let L=D.symbolToIndices.get(E);if(L===void 0)throw new Error("Invalid symbol error");L.forEach(U=>{i.push(`${u[S].indicesSet(`input${S}Indices`,U,l.indicesGet("outputIndices",A))}`)})}})}else n.lhs.forEach((A,D)=>{if(I.inputIndices.includes(D)){let S=A.symbolToIndices.get(E);if(S===void 0)throw new Error("Invalid symbol error");S.forEach(L=>{g.push(`${u[D].indicesSet(`input${D}Indices`,L,`${E}`)}`)}),$.push(`prod *= ${u[D].getByIndices(`input${D}Indices`)};`)}}),b.push(`for(var ${E}: u32 = 0; ${E} < uniforms.${Pa(E)}; ${E}++) {`),x.push("}")});let O=_?[...i,`let sum = ${u.map((I,E)=>I.getByIndices(`input${E}Indices`)).join(" * ")};`]:[...i,c,...b,...g,a,...$,h,...x];return`
            ${r.registerUniforms(p.map(I=>({name:`${Pa(I)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...u,l)}

            ${r.mainStart()}
            ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${l.offsetToIndices("global_idx")};
            ${u.map((I,E)=>`var input${E}Indices: ${u[E].type.indices};`).join(`
`)}
            ${O.join(`
`)};
            ${l.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:n.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let r=p.filter(a=>n.symbolToInfo.has(a)).map(a=>({type:12,data:n.symbolToInfo.get(a)?.dimValue||0}));r.push({type:12,data:d});let i=e.map((a,c)=>[...ne(a)]).reduce((a,c)=>a.concat(c),r);return i.push(...ne(s)),{outputs:[{dims:s,dataType:t}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:i}},getShaderSource:o}},Dw=(e,t)=>{let n=new Uf(e.inputs,t.equation),s=n.outputDims,u=e.inputs.map((d,l)=>d.dims);e.compute(qf(u,e.inputs[0].dataType,n,s))},Nw=e=>{let t=e.equation.replace(/\s+/g,"");return Se({equation:t})}}),Gf,Aa,Hf,Wf,Cw,IS=C(()=>{ae(),se(),ue(),Gf=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,n=Array.from(e[1].getBigInt64Array(),Number),s=n.length<t.length?0:n.length-t.length,u=t.length<n.length?0:t.length-n.length;for(;s<n.length&&u<t.length;++s,++u)if(n[s]!==t[u]&&n[s]!==1&&t[u]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Aa=(e,t)=>{let n=e.length-t.length,s=[];for(let u=0;u<n;++u)s.push(e[u]);for(let u=0;u<t.length;++u)s.push(t[u]===1?e[u+n]:t[u]);return s},Hf=(e,t)=>e.length>t.length?Aa(e,t):Aa(t,e),Wf=e=>{let t=e[0].dims,n=Array.from(e[1].getBigInt64Array(),Number),s=Hf(t,n),u=e[0].dataType,d=u===9||R.size(t)===1,l=u===9||t.length>0&&t[t.length-1]%4===0?4:1,p=d||s.length>0&&s[s.length-1]%4===0?4:1,o=Math.ceil(R.size(s)/p),r=a=>{let c=M("input",u,t.length,l),h=ee("output",u,s.length,p),g;if(u===9){let b=(x,$,_="")=>`
          let outputIndices${$} = ${h.offsetToIndices(`outputOffset + ${$}u`)};
          let offset${$} = ${c.broadcastedIndicesToOffset(`outputIndices${$}`,h)};
          let index${$} = offset${$} / 4u;
          let component${$} = offset${$} % 4u;
          ${x}[${$}] = ${_}(${c.getByOffset(`index${$}`)}[component${$}]);
        `;g=`
        let outputOffset = global_idx * ${p};
        var data = vec4<u32>(0);
        ${b("data",0,"u32")}
        ${b("data",1,"u32")}
        ${b("data",2,"u32")}
        ${b("data",3,"u32")}
        ${h.setByOffset("global_idx","data")}
      }`}else g=`
        let outputIndices = ${h.offsetToIndices(`global_idx * ${p}`)};
        let inputOffset = ${c.broadcastedIndicesToOffset("outputIndices",h)};
        let data = ${h.type.value}(${c.getByOffset(`inputOffset / ${l}`)});
        ${h.setByOffset("global_idx","data")}
      }`;return`
    ${a.registerUniform("vec_size","u32").declareVariables(c,h)}
    ${a.mainStart()}
    ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${g}`},i=[{type:12,data:o},...ne(t,s)];return{name:"Expand",shaderCache:{hint:`${s.length};${l}${p}`,inputDependencies:["rank"]},getShaderSource:r,getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:i})}},Cw=e=>{Gf(e.inputs),e.compute(Wf(e.inputs),{inputs:[0]})}}),Kf,zw,OS=C(()=>{ae(),se(),ue(),Ou(),Kf=e=>{let t=e[0].dataType,n=R.size(e[0].dims),s=R.size(e[1].dims),u=s%4===0,d=l=>{let p=M("x",t,[1],4),o=M("bias",t,[1],4),r=ee("y",t,[1],4),i=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],a=h=>`
      let bias${h}_offset: u32 = (global_idx * 4 + ${h}) % uniforms.bias_size;
      let bias${h} = ${o.getByOffset(`bias${h}_offset / 4`)}[bias${h}_offset % 4];`,c=u?`
      let bias = ${o.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${a(0)}${a(1)}${a(2)}${a(3)}
      let bias = ${p.type.value}(bias0, bias1, bias2, bias3);`;return`${l.registerUniforms(i).declareVariables(p,o,r)}

    ${Ks(Ye(t))}

    ${l.mainStart(an)}
      ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${p.getByOffset("global_idx")};
      ${c}
      let x_in = x + bias;
      ${r.setByOffset("global_idx",Xs("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${u}`,inputDependencies:["type","type"]},getShaderSource:d,getRunData:l=>({outputs:[{dims:l[0].dims,dataType:l[0].dataType}],programUniforms:[{type:12,data:Math.ceil(n/4)},{type:12,data:s}],dispatchGroup:{x:Math.ceil(n/an/4)}})}},zw=e=>{e.inputs.length<2||R.size(e.inputs[1].dims)===0?tw(e):e.compute(Kf(e.inputs))}}),Xf,Zf,Rw,Bw,ES=C(()=>{ae(),se(),Ve(),ue(),Xf=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Zf=(e,t)=>{let n=e[0].dims,s=e[1].dims,u=n.length,d=R.normalizeAxis(t.axis,u),l=n.slice(0);l.splice(d,1,...s);let p=n[d],o=e[0].dataType===9?4:1,r=Math.ceil(R.size(l)/o),i=[{type:12,data:r},{type:6,data:p},{type:12,data:d},...ne(e[0].dims,e[1].dims,l)],a=c=>{let h=M("data",e[0].dataType,e[0].dims.length,o),g=M("inputIndices",e[1].dataType,e[1].dims.length),b=ee("output",e[0].dataType,l.length,o),x=_=>{let O=s.length,I=`var indicesIndices${_}  = ${g.type.indices}(0);`;for(let E=0;E<O;E++)I+=`${O>1?`indicesIndices${_}[${E}]`:`indicesIndices${_}`} = ${l.length>1?`outputIndices${_}[uniforms.axis + ${E}]`:`outputIndices${_}`};`;I+=`
          var idx${_} = ${g.getByIndices(`indicesIndices${_}`)};
          if (idx${_} < 0) {
            idx${_} = idx${_} + uniforms.axisDimLimit;
          }
          var dataIndices${_} : ${h.type.indices};
        `;for(let E=0,A=0;E<u;E++)E===d?(I+=`${u>1?`dataIndices${_}[${E}]`:`dataIndices${_}`} = u32(idx${_});`,A+=O):(I+=`${u>1?`dataIndices${_}[${E}]`:`dataIndices${_}`} = ${l.length>1?`outputIndices${_}[${A}]`:`outputIndices${_}`};`,A++);return I},$;if(e[0].dataType===9){let _=(O,I,E="")=>`
          let outputIndices${I} = ${b.offsetToIndices(`outputOffset + ${I}u`)};
          ${x(I)};
          let offset${I} = ${h.indicesToOffset(`dataIndices${I}`)};
          let index${I} = offset${I} / 4u;
          let component${I} = offset${I} % 4u;
          ${O}[${I}] = ${E}(${h.getByOffset(`index${I}`)}[component${I}]);
        `;$=`
        let outputOffset = global_idx * ${o};
        var value = vec4<u32>(0);
        ${_("value",0,"u32")}
        ${_("value",1,"u32")}
        ${_("value",2,"u32")}
        ${_("value",3,"u32")}
        ${b.setByOffset("global_idx","value")}
      `}else $=`
      let outputIndices = ${b.offsetToIndices("global_idx")};
      ${x("")};
      let value = ${h.getByIndices("dataIndices")};
      ${b.setByOffset("global_idx","value")};
      `;return`
      ${c.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(h,g,b)}
      ${c.mainStart()}
        ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${$}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:l,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(r/64)},programUniforms:i}),getShaderSource:a}},Rw=e=>Se({axis:e.axis}),Bw=(e,t)=>{let n=e.inputs;Xf(n),e.compute(Zf(e.inputs,t))}}),Jf,Mw,jw,PS=C(()=>{ae(),se(),ue(),Jf=(e,t,n,s,u,d,l,p,o)=>{let r=[{type:12,data:d},{type:12,data:s},{type:12,data:u},{type:12,data:n},{type:12,data:l},{type:12,data:p},{type:12,data:o}],i=[d];r.push(...ne(t.dims,i));let a=c=>{let h=M("indices_data",t.dataType,t.dims.length),g=ee("input_slice_offsets_data",12,1,1),b=[h,g],x=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:u.length},{name:"sizes_from_slice_dims_data",type:"u32",length:n.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${c.registerUniforms(x).declareVariables(...b)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${u.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${n.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${u.length}_${n.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:i,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:r}),getShaderSource:a},{inputs:[t],outputs:[-1]})[0]},Mw=(e,t)=>{let n=e.inputs,s=n[0].dims,u=n[0].dataType,d=n[1].dims,l=d[d.length-1],p=R.sizeToDimension(d,d.length-1),o=R.sizeFromDimension(s,t.batchDims+l),r=R.sizeToDimension(s,t.batchDims),i=R.sizeFromDimension(s,t.batchDims),a=p/r,c=new Array(l),h=o;for(let I=0;I<l;++I)c[l-1-I]=h,h*=s[t.batchDims+l-1-I];let g=Jf(e,n[1],c,t.batchDims,s,p,a,i,l),b=t.batchDims+l;if(b>s.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let x=d.slice(0,-1).concat(s.slice(b)),$=R.size(x),_=[{type:12,data:$},{type:12,data:o},...ne(n[0].dims,g.dims,x)],O=I=>{let E=M("data",n[0].dataType,n[0].dims.length),A=M("slice_offsets",12,g.dims.length),D=ee("output",n[0].dataType,x.length);return`
          ${I.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(E,A,D)}
            ${I.mainStart()}
            ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:x,dataType:u}],dispatchGroup:{x:Math.ceil($/64)},programUniforms:_}),getShaderSource:O},{inputs:[n[0],g]})},jw=e=>({batchDims:e.batch_dims,cacheKey:""})}),Qf,Yf,Fw,Lw,AS=C(()=>{ae(),se(),Ve(),ue(),Qf=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let n=R.normalizeAxis(t.quantizeAxis,e[0].dims.length),s=t.blockSize,u=e[0],d=e[2],l=e.length===4?e[3]:void 0;if(d.dims.length!==u.dims.length||!u.dims.map((p,o)=>o===n?Math.ceil(p/s)===d.dims[o]:p===d.dims[o]).reduce((p,o)=>p&&o,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(l){if(l.dataType!==u.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(l.dims.length!==d.dims.length||!l.dims.map((p,o)=>p===d.dims[o]).reduce((p,o)=>p&&o,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Yf=(e,t)=>{let n=e[0].dims,s=e[1].dims,u=n.length,d=R.normalizeAxis(t.gatherAxis,u),l=R.normalizeAxis(t.quantizeAxis,u),p=n.slice(0);p.splice(d,1,...s);let o=R.size(p),r=e[2].dataType,i=e[0].dataType===22,a=[{type:12,data:o},{type:12,data:l},{type:12,data:d},{type:12,data:t.blockSize},...ne(...e.map((h,g)=>h.dims),p)],c=h=>{let g=M("data",e[0].dataType,e[0].dims.length),b=M("inputIndices",e[1].dataType,e[1].dims.length),x=M("scales",e[2].dataType,e[2].dims.length),$=e.length>3?M("zeroPoint",e[3].dataType,e[3].dims.length):void 0,_=ee("output",r,p.length),O=[g,b,x];$&&O.push($);let I=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${h.registerUniforms(I).declareVariables(...O,_)}
        ${h.mainStart()}
        let output_indices = ${_.offsetToIndices("global_idx")};
        var indices_indices = ${b.type.indices}(0);
        ${s.length>1?`
          for (var i: u32 = 0; i < ${s.length}; i++) {
            let index = ${_.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${b.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${_.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${g.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${_.indicesGet("output_indices","i")};
          ${g.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${b.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${n[d]};
        }
        ${g.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${p.length}; i++) {
          let index = ${_.indicesGet("output_indices",`i + ${s.length} - 1`)};
          ${g.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${g.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${g.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${i?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${x.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${x.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${x.getByIndices("scale_indices")};
        ${$?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${$.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${$.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${i?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Ye(r)}(quantized_data - zero_point) * scale;
        ${_.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((h,g)=>g!==1).map(h=>h.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(h,g)=>"rank")},getRunData:()=>({outputs:[{dims:p,dataType:r}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:a}),getShaderSource:c}},Fw=(e,t)=>{let n=e.inputs;Qf(n,t),e.compute(Yf(e.inputs,t))},Lw=e=>Se({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),eg,tg,Vw,Uw,kS=C(()=>{ae(),se(),Ve(),ue(),eg=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},tg=(e,t)=>{let n=e[0].dims,s=e[0].dataType,u=n.length,d=e[1].dims,l=e[1].dataType,p=R.normalizeAxis(t.axis,u),o=n[p],r=d.slice(0),i=R.size(r),a=M("input",s,u),c=M("indicesInput",l,d.length),h=ee("output",s,r.length),g=[{type:12,data:i},{type:6,data:o},{type:12,data:p}];return g.push(...ne(n,d,r)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:g}),getShaderSource:b=>`
      ${b.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(a,c,h)}
      ${b.mainStart()}
      ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${h.offsetToIndices("global_idx")};

      var idx = ${c.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${a.type.indices}(outputIndices);
      ${a.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${a.getByIndices("inputIndices")};

      ${h.setByOffset("global_idx","value")};
  }`}},Vw=e=>Se({axis:e.axis}),Uw=(e,t)=>{let n=e.inputs;eg(n),e.compute(tg(e.inputs,t))}}),rg,ng,qw,Gw,DS=C(()=>{ae(),se(),ue(),rg=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},ng=(e,t)=>{let n=e[0].dims.slice(),s=e[1].dims.slice(),[u,d,l]=V_.getShapeOfGemmResult(n,t.transA,s,t.transB,e.length===3?e[2].dims:void 0),p=[u,d];if(!p)throw new Error("Can't use gemm on the given tensors");let o=16,r=Math.ceil(d/o),i=Math.ceil(u/o),a=!0,c=R.size(p),h=[{type:12,data:a?r:c},{type:12,data:u},{type:12,data:d},{type:12,data:l},{type:1,data:t.alpha},{type:1,data:t.beta}],g=["type","type"];e.length===3&&(h.push(...ne(e[2].dims)),g.push("rank")),h.push(...ne(p));let b=$=>{let _="";t.transA&&t.transB?_="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?_="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?_="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(_="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let O=t.alpha===1?"":"value *= uniforms.alpha;",I=M("a",e[0].dataType,e[0].dims),E=M("b",e[1].dataType,e[1].dims),A=I.type.value,D=null,S=[I,E];e.length===3&&(D=M("c",e[2].dataType,e[2].dims.length),S.push(D));let L=ee("output",e[0].dataType,p.length);S.push(L);let U=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${$.registerUniforms(U).declareVariables(...S)}

  ${$.mainStart()}
    ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${A}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${_}
    }

    ${O}
    ${D!=null?`let cOffset = ${D.broadcastedIndicesToOffset("vec2(m, n)",L)}; value += ${A}(uniforms.beta) * ${D.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},x=$=>{let _=M("a",e[0].dataType,e[0].dims),O=M("b",e[1].dataType,e[1].dims),I=null,E=[_,O];e.length===3&&(I=M("c",e[2].dataType,e[2].dims.length),E.push(I));let A=ee("output",e[0].dataType,p.length);E.push(A);let D=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],S="",L="";t.transA&&t.transB?(L=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${_.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${O.type.value}(0);
      }
      `,S="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(L=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${_.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${O.type.value}(0);
      }
      `,S="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(L=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${_.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${O.type.value}(0);
      }
      `,S="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(L=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${_.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${O.type.value}(0);
      }
      `,S="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let U=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${$.registerUniforms(D).declareVariables(...E)}
  var<workgroup> tile_a: array<array<${_.type.storage}, ${o}>, ${o}>;
  var<workgroup> tile_b: array<array<${O.type.storage}, ${o}>, ${o}>;
  ${$.mainStart([o,o,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${o};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${o};
    let num_tiles = (uniforms.K - 1) / ${o} + 1;
    var k_start = 0u;
    var value = ${A.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${L}
      k_start = k_start + ${o};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${o}; k++) {
        ${S}
      }
      workgroupBarrier();
    }

    ${U}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${I!=null?`let cOffset = ${I.broadcastedIndicesToOffset("vec2(m, n)",A)}; value += ${A.type.value}(uniforms.beta) * ${I.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return a?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:p,dataType:e[0].dataType}],dispatchGroup:{x:r*i},programUniforms:h}),getShaderSource:x}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:p,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:h}),getShaderSource:b}},qw=e=>{let t=e.transA,n=e.transB,s=e.alpha,u=e.beta;return{transA:t,transB:n,alpha:s,beta:u,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Gw=(e,t)=>{rg(e.inputs),e.compute(ng(e.inputs,t))}}),Ct,Vt,mr,br,ig,og,ag,sg,ug,lg,dg,pg,Hw,Ww,NS=C(()=>{ae(),se(),Ve(),ue(),[Ct,Vt,mr,br]=[0,1,2,3],ig=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},og=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,ag=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,sg=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,ug=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,lg=(e,t,n)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${Ct}] = batch;
     indices[${Vt}] = channel;`+(()=>{switch(n.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${mr}] = u32(r);
            indices[${br}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${mr}] = u32(clamp(r, 0, H - 1));
          indices[${br}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${mr}] = gs_reflect(r, border[1], border[3]);
          indices[${br}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${n.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,dg=(e,t,n)=>(()=>{switch(n.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${Ct}], indices[${Vt}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${Ct}], indices[${Vt}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${Ct}], indices[${Vt}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${Ct}], indices[${Vt}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${Ct}], indices[${Vt}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${Ct}], indices[${Vt}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${n.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,pg=(e,t)=>{let n=M("x",e[0].dataType,e[0].dims.length),s=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],u=M("grid",e[1].dataType,s.length,2),d=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(d=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[Ct,Vt,mr,br]=[0,3,1,2]);let l=ee("output",e[0].dataType,d.length),p=n.type.value,o=R.size(d),r=[{type:12,data:o},...ne(e[0].dims,s,d)],i=a=>`
  ${a.registerUniform("output_size","u32").declareVariables(n,u,l)}
  ${og}
  ${ag(p)}
  ${sg(t)}
  ${ug(t)}
  ${lg(n,p,t)}

  ${a.mainStart()}
    ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${mr}]);
      let W_in = i32(uniforms.x_shape[${br}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${l.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${Ct}], indices[${mr}], indices[${br}]);
      let nxy = ${u.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${dg(l,p,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:a=>{let c=R.size(d);return{outputs:[{dims:d,dataType:a[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:r}},getShaderSource:i}},Hw=(e,t)=>{ig(e.inputs),e.compute(pg(e.inputs,t))},Ww=e=>Se({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),rt,cg,Kw,ka,hg,Fn,Xw,Zw=C(()=>{ae(),se(),Ve(),$u(),Iu(),ue(),lr(),rt=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,cg=(e,t)=>{let n=e[0],s=rt(e,1),u=rt(e,2),d=rt(e,3),l=rt(e,4),p=rt(e,5),o=rt(e,6),r=rt(e,7);if(n.dims.length!==3&&n.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let i=n.dims[0],a=n.dims[1],c=n.dims.length===3?n.dims[2]:t.numHeads*n.dims[4],h=a,g=0,b=0,x=Math.floor(c/t.numHeads);if(o&&r&&R.size(o.dims)&&R.size(r.dims)){if(o.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(o.dims[0]!==i||o.dims[1]!==t.numHeads||o.dims[3]!==x)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(r.dims[0]!==i||r.dims[1]!==t.numHeads||r.dims[3]!==x)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(o.dims[2]!==r.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(r.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');g=o.dims[2],b=o.dims[2]}else if(o&&R.size(o.dims)||r&&R.size(r.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $;if(s&&R.size(s.dims)>0){if(n.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(s.dims.length<3||s.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(n.dims[0]!==s.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(s.dims.length===3){if(s.dims[2]!==n.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');$=2,h=s.dims[1]}else if(s.dims.length===5){if(s.dims[2]!==t.numHeads||s.dims[3]!==2||s.dims[4]!==x)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(u)throw new Error('Expect "value" be none when "key" has packed kv format.');$=5,h=s.dims[1]}else{if(s.dims[1]!==t.numHeads||s.dims[3]!==x)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');$=0,h=s.dims[2]}}else{if(n.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(n.dims[2]!==t.numHeads||n.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}if(d&&R.size(d.dims)>0){if(d.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(s&&s.dims.length===5&&s.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let _=g+h,O=0;if(l&&R.size(l.dims)>0){O=8;let D=l.dims;throw D.length===1?D[0]===i?O=1:D[0]===3*i+2&&(O=3):D.length===2&&D[0]===i&&D[1]===_&&(O=5),O===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let I=!1,E=c;if(u&&R.size(u.dims)>0){if(u.dims.length!==3&&u.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(n.dims[0]!==u.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(u.dims.length===3){if(h!==u.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');E=u.dims[2]}else{if(h!==u.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');E=u.dims[1]*u.dims[3],I=!0}}let A=!1;if(l&&R.size(l.dims)>0)throw new Error("Key padding mask is not supported");if(p&&R.size(p.dims)>0){if(p.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(p.dims[0]!==i||p.dims[1]!==t.numHeads||p.dims[2]!==a||p.dims[3]!==_)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:i,sequenceLength:a,pastSequenceLength:g,kvSequenceLength:h,totalSequenceLength:_,maxSequenceLength:b,inputHiddenSize:0,hiddenSize:c,vHiddenSize:E,headSize:x,vHeadSize:Math.floor(E/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:O,scale:t.scale,broadcastResPosBias:A,passPastInKv:I,qkvFormat:$}},Kw=e=>Se({...e}),ka=Se({perm:[0,2,1,3]}),hg=(e,t,n,s,u,d,l)=>{let p=[s,u,d],o=R.size(p),r=[{type:12,data:o},{type:12,data:l},{type:12,data:d}],i=a=>{let c=ee("qkv_with_bias",t.dataType,p),h=M("qkv",t.dataType,p),g=M("bias",n.dataType,p),b=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${a.registerUniforms(b).declareVariables(h,g,c)}
  ${a.mainStart()}
    ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:p,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:r}),getShaderSource:i},{inputs:[t,n],outputs:[-1]})[0]},Fn=(e,t,n,s,u,d,l,p)=>{let o=d;if(l&&R.size(l.dims)>0){if(s===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return o=hg(e,d,l,t,s,n*u,p),o=o.reshape([t,s,n,u]),n===1||s===1?o:e.compute(dt(o,ka.perm),{inputs:[o],outputs:[-1]})[0]}else return d.dims.length===3&&(o=d.reshape([t,s,n,u])),n===1||s===1?o:e.compute(dt(o,ka.perm),{inputs:[o],outputs:[-1]})[0]},Xw=(e,t)=>{let n=cg(e.inputs,t),s=e.inputs[0],u=rt(e.inputs,1),d=rt(e.inputs,2),l=rt(e.inputs,3),p=rt(e.inputs,4),o=rt(e.inputs,5),r=rt(e.inputs,6),i=rt(e.inputs,7);if(s.dims.length===5)throw new Error("Packed QKV is not implemented");if(u?.dims.length===5)throw new Error("Packed KV is not implemented");let a=u&&d&&u.dims.length===4&&d.dims.length===4,c=Fn(e,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,s,l,0);if(a)return Xn(e,c,u,d,p,void 0,r,i,o,n);if(!u||!d)throw new Error("key and value must be provided");let h=Fn(e,n.batchSize,n.numHeads,n.kvSequenceLength,n.headSize,u,l,n.hiddenSize),g=Fn(e,n.batchSize,n.numHeads,n.kvSequenceLength,n.vHeadSize,d,l,2*n.hiddenSize);Xn(e,c,h,g,p,void 0,r,i,o,n)}}),fg,gg,mg,bg,eu,Jw,Qw,Yw=C(()=>{ae(),se(),Ve(),ue(),fg=e=>{if(!e||e.length<1)throw new Error("too few inputs")},gg=(e,t)=>{let n=[],s=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(u=>n.push(Number(u))),s=n.length),Se({numOutputs:s,axis:t.axis,splitSizes:n})},mg=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${te("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,bg=e=>{let t=e.length,n=[];for(let s=0;s<t;++s){let u=e[s].setByIndices("indices","input[global_idx]");t===1?n.push(u):s===0?n.push(`if (output_number == ${s}u) { ${u} }`):s===t-1?n.push(`else { ${u} }`):n.push(`else if (output_number == ${s}) { ${u} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${n.join(`
`)}
      }`},eu=(e,t)=>{let n=e[0].dims,s=R.size(n),u=e[0].dataType,d=R.normalizeAxis(t.axis,n.length),l=new Array(t.numOutputs),p=M("input",u,n.length),o=new Array(t.numOutputs),r=[],i=[],a=0,c=[{type:12,data:s}];for(let g=0;g<t.numOutputs;g++){a+=t.splitSizes[g],o[g]=a;let b=n.slice();b[d]=t.splitSizes[g],i.push(b),l[g]=ee(`output${g}`,u,b.length),r.push({dims:i[g],dataType:e[0].dataType})}c.push({type:12,data:o},...ne(n,...i));let h=g=>`
  ${g.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",o.length).declareVariables(p,...l)}
  ${mg(o.length)}
  ${bg(l)}

  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${p.offsetToIndices("global_idx")};
    var index = ${p.indicesGet("indices",d)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${te("uniforms.size_in_split_axis","output_number - 1u",o.length)};
      ${p.indicesSet("indices",d,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:h,getRunData:()=>({outputs:r,dispatchGroup:{x:Math.ceil(s/64)},programUniforms:c})}},Jw=(e,t)=>{fg(e.inputs);let n=e.inputs.length===1?t:gg(e.inputs,t);e.compute(eu(e.inputs,n),{inputs:[0]})},Qw=e=>{let t=e.axis,n=e.splitSizes,s=e.numOutputs<0?n.length:e.numOutputs;if(s!==n.length)throw new Error("numOutputs and splitSizes length must be equal");return Se({axis:t,numOutputs:s,splitSizes:n})}}),yg,Ui,e1,t1=C(()=>{ae(),se(),Ve(),ue(),yg=(e,t)=>{let[n,s,u,d]=e,{numHeads:l,rotaryEmbeddingDim:p}=t;if(n.dims.length!==3&&n.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${n.dims.length}`);if(!R.areEqual(s.dims,[])&&!R.areEqual(s.dims,[1])&&s.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${s.dims.length}`);if(u.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${u.dims.length}`);if(d.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${d.dims.length}`);if(!R.areEqual(u.dims,d.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(p>0&&l===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let o=n.dims[0],r=n.dims[n.dims.length-2],i=u.dims[0],a=R.sizeFromDimension(n.dims,1)/r,c=p===0?u.dims[1]*2:a/l;if(p>c)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(s.dims.length===2){if(o!==s.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${s.dims[0]}`);if(r!==s.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${s.dims[1]}`)}if(r>i)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");if(c/2!==u.dims[1]&&p/2!==u.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${u.dims[1]}`)},Ui=(e,t)=>{let{interleaved:n,numHeads:s,rotaryEmbeddingDim:u,scale:d}=t,l=e[0].dims[0],p=R.sizeFromDimension(e[0].dims,1),o=e[0].dims[e[0].dims.length-2],r=p/o,i=e[2].dims[1],a=u===0?i*2:r/s,c=new Array(l,o,r/a,a-i),h=R.computeStrides(c),g=[{type:1,data:d},{type:12,data:c},{type:12,data:h},...e[0].dims.length===3?new Array({type:12,data:[p,r,a,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[p,a,o*a,1]}):[],...ne(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],b=x=>{let $=M("input",e[0].dataType,e[0].dims.length),_=M("position_ids",e[1].dataType,e[1].dims.length),O=M("cos_cache",e[2].dataType,e[2].dims.length),I=M("sin_cache",e[3].dataType,e[3].dims.length),E=ee("output",e[0].dataType,e[0].dims.length);return x.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:c.length},{name:"global_strides",type:"u32",length:h.length},{name:"input_output_strides",type:"u32",length:h.length}]),`
        ${x.declareVariables($,_,O,I,E)}

        ${x.mainStart(an)}
          let half_rotary_emb_dim = uniforms.${O.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${_.broadcastedIndicesToOffset("bsnh.xy",ee("",_.type.tensor,2))};
            let position_id =
                u32(${_.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${n});
            let j = i + select(half_rotary_emb_dim, 1, ${n});
            let re = ${$.getByOffset("i")} * ${O.get("position_id","bsnh[3]")} -
                ${$.getByOffset("j")} * ${I.get("position_id","bsnh[3]")};
            ${E.setByOffset("i","re")}
            let im = ${$.getByOffset("i")} * ${I.get("position_id","bsnh[3]")} +
                ${$.getByOffset("j")} * ${O.get("position_id","bsnh[3]")};
            ${E.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${E.setByOffset("k",$.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:Se({interleaved:n}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(R.size(c)/an)},programUniforms:g})}},e1=(e,t)=>{yg(e.inputs,t),e.compute(Ui(e.inputs,t))}}),_g,vg,Da,wg,r1,CS=C(()=>{Ve(),ae(),Iu(),Zw(),Yw(),lr(),t1(),ue(),_g=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let n=e[0],s=e[1],u=e[2],d=e[3],l=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(n.dims.length!==3&&n.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let p=!1,o=n.dims[0],r=n.dims[1],i=n.dims.length===3?p?n.dims[2]/3:n.dims[2]:t.numHeads*n.dims[4],a=r,c=0,h=!s||s.dims.length===0,g=Math.floor(h?i/(t.numHeads+2*t.kvNumHeads):i/t.numHeads);h&&(i=g*t.numHeads);let b=d&&d.dims.length!==0,x=l&&l.dims.length!==0;if(b&&d.dims.length===4&&d.dims[0]===o&&d.dims[1]!==t.kvNumHeads&&d.dims[2]===t.kvNumHeads&&d.dims[3]===g)throw new Error("BSNH pastKey/pastValue is not supported");if(b&&x){if(d.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');c=d.dims[2]}else if(b||x)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let $=1;if(s&&s.dims.length>0){if(n.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(s.dims.length<3||s.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(n.dims[0]!==s.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(s.dims.length===3){if(n.dims[2]%s.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');a=s.dims[1]}else if(s.dims.length===5){if(s.dims[2]!==t.numHeads||s.dims[3]!==2||s.dims[4]!==g)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(u)throw new Error('Expect "value" be none when "key" has packed kv format.');a=s.dims[1]}else{if(s.dims[1]!==t.numHeads||s.dims[3]!==g)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');a=s.dims[2]}}else{if(n.dims.length!==3&&n.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(n.dims.length===5&&(n.dims[2]!==t.numHeads||n.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');$=3}let _=0,O=!1,I=t.kvNumHeads?g*t.kvNumHeads:i;if(u&&u.dims.length>0){if(u.dims.length!==3&&u.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(n.dims[0]!==u.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(u.dims.length===3){if(a!==u.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');I=u.dims[2]}else{if(a!==u.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');I=u.dims[1]*u.dims[3],O=!0}}let E=e.length>4?e[5]:void 0;if(E){if(E.dims.length===0)throw new Error("seqlens_k must be at least 1D, got scalar.");let A=E.dims.reduce((D,S)=>D*S,1);if(A!==o)throw new Error(`seqlens_k must have batch_size (${o}) elements, got ${A}.`);for(let D=0;D<E.dims.length;D++)if(E.dims[D]!==1&&E.dims[D]!==o)throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${o}), got dims[${D}] = ${E.dims[D]}.`)}return{batchSize:o,sequenceLength:r,pastSequenceLength:c,kvSequenceLength:a,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:i,vHiddenSize:I,headSize:g,vHeadSize:Math.floor(I/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:_,scale:t.scale,broadcastResPosBias:!1,passPastInKv:O,qkvFormat:$}},vg=Se({perm:[0,2,1,3]}),Da=(e,t,n)=>{let s=t,u=n.kvNumHeads;return t.dims.length===3&&n.kvSequenceLength!==0&&(s=t.reshape([n.batchSize,n.kvSequenceLength,u,n.headSize]),s=e.compute(dt(s,vg.perm),{inputs:[s],outputs:[-1]})[0]),s},wg=(e,t,n,s)=>{let u=7,d=["type","type"],l=[e*t],p=e*t,o=[{type:12,data:p},{type:12,data:t},{type:12,data:e}],r=i=>{let a=M("seq_lens",n.dataType,n.dims),c=M("total_seq_lens",s.dataType,s.dims),h=ee("pos_ids",u,l),g=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${i.registerUniforms(g).declareVariables(a,c,h)}
  ${i.mainStart()}
    ${i.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${c.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${a.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${h.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${h.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${h.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:l,dataType:u}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:o}),getShaderSource:r}},r1=(e,t)=>{let n=_g(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let s=e.inputs[0],u=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,d=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,l=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,p=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,o=e.inputs.length>4?e.inputs[5]:void 0,r=e.inputs.length>5?e.inputs[6]:void 0,i=n.kvNumHeads?n.kvNumHeads:n.numHeads,a=Se({axis:2,numOutputs:3,splitSizes:[n.numHeads*n.headSize,i*n.headSize,i*n.headSize]}),[c,h,g]=!u&&!d?e.compute(eu([s],a),{inputs:[s],outputs:[-1,-1,-1]}):[s,u,d],b,x;if(t.doRotary){let I=e.compute(wg(n.batchSize,n.sequenceLength,o,r),{inputs:[o,r],outputs:[-1]})[0],E=e.inputs[7],A=e.inputs[8],D=Se({interleaved:t.rotaryInterleaved!==0,numHeads:n.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),S=[c,I,E,A],L=[-1];b=e.compute(Ui(S,D),{inputs:S,outputs:L})[0],S.splice(0,1,h);let U=Se({interleaved:t.rotaryInterleaved!==0,numHeads:n.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});x=e.compute(Ui(S,U),{inputs:S,outputs:L})[0]}let $=Fn(e,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,t.doRotary?b:c,void 0,0),_=Da(e,t.doRotary?x:h,n),O=Da(e,g,n);Xn(e,$,_,O,void 0,void 0,l,p,void 0,n,o,r)}}),Na,xg,$g,n1,zS=C(()=>{ae(),se(),lr(),ue(),Na=(e,t,n,s,u,d,l,p)=>{let o=Fe(d),r=o===1?"f32":`vec${o}f`,i=o===1?"vec2f":`mat2x${o}f`,a=u*l,c=64;a===1&&(c=256);let h=[u,l,d/o],g=[u,l,2],b=["rank","type","type"],x=[];x.push(...ne(h,g));let $=_=>{let O=M("x",t.dataType,3,o),I=M("scale",n.dataType,n.dims),E=M("bias",s.dataType,s.dims),A=ee("output",1,3,2),D=[O,I,E,A];return`
  var<workgroup> workgroup_shared : array<${i}, ${c}>;
  const workgroup_size = ${c}u;
  ${_.declareVariables(...D)}
  ${_.mainStart(c)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${r}(0);
    var squared_sum = ${r}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${r}(${O.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${i}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${sr("workgroup_shared[0][0]",o)} / f32(hight * ${o});
      let squared_sum_final = ${sr("workgroup_shared[0][1]",o)} / f32(hight * ${o});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${p}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${o};${p};${c}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:g,dataType:1}],dispatchGroup:{x:a},programUniforms:x}),getShaderSource:$},{inputs:[t,n,s],outputs:[-1]})[0]},xg=(e,t,n)=>{let s=t[0].dims,u=s,d=2,l=s[0],p=s[1],o=R.sizeFromDimension(s,d),r=Fe(o),i=R.size(u)/r,a=Na(e,t[0],t[1],t[2],l,o,p,n.epsilon),c=[l,p,o/r],h=[l,p],g=["type","none"],b=x=>{let $=M("x",t[0].dataType,c.length,r),_=M("scale_shift",1,h.length,2),O=ee("output",t[0].dataType,c.length,r),I=[$,_,O];return`
  ${x.registerUniform("output_size","u32").declareVariables(...I)}
  ${x.mainStart()}
  ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${O.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${_.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${$.getByOffset("global_idx")} * ${O.type.value}(scale_shift.x) + ${O.type.value}(scale_shift.y);
      ${O.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${r}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:u,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},...ne(c,h,c)]}),getShaderSource:b},{inputs:[t[0],a]})},$g=(e,t,n)=>{let s=t[0].dims,u=s,d=s[0],l=s[s.length-1],p=R.sizeFromDimension(s,1)/l,o=Fe(l),r=R.size(u)/o,i=[{type:12,data:p},{type:12,data:Math.floor(l/o)}],a=["type","type"],c=!1,h=[0,s.length-1];for(let $=0;$<s.length-2;$++)c=c||s[$+1]!==1,h.push($+1);c=c&&s[s.length-1]!==1;let g=c?e.compute(dt(e.inputs[0],h),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:s.length},($,_)=>s[h[_]])),b=Na(e,g,t[1],t[2],d,p,l,n.epsilon),x=$=>{let _=He(t[0].dataType),O=o===1?"vec2f":`mat${o}x2f`,I=D=>{let S=D===0?"x":"y",L=o===1?"f32":`vec${o}f`;switch(o){case 1:return`${_}(${L}(scale.${S}))`;case 2:return`vec2<${_}>(${L}(scale[0].${S}, scale[1].${S}))`;case 4:return`vec4<${_}>(${L}(scale[0].${S}, scale[1].${S}, scale[2].${S}, scale[3].${S}))`;default:throw new Error(`Not supported compoents ${o}`)}},E=M("input",t[0].dataType,t[0].dims,o),A=ee("output",t[0].dataType,u,o);return`
  @group(0) @binding(0) var<storage, read> input : array<${E.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${O}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${A.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${$.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${I(0)}, ${I(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${o}`,inputDependencies:a},getRunData:()=>({outputs:[{dims:u,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(r/64)},programUniforms:i}),getShaderSource:x},{inputs:[t[0],b]})},n1=(e,t)=>{t.format==="NHWC"?$g(e,e.inputs,t):xg(e,e.inputs,t)}}),Tg,Sg,i1,RS=C(()=>{ae(),se(),ue(),Tg=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},Sg=(e,t,n)=>{let s=t.simplified,u=e[0].dims,d=e[1],l=!s&&e[2],p=u,o=R.normalizeAxis(t.axis,u.length),r=R.sizeToDimension(u,o),i=R.sizeFromDimension(u,o),a=R.size(d.dims),c=l?R.size(l.dims):0;if(a!==i||l&&c!==i)throw new Error(`Size of X.shape()[axis:] == ${i}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${a} and bias size of ${c}`);let h=[];for(let E=0;E<u.length;++E)E<o?h.push(u[E]):h.push(1);let g=Fe(i),b=["type","type"],x=[{type:12,data:r},{type:1,data:i},{type:12,data:Math.floor(i/g)},{type:1,data:t.epsilon}];l&&b.push("type");let $=n>1,_=n>2,O=E=>{let A=He(e[0].dataType),D=[M("x",e[0].dataType,e[0].dims,g),M("scale",d.dataType,d.dims,g)];l&&D.push(M("bias",l.dataType,l.dims,g)),D.push(ee("output",e[0].dataType,p,g)),$&&D.push(ee("mean_data_output",1,h)),_&&D.push(ee("inv_std_output",1,h));let S=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${E.registerUniforms(S).declareVariables(...D)}
  ${E.mainStart()}
    ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Gs("f32",g)};
    var mean_square_vector = ${Gs("f32",g)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${tn(A,g,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${sr("mean_vector",g)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${sr("mean_square_vector",g)} / uniforms.norm_size ${s?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${tn(A,g,"x[j + offset]")};
      let f32scale = ${tn(A,g,"scale[j]")};
      output[j + offset] = ${D[0].type.value}((f32input ${s?"":"- mean"}) * inv_std_dev * f32scale
        ${l?`+ ${tn(A,g,"bias[j]")}`:""}
      );
    }

    ${$?"mean_data_output[global_idx] = mean":""};
    ${_?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},I=[{dims:p,dataType:e[0].dataType}];return $&&I.push({dims:h,dataType:1}),_&&I.push({dims:h,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${g};${n};${s}`,inputDependencies:b},getRunData:()=>({outputs:I,dispatchGroup:{x:Math.ceil(r/64)},programUniforms:x}),getShaderSource:O}},i1=(e,t)=>{Tg(e.inputs),e.compute(Sg(e.inputs,t,e.outputCount))}}),Ig,o1,BS=C(()=>{se(),ku(),Du(),Ig=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},o1=e=>{Ig(e.inputs);let t=on.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let n=t[t.length-1],s=e.inputs[0].dims[e.inputs[0].dims.length-1];if(n<8&&s<8)e.compute(Au(e.inputs,{activation:""},t));else{let u=t[t.length-2],d=R.size(e.inputs[0].dims.slice(0,-2)),l=R.size(e.inputs[1].dims.slice(0,-2));if(d!==1&&u===1&&l===1){let p=e.inputs[0].reshape([1,d,s]),o=e.inputs[1].reshape([1,s,n]),r=[1,d,n],i=[p,o];e.compute(Vi(i,{activation:""},t,r),{inputs:i})}else e.compute(Vi(e.inputs,{activation:""},t))}}}),Og,Eg,Pg,a1,s1,MS=C(()=>{ae(),se(),Ve(),ue(),Og=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let n=e[0],s=n.dims.length;if(n.dims[s-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let u=Math.floor((t.k+t.blockSize-1)/t.blockSize),d=t.blockSize/8*t.bits,l=e[1];if(!R.areEqual(l.dims,[t.n,u,d]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let p=e[2].dims;if(R.size(p)!==t.n*u)throw new Error("scales input size error.");if(e.length===4){let o=e[3].dims,r=t.n*(t.bits===8?u:Math.floor((u*t.bits+7)/8));if(R.size(o)!==r)throw new Error("zeroPoints input size error.")}},Eg=(e,t)=>{let n=e[0].dims,s=n.length,u=n[s-2],d=t.k,l=t.n,p=n.slice(0,s-2),o=R.size(p),r=e[1].dims[2]/4,i=e[0].dataType,a=Fe(t.k),c=Fe(r),h=Fe(l),g=p.concat([u,l]),b=u>1&&l/h%2===0?2:1,x=R.size(g)/h/b,$=64,_=[],O=[o,u,d/a],I=R.convertShape(e[1].dims).slice();I.splice(-1,1,r/c),_.push(...ne(O)),_.push(...ne(I)),_.push(...ne(e[2].dims)),e.length===4&&_.push(...ne(R.convertShape(e[3].dims)));let E=[o,u,l/h];_.push(...ne(E));let A=D=>{let S=O.length,L=M("a",e[0].dataType,S,a),U=M("b",12,I.length,c),ie=M("scales",e[2].dataType,e[2].dims.length),K=[L,U,ie],z=e.length===4?M("zero_points",12,e[3].dims.length):void 0;z&&K.push(z);let w=E.length,k=ee("output",e[0].dataType,w,h),F=He(e[0].dataType),W=(()=>{switch(a){case 1:return`array<${F}, 8>`;case 2:return`mat4x2<${F}>`;case 4:return`mat2x4<${F}>`;default:throw new Error(`${a}-component is not supported.`)}})(),X=Math.floor(32/t.bits),Z=Math.floor(X/8),oe=()=>{let H="";for(let q=0;q<Z;q++){let me=q*t.bits*4,Oe=me+t.bits;H+=`
          // reuse a data (pass ${q})
            var input_offset${q>0?q:""} = ${q===0?L.indicesToOffset(`${L.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${q>0?q:""}: ${W};
            for (var j${q>0?q:""}: u32 = 0; j${q>0?q:""} < ${8/a}; j${q>0?q:""}++) {
              a_data${q>0?q:""}[j${q>0?q:""}] = ${L.getByOffset(`input_offset${q>0?q:""}`)};
              input_offset${q>0?q:""}++;
            }
          `;for(let ke=0;ke<h*b;ke++)H+=`
            b_value = ${c===1?`b${ke}_data`:`b${ke}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${q*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${me}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${Oe}u) & b_mask);`}
            b_quantized_values = ${W}(${Array.from({length:4},(Ze,Ee)=>`${F}(b_value_lower[${Ee}]), ${F}(b_value_upper[${Ee}])`).join(", ")});
            b_dequantized_values = ${a===1?`${W}(${Array.from({length:8},(Ze,Ee)=>`(b_quantized_values[${Ee}] - ${z?`zero_point${ke}`:"zero_point"}) * scale${ke}`).join(", ")});`:`(b_quantized_values - ${W}(${Array(8).fill(`${z?`zero_point${ke}`:"zero_point"}`).join(",")})) * scale${ke};`};
            workgroup_shared[local_id.x * ${b} + ${Math.floor(ke/h)}]${h>1?`[${ke%h}]`:""} += ${Array.from({length:8/a},(Ze,Ee)=>`${a===1?`a_data${q>0?q:""}[${Ee}] * b_dequantized_values[${Ee}]`:`dot(a_data${q>0?q:""}[${Ee}], b_dequantized_values[${Ee}])`}`).join(" + ")};
          `}return H},j=()=>{let H=`
            var col_index = col * ${h};
            ${z?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${F}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            `;for(let q=0;q<h*b;q++)H+=`
            let scale${q} = ${ie.getByOffset("col_index * nBlocksPerCol + block")};
            ${z?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${z.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${q} = ${F}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return H},J=()=>{let H=`col_index = col * ${h};`;for(let q=0;q<h*b;q++)H+=`
            let b${q}_data = ${U.getByIndices(`${U.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return H+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${W};
            var b_dequantized_values: ${W};`,H};return`
        var<workgroup> workgroup_shared: array<${k.type.value}, ${b*$}>;
        ${D.declareVariables(...K,k)}
        ${D.mainStart([$,1,1])}
          let output_indices = ${k.offsetToIndices(`(global_idx / ${$}) * ${b}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${$}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/a};
            ${j()}
            for (var word: u32 = 0; word < ${r}; word += ${c}) {
              ${J()}
              for (var i: u32 = 0; i < ${c}; i++) {
                ${oe()}
                word_offset += ${X/a};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${b}) {
            var output_value: ${k.type.value} = ${k.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${$}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${b};
            }
            ${k.setByIndices(`${k.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${a};${c};${h};${b};${$}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:g,dataType:i}],dispatchGroup:{x},programUniforms:_}),getShaderSource:A}},Pg=(e,t)=>{let n=e[0].dims,s=n.length,u=n[s-2],d=t.k,l=t.n,p=n.slice(0,s-2),o=R.size(p),r=e[1].dims[2]/4,i=e[0].dataType,a=Fe(t.k),c=Fe(r),h=p.concat([u,l]),g=128,b=l%8===0?8:l%4===0?4:1,x=g/b,$=Math.floor(32/t.bits),_=x*c*$,O=_/a,I=_/t.blockSize,E=R.size(h)/b,A=[],D=[o,u,d/a],S=R.convertShape(e[1].dims).slice();S.splice(-1,1,r/c),A.push(...ne(D)),A.push(...ne(S)),A.push(...ne(e[2].dims)),e.length===4&&A.push(...ne(R.convertShape(e[3].dims)));let L=[o,u,l];A.push(...ne(L));let U=ie=>{let K=D.length,z=M("a",e[0].dataType,K,a),w=M("b",12,S.length,c),k=M("scales",e[2].dataType,e[2].dims.length),F=[z,w,k],W=e.length===4?M("zero_points",12,e[3].dims.length):void 0;W&&F.push(W);let X=L.length,Z=ee("output",e[0].dataType,X),oe=He(e[0].dataType),j=()=>{switch(a){case 1:return`
          let a_data0 = vec4<${oe}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${oe}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${oe}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${oe}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${a}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${z.type.value}, ${O}>;
        var<workgroup> inter_results: array<array<${Z.type.value}, ${x}>, ${b}>;
        ${ie.declareVariables(...F,Z)}
        ${ie.mainStart([x,b,1])}
          let output_indices = ${Z.offsetToIndices(`workgroup_index * ${b}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${I} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${O};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${O}; a_offset += ${g})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${z.getByIndices(`${z.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${z.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${I} + local_id.x;
            ${W?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${W.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${oe}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${oe}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            let scale = ${k.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${w.getByIndices(`${w.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/a};
            for (var i: u32 = 0; i < ${c}; i++) {
              let b_value = ${c===1?"b_data":"b_data[i]"};
              ${(()=>{let J=Math.floor($/8),H="";for(let q=0;q<J;q++){let me=q*t.bits*4,Oe=me+t.bits;H+=`
              ${j()}
              {${t.bits===2?`
                let half_word = b_value >> ${q*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${me}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${Oe}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${oe}>(${Array.from({length:4},(ke,Ze)=>`${oe}(b_value_lower[${Ze}]), ${oe}(b_value_upper[${Ze}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${oe}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(ke,Ze)=>`${`dot(a_data${Ze}, b_dequantized_values[${Ze}])`}`).join(" + ")};
              }
              word_offset += ${8/a};`}return H})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${b}) {
            var output_value: ${Z.type.value} = ${Z.type.value}(0);
            for (var b = 0u; b < ${x}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${Z.setByIndices(`${Z.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${a};${c};${x};${b}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:h,dataType:i}],dispatchGroup:{x:E},programUniforms:A}),getShaderSource:U}},a1=(e,t)=>{Og(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(Pg(e.inputs,t)):e.compute(Eg(e.inputs,t))},s1=e=>Se(e)}),Ag,kg,Dg,Ng,Cg,zg,Rg,Bg,u1,jS=C(()=>{ae(),se(),ue(),Ag=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},kg=(e,t,n)=>{let s="";for(let u=t-1;u>=0;--u)s+=`
            k = i32(${e.indicesGet("indices",u)}) - ${te("uniforms.pads",u,n)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${te("uniforms.x_shape",u,t)})) {
              break;
            }
            offset += k * i32(${te("uniforms.x_strides",u,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${s}
            value = x[offset];
          }
      `},Dg=(e,t,n)=>{let s="";for(let u=t-1;u>=0;--u)s+=`
                k = i32(${e.indicesGet("indices",u)}) - ${te("uniforms.pads",u,n)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${te("uniforms.x_shape",u,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${te("uniforms.x_shape",u,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${te("uniforms.x_strides",u,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${s}
              value = x[offset];
          `},Ng=(e,t,n)=>{let s="";for(let u=t-1;u>=0;--u)s+=`
                k = i32(${e.indicesGet("indices",u)}) - ${te("uniforms.pads",u,n)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${te("uniforms.x_shape",u,t)})) {
                  k = i32(${te("uniforms.x_shape",u,t)}) - 1;
                }
                offset += k * i32(${te("uniforms.x_strides",u,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${s}
              value = x[offset];
          `},Cg=(e,t,n)=>{let s="";for(let u=t-1;u>=0;--u)s+=`
                k = i32(${e.indicesGet("indices",u)}) - ${te("uniforms.pads",u,n)};
                if (k < 0)  {
                  k += i32(${te("uniforms.x_shape",u,t)}]);
                }
                if (k >= i32(${te("uniforms.x_shape",u,t)})) {
                  k -= i32(${te("uniforms.x_shape",u,t)});
                }
                offset += k * i32(${te("uniforms.x_strides",u,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${s}
              value = x[offset];
          `},zg=(e,t,n)=>{switch(n.mode){case 0:return kg(e,t,n.pads.length);case 1:return Dg(e,t,n.pads.length);case 2:return Ng(e,t,n.pads.length);case 3:return Cg(e,t,n.pads.length);default:throw new Error("Invalid mode")}},Rg=(e,t)=>{let n=R.padShape(e[0].dims.slice(),t.pads),s=e[0].dims,u=R.size(n),d=[{type:12,data:u},{type:6,data:t.pads}],l=e.length>=3&&e[2].data;t.mode===0&&d.push({type:l?e[2].dataType:1,data:t.value}),d.push(...ne(e[0].dims,n));let p=["rank"],o=r=>{let i=ee("output",e[0].dataType,n.length),a=M("x",e[0].dataType,s.length),c=a.type.value,h=zg(i,s.length,t),g=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&g.push({name:"constant_value",type:l?c:"f32"}),`
            ${r.registerUniforms(g).declareVariables(a,i)}
            ${r.mainStart()}
            ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${i.offsetToIndices("global_idx")};

            var value = ${c}(0);
            ${h}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${l}`,inputDependencies:p},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(R.size(n)/64)},programUniforms:d}),getShaderSource:o}},Bg=(e,t)=>{if(e.length>1){let n=e[1].getBigInt64Array(),s=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,u=e[0].dims.length,d=new Int32Array(2*u).fill(0);if(e.length>=4){let p=e[3].getBigInt64Array();for(let o=0;o<p.length;o++)d[Number(p[o])]=Number(n[o]),d[Number(p[o])+u]=Number(n[o+p.length])}else n.forEach((p,o)=>d[Number(o)]=Number(p));let l=[];return d.forEach(p=>l.push(p)),{mode:t.mode,value:s,pads:l}}else return t},u1=(e,t)=>{Ag(e.inputs);let n=Bg(e.inputs,t);e.compute(Rg(e.inputs,n),{inputs:[0]})}}),On,Ca,za,Ra,Ba,Mg,jg,Ma,ja,l1,d1,Fa,p1,c1,La,h1,f1,g1,m1,FS=C(()=>{et(),ae(),se(),ue(),On=e=>{if(he.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Ca=(e,t,n)=>{let s=t.format==="NHWC",u=e.dims.slice();s&&u.splice(1,0,u.pop());let d=Object.hasOwnProperty.call(t,"dilations"),l=t.kernelShape.slice(),p=t.strides.slice(),o=d?t.dilations.slice():[],r=t.pads.slice();Fi.adjustPoolAttributes(n,u,l,p,o,r);let i=Fi.computePoolOutputShape(n,u,p,o,l,r,t.autoPad),a=Object.assign({},t);d?Object.assign(a,{kernelShape:l,strides:p,pads:r,dilations:o,cacheKey:t.cacheKey}):Object.assign(a,{kernelShape:l,strides:p,pads:r,cacheKey:t.cacheKey});let c=i.slice();return c.push(c.splice(1,1)[0]),[a,s?c:i]},za=(e,t)=>{let n=t.format==="NHWC",s=R.size(e),u=R.size(t.kernelShape),d=[{type:12,data:s},{type:12,data:u}],l=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let p=t.kernelShape[t.kernelShape.length-1],o=t.strides[t.strides.length-1],r=t.pads[t.pads.length/2-1],i=t.pads[t.pads.length-1],a=!!(r+i);d.push({type:12,data:p},{type:12,data:o},{type:12,data:r},{type:12,data:i}),l.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let c=!1;if(t.kernelShape.length===2){let h=t.kernelShape[t.kernelShape.length-2],g=t.strides[t.strides.length-2],b=t.pads[t.pads.length/2-2],x=t.pads[t.pads.length-2];c=!!(b+x),d.push({type:12,data:h},{type:12,data:g},{type:12,data:b},{type:12,data:x}),l.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[d,l,!0,a,c]}else{if(n)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let p=R.computeStrides(t.kernelShape);d.push({type:12,data:p},{type:12,data:t.pads},{type:12,data:t.strides}),l.push({name:"kernelStrides",type:"u32",length:p.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let o=t.pads.reduce((r,i)=>r+i);return[d,l,!!o,!1,!1]}},Ra=(e,t,n,s,u,d,l,p,o,r,i,a)=>{let c=u.format==="NHWC",h=t.type.value,g=ee("output",t.type.tensor,s);if(u.kernelShape.length<=2){let b="",x="",$="",_=n-(c?2:1);if(i?b=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${_}] = indices[${_}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${_}] < 0 || xIndices[${_}]
                      >= uniforms.x_shape[${_}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${d}
                }`:b=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${_}] = indices[${_}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${d}
                }`,u.kernelShape.length===2){let O=n-(c?3:2);a?x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${O}] = indices[${O}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${O}] < 0 || xIndices[${O}] >= uniforms.x_shape[${O}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${O}] = indices[${O}] * uniforms.sh - uniforms.phStart + j;
                `,$=`
              }
            `}return`
            ${e.registerUniforms(o).declareVariables(t,g)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${g.offsetToIndices("global_idx")};
              var xIndices = ${g.offsetToIndices("global_idx")};

              var value = ${h}(${p});
              var pad = 0;
              ${x}
              ${b}
              ${$}
              ${l}

              output[global_idx] = value;
            }`}else{if(c)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let b=u.kernelShape.length,x=u.pads.length,$="";return r?$=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${d}
              }`:$=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${d}
            `,`
            ${e.registerUniforms(o).declareVariables(t,g)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${g.offsetToIndices("global_idx")};
              var xIndices = ${g.offsetToIndices("global_idx")};

              var offsets: array<u32, ${b}>;

              var value = ${h}(${p});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${b-1}u; j++) {
                  offsets[j] = offset / ${te("uniforms.kernelStrides","j",b)};
                  offset -= offsets[j] * ${te("uniforms.kernelStrides","j",b)};
                }
                offsets[${b-1}] = offset;

                isPad = false;
                for (var j = ${n-b}u; j < ${n}u; j++) {
                  xIndices[j] = indices[j] * ${te("uniforms.strides",`j - ${n-b}u`,b)}
                    + offsets[j - ${n-b}u] - ${te("uniforms.pads","j - 2u",x)};
                  ${$}
              }
              ${l}

              output[global_idx] = value;
            }`}},Ba=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Mg=e=>`${Ba(e)};${e.countIncludePad}`,jg=e=>`${Ba(e)};${e.storageOrder};${e.dilations}`,Ma=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),ja=(e,t,n,s)=>{let[u,d]=Ca(t,s,n),l=M("x",t.dataType,t.dims.length),p=l.type.value,o="value += x_val;",r="";u.countIncludePad?r+=`value /= ${p}(uniforms.kernelSize);`:r+=`value /= ${p}(i32(uniforms.kernelSize) - pad);`;let[i,a,c,h,g]=za(d,u);i.push(...ne(t.dims,d));let b=["rank"];return{name:e,shaderCache:{hint:`${s.cacheKey};${c};${h};${g}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:d,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(R.size(d)/64)},programUniforms:i}),getShaderSource:x=>Ra(x,l,t.dims.length,d.length,u,o,r,0,a,c,h,g)}},l1=e=>{let t=e.count_include_pad!==0,n=Ma(e);if(n.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let s={countIncludePad:t,...n,cacheKey:""};return{...s,cacheKey:Mg(s)}},d1=(e,t)=>{On(e.inputs),e.compute(ja("AveragePool",e.inputs[0],!1,t))},Fa={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},p1=e=>{let t=e.format;return{format:t,...Fa,cacheKey:t}},c1=(e,t)=>{On(e.inputs),e.compute(ja("GlobalAveragePool",e.inputs[0],!0,t))},La=(e,t,n,s)=>{let[u,d]=Ca(t,s,n),l=`
      value = max(x_val, value);
    `,p="",o=M("x",t.dataType,t.dims.length),r=["rank"],[i,a,c,h,g]=za(d,u);return i.push(...ne(t.dims,d)),{name:e,shaderCache:{hint:`${s.cacheKey};${c};${h};${g}`,inputDependencies:r},getRunData:()=>({outputs:[{dims:d,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(R.size(d)/64)},programUniforms:i}),getShaderSource:b=>Ra(b,o,t.dims.length,d.length,u,l,p,t.dataType===10?-65504:-1e5,a,c,h,g)}},h1=(e,t)=>{On(e.inputs),e.compute(La("MaxPool",e.inputs[0],!1,t))},f1=e=>{let t=e.storage_order,n=e.dilations,s=Ma(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(s.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let u={storageOrder:t,dilations:n,...s,cacheKey:""};return{...u,cacheKey:jg(u)}},g1=e=>{let t=e.format;return{format:t,...Fa,cacheKey:t}},m1=(e,t)=>{On(e.inputs),e.compute(La("GlobalMaxPool",e.inputs[0],!0,t))}}),Fg,Lg,b1,y1,LS=C(()=>{ae(),se(),Ve(),ue(),Fg=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((n,s)=>n===e[2].dims[s]).reduce((n,s)=>n&&s,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((u,d)=>d===t.axis||u===e[0].dims[d]).reduce((u,d)=>u&&d,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let n=e[0].dims[t.axis],s=e[1].dims[t.axis];if(t.blockSize<Math.ceil(n/s)||t.blockSize>Math.ceil(n/(s-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},Lg=(e,t)=>{let n=R.normalizeAxis(t.axis,e[0].dims.length),s=e[0].dataType,u=s===3,d=e[0].dims,l=e[1].dataType,p=R.size(d),o=s===3||s===2,r=o?[Math.ceil(R.size(e[0].dims)/4)]:e[0].dims,i=e[1].dims,a=e.length>2?e[2]:void 0,c=a?o?[Math.ceil(R.size(a.dims)/4)]:a.dims:void 0,h=i.length===0||i.length===1&&i[0]===1,g=h===!1&&i.length===1,b=Fe(p),x=h&&(!o||b===4),$=x?b:1,_=x&&!o?b:1,O=M("input",o?12:s,r.length,_),I=M("scale",l,i.length),E=a?M("zero_point",o?12:s,c.length):void 0,A=ee("output",l,d.length,$),D=[O,I];E&&D.push(E);let S=[r,i];a&&S.push(c);let L=[{type:12,data:p/$},{type:12,data:n},{type:12,data:t.blockSize},...ne(...S,d)],U=ie=>{let K=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${ie.registerUniforms(K).declareVariables(...D,A)}
      ${ie.mainStart()}
          ${ie.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${A.offsetToIndices("global_idx")};

          // Set input x
          ${o?`
            let input = ${O.getByOffset("global_idx / 4")};
            let x_vec = ${u?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${$===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${O.getByOffset("global_idx")};`};

          // Set scale input
          ${h?`let scale_value= ${I.getByOffset("0")}`:g?`
            let scale_index = ${A.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${I.getByOffset("scale_index")};`:`
            var scale_indices: ${I.type.indices} = output_indices;
            let index = ${I.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${I.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${I.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${E?h?o?`
                let zero_point_input = ${E.getByOffset("0")};
                let zero_point_vec =  ${u?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${E.getByOffset("0")}`:g?o?`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${E.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${u?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${E.getByOffset("zero_point_index")};`:o?`
                let zero_point_offset = ${I.indicesToOffset("scale_indices")};
                let zero_point_input = ${E.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${u?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${E.getByIndices("scale_indices")};`:`let zero_point_value = ${o?u?"i32":"u32":O.type.value}(0);`};
      // Compute and write output
      ${A.setByOffset("global_idx",`${A.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:E?["rank","rank","rank"]:["rank","rank"]},getShaderSource:U,getRunData:()=>({outputs:[{dims:d,dataType:l}],dispatchGroup:{x:Math.ceil(p/$/64),y:1,z:1},programUniforms:L})}},b1=(e,t)=>{Fg(e.inputs,t),e.compute(Lg(e.inputs,t))},y1=e=>Se({axis:e.axis,blockSize:e.blockSize})}),Vg,Ug,_1,VS=C(()=>{et(),ae(),ue(),Vg=(e,t,n)=>{let s=e===t,u=e<t&&n<0,d=e>t&&n>0;if(s||u||d)throw new Error("Range these inputs' contents are invalid.")},Ug=(e,t,n,s)=>{let u=Math.abs(Math.ceil((t-e)/n)),d=[u],l=u,p=[{type:12,data:l},{type:s,data:e},{type:s,data:n},...ne(d)],o=r=>{let i=ee("output",s,d.length),a=i.type.value,c=[{name:"outputSize",type:"u32"},{name:"start",type:a},{name:"delta",type:a}];return`
        ${r.registerUniforms(c).declareVariables(i)}
        ${r.mainStart()}
        ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${a}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${s}`},getShaderSource:o,getRunData:()=>({outputs:[{dims:d,dataType:s}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:p})}},_1=e=>{let t=0,n=0,s=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],n=e.inputs[1].getInt32Array()[0],s=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],n=e.inputs[1].getFloat32Array()[0],s=e.inputs[2].getFloat32Array()[0]),he.webgpu.validateInputContent&&Vg(t,n,s),e.compute(Ug(t,n,s,e.inputs[0].dataType),{inputs:[]})}}),qg,Gg,v1,w1,US=C(()=>{ae(),se(),Ve(),ue(),qg=(e,t,n,s)=>{if(e!=="none"&&s!=="i32"&&s!=="u32"&&s!=="f32")throw new Error(`Input ${s} is not supported with reduction ${e}.`);let u=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,d=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${n};`;case"add":return s==="i32"||s==="u32"?`atomicAdd(&${t}, bitcast<${s}>(${n}));`:`
              ${u}bitcast<${s}>(oldValue) + (${n})${d}`;case"max":return s==="i32"||s==="u32"?`atomicMax(&${t}, bitcast<${s}>(${n}));`:`
                ${u}max(bitcast<f32>(oldValue), (${n}))${d}`;case"min":return s==="i32"||s==="u32"?`atomicMin(&${t}, bitcast<${s}>(${n}));`:`${u}min(bitcast<${s}>(oldValue), (${n}))${d}`;case"mul":return`${u}(bitcast<${s}>(oldValue) * (${n}))${d}`;default:throw new Error(`Reduction ${e} is not supported.`)}},Gg=(e,t)=>{let n=e[0].dims,s=e[1].dims,u=n,d=1,l=Math.ceil(R.sizeToDimension(s,s.length-1)/d),p=s[s.length-1],o=R.sizeFromDimension(n,p),r=[{type:12,data:l},{type:12,data:p},{type:12,data:o},...ne(e[1].dims,e[2].dims,u)],i=a=>{let c=M("indices",e[1].dataType,e[1].dims.length),h=M("updates",e[2].dataType,e[2].dims.length,d),g=t.reduction!=="none"&&t.reduction!==""?X_("output",e[0].dataType,u.length):ee("output",e[0].dataType,u.length,d);return`
      ${a.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(c,h,g)}
      ${a.mainStart()}
        ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${qg(t.reduction,"output[data_offset + i]","value",g.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:r}),getShaderSource:i}},v1=e=>Se({reduction:e.reduction}),w1=(e,t)=>{e.compute(Gg(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),Hg,Wg,Kg,Va,Xg,Zg,Jg,Qg,Yg,em,tm,rm,Ua,nm,im,om,am,sm,x1,$1,qS=C(()=>{ae(),se(),Ve(),ue(),Hg=(e,t)=>{if(e.every(n=>n>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},Wg=(e,t,n)=>{t.every(u=>u>=0&&u<n||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let s=new Array(n).fill(1);return t.forEach((u,d)=>s[u]=e[d]),s},Kg=(e,t,n,s,u,d)=>{let[l,p,o]=n>10?[1,2,3]:[-1,e.length>1?1:-1,-1],r=e[0].dims.length;if(l>0&&e.length>l&&e[l].dims.length>0)e[l].getFloat32Array().forEach(i=>d.push(i));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(p>0&&e.length>p&&e[p].dims.length===1&&e[p].dims[0]>0){if(e[p].getFloat32Array().forEach(i=>s.push(i)),s.length!==0&&s.length!==r&&n>=18&&s.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");Hg(s,t),t.axes.length>0&&Wg(s,t.axes,r).forEach((i,a)=>s[a]=i)}if(o>0&&e.length>o&&e[o].dims.length===1&&e[o].dims[0]>0&&(e[o].getBigInt64Array().forEach(i=>u.push(Number(i))),u.length!==0&&u.length!==r&&n>=18&&u.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(s.length!==0&&s.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(u.length!==0&&u.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof s<"u"&&typeof u<"u"&&s.length>0&&u.length>r)throw new Error("Resize requires only of scales or sizes to be specified")},Va=(e,t,n,s)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${s}(big / (${n}));
  let fract = ${s}(big % (${n})) / ${s}(${n});
  return whole + fract;
`,Xg=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${Va("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${Va("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",Zg=(e,t,n)=>`fn getNearestPixelFromOriginal(xOriginal: ${n}, isDownSample: bool) -> ${n} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",Jg=(e,t,n)=>{let s=new Array(n).fill(0).concat(new Array(n).fill(1)),u=e.length===0?s:e.slice();return t.length>0?(t.forEach((d,l)=>{s[d]=u[l],s[l+n]=u[t.length+l]}),s):u},Qg=(e,t,n,s)=>{let u=[];if(n.length>0)if(s.length>0){if(e.forEach(d=>u.push(d)),Math.max(...s)>e.length)throw new Error("axes is out of bound");s.forEach((d,l)=>u[d]=n[l])}else n.forEach(d=>u.push(d));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");u=e.map((d,l)=>Math.round(d*t[l]))}return u},Yg=(e,t,n)=>{let s=(()=>{switch(n.keepAspectRatioPolicy){case"not_larger":return n.axes.length>0?Math.min(...n.axes.map(d=>t[d]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return n.axes.length>0?Math.max(...n.axes.map(d=>t[d]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${n.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let u=e.slice();return n.axes.length>0?(n.axes.forEach(d=>t[d]=s),n.axes.forEach(d=>u[d]=Math.round(e[d]*t[d]))):(t.fill(s,0,t.length),u.forEach((d,l)=>u[l]=Math.round(d*t[l]))),u},em=(e,t,n,s,u)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${n.length}> {
      var original_indices: array<${e.type.value}, ${n.length}>;
      for (var i:u32 = 0; i < ${n.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${te("uniforms.scales","i",s)};
        var roi_low = ${te("uniforms.roi","i",u)};
        var roi_hi = ${te("uniforms.roi",`i + ${t.length}`,u)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${te("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${te("uniforms.output_shape","i",n.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,tm=(e,t,n,s,u,d,l)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${s.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${te("uniforms.scales","i",u)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${te("uniforms.roi","i",d)};
          var roi_hi = ${te("uniforms.roi",`i + ${n.length}`,d)};
          var input_shape_i = ${te("uniforms.input_shape","i",n.length)};
          var output_shape_i = ${te("uniforms.output_shape","i",s.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${l} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,rm=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${te("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,Ua=(e,t,n,s)=>e.rank>s?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",n,"batch")};
`:"",nm=(e,t,n,s,u)=>{let[d,l,p,o]=n.length===2?[-1,0,1,-1]:[0,2,3,1],r=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${r} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",l,`max(0, min(row, ${n[l]} - 1))`)};
      ${e.indicesSet("input_indices",p,`max(0, min(col, ${n[p]} - 1))`)};
      ${Ua(e,o,d,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${r} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${r} = originalIndices[${l}];
      var col:${r} = originalIndices[${p}];
      ${s?`if (row < 0 || row > (${n[l]} - 1) || col < 0 || col > (${n[p]} - 1)) {
        return ${u};
      }`:""};
      row = max(0, min(row, ${n[l]} - 1));
      col = max(0, min(col, ${n[p]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${n.length>2?`u32(originalIndices[${o}])`:"0"};
      var batch: u32 =  ${n.length>2?`u32(originalIndices[${d}])`:"0"};
      var x11: ${r} = getInputValue(batch, channel, row1, col1);
      var x12: ${r} = getInputValue(batch, channel, row1, col2);
      var x21: ${r} = getInputValue(batch, channel, row2, col1);
      var x22: ${r} = getInputValue(batch, channel, row2, col2);
      var dx1: ${r} = abs(row - ${r}(row1));
      var dx2: ${r} = abs(${r}(row2) - row);
      var dy1: ${r} = abs(col - ${r}(col1));
      var dy2: ${r} = abs(${r}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},im=(e,t,n,s,u,d,l,p,o,r)=>{let i=n.length===2,[a,c]=i?[0,1]:[2,3],h=e.type.value,g=b=>{let x=b===a?"row":"col";return`
      fn ${x}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${h} {
        var output_index = ${t.indicesGet("output_indices",b)};
        var originalIdx: ${h} = getOriginalCoordinateFromResizedCoordinate(output_index, ${u[b]},
        ${s[b]}, ${n[b]}, ${d[b]}, ${d[b]} + ${n.length});
        var fractOriginalIdx: ${h} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${p} && (originalIdx < 0 || originalIdx > (${n[b]} - 1))) {
          return ${o};
        }
        var data: array<${h}, 4> = array<${h}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${x}: ${h} = originalIdx + ${h}(i);
          if (${x} < 0 || ${x} >= ${n[b]}) {
            ${r?`coefs[i + 1] = 0.0;
                        continue;`:p?`return ${o};`:`${x} = max(0, min(${x}, ${n[b]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",b,`u32(${x})`)};
          data[i + 1] = ${b===a?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${g(a)};
    ${g(c)};
  fn getCubicInterpolationCoefs(s: ${h}) -> array<${h}, 4> {
    var absS = abs(s);
    var coeffs: array<${h}, 4> = array<${h}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${h} = 1.0 - absS;
    var twoMinusAbsS: ${h} = 2.0 - absS;
    var onePlusAbsS: ${h} = 1.0 + absS;
    coeffs[0] = ((${l} * onePlusAbsS - 5 * ${l}) * onePlusAbsS + 8 * ${l}) * onePlusAbsS - 4 * ${l};
    coeffs[1] = ((${l} + 2) * absS - (${l} + 3)) * absS * absS + 1;
    coeffs[2] = ((${l} + 2) * oneMinusAbsS - (${l} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${l} * twoMinusAbsS - 5 * ${l}) * twoMinusAbsS + 8 * ${l}) * twoMinusAbsS - 4 * ${l};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${h}, 4>, coefs: array<${h}, 4>) -> ${h} {
    var coefsSum: ${h} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${h} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},om=(e,t,n,s,u)=>{let[d,l,p,o,r]=n.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],i=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${i} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",l,`max(0, min(depth, ${n[l]} - 1))`)};
      ${e.indicesSet("input_indices",p,`max(0, min(height, ${n[p]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(width, ${n[o]} - 1))`)};
      ${Ua(e,r,d,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${i} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${i} = originalIndices[${l}];
      var height:${i} = originalIndices[${p}];
      var width:${i} = originalIndices[${o}];
      ${s?`if (depth < 0 || depth > (${n[l]} - 1) || height < 0 || height > (${n[p]} - 1) || width < 0 || (width > ${n[o]} - 1)) {
      return ${u};
        }`:""};

    depth = max(0, min(depth, ${n[l]} - 1));
      height = max(0, min(height, ${n[p]} - 1));
      width = max(0, min(width, ${n[o]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${n.length>3?`u32(originalIndices[${r}])`:"0"};
      var batch: u32 =  ${n.length>3?`u32(originalIndices[${d}])`:"0"};

      var x111: ${i} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${i} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${i} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${i} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${i} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${i} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${i} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${i} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${i} = abs(depth - ${i}(depth1));
      var dx2: ${i} = abs(${i}(depth2) - depth);
      var dy1: ${i} = abs(height - ${i}(height1));
      var dy2: ${i} = abs(${i}(height2) - height);
      var dz1: ${i} = abs(width - ${i}(width1));
      var dz2: ${i} = abs(${i}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},am=(e,t,n,s,u,d)=>{let l=e.dims,p=Jg(d,t.axes,l.length),o=Qg(l,s,u,t.axes),r=s.slice();s.length===0&&(r=l.map((_,O)=>_===0?1:o[O]/_),t.keepAspectRatioPolicy!=="stretch"&&(o=Yg(l,r,t)));let i=ee("output",e.dataType,o.length),a=M("input",e.dataType,l.length),c=R.size(o),h=l.length===o.length&&l.every((_,O)=>_===o[O]),g=t.coordinateTransformMode==="tf_crop_and_resize",b=t.extrapolationValue,x=a.type.value,$=_=>`
      ${h?"":`
      ${Xg(t.coordinateTransformMode,x)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${rm(a,l)};
              ${Zg(t.nearestMode,n,x)};
              ${tm(a,i,l,o,r.length,p.length,g)};
              `;case"linear":return`
              ${em(i,l,o,r.length,p.length)};
              ${(()=>{if(l.length===2||l.length===4)return`${nm(a,i,l,g,b)}`;if(l.length===3||l.length===5)return`${om(a,i,l,g,b)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(l.length===2||l.length===4)return`${im(a,i,l,o,r,p,t.cubicCoeffA,g,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${_.registerUniform("output_size","u32").registerUniform("scales","f32",r.length).registerUniform("roi","f32",p.length).declareVariables(a,i)}
      ${_.mainStart()}
        ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${h?"output[global_idx] = input[global_idx];":`
        let output_indices = ${i.offsetToIndices("global_idx")};
        var input_indices: ${a.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${a.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${l.length===2||l.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${n}|${r.length>0?t.mode==="cubic"?r:r.length:""}|${u.length>0?u:""}|${p.length>0?p:""}|${h}|${t.mode==="nearest"?l.length:l}`,inputDependencies:["rank"]},getShaderSource:$,getRunData:()=>({outputs:[{dims:o,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:[{type:12,data:c},{type:1,data:r},{type:1,data:p},...ne(l,o)]})}},sm=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},x1=(e,t)=>{let n=[],s=[],u=[],d=sm(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");Kg(e.inputs,t,d,n,s,u),e.compute(am(e.inputs[0],t,d,n,s,u),{inputs:[0]})},$1=e=>{let t=e.antialias,n=e.axes,s=e.coordinateTransformMode,u=e.cubicCoeffA,d=e.excludeOutside!==0,l=e.extrapolationValue,p=e.keepAspectRatioPolicy,o=e.mode,r=e.nearestMode===""?"simple":e.nearestMode;return Se({antialias:t,axes:n,coordinateTransformMode:s,cubicCoeffA:u,excludeOutside:d,extrapolationValue:l,keepAspectRatioPolicy:p,mode:o,nearestMode:r})}}),um,lm,T1,GS=C(()=>{ae(),se(),ue(),um=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],n=e[1],s=e[2];if(t.dataType!==n.dataType||t.dataType!==s.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(n.dims.length!==3&&n.dims.length!==2)throw new Error("Skip must be 2D or 3D");let u=t.dims[t.dims.length-1],d=t.dims[t.dims.length-2];if(n.dims[n.dims.length-1]!==u)throw new Error("Skip must have the same hidden size as input");if(n.dims[n.dims.length-2]!==d)throw new Error("Skip must have the same sequence length as input");if(s.dims.length!==1)throw new Error("Gamma must be 1D");if(s.dims[s.dims.length-1]!==u)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let l=e[3];if(l.dims.length!==1)throw new Error("Beta must be 1D");if(l.dims[l.dims.length-1]!==u)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let l=e[4];if(l.dims.length!==1)throw new Error("Bias must be 1D");if(l.dims[l.dims.length-1]!==u)throw new Error("Bias must have the same hidden size as input")}},lm=(e,t,n,s)=>{let u=t.simplified,d=e[0].dims,l=R.size(d),p=d,o=l,r=d.slice(-1)[0],i=s?d.slice(0,-1).concat(1):[],a=!u&&e.length>3,c=e.length>4,h=s&&n>1,g=s&&n>2,b=n>3,x=64,$=Fe(r),_=[{type:12,data:o},{type:12,data:$},{type:12,data:r},{type:1,data:t.epsilon}],O=E=>{let A=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],D=[M("x",e[0].dataType,e[0].dims,$),M("skip",e[1].dataType,e[1].dims,$),M("gamma",e[2].dataType,e[2].dims,$)];a&&D.push(M("beta",e[3].dataType,e[3].dims,$)),c&&D.push(M("bias",e[4].dataType,e[4].dims,$)),D.push(ee("output",e[0].dataType,p,$)),h&&D.push(ee("mean_output",1,i)),g&&D.push(ee("inv_std_output",1,i)),b&&D.push(ee("input_skip_bias_sum",e[0].dataType,p,$));let S=He(e[0].dataType),L=He(1,$);return`

      ${E.registerUniforms(A).declareVariables(...D)}
      var<workgroup> sum_shared : array<${L}, ${x}>;
      var<workgroup> sum_squared_shared : array<${L}, ${x}>;

      ${E.mainStart([x,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${x};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${x};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${x-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${c?"bias[offset1d + i]":S+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${b?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${tn(S,$,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${x};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${sr("sum",$)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${sr("square_sum",$)} / f32(uniforms.hidden_size) ${u?"":"- mean * mean"} + uniforms.epsilon);
        ${h?"mean_output[global_idx] = mean;":""}
        ${g?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${u?"":`- ${S}(mean)`}) *
            ${S}(inv_std_dev) * gamma[offset1d + i]
            ${a?"+ beta[offset1d + i]":""};
        }
      }`},I=[{dims:p,dataType:e[0].dataType}];return n>1&&I.push({dims:i,dataType:1}),n>2&&I.push({dims:i,dataType:1}),n>3&&I.push({dims:d,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${$};${h};${g};${b}`,inputDependencies:e.map((E,A)=>"type")},getShaderSource:O,getRunData:()=>({outputs:I,dispatchGroup:{x:Math.ceil(o/r)},programUniforms:_})}},T1=(e,t)=>{um(e.inputs);let n=[0];e.outputCount>1&&n.push(-3),e.outputCount>2&&n.push(-3),e.outputCount>3&&n.push(3),e.compute(lm(e.inputs,t,e.outputCount,!1),{outputs:n})}}),dm,En,pm,qa,cm,hm,S1,I1,HS=C(()=>{ae(),se(),Ve(),ue(),dm=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((n,s)=>{if(e[s+1].dataType!==6&&e[s+1].dataType!==7)throw new Error(`Input ${s} must be an array of int32 or int64`)})},En=(e,t)=>{let n=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(s=>n.push(Number(s)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(s=>n.push(Number(s)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return n},pm=(e,t)=>{if(e.length>1){let n=En(e,1),s=En(e,2),u=En(e,3);return u.length===0&&(u=[...Array(e[0].dims.length).keys()]),Se({starts:n,ends:s,axes:u})}else return t},qa=(e,t,n,s,u)=>{let d=e;return e<0&&(d+=n[s[t]]),u[t]<0?Math.max(0,Math.min(d,n[s[t]]-1)):Math.max(0,Math.min(d,n[s[t]]))},cm=(e,t,n)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${n.length-1}; i >= 0; i--) {
            let input_shape_i = ${te("uniforms.input_shape","i",n.length)};
            let steps_i = ${te("uniforms.steps","i",n.length)};
            let signs_i = ${te("uniforms.signs","i",n.length)};
            let starts_i = ${te("uniforms.starts","i",n.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,hm=(e,t)=>{let n=e[0].dims,s=R.size(n),u=t.axes.length>0?R.normalizeAxes(t.axes,n.length):[...Array(n.length).keys()],d=En(e,4);d.forEach($=>$!==0||(()=>{throw new Error("step cannot be 0")})),d.length===0&&(d=Array(u.length).fill(1));let l=t.starts.map(($,_)=>qa($,_,n,u,d)),p=t.ends.map(($,_)=>qa($,_,n,u,d));if(u.length!==l.length||u.length!==p.length)throw new Error("start, ends and axes should have the same number of elements");if(u.length!==n.length)for(let $=0;$<n.length;++$)u.includes($)||(l.splice($,0,0),p.splice($,0,n[$]),d.splice($,0,1));let o=d.map($=>Math.sign($));d.forEach(($,_,O)=>{if($<0){let I=(p[_]-l[_])/$,E=l[_],A=E+I*d[_];l[_]=A,p[_]=E,O[_]=-$}});let r=n.slice(0);u.forEach(($,_)=>{r[$]=Math.ceil((p[$]-l[$])/d[$])});let i={dims:r,dataType:e[0].dataType},a=ee("output",e[0].dataType,r.length),c=M("input",e[0].dataType,e[0].dims.length),h=R.size(r),g=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:l.length},{name:"signs",type:"i32",length:o.length},{name:"steps",type:"u32",length:d.length}],b=[{type:12,data:h},{type:12,data:l},{type:6,data:o},{type:12,data:d},...ne(e[0].dims,r)],x=$=>`
      ${$.registerUniforms(g).declareVariables(c,a)}
        ${cm(c,a,n)}
        ${$.mainStart()}
          ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${a.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${a.setByOffset("global_idx",c.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${o.length}_${l.length}_${d.length}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[i],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:b})}},S1=(e,t)=>{dm(e.inputs,t);let n=pm(e.inputs,t);e.compute(hm(e.inputs,n),{inputs:[0]})},I1=e=>{let t=e.starts,n=e.ends,s=e.axes;return Se({starts:t,ends:n,axes:s})}}),fm,gm,O1,E1,WS=C(()=>{ae(),se(),Ve(),lr(),ue(),fm=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},gm=(e,t)=>{let n=e.inputs[0],s=n.dims,u=R.size(s),d=s.length,l=R.normalizeAxis(t.axis,d),p=l<s.length-1,o,r=[];p?(r=Array.from({length:d},(D,S)=>S),r[l]=d-1,r[d-1]=l,o=e.compute(dt(n,r),{inputs:[n],outputs:[-1]})[0]):o=n;let i=o.dims,a=i[d-1],c=u/a,h=Fe(a),g=a/h,b=64;c===1&&(b=256);let x=(D,S)=>S===4?`max(max(${D}.x, ${D}.y), max(${D}.z, ${D}.w))`:S===2?`max(${D}.x, ${D}.y)`:S===3?`max(max(${D}.x, ${D}.y), ${D}.z)`:D,$=M("x",o.dataType,o.dims,h),_=ee("result",o.dataType,o.dims,h),O=$.type.value,I=He(o.dataType)==="f32"?`var threadMax = ${O}(-3.4028234663852886e+38f);`:`var threadMax = ${O}(-65504.0h);`,E=D=>`
      var<workgroup> rowMaxShared : ${O};
      var<workgroup> rowSumShared : ${O};
      var<workgroup> threadShared : array<${O}, ${b}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${O} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${O}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${D.registerUniform("packedCols","i32").declareVariables($,_)}
      ${D.mainStart(b)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${b};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${I}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${O}(${x("threadShared[0]",h)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${O}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${O}(${sr("threadShared[0]",h)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${O}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,A=e.compute({name:"Softmax",shaderCache:{hint:`${h};${b}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:i,dataType:o.dataType}],dispatchGroup:{x:c},programUniforms:[{type:6,data:g}]}),getShaderSource:E},{inputs:[o],outputs:[p?-1:0]})[0];p&&e.compute(dt(A,r),{inputs:[A]})},O1=(e,t)=>{fm(e.inputs),gm(e,t)},E1=e=>Se({axis:e.axis})}),Ga,mm,bm,ym,P1,KS=C(()=>{ae(),se(),ue(),Ga=e=>Array.from(e.getBigInt64Array(),Number),mm=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(Ga(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},bm=(e,t)=>{let n=[];for(let s=0;s<e.length;++s)n.push(e[s]*t[s]);return n},ym=(e,t)=>{let n=e[0].dims,s=t??Ga(e[1]),u=bm(n,s),d=R.size(u),l=e[0].dataType,p=M("input",l,n.length),o=ee("output",l,u.length),r=i=>`
      const inputShape = ${p.indices(...n)};
      ${i.registerUniform("output_size","u32").declareVariables(p,o)}
      ${i.mainStart()}
      ${i.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${o.offsetToIndices("global_idx")};
      var input_indices: ${p.type.indices};
      for (var i = 0; i < ${n.length}; i++) {
        let input_dim_i = ${p.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${o.indicesGet("output_indices","i")}  % input_dim_i;

        ${p.indicesSet("input_indices","i","input_dim_value")}
      }
      ${o.setByOffset("global_idx",p.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${s}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:[{type:12,data:d},...ne(e[0].dims,u)]}),getShaderSource:r}},P1=e=>{mm(e.inputs),e.compute(ym(e.inputs),{inputs:[0]})}}),_m,vm,A1,XS=C(()=>{ae(),se(),ue(),_m=(e,t,n,s,u)=>{let d=ee("output_data",u,n.length,4),l=M("a_data",t[1].dataType,t[1].dims.length,4),p=M("b_data",t[2].dataType,t[2].dims.length,4),o=M("c_data",t[0].dataType,t[0].dims.length,4),r,i=(a,c,h)=>`select(${c}, ${a}, ${h})`;if(!s)r=d.setByOffset("global_idx",i(l.getByOffset("global_idx"),p.getByOffset("global_idx"),o.getByOffset("global_idx")));else{let a=(c,h,g="")=>{let b=`a_data[index_a${h}][component_a${h}]`,x=`b_data[index_b${h}][component_b${h}]`,$=`bool(c_data[index_c${h}] & (0xffu << (component_c${h} * 8)))`;return`
            let output_indices${h} = ${d.offsetToIndices(`global_idx * 4u + ${h}u`)};
            let offset_a${h} = ${l.broadcastedIndicesToOffset(`output_indices${h}`,d)};
            let offset_b${h} = ${p.broadcastedIndicesToOffset(`output_indices${h}`,d)};
            let offset_c${h} = ${o.broadcastedIndicesToOffset(`output_indices${h}`,d)};
            let index_a${h} = offset_a${h} / 4u;
            let index_b${h} = offset_b${h} / 4u;
            let index_c${h} = offset_c${h} / 4u;
            let component_a${h} = offset_a${h} % 4u;
            let component_b${h} = offset_b${h} % 4u;
            let component_c${h} = offset_c${h} % 4u;
            ${c}[${h}] = ${g}(${i(b,x,$)});
          `};u===9?r=`
            var data = vec4<u32>(0);
            ${a("data",0,"u32")}
            ${a("data",1,"u32")}
            ${a("data",2,"u32")}
            ${a("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:r=`
            ${a("output_data[global_idx]",0)}
            ${a("output_data[global_idx]",1)}
            ${a("output_data[global_idx]",2)}
            ${a("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(o,l,p,d)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${r}
      }`},vm=e=>{let t=e[1].dims,n=e[2].dims,s=e[0].dims,u=e[1].dataType,d=!(R.areEqual(t,n)&&R.areEqual(n,s)),l=t,p=R.size(t);if(d){let r=on.calcShape(on.calcShape(t,n,!1),s,!1);if(!r)throw new Error("Can't perform where op on the given tensors");l=r,p=R.size(l)}let o=Math.ceil(p/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:r=>_m(r,e,l,d,u),getRunData:()=>({outputs:[{dims:l,dataType:u}],dispatchGroup:{x:Math.ceil(p/64/4)},programUniforms:[{type:12,data:o},...ne(s,t,n,l)]})}},A1=e=>{e.compute(vm(e.inputs))}}),k1,ZS=C(()=>{dS(),Iu(),pS(),cS(),hS(),fS(),gS(),vS(),xS(),$S(),TS(),SS(),IS(),OS(),ES(),PS(),AS(),kS(),DS(),NS(),CS(),zS(),RS(),BS(),MS(),Zw(),jS(),FS(),LS(),VS(),US(),Su(),qS(),t1(),GS(),HS(),WS(),Yw(),KS(),lr(),Ou(),XS(),k1=new Map([["Abs",[Tv]],["Acos",[Sv]],["Acosh",[Iv]],["Add",[aw]],["ArgMax",[vv,Ws]],["ArgMin",[_v,Ws]],["Asin",[Ov]],["Asinh",[Ev]],["Atan",[Pv]],["Atanh",[Av]],["Attention",[wv]],["AveragePool",[d1,l1]],["BatchNormalization",[xv]],["BiasAdd",[$v]],["BiasSplitGelu",[ow]],["Cast",[Dv,kv]],["Ceil",[Cv]],["Clip",[Nv]],["Concat",[mw,bw]],["Conv",[Ys,Qs]],["ConvTranspose",[Ow,Iw]],["Cos",[zv]],["Cosh",[Rv]],["CumSum",[Ew,Pw]],["DepthToSpace",[Aw,kw]],["DequantizeLinear",[b1,y1]],["Div",[sw]],["Einsum",[Dw,Nw]],["Elu",[Bv,jn]],["Equal",[uw]],["Erf",[Mv]],["Exp",[jv]],["Expand",[Cw]],["FastGelu",[zw]],["Floor",[Fv]],["FusedConv",[Ys,Qs]],["Gather",[Bw,Rw]],["GatherElements",[Uw,Vw]],["GatherBlockQuantized",[Fw,Lw]],["GatherND",[Mw,jw]],["Gelu",[Lv]],["Gemm",[Gw,qw]],["GlobalAveragePool",[c1,p1]],["GlobalMaxPool",[m1,g1]],["Greater",[cw]],["GreaterOrEqual",[fw]],["GridSample",[Hw,Ww]],["GroupQueryAttention",[r1]],["HardSigmoid",[Xv,Kv]],["InstanceNormalization",[n1]],["LayerNormalization",[i1]],["LeakyRelu",[Vv,jn]],["Less",[hw]],["LessOrEqual",[gw]],["Log",[nw]],["MatMul",[o1]],["MatMulNBits",[a1,s1]],["MaxPool",[h1,f1]],["Mul",[lw]],["MultiHeadAttention",[Xw,Kw]],["Neg",[qv]],["Not",[Uv]],["Pad",[u1]],["Pow",[dw]],["QuickGelu",[iw,jn]],["Range",[_1]],["Reciprocal",[Gv]],["ReduceMin",[fv]],["ReduceMean",[lv]],["ReduceMax",[hv]],["ReduceSum",[mv]],["ReduceProd",[gv]],["ReduceL1",[dv]],["ReduceL2",[pv]],["ReduceLogSum",[yv]],["ReduceLogSumExp",[cv]],["ReduceSumSquare",[bv]],["Relu",[Hv]],["Resize",[x1,$1]],["RotaryEmbedding",[e1]],["ScatterND",[w1,v1]],["Sigmoid",[Wv]],["Sin",[Zv]],["Sinh",[Jv]],["Slice",[S1,I1]],["SkipLayerNormalization",[T1]],["Split",[Jw,Qw]],["Sqrt",[Qv]],["Softmax",[O1,E1]],["Sub",[pw]],["Tan",[Yv]],["Tanh",[ew]],["ThresholdedRelu",[rw,jn]],["Tile",[P1]],["Transpose",[J_,Q_]],["Where",[A1]]])}),D1,JS=C(()=>{et(),Gt(),ue(),D1=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,n,s,u){Bt(e.programInfo.name);let d=this.backend.device,l=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let p=[];for(let r of t)p.push({binding:p.length,resource:{buffer:r.buffer}});for(let r of n)p.push({binding:p.length,resource:{buffer:r.buffer}});u&&p.push({binding:p.length,resource:u});let o=d.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:p,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let r={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:o,dispatchGroup:s};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(r)}l.setPipeline(e.computePipeline),l.setBindGroup(0,o),l.dispatchWorkgroups(...s),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Et(e.programInfo.name)}dispose(){}build(e,t){Bt(e.name);let n=this.backend.device,s=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(r=>{n.features.has(r.feature)&&s.push(`enable ${r.extension};`)});let u=Z_(t,this.backend.device.limits),d=e.getShaderSource(u),l=`${s.join(`
`)}
${u.additionalImplementations}
${d}`,p=n.createShaderModule({code:l,label:e.name});_e("verbose",()=>`[WebGPU] ${e.name} shader code: ${l}`);let o=n.createComputePipeline({compute:{module:p,entryPoint:"main"},layout:"auto",label:e.name});return Et(e.name),{programInfo:e,computePipeline:o,uniformVariablesInfo:u.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,n=typeof e=="number"?1:e.y||1,s=typeof e=="number"?1:e.z||1,u=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=u&&n<=u&&s<=u)return[t,n,s];let d=t*n*s,l=Math.ceil(Math.sqrt(d));if(l>u){if(l=Math.ceil(Math.cbrt(d)),l>u)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[l,l,l]}else return[l,l,1]}}}),N1={};Ur(N1,{WebGpuBackend:()=>C1});var wm,xm,$m,C1,QS=C(()=>{et(),ae(),Gt(),G_(),uS(),ZS(),JS(),wm=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let n=[];for(let s=0;s<e.length;++s){let u=e[s].dataType;switch(t[s]){case"none":{n.push("");break}case"type":{n.push(`${u}`);break}case"rank":{let d=e[s].dims.length;n.push(`${u};${d}`);break}case"dims":{let d=e[s].dims.join(",");n.push(`${u};${d}`);break}default:throw new Error(`unsupported input dependency: ${t[s]}`)}}return n.join("|")},xm=(e,t,n)=>{let s=e.name;return e.shaderCache?.hint&&(s+="["+e.shaderCache.hint+"]"),s+=":"+n+`:${wm(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,s},$m=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},C1=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let n=[],s={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:n},u=p=>t.features.has(p)&&n.push(p)&&!0;u("chromium-experimental-timestamp-query-inside-passes")||u("timestamp-query"),u("shader-f16"),u("subgroups"),this.device=await t.requestDevice(s);let d=t,l=t.info??(typeof d.requestAdapterInfo=="function"?await d.requestAdapterInfo():void 0);this.adapterInfo=new $m(l),this.gpuDataManager=K_(this),this.programManager=new D1(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,wu(e.logLevel,!!e.debug),this.device.onuncapturederror=p=>{p.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${p.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&this.env?.webgpu&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;Bt(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),n=this.pendingQueries.get(e);for(let s=0;s<t.length/2;s++){let u=n[s],d=u.kernelId,l=this.kernels.get(d),p=l.kernelType,o=l.kernelName,r=u.programName,i=u.inputTensorViews,a=u.outputTensorViews,c=t[s*2],h=t[s*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=c);let g=Number(c-this.queryTimeBase),b=Number(h-this.queryTimeBase);if(!Number.isSafeInteger(g)||!Number.isSafeInteger(b))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:i.map(x=>({dims:x.dims,dataType:Ut(x.dataType)})),outputsMetadata:a.map(x=>({dims:x.dims,dataType:Ut(x.dataType)})),kernelId:d,kernelType:p,kernelName:o,programName:r,startTime:g,endTime:b});else{let x="";i.forEach((_,O)=>{x+=`input[${O}]: [${_.dims}] | ${Ut(_.dataType)}, `});let $="";a.forEach((_,O)=>{$+=`output[${O}]: [${_.dims}] | ${Ut(_.dataType)}, `}),console.log(`[profiling] kernel "${d}|${p}|${o}|${r}" ${x}${$}start time: ${g} ns, execution time: ${b-g} ns`)}Ci("GPU",`${r}::${c}::${h}`)}e.unmap(),this.pendingQueries.delete(e)}),Et()}run(e,t,n,s,u,d){Bt(e.name);let l=[];for(let _=0;_<t.length;++_){let O=t[_].data;if(O===0)continue;let I=this.gpuDataManager.get(O);if(!I)throw new Error(`no GPU data for input: ${O}`);l.push(I)}let{outputs:p,dispatchGroup:o,programUniforms:r}=e.getRunData(t),i=n.length===0?p.map((_,O)=>O):n;if(i.length!==p.length)throw new Error(`Output size ${i.length} must be equal to ${p.length}.`);let a=[],c=[];for(let _=0;_<p.length;++_){if(!Number.isInteger(i[_])||i[_]<-3||i[_]>=d)throw new Error(`Invalid output index: ${i[_]}`);if(i[_]===-3)continue;let O=i[_]===-1,I=i[_]===-2,E=O||I?u(p[_].dataType,p[_].dims):s(i[_],p[_].dataType,p[_].dims);if(a.push(E),E.data===0)continue;let A=this.gpuDataManager.get(E.data);if(!A)throw new Error(`no GPU data for output: ${E.data}`);if(O&&this.temporaryData.push(A),I){let D=this.kernelPersistentData.get(this.currentKernelId);D||(D=[],this.kernelPersistentData.set(this.currentKernelId,D)),D.push(A)}c.push(A)}if(l.length!==t.length||c.length!==a.length){if(c.length===0)return Et(e.name),a;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let h;if(r){let _=0,O=[];r.forEach(D=>{let S=typeof D.data=="number"?[D.data]:D.data;if(S.length===0)return;let L=D.type===10?2:4,U,ie;D.type===10?(ie=S.length>4?16:S.length>2?8:S.length*L,U=S.length>4?16:L*S.length):(ie=S.length<=2?S.length*L:16,U=16),_=Math.ceil(_/ie)*ie,O.push(_);let K=D.type===10?8:4;_+=S.length>4?Math.ceil(S.length/K)*U:S.length*L});let I=16;_=Math.ceil(_/I)*I;let E=new ArrayBuffer(_);r.forEach((D,S)=>{let L=O[S],U=typeof D.data=="number"?[D.data]:D.data;if(D.type===6)new Int32Array(E,L,U.length).set(U);else if(D.type===12)new Uint32Array(E,L,U.length).set(U);else if(D.type===10)new Uint16Array(E,L,U.length).set(U);else if(D.type===1)new Float32Array(E,L,U.length).set(U);else throw new Error(`Unsupported uniform type: ${Ut(D.type)}`)});let A=this.gpuDataManager.create(_,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(A.buffer,0,E,0,_),this.gpuDataManager.release(A.id),h={offset:0,size:_,buffer:A.buffer}}let g=this.programManager.normalizeDispatchGroupSize(o),b=g[1]===1&&g[2]===1,x=xm(e,t,b),$=this.programManager.getArtifact(x);if($||($=this.programManager.build(e,g),this.programManager.setArtifact(x,$),_e("info",()=>`[artifact] key: ${x}, programName: ${e.name}`)),r&&$.uniformVariablesInfo){if(r.length!==$.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${$.uniformVariablesInfo.length}, got ${r.length} in program "${$.programInfo.name}".`);for(let _=0;_<r.length;_++){let O=r[_],I=O.type,E=typeof O.data=="number"?1:O.data.length,[A,D]=$.uniformVariablesInfo[_];if(I!==A||E!==D)throw new Error(`Uniform variable ${_} mismatch: expect type ${A} with size ${D}, got type ${I} with size ${E} in program "${$.programInfo.name}".`)}}if(_e("info",()=>`[ProgramManager] run "${e.name}" (key=${x}) with ${g[0]}x${g[1]}x${g[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let _={kernelId:this.currentKernelId,programName:$.programInfo.name,inputTensorViews:t,outputTensorViews:a};this.pendingKernels.push(_),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(_)}return this.programManager.run($,l,c,g,h),Et(e.name),a}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,n,s){let u=k1.get(e);if(!u)throw new Error(`kernel not implemented: ${e}`);let d={kernelType:e,kernelName:s,kernelEntry:u[0],attributes:[u[1],n]};this.kernels.set(t,d)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let n of t)this.gpuDataManager.release(n.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,n){let s=this.kernels.get(e);if(!s)throw new Error(`kernel not created: ${e}`);let u=s.kernelType,d=s.kernelName,l=s.kernelEntry,p=s.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${u}] ${d}" is not allowed to be called recursively`);this.currentKernelId=e,p[0]&&(p[1]=p[0](p[1]),p[0]=void 0),_e("info",()=>`[WebGPU] Start to run kernel "[${u}] ${d}"...`);let o=this.env.debug;this.temporaryData=[];try{return o&&this.device.pushErrorScope("validation"),l(t,p[1]),0}catch(r){return n.push(Promise.resolve(`[WebGPU] Kernel "[${u}] ${d}" failed. ${r}`)),1}finally{o&&n.push(this.device.popErrorScope().then(r=>r?`GPU validation error for kernel "[${u}] ${d}": ${r.message}`:null));for(let r of this.temporaryData)this.gpuDataManager.release(r.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,n,s){let u=this.sessionExternalDataMapping.get(e);u||(u=new Map,this.sessionExternalDataMapping.set(e,u));let d=u.get(t),l=this.gpuDataManager.registerExternalBuffer(n,s,d);return u.set(t,[l,n]),l}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(n=>this.gpuDataManager.unregisterExternalBuffer(n[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,n){return async()=>{let s=await qs(this,e,t);return xu(s.buffer,n)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){_e("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){_e("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){_e("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),n=e.length;this.pendingKernels=[];for(let s=0;s<n;s++){let u=this.getComputePassEncoder(),d=e[s];this.writeTimestamp(this.pendingDispatchNumber*2),u.setPipeline(d.computePipeline),u.setBindGroup(0,d.bindGroup),u.dispatchWorkgroups(...d.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[s]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),z1={};Ur(z1,{init:()=>R1});var Oi,Tm,R1,YS=C(()=>{ae(),Gt(),se(),sS(),Oi=class B1{constructor(t,n,s,u){this.module=t,this.dataType=n,this.data=s,this.dims=u}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(R.size(t)!==R.size(this.dims))throw new Error("Invalid new shape");return new B1(this.module,this.dataType,this.data,t)}},Tm=class{constructor(e,t,n){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let s=e.PTR_SIZE,u=n/e.PTR_SIZE,d=s===4?"i32":"i64";this.opKernelContext=Number(e.getValue(s*u++,d));let l=Number(e.getValue(s*u++,d));this.outputCount=Number(e.getValue(s*u++,d)),this.customDataOffset=Number(e.getValue(s*u++,"*")),this.customDataSize=Number(e.getValue(s*u++,d));let p=[];for(let o=0;o<l;o++){let r=Number(e.getValue(s*u++,d)),i=Number(e.getValue(s*u++,"*")),a=Number(e.getValue(s*u++,d)),c=[];for(let h=0;h<a;h++)c.push(Number(e.getValue(s*u++,d)));p.push(new Oi(e,r,i,c))}this.inputs=p}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let n=t?.inputs?.map(l=>typeof l=="number"?this.inputs[l]:l)??this.inputs,s=t?.outputs??[],u=(l,p,o)=>new Oi(this.module,p,this.output(l,o),o),d=(l,p)=>{let o=zr(l,p);if(!o)throw new Error(`Unsupported data type: ${l}`);let r=o>0?this.backend.gpuDataManager.create(o).id:0;return new Oi(this.module,l,r,p)};return this.backend.run(e,n,s,u,d,this.outputCount)}output(e,t){let n=this.module.stackSave();try{let s=this.module.PTR_SIZE,u=s===4?"i32":"i64",d=this.module.stackAlloc((1+t.length)*s);this.module.setValue(d,t.length,u);for(let l=0;l<t.length;l++)this.module.setValue(d+s*(l+1),t[l],u);return this.module._JsepOutput(this.opKernelContext,e,d)}catch(s){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${s}`)}finally{this.module.stackRestore(n)}}},R1=async(e,t,n,s)=>{let u=t.jsepInit;if(!u)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let d=(QS(),rn(N1)).WebGpuBackend,l=new d;await l.initialize(n,s),u("webgpu",[l,p=>l.alloc(Number(p)),p=>l.free(p),(p,o,r,i=!1)=>{if(i)_e("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(p)}, dst=${Number(o)}, size=${Number(r)}`),l.memcpy(Number(p),Number(o));else{_e("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(p)}, gpuDataId=${Number(o)}, size=${Number(r)}`);let a=t.HEAPU8.subarray(Number(p>>>0),Number(p>>>0)+Number(r));l.upload(Number(o),a)}},async(p,o,r)=>{_e("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${p}, dataOffset=${o}, size=${r}`),await l.download(Number(p),()=>t.HEAPU8.subarray(Number(o)>>>0,Number(o+r)>>>0))},(p,o,r)=>l.createKernel(p,Number(o),r,t.UTF8ToString(t._JsepGetNodeName(Number(o)))),p=>l.releaseKernel(p),(p,o,r,i)=>{_e("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${r}, kernel=${p}, contextDataOffset=${o}`);let a=new Tm(t,l,Number(o));return l.computeKernel(Number(p),a,i)},()=>l.captureBegin(),()=>l.captureEnd(),()=>l.replay()])}else{let d=new W_(n);u("webnn",[d,()=>d.reserveTensorId(),l=>d.releaseTensorId(l),async(l,p,o,r,i)=>d.ensureTensor(l,p,o,r,i),(l,p)=>{d.uploadTensor(l,p)},async(l,p)=>d.downloadTensor(l,p),(l,p)=>d.registerMLContext(l,p),!!n.trace])}}}),Sm,Nu,Cu,Yt,Im,Ha,qi,zu,Ru,Wa,Bu,Mu,ju,M1=C(()=>{et(),iS(),oS(),ae(),Gr(),bu(),L_(),Sm=(e,t)=>{Ce()._OrtInit(e,t)!==0&&Ie("Can't initialize onnxruntime.")},Nu=async e=>{Sm(e.wasm.numThreads,ji(e.logLevel))},Cu=async(e,t)=>{Ce().asyncInit?.();let n=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(n){if(typeof n.limits!="object"||typeof n.features!="object"||typeof n.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let s=e.webgpu.powerPreference;if(s!==void 0&&s!=="low-power"&&s!=="high-performance")throw new Error(`Invalid powerPreference setting: "${s}"`);let u=e.webgpu.forceFallbackAdapter;if(u!==void 0&&typeof u!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${u}"`);if(n=await navigator.gpu.requestAdapter({powerPreference:s,forceFallbackAdapter:u}),!n)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let s=(YS(),rn(z1)).init;t==="webgpu"&&await s("webgpu",Ce(),e,n),t==="webnn"&&await s("webnn",Ce(),e)}},Yt=new Map,Im=e=>{let t=Ce(),n=t.stackSave();try{let s=t.PTR_SIZE,u=t.stackAlloc(2*s);t._OrtGetInputOutputCount(e,u,u+s)!==0&&Ie("Can't get session input/output count.");let d=s===4?"i32":"i64";return[Number(t.getValue(u,d)),Number(t.getValue(u+s,d))]}finally{t.stackRestore(n)}},Ha=(e,t)=>{let n=Ce(),s=n.stackSave(),u=0;try{let d=n.PTR_SIZE,l=n.stackAlloc(2*d);n._OrtGetInputOutputMetadata(e,t,l,l+d)!==0&&Ie("Can't get session input/output metadata.");let p=Number(n.getValue(l,"*"));u=Number(n.getValue(l+d,"*"));let o=n.HEAP32[u/4];if(o===0)return[p,0];let r=n.HEAPU32[u/4+1],i=[];for(let a=0;a<r;a++){let c=Number(n.getValue(u+8+a*d,"*"));i.push(c!==0?n.UTF8ToString(c):Number(n.getValue(u+8+(a+r)*d,"*")))}return[p,o,i]}finally{n.stackRestore(s),u!==0&&n._OrtFree(u)}},qi=e=>{let t=Ce(),n=t._malloc(e.byteLength);if(n===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,n),[n,e.byteLength]},zu=async(e,t)=>{let n,s,u=Ce();Array.isArray(e)?[n,s]=e:e.buffer===u.HEAPU8.buffer?[n,s]=[e.byteOffset,e.byteLength]:[n,s]=qi(e);let d=0,l=0,p=0,o=[],r=[],i=[];try{if([l,o]=await F_(t),t?.externalData&&u.mountExternalData){let I=[];for(let E of t.externalData){let A=typeof E=="string"?E:E.path;I.push(vu(typeof E=="string"?E:E.data).then(D=>{u.mountExternalData(A,D)}))}await Promise.all(I)}for(let I of t?.executionProviders??[])if((typeof I=="string"?I:I.name)==="webnn"){if(u.shouldTransferToMLTensor=!1,typeof I!="string"){let E=I,A=E?.context,D=E?.gpuDevice,S=E?.deviceType,L=E?.powerPreference;A?u.currentContext=A:D?u.currentContext=await u.webnnCreateMLContext(D):u.currentContext=await u.webnnCreateMLContext({deviceType:S,powerPreference:L})}else u.currentContext=await u.webnnCreateMLContext();break}d=await u._OrtCreateSession(n,s,l),u.webgpuOnCreateSession?.(d),d===0&&Ie("Can't create a session."),u.jsepOnCreateSession?.(),u.currentContext&&(u.webnnRegisterMLContext(d,u.currentContext),u.currentContext=void 0,u.shouldTransferToMLTensor=!0);let[a,c]=Im(d),h=!!t?.enableGraphCapture,g=[],b=[],x=[],$=[],_=[];for(let I=0;I<a;I++){let[E,A,D]=Ha(d,I);E===0&&Ie("Can't get an input name."),r.push(E);let S=u.UTF8ToString(E);g.push(S),x.push(A===0?{name:S,isTensor:!1}:{name:S,isTensor:!0,type:Ut(A),shape:D})}for(let I=0;I<c;I++){let[E,A,D]=Ha(d,I+a);E===0&&Ie("Can't get an output name."),i.push(E);let S=u.UTF8ToString(E);b.push(S),$.push(A===0?{name:S,isTensor:!1}:{name:S,isTensor:!0,type:Ut(A),shape:D});{if(h&&t?.preferredOutputLocation===void 0){_.push("gpu-buffer");continue}let L=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[S]??"cpu",U=u.webnnIsGraphOutput;if(L==="cpu"&&U&&U(d,S)){_.push("ml-tensor-cpu-output");continue}if(L!=="cpu"&&L!=="cpu-pinned"&&L!=="gpu-buffer"&&L!=="ml-tensor")throw new Error(`Not supported preferred output location: ${L}.`);if(h&&L!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${L}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);_.push(L)}}let O=null;return _.some(I=>I==="gpu-buffer"||I==="ml-tensor"||I==="ml-tensor-cpu-output")&&(p=u._OrtCreateBinding(d),p===0&&Ie("Can't create IO binding."),O={handle:p,outputPreferredLocations:_,outputPreferredLocationsEncoded:_.map(I=>I==="ml-tensor-cpu-output"?"ml-tensor":I).map(I=>Vs(I))}),Yt.set(d,[d,r,i,O,h,!1]),[d,g,b,x,$]}catch(a){throw r.forEach(c=>u._OrtFree(c)),i.forEach(c=>u._OrtFree(c)),p!==0&&u._OrtReleaseBinding(p)!==0&&Ie("Can't release IO binding."),d!==0&&u._OrtReleaseSession(d)!==0&&Ie("Can't release session."),a}finally{u._free(n),l!==0&&u._OrtReleaseSessionOptions(l)!==0&&Ie("Can't release session options."),o.forEach(a=>u._free(a)),u.unmountExternalData?.()}},Ru=e=>{let t=Ce(),n=Yt.get(e);if(!n)throw new Error(`cannot release session. invalid session id: ${e}`);let[s,u,d,l,p]=n;l&&(p&&t._OrtClearBoundOutputs(l.handle)!==0&&Ie("Can't clear bound outputs."),t._OrtReleaseBinding(l.handle)!==0&&Ie("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),u.forEach(o=>t._OrtFree(o)),d.forEach(o=>t._OrtFree(o)),t._OrtReleaseSession(s)!==0&&Ie("Can't release session."),Yt.delete(e)},Wa=async(e,t,n,s,u,d,l=!1)=>{if(!e){t.push(0);return}let p=Ce(),o=p.PTR_SIZE,r=e[0],i=e[1],a=e[3],c=a,h,g;if(r==="string"&&(a==="gpu-buffer"||a==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(l&&a!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${d} when enableGraphCapture is true.`);if(a==="gpu-buffer"){let $=e[2].gpuBuffer;g=zr(Cr(r),i);{let _=p.jsepRegisterBuffer;if(!_)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');h=_(s,d,$,g)}}else if(a==="ml-tensor"){let $=e[2].mlTensor;g=zr(Cr(r),i);let _=p.webnnRegisterMLTensor;if(!_)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');h=_(s,$,Cr(r),i)}else{let $=e[2];if(Array.isArray($)){g=o*$.length,h=p._malloc(g),n.push(h);for(let _=0;_<$.length;_++){if(typeof $[_]!="string")throw new TypeError(`tensor data at index ${_} is not a string`);p.setValue(h+_*o,It($[_],n),"*")}}else{let _=p.webnnIsGraphInput,O=p.webnnIsGraphOutput;if(r!=="string"&&_&&O){let I=p.UTF8ToString(u);if(_(s,I)||O(s,I)){let E=Cr(r);g=zr(E,i),c="ml-tensor";let A=p.webnnCreateTemporaryTensor,D=p.webnnUploadTensor;if(!A||!D)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let S=await A(s,E,i);D(S,new Uint8Array($.buffer,$.byteOffset,$.byteLength)),h=S}else g=$.byteLength,h=p._malloc(g),n.push(h),p.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,g),h)}else g=$.byteLength,h=p._malloc(g),n.push(h),p.HEAPU8.set(new Uint8Array($.buffer,$.byteOffset,g),h)}}let b=p.stackSave(),x=p.stackAlloc(4*i.length);try{i.forEach((_,O)=>p.setValue(x+O*o,_,o===4?"i32":"i64"));let $=p._OrtCreateTensor(Cr(r),h,g,x,i.length,Vs(c));$===0&&Ie(`Can't create tensor for input/output. session=${s}, index=${d}.`),t.push($)}finally{p.stackRestore(b)}},Bu=async(e,t,n,s,u,d)=>{let l=Ce(),p=l.PTR_SIZE,o=Yt.get(e);if(!o)throw new Error(`cannot run inference. invalid session id: ${e}`);let r=o[0],i=o[1],a=o[2],c=o[3],h=o[4],g=o[5],b=t.length,x=s.length,$=0,_=[],O=[],I=[],E=[],A=[],D=l.stackSave(),S=l.stackAlloc(b*p),L=l.stackAlloc(b*p),U=l.stackAlloc(x*p),ie=l.stackAlloc(x*p);try{[$,_]=j_(d),Br("wasm prepareInputOutputTensor");for(let k=0;k<b;k++)await Wa(n[k],O,E,e,i[t[k]],t[k],h);for(let k=0;k<x;k++)await Wa(u[k],I,E,e,a[s[k]],b+s[k],h);Mr("wasm prepareInputOutputTensor");for(let k=0;k<b;k++)l.setValue(S+k*p,O[k],"*"),l.setValue(L+k*p,i[t[k]],"*");for(let k=0;k<x;k++)l.setValue(U+k*p,I[k],"*"),l.setValue(ie+k*p,a[s[k]],"*");if(c&&!g){let{handle:k,outputPreferredLocations:F,outputPreferredLocationsEncoded:W}=c;if(i.length!==b)throw new Error(`input count from feeds (${b}) is expected to be always equal to model's input count (${i.length}).`);Br("wasm bindInputsOutputs");for(let X=0;X<b;X++){let Z=t[X];await l._OrtBindInput(k,i[Z],O[X])!==0&&Ie(`Can't bind input[${X}] for session=${e}.`)}for(let X=0;X<x;X++){let Z=s[X];u[X]?.[3]?(A.push(I[X]),l._OrtBindOutput(k,a[Z],I[X],0)!==0&&Ie(`Can't bind pre-allocated output[${X}] for session=${e}.`)):l._OrtBindOutput(k,a[Z],0,W[Z])!==0&&Ie(`Can't bind output[${X}] to ${F[X]} for session=${e}.`)}Mr("wasm bindInputsOutputs"),Yt.set(e,[r,i,a,c,h,!0])}l.jsepOnRunStart?.(r),l.webnnOnRunStart?.(r);let K;c?K=await l._OrtRunWithBinding(r,c.handle,x,U,$):K=await l._OrtRun(r,L,S,b,ie,x,U,$),K!==0&&Ie("failed to call OrtRun().");let z=[],w=[];Br("wasm ProcessOutputTensor");for(let k=0;k<x;k++){let F=Number(l.getValue(U+k*p,"*"));if(F===I[k]||A.includes(I[k])){z.push(u[k]),F!==I[k]&&l._OrtReleaseTensor(F)!==0&&Ie("Can't release tensor.");continue}let W=l.stackSave(),X=l.stackAlloc(4*p),Z=!1,oe,j=0;try{l._OrtGetTensorData(F,X,X+p,X+2*p,X+3*p)!==0&&Ie(`Can't access output tensor data on index ${k}.`);let J=p===4?"i32":"i64",H=Number(l.getValue(X,J));j=l.getValue(X+p,"*");let q=l.getValue(X+p*2,"*"),me=Number(l.getValue(X+p*3,J)),Oe=[];for(let Ee=0;Ee<me;Ee++)Oe.push(Number(l.getValue(q+Ee*p,J)));l._OrtFree(q)!==0&&Ie("Can't free memory for tensor dims.");let ke=Oe.reduce((Ee,Re)=>Ee*Re,1);oe=Ut(H);let Ze=c?.outputPreferredLocations[s[k]];if(oe==="string"){if(Ze==="gpu-buffer"||Ze==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let Ee=[];for(let Re=0;Re<ke;Re++){let tt=l.getValue(j+Re*p,"*"),ei=l.getValue(j+(Re+1)*p,"*"),At=Re===ke-1?void 0:ei-tt;Ee.push(l.UTF8ToString(tt,At))}z.push([oe,Oe,Ee,"cpu"])}else if(Ze==="gpu-buffer"&&ke>0){let Ee=l.jsepGetBuffer;if(!Ee)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let Re=Ee(j),tt=zr(H,ke);if(tt===void 0||!yu(oe))throw new Error(`Unsupported data type: ${oe}`);Z=!0,z.push([oe,Oe,{gpuBuffer:Re,download:l.jsepCreateDownloader(Re,tt,oe),dispose:()=>{l._OrtReleaseTensor(F)!==0&&Ie("Can't release tensor.")}},"gpu-buffer"])}else if(Ze==="ml-tensor"&&ke>0){let Ee=l.webnnEnsureTensor,Re=l.webnnIsGraphInputOutputTypeSupported;if(!Ee||!Re)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(zr(H,ke)===void 0||!_u(oe))throw new Error(`Unsupported data type: ${oe}`);if(!Re(e,oe,!1))throw new Error(`preferredLocation "ml-tensor" for ${oe} output is not supported by current WebNN Context.`);let tt=await Ee(e,j,H,Oe,!1);Z=!0,z.push([oe,Oe,{mlTensor:tt,download:l.webnnCreateMLTensorDownloader(j,oe),dispose:()=>{l.webnnReleaseTensorId(j),l._OrtReleaseTensor(F)}},"ml-tensor"])}else if(Ze==="ml-tensor-cpu-output"&&ke>0){let Ee=l.webnnCreateMLTensorDownloader(j,oe)(),Re=z.length;Z=!0,w.push((async()=>{let tt=[Re,await Ee];return l.webnnReleaseTensorId(j),l._OrtReleaseTensor(F),tt})()),z.push([oe,Oe,[],"cpu"])}else{let Ee=Qi(oe),Re=new Ee(ke);new Uint8Array(Re.buffer,Re.byteOffset,Re.byteLength).set(l.HEAPU8.subarray(j,j+Re.byteLength)),z.push([oe,Oe,Re,"cpu"])}}finally{l.stackRestore(W),oe==="string"&&j&&l._free(j),Z||l._OrtReleaseTensor(F)}}c&&!h&&(l._OrtClearBoundOutputs(c.handle)!==0&&Ie("Can't clear bound outputs."),Yt.set(e,[r,i,a,c,h,!1]));for(let[k,F]of await Promise.all(w))z[k][2]=F;return Mr("wasm ProcessOutputTensor"),z}finally{l.webnnOnRunEnd?.(r),l.stackRestore(D),O.forEach(K=>l._OrtReleaseTensor(K)),I.forEach(K=>l._OrtReleaseTensor(K)),E.forEach(K=>l._free(K)),$!==0&&l._OrtReleaseRunOptions($),_.forEach(K=>l._free(K))}},Mu=e=>{let t=Ce(),n=Yt.get(e);if(!n)throw new Error("invalid session id");let s=n[0],u=t._OrtEndProfiling(s);u===0&&Ie("Can't get an profile file name."),t._OrtFree(u)},ju=e=>{let t=[];for(let n of e){let s=n[2];!Array.isArray(s)&&"buffer"in s&&t.push(s.buffer)}return t}}),er,ht,Xr,Pn,An,Ei,Ka,Pi,yr,_r,Om,j1,F1,L1,V1,U1,q1,G1,H1=C(()=>{et(),M1(),Gr(),gu(),er=()=>!!he.wasm.proxy&&typeof document<"u",Xr=!1,Pn=!1,An=!1,Pi=new Map,yr=(e,t)=>{let n=Pi.get(e);n?n.push(t):Pi.set(e,[t])},_r=()=>{if(Xr||!Pn||An||!ht)throw new Error("worker not ready")},Om=e=>{switch(e.data.type){case"init-wasm":Xr=!1,e.data.err?(An=!0,Ka[1](e.data.err)):(Pn=!0,Ka[0]()),Ei&&(URL.revokeObjectURL(Ei),Ei=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Pi.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}}},j1=async()=>{if(!Pn){if(Xr)throw new Error("multiple calls to 'initWasm()' detected.");if(An)throw new Error("previous call to 'initWasm()' failed.");if(Xr=!0,er())return new Promise((e,t)=>{ht?.terminate(),B_().then(([n,s])=>{try{ht=s,ht.onerror=d=>t(d),ht.onmessage=Om,Ka=[e,t];let u={type:"init-wasm",in:he};!u.in.wasm.wasmPaths&&(n||Ls)&&(u.in.wasm.wasmPaths={wasm:new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href}),ht.postMessage(u),Ei=n}catch(u){t(u)}},t)});try{await mu(he.wasm),await Nu(he),Pn=!0}catch(e){throw An=!0,e}finally{Xr=!1}}},F1=async e=>{if(er())return _r(),new Promise((t,n)=>{yr("init-ep",[t,n]);let s={type:"init-ep",in:{epName:e,env:he}};ht.postMessage(s)});await Cu(he,e)},L1=async e=>er()?(_r(),new Promise((t,n)=>{yr("copy-from",[t,n]);let s={type:"copy-from",in:{buffer:e}};ht.postMessage(s,[e.buffer])})):qi(e),V1=async(e,t)=>{if(er()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return _r(),new Promise((n,s)=>{yr("create",[n,s]);let u={type:"create",in:{model:e,options:{...t}}},d=[];e instanceof Uint8Array&&d.push(e.buffer),ht.postMessage(u,d)})}else return zu(e,t)},U1=async e=>{if(er())return _r(),new Promise((t,n)=>{yr("release",[t,n]);let s={type:"release",in:e};ht.postMessage(s)});Ru(e)},q1=async(e,t,n,s,u,d)=>{if(er()){if(n.some(l=>l[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(u.some(l=>l))throw new Error("pre-allocated output tensor is not supported for proxy.");return _r(),new Promise((l,p)=>{yr("run",[l,p]);let o=n,r={type:"run",in:{sessionId:e,inputIndices:t,inputs:o,outputIndices:s,options:d}};ht.postMessage(r,ju(o))})}else return Bu(e,t,n,s,u,d)},G1=async e=>{if(er())return _r(),new Promise((t,n)=>{yr("end-profiling",[t,n]);let s={type:"end-profiling",in:e};ht.postMessage(s)});Mu(e)}}),Xa,Em,W1,eI=C(()=>{et(),H1(),ae(),fu(),L_(),Xa=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},Em=e=>{switch(e[3]){case"cpu":return new Ot(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!yu(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:n,download:s,dispose:u}=e[2];return Ot.fromGpuBuffer(n,{dataType:t,dims:e[1],download:s,dispose:u})}case"ml-tensor":{let t=e[0];if(!_u(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:n,download:s,dispose:u}=e[2];return Ot.fromMLTensor(n,{dataType:t,dims:e[1],download:s,dispose:u})}default:throw new Error(`invalid data location: ${e[3]}`)}},W1=class{async fetchModelAndCopyToWasmMemory(e){return L1(await vu(e))}async loadModel(e,t){Bt();let n;typeof e=="string"?n=await this.fetchModelAndCopyToWasmMemory(e):n=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await V1(n,t),Et()}async dispose(){return U1(this.sessionId)}async run(e,t,n){Bt();let s=[],u=[];Object.entries(e).forEach(a=>{let c=a[0],h=a[1],g=this.inputNames.indexOf(c);if(g===-1)throw new Error(`invalid input '${c}'`);s.push(h),u.push(g)});let d=[],l=[];Object.entries(t).forEach(a=>{let c=a[0],h=a[1],g=this.outputNames.indexOf(c);if(g===-1)throw new Error(`invalid output '${c}'`);d.push(h),l.push(g)});let p=s.map((a,c)=>Xa(a,()=>`input "${this.inputNames[u[c]]}"`)),o=d.map((a,c)=>a?Xa(a,()=>`output "${this.outputNames[l[c]]}"`):null),r=await q1(this.sessionId,u,p,l,o,n),i={};for(let a=0;a<r.length;a++)i[this.outputNames[l[a]]]=d[a]??Em(r[a]);return Et(),i}startProfiling(){}endProfiling(){G1(this.sessionId)}}}),K1={};Ur(K1,{OnnxruntimeWebAssemblyBackend:()=>ru,initializeFlags:()=>tu,wasmBackend:()=>X1});var tu,ru,X1,tI=C(()=>{et(),H1(),eI(),tu=()=>{(typeof he.wasm.initTimeout!="number"||he.wasm.initTimeout<0)&&(he.wasm.initTimeout=0);let e=he.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),he.wasm.simd=!1),typeof he.wasm.proxy!="boolean"&&(he.wasm.proxy=!1),typeof he.wasm.trace!="boolean"&&(he.wasm.trace=!1),typeof he.wasm.numThreads!="number"||!Number.isInteger(he.wasm.numThreads)||he.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)he.wasm.numThreads=1;else{let t=typeof navigator>"u"?Za("node:os").cpus().length:navigator.hardwareConcurrency;he.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},ru=class{async init(e){tu(),await j1(),await F1(e)}async createInferenceSessionHandler(e,t){let n=new W1;return await n.loadModel(e,t),n}},X1=new ru});et();et();et();var rI="1.27.0",nI=Xm;{let e=(tS(),rn(A_)).onnxjsBackend;Rr("webgl",e,-10)}{let e=(tI(),rn(K1)).wasmBackend;Rr("webgpu",e,5),Rr("webnn",e,5),Rr("cpu",e,10),Rr("wasm",e,10)}Object.defineProperty(he.versions,"web",{value:rI,enumerable:!0});/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*//**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//*! Bundled license information:

long/index.js:
long/umd/index.js:
  (**
   * @license
   * Copyright 2009 The Closure Library Authors
   * Copyright 2020 Daniel Wirtz / The long.js Authors.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * SPDX-License-Identifier: Apache-2.0
   *)
*/export{Km as InferenceSession,Ci as TRACE,Br as TRACE_EVENT_BEGIN,Mr as TRACE_EVENT_END,Bt as TRACE_FUNC_BEGIN,Et as TRACE_FUNC_END,Ot as Tensor,nI as default,he as env,Rr as registerBackend};
//# sourceMappingURL=onnxruntime-web-D8-BCChw.js.map
