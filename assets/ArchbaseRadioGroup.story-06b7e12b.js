import{j as o,a as v}from"./jsx-runtime-c9381026.js";import{a as K}from"./types-5decf4ed.js";import{b as Q,d as X,c as Y,u as Z,a as $}from"./useArchbaseDataSource-c192df6e.js";import{D as n,u as ee}from"./useArchbaseDataSourceListener-a0bbc6ee.js";import"./index-9e992aa6.js";import{l as b}from"./lodash-4d0be66a.js";import{r as u,R as ae}from"./index-8b3efc3f.js";import{u as re}from"./use-force-update-11fe72c1.js";import{R as w}from"./Radio-afc58bce.js";import{p as oe}from"./pedidosData-e328d4f3.js";import{G as E}from"./Grid-9de7810d.js";import{C as m}from"./Card-149fe22d.js";import{G as S}from"./Group-a72aa4c5.js";import{T as O}from"./Text-5e6e693d.js";import{A as te}from"./ArchbaseObjectInspector-cc27ea9a.js";import"./i18next-a4b2730f.js";import"./index-1905cc86.js";import"./index-d0400ba7.js";import"./_commonjsHelpers-de833af9.js";import"./polymorphic-factory-72d50303.js";import"./Mantine.context-7e9479f9.js";import"./get-contrast-color-23a8f08b.js";import"./get-auto-contrast-value-58024fc4.js";import"./InputsGroupFieldset-281fa018.js";import"./Input-da8fd83e.js";import"./create-optional-context-86e78b6c.js";import"./use-id-3df0f1f4.js";import"./use-isomorphic-effect-aa890e3d.js";import"./use-uncontrolled-f56237fb.js";import"./create-safe-context-941c9e18.js";import"./get-sorted-breakpoints-91e0685a.js";import"./px-90b8b31c.js";import"./Paper-1531bd6d.js";import"./use-mantine-color-scheme-2346dd43.js";import"./use-media-query-78751440.js";function ie(a,e,t,l){return!a&&!e?[]:e?ae.Children.toArray(e).map(i=>({label:i.props.label,value:i.props.value.toString(),key:b.uniqueId("radio")})):Array.isArray(a)?a.map(i=>({label:t(i),value:l(i),key:b.uniqueId("radio")})):Object.keys(a).map(i=>({label:i,value:a[i].toString(),key:b.uniqueId("radio")}))}function h({dataSource:a,dataField:e,style:t,childStyle:l,size:i,label:k,description:L,error:P,onFocusExit:g=()=>{},onFocusEnter:V=()=>{},onSelectValue:q=()=>{},getOptionLabel:T=s=>s.label,getOptionValue:R=s=>s.value,convertFromString:A,value:C,defaultValue:B,initialOptions:N=[],children:z,direction:y="vertical"}){const[s,de]=u.useState(ie(N,z,T,R)),[d,G]=u.useState(C),[U,x]=u.useState(P),H=re();u.useEffect(()=>{x(void 0)},[s,d]);const p=()=>{let r=C;a&&e&&(r=a.getFieldValue(e),r||(r="")),typeof r!="string"&&(r=r.toString()),G(r)},D=u.useCallback(()=>{p()},[]),F=u.useCallback(r=>{if(a&&e){switch(r.type){case(n.dataChanged,n.recordChanged,n.afterScroll,n.afterEdit,n.afterCancel):{p(),H();break}}r.type===n.onFieldError&&r.fieldName===e&&x(r.error)}},[]);Q(()=>{p(),a&&e&&(a.addListener(F),a.addFieldChangeListener(e,D))}),X(()=>{a&&e&&(a.removeListener(F),a.removeFieldChangeListener(e,D))}),Y(()=>{p()},[]);const M=r=>{G(pe=>r);let c=r;A&&(c=A(r)),a&&!a.isBrowsing()&&e&&a.getFieldValue(e)!==c&&a.setFieldValue(e,c),q&&q(c)},W=r=>{g&&g(r)},J=r=>{V&&V(r)};return o(w.Group,{description:L,defaultValue:d?R(d):B,value:d,label:k,style:t,size:i,error:U,onChange:M,onBlur:W,onFocus:J,dir:y==="horizontal"?"row":void 0,display:y==="horizontal"?"flex":void 0,children:s.map(r=>o(w,{style:l,label:r.label,value:r.value,pr:y==="horizontal"?20:0,checked:r.value===d},r.key))})}try{h.displayName="ArchbaseRadioGroup",h.__docgenInfo={description:"",displayName:"ArchbaseRadioGroup",props:{dataSource:{defaultValue:null,description:"Fonte de dados onde será atribuido o valor do RadioGroup",name:"dataSource",required:!1,type:{name:"ArchbaseDataSource<T, ID>"}},dataField:{defaultValue:null,description:"Campo onde deverá ser atribuido o valor do RadioGroup na fonte de dados",name:"dataField",required:!1,type:{name:"string"}},style:{defaultValue:null,description:"Estilo do componente",name:"style",required:!1,type:{name:"CSSProperties"}},childStyle:{defaultValue:null,description:"Estilo do componente filho",name:"childStyle",required:!1,type:{name:"CSSProperties"}},size:{defaultValue:null,description:"Tamanho do edit",name:"size",required:!1,type:{name:"enum",value:[{value:'"xs"'},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"xl"'}]}},label:{defaultValue:null,description:"Título do RadioGroup",name:"label",required:!1,type:{name:"string"}},description:{defaultValue:null,description:"Descrição do RadioGroup",name:"description",required:!1,type:{name:"string"}},error:{defaultValue:null,description:"Último erro ocorrido no RadioGroup",name:"error",required:!1,type:{name:"string"}},onFocusExit:{defaultValue:{value:"() => {}"},description:"Evento quando o foco sai do RadioGroup",name:"onFocusExit",required:!1,type:{name:"FocusEventHandler<T>"}},onFocusEnter:{defaultValue:{value:"() => {}"},description:"Evento quando o RadioGroup recebe o foco",name:"onFocusEnter",required:!1,type:{name:"FocusEventHandler<T>"}},onSelectValue:{defaultValue:{value:"() => {}"},description:"Evento quando um valor é selecionado",name:"onSelectValue",required:!1,type:{name:"(value: any) => void"}},getOptionLabel:{defaultValue:{value:"(o: any) => o.label"},description:"Function que retorna o label de uma RadioItem",name:"getOptionLabel",required:!1,type:{name:"(option: O) => string"}},getOptionValue:{defaultValue:{value:"(o: any) => o.value"},description:"Function que retorna o valor de uma RadioItem",name:"getOptionValue",required:!1,type:{name:"(option: O) => any"}},convertFromString:{defaultValue:null,description:"Function que converte o valor selecionado do tipo padrão string para o tipo desejado",name:"convertFromString",required:!1,type:{name:"(selected: string) => any"}},initialOptions:{defaultValue:{value:"[]"},description:"Opções de seleção iniciais",name:"initialOptions",required:!1,type:{name:"object | O[]"}},children:{defaultValue:null,description:"Coleção de RadioItem[] que representam as opções do select",name:"children",required:!1,type:{name:"ReactNode | ReactNode[]"}},value:{defaultValue:null,description:"Valor de entrada controlado",name:"value",required:!1,type:{name:"any"}},defaultValue:{defaultValue:null,description:"Valor padrão de entrada não controlado",name:"defaultValue",required:!1,type:{name:"any"}},direction:{defaultValue:{value:"vertical"},description:"Direção dos itens do RadioGroup",name:"direction",required:!1,type:{name:"enum",value:[{value:'"horizontal"'},{value:'"vertical"'}]}}}}}catch{}const ne=[oe[0]],le=(a,e=!1)=>{const t=Object.keys(a).map(l=>({label:a[l],value:l}));return e?t.slice(t.length/2):t.slice(0,t.length/2)},se=le(K),ue=()=>{const a=Z(),{dataSource:e}=$({initialData:ne,name:"dsPedidos"});return e!=null&&e.isBrowsing()&&!(e!=null&&e.isEmpty())&&e.edit(),ee({dataSource:e,listener:t=>{switch(t.type){case n.fieldChanged:{a();break}}}}),v(E,{children:[o(E.Col,{offset:1,span:4,children:v(m,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[o(m.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:o(S,{justify:"space-between",children:o(O,{fw:500,children:"RadioGroup Component"})})}),o(h,{label:"Status",initialOptions:se,dataSource:e,dataField:"status",convertFromString:t=>Number(t)})]})}),o(E.Col,{span:4,children:v(m,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[o(m.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:o(S,{justify:"space-between",children:o(O,{fw:500,children:"DataSource dsPessoas"})})}),o(te,{data:e})]})})]})},Je={title:"Editores/RadioGroup",component:h},f={name:"Exemplo simples",render:()=>o(ue,{})};var I,_,j;f.parameters={...f.parameters,docs:{...(I=f.parameters)==null?void 0:I.docs,source:{originalSource:`{
  name: 'Exemplo simples',
  render: () => <ArchbaseRadioGroupExample />
}`,...(j=(_=f.parameters)==null?void 0:_.docs)==null?void 0:j.source}}};export{f as Primary,Je as default};
