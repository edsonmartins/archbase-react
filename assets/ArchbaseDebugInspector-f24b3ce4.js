import{j as e,a as y}from"./jsx-runtime-2ca98591.js";import{r as s}from"./index-402471b7.js";import{e as g}from"./ArchbaseFloatingWindow-5a72a221.js";import"./ArchbaseAdvancedTabs-2e888216.js";import{u as I,a as j,F as A,A as t}from"./ArchbaseRemoteApiService-1c9bc946.js";import{A as v}from"./ArchbaseObjectInspector-990588d9.js";function o({title:n,icon:l,debugObjectInspectorHotKey:c,objectsToInspect:u,visible:d=!1,height:p=400,width:m=500}){const[r,b]=s.useState(d);I([[c,()=>b(!r)]]);const i=s.useRef(),f=j(i);return e("div",{style:r?{}:{display:"none"},children:e(g,{id:"debug-rules",height:p,width:m,resizable:!0,style:{opacity:1},titleBar:{icon:l,title:n,buttons:{minimize:!0,maximize:!0}},innerRef:i,children:e(A,{h:f.height,children:e(t,{w:"100%",children:u.map((a,h)=>y(t.Item,{value:a.name,children:[e(t.Control,{children:a.name}),e(t.Panel,{children:e(v,{data:a.object})})]},h))})})})})}try{o.displayName="ArchbaseDebugInspector",o.__docgenInfo={description:"",displayName:"ArchbaseDebugInspector",props:{title:{defaultValue:null,description:"Título a ser exibido",name:"title",required:!1,type:{name:"string"}},icon:{defaultValue:null,description:"Título a ser exibido",name:"icon",required:!1,type:{name:"string | HTMLImageElement"}},debugObjectInspectorHotKey:{defaultValue:null,description:"Comando para abrir e fechar o Object Inspector",name:"debugObjectInspectorHotKey",required:!1,type:{name:"string"}},objectsToInspect:{defaultValue:null,description:"Lista de objetos a serem inspecionados",name:"objectsToInspect",required:!1,type:{name:"ArchbaseObjectToInspect[]"}},visible:{defaultValue:{value:"false"},description:"Indica se o Object Inspector será visível inicialmente ou não",name:"visible",required:!1,type:{name:"boolean"}},height:{defaultValue:{value:"400"},description:"Altura inicial do Object Inspector",name:"height",required:!1,type:{name:"number"}},width:{defaultValue:{value:"500"},description:"Largura inicial do Object Inspector",name:"width",required:!1,type:{name:"number"}}}}}catch{}export{o as A};
//# sourceMappingURL=ArchbaseDebugInspector-f24b3ce4.js.map
