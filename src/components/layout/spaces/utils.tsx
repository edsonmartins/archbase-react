import * as React from "react";
import { CSSProperties } from "react";
import { ArchbaseSpaceInfo, ArchbaseSpaceFixed, ArchbaseSpaceViewPort, ArchbaseSpaceTop, 
	ArchbaseSpaceFill, ArchbaseSpaceLeft, ArchbaseSpaceLeftResizable, ArchbaseSpaceRight, ArchbaseSpaceBottomResizable, 
	ArchbaseSpaceCentered, ArchbaseSpaceLayer, ArchbaseSpaceTopResizable, ArchbaseSpaceRightResizable, CenterType, useArchbaseCurrentSpace } from "../../containers";
import "./utils.scss";

export const PropsTable: React.FC<{ children?: React.ReactNode }> = (props) => (
	<table className="sbdocs sbdocs-table properties-table css-lckf62">
		<tbody>
			<tr>
				<th>Propriedade</th>
				<th>Tipo</th>
				<th>Valor padrão</th>
				<th>Descrição</th>
			</tr>
			{props.children}
		</tbody>
	</table>
);

const propHeaderStyle: CSSProperties = {
	paddingTop: 2,
	paddingBottom: 2,
	backgroundColor: "#03396c",
	color: "white",
	fontSize: 12,
	textTransform: "uppercase",
	fontWeight: 500,
};

export const PropsHeader: React.FC<{ children?: React.ReactNode }> = (props) => (
	<tr>
		<td colSpan={4} style={propHeaderStyle}>
			{props.children}
		</td>
	</tr>
);

export const Prop: React.FC<{ name: string; type: string; default?: string; description: React.ReactNode }> = (props) => (
	<tr>
		<td>{props.name}</td>
		<td>{props.type}</td>
		<td>{props.default}</td>
		<td>{props.description}</td>
	</tr>
);

export const StandardProps = () => (
	<>
		<PropsHeader>Propriedades padrão</PropsHeader>
		<Prop
			name="as"
			type="string | React.ComponentType<ICommonProps>"
			default="div"
			description="Permite o controle sobre o elemento HTML gerado por meio da marcação semântica HTML 5 ou de um componente personalizado."
		/>
		<Prop
			name="centerContent"
			type="CenterType.Vertical | CenterType.HorizontalVertical | 'vertical' | 'horizontalVertical'"
			description="Aplique centralização aos filhos."
		/>
		<Prop name="className" type="string" description="Um nome de classe a ser aplicado ao elemento de espaço." />
		<Prop
			name="id"
			type="string"
			default="ID gerado aleatoriamente"
			description="Por padrão, um espaço gera um elemento com um ID gerado aleatoriamente. Você pode especificar seu próprio ID. É preferível especificar um ID em um espaço que está sendo adicionado e removido com base nas alterações de estado."
		/>
		<Prop
			name="scrollable"
			type="boolean"
			default="false"
			description="Torna o espaço rolável. Por padrão, o conteúdo que transborda o espaço ficará oculto. Isso permitirá que o espaço adicione uma barra de rolagem se o conteúdo transbordar."
		/>
		<Prop name="style" type="CSSProperties" default="" description="CSS properties" />
		<Prop
			name="trackSize"
			type="boolean"
			default="false"
			description="Informa ao espaço para informar seu tamanho quando ele muda de tamanho para a função &lt;useCurrentSpace() /&gt; gancho. Com isso desligado o espaço reportará apenas o tamanho inicial."
		/>
		<Prop
			name="zIndex"
			type="number"
			default="0"
			description="Um número que representa em qual camada o espaço está inserido. Se não for especificado, o espaço será colocado na camada 0. Os números mais altos aparecem na frente dos números mais baixos. Pretende ser uma alternativa ao uso de &lt;Layer /&gt; como um wrapper e preferível para espaços que se movem entre diferentes camadas para evitar a remontagem de componentes filhos."
		/>
		<Prop
			name="allowOverflow"
			type="boolean"
			default="false"
			description="Quando verdadeiro, permite que o conteúdo de um espaço exceda o limite do espaço"
		/>
		<Prop name="onClick" type="(event) => void" description="onClick handler" />
		<Prop name="onDoubleClick" type="(event) => void" description="onDoubleClick handler" />
		<Prop name="onMouseDown" type="(event) => void" description="onMouseDown handler" />
		<Prop name="onMouseEnter" type="(event) => void" description="onMouseEnter handler" />
		<Prop name="onMouseLeave" type="(event) => void" description="onMouseLeave handler" />
		<Prop name="onMouseMove" type="(event) => void" description="onMouseMove handler" />
		<Prop name="onTouchStart" type="(event) => void" description="onTouchStart handler" />
		<Prop name="onTouchMove" type="(event) => void" description="onTouchMove handler" />
		<Prop name="onTouchEnd" type="(event) => void" description="onTouchEnd handler" />
	</>
);

