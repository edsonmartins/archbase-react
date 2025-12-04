import {
	AlertVariant,
	ButtonVariant,
	Group,
	LoadingOverlay,
	Paper,
	ScrollArea,
	Box,
} from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import { IconBug, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { getI18nextInstance } from '@archbase/core';
import React, { Fragment, useState } from 'react';
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

export interface ArchbaseFormTemplateProps<T, ID> extends ArchbaseTemplateSecurityProps {
	title: string;
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
	/** Alinhamento dos botões no footer: 'left' | 'center' | 'right' */
	footerAlign?: 'left' | 'center' | 'right';
	/** Conteúdo adicional a ser exibido no footer (à esquerda dos botões se footerAlign='right', à direita se footerAlign='left') */
	footerContent?: React.ReactNode;
	onSave?: (entityToSave) => void;
	onCancel?: () => void;
	onBeforeSave?: (entityToSave: T) => void;
	onAfterSave?: (savedEntity: T) => void;
	onBeforeCancel?: () => void;
	onAfterCancel?: () => void;
	onError?: (error: string) => void;
}

export function ArchbaseFormTemplate<T extends object, ID>({
	innerRef,
	title,
	isError = false,
	isCanceling = false,
	isSaving = false,
	error = '',
	clearError = () => {},
	autoCloseAlertError = 15000,
	width = '100%',
	height = '100%',
	withBorder = true,
	children,
	radius,
	variant,
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

	// 🔐 SEGURANÇA: Hook opcional de segurança (só ativa se resourceName fornecido)
	const security = useOptionalTemplateSecurity({
		resourceName,
		resourceDescription,
		autoRegisterActions: securityOptions?.autoRegisterActions ?? true
	});

	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
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
				// 🔄 MIGRAÇÃO V1/V2: ForceUpdate apenas para V1
				if (!v1v2Compatibility.isDataSourceV2) {
					forceUpdate();
				}
			}
		},
	});

	const validationContext = useValidationErrors();

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
							// Limpar erros de validação após salvar com sucesso
							validationContext?.clearAll();
							onAfterSave && onAfterSave(entity);
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
				onCancel();
			} else {
				onBeforeCancel && onBeforeCancel();
				if (!dataSource.isBrowsing()) {
					dataSource.cancel();
				}
				// Limpar erros de validação ao cancelar
				validationContext?.clearAll();
				onAfterCancel && onAfterCancel();
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

	// 🔐 WRAPPER CONDICIONAL: Só aplica segurança SE resourceName fornecido
	// ✅ CORRIGIDO: Removido componente inline (TemplateContent) que causava remontagem
	// a cada re-render, perdendo o estado dos editores filhos (incluindo erros de validação)
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
						padding: 4,
					}}
				>
					{/* Header: Error Alert (altura automática) */}
					{isInternalError && (
						<Box style={{ flexShrink: 0 }}>
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

					{/* Body: Conteúdo scrollável (flex: 1) */}
					<ScrollArea
						style={{
							flex: 1,
							minHeight: 0, // Importante para flex funcionar
							padding: 'calc(0.625rem / 2)',
						}}
					>
						<LoadingOverlay visible={isCanceling || isSaving} opacity={0.3} />
						{children}
					</ScrollArea>

					{/* Footer: Botões de ação e conteúdo customizado (altura automática) */}
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
						{/* Conteúdo customizado à esquerda (se footerAlign='right') */}
						{footerAlign === 'right' && footerContent && (
							<Box style={{ flex: 1 }}>{footerContent}</Box>
						)}

						{/* Botões de ação */}
						{dataSource && !dataSource.isBrowsing() ? (
							<Group gap="md">
								<ArchbaseSmartActionButton
									actionName="save"
									actionDescription={`Salvar ${resourceDescription || 'registro'}`}
									leftSection={<IconDeviceFloppy />}
									onClick={() => handleSave(dataSource.getCurrentRecord())}
									disabled={dataSource && dataSource.isBrowsing()}
									variant={variant ?? appContext.variant}
									color="green"
								>{`${getI18nextInstance().t('Ok')}`}</ArchbaseSmartActionButton>
								<ArchbaseSmartActionButton
									actionName="cancel"
									actionDescription="Cancelar operação"
									leftSection={<IconX />}
									onClick={handleCancel}
									disabled={dataSource && dataSource.isBrowsing()}
									variant={variant ?? appContext.variant}
									color="red"
								>{`${getI18nextInstance().t('Cancel')}`}</ArchbaseSmartActionButton>
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

						{/* Conteúdo customizado à direita (se footerAlign='left' ou 'center') */}
						{(footerAlign === 'left' || footerAlign === 'center') && footerContent && (
							<Box style={{ flex: footerAlign === 'left' ? 1 : 0, textAlign: 'right' }}>
								{footerContent}
							</Box>
						)}
					</Box>
				</Paper>
			</ValidationErrorsProvider>
		</ArchbaseConditionalSecurityWrapper>
	);
}
