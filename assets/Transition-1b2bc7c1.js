import{j as h,F as D}from"./jsx-runtime-c9381026.js";import{r as o,b as j}from"./polymorphic-factory-8fbd487e.js";import{r as m}from"./index-8b3efc3f.js";import{R as q}from"./index-a38d0dca.js";import{u as E}from"./use-reduced-motion-98306cff.js";import{u as C}from"./use-did-update-bccd292e.js";const p=t=>({in:{opacity:1,transform:"scale(1)"},out:{opacity:0,transform:`scale(.9) translateY(${o(t==="bottom"?10:-10)})`},transitionProperty:"transform, opacity"}),w={fade:{in:{opacity:1},out:{opacity:0},transitionProperty:"opacity"},"fade-up":{in:{opacity:1,transform:"translateY(0)"},out:{opacity:0,transform:`translateY(${o(30)}`},transitionProperty:"opacity, transform"},"fade-down":{in:{opacity:1,transform:"translateY(0)"},out:{opacity:0,transform:`translateY(${o(-30)}`},transitionProperty:"opacity, transform"},"fade-left":{in:{opacity:1,transform:"translateX(0)"},out:{opacity:0,transform:`translateX(${o(30)}`},transitionProperty:"opacity, transform"},"fade-right":{in:{opacity:1,transform:"translateX(0)"},out:{opacity:0,transform:`translateX(${o(-30)}`},transitionProperty:"opacity, transform"},scale:{in:{opacity:1,transform:"scale(1)"},out:{opacity:0,transform:"scale(0)"},common:{transformOrigin:"top"},transitionProperty:"transform, opacity"},"scale-y":{in:{opacity:1,transform:"scaleY(1)"},out:{opacity:0,transform:"scaleY(0)"},common:{transformOrigin:"top"},transitionProperty:"transform, opacity"},"scale-x":{in:{opacity:1,transform:"scaleX(1)"},out:{opacity:0,transform:"scaleX(0)"},common:{transformOrigin:"left"},transitionProperty:"transform, opacity"},"skew-up":{in:{opacity:1,transform:"translateY(0) skew(0deg, 0deg)"},out:{opacity:0,transform:`translateY(${o(-20)}) skew(-10deg, -5deg)`},common:{transformOrigin:"top"},transitionProperty:"transform, opacity"},"skew-down":{in:{opacity:1,transform:"translateY(0) skew(0deg, 0deg)"},out:{opacity:0,transform:`translateY(${o(20)}) skew(-10deg, -5deg)`},common:{transformOrigin:"bottom"},transitionProperty:"transform, opacity"},"rotate-left":{in:{opacity:1,transform:"translateY(0) rotate(0deg)"},out:{opacity:0,transform:`translateY(${o(20)}) rotate(-5deg)`},common:{transformOrigin:"bottom"},transitionProperty:"transform, opacity"},"rotate-right":{in:{opacity:1,transform:"translateY(0) rotate(0deg)"},out:{opacity:0,transform:`translateY(${o(20)}) rotate(5deg)`},common:{transformOrigin:"top"},transitionProperty:"transform, opacity"},"slide-down":{in:{opacity:1,transform:"translateY(0)"},out:{opacity:0,transform:"translateY(-100%)"},common:{transformOrigin:"top"},transitionProperty:"transform, opacity"},"slide-up":{in:{opacity:1,transform:"translateY(0)"},out:{opacity:0,transform:"translateY(100%)"},common:{transformOrigin:"bottom"},transitionProperty:"transform, opacity"},"slide-left":{in:{opacity:1,transform:"translateX(0)"},out:{opacity:0,transform:"translateX(100%)"},common:{transformOrigin:"left"},transitionProperty:"transform, opacity"},"slide-right":{in:{opacity:1,transform:"translateX(0)"},out:{opacity:0,transform:"translateX(-100%)"},common:{transformOrigin:"right"},transitionProperty:"transform, opacity"},pop:{...p("bottom"),common:{transformOrigin:"center center"}},"pop-bottom-left":{...p("bottom"),common:{transformOrigin:"bottom left"}},"pop-bottom-right":{...p("bottom"),common:{transformOrigin:"bottom right"}},"pop-top-left":{...p("top"),common:{transformOrigin:"top left"}},"pop-top-right":{...p("top"),common:{transformOrigin:"top right"}}},k={entering:"in",entered:"in",exiting:"out",exited:"out","pre-exiting":"out","pre-entering":"out"};function H({transition:t,state:i,duration:e,timingFunction:n}){const a={transitionDuration:`${e}ms`,transitionTimingFunction:n};return typeof t=="string"?t in w?{transitionProperty:w[t].transitionProperty,...a,...w[t].common,...w[t][k[i]]}:{}:{transitionProperty:t.transitionProperty,...a,...t.common,...t[k[i]]}}function I({duration:t,exitDuration:i,timingFunction:e,mounted:n,onEnter:a,onExit:s,onEntered:T,onExited:Y,enterDelay:f,exitDelay:y}){const O=j(),b=E(),u=O.respectReducedMotion?b:!1,[l,g]=m.useState(u?0:t),[x,d]=m.useState(n?"entered":"exited"),R=m.useRef(-1),F=m.useRef(-1),X=m.useRef(-1),S=r=>{const c=r?a:s,P=r?T:Y;window.clearTimeout(R.current);const $=u?0:r?t:i;g($),$===0?(typeof c=="function"&&c(),typeof P=="function"&&P(),d(r?"entered":"exited")):X.current=requestAnimationFrame(()=>{q.flushSync(()=>{d(r?"pre-entering":"pre-exiting")}),X.current=requestAnimationFrame(()=>{typeof c=="function"&&c(),d(r?"entering":"exiting"),R.current=window.setTimeout(()=>{typeof P=="function"&&P(),d(r?"entered":"exited")},$)})})},A=r=>{if(window.clearTimeout(F.current),typeof(r?f:y)!="number"){S(r);return}F.current=window.setTimeout(()=>{S(r)},r?f:y)};return C(()=>{A(n)},[n]),m.useEffect(()=>()=>{window.clearTimeout(R.current),cancelAnimationFrame(X.current)},[]),{transitionDuration:l,transitionStatus:x,transitionTimingFunction:e||"ease"}}function N({keepMounted:t,transition:i="fade",duration:e=250,exitDuration:n=e,mounted:a,children:s,timingFunction:T="ease",onExit:Y,onEntered:f,onEnter:y,onExited:O,enterDelay:b,exitDelay:u}){const{transitionDuration:l,transitionStatus:g,transitionTimingFunction:x}=I({mounted:a,exitDuration:n,duration:e,timingFunction:T,onExit:Y,onEntered:f,onEnter:y,onExited:O,enterDelay:b,exitDelay:u});return l===0?a?h(D,{children:s({})}):t?s({display:"none"}):null:g==="exited"?t?s({display:"none"}):null:h(D,{children:s(H({transition:i,duration:l,state:g,timingFunction:x}))})}N.displayName="@mantine/core/Transition";export{N as T};
