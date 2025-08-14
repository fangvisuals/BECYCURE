import{R as r,j as k,u as ue,Q as F,V as L,a as le,E as fe,B as O,b as he,C as se,A as pe,M as X,G as me,D as ge,d as ie,e as ye,m as we,f as ve,g as xe,h as Re,r as Q,i as Me}from"./three-vendor-e3787f3d.js";import{u as be}from"./index-dce642b3.js";var Se=`attribute vec3 aPositionTarget; 
attribute float aSize;          
attribute float aSeed;          

uniform float uProgress;        
uniform float uSize;            
uniform vec2 uResolution;       
uniform float uTime;            

varying float vMix;             
varying float vRnd;             

float easeInOutCubic(float t) {
  return (t < 0.5)
    ? 4.0 * t * t * t
    : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

float smoothstep01(float t) {
  return t * t * (3.0 - 2.0 * t);
}

void main() {
  float t = smoothstep01(clamp(uProgress, 0.0, 1.0)); 
  vMix = t;
  vRnd = aSeed;

  
  vec3 pos = mix(position, aPositionTarget, t);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float perspective = clamp(1.0 / -mv.z, 0.0, 4.0);
  gl_PointSize = aSize * uSize * uResolution.y * perspective;
  
}`,Ae=`precision highp float;

uniform vec3 uColorA;
uniform vec3 uColorB;

uniform float uIntensity;     
uniform float uMixToWhite;    

uniform float uTime;          
uniform float uSparkleStrength; 
uniform float uSparkleSpeed;    

varying float vMix;           
varying float vRnd;           

void main() {
  
  vec2 uv = gl_PointCoord;                 
  float d = length(uv - 0.5);              
  
  float alpha = 0.05 / max(d, 0.001) - 0.1;
  if (alpha <= 0.0) discard;               

  
  vec3 color = mix(uColorA, uColorB, vRnd);

  
  float center = 1.0 - smoothstep(0.0, 0.20, d); 
  color = mix(color, vec3(1.0), center * uMixToWhite);

  
  float sparkle = 0.5 + 0.5 * sin(uTime * uSparkleSpeed + vRnd * 6.2831853);
  float sparkleFactor = mix(1.0 - uSparkleStrength, 1.0 + uSparkleStrength, sparkle);

  
  gl_FragColor = vec4(color * uIntensity, clamp(alpha, 0.0, 1.0) * sparkleFactor);
}`;async function Te(e,n){const t=new me;if(n){const o=new ge;o.setDecoderPath(n),t.setDRACOLoader(o)}return new Promise((o,s)=>{t.load(e,o,void 0,s)})}function ke(e,n=1){e.computeBoundingSphere();const t=e.boundingSphere;if(!t)return e;const o=n/(t.radius||1),s=new ie().makeTranslation(-t.center.x,-t.center.y,-t.center.z).multiply(new ie().makeScale(o,o,o));return e.applyMatrix4(s),e.computeBoundingSphere(),e}function Pe(e){const n=[];let t=0;if(e.updateMatrixWorld(!0),e.traverse(i=>{if((i.isMesh||i.isSkinnedMesh)&&i.geometry){t++;let a=i.geometry.clone();a.applyMatrix4(i.matrixWorld),a.index&&(a=a.toNonIndexed());const f=a.getAttribute("position");if(!f||!f.array||f.array.length<9){a.dispose();return}const R=new ye;R.setAttribute("position",new O(new Float32Array(f.array),3)),n.push(R),a.dispose()}}),t===0&&console.warn("[ParticleMorph] Aucun Mesh dans le GLB — fallback sphère."),n.length===0)return null;const o=we(n,!1);n.forEach(i=>i.dispose());const s=o.getAttribute("position"),c=Math.floor(s.count/3);return console.log(`[ParticleMorph] Merged geometry: ${s.count} vertices (~${c} triangles)`),o}function Ce(e){return e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2}function ze(e,n){const t=new ve(e,new xe),o=new Re(t).build(),s=new Float32Array(n*3),c=new L;for(let i=0;i<n;i++)o.sample(c),s[i*3+0]=c.x,s[i*3+1]=c.y,s[i*3+2]=c.z;return t.geometry.dispose(),t.material.dispose(),s}function K(e,n=.8){const t=new Float32Array(e*3);for(let o=0;o<e;o++){const s=Math.random(),c=Math.random(),i=2*Math.PI*s,a=Math.acos(2*c-1),f=n*Math.cbrt(Math.random()),R=f*Math.sin(a)*Math.cos(i),A=f*Math.sin(a)*Math.sin(i),h=f*Math.cos(a);t[o*3+0]=R,t[o*3+1]=A,t[o*3+2]=h}return t}function Ee(e,n){for(let t=0;t<e.length;t+=3)e[t+0]+=(Math.random()*2-1)*n,e[t+1]+=(Math.random()*2-1)*n,e[t+2]+=(Math.random()*2-1)*n}function Be({shapes:e,activeId:n,particleCount:t,dracoPath:o,fitRadius:s}){const[c,i]=r.useState(null);return r.useEffect(()=>{let a=!1,f=null;const R=u=>typeof window<"u"&&"requestIdleCallback"in window?window.requestIdleCallback(u):setTimeout(u,400),A=u=>{if(typeof window<"u"&&"cancelIdleCallback"in window)return window.cancelIdleCallback(u);clearTimeout(u)};async function h(u){try{const v=await Te(u.url,o),l=Pe(v.scene);let x;return l?(ke(l,s),x=ze(l,t),l.dispose()):x=K(t,s*.8),[u.id,x]}catch(v){return console.warn("GLB load failed:",u.url,v),[u.id,K(t,s*.8)]}}return(async()=>{const u=new Map,v=e.find(l=>l.id===n)||e[0];if(v){const l=await h(v);a||(u.set(l[0],l[1]),i(new Map(u)))}f=R(async()=>{for(const l of e){if(a)return;if(u.has(l.id))continue;const x=await h(l);if(a)return;u.set(x[0],x[1]),i(new Map(u))}})})(),()=>{a=!0,f!=null&&A(f)}},[JSON.stringify(e),n,t,o,s]),c}function Z(e){return e*Math.PI/180}function Fe(e,n,t,o){const{width:s,height:c}=n,i=t.mode==="px"?t.x/s:t.x,a=t.mode==="px"?t.y/c:t.y,R=e.position.z-o,A=e.fov*Math.PI/180,h=2*Math.tan(A/2)*R,u=h*e.aspect,v=(i-.5)*u,l=(.5-a)*h;return new L(v,l,o)}function Le(e,n=[]){return n.filter(t=>(t.min==null||e>=t.min)&&(t.max==null||e<=t.max)).pop()||null}function ce(e){const n=new fe(Z(e.rotation?.[0]||0),Z(e.rotation?.[1]||0),Z(e.rotation?.[2]||0)),t=new F;return t.setFromEuler(n),t}function qe({targets:e,activeId:n,particleCount:t,size:o,speed:s,colorA:c="#60a5fa",colorB:i="#a78bfa",morphKey:a,onProgress:f,remorphOnSameId:R=!0,remorphNoise:A=.02,glow:h,sparkle:u}){const v=r.useRef(),l=r.useRef(),x=r.useRef(1),{size:m}=ue(),q=r.useRef(null);r.useEffect(()=>{q.current==null&&(q.current=m.width*m.height)},[m.width,m.height]),r.useLayoutEffect(()=>{const p=v.current;if(!p)return;const g=K(t,.8),d=new Float32Array(g),w=new Float32Array(t),M=new Float32Array(t);for(let T=0;T<t;T++)w[T]=1+Math.random()*.6,M[T]=Math.random();return p.setAttribute("position",new O(g,3)),p.setAttribute("aPositionTarget",new O(d,3)),p.setAttribute("aSize",new O(w,1)),p.setAttribute("aSeed",new O(M,1)),p.setDrawRange(0,t),()=>{p.deleteAttribute("position"),p.deleteAttribute("aPositionTarget"),p.deleteAttribute("aSize"),p.deleteAttribute("aSeed")}},[t]);const _=r.useRef(n),D=r.useRef(a);r.useEffect(()=>{if(!v.current||!e)return;const p=v.current,g=p.getAttribute("position"),d=p.getAttribute("aPositionTarget"),w=x.current;for(let T=0;T<g.count;T++){const b=T*3;g.array[b+0]=g.array[b+0]*(1-w)+d.array[b+0]*w,g.array[b+1]=g.array[b+1]*(1-w)+d.array[b+1]*w,g.array[b+2]=g.array[b+2]*(1-w)+d.array[b+2]*w}g.needsUpdate=!0;const M=e.get(n);M&&(d.array.set(M),d.needsUpdate=!0),R&&_.current===n&&D.current!==a&&(Ee(g.array,A),g.needsUpdate=!0),x.current=0,l.current&&(l.current.uniforms.uProgress.value=0),f?.(0),_.current=n,D.current=a},[n,e,a,R,A,f]),le((p,g)=>{if(!l.current)return;const d=l.current.uniforms,w=x.current;if(w<1){const M=Math.min(1,w+g*s);x.current=M,d.uProgress.value=M,f?.(M)}d.uTime.value+=g});const E=Math.min(2,window.devicePixelRatio||1),W=typeof h?.autoIntensity=="number"?h.autoIntensity:h?.autoIntensity?.6:null,B=m.width*m.height,N=q.current??B,P=Math.max(.25,Math.min(4,N/B)),I=(h?.intensity??1)*(W!=null?Math.pow(P,W):1),z=r.useMemo(()=>({uProgress:{value:1},uTime:{value:0},uSize:{value:o*E/m.height},uResolution:{value:new he(m.width,m.height)},uColorA:{value:new se(c)},uColorB:{value:new se(i)},uIntensity:{value:I},uMixToWhite:{value:h?.mixToWhite??0},uSparkleStrength:{value:u?.strength??0},uSparkleSpeed:{value:u?.speed??0}}),[o,E,m.width,m.height,c,i,I,h?.mixToWhite,h?.core,h?.falloff,u?.strength,u?.speed]);return r.useEffect(()=>{if(!l.current)return;const p=l.current.uniforms;p.uResolution.value.set(m.width,m.height),p.uSize.value=o*E/m.height},[m.width,m.height,o,E]),k.jsxs("points",{frustumCulled:!1,renderOrder:-1,children:[k.jsx("bufferGeometry",{ref:v}),k.jsx("shaderMaterial",{ref:l,vertexShader:Se,fragmentShader:Ae,uniforms:z,blending:pe,depthWrite:!1,transparent:!0,toneMapped:!1})]})}function We({shapes:e,activeId:n,particleCount:t=9e3,size:o=8,speed:s=.9,dracoPath:c="/draco/",fitRadius:i=1.2,color:a,colorA:f=void 0,colorB:R=void 0,anchor:A={x:.72,y:.5,mode:"relative"},depth:h=2.5,rotation:u=[0,0,0],scale:v=1,transformById:l,responsive:x=[],morphKey:m,remorphOnSameId:q=!0,remorphNoise:_=.02,glow:D,sparkle:E,spin:W={x:0,y:6,z:0},spinById:B}){const N=Be({shapes:e,activeId:n,particleCount:t,dracoPath:c,fitRadius:i}),P=r.useRef(),{camera:I,size:z}=ue(),p=f||a||"#60a5fa",g=R||f||a||"#a78bfa",d=r.useMemo(()=>{const S={anchor:A,depth:h,rotation:u,scale:v},y=Le(z.width,x)||{},C=n&&l&&l[n]||{},G=(U,V)=>({...U||{},...V||{}});return{...S,...y,...C,anchor:G(S.anchor,G(y.anchor,C.anchor))}},[A,h,u,v,x,l,n,z.width]),w=r.useRef(new F),M=r.useRef(new F),T=r.useRef(new F),b=r.useRef(new F),ee=r.useRef(new F);r.useRef(!1),r.useRef(0);const $=r.useRef(new L),Y=r.useRef(new L),te=r.useRef(new L),ne=r.useRef(new L);r.useRef(!1),r.useRef(0);const j=r.useRef(1),H=r.useRef(1),re=r.useRef(1),oe=r.useRef(1);r.useRef(!1),r.useRef(0);const ae=r.useRef(!1);r.useLayoutEffect(()=>{if(!P.current)return;const S=Fe(I,z,d.anchor,d.depth??0);if(Y.current.copy(S),H.current=d.scale??1,!ae.current){$.current.copy(Y.current),j.current=H.current;const y=ce(d);P.current.quaternion.copy(y),w.current.copy(y),P.current.position.copy($.current),P.current.scale.setScalar(j.current),ae.current=!0}},[I,z.width,z.height,d.anchor,d.depth,d.scale]);const J=r.useMemo(()=>{const S=W||{},y=n&&B&&B[n]||{};return{x:y.x??S.x??0,y:y.y??S.y??0,z:y.z??S.z??0}},[W,B,n]),de=r.useCallback(S=>{S===0&&(b.current.copy(w.current),ee.current.copy(ce(d)),te.current.copy($.current),ne.current.copy(Y.current),re.current=j.current,oe.current=H.current);const y=Ce(Math.min(Math.max(S,0),1));w.current.slerpQuaternions(b.current,ee.current,y),$.current.lerpVectors(te.current,ne.current,y),j.current=re.current*(1-y)+oe.current*y},[d]);return le((S,y)=>{const C=P.current;if(!C)return;const G=X.degToRad(J.x||0)*y,U=X.degToRad(J.y||0)*y,V=X.degToRad(J.z||0)*y;(G||U||V)&&(T.current.setFromEuler(new fe(G,U,V)),M.current.multiply(T.current)),C.quaternion.copy(w.current),C.quaternion.multiply(M.current),C.position.copy($.current),C.scale.setScalar(j.current)}),k.jsx("group",{ref:P,children:k.jsx(qe,{targets:N,activeId:n??e[0]?.id,particleCount:t,size:o,speed:s,colorA:p,colorB:g,morphKey:m,onProgress:de,remorphOnSameId:q,remorphNoise:_,glow:D,sparkle:E})})}function Ie({shapes:e,routeMap:n,layoutKey:t,...o}){const{pathname:s,hash:c}=be(),i=r.useMemo(()=>{if(typeof n=="function")return n(s,c);if(n&&typeof n=="object"){const f=c?`${s}${c}`:s;return n[f]??n[s]??n["*"]??e[0]?.id}return e[0]?.id},[s,c,n,e]),a=`${s}|${c||""}|${t||""}`;return k.jsx(We,{shapes:e,activeId:i,morphKey:a,...o})}function Ge(){console.log("[BG] BackgroundCanvas chargé depuis:",import.meta.url);const e="/BECYCURE/",n=Q.useMemo(()=>[{id:"home",url:`${e}models/becycure.glb`},{id:"services",url:`${e}models/soc.glb`},{id:"blog",url:`${e}models/blog.glb`},{id:"partenariats",url:`${e}models/partenariats.glb`}],[e]),t=(c,i)=>{const a=(c||"/").replace(/\/+$/,"");return i==="#xdr"?"services":a===""||a==="/"?"home":a.startsWith("/services")?"services":a.startsWith("/blog")?"blog":a.startsWith("/integration")?"home":a.startsWith("/partenariats")?"partenariats":"home"},[o,s]=Q.useState(7e3);return Q.useEffect(()=>{const c=window.requestIdleCallback?window.requestIdleCallback(()=>s(9e3)):setTimeout(()=>s(9e3),800);return()=>window.cancelIdleCallback?window.cancelIdleCallback(c):clearTimeout(c)},[]),k.jsx("div",{"aria-hidden":!0,className:"pointer-events-none fixed inset-0 z-0",style:{contain:"paint",isolation:"isolate"},children:k.jsxs(Me,{gl:{antialias:!0,powerPreference:"high-performance",alpha:!0},dpr:[1,Math.min(1.75,window.devicePixelRatio||1)],camera:{position:[0,0,6],fov:45},children:[k.jsx("color",{attach:"background",args:["#0b0d10"]}),k.jsx(Q.Suspense,{fallback:null,children:k.jsx(Ie,{shapes:n,routeMap:t,particleCount:o,size:30,speed:.6,colorA:"rgba(75, 255, 225, 1)",colorB:"rgba(53, 255, 104, 1)",sparkle:{strength:.9,speed:2},glow:{intensity:.7,core:.2,falloff:.4,mixToWhite:.65,autoIntensity:.6},quality:"auto",anchor:{x:.7,y:.52,mode:"relative"},rotation:[0,0,0],scale:1,depth:0,transformById:{home:{anchor:{x:.7,y:.5,mode:"relative"},rotation:[0,0,0],scale:1,depth:2.5},services:{anchor:{x:.75,y:.52,mode:"relative"},rotation:[0,0,0],scale:1.15,depth:1},blog:{anchor:{x:.63,y:.58,mode:"relative"},rotation:[-5,35,0],scale:1.1,depth:0},partenariats:{anchor:{x:.5,y:.52,mode:"relative"},rotation:[0,0,0],scale:1,depth:1}},responsive:[{max:1280,anchor:{x:.66,y:.54},scale:1.1},{max:1024,anchor:{x:.58,y:.56},scale:.95},{max:768,anchor:{x:.5,y:.58},scale:.8,rotation:[0,8,0]},{max:560,anchor:{x:.5,y:.62},scale:.7,rotation:[0,6,0]}],spin:{x:0,y:8,z:0},spinById:{services:{y:0},blog:{y:-6}},remorphOnSameId:!0,dracoPath:`${e}draco/`})})]})})}export{Ge as default};
