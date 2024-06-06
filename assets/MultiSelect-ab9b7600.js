import{j as d,a as T,F as ps}from"./jsx-runtime-c9381026.js";import{r as ve}from"./index-8b3efc3f.js";import{u as us}from"./use-resolved-styles-api-77b93510.js";import{f as $,u as R,h as W,B as te,i as Pe,q,n as hs,e as fs}from"./polymorphic-factory-f5c952a9.js";import{i as ms,g as gs,a as ys,O as vs}from"./OptionsDropdown-cb6e4105.js";import{C as N,u as Ps}from"./Combobox-176c8c50.js";import{I as be}from"./InputBase-ad8f082f.js";import{C as bs}from"./CloseButton-8aa53231.js";import{c as Se}from"./create-optional-context-86e78b6c.js";import{u as Ss}from"./Input-c2ac992d.js";import{u as ws}from"./use-merged-ref-add91123.js";import{u as Is}from"./use-id-3df0f1f4.js";import{u as ye}from"./use-uncontrolled-f56237fb.js";const[_s,le]=Se(),[Cs,Ds]=Se();var K={root:"m_7cda1cd6","root--default":"m_44da308b","root--contrast":"m_e3a01f8",label:"m_1e0e6180",remove:"m_ae386778",group:"m_1dcfd90b"};const Os={},Ns=Pe((c,{gap:o},{size:s})=>({group:{"--pg-gap":o!==void 0?q(o):q(s,"pg-gap")}})),oe=$((c,o)=>{const s=R("PillGroup",Os,c),{classNames:y,className:a,style:i,styles:p,unstyled:l,vars:_,size:u,disabled:P,...b}=s,r=le(),e=(r==null?void 0:r.size)||u||void 0,h=W({name:"PillGroup",classes:K,props:s,className:a,style:i,classNames:y,styles:p,unstyled:l,vars:_,varsResolver:Ns,stylesCtx:{size:e},rootSelector:"group"});return d(Cs,{value:{size:e,disabled:P},children:d(te,{ref:o,size:e,...h("group"),...b})})});oe.classes=K;oe.displayName="@mantine/core/PillGroup";const zs={variant:"default"},Vs=Pe((c,{radius:o},{size:s})=>({root:{"--pill-fz":q(s,"pill-fz"),"--pill-height":q(s,"pill-height"),"--pill-radius":o===void 0?void 0:hs(o)}})),G=$((c,o)=>{const s=R("Pill",zs,c),{classNames:y,className:a,style:i,styles:p,unstyled:l,vars:_,variant:u,children:P,withRemoveButton:b,onRemove:r,removeButtonProps:e,radius:h,size:f,disabled:v,mod:x,...z}=s,m=Ds(),C=le(),V=f||(m==null?void 0:m.size)||void 0,A=(C==null?void 0:C.variant)==="filled"?"contrast":u||"default",F=W({name:"Pill",classes:K,props:s,className:a,style:i,classNames:y,styles:p,unstyled:l,vars:_,varsResolver:Vs,stylesCtx:{size:V}});return T(te,{component:"span",ref:o,variant:A,size:V,...F("root",{variant:A}),mod:[{"with-remove":b&&!v,disabled:v||(m==null?void 0:m.disabled)},x],...z,children:[d("span",{...F("label"),children:P}),b&&d(bs,{variant:"transparent",radius:h,tabIndex:-1,"aria-hidden":!0,unstyled:l,...e,...F("remove",{className:e==null?void 0:e.className,style:e==null?void 0:e.style}),onMouseDown:I=>{var D;I.preventDefault(),I.stopPropagation(),(D=e==null?void 0:e.onMouseDown)==null||D.call(e,I)},onClick:I=>{var D;I.stopPropagation(),r==null||r(),(D=e==null?void 0:e.onClick)==null||D.call(e,I)}})]})});G.classes=K;G.displayName="@mantine/core/Pill";G.Group=oe;var we={field:"m_45c4369d"};const ks={type:"visible"},ae=$((c,o)=>{const s=R("PillsInputField",ks,c),{classNames:y,className:a,style:i,styles:p,unstyled:l,vars:_,type:u,disabled:P,id:b,pointer:r,mod:e,...h}=s,f=le(),v=Ss(),x=W({name:"PillsInputField",classes:we,props:s,className:a,style:i,classNames:y,styles:p,unstyled:l,rootSelector:"field"}),z=P||(f==null?void 0:f.disabled);return d(te,{component:"input",ref:ws(o,f==null?void 0:f.fieldRef),"data-type":u,disabled:z,mod:[{disabled:z,pointer:r},e],...x("field"),...h,id:(v==null?void 0:v.inputId)||b,"aria-invalid":f==null?void 0:f.hasError,"aria-describedby":v==null?void 0:v.describedBy,type:"text",onMouseDown:m=>!r&&m.stopPropagation()})});ae.classes=we;ae.displayName="@mantine/core/PillsInputField";const xs={},H=$((c,o)=>{const s=R("PillsInput",xs,c),{children:y,onMouseDown:a,onClick:i,size:p,disabled:l,__staticSelector:_,error:u,variant:P,...b}=s,r=ve.useRef();return d(_s,{value:{fieldRef:r,size:p,disabled:l,hasError:!!u,variant:P},children:d(be,{size:p,error:u,variant:P,component:"div",ref:o,onMouseDown:e=>{var h;e.preventDefault(),a==null||a(e),(h=r.current)==null||h.focus()},onClick:e=>{var h;e.preventDefault(),i==null||i(e),(h=r.current)==null||h.focus()},...b,multiline:!0,disabled:l,__staticSelector:_||"PillsInput",withAria:!1,children:y})})});H.displayName="@mantine/core/PillsInput";H.Field=ae;function Fs({data:c,value:o}){const s=o.map(a=>a.trim().toLowerCase());return c.reduce((a,i)=>(ms(i)?a.push({group:i.group,items:i.items.filter(p=>s.indexOf(p.value.toLowerCase().trim())===-1)}):s.indexOf(i.value.toLowerCase().trim())===-1&&a.push(i),a),[])}const Ms={maxValues:1/0,withCheckIcon:!0,checkIconPosition:"left",hiddenInputValuesDivider:","},Ie=$((c,o)=>{const s=R("MultiSelect",Ms,c),{classNames:y,className:a,style:i,styles:p,unstyled:l,vars:_,size:u,value:P,defaultValue:b,onChange:r,onKeyDown:e,variant:h,data:f,dropdownOpened:v,defaultDropdownOpened:x,onDropdownOpen:z,onDropdownClose:m,selectFirstOptionOnChange:C,onOptionSubmit:V,comboboxProps:A,filter:F,limit:I,withScrollArea:D,maxDropdownHeight:_e,searchValue:Ce,defaultSearchValue:De,onSearchChange:Oe,readOnly:M,disabled:O,onFocus:U,onBlur:B,onPaste:Es,radius:Ne,rightSection:ze,rightSectionWidth:Ve,rightSectionPointerEvents:ie,rightSectionProps:ke,leftSection:xe,leftSectionWidth:Fe,leftSectionPointerEvents:Me,leftSectionProps:Ee,inputContainer:Ge,inputWrapperOrder:$e,withAsterisk:Re,labelProps:Ae,descriptionProps:Le,errorProps:je,wrapperProps:Te,description:qe,label:J,error:re,maxValues:He,searchable:S,nothingFoundMessage:ne,withCheckIcon:We,checkIconPosition:Ke,hidePickedOptions:de,withErrorStyles:Ue,name:Be,form:Je,id:Qe,clearable:Xe,clearButtonProps:Ye,hiddenInputProps:Ze,placeholder:ce,hiddenInputValuesDivider:es,required:ss,mod:ts,renderOption:ls,onRemove:w,onClear:Q,scrollAreaProps:os,...pe}=s,X=Is(Qe),Y=gs(f),k=ys(Y),g=Ps({opened:v,defaultOpened:x,onDropdownOpen:z,onDropdownClose:()=>{m==null||m(),g.resetSelectedOption()}}),{styleProps:as,rest:{type:Gs,autoComplete:is,...rs}}=fs(pe),[n,E]=ye({value:P,defaultValue:b,finalValue:[],onChange:r}),[L,j]=ye({value:Ce,defaultValue:De,finalValue:"",onChange:Oe}),Z=W({name:"MultiSelect",classes:{},props:s,classNames:y,styles:p,unstyled:l}),{resolvedClassNames:ue,resolvedStyles:he}=us({props:s,styles:p,classNames:y}),ns=t=>{e==null||e(t),t.key===" "&&!S&&(t.preventDefault(),g.toggleDropdown()),t.key==="Backspace"&&L.length===0&&n.length>0&&(w==null||w(n[n.length-1]),E(n.slice(0,n.length-1)))},ds=n.map((t,se)=>{var me,ge;return d(G,{withRemoveButton:!M&&!((me=k[t])!=null&&me.disabled),onRemove:()=>{E(n.filter(cs=>t!==cs)),w==null||w(t)},unstyled:l,disabled:O,...Z("pill"),children:((ge=k[t])==null?void 0:ge.label)||t},`${t}-${se}`)});ve.useEffect(()=>{C&&g.selectFirstOption()},[C,n]);const ee=Xe&&n.length>0&&!O&&!M&&d(N.ClearButton,{size:u,...Ye,onClear:()=>{Q==null||Q(),E([]),j("")}}),fe=Fs({data:Y,value:n});return T(ps,{children:[T(N,{store:g,classNames:ue,styles:he,unstyled:l,size:u,readOnly:M,__staticSelector:"MultiSelect",onOptionSubmit:t=>{V==null||V(t),j(""),g.updateSelectedOptionIndex("selected"),n.includes(k[t].value)?(E(n.filter(se=>se!==k[t].value)),w==null||w(k[t].value)):n.length<He&&E([...n,k[t].value])},...A,children:[d(N.DropdownTarget,{children:d(H,{...as,__staticSelector:"MultiSelect",classNames:ue,styles:he,unstyled:l,size:u,className:a,style:i,variant:h,disabled:O,radius:Ne,rightSection:ze||ee||d(N.Chevron,{size:u,error:re,unstyled:l}),rightSectionPointerEvents:ie||(ee?"all":"none"),rightSectionWidth:Ve,rightSectionProps:ke,leftSection:xe,leftSectionWidth:Fe,leftSectionPointerEvents:Me,leftSectionProps:Ee,inputContainer:Ge,inputWrapperOrder:$e,withAsterisk:Re,labelProps:Ae,descriptionProps:Le,errorProps:je,wrapperProps:Te,description:qe,label:J,error:re,multiline:!0,withErrorStyles:Ue,__stylesApiProps:{...s,rightSectionPointerEvents:ie||(ee?"all":"none"),multiline:!0},pointer:!S,onClick:()=>S?g.openDropdown():g.toggleDropdown(),"data-expanded":g.dropdownOpened||void 0,id:X,required:ss,mod:ts,children:T(G.Group,{disabled:O,unstyled:l,...Z("pillsList"),children:[ds,d(N.EventsTarget,{autoComplete:is,children:d(H.Field,{...rs,ref:o,id:X,placeholder:ce,type:!S&&!ce?"hidden":"visible",...Z("inputField"),unstyled:l,onFocus:t=>{U==null||U(t),S&&g.openDropdown()},onBlur:t=>{B==null||B(t),g.closeDropdown(),j("")},onKeyDown:ns,value:L,onChange:t=>{j(t.currentTarget.value),S&&g.openDropdown(),C&&g.selectFirstOption()},disabled:O,readOnly:M||!S,pointer:!S})})]})})}),d(vs,{data:de?fe:Y,hidden:M||O,filter:F,search:L,limit:I,hiddenWhenEmpty:!S||!ne||de&&fe.length===0&&L.trim().length===0,withScrollArea:D,maxDropdownHeight:_e,filterOptions:S,value:n,checkIconPosition:Ke,withCheckIcon:We,nothingFoundMessage:ne,unstyled:l,labelId:J?`${X}-label`:void 0,"aria-label":J?void 0:pe["aria-label"],renderOption:ls,scrollAreaProps:os})]}),d(N.HiddenInput,{name:Be,valuesDivider:es,value:n,form:Je,disabled:O,...Ze})]})});Ie.classes={...be.classes,...N.classes};Ie.displayName="@mantine/core/MultiSelect";export{Ie as M};
