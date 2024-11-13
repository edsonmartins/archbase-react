import{j as h,F as $e,a as te}from"./jsx-runtime-c9381026.js";import{r as l}from"./index-8b3efc3f.js";import{g as $,O as We}from"./OptionalPortal-2778d3e2.js";import{p as He,u as B,h as ve,B as H,i as me,C as De,r as X,n as he,o as ze,s as je,t as A,f as T,q as Ze}from"./polymorphic-factory-a4611e92.js";import{c as ye}from"./create-safe-context-941c9e18.js";import{C as Ve}from"./CloseButton-cc9ab058.js";import{u as Xe,F as Ye}from"./FocusTrap-03f7f7d2.js";import{P as Ke}from"./Paper-3fe2af31.js";import{T as ge}from"./Transition-b4f11a45.js";import{u as Qe}from"./use-reduced-motion-aed616a5.js";import{u as Ge}from"./use-id-3df0f1f4.js";import{u as Ue}from"./use-window-event-860a85e7.js";import{c as qe}from"./create-optional-context-86e78b6c.js";var x=function(){return x=Object.assign||function(t){for(var r,n=1,a=arguments.length;n<a;n++){r=arguments[n];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o])}return t},x.apply(this,arguments)};function pe(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var a=0,n=Object.getOwnPropertySymbols(e);a<n.length;a++)t.indexOf(n[a])<0&&Object.prototype.propertyIsEnumerable.call(e,n[a])&&(r[n[a]]=e[n[a]]);return r}function Je(e,t,r){if(r||arguments.length===2)for(var n=0,a=t.length,o;n<a;n++)(o||!(n in t))&&(o||(o=Array.prototype.slice.call(t,0,n)),o[n]=t[n]);return e.concat(o||Array.prototype.slice.call(t))}var Z="right-scroll-bar-position",V="width-before-scroll-bar",et="with-scroll-bars-hidden",tt="--removed-body-scroll-bar-size";function re(e,t){return typeof e=="function"?e(t):e&&(e.current=t),e}function rt(e,t){var r=l.useState(function(){return{value:e,callback:t,facade:{get current(){return r.value},set current(n){var a=r.value;a!==n&&(r.value=n,r.callback(n,a))}}}})[0];return r.callback=t,r.facade}var nt=typeof window<"u"?l.useLayoutEffect:l.useEffect,se=new WeakMap;function at(e,t){var r=rt(t||null,function(n){return e.forEach(function(a){return re(a,n)})});return nt(function(){var n=se.get(r);if(n){var a=new Set(n),o=new Set(e),s=r.current;a.forEach(function(c){o.has(c)||re(c,null)}),o.forEach(function(c){a.has(c)||re(c,s)})}se.set(r,e)},[e]),r}function ot(e){return e}function ct(e,t){t===void 0&&(t=ot);var r=[],n=!1,a={read:function(){if(n)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return r.length?r[r.length-1]:e},useMedium:function(o){var s=t(o,n);return r.push(s),function(){r=r.filter(function(c){return c!==s})}},assignSyncMedium:function(o){for(n=!0;r.length;){var s=r;r=[],s.forEach(o)}r={push:function(c){return o(c)},filter:function(){return r}}},assignMedium:function(o){n=!0;var s=[];if(r.length){var c=r;r=[],c.forEach(o),s=r}var f=function(){var d=s;s=[],d.forEach(o)},u=function(){return Promise.resolve().then(f)};u(),r={push:function(d){s.push(d),u()},filter:function(d){return s=s.filter(d),r}}}};return a}function st(e){e===void 0&&(e={});var t=ct(null);return t.options=x({async:!0,ssr:!1},e),t}var Se=function(e){var t=e.sideCar,r=pe(e,["sideCar"]);if(!t)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var n=t.read();if(!n)throw new Error("Sidecar medium not found");return l.createElement(n,x({},r))};Se.isSideCarExport=!0;function lt(e,t){return e.useMedium(t),Se}var be=st(),ne=function(){},Y=l.forwardRef(function(e,t){var r=l.useRef(null),n=l.useState({onScrollCapture:ne,onWheelCapture:ne,onTouchMoveCapture:ne}),a=n[0],o=n[1],s=e.forwardProps,c=e.children,f=e.className,u=e.removeScrollBar,d=e.enabled,y=e.shards,g=e.sideCar,m=e.noIsolation,b=e.inert,i=e.allowPinchZoom,v=e.as,p=v===void 0?"div":v,M=e.gapMode,w=pe(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noIsolation","inert","allowPinchZoom","as","gapMode"]),C=g,S=at([r,t]),k=x(x({},w),a);return l.createElement(l.Fragment,null,d&&l.createElement(C,{sideCar:be,removeScrollBar:u,shards:y,noIsolation:m,inert:b,setCallbacks:o,allowPinchZoom:!!i,lockRef:r,gapMode:M}),s?l.cloneElement(l.Children.only(c),x(x({},k),{ref:S})):l.createElement(p,x({},k,{className:f,ref:S}),c))});Y.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};Y.classNames={fullWidth:V,zeroRight:Z};var le,it=function(){if(le)return le;if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function ut(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var t=it();return t&&e.setAttribute("nonce",t),e}function dt(e,t){e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}function ft(e){var t=document.head||document.getElementsByTagName("head")[0];t.appendChild(e)}var vt=function(){var e=0,t=null;return{add:function(r){e==0&&(t=ut())&&(dt(t,r),ft(t)),e++},remove:function(){e--,!e&&t&&(t.parentNode&&t.parentNode.removeChild(t),t=null)}}},mt=function(){var e=vt();return function(t,r){l.useEffect(function(){return e.add(t),function(){e.remove()}},[t&&r])}},we=function(){var e=mt(),t=function(r){var n=r.styles,a=r.dynamic;return e(n,a),null};return t},ht={left:0,top:0,right:0,gap:0},ae=function(e){return parseInt(e||"",10)||0},yt=function(e){var t=window.getComputedStyle(document.body),r=t[e==="padding"?"paddingLeft":"marginLeft"],n=t[e==="padding"?"paddingTop":"marginTop"],a=t[e==="padding"?"paddingRight":"marginRight"];return[ae(r),ae(n),ae(a)]},gt=function(e){if(e===void 0&&(e="margin"),typeof window>"u")return ht;var t=yt(e),r=document.documentElement.clientWidth,n=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,n-r+t[2]-t[0])}},pt=we(),L="data-scroll-locked",St=function(e,t,r,n){var a=e.left,o=e.top,s=e.right,c=e.gap;return r===void 0&&(r="margin"),`
  .`.concat(et,` {
   overflow: hidden `).concat(n,`;
   padding-right: `).concat(c,"px ").concat(n,`;
  }
  body[`).concat(L,`] {
    overflow: hidden `).concat(n,`;
    overscroll-behavior: contain;
    `).concat([t&&"position: relative ".concat(n,";"),r==="margin"&&`
    padding-left: `.concat(a,`px;
    padding-top: `).concat(o,`px;
    padding-right: `).concat(s,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(c,"px ").concat(n,`;
    `),r==="padding"&&"padding-right: ".concat(c,"px ").concat(n,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(Z,` {
    right: `).concat(c,"px ").concat(n,`;
  }
  
  .`).concat(V,` {
    margin-right: `).concat(c,"px ").concat(n,`;
  }
  
  .`).concat(Z," .").concat(Z,` {
    right: 0 `).concat(n,`;
  }
  
  .`).concat(V," .").concat(V,` {
    margin-right: 0 `).concat(n,`;
  }
  
  body[`).concat(L,`] {
    `).concat(tt,": ").concat(c,`px;
  }
`)},ie=function(){var e=parseInt(document.body.getAttribute(L)||"0",10);return isFinite(e)?e:0},bt=function(){l.useEffect(function(){return document.body.setAttribute(L,(ie()+1).toString()),function(){var e=ie()-1;e<=0?document.body.removeAttribute(L):document.body.setAttribute(L,e.toString())}},[])},wt=function(e){var t=e.noRelative,r=e.noImportant,n=e.gapMode,a=n===void 0?"margin":n;bt();var o=l.useMemo(function(){return gt(a)},[a]);return l.createElement(pt,{styles:St(o,!t,a,r?"":"!important")})},oe=!1;if(typeof window<"u")try{var z=Object.defineProperty({},"passive",{get:function(){return oe=!0,!0}});window.addEventListener("test",z,z),window.removeEventListener("test",z,z)}catch{oe=!1}var O=oe?{passive:!1}:!1,Mt=function(e){return e.tagName==="TEXTAREA"},Me=function(e,t){if(!(e instanceof Element))return!1;var r=window.getComputedStyle(e);return r[t]!=="hidden"&&!(r.overflowY===r.overflowX&&!Mt(e)&&r[t]==="visible")},Ct=function(e){return Me(e,"overflowY")},xt=function(e){return Me(e,"overflowX")},ue=function(e,t){var r=t.ownerDocument,n=t;do{typeof ShadowRoot<"u"&&n instanceof ShadowRoot&&(n=n.host);var a=Ce(e,n);if(a){var o=xe(e,n),s=o[1],c=o[2];if(s>c)return!0}n=n.parentNode}while(n&&n!==r.body);return!1},Nt=function(e){var t=e.scrollTop,r=e.scrollHeight,n=e.clientHeight;return[t,r,n]},Bt=function(e){var t=e.scrollLeft,r=e.scrollWidth,n=e.clientWidth;return[t,r,n]},Ce=function(e,t){return e==="v"?Ct(t):xt(t)},xe=function(e,t){return e==="v"?Nt(t):Bt(t)},Et=function(e,t){return e==="h"&&t==="rtl"?-1:1},Rt=function(e,t,r,n,a){var o=Et(e,window.getComputedStyle(t).direction),s=o*n,c=r.target,f=t.contains(c),u=!1,d=s>0,y=0,g=0;do{var m=xe(e,c),b=m[0],i=m[1],v=m[2],p=i-v-o*b;(b||p)&&Ce(e,c)&&(y+=p,g+=b),c instanceof ShadowRoot?c=c.host:c=c.parentNode}while(!f&&c!==document.body||f&&(t.contains(c)||t===c));return(d&&(a&&Math.abs(y)<1||!a&&s>y)||!d&&(a&&Math.abs(g)<1||!a&&-s>g))&&(u=!0),u},j=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},de=function(e){return[e.deltaX,e.deltaY]},fe=function(e){return e&&"current"in e?e.current:e},kt=function(e,t){return e[0]===t[0]&&e[1]===t[1]},Tt=function(e){return`
  .block-interactivity-`.concat(e,` {pointer-events: none;}
  .allow-interactivity-`).concat(e,` {pointer-events: all;}
`)},Pt=0,_=[];function It(e){var t=l.useRef([]),r=l.useRef([0,0]),n=l.useRef(),a=l.useState(Pt++)[0],o=l.useState(we)[0],s=l.useRef(e);l.useEffect(function(){s.current=e},[e]),l.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(a));var i=Je([e.lockRef.current],(e.shards||[]).map(fe),!0).filter(Boolean);return i.forEach(function(v){return v.classList.add("allow-interactivity-".concat(a))}),function(){document.body.classList.remove("block-interactivity-".concat(a)),i.forEach(function(v){return v.classList.remove("allow-interactivity-".concat(a))})}}},[e.inert,e.lockRef.current,e.shards]);var c=l.useCallback(function(i,v){if("touches"in i&&i.touches.length===2||i.type==="wheel"&&i.ctrlKey)return!s.current.allowPinchZoom;var p=j(i),M=r.current,w="deltaX"in i?i.deltaX:M[0]-p[0],C="deltaY"in i?i.deltaY:M[1]-p[1],S,k=i.target,P=Math.abs(w)>Math.abs(C)?"h":"v";if("touches"in i&&P==="h"&&k.type==="range")return!1;var I=ue(P,k);if(!I)return!0;if(I?S=P:(S=P==="v"?"h":"v",I=ue(P,k)),!I)return!1;if(!n.current&&"changedTouches"in i&&(w||C)&&(n.current=S),!S)return!0;var D=n.current||S;return Rt(D,v,i,D==="h"?w:C,!0)},[]),f=l.useCallback(function(i){var v=i;if(!(!_.length||_[_.length-1]!==o)){var p="deltaY"in v?de(v):j(v),M=t.current.filter(function(S){return S.name===v.type&&(S.target===v.target||v.target===S.shadowParent)&&kt(S.delta,p)})[0];if(M&&M.should){v.cancelable&&v.preventDefault();return}if(!M){var w=(s.current.shards||[]).map(fe).filter(Boolean).filter(function(S){return S.contains(v.target)}),C=w.length>0?c(v,w[0]):!s.current.noIsolation;C&&v.cancelable&&v.preventDefault()}}},[]),u=l.useCallback(function(i,v,p,M){var w={name:i,delta:v,target:p,should:M,shadowParent:Ot(p)};t.current.push(w),setTimeout(function(){t.current=t.current.filter(function(C){return C!==w})},1)},[]),d=l.useCallback(function(i){r.current=j(i),n.current=void 0},[]),y=l.useCallback(function(i){u(i.type,de(i),i.target,c(i,e.lockRef.current))},[]),g=l.useCallback(function(i){u(i.type,j(i),i.target,c(i,e.lockRef.current))},[]);l.useEffect(function(){return _.push(o),e.setCallbacks({onScrollCapture:y,onWheelCapture:y,onTouchMoveCapture:g}),document.addEventListener("wheel",f,O),document.addEventListener("touchmove",f,O),document.addEventListener("touchstart",d,O),function(){_=_.filter(function(i){return i!==o}),document.removeEventListener("wheel",f,O),document.removeEventListener("touchmove",f,O),document.removeEventListener("touchstart",d,O)}},[]);var m=e.removeScrollBar,b=e.inert;return l.createElement(l.Fragment,null,b?l.createElement(o,{styles:Tt(a)}):null,m?l.createElement(wt,{gapMode:e.gapMode}):null)}function Ot(e){for(var t=null;e!==null;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}const _t=lt(be,It);var Ne=l.forwardRef(function(e,t){return l.createElement(Y,x({},e,{ref:t,sideCar:_t}))});Ne.classNames=Y.classNames;const Lt=Ne;var Be={root:"m_9814e45f"};const At={zIndex:$("modal")},Ft=me((e,{gradient:t,color:r,backgroundOpacity:n,blur:a,radius:o,zIndex:s})=>({root:{"--overlay-bg":t||(r!==void 0||n!==void 0)&&De(r||"#000",n??.6)||void 0,"--overlay-filter":a?`blur(${X(a)})`:void 0,"--overlay-radius":o===void 0?void 0:he(o),"--overlay-z-index":s==null?void 0:s.toString()}})),ce=He((e,t)=>{const r=B("Overlay",At,e),{classNames:n,className:a,style:o,styles:s,unstyled:c,vars:f,fixed:u,center:d,children:y,radius:g,zIndex:m,gradient:b,blur:i,color:v,backgroundOpacity:p,mod:M,...w}=r,C=ve({name:"Overlay",props:r,classes:Be,className:a,style:o,classNames:n,styles:s,unstyled:c,vars:f,varsResolver:Ft});return h(H,{ref:t,...C("root"),mod:[{center:d,fixed:u},M],...w,children:y})});ce.classes=Be;ce.displayName="@mantine/core/Overlay";const[$t,E]=ye("ModalBase component was not found in tree");function Wt({opened:e,transitionDuration:t}){const[r,n]=l.useState(e),a=l.useRef(),s=Qe()?0:t;return l.useEffect(()=>(e?(n(!0),window.clearTimeout(a.current)):s===0?n(!1):a.current=window.setTimeout(()=>n(!1),s),()=>window.clearTimeout(a.current)),[e,s]),r}function Ht({id:e,transitionProps:t,opened:r,trapFocus:n,closeOnEscape:a,onClose:o,returnFocus:s}){const c=Ge(e),[f,u]=l.useState(!1),[d,y]=l.useState(!1),g=typeof(t==null?void 0:t.duration)=="number"?t==null?void 0:t.duration:200,m=Wt({opened:r,transitionDuration:g});return Ue("keydown",b=>{var i;b.key==="Escape"&&a&&r&&((i=b.target)==null?void 0:i.getAttribute("data-mantine-stop-propagation"))!=="true"&&o()},{capture:!0}),Xe({opened:r,shouldReturnFocus:n&&s}),{_id:c,titleMounted:f,bodyMounted:d,shouldLockScroll:m,setTitleMounted:u,setBodyMounted:y}}const Ee=l.forwardRef(({keepMounted:e,opened:t,onClose:r,id:n,transitionProps:a,trapFocus:o,closeOnEscape:s,returnFocus:c,closeOnClickOutside:f,withinPortal:u,portalProps:d,lockScroll:y,children:g,zIndex:m,shadow:b,padding:i,__vars:v,unstyled:p,removeScrollProps:M,...w},C)=>{const{_id:S,titleMounted:k,bodyMounted:P,shouldLockScroll:I,setTitleMounted:D,setBodyMounted:Le}=Ht({id:n,transitionProps:a,opened:t,trapFocus:o,closeOnEscape:s,onClose:r,returnFocus:c}),{key:Ae,...Fe}=M||{};return h(We,{...d,withinPortal:u,children:h($t,{value:{opened:t,onClose:r,closeOnClickOutside:f,transitionProps:{...a,keepMounted:e},getTitleId:()=>`${S}-title`,getBodyId:()=>`${S}-body`,titleMounted:k,bodyMounted:P,setTitleMounted:D,setBodyMounted:Le,trapFocus:o,closeOnEscape:s,zIndex:m,unstyled:p},children:h(Lt,{enabled:I&&y,...Fe,children:h(H,{ref:C,...w,__vars:{...v,"--mb-z-index":(m||$("modal")).toString(),"--mb-shadow":ze(b),"--mb-padding":je(i)},children:g})},Ae)})})});Ee.displayName="@mantine/core/ModalBase";function Dt(){const e=E();return l.useEffect(()=>(e.setBodyMounted(!0),()=>e.setBodyMounted(!1)),[]),e.getBodyId()}var F={title:"m_615af6c9",header:"m_b5489c3c",inner:"m_60c222c7",content:"m_fd1ab0aa",close:"m_606cb269",body:"m_5df29311"};const Re=l.forwardRef(({className:e,...t},r)=>{const n=Dt(),a=E();return h(H,{ref:r,...t,id:n,className:A({[F.body]:!a.unstyled},e)})});Re.displayName="@mantine/core/ModalBaseBody";const ke=l.forwardRef(({className:e,onClick:t,...r},n)=>{const a=E();return h(Ve,{ref:n,...r,onClick:o=>{a.onClose(),t==null||t(o)},className:A({[F.close]:!a.unstyled},e),unstyled:a.unstyled})});ke.displayName="@mantine/core/ModalBaseCloseButton";const Te=l.forwardRef(({transitionProps:e,className:t,innerProps:r,onKeyDown:n,style:a,...o},s)=>{const c=E();return h(ge,{mounted:c.opened,transition:"pop",...c.transitionProps,...e,children:f=>h("div",{...r,className:A({[F.inner]:!c.unstyled},r.className),children:h(Ye,{active:c.opened&&c.trapFocus,innerRef:s,children:h(Ke,{...o,component:"section",role:"dialog",tabIndex:-1,"aria-modal":!0,"aria-describedby":c.bodyMounted?c.getBodyId():void 0,"aria-labelledby":c.titleMounted?c.getTitleId():void 0,style:[a,f],className:A({[F.content]:!c.unstyled},t),unstyled:c.unstyled,children:o.children})})})})});Te.displayName="@mantine/core/ModalBaseContent";const Pe=l.forwardRef(({className:e,...t},r)=>{const n=E();return h(H,{component:"header",ref:r,className:A({[F.header]:!n.unstyled},e),...t})});Pe.displayName="@mantine/core/ModalBaseHeader";const zt={duration:200,timingFunction:"ease",transition:"fade"};function jt(e){const t=E();return{...zt,...t.transitionProps,...e}}const Ie=l.forwardRef(({onClick:e,transitionProps:t,style:r,visible:n,...a},o)=>{const s=E(),c=jt(t);return h(ge,{mounted:n!==void 0?n:s.opened,...c,transition:"fade",children:f=>h(ce,{ref:o,fixed:!0,style:[r,f],zIndex:s.zIndex,unstyled:s.unstyled,onClick:u=>{e==null||e(u),s.closeOnClickOutside&&s.onClose()},...a})})});Ie.displayName="@mantine/core/ModalBaseOverlay";function Zt(){const e=E();return l.useEffect(()=>(e.setTitleMounted(!0),()=>e.setTitleMounted(!1)),[]),e.getTitleId()}const Oe=l.forwardRef(({className:e,...t},r)=>{const n=Zt(),a=E();return h(H,{component:"h2",ref:r,className:A({[F.title]:!a.unstyled},e),...t,id:n})});Oe.displayName="@mantine/core/ModalBaseTitle";function Vt({children:e}){return h($e,{children:e})}const[Xt,W]=ye("Modal component was not found in tree");var R={root:"m_9df02822",content:"m_54c44539",inner:"m_1f958f16",header:"m_d0e2b9cd"};const Yt={},K=T((e,t)=>{const r=B("ModalBody",Yt,e),{classNames:n,className:a,style:o,styles:s,vars:c,...f}=r,u=W();return h(Re,{ref:t,...u.getStyles("body",{classNames:n,style:o,styles:s,className:a}),...f})});K.classes=R;K.displayName="@mantine/core/ModalBody";const Kt={},Q=T((e,t)=>{const r=B("ModalCloseButton",Kt,e),{classNames:n,className:a,style:o,styles:s,vars:c,...f}=r,u=W();return h(ke,{ref:t,...u.getStyles("close",{classNames:n,style:o,styles:s,className:a}),...f})});Q.classes=R;Q.displayName="@mantine/core/ModalCloseButton";const Qt={},G=T((e,t)=>{const r=B("ModalContent",Qt,e),{classNames:n,className:a,style:o,styles:s,vars:c,children:f,__hidden:u,...d}=r,y=W(),g=y.scrollAreaComponent||Vt;return h(Te,{...y.getStyles("content",{className:a,style:o,styles:s,classNames:n}),innerProps:y.getStyles("inner",{className:a,style:o,styles:s,classNames:n}),"data-full-screen":y.fullScreen||void 0,"data-modal-content":!0,"data-hidden":u||void 0,ref:t,...d,children:h(g,{style:{maxHeight:y.fullScreen?"100dvh":`calc(100dvh - (${X(y.yOffset)} * 2))`},children:f})})});G.classes=R;G.displayName="@mantine/core/ModalContent";const Gt={},U=T((e,t)=>{const r=B("ModalHeader",Gt,e),{classNames:n,className:a,style:o,styles:s,vars:c,...f}=r,u=W();return h(Pe,{ref:t,...u.getStyles("header",{classNames:n,style:o,styles:s,className:a}),...f})});U.classes=R;U.displayName="@mantine/core/ModalHeader";const Ut={},q=T((e,t)=>{const r=B("ModalOverlay",Ut,e),{classNames:n,className:a,style:o,styles:s,vars:c,...f}=r,u=W();return h(Ie,{ref:t,...u.getStyles("overlay",{classNames:n,style:o,styles:s,className:a}),...f})});q.classes=R;q.displayName="@mantine/core/ModalOverlay";const qt={__staticSelector:"Modal",closeOnClickOutside:!0,withinPortal:!0,lockScroll:!0,trapFocus:!0,returnFocus:!0,closeOnEscape:!0,keepMounted:!1,zIndex:$("modal"),transitionProps:{duration:200,transition:"fade-down"},yOffset:"5dvh"},Jt=me((e,{radius:t,size:r,yOffset:n,xOffset:a})=>({root:{"--modal-radius":t===void 0?void 0:he(t),"--modal-size":Ze(r,"modal-size"),"--modal-y-offset":X(n),"--modal-x-offset":X(a)}})),J=T((e,t)=>{const r=B("ModalRoot",qt,e),{classNames:n,className:a,style:o,styles:s,unstyled:c,vars:f,yOffset:u,scrollAreaComponent:d,radius:y,fullScreen:g,centered:m,xOffset:b,__staticSelector:i,...v}=r,p=ve({name:i,classes:R,props:r,className:a,style:o,classNames:n,styles:s,unstyled:c,vars:f,varsResolver:Jt});return h(Xt,{value:{yOffset:u,scrollAreaComponent:d,getStyles:p,fullScreen:g},children:h(Ee,{ref:t,...p("root"),"data-full-screen":g||void 0,"data-centered":m||void 0,unstyled:c,...v})})});J.classes=R;J.displayName="@mantine/core/ModalRoot";const[er,tr]=qe();function _e({children:e}){const[t,r]=l.useState([]),[n,a]=l.useState($("modal"));return h(er,{value:{stack:t,addModal:(o,s)=>{r(c=>[...new Set([...c,o])]),a(c=>typeof s=="number"&&typeof c=="number"?Math.max(c,s):c)},removeModal:o=>r(s=>s.filter(c=>c!==o)),getZIndex:o=>`calc(${n} + ${t.indexOf(o)} + 1)`,currentId:t[t.length-1],maxZIndex:n},children:e})}_e.displayName="@mantine/core/ModalStack";const rr={},ee=T((e,t)=>{const r=B("ModalTitle",rr,e),{classNames:n,className:a,style:o,styles:s,vars:c,...f}=r,u=W();return h(Oe,{ref:t,...u.getStyles("title",{classNames:n,style:o,styles:s,className:a}),...f})});ee.classes=R;ee.displayName="@mantine/core/ModalTitle";const nr={closeOnClickOutside:!0,withinPortal:!0,lockScroll:!0,trapFocus:!0,returnFocus:!0,closeOnEscape:!0,keepMounted:!1,zIndex:$("modal"),transitionProps:{duration:200,transition:"fade-down"},withOverlay:!0,withCloseButton:!0},N=T((e,t)=>{const{title:r,withOverlay:n,overlayProps:a,withCloseButton:o,closeButtonProps:s,children:c,radius:f,opened:u,stackId:d,zIndex:y,...g}=B("Modal",nr,e),m=tr(),b=!!r||o,i=m&&d?{closeOnEscape:m.currentId===d,trapFocus:m.currentId===d,zIndex:m.getZIndex(d)}:{},v=n===!1?!1:d&&m?m.currentId===d:u;return l.useEffect(()=>{m&&d&&(u?m.addModal(d,y||$("modal")):m.removeModal(d))},[u,d,y]),te(J,{ref:t,radius:f,opened:u,zIndex:m&&d?m.getZIndex(d):y,...g,...i,children:[n&&h(q,{visible:v,transitionProps:m&&d?{duration:0}:void 0,...a}),te(G,{radius:f,__hidden:m&&d&&u?d!==m.currentId:!1,children:[b&&te(U,{children:[r&&h(ee,{children:r}),o&&h(Q,{...s})]}),h(K,{children:c})]})]})});N.classes=R;N.displayName="@mantine/core/Modal";N.Root=J;N.Overlay=q;N.Content=G;N.Body=K;N.Header=U;N.Title=ee;N.CloseButton=Q;N.Stack=_e;export{N as M,Vt as N,ce as O,Lt as R,Re as a,ke as b,Te as c,Pe as d,Ie as e,Ee as f,Oe as g};
