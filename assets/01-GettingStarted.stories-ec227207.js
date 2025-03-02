import{R as c}from"./index-8b3efc3f.js";import"./chunk-HLWAVYOI-572e8806.js";import{M as u}from"./index-8f525320.js";import{D as S}from"./utils-5eca0ce6.js";import{j as e,a as t,F as A}from"./jsx-runtime-c9381026.js";import{A as s,a as l,C as r,b as o,c as d,d as p}from"./ArchbaseSpaceFixed-cb4e0690.js";import{u as b}from"./index-4811e648.js";import"./_commonjsHelpers-de833af9.js";import"./iframe-5e7535bc.js";import"../sb-preview/runtime.js";import"./react-18-440219b3.js";import"./index-a38d0dca.js";import"./index-a4816881.js";import"./mapValues-6494ad58.js";import"./_commonjs-dynamic-modules-302442b1.js";import"./index-1bc24522.js";import"./extends-4c19d496.js";import"./setPrototypeOf-375db7f1.js";import"./inheritsLoose-789acc4d.js";import"./isNativeReflectConstruct-4e5fac16.js";import"./index-356e4a49.js";import"./index-264fcb29.js";import"./index-9d475cdf.js";function h(n){const a=Object.assign({h2:"h2",h3:"h3",p:"p",code:"code",em:"em",pre:"pre"},b(),n.components);return c||m("React",!1),c.StrictMode||m("React.StrictMode",!0),t(A,{children:[e(u,{title:"Layouts/Spaces/Começando"}),`
`,e(a.h2,{id:"começando",children:"Começando"}),`
`,e(a.h3,{id:"um-exemplo-muito-básico",children:"Um exemplo muito básico"}),`
`,t(a.p,{children:["O uso de espaços sempre começa com um espaço ",e(a.code,{children:"<ArchbaseSpaceViewPort />"})," ou ",e(a.code,{children:"<ArchbaseSpaceFixed />"}),` no nível superior.
`,e(a.em,{children:"Nota: estes não precisa estar no topo da sua árvore de componentes, logo acima de qualquer uso de outros espaços."})]}),`
`,t(a.p,{children:["Um espaço ",e(a.code,{children:"<ArchbaseSpaceViewPort />"}),` ocupará toda a janela de visualização da janela do navegador e é ideal para visualização completa
aplicativos de página única.`]}),`
`,t(a.p,{children:["Um ",e(a.code,{children:"<ArchbaseSpaceFixed />"}),` criará um espaço na página com altura fixa e largura opcional. Isso é útil
para utilizar espaços dentro de um contêiner em um aplicativo existente.`]}),`
`,e(a.p,{children:"Importe os componentes e use-os diretamente em seu aplicativo React. Por exemplo:"}),`
`,e(a.pre,{children:e(a.code,{className:"language-tsx",children:`import { ArchbaseSpaceViewPort, ArchbaseSpaceLeftResizable, ArchbaseSpaceFill } from "archbase-react";

const App = () => (
	<ArchbaseSpaceViewPort>
		<ArchbaseSpaceLeftResizable size={200}>
		  ...
		</ArchbaseSpaceLeftResizable>
		<ArchbaseSpaceFill>
		  ...
		</ArchbaseSpaceFill>
	</ArchbaseSpaceViewPort>
);
`})}),`
`,t(a.p,{children:["Isso produzirá um layout muito simples com uma barra lateral esquerda e uma área principal como abaixo. ",e(a.em,{children:`Nota: fronteiras,
linhas e alinhamento de texto foram adicionados especificamente para este exemplo. Na prática, os espaços não
tem qualquer elemento visual, preenchimento ou margens, cabendo a você preenchê-los ou estilizá-los de qualquer maneira
você queira.`})]}),`
`,e(c.StrictMode,{children:t(s,{style:{border:"1px solid black"},className:"container",height:400,children:[e(l,{style:{borderRight:"1px dashed black"},size:"25%",centerContent:r.HorizontalVertical,children:e(a.p,{children:"Barra lateral"})}),e(o,{centerContent:r.HorizontalVertical,children:e(a.p,{children:"Conteúdo principal"})})]})}),`
`,e(a.p,{children:`Observe como o espaço de preenchimento ajusta automaticamente seu tamanho quando o espaço redimensionável esquerdo é redimensionado com
o rato.`}),`
`,e(a.h3,{id:"espaços-aninhados",children:"Espaços aninhados"}),`
`,e(a.p,{children:"Ao aninhar espaços, podemos facilmente adicionar outra área redimensionável inferior."}),`
`,e(a.pre,{children:e(a.code,{className:"language-tsx",children:`import { ArchbaseSpaceViewPort, ArchbaseSpaceLeftResizable, ArchbaseSpaceFill } from "archbase-react";

const App = () => (
	<ArchbaseSpaceViewPort>
		<ArchbaseSpaceLeftResizable size={200}>
		  ...
		</ArchbaseSpaceLeftResizable>
		<ArchbaseSpaceFill>
			<ArchbaseSpaceFill>
			  ...
			</ArchbaseSpaceFill>
			<ArchbaseSpaceBottomResizable size={100}>
			  ...
			</ArchbaseSpaceBottomResizable>
		</ArchbaseSpaceFill>
	</ArchbaseSpaceViewPort>
);
`})}),`
`,t(a.p,{children:["Aqui adicionamos espaços aninhados adicionais dentro do espaço ",e(a.code,{children:"<Fill />"})," original para conseguir isso:"]}),`
`,e(c.StrictMode,{children:t(s,{style:{border:"1px solid black"},className:"container",height:400,children:[e(l,{style:{borderRight:"1px dashed black"},size:"25%",centerContent:r.HorizontalVertical,children:e(a.p,{children:"Barra lateral"})}),t(o,{children:[e(o,{centerContent:r.HorizontalVertical,children:e(a.p,{children:"Conteúdo principal"})}),e(d,{style:{borderTop:"1px dashed black"},size:100,centerContent:r.HorizontalVertical,children:e(a.p,{children:"Rodapé"})})]})]})}),`
`,e(a.p,{children:"Podemos adicionar mais espaços aninhados para adicionar elementos como barras de título em diferentes áreas."}),`
`,e(a.pre,{children:e(a.code,{className:"language-tsx",children:`import { ArchbaseSpaceViewPort, ArchbaseSpaceLeftResizable, ArchbaseSpaceFill } from "archbase-react";

const App = () => (
	<ArchbaseSpaceViewPort>
		<ArchbaseSpaceTop size={25} order={1} centerContent={CenterType.Vertical}>
		  ...
		</ArchbaseSpaceTop>
		<ArchbaseSpaceTop size={25} order={2} centerContent={CenterType.Vertical}>
		  ...
		</ArchbaseSpaceTop>
		<ArchbaseSpaceFill>
			<ArchbaseSpaceLeftResizable size={200}>
				<ArchbaseSpaceTop size={25} centerContent={CenterType.Vertical}>
				  ...
				</ArchbaseSpaceTop>
				<ArchbaseSpaceFill>
				  ...
				</ArchbaseSpaceFill>
			</ArchbaseSpaceLeftResizable>
			<ArchbaseSpaceFill>
				<ArchbaseSpaceFill>
				  ...
				</ArchbaseSpaceFill>
				<ArchbaseSpaceBottomResizable size={100}>
				  ...
				</ArchbaseSpaceBottomResizable>
			</ArchbaseSpaceFill>
		</ArchbaseSpaceFill>
	</ArchbaseSpaceViewPort>
);
`})}),`
`,e(a.p,{children:"Agora temos algo como abaixo:"}),`
`,e(c.StrictMode,{children:t(s,{style:{border:"1px solid black"},className:"container",height:400,children:[e(p,{style:{borderBottom:"1px dashed black",padding:5},order:1,size:25,centerContent:r.Vertical,children:"Título"}),e(p,{style:{borderBottom:"1px dashed black",padding:5},order:2,size:25,centerContent:r.Vertical,children:"Menu"}),t(o,{children:[t(l,{style:{borderRight:"1px dashed black"},size:"25%",children:[e(p,{style:{borderBottom:"1px dashed black",padding:5},size:25,centerContent:r.Vertical,children:"Título barra lateral"}),e(o,{centerContent:r.HorizontalVertical,children:"Barra lateral"})]}),t(o,{children:[e(o,{centerContent:r.HorizontalVertical,children:e(a.p,{children:"Conteúdo principal"})}),e(d,{style:{borderTop:"1px dashed black"},size:100,centerContent:r.HorizontalVertical,children:e(a.p,{children:"Rodapé"})})]})]})]})}),`
`,e(a.h3,{id:"apresentando-interatividade-simples",children:"Apresentando interatividade simples"}),`
`,e(a.p,{children:"Podemos adicionar alguns estados muito simples para manipular o espaço que representa a barra lateral."}),`
`,t(a.p,{children:[`Aqui adicionamos um widget no título da barra lateral que usaremos para realizar uma ação na barra lateral. Isso é apenas
outro espaço `,e(a.code,{children:"<ArchbaseSpaceRight />"})," aninhado com um ícone."]}),`
`,e(a.pre,{children:e(a.code,{className:"language-tsx",children:`...
<ArchbaseSpaceLeftResizable size={200}>
	<ArchbaseSpaceTop size={25}>
		<ArchbaseSpaceFill centerContent={CenterType.Vertical}>
		  Título barra lateral ...
		</ArchbaseSpaceFill>
		<ArchbaseSpaceRight size={25} centerContent={CenterType.HorizontalVertical}>
			<i class="fa fa-arrow-right" />
		</ArchbaseSpaceRight>
	</ArchbaseSpaceTop>
	<ArchbaseSpaceFill>
	  ...
	</ArchbaseSpaceFill>
</ArchbaseSpaceLeftResizable>
...
`})}),`
`,e(a.p,{children:"A seguir podemos introduzir algum estado para representar se a barra lateral está expandida ou não."}),`
`,e(a.pre,{children:e(a.code,{className:"language-tsx",children:`const [ sidebarExpanded, setSidebarExpanded ] = useState(true);
`})}),`
`,e(a.p,{children:`Vamos aplicar isso ao espaço da barra lateral para definir dinamicamente o tamanho e também mostrar o ícone correto com base
no estado. Também adicionaremos um manipulador de cliques ao espaço para alterar o estado.`}),`
`,e(a.pre,{children:e(a.code,{className:"language-tsx",children:`...
<ArchbaseSpaceLeftResizable size={sidebarExpanded ? 200 : 25}>
	<ArchbaseSpaceTop size={25}>
		...
		<ArchbaseSpaceRight 
			size={25} 
			centerContent={CenterType.HorizontalVertical} 
			onClick={() => setSidebarExpanded(prev => !prev)}>

			<i className={"fa fa-arrow-" + (sidebarExpanded ? "left" : "right")} />

		</ArchbaseSpaceRight>
	</ArchbaseSpaceTop>
	...
</ArchbaseSpaceLeftResizable>
...
`})}),`
`,e(a.p,{children:"O resultado é uma barra lateral que pode ser expandida ou contraida."}),`
`,e(S,{})]})}function z(n={}){const{wrapper:a}=Object.assign({},b(),n.components);return a?e(a,{...n,children:e(h,{...n})}):h(n)}function m(n,a){throw new Error("Expected "+(a?"component":"object")+" `"+n+"` to be defined: you likely forgot to import, pass, or provide it.")}const g=()=>{throw new Error("Docs-only story")};g.parameters={docsOnly:!0};const i={title:"Layouts/Spaces/Começando",tags:["stories-mdx"],includeStories:["__page"]};i.parameters=i.parameters||{};i.parameters.docs={...i.parameters.docs||{},page:z};const I=["__page"];export{I as __namedExportsOrder,g as __page,i as default};
