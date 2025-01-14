import{j as o,a as D}from"./jsx-runtime-c9381026.js";import{b as M,c as W,d as K,u as Q,a as X}from"./useArchbaseDataSource-c5d317be.js";import{D as l,u as Y}from"./useArchbaseDataSourceListener-92dd263c.js";import"./index-9e992aa6.js";import{r as t}from"./index-8b3efc3f.js";import{f as Z,u as $,B as ee}from"./polymorphic-factory-36f51e7a.js";import{I as re}from"./InputBase-c248c15b.js";import{T as ae}from"./Textarea-b9ee5465.js";import{u as oe}from"./use-uncontrolled-f56237fb.js";import{i as ne}from"./isBase64-b94d2017.js";import{G as F}from"./Grid-522477ba.js";import{C as b}from"./Card-58b02503.js";import{G as _}from"./Group-28f303e3.js";import{T as L}from"./Text-f1dc7ab8.js";import{S as te}from"./ScrollArea-556e0f32.js";import{A as se}from"./ArchbaseObjectInspector-e280f051.js";import{p as ie}from"./pessoasData-6b8000da.js";import"./i18next-a4b2730f.js";import"./lodash-4d0be66a.js";import"./_commonjsHelpers-de833af9.js";import"./index-1905cc86.js";import"./index-d0400ba7.js";import"./Mantine.context-e727d900.js";import"./Input-d93c779c.js";import"./create-optional-context-86e78b6c.js";import"./use-resolved-styles-api-f52582d3.js";import"./UnstyledButton-b0502f12.js";import"./use-id-f896cdc5.js";import"./use-isomorphic-effect-aa890e3d.js";import"./use-input-props-713190c3.js";import"./extends-4c19d496.js";import"./objectWithoutPropertiesLoose-68193569.js";import"./create-safe-context-941c9e18.js";import"./get-sorted-breakpoints-e9679440.js";import"./px-90b8b31c.js";import"./Paper-fe8e8b68.js";import"./use-merged-ref-a374cf59.js";import"./DirectionProvider-1e219af7.js";import"./use-mantine-color-scheme-dd296b2f.js";import"./noop-1bad6ac0.js";import"./use-media-query-91643880.js";import"./types-5decf4ed.js";function N(a,r){if(typeof a=="string"&&a.trim().length===0)return!0;try{return r(a),!0}catch{return!1}}const le={serialize:JSON.stringify,deserialize:JSON.parse},T=Z((a,r)=>{const{value:s,defaultValue:c,onChange:x,formatOnBlur:q,validationError:j,serialize:C,deserialize:u,onFocus:i,onBlur:d,readOnly:m,error:w,...A}=$("JsonInput",le,a),[f,h]=oe({value:s,defaultValue:c,finalValue:"",onChange:x}),[B,p]=t.useState(N(f,u));return o(ae,{value:f,onChange:n=>h(n.currentTarget.value),onFocus:n=>{i==null||i(n),p(!0)},onBlur:n=>{typeof d=="function"&&d(n);const g=N(n.currentTarget.value,u);q&&!m&&g&&n.currentTarget.value.trim()!==""&&h(C(u(n.currentTarget.value),null,2)),p(g)},ref:r,readOnly:m,...A,autoComplete:"off",__staticSelector:"JsonInput",error:B?w:j||!0,"data-monospace":!0})});T.classes=re.classes;T.displayName="@mantine/core/JsonInput";function v({dataSource:a,dataField:r,disabled:s=!1,readOnly:c=!1,style:x,placeholder:q,label:j,description:C,error:u,onFocusExit:i=()=>{},onFocusEnter:d=()=>{},onChangeValue:m=()=>{},autosize:w=!1,minRows:A,maxRows:f,maxLength:h,required:B=!1,disabledBase64Convertion:p=!1,innerRef:J}){const[y,n]=t.useState(""),g=J||t.useRef(),[U,O]=t.useState(u);t.useEffect(()=>{O(void 0)},[y]);const E=()=>{let e=y;a&&r&&(e=a.getFieldValue(r),e||(e="")),ne(e)&&!p&&(e=atob(e)),n(e)},R=t.useCallback(()=>{E()},[]),I=t.useCallback(e=>{a&&r&&((e.type===l.dataChanged||e.type===l.recordChanged||e.type===l.afterScroll||e.type===l.afterCancel)&&E(),e.type===l.onFieldError&&e.fieldName===r&&O(e.error))},[]);M(()=>{E(),a&&r&&(a.addListener(I),a.addFieldChangeListener(r,R))}),W(()=>{E()},[]);const G=e=>{n(pe=>e),a&&!a.isBrowsing()&&r&&a.getFieldValue(r)!==e&&a.setFieldValue(r,p?e:btoa(e)),m&&m(e)};K(()=>{a&&r&&(a.removeListener(I),a.removeFieldChangeListener(r,R))});const k=e=>{i&&i(e)},H=e=>{d&&d(e)};return o(T,{disabled:s,readOnly:(()=>{let e=c;return a&&!c&&(e=a.isBrowsing()),e})(),formatOnBlur:!0,style:x,value:y,autosize:w,minRows:A,maxRows:f,maxLength:h,ref:g,required:B,onChange:G,onBlur:k,onFocus:H,placeholder:q,description:C,label:j,error:U})}try{v.displayName="ArchbaseJsonEdit",v.__docgenInfo={description:"",displayName:"ArchbaseJsonEdit",props:{dataSource:{defaultValue:null,description:"Fonte de dados onde será atribuido o valor do json input",name:"dataSource",required:!1,type:{name:"ArchbaseDataSource<T, ID>"}},dataField:{defaultValue:null,description:"Campo onde deverá ser atribuido o valor do json input na fonte de dados",name:"dataField",required:!1,type:{name:"string"}},disabled:{defaultValue:{value:"false"},description:"Indicador se o json input está desabilitado",name:"disabled",required:!1,type:{name:"boolean"}},readOnly:{defaultValue:{value:"false"},description:"Indicador se o json input é somente leitura. Obs: usado em conjunto com o status da fonte de dados",name:"readOnly",required:!1,type:{name:"boolean"}},required:{defaultValue:{value:"false"},description:"Indicador se o preenchimento do json input é obrigatório",name:"required",required:!1,type:{name:"boolean"}},style:{defaultValue:null,description:"Estilo do json input",name:"style",required:!1,type:{name:"CSSProperties"}},size:{defaultValue:null,description:"Tamanho do json input",name:"size",required:!1,type:{name:"enum",value:[{value:'"xs"'},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"xl"'}]}},width:{defaultValue:null,description:"Largura do json input",name:"width",required:!1,type:{name:"string | number"}},autosize:{defaultValue:{value:"false"},description:"Indicador se json input crescerá com o conteúdo até que maxRows sejam atingidos",name:"autosize",required:!1,type:{name:"boolean"}},minRows:{defaultValue:null,description:"Número mínimo de linhas obrigatórias",name:"minRows",required:!1,type:{name:"number"}},maxRows:{defaultValue:null,description:"Número máximo de linhas aceitas",name:"maxRows",required:!1,type:{name:"number"}},maxLength:{defaultValue:null,description:"Tamanho máximo em caracteres aceitos",name:"maxLength",required:!1,type:{name:"number"}},disabledBase64Convertion:{defaultValue:{value:"false"},description:"Desabilita conversão do conteúdo em base64 antes de salvar na fonte de dados",name:"disabledBase64Convertion",required:!1,type:{name:"boolean"}},placeholder:{defaultValue:null,description:"Texto sugestão do json input",name:"placeholder",required:!1,type:{name:"string"}},label:{defaultValue:null,description:"Título do json input",name:"label",required:!1,type:{name:"string"}},description:{defaultValue:null,description:"Descrição do json input",name:"description",required:!1,type:{name:"string"}},error:{defaultValue:null,description:"Último erro ocorrido no json input",name:"error",required:!1,type:{name:"string"}},onFocusExit:{defaultValue:{value:"() => {}"},description:"Evento quando o foco sai do json input",name:"onFocusExit",required:!1,type:{name:"FocusEventHandler<T>"}},onFocusEnter:{defaultValue:{value:"() => {}"},description:"Evento quando o json input recebe o foco",name:"onFocusEnter",required:!1,type:{name:"FocusEventHandler<T>"}},onChangeValue:{defaultValue:{value:"() => {}"},description:"Evento quando o valor do json input é alterado",name:"onChangeValue",required:!1,type:{name:"(value: any) => void"}},innerRef:{defaultValue:null,description:"Referência para o componente interno",name:"innerRef",required:!1,type:{name:"RefObject<HTMLTextAreaElement>"}}}}}catch{}const ue=()=>{const a=Q(),{dataSource:r}=X({initialData:de,name:"dsPessoas"});return r!=null&&r.isBrowsing()&&!(r!=null&&r.isEmpty())&&r.edit(),Y({dataSource:r,listener:s=>{switch(s.type){case l.fieldChanged:{a();break}}}}),D(F,{children:[o(F.Col,{offset:1,span:4,children:D(b,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[o(b.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:o(_,{justify:"space-between",children:o(L,{fw:500,children:"Json Edit Component"})})}),o(ee,{style:{height:100},children:o(v,{maxRows:100,maxLength:1e3,label:"Json",dataSource:r,dataField:"codigoJson"})})]})}),o(F.Col,{span:4,children:D(b,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[o(b.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:o(_,{justify:"space-between",children:o(L,{fw:500,children:"DataSource dsPessoas"})})}),o(te,{style:{height:500},children:o(se,{data:r})})]})})]})},de=[ie[0]],rr={title:"Editores/Json Edit",component:v},V={name:"Exemplo simples",render:()=>o(ue,{})};var z,P,S;V.parameters={...V.parameters,docs:{...(z=V.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'Exemplo simples',
  render: () => <ArchbaseJsonEditExample />
}`,...(S=(P=V.parameters)==null?void 0:P.docs)==null?void 0:S.source}}};export{V as Primary,rr as default};
