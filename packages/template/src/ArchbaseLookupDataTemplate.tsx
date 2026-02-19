/**
 * ArchbaseLookupDataTemplate — template de lookup/pesquisa com grid de dados em modal.
 * Suporta seleção única e múltipla com integração ao DataSource v1/v2.
 * @status stable
 */
import {
	Button,
	Flex,
	Group,
	Modal,
	Paper,
	Stack,
	Text,
	useMantineColorScheme
} from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import { IconCheck, IconX, IconBug, IconTrash } from '@tabler/icons-react';
import { getI18nextInstance } from '@archbase/core';
import React, {
	forwardRef,
	ReactNode,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from 'react';
import {
	ArchbaseSpaceBottom,
	ArchbaseSpaceFill,
	ArchbaseSpaceFixed,
	ArchbaseSpaceTop
} from '@archbase/layout';
import { useArchbaseAppContext, processErrorMessage } from '@archbase/core';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@archbase/data';
import { useArchbaseDataSourceListener, useArchbaseV1V2Compatibility } from '@archbase/data';
import { useArchbaseTheme } from '@archbase/core';
import { ArchbaseAlert, ArchbaseDataGrid, CellClickEvent } from '@archbase/components';
import { ArchbaseDialog } from '@archbase/components';
import { ArchbaseConditionalSecurityWrapper, ArchbaseSmartActionButton } from './components';
import { useOptionalTemplateSecurity } from './hooks';
import {
	ArchbaseLookupDataTemplateProps,
	ArchbaseLookupDataTemplateRef,
	LookupLabels
} from './ArchbaseLookupDataTemplate.types';

// Labels padrão
const DEFAULT_LABELS: LookupLabels = {
	okButton: 'Ok',
	cancelButton: 'Cancel',
	clearButton: 'Clear',
	selectedLabel: 'Selected',
	doubleClickHint: 'Double click to select',
	noItemSelected: 'No item selected',
	itemsSelected: 'items selected'
};

/**
 * Implementação interna do ArchbaseLookupDataTemplate
 */
function ArchbaseLookupDataTemplateImpl<T extends object, ID = string>(
	props: ArchbaseLookupDataTemplateProps<T, ID>,
	ref: React.ForwardedRef<ArchbaseLookupDataTemplateRef<T>>
) {
	const {
		// Props obrigatórias
		opened,
		title,
		children,
		onClose,
		idField,
		displayField,

		// Seleção
		selectionMode = 'single',
		onSelect,
		onSelectMultiple,
		initialSelectedItems,
		selectOnDoubleClick = true,
		onBeforeConfirm,
		onAfterConfirm,

		// DataSource
		dataSource: externalDataSource,
		loadData,
		searchFields = '',
		pageSize = 100,

		// Aparência
		displaySubField,
		renderSelectedItem,
		renderSelectedItems,
		icon,
		modalSize = '70%',
		modalHeight = '600px',
		gridHeight = 400,
		rowHeight,
		selectionIndicatorColor = 'blue.0',
		showSelectionIndicator = true,

		// Múltipla seleção
		maxSelections,
		showSelectionCount = true,
		allowClearAll = true,

		// Estado
		isLoading: externalIsLoading,
		isError = false,
		error = '',
		clearError,
		autoCloseAlertError = 15000,
		onError,

		// Customização
		userActions,
		labels: customLabels,
		variant,

		// Segurança
		resourceName,
		resourceDescription,
		requiredPermissions,
		fallbackComponent,
		securityOptions
	} = props;

	// === HOOKS E CONTEXTO ===
	const appContext = useArchbaseAppContext();
	const theme = useArchbaseTheme();
	const { colorScheme } = useMantineColorScheme();
	const isDark = colorScheme === 'dark';
	const forceUpdate = useForceUpdate();

	// Cor do indicador de seleção com suporte a dark theme
	const themeAwareSelectionColor = isDark ? 'dark.5' : selectionIndicatorColor;

	// === ESTADOS ===
	const [internalIsLoading, setInternalIsLoading] = useState(false);
	const [selectedItems, setSelectedItems] = useState<T[]>(initialSelectedItems || []);
	const [isInternalError, setIsInternalError] = useState(false);
	const [internalError, setInternalError] = useState('');

	// === REFS ===
	const internalDataSourceRef = useRef<ArchbaseDataSource<T, ID> | null>(null);

	// === DATASOURCE ===
	const useExternalDataSource = !!externalDataSource;

	// Inicialização lazy do DataSource interno
	const getOrCreateDataSource = useCallback((): ArchbaseDataSource<T, ID> => {
		if (useExternalDataSource && externalDataSource) {
			return externalDataSource;
		}

		if (!internalDataSourceRef.current) {
			internalDataSourceRef.current = new ArchbaseDataSource<T, ID>('dsLookup', {
				records: [],
				grandTotalRecords: 0,
				currentPage: 0,
				totalPages: 0,
				pageSize: pageSize
			});
		}

		return internalDataSourceRef.current;
	}, [useExternalDataSource, externalDataSource, pageSize]);

	const dataSource = getOrCreateDataSource();

	// === SEGURANÇA OPCIONAL ===
	const security = useOptionalTemplateSecurity({
		resourceName,
		resourceDescription: resourceDescription || title,
		autoRegisterActions: securityOptions?.autoRegisterActions ?? true
	});

	// === COMPATIBILIDADE V1/V2 ===
	const v1v2Compatibility = useArchbaseV1V2Compatibility<T>(
		'ArchbaseLookupDataTemplate',
		dataSource,
		undefined,
		undefined
	);

	// === LISTENER DO DATASOURCE ===
	useArchbaseDataSourceListener<T, ID>({
		dataSource,
		listener: (event: DataSourceEvent<T>): void => {
			if (event.type === DataSourceEventNames.onError) {
				setIsInternalError(true);
				setInternalError(event.error || '');
			}
			if (event.type === DataSourceEventNames.afterScroll) {
				// Captura seleção por navegação no grid (single mode)
				if (selectionMode === 'single') {
					const current = dataSource.getCurrentRecord();
					if (current) {
						setSelectedItems([current]);
					}
				}
				// ForceUpdate apenas para V1
				if (!v1v2Compatibility.isDataSourceV2) {
					forceUpdate();
				}
			}
		}
	});

	// === LABELS ===
	const labels: LookupLabels = {
		...DEFAULT_LABELS,
		okButton: getI18nextInstance().t('archbase:Ok'),
		cancelButton: getI18nextInstance().t('archbase:Cancel'),
		clearButton: getI18nextInstance().t('archbase:Clear'),
		selectedLabel: getI18nextInstance().t('archbase:Selected'),
		doubleClickHint: getI18nextInstance().t('archbase:Double click to select'),
		noItemSelected: getI18nextInstance().t('archbase:No item selected'),
		itemsSelected: getI18nextInstance().t('archbase:items selected'),
		...customLabels
	};

	// === CARREGAMENTO DE DADOS ===
	const handleLoadData = useCallback(
		async (search?: string) => {
			if (useExternalDataSource || !loadData) {
				return; // DataSource externo gerencia seus próprios dados
			}

			setInternalIsLoading(true);
			try {
				const records = await loadData(search, searchFields);
				dataSource.open({
					records,
					grandTotalRecords: records.length,
					currentPage: 0,
					totalPages: Math.ceil(records.length / pageSize),
					pageSize: pageSize
				});
			} catch (err) {
				setIsInternalError(true);
				setInternalError(processErrorMessage(err));
				onError?.(err);
			} finally {
				setInternalIsLoading(false);
			}
		},
		[useExternalDataSource, loadData, searchFields, pageSize, dataSource, onError]
	);

	// === HANDLER DE FILTRO DO GRID ===
	const handleFilterModelChange = useCallback(
		(filterModel: any) => {
			// Captura o valor do filtro global (quickFilterValues)
			const quickFilterValue = filterModel?.quickFilterValues?.[0] || '';

			// Se loadData está disponível, fazer busca server-side
			if (loadData && !useExternalDataSource) {
				handleLoadData(quickFilterValue);
			}
		},
		[loadData, useExternalDataSource, handleLoadData]
	);

	// === EFEITOS ===

	// Carregar dados quando modal abre
	useEffect(() => {
		if (opened) {
			// Reset seleção se não houver itens iniciais
			if (!initialSelectedItems?.length) {
				setSelectedItems([]);
			} else {
				setSelectedItems(initialSelectedItems);
			}
			handleLoadData();
		}
	}, [opened]);

	// Sincronizar itens selecionados iniciais
	useEffect(() => {
		if (initialSelectedItems) {
			setSelectedItems(initialSelectedItems);
		}
	}, [initialSelectedItems]);

	// === HANDLERS DE SELEÇÃO ===

	const handleRowSelection = useCallback(
		(rows: T[]) => {
			if (selectionMode === 'single') {
				setSelectedItems(rows.slice(0, 1));
			} else {
				if (maxSelections && rows.length > maxSelections) {
					setSelectedItems(rows.slice(0, maxSelections));
				} else {
					setSelectedItems(rows);
				}
			}
		},
		[selectionMode, maxSelections]
	);

	const handleCellDoubleClick = useCallback(
		(event: CellClickEvent) => {
			if (selectionMode === 'single' && selectOnDoubleClick) {
				const current = dataSource.getCurrentRecord();
				if (current) {
					onSelect?.(current);
					onClose();
				}
			}
		},
		[selectionMode, selectOnDoubleClick, dataSource, onSelect, onClose]
	);

	const handleClearSelection = useCallback(() => {
		setSelectedItems([]);
	}, []);

	// === HANDLERS DE CONFIRMAÇÃO/CANCELAMENTO ===

	const handleConfirm = useCallback(async () => {
		// onBeforeConfirm pode cancelar
		if (onBeforeConfirm) {
			const canContinue = await onBeforeConfirm(selectedItems);
			if (!canContinue) return;
		}

		if (selectionMode === 'single') {
			if (selectedItems.length > 0) {
				onSelect?.(selectedItems[0]);
			}
		} else {
			onSelectMultiple?.(selectedItems);
		}

		onAfterConfirm?.(selectedItems);
		onClose();
	}, [selectedItems, selectionMode, onSelect, onSelectMultiple, onBeforeConfirm, onAfterConfirm, onClose]);

	const handleCancel = useCallback(() => {
		onClose();
	}, [onClose]);

	const handleModalClose = () => {
		ArchbaseDialog.showWarning(getI18nextInstance().t('archbase:Click on Ok or Cancel to close'));
	};

	const handleCloseAlert = () => {
		clearError?.();
		setIsInternalError(false);
		setInternalError('');
	};

	// === FUNÇÕES EXPOSTAS VIA REF ===

	useImperativeHandle(
		ref,
		() => ({
			getSelectedItems: () => selectedItems,
			getSelectedItem: () => selectedItems[0] || null,
			clearSelection: () => setSelectedItems([]),
			selectItems: (items: T[]) => handleRowSelection(items),
			selectItem: (item: T) => setSelectedItems([item]),
			deselectItem: (item: T) => {
				setSelectedItems((prev) => prev.filter((i) => i[idField] !== item[idField]));
			},
			refreshData: () => handleLoadData(),
			getDataSource: () => dataSource,
			confirmSelection: async () => {
				await handleConfirm();
			},
			cancelSelection: handleCancel
		}),
		[selectedItems, handleRowSelection, idField, handleLoadData, dataSource, handleConfirm, handleCancel]
	);

	// === FUNÇÕES AUXILIARES ===

	const getRowId = useCallback(
		(row: T): ID => {
			const id = row[idField];
			return (id !== undefined ? id : '') as ID;
		},
		[idField]
	);

	// === RENDERIZAÇÃO ===

	const isLoading = externalIsLoading || internalIsLoading;
	const currentError = error || internalError;
	const hasError = isError || isInternalError;

	// Título do modal com ícone
	const modalTitle = (
		<Group gap="sm">
			{icon}
			<Text fw={600}>{title}</Text>
		</Group>
	);

	// Indicador de seleção
	const renderSelectionIndicatorContent = () => {
		if (!showSelectionIndicator) return null;

		// Render customizado para single
		if (selectionMode === 'single' && selectedItems.length > 0 && renderSelectedItem) {
			return renderSelectedItem(selectedItems[0]);
		}

		// Render customizado para multiple
		if (selectionMode === 'multiple' && selectedItems.length > 0 && renderSelectedItems) {
			return renderSelectedItems(selectedItems);
		}

		// Render padrão para single
		if (selectionMode === 'single' && selectedItems.length > 0) {
			const item = selectedItems[0];
			return (
				<Paper withBorder p="sm" radius="md" bg={themeAwareSelectionColor}>
					<Group justify="space-between">
						<Group gap="xs">
							<IconCheck size={16} color="green" />
							<Text size="sm" fw={500}>
								{labels.selectedLabel}:
							</Text>
							<Text size="sm" fw={600}>
								{String(item[displayField])}
							</Text>
							{displaySubField && (
								<Text size="sm" c={isDark ? 'gray.4' : 'dimmed'}>
									{String(item[displaySubField] || '')}
								</Text>
							)}
						</Group>
						<Text size="xs" c={isDark ? 'gray.4' : 'dimmed'}>
							{labels.doubleClickHint}
						</Text>
					</Group>
				</Paper>
			);
		}

		// Render padrão para multiple
		if (selectionMode === 'multiple' && selectedItems.length > 0) {
			return (
				<Paper withBorder p="sm" radius="md" bg={themeAwareSelectionColor}>
					<Group justify="space-between">
						<Group gap="xs">
							<IconCheck size={16} color="green" />
							<Text size="sm" fw={500}>
								{selectedItems.length} {labels.itemsSelected}
							</Text>
						</Group>
						{allowClearAll && (
							<Button
								size="xs"
								variant="subtle"
								color="red"
								leftSection={<IconTrash size={14} />}
								onClick={handleClearSelection}
							>
								{labels.clearButton}
							</Button>
						)}
					</Group>
				</Paper>
			);
		}

		return null;
	};

	return (
		<ArchbaseConditionalSecurityWrapper
			resourceName={resourceName}
			resourceDescription={resourceDescription}
			requiredPermissions={requiredPermissions}
			fallbackComponent={fallbackComponent}
			onSecurityReady={securityOptions?.onSecurityReady}
			onAccessDenied={securityOptions?.onAccessDenied}
		>
			<Modal
				title={modalTitle}
				opened={opened}
				onClose={handleModalClose}
				size={modalSize}
				centered
				closeOnEscape={false}
				closeOnClickOutside={false}
				withCloseButton={false}
				overlayProps={{
					color: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[6],
					opacity: 0.25
				}}
			>
				<ArchbaseSpaceFixed height={modalHeight}>
					{hasError && (
						<ArchbaseSpaceTop size="100px">
							<ArchbaseAlert
								autoClose={autoCloseAlertError}
								withCloseButton={true}
								withBorder={true}
								icon={<IconBug size="1.4rem" />}
								title={getI18nextInstance().t('archbase:WARNING')}
								titleColor="rgb(250, 82, 82)"
								variant={variant ?? appContext.variant}
								onClose={handleCloseAlert}
							>
								<span>{currentError}</span>
							</ArchbaseAlert>
						</ArchbaseSpaceTop>
					)}

					<ArchbaseSpaceFill>
						<Stack gap="md" h="100%">
							{/* Toolbar de ações customizadas */}
							{userActions && <Group justify="flex-end">{userActions}</Group>}

							{/* Grid de dados */}
							<ArchbaseDataGrid<T, ID>
								dataSource={dataSource}
								height={gridHeight}
								rowHeight={rowHeight}
								withBorder
								striped
								highlightOnHover
								isLoading={isLoading}
								enableRowSelection={selectionMode === 'multiple'}
								enableRowNumbers
								enableColumnFilterModes
								enableTopToolbar
								enableGlobalFilter
								getRowId={getRowId}
								onCellDoubleClick={handleCellDoubleClick}
								onSelectedRowsChanged={selectionMode === 'multiple' ? handleRowSelection : undefined}
								onFilterModelChange={handleFilterModelChange}
							>
								{children}
							</ArchbaseDataGrid>

							{/* Indicador de seleção */}
							{renderSelectionIndicatorContent()}
						</Stack>
					</ArchbaseSpaceFill>

					<ArchbaseSpaceBottom size="50px">
						<Flex justify="space-between" align="center">
							<Group>{/* Espaço reservado para ações à esquerda */}</Group>
							<Group gap="md">
								<ArchbaseSmartActionButton
									actionName="confirm"
									actionDescription={`Confirmar seleção`}
									leftSection={<IconCheck />}
									onClick={handleConfirm}
									disabled={selectedItems.length === 0}
									variant={variant ?? appContext.variant}
									color="green"
								>
									{labels.okButton}
								</ArchbaseSmartActionButton>
								<ArchbaseSmartActionButton
									actionName="cancel"
									actionDescription="Cancelar seleção"
									leftSection={<IconX />}
									onClick={handleCancel}
									variant={variant ?? appContext.variant}
									color="red"
								>
									{labels.cancelButton}
								</ArchbaseSmartActionButton>
							</Group>
						</Flex>
					</ArchbaseSpaceBottom>
				</ArchbaseSpaceFixed>
			</Modal>
		</ArchbaseConditionalSecurityWrapper>
	);
}

/**
 * ArchbaseLookupDataTemplate - Template de lookup/pesquisa com grid de dados
 *
 * @example
 * // Seleção única com loadData
 * <ArchbaseLookupDataTemplate<VeiculoDto>
 *   opened={opened}
 *   title="Selecionar Veículo"
 *   selectionMode="single"
 *   loadData={loadVeiculos}
 *   idField="id"
 *   displayField="placa"
 *   onSelect={handleSelect}
 *   onClose={() => setOpened(false)}
 * >
 *   <Columns>
 *     <ArchbaseDataGridColumn dataField="placa" header="Placa" size={120} />
 *   </Columns>
 * </ArchbaseLookupDataTemplate>
 *
 * @example
 * // Seleção múltipla com DataSource externo
 * <ArchbaseLookupDataTemplate<ProdutoDto>
 *   opened={opened}
 *   title="Selecionar Produtos"
 *   selectionMode="multiple"
 *   dataSource={dsProducts}
 *   maxSelections={10}
 *   idField="id"
 *   displayField="nome"
 *   onSelectMultiple={handleSelectMultiple}
 *   onClose={() => setOpened(false)}
 * >
 *   <Columns>
 *     <ArchbaseDataGridColumn dataField="nome" header="Nome" size={200} />
 *   </Columns>
 * </ArchbaseLookupDataTemplate>
 */
export const ArchbaseLookupDataTemplate = forwardRef(ArchbaseLookupDataTemplateImpl) as <
	T extends object,
	ID = string
>(
	props: ArchbaseLookupDataTemplateProps<T, ID> & {
		ref?: React.ForwardedRef<ArchbaseLookupDataTemplateRef<T>>;
	}
) => ReturnType<typeof ArchbaseLookupDataTemplateImpl>;