export const AnchoredProps = () => (
	<>
		<PropsHeader>Propriedades ancoradas</PropsHeader>
		<Prop
			name="resizable"
			type="boolean"
			default="false"
			description={
				<>
					Determina se o espaço é redimensionável.{" "}
					<p>
						<strong>
						Observe que isso só está disponível nos espaços Esquerdo, Superior, Direito e Inferior para poder alternar espaços ancorados não redimensionáveis ​​para
						espaços redimensionáveis ​​sem reparar componentes filhos. Em ArchbaseSpaceLeftResizable, ArchbaseSpaceTopResizable, ArchbaseSpaceRightResizable e ArchbaseSpaceBottomResizable
						isso é inferido por padrão como verdadeiro.
						</strong>
					</p>
				</>
			}
		/>
	</>
);

export const ResizableProps = () => (
	<>
		<PropsHeader>Propriedades redimensionáveis</PropsHeader>
		<Prop name="size" type="string | number" description="Tamanho inicial do espaço especificado como porcentagem ou em pixels." />
		<Prop name="handleSize" type="number" default="5" description="Tamanho da alça de redimensionamento em pixels." />
		<Prop
			name="touchHandleSize"
			type="number"
			default="5"
			description={
				<>
					Um tamanho de alça opcional que pode ser usado para aumentar a área da alça para toques. Isso se estende para fora das dimensões do
					alça de redimensionamento.{" "}
					<p>
						<strong>
						NOTA: Você deve tentar não colocar elementos clicáveis ​​abaixo desta área estendida da alça, pois a alça
						área bloqueará a interação com esse elemento.
						</strong>
					</p>
				</>
			}
		/>
		<Prop
			name="handlePlacement"
			type="ResizeHandlePlacement.OverlayInside | 'overlay-inside' | ResizeHandlePlacement.Inside | 'inside' | ResizeHandlePlacement.OverlayBoundary | 'overlay-boundary'"
			default="overlay-inside"
			description="Determina o método de posicionamento da alça de redimensionamento. Por padrão, o identificador é colocado sobreposto ao conteúdo dentro do espaço ('overlay'). Outras opções são ocupar espaço dentro do espaço ('dentro') ou ser sobreposto no meio do limite do espaço e dos espaços vizinhos ('overlay-boundary')"
		/>
		<Prop
			name="handleRender"
			type="(props: IResizeHandleProps) => ReactNode"
			description={
				<>
					Fornece um componente personalizado para usar na renderização de identificadores.
					<p>
						As propriedades fornecidas devem ser passadas diretamente para o componente personalizado para permitir que ele se comporte como um identificador de redimensionamento, ou seja,
						handleRender={"{"}(props) {"->"} &lt;MyCustomHandle {"{"}...props{"}"} /&gt;{"}"}
					</p>
					<p>
						<small>
							<code>
								IResizeHandleProps {"{"}
								<div style={{ marginLeft: 10 }}>
									id: string;
									<br />
									key: "left" | "top" | "right" | "bottom";
									<br />
									className: string;
									<br />
									onMouseDown: (e: React.MouseEvent{"<"}HTMLElement, MouseEvent{">"}) {"->"} void;
									<br />
									onTouchStart: (e: React.TouchEvent{"<"}HTMLElement, TouchEvent{">"}) {"->"} void;
								</div>
								{"}"}
							</code>
						</small>
					</p>
				</>
			}
		/>
		<Prop name="minimumSize" type="number" description="Restringe o redimensionamento do espaço a um tamanho mínimo." />
		<Prop name="maximumSize" type="number" description="Restringe o redimensionamento do espaço a um tamanho máximo." />
		<Prop
			name="onResizeStart"
			type="() => boolean | void"
			description="{Acionado quando um redimensionamento é iniciado. Retornar false do manipulador de eventos cancela o redimensionamento."
		/>
		<Prop
			name="onResizeEnd"
			type="(newSize: number, newRect: DOMRect, resizeType: ResizeType | 'resize-left' | 'resize-top' | 'resize-right' | 'resize-bottom') => void"
			description="Acionado quando um redimensionamento termina. O tamanho final em pixels do espaço após o redimensionamento é passado como primeiro parâmetro."
		/>
	</>
);

