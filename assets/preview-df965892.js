import{j as H}from"./jsx-runtime-2ca98591.js";import{u as ce,q as me,s as ge}from"./ArchbaseRemoteApiService-1c9bc946.js";import{b as W,r as F}from"./index-402471b7.js";import{g as he}from"./_commonjsHelpers-de833af9.js";import{d as be}from"./DemoContainerIOC-7bde7866.js";/* empty css                 */import{u as ye}from"./use-local-storage-1df931ea.js";import{b as ve}from"./MantineProvider-c53063b6.js";import"./Box-603b1b1a.js";import"./createReactComponent-b82b540a.js";import"./Button-86c3033b.js";import"./Text-6036efe5.js";import"./index-29301433.js";import"./use-isomorphic-effect-d441b347.js";import"./index-9d475cdf.js";import"./Group-d6868f5c.js";import"./ArchbaseAdvancedTabs-2e888216.js";import"./Paper-165ce658.js";import"./use-window-event-f88e3fb7.js";import"./ArchbaseFloatingWindow-5a72a221.js";import"./extends-98964cd2.js";import"./___vite-browser-external_commonjs-proxy-19bb288c.js";import"./_commonjs-dynamic-modules-302442b1.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-20a9f65a.js";var C="DARK_MODE";const{global:Se}=__STORYBOOK_MODULE_GLOBAL__;__STORYBOOK_MODULE_CLIENT_LOGGER__;function h(){return h=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},h.apply(this,arguments)}function Fe(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function b(e,t){return b=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(r,a){return r.__proto__=a,r},b(e,t)}function we(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,b(e,t)}function L(e){return L=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},L(e)}function xe(e){return Function.toString.call(e).indexOf("[native code]")!==-1}function Oe(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function O(e,t,r){return Oe()?O=Reflect.construct.bind():O=function(a,n,o){var i=[null];i.push.apply(i,n);var s=Function.bind.apply(a,i),l=new s;return o&&b(l,o.prototype),l},O.apply(null,arguments)}function $(e){var t=typeof Map=="function"?new Map:void 0;return $=function(r){if(r===null||!xe(r))return r;if(typeof r!="function")throw new TypeError("Super expression must either be null or a function");if(typeof t<"u"){if(t.has(r))return t.get(r);t.set(r,a)}function a(){return O(r,arguments,L(this).constructor)}return a.prototype=Object.create(r.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b(a,r)},$(e)}var Ce={1:`Passed invalid arguments to hsl, please pass multiple numbers e.g. hsl(360, 0.75, 0.4) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75 }).

`,2:`Passed invalid arguments to hsla, please pass multiple numbers e.g. hsla(360, 0.75, 0.4, 0.7) or an object e.g. rgb({ hue: 255, saturation: 0.4, lightness: 0.75, alpha: 0.7 }).

`,3:`Passed an incorrect argument to a color function, please pass a string representation of a color.

`,4:`Couldn't generate valid rgb string from %s, it returned %s.

`,5:`Couldn't parse the color string. Please provide the color as a string in hex, rgb, rgba, hsl or hsla notation.

`,6:`Passed invalid arguments to rgb, please pass multiple numbers e.g. rgb(255, 205, 100) or an object e.g. rgb({ red: 255, green: 205, blue: 100 }).

`,7:`Passed invalid arguments to rgba, please pass multiple numbers e.g. rgb(255, 205, 100, 0.75) or an object e.g. rgb({ red: 255, green: 205, blue: 100, alpha: 0.75 }).

`,8:`Passed invalid argument to toColorString, please pass a RgbColor, RgbaColor, HslColor or HslaColor object.

`,9:`Please provide a number of steps to the modularScale helper.

`,10:`Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,11:`Invalid value passed as base to modularScale, expected number or em string but got "%s"

`,12:`Expected a string ending in "px" or a number passed as the first argument to %s(), got "%s" instead.

`,13:`Expected a string ending in "px" or a number passed as the second argument to %s(), got "%s" instead.

`,14:`Passed invalid pixel value ("%s") to %s(), please pass a value like "12px" or 12.

`,15:`Passed invalid base value ("%s") to %s(), please pass a value like "12px" or 12.

`,16:`You must provide a template to this method.

`,17:`You passed an unsupported selector state to this method.

`,18:`minScreen and maxScreen must be provided as stringified numbers with the same units.

`,19:`fromSize and toSize must be provided as stringified numbers with the same units.

`,20:`expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,21:"expects the objects in the first argument array to have the properties `prop`, `fromSize`, and `toSize`.\n\n",22:"expects the first argument object to have the properties `prop`, `fromSize`, and `toSize`.\n\n",23:`fontFace expects a name of a font-family.

`,24:`fontFace expects either the path to the font file(s) or a name of a local copy.

`,25:`fontFace expects localFonts to be an array.

`,26:`fontFace expects fileFormats to be an array.

`,27:`radialGradient requries at least 2 color-stops to properly render.

`,28:`Please supply a filename to retinaImage() as the first argument.

`,29:`Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,30:"Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",31:`The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation

`,32:`To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])
To pass a single animation please supply them in simple values, e.g. animation('rotate', '2s')

`,33:`The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation

`,34:`borderRadius expects a radius value as a string or number as the second argument.

`,35:`borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,36:`Property must be a string value.

`,37:`Syntax Error at %s.

`,38:`Formula contains a function that needs parentheses at %s.

`,39:`Formula is missing closing parenthesis at %s.

`,40:`Formula has too many closing parentheses at %s.

`,41:`All values in a formula must have the same unit or be unitless.

`,42:`Please provide a number of steps to the modularScale helper.

`,43:`Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,44:`Invalid value passed as base to modularScale, expected number or em/rem string but got %s.

`,45:`Passed invalid argument to hslToColorString, please pass a HslColor or HslaColor object.

`,46:`Passed invalid argument to rgbToColorString, please pass a RgbColor or RgbaColor object.

`,47:`minScreen and maxScreen must be provided as stringified numbers with the same units.

`,48:`fromSize and toSize must be provided as stringified numbers with the same units.

`,49:`Expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,50:`Expects the objects in the first argument array to have the properties prop, fromSize, and toSize.

`,51:`Expects the first argument object to have the properties prop, fromSize, and toSize.

`,52:`fontFace expects either the path to the font file(s) or a name of a local copy.

`,53:`fontFace expects localFonts to be an array.

`,54:`fontFace expects fileFormats to be an array.

`,55:`fontFace expects a name of a font-family.

`,56:`linearGradient requries at least 2 color-stops to properly render.

`,57:`radialGradient requries at least 2 color-stops to properly render.

`,58:`Please supply a filename to retinaImage() as the first argument.

`,59:`Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,60:"Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",61:`Property must be a string value.

`,62:`borderRadius expects a radius value as a string or number as the second argument.

`,63:`borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,64:`The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation.

`,65:`To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])\\nTo pass a single animation please supply them in simple values, e.g. animation('rotate', '2s').

`,66:`The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation.

`,67:`You must provide a template to this method.

`,68:`You passed an unsupported selector state to this method.

`,69:`Expected a string ending in "px" or a number passed as the first argument to %s(), got %s instead.

`,70:`Expected a string ending in "px" or a number passed as the second argument to %s(), got %s instead.

`,71:`Passed invalid pixel value %s to %s(), please pass a value like "12px" or 12.

`,72:`Passed invalid base value %s to %s(), please pass a value like "12px" or 12.

`,73:`Please provide a valid CSS variable.

`,74:`CSS variable not found and no default was provided.

`,75:`important requires a valid style object, got a %s instead.

`,76:`fromSize and toSize must be provided as stringified numbers with the same units as minScreen and maxScreen.

`,77:`remToPx expects a value in "rem" but you provided it in "%s".

`,78:`base must be set in "px" or "%" but you set it in "%s".
`};function ke(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var a=t[0],n=[],o;for(o=1;o<t.length;o+=1)n.push(t[o]);return n.forEach(function(i){a=a.replace(/%[a-z]/,i)}),a}var m=function(e){we(t,e);function t(r){for(var a,n=arguments.length,o=new Array(n>1?n-1:0),i=1;i<n;i++)o[i-1]=arguments[i];return a=e.call(this,ke.apply(void 0,[Ce[r]].concat(o)))||this,Fe(a)}return t}($(Error));function A(e){return Math.round(e*255)}function Te(e,t,r){return A(e)+","+A(t)+","+A(r)}function y(e,t,r,a){if(a===void 0&&(a=Te),t===0)return a(r,r,r);var n=(e%360+360)%360/60,o=(1-Math.abs(2*r-1))*t,i=o*(1-Math.abs(n%2-1)),s=0,l=0,f=0;n>=0&&n<1?(s=o,l=i):n>=1&&n<2?(s=i,l=o):n>=2&&n<3?(l=o,f=i):n>=3&&n<4?(l=i,f=o):n>=4&&n<5?(s=i,f=o):n>=5&&n<6&&(s=o,f=i);var d=r-o/2,p=s+d,c=l+d,j=f+d;return a(p,c,j)}var J={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"639",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"};function Ie(e){if(typeof e!="string")return e;var t=e.toLowerCase();return J[t]?"#"+J[t]:e}var Pe=/^#[a-fA-F0-9]{6}$/,Ee=/^#[a-fA-F0-9]{8}$/,_e=/^#[a-fA-F0-9]{3}$/,je=/^#[a-fA-F0-9]{4}$/,D=/^rgb\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*\)$/i,Ae=/^rgb(?:a)?\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i,De=/^hsl\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*\)$/i,Re=/^hsl(?:a)?\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i;function P(e){if(typeof e!="string")throw new m(3);var t=Ie(e);if(t.match(Pe))return{red:parseInt(""+t[1]+t[2],16),green:parseInt(""+t[3]+t[4],16),blue:parseInt(""+t[5]+t[6],16)};if(t.match(Ee)){var r=parseFloat((parseInt(""+t[7]+t[8],16)/255).toFixed(2));return{red:parseInt(""+t[1]+t[2],16),green:parseInt(""+t[3]+t[4],16),blue:parseInt(""+t[5]+t[6],16),alpha:r}}if(t.match(_e))return{red:parseInt(""+t[1]+t[1],16),green:parseInt(""+t[2]+t[2],16),blue:parseInt(""+t[3]+t[3],16)};if(t.match(je)){var a=parseFloat((parseInt(""+t[4]+t[4],16)/255).toFixed(2));return{red:parseInt(""+t[1]+t[1],16),green:parseInt(""+t[2]+t[2],16),blue:parseInt(""+t[3]+t[3],16),alpha:a}}var n=D.exec(t);if(n)return{red:parseInt(""+n[1],10),green:parseInt(""+n[2],10),blue:parseInt(""+n[3],10)};var o=Ae.exec(t.substring(0,50));if(o)return{red:parseInt(""+o[1],10),green:parseInt(""+o[2],10),blue:parseInt(""+o[3],10),alpha:parseFloat(""+o[4])>1?parseFloat(""+o[4])/100:parseFloat(""+o[4])};var i=De.exec(t);if(i){var s=parseInt(""+i[1],10),l=parseInt(""+i[2],10)/100,f=parseInt(""+i[3],10)/100,d="rgb("+y(s,l,f)+")",p=D.exec(d);if(!p)throw new m(4,t,d);return{red:parseInt(""+p[1],10),green:parseInt(""+p[2],10),blue:parseInt(""+p[3],10)}}var c=Re.exec(t.substring(0,50));if(c){var j=parseInt(""+c[1],10),pe=parseInt(""+c[2],10)/100,de=parseInt(""+c[3],10)/100,U="rgb("+y(j,pe,de)+")",S=D.exec(U);if(!S)throw new m(4,t,U);return{red:parseInt(""+S[1],10),green:parseInt(""+S[2],10),blue:parseInt(""+S[3],10),alpha:parseFloat(""+c[4])>1?parseFloat(""+c[4])/100:parseFloat(""+c[4])}}throw new m(5)}function Be(e){var t=e.red/255,r=e.green/255,a=e.blue/255,n=Math.max(t,r,a),o=Math.min(t,r,a),i=(n+o)/2;if(n===o)return e.alpha!==void 0?{hue:0,saturation:0,lightness:i,alpha:e.alpha}:{hue:0,saturation:0,lightness:i};var s,l=n-o,f=i>.5?l/(2-n-o):l/(n+o);switch(n){case t:s=(r-a)/l+(r<a?6:0);break;case r:s=(a-t)/l+2;break;default:s=(t-r)/l+4;break}return s*=60,e.alpha!==void 0?{hue:s,saturation:f,lightness:i,alpha:e.alpha}:{hue:s,saturation:f,lightness:i}}function ne(e){return Be(P(e))}var Me=function(e){return e.length===7&&e[1]===e[2]&&e[3]===e[4]&&e[5]===e[6]?"#"+e[1]+e[3]+e[5]:e},q=Me;function g(e){var t=e.toString(16);return t.length===1?"0"+t:t}function R(e){return g(Math.round(e*255))}function ze(e,t,r){return q("#"+R(e)+R(t)+R(r))}function k(e,t,r){return y(e,t,r,ze)}function He(e,t,r){if(typeof e=="number"&&typeof t=="number"&&typeof r=="number")return k(e,t,r);if(typeof e=="object"&&t===void 0&&r===void 0)return k(e.hue,e.saturation,e.lightness);throw new m(1)}function Le(e,t,r,a){if(typeof e=="number"&&typeof t=="number"&&typeof r=="number"&&typeof a=="number")return a>=1?k(e,t,r):"rgba("+y(e,t,r)+","+a+")";if(typeof e=="object"&&t===void 0&&r===void 0&&a===void 0)return e.alpha>=1?k(e.hue,e.saturation,e.lightness):"rgba("+y(e.hue,e.saturation,e.lightness)+","+e.alpha+")";throw new m(2)}function N(e,t,r){if(typeof e=="number"&&typeof t=="number"&&typeof r=="number")return q("#"+g(e)+g(t)+g(r));if(typeof e=="object"&&t===void 0&&r===void 0)return q("#"+g(e.red)+g(e.green)+g(e.blue));throw new m(6)}function Y(e,t,r,a){if(typeof e=="string"&&typeof t=="number"){var n=P(e);return"rgba("+n.red+","+n.green+","+n.blue+","+t+")"}else{if(typeof e=="number"&&typeof t=="number"&&typeof r=="number"&&typeof a=="number")return a>=1?N(e,t,r):"rgba("+e+","+t+","+r+","+a+")";if(typeof e=="object"&&t===void 0&&r===void 0&&a===void 0)return e.alpha>=1?N(e.red,e.green,e.blue):"rgba("+e.red+","+e.green+","+e.blue+","+e.alpha+")"}throw new m(7)}var $e=function(e){return typeof e.red=="number"&&typeof e.green=="number"&&typeof e.blue=="number"&&(typeof e.alpha!="number"||typeof e.alpha>"u")},qe=function(e){return typeof e.red=="number"&&typeof e.green=="number"&&typeof e.blue=="number"&&typeof e.alpha=="number"},Ne=function(e){return typeof e.hue=="number"&&typeof e.saturation=="number"&&typeof e.lightness=="number"&&(typeof e.alpha!="number"||typeof e.alpha>"u")},Ge=function(e){return typeof e.hue=="number"&&typeof e.saturation=="number"&&typeof e.lightness=="number"&&typeof e.alpha=="number"};function oe(e){if(typeof e!="object")throw new m(8);if(qe(e))return Y(e);if($e(e))return N(e);if(Ge(e))return Le(e);if(Ne(e))return He(e);throw new m(8)}function ie(e,t,r){return function(){var a=r.concat(Array.prototype.slice.call(arguments));return a.length>=t?e.apply(this,a):ie(e,t,a)}}function E(e){return ie(e,e.length,[])}function _(e,t,r){return Math.max(e,Math.min(t,r))}function Ke(e,t){if(t==="transparent")return t;var r=ne(t);return oe(h({},r,{lightness:_(0,1,r.lightness-parseFloat(e))}))}E(Ke);function Ye(e,t){if(t==="transparent")return t;var r=ne(t);return oe(h({},r,{lightness:_(0,1,r.lightness+parseFloat(e))}))}E(Ye);function Ue(e,t){if(t==="transparent")return t;var r=P(t),a=typeof r.alpha=="number"?r.alpha:1,n=h({},r,{alpha:_(0,1,(a*100+parseFloat(e)*100)/100)});return Y(n)}E(Ue);function We(e,t){if(t==="transparent")return t;var r=P(t),a=typeof r.alpha=="number"?r.alpha:1,n=h({},r,{alpha:_(0,1,+(a*100-parseFloat(e)*100).toFixed(2)/100)});return Y(n)}var Je=E(We),Qe=Je,u={primary:"#FF4785",secondary:"#029CFD",tertiary:"#FAFBFC",ancillary:"#22a699",orange:"#FC521F",gold:"#FFAE00",green:"#66BF3C",seafoam:"#37D5D3",purple:"#6F2CAC",ultraviolet:"#2A0481",lightest:"#FFFFFF",lighter:"#F7FAFC",light:"#EEF3F6",mediumlight:"#ECF4F9",medium:"#D9E8F2",mediumdark:"#73828C",dark:"#5C6870",darker:"#454E54",darkest:"#2E3438",border:"hsla(203, 50%, 30%, 0.15)",positive:"#66BF3C",negative:"#FF4400",warning:"#E69D00",critical:"#FFFFFF",defaultText:"#2E3438",inverseText:"#FFFFFF",positiveText:"#448028",negativeText:"#D43900",warningText:"#A15C20"},Q={app:"#F6F9FC",bar:u.lightest,content:u.lightest,gridCellSize:10,hoverable:Qe(.93,u.secondary),positive:"#E1FFD4",negative:"#FEDED2",warning:"#FFF5CF",critical:"#FF4400"},T={fonts:{base:['"Nunito Sans"',"-apple-system",'".SFNSText-Regular"','"San Francisco"',"BlinkMacSystemFont",'"Segoe UI"','"Helvetica Neue"',"Helvetica","Arial","sans-serif"].join(", "),mono:["ui-monospace","Menlo","Monaco",'"Roboto Mono"','"Oxygen Mono"','"Ubuntu Monospace"','"Source Code Pro"','"Droid Sans Mono"','"Courier New"',"monospace"].join(", ")},weight:{regular:400,bold:700},size:{s1:12,s2:14,s3:16,m1:20,m2:24,m3:28,l1:32,l2:40,l3:48,code:90}},Xe={base:"light",colorPrimary:"#FF4785",colorSecondary:"#029CFD",appBg:Q.app,appContentBg:u.lightest,appBorderColor:u.border,appBorderRadius:4,fontBase:T.fonts.base,fontCode:T.fonts.mono,textColor:u.darkest,textInverseColor:u.lightest,textMutedColor:u.mediumdark,barTextColor:u.mediumdark,barSelectedColor:u.secondary,barBg:u.lightest,buttonBg:Q.app,buttonBorder:u.medium,booleanBg:u.mediumlight,booleanSelectedBg:u.lightest,inputBg:u.lightest,inputBorder:u.border,inputTextColor:u.darkest,inputBorderRadius:4},X=Xe,Ze={base:"dark",colorPrimary:"#FF4785",colorSecondary:"#029CFD",appBg:"#222425",appContentBg:"#1B1C1D",appBorderColor:"rgba(255,255,255,.1)",appBorderRadius:4,fontBase:T.fonts.base,fontCode:T.fonts.mono,textColor:"#C9CDCF",textInverseColor:"#222425",textMutedColor:"#798186",barTextColor:"#798186",barSelectedColor:u.secondary,barBg:"#292C2E",buttonBg:"#222425",buttonBorder:"rgba(255,255,255,.1)",booleanBg:"#222425",booleanSelectedBg:"#2E3438",inputBg:"#1B1C1D",inputBorder:"rgba(255,255,255,.1)",inputTextColor:u.lightest,inputBorderRadius:4},Ve=Ze,{window:B}=Se,et=()=>!B||!B.matchMedia?"light":B.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",Z={light:X,dark:Ve,normal:X};et();var tt=function e(t,r){if(t===r)return!0;if(t&&r&&typeof t=="object"&&typeof r=="object"){if(t.constructor!==r.constructor)return!1;var a,n,o;if(Array.isArray(t)){if(a=t.length,a!=r.length)return!1;for(n=a;n--!==0;)if(!e(t[n],r[n]))return!1;return!0}if(t.constructor===RegExp)return t.source===r.source&&t.flags===r.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===r.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===r.toString();if(o=Object.keys(t),a=o.length,a!==Object.keys(r).length)return!1;for(n=a;n--!==0;)if(!Object.prototype.hasOwnProperty.call(r,o[n]))return!1;for(n=a;n--!==0;){var i=o[n];if(!e(t[i],r[i]))return!1}return!0}return t!==t&&r!==r};const V=he(tt);function v(e){"@babel/helpers - typeof";return v=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},v(e)}var M;function ee(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable})),r.push.apply(r,a)}return r}function te(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?ee(Object(r),!0).forEach(function(a){rt(e,a,r[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ee(Object(r)).forEach(function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(r,a))})}return e}function rt(e,t,r){return t=at(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function at(e){var t=nt(e,"string");return v(t)==="symbol"?t:String(t)}function nt(e,t){if(v(e)!=="object"||e===null)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var a=r.call(e,t||"default");if(v(a)!=="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function w(e){return lt(e)||st(e)||it(e)||ot()}function ot(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function it(e,t){if(e){if(typeof e=="string")return G(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return G(e,t)}}function st(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function lt(e){if(Array.isArray(e))return G(e)}function G(e,t){(t==null||t>e.length)&&(t=e.length);for(var r=0,a=new Array(t);r<t;r++)a[r]=e[r];return a}const{global:ut}=__STORYBOOK_MODULE_GLOBAL__;__STORYBOOK_MODULE_CORE_EVENTS__;var se=ut,ft=se.document,I=se.window,le="sb-addon-themes-3";(M=I.matchMedia)===null||M===void 0||M.call(I,"(prefers-color-scheme: dark)");var K={classTarget:"body",dark:Z.dark,darkClass:["dark"],light:Z.light,lightClass:["light"],stylePreview:!1,userHasExplicitlySetTheTheme:!1},re=function(t){I.localStorage.setItem(le,JSON.stringify(t))},pt=function(t,r){var a=r.current,n=r.darkClass,o=n===void 0?K.darkClass:n,i=r.lightClass,s=i===void 0?K.lightClass:i;if(a==="dark"){var l,f;(l=t.classList).remove.apply(l,w(x(s))),(f=t.classList).add.apply(f,w(x(o)))}else{var d,p;(d=t.classList).remove.apply(d,w(x(o))),(p=t.classList).add.apply(p,w(x(s)))}},x=function(t){var r=[];return r.concat(t).map(function(a){return a})},dt=function(t){var r=ft.querySelector(t.classTarget);r&&pt(r,t)},ue=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},r=I.localStorage.getItem(le);if(typeof r=="string"){var a=JSON.parse(r);return t&&(t.dark&&!V(a.dark,t.dark)&&(a.dark=t.dark,re(a)),t.light&&!V(a.light,t.light)&&(a.light=t.light,re(a))),a}return te(te({},K),t)};dt(ue());function ct(e,t){return bt(e)||ht(e,t)||gt(e,t)||mt()}function mt(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function gt(e,t){if(e){if(typeof e=="string")return ae(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return ae(e,t)}}function ae(e,t){(t==null||t>e.length)&&(t=e.length);for(var r=0,a=new Array(t);r<t;r++)a[r]=e[r];return a}function ht(e,t){var r=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(r!=null){var a,n,o,i,s=[],l=!0,f=!1;try{if(o=(r=r.call(e)).next,t===0){if(Object(r)!==r)return;l=!1}else for(;!(l=(a=o.call(r)).done)&&(s.push(a.value),s.length!==t);l=!0);}catch(d){f=!0,n=d}finally{try{if(!l&&r.return!=null&&(i=r.return(),Object(i)!==i))return}finally{if(f)throw n}}return s}}function bt(e){if(Array.isArray(e))return e}const{addons:yt}=__STORYBOOK_MODULE_ADDONS__;function vt(){var e=W.useState(ue().current==="dark"),t=ct(e,2),r=t[0],a=t[1];return W.useEffect(function(){var n=yt.getChannel();return n.on(C,a),function(){return n.off(C,a)}},[]),r}const fe=e=>({body:{margin:0,fontFamily:"Inter"}}),St={colorScheme:"dark",fontFamily:"Inter, sans-serif",colors:{archbase:["#def3ff","#bdddf2","#98c9e4","#72b6d8","#4da6cc","#3391b2","#24698c","#154665","#03253e","#000b1a"]},primaryColor:"archbase",globalStyles:fe},Ft={colorScheme:"light",fontFamily:"Inter, sans-serif",colors:{archbase:["#def3ff","#bdddf2","#98c9e4","#72b6d8","#4da6cc","#3391b2","#24698c","#154665","#03253e","#000b1a"]},primaryColor:"archbase",globalStyles:fe},wt="Demo",xt={Demo:wt},Ot="Demo",Ct={Demo:Ot},kt="Demo",Tt={Demo:kt};const{addons:It}=__STORYBOOK_MODULE_PREVIEW_API__,z=It.getChannel();function Pt(e){const[t,r]=F.useState(St),[a,n]=F.useState(Ft),o=vt()?"dark":"light";ve();const[i,s]=ye({key:"mantine-color-scheme",defaultValue:"light",getInitialValueInEffect:!0}),l=p=>s(p?"dark":"light");F.useEffect(()=>(z.on(C,l),()=>z.off(C,l)),[z]),F.useEffect(()=>{s(o);const p=window.document.body;p.style.backgroundColor=o==="dark"?"black":"white"},[o]);const f=(p,c)=>{r(p),n(c)},d=p=>s(p||(i==="dark"?"light":"dark"));return ce([["mod+J",()=>d()]]),H(me,{colorScheme:o,containerIOC:be,themeDark:t,themeLight:a,toggleColorScheme:d,translationName:"demo",translationResource:{en:xt,"pt-BR":Ct,es:Tt},children:H(ge,{user:null,owner:null,selectedCompany:void 0,setCustomTheme:f,children:e.children})})}const er={decorators:[e=>H(Pt,{children:e()})],parameters:{options:{storySort:{order:["Introdução","Temas e cores","Admin","Autenticação","Fontes de dados","Filtros","Layouts","Modelos","Serviços","*"],locales:""}}}};export{er as default};
//# sourceMappingURL=preview-df965892.js.map
