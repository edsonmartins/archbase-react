import{j as b}from"./jsx-runtime-c9381026.js";import{f as _,u as j,t as k}from"./polymorphic-factory-f5c952a9.js";import{I as f}from"./InputBase-ad8f082f.js";import{u as C}from"./use-resolved-styles-api-77b93510.js";var H={input:"m_468e7eda"};const M={},d=_((p,T)=>{const s=j("TimeInput",M,p),{classNames:h,styles:x,unstyled:y,vars:P,withSeconds:c,minTime:o,maxTime:u,value:v,onChange:I,...g}=s,{resolvedClassNames:r,resolvedStyles:S}=C({classNames:h,styles:x,props:s}),N=i=>{if(o!==void 0||u!==void 0){const[t,a,m]=i.split(":").map(Number);if(o){const[e,n,l]=o.split(":").map(Number);if(t<e||t===e&&a<n||c&&t===e&&a===n&&m<l)return-1}if(u){const[e,n,l]=u.split(":").map(Number);if(t>e||t===e&&a>n||c&&t===e&&a===n&&m>l)return 1}}return 0},B=i=>{var t,a,m;if((t=s.onBlur)==null||t.call(s,i),o!==void 0||u!==void 0){const e=i.currentTarget.value;if(e){const n=N(e);n===1?(i.currentTarget.value=u,(a=s.onChange)==null||a.call(s,i)):n===-1&&(i.currentTarget.value=o,(m=s.onChange)==null||m.call(s,i))}}};return b(f,{classNames:{...r,input:k(H.input,r==null?void 0:r.input)},styles:S,unstyled:y,ref:T,value:v,...g,step:c?1:60,onChange:I,onBlur:B,type:"time",__staticSelector:"TimeInput"})});d.classes=f.classes;d.displayName="@mantine/dates/TimeInput";export{d as T};
