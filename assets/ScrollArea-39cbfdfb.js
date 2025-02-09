import{j as m,a as ie}from"./jsx-runtime-c9381026.js";import{r as c}from"./index-8b3efc3f.js";import{u as F,B as M,f as G,h as ue,i as de,r as fe}from"./polymorphic-factory-531d6b2a.js";import{c as J}from"./create-safe-context-941c9e18.js";import{u as he}from"./use-isomorphic-effect-aa890e3d.js";import{u as H}from"./use-merged-ref-a374cf59.js";import{u as be}from"./DirectionProvider-1e219af7.js";function z(e){const o=c.useRef(e);return c.useEffect(()=>{o.current=e}),c.useMemo(()=>(...t)=>{var s;return(s=o.current)==null?void 0:s.call(o,...t)},[])}const me=()=>{};function Y(e,o){const t=typeof o=="number"?o:o.delay,s=typeof o=="number"?!1:o.flushOnUnmount,n=z(e),l=c.useRef(0),r=Object.assign(c.useCallback((...a)=>{window.clearTimeout(l.current);const d=()=>{l.current!==0&&(l.current=0,n(...a))};r.flush=d,l.current=window.setTimeout(d,t)},[n,t]),{flush:me});return c.useEffect(()=>()=>{window.clearTimeout(l.current),s&&r.flush()},[r,s]),r}const[Se,P]=J("ScrollArea.Root component was not found in tree");function W(e,o){const t=z(o);he(()=>{let s=0;if(e){const n=new ResizeObserver(()=>{cancelAnimationFrame(s),s=window.requestAnimationFrame(t)});return n.observe(e),()=>{window.cancelAnimationFrame(s),n.unobserve(e)}}},[e,t])}const pe=c.forwardRef((e,o)=>{const{style:t,...s}=e,n=P(),[l,r]=c.useState(0),[a,d]=c.useState(0),u=!!(l&&a);return W(n.scrollbarX,()=>{var h;const i=((h=n.scrollbarX)==null?void 0:h.offsetHeight)||0;n.onCornerHeightChange(i),d(i)}),W(n.scrollbarY,()=>{var h;const i=((h=n.scrollbarY)==null?void 0:h.offsetWidth)||0;n.onCornerWidthChange(i),r(i)}),u?m("div",{...s,ref:o,style:{...t,width:l,height:a}}):null}),ve=c.forwardRef((e,o)=>{const t=P(),s=!!(t.scrollbarX&&t.scrollbarY);return t.type!=="scroll"&&s?m(pe,{...e,ref:o}):null}),we={scrollHideDelay:1e3,type:"hover"},K=c.forwardRef((e,o)=>{const t=F("ScrollAreaRoot",we,e),{type:s,scrollHideDelay:n,scrollbars:l,...r}=t,[a,d]=c.useState(null),[u,i]=c.useState(null),[h,b]=c.useState(null),[f,p]=c.useState(null),[E,g]=c.useState(null),[w,T]=c.useState(0),[C,x]=c.useState(0),[D,R]=c.useState(!1),[y,S]=c.useState(!1),v=H(o,A=>d(A));return m(Se,{value:{type:s,scrollHideDelay:n,scrollArea:a,viewport:u,onViewportChange:i,content:h,onContentChange:b,scrollbarX:f,onScrollbarXChange:p,scrollbarXEnabled:D,onScrollbarXEnabledChange:R,scrollbarY:E,onScrollbarYChange:g,scrollbarYEnabled:y,onScrollbarYEnabledChange:S,onCornerWidthChange:T,onCornerHeightChange:x},children:m(M,{...r,ref:v,__vars:{"--sa-corner-width":l!=="xy"?"0px":`${w}px`,"--sa-corner-height":l!=="xy"?"0px":`${C}px`}})})});K.displayName="@mantine/core/ScrollAreaRoot";function Q(e,o){const t=e/o;return Number.isNaN(t)?0:t}function N(e){const o=Q(e.viewport,e.content),t=e.scrollbar.paddingStart+e.scrollbar.paddingEnd,s=(e.scrollbar.size-t)*o;return Math.max(s,18)}function Z(e,o){return t=>{if(e[0]===e[1]||o[0]===o[1])return o[0];const s=(o[1]-o[0])/(e[1]-e[0]);return o[0]+s*(t-e[0])}}function ge(e,[o,t]){return Math.min(t,Math.max(o,e))}function q(e,o,t="ltr"){const s=N(o),n=o.scrollbar.paddingStart+o.scrollbar.paddingEnd,l=o.scrollbar.size-n,r=o.content-o.viewport,a=l-s,d=t==="ltr"?[0,r]:[r*-1,0],u=ge(e,d);return Z([0,r],[0,a])(u)}function ye(e,o,t,s="ltr"){const n=N(t),l=n/2,r=o||l,a=n-r,d=t.scrollbar.paddingStart+r,u=t.scrollbar.size-t.scrollbar.paddingEnd-a,i=t.content-t.viewport,h=s==="ltr"?[0,i]:[i*-1,0];return Z([d,u],h)(e)}function ee(e,o){return e>0&&e<o}function X(e){return e?parseInt(e,10):0}function L(e,o,{checkForDefaultPrevented:t=!0}={}){return s=>{e==null||e(s),(t===!1||!s.defaultPrevented)&&(o==null||o(s))}}const[Pe,oe]=J("ScrollAreaScrollbar was not found in tree"),te=c.forwardRef((e,o)=>{const{sizes:t,hasThumb:s,onThumbChange:n,onThumbPointerUp:l,onThumbPointerDown:r,onThumbPositionChange:a,onDragScroll:d,onWheelScroll:u,onResize:i,...h}=e,b=P(),[f,p]=c.useState(null),E=H(o,S=>p(S)),g=c.useRef(null),w=c.useRef(""),{viewport:T}=b,C=t.content-t.viewport,x=z(u),D=z(a),R=Y(i,10),y=S=>{if(g.current){const v=S.clientX-g.current.left,A=S.clientY-g.current.top;d({x:v,y:A})}};return c.useEffect(()=>{const S=v=>{const A=v.target;(f==null?void 0:f.contains(A))&&x(v,C)};return document.addEventListener("wheel",S,{passive:!1}),()=>document.removeEventListener("wheel",S,{passive:!1})},[T,f,C,x]),c.useEffect(D,[t,D]),W(f,R),W(b.content,R),m(Pe,{value:{scrollbar:f,hasThumb:s,onThumbChange:z(n),onThumbPointerUp:z(l),onThumbPositionChange:D,onThumbPointerDown:z(r)},children:m("div",{...h,ref:E,"data-mantine-scrollbar":!0,style:{position:"absolute",...h.style},onPointerDown:L(e.onPointerDown,S=>{S.preventDefault();const v=0;S.button===v&&(S.target.setPointerCapture(S.pointerId),g.current=f.getBoundingClientRect(),w.current=document.body.style.webkitUserSelect,document.body.style.webkitUserSelect="none",y(S))}),onPointerMove:L(e.onPointerMove,y),onPointerUp:L(e.onPointerUp,S=>{const v=S.target;v.hasPointerCapture(S.pointerId)&&(S.preventDefault(),v.releasePointerCapture(S.pointerId))}),onLostPointerCapture:()=>{document.body.style.webkitUserSelect=w.current,g.current=null}})})}),re=c.forwardRef((e,o)=>{const{sizes:t,onSizesChange:s,style:n,...l}=e,r=P(),[a,d]=c.useState(),u=c.useRef(null),i=H(o,u,r.onScrollbarXChange);return c.useEffect(()=>{u.current&&d(getComputedStyle(u.current))},[u]),m(te,{"data-orientation":"horizontal",...l,ref:i,sizes:t,style:{...n,"--sa-thumb-width":`${N(t)}px`},onThumbPointerDown:h=>e.onThumbPointerDown(h.x),onDragScroll:h=>e.onDragScroll(h.x),onWheelScroll:(h,b)=>{if(r.viewport){const f=r.viewport.scrollLeft+h.deltaX;e.onWheelScroll(f),ee(f,b)&&h.preventDefault()}},onResize:()=>{u.current&&r.viewport&&a&&s({content:r.viewport.scrollWidth,viewport:r.viewport.offsetWidth,scrollbar:{size:u.current.clientWidth,paddingStart:X(a.paddingLeft),paddingEnd:X(a.paddingRight)}})}})});re.displayName="@mantine/core/ScrollAreaScrollbarX";const ne=c.forwardRef((e,o)=>{const{sizes:t,onSizesChange:s,style:n,...l}=e,r=P(),[a,d]=c.useState(),u=c.useRef(null),i=H(o,u,r.onScrollbarYChange);return c.useEffect(()=>{u.current&&d(window.getComputedStyle(u.current))},[]),m(te,{...l,"data-orientation":"vertical",ref:i,sizes:t,style:{"--sa-thumb-height":`${N(t)}px`,...n},onThumbPointerDown:h=>e.onThumbPointerDown(h.y),onDragScroll:h=>e.onDragScroll(h.y),onWheelScroll:(h,b)=>{if(r.viewport){const f=r.viewport.scrollTop+h.deltaY;e.onWheelScroll(f),ee(f,b)&&h.preventDefault()}},onResize:()=>{u.current&&r.viewport&&a&&s({content:r.viewport.scrollHeight,viewport:r.viewport.offsetHeight,scrollbar:{size:u.current.clientHeight,paddingStart:X(a.paddingTop),paddingEnd:X(a.paddingBottom)}})}})});ne.displayName="@mantine/core/ScrollAreaScrollbarY";const U=c.forwardRef((e,o)=>{const{orientation:t="vertical",...s}=e,{dir:n}=be(),l=P(),r=c.useRef(null),a=c.useRef(0),[d,u]=c.useState({content:0,viewport:0,scrollbar:{size:0,paddingStart:0,paddingEnd:0}}),i=Q(d.viewport,d.content),h={...s,sizes:d,onSizesChange:u,hasThumb:i>0&&i<1,onThumbChange:f=>{r.current=f},onThumbPointerUp:()=>{a.current=0},onThumbPointerDown:f=>{a.current=f}},b=(f,p)=>ye(f,a.current,d,p);return t==="horizontal"?m(re,{...h,ref:o,onThumbPositionChange:()=>{if(l.viewport&&r.current){const f=l.viewport.scrollLeft,p=q(f,d,n);r.current.style.transform=`translate3d(${p}px, 0, 0)`}},onWheelScroll:f=>{l.viewport&&(l.viewport.scrollLeft=f)},onDragScroll:f=>{l.viewport&&(l.viewport.scrollLeft=b(f,n))}}):t==="vertical"?m(ne,{...h,ref:o,onThumbPositionChange:()=>{if(l.viewport&&r.current){const f=l.viewport.scrollTop,p=q(f,d);d.scrollbar.size===0?r.current.style.setProperty("--thumb-opacity","0"):r.current.style.setProperty("--thumb-opacity","1"),r.current.style.transform=`translate3d(0, ${p}px, 0)`}},onWheelScroll:f=>{l.viewport&&(l.viewport.scrollTop=f)},onDragScroll:f=>{l.viewport&&(l.viewport.scrollTop=b(f))}}):null});U.displayName="@mantine/core/ScrollAreaScrollbarVisible";const k=c.forwardRef((e,o)=>{const t=P(),{forceMount:s,...n}=e,[l,r]=c.useState(!1),a=e.orientation==="horizontal",d=Y(()=>{if(t.viewport){const u=t.viewport.offsetWidth<t.viewport.scrollWidth,i=t.viewport.offsetHeight<t.viewport.scrollHeight;r(a?u:i)}},10);return W(t.viewport,d),W(t.content,d),s||l?m(U,{"data-state":l?"visible":"hidden",...n,ref:o}):null});k.displayName="@mantine/core/ScrollAreaScrollbarAuto";const le=c.forwardRef((e,o)=>{const{forceMount:t,...s}=e,n=P(),[l,r]=c.useState(!1);return c.useEffect(()=>{const{scrollArea:a}=n;let d=0;if(a){const u=()=>{window.clearTimeout(d),r(!0)},i=()=>{d=window.setTimeout(()=>r(!1),n.scrollHideDelay)};return a.addEventListener("pointerenter",u),a.addEventListener("pointerleave",i),()=>{window.clearTimeout(d),a.removeEventListener("pointerenter",u),a.removeEventListener("pointerleave",i)}}},[n.scrollArea,n.scrollHideDelay]),t||l?m(k,{"data-state":l?"visible":"hidden",...s,ref:o}):null});le.displayName="@mantine/core/ScrollAreaScrollbarHover";const Ce=c.forwardRef((e,o)=>{const{forceMount:t,...s}=e,n=P(),l=e.orientation==="horizontal",[r,a]=c.useState("hidden"),d=Y(()=>a("idle"),100);return c.useEffect(()=>{if(r==="idle"){const u=window.setTimeout(()=>a("hidden"),n.scrollHideDelay);return()=>window.clearTimeout(u)}},[r,n.scrollHideDelay]),c.useEffect(()=>{const{viewport:u}=n,i=l?"scrollLeft":"scrollTop";if(u){let h=u[i];const b=()=>{const f=u[i];h!==f&&(a("scrolling"),d()),h=f};return u.addEventListener("scroll",b),()=>u.removeEventListener("scroll",b)}},[n.viewport,l,d]),t||r!=="hidden"?m(U,{"data-state":r==="hidden"?"hidden":"visible",...s,ref:o,onPointerEnter:L(e.onPointerEnter,()=>a("interacting")),onPointerLeave:L(e.onPointerLeave,()=>a("idle"))}):null}),O=c.forwardRef((e,o)=>{const{forceMount:t,...s}=e,n=P(),{onScrollbarXEnabledChange:l,onScrollbarYEnabledChange:r}=n,a=e.orientation==="horizontal";return c.useEffect(()=>(a?l(!0):r(!0),()=>{a?l(!1):r(!1)}),[a,l,r]),n.type==="hover"?m(le,{...s,ref:o,forceMount:t}):n.type==="scroll"?m(Ce,{...s,ref:o,forceMount:t}):n.type==="auto"?m(k,{...s,ref:o,forceMount:t}):n.type==="always"?m(U,{...s,ref:o}):null});O.displayName="@mantine/core/ScrollAreaScrollbar";function Te(e,o=()=>{}){let t={left:e.scrollLeft,top:e.scrollTop},s=0;return function n(){const l={left:e.scrollLeft,top:e.scrollTop},r=t.left!==l.left,a=t.top!==l.top;(r||a)&&o(),t=l,s=window.requestAnimationFrame(n)}(),()=>window.cancelAnimationFrame(s)}const se=c.forwardRef((e,o)=>{const{style:t,...s}=e,n=P(),l=oe(),{onThumbPositionChange:r}=l,a=H(o,i=>l.onThumbChange(i)),d=c.useRef(void 0),u=Y(()=>{d.current&&(d.current(),d.current=void 0)},100);return c.useEffect(()=>{const{viewport:i}=n;if(i){const h=()=>{if(u(),!d.current){const b=Te(i,r);d.current=b,r()}};return r(),i.addEventListener("scroll",h),()=>i.removeEventListener("scroll",h)}},[n.viewport,u,r]),m("div",{"data-state":l.hasThumb?"visible":"hidden",...s,ref:a,style:{width:"var(--sa-thumb-width)",height:"var(--sa-thumb-height)",...t},onPointerDownCapture:L(e.onPointerDownCapture,i=>{const b=i.target.getBoundingClientRect(),f=i.clientX-b.left,p=i.clientY-b.top;l.onThumbPointerDown({x:f,y:p})}),onPointerUp:L(e.onPointerUp,l.onThumbPointerUp)})});se.displayName="@mantine/core/ScrollAreaThumb";const B=c.forwardRef((e,o)=>{const{forceMount:t,...s}=e,n=oe();return t||n.hasThumb?m(se,{ref:o,...s}):null});B.displayName="@mantine/core/ScrollAreaThumb";const ce=c.forwardRef(({children:e,style:o,...t},s)=>{const n=P(),l=H(s,n.onViewportChange);return m(M,{...t,ref:l,style:{overflowX:n.scrollbarXEnabled?"scroll":"hidden",overflowY:n.scrollbarYEnabled?"scroll":"hidden",...o},children:m("div",{style:{minWidth:"100%",display:"table"},ref:n.onContentChange,children:e})})});ce.displayName="@mantine/core/ScrollAreaViewport";var I={root:"m_d57069b5",viewport:"m_c0783ff9",viewportInner:"m_f8f631dd",scrollbar:"m_c44ba933",thumb:"m_d8b5e363",corner:"m_21657268"};const ae={scrollHideDelay:1e3,type:"hover",scrollbars:"xy"},Re=de((e,{scrollbarSize:o})=>({root:{"--scrollarea-scrollbar-size":fe(o)}})),V=G((e,o)=>{const t=F("ScrollArea",ae,e),{classNames:s,className:n,style:l,styles:r,unstyled:a,scrollbarSize:d,vars:u,type:i,scrollHideDelay:h,viewportProps:b,viewportRef:f,onScrollPositionChange:p,children:E,offsetScrollbars:g,scrollbars:w,onBottomReached:T,onTopReached:C,...x}=t,[D,R]=c.useState(!1),y=ue({name:"ScrollArea",props:t,classes:I,className:n,style:l,classNames:s,styles:r,unstyled:a,vars:u,varsResolver:Re});return ie(K,{type:i==="never"?"always":i,scrollHideDelay:h,ref:o,scrollbars:w,...y("root"),...x,children:[m(ce,{...b,...y("viewport",{style:b==null?void 0:b.style}),ref:f,"data-offset-scrollbars":g===!0?"xy":g||void 0,"data-scrollbars":w||void 0,onScroll:S=>{var j;(j=b==null?void 0:b.onScroll)==null||j.call(b,S),p==null||p({x:S.currentTarget.scrollLeft,y:S.currentTarget.scrollTop});const{scrollTop:v,scrollHeight:A,clientHeight:$}=S.currentTarget;v-(A-$)>=0&&(T==null||T()),v===0&&(C==null||C())},children:E}),(w==="xy"||w==="x")&&m(O,{...y("scrollbar"),orientation:"horizontal","data-hidden":i==="never"||void 0,forceMount:!0,onMouseEnter:()=>R(!0),onMouseLeave:()=>R(!1),children:m(B,{...y("thumb")})}),(w==="xy"||w==="y")&&m(O,{...y("scrollbar"),orientation:"vertical","data-hidden":i==="never"||void 0,forceMount:!0,onMouseEnter:()=>R(!0),onMouseLeave:()=>R(!1),children:m(B,{...y("thumb")})}),m(ve,{...y("corner"),"data-hovered":D||void 0,"data-hidden":i==="never"||void 0})]})});V.displayName="@mantine/core/ScrollArea";const _=G((e,o)=>{const{children:t,classNames:s,styles:n,scrollbarSize:l,scrollHideDelay:r,type:a,dir:d,offsetScrollbars:u,viewportRef:i,onScrollPositionChange:h,unstyled:b,variant:f,viewportProps:p,scrollbars:E,style:g,vars:w,onBottomReached:T,onTopReached:C,...x}=F("ScrollAreaAutosize",ae,e);return m(M,{...x,ref:o,style:[{display:"flex",overflow:"auto"},g],children:m(M,{style:{display:"flex",flexDirection:"column",flex:1},children:m(V,{classNames:s,styles:n,scrollHideDelay:r,scrollbarSize:l,type:a,dir:d,offsetScrollbars:u,viewportRef:i,onScrollPositionChange:h,unstyled:b,variant:f,viewportProps:p,vars:w,scrollbars:E,onBottomReached:T,onTopReached:C,children:t})})})});V.classes=I;_.displayName="@mantine/core/ScrollAreaAutosize";_.classes=I;V.Autosize=_;export{V as S};
