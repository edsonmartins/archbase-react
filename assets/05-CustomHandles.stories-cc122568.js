import"./chunk-HLWAVYOI-32df1b38.js";import{M as t}from"./index-a6b2c7e3.js";import{j as o,a,F as d}from"./jsx-runtime-c9381026.js";import{u as i}from"./index-4811e648.js";import"./iframe-3696fbbc.js";import"../sb-preview/runtime.js";import"./index-8b3efc3f.js";import"./_commonjsHelpers-de833af9.js";import"./react-18-440219b3.js";import"./index-a38d0dca.js";import"./index-a4816881.js";import"./mapValues-6494ad58.js";import"./_commonjs-dynamic-modules-302442b1.js";import"./index-1bc24522.js";import"./extends-4c19d496.js";import"./setPrototypeOf-375db7f1.js";import"./inheritsLoose-789acc4d.js";import"./isNativeReflectConstruct-4e5fac16.js";import"./index-356e4a49.js";import"./index-264fcb29.js";__STORYBOOK_MODULE_PREVIEW_API__;__STORYBOOK_MODULE_GLOBAL__;function s(n){const e=Object.assign({h2:"h2",p:"p",code:"code",h4:"h4",pre:"pre",strong:"strong"},i(),n.components);return a(d,{children:[o(t,{title:"Layouts/Spaces/Redimensionamento personalizado"}),`
`,o(e.h2,{id:"redimensionamento-personalizado",children:"Redimensionamento personalizado"}),`
`,a(e.p,{children:["Você pode passar componentes personalizados para serem usados ​​como pontos de redimensionamento usando a propriedade ",o(e.code,{children:"handleRender"}),`.
Esta é uma alternativa para substituir as classes CSS padrão e lhe dará mais controle.`]}),`
`,o(e.h4,{id:"aplica-se-a",children:"Aplica-se a"}),`
`,a(e.p,{children:[o(e.code,{children:"<ArchbaseSpaceLeftResizable />"})," ",o(e.code,{children:"<ArchbaseSpaceTopResizable />"})," ",o(e.code,{children:"<ArchbaseSpaceRightResizable />"})," ",o(e.code,{children:"<ArchbaseSpaceBottomResizable />"})]}),`
`,o(e.h4,{id:"exemplo",children:"Exemplo"}),`
`,a(e.p,{children:["Passe uma função para a propriedade ",o(e.code,{children:"handleRender"})," que será chamada para cada identificador de redimensionamento nesse componente."]}),`
`,o(e.pre,{children:o(e.code,{className:"language-tsx",children:`<ArchbaseSpaceBottomResizable 
    size="50%" 
    handleRender={(props: IResizeHandleProps) => <div {...props}></div>}>
</ArchbaseSpaceBottomResizable>
`})}),`
`,a(e.p,{children:["Você pode determinar qual tipo de identificador está sendo renderizado acessando a propriedade ",o(e.code,{children:"props.key"}),`. Ele vai
contém valores `,o(e.code,{children:"left"}),", ",o(e.code,{children:"top"}),", ",o(e.code,{children:"right"})," ou ",o(e.code,{children:"bottom"}),`. Por exemplo, você pode renderizar diferentes identificadores para diferentes
alças de redimensionamento posicionadas.`]}),`
`,a(e.p,{children:["Também é importante que você passe os seguintes adereços para o elemento de ",o(e.strong,{children:"nível superior"}),` do seu componente personalizado, se
você não redimensionar não funcionará ao arrastar o mouse:`]}),`
`,o(e.pre,{children:o(e.code,{className:"language-tsx",children:`onMouseDown: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
onTouchStart: (e: React.TouchEvent<HTMLElement>) => void;
`})})]})}function c(n={}){const{wrapper:e}=Object.assign({},i(),n.components);return e?o(e,{...n,children:o(s,{...n})}):s(n)}const p=()=>{throw new Error("Docs-only story")};p.parameters={docsOnly:!0};const r={title:"Layouts/Spaces/Redimensionamento personalizado",tags:["stories-mdx"],includeStories:["__page"]};r.parameters=r.parameters||{};r.parameters.docs={...r.parameters.docs||{},page:c};const D=["__page"];export{D as __namedExportsOrder,p as __page,r as default};
