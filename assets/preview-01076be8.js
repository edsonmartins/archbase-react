function T(n,r){return I(n)||z(n,r)||M(n,r)||j()}function j(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function M(n,r){if(n){if(typeof n=="string")return H(n,r);var t=Object.prototype.toString.call(n).slice(8,-1);if(t==="Object"&&n.constructor&&(t=n.constructor.name),t==="Map"||t==="Set")return Array.from(n);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return H(n,r)}}function H(n,r){(r==null||r>n.length)&&(r=n.length);for(var t=0,i=new Array(r);t<r;t++)i[t]=n[t];return i}function z(n,r){var t=n&&(typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"]);if(t!=null){var i=[],l=!0,e=!1,a,d;try{for(t=t.call(n);!(l=(a=t.next()).done)&&(i.push(a.value),!(r&&i.length===r));l=!0);}catch(u){e=!0,d=u}finally{try{!l&&t.return!=null&&t.return()}finally{if(e)throw d}}return i}}function I(n){if(Array.isArray(n))return n}const{useEffect:L,useGlobals:D,useParameter:G}=__STORYBOOK_MODULE_ADDONS__;var q=`#measureViewport {
  position: fixed;
  padding: 0;
  margin: 0;
  border-radius: 3px;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  pointer-events: none;
  user-select: none;
  mix-blend-mode: multiply;
}
.measure {
  position: absolute;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  letter-spacing: 0.05ch;
  font-weight: bold;
  color: var(--color);
  font-size: 1rem;
  block-size: 12px;
  margin-block: 10px;
}
.measure--width {
  left: 0;
  right: 0;
  background-image: 
    repeating-linear-gradient(
      transparent, 
      transparent 6px, 
      currentColor 6px, 
      currentColor 7px, 
      transparent 7px
    ),
    repeating-linear-gradient(
        90deg,
        transparent, 
        transparent 16px, 
        currentColor 17px, 
        transparent 17px,
        transparent 20px
    );
}
.measure--width.measure--top {
  top: 0;
}
.measure--width.measure--middle {
  top: calc(50vh - 1rem);
  z-index: -1;
}
.measure--width.measure--bottom {
  bottom: 0;
}
.measure--width.measure--none {
  display: none;
}
.measure--height {
  top: 0;
  bottom: 0;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  background-image: 
    repeating-linear-gradient(
      90deg,
      transparent, 
      transparent 6px, 
      currentColor 6px, 
      currentColor 7px, 
      transparent 7px
    ),
    repeating-linear-gradient(
        transparent, 
        transparent 16px, 
        currentColor 17px, 
        transparent 17px,
        transparent 20px
    );
}
.measure--height.measure--left {
  left: 0;
}
.measure--height.measure--middle {
  left: calc(50vw - 1rem);
}
.measure--height.measure--right {
  right: 0;
}
.measure--height.measure--none {
  display: none;
}
.measure-text {
  flex: 0 0 auto;
  padding-inline: 0.25rem;
  padding-block: 0.125rem 0.25rem;
  background: #fff;
}
.measure--prevent-overlap {
  justify-content: flex-start;
}
.measure--prevent-overlap .measure-text {
  margin-inline-start: calc(30%);
}
`,P=function(r){var t=D(),i=T(t,1),l=i[0].measureViewportActive,e=G("measureViewport"),a=document.createElement("div");return a.id="measureViewport",a.style.setProperty("--color",(e==null?void 0:e.color)||"#e9004e"),L(function(){function d(){var o,m,p,v,h,g,f,w,y,b,x,_,$,A,V=document.documentElement,W=V.clientHeight,C=V.clientWidth,S=window,k=S.innerHeight,E=S.innerWidth;function c(O){var s;switch(O){case"clientHeight":s=W;break;case"clientWidth":s=C;break;case"innerHeight":s=k;break;case"innerWidth":s=E;break;default:s=0;break}return s}a.innerHTML=`
      <style>`.concat(q,`</style>
        
      <div 
        class="measure measure--height measure--`).concat((e==null||(o=e.height)===null||o===void 0?void 0:o.display)||"left"," measure--").concat((e==null||(m=e.width)===null||m===void 0?void 0:m.display)==="middle"&&(e==null||(p=e.height)===null||p===void 0?void 0:p.display)==="middle"&&"prevent-overlap",`"
        `).concat((e==null||(v=e.height)===null||v===void 0?void 0:v.color)&&'style="--color: '.concat(e==null||(h=e.height)===null||h===void 0?void 0:h.color,'"'),`
      >
        <span 
        class="measure-text 
        aria-label="height: `).concat(c(e==null||(g=e.height)===null||g===void 0?void 0:g.measure)||k,`px">
        `).concat(c(e==null||(f=e.height)===null||f===void 0?void 0:f.measure)||k,`px
        </span>
        </div>
        
        <div 
          class="measure measure--width measure--`).concat((e==null||(w=e.width)===null||w===void 0?void 0:w.display)||"top"," measure--").concat((e==null||(y=e.width)===null||y===void 0?void 0:y.display)==="middle"&&(e==null||(b=e.height)===null||b===void 0?void 0:b.display)==="middle"&&"prevent-overlap",`"
        `).concat((e==null||(x=e.width)===null||x===void 0?void 0:x.color)&&'style="--color: '.concat(e==null||(_=e.width)===null||_===void 0?void 0:_.color,'"'),`
        
        >
        <span 
        class="measure-text" 
        aria-label="width: `).concat(c(e==null||($=e.width)===null||$===void 0?void 0:$.measure)||E,`px">
        `).concat(c(e==null||(A=e.width)===null||A===void 0?void 0:A.measure)||E,`px

        </span>
      </div>
      `)}if(l)d(),document.querySelector("body").insertAdjacentElement("beforeend",a);else{var u;(u=document.querySelector("#measureViewport"))===null||u===void 0||u.remove()}return window.addEventListener("resize",d),function(){var o;(o=document.querySelector("#measureViewport"))===null||o===void 0||o.remove(),window.removeEventListener("resize",d)}},[l]),r()},R=[P];export{R as decorators};
//# sourceMappingURL=preview-01076be8.js.map
