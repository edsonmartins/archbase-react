import{j as S}from"./jsx-runtime-c9381026.js";import"./index-8b3efc3f.js";import{p as j,u as N,h as _,B as z,i as B,j as F,k as P,l as R,m as k}from"./polymorphic-factory-72d50303.js";var n={root:"m_b6d8b162"};function C(t){if(t==="start")return"start";if(t==="end"||t)return"end"}const G={inherit:!1},H=B((t,{variant:r,lineClamp:e,gradient:o,size:s,color:a})=>({root:{"--text-fz":F(s),"--text-lh":P(s),"--text-gradient":r==="gradient"?R(o,t):void 0,"--text-line-clamp":typeof e=="number"?e.toString():void 0,"--text-color":a?k(a,t):void 0}})),i=j((t,r)=>{const e=N("Text",G,t),{lineClamp:o,truncate:s,inline:a,inherit:l,gradient:L,span:c,__staticSelector:d,vars:m,className:p,style:u,classNames:x,styles:f,unstyled:g,variant:v,mod:y,size:h,...T}=e,b=_({name:["Text",d],props:e,classes:n,className:p,style:u,classNames:x,styles:f,unstyled:g,vars:m,varsResolver:H});return S(z,{...b("root",{focusable:!0}),ref:r,component:c?"span":"p",variant:v,mod:[{"data-truncate":C(s),"data-line-clamp":typeof o=="number","data-inline":a,"data-inherit":l},y],size:h,...T})});i.classes=n;i.displayName="@mantine/core/Text";export{i as T};
