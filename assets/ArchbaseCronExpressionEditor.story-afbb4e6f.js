import{a as h,j as a}from"./jsx-runtime-c9381026.js";import{r as b}from"./index-8b3efc3f.js";import{M as C}from"./MultiSelect-342d57bb.js";import{S as M}from"./Stack-50f6659a.js";import{T as c}from"./Text-a1e9c295.js";import{G as y}from"./Group-50b8a2a7.js";import{C as v}from"./Card-d0c0ef07.js";import{B as S}from"./polymorphic-factory-9e44d24d.js";import"./_commonjsHelpers-de833af9.js";import"./use-resolved-styles-api-5d126602.js";import"./OptionsDropdown-3ae730ae.js";import"./CheckIcon-f495496c.js";import"./ScrollArea-50ef8243.js";import"./create-safe-context-941c9e18.js";import"./use-isomorphic-effect-aa890e3d.js";import"./use-merged-ref-add91123.js";import"./DirectionProvider-1e219af7.js";import"./Combobox-2683eefa.js";import"./Popover-981d393f.js";import"./OptionalPortal-bfca0d0b.js";import"./index-a38d0dca.js";import"./use-floating-auto-update-3ec0cee2.js";import"./use-did-update-bccd292e.js";import"./FocusTrap-114f866c.js";import"./use-id-3df0f1f4.js";import"./Transition-a3782892.js";import"./use-reduced-motion-98306cff.js";import"./use-media-query-78751440.js";import"./use-uncontrolled-f56237fb.js";import"./CloseButton-f7e57d7a.js";import"./UnstyledButton-a8d9a9f2.js";import"./Input-5f376bf0.js";import"./create-optional-context-86e78b6c.js";import"./InputBase-17f65698.js";import"./use-input-props-039f064b.js";import"./Paper-d968d2d7.js";import"./Mantine.context-1df84d45.js";function A(r){const i=["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"],d=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];let s="Executar: ";return s+=r.month==="*"?"Todos os meses":`Nos meses de ${r.month.split(",").map(t=>isNaN(t)?t:d[t-1]).join(", ")}`,s+=r.dayOfMonth==="*"?", em todos os dias":`, nos dias ${r.dayOfMonth}`,s+=r.dayOfWeek==="*"?"":`, e nas ${r.dayOfWeek.split(",").map(t=>isNaN(t)?t:i[parseInt(t,10)]).join(", ")}`,s+=r.hours==="*"?", a qualquer hora":`, às ${r.hours.split(",").map(t=>`${t}h`).join(", ")}`,s+=r.minutes==="*"?", e a qualquer minuto":`, e nos minutos ${r.minutes}`,s+=r.seconds==="*"?"":`, e nos segundos ${r.seconds}`,s}function m({label:r,initialValue:i,onChange:d,readOnly:s=!1,error:t}){const[n,p]=b.useState({seconds:"0",minutes:"*",hours:"*",dayOfMonth:"*",month:"*",dayOfWeek:"*"});b.useEffect(()=>{const e=i?i.split(" "):[];e.length===6?p({seconds:e[0],minutes:e[1],hours:e[2],dayOfMonth:e[3],month:e[4],dayOfWeek:e[5]}):p({seconds:"0",minutes:"*",hours:"*",dayOfMonth:"*",month:"*",dayOfWeek:"*"})},[i]);const x=(e,o)=>{const l={...n,[e]:o.length>0?o.join(","):"*"};p(l);const E=`${l.seconds} ${l.minutes} ${l.hours} ${l.dayOfMonth} ${l.month} ${l.dayOfWeek}`;s||d(E)},f={seconds:Array.from({length:60},(e,o)=>({value:`${o}`,label:`${o} segundo(s)`})),minutes:Array.from({length:60},(e,o)=>({value:`${o}`,label:`${o} minuto(s)`})),hours:Array.from({length:24},(e,o)=>({value:`${o}`,label:`${o} hora(s)`})),dayOfMonth:Array.from({length:31},(e,o)=>({value:`${o+1}`,label:`${o+1} dia(s)`})),month:[{value:"1",label:"Janeiro"},{value:"2",label:"Fevereiro"},{value:"3",label:"Março"},{value:"4",label:"Abril"},{value:"5",label:"Maio"},{value:"6",label:"Junho"},{value:"7",label:"Julho"},{value:"8",label:"Agosto"},{value:"9",label:"Setembro"},{value:"10",label:"Outubro"},{value:"11",label:"Novembro"},{value:"12",label:"Dezembro"}],dayOfWeek:[{value:"0",label:"Domingo"},{value:"1",label:"Segunda"},{value:"2",label:"Terça"},{value:"3",label:"Quarta"},{value:"4",label:"Quinta"},{value:"5",label:"Sexta"},{value:"6",label:"Sábado"}]};return h("div",{children:[r&&a("div",{children:a("strong",{children:r})}),Object.keys(f).map(e=>a(C,{data:f[e],label:{seconds:"Segundos",minutes:"Minutos",hours:"Horas",dayOfMonth:"Dia do Mês",month:"Mês",dayOfWeek:"Dia da Semana"}[e],placeholder:"Selecione os valores",value:n[e].split(",").filter(o=>o!=="*"),onChange:o=>x(e,o),searchable:!0,clearable:!0,disabled:s,error:t&&e==="minutes"?t:void 0},e)),h(M,{gap:"xs",children:[a("strong",{children:"Expressão Cron:"}),a(c,{c:"blue",children:`${n.seconds} ${n.minutes} ${n.hours} ${n.dayOfMonth} ${n.month} ${n.dayOfWeek}`}),a("strong",{children:"Descrição:"}),a(c,{c:"blue",children:A(n)})]})]})}try{m.displayName="ArchbaseCronExpressionEditor",m.__docgenInfo={description:"",displayName:"ArchbaseCronExpressionEditor",props:{onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(value: any) => void"}},readOnly:{defaultValue:{value:"false"},description:"",name:"readOnly",required:!1,type:{name:"boolean"}},initialValue:{defaultValue:null,description:"",name:"initialValue",required:!0,type:{name:"any"}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"any"}},error:{defaultValue:null,description:"",name:"error",required:!1,type:{name:"string"}}}}}catch{}const k=()=>a(y,{justify:"center",children:h(v,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,w:{base:"100%",sm:800,lg:1e3},children:[a(v.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:a(y,{justify:"space-between",children:a(c,{fw:500,children:"Cron Expression Editor Component"})})}),a(S,{style:{height:500},children:a(m,{label:"Cron",initialValue:"",onChange:r=>{}})})]})}),pe={title:"Editores/CronExpressionEditor",component:m},u={name:"Exemplo simples",render:()=>a(k,{})};var g,$,O;u.parameters={...u.parameters,docs:{...(g=u.parameters)==null?void 0:g.docs,source:{originalSource:`{
  name: 'Exemplo simples',
  render: () => <ArchbaseCronExpressionEditorExample />
}`,...(O=($=u.parameters)==null?void 0:$.docs)==null?void 0:O.source}}};export{u as Primary,pe as default};
