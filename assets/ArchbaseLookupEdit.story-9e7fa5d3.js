import{j as a,a as q}from"./jsx-runtime-c9381026.js";import{A as te}from"./DemoIOCTypes-d657846a.js";import{b as ne,c as le,d as se,u as ue,a as de}from"./useArchbaseDataSource-c5d317be.js";import{D as m,i as pe,u as ce}from"./useArchbaseDataSourceListener-92dd263c.js";import{u as me}from"./useArchbaseRemoteServiceApi-5974aa1a.js";import{A as fe}from"./ArchbaseEdit-01bf4f4d.js";import{r as c}from"./index-8b3efc3f.js";import{b as he,B as ye}from"./polymorphic-factory-36f51e7a.js";import{u as Ee}from"./use-mantine-color-scheme-dd296b2f.js";import{T as be}from"./TextInput-d0773f08.js";import{T as ge}from"./Tooltip-0a5a925f.js";import{A as ve}from"./ActionIcon-8279c05b.js";import{I as qe}from"./IconSearch-4ec0977e.js";import{f as V}from"./string-utils-046f5c60.js";import{G as L}from"./Grid-522477ba.js";import{C as A}from"./Card-58b02503.js";import{G as B}from"./Group-28f303e3.js";import{T as j}from"./Text-f1dc7ab8.js";import{F as Ve}from"./Flex-edc9651b.js";import{S as Ae}from"./ScrollArea-556e0f32.js";import{A as Ce}from"./ArchbaseObjectInspector-e280f051.js";import{p as we}from"./ArchbaseErrorHelper-1b9b234b.js";import{A as N}from"./ArchbaseNotifications-c9d1e374.js";import{p as xe}from"./pedidosData-e328d4f3.js";import"./i18next-a4b2730f.js";import"./lodash-4d0be66a.js";import"./_commonjsHelpers-de833af9.js";import"./index-1905cc86.js";import"./index-d0400ba7.js";import"./index-9e992aa6.js";import"./use-force-update-11fe72c1.js";import"./Mantine.context-e727d900.js";import"./noop-1bad6ac0.js";import"./use-media-query-91643880.js";import"./InputBase-c248c15b.js";import"./Input-d93c779c.js";import"./create-optional-context-86e78b6c.js";import"./use-resolved-styles-api-f52582d3.js";import"./UnstyledButton-b0502f12.js";import"./use-id-f896cdc5.js";import"./use-isomorphic-effect-aa890e3d.js";import"./use-input-props-713190c3.js";import"./OptionalPortal-355abca9.js";import"./index-a38d0dca.js";import"./use-merged-ref-a374cf59.js";import"./use-floating-auto-update-dfbac4fe.js";import"./DirectionProvider-1e219af7.js";import"./use-did-update-bccd292e.js";import"./Transition-ec8db713.js";import"./use-reduced-motion-73d958ef.js";import"./get-style-object-71cabcb5.js";import"./Loader-29e884c2.js";import"./createReactComponent-60e598cf.js";import"./index-9d475cdf.js";import"./index-07970463.js";import"./index-bd3702cd.js";import"./create-safe-context-941c9e18.js";import"./get-sorted-breakpoints-e9679440.js";import"./px-90b8b31c.js";import"./Paper-fe8e8b68.js";import"./notifications.store-2c4c9735.js";import"./store-704b6bc9.js";import"./IconBug-b91acd15.js";import"./types-5decf4ed.js";function w({dataSource:o,dataField:n,lookupField:r,iconSearch:h,disabled:x=!1,readOnly:y=!1,style:k,placeholder:s,label:D,description:I,error:f,required:M,size:W,width:Y,lookupValueDelegator:T,onLookupError:u,onLookupResult:E,validateMessage:d,tooltipIconSearch:J="Clique aqui para Localizar",validateOnExit:O=!0,onFocusExit:P=()=>{},onFocusEnter:z=()=>{},onChangeValue:S=()=>{},onActionSearchExecute:K=()=>{},innerRef:Q}){const b=he(),{colorScheme:X}=Ee(),[t,g]=c.useState(""),F=Q||c.useRef(),[Z,p]=c.useState(f);c.useEffect(()=>{p(void 0)},[t]);const v=()=>{let e=t;o&&r&&(e=o.getFieldValue(r),e||(e="")),g(e),p(void 0)},R=c.useCallback(()=>{v()},[]),_=c.useCallback(e=>{o&&n&&((e.type===m.dataChanged||e.type===m.recordChanged||e.type===m.afterScroll||e.type===m.afterCancel)&&v(),e.type===m.onFieldError&&e.fieldName===n&&p(e.error))},[]);ne(()=>{v(),o&&r&&(o.addListener(_),o.addFieldChangeListener(r,R))}),le(()=>{v()},[]),se(()=>{o&&n&&(o.removeListener(_),o.removeFieldChangeListener(n,R))});const $=e=>{p(void 0),e.preventDefault();const i=e.target.value;e.persist(),g(l=>i),S&&S(e,i)},ee=()=>{o&&n&&!o.isBrowsing()&&r?t!=o.getFieldValue(r)&&(!t||t==null?o.setFieldValue(n,null):T(t).then(i=>{(!i||i==null)&&O&&d&&u&&u(V(d,t)),E&&E(i),o.setFieldValue(n,i)}).catch(i=>{var l;o.setFieldValue(n,void 0),(l=F.current)==null||l.focus(),d&&p(V(d,t)),u&&u(i)})):t&&t!=null&&T(t).then(i=>{(!i||i==null)&&O&&d&&u&&u(V(d,t)),E&&E(i);let l=pe.getNestedProperty(i,r);l||(l=""),g(l)}).catch(i=>{var l;g(void 0),d&&p(V(d,t)),(l=F.current)==null||l.focus(),u&&u(i)})},oe=e=>{ee(),P&&P(e)},re=e=>{z&&z(e)},ae=()=>{let e=y;return o&&!y&&(e=o.isBrowsing()),e},ie=h||a(qe,{size:"1rem"});return a(be,{ref:F,disabled:x,readOnly:ae(),type:"text",value:t,required:M,onChange:$,onBlur:oe,onFocus:re,placeholder:s,description:I,label:D,error:Z,size:W,rightSection:a(ge,{withinPortal:!0,withArrow:!0,label:J,children:a(ve,{style:{backgroundColor:X==="dark"?b.colors[b.primaryColor][5]:b.colors[b.primaryColor][6]},tabIndex:-1,variant:"filled",onClick:K,children:ie})}),style:{width:Y,...k}})}try{w.displayName="ArchbaseLookupEdit",w.__docgenInfo={description:"",displayName:"ArchbaseLookupEdit",props:{dataSource:{defaultValue:null,description:"Fonte de dados onde será atribuido o valor do lookup edit",name:"dataSource",required:!1,type:{name:"ArchbaseDataSource<T, ID>"}},dataField:{defaultValue:null,description:"Campo onde deverá ser atribuido o valor do lookup edit na fonte de dados",name:"dataField",required:!1,type:{name:"string"}},lookupField:{defaultValue:null,description:"Campo da fonte de dados que será usado para apresentar o valor no lookup edit",name:"lookupField",required:!1,type:{name:"string"}},disabled:{defaultValue:{value:"false"},description:"Indicador se o lookup edit está desabilitado",name:"disabled",required:!1,type:{name:"boolean"}},readOnly:{defaultValue:{value:"false"},description:"Indicador se o lookup edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados",name:"readOnly",required:!1,type:{name:"boolean"}},required:{defaultValue:null,description:"Indicador se o preenchimento do lookup edit é obrigatório",name:"required",required:!1,type:{name:"boolean"}},validateOnExit:{defaultValue:{value:"true"},description:"Validar ao sair do campo se localizou o valor",name:"validateOnExit",required:!1,type:{name:"boolean"}},validateMessage:{defaultValue:null,description:"Mensagem caso falhe ao localizar o valor",name:"validateMessage",required:!1,type:{name:"string"}},style:{defaultValue:null,description:"Estilo do lookup edit",name:"style",required:!1,type:{name:"CSSProperties"}},size:{defaultValue:null,description:"Tamanho do campo",name:"size",required:!1,type:{name:"enum",value:[{value:'"xs"'},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"xl"'}]}},width:{defaultValue:null,description:"Largura do lookup edit",name:"width",required:!1,type:{name:"string | number"}},placeholder:{defaultValue:null,description:"Texto sugestão do lookup edit",name:"placeholder",required:!1,type:{name:"string"}},label:{defaultValue:null,description:"Título do lookup edit",name:"label",required:!1,type:{name:"string"}},description:{defaultValue:null,description:"Descrição do lookup edit",name:"description",required:!1,type:{name:"string"}},error:{defaultValue:null,description:"Último erro ocorrido no lookup edit",name:"error",required:!1,type:{name:"string"}},iconSearch:{defaultValue:null,description:"Icone para apresentar lado direito do lookup edit que representa a busca",name:"iconSearch",required:!1,type:{name:"ReactNode"}},tooltipIconSearch:{defaultValue:{value:"Clique aqui para Localizar"},description:"Dica para botão localizar",name:"tooltipIconSearch",required:!1,type:{name:"string"}},onActionSearchExecute:{defaultValue:{value:"() => {}"},description:"Evento ocorre quando clica no botão localizar",name:"onActionSearchExecute",required:!1,type:{name:"() => void"}},onFocusExit:{defaultValue:{value:"() => {}"},description:"Evento quando o foco sai do lookup edit",name:"onFocusExit",required:!1,type:{name:"FocusEventHandler<T>"}},onFocusEnter:{defaultValue:{value:"() => {}"},description:"Evento quando o lookup edit recebe o foco",name:"onFocusEnter",required:!1,type:{name:"FocusEventHandler<T>"}},onChangeValue:{defaultValue:{value:"() => {}"},description:"Evento quando o valor do lookup edit é alterado",name:"onChangeValue",required:!1,type:{name:"(value: any, event: any) => void"}},onLookupResult:{defaultValue:null,description:"Evento ocorre quando um valor é localizado",name:"onLookupResult",required:!1,type:{name:"(value: O) => void"}},onLookupError:{defaultValue:null,description:"Evento ocorre quando se obtém um erro ao localizar valor",name:"onLookupError",required:!1,type:{name:"(error: string) => void"}},lookupValueDelegator:{defaultValue:null,description:"Função responsável por localizar um valor",name:"lookupValueDelegator",required:!0,type:{name:"(value: any) => Promise<O>"}},innerRef:{defaultValue:null,description:"Referência para o componente interno",name:"innerRef",required:!1,type:{name:"RefObject<HTMLInputElement>"}}}}}catch{}const ke=xe,De=()=>{const o=ue(),n=me(te.Pessoa),{dataSource:r}=de({initialData:ke,name:"dsPedidos"});r!=null&&r.isBrowsing()&&!(r!=null&&r.isEmpty())&&r.edit(),ce({dataSource:r,listener:s=>{switch(s.type){case m.fieldChanged:{o();break}}}});const h=s=>new Promise(async(D,I)=>{try{const f=await n.findOne(parseInt(s));D(f)}catch(f){I(we(f))}}),x=s=>{N.showError(s,"Atenção")},y=s=>{},k=()=>{N.showError("Clicou ação localizar.","Atenção")};return q(L,{children:[a(L.Col,{offset:1,span:6,children:q(A,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[a(A.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:a(B,{justify:"space-between",children:a(j,{fw:500,children:"Lookup Edit Component"})})}),a(ye,{style:{height:100},children:q(Ve,{justify:"flex-start",align:"center",direction:"row",wrap:"nowrap",gap:"xs",children:[a(w,{label:"Código",dataSource:r,dataField:"cliente",lookupField:"cliente.id",lookupValueDelegator:h,onLookupError:x,onLookupResult:y,onActionSearchExecute:k,validateOnExit:!0,required:!0,validateMessage:"Pessoa {0} não encontrada.",width:150}),a(fe,{label:"Nome",dataSource:r,dataField:"cliente.nome",disabled:!0,width:500})]})})]})}),a(L.Col,{span:4,children:q(A,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[a(A.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:a(B,{justify:"space-between",children:a(j,{fw:500,children:"DataSource dsPedidos"})})}),a(Ae,{style:{height:500},children:a(Ce,{data:r})})]})})]})},jo={title:"Editores/Lookup Edit",component:w},C={name:"Exemplo simples",render:()=>a(De,{})};var G,U,H;C.parameters={...C.parameters,docs:{...(G=C.parameters)==null?void 0:G.docs,source:{originalSource:`{
  name: 'Exemplo simples',
  render: () => <ArchbaseLookupEditExample />
}`,...(H=(U=C.parameters)==null?void 0:U.docs)==null?void 0:H.source}}};export{C as Primary,jo as default};