export const DemoUI = () => {
	const [sidebarExpanded, setSidebarExpanded] = React.useState(true);

	return (
		<React.StrictMode>
			<ArchbaseSpaceFixed style={{ border: "1px solid black" }} className="container" height={400}>
				<ArchbaseSpaceTop style={{ borderBottom: "1px dashed black", padding: 5 }} order={1} size={25} centerContent={CenterType.Vertical}>
					Título
				</ArchbaseSpaceTop>
				<ArchbaseSpaceTop style={{ borderBottom: "1px dashed black", padding: 5 }} order={2} size={25} centerContent={CenterType.Vertical}>
					Menu
				</ArchbaseSpaceTop>
				<ArchbaseSpaceFill>
					<ArchbaseSpaceLeftResizable style={{ borderRight: "1px dashed black", transition: "width 0.5s ease" }} size={sidebarExpanded ? 200 : 25}>
						<ArchbaseSpaceTop style={{ borderBottom: "1px dashed black" }} size={25}>
							{sidebarExpanded && (
								<ArchbaseSpaceFill style={{ padding: 5 }} centerContent={CenterType.Vertical}>
									Título Barra lateral
								</ArchbaseSpaceFill>
							)}
							<ArchbaseSpaceRight
								style={{ borderLeft: "1px dashed black", backgroundColor: "yellow", cursor: "pointer" }}
								size={25}
								onClick={() => setSidebarExpanded((prev) => !prev)}
								centerContent={CenterType.HorizontalVertical}>
								<i className={"fa fa-arrow-" + (sidebarExpanded ? "left" : "right")} />
							</ArchbaseSpaceRight>
						</ArchbaseSpaceTop>
						{sidebarExpanded && <ArchbaseSpaceFill centerContent={CenterType.HorizontalVertical}>Barra lateral</ArchbaseSpaceFill>}
					</ArchbaseSpaceLeftResizable>
					<ArchbaseSpaceFill style={{ borderRight: "1px dashed black", transition: "left 0.5s ease" }}>
						<ArchbaseSpaceFill centerContent={CenterType.HorizontalVertical}>Conteúdo principal</ArchbaseSpaceFill>
						<ArchbaseSpaceBottomResizable style={{ borderTop: "1px dashed black" }} size={100} centerContent={CenterType.HorizontalVertical}>
							Rodapé
						</ArchbaseSpaceBottomResizable>
					</ArchbaseSpaceFill>
				</ArchbaseSpaceFill>
			</ArchbaseSpaceFixed>
		</React.StrictMode>
	);
};

