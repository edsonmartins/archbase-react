import{c as D}from"./index-673ae7f2.js";import{r as g}from"./index-8b3efc3f.js";const P=Symbol(),M=Symbol(),h="a",d="w";let E=(e,t)=>new Proxy(e,t);const O=Object.getPrototypeOf,R=new WeakMap,W=e=>e&&(R.has(e)?R.get(e):O(e)===Object.prototype||O(e)===Array.prototype),A=e=>typeof e=="object"&&e!==null,m=e=>{if(Array.isArray(e))return Array.from(e);const t=Object.getOwnPropertyDescriptors(e);return Object.values(t).forEach(n=>{n.configurable=!0}),Object.create(O(e),t)},j=e=>e[M]||e,$=(e,t,n,a)=>{if(!W(e))return e;let l=a&&a.get(e);if(!l){const f=j(e);l=(o=>Object.values(Object.getOwnPropertyDescriptors(o)).some(c=>!c.configurable&&!c.writable))(f)?[f,m(f)]:[f],a==null||a.set(e,l)}const[u,s]=l;let r=n&&n.get(u);return r&&r[1].f===!!s||(r=((f,o)=>{const c={f:o};let V=!1;const w=(p,i)=>{if(!V){let y=c[h].get(f);if(y||(y={},c[h].set(f,y)),p===d)y[d]=!0;else{let b=y[p];b||(b=new Set,y[p]=b),b.add(i)}}},v={get:(p,i)=>i===M?f:(w("k",i),$(Reflect.get(p,i),c[h],c.c,c.t)),has:(p,i)=>i===P?(V=!0,c[h].delete(f),!0):(w("h",i),Reflect.has(p,i)),getOwnPropertyDescriptor:(p,i)=>(w("o",i),Reflect.getOwnPropertyDescriptor(p,i)),ownKeys:p=>(w(d),Reflect.ownKeys(p))};return o&&(v.set=v.deleteProperty=()=>!1),[v,c]})(u,!!s),r[1].p=E(s||u,r[0]),n&&n.set(u,r)),r[1][h]=t,r[1].c=n,r[1].t=a,r[1].p},k=(e,t,n,a,l=Object.is)=>{if(l(e,t))return!1;if(!A(e)||!A(t))return!0;const u=n.get(j(e));if(!u)return!0;if(a){const r=a.get(e);if(r&&r.n===t)return r.g;a.set(e,{n:t,g:!1})}let s=null;try{for(const r of u.h||[])if(s=Reflect.has(e,r)!==Reflect.has(t,r),s)return s;if(u[d]===!0){if(s=((r,f)=>{const o=Reflect.ownKeys(r),c=Reflect.ownKeys(f);return o.length!==c.length||o.some((V,w)=>V!==c[w])})(e,t),s)return s}else for(const r of u.o||[])if(s=!!Reflect.getOwnPropertyDescriptor(e,r)!=!!Reflect.getOwnPropertyDescriptor(t,r),s)return s;for(const r of u.k||[])if(s=k(e[r],t[r],n,a,l),s)return s;return s===null&&(s=!0),s}finally{a&&a.set(e,{n:t,g:s})}};const S=e=>()=>{const[,n]=g.useReducer(c=>c+1,0),a=new WeakMap,l=g.useRef(),u=g.useRef(),s=g.useRef();g.useEffect(()=>{l.current=a,u.current!==s.current&&k(u.current,s.current,a,new WeakMap)&&(u.current=s.current,n())});const r=g.useCallback(c=>(s.current=c,u.current&&u.current!==c&&l.current&&!k(u.current,c,l.current,new WeakMap)?u.current:(u.current=c,c)),[]),f=e(r),o=g.useMemo(()=>new WeakMap,[]);return $(f,a,o)},K=D((e,t)=>({values:new Map,setValue:(n,a)=>e(l=>{const u=new Map(l.values);return u.set(n,a),{values:u}}),getValue:n=>t().values.get(n),existsValue:n=>t().values.has(n),clearValue:n=>e(a=>{const l=new Map(a.values);return l.delete(n),{values:l}}),clearAllValues:()=>e(n=>({values:new Map})),reset:()=>e(n=>({values:new Map}))})),x=S(K),I=(e="default")=>{const t=x();return{setValue:(o,c)=>{t.setValue(`${e}.${o}`,c)},getValue:o=>t.getValue(`${e}.${o}`),clearValue:o=>{t.clearValue(`${e}.${o}`)},existsValue:o=>t.existsValue(`${e}.${o}`),clearAllValues:()=>{for(const[o,c]of t.values.entries())o.startsWith(`${e}.`)&&t.clearValue(o)},reset:()=>{t.clearAllValues()},values:t.values}};export{I as u};
