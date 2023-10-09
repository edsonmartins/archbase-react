import{j as e,a as f}from"./jsx-runtime-2ca98591.js";import{r as m}from"./index-402471b7.js";import{u as ae,a as te}from"./ArchbaseAdvancedTabs-2e888216.js";import{J as re,L as le,N as ie,C as oe,u as ne,U as se,D as de}from"./ArchbaseGlobalFilter-42984565.js";import{B as ue,f as c,c as ce,e as me,I as pe,F as he}from"./ArchbaseRemoteApiService-1c9bc946.js";import{u as be}from"./useArchbaseDataSource-f028c0b5.js";import{u as Fe}from"./useArchbaseRemoteDataSource-cba0ee36.js";import{u as fe}from"./ArchbaseLocalFilterDataSource-ea7a24a1.js";import{u as R}from"./useArchbaseDataSourceListener-d2a23bbf.js";import{u as ye}from"./useArchbaseRemoteServiceApi-57e72670.js";import{I as Se}from"./useArchbasePassiveLayoutEffect-8e758e5c.js";import{b as C,p as ge,A as Te}from"./DemoContainerIOC-7bde7866.js";import{A as ve}from"./ArchbaseNotifications-0d31dbcc.js";import{A as Ee,T as Ae,C as xe,a as F,b as Pe}from"./ArchbaseDataTable-a9c89bc9.js";import{B as Ve}from"./Box-603b1b1a.js";/* empty css                 */import{P as Ce}from"./Paper-165ce658.js";import{B as g}from"./Button-86c3033b.js";import{I as Ie}from"./IconEye-4ebefa30.js";import{G as k}from"./Grid-10ef5cfd.js";import"./_commonjsHelpers-de833af9.js";import"./index-29301433.js";import"./index-9d475cdf.js";import"./ArchbaseFloatingWindow-5a72a221.js";import"./use-isomorphic-effect-d441b347.js";import"./createReactComponent-b82b540a.js";import"./MantineProvider-c53063b6.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-20a9f65a.js";import"./Text-6036efe5.js";import"./use-window-event-f88e3fb7.js";import"./Group-d6868f5c.js";import"./extends-98964cd2.js";import"./_commonjs-dynamic-modules-302442b1.js";import"./___vite-browser-external_commonjs-proxy-19bb288c.js";import"./iframe-66d999fa.js";import"../sb-preview/runtime.js";import"./IconX-0ece3890.js";import"./Progress-bb0e23c5.js";import"./Stack-2cdcdf01.js";import"./IconPrinter-a2be47d1.js";import"./index-050f656b.js";function Ne(){const[a,n]=m.useState(null),[l,r]=m.useState({width:0,height:0}),p=m.useCallback(()=>{r({width:(a==null?void 0:a.offsetWidth)||0,height:(a==null?void 0:a.offsetHeight)||0})},[a==null?void 0:a.offsetHeight,a==null?void 0:a.offsetWidth]);return ae("resize",p),te(()=>{p()},[a==null?void 0:a.offsetHeight,a==null?void 0:a.offsetWidth]),[n,l]}function I({currentValue:a,values:n}){const l=n.findIndex(r=>r.value.toString()===a);return l!==-1?e(Ve,{children:e(ue,{color:n[l].color,children:c(n[l].label)})}):null}try{I.displayName="ArchbaseItemRender",I.__docgenInfo={description:"",displayName:"ArchbaseItemRender",props:{currentValue:{defaultValue:null,description:"",name:"currentValue",required:!0,type:{name:"string"}},values:{defaultValue:null,description:"",name:"values",required:!0,type:{name:"ArchbaseItemRenderType[]"}}}}}catch{}function v({title:a,printTitle:n,dataSource:l,filterOptions:r,pageSize:p,columns:E,filterFields:A,logoPrint:x,userActions:t,userRowActions:i,innerRef:P,isLoading:o=!1,isError:S=!1,enableTopToolbar:U=!0,error:N="",clearError:D=()=>{},filterType:q="normal",width:we="100%",height:Re="100%",onSearchByFilter:M=()=>{},withBorder:w=!0,filterPersistenceDelegator:W,variant:s}){const d=ce(),j=m.useRef();re();const[H,{width:K,height:J}]=Ne(),[h,V]=m.useState({activeFilterIndex:-1,expandedFilter:!1}),Y=({row:u})=>{if(!i&&!i.actions)return;const b=i.actions;return e(b,{onEditRow:i.onEditRow,onRemoveRow:i.onRemoveRow,onViewRow:i.onViewRow,row:u,variant:s??d.variant})},$=(u,b)=>{V({...h,currentFilter:u,activeFilterIndex:b})},X=u=>{V({...h,expandedFilter:u})},Z=(u,b)=>{V({...h,currentFilter:u,activeFilterIndex:b})},ee=()=>e(oe,{id:r==null?void 0:r.componentName,viewName:r==null?void 0:r.viewName,apiVersion:r==null?void 0:r.apiVersion,ref:j,variant:s??d.variant,expandedFilter:h.expandedFilter,persistenceDelegator:W,currentFilter:h.currentFilter,activeFilterIndex:h.activeFilterIndex,onSelectedFilter:Z,onFilterChanged:$,onSearchByFilter:M,onToggleExpandedFilter:X,width:"560px",height:"170px",children:A});return f(Ce,{withBorder:w,ref:P||H,style:{overflow:"none",height:"100%"},children:[S?e(me,{autoClose:2e4,withCloseButton:!0,withBorder:!0,icon:e(pe,{size:"1.4rem"}),title:c("archbase:WARNING"),titleColor:"rgb(250, 82, 82)",variant:s??d.variant,onClose:()=>D&&D(),children:e("span",{children:N})}):null,f(Ee,{printTitle:n||a,logoPrint:x,width:K,height:J,withBorder:w,dataSource:l,withColumnBorders:!0,variant:s??d.variant,striped:!0,isLoading:o,enableTopToolbar:U,pageSize:p,isError:S,enableGlobalFilter:q==="normal",renderToolbarInternalActions:q==="advanced"?ee:void 0,renderRowActions:Y,error:e("span",{children:N}),children:[E,t!=null&&t.visible?e(Ae,{children:f(m.Fragment,{children:[e("h3",{className:"only-print",children:n||a}),e("div",{className:"no-print",children:f(he,{gap:"8px",rowGap:"8px",children:[t.onAddExecute?e(g,{color:"green",variant:s??d.variant,leftIcon:e(le,{}),onClick:()=>t&&t.onAddExecute&&t.onAddExecute(),children:c("archbase:New")}):null,t.onEditExecute?e(g,{color:"blue",leftIcon:e(ie,{}),disabled:!l.isBrowsing()||l.isEmpty(),variant:s??d.variant,onClick:()=>t&&t.onEditExecute&&t.onEditExecute(),children:c("archbase:Edit")}):null,t.onRemoveExecute?e(g,{color:"red",leftIcon:e(Se,{}),disabled:!(t!=null&&t.allowRemove)||!l.isBrowsing()||l.isEmpty(),variant:s??d.variant,onClick:()=>t&&t.onRemoveExecute&&t.onRemoveExecute(),children:c("archbase:Remove")}):null,t.onViewExecute?e(g,{color:"silver",leftIcon:e(Ie,{}),disabled:!l.isBrowsing()||l.isEmpty(),variant:s??d.variant,onClick:()=>t&&t.onViewExecute&&t.onViewExecute(),children:c("archbase:View")}):null]})})]})}):null]})]})}try{v.displayName="ArchbaseTableTemplate",v.__docgenInfo={description:"",displayName:"ArchbaseTableTemplate",props:{title:{defaultValue:null,description:"",name:"title",required:!0,type:{name:"string"}},printTitle:{defaultValue:null,description:"",name:"printTitle",required:!1,type:{name:"string"}},logoPrint:{defaultValue:null,description:"",name:"logoPrint",required:!1,type:{name:"string"}},variant:{defaultValue:null,description:"",name:"variant",required:!1,type:{name:'Variants<"white" | "default" | "filled" | "outline" | "light" | "subtle" | "gradient">'}},dataSource:{defaultValue:null,description:"",name:"dataSource",required:!0,type:{name:"ArchbaseDataSource<T, ID>"}},dataSourceEdition:{defaultValue:null,description:"",name:"dataSourceEdition",required:!1,type:{name:"ArchbaseDataSource<T, ID>"}},filterType:{defaultValue:{value:"normal"},description:"",name:"filterType",required:!1,type:{name:"enum",value:[{value:'"none"'},{value:'"normal"'},{value:'"advanced"'}]}},filterOptions:{defaultValue:null,description:"",name:"filterOptions",required:!1,type:{name:"FilterOptions"}},filterPersistenceDelegator:{defaultValue:null,description:"",name:"filterPersistenceDelegator",required:!1,type:{name:"ArchbaseQueryFilterDelegator"}},pageSize:{defaultValue:null,description:"",name:"pageSize",required:!1,type:{name:"number"}},columns:{defaultValue:null,description:"",name:"columns",required:!0,type:{name:"ReactNode"}},filterFields:{defaultValue:null,description:"",name:"filterFields",required:!1,type:{name:"ReactNode"}},userActions:{defaultValue:null,description:"",name:"userActions",required:!1,type:{name:"UserActionsOptions"}},userRowActions:{defaultValue:null,description:"",name:"userRowActions",required:!1,type:{name:"UserRowActionsOptions<T>"}},innerRef:{defaultValue:null,description:"",name:"innerRef",required:!1,type:{name:"RefObject<HTMLInputElement>"}},isLoading:{defaultValue:{value:"false"},description:"",name:"isLoading",required:!1,type:{name:"boolean"}},isError:{defaultValue:{value:"false"},description:"",name:"isError",required:!1,type:{name:"boolean"}},error:{defaultValue:{value:""},description:"",name:"error",required:!1,type:{name:"string"}},clearError:{defaultValue:{value:"() => {}"},description:"",name:"clearError",required:!1,type:{name:"() => void"}},width:{defaultValue:{value:"100%"},description:"",name:"width",required:!1,type:{name:"string | number"}},height:{defaultValue:{value:"100%"},description:"",name:"height",required:!1,type:{name:"string | number"}},onSearchByFilter:{defaultValue:{value:"() => {}"},description:"",name:"onSearchByFilter",required:!1,type:{name:"() => void"}},withBorder:{defaultValue:{value:"true"},description:"",name:"withBorder",required:!1,type:{name:"boolean"}},enableTopToolbar:{defaultValue:{value:"true"},description:"",name:"enableTopToolbar",required:!1,type:{name:"boolean"}}}}}catch{}const De=[],_=[{value:C.APROVADO,label:"Aprovado",color:"green"},{value:C.REJEITADO,label:"Rejeitado",color:"red"},{value:C.PENDENTE,label:"Pendente",color:"orange"}],y=()=>{const a=ne(),n=se("pessoaStore"),l=ye(Te.Pessoa),{dataSource:r,isLoading:p,error:E,isError:A,clearError:x}=Fe({name:"dsPessoas",service:l,pageSize:10,loadOnStart:!0,store:n,onLoadComplete:o=>{console.log(o)},onDestroy:o=>{},onError:(o,S)=>{ve.showError(c("WARNING"),o,S)}});R({dataSource:r,listener:o=>{}});const{dataSource:t}=fe({initialData:De,name:"dsFilters"}),{dataSource:i}=be({initialData:qe,name:"dsPessoas"});i!=null&&i.isBrowsing()&&!(i!=null&&i.isEmpty())&&i.edit(),R({dataSource:i,listener:o=>{switch(o.type){case de.fieldChanged:{a();break}}}});const P=m.useMemo(()=>f(xe,{children:[e(F,{dataField:"id",dataType:"uuid",header:"Id",enableClickToCopy:!0}),e(F,{dataField:"nome",dataType:"text",header:"Nome da pessoa"}),e(F,{dataField:"data_nasc",dataType:"date",header:"Data nascimento",inputFilterType:"date"}),e(F,{dataField:"creditoOK",dataType:"boolean",header:"Crédito OK?"}),e(F,{dataField:"status",dataType:"enum",inputFilterType:"select",enumValues:_,header:"Status",render:o=>e(I,{currentValue:`${o.getValue()}`,values:_})})]}),[]);return e(k,{children:e(k.Col,{span:12,children:e(v,{title:"Pessoas",dataSource:r,pageSize:10,isLoading:p,error:E,isError:A,clearError:x,filterOptions:{activeFilterIndex:0,enabledAdvancedFilter:!1,apiVersion:"1.01",componentName:"templateTableExemplo",viewName:"templateTableView"},columns:P,userRowActions:{actions:Pe},filterType:"advanced",filterPersistenceDelegator:t})})})},qe=[ge[0]],va={title:"Modelos/Table template",component:v},T={name:"Exemplo simples",render:()=>e(y,{})};var Q,B,O;y.parameters={...y.parameters,docs:{...(Q=y.parameters)==null?void 0:Q.docs,source:{originalSource:`() => {
  const forceUpdate = useArchbaseForceUpdate();
  const pessoaStore = useArchbaseStore('pessoaStore');
  const pessoaApi = useArchbaseRemoteServiceApi<FakePessoaService>(API_TYPE.Pessoa);
  /**
   * Criando dataSource remoto
   * @param dataSource Fonte de dados
   */
  const {
    dataSource: dsPessoas,
    isLoading,
    error,
    isError,
    clearError
  } = useArchbaseRemoteDataSource<Pessoa, number>({
    name: 'dsPessoas',
    service: pessoaApi,
    pageSize: 10,
    loadOnStart: true,
    store: pessoaStore,
    onLoadComplete: dataSource => {
      console.log(dataSource);
    },
    onDestroy: _dataSource => {
      //
    },
    onError: (error, origin) => {
      ArchbaseNotifications.showError(t('WARNING'), error, origin);
    }
  });
  useArchbaseDataSourceListener<Pessoa, string>({
    dataSource: dsPessoas,
    listener: (_event: DataSourceEvent<Pessoa>): void => {
      //
    }
  });

  // const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
  //   currentFilter: getDefaultEmptyFilter(),
  //   activeFilterIndex: -1,
  //   expandedFilter: false,
  // });
  const {
    dataSource: dsFilters
  } = useArchbaseLocalFilterDataSource({
    initialData: filters,
    name: 'dsFilters'
  });
  const {
    dataSource
  } = useArchbaseDataSource<Pessoa, string>({
    initialData: data,
    name: 'dsPessoas'
  });
  if (dataSource?.isBrowsing() && !dataSource?.isEmpty()) {
    dataSource.edit();
  }
  useArchbaseDataSourceListener<Pessoa, string>({
    dataSource,
    listener: (event: DataSourceEvent<Pessoa>): void => {
      switch (event.type) {
        case DataSourceEventNames.fieldChanged:
          {
            forceUpdate();
            break;
          }
        default:
      }
    }
  });

  // const handleFilterChanged = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
  //   setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
  // };

  // const handleToggleExpandedFilter = (expanded: boolean) => {
  //   setFilterState({ ...filterState, expandedFilter: expanded });
  // };

  // const handleSelectedFilter = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
  //   setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
  // };

  // const handleSearchByFilter = () => {};

  // const _queryFields: ReactNode = useMemo(() => {
  //   return (
  //     <QueryFields>
  //       <QueryField name="id" label="ID" dataType="number" sortable={true} quickFilter={true} quickFilterSort={true} />
  //       <QueryField
  //         name="nome"
  //         label="Nome da pessoa"
  //         dataType="string"
  //         sortable={true}
  //         quickFilter={true}
  //         operator={OP_CONTAINS}
  //         quickFilterSort={true}
  //       />
  //       <QueryField
  //         name="sexo"
  //         label="Sexo"
  //         dataType="string"
  //         sortable={true}
  //         quickFilter={true}
  //         quickFilterSort={true}
  //       >
  //         <QueryFieldValue label="Masculino" value="Masculino" />
  //         <QueryFieldValue label="Feminino" value="Feminino" />
  //       </QueryField>
  //       <QueryField
  //         name="cpf"
  //         label="CPF"
  //         dataType="string"
  //         sortable={true}
  //         quickFilter={true}
  //         mask={MaskPattern.CPF}
  //       />
  //       <QueryField
  //         name="pai"
  //         label="Nome do pai"
  //         dataType="string"
  //         sortable={true}
  //         quickFilter={true}
  //         operator={OP_CONTAINS}
  //         quickFilterSort={true}
  //       />
  //       <QueryField
  //         name="mae"
  //         label="Nome do mãe"
  //         dataType="string"
  //         sortable={true}
  //         quickFilter={true}
  //         operator={OP_CONTAINS}
  //         quickFilterSort={true}
  //       />
  //       <QueryField
  //         name="cidade"
  //         label="Cidade"
  //         dataType="string"
  //         sortable={true}
  //         quickFilter={true}
  //         operator={OP_CONTAINS}
  //         quickFilterSort={true}
  //       />

  //       <QueryField
  //         name="Estado"
  //         label="Estado"
  //         dataType="string"
  //         sortable={true}
  //         quickFilter={true}
  //         operator={OP_CONTAINS}
  //         quickFilterSort={true}
  //       />
  //       <QueryField
  //         name="email"
  //         label="E-mail"
  //         dataType="string"
  //         sortable={true}
  //         quickFilter={true}
  //         operator={OP_CONTAINS}
  //         quickFilterSort={true}
  //       />
  //       <QueryField
  //         name="data_nasc"
  //         label="Data nascimento"
  //         dataType="date"
  //         sortable={true}
  //         quickFilter={true}
  //         operator={OP_EQUALS}
  //       />
  //       <QueryField
  //         name="peso"
  //         label="Peso KG"
  //         dataType="number"
  //         sortable={true}
  //         quickFilter={true}
  //         operator={OP_EQUALS}
  //         quickFilterSort={true}
  //       />
  //       <QueryField
  //         name="status"
  //         label="Status da pessoa"
  //         dataType="string"
  //         sortable={true}
  //         quickFilter={true}
  //         quickFilterSort={true}
  //       >
  //         <QueryFieldValue label="APROVADO" value="0" />
  //         <QueryFieldValue label="REJEITADO" value="1" />
  //         <QueryFieldValue label="PENDENTE" value="2" />
  //       </QueryField>
  //     </QueryFields>
  //   );
  // }, []);

  const columns: ReactNode = useMemo(() => {
    return <Columns>
        <ArchbaseDataTableColumn<Pessoa> dataField="id" dataType="uuid" header="Id" enableClickToCopy={true} />
        <ArchbaseDataTableColumn<Pessoa> dataField="nome" dataType="text" header="Nome da pessoa" />
        <ArchbaseDataTableColumn<Pessoa> dataField="data_nasc" dataType="date" header="Data nascimento" inputFilterType="date" />
        <ArchbaseDataTableColumn<Pessoa> dataField="creditoOK" dataType="boolean" header="Crédito OK?" />
        <ArchbaseDataTableColumn<Pessoa> dataField="status" dataType="enum" inputFilterType="select" enumValues={StatusValues} header="Status" render={(data): ReactNode => {
        return <ArchbaseItemRender currentValue={\`\${data.getValue()}\`} values={StatusValues} />;
      }} />
      </Columns>;
  }, []);
  return <Grid>
      <Grid.Col span={12}>
        <ArchbaseTableTemplate title="Pessoas" dataSource={dsPessoas} pageSize={10} isLoading={isLoading} error={error} isError={isError} clearError={clearError} filterOptions={{
        activeFilterIndex: 0,
        enabledAdvancedFilter: false,
        apiVersion: '1.01',
        componentName: 'templateTableExemplo',
        viewName: 'templateTableView'
      }} columns={columns} userRowActions={{
        actions: ArchbaseTableRowActions<Pessoa>
      }} filterType="advanced" filterPersistenceDelegator={(dsFilters as ArchbaseQueryFilterDelegator)} />
      </Grid.Col>
    </Grid>;
}`,...(O=(B=y.parameters)==null?void 0:B.docs)==null?void 0:O.source}}};var L,z,G;T.parameters={...T.parameters,docs:{...(L=T.parameters)==null?void 0:L.docs,source:{originalSource:`{
  name: 'Exemplo simples',
  render: () => <ArchbaseTableTemplateExample />
}`,...(G=(z=T.parameters)==null?void 0:z.docs)==null?void 0:G.source}}};export{y as ArchbaseTableTemplateExample,T as Primary,va as default};
//# sourceMappingURL=ArchbaseTableTemplate.story-86cf88c2.js.map
