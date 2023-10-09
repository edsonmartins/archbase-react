import{j as o,a as p}from"./jsx-runtime-2ca98591.js";import{r as N,b as E}from"./index-402471b7.js";import{f as P}from"./ArchbaseRemoteApiService-1c9bc946.js";import{c as j}from"./createReactComponent-b82b540a.js";var x=j("arrow-big-right-filled","IconArrowBigRightFilled",[["path",{d:"M12.089 3.634a2 2 0 0 0 -1.089 1.78l-.001 2.586h-6.999a2 2 0 0 0 -2 2v4l.005 .15a2 2 0 0 0 1.995 1.85l6.999 -.001l.001 2.587a2 2 0 0 0 3.414 1.414l6.586 -6.586a2 2 0 0 0 0 -2.828l-6.586 -6.586a2 2 0 0 0 -2.18 -.434l-.145 .068z",fill:"currentColor",key:"svg-0",strokeWidth:"0"}]]);const w={outputCollapsed:!1,outputWithQuotes:!1,pathNotation:"dots",pathQuotesType:"single",processKeys:!1,keyReplaceRegexPattern:void 0,keyReplaceRegexFlags:void 0,keyReplacementText:"",pickerIcon:"#x1f4cb",withoutPicker:!1};function d(s,n,t){for(var e=[],r=0;r<s.parentNode.children.length;r+=1){var a=s.parentNode.children[r];a!==s&&typeof n=="string"&&a.matches(n)&&e.push(a)}if(t&&typeof t=="function")for(var i=0;i<e.length;i+=1)t(e[i]);return e}function C(s){var n;if(s.ownerDocument)n=s.ownerDocument;else if(s.nodeType===9)n=s;else throw new Error("Invalid node passed to fireEvent: ".concat(s.id));if(s.dispatchEvent){var t="MouseEvents",e=n.createEvent(t);e.initEvent("click",!0,!0),e.synthetic=!0,s.dispatchEvent(e,!0)}else if(s.fireEvent){var r=n.createEventObject();r.synthetic=!0,s.fireEvent("onclick",r)}}function L(s){var n=s.offsetWidth,t=s.offsetHeight;return n===0&&t===0||window.getComputedStyle(s).display==="none"}function T(s,n){for(var t=[],e=s&&s.parentElement;e;e=e.parentElement)typeof n=="string"&&e.matches(n)&&t.push(e);return t}function v(s){return s instanceof Object&&Object.keys(s).length>0}function A(s){var n=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#:.?+=&%@!\-/]))?/;return n.test(s)}class g extends N.Component{constructor(n){super(n),this.json2jsx=(t,e)=>{if(typeof t=="string"){const r=t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");return A(r)?o("a",{href:r,className:"json-string",children:r}):p("span",{className:"json-string",children:['"',r,'"']})}else{if(typeof t=="number")return o("span",{className:"json-literal",children:t});if(typeof t=="boolean")return o("span",{className:"json-literal",children:t});if(t===null)return o("span",{className:"json-literal",children:"null"});if(Array.isArray(t))return t.length>0?p("span",{children:["[",o("ol",{className:"json-array",children:t.map((r,a)=>p("li",{"data-key-type":"array","data-key":a,children:[v(r)&&o("a",{href:"",className:"json-toggle"}),this.json2jsx(r,e),a<t.length-1&&","]},a))}),"]"]}):"[]";if(typeof t=="object"){const r=Object.keys(t);return r.length>0?p("span",{children:["{",o("ul",{className:"json-dict",children:r.map((a,i)=>p("li",{"data-key-type":"object","data-key":a,children:[v(t[a])?o("a",{href:"",className:"json-toggle",children:e.outputWithQuotes?p("span",{className:"json-string",children:['"',a,'"']}):a}):e.outputWithQuotes?p("span",{className:"json-string",children:['"',a,'"']}):a,o("span",{className:"pick-path",title:`${P("archbase:Pick path")}`,children:o(x,{size:"1.0rem"})}),": ",this.json2jsx(t[a],e),i<r.length-1&&","]},a))}),"}"]}):"{}"}}},this.handlerEventToggle=(t,e)=>{t.classList.toggle("collapsed");for(var r=d(t,"ul.json-dict, ol.json-array",function(l){l.style.display=l.style.display===""||l.style.display==="block"?"none":"block"}),a=0;a<r.length;a+=1)if(!L(r[a]))d(r[a],".json-placeholder",function(l){return l.parentNode.removeChild(l)});else{for(var i=r[a].children,h=0,u=0;u<i.length;u+=1)i[u].tagName==="LI"&&(h+=1);var f=h+(h>1?" items":" item");r[a].insertAdjacentHTML("afterend",'<a href class="json-placeholder">'.concat(f,"</a>"))}e.stopPropagation(),e.preventDefault()},this.toggleEventListener=t=>{for(var e=t.target;e&&e!==this;)typeof e.matches=="function"&&e.matches("a.json-toggle")&&(this.handlerEventToggle.call(null,e,t),t.stopPropagation(),t.preventDefault()),e=e.parentNode},this.simulateClickHandler=(t,e)=>{d(t,"a.json-toggle",function(r){return C(r)}),e.stopPropagation(),e.preventDefault()},this.simulateClickEventListener=t=>{for(var e=t.target;e&&e!==this;)typeof e.matches=="function"&&e.matches("a.json-placeholder")&&this.simulateClickHandler.call(null,e,t),e=e.parentNode},this.pickPathHandler=t=>{for(var e=T(t,"li").reverse(),r=[],a=0;a<e.length;a+=1){var i=e[a].dataset.key,h=e[a].dataset.keyType;if(h==="object"&&typeof i!="number"&&this.props.options.processKeys&&this.props.options.keyReplaceRegexPattern!==void 0){var u=new RegExp(this.props.options.keyReplaceRegexPattern,this.props.options.keyReplaceRegexFlags),f=this.props.options.keyReplacementText===void 0?"":this.props.options.keyReplacementText;i=i.replace(u,f)}r.push({key:i,keyType:h})}var l={none:"",single:"'",double:'"'},y=l[this.props.options.pathQuotesType];r=r.map((c,k)=>{var b=this.props.options.pathNotation==="brackets",R=!/^\w+$/.test(c.key)||typeof c.key=="number";return c.keyType==="array"||c.isKeyANumber?"[".concat(c.key,"]"):b||R?"[".concat(y).concat(c.key).concat(y,"]"):k>0?".".concat(c.key):c.key});var m=r.join("");this.props.onSelect&&this.props.onSelect(m)},this.pickEventListener=t=>{let e=t.target;for(;e&&e!==this;)typeof e.matches=="function"&&e.matches(".pick-path")&&this.pickPathHandler.call(null,e),e=e.parentNode},this.pickerRef=E.createRef()}componentDidMount(){this.pickerRef.current.addEventListener("click",this.toggleEventListener),this.pickerRef.current.addEventListener("click",this.simulateClickEventListener),this.pickerRef.current.addEventListener("click",this.pickEventListener)}render(){return o("div",{ref:this.pickerRef,children:this.json2jsx(this.props.data,{})})}}g.defaultProps={options:w};try{g.displayName="ArchbaseJsonPathPicker",g.__docgenInfo={description:"",displayName:"ArchbaseJsonPathPicker",props:{data:{defaultValue:null,description:"",name:"data",required:!0,type:{name:"any"}},onSelect:{defaultValue:null,description:"",name:"onSelect",required:!0,type:{name:"(path: string) => void"}},options:{defaultValue:{value:`{
  outputCollapsed: false,
  outputWithQuotes: false,
  pathNotation: 'dots',
  pathQuotesType: 'single',
  processKeys: false,
  keyReplaceRegexPattern: undefined,
  keyReplaceRegexFlags: undefined,
  keyReplacementText: '',
  pickerIcon: '#x1f4cb',
  withoutPicker: false
}`},description:"",name:"options",required:!1,type:{name:"ArchbaseJsonPathPickerOptions"}}}}}catch{}
//# sourceMappingURL=ArchbaseJsonPathPicker-53ebc30a.js.map
