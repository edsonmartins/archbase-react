import{a as Y,F as K,j as x}from"./jsx-runtime-c9381026.js";import{r as d}from"./index-8b3efc3f.js";import{f as Q,u as z,b as we,h as W,B as ee,i as oe,n as te,m as ne,t as Pe}from"./polymorphic-factory-8fbd487e.js";import{g as re,i as se,O as ae}from"./OptionalPortal-9514e460.js";import{u as be}from"./DirectionProvider-1e219af7.js";import{u as ie,s as le,g as Te,F as xe,a as De,o as Re,f as Oe,b as Fe,i as Me,c as Ee,d as Ce,e as Ge,h as Ne,j as Se,k as Ie,l as ze,m as Le,n as ke}from"./use-floating-auto-update-3ec0cee2.js";import{T as je}from"./Transition-1b2bc7c1.js";import{g as Ae}from"./get-style-object-71cabcb5.js";import{u as pe}from"./use-merged-ref-add91123.js";import{u as Be}from"./use-id-3df0f1f4.js";import{u as Ue}from"./use-did-update-bccd292e.js";const $e={duration:100,transition:"fade"};function He(e,t){return{...$e,...t,...e}}function Ve({offset:e,position:t,defaultOpened:o}){const[n,u]=d.useState(o),y=d.useRef(),{x:i,y:g,elements:m,refs:s,update:h,placement:w}=ie({placement:t,middleware:[le({crossAxis:!0,padding:5,rootBoundary:"document"})]}),D=w.includes("right")?e:t.includes("left")?e*-1:0,f=w.includes("bottom")?e:t.includes("top")?e*-1:0,l=d.useCallback(({clientX:a,clientY:r})=>{s.setPositionReference({getBoundingClientRect(){return{width:0,height:0,x:a,y:r,left:a+D,top:r+f,right:a,bottom:r}}})},[m.reference]);return d.useEffect(()=>{if(s.floating.current){const a=y.current;a.addEventListener("mousemove",l);const r=Te(s.floating.current);return r.forEach(v=>{v.addEventListener("scroll",h)}),()=>{a.removeEventListener("mousemove",l),r.forEach(v=>{v.removeEventListener("scroll",h)})}}},[m.reference,s.floating.current,h,l,n]),{handleMouseMove:l,x:i,y:g,opened:n,setOpened:u,boundaryRef:y,floating:s.setFloating}}var L={tooltip:"m_1b3c8819",arrow:"m_f898399f"};const Xe={refProp:"ref",withinPortal:!0,offset:10,defaultOpened:!1,position:"right",zIndex:re("popover")},Ye=oe((e,{radius:t,color:o})=>({tooltip:{"--tooltip-radius":t===void 0?void 0:te(t),"--tooltip-bg":o?ne(o,e):void 0,"--tooltip-color":o?"var(--mantine-color-white)":void 0}})),Z=Q((e,t)=>{const o=z("TooltipFloating",Xe,e),{children:n,refProp:u,withinPortal:y,style:i,className:g,classNames:m,styles:s,unstyled:h,radius:w,color:D,label:f,offset:l,position:a,multiline:r,zIndex:v,disabled:G,defaultOpened:R,variant:O,vars:F,portalProps:P,...M}=o,E=we(),p=W({name:"TooltipFloating",props:o,classes:L,className:g,style:i,classNames:m,styles:s,unstyled:h,rootSelector:"tooltip",vars:F,varsResolver:Ye}),{handleMouseMove:j,x:N,y:S,opened:A,boundaryRef:B,floating:U,setOpened:I}=Ve({offset:l,position:a,defaultOpened:R});if(!se(n))throw new Error("[@mantine/core] Tooltip.Floating component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported");const $=pe(B,n.ref,t),H=C=>{var b,T;(T=(b=n.props).onMouseEnter)==null||T.call(b,C),j(C),I(!0)},V=C=>{var b,T;(T=(b=n.props).onMouseLeave)==null||T.call(b,C),I(!1)};return Y(K,{children:[x(ae,{...P,withinPortal:y,children:x(ee,{...M,...p("tooltip",{style:{...Ae(i,E),zIndex:v,display:!G&&A?"block":"none",top:(S&&Math.round(S))??"",left:(N&&Math.round(N))??""}}),variant:O,ref:U,mod:{multiline:r},children:f})}),d.cloneElement(n,{...n.props,[u]:$,onMouseEnter:H,onMouseLeave:V})]})});Z.classes=L;Z.displayName="@mantine/core/TooltipFloating";const ce=d.createContext(!1),Ze=ce.Provider,_e=()=>d.useContext(ce),qe={openDelay:0,closeDelay:0};function de(e){const{openDelay:t,closeDelay:o,children:n}=z("TooltipGroup",qe,e);return x(Ze,{value:!0,children:x(xe,{delay:{open:t,close:o},children:n})})}de.displayName="@mantine/core/TooltipGroup";function Je(e){var P,M,E;const[t,o]=d.useState(e.defaultOpened),u=typeof e.opened=="boolean"?e.opened:t,y=_e(),i=Be(),{delay:g,currentId:m,setCurrentId:s}=De(),h=d.useCallback(p=>{o(p),p&&s(i)},[s,i]),{x:w,y:D,context:f,refs:l,update:a,placement:r,middlewareData:{arrow:{x:v,y:G}={}}}=ie({strategy:e.strategy,placement:e.position,open:u,onOpenChange:h,middleware:[Re(e.offset),le({padding:8}),Oe(),Fe({element:e.arrowRef,padding:e.arrowOffset}),...e.inline?[Me()]:[]]}),{getReferenceProps:R,getFloatingProps:O}=Ee([Ce(f,{enabled:(P=e.events)==null?void 0:P.hover,delay:y?g:{open:e.openDelay,close:e.closeDelay},mouseOnly:!((M=e.events)!=null&&M.touch)}),Ge(f,{enabled:(E=e.events)==null?void 0:E.focus,visibleOnly:!0}),Ne(f,{role:"tooltip"}),Se(f,{enabled:typeof e.opened>"u"}),Ie(f,{id:i})]);ze({opened:u,position:e.position,positionDependencies:e.positionDependencies,floating:{refs:l,update:a}}),Ue(()=>{var p;(p=e.onPositionChange)==null||p.call(e,r)},[r]);const F=u&&m&&m!==i;return{x:w,y:D,arrowX:v,arrowY:G,reference:l.setReference,floating:l.setFloating,getFloatingProps:O,getReferenceProps:R,isGroupPhase:F,opened:u,placement:r}}const J={position:"top",refProp:"ref",withinPortal:!0,inline:!1,defaultOpened:!1,arrowSize:4,arrowOffset:5,arrowRadius:0,arrowPosition:"side",offset:5,transitionProps:{duration:100,transition:"fade"},events:{hover:!0,focus:!1,touch:!1},zIndex:re("popover"),positionDependencies:[]},Ke=oe((e,{radius:t,color:o})=>({tooltip:{"--tooltip-radius":t===void 0?void 0:te(t),"--tooltip-bg":o?ne(o,e):void 0,"--tooltip-color":o?"var(--mantine-color-white)":void 0}})),k=Q((e,t)=>{const o=z("Tooltip",J,e),{children:n,position:u,refProp:y,label:i,openDelay:g,closeDelay:m,onPositionChange:s,opened:h,defaultOpened:w,withinPortal:D,radius:f,color:l,classNames:a,styles:r,unstyled:v,style:G,className:R,withArrow:O,arrowSize:F,arrowOffset:P,arrowRadius:M,arrowPosition:E,offset:p,transitionProps:j,multiline:N,events:S,zIndex:A,disabled:B,positionDependencies:U,onClick:I,onMouseEnter:$,onMouseLeave:H,inline:V,variant:C,keepMounted:b,vars:T,portalProps:ue,mod:fe,floatingStrategy:me,...he}=z("Tooltip",J,o),{dir:ve}=be(),_=d.useRef(null),c=Je({position:Le(ve,u),closeDelay:m,openDelay:g,onPositionChange:s,opened:h,defaultOpened:w,events:S,arrowRef:_,arrowOffset:P,offset:typeof p=="number"?p+(O?F/2:0):p,positionDependencies:[...U,n],inline:V,strategy:me}),X=W({name:"Tooltip",props:o,classes:L,className:R,style:G,classNames:a,styles:r,unstyled:v,rootSelector:"tooltip",vars:T,varsResolver:Ke});if(!se(n))throw new Error("[@mantine/core] Tooltip component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported");const ye=pe(c.reference,n.ref,t),q=He(j,{duration:100,transition:"fade"});return Y(K,{children:[x(ae,{...ue,withinPortal:D,children:x(je,{...q,keepMounted:b,mounted:!B&&!!c.opened,duration:c.isGroupPhase?10:q.duration,children:ge=>Y(ee,{...he,variant:C,mod:[{multiline:N},fe],...c.getFloatingProps({ref:c.floating,className:X("tooltip").className,style:{...X("tooltip").style,...ge,zIndex:A,top:c.y??0,left:c.x??0}}),children:[i,x(ke,{ref:_,arrowX:c.arrowX,arrowY:c.arrowY,visible:O,position:c.placement,arrowSize:F,arrowOffset:P,arrowRadius:M,arrowPosition:E,...X("arrow")})]})})}),d.cloneElement(n,c.getReferenceProps({onClick:I,onMouseEnter:$,onMouseLeave:H,onMouseMove:o.onMouseMove,onPointerDown:o.onPointerDown,onPointerEnter:o.onPointerEnter,[y]:ye,className:Pe(R,n.props.className),...n.props}))]})});k.classes=L;k.displayName="@mantine/core/Tooltip";k.Floating=Z;k.Group=de;export{k as T};
