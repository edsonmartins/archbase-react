/**
 * ArchbaseTwoColumnFormTemplate — template de formulário com layout de duas colunas.
 *
 * Padrão visual moderno com:
 * - Header com botão voltar, título, timestamp e ações
 * - Coluna esquerda para mídia/conteúdo visual (galeria, toggles, itens relacionados)
 * - Coluna direita para formulário com suporte a tabs
 *
 * @status stable
 */
import {
	AlertVariant,
	Box,
	Button,
	ButtonVariant,
	Flex,
	Grid,
	Group,
	LoadingOverlay,
	Paper,
	ScrollArea,
	Stack,
	Tabs,
	Text,
	Title,
	Badge,
	ActionIcon,
} from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import { IconArrowLeft, IconBug, IconDeviceFloppy, IconTrash, IconX } from '@tabler/icons-react';
import { getI18nextInstance } from '@archbase/core';
import React, { CSSProperties, ReactNode, useState, useCallback } from 'react';
import { useArchbaseAppContext, processErrorMessage } from '@archbase/core';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames, useArchbaseDataSourceListener, useArchbaseV1V2Compatibility } from '@archbase/data';
import { ArchbaseAlert } from '@archbase/components';
import { ArchbaseTemplateSecurityProps } from './ArchbaseTemplateCommonTypes';
import { useOptionalTemplateSecurity } from './hooks';
import { ArchbaseConditionalSecurityWrapper, ArchbaseSmartActionButton } from './components';
import { ValidationErrorsProvider, useValidationErrors } from '@archbase/core';

// ============================================================================
// TYPES
// ============================================================================

export interface TwoColumnFormTab {
	/** Identificador único da tab */
	value: string;
	/** Label exibido na tab */
	label: string;
	/** Ícone opcional para a tab */
	icon?: ReactNode;
	/** Conteúdo da tab */
	content: ReactNode;
}

export interface TwoColumnFormHeaderAction {
	/** Identificador único da ação */
	id: string;
	/** Label do botão */
	label: string;
	/** Ícone do botão */
	icon?: ReactNode;
	/** Cor do botão */
	color?: string;
	/** Variante do botão */
	variant?: ButtonVariant;
	/** Handler de clique */
	onClick: () => void;
	/** Desabilitar botão */
	disabled?: boolean;
	/** Loading state */
	loading?: boolean;
}

export type ButtonsPosition = 'header' | 'footer' | 'both';

export interface ArchbaseTwoColumnFormTemplateProps<T, ID> extends ArchbaseTemplateSecurityProps {
	/** Título do formulário */
	title: string;
	/** Subtítulo (ex: "Last Update 28 April 2024 at 8:43 PM") */
	subtitle?: string;
	/** DataSource para o formulário */
	dataSource: ArchbaseDataSource<T, ID>;
	/** Variante de estilo */
	variant?: ButtonVariant | AlertVariant | string;

	// Header
	/** Callback ao clicar no botão voltar */
	onBack?: () => void;
	/** Ações customizadas no header (além de Save/Cancel) */
	headerActions?: TwoColumnFormHeaderAction[];
	/** Mostrar botão de deletar no header */
	showDeleteButton?: boolean;
	/** Callback ao clicar em deletar */
	onDelete?: () => void;
	/** Label do botão salvar */
	saveLabel?: string;
	/** Label do botão cancelar */
	cancelLabel?: string;
	/**
	 * Posição dos botões Save/Cancel.
	 * - 'header': No header (padrão moderno SaaS - recomendado)
	 * - 'footer': No rodapé (padrão tradicional)
	 * - 'both': Em ambos (para forms muito longos)
	 * @default 'header'
	 */
	buttonsPosition?: ButtonsPosition;

	// Left Column
	/** Conteúdo da coluna esquerda (mídia, galeria, etc) */
	leftColumnContent?: ReactNode;
	/** Largura da coluna esquerda (span do Grid, 1-12). Default: 6 */
	leftColumnSpan?: number;
	/** Esconder coluna esquerda */
	hideLeftColumn?: boolean;

	// Right Column - Form
	/** Título da seção do formulário */
	formTitle?: string;
	/** Subtítulo da seção do formulário */
	formSubtitle?: string;
	/** Badge de status (ex: "Status: Draft") */
	statusBadge?: ReactNode;
	/** Tabs do formulário (se não usar tabs, use children) */
	tabs?: TwoColumnFormTab[];
	/** Tab ativa inicial */
	defaultTab?: string;
	/** Variante das tabs */
	tabsVariant?: 'default' | 'outline' | 'pills';
	/** Conteúdo do formulário (quando não usa tabs) */
	children?: ReactNode;

