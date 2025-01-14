import{j as e,a as o}from"./jsx-runtime-c9381026.js";import{r as S}from"./index-8b3efc3f.js";import{a}from"./types-5decf4ed.js";import{u as D,a as C}from"./useArchbaseDataSource-c5d317be.js";import{u as x,D as P}from"./useArchbaseDataSourceListener-92dd263c.js";import"./index-9e992aa6.js";import{A as h}from"./ArchbaseSelect-cb371b89.js";import{A as d}from"./ArchbaseSelectItem-d056b8eb.js";import{F as y}from"./Flex-edc9651b.js";import{B as l}from"./Badge-eba06117.js";import{T as m}from"./Text-f1dc7ab8.js";import{G as n}from"./Grid-522477ba.js";import{C as s}from"./Card-58b02503.js";import{G as c}from"./Group-28f303e3.js";import{B as O}from"./polymorphic-factory-36f51e7a.js";import{S as u}from"./ScrollArea-556e0f32.js";import{A as B}from"./index-45497a86.js";import{A as N}from"./ArchbaseObjectInspector-e280f051.js";import{p as v}from"./pessoasData-6b8000da.js";import{p as F}from"./pedidosData-e328d4f3.js";import"./_commonjsHelpers-de833af9.js";import"./i18next-a4b2730f.js";import"./lodash-4d0be66a.js";import"./index-1905cc86.js";import"./index-d0400ba7.js";import"./use-uncontrolled-f56237fb.js";import"./Select-9e537f23.js";import"./use-resolved-styles-api-f52582d3.js";import"./OptionsDropdown-dbce1b20.js";import"./CheckIcon-0b04162a.js";import"./Combobox-3ca2b536.js";import"./Popover-d999a8ff.js";import"./OptionalPortal-355abca9.js";import"./index-a38d0dca.js";import"./use-isomorphic-effect-aa890e3d.js";import"./use-merged-ref-a374cf59.js";import"./DirectionProvider-1e219af7.js";import"./use-floating-auto-update-dfbac4fe.js";import"./use-did-update-bccd292e.js";import"./FocusTrap-c6f4da6f.js";import"./Transition-ec8db713.js";import"./use-reduced-motion-73d958ef.js";import"./use-media-query-91643880.js";import"./create-safe-context-941c9e18.js";import"./noop-1bad6ac0.js";import"./use-id-f896cdc5.js";import"./Input-d93c779c.js";import"./create-optional-context-86e78b6c.js";import"./UnstyledButton-b0502f12.js";import"./InputBase-c248c15b.js";import"./use-input-props-713190c3.js";import"./get-sorted-breakpoints-e9679440.js";import"./px-90b8b31c.js";import"./Paper-fe8e8b68.js";import"./Mantine.context-e727d900.js";import"./use-mantine-color-scheme-dd296b2f.js";const T=v,j=F,L=S.forwardRef(({image:t,label:r,description:i,origin:A,...w},E)=>e("div",{ref:E,...w,children:e(y,{children:R(A)})})),R=t=>{if(t!==void 0){if(t===1)return e(l,{color:"green",variant:"light",children:e(m,{size:"0.8rem",children:"FATURADO"})});if(t===2)return e(l,{color:"red",variant:"light",children:e(m,{size:"0.8rem",children:"CANCELADO"})});if(t===0)return e(l,{color:"black",variant:"light",children:e(m,{size:"0.8rem",children:"PENDENTE"})})}},U=()=>{const t=D(),{dataSource:r}=C({initialData:j,name:"dsPedidos"});return r!=null&&r.isBrowsing()&&!(r!=null&&r.isEmpty())&&r.edit(),x({dataSource:r,listener:i=>{switch(i.type){case P.fieldChanged:{t();break}}}}),o(n,{children:[e(n.Col,{span:12,children:o(s,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,maw:500,children:[e(s.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:e(c,{justify:"space-between",children:e(m,{fw:500,children:"Select Component"})})}),o(O,{style:{height:150},children:[e(h,{label:"Nome",dataSource:r,dataField:"cliente",initialOptions:T,getOptionLabel:i=>i.nome,getOptionValue:i=>i.nome,searchable:!0}),o(h,{label:"Status",dataSource:r,dataField:"status",itemComponent:L,searchable:!0,getOptionLabel:i=>i,getOptionValue:i=>i.toString(),children:[e(d,{disabled:!1,label:"Pendente",value:a.PENDENTE.toString(),origin:a.PENDENTE}),e(d,{disabled:!1,label:"Faturado",value:a.FATURADO.toString(),origin:a.FATURADO}),e(d,{disabled:!1,label:"Cancelado",value:a.CANCELADO.toString(),origin:a.CANCELADO})]})]})]})}),e(n.Col,{span:6,children:o(s,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[e(s.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:e(c,{justify:"space-between",children:e(m,{fw:500,children:"Objeto Pedido"})})}),e(u,{style:{height:500},children:e(B,{data:r==null?void 0:r.getCurrentRecord()})})]})}),e(n.Col,{span:6,children:o(s,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[e(s.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:e(c,{justify:"space-between",children:e(m,{fw:500,children:"DataSource dsPedidos"})})}),e(u,{style:{height:500},children:e(N,{data:r})})]})})]})},Ie={title:"Editores/Select",component:h},p={name:"Exemplo simples",render:()=>e(U,{})};var f,g,b;p.parameters={...p.parameters,docs:{...(f=p.parameters)==null?void 0:f.docs,source:{originalSource:`{
  name: 'Exemplo simples',
  render: () => <ArchbaseSelectExample />
}`,...(b=(g=p.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};export{p as Primary,Ie as default};