export const StateDriven: React.FC = () => {
	const [visible, setVisible] = React.useState(true);
	const [size, setSize] = React.useState(true);
	const [side, setSide] = React.useState(true);
	return (
		<ArchbaseSpaceViewPort as="main" className="state-driven">
			<ArchbaseSpaceLeftResizable as="aside" size="15%" style={red} trackSize={true}>
				{description("Esquerda")}
			</ArchbaseSpaceLeftResizable>
			<ArchbaseSpaceFill>
				<ArchbaseSpaceLayer zIndex={1}>
					<ArchbaseSpaceTopResizable size="15%" style={blue} trackSize={true}>
						{description("Topo")}
					</ArchbaseSpaceTopResizable>
					<ArchbaseSpaceFill>
						{visible && (
							<ArchbaseSpaceLeftResizable size={size ? "10%" : "15%"} order={0} style={green} trackSize={true}>
								{description("Esquerda 1", <button onClick={() => setSize((prev) => !prev)}>Alternar tamanho</button>)}
							</ArchbaseSpaceLeftResizable>
						)}
						<ArchbaseSpaceLeftResizable size={"10%"} order={1} style={red} trackSize={true}>
							{description("Esquerda 2")}
						</ArchbaseSpaceLeftResizable>
						<ArchbaseSpaceFill>
							<ArchbaseSpaceTopResizable size="20%" order={1} style={red} trackSize={true}>
								{description("Topo 1")}
							</ArchbaseSpaceTopResizable>
							<ArchbaseSpaceFill style={blue}>
								{side ? (
									<ArchbaseSpaceLeftResizable size="20%" style={white} trackSize={true}>
										{description("Esquerda 2", <button onClick={() => setSide((prev) => !prev)}>Alternar lado</button>)}
									</ArchbaseSpaceLeftResizable>
								) : (
									<ArchbaseSpaceTopResizable size="20%" style={white} trackSize={true}>
										{description("Topo", <button onClick={() => setSide((prev) => !prev)}>Alternar lado</button>)}
									</ArchbaseSpaceTopResizable>
								)}
								<ArchbaseSpaceFill trackSize={true}>
									{description("Preenchido", <button onClick={() => setVisible((prev) => !prev)}>Alternar visibilidade</button>)}
								</ArchbaseSpaceFill>
							</ArchbaseSpaceFill>
							<ArchbaseSpaceBottomResizable size="20%" style={red} trackSize={true}>
								{description("Bottom")}
							</ArchbaseSpaceBottomResizable>
						</ArchbaseSpaceFill>
						<ArchbaseSpaceRightResizable size="20%" style={green} scrollable={true} trackSize={true}>
							{lorem}
						</ArchbaseSpaceRightResizable>
					</ArchbaseSpaceFill>
					<ArchbaseSpaceBottomResizable size="15%" style={blue} trackSize={true}>
						{description("Rodapé")}
					</ArchbaseSpaceBottomResizable>
				</ArchbaseSpaceLayer>
			</ArchbaseSpaceFill>
			<ArchbaseSpaceRightResizable size="15%" style={red} trackSize={true}>
				{description("Direita")}
			</ArchbaseSpaceRightResizable>
		</ArchbaseSpaceViewPort>
	);
};

export const StateDrivenSize = () => {
	const [size, setSize] = React.useState<number | string | undefined>(250);
	return (
		<ArchbaseSpaceViewPort>
			<ArchbaseSpaceLeftResizable size={size} onResizeEnd={(s) => setSize(s)}></ArchbaseSpaceLeftResizable>
			<ArchbaseSpaceFill></ArchbaseSpaceFill>
		</ArchbaseSpaceViewPort>
	);
};

