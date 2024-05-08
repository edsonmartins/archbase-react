import{j as t,a as c}from"./jsx-runtime-c9381026.js";import{b as k,c as H,d as M,u as W,a as J}from"./useArchbaseDataSource-c192df6e.js";import{D as o,u as K}from"./useArchbaseDataSourceListener-a0bbc6ee.js";import"./index-9e992aa6.js";import{r as s}from"./index-8b3efc3f.js";import{u as Q}from"./use-force-update-11fe72c1.js";import{T as X}from"./Textarea-6b7d1005.js";import{i as Y}from"./isBase64-b94d2017.js";import{G as f}from"./Grid-9de7810d.js";import{C as l}from"./Card-149fe22d.js";import{G as q}from"./Group-a72aa4c5.js";import{T as A}from"./Text-5e6e693d.js";import{S as Z}from"./ScrollArea-9ec9a13f.js";import{A as $}from"./ArchbaseObjectInspector-cc27ea9a.js";import{p as ee}from"./pessoasData-6b8000da.js";import"./i18next-a4b2730f.js";import"./lodash-4d0be66a.js";import"./_commonjsHelpers-de833af9.js";import"./index-1905cc86.js";import"./index-d0400ba7.js";import"./extends-98964cd2.js";import"./objectWithoutPropertiesLoose-db2ce8fb.js";import"./polymorphic-factory-72d50303.js";import"./Mantine.context-7e9479f9.js";import"./InputBase-3bc61936.js";import"./Input-da8fd83e.js";import"./create-optional-context-86e78b6c.js";import"./use-id-3df0f1f4.js";import"./use-isomorphic-effect-aa890e3d.js";import"./use-input-props-e0a3aa71.js";import"./create-safe-context-941c9e18.js";import"./get-sorted-breakpoints-91e0685a.js";import"./px-90b8b31c.js";import"./Paper-1531bd6d.js";import"./use-merged-ref-add91123.js";import"./DirectionProvider-1e219af7.js";import"./use-mantine-color-scheme-2346dd43.js";import"./use-media-query-78751440.js";import"./types-5decf4ed.js";function u({dataSource:r,dataField:a,disabled:m=!1,readOnly:F=!1,style:T,placeholder:R,label:O,description:j,error:B,onFocusExit:h=()=>{},onFocusEnter:b=()=>{},onChangeValue:x=()=>{},autosize:_=!1,minRows:I,maxRows:L,required:N=!1,disabledBase64Convertion:E=!1,innerRef:P}){const[p,y]=s.useState(""),U=s.useRef(),[z,g]=s.useState(B),G=Q();s.useEffect(()=>{g(void 0)},[p]);const n=()=>{let e=p;r&&a&&(e=r.getFieldValue(a),e||(e="")),Y(e)&&!E&&(e=atob(e)),y(e)},v=s.useCallback(()=>{n()},[]),V=s.useCallback(e=>{r&&a&&((e.type===o.dataChanged||e.type===o.recordChanged||e.type===o.afterScroll||e.type===o.afterCancel||e.type===o.afterEdit)&&(n(),G()),e.type===o.onFieldError&&e.fieldName===a&&g(e.error))},[]);k(()=>{n(),r&&a&&(r.addListener(V),r.addFieldChangeListener(a,v))}),H(()=>{n()},[]);const S=e=>{e.preventDefault();const i=e.target.value;e.persist(),y(se=>i),r&&!r.isBrowsing()&&a&&r.getFieldValue(a)!==i&&r.setFieldValue(a,E?i:btoa(i)),x&&x(e,i)};return M(()=>{r&&a&&(r.removeListener(V),r.removeFieldChangeListener(a,v))}),t(X,{disabled:m,readOnly:F,style:T,value:p,ref:P||U,onChange:S,onBlur:e=>{h&&h(e)},onFocus:e=>{b&&b(e)},placeholder:R,label:O,description:j,error:z,autosize:_,minRows:I,maxRows:L,required:N})}try{u.displayName="ArchbaseTextArea",u.__docgenInfo={description:"",displayName:"ArchbaseTextArea",props:{dataSource:{defaultValue:null,description:"Fonte de dados onde será atribuido o valor do textarea",name:"dataSource",required:!1,type:{name:"ArchbaseDataSource<T, ID>"}},dataField:{defaultValue:null,description:"Campo onde deverá ser atribuido o valor do textarea na fonte de dados",name:"dataField",required:!1,type:{name:"string"}},disabled:{defaultValue:{value:"false"},description:"Indicador se o textarea está desabilitado",name:"disabled",required:!1,type:{name:"boolean"}},readOnly:{defaultValue:{value:"false"},description:"Indicador se o textarea é somente leitura. Obs: usado em conjunto com o status da fonte de dados",name:"readOnly",required:!1,type:{name:"boolean"}},required:{defaultValue:{value:"false"},description:"Indicador se o preenchimento do textarea é obrigatório",name:"required",required:!1,type:{name:"boolean"}},style:{defaultValue:null,description:"Estilo do textarea",name:"style",required:!1,type:{name:"CSSProperties"}},size:{defaultValue:null,description:"Tamanho do textarea",name:"size",required:!1,type:{name:"enum",value:[{value:'"xs"'},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"xl"'}]}},width:{defaultValue:null,description:"Largura do textarea",name:"width",required:!1,type:{name:"string | number"}},autosize:{defaultValue:{value:"false"},description:"Indicador se textarea crescerá com o conteúdo até que maxRows sejam atingidos",name:"autosize",required:!1,type:{name:"boolean"}},minRows:{defaultValue:null,description:"Número mínimo de linhas obrigatórias",name:"minRows",required:!1,type:{name:"number"}},maxRows:{defaultValue:null,description:"Número máximo de linhas aceitas",name:"maxRows",required:!1,type:{name:"number"}},disabledBase64Convertion:{defaultValue:{value:"false"},description:"Desabilita conversão do conteúdo em base64 antes de salvar na fonte de dados",name:"disabledBase64Convertion",required:!1,type:{name:"boolean"}},placeholder:{defaultValue:null,description:"Texto sugestão do textarea",name:"placeholder",required:!1,type:{name:"string"}},label:{defaultValue:null,description:"Título do textarea",name:"label",required:!1,type:{name:"string"}},description:{defaultValue:null,description:"Descrição do textarea",name:"description",required:!1,type:{name:"string"}},error:{defaultValue:null,description:"Último erro ocorrido no textarea",name:"error",required:!1,type:{name:"string"}},onFocusExit:{defaultValue:{value:"() => {}"},description:"Evento quando o foco sai do textarea",name:"onFocusExit",required:!1,type:{name:"FocusEventHandler<T>"}},onFocusEnter:{defaultValue:{value:"() => {}"},description:"Evento quando o textarea recebe o foco",name:"onFocusEnter",required:!1,type:{name:"FocusEventHandler<T>"}},onChangeValue:{defaultValue:{value:"() => {}"},description:"Evento quando o valor do textarea é alterado",name:"onChangeValue",required:!1,type:{name:"(value: any, event: any) => void"}},innerRef:{defaultValue:null,description:"Referência para o componente interno",name:"innerRef",required:!1,type:{name:"RefObject<HTMLTextAreaElement>"}}}}}catch{}const ae=()=>{const r=W(),{dataSource:a}=J({initialData:re,name:"dsPessoas"});return a!=null&&a.isBrowsing()&&!(a!=null&&a.isEmpty())&&a.edit(),K({dataSource:a,listener:m=>{switch(m.type){case o.fieldChanged:{r();break}}}}),c(f,{children:[t(f.Col,{offset:1,span:4,children:c(l,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[t(l.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:t(q,{justify:"space-between",children:t(A,{fw:500,children:"Textarea Component"})})}),t(u,{label:"Observação",dataSource:a,dataField:"observacao",autosize:!0,minRows:2,maxRows:4})]})}),t(f.Col,{span:4,children:c(l,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[t(l.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:t(q,{justify:"space-between",children:t(A,{fw:500,children:"DataSource dsPessoas"})})}),t(Z,{style:{height:500},children:t($,{data:a})})]})})]})},re=[ee[0]],Me={title:"Editores/Textarea",component:u},d={name:"Exemplo simples",render:()=>t(ae,{})};var w,C,D;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'Exemplo simples',
  render: () => <ArchbaseEditExample />
}`,...(D=(C=d.parameters)==null?void 0:C.docs)==null?void 0:D.source}}};export{d as Primary,Me as default};
