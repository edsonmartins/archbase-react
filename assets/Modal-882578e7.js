import{j as m,F as Fe,a as te}from"./jsx-runtime-c9381026.js";import{r as s}from"./index-8b3efc3f.js";import{g as V,O as $e}from"./OptionalPortal-2778d3e2.js";import{p as We,u as N,h as ve,B as W,i as me,C as He,r as Y,n as he,o as De,s as je,t as A,f as k,q as ze}from"./polymorphic-factory-a4611e92.js";import{c as ye}from"./create-safe-context-941c9e18.js";import{C as Xe}from"./CloseButton-cc9ab058.js";import{u as Ye,F as Ve}from"./FocusTrap-03f7f7d2.js";import{P as Ze}from"./Paper-3fe2af31.js";import{T as ge}from"./Transition-b4f11a45.js";import{u as Ke}from"./use-reduced-motion-aed616a5.js";import{u as Qe}from"./use-id-3df0f1f4.js";import{u as Ge}from"./use-window-event-860a85e7.js";var B=function(){return B=Object.assign||function(t){for(var r,n=1,a=arguments.length;n<a;n++){r=arguments[n];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o])}return t},B.apply(this,arguments)};function pe(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var a=0,n=Object.getOwnPropertySymbols(e);a<n.length;a++)t.indexOf(n[a])<0&&Object.prototype.propertyIsEnumerable.call(e,n[a])&&(r[n[a]]=e[n[a]]);return r}function Ue(e,t,r){if(r||arguments.length===2)for(var n=0,a=t.length,o;n<a;n++)(o||!(n in t))&&(o||(o=Array.prototype.slice.call(t,0,n)),o[n]=t[n]);return e.concat(o||Array.prototype.slice.call(t))}var z="right-scroll-bar-position",X="width-before-scroll-bar",qe="with-scroll-bars-hidden",Je="--removed-body-scroll-bar-size";function re(e,t){return typeof e=="function"?e(t):e&&(e.current=t),e}function et(e,t){var r=s.useState(function(){return{value:e,callback:t,facade:{get current(){return r.value},set current(n){var a=r.value;a!==n&&(r.value=n,r.callback(n,a))}}}})[0];return r.callback=t,r.facade}var tt=typeof window<"u"?s.useLayoutEffect:s.useEffect,le=new WeakMap;function rt(e,t){var r=et(t||null,function(n){return e.forEach(function(a){return re(a,n)})});return tt(function(){var n=le.get(r);if(n){var a=new Set(n),o=new Set(e),l=r.current;a.forEach(function(c){o.has(c)||re(c,null)}),o.forEach(function(c){a.has(c)||re(c,l)})}le.set(r,e)},[e]),r}function nt(e){return e}function at(e,t){t===void 0&&(t=nt);var r=[],n=!1,a={read:function(){if(n)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return r.length?r[r.length-1]:e},useMedium:function(o){var l=t(o,n);return r.push(l),function(){r=r.filter(function(c){return c!==l})}},assignSyncMedium:function(o){for(n=!0;r.length;){var l=r;r=[],l.forEach(o)}r={push:function(c){return o(c)},filter:function(){return r}}},assignMedium:function(o){n=!0;var l=[];if(r.length){var c=r;r=[],c.forEach(o),l=r}var u=function(){var v=l;l=[],v.forEach(o)},d=function(){return Promise.resolve().then(u)};d(),r={push:function(v){l.push(v),d()},filter:function(v){return l=l.filter(v),r}}}};return a}function ot(e){e===void 0&&(e={});var t=at(null);return t.options=B({async:!0,ssr:!1},e),t}var Se=function(e){var t=e.sideCar,r=pe(e,["sideCar"]);if(!t)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var n=t.read();if(!n)throw new Error("Sidecar medium not found");return s.createElement(n,B({},r))};Se.isSideCarExport=!0;function ct(e,t){return e.useMedium(t),Se}var be=ot(),ne=function(){},Z=s.forwardRef(function(e,t){var r=s.useRef(null),n=s.useState({onScrollCapture:ne,onWheelCapture:ne,onTouchMoveCapture:ne}),a=n[0],o=n[1],l=e.forwardProps,c=e.children,u=e.className,d=e.removeScrollBar,v=e.enabled,g=e.shards,p=e.sideCar,S=e.noIsolation,w=e.inert,i=e.allowPinchZoom,f=e.as,h=f===void 0?"div":f,M=e.gapMode,b=pe(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noIsolation","inert","allowPinchZoom","as","gapMode"]),C=p,y=rt([r,t]),T=B(B({},b),a);return s.createElement(s.Fragment,null,v&&s.createElement(C,{sideCar:be,removeScrollBar:d,shards:g,noIsolation:S,inert:w,setCallbacks:o,allowPinchZoom:!!i,lockRef:r,gapMode:M}),l?s.cloneElement(s.Children.only(c),B(B({},T),{ref:y})):s.createElement(h,B({},T,{className:u,ref:y}),c))});Z.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};Z.classNames={fullWidth:X,zeroRight:z};var se,lt=function(){if(se)return se;if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function st(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var t=lt();return t&&e.setAttribute("nonce",t),e}function it(e,t){e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}function ut(e){var t=document.head||document.getElementsByTagName("head")[0];t.appendChild(e)}var dt=function(){var e=0,t=null;return{add:function(r){e==0&&(t=st())&&(it(t,r),ut(t)),e++},remove:function(){e--,!e&&t&&(t.parentNode&&t.parentNode.removeChild(t),t=null)}}},ft=function(){var e=dt();return function(t,r){s.useEffect(function(){return e.add(t),function(){e.remove()}},[t&&r])}},we=function(){var e=ft(),t=function(r){var n=r.styles,a=r.dynamic;return e(n,a),null};return t},vt={left:0,top:0,right:0,gap:0},ae=function(e){return parseInt(e||"",10)||0},mt=function(e){var t=window.getComputedStyle(document.body),r=t[e==="padding"?"paddingLeft":"marginLeft"],n=t[e==="padding"?"paddingTop":"marginTop"],a=t[e==="padding"?"paddingRight":"marginRight"];return[ae(r),ae(n),ae(a)]},ht=function(e){if(e===void 0&&(e="margin"),typeof window>"u")return vt;var t=mt(e),r=document.documentElement.clientWidth,n=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,n-r+t[2]-t[0])}},yt=we(),L="data-scroll-locked",gt=function(e,t,r,n){var a=e.left,o=e.top,l=e.right,c=e.gap;return r===void 0&&(r="margin"),`
  .`.concat(qe,` {
   overflow: hidden `).concat(n,`;
   padding-right: `).concat(c,"px ").concat(n,`;
  }
  body[`).concat(L,`] {
    overflow: hidden `).concat(n,`;
    overscroll-behavior: contain;
    `).concat([t&&"position: relative ".concat(n,";"),r==="margin"&&`
    padding-left: `.concat(a,`px;
    padding-top: `).concat(o,`px;
    padding-right: `).concat(l,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(c,"px ").concat(n,`;
    `),r==="padding"&&"padding-right: ".concat(c,"px ").concat(n,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(z,` {
    right: `).concat(c,"px ").concat(n,`;
  }
  
  .`).concat(X,` {
    margin-right: `).concat(c,"px ").concat(n,`;
  }
  
  .`).concat(z," .").concat(z,` {
    right: 0 `).concat(n,`;
  }
  
  .`).concat(X," .").concat(X,` {
    margin-right: 0 `).concat(n,`;
  }
  
  body[`).concat(L,`] {
    `).concat(Je,": ").concat(c,`px;
  }
`)},ie=function(){var e=parseInt(document.body.getAttribute(L)||"0",10);return isFinite(e)?e:0},pt=function(){s.useEffect(function(){return document.body.setAttribute(L,(ie()+1).toString()),function(){var e=ie()-1;e<=0?document.body.removeAttribute(L):document.body.setAttribute(L,e.toString())}},[])},St=function(e){var t=e.noRelative,r=e.noImportant,n=e.gapMode,a=n===void 0?"margin":n;pt();var o=s.useMemo(function(){return ht(a)},[a]);return s.createElement(yt,{styles:gt(o,!t,a,r?"":"!important")})},oe=!1;if(typeof window<"u")try{var D=Object.defineProperty({},"passive",{get:function(){return oe=!0,!0}});window.addEventListener("test",D,D),window.removeEventListener("test",D,D)}catch{oe=!1}var I=oe?{passive:!1}:!1,bt=function(e){return e.tagName==="TEXTAREA"},Me=function(e,t){if(!(e instanceof Element))return!1;var r=window.getComputedStyle(e);return r[t]!=="hidden"&&!(r.overflowY===r.overflowX&&!bt(e)&&r[t]==="visible")},wt=function(e){return Me(e,"overflowY")},Mt=function(e){return Me(e,"overflowX")},ue=function(e,t){var r=t.ownerDocument,n=t;do{typeof ShadowRoot<"u"&&n instanceof ShadowRoot&&(n=n.host);var a=Ce(e,n);if(a){var o=Be(e,n),l=o[1],c=o[2];if(l>c)return!0}n=n.parentNode}while(n&&n!==r.body);return!1},Ct=function(e){var t=e.scrollTop,r=e.scrollHeight,n=e.clientHeight;return[t,r,n]},Bt=function(e){var t=e.scrollLeft,r=e.scrollWidth,n=e.clientWidth;return[t,r,n]},Ce=function(e,t){return e==="v"?wt(t):Mt(t)},Be=function(e,t){return e==="v"?Ct(t):Bt(t)},Nt=function(e,t){return e==="h"&&t==="rtl"?-1:1},Et=function(e,t,r,n,a){var o=Nt(e,window.getComputedStyle(t).direction),l=o*n,c=r.target,u=t.contains(c),d=!1,v=l>0,g=0,p=0;do{var S=Be(e,c),w=S[0],i=S[1],f=S[2],h=i-f-o*w;(w||h)&&Ce(e,c)&&(g+=h,p+=w),c instanceof ShadowRoot?c=c.host:c=c.parentNode}while(!u&&c!==document.body||u&&(t.contains(c)||t===c));return(v&&(a&&Math.abs(g)<1||!a&&l>g)||!v&&(a&&Math.abs(p)<1||!a&&-l>p))&&(d=!0),d},j=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},de=function(e){return[e.deltaX,e.deltaY]},fe=function(e){return e&&"current"in e?e.current:e},Rt=function(e,t){return e[0]===t[0]&&e[1]===t[1]},xt=function(e){return`
  .block-interactivity-`.concat(e,` {pointer-events: none;}
  .allow-interactivity-`).concat(e,` {pointer-events: all;}
`)},Tt=0,_=[];function kt(e){var t=s.useRef([]),r=s.useRef([0,0]),n=s.useRef(),a=s.useState(Tt++)[0],o=s.useState(we)[0],l=s.useRef(e);s.useEffect(function(){l.current=e},[e]),s.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(a));var i=Ue([e.lockRef.current],(e.shards||[]).map(fe),!0).filter(Boolean);return i.forEach(function(f){return f.classList.add("allow-interactivity-".concat(a))}),function(){document.body.classList.remove("block-interactivity-".concat(a)),i.forEach(function(f){return f.classList.remove("allow-interactivity-".concat(a))})}}},[e.inert,e.lockRef.current,e.shards]);var c=s.useCallback(function(i,f){if("touches"in i&&i.touches.length===2||i.type==="wheel"&&i.ctrlKey)return!l.current.allowPinchZoom;var h=j(i),M=r.current,b="deltaX"in i?i.deltaX:M[0]-h[0],C="deltaY"in i?i.deltaY:M[1]-h[1],y,T=i.target,P=Math.abs(b)>Math.abs(C)?"h":"v";if("touches"in i&&P==="h"&&T.type==="range")return!1;var O=ue(P,T);if(!O)return!0;if(O?y=P:(y=P==="v"?"h":"v",O=ue(P,T)),!O)return!1;if(!n.current&&"changedTouches"in i&&(b||C)&&(n.current=y),!y)return!0;var H=n.current||y;return Et(H,f,i,H==="h"?b:C,!0)},[]),u=s.useCallback(function(i){var f=i;if(!(!_.length||_[_.length-1]!==o)){var h="deltaY"in f?de(f):j(f),M=t.current.filter(function(y){return y.name===f.type&&(y.target===f.target||f.target===y.shadowParent)&&Rt(y.delta,h)})[0];if(M&&M.should){f.cancelable&&f.preventDefault();return}if(!M){var b=(l.current.shards||[]).map(fe).filter(Boolean).filter(function(y){return y.contains(f.target)}),C=b.length>0?c(f,b[0]):!l.current.noIsolation;C&&f.cancelable&&f.preventDefault()}}},[]),d=s.useCallback(function(i,f,h,M){var b={name:i,delta:f,target:h,should:M,shadowParent:Pt(h)};t.current.push(b),setTimeout(function(){t.current=t.current.filter(function(C){return C!==b})},1)},[]),v=s.useCallback(function(i){r.current=j(i),n.current=void 0},[]),g=s.useCallback(function(i){d(i.type,de(i),i.target,c(i,e.lockRef.current))},[]),p=s.useCallback(function(i){d(i.type,j(i),i.target,c(i,e.lockRef.current))},[]);s.useEffect(function(){return _.push(o),e.setCallbacks({onScrollCapture:g,onWheelCapture:g,onTouchMoveCapture:p}),document.addEventListener("wheel",u,I),document.addEventListener("touchmove",u,I),document.addEventListener("touchstart",v,I),function(){_=_.filter(function(i){return i!==o}),document.removeEventListener("wheel",u,I),document.removeEventListener("touchmove",u,I),document.removeEventListener("touchstart",v,I)}},[]);var S=e.removeScrollBar,w=e.inert;return s.createElement(s.Fragment,null,w?s.createElement(o,{styles:xt(a)}):null,S?s.createElement(St,{gapMode:e.gapMode}):null)}function Pt(e){for(var t=null;e!==null;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}const Ot=ct(be,kt);var Ne=s.forwardRef(function(e,t){return s.createElement(Z,B({},e,{ref:t,sideCar:Ot}))});Ne.classNames=Z.classNames;const It=Ne;var Ee={root:"m_9814e45f"};const _t={zIndex:V("modal")},Lt=me((e,{gradient:t,color:r,backgroundOpacity:n,blur:a,radius:o,zIndex:l})=>({root:{"--overlay-bg":t||(r!==void 0||n!==void 0)&&He(r||"#000",n??.6)||void 0,"--overlay-filter":a?`blur(${Y(a)})`:void 0,"--overlay-radius":o===void 0?void 0:he(o),"--overlay-z-index":l==null?void 0:l.toString()}})),ce=We((e,t)=>{const r=N("Overlay",_t,e),{classNames:n,className:a,style:o,styles:l,unstyled:c,vars:u,fixed:d,center:v,children:g,radius:p,zIndex:S,gradient:w,blur:i,color:f,backgroundOpacity:h,mod:M,...b}=r,C=ve({name:"Overlay",props:r,classes:Ee,className:a,style:o,classNames:n,styles:l,unstyled:c,vars:u,varsResolver:Lt});return m(W,{ref:t,...C("root"),mod:[{center:v,fixed:d},M],...b,children:g})});ce.classes=Ee;ce.displayName="@mantine/core/Overlay";const[At,E]=ye("ModalBase component was not found in tree");function Ft({opened:e,transitionDuration:t}){const[r,n]=s.useState(e),a=s.useRef(),l=Ke()?0:t;return s.useEffect(()=>(e?(n(!0),window.clearTimeout(a.current)):l===0?n(!1):a.current=window.setTimeout(()=>n(!1),l),()=>window.clearTimeout(a.current)),[e,l]),r}function $t({id:e,transitionProps:t,opened:r,trapFocus:n,closeOnEscape:a,onClose:o,returnFocus:l}){const c=Qe(e),[u,d]=s.useState(!1),[v,g]=s.useState(!1),p=typeof(t==null?void 0:t.duration)=="number"?t==null?void 0:t.duration:200,S=Ft({opened:r,transitionDuration:p});return Ge("keydown",w=>{var i;w.key==="Escape"&&a&&r&&((i=w.target)==null?void 0:i.getAttribute("data-mantine-stop-propagation"))!=="true"&&o()},{capture:!0}),Ye({opened:r,shouldReturnFocus:n&&l}),{_id:c,titleMounted:u,bodyMounted:v,shouldLockScroll:S,setTitleMounted:d,setBodyMounted:g}}const Re=s.forwardRef(({keepMounted:e,opened:t,onClose:r,id:n,transitionProps:a,trapFocus:o,closeOnEscape:l,returnFocus:c,closeOnClickOutside:u,withinPortal:d,portalProps:v,lockScroll:g,children:p,zIndex:S,shadow:w,padding:i,__vars:f,unstyled:h,removeScrollProps:M,...b},C)=>{const{_id:y,titleMounted:T,bodyMounted:P,shouldLockScroll:O,setTitleMounted:H,setBodyMounted:_e}=$t({id:n,transitionProps:a,opened:t,trapFocus:o,closeOnEscape:l,onClose:r,returnFocus:c}),{key:Le,...Ae}=M||{};return m($e,{...v,withinPortal:d,children:m(At,{value:{opened:t,onClose:r,closeOnClickOutside:u,transitionProps:{...a,keepMounted:e},getTitleId:()=>`${y}-title`,getBodyId:()=>`${y}-body`,titleMounted:T,bodyMounted:P,setTitleMounted:H,setBodyMounted:_e,trapFocus:o,closeOnEscape:l,zIndex:S,unstyled:h},children:m(It,{enabled:O&&g,...Ae,children:m(W,{ref:C,...b,__vars:{...f,"--mb-z-index":(S||V("modal")).toString(),"--mb-shadow":De(w),"--mb-padding":je(i)},children:p})},Le)})})});Re.displayName="@mantine/core/ModalBase";function Wt(){const e=E();return s.useEffect(()=>(e.setBodyMounted(!0),()=>e.setBodyMounted(!1)),[]),e.getBodyId()}var F={title:"m_615af6c9",header:"m_b5489c3c",inner:"m_60c222c7",content:"m_fd1ab0aa",close:"m_606cb269",body:"m_5df29311"};const xe=s.forwardRef(({className:e,...t},r)=>{const n=Wt(),a=E();return m(W,{ref:r,...t,id:n,className:A({[F.body]:!a.unstyled},e)})});xe.displayName="@mantine/core/ModalBaseBody";const Te=s.forwardRef(({className:e,onClick:t,...r},n)=>{const a=E();return m(Xe,{ref:n,...r,onClick:o=>{a.onClose(),t==null||t(o)},className:A({[F.close]:!a.unstyled},e),unstyled:a.unstyled})});Te.displayName="@mantine/core/ModalBaseCloseButton";const ke=s.forwardRef(({transitionProps:e,className:t,innerProps:r,onKeyDown:n,style:a,...o},l)=>{const c=E();return m(ge,{mounted:c.opened,transition:"pop",...c.transitionProps,...e,children:u=>m("div",{...r,className:A({[F.inner]:!c.unstyled},r.className),children:m(Ve,{active:c.opened&&c.trapFocus,innerRef:l,children:m(Ze,{...o,component:"section",role:"dialog",tabIndex:-1,"aria-modal":!0,"aria-describedby":c.bodyMounted?c.getBodyId():void 0,"aria-labelledby":c.titleMounted?c.getTitleId():void 0,style:[a,u],className:A({[F.content]:!c.unstyled},t),unstyled:c.unstyled,children:o.children})})})})});ke.displayName="@mantine/core/ModalBaseContent";const Pe=s.forwardRef(({className:e,...t},r)=>{const n=E();return m(W,{component:"header",ref:r,className:A({[F.header]:!n.unstyled},e),...t})});Pe.displayName="@mantine/core/ModalBaseHeader";const Ht={duration:200,timingFunction:"ease",transition:"fade"};function Dt(e){const t=E();return{...Ht,...t.transitionProps,...e}}const Oe=s.forwardRef(({onClick:e,transitionProps:t,style:r,...n},a)=>{const o=E(),l=Dt(t);return m(ge,{mounted:o.opened,...l,transition:"fade",children:c=>m(ce,{ref:a,fixed:!0,style:[r,c],zIndex:o.zIndex,unstyled:o.unstyled,onClick:u=>{e==null||e(u),o.closeOnClickOutside&&o.onClose()},...n})})});Oe.displayName="@mantine/core/ModalBaseOverlay";function jt(){const e=E();return s.useEffect(()=>(e.setTitleMounted(!0),()=>e.setTitleMounted(!1)),[]),e.getTitleId()}const Ie=s.forwardRef(({className:e,...t},r)=>{const n=jt(),a=E();return m(W,{component:"h2",ref:r,className:A({[F.title]:!a.unstyled},e),...t,id:n})});Ie.displayName="@mantine/core/ModalBaseTitle";function zt({children:e}){return m(Fe,{children:e})}const[Xt,$]=ye("Modal component was not found in tree");var R={root:"m_9df02822",content:"m_54c44539",inner:"m_1f958f16",header:"m_d0e2b9cd"};const Yt={},K=k((e,t)=>{const r=N("ModalBody",Yt,e),{classNames:n,className:a,style:o,styles:l,vars:c,...u}=r,d=$();return m(xe,{ref:t,...d.getStyles("body",{classNames:n,style:o,styles:l,className:a}),...u})});K.classes=R;K.displayName="@mantine/core/ModalBody";const Vt={},Q=k((e,t)=>{const r=N("ModalCloseButton",Vt,e),{classNames:n,className:a,style:o,styles:l,vars:c,...u}=r,d=$();return m(Te,{ref:t,...d.getStyles("close",{classNames:n,style:o,styles:l,className:a}),...u})});Q.classes=R;Q.displayName="@mantine/core/ModalCloseButton";const Zt={},G=k((e,t)=>{const r=N("ModalContent",Zt,e),{classNames:n,className:a,style:o,styles:l,vars:c,children:u,...d}=r,v=$(),g=v.scrollAreaComponent||zt;return m(ke,{...v.getStyles("content",{className:a,style:o,styles:l,classNames:n}),innerProps:v.getStyles("inner",{className:a,style:o,styles:l,classNames:n}),"data-full-screen":v.fullScreen||void 0,"data-modal-content":!0,ref:t,...d,children:m(g,{style:{maxHeight:v.fullScreen?"100dvh":`calc(100dvh - (${Y(v.yOffset)} * 2))`},children:u})})});G.classes=R;G.displayName="@mantine/core/ModalContent";const Kt={},U=k((e,t)=>{const r=N("ModalHeader",Kt,e),{classNames:n,className:a,style:o,styles:l,vars:c,...u}=r,d=$();return m(Pe,{ref:t,...d.getStyles("header",{classNames:n,style:o,styles:l,className:a}),...u})});U.classes=R;U.displayName="@mantine/core/ModalHeader";const Qt={},q=k((e,t)=>{const r=N("ModalOverlay",Qt,e),{classNames:n,className:a,style:o,styles:l,vars:c,...u}=r,d=$();return m(Oe,{ref:t,...d.getStyles("overlay",{classNames:n,style:o,styles:l,className:a}),...u})});q.classes=R;q.displayName="@mantine/core/ModalOverlay";const Gt={__staticSelector:"Modal",closeOnClickOutside:!0,withinPortal:!0,lockScroll:!0,trapFocus:!0,returnFocus:!0,closeOnEscape:!0,keepMounted:!1,zIndex:V("modal"),transitionProps:{duration:200,transition:"fade-down"},yOffset:"5dvh"},Ut=me((e,{radius:t,size:r,yOffset:n,xOffset:a})=>({root:{"--modal-radius":t===void 0?void 0:he(t),"--modal-size":ze(r,"modal-size"),"--modal-y-offset":Y(n),"--modal-x-offset":Y(a)}})),J=k((e,t)=>{const r=N("ModalRoot",Gt,e),{classNames:n,className:a,style:o,styles:l,unstyled:c,vars:u,yOffset:d,scrollAreaComponent:v,radius:g,fullScreen:p,centered:S,xOffset:w,__staticSelector:i,...f}=r,h=ve({name:i,classes:R,props:r,className:a,style:o,classNames:n,styles:l,unstyled:c,vars:u,varsResolver:Ut});return m(Xt,{value:{yOffset:d,scrollAreaComponent:v,getStyles:h,fullScreen:p},children:m(Re,{ref:t,...h("root"),"data-full-screen":p||void 0,"data-centered":S||void 0,unstyled:c,...f})})});J.classes=R;J.displayName="@mantine/core/ModalRoot";const qt={},ee=k((e,t)=>{const r=N("ModalTitle",qt,e),{classNames:n,className:a,style:o,styles:l,vars:c,...u}=r,d=$();return m(Ie,{ref:t,...d.getStyles("title",{classNames:n,style:o,styles:l,className:a}),...u})});ee.classes=R;ee.displayName="@mantine/core/ModalTitle";const Jt={closeOnClickOutside:!0,withinPortal:!0,lockScroll:!0,trapFocus:!0,returnFocus:!0,closeOnEscape:!0,keepMounted:!1,zIndex:V("modal"),transitionProps:{duration:200,transition:"fade-down"},withOverlay:!0,withCloseButton:!0},x=k((e,t)=>{const{title:r,withOverlay:n,overlayProps:a,withCloseButton:o,closeButtonProps:l,children:c,radius:u,...d}=N("Modal",Jt,e),v=!!r||o;return te(J,{ref:t,radius:u,...d,children:[n&&m(q,{...a}),te(G,{radius:u,children:[v&&te(U,{children:[r&&m(ee,{children:r}),o&&m(Q,{...l})]}),m(K,{children:c})]})]})});x.classes=R;x.displayName="@mantine/core/Modal";x.Root=J;x.Overlay=q;x.Content=G;x.Body=K;x.Header=U;x.Title=ee;x.CloseButton=Q;export{x as M,zt as N,ce as O,It as R,xe as a,Te as b,ke as c,Pe as d,Oe as e,Re as f,Ie as g};
