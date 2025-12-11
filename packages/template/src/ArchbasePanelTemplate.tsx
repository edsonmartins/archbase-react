/**
 * ArchbasePanelTemplate — template de painel com toolbar de ações e binding ao DataSource.
 * @status stable
 */
import {
	ArchbaseAction,
	ArchbaseActionButtons,
	ArchbaseActionButtonsOptions,
} from '@archbase/components';
import { ButtonVariant, Pagination } from '@mantine/core';
import { IconEdit, IconEye, IconPlus, IconTrash } from '@tabler/icons-react';
import { getI18nextInstance, useArchbaseTranslation } from '@archbase/core';
import React, { CSSProperties, ReactNode, useMemo, useRef, useState } from 'react';
import { useArchbaseAppContext } from '@archbase/core';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import type { ArchbaseDataSource } from '@archbase/data';
import {
	ArchbaseQueryBuilder,
	ArchbaseQueryFilter,
	ArchbaseQueryFilterDelegator,
	ArchbaseQueryFilterState,
	FilterOptions,
} from '@archbase/advanced';
import { ArchbaseSpaceTemplate, ArchbaseSpaceTemplateOptions } from './ArchbaseSpaceTemplate';
import { ArchbaseDebugOptions, ArchbaseTemplateSecurityProps } from './ArchbaseTemplateCommonTypes';
import { ArchbaseConditionalSecurityWrapper } from './components';
import { useOptionalTemplateSecurity } from './hooks';

export interface PanelUserActionsOptions {
	visible?: boolean;
	labelAdd?: string;
	labelEdit?: string;
	labelRemove?: string;
	labelView?: string;
	allowAdd?: boolean;
	allowEdit?: boolean;
	allowView?: boolean;
	allowRemove?: boolean;
	onAddExecute?: () => void;
	onEditExecute?: () => void;
	onRemoveExecute?: () => void;
	onView?: () => void;
	customUserActions?: ArchbaseAction[];
	positionCustomUserActions?: 'before' | 'after';
}

const defaultUserActions: PanelUserActionsOptions = {
	visible: true,
	allowAdd: true,
	allowEdit: true,
	allowView: true,
	allowRemove: true,
	positionCustomUserActions: 'after',
};

export interface PanelUserRowActionsOptions<T> {
	actions?: any;
	onAddRow?: (row: T) => void;
	onEditRow?: (row: T) => void;
	onRemoveRow?: (row: T) => void;
	onViewRow?: (row: T) => void;
	variant?: string;
}

export interface ArchbasePanelTemplateProps<T, ID> extends ArchbaseTemplateSecurityProps {
	title: string;
	dataSource: ArchbaseDataSource<T, ID>;
	dataSourceEdition?: ArchbaseDataSource<T, ID> | undefined;
	variant?: string;
	filterOptions: FilterOptions;
	pageSize?: number;
	filterFields: ReactNode | undefined;
	filterPersistenceDelegator: ArchbaseQueryFilterDelegator;
	userActions?: PanelUserActionsOptions;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
	isLoading?: boolean;
	isError?: boolean;
	error?: string | undefined;
	clearError?: () => void;
	width?: number | string | undefined;
	height?: number | string | undefined;
	withBorder?: boolean;
	withPagination?: boolean;
	children?: React.ReactNode;
	radius?: number | string | undefined;
	debug?: boolean;
	actionsButtonsOptions?: ArchbaseActionButtonsOptions;
	spaceOptions?: ArchbaseSpaceTemplateOptions;
	style?: CSSProperties;
	debugOptions?: ArchbaseDebugOptions;
}

