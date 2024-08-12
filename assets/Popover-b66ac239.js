import{j as P,a as xe}from"./jsx-runtime-c9381026.js";import{r as f}from"./index-8b3efc3f.js";import{O as Oe,i as De,g as Ce}from"./OptionalPortal-bfca0d0b.js";import{f as V,u as R,B as Te,r as Re,t as be,h as Ee,i as Fe,n as Se,o as ze}from"./polymorphic-factory-9e44d24d.js";import{u as Ne}from"./DirectionProvider-1e219af7.js";import{n as Ie,u as ke,l as _e,o as Ae,s as Me,p as $,f as j,i as K,b as $e,q as je,m as Ke}from"./use-floating-auto-update-3ec0cee2.js";import{c as Le}from"./create-safe-context-941c9e18.js";import{u as Ue,F as Ve}from"./FocusTrap-114f866c.js";import{T as Xe}from"./Transition-a3782892.js";import{u as X}from"./use-merged-ref-add91123.js";import{u as Ye}from"./use-uncontrolled-f56237fb.js";import{u as L}from"./use-did-update-bccd292e.js";import{u as Be}from"./use-id-3df0f1f4.js";const qe=()=>{};function He(e,r={active:!0}){return typeof e!="function"||!r.active?r.onKeyDown||qe:t=>{var n;t.key==="Escape"&&(e(t),(n=r.onTrigger)==null||n.call(r))}}const U=["mousedown","touchstart"];function Ze(e,r,t){const n=f.useRef();return f.useEffect(()=>{const l=i=>{const{target:a}=i??{};if(Array.isArray(t)){const s=(a==null?void 0:a.hasAttribute("data-ignore-outside-clicks"))||!document.body.contains(a)&&a.tagName!=="HTML";t.every(c=>!!c&&!i.composedPath().includes(c))&&!s&&e()}else n.current&&!n.current.contains(a)&&e()};return(r||U).forEach(i=>document.addEventListener(i,l)),()=>{(r||U).forEach(i=>document.removeEventListener(i,l))}},[n,e,t]),n}const[Ge,Y]=Le("Popover component was not found in the tree");var B={dropdown:"m_38a85659",arrow:"m_a31dc6c1"};const Je={},b=V((e,r)=>{var g,w,m,x;const t=R("PopoverDropdown",Je,e),{className:n,style:l,vars:i,children:a,onKeyDownCapture:s,variant:p,classNames:c,styles:u,...y}=t,o=Y(),v=Ue({opened:o.opened,shouldReturnFocus:o.returnFocus}),D=o.withRoles?{"aria-labelledby":o.getTargetId(),id:o.getDropdownId(),role:"dialog",tabIndex:-1}:{},C=X(r,o.floating);return o.disabled?null:P(Oe,{...o.portalProps,withinPortal:o.withinPortal,children:P(Xe,{mounted:o.opened,...o.transitionProps,transition:((g=o.transitionProps)==null?void 0:g.transition)||"fade",duration:((w=o.transitionProps)==null?void 0:w.duration)??150,keepMounted:o.keepMounted,exitDuration:typeof((m=o.transitionProps)==null?void 0:m.exitDuration)=="number"?o.transitionProps.exitDuration:(x=o.transitionProps)==null?void 0:x.duration,children:T=>P(Ve,{active:o.trapFocus,innerRef:C,children:xe(Te,{...D,...y,variant:p,onKeyDownCapture:He(o.onClose,{active:o.closeOnEscape,onTrigger:v,onKeyDown:s}),"data-position":o.placement,"data-fixed":o.floatingStrategy==="fixed"||void 0,...o.getStyles("dropdown",{className:n,props:t,classNames:c,styles:u,style:[{...T,zIndex:o.zIndex,top:o.y??0,left:o.x??0,width:o.width==="target"?void 0:Re(o.width)},l]}),children:[a,P(Ie,{ref:o.arrowRef,arrowX:o.arrowX,arrowY:o.arrowY,visible:o.withArrow,position:o.placement,arrowSize:o.arrowSize,arrowRadius:o.arrowRadius,arrowOffset:o.arrowOffset,arrowPosition:o.arrowPosition,...o.getStyles("arrow",{props:t,classNames:c,styles:u})})]})})})})});b.classes=B;b.displayName="@mantine/core/PopoverDropdown";const Qe={refProp:"ref",popupType:"dialog"},q=V((e,r)=>{const{children:t,refProp:n,popupType:l,...i}=R("PopoverTarget",Qe,e);if(!De(t))throw new Error("Popover.Target component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported");const a=i,s=Y(),p=X(s.reference,t.ref,r),c=s.withRoles?{"aria-haspopup":l,"aria-expanded":s.opened,"aria-controls":s.getDropdownId(),id:s.getTargetId()}:{};return f.cloneElement(t,{...a,...c,...s.targetProps,className:be(s.targetProps.className,a.className,t.props.className),[n]:p,...s.controlled?null:{onClick:s.onToggle}})});q.displayName="@mantine/core/PopoverTarget";function We(e){if(e===void 0)return{shift:!0,flip:!0};const r={...e};return e.shift===void 0&&(r.shift=!0),e.flip===void 0&&(r.flip=!0),r}function eo(e,r){const t=We(e.middlewares),n=[Ae(e.offset)];return t.shift&&n.push(Me(typeof t.shift=="boolean"?{limiter:$(),padding:5}:{limiter:$(),padding:5,...t.shift})),t.flip&&n.push(typeof t.flip=="boolean"?j():j(t.flip)),t.inline&&n.push(typeof t.inline=="boolean"?K():K(t.inline)),n.push($e({element:e.arrowRef,padding:e.arrowOffset})),(t.size||e.width==="target")&&n.push(je({...typeof t.size=="boolean"?{}:t.size,apply({rects:l,availableWidth:i,availableHeight:a,...s}){var u;const c=((u=r().refs.floating.current)==null?void 0:u.style)??{};t.size&&(typeof t.size=="object"&&t.size.apply?t.size.apply({rects:l,availableWidth:i,availableHeight:a,...s}):Object.assign(c,{maxWidth:`${i}px`,maxHeight:`${a}px`})),e.width==="target"&&Object.assign(c,{width:`${l.reference.width}px`})}})),n}function oo(e){const[r,t]=Ye({value:e.opened,defaultValue:e.defaultOpened,finalValue:!1,onChange:e.onChange}),n=()=>{var a;r&&((a=e.onClose)==null||a.call(e),t(!1))},l=()=>{var a,s;r?((a=e.onClose)==null||a.call(e),t(!1)):((s=e.onOpen)==null||s.call(e),t(!0))},i=ke({strategy:e.strategy,placement:e.position,middleware:eo(e,()=>i)});return _e({opened:e.opened,position:e.position,positionDependencies:e.positionDependencies||[],floating:i}),L(()=>{var a;(a=e.onPositionChange)==null||a.call(e,i.placement)},[i.placement]),L(()=>{var a,s;e.opened?(s=e.onOpen)==null||s.call(e):(a=e.onClose)==null||a.call(e)},[e.opened]),{floating:i,controlled:typeof e.opened=="boolean",opened:r,onClose:n,onToggle:l}}const to={position:"bottom",offset:8,positionDependencies:[],transitionProps:{transition:"fade",duration:150},middlewares:{flip:!0,shift:!0,inline:!1},arrowSize:7,arrowOffset:5,arrowRadius:0,arrowPosition:"side",closeOnClickOutside:!0,withinPortal:!0,closeOnEscape:!0,trapFocus:!1,withRoles:!0,returnFocus:!1,clickOutsideEvents:["mousedown","touchstart"],zIndex:Ce("popover"),__staticSelector:"Popover",width:"max-content"},ro=Fe((e,{radius:r,shadow:t})=>({dropdown:{"--popover-radius":r===void 0?void 0:Se(r),"--popover-shadow":ze(t)}}));function O(e){var N,I,k,_,A,M;const r=R("Popover",to,e),{children:t,position:n,offset:l,onPositionChange:i,positionDependencies:a,opened:s,transitionProps:p,width:c,middlewares:u,withArrow:y,arrowSize:o,arrowOffset:v,arrowRadius:D,arrowPosition:C,unstyled:g,classNames:w,styles:m,closeOnClickOutside:x,withinPortal:T,portalProps:H,closeOnEscape:Z,clickOutsideEvents:G,trapFocus:J,onClose:Q,onOpen:W,onChange:ee,zIndex:oe,radius:te,shadow:re,id:ae,defaultOpened:se,__staticSelector:E,withRoles:ne,disabled:ie,returnFocus:le,variant:de,keepMounted:ce,vars:fe,floatingStrategy:F,...pe}=r,ue=Ee({name:E,props:r,classes:B,classNames:w,styles:m,unstyled:g,rootSelector:"dropdown",vars:fe,varsResolver:ro}),S=f.useRef(null),[ge,we]=f.useState(null),[me,he]=f.useState(null),{dir:Pe}=Ne(),z=Be(ae),d=oo({middlewares:u,width:c,position:Ke(Pe,n),offset:typeof l=="number"?l+(y?o/2:0):l,arrowRef:S,arrowOffset:v,onPositionChange:i,positionDependencies:a,opened:s,defaultOpened:se,onChange:ee,onOpen:W,onClose:Q,strategy:F});Ze(()=>x&&d.onClose(),G,[ge,me]);const ye=f.useCallback(h=>{we(h),d.floating.refs.setReference(h)},[d.floating.refs.setReference]),ve=f.useCallback(h=>{he(h),d.floating.refs.setFloating(h)},[d.floating.refs.setFloating]);return P(Ge,{value:{returnFocus:le,disabled:ie,controlled:d.controlled,reference:ye,floating:ve,x:d.floating.x,y:d.floating.y,arrowX:(k=(I=(N=d.floating)==null?void 0:N.middlewareData)==null?void 0:I.arrow)==null?void 0:k.x,arrowY:(M=(A=(_=d.floating)==null?void 0:_.middlewareData)==null?void 0:A.arrow)==null?void 0:M.y,opened:d.opened,arrowRef:S,transitionProps:p,width:c,withArrow:y,arrowSize:o,arrowOffset:v,arrowRadius:D,arrowPosition:C,placement:d.floating.placement,trapFocus:J,withinPortal:T,portalProps:H,zIndex:oe,radius:te,shadow:re,closeOnEscape:Z,onClose:d.onClose,onToggle:d.onToggle,getTargetId:()=>`${z}-target`,getDropdownId:()=>`${z}-dropdown`,withRoles:ne,targetProps:pe,__staticSelector:E,classNames:w,styles:m,unstyled:g,variant:de,keepMounted:ce,getStyles:ue,floatingStrategy:F},children:t})}O.Target=q;O.Dropdown=b;O.displayName="@mantine/core/Popover";O.extend=e=>e;export{O as P};
