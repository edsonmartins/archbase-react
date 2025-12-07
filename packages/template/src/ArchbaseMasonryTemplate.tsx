import { useArchbaseDataSourceListener } from '@archbase/data';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import { ButtonVariant, Pagination } from '@mantine/core';
import useComponentSize from '@rehooks/component-size';
import { IconEdit, IconEye, IconPlus, IconTrash } from '@tabler/icons-react';
import { getI18nextInstance, useArchbaseTranslation } from '@archbase/core';
import { uniqueId } from 'lodash';
import React, { CSSProperties, Fragment, Profiler, ReactNode, useMemo, useRef, useState } from 'react';
import { ArchbaseAction, ArchbaseActionButtons, ArchbaseActionButtonsOptions } from '@archbase/components';
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
import { Field } from '@archbase/core';
import { ArchbaseSpaceTemplate, ArchbaseSpaceTemplateOptions } from './ArchbaseSpaceTemplate';
import { ArchbaseDebugOptions, ArchbaseTemplateSecurityProps } from './ArchbaseTemplateCommonTypes';
import { ArchbaseConditionalSecurityWrapper } from './components';
import { useOptionalTemplateSecurity } from './hooks';

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
	customUserActions?: ArchbaseAction[];
	positionCustomUserActions?: 'before' | 'after';
}

const defaultUserActions: MasonryUserActionsOptions = {
	visible: true,
	allowAdd: true,
	allowEdit: true,
	allowView: true,
	allowRemove: true,
	positionCustomUserActions: 'after',
};

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
	actionsButtonsOptions?: ArchbaseActionButtonsOptions;
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
	actionsButtonsOptions,
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

	// 🔐 SEGURANÇA: Hook opcional de segurança (só ativa se resourceName fornecido)
	const security = useOptionalTemplateSecurity({
		resourceName,
		resourceDescription,
		autoRegisterActions: securityOptions?.autoRegisterActions ?? true
	});

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

	const userActionsBuilded: ArchbaseAction[] = useMemo(() => {
		const userActionsEnd = { ...defaultUserActions, ...userActions };
		const defaultActions: ArchbaseAction[] = [];

		// 🔐 SEGURANÇA: Função helper para verificar se tem permissão
		const hasActionPermission = (actionName: string): boolean => {
			if (!security.isAvailable) return true; // Sem contexto de segurança = permite tudo
			// Por enquanto registra e permite - lógica completa será implementada posteriormente
			security.registerAction();
			return security.hasPermission();
		};

		if (userActionsEnd.allowAdd && userActionsEnd.onAddExecute) {
			const hasPermission = hasActionPermission('add');
			if (hasPermission) {
				defaultActions.push({
					id: 'actAdd',
					icon: <IconPlus />,
					color: 'green',
					label: userActionsEnd.labelAdd ? userActionsEnd.labelAdd : getI18nextInstance().t('archbase:New'),
					executeAction: () => {
						if (userActionsEnd && userActionsEnd.onAddExecute) {
							userActionsEnd.onAddExecute();
						}
					},
					enabled: true,
					hint: `${getI18nextInstance().t('archbase:Clique para criar um novo registro')}`,
				});
			}
		}
		if (userActionsEnd.allowEdit && userActionsEnd.onEditExecute) {
			const hasPermission = hasActionPermission('edit');
			if (hasPermission) {
				defaultActions.push({
					id: 'actEdit',
					icon: <IconEdit />,
					color: 'blue',
					label: userActionsEnd.labelEdit ? userActionsEnd.labelEdit : getI18nextInstance().t('archbase:Edit'),
					executeAction: () => {
						if (userActionsEnd && userActionsEnd.onEditExecute) {
							userActionsEnd.onEditExecute();
						}
					},
					enabled: !dataSource.isEmpty() && dataSource.isBrowsing(),
					hint: `${getI18nextInstance().t('archbase:Clique para editar o registro')}`,
				});
			}
		}
		if (userActionsEnd.allowRemove && userActionsEnd.onRemoveExecute) {
			const hasPermission = hasActionPermission('delete');
			if (hasPermission) {
				defaultActions.push({
					id: 'actRemove',
					icon: <IconTrash />,
					color: 'red',
					label: userActionsEnd.labelRemove ? userActionsEnd.labelRemove : getI18nextInstance().t('archbase:Remove'),
					executeAction: () => {
						if (userActionsEnd && userActionsEnd.onRemoveExecute) {
							userActionsEnd.onRemoveExecute();
						}
					},
					enabled: !dataSource.isEmpty() && dataSource.isBrowsing(),
					hint: `${getI18nextInstance().t('archbase:Clique para remover o registro')}`,
				});
			}
		}

		if (userActionsEnd.allowView && userActionsEnd.onViewExecute) {
			const hasPermission = hasActionPermission('view');
			if (hasPermission) {
				defaultActions.push({
					id: 'actView',
					icon: <IconEye />,
					label: userActionsEnd.labelView ? userActionsEnd.labelView : getI18nextInstance().t('archbase:View'),
					executeAction: () => {
						if (userActionsEnd && userActionsEnd.onViewExecute) {
							userActionsEnd.onViewExecute();
						}
					},
					enabled: !dataSource.isEmpty() && dataSource.isBrowsing(),
					hint: `${getI18nextInstance().t('archbase:Clique para visualizar o registro')}`,
				});
			}
		}

		if (userActionsEnd.customUserActions && userActionsEnd.positionCustomUserActions === 'before') {
			return [...userActionsEnd.customUserActions, ...defaultActions];
		}

		if (userActionsEnd.customUserActions && userActionsEnd.positionCustomUserActions === 'after') {
			return [...defaultActions, ...userActionsEnd.customUserActions];
		}

		return defaultActions;
	}, [userActions, dataSource, security]);

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

	const defaultActionsButtonsOptions: ArchbaseActionButtonsOptions = {
		menuButtonColor: 'blue.5',
		menuPosition: 'left',
	};

	const defaultSpaceTemplateOptions: ArchbaseSpaceTemplateOptions = {
		headerFlexGrow: 'left',
		footerGridColumns: {},
	};

	const _actionsButtonsOptions = { ...defaultActionsButtonsOptions, ...actionsButtonsOptions };
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
				headerLeft={<ArchbaseActionButtons actions={userActionsBuilded} options={_actionsButtonsOptions} />}
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
