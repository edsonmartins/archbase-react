import{j as a,a as f,F as W}from"./jsx-runtime-c9381026.js";import{r as C}from"./index-8b3efc3f.js";import{h as q,B as n,j as w,q as D}from"./polymorphic-factory-72d50303.js";import{I as u,u as G}from"./Input-da8fd83e.js";var h={root:"m_5f75b09e",body:"m_5f6e695e",labelWrapper:"m_d3ea56bb",label:"m_8ee546b8",description:"m_328f68c0",error:"m_8e8a99cc"};const J=h,N=C.forwardRef(({__staticSelector:l,__stylesApiProps:o,className:r,classNames:I,styles:_,unstyled:v,children:y,label:i,description:d,id:p,disabled:b,error:s,size:t,labelPosition:x="left",bodyElement:c="div",labelElement:m="label",variant:F,style:S,vars:R,mod:g,...j},B)=>{const e=q({name:l,props:o,className:r,style:S,classes:h,classNames:I,styles:_,unstyled:v});return a(n,{...e("root"),ref:B,__vars:{"--label-fz":w(t),"--label-lh":D(t,"label-lh")},mod:[{"label-position":x},g],variant:F,size:t,...j,children:f(n,{component:c,htmlFor:c==="label"?p:void 0,...e("body"),children:[y,f("div",{...e("labelWrapper"),"data-disabled":b||void 0,children:[i&&a(n,{component:m,htmlFor:m==="label"?p:void 0,...e("label"),"data-disabled":b||void 0,children:i}),d&&a(u.Description,{size:t,__inheritStyles:!1,...e("description"),children:d}),s&&s!=="boolean"&&a(u.Error,{size:t,__inheritStyles:!1,...e("error"),children:s})]})]})})});N.displayName="@mantine/core/InlineInput";function K({children:l,role:o}){const r=G();return r?a("div",{role:o,"aria-labelledby":r.labelId,"aria-describedby":r.describedBy,children:l}):a(W,{children:l})}export{K as I,J as a,N as b};