export const AnchoredDefaultOrdering = () => {
	return (
		<ArchbaseSpaceViewPort as="main">
			<ArchbaseSpaceLeft size="25%" style={blue} centerContent={CenterType.HorizontalVertical}>
				Esquerda 1
			</ArchbaseSpaceLeft>
			<ArchbaseSpaceLeft size="25%" style={green} centerContent={CenterType.HorizontalVertical}>
				Esquerda 2
			</ArchbaseSpaceLeft>
			<ArchbaseSpaceLeft size="25%" style={red} centerContent={CenterType.HorizontalVertical}>
				Esquerda 3
			</ArchbaseSpaceLeft>
			<ArchbaseSpaceFill style={blue} centerContent={CenterType.HorizontalVertical}>
				Preenchido
			</ArchbaseSpaceFill>
		</ArchbaseSpaceViewPort>
	);
};

export const SpaceDemoStacked1 = () => (
	<>
		<ArchbaseSpaceFixed height={400}>
			<ArchbaseSpaceLeftResizable trackSize={true} handleSize={30} size="10%" order={1} style={{ backgroundColor: "#e0eee0" }}>
				{Description("Esquerda 1", "L1")}
			</ArchbaseSpaceLeftResizable>
			<ArchbaseSpaceLeftResizable trackSize={true} handleSize={30} size="10%" order={2} style={{ backgroundColor: "#e0eeee" }}>
				{Description("Esquerda 2", "L2")}
			</ArchbaseSpaceLeftResizable>
			<ArchbaseSpaceFill trackSize={true} style={{ backgroundColor: "#eee0e0" }}>
				{Description("Preenchido", "F")}
			</ArchbaseSpaceFill>
			<ArchbaseSpaceRightResizable trackSize={true} handleSize={30} size="10%" order={2} style={{ backgroundColor: "#e0eeee" }}>
				{Description("Direita 2", "R2")}
			</ArchbaseSpaceRightResizable>
			<ArchbaseSpaceRightResizable trackSize={true} handleSize={30} size="10%" order={1} style={{ backgroundColor: "#e0eee0" }}>
				{Description("Direita 1", "R1")}
			</ArchbaseSpaceRightResizable>
		</ArchbaseSpaceFixed>
		<ArchbaseSpaceFixed height={400}>
			<ArchbaseSpaceLeftResizable trackSize={true} handleSize={30} size="10%" order={1} style={{ backgroundColor: "#e0eee0" }}>
				{Description("Esquerda 1", "L1")}
			</ArchbaseSpaceLeftResizable>
			<ArchbaseSpaceLeftResizable trackSize={true} handleSize={30} size="10%" order={2} style={{ backgroundColor: "#e0eeee" }}>
				{Description("Esquerda 2", "L2")}
			</ArchbaseSpaceLeftResizable>
			<ArchbaseSpaceFill trackSize={true} style={{ backgroundColor: "#eee0e0" }}>
				{Description("Preenchido", "F")}
			</ArchbaseSpaceFill>
			<ArchbaseSpaceRightResizable trackSize={true} handleSize={30} size="10%" order={2} style={{ backgroundColor: "#e0eeee" }}>
				{Description("Direita 2", "R2")}
			</ArchbaseSpaceRightResizable>
			<ArchbaseSpaceRightResizable trackSize={true} handleSize={30} size="10%" order={1} style={{ backgroundColor: "#e0eee0" }}>
				{Description("Direita 1", "R1")}
			</ArchbaseSpaceRightResizable>
		</ArchbaseSpaceFixed>
	</>
);

const Description = (desc: string, mobileDesc: string, extra?: React.ReactNode) => (
	<ArchbaseSpaceCentered>
		<span className="description">
			<strong className="desc">{desc}</strong>
			<strong className="mobileDesc">{mobileDesc}</strong>
			<br />
			<ArchbaseSpaceInfo>
				{(info) => (
					<span>
						{info.width.toFixed()} x {info.height.toFixed()}
					</span>
				)}
			</ArchbaseSpaceInfo>
			{extra}
		</span>
	</ArchbaseSpaceCentered>
);

