import{j as o,a as M,F as Oe}from"./jsx-runtime-c9381026.js";import{b as Te,d as Me,c as ze,u as Pe,a as Le}from"./useArchbaseDataSource-c5d317be.js";import{D as R,u as je}from"./useArchbaseDataSourceListener-92dd263c.js";import"./index-9e992aa6.js";import{r as p}from"./index-8b3efc3f.js";import{u as $e}from"./use-force-update-11fe72c1.js";import{I as ke}from"./Input-fd05546d.js";import{B as J,f as Ue,u as Ge,h as He,i as We,q as Xe,m as Ke}from"./polymorphic-factory-0a97ecf2.js";import{u as fe}from"./DirectionProvider-1e219af7.js";import{c as Qe}from"./create-safe-context-941c9e18.js";import{u as le}from"./use-id-f896cdc5.js";import{u as Je}from"./use-uncontrolled-f56237fb.js";import{u as Ye}from"./use-merged-ref-add91123.js";import{c as Ze}from"./clamp-73f6bef2.js";import{G as K}from"./Grid-978f86f2.js";import{C as O}from"./Card-e2fc5d87.js";import{G as ue}from"./Group-fc8e50aa.js";import{T as de}from"./Text-55a07f1f.js";import{S as et}from"./ScrollArea-f25d8cf3.js";import{A as tt}from"./ArchbaseObjectInspector-e280f051.js";import{p as at}from"./pessoasData-6b8000da.js";import"./i18next-a4b2730f.js";import"./lodash-4d0be66a.js";import"./_commonjsHelpers-de833af9.js";import"./index-1905cc86.js";import"./index-d0400ba7.js";import"./create-optional-context-86e78b6c.js";import"./Mantine.context-e727d900.js";import"./use-isomorphic-effect-aa890e3d.js";import"./get-sorted-breakpoints-e9679440.js";import"./px-90b8b31c.js";import"./Paper-97ef7d63.js";import"./noop-1bad6ac0.js";import"./use-mantine-color-scheme-dd296b2f.js";import"./use-media-query-91643880.js";import"./types-5decf4ed.js";const[ot,he]=Qe("Rating was not found in tree");function ye(t){const{width:e,height:n,style:m,...i}=t;return o("svg",{viewBox:"0 0 24 24",strokeLinecap:"round",strokeLinejoin:"round",fill:"none",xmlns:"http://www.w3.org/2000/svg",style:{width:e,height:n,...m},...i,children:o("path",{d:"M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"})})}ye.displayName="@mantine/core/StarIcon";function Y({type:t}){const e=he();return o(ye,{...e.getStyles("starSymbol"),"data-filled":t==="full"||void 0})}Y.displayName="@mantine/core/StarSymbol";function ge({getSymbolLabel:t,emptyIcon:e,fullIcon:n,full:m,active:i,value:d,readOnly:b,fractionValue:f,color:D,id:E,onBlur:q,onChange:C,onInputChange:x,style:B,...v}){var u;const h=he(),V=typeof n=="function"?n(d):n,l=typeof e=="function"?e(d):e,{dir:y}=fe();return M(Oe,{children:[!b&&o("input",{...h.getStyles("input"),onKeyDown:c=>c.key===" "&&C(d),id:E,type:"radio","data-active":i||void 0,"aria-label":t==null?void 0:t(d),value:d,onBlur:q,onChange:x,...v}),o(J,{component:b?"div":"label",...h.getStyles("label"),"data-read-only":b||void 0,htmlFor:E,onClick:()=>C(d),__vars:{"--rating-item-z-index":(u=f===1?void 0:i?2:0)==null?void 0:u.toString()},children:o(J,{...h.getStyles("symbolBody"),__vars:{"--rating-symbol-clip-path":f===1?void 0:y==="ltr"?`inset(0 ${i?100-f*100:100}% 0 0)`:`inset(0 0 0 ${i?100-f*100:100}% )`},children:m?V||o(Y,{type:"full"}):l||o(Y,{type:"empty"})})})]})}ge.displayName="@mantine/core/RatingItem";var be={root:"m_f8d312f2",symbolGroup:"m_61734bb7",starSymbol:"m_5662a89a",input:"m_211007ba",label:"m_21342ee4",symbolBody:"m_fae05d6a"};function Q(t,e){var i;const n=Math.round(t/e)*e,m=((i=`${e}`.split(".")[1])==null?void 0:i.length)||0;return Number(n.toFixed(m))}const rt={size:"sm",getSymbolLabel:t=>`${t}`,count:5,fractions:1,color:"yellow"},nt=We((t,{size:e,color:n})=>({root:{"--rating-size":Xe(e,"rating-size"),"--rating-color":Ke(n,t)}})),Z=Ue((t,e)=>{const n=Ge("Rating",rt,t),{classNames:m,className:i,style:d,styles:b,unstyled:f,vars:D,name:E,id:q,value:C,defaultValue:x,onChange:B,fractions:v,count:h,onMouseEnter:V,readOnly:l,onMouseMove:y,onHover:u,onMouseLeave:c,onTouchStart:S,onTouchEnd:_,size:P,variant:L,getSymbolLabel:j,color:ee,emptySymbol:a,fullSymbol:te,highlightSelectedOnly:Ee,...ve}=n,$=He({name:"Rating",classes:be,props:n,className:i,style:d,classNames:m,styles:b,unstyled:f,vars:D,varsResolver:nt}),{dir:Ve}=fe(),Re=le(E),ae=le(q),oe=p.useRef(null),[qe,k]=Je({value:C,defaultValue:x,finalValue:0,onChange:B}),[F,I]=p.useState(-1),[Ce,re]=p.useState(!0),U=Math.floor(v),G=Math.floor(h),w=1/U,ne=Q(qe,w),H=F!==-1?F:ne,ie=r=>{const{left:s,right:g,width:W}=oe.current.getBoundingClientRect(),X=W/G,N=(Ve==="rtl"?g-r:r-s)/X;return Ze(Q(N+w/2,w),w,G)},Se=r=>{V==null||V(r),!l&&re(!1)},_e=r=>{if(y==null||y(r),l)return;const s=ie(r.clientX);I(s),s!==F&&(u==null||u(s))},we=r=>{c==null||c(r),!l&&(I(-1),re(!0),F!==-1&&(u==null||u(-1)))},Ae=r=>{const{touches:s}=r;if(s.length===1){if(!l){const g=s[0];k(ie(g.clientX))}S==null||S(r)}},De=r=>{r.preventDefault(),_==null||_(r)},xe=()=>Ce&&I(-1),Fe=r=>{l||I(typeof r=="number"?r:parseFloat(r.target.value))},Ie=r=>{l||k(typeof r=="number"?r:parseFloat(r.target.value))},Ne=Array(G).fill(0).map((r,s)=>{const g=s+1,W=Array.from(new Array(s===0?U+1:U)),X=!l&&Math.ceil(F)===g;return o("div",{"data-active":X||void 0,...$("symbolGroup"),children:W.map((Be,N)=>{const se=w*(s===0?N:N+1),A=Q(g-1+se,w);return o(ge,{getSymbolLabel:j,emptyIcon:a,fullIcon:te,full:Ee?A===H:A<=H,active:A===H,checked:A===ne,readOnly:l,fractionValue:se,value:A,name:Re,onChange:Ie,onBlur:xe,onInputChange:Fe,id:`${ae}-${s}-${N}`},`${g}-${A}`)})},g)});return o(ot,{value:{getStyles:$},children:o(J,{ref:Ye(oe,e),...$("root"),onMouseMove:_e,onMouseEnter:Se,onMouseLeave:we,onTouchStart:Ae,onTouchEnd:De,variant:L,size:P,id:ae,...ve,children:Ne})})});Z.classes=be;Z.displayName="@mantine/core/Rating";function z({dataSource:t,dataField:e,readOnly:n=!1,style:m,size:i,innerRef:d,value:b,fractions:f,onFocusExit:D=()=>{},onFocusEnter:E=()=>{},onChangeValue:q=()=>{},error:C,label:x,description:B}){const[v,h]=p.useState(b),V=d||p.useRef(),[l,y]=p.useState(C),u=$e();p.useEffect(()=>{y(void 0)},[v]);const c=()=>{let a=v;t&&e&&(a=t.getFieldValue(e),a||(a=0)),h(a)},S=p.useCallback(()=>{c()},[]),_=p.useCallback(a=>{t&&e&&((a.type===R.dataChanged||a.type===R.recordChanged||a.type===R.afterScroll||a.type===R.afterCancel||a.type===R.afterEdit)&&(c(),u()),a.type===R.onFieldError&&a.fieldName===e&&y(a.error))},[]);Te(()=>{c(),t&&e&&(t.addListener(_),t.addFieldChangeListener(e,S))}),Me(()=>{t&&e&&(t.removeListener(_),t.removeFieldChangeListener(e,S))}),ze(()=>{c()},[]);const P=a=>{h(te=>a),t&&!t.isBrowsing()&&e&&t.getFieldValue(e)!==a&&t.setFieldValue(e,a),q&&q(a)},L=a=>{D&&D(a)},j=a=>{E&&E(a)},ee=()=>{let a=n;return t&&!n&&(a=t.isBrowsing()),a};return o(ke.Wrapper,{label:x,error:l,description:B,children:o(Z,{readOnly:ee(),size:i,style:m,fractions:f,value:v,ref:V,onChange:P,onBlur:L,onFocus:j})})}try{z.displayName="ArchbaseRating",z.__docgenInfo={description:"",displayName:"ArchbaseRating",props:{dataSource:{defaultValue:null,description:"Fonte de dados onde será atribuido o valor do rating",name:"dataSource",required:!1,type:{name:"ArchbaseDataSource<T, ID>"}},dataField:{defaultValue:null,description:"Campo onde deverá ser atribuido o valor do rating na fonte de dados",name:"dataField",required:!1,type:{name:"string"}},disabled:{defaultValue:null,description:"Indicador se o rating está desabilitado",name:"disabled",required:!1,type:{name:"boolean"}},readOnly:{defaultValue:{value:"false"},description:"Indicador se o rating é somente leitura. Obs: usado em conjunto com o status da fonte de dados",name:"readOnly",required:!1,type:{name:"boolean"}},required:{defaultValue:null,description:"Indicador se o preenchimento do rating é obrigatório",name:"required",required:!1,type:{name:"boolean"}},count:{defaultValue:null,description:"Quantidade de controles a ser renderizado",name:"count",required:!0,type:{name:"number"}},value:{defaultValue:null,description:"Valor inicial",name:"value",required:!1,type:{name:"number"}},emptySymbol:{defaultValue:null,description:"O ícone que é exibido quando o símbolo está vazio",name:"emptySymbol",required:!1,type:{name:"ReactNode | ((value: number) => ReactNode)"}},fullSymbol:{defaultValue:null,description:"Este ícone que é exibido quando o símbolo está cheio",name:"fullSymbol",required:!1,type:{name:"ReactNode | ((value: number) => ReactNode)"}},fractions:{defaultValue:null,description:"Número de frações em que cada item pode ser dividido, 1 por padrão",name:"fractions",required:!1,type:{name:"number"}},onHover:{defaultValue:null,description:"Chamado quando o item é pairado",name:"onHover",required:!1,type:{name:"(value: number) => void"}},getSymbolLabel:{defaultValue:null,description:"A função deve retornar labelText para os símbolos",name:"getSymbolLabel",required:!1,type:{name:"(value: number) => string"}},name:{defaultValue:null,description:"Nome da avaliação, deve ser único na página",name:"name",required:!1,type:{name:"string"}},highlightSelectedOnly:{defaultValue:null,description:"Se verdadeiro, apenas o símbolo selecionado mudará para símbolo completo",name:"highlightSelectedOnly",required:!1,type:{name:"boolean"}},style:{defaultValue:null,description:"Estilo do rating",name:"style",required:!1,type:{name:"CSSProperties"}},label:{defaultValue:null,description:"Título do rating",name:"label",required:!1,type:{name:"string"}},description:{defaultValue:null,description:"Descrição do rating",name:"description",required:!1,type:{name:"string"}},error:{defaultValue:null,description:"Último erro ocorrido no rating",name:"error",required:!1,type:{name:"string"}},size:{defaultValue:null,description:"Tamanho do rating",name:"size",required:!1,type:{name:"enum",value:[{value:'"xs"'},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"xl"'}]}},onFocusExit:{defaultValue:{value:"() => {}"},description:"Evento quando o foco sai do rating",name:"onFocusExit",required:!1,type:{name:"FocusEventHandler<T>"}},onFocusEnter:{defaultValue:{value:"() => {}"},description:"Evento quando o rating recebe o foco",name:"onFocusEnter",required:!1,type:{name:"FocusEventHandler<T>"}},onChangeValue:{defaultValue:{value:"() => {}"},description:"Evento quando o valor do rating é alterado",name:"onChangeValue",required:!1,type:{name:"(value?: number) => void"}},innerRef:{defaultValue:null,description:"Referência para o componente interno",name:"innerRef",required:!1,type:{name:"RefObject<HTMLInputElement>"}}}}}catch{}const it=()=>{const t=Pe(),{dataSource:e}=Le({initialData:st,name:"dsPessoas"});return e!=null&&e.isBrowsing()&&!(e!=null&&e.isEmpty())&&e.edit(),je({dataSource:e,listener:n=>{switch(n.type){case R.fieldChanged:{t();break}}}}),M(K,{children:[o(K.Col,{offset:1,span:4,children:M(O,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[o(O.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:o(ue,{justify:"space-between",children:o(de,{fw:500,children:"Rating Component"})})}),o(z,{label:"Avaliação",dataSource:e,dataField:"avaliacao",count:5})]})}),o(K.Col,{span:4,children:M(O,{shadow:"sm",padding:"lg",radius:"md",withBorder:!0,children:[o(O.Section,{withBorder:!0,inheritPadding:!0,py:"xs",children:o(ue,{justify:"space-between",children:o(de,{fw:500,children:"DataSource dsPessoas"})})}),o(et,{style:{height:500},children:o(tt,{data:e})})]})})]})},st=[at[0]],Ut={title:"Editores/Rating",component:z},T={name:"Exemplo simples",render:()=>o(it,{})};var ce,me,pe;T.parameters={...T.parameters,docs:{...(ce=T.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  name: 'Exemplo simples',
  render: () => <ArchbaseRatingExample />
}`,...(pe=(me=T.parameters)==null?void 0:me.docs)==null?void 0:pe.source}}};export{T as Primary,Ut as default};
