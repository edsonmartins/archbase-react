import"./chunk-S4VUQJ4A-36365acb.js";import{M as t}from"./index-d741c9ee.js";import"./chunk-AY7I2SME-c7b6cf8a.js";import"./ArchbaseFloatingWindow-5a72a221.js";import"./utils-50e81ae4.js";import{j as o,a,F as d}from"./jsx-runtime-2ca98591.js";import{u as s}from"./index-ef048a71.js";import"./iframe-2fc76aba.js";import"../sb-preview/runtime.js";import"./index-402471b7.js";import"./_commonjsHelpers-de833af9.js";import"./react-18-f5cf4734.js";import"./index-29301433.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-20a9f65a.js";import"./pickBy-5061995a.js";import"./_commonjs-dynamic-modules-302442b1.js";import"./mapValues-19ef60e3.js";import"./index-7f92349d.js";import"./extends-98964cd2.js";import"./index-356e4a49.js";import"./index-c0071dc9.js";import"./index-9d475cdf.js";import"./use-isomorphic-effect-d441b347.js";import"./ArchbaseAdvancedTabs-2e888216.js";function i(n){const e=Object.assign({h2:"h2",p:"p",code:"code",h4:"h4",pre:"pre",strong:"strong"},s(),n.components);return a(d,{children:[o(t,{title:"Layouts/Spaces/Redimensionamento personalizado"}),`
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
`})})]})}function c(n={}){const{wrapper:e}=Object.assign({},s(),n.components);return e?o(e,{...n,children:o(i,{...n})}):i(n)}const p=()=>{throw new Error("Docs-only story")};p.parameters={docsOnly:!0};const r={title:"Layouts/Spaces/Redimensionamento personalizado",tags:["stories-mdx"],includeStories:["__page"]};r.parameters=r.parameters||{};r.parameters.docs={...r.parameters.docs||{},page:c};const q=["__page"];export{q as __namedExportsOrder,p as __page,r as default};
//# sourceMappingURL=05-CustomHandles.stories-6a9ca837.js.map
