import{j as s,a as i}from"./jsx-runtime-c9381026.js";import{A as a,a as u}from"./ArchbaseMasonry-49fc20e5.js";import{G as p}from"./Grid-9de7810d.js";import{C as r}from"./Card-149fe22d.js";import{G as m}from"./Group-a72aa4c5.js";import{T as n}from"./Text-5e6e693d.js";import"./index-8b3efc3f.js";import"./_commonjsHelpers-de833af9.js";import"./polymorphic-factory-72d50303.js";import"./Mantine.context-7e9479f9.js";import"./create-safe-context-941c9e18.js";import"./get-sorted-breakpoints-91e0685a.js";import"./px-90b8b31c.js";import"./Paper-1531bd6d.js";const c=["https://picsum.photos/200/300?image=1050","https://picsum.photos/400/400?image=1039","https://picsum.photos/400/400?image=1080","https://picsum.photos/200/200?image=997","https://picsum.photos/500/400?image=287","https://picsum.photos/400/500?image=955","https://picsum.photos/200/300?image=916","https://picsum.photos/300/300?image=110","https://picsum.photos/300/300?image=206"],g=()=>i(p,{children:[s(p.Col,{span:12,children:i(r,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[s(r.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:s(m,{justify:"space-between",children:s(n,{fw:500,children:"Masonry"})})}),s(a,{columnsCount:6,gutter:"10px",children:c.map((t,o)=>s("img",{src:t,style:{width:"100%",display:"block"}},o))})]})}),s(p.Col,{span:12,children:i(r,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[s(r.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:s(m,{justify:"space-between",children:s(n,{fw:500,children:"Responsive masonry"})})}),s(u,{columnsCountBreakPoints:{350:1,750:2,900:3,1200:4},children:s(a,{columnsCount:4,gutter:"10px",children:c.map((t,o)=>s("img",{src:t,style:{width:"100%",display:"block"}},o))})})]})})]}),S={title:"Listas e tabelas/Masonry",component:a},e={name:"Exemplo simples",render:()=>s(g,{})};var h,d,l;e.parameters={...e.parameters,docs:{...(h=e.parameters)==null?void 0:h.docs,source:{originalSource:`{
  name: 'Exemplo simples',
  render: () => <ArchbaseMasonryExample />
}`,...(l=(d=e.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};export{e as Primary,S as default};
