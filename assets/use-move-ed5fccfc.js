import{r as o}from"./index-8b3efc3f.js";import{c as m}from"./clamp-73f6bef2.js";function T(u){return{x:m(u.x,0,1),y:m(u.y,0,1)}}function D(u,n,v="ltr"){const d=o.useRef(null),r=o.useRef(!1),s=o.useRef(!1),E=o.useRef(0),[x,l]=o.useState(!1);return o.useEffect(()=>{r.current=!0},[]),o.useEffect(()=>{const t=d.current,p=({x:e,y:M})=>{cancelAnimationFrame(E.current),E.current=requestAnimationFrame(()=>{if(r.current&&t){t.style.userSelect="none";const c=t.getBoundingClientRect();if(c.width&&c.height){const g=m((e-c.left)/c.width,0,1);u({x:v==="ltr"?g:1-g,y:m((M-c.top)/c.height,0,1)})}}})},y=()=>{document.addEventListener("mousemove",f),document.addEventListener("mouseup",i),document.addEventListener("touchmove",a),document.addEventListener("touchend",i)},h=()=>{document.removeEventListener("mousemove",f),document.removeEventListener("mouseup",i),document.removeEventListener("touchmove",a),document.removeEventListener("touchend",i)},b=()=>{!s.current&&r.current&&(s.current=!0,typeof(n==null?void 0:n.onScrubStart)=="function"&&n.onScrubStart(),l(!0),y())},i=()=>{s.current&&r.current&&(s.current=!1,l(!1),h(),setTimeout(()=>{typeof(n==null?void 0:n.onScrubEnd)=="function"&&n.onScrubEnd()},0))},S=e=>{b(),e.preventDefault(),f(e)},f=e=>p({x:e.clientX,y:e.clientY}),L=e=>{e.cancelable&&e.preventDefault(),b(),a(e)},a=e=>{e.cancelable&&e.preventDefault(),p({x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY})};return t==null||t.addEventListener("mousedown",S),t==null||t.addEventListener("touchstart",L,{passive:!1}),()=>{t&&(t.removeEventListener("mousedown",S),t.removeEventListener("touchstart",L))}},[v,u]),{ref:d,active:x}}export{T as c,D as u};
