import{j as w,a as H}from"./jsx-runtime-c9381026.js";import{r as g}from"./index-8b3efc3f.js";import{O as Z,i as ze,g as ke}from"./OptionalPortal-8c3f6fc2.js";import{f as G,u as F,B as Ie,r as _e,t as Ae,h as je,i as Me,n as $e,o as Ke}from"./polymorphic-factory-bf652503.js";import{u as Le}from"./use-resolved-styles-api-07b5b463.js";import{u as Ue}from"./DirectionProvider-1e219af7.js";import{n as Ve,a as Xe,u as Ye,i as Be,o as qe,s as He,p as V,j as X,l as Y,k as Ze,q as Ge,m as Je}from"./use-floating-auto-update-1c50c118.js";import{u as Qe,F as We,O as eo}from"./FocusTrap-c341c68f.js";import{T as J}from"./Transition-fcb0e8e9.js";import{c as oo}from"./create-safe-context-941c9e18.js";import{n as to}from"./noop-1bad6ac0.js";import{u as Q}from"./use-merged-ref-a374cf59.js";import{u as ro}from"./use-uncontrolled-f56237fb.js";import{u as B}from"./use-did-update-bccd292e.js";import{u as ao}from"./use-id-f896cdc5.js";function no(e,r={active:!0}){return typeof e!="function"||!r.active?r.onKeyDown||to:t=>{var n;t.key==="Escape"&&(e(t),(n=r.onTrigger)==null||n.call(r))}}const q=["mousedown","touchstart"];function so(e,r,t){const n=g.useRef(null);return g.useEffect(()=>{const d=l=>{const{target:i}=l??{};if(Array.isArray(t)){const s=(i==null?void 0:i.hasAttribute("data-ignore-outside-clicks"))||!document.body.contains(i)&&i.tagName!=="HTML";t.every(c=>!!c&&!l.composedPath().includes(c))&&!s&&e()}else n.current&&!n.current.contains(i)&&e()};return(r||q).forEach(l=>document.addEventListener(l,d)),()=>{(r||q).forEach(l=>document.removeEventListener(l,d))}},[n,e,t]),n}const[io,W]=oo("Popover component was not found in the tree");var ee={dropdown:"m_38a85659",arrow:"m_a31dc6c1",overlay:"m_3d7bc908"};const lo={},N=G((e,r)=>{var b,T,y,h;const t=F("PopoverDropdown",lo,e),{className:n,style:d,vars:l,children:i,onKeyDownCapture:s,variant:a,classNames:c,styles:f,...O}=t,o=W(),D=Qe({opened:o.opened,shouldReturnFocus:o.returnFocus}),R=o.withRoles?{"aria-labelledby":o.getTargetId(),id:o.getDropdownId(),role:"dialog",tabIndex:-1}:{},C=Q(r,o.floating);return o.disabled?null:w(Z,{...o.portalProps,withinPortal:o.withinPortal,children:w(J,{mounted:o.opened,...o.transitionProps,transition:((b=o.transitionProps)==null?void 0:b.transition)||"fade",duration:((T=o.transitionProps)==null?void 0:T.duration)??150,keepMounted:o.keepMounted,exitDuration:typeof((y=o.transitionProps)==null?void 0:y.exitDuration)=="number"?o.transitionProps.exitDuration:(h=o.transitionProps)==null?void 0:h.duration,children:v=>w(We,{active:o.trapFocus&&o.opened,innerRef:C,children:H(Ie,{...R,...O,variant:a,onKeyDownCapture:no(()=>{var S,P;(S=o.onClose)==null||S.call(o),(P=o.onDismiss)==null||P.call(o)},{active:o.closeOnEscape,onTrigger:D,onKeyDown:s}),"data-position":o.placement,"data-fixed":o.floatingStrategy==="fixed"||void 0,...o.getStyles("dropdown",{className:n,props:t,classNames:c,styles:f,style:[{...v,zIndex:o.zIndex,top:o.y??0,left:o.x??0,width:o.width==="target"?void 0:_e(o.width)},o.resolvedStyles.dropdown,f==null?void 0:f.dropdown,d]}),children:[i,w(Ve,{ref:o.arrowRef,arrowX:o.arrowX,arrowY:o.arrowY,visible:o.withArrow,position:o.placement,arrowSize:o.arrowSize,arrowRadius:o.arrowRadius,arrowOffset:o.arrowOffset,arrowPosition:o.arrowPosition,...o.getStyles("arrow",{props:t,classNames:c,styles:f})})]})})})})});N.classes=ee;N.displayName="@mantine/core/PopoverDropdown";const co={refProp:"ref",popupType:"dialog"},oe=G((e,r)=>{const{children:t,refProp:n,popupType:d,...l}=F("PopoverTarget",co,e);if(!ze(t))throw new Error("Popover.Target component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported");const i=l,s=W(),a=Q(s.reference,Xe(t),r),c=s.withRoles?{"aria-haspopup":d,"aria-expanded":s.opened,"aria-controls":s.getDropdownId(),id:s.getTargetId()}:{};return g.cloneElement(t,{...i,...c,...s.targetProps,className:Ae(s.targetProps.className,i.className,t.props.className),[n]:a,...s.controlled?null:{onClick:s.onToggle}})});oe.displayName="@mantine/core/PopoverTarget";function uo(e){if(e===void 0)return{shift:!0,flip:!0};const r={...e};return e.shift===void 0&&(r.shift=!0),e.flip===void 0&&(r.flip=!0),r}function fo(e,r){const t=uo(e.middlewares),n=[qe(e.offset)];return t.shift&&n.push(He(typeof t.shift=="boolean"?{limiter:V(),padding:5}:{limiter:V(),padding:5,...t.shift})),t.flip&&n.push(typeof t.flip=="boolean"?X():X(t.flip)),t.inline&&n.push(typeof t.inline=="boolean"?Y():Y(t.inline)),n.push(Ze({element:e.arrowRef,padding:e.arrowOffset})),(t.size||e.width==="target")&&n.push(Ge({...typeof t.size=="boolean"?{}:t.size,apply({rects:d,availableWidth:l,availableHeight:i,...s}){var f;const c=((f=r().refs.floating.current)==null?void 0:f.style)??{};t.size&&(typeof t.size=="object"&&t.size.apply?t.size.apply({rects:d,availableWidth:l,availableHeight:i,...s}):Object.assign(c,{maxWidth:`${l}px`,maxHeight:`${i}px`})),e.width==="target"&&Object.assign(c,{width:`${d.reference.width}px`})}})),n}function po(e){const[r,t]=ro({value:e.opened,defaultValue:e.defaultOpened,finalValue:!1,onChange:e.onChange}),n=g.useRef(r),d=()=>{r&&t(!1)},l=()=>t(!r),i=Ye({strategy:e.strategy,placement:e.position,middleware:fo(e,()=>i)});return Be({opened:r,position:e.position,positionDependencies:e.positionDependencies||[],floating:i}),B(()=>{var s;(s=e.onPositionChange)==null||s.call(e,i.placement)},[i.placement]),B(()=>{var s,a;r!==n.current&&(r?(a=e.onOpen)==null||a.call(e):(s=e.onClose)==null||s.call(e)),n.current=r},[r,e.onClose,e.onOpen]),{floating:i,controlled:typeof e.opened=="boolean",opened:r,onClose:d,onToggle:l}}const go={position:"bottom",offset:8,positionDependencies:[],transitionProps:{transition:"fade",duration:150},middlewares:{flip:!0,shift:!0,inline:!1},arrowSize:7,arrowOffset:5,arrowRadius:0,arrowPosition:"side",closeOnClickOutside:!0,withinPortal:!0,closeOnEscape:!0,trapFocus:!1,withRoles:!0,returnFocus:!1,withOverlay:!1,clickOutsideEvents:["mousedown","touchstart"],zIndex:ke("popover"),__staticSelector:"Popover",width:"max-content"},mo=Me((e,{radius:r,shadow:t})=>({dropdown:{"--popover-radius":r===void 0?void 0:$e(r),"--popover-shadow":Ke(t)}}));function E(e){var j,M,$,K,L,U;const r=F("Popover",go,e),{children:t,position:n,offset:d,onPositionChange:l,positionDependencies:i,opened:s,transitionProps:a,onExitTransitionEnd:c,onEnterTransitionEnd:f,width:O,middlewares:o,withArrow:D,arrowSize:R,arrowOffset:C,arrowRadius:b,arrowPosition:T,unstyled:y,classNames:h,styles:v,closeOnClickOutside:S,withinPortal:P,portalProps:te,closeOnEscape:re,clickOutsideEvents:ae,trapFocus:ne,onClose:se,onDismiss:x,onOpen:ie,onChange:le,zIndex:de,radius:ce,shadow:ue,id:fe,defaultOpened:pe,__staticSelector:z,withRoles:ge,disabled:me,returnFocus:we,variant:he,keepMounted:ye,vars:ve,floatingStrategy:k,withOverlay:Pe,overlayProps:m,...xe}=r,I=je({name:z,props:r,classes:ee,classNames:h,styles:v,unstyled:y,rootSelector:"dropdown",vars:ve,varsResolver:mo}),{resolvedStyles:Oe}=Le({classNames:h,styles:v,props:r}),_=g.useRef(null),[De,Re]=g.useState(null),[Ce,be]=g.useState(null),{dir:Te}=Ue(),A=ao(fe),u=po({middlewares:o,width:O,position:Je(Te,n),offset:typeof d=="number"?d+(D?R/2:0):d,arrowRef:_,arrowOffset:C,onPositionChange:l,positionDependencies:i,opened:s,defaultOpened:pe,onChange:le,onOpen:ie,onClose:se,onDismiss:x,strategy:k});so(()=>{S&&(u.onClose(),x==null||x())},ae,[De,Ce]);const Se=g.useCallback(p=>{Re(p),u.floating.refs.setReference(p)},[u.floating.refs.setReference]),Ee=g.useCallback(p=>{be(p),u.floating.refs.setFloating(p)},[u.floating.refs.setFloating]),Fe=g.useCallback(()=>{var p;(p=a==null?void 0:a.onExited)==null||p.call(a),c==null||c()},[a==null?void 0:a.onExited,c]),Ne=g.useCallback(()=>{var p;(p=a==null?void 0:a.onEntered)==null||p.call(a),f==null||f()},[a==null?void 0:a.onEntered,f]);return H(io,{value:{returnFocus:we,disabled:me,controlled:u.controlled,reference:Se,floating:Ee,x:u.floating.x,y:u.floating.y,arrowX:($=(M=(j=u.floating)==null?void 0:j.middlewareData)==null?void 0:M.arrow)==null?void 0:$.x,arrowY:(U=(L=(K=u.floating)==null?void 0:K.middlewareData)==null?void 0:L.arrow)==null?void 0:U.y,opened:u.opened,arrowRef:_,transitionProps:{...a,onExited:Fe,onEntered:Ne},width:O,withArrow:D,arrowSize:R,arrowOffset:C,arrowRadius:b,arrowPosition:T,placement:u.floating.placement,trapFocus:ne,withinPortal:P,portalProps:te,zIndex:de,radius:ce,shadow:ue,closeOnEscape:re,onDismiss:x,onClose:u.onClose,onToggle:u.onToggle,getTargetId:()=>`${A}-target`,getDropdownId:()=>`${A}-dropdown`,withRoles:ge,targetProps:xe,__staticSelector:z,classNames:h,styles:v,unstyled:y,variant:he,keepMounted:ye,getStyles:I,resolvedStyles:Oe,floatingStrategy:k},children:[t,Pe&&w(J,{transition:"fade",mounted:u.opened,duration:(a==null?void 0:a.duration)||250,exitDuration:(a==null?void 0:a.exitDuration)||250,children:p=>w(Z,{withinPortal:P,children:w(eo,{...m,...I("overlay",{className:m==null?void 0:m.className,style:[p,m==null?void 0:m.style]})})})})]})}E.Target=oe;E.Dropdown=N;E.displayName="@mantine/core/Popover";E.extend=e=>e;export{E as P,so as u};
