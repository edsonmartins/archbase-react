import {
	AlertVariant,
	Button,
	ButtonVariant,
	Group,
	LoadingOverlay,
	Paper,
	ScrollArea,
	Space,
	Stack,
} from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import { IconBug, IconDeviceFloppy } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { getI18nextInstance, useArchbaseTranslation } from '@archbase/core';
import React, { useRef, useState } from 'react';
import { useArchbaseAppContext } from '@archbase/core';
import { processErrorMessage } from '@archbase/core';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@archbase/data';
import { useArchbaseDataSourceListener } from '@archbase/data';
import { ArchbaseAlert } from '@archbase/components';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import { ArchbaseTemplateSecurityProps } from './ArchbaseTemplateCommonTypes';
import { ArchbaseConditionalSecurityWrapper, ArchbaseSmartActionButton } from './components';
import { useOptionalTemplateSecurity } from './hooks';

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
	const innerComponentRef = useRef<any>(null);
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

	// Componente interno que contém toda a lógica
	const TemplateContent = () => (
		<Paper
			ref={innerRef || innerComponentRef}
			withBorder={withBorder}
			radius={radius}
			style={{ width: width, height: height, padding: 20 }}
		>
			{isInternalError ? (
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
			) : null}
			<ScrollArea h={`calc(100% - ${isError ? '80px' : '0px'})`}>
				<LoadingOverlay visible={isCanceling || isSaving} opacity={0.3} />
				{children}
				<Stack>
					<Space h="lg" />
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
				</Stack>
			</ScrollArea>
		</Paper>
	);

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
			<TemplateContent />
		</ArchbaseConditionalSecurityWrapper>
	);
}