	// Layout
	/** Largura total */
	width?: number | string;
	/** Altura total */
	height?: number | string;
	/** Borda */
	withBorder?: boolean;
	/** Raio das bordas */
	radius?: string | number;
	/** Estilo customizado */
	style?: CSSProperties;

	// States
	/** Referência interna */
	innerRef?: React.RefObject<HTMLInputElement>;
	/** Loading state */
	isLoading?: boolean;
	/** Cancelando */
	isCanceling?: boolean;
	/** Salvando */
	isSaving?: boolean;
	/** Estado de erro */
	isError?: boolean;
	/** Mensagem de erro */
	error?: string;
	/** Limpar erro */
	clearError?: () => void;
	/** Auto close do alerta de erro (ms) */
	autoCloseAlertError?: number;

	// Callbacks
	/** Callback customizado de salvar (sobrescreve comportamento padrão) */
	onSave?: (entityToSave: T) => void;
	/** Callback customizado de cancelar (sobrescreve comportamento padrão). Recebe closeForm para fechar o form/aba quando pronto. */
	onCancel?: (closeForm: () => void) => void;
	/** Callback antes de salvar */
	onBeforeSave?: (entityToSave: T) => void;
	/** Callback após salvar */
	onAfterSave?: (savedEntity: T) => void;
	/** Callback antes de cancelar */
	onBeforeCancel?: () => void;
	/** Callback após cancelar */
	onAfterCancel?: () => void;
	/** Callback de erro */
	onError?: (error: string) => void;

