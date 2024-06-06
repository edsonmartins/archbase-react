import{j as r,a as M,F as Se}from"./jsx-runtime-c9381026.js";import{r as b}from"./index-8b3efc3f.js";import{u as ve}from"./use-resolved-styles-api-77b93510.js";import{f as we,u as ye}from"./polymorphic-factory-f5c952a9.js";import{g as Ce,a as Oe,O as De}from"./OptionsDropdown-cb6e4105.js";import{C as c,u as xe}from"./Combobox-176c8c50.js";import{I as H}from"./InputBase-ad8f082f.js";import{u as Ie}from"./use-id-3df0f1f4.js";import{u as T}from"./use-uncontrolled-f56237fb.js";const Pe={searchable:!1,withCheckIcon:!0,allowDeselect:!0,checkIconPosition:"left"},z=we((L,R)=>{const P=ye("Select",Pe,L),{classNames:U,styles:W,unstyled:u,vars:Ve,dropdownOpened:$,defaultDropdownOpened:q,onDropdownClose:g,onDropdownOpen:S,onFocus:v,onBlur:w,onClick:y,onChange:G,data:V,value:d,defaultValue:J,selectFirstOptionOnChange:C,onOptionSubmit:O,comboboxProps:K,readOnly:p,disabled:m,filter:Q,limit:X,withScrollArea:Y,maxDropdownHeight:Z,size:f,searchable:l,rightSection:ee,checkIconPosition:oe,withCheckIcon:te,nothingFoundMessage:E,name:se,form:le,searchValue:ae,defaultSearchValue:ne,onSearchChange:re,allowDeselect:ce,error:F,rightSectionPointerEvents:ie,id:ue,clearable:de,clearButtonProps:pe,hiddenInputProps:me,renderOption:fe,onClear:D,autoComplete:he,scrollAreaProps:be,...h}=P,x=b.useMemo(()=>Ce(V),[V]),i=b.useMemo(()=>Oe(x),[x]),_=Ie(ue),[t,k,ge]=T({value:d,defaultValue:J,finalValue:null,onChange:G}),a=typeof t=="string"?i[t]:void 0,[I,n]=T({value:ae,defaultValue:ne,finalValue:a?a.label:"",onChange:re}),o=xe({opened:$,defaultOpened:q,onDropdownOpen:()=>{S==null||S(),o.updateSelectedOptionIndex("active",{scrollIntoView:!0})},onDropdownClose:()=>{g==null||g(),o.resetSelectedOption()}}),{resolvedClassNames:N,resolvedStyles:B}=ve({props:P,styles:W,classNames:U});b.useEffect(()=>{C&&o.selectFirstOption()},[C,t]),b.useEffect(()=>{d===null&&n(""),typeof d=="string"&&a&&n(a.label)},[d,a]);const j=de&&!!t&&!m&&!p&&r(c.ClearButton,{size:f,...pe,onClear:()=>{k(null,null),n(""),D==null||D()}});return M(Se,{children:[M(c,{store:o,__staticSelector:"Select",classNames:N,styles:B,unstyled:u,readOnly:p,onOptionSubmit:e=>{O==null||O(e);const s=ce&&i[e].value===t?null:i[e],A=s?s.value:null;k(A,s),!ge&&n(typeof A=="string"&&(s==null?void 0:s.label)||""),o.closeDropdown()},size:f,...K,children:[r(c.Target,{targetType:l?"input":"button",autoComplete:he,children:r(H,{id:_,ref:R,rightSection:ee||j||r(c.Chevron,{size:f,error:F,unstyled:u}),rightSectionPointerEvents:ie||(j?"all":"none"),...h,size:f,__staticSelector:"Select",disabled:m,readOnly:p||!l,value:I,onChange:e=>{n(e.currentTarget.value),o.openDropdown(),C&&o.selectFirstOption()},onFocus:e=>{l&&o.openDropdown(),v==null||v(e)},onBlur:e=>{var s;l&&o.closeDropdown(),n(t!=null&&((s=i[t])==null?void 0:s.label)||""),w==null||w(e)},onClick:e=>{l?o.openDropdown():o.toggleDropdown(),y==null||y(e)},classNames:N,styles:B,unstyled:u,pointer:!l,error:F})}),r(De,{data:x,hidden:p||m,filter:Q,search:I,limit:X,hiddenWhenEmpty:!l||!E,withScrollArea:Y,maxDropdownHeight:Z,filterOptions:l&&(a==null?void 0:a.label)!==I,value:t,checkIconPosition:oe,withCheckIcon:te,nothingFoundMessage:E,unstyled:u,labelId:h.label?`${_}-label`:void 0,"aria-label":h.label?void 0:h["aria-label"],renderOption:fe,scrollAreaProps:be})]}),r(c.HiddenInput,{value:t,name:se,form:le,disabled:m,...me})]})});z.classes={...H.classes,...c.classes};z.displayName="@mantine/core/Select";export{z as S};
