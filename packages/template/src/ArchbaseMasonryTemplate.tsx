/**
 * ArchbaseMasonryTemplate — template de layout masonry responsivo com integração a DataSource.
 * @status stable
 */
import { useArchbaseDataSourceListener } from '@archbase/data';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import { ButtonVariant, Flex, Pagination } from '@mantine/core';
import useComponentSize from '@rehooks/component-size';
import { IconEdit, IconEye, IconPlus, IconTrash } from '@tabler/icons-react';
import { getI18nextInstance, useArchbaseTranslation } from '@archbase/core';
import { uniqueId } from 'lodash';
import React, { CSSProperties, Profiler, ReactNode, useMemo, useRef, useState } from 'react';
import { ComponentDefinition, useArchbaseAppContext } from '@archbase/core';
import { type ArchbaseDataSource, type DataSourceEvent, DataSourceEventNames } from '@archbase/data';
import { ArchbaseMasonry, ArchbaseMasonryProvider, ArchbaseMasonryResponsive } from '@archbase/components';
import {
	ArchbaseGlobalFilter,
	ArchbaseQueryFilter,
	ArchbaseQueryFilterDelegator,
	ArchbaseQueryFilterState,
	ArchbaseQueryBuilder,
	FilterOptions,
} from '@archbase/advanced';
import { ArchbaseSpaceTemplate, ArchbaseSpaceTemplateOptions } from './ArchbaseSpaceTemplate';
import { ArchbaseDebugOptions, ArchbaseTemplateSecurityProps } from './ArchbaseTemplateCommonTypes';
import { ArchbaseConditionalSecurityWrapper, ArchbaseSmartActionButton } from './components';

export interface MasonryUserActionsOptions {
	visible?: boolean;
	labelAdd?: string | undefined | null;
	labelEdit?: string | undefined | null;
	labelRemove?: string | undefined | null;
	labelView?: string | undefined | null;
	allowAdd?: boolean;
	allowEdit?: boolean;
	allowView?: boolean;
	allowRemove?: boolean;
	onAddExecute?: () => void;
	onEditExecute?: () => void;
	onRemoveExecute?: () => void;
	onViewExecute?: () => void;
	customUserActions?: ReactNode;
	customUserActionsPosition?: 'left' | 'right';
}

export interface MasonryUserRowActionsOptions<T> {
	actions?: any;
	onAddRow?: (row: T) => void;
	onEditRow?: (row: T) => void;
	onRemoveRow?: (row: T) => void;
	onViewRow?: (row: T) => void;
}

export interface ArchbaseMasonryTemplateProps<T, ID> extends ArchbaseTemplateSecurityProps {
	title: string;
	dataSource: ArchbaseDataSource<T, ID>;
	dataSourceEdition?: ArchbaseDataSource<T, ID> | undefined;
	filterType: 'none' | 'normal' | 'advanced';
	globalFilterFieldNames?: string[];
	filterOptions: FilterOptions;
	pageSize?: number;
	filterFields: ReactNode | undefined;
	filterPersistenceDelegator: ArchbaseQueryFilterDelegator;
	userActions?: MasonryUserActionsOptions;
	variant?: string;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
	isLoading?: boolean;
	debug?: boolean;
	isError?: boolean;
	error?: string | undefined;
	clearError?: () => void;
	width?: number | string | undefined;
	height?: number | string | undefined;
	withBorder?: boolean;
	withPagination?: boolean;
	radius?: string | number | undefined;
	columnsCountBreakPoints?: Record<number, number>;
	columnsCount?: number;
	gutter?: string;
	/** Definições do componente customizado a ser renderizado para um Item da lista */
	component?: ComponentDefinition;
	id?: string;
	activeIndex?: number;
	/** Cor de fundo do item ativo */
	activeBackgroundColor?: string;
	/** Cor do item ativo */
	activeColor?: string;
	/** Evento gerado quando o mouse está sobre um item */
	onItemEnter?: (event: React.MouseEvent, data: any) => void;
	/** Evento gerado quando o mouse sai de um item */
	onItemLeave?: (event: React.MouseEvent, data: any) => void;
	style?: CSSProperties;
	spaceOptions?: ArchbaseSpaceTemplateOptions;
	debugOptions?: ArchbaseDebugOptions;
}

function onRenderCallback(
	id, // ID exclusivo da medição
	phase, // 'mount' (montagem) ou 'update' (atualização)
	actualDuration, // Tempo em milissegundos gasto na renderização
	baseDuration, // Tempo em milissegundos estimado para renderização sem memoização
	startTime, // Timestamp quando a renderização começou
	commitTime, // Timestamp quando a renderização foi confirmada
) {
	console.log(`Render de "${id}" na fase "${phase}": ${actualDuration}ms`);
}

