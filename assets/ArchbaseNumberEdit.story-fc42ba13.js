import{j as r,a as o}from"./jsx-runtime-c9381026.js";import{r as f}from"./index-8b3efc3f.js";import{u as b,a as w}from"./useArchbaseDataSource-c5d317be.js";import{u as E,D as x}from"./useArchbaseDataSourceListener-92dd263c.js";import"./index-9e992aa6.js";import{A as c}from"./ArchbaseNumberEdit-a7bf73bb.js";import{G as s}from"./Grid-93307f43.js";import{C as t}from"./Card-171745c8.js";import{G as a}from"./Group-5b3c182b.js";import{T as m}from"./Text-70cb1fd9.js";import{S as A}from"./ScrollArea-96f13bef.js";import{A as g}from"./ArchbaseObjectInspector-191de42c.js";import{p as y}from"./pessoasData-6b8000da.js";import"./_commonjsHelpers-de833af9.js";import"./i18next-a4b2730f.js";import"./lodash-4d0be66a.js";import"./index-1905cc86.js";import"./index-d0400ba7.js";import"./index-a38d0dca.js";import"./use-force-update-11fe72c1.js";import"./Input-7a6e621e.js";import"./polymorphic-factory-bf652503.js";import"./Mantine.context-41afb47e.js";import"./create-optional-context-86e78b6c.js";import"./use-resolved-styles-api-07b5b463.js";import"./UnstyledButton-5ea781f1.js";import"./use-id-f896cdc5.js";import"./use-isomorphic-effect-aa890e3d.js";import"./TextInput-7248445a.js";import"./InputBase-46c7ce5b.js";import"./use-input-props-5361677b.js";import"./create-safe-context-941c9e18.js";import"./get-sorted-breakpoints-e9679440.js";import"./px-90b8b31c.js";import"./Paper-e7399838.js";import"./floating-ui.react-e0c547c4.js";import"./use-merged-ref-a374cf59.js";import"./DirectionProvider-1e219af7.js";import"./use-mantine-color-scheme-12883fe8.js";import"./noop-1bad6ac0.js";import"./use-media-query-91643880.js";import"./types-5decf4ed.js";const D=()=>{const l=b(),h=f.useRef(null),{dataSource:e}=w({initialData:j,name:"dsPessoas"});return e!=null&&e.isBrowsing()&&!(e!=null&&e.isEmpty())&&e.edit(),E({dataSource:e,listener:u=>{switch(u.type){case x.fieldChanged:{l();break}}}}),o(s,{children:[r(s.Col,{offset:1,span:4,children:o(t,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[r(t.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:r(a,{justify:"space-between",children:r(m,{fw:500,children:"Number Edit Component"})})}),r(c,{width:200,innerRef:h,label:"Altura",dataSource:e,dataField:"altura",precision:2})]})}),r(s.Col,{span:4,children:o(t,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[r(t.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:r(a,{justify:"space-between",children:r(m,{fw:500,children:"DataSource dsPessoas"})})}),r(A,{style:{height:500},children:r(g,{data:e})})]})})]})},j=[y[0]],hr={title:"Editores/Number Edit",component:c},i={name:"Exemplo simples",render:()=>r(D,{})};var p,n,d;i.parameters={...i.parameters,docs:{...(p=i.parameters)==null?void 0:p.docs,source:{originalSource:`{
  name: 'Exemplo simples',
  render: () => <ArchbaseNumberEditExample />
}`,...(d=(n=i.parameters)==null?void 0:n.docs)==null?void 0:d.source}}};export{i as Primary,hr as default};
