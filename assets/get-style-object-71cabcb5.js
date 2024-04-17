function i(r,n){return Array.isArray(r)?[...r].reduce((u,f)=>({...u,...i(f,n)}),{}):typeof r=="function"?r(n):r??{}}export{i as g};
