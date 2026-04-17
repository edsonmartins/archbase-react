/**
 * ArchbaseFormTemplate — template de formulário CRUD com integração a DataSource v1/v2.
 * @status stable
 */
import {
	AlertVariant,
	ButtonVariant,
	Group,
	LoadingOverlay,
	Paper,
	ScrollArea,
	Box,
	Flex,
	Title,
	Text,
	ActionIcon,
} from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import { IconArrowLeft, IconBug, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { getI18nextInstance } from '@archbase/core';
import React, { Fragment, useCallback, useState } from 'react';
import { useArchbaseAppContext } from '@archbase/core';
import { processErrorMessage } from '@archbase/core';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@archbase/data';
import { useArchbaseDataSourceListener } from '@archbase/data';
import { ArchbaseAlert } from '@archbase/components';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import { ArchbaseTemplateSecurityProps } from './ArchbaseTemplateCommonTypes';
import { useOptionalTemplateSecurity } from './hooks';
import { ArchbaseConditionalSecurityWrapper, ArchbaseSmartActionButton } from './components';
import { ValidationErrorsProvider, useValidationErrors } from '@archbase/core';

export type FormButtonsPosition = 'header' | 'footer' | 'both';

export interface ArchbaseFormTemplateProps<T, ID> extends ArchbaseTemplateSecurityProps {
	title: string;
	/** Subtítulo exibido abaixo do título no header */
	subtitle?: string;
	dataSource: ArchbaseDataSource<T, ID>;
	variant?: ButtonVariant | AlertVariant | string;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
	isLoading?: boolean;
	isCanceling?: boolean;
	isSaving?: boolean;
	isError?: boolean;
	error?: string | undefined;
	clearError?: () => void;
	autoCloseAlertError?: number;
	width?: number | string | undefined;
	height?: number | string | undefined;
	withBorder?: boolean;
	children?: React.ReactNode | React.ReactNode[];
	radius?: string | number | undefined;
	/**
	 * Posição dos botões Save/Cancel.
	 * - 'header': No header à direita (padrão moderno)
	 * - 'footer': No rodapé (padrão legado)
	 * - 'both': Em ambos
	 * @default 'footer'
	 */
	buttonsPosition?: FormButtonsPosition;
	/** Label do botão salvar */
	saveLabel?: string;
	/** Label do botão cancelar */
	cancelLabel?: string;
	/** Callback ao clicar no botão voltar (exibido no header) */
	onBack?: () => void;
	/** Alinhamento dos botões no footer: 'left' | 'center' | 'right' */
	footerAlign?: 'left' | 'center' | 'right';
	/** Conteúdo adicional a ser exibido no footer */
	footerContent?: React.ReactNode;
	onSave?: (entityToSave) => void;
	/** Callback de cancelar. Quando buttonsPosition inclui 'header', recebe closeForm. */
	onCancel?: ((closeForm: () => void) => void) | (() => void);
	onBeforeSave?: (entityToSave: T) => void;
	onAfterSave?: (savedEntity: T) => void;
	onBeforeCancel?: () => void;
	onAfterCancel?: () => void;
	onError?: (error: string) => void;
	/**
	 * Caminho da rota para o navigation listener (usado para fechar abas).
	 */
	routePath?: string;
	/**
	 * Callback chamado antes de fechar a aba.
	 * Retorne true para permitir o fechamento, false para cancelar.
	 */
	onBeforeClose?: () => boolean | void;
	/**
	 * Hook de navigation listener (ex: useArchbaseNavigationListener de @archbase/admin).
	 * Assinatura: (id: string, onUserCloseRequest: () => void) => { closeAllowed: (payload?: any) => void }
	 */
	useNavigationListener?: (id: string, onUserCloseRequest: () => void) => { closeAllowed: (payload?: any) => void };
}

export function ArchbaseFormTemplate<T extends object, ID>({
	innerRef,
	title,
	subtitle,
	isError = false,
	isCanceling = false,
	isSaving = false,
	isLoading = false,
	error = '',
	clearError = () => {},
	autoCloseAlertError = 15000,
	width = '100%',
	height = '100%',
	withBorder = true,
	children,
	radius,
	variant,
	buttonsPosition = 'footer',
	saveLabel,
	cancelLabel,
	onBack,
	footerAlign = 'left',
	footerContent,
	dataSource,
	onSave,
	onCancel,
	onBeforeSave,
	onAfterSave,
	onBeforeCancel,
	onAfterCancel,
	onError,
	routePath,
	onBeforeClose,
	useNavigationListener,
	// Props de segurança (opcionais)
	resourceName,
	resourceDescription,
	requiredPermissions,
	fallbackComponent,
	securityOptions,
	...rest
}: ArchbaseFormTemplateProps<T, ID>) {
	const appContext = useArchbaseAppContext();
	const [isInternalError, setIsInternalError] = useState<boolean>(isError);
	const [internalError, setInternalError] = useState<string>(error);
	const forceUpdate = useForceUpdate();

	// Segurança: Hook opcional (só ativa se resourceName fornecido)
	const security = useOptionalTemplateSecurity({
		resourceName,
		resourceDescription,
		autoRegisterActions: securityOptions?.autoRegisterActions ?? true
	});

	// Migração V1/V2: Hook de compatibilidade
	const v1v2Compatibility = useArchbaseV1V2Compatibility<T>(
		'ArchbaseFormTemplate',
		dataSource,
		undefined,
		undefined
	);

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

	const handleSave = async (entity) => {
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
							// Fecha o form/aba após salvar com sucesso (se tiver navigation listener)
							if (useNavigationListener) {
								closeAllowed();
							}
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
				// Detecta se onCancel aceita closeForm (nova assinatura) ou não (legado)
				if (onCancel.length > 0) {
					(onCancel as (closeForm: () => void) => void)(closeAllowed);
				} else {
					(onCancel as () => void)();
				}
			} else {
				onBeforeCancel && onBeforeCancel();
				if (!dataSource.isBrowsing()) {
					dataSource.cancel();
				}
				validationContext?.clearAll();
				onAfterCancel && onAfterCancel();
				// Fecha automaticamente quando não há onCancel customizado e tem navigation listener
				if (useNavigationListener) {
					closeAllowed();
				}
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

	const isEditing = dataSource && !dataSource.isBrowsing();
	const showButtonsInHeader = buttonsPosition === 'header' || buttonsPosition === 'both';
	const showButtonsInFooter = buttonsPosition === 'footer' || buttonsPosition === 'both';

	// Botões de ação (reutilizável)
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
						onClick={() => handleSave(dataSource.getCurrentRecord())}
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

	// Footer legado (para buttonsPosition='footer' ou 'both')
	const renderLegacyFooter = () => (
		<Box
			style={{
				flexShrink: 0,
				padding: 'calc(0.625rem / 2)',
				display: 'flex',
				justifyContent: footerAlign === 'center' ? 'center' : 'space-between',
				alignItems: 'center',
				gap: '1rem'
			}}
		>
			{footerAlign === 'right' && footerContent && (
				<Box style={{ flex: 1 }}>{footerContent}</Box>
			)}

			{isEditing ? (
				<Group gap="md">
					<ArchbaseSmartActionButton
						actionName="save"
						actionDescription={`Salvar ${resourceDescription || 'registro'}`}
						leftSection={<IconDeviceFloppy />}
						onClick={() => handleSave(dataSource.getCurrentRecord())}
						disabled={dataSource && dataSource.isBrowsing()}
						variant={variant ?? appContext.variant}
						color="green"
					>{saveLabel || `${getI18nextInstance().t('Ok')}`}</ArchbaseSmartActionButton>
					<ArchbaseSmartActionButton
						actionName="cancel"
						actionDescription="Cancelar operação"
						leftSection={<IconX />}
						onClick={handleCancel}
						disabled={dataSource && dataSource.isBrowsing()}
						variant={variant ?? appContext.variant}
						color="red"
					>{cancelLabel || `${getI18nextInstance().t('Cancel')}`}</ArchbaseSmartActionButton>
				</Group>
			) : (
				<Group gap="md">
					<ArchbaseSmartActionButton
						actionName="close"
						actionDescription="Fechar formulário"
						leftSection={<IconX />}
						onClick={handleCancel}
						variant={variant ?? appContext.variant}
					>{`${getI18nextInstance().t('Close')}`}</ArchbaseSmartActionButton>
				</Group>
			)}

			{(footerAlign === 'left' || footerAlign === 'center') && footerContent && (
				<Box style={{ flex: footerAlign === 'left' ? 1 : 0, textAlign: 'right' }}>
					{footerContent}
				</Box>
			)}
		</Box>
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
						width: width,
						height: height,
						display: 'flex',
						flexDirection: 'column',
						padding: showButtonsInHeader ? 0 : 4,
					}}
				>
					{/* ========== HEADER (quando buttonsPosition inclui 'header') ========== */}
					{showButtonsInHeader && (
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
									{(title || subtitle) && (
										<Box>
											{title && <Title order={4} fw={600}>{title}</Title>}
											{subtitle && <Text size="sm" c="dimmed">{subtitle}</Text>}
										</Box>
									)}
								</Group>

								{/* Right: Action buttons */}
								{renderActionButtons()}
							</Flex>
						</Box>
					)}

					{/* Error Alert */}
					{isInternalError && (
						<Box style={{ flexShrink: 0, padding: showButtonsInHeader ? '16px 24px 0' : undefined }}>
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

					{/* Body: Conteúdo scrollável */}
					<ScrollArea
						style={{
							flex: 1,
							minHeight: 0,
							padding: showButtonsInHeader ? '24px' : 'calc(0.625rem / 2)',
						}}
					>
						<LoadingOverlay visible={isLoading || isCanceling || isSaving} opacity={0.3} />
						{children}
					</ScrollArea>

					{/* Footer (quando buttonsPosition inclui 'footer') */}
					{showButtonsInFooter && renderLegacyFooter()}
				</Paper>
			</ValidationErrorsProvider>
		</ArchbaseConditionalSecurityWrapper>
	);
}