export function ArchbaseMasonryTemplate<T extends object, ID>({
	title,
	dataSource,
	//  dataSourceEdition,
	filterOptions,
	globalFilterFieldNames,
	//pageSize,
	filterFields,
	innerRef,
	//isLoading = false,
	debug = false,
	filterType = "normal",
	isError = false,
	error = '',
	clearError = () => { },
	width = '100%',
	height = '100%',
	withBorder = true,
	filterPersistenceDelegator,
	withPagination = true,
	radius,
	userActions,
	columnsCountBreakPoints,
	columnsCount,
	gutter,
	component,
	activeIndex,
	activeBackgroundColor,
	activeColor,
	onItemEnter,
	onItemLeave,
	style,
	spaceOptions,
	variant,
	id = uniqueId('masonry'),
	debugOptions,
	// Props de segurança (opcionais)
	resourceName,
	resourceDescription,
	requiredPermissions,
	fallbackComponent,
	securityOptions,
}: ArchbaseMasonryTemplateProps<T, ID>) {
	const appContext = useArchbaseAppContext();

	const [idMasonry] = useState(id);
	const innerComponentRef = innerRef || useRef<any>(null);
	const filterRef = useRef<any>(null);
	const [activePage, setPage] = useState(dataSource.getCurrentPage());
	const [activeIndexValue, setActiveIndexValue] = useState(
		activeIndex ? activeIndex : dataSource && dataSource.getTotalRecords() > 0 ? 0 : -1,
	);
	const size = useComponentSize(innerComponentRef);
	const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
		activeFilterIndex: -1,
		expandedFilter: false,
	});
	const [updateCounter, setUpdateCounter] = useState<number>(0);

	// V1/V2 Compatibility Pattern
	const {
		isDataSourceV2,
		v1State: { forceUpdate }
	} = useArchbaseV1V2Compatibility<T>(
		'ArchbaseMasonryTemplate',
		dataSource
	);

	useArchbaseDataSourceListener<T, ID>({
		dataSource,
		listener: (event: DataSourceEvent<T>): void => {
			if (event.type === DataSourceEventNames.afterRemove || event.type === DataSourceEventNames.refreshData) {
				setUpdateCounter((prev) => prev + 1);
				// Force update for V1 DataSource
				if (!isDataSourceV2) {
					forceUpdate();
				}
			}
		},
	});

	const cards: ReactNode[] = useMemo(() => {
		if (component) {
			const DynamicComponent = component.type;
			let compProps = {};
			if (component.props) {
				compProps = component.props;
			}

			return dataSource.browseRecords().map((record: any, index: number) => {
				const newKey = `${idMasonry}_${index}`;
				const newId = `${idMasonry}_${index}`;
				let active = record.active === undefined ? false : record.active;
				if (activeIndexValue >= 0) {
					active = false;
					if (activeIndexValue === index) {
						active = true;
					}
				}

				return (
					<DynamicComponent
						key={newKey}
						id={newId}
						active={active}
						index={index}
						dataSource={dataSource}
						recordData={record}
						disabled={record.disabled}
						{...compProps}
					/>
				);
			});
		}

		return [];
	}, [activeIndexValue, component, idMasonry, dataSource, updateCounter]);

	const handleFilterChanged = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
		setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
	};

	const handleToggleExpandedFilter = (expanded: boolean) => {
		setFilterState({ ...filterState, expandedFilter: expanded });
	};

	const handleSelectedFilter = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
		setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
	};

	const handleSearchByFilter = () => { };

	const handleSelectItem = (index: number, data: T) => {
		setActiveIndexValue(index);
		if (dataSource) {
			dataSource.gotoRecordByData(data);
		}
	};

	const handleGlobalFilter = (buildedQuery: string) => {
		if (dataSource) {
			const options = dataSource.getOptions();
			options.filter = buildedQuery;
			options.currentPage = activePage;
			dataSource.refreshData(options);
			// Force update for V1 DataSource
			if (!isDataSourceV2) {
				forceUpdate();
			}
		}
	};

	const handlePageChange = (page: number) => {
		if (dataSource) {
			const options = dataSource.getOptions();
			options.currentPage = page;
			dataSource.refreshData(options);
			// Force update for V1 DataSource
			if (!isDataSourceV2) {
				forceUpdate();
			}
		}
	};

	const buildFilter = (): ReactNode => {
		if (filterType === "normal" && globalFilterFieldNames) {
			return (
				<ArchbaseGlobalFilter
					searchableFields={globalFilterFieldNames}
					onFilter={handleGlobalFilter}
					minFilterValueLength={1}
				/>
			);
		}
		if (filterType === "advanced") {
			return (
				<Profiler id={`profile_${filterOptions.componentName}`} onRender={onRenderCallback}>
					<ArchbaseQueryBuilder
						id={filterOptions.componentName}
						viewName={filterOptions.viewName}
						apiVersion={filterOptions.apiVersion}
						ref={filterRef}
						variant={variant ? (variant as ButtonVariant) : (appContext.variant as ButtonVariant)}
						expandedFilter={filterState.expandedFilter}
						persistenceDelegator={filterPersistenceDelegator}
						currentFilter={filterState.currentFilter}
						activeFilterIndex={filterState.activeFilterIndex}
						onSelectedFilter={handleSelectedFilter}
						onFilterChanged={handleFilterChanged}
						onSearchByFilter={handleSearchByFilter}
						onToggleExpandedFilter={handleToggleExpandedFilter}
						width={'660px'}
						height="170px"
					>
						{filterFields}
					</ArchbaseQueryBuilder>
				</Profiler>
			);
		}
		return <></>
	};

	const defaultSpaceTemplateOptions: ArchbaseSpaceTemplateOptions = {
		headerFlexGrow: 'left',
		footerGridColumns: {},
	};

	const _spaceTemplateOptions = { ...defaultSpaceTemplateOptions, ...spaceOptions };

	// ✅ CORRIGIDO: Usando JSX inline em vez de componente função para evitar remontagem
	// 🔐 WRAPPER CONDICIONAL: Só aplica segurança SE resourceName fornecido
	return (
		<ArchbaseConditionalSecurityWrapper
			resourceName={resourceName}
			resourceDescription={resourceDescription}
			requiredPermissions={requiredPermissions}
			fallbackComponent={fallbackComponent}
			onSecurityReady={securityOptions?.onSecurityReady}
			onAccessDenied={securityOptions?.onAccessDenied}
		>
			<ArchbaseSpaceTemplate
				innerRef={innerComponentRef}
				width={width}
				height={height}
				radius={radius}
				withBorder={withBorder}
				isError={isError}
				error={error}
				clearError={clearError}
				title={title}
				defaultDebug={debug}
				debugOptions={debugOptions}
				style={style}
				options={_spaceTemplateOptions}
				headerLeft={
					userActions?.visible !== false ? (
						<Flex gap="8px" rowGap="8px">
							{userActions?.customUserActions && userActions?.customUserActionsPosition === 'left'
								? userActions.customUserActions
								: null}
							{userActions?.allowAdd !== false && userActions?.onAddExecute ? (
								<ArchbaseSmartActionButton
									actionName="add"
									actionDescription={`Adicionar novo ${resourceDescription || 'registro'}`}
									color="green"
									variant={variant ?? appContext.variant}
									leftSection={<IconPlus />}
									onClick={() => userActions.onAddExecute!()}
								>
									{userActions.labelAdd || getI18nextInstance().t('archbase:New')}
								</ArchbaseSmartActionButton>
							) : null}
							{userActions?.allowEdit !== false && userActions?.onEditExecute ? (
								<ArchbaseSmartActionButton
									actionName="edit"
									actionDescription={`Editar ${resourceDescription || 'registro'}`}
									color="blue"
									leftSection={<IconEdit />}
									disabled={!dataSource.isBrowsing() || dataSource.isEmpty()}
									variant={variant ?? appContext.variant}
									onClick={() => userActions.onEditExecute!()}
								>
									{userActions.labelEdit || getI18nextInstance().t('archbase:Edit')}
								</ArchbaseSmartActionButton>
							) : null}
							{userActions?.allowRemove !== false && userActions?.onRemoveExecute ? (
								<ArchbaseSmartActionButton
									actionName="delete"
									actionDescription={`Remover ${resourceDescription || 'registro'}`}
									color="red"
									leftSection={<IconTrash />}
									disabled={!dataSource.isBrowsing() || dataSource.isEmpty()}
									variant={variant ?? appContext.variant}
									onClick={() => userActions.onRemoveExecute!()}
								>
									{userActions.labelRemove || getI18nextInstance().t('archbase:Remove')}
								</ArchbaseSmartActionButton>
							) : null}
							{userActions?.allowView !== false && userActions?.onViewExecute ? (
								<ArchbaseSmartActionButton
									actionName="view"
									actionDescription={`Visualizar ${resourceDescription || 'registro'}`}
									color="gray.7"
									leftSection={<IconEye />}
									disabled={!dataSource.isBrowsing() || dataSource.isEmpty()}
									variant={variant ?? appContext.variant}
									onClick={() => userActions.onViewExecute!()}
								>
									{userActions.labelView || getI18nextInstance().t('archbase:View')}
								</ArchbaseSmartActionButton>
							) : null}
							{userActions?.customUserActions && userActions?.customUserActionsPosition === 'right'
								? userActions.customUserActions
								: null}
						</Flex>
					) : undefined
				}
				headerRight={buildFilter()}
				footerRight={
					withPagination ? <Pagination total={dataSource.getTotalPages()} onChange={handlePageChange} /> : undefined
				}
			>
				<ArchbaseMasonryProvider
					value={{
						dataSource,
						ownerId: id,
						handleSelectItem,
						activeBackgroundColor,
						activeColor,
						onItemEnter,
						onItemLeave,
					}}
				>
					<ArchbaseMasonryResponsive columnsCountBreakPoints={columnsCountBreakPoints}>
						<ArchbaseMasonry gutter={gutter} columnsCount={columnsCount}>
							{cards}
						</ArchbaseMasonry>
					</ArchbaseMasonryResponsive>
				</ArchbaseMasonryProvider>
			</ArchbaseSpaceTemplate>
		</ArchbaseConditionalSecurityWrapper>
	);
}
