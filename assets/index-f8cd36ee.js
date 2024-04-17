import{r as x,R as w}from"./index-76fb7be0.js";import{g as j}from"./_commonjsHelpers-de833af9.js";const m=t=>{let e;const n=new Set,o=(s,f)=>{const c=typeof s=="function"?s(e):s;if(!Object.is(c,e)){const i=e;e=f??(typeof c!="object"||c===null)?c:Object.assign({},e,c),n.forEach(a=>a(e,i))}},r=()=>e,p={setState:o,getState:r,getInitialState:()=>E,subscribe:s=>(n.add(s),()=>n.delete(s)),destroy:()=>{n.clear()}},E=e=t(o,r,p);return p},A=t=>t?m(t):m;var g={exports:{}},D={},b={exports:{}},R={};/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var d=x;function V(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var q=typeof Object.is=="function"?Object.is:V,T=d.useState,B=d.useEffect,F=d.useLayoutEffect,I=d.useDebugValue;function P(t,e){var n=e(),o=T({inst:{value:n,getSnapshot:e}}),r=o[0].inst,u=o[1];return F(function(){r.value=n,r.getSnapshot=e,y(r)&&u({inst:r})},[t,n,e]),B(function(){return y(r)&&u({inst:r}),t(function(){y(r)&&u({inst:r})})},[t]),I(n),n}function y(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!q(t,n)}catch{return!0}}function W(t,e){return e()}var _=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?W:P;R.useSyncExternalStore=d.useSyncExternalStore!==void 0?d.useSyncExternalStore:_;b.exports=R;var $=b.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var v=x,C=$;function L(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var M=typeof Object.is=="function"?Object.is:L,U=C.useSyncExternalStore,z=v.useRef,K=v.useEffect,Y=v.useMemo,k=v.useDebugValue;D.useSyncExternalStoreWithSelector=function(t,e,n,o,r){var u=z(null);if(u.current===null){var l={hasValue:!1,value:null};u.current=l}else l=u.current;u=Y(function(){function p(i){if(!E){if(E=!0,s=i,i=o(i),r!==void 0&&l.hasValue){var a=l.value;if(r(a,i))return f=a}return f=i}if(a=f,M(s,i))return a;var h=o(i);return r!==void 0&&r(a,h)?a:(s=i,f=h)}var E=!1,s,f,c=n===void 0?null:n;return[function(){return p(e())},c===null?void 0:function(){return p(c())}]},[e,n,o,r]);var S=U(t,u[0],u[1]);return K(function(){l.hasValue=!0,l.value=S},[S]),k(S),S};g.exports=D;var G=g.exports;const H=j(G),{useDebugValue:J}=w,{useSyncExternalStoreWithSelector:N}=H;const Q=t=>t;function X(t,e=Q,n){const o=N(t.subscribe,t.getState,t.getServerState||t.getInitialState,e,n);return J(o),o}const O=t=>{const e=typeof t=="function"?A(t):t,n=(o,r)=>X(e,o,r);return Object.assign(n,e),n},et=t=>t?O(t):O;export{et as c};
