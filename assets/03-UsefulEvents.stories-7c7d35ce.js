import"./chunk-HLWAVYOI-c2ea2619.js";import{M as t}from"./index-768588b8.js";import{j as n,a as o,F as s}from"./jsx-runtime-c9381026.js";import{u as a}from"./index-4811e648.js";import"./iframe-a7028b1b.js";import"../sb-preview/runtime.js";import"./index-8b3efc3f.js";import"./_commonjsHelpers-de833af9.js";import"./react-18-440219b3.js";import"./index-a38d0dca.js";import"./index-a4816881.js";import"./mapValues-6494ad58.js";import"./_commonjs-dynamic-modules-302442b1.js";import"./index-1bc24522.js";import"./extends-4c19d496.js";import"./setPrototypeOf-375db7f1.js";import"./inheritsLoose-789acc4d.js";import"./isNativeReflectConstruct-4e5fac16.js";import"./index-356e4a49.js";import"./index-264fcb29.js";function c(i){const e=Object.assign({h2:"h2",h3:"h3",p:"p",code:"code",h4:"h4",ul:"ul",li:"li",strong:"strong",pre:"pre"},a(),i.components);return o(s,{children:[n(t,{title:"Layouts/Spaces/Eventos úteis"}),`
`,n(e.h2,{id:"eventos-úteis",children:"Eventos úteis"}),`
`,n(e.h3,{id:"onresizestart",children:"onResizeStart"}),`
`,o(e.p,{children:["Acionado quando um redimensionamento do mouse/toque é iniciado. A ação de redimensionamento pode ser cancelada retornando ",n(e.code,{children:"false"})," do manipulador de eventos."]}),`
`,n(e.h4,{id:"aplica-se-a",children:"Aplica-se a"}),`
`,o(e.p,{children:[n(e.code,{children:"<ArchbaseSpaceLeftResizable />"})," ",n(e.code,{children:"<ArchbaseSpaceTopResizable />"})," ",n(e.code,{children:"<ArchbaseSpaceRightResizable />"})," ",n(e.code,{children:"<ArchbaseSpaceBottomResizable />"})]}),`
`,n(e.h4,{id:"parâmetros",children:"Parâmetros"}),`
`,o(e.ul,{children:[`
`,o(e.li,{children:[n(e.strong,{children:"resizeType"}),': "resize-left" | "resize-top" | "resize-right" | "resize-bottom" - Type of resize operation started']}),`
`]}),`
`,n(e.h4,{id:"exemplo",children:"Exemplo"}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`const Exemplo = () => 
	<ArchbaseSpaceLeftResizable 
		onResizeStart={(resizeType) => /* lógica para determinar se o redimensionamento deve ser possível */}>
	...
	</ArchbaseSpaceLeftResizable>
`})}),`
`,n(e.h3,{id:"onresizeend",children:"onResizeEnd"}),`
`,n(e.p,{children:"Disparado ao final de uma ação de redimensionamento fornecendo o novo tamanho (em pixels) do espaço."}),`
`,n(e.h4,{id:"aplica-se-a-1",children:"Aplica-se a"}),`
`,o(e.p,{children:[n(e.code,{children:"<ArchbaseSpaceLeftResizable />"})," ",n(e.code,{children:"<ArchbaseSpaceTopResizable />"})," ",n(e.code,{children:"<ArchbaseSpaceRightResizable />"})," ",n(e.code,{children:"<ArchbaseSpaceBottomResizable />"})]}),`
`,n(e.h4,{id:"parâmetros-1",children:"Parâmetros"}),`
`,o(e.ul,{children:[`
`,o(e.li,{children:[n(e.strong,{children:"newSize"}),": number - Novo tamanho de espaço. Para ",n(e.code,{children:"<ArchbaseSpaceLeftResizable />"})," e ",n(e.code,{children:"<ArchbaseSpaceRightResizable />"}),`
esta será a largura, por `,n(e.code,{children:"<ArchbaseSpaceTopResizable />"})," e ",n(e.code,{children:"<ArchbaseSpaceBottomResizable />"})," essa será a altura"]}),`
`,o(e.li,{children:[n(e.strong,{children:"domRect"}),": DOMRect - Dimensões finais do espaço"]}),`
`,o(e.li,{children:[n(e.strong,{children:"resizeType"}),`: "resize-left" | "resize-top" | "resize-right" | "resize-bottom" - Tipo de redimensionamento
operação iniciada`]}),`
`]}),`
`,n(e.h4,{id:"exemplo-1",children:"Exemplo"}),`
`,n(e.p,{children:`O cenário provável em que você precisa usar isso é manter o tamanho do espaço controlado
no estado:`}),`
`,n(e.pre,{children:n(e.code,{className:"language-tsx",children:`const Exemplo = () => {
	const [ size, setSize ] = useState(200);

	return (
		<ArchbaseSpaceViewPort>
			<ArchbaseSpaceLeftResizable 
				onResizeEnd={(newSize, domRect, resizeType) => setSize(newSize)}>
			  ...
			</ArchbaseSpaceLeftResizable>
		</ArchbaseSpaceViewPort>
	)
}
`})}),`
`,n(e.h3,{id:"eventos-de-elemento",children:"Eventos de elemento"}),`
`,n(e.p,{children:"Os espaços permitem que você se vincule aos seguintes eventos do componente React."}),`
`,o(e.ul,{children:[`
`,n(e.li,{children:n(e.code,{children:"onClick"})}),`
`,n(e.li,{children:n(e.code,{children:"onDoubleClick"})}),`
`,n(e.li,{children:n(e.code,{children:"onMouseDown"})}),`
`,n(e.li,{children:n(e.code,{children:"onMouseEnter"})}),`
`,n(e.li,{children:n(e.code,{children:"onMouseLeave"})}),`
`,n(e.li,{children:n(e.code,{children:"onMouseMove"})}),`
`,n(e.li,{children:n(e.code,{children:"onTouchStart"})}),`
`,n(e.li,{children:n(e.code,{children:"onTouchMove"})}),`
`,n(e.li,{children:n(e.code,{children:"onTouchEnd"})}),`
`]}),`
`,n(e.h4,{id:"aplica-se-a-2",children:"Aplica-se a"}),`
`,o(e.p,{children:[n(e.code,{children:"<ArchbaseSpaceFill />"})," ",n(e.code,{children:"<ArchbaseSpaceLeft />"})," ",n(e.code,{children:"<ArchbaseSpaceTop />"})," ",n(e.code,{children:"<ArchbaseSpaceRight />"})," ",n(e.code,{children:"<ArchbaseSpaceBottom />"})," ",n(e.code,{children:"<ArchbaseSpaceLeftResizable />"})," ",n(e.code,{children:"<ArchbaseSpaceTopResizable />"})," ",n(e.code,{children:"<ArchbaseSpaceRightResizable />"})," ",n(e.code,{children:"<ArchbaseSpaceBottomResizable />"})," ",n(e.code,{children:"<ArchbaseSpacePositioned />"})," ",n(e.code,{children:"<ArchbaseSpaceCustom />"})]})]})}function d(i={}){const{wrapper:e}=Object.assign({},a(),i.components);return e?n(e,{...i,children:n(c,{...i})}):c(i)}const l=()=>{throw new Error("Docs-only story")};l.parameters={docsOnly:!0};const r={title:"Layouts/Spaces/Eventos úteis",tags:["stories-mdx"],includeStories:["__page"]};r.parameters=r.parameters||{};r.parameters.docs={...r.parameters.docs||{},page:d};const D=["__page"];export{D as __namedExportsOrder,l as __page,r as default};