const white = { backgroundColor: "#ffffff", padding: 15 };
export const blue: CSSProperties = { backgroundColor: "rgb(224, 238, 238, 0.7)" };
export const red: CSSProperties = { backgroundColor: "rgb(238, 224, 224, 0.7)" };
export const green: CSSProperties = { backgroundColor: "rgb(224, 238, 224, 0.7)" };

const DescriptionComponent = (props: { text: string }) => {
	const spaceInfo = useArchbaseCurrentSpace();

	return (
		<span className="description">
			<strong>{props.text}</strong>
			<br />
			{spaceInfo.size.width} x {spaceInfo.size.height}
		</span>
	);
};

export const description = (props: string, additional?: React.ReactNode) => {
	return (
		<ArchbaseSpaceCentered>
			<DescriptionComponent text={props} />
			<br />
			{additional}
		</ArchbaseSpaceCentered>
	);
};

export const lorem = (
	<div style={{ padding: 10, fontSize: 14, lineHeight: 1.5 }}>
		Fora do circuito, precisamos socializar as comunicações com a comunidade mais ampla de partes interessadas. 
		Suba no mastro da bandeira e encontre algo interessante perto do alinhamento de ganho da base de toque do loop. 
		Caro gerente de contratação: o serviço como núcleo e as inovações como poder tornam nossa marca um pool de 
		marketing de conteúdo de 360 ​​​​graus, mas colocamos o apim bol, temporariamente, para que depois possamos colocar 
		os monitores, ou contratar os melhores, daqui para frente. É melhor você comer um sanduíche de realidade antes 
		de voltar para a sala de reuniões, vamos colocar um alfinete nisso. Qual é o caminho a seguir neste trabalho. 
		Não vamos resolver isso agora, estacionamento, isso é óbvio, nem colocar seis filhotes alfa aqui para um grupo 
		focal, mas precisamos de uma recapitulação por eod, cob ou o que vier primeiro. Cliente de toque alto do céu azul 
		matando-o de polimento de bosta, mas data de entrega, nem calças de menino grande. Vitória rápida, precisamos 
		seguir o protocolo. Show de cães e pôneis. Sinos e assobios transformam o ecossistema de fluxo de trabalho em 
		agilização de dados, mas ainda assim usam python e não giram a manivela. Fluxos de trabalho, engajamento viral,
		podemos dar um zoom, para colocá-lo na região, no meio do mato, ou não tenho ciclos para isso, e marcamos 
		terroristas. O esforço feito foi um grande pool de marketing de conteúdo de 360 ​​​​graus para reinventar a roda.
		Quanta largura de banda você tem, pode me dar uma folga? eu sei que você está ocupado, acerte-o, pois estive 
		fazendo algumas pesquisas esta manhã e precisamos encontrar melhores resultados. Desbloqueie momentos 
		significativos de relaxamento com um único pescoço torcido. Girando nossas rodas, frutas ao alcance da mão, não
		precisamos ferver o oceano aqui, reunião zoom às 14h30 de hoje. As vendas trimestrais estão em níveis mais 
		baixos, não há necessidade de falar com os usuários, basta basear-se na calculadora de espaço e no marketing
		de guerrilha. Remo individual em forma de T em ambos os lados. Por favor, envie os arquivos sop e uat até a 
		próxima segunda-feira, e a oferta de cabeça de cavalo, mas ppt nítido. Reinvente a roda no mato, por favor avise 
		o mais rápido possível, mas a criatividade exige que você mate seus filhos, não é difícil, pessoal. Revisão completa, 
		obviamente. Posso apenas comentar sobre isso? No futuro, priorize esses itens de linha, mas corra sem uma linha 
		de chegada, mas com ações sinérgicas, nem se trata de gerenciar expectativas, suba até o mastro da bandeira, 
		e precisamos acertar o vernáculo.
	</div>
);
