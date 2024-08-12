import{a as Y,F as W,j as T}from"./jsx-runtime-c9381026.js";import{r as d}from"./index-8b3efc3f.js";import{f as ee,u as z,b as we,h as oe,B as te,i as ne,n as re,m as se,t as Pe}from"./polymorphic-factory-9e44d24d.js";import{g as ae,i as ie,O as le}from"./OptionalPortal-bfca0d0b.js";import{u as be}from"./DirectionProvider-1e219af7.js";import{u as pe,s as ce,g as xe,F as Te,a as De,o as Re,f as Oe,b as Fe,i as Me,c as Ee,d as Ce,e as Ge,h as Ne,j as Se,k as Ie,l as ze,m as Le,n as ke}from"./use-floating-auto-update-3ec0cee2.js";import{T as je}from"./Transition-a3782892.js";import{g as Ae}from"./get-style-object-71cabcb5.js";import{u as de}from"./use-merged-ref-add91123.js";import{u as Be}from"./use-id-3df0f1f4.js";import{u as Ue}from"./use-did-update-bccd292e.js";const $e={duration:100,transition:"fade"};function He(e,t){return{...$e,...t,...e}}function Ve({offset:e,position:t,defaultOpened:o}){const[n,u]=d.useState(o),y=d.useRef(),{x:i,y:g,elements:m,refs:s,update:h,placement:w}=pe({placement:t,middleware:[ce({crossAxis:!0,padding:5,rootBoundary:"document"})]}),D=w.includes("right")?e:t.includes("left")?e*-1:0,f=w.includes("bottom")?e:t.includes("top")?e*-1:0,l=d.useCallback(({clientX:a,clientY:r})=>{s.setPositionReference({getBoundingClientRect(){return{width:0,height:0,x:a,y:r,left:a+D,top:r+f,right:a,bottom:r}}})},[m.reference]);return d.useEffect(()=>{if(s.floating.current){const a=y.current;a.addEventListener("mousemove",l);const r=xe(s.floating.current);return r.forEach(v=>{v.addEventListener("scroll",h)}),()=>{a.removeEventListener("mousemove",l),r.forEach(v=>{v.removeEventListener("scroll",h)})}}},[m.reference,s.floating.current,h,l,n]),{handleMouseMove:l,x:i,y:g,opened:n,setOpened:u,boundaryRef:y,floating:s.setFloating}}var L={tooltip:"m_1b3c8819",arrow:"m_f898399f"};const Xe={refProp:"ref",withinPortal:!0,offset:10,defaultOpened:!1,position:"right",zIndex:ae("popover")},Ye=ne((e,{radius:t,color:o})=>({tooltip:{"--tooltip-radius":t===void 0?void 0:re(t),"--tooltip-bg":o?se(o,e):void 0,"--tooltip-color":o?"var(--mantine-color-white)":void 0}})),Z=ee((e,t)=>{const o=z("TooltipFloating",Xe,e),{children:n,refProp:u,withinPortal:y,style:i,className:g,classNames:m,styles:s,unstyled:h,radius:w,color:D,label:f,offset:l,position:a,multiline:r,zIndex:v,disabled:G,defaultOpened:R,variant:O,vars:F,portalProps:P,...M}=o,E=we(),p=oe({name:"TooltipFloating",props:o,classes:L,className:g,style:i,classNames:m,styles:s,unstyled:h,rootSelector:"tooltip",vars:F,varsResolver:Ye}),{handleMouseMove:j,x:N,y:S,opened:A,boundaryRef:B,floating:U,setOpened:I}=Ve({offset:l,position:a,defaultOpened:R});if(!ie(n))throw new Error("[@mantine/core] Tooltip.Floating component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported");const $=de(B,n.ref,t),H=C=>{var b,x;(x=(b=n.props).onMouseEnter)==null||x.call(b,C),j(C),I(!0)},V=C=>{var b,x;(x=(b=n.props).onMouseLeave)==null||x.call(b,C),I(!1)};return Y(W,{children:[T(le,{...P,withinPortal:y,children:T(te,{...M,...p("tooltip",{style:{...Ae(i,E),zIndex:v,display:!G&&A?"block":"none",top:(S&&Math.round(S))??"",left:(N&&Math.round(N))??""}}),variant:O,ref:U,mod:{multiline:r},children:f})}),d.cloneElement(n,{...n.props,[u]:$,onMouseEnter:H,onMouseLeave:V})]})});Z.classes=L;Z.displayName="@mantine/core/TooltipFloating";const ue=d.createContext(!1),Ze=ue.Provider,_e=()=>d.useContext(ue),qe={openDelay:0,closeDelay:0};function _(e){const{openDelay:t,closeDelay:o,children:n}=z("TooltipGroup",qe,e);return T(Ze,{value:!0,children:T(Te,{delay:{open:t,close:o},children:n})})}_.displayName="@mantine/core/TooltipGroup";_.extend=e=>e;function Je(e){var P,M,E;const[t,o]=d.useState(e.defaultOpened),u=typeof e.opened=="boolean"?e.opened:t,y=_e(),i=Be(),{delay:g,currentId:m,setCurrentId:s}=De(),h=d.useCallback(p=>{o(p),p&&s(i)},[s,i]),{x:w,y:D,context:f,refs:l,update:a,placement:r,middlewareData:{arrow:{x:v,y:G}={}}}=pe({strategy:e.strategy,placement:e.position,open:u,onOpenChange:h,middleware:[Re(e.offset),ce({padding:8}),Oe(),Fe({element:e.arrowRef,padding:e.arrowOffset}),...e.inline?[Me()]:[]]}),{getReferenceProps:R,getFloatingProps:O}=Ee([Ce(f,{enabled:(P=e.events)==null?void 0:P.hover,delay:y?g:{open:e.openDelay,close:e.closeDelay},mouseOnly:!((M=e.events)!=null&&M.touch)}),Ge(f,{enabled:(E=e.events)==null?void 0:E.focus,visibleOnly:!0}),Ne(f,{role:"tooltip"}),Se(f,{enabled:typeof e.opened>"u"}),Ie(f,{id:i})]);ze({opened:u,position:e.position,positionDependencies:e.positionDependencies,floating:{refs:l,update:a}}),Ue(()=>{var p;(p=e.onPositionChange)==null||p.call(e,r)},[r]);const F=u&&m&&m!==i;return{x:w,y:D,arrowX:v,arrowY:G,reference:l.setReference,floating:l.setFloating,getFloatingProps:O,getReferenceProps:R,isGroupPhase:F,opened:u,placement:r}}const Q={position:"top",refProp:"ref",withinPortal:!0,inline:!1,defaultOpened:!1,arrowSize:4,arrowOffset:5,arrowRadius:0,arrowPosition:"side",offset:5,transitionProps:{duration:100,transition:"fade"},events:{hover:!0,focus:!1,touch:!1},zIndex:ae("popover"),positionDependencies:[]},Ke=ne((e,{radius:t,color:o})=>({tooltip:{"--tooltip-radius":t===void 0?void 0:re(t),"--tooltip-bg":o?se(o,e):void 0,"--tooltip-color":o?"var(--mantine-color-white)":void 0}})),k=ee((e,t)=>{const o=z("Tooltip",Q,e),{children:n,position:u,refProp:y,label:i,openDelay:g,closeDelay:m,onPositionChange:s,opened:h,defaultOpened:w,withinPortal:D,radius:f,color:l,classNames:a,styles:r,unstyled:v,style:G,className:R,withArrow:O,arrowSize:F,arrowOffset:P,arrowRadius:M,arrowPosition:E,offset:p,transitionProps:j,multiline:N,events:S,zIndex:A,disabled:B,positionDependencies:U,onClick:I,onMouseEnter:$,onMouseLeave:H,inline:V,variant:C,keepMounted:b,vars:x,portalProps:fe,mod:me,floatingStrategy:q,...he}=z("Tooltip",Q,o),{dir:ve}=be(),J=d.useRef(null),c=Je({position:Le(ve,u),closeDelay:m,openDelay:g,onPositionChange:s,opened:h,defaultOpened:w,events:S,arrowRef:J,arrowOffset:P,offset:typeof p=="number"?p+(O?F/2:0):p,positionDependencies:[...U,n],inline:V,strategy:q}),X=oe({name:"Tooltip",props:o,classes:L,className:R,style:G,classNames:a,styles:r,unstyled:v,rootSelector:"tooltip",vars:x,varsResolver:Ke});if(!ie(n))throw new Error("[@mantine/core] Tooltip component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported");const ye=de(c.reference,n.ref,t),K=He(j,{duration:100,transition:"fade"});return Y(W,{children:[T(le,{...fe,withinPortal:D,children:T(je,{...K,keepMounted:b,mounted:!B&&!!c.opened,duration:c.isGroupPhase?10:K.duration,children:ge=>Y(te,{...he,"data-fixed":q==="fixed"||void 0,variant:C,mod:[{multiline:N},me],...c.getFloatingProps({ref:c.floating,className:X("tooltip").className,style:{...X("tooltip").style,...ge,zIndex:A,top:c.y??0,left:c.x??0}}),children:[i,T(ke,{ref:J,arrowX:c.arrowX,arrowY:c.arrowY,visible:O,position:c.placement,arrowSize:F,arrowOffset:P,arrowRadius:M,arrowPosition:E,...X("arrow")})]})})}),d.cloneElement(n,c.getReferenceProps({onClick:I,onMouseEnter:$,onMouseLeave:H,onMouseMove:o.onMouseMove,onPointerDown:o.onPointerDown,onPointerEnter:o.onPointerEnter,[y]:ye,className:Pe(R,n.props.className),...n.props}))]})});k.classes=L;k.displayName="@mantine/core/Tooltip";k.Floating=Z;k.Group=_;export{k as T};
