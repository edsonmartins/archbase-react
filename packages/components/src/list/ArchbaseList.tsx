import { Box, Paper, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import { uniqueId } from 'lodash';
import React, { FocusEventHandler, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ArchbaseError } from '@archbase/core';
import { ArchbaseObjectHelper } from '@archbase/core';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames, IArchbaseDataSourceBase } from '@archbase/data';
import { useArchbaseDidMount, useArchbaseWillUnmount } from '@archbase/data';
import { useArchbaseForceRerender } from '@archbase/data';
import { ArchbaseListProvider } from './ArchbaseList.context';
import { ArchbaseListItem } from './ArchbaseListItem';

export interface ArchbaseListCustomItemProps<T, _ID> {
	/** Chave */
	key: string;
	/** Id do item */
	id: any;
	/** Indicador se o Item está ativo */
	active: boolean;
	/** Indice dentro da lista */
	index: number;
	/** Registro contendo dados de uma linha na lista */
	recordData: T;
	/** Indicador se item da lista está desabilitado */
	disabled: boolean;
}

export interface ComponentDefinition {
	type: React.ElementType;
	props?: any;
}

export interface ArchbaseListProps<T, ID> {
	/** Cor de fundo do item ativo */
	activeBackgroundColor?: string;
	/** Cor do item ativo */
	activeColor?: string;
	/** Alinhamento dos itens na lista */
	align?: 'left' | 'right' | 'center';
	/** Cor de fundo da lista */
	backgroundColor?: string;
	/** Cor do texto da lista */
	color?: string;
	/** Altura da lista */
	height?: number | string;
	/** Largura da lista */
	width?: number | string;
	/** desabilita todos os itens da lista */
	disabled?: boolean;
	/** Indicador se os itens da lista devem ser justificados */
	justify?: 'flex-start' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
	/** Evento que ocorre quando um item da lista é selecionado */
	onSelectListItem?: (index: number, data: any) => void;
	/** Mostra uma borda ao redor da lista */
	withBorder?: boolean;
	/** Cor da borda */
	borderColor?: string;
	/** Arredondamento dos cantos da borda */
	borderRadius?: string | number | undefined;
	/** Propriedade do objeto de dados que representa o texto a ser apresentado na lista */
	dataFieldText?: string;
	/** Propriedade do objeto de dados que representa o ID do item na lista para controle */
	dataFieldId?: string;
	/** Indice do item ativo na lista */
	activeIndex?: number | undefined;
	/** Evento gerado quando o mouse está sobre um item */
	onItemEnter?: (event: React.MouseEvent, data: any) => void;
	/** Evento gerado quando o mouse sai de um item */
	onItemLeave?: (event: React.MouseEvent, data: any) => void;
	/** Permite costumizar o style da lista */
	style?: React.CSSProperties;
	/** Id da lista */
	id?: string;
	/** Fonte de dados a ser usado pela lista (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Filtro a ser aplicado na lista */
	filter?: string;
	/** Function a ser aplicada na lista para filtrar os itens */
	onFilter?: (record: any) => boolean;
	/** Definições do componente customizado a ser renderizado para um Item da lista */
	component?: ComponentDefinition;
	/** Somente componentes <ArchbaseListItem /> */
	children?: React.ReactNode[];
	/** Tipo de lista: ol,ul,div */
	type?: 'ordered' | 'unordered' | 'none';
	/** Incluir preenchimento à esquerda para compensar a lista do conteúdo principal */
	withPadding?: boolean;
	/** Tamanho da fonte do tema ou número para definir o valor */
	size?: string | number | undefined;
	/** Ícone que deve substituir o ponto do item da lista */
	icon?: React.ReactNode;
	/** Imagem ou source de uma imagem para mostrar no item da lista */
	image?: React.ReactNode | string;
	/** Arredondamento da Imagem */
	imageRadius?: string | number | undefined;
	/** Altura da imagem */
	imageHeight?: number | string;
	/** Largura da Imagem */
	imageWidth?: number | string;
	/** Espaçamento entre os valores do item */
	spacing?: string | number | undefined;
	/** Centralizar itens com ícone */
	center?: boolean;
	/** Lista horizontal */
	horizontal?: boolean;
	/** force update list */
	update?: number;
	/** Estilo de lista */
	listStyleType?: React.CSSProperties['listStyleType'];
	onFocusEnter?: FocusEventHandler<HTMLDivElement> | undefined;
	onFocusExit?: FocusEventHandler<HTMLDivElement> | undefined;
}

