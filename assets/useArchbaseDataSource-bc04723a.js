import{r as a}from"./index-8b3efc3f.js";import{A as l}from"./useArchbaseDataSourceListener-92dd263c.js";function h(e){a.useEffect(e,[])}function p(e,r){const t=a.useRef(!1);a.useEffect(()=>{if(!t.current){t.current=!0;return}e()},r)}function D(e){a.useEffect(()=>()=>e(),[])}const m=()=>{const[,e]=a.useState(0);return()=>e(r=>r+1)},A=e=>{const{initialData:r,name:t,label:n,initialDataSource:o,onLoadComplete:c,store:s,validator:i}=e,f=()=>s&&s.existsValue(t)?s.getValue(t):o||new l(t,{records:r,grandTotalRecords:r.length,currentPage:0,totalPages:0,pageSize:0,validator:i},n),[u,d]=a.useState(f());return a.useEffect(()=>{s&&s.setValue(t,u),c&&c(u)},[t]),{dataSource:u}};export{A as a,h as b,p as c,D as d,m as u};
