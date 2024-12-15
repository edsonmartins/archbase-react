import{j as d,a as L}from"./jsx-runtime-c9381026.js";import"./index-8b3efc3f.js";import{f as P,u as m,h as G,B as y,i as N,r as T,q as I,j as U,n as j,p as q}from"./polymorphic-factory-0a97ecf2.js";import{L as D}from"./Loader-f7f9dcb9.js";import{T as V}from"./Transition-5f279277.js";import{U as W}from"./UnstyledButton-b043fbb8.js";var l={root:"m_8d3f4000",icon:"m_8d3afb97",loader:"m_302b9fb1",group:"m_1a0f1b21",groupSection:"m_437b6484"};const x={orientation:"horizontal"},E=N((o,{borderWidth:n})=>({group:{"--ai-border-width":T(n)}})),R=P((o,n)=>{const r=m("ActionIconGroup",x,o),{className:t,style:a,classNames:e,styles:i,unstyled:s,orientation:p,vars:c,borderWidth:S,variant:v,mod:f,...g}=m("ActionIconGroup",x,o),u=G({name:"ActionIconGroup",props:r,classes:l,className:t,style:a,classNames:e,styles:i,unstyled:s,vars:c,varsResolver:E,rootSelector:"group"});return d(y,{...u("group"),ref:n,variant:v,mod:[{"data-orientation":p},f],role:"group",...g})});R.classes=l;R.displayName="@mantine/core/ActionIconGroup";const _={},H=N((o,{radius:n,color:r,gradient:t,variant:a,autoContrast:e,size:i})=>{const s=o.variantColorResolver({color:r||o.primaryColor,theme:o,gradient:t,variant:a||"filled",autoContrast:e});return{groupSection:{"--section-height":I(i,"section-height"),"--section-padding-x":I(i,"section-padding-x"),"--section-fz":U(i),"--section-radius":n===void 0?void 0:j(n),"--section-bg":r||a?s.background:void 0,"--section-color":s.color,"--section-bd":r||a?s.border:void 0}}}),z=P((o,n)=>{const r=m("ActionIconGroupSection",_,o),{className:t,style:a,classNames:e,styles:i,unstyled:s,vars:p,variant:c,gradient:S,radius:v,autoContrast:f,...g}=m("ActionIconGroupSection",_,o),u=G({name:"ActionIconGroupSection",props:r,classes:l,className:t,style:a,classNames:e,styles:i,unstyled:s,vars:p,varsResolver:H,rootSelector:"groupSection"});return d(y,{...u("groupSection"),ref:n,variant:c,...g})});z.classes=l;z.displayName="@mantine/core/ActionIconGroupSection";const J={},K=N((o,{size:n,radius:r,variant:t,gradient:a,color:e,autoContrast:i})=>{const s=o.variantColorResolver({color:e||o.primaryColor,theme:o,gradient:a,variant:t||"filled",autoContrast:i});return{root:{"--ai-size":I(n,"ai-size"),"--ai-radius":r===void 0?void 0:j(r),"--ai-bg":e||t?s.background:void 0,"--ai-hover":e||t?s.hover:void 0,"--ai-hover-color":e||t?s.hoverColor:void 0,"--ai-color":s.color,"--ai-bd":e||t?s.border:void 0}}}),b=q((o,n)=>{const r=m("ActionIcon",J,o),{className:t,unstyled:a,variant:e,classNames:i,styles:s,style:p,loading:c,loaderProps:S,size:v,color:f,radius:g,__staticSelector:u,gradient:M,vars:$,children:B,disabled:h,"data-disabled":C,autoContrast:O,mod:k,...w}=r,A=G({name:["ActionIcon",u],props:r,className:t,style:p,classes:l,classNames:i,styles:s,unstyled:a,vars:$,varsResolver:K});return L(W,{...A("root",{active:!h&&!c&&!C}),...w,unstyled:a,variant:e,size:v,disabled:h||c,ref:n,mod:[{loading:c,disabled:h||C},k],children:[d(V,{mounted:!!c,transition:"slide-down",duration:150,children:F=>d(y,{component:"span",...A("loader",{style:F}),"aria-hidden":!0,children:d(D,{color:"var(--ai-color)",size:"calc(var(--ai-size) * 0.55)",...S})})}),d(y,{component:"span",mod:{loading:c},...A("icon"),children:B})]})});b.classes=l;b.displayName="@mantine/core/ActionIcon";b.Group=R;b.GroupSection=z;export{b as A};
