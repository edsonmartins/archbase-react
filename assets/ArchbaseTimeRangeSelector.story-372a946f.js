import{a as d,j as e,F as P}from"./jsx-runtime-c9381026.js";import{r as p}from"./index-8b3efc3f.js";import{G as R}from"./Group-4c03121b.js";import{T as $}from"./Tooltip-7fe9133b.js";import{S as z}from"./Select-b5581873.js";import{D as A}from"./DatePickerInput-fd681156.js";import{T as I}from"./TimeInput-129916e9.js";import{A as _}from"./ActionIcon-2f3f1ee4.js";import{I as k}from"./IconClock-04b0092d.js";import{B as U}from"./Button-115efac8.js";import{r as L,t as M}from"./index-d0400ba7.js";import{t as V}from"./index-07970463.js";import{G as y}from"./Grid-a32d8833.js";import{C as f}from"./Card-a798b247.js";import{T as v}from"./Text-f3cc4e22.js";import{B as J}from"./polymorphic-factory-f5c952a9.js";import{S as B}from"./ScrollArea-0e2adf81.js";import{S as K}from"./Space-ac2987ad.js";import{A as Q}from"./ArchbaseObjectInspector-cc5955d4.js";import"./_commonjsHelpers-de833af9.js";import"./OptionalPortal-a9cf30f8.js";import"./index-a38d0dca.js";import"./use-isomorphic-effect-aa890e3d.js";import"./use-merged-ref-add91123.js";import"./DirectionProvider-1e219af7.js";import"./use-floating-auto-update-2dcf8019.js";import"./use-did-update-bccd292e.js";import"./Transition-31651d20.js";import"./use-reduced-motion-98306cff.js";import"./use-media-query-78751440.js";import"./get-style-object-71cabcb5.js";import"./use-id-3df0f1f4.js";import"./use-resolved-styles-api-77b93510.js";import"./OptionsDropdown-cb6e4105.js";import"./CheckIcon-162ce127.js";import"./Combobox-176c8c50.js";import"./Popover-772b0d3b.js";import"./create-safe-context-941c9e18.js";import"./FocusTrap-dfcee1ca.js";import"./use-uncontrolled-f56237fb.js";import"./CloseButton-8aa53231.js";import"./UnstyledButton-5ed8db2e.js";import"./Input-c2ac992d.js";import"./create-optional-context-86e78b6c.js";import"./InputBase-ad8f082f.js";import"./use-input-props-317debde.js";import"./dayjs.min-5b59225a.js";import"./pick-calendar-levels-props-7cce1fb9.js";import"./DatesProvider-b737956c.js";import"./AccordionChevron-b8598f0d.js";import"./clamp-73f6bef2.js";import"./Modal-cfd23b86.js";import"./Paper-4536b30f.js";import"./use-window-event-860a85e7.js";import"./Loader-7e5b6750.js";import"./createReactComponent-60e598cf.js";import"./index-9d475cdf.js";import"./get-sorted-breakpoints-91e0685a.js";import"./px-90b8b31c.js";import"./Mantine.context-1df84d45.js";import"./use-mantine-color-scheme-bbd48c20.js";function W(r,i){L(2,arguments);var a=V(r),l=M(i);return isNaN(l)?new Date(NaN):(l&&a.setDate(a.getDate()+l),a)}function S(r,i){L(2,arguments);var a=M(i);return W(r,-a)}const E=r=>{if(!r)return"";const i=r.getHours().toString().padStart(2,"0"),a=r.getMinutes().toString().padStart(2,"0");return`${i}:${a}`},b=({ranges:r,onRangeChange:i,defaultRangeValue:a})=>{const[l,D]=p.useState(a||(r.length>0?r[0].value:"")),[s,u]=p.useState({start:null,end:null}),[m,o]=p.useState({start:null,end:null}),g=p.useRef(null),T=p.useRef(null);p.useEffect(()=>{if(a&&(l!==a||m.start===null)){const t=r.find(n=>n.value===a);if(t){const{start:n,end:c}=t.rangeFunction(new Date);(m.start!==n||m.end!==c)&&o({start:n,end:c})}}},[a,r]);const O=()=>{o({start:s.start,end:s.end}),i&&i("custom",{start:s.start,end:s.end})},q=t=>{D(t);const n=r.find(c=>c.value===t);if(n){const{start:c,end:h}=n.rangeFunction(new Date);o({start:c,end:h}),i&&i(t,{start:c,end:h})}},x=(t,n)=>{const[c,h]=t.split(":").map(Number),C=new Date((n?s.start:s.end)||new Date);C.setHours(c,h),u(H=>({...H,[n?"start":"end"]:new Date(C)}))},G=m.start&&m.end?`${m.start.toLocaleString()} - ${m.end.toLocaleString()}`:"Intervalo selecionado";return d(R,{gap:"xs",align:"center",children:[e($,{label:G,position:"bottom",withArrow:!0,children:e("div",{children:e(z,{label:"Selecione um intervalo",placeholder:"Selecionado...",value:l,onChange:q,data:[...r.map(({value:t,label:n})=>({value:t,label:n})),{value:"custom",label:"Customizado"}],style:{width:"200px"}})})}),l==="custom"&&d(P,{children:[e(A,{label:"Data inicial",value:s.start,onChange:t=>u(n=>({...n,start:t})),style:{width:"140px"}}),e(I,{label:"Hora inicial",value:E(s.start),onChange:t=>x(t.currentTarget.value,!0),rightSection:e(_,{onClick:()=>{var t;return(t=g.current)==null?void 0:t.click()},children:e(k,{size:"1rem",stroke:1.5})}),ref:g,style:{width:"100px"}}),e(A,{label:"Data final",value:s.end,onChange:t=>u(n=>({...n,end:t})),style:{width:"140px"}}),e(I,{label:"Hora final",value:E(s.end),onChange:t=>x(t.currentTarget.value,!1),rightSection:e(_,{onClick:()=>{var t;return(t=T.current)==null?void 0:t.click()},children:e(k,{size:"1rem",stroke:1.5})}),ref:T,style:{width:"100px"}}),e(U,{onClick:O,style:{alignSelf:"end"},children:"Aplicar"})]})]})};try{b.displayName="ArchbaseTimeRangeSelector",b.__docgenInfo={description:"",displayName:"ArchbaseTimeRangeSelector",props:{ranges:{defaultValue:null,description:"",name:"ranges",required:!0,type:{name:"RangeOption[]"}},onRangeChange:{defaultValue:null,description:"",name:"onRangeChange",required:!1,type:{name:"(selectedValue: string, range: { start: Date; end: Date; }) => void"}},defaultRangeValue:{defaultValue:null,description:"",name:"defaultRangeValue",required:!1,type:{name:"string"}}}}}catch{}const X=()=>{const r="últimos 7 dias",i="últimos 30 dias",a="último dia",[l,D]=p.useState(r),[s,u]=p.useState({start:S(new Date,7),end:new Date}),m=p.useMemo(()=>[{label:a,value:a,rangeFunction:o=>({start:S(o,1),end:o})},{label:r,value:r,rangeFunction:o=>({start:S(o,7),end:o})},{label:i,value:i,rangeFunction:o=>({start:S(o,30),end:o})}],[]);return d(y,{children:[e(y.Col,{offset:1,span:4,children:d(f,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[e(f.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:e(R,{justify:"space-between",children:e(v,{fw:500,children:"Time Range Selector Component"})})}),e(J,{style:{height:500},children:e(B,{h:500,p:20,children:e(b,{defaultRangeValue:r,ranges:m,onRangeChange:(o,g)=>{D(o),u(g)}})})})]})}),e(y.Col,{offset:1,span:4,children:d(f,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[e(f.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:e(R,{justify:"space-between",children:e(v,{fw:500,children:"Resultado"})})}),d(B,{h:300,children:[e(K,{h:20}),e(v,{children:l}),e(Q,{data:s})]})]})})]})},ot={title:"Editores/TimeRangeSeletor",component:b},w={name:"Exemplo simples",render:()=>e(X,{})};var F,N,j;w.parameters={...w.parameters,docs:{...(F=w.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'Exemplo simples',
  render: () => <ArchbaseTimeRangeSelectorExample />
}`,...(j=(N=w.parameters)==null?void 0:N.docs)==null?void 0:j.source}}};export{w as Primary,ot as default};