export function ArchbasePanelTemplate<T extends object, ID>({
	title,
	dataSource,
	//  dataSourceEdition,
	filterOptions,
	//pageSize,
	filterFields,
	innerRef,
	//isLoading = false,
	isError = false,
	error = '',
	clearError = () => {},
	width = '100%',
	height = '100%',
	withBorder = true,
	filterPersistenceDelegator,
	withPagination = true,
	children,
	radius,
	userActions,
	debug = false,
	variant,
	actionsButtonsOptions,
	spaceOptions,
	style,
	debugOptions,
	// Props de segurança (opcionais)
	resourceName,
	resourceDescription,
	requiredPermissions,
	fallbackComponent,
	securityOptions,
}: ArchbasePanelTemplateProps<T, ID>) {
	const appContext = useArchbaseAppContext();

	// 🔐 SEGURANÇA: Hook opcional de segurança (só ativa se resourceName fornecido)
	const security = useOptionalTemplateSecurity({
		resourceName,
		resourceDescription,
		autoRegisterActions: securityOptions?.autoRegisterActions ?? true
	});

	const innerComponentRef = innerRef || useRef<any>(null);
	const filterRef = useRef<any>(null);
	const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
		activeFilterIndex: -1,
		expandedFilter: false,
	});
	

	// V1/V2 Compatibility Pattern
	const {
		isDataSourceV2,
		v1State: { forceUpdate }
	} = useArchbaseV1V2Compatibility<T>(
		'ArchbasePanelTemplate',
		dataSource
	);

	const userActionsBuilded: ArchbaseAction[] = useMemo(() => {
		const userActionsEnd = { ...defaultUserActions, ...userActions };

		// 🔐 SEGURANÇA: Função helper para verificar se tem permissão
		const hasActionPermission = (actionName: string): boolean => {
			if (!security.isAvailable) return true; // Sem contexto de segurança = permite tudo
			// Por enquanto registra e permite - lógica completa será implementada posteriormente
			security.registerAction();
			return security.hasPermission();
		};

		const defaultActions: ArchbaseAction[] = [];

		// Add action with security check
		if (userActionsEnd.allowAdd && userActionsEnd.onAddExecute && hasActionPermission('add')) {
			defaultActions.push({
				id: '1',
				icon: <IconPlus />,
				color: 'green',
				label: userActionsEnd.labelAdd ? userActionsEnd.labelAdd : getI18nextInstance().t('archbase:New'),
				executeAction: () => {
					if (userActionsEnd && userActionsEnd.onAddExecute) {
						userActionsEnd.onAddExecute();
					}
				},
				enabled: true,
				hint: 'Clique para criar.',
			});
		}

		// Edit action with security check
		if (userActionsEnd.allowEdit && userActionsEnd.onEditExecute && hasActionPermission('edit')) {
			defaultActions.push({
				id: '2',
				icon: <IconEdit />,
				color: 'blue',
				label: userActionsEnd.labelEdit ? userActionsEnd.labelEdit : getI18nextInstance().t('archbase:Edit'),
				executeAction: () => {
					if (userActionsEnd && userActionsEnd.onEditExecute) {
						userActionsEnd.onEditExecute();
					}
				},
				enabled: !dataSource.isEmpty() && dataSource.isBrowsing(),
				hint: 'Clique para editar.',
			});
		}

		// Remove action with security check
		if (userActionsEnd.allowRemove && userActionsEnd.onRemoveExecute && hasActionPermission('delete')) {
			defaultActions.push({
				id: '3',
				icon: <IconTrash />,
				color: 'red',
				label: userActionsEnd.labelRemove ? userActionsEnd.labelRemove : getI18nextInstance().t('archbase:Remove'),
				executeAction: () => {
					if (userActionsEnd && userActionsEnd.onRemoveExecute) {
						userActionsEnd.onRemoveExecute();
					}
				},
				enabled: !dataSource.isEmpty() && dataSource.isBrowsing(),
				hint: 'Clique para remover.',
			});
		}

		// View action with security check
		if (userActionsEnd.allowView && userActionsEnd.onView && hasActionPermission('view')) {
			defaultActions.push({
				id: '4',
				icon: <IconEye />,
				color: 'green',
				label: userActionsEnd.labelView ? userActionsEnd.labelView : getI18nextInstance().t('archbase:View'),
				executeAction: () => {
					if (userActionsEnd && userActionsEnd.onView) {
						userActionsEnd.onView();
					}
				},
				enabled: !dataSource.isEmpty() && dataSource.isBrowsing(),
				hint: 'Clique para visualizar.',
			});
		}

		if (userActionsEnd.customUserActions && userActionsEnd.positionCustomUserActions === 'before') {
			return [...userActionsEnd.customUserActions, ...defaultActions];
		}

		if (userActionsEnd.customUserActions && userActionsEnd.positionCustomUserActions === 'after') {
			return [...defaultActions, ...userActionsEnd.customUserActions];
		}

		return defaultActions;
	}, [userActions, dataSource, security]);

	const handleFilterChanged = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
		setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
	};

	const handleToggleExpandedFilter = (expanded: boolean) => {
		setFilterState({ ...filterState, expandedFilter: expanded });
	};

	const handleSelectedFilter = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
		setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
	};

	const handleSearchByFilter = () => {};
	const defaultActionsButtonsOptions: ArchbaseActionButtonsOptions = {
		menuButtonColor: 'blue.5',
		menuPosition: 'left',
	};

	const defaultSpaceTemplateOptions: ArchbaseSpaceTemplateOptions = {
		headerFlexGrow: 'left',
		footerFlexGrow: 'right',
		// footerGridColumns: {},
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
				headerRight={
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
				}
				footerRight={withPagination && <Pagination total={10} />}
			>
				{children}
			</ArchbaseSpaceTemplate>
		</ArchbaseConditionalSecurityWrapper>
	);
}
