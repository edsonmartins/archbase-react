import{j as r,a as L}from"./jsx-runtime-c9381026.js";import{r as R}from"./index-8b3efc3f.js";import{f as j,u as T,h as Z,e as ee,B as N,i as te,n as se,q as h,m as ae}from"./polymorphic-factory-72d50303.js";import{I as oe,a as re,b as ce}from"./InputsGroupFieldset-281fa018.js";import{I as B}from"./Input-da8fd83e.js";import{u as W}from"./use-uncontrolled-f56237fb.js";import{u as ie}from"./use-id-3df0f1f4.js";const q=R.createContext(null),le=q.Provider,ne=()=>R.useContext(q),he={},S=j((c,a)=>{const{value:t,defaultValue:e,onChange:m,size:d,wrapperProps:u,children:p,readOnly:w,...C}=T("SwitchGroup",he,c),[o,b]=W({value:t,defaultValue:e,finalValue:[],onChange:m});return r(le,{value:{value:o,onChange:f=>{const i=f.currentTarget.value;!w&&b(o.includes(i)?o.filter(_=>_!==i):[...o,i])},size:d},children:r(B.Wrapper,{size:d,ref:a,...u,...C,labelElement:"div",__staticSelector:"SwitchGroup",children:r(oe,{role:"group",children:p})})})});S.classes=B.Wrapper.classes;S.displayName="@mantine/core/SwitchGroup";var A={root:"m_5f93f3bb",input:"m_926b4011",track:"m_9307d992",thumb:"m_93039a1d",trackLabel:"m_8277e082"};const de={labelPosition:"right"},ue=te((c,{radius:a,color:t,size:e})=>({root:{"--switch-radius":a===void 0?void 0:se(a),"--switch-height":h(e,"switch-height"),"--switch-width":h(e,"switch-width"),"--switch-thumb-size":h(e,"switch-thumb-size"),"--switch-label-font-size":h(e,"switch-label-font-size"),"--switch-track-label-padding":h(e,"switch-track-label-padding"),"--switch-color":t?ae(t,c):void 0}})),k=j((c,a)=>{const t=T("Switch",de,c),{classNames:e,className:m,style:d,styles:u,unstyled:p,vars:w,color:C,label:o,offLabel:b,onLabel:y,id:f,size:i,radius:_,wrapperProps:F,children:pe,thumbIcon:O,checked:U,defaultChecked:$,onChange:g,labelPosition:P,description:D,error:I,disabled:x,variant:H,rootRef:J,mod:K,...M}=t,s=ne(),Q=i||(s==null?void 0:s.size),l=Z({name:"Switch",props:t,classes:A,className:m,style:d,classNames:e,styles:u,unstyled:p,vars:w,varsResolver:ue}),{styleProps:X,rest:G}=ee(M),V=ie(f),n=s?{checked:s.value.includes(G.value),onChange:s.onChange}:{},[z,Y]=W({value:n.checked??U,defaultValue:$,finalValue:!1});return L(ce,{...l("root"),__staticSelector:"Switch",__stylesApiProps:t,id:V,size:Q,labelPosition:P,label:o,description:D,error:I,disabled:x,bodyElement:"label",labelElement:"span",classNames:e,styles:u,unstyled:p,"data-checked":n.checked||void 0,variant:H,ref:J,mod:K,...X,...F,children:[r("input",{...G,disabled:x,checked:z,onChange:v=>{var E;s?(E=n.onChange)==null||E.call(n,v):g==null||g(v),Y(v.currentTarget.checked)},id:V,ref:a,type:"checkbox",role:"switch",...l("input")}),L(N,{"aria-hidden":"true",mod:{error:I,"label-position":P},...l("track"),children:[r(N,{component:"span",mod:"reduce-motion",...l("thumb"),children:O}),r("span",{...l("trackLabel"),children:z?y:b})]})]})});k.classes={...A,...re};k.displayName="@mantine/core/Switch";k.Group=S;export{k as S};
