import{j as t,a as i}from"./jsx-runtime-c9381026.js";import{r as g}from"./index-8b3efc3f.js";import{u as D,a as x}from"./useArchbaseDataSource-c5d317be.js";import{u as b,D as E}from"./useArchbaseDataSourceListener-92dd263c.js";import"./index-9e992aa6.js";import{A as l}from"./ArchbaseDateTimePickerRange-0272dbf0.js";import{G as m}from"./Grid-522477ba.js";import{C as p}from"./Card-58b02503.js";import{G as P}from"./Group-28f303e3.js";import{T as a}from"./Text-f1dc7ab8.js";import{B as R}from"./polymorphic-factory-36f51e7a.js";import{f as s}from"./index-7792ba32.js";import{p as w}from"./pessoasData-6b8000da.js";import"./_commonjsHelpers-de833af9.js";import"./i18next-a4b2730f.js";import"./lodash-4d0be66a.js";import"./index-1905cc86.js";import"./index-d0400ba7.js";import"./dayjs.min-5b59225a.js";import"./pick-calendar-levels-props-46525dca.js";import"./DatesProvider-b737956c.js";import"./use-uncontrolled-f56237fb.js";import"./UnstyledButton-b0502f12.js";import"./AccordionChevron-7ec5dd1a.js";import"./use-resolved-styles-api-f52582d3.js";import"./clamp-73f6bef2.js";import"./assign-time-c53cee85.js";import"./DatePicker-ebc67573.js";import"./use-input-props-713190c3.js";import"./Input-d93c779c.js";import"./create-optional-context-86e78b6c.js";import"./use-id-f896cdc5.js";import"./use-isomorphic-effect-aa890e3d.js";import"./Modal-f0a12e0c.js";import"./OptionalPortal-355abca9.js";import"./index-a38d0dca.js";import"./use-merged-ref-a374cf59.js";import"./create-safe-context-941c9e18.js";import"./FocusTrap-c6f4da6f.js";import"./use-did-update-bccd292e.js";import"./Paper-fe8e8b68.js";import"./Transition-ec8db713.js";import"./use-reduced-motion-73d958ef.js";import"./use-media-query-91643880.js";import"./use-window-event-860a85e7.js";import"./Popover-d999a8ff.js";import"./DirectionProvider-1e219af7.js";import"./use-floating-auto-update-dfbac4fe.js";import"./noop-1bad6ac0.js";import"./TimeInput-bbd2afa9.js";import"./InputBase-c248c15b.js";import"./ActionIcon-8279c05b.js";import"./Loader-29e884c2.js";import"./CheckIcon-0b04162a.js";import"./Flex-edc9651b.js";import"./IconCalendar-cbd6718a.js";import"./createReactComponent-60e598cf.js";import"./index-9d475cdf.js";import"./get-sorted-breakpoints-e9679440.js";import"./px-90b8b31c.js";import"./Mantine.context-e727d900.js";import"./index-07970463.js";import"./index-bd3702cd.js";import"./types-5decf4ed.js";const A=()=>{const h=D(),[o,f]=g.useState(),{dataSource:r}=x({initialData:T,name:"dsPessoas"});return r!=null&&r.isBrowsing()&&!(r!=null&&r.isEmpty())&&r.edit(),b({dataSource:r,listener:u=>{switch(u.type){case E.fieldChanged:{h();break}}}}),t(m,{children:t(m.Col,{span:12,children:i(p,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[t(p.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:t(P,{justify:"space-between",children:t(a,{fw:500,children:"DateTime Picker Range Component"})})}),i(R,{style:{height:500},children:[t(l,{onSelectDateRange:f,label:"Informe o período"}),t(a,{size:"1rem",children:o&&s(o[0])+" -> "+s(o[1])})]})]})})})},T=[w[0]],zr={title:"Editores/DateTimePicker Range",component:l},e={name:"Exemplo simples",render:()=>t(A,{})};var n,c,d;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  name: 'Exemplo simples',
  render: () => <ArchbaseDateTimePickerRangeExample />
}`,...(d=(c=e.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};export{e as Primary,zr as default};
