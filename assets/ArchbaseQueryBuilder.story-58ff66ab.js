import{j as r,a as s}from"./jsx-runtime-c9381026.js";import{A as y,u as N}from"./useArchbaseLocalFilterDataSource-2e46d90b.js";import{u as C}from"./useArchbaseRemoteServiceApi-a894bff1.js";import{A as w}from"./DemoIOCTypes-d657846a.js";import{u as Q,a as B}from"./useArchbaseDataSource-c5d317be.js";import{u as I,g as O,Q as R,a as t,O as a,b as p,c}from"./useArchbaseRemoteDataSource-44c2e75b.js";import{u as d,D as _}from"./useArchbaseDataSourceListener-92dd263c.js";import{t as G}from"./i18next-a4b2730f.js";import{r as u}from"./index-8b3efc3f.js";import{M}from"./ArchbaseMaskEdit-663eced9.js";import{G as F}from"./Grid-a32d8833.js";import{C as b}from"./Card-a798b247.js";import{G as j}from"./Group-4c03121b.js";import{T as L}from"./Text-f3cc4e22.js";import{S as V}from"./ScrollArea-0e2adf81.js";import{p as U}from"./pessoasData-6b8000da.js";import{A as z}from"./ArchbaseNotifications-d2943952.js";import"./lodash-4d0be66a.js";import"./_commonjsHelpers-de833af9.js";import"./index-2e8af730.js";import"./index-9e992aa6.js";import"./useArchbaseTheme-cf3712dc.js";import"./polymorphic-factory-f5c952a9.js";import"./Mantine.context-1df84d45.js";import"./use-mantine-color-scheme-bbd48c20.js";import"./use-media-query-78751440.js";import"./ArchbaseList-f4f604c4.js";import"./Image-05ba150a.js";import"./Space-ac2987ad.js";import"./Paper-4536b30f.js";import"./Tooltip-7fe9133b.js";import"./OptionalPortal-a9cf30f8.js";import"./index-a38d0dca.js";import"./use-isomorphic-effect-aa890e3d.js";import"./use-merged-ref-add91123.js";import"./DirectionProvider-1e219af7.js";import"./use-floating-auto-update-2dcf8019.js";import"./use-did-update-bccd292e.js";import"./Transition-31651d20.js";import"./use-reduced-motion-98306cff.js";import"./get-style-object-71cabcb5.js";import"./use-id-3df0f1f4.js";import"./ActionIcon-2f3f1ee4.js";import"./Loader-7e5b6750.js";import"./UnstyledButton-5ed8db2e.js";import"./createReactComponent-60e598cf.js";import"./index-9d475cdf.js";import"./Checkbox-8a990f01.js";import"./get-contrast-color-e9a54280.js";import"./get-auto-contrast-value-58024fc4.js";import"./InputsGroupFieldset-b3d7f334.js";import"./Input-c2ac992d.js";import"./create-optional-context-86e78b6c.js";import"./use-uncontrolled-f56237fb.js";import"./CheckIcon-162ce127.js";import"./Switch-34d0ab97.js";import"./Button-115efac8.js";import"./IconTrash-6b16e91d.js";import"./DatePickerInput-fd681156.js";import"./dayjs.min-5b59225a.js";import"./pick-calendar-levels-props-7cce1fb9.js";import"./DatesProvider-b737956c.js";import"./AccordionChevron-b8598f0d.js";import"./use-resolved-styles-api-77b93510.js";import"./clamp-73f6bef2.js";import"./use-input-props-317debde.js";import"./CloseButton-8aa53231.js";import"./Modal-cfd23b86.js";import"./create-safe-context-941c9e18.js";import"./FocusTrap-dfcee1ca.js";import"./use-window-event-860a85e7.js";import"./Popover-772b0d3b.js";import"./ArchbaseDateTimePickerRange-4abbe061.js";import"./input-30511812.js";import"./Flex-76a1954b.js";import"./IconCalendar-cbd6718a.js";import"./TimeInput-129916e9.js";import"./InputBase-ad8f082f.js";import"./ArchbaseSwitch-cb95820c.js";import"./use-force-update-11fe72c1.js";import"./ArchbaseSelect-cc2bf7bd.js";import"./ArchbaseAsyncSelect.context-0429ae81.js";import"./Select-b5581873.js";import"./OptionsDropdown-cb6e4105.js";import"./Combobox-176c8c50.js";import"./ArchbaseSelectItem-d056b8eb.js";import"./IconSearch-4ec0977e.js";import"./string-utils-046f5c60.js";import"./index-1905cc86.js";import"./index-d0400ba7.js";import"./index-07970463.js";import"./index-bd3702cd.js";import"./ArchbaseAppContext-075ae888.js";import"./use-local-storage-ec4454b3.js";import"./IconBug-b91acd15.js";import"./TextInput-5c99df01.js";import"./Accordion-588be340.js";import"./create-scoped-keydown-handler-870d0701.js";import"./ArchbaseEdit-916a7457.js";import"./IconChevronDown-98fe7a40.js";import"./MultiSelect-ab9b7600.js";import"./IconPlus-ae63da25.js";import"./Menu-b515bebb.js";import"./IconDeviceFloppy-e64fda70.js";import"./IconRefresh-112158d7.js";import"./Radio-d376b23d.js";import"./Badge-c21d08af.js";import"./v4-4a60fe23.js";import"./IconFilter-b6b2ffb4.js";import"./use-debounced-value-a36920eb.js";import"./ArchbaseGlobalFilter-77dd2da6.js";import"./index-f91c0534.js";import"./ArchbaseRemoteApiService-3376f95b.js";import"./_commonjs-dynamic-modules-302442b1.js";import"./___vite-browser-external_commonjs-proxy-698e55bb.js";import"./get-sorted-breakpoints-91e0685a.js";import"./px-90b8b31c.js";import"./types-5decf4ed.js";import"./notifications.store-79c361f9.js";import"./store-704b6bc9.js";const J=[],K=()=>{const g=Q(),k=C(w.Pessoa),{dataSource:q}=I({name:"dsPessoas",service:k,pageSize:50,loadOnStart:!0,currentPage:0,onLoadComplete:e=>{},onDestroy:e=>{},onError:(e,m)=>{z.showError(G("WARNING"),e,m)}});d({dataSource:q,listener:e=>{}});const[o,n]=u.useState({currentFilter:O(),activeFilterIndex:-1,expandedFilter:!1}),x=u.useRef(),{dataSource:A}=N({initialData:J,name:"dsFilters"}),{dataSource:i}=B({initialData:W,name:"dsPessoas"});i!=null&&i.isBrowsing()&&!(i!=null&&i.isEmpty())&&i.edit(),d({dataSource:i,listener:e=>{switch(e.type){case _.fieldChanged:{g();break}}}});const E=(e,m)=>{n({...o,currentFilter:e,activeFilterIndex:m})},T=e=>{n({...o,expandedFilter:e})},P=(e,m)=>{n({...o,currentFilter:e,activeFilterIndex:m})},D=()=>{},v=u.useMemo(()=>s(R,{children:[r(t,{name:"id",label:"ID",dataType:"number",sortable:!0,quickFilter:!0,quickFilterSort:!0}),r(t,{name:"nome",label:"Nome da pessoa",dataType:"string",sortable:!0,quickFilter:!0,operator:a,quickFilterSort:!0}),s(t,{name:"sexo",label:"Sexo",dataType:"string",sortable:!0,quickFilter:!0,quickFilterSort:!0,children:[r(p,{label:"Masculino",value:"Masculino"}),r(p,{label:"Feminino",value:"Feminino"})]}),r(t,{name:"cpf",label:"CPF",dataType:"string",sortable:!0,quickFilter:!0,mask:M.CPF}),r(t,{name:"pai",label:"Nome do pai",dataType:"string",sortable:!0,quickFilter:!0,operator:a,quickFilterSort:!0}),r(t,{name:"mae",label:"Nome do mãe",dataType:"string",sortable:!0,quickFilter:!0,operator:a,quickFilterSort:!0}),r(t,{name:"cidade",label:"Cidade",dataType:"string",sortable:!0,quickFilter:!0,operator:a,quickFilterSort:!0}),r(t,{name:"Estado",label:"Estado",dataType:"string",sortable:!0,quickFilter:!0,operator:a,quickFilterSort:!0}),r(t,{name:"email",label:"E-mail",dataType:"string",sortable:!0,quickFilter:!0,operator:a,quickFilterSort:!0}),r(t,{name:"data_nasc",label:"Data nascimento",dataType:"date",sortable:!0,quickFilter:!0,operator:c}),r(t,{name:"peso",label:"Peso KG",dataType:"number",sortable:!0,quickFilter:!0,operator:c,quickFilterSort:!0}),s(t,{name:"status",label:"Status da pessoa",dataType:"string",sortable:!0,quickFilter:!0,quickFilterSort:!0,children:[r(p,{label:"APROVADO",value:"0"}),r(p,{label:"REJEITADO",value:"1"}),r(p,{label:"PENDENTE",value:"2"})]})]}),[]);return r(F,{children:r(F.Col,{span:12,children:s(b,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[r(b.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:r(j,{justify:"space-between",children:r(L,{fw:500,children:"QueryBuilder Filter Component"})})}),r(V,{style:{height:800},children:r(y,{id:"this.props.filterName",viewName:"ViewPessoa",apiVersion:"1.00",ref:x,expandedFilter:o.expandedFilter,persistenceDelegator:A,currentFilter:o.currentFilter,activeFilterIndex:o.activeFilterIndex,onSelectedFilter:P,onFilterChanged:E,onSearchByFilter:D,onToggleExpandedFilter:T,width:"560px",height:"170px",children:v})})]})})})},W=[U[0]],pt={title:"Filtros/Query builder",component:y},l={name:"Exemplo simples",render:()=>r(K,{})};var h,S,f;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`{
  name: 'Exemplo simples',
  render: () => <ArchbaseQueryBuilderExample />
}`,...(f=(S=l.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};export{l as Primary,pt as default};
