import{j as v,a as L,F as te}from"./jsx-runtime-c9381026.js";import{d as l}from"./dayjs.min-5b59225a.js";import{r as V}from"./index-8b3efc3f.js";import{s as x,H as se,a as E,u as $,C as U,p as ae}from"./pick-calendar-levels-props-9d70454a.js";import{f as j,t as ne,u as W}from"./polymorphic-factory-9e44d24d.js";import{u as q}from"./use-resolved-styles-api-5d126602.js";import{u as re}from"./use-input-props-039f064b.js";import{C as oe}from"./CloseButton-f7e57d7a.js";import{M as le}from"./Modal-58c5a164.js";import{I as N}from"./Input-5f376bf0.js";import{P as H}from"./Popover-b66ac239.js";function ue(s=!1,t){const{onOpen:n,onClose:r}=t||{},[f,o]=V.useState(s),p=V.useCallback(()=>{o(e=>e||(n==null||n(),!0))},[n]),u=V.useCallback(()=>{o(e=>e&&(r==null||r(),!1))},[r]),i=V.useCallback(()=>{f?u():p()},[u,p,f]);return[f,{open:p,close:u,toggle:i}]}function ie({type:s,date:t,locale:n,format:r,labelSeparator:f}){const o=p=>l(p).locale(n).format(r);return s==="default"?t===null?"":o(t):s==="multiple"?t.map(o).join(", "):s==="range"&&Array.isArray(t)?t[0]&&t[1]?`${o(t[0])} ${f} ${o(t[1])}`:t[0]?`${o(t[0])} ${f} `:"":""}function ce({formatter:s,...t}){return(s||ie)(t)}function de({minDate:s,maxDate:t,timezone:n}){const r=x("add",new Date,n);return!s&&!t?r:s&&l(r).isBefore(s)?s:t&&l(r).isAfter(t)?t:r}var G={input:"m_6fa5e2aa"};const fe={},F=j((s,t)=>{const{inputProps:n,wrapperProps:r,placeholder:f,classNames:o,styles:p,unstyled:u,popoverProps:i,modalProps:e,dropdownType:c,children:g,formattedValue:h,dropdownHandlers:d,dropdownOpened:D,onClick:_,clearable:b,onClear:k,clearButtonProps:y,rightSection:C,shouldClear:T,readOnly:I,disabled:a,value:m,name:S,form:z,type:A,...B}=re("PickerInputBase",fe,s),P=C||(b&&T&&!I&&!a?v(oe,{variant:"transparent",onClick:k,unstyled:u,size:n.size||"sm",...y}):null),w=()=>{A==="range"&&Array.isArray(m)&&m[0]&&!m[1]&&k(),d.close()};return L(te,{children:[c==="modal"&&!I&&v(le,{opened:D,onClose:w,withCloseButton:!1,size:"auto","data-dates-modal":!0,unstyled:u,...e,children:g}),v(N.Wrapper,{...r,children:L(H,{position:"bottom-start",opened:D,trapFocus:!0,returnFocus:!0,unstyled:u,...i,disabled:(i==null?void 0:i.disabled)||c==="modal"||I,onClose:()=>{var R;(R=i==null?void 0:i.onClose)==null||R.call(i),w()},children:[v(H.Target,{children:v(N,{"data-dates-input":!0,"data-read-only":I||void 0,disabled:a,component:"button",type:"button",multiline:!0,onClick:R=>{_==null||_(R),d.toggle()},rightSection:P,...n,ref:t,classNames:{...o,input:ne(G.input,o==null?void 0:o.input)},...B,children:h||v(N.Placeholder,{error:n.error,unstyled:u,className:o==null?void 0:o.placeholder,style:p==null?void 0:p.placeholder,children:f})})}),v(H.Dropdown,{"data-dates-dropdown":!0,children:g})]})}),v(se,{value:m,name:S,form:z,type:A})]})});F.classes=G;F.displayName="@mantine/dates/PickerInputBase";function Y(s,t){const n=[...t].sort((r,f)=>r.getTime()-f.getTime());return l(n[0]).startOf("day").subtract(1,"ms").isBefore(s)&&l(n[1]).endOf("day").add(1,"ms").isAfter(s)}function me({type:s,level:t,value:n,defaultValue:r,onChange:f,allowSingleDateInRange:o,allowDeselect:p,onMouseLeave:u,applyTimezone:i=!0}){const[e,c]=E({type:s,value:n,defaultValue:r,onChange:f,applyTimezone:i}),[g,h]=V.useState(s==="range"&&e[0]&&!e[1]?e[0]:null),[d,D]=V.useState(null),_=a=>{if(s==="range"){if(g instanceof Date&&!e[1]){if(l(a).isSame(g,t)&&!o){h(null),D(null),c([null,null]);return}const m=[a,g];m.sort((S,z)=>S.getTime()-z.getTime()),c(m),D(null),h(null);return}if(e[0]&&!e[1]&&l(a).isSame(e[0],t)&&!o){h(null),D(null),c([null,null]);return}c([a,null]),D(null),h(a);return}if(s==="multiple"){e.some(m=>l(m).isSame(a,t))?c(e.filter(m=>!l(m).isSame(a,t))):c([...e,a]);return}e&&p&&l(a).isSame(e,t)?c(null):c(a)},b=a=>g instanceof Date&&d instanceof Date?Y(a,[d,g]):e[0]instanceof Date&&e[1]instanceof Date?Y(a,e):!1,k=s==="range"?a=>{u==null||u(a),D(null)}:u,y=a=>e[0]instanceof Date&&l(a).isSame(e[0],t)?!(d&&l(d).isBefore(e[0])):!1,C=a=>e[1]instanceof Date?l(a).isSame(e[1],t):!(e[0]instanceof Date)||!d?!1:l(d).isBefore(e[0])&&l(a).isSame(e[0],t),T=a=>{if(s==="range")return{selected:e.some(S=>S&&l(S).isSame(a,t)),inRange:b(a),firstInRange:y(a),lastInRange:C(a),"data-autofocus":!!e[0]&&l(e[0]).isSame(a,t)||void 0};if(s==="multiple")return{selected:e.some(S=>S&&l(S).isSame(a,t)),"data-autofocus":!!e[0]&&l(e[0]).isSame(a,t)||void 0};const m=l(e).isSame(a,t);return{selected:m,"data-autofocus":m||void 0}},I=s==="range"&&g?D:()=>{};return V.useEffect(()=>{s==="range"&&!e[0]&&!e[1]&&h(null)},[n]),{onDateChange:_,onRootMouseLeave:k,onHoveredDateChange:I,getControlProps:T,_value:e,setValue:c}}const pe={type:"default",defaultLevel:"month",numberOfColumns:1},O=j((s,t)=>{const n=W("DatePicker",pe,s),{classNames:r,styles:f,vars:o,type:p,defaultValue:u,value:i,onChange:e,__staticSelector:c,getDayProps:g,allowSingleDateInRange:h,allowDeselect:d,onMouseLeave:D,numberOfColumns:_,hideOutsideDates:b,__onDayMouseEnter:k,__onDayClick:y,__timezoneApplied:C,...T}=n,{onDateChange:I,onRootMouseLeave:a,onHoveredDateChange:m,getControlProps:S}=me({type:p,level:"day",allowDeselect:d,allowSingleDateInRange:h,value:i,defaultValue:u,onChange:e,onMouseLeave:D,applyTimezone:!C}),{resolvedClassNames:z,resolvedStyles:A}=q({classNames:r,styles:f,props:n}),B=$();return v(U,{ref:t,minLevel:"month",classNames:z,styles:A,__staticSelector:c||"DatePicker",onMouseLeave:a,numberOfColumns:_,hideOutsideDates:b??_!==1,__onDayMouseEnter:(P,w)=>{m(w),k==null||k(P,w)},__onDayClick:(P,w)=>{I(w),y==null||y(P,w)},getDayProps:P=>({...S(P),...g==null?void 0:g(P)}),...T,date:x("add",T.date,B.getTimezone(),C),__timezoneApplied:!0})});O.classes=U.classes;O.displayName="@mantine/dates/DatePicker";function ge({type:s,value:t,defaultValue:n,onChange:r,locale:f,format:o,closeOnChange:p,sortDates:u,labelSeparator:i,valueFormatter:e}){const c=$(),[g,h]=ue(!1),[d,D]=E({type:s,value:t,defaultValue:n,onChange:r}),_=ce({type:s,date:d,locale:c.getLocale(f),format:o,labelSeparator:c.getLabelSeparator(i),formatter:e}),b=C=>{p&&(s==="default"&&h.close(),s==="range"&&C[0]&&C[1]&&h.close()),D(u&&s==="multiple"?[...C].sort((T,I)=>T.getTime()-I.getTime()):C)},k=()=>b(s==="range"?[null,null]:s==="multiple"?[]:null),y=s==="range"?!!d[0]:s==="multiple"?d.length>0:d!==null;return{_value:d,setValue:b,onClear:k,shouldClear:y,formattedValue:_,dropdownOpened:g,dropdownHandlers:h}}const De={type:"default",valueFormat:"MMMM D, YYYY",closeOnChange:!0,sortDates:!0,dropdownType:"popover"},J=j((s,t)=>{const n=W("DatePickerInput",De,s),{type:r,value:f,defaultValue:o,onChange:p,valueFormat:u,labelSeparator:i,locale:e,classNames:c,styles:g,unstyled:h,closeOnChange:d,size:D,variant:_,dropdownType:b,sortDates:k,minDate:y,maxDate:C,vars:T,defaultDate:I,valueFormatter:a,...m}=n,{resolvedClassNames:S,resolvedStyles:z}=q({classNames:c,styles:g,props:n}),{calendarProps:A,others:B}=ae(m),{_value:P,setValue:w,formattedValue:R,dropdownHandlers:K,dropdownOpened:Q,onClear:X,shouldClear:Z}=ge({type:r,value:f,defaultValue:o,onChange:p,locale:e,format:u,labelSeparator:i,closeOnChange:d,sortDates:k,valueFormatter:a}),ee=Array.isArray(P)?P[0]||I:P||I,M=$();return v(F,{formattedValue:R,dropdownOpened:Q,dropdownHandlers:K,classNames:S,styles:z,unstyled:h,ref:t,onClear:X,shouldClear:Z,value:P,size:D,variant:_,dropdownType:b,...B,type:r,__staticSelector:"DatePickerInput",children:v(O,{...A,size:D,variant:_,type:r,value:P,defaultDate:ee||de({maxDate:C,minDate:y,timezone:M.getTimezone()}),onChange:w,locale:e,classNames:S,styles:z,unstyled:h,__staticSelector:"DatePickerInput",__stopPropagation:b==="popover",minDate:y,maxDate:C,date:x("add",A.date,M.getTimezone()),__timezoneApplied:!0})})});J.classes={...F.classes,...O.classes};J.displayName="@mantine/dates/DatePickerInput";export{J as D};
