import{r as D,_ as T,t as w}from"./index-d0400ba7.js";var p=6e4,g=36e5,W=1e3;function _(t){return D(1,arguments),t instanceof Date||T(t)==="object"&&Object.prototype.toString.call(t)==="[object Date]"}function R(t,e){var r;D(1,arguments);var a=w((r=e==null?void 0:e.additionalDigits)!==null&&r!==void 0?r:2);if(a!==2&&a!==1&&a!==0)throw new RangeError("additionalDigits must be 0, 1 or 2");if(!(typeof t=="string"||Object.prototype.toString.call(t)==="[object String]"))return new Date(NaN);var n=C(t),i;if(n.date){var l=x(n.date,a);i=S(l.restDateString,l.year)}if(!i||isNaN(i.getTime()))return new Date(NaN);var f=i.getTime(),s=0,o;if(n.time&&(s=b(n.time),isNaN(s)))return new Date(NaN);if(n.timezone){if(o=O(n.timezone),isNaN(o))return new Date(NaN)}else{var u=new Date(f+s),c=new Date(0);return c.setFullYear(u.getUTCFullYear(),u.getUTCMonth(),u.getUTCDate()),c.setHours(u.getUTCHours(),u.getUTCMinutes(),u.getUTCSeconds(),u.getUTCMilliseconds()),c}return new Date(f+s+o)}var d={dateTimeDelimiter:/[T ]/,timeZoneDelimiter:/[Z ]/i,timezone:/([Z+-].*)$/},U=/^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/,h=/^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/,I=/^([+-])(\d{2})(?::?(\d{2}))?$/;function C(t){var e={},r=t.split(d.dateTimeDelimiter),a;if(r.length>2)return e;if(/:/.test(r[0])?a=r[0]:(e.date=r[0],a=r[1],d.timeZoneDelimiter.test(e.date)&&(e.date=t.split(d.timeZoneDelimiter)[0],a=t.substr(e.date.length,t.length))),a){var n=d.timezone.exec(a);n?(e.time=a.replace(n[1],""),e.timezone=n[1]):e.time=a}return e}function x(t,e){var r=new RegExp("^(?:(\\d{4}|[+-]\\d{"+(4+e)+"})|(\\d{2}|[+-]\\d{"+(2+e)+"})$)"),a=t.match(r);if(!a)return{year:NaN,restDateString:""};var n=a[1]?parseInt(a[1]):null,i=a[2]?parseInt(a[2]):null;return{year:i===null?n:i*100,restDateString:t.slice((a[1]||a[2]).length)}}function S(t,e){if(e===null)return new Date(NaN);var r=t.match(U);if(!r)return new Date(NaN);var a=!!r[4],n=v(r[1]),i=v(r[2])-1,l=v(r[3]),f=v(r[4]),s=v(r[5])-1;if(a)return $(e,f,s)?z(e,f,s):new Date(NaN);var o=new Date(0);return!M(e,i,l)||!Z(e,n)?new Date(NaN):(o.setUTCFullYear(e,i,Math.max(n,l)),o)}function v(t){return t?parseInt(t):1}function b(t){var e=t.match(h);if(!e)return NaN;var r=m(e[1]),a=m(e[2]),n=m(e[3]);return j(r,a,n)?r*g+a*p+n*1e3:NaN}function m(t){return t&&parseFloat(t.replace(",","."))||0}function O(t){if(t==="Z")return 0;var e=t.match(I);if(!e)return 0;var r=e[1]==="+"?-1:1,a=parseInt(e[2]),n=e[3]&&parseInt(e[3])||0;return y(a,n)?r*(a*g+n*p):NaN}function z(t,e,r){var a=new Date(0);a.setUTCFullYear(t,0,4);var n=a.getUTCDay()||7,i=(e-1)*7+r+1-n;return a.setUTCDate(a.getUTCDate()+i),a}var Y=[31,null,31,30,31,30,31,31,30,31,30,31];function N(t){return t%400===0||t%4===0&&t%100!==0}function M(t,e,r){return e>=0&&e<=11&&r>=1&&r<=(Y[e]||(N(t)?29:28))}function Z(t,e){return e>=1&&e<=(N(t)?366:365)}function $(t,e,r){return e>=1&&e<=53&&r>=0&&r<=6}function j(t,e,r){return t===24?e===0&&r===0:r>=0&&r<60&&e>=0&&e<60&&t>=0&&t<25}function y(t,e){return e>=0&&e<=59}export{p as a,W as b,_ as i,g as m,R as p};
