import{r as R,t as T,b as t}from"./ArchbaseRemoteApiService-1c9bc946.js";function I(g,a){var i,c;R(1,arguments);var e=T(g);if(isNaN(e.getTime()))throw new RangeError("Invalid time value");var o=String((i=a==null?void 0:a.format)!==null&&i!==void 0?i:"extended"),r=String((c=a==null?void 0:a.representation)!==null&&c!==void 0?c:"complete");if(o!=="extended"&&o!=="basic")throw new RangeError("format must be 'extended' or 'basic'");if(r!=="date"&&r!=="time"&&r!=="complete")throw new RangeError("representation must be 'date', 'time', or 'complete'");var n="",v="",m=o==="extended"?"-":"",s=o==="extended"?":":"";if(r!=="time"){var u=t(e.getDate(),2),f=t(e.getMonth()+1,2),h=t(e.getFullYear(),4);n="".concat(h).concat(m).concat(f).concat(m).concat(u)}if(r!=="date"){var d=e.getTimezoneOffset();if(d!==0){var l=Math.abs(d),p=t(Math.floor(l/60),2),w=t(l%60,2),x=d<0?"+":"-";v="".concat(x).concat(p,":").concat(w)}else v="Z";var b=t(e.getHours(),2),D=t(e.getMinutes(),2),M=t(e.getSeconds(),2),S=n===""?"":"T",E=[b,D,M].join(s);n="".concat(n).concat(S).concat(E).concat(v)}return n}export{I as f};
//# sourceMappingURL=index-050f656b.js.map