	// Navigation/Tab
	/**
	 * Caminho da rota para o navigation listener (usado para fechar abas).
	 * Quando fornecido, integra com useArchbaseNavigationListener.
	 */
	routePath?: string;
	/**
	 * Callback chamado antes de fechar a aba.
	 * Retorne true para permitir o fechamento, false para cancelar.
	 */
	onBeforeClose?: () => boolean | void;
	/**
	 * Hook de navigation listener (ex: useArchbaseNavigationListener de @archbase/admin).
	 * Quando fornecido, integra com o sistema de navegação por abas.
	 * Assinatura: (id: string, onUserCloseRequest: () => void) => { closeAllowed: (payload?: any) => void }
	 */
	useNavigationListener?: (id: string, onUserCloseRequest: () => void) => { closeAllowed: (payload?: any) => void };
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ArchbaseTwoColumnFormTemplate<T extends object, ID>({
	// Header
	title,
	subtitle,
	onBack,
	headerActions,
	showDeleteButton = false,
	onDelete,
	saveLabel,
	cancelLabel,
	buttonsPosition = 'header',

	// Left Column
	leftColumnContent,
	leftColumnSpan = 6,
	hideLeftColumn = false,

	// Right Column - Form
	formTitle,
	formSubtitle,
	statusBadge,
	tabs,
	defaultTab,
	tabsVariant = 'default',
	children,

	// Layout
	width = '100%',
	height = '100%',
	withBorder = true,
	radius,
	style,

	// States
	innerRef,
	isLoading = false,
	isCanceling = false,
	isSaving = false,
	isError = false,
	error = '',
	clearError = () => {},
	autoCloseAlertError = 15000,

	// DataSource
	dataSource,
	variant,

	// Callbacks
	onSave,
	onCancel,
	onBeforeSave,
	onAfterSave,
	onBeforeCancel,
	onAfterCancel,
	onError,

	// Navigation
	routePath,
	onBeforeClose,
	useNavigationListener,

	// Security
	resourceName,
	resourceDescription,
	requiredPermissions,
	fallbackComponent,
	securityOptions,
	...rest
}: ArchbaseTwoColumnFormTemplateProps<T, ID>) {
	const appContext = useArchbaseAppContext();
	const [isInternalError, setIsInternalError] = useState<boolean>(isError);
	const [internalError, setInternalError] = useState<string>(error);
	const [activeTab, setActiveTab] = useState<string | null>(defaultTab || (tabs?.[0]?.value ?? null));
	const forceUpdate = useForceUpdate();

	// Security hook
	const security = useOptionalTemplateSecurity({
		resourceName,
		resourceDescription,
		autoRegisterActions: securityOptions?.autoRegisterActions ?? true
	});

	// V1/V2 compatibility
	const v1v2Compatibility = useArchbaseV1V2Compatibility<T>(
		'ArchbaseTwoColumnFormTemplate',
		dataSource,
		undefined,
		undefined
	);

	// DataSource listener
	useArchbaseDataSourceListener<T, ID>({
		dataSource,
		listener: (event: DataSourceEvent<T>): void => {
			if (event.type === DataSourceEventNames.onError) {
				setIsInternalError(true);
				setInternalError(event.error);
			}
			if (event.type === DataSourceEventNames.afterEdit || event.type === DataSourceEventNames.afterInsert) {
				if (!v1v2Compatibility.isDataSourceV2) {
					forceUpdate();
				}
			}
		},
	});

	const validationContext = useValidationErrors();

	// Navigation listener (para fechar abas)
	const defaultNavListener = useCallback((_id: string, _onClose: () => void) => ({
		closeAllowed: (_payload?: any) => { /* noop quando não há navigation listener */ },
	}), []);
	const navHook = useNavigationListener || defaultNavListener;
	const { closeAllowed } = navHook(routePath || '', () => {
		if (onBeforeClose) {
			const canClose = onBeforeClose();
			if (canClose === false) return;
		}
		closeAllowed();
	});

	// Handlers
	const handleSave = async (entity: T) => {
		try {
			if (onSave) {
				onSave(entity);
			} else {
				onBeforeSave && await onBeforeSave(entity);
				if (!dataSource.isBrowsing()) {
					dataSource
						.save()
						.then(() => {
							validationContext?.clearAll();
							onAfterSave && onAfterSave(entity);
							// Fecha o form/aba após salvar com sucesso
							closeAllowed();
						})
						.catch((e) => {
							onError && onError(processErrorMessage(e));
							setIsInternalError(true);
							setInternalError(processErrorMessage(e));
						});
				}
			}
		} catch (e) {
			onError && onError(processErrorMessage(e));
			setIsInternalError(true);
			setInternalError(processErrorMessage(e));
		}
	};

	const handleCancel = () => {
		try {
			if (onCancel) {
				// Quando há onCancel customizado, ele controla o fechamento via closeForm
				onCancel(closeAllowed);
			} else {
				onBeforeCancel && onBeforeCancel();
				if (!dataSource.isBrowsing()) {
					dataSource.cancel();
				}
				validationContext?.clearAll();
				onAfterCancel && onAfterCancel();
				// Fecha automaticamente apenas quando não há onCancel customizado
				closeAllowed();
			}
		} catch (e) {
			onError && onError(processErrorMessage(e));
			setIsInternalError(true);
			setInternalError(processErrorMessage(e));
		}
	};

	const handleCloseAlert = () => {
		clearError && clearError();
		setIsInternalError(false);
		setInternalError('');
	};

	// Calcular spans das colunas
	const rightColumnSpan = hideLeftColumn ? 12 : (12 - leftColumnSpan);
	const isEditing = dataSource && !dataSource.isBrowsing();
	const showButtonsInHeader = buttonsPosition === 'header' || buttonsPosition === 'both';
	const showButtonsInFooter = buttonsPosition === 'footer' || buttonsPosition === 'both';

	// Botões de ação (reutilizável em header e footer)
	const renderActionButtons = () => (
		<Group gap="sm">
			{isEditing ? (
				<>
					<ArchbaseSmartActionButton
						actionName="cancel"
						actionDescription="Cancelar operação"
						leftSection={<IconX size={16} />}
						onClick={handleCancel}
						variant="default"
						loading={isCanceling}
					>
						{cancelLabel || getI18nextInstance().t('Cancel')}
					</ArchbaseSmartActionButton>
					<ArchbaseSmartActionButton
						actionName="save"
						actionDescription={`Salvar ${resourceDescription || 'registro'}`}
						leftSection={<IconDeviceFloppy size={16} />}
						onClick={() => handleSave(dataSource.getCurrentRecord()!)}
						variant={variant ?? appContext.variant}
						color="blue"
						loading={isSaving}
					>
						{saveLabel || getI18nextInstance().t('Ok')}
					</ArchbaseSmartActionButton>
				</>
			) : (
				<ArchbaseSmartActionButton
					actionName="close"
					actionDescription="Fechar formulário"
					leftSection={<IconX size={16} />}
					onClick={handleCancel}
					variant="default"
				>
					{getI18nextInstance().t('Close')}
				</ArchbaseSmartActionButton>
			)}
		</Group>
	);

	return (
		<ArchbaseConditionalSecurityWrapper
			resourceName={resourceName}
			resourceDescription={resourceDescription}
			requiredPermissions={requiredPermissions}
			fallbackComponent={fallbackComponent}
			onSecurityReady={securityOptions?.onSecurityReady}
			onAccessDenied={securityOptions?.onAccessDenied}
		>
			<ValidationErrorsProvider>
				<Paper
					ref={innerRef}
					withBorder={withBorder}
					radius={radius}
					style={{
						width,
						height,
						display: 'flex',
						flexDirection: 'column',
						...style,
					}}
				>
					{/* ========== HEADER ========== */}
					<Box
						style={{
							flexShrink: 0,
							padding: '16px 24px',
							borderBottom: '1px solid var(--mantine-color-gray-2)',
						}}
					>
						<Flex justify="space-between" align="center">
							{/* Left: Back + Title */}
							<Group gap="md">
								{onBack && (
									<ActionIcon
										variant="subtle"
										color="gray"
										size="lg"
										onClick={onBack}
										style={{ border: '1px solid var(--mantine-color-gray-3)' }}
									>
										<IconArrowLeft size={18} />
									</ActionIcon>
								)}
								<Box>
									<Title order={4} fw={600}>{title}</Title>
									{subtitle && (
										<Text size="sm" c="dimmed">{subtitle}</Text>
									)}
								</Box>
							</Group>

							{/* Right: Actions */}
							<Group gap="sm">
								{/* Custom header actions */}
								{headerActions?.map((action) => (
									<Button
										key={action.id}
										variant={action.variant || 'subtle'}
										color={action.color}
										leftSection={action.icon}
										onClick={action.onClick}
										disabled={action.disabled}
										loading={action.loading}
									>
										{action.label}
									</Button>
								))}

								{/* Delete button */}
								{showDeleteButton && onDelete && (
									<ActionIcon
										variant="subtle"
										color="red"
										size="lg"
										onClick={onDelete}
										style={{ border: '1px solid var(--mantine-color-gray-3)' }}
									>
										<IconTrash size={18} />
									</ActionIcon>
								)}

								{/* Save/Cancel buttons in header */}
								{showButtonsInHeader && renderActionButtons()}
							</Group>
						</Flex>
					</Box>

					{/* ========== ERROR ALERT ========== */}
					{isInternalError && (
						<Box style={{ flexShrink: 0, padding: '0 24px' }}>
							<ArchbaseAlert
								autoClose={autoCloseAlertError}
								withCloseButton={true}
								withBorder={true}
								icon={<IconBug size="1.4rem" />}
								title={getI18nextInstance().t('WARNING')}
								titleColor="rgb(250, 82, 82)"
								variant={variant ?? appContext.variant}
								onClose={handleCloseAlert}
							>
								<span>{internalError}</span>
							</ArchbaseAlert>
						</Box>
					)}

					{/* ========== BODY: Two Columns ========== */}
					<Box style={{ flex: 1, minHeight: 0, padding: '24px' }}>
						<LoadingOverlay visible={isLoading || isCanceling || isSaving} opacity={0.3} />

						<Grid gutter="xl" style={{ height: '100%' }}>
							{/* LEFT COLUMN: Media/Visual Content */}
							{!hideLeftColumn && (
								<Grid.Col span={{ base: 12, md: leftColumnSpan }}>
									<ScrollArea style={{ height: '100%' }}>
										<Stack gap="md">
											{leftColumnContent}
										</Stack>
									</ScrollArea>
								</Grid.Col>
							)}

							{/* RIGHT COLUMN: Form */}
							<Grid.Col span={{ base: 12, md: rightColumnSpan }}>
								<Paper
									withBorder
									radius="md"
									style={{
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										backgroundColor: 'var(--mantine-color-white)',
									}}
								>
									{/* Form Header */}
									{(formTitle || statusBadge) && (
										<Box
											style={{
												flexShrink: 0,
												padding: '16px 20px',
												borderBottom: tabs ? '1px solid var(--mantine-color-gray-2)' : 'none',
											}}
										>
											<Flex justify="space-between" align="flex-start">
												<Box>
													{formTitle && (
														<Text fw={600} size="lg">{formTitle}</Text>
													)}
													{formSubtitle && (
														<Text size="sm" c="dimmed" mt={4}>{formSubtitle}</Text>
													)}
												</Box>
												{statusBadge}
											</Flex>
										</Box>
									)}

									{/* Form Content with Tabs or Direct Children */}
									<Box style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
										{tabs && tabs.length > 0 ? (
											<Tabs
												value={activeTab}
												onChange={setActiveTab}
												variant={tabsVariant}
												style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
											>
												<Tabs.List style={{ flexShrink: 0, padding: '0 20px' }}>
													{tabs.map((tab) => (
														<Tabs.Tab
															key={tab.value}
															value={tab.value}
															leftSection={tab.icon}
														>
															{tab.label}
														</Tabs.Tab>
													))}
												</Tabs.List>

												{tabs.map((tab) => (
													<Tabs.Panel
														key={tab.value}
														value={tab.value}
														style={{ flex: 1, minHeight: 0 }}
													>
														<ScrollArea style={{ height: '100%', padding: '20px' }}>
															{tab.content}
														</ScrollArea>
													</Tabs.Panel>
												))}
											</Tabs>
										) : (
											<ScrollArea style={{ flex: 1, padding: '20px' }}>
												{children}
											</ScrollArea>
										)}
									</Box>
								</Paper>
							</Grid.Col>
						</Grid>
					</Box>

					{/* ========== FOOTER (optional) ========== */}
					{showButtonsInFooter && (
						<Box
							style={{
								flexShrink: 0,
								padding: '16px 24px',
								borderTop: '1px solid var(--mantine-color-gray-2)',
								display: 'flex',
								justifyContent: 'flex-end',
							}}
						>
							{renderActionButtons()}
						</Box>
					)}
				</Paper>
			</ValidationErrorsProvider>
		</ArchbaseConditionalSecurityWrapper>
	);
}

// ============================================================================
// AUXILIARY COMPONENTS - Para uso na coluna esquerda
// ============================================================================

interface FormSectionCardProps {
	/** Título do card */
	title: string;
	/** Descrição/subtítulo */
	description?: string;
	/** Ícone de ação no header (ex: botão +) */
	headerAction?: ReactNode;
	/** Conteúdo do card */
	children: ReactNode;
}

/**
 * Card para seções auxiliares na coluna esquerda (Visibility, Related Items, etc)
 */
export function FormSectionCard({ title, description, headerAction, children }: FormSectionCardProps) {
	return (
		<Paper withBorder radius="md" p="md">
			<Flex justify="space-between" align="flex-start" mb={description || headerAction ? 'sm' : 0}>
				<Box>
					<Text fw={600} size="sm">{title}</Text>
					{description && (
						<Text size="xs" c="dimmed" mt={2}>{description}</Text>
					)}
				</Box>
				{headerAction}
			</Flex>
			{children}
		</Paper>
	);
}

interface ImageGalleryItem {
	id: string;
	url: string;
	alt?: string;
	isCover?: boolean;
}

interface FormImageGalleryProps {
	/** Lista de imagens */
	images: ImageGalleryItem[];
	/** Callback ao clicar para adicionar imagem */
	onAddImage?: () => void;
	/** Callback ao remover imagem */
	onRemoveImage?: (id: string) => void;
	/** Callback ao definir como cover */
	onSetCover?: (id: string) => void;
	/** Máximo de imagens */
	maxImages?: number;
}

/**
 * Galeria de imagens para coluna esquerda (padrão do design)
 */
export function FormImageGallery({ images, onAddImage, onRemoveImage, onSetCover, maxImages = 6 }: FormImageGalleryProps) {
	const coverImage = images.find((img) => img.isCover) || images[0];
	const thumbnails = images.filter((img) => img.id !== coverImage?.id);
	const canAddMore = images.length < maxImages;

	return (
		<Stack gap="sm">
			{coverImage && (
				<Box style={{ position: 'relative' }}>
					<img
						src={coverImage.url}
						alt={coverImage.alt || 'Cover'}
						style={{
							width: '100%',
							height: 200,
							objectFit: 'cover',
							borderRadius: 'var(--mantine-radius-md)',
							border: '1px solid var(--mantine-color-gray-3)',
						}}
					/>
					<Badge
						style={{ position: 'absolute', bottom: 8, left: 8 }}
						variant="filled"
						color="dark"
					>
						Cover
					</Badge>
				</Box>
			)}

			<Grid gutter="sm">
				{thumbnails.map((img) => (
					<Grid.Col span={4} key={img.id}>
						<Box
							style={{ position: 'relative', cursor: onSetCover ? 'pointer' : 'default' }}
							onClick={() => onSetCover?.(img.id)}
						>
							<img
								src={img.url}
								alt={img.alt || 'Thumbnail'}
								style={{
									width: '100%',
									height: 80,
									objectFit: 'cover',
									borderRadius: 'var(--mantine-radius-sm)',
									border: '1px solid var(--mantine-color-gray-3)',
								}}
							/>
						</Box>
					</Grid.Col>
				))}

				{canAddMore && onAddImage && (
					<Grid.Col span={4}>
						<Box
							onClick={onAddImage}
							style={{
								width: '100%',
								height: 80,
								border: '2px dashed var(--mantine-color-gray-4)',
								borderRadius: 'var(--mantine-radius-sm)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								backgroundColor: 'var(--mantine-color-gray-0)',
							}}
						>
							<Text size="xl" c="dimmed">+</Text>
						</Box>
					</Grid.Col>
				)}
			</Grid>
		</Stack>
	);
}