export function ArchbaseList<T, ID>(props: ArchbaseListProps<T, ID>) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const {
		activeBackgroundColor = theme.colors[theme.primaryColor][colorScheme === 'dark' ? 5 : 5],
		activeColor = 'white',
		backgroundColor,
		align,
		color,
		height = '20rem',
		justify = 'flex-start',
		onSelectListItem,
		width,
		withBorder = true,
		borderRadius,
		dataFieldText = 'text',
		dataFieldId = 'id',
		activeIndex: controlledActiveIndex,
		onItemEnter,
		onItemLeave,
		style,
		id,
		dataSource,
		filter,
		horizontal = false,
		onFilter,
		children,
		withPadding = false,
		listStyleType = '',
		center = false,
		spacing = 'md',
		type = 'none',
		icon,
		image,
		imageRadius,
		imageWidth,
		imageHeight,
		disabled,
		update = 0,
		onFocusEnter = () => {},
		onFocusExit = () => {},
	} = props;
	// Estado interno para o índice ativo (modo não controlado)
	const [activeIndex, setActiveIndex] = useState(controlledActiveIndex || -1);
	const [updateCounter, setUpdateCounter] = useState(0);
	const [rebuildedChildrens, setRebuildedChildrens] = useState<ReactNode[]>([]);
	const classes = {
		root: {
			listStyleType,
			color: colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
			margin: 0,
			paddingLeft: withPadding ? theme.spacing.xl : 0,
			listStylePosition: 'inside',
			flexDirection: horizontal ? 'row' : 'column',
			display: horizontal ? 'flex' : 'inherit',
			width: '100%',
			height: height,
			overflowY: 'auto',
			...style,
		},
	} as const;

	const [currentFilter, setCurrentFilter] = useState(filter);
	const [idList] = useState(id);

	// V1/V2 Compatibility Pattern
	const v1v2Compatibility = useArchbaseV1V2Compatibility<T>(
		'ArchbaseList',
		dataSource
	);
	const forceUpdate = useForceUpdate();

	// Efeito para atualizar o índice ativo quando a propriedade controlledActiveIndex muda
	useEffect(() => {
		if (controlledActiveIndex !== undefined) {
			setActiveIndex(controlledActiveIndex);
		}
	}, [controlledActiveIndex]);

	// Efeito para atualizar o índice ativo com base na fonte de dados
	useEffect(() => {
		const dataSourceListener = (event: DataSourceEvent<T>) => {
			if (
				event.type === DataSourceEventNames.afterScroll ||
				event.type === DataSourceEventNames.fieldChanged ||
				event.type === DataSourceEventNames.dataChanged ||
				event.type === DataSourceEventNames.afterRemove ||
				event.type === DataSourceEventNames.recordChanged
			) {
				// Obtenha o índice ativo do dataSource
				const dataSourceActiveIndex = dataSource!.getCurrentIndex();

				// Atualize o índice ativo do componente apenas se for diferente
				if (activeIndex !== dataSourceActiveIndex) {
					setActiveIndex(dataSourceActiveIndex);

					// Chame a função de retorno de chamada (callback) se estiver definida (modo controlado)
					if (onSelectListItem) {
						onSelectListItem(dataSourceActiveIndex, dataSource?.getCurrentRecord());
					}
				} else {
					setUpdateCounter((prev) => prev + 1);
					// Force update for V1 DataSource
					if (!v1v2Compatibility.isDataSourceV2) {
						forceUpdate();
					}
				}
			}
		};

		// Adicione o ouvinte da fonte de dados no momento da montagem
		if (dataSource) {
			dataSource!.addListener(dataSourceListener);
		}

		// Retire o ouvinte da fonte de dados no momento da desmontagem
		return () => {
			if (dataSource) {
				dataSource.removeListener(dataSourceListener);
			}
		};
	}, [dataSource, activeIndex, onSelectListItem, forceUpdate, v1v2Compatibility.isDataSourceV2]);

	useEffect(() => {
		setCurrentFilter(filter);
	}, [filter]);

	// Função para lidar com a seleção de um item
	const handleSelectItem = (index: number, data: T) => {
		// Atualize o índice ativo no estado interno (modo não controlado)
		if (controlledActiveIndex === undefined) {
			setActiveIndex(index);
		}

		// Chame a função de retorno de chamada (callback) se estiver definida (modo controlado)
		if (onSelectListItem) {
			onSelectListItem(index, data);
		}
	};

	useEffect(() => {
		// Atualize o índice da fonte de dados usando gotoRecord
		if (dataSource && dataSource instanceof ArchbaseDataSource && activeIndex >= 0) {
			if (dataSource.getCurrentIndex() !== activeIndex && !dataSource.isEmpty()) {
				dataSource.gotoRecord(activeIndex);
			}
		}
	}, [activeIndex]);

	const handleKeyDown = (event) => {
		const keyActions = {
			38: () => handleArrowUp(),
			37: () => handleArrowLeft(),
			40: () => handleArrowDown(),
			39: () => handleArrowRight(),
			33: () => handlePageUp(),
			34: () => handlePageDown(),
			36: () => handleHome(),
			35: () => handleEnd(),
		};
		if (activeIndex >= 0 && rebuildedChildrens.length > 0) {
			const action = keyActions[event.keyCode];
			if (action) {
				event.preventDefault();
				action();
			}
		}
	};

	const handleArrowUp = () => {
		const index = activeIndex;
		if (index - 1 >= 0) {
			handleSelectItem(index - 1, getRecordDataFromChildren(index - 1));
		}
	};

	const handleArrowLeft = () => {
		handleArrowUp();
	};

	const handleArrowDown = () => {
		const index = activeIndex;
		if (index + 1 < rebuildedChildrens.length) {
			handleSelectItem(index + 1, getRecordDataFromChildren(index + 1));
		}
	};

	const handleArrowRight = () => {
		handleArrowDown();
	};

	const handlePageUp = () => {
		const index = Math.max(activeIndex - 5, 0);
		handleSelectItem(index, getRecordDataFromChildren(index));
	};

	const handlePageDown = () => {
		const index = Math.min(activeIndex + 5, rebuildedChildrens.length - 1);
		handleSelectItem(index, getRecordDataFromChildren(index));
	};

	const handleHome = () => {
		handleSelectItem(0, getRecordDataFromChildren(0));
	};

	const handleEnd = () => {
		const index = rebuildedChildrens.length - 1;
		handleSelectItem(index, getRecordDataFromChildren(index));
	};

	const buildChildrensFromDataSource = (dataSource: IArchbaseDataSourceBase<T>) => {
		const sourceData = dataSource.browseRecords();
		return sourceData.map((record: any, index: number) => {
			if (!record) {
				return null;
			}
			let itemIsValid = true;
			if (currentFilter && dataFieldText) {
				if (ArchbaseObjectHelper.getNestedProperty(record, dataFieldText)) {
					if (!ArchbaseObjectHelper.getNestedProperty(record, dataFieldText).includes(currentFilter)) {
						itemIsValid = false;
					}
				}
			}
			if (onFilter) {
				itemIsValid = onFilter(record);
			}

			if (itemIsValid) {
				let active = record.active === undefined ? false : record.active;
				if (activeIndex >= 0) {
					active = false;
					if (activeIndex === index) {
						active = true;
					}
				}
				const { component, id, dataSource, ...rest } = props;
				if (component) {
					const DynamicComponent = component.type;
					let compProps = {};
					if (component.props) {
						compProps = component.props;
					}

					let newId = ArchbaseObjectHelper.getNestedProperty(record, dataFieldId);
					if (!newId) {
						newId = `${idList}_${index}`;
					}

					const newKey = `${idList}_${index}`;

					return (
						<DynamicComponent
							key={newKey}
							id={newId}
							active={active}
							index={index}
							dataSource={dataSource}
							recordData={record}
							disabled={record.disabled || disabled}
							{...compProps}
							{...rest}
							{...component.props}
						/>
					);
				} else {
					let newId = ArchbaseObjectHelper.getNestedProperty(record, dataFieldId);
					if (!newId) {
						newId = `${idList}_${index}`;
					}
					const newKey = `${idList}_${index}`;
					return (
						<ArchbaseListItem
							key={newKey}
							disabled={record.disabled || disabled}
							id={newId}
							index={index}
							active={active}
							align={record.align}
							justify={record.justify === undefined ? justify : record.justify}
							activeBackgroundColor={
								record.activeBackColor === undefined ? activeBackgroundColor : record.activeBackColor
							}
							activeColor={record.activeColor === undefined ? activeColor : record.activeColor}
							backgroundColor={record.backgroundColor === undefined ? backgroundColor : record.backgroundColor}
							color={record.color === undefined ? color : record.color}
							imageRadius={imageRadius}
							imageHeight={imageHeight}
							imageWidth={imageWidth}
							icon={record.icon ? record.icon : icon}
							image={image}
							spacing={spacing}
							caption={ArchbaseObjectHelper.getNestedProperty(record, dataFieldText)}
							withBorder={record.withBorder === undefined ? withBorder : record.withBorder}
							visible={true}
							recordData={record}
						/>
					);
				}
			}
			return null;
		});
	};

	const getRecordDataFromChildren = (index) => {
		let result;
		rebuildedChildrens.forEach((item: any) => {
			if (item.props.index === index) {
				result = item.props.recordData;
			}
		});
		return result;
	};

	const rebuildChildrens = (): ReactNode[] => {
		return React.Children.toArray(children).map((child: any, index: number) => {
			if (child.props.visible)
				if (child.type && child.type.componentName !== 'ArchbaseListItem') {
					throw new ArchbaseError(
						'Apenas componentes do tipo ArchbaseListItem podem ser usados como filhos de ArchbaseList.',
					);
				}
			if (!child.id) {
				throw new ArchbaseError('Todos os itens da lista devem conter um ID.');
			}
			let active: boolean = child.active;
			if (activeIndex >= 0) {
				active = false;
				if (activeIndex === index) {
					active = true;
				}
			}
			return (
				<ArchbaseListItem
					key={child.id}
					disabled={child.disabled || disabled}
					id={child.id}
					index={index}
					active={active}
					align={align}
					justify={child.justify === undefined ? justify : child.justify}
					activeBackgroundColor={child.activeBackColor === undefined ? activeBackgroundColor : child.activeBackColor}
					activeColor={child.activeColor === undefined ? activeColor : child.activeColor}
					backgroundColor={child.backgroundColor === undefined ? backgroundColor : child.backgroundColor}
					color={child.color === undefined ? color : child.color}
					imageRadius={child.imageRadius ? child.imageRadius : imageRadius}
					imageHeight={child.imageHeight ? child.imageHeight : imageHeight}
					imageWidth={child.imageWidth ? child.imageWidth : imageWidth}
					icon={child.icon ? child.icon : icon}
					image={child.image ? child.image : image}
					spacing={child.spacing ? child.spacing : spacing}
					caption={child.caption}
					withBorder={child.withBorder === undefined ? withBorder : child.withBorder}
					visible={child.visible}
				>
					{child.children}
				</ArchbaseListItem>
			);
		});
	};

	useEffect(() => {
		if (dataSource) {
			const newChildrens = buildChildrensFromDataSource(dataSource);
			setRebuildedChildrens(newChildrens);
			// Force update for V1 DataSource on data changes
			if (!v1v2Compatibility.isDataSourceV2) {
				forceUpdate();
			}
		} else if (children) {
			const newChildrens = rebuildChildrens();
			setRebuildedChildrens(newChildrens);
		} else {
			setRebuildedChildrens([]);
		}
	}, [updateCounter, activeIndex, (dataSource as any)?.lastDataChangedAt, (dataSource as any)?.lastDataBrowsingOn, children, forceUpdate, v1v2Compatibility.isDataSourceV2]);

	return (
		<Paper
			id={idList}
			tabIndex={-1}
			withBorder={withBorder}
			radius={borderRadius}
			onKeyDown={handleKeyDown}
			onFocus={onFocusEnter}
			onBlur={onFocusExit}
			w={width}
		>
			<Box<any>
				component={type === 'unordered' ? 'ul' : type === 'ordered' ? 'ol' : 'div'}
				style={classes.root}
				tabIndex={-1}
			>
				<ArchbaseListProvider
					value={{
						dataSource,
						ownerId: id,
						handleSelectItem,
						activeBackgroundColor,
						activeColor,
						type,
						onItemEnter,
						onItemLeave,
						align,
						disabled,
					}}
				>
					{rebuildedChildrens}
				</ArchbaseListProvider>
			</Box>
		</Paper>
	);
}

ArchbaseList.displayName = 'ArchbaseList';
