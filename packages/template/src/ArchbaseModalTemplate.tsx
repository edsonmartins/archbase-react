import { Button, Flex, Group, Modal, ModalProps, useMantineColorScheme } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { getI18nextInstance, useArchbaseTranslation } from '@archbase/core';
import React, { ReactNode } from 'react';
import { ArchbaseForm, ArchbaseSpaceBottom, ArchbaseSpaceFill, ArchbaseSpaceFixed } from '@archbase/layout';
import { useArchbaseAppContext } from '@archbase/core';
import { useArchbaseTheme } from '@archbase/core';
import { ArchbaseDialog } from '@archbase/components';
import { ArchbaseTemplateSecurityProps } from './ArchbaseTemplateCommonTypes';
import { ArchbaseConditionalSecurityWrapper, ArchbaseSmartActionButton } from './components';
import { useOptionalTemplateSecurity } from './hooks';

export interface ArchbaseModalTemplateProps extends ModalProps, ArchbaseTemplateSecurityProps {
	height: string | number | undefined;
	userActions?: ReactNode;
	onlyOkButton?: boolean;
	onClickOk?: () => void;
	onClickCancel?: () => void;
}

export function ArchbaseModalTemplate({
	title,
	withOverlay = true,
	overlayProps,
	children,
	withCloseButton = true,
	closeButtonProps,
	opened,
	fullScreen,
	centered,
	variant,
	closeOnEscape = true,
	size,
	height,
	onlyOkButton = false,
	onClose,
	onClickOk,
	onClickCancel,
	userActions,
	// Props de segurança (opcionais)
	resourceName,
	resourceDescription,
	requiredPermissions,
	fallbackComponent,
	securityOptions,
}: ArchbaseModalTemplateProps) {
	const appContext = useArchbaseAppContext();
	const theme = useArchbaseTheme();
	const { colorScheme } = useMantineColorScheme();

	// 🔐 SEGURANÇA: Hook opcional de segurança (só ativa se resourceName fornecido)
	const security = useOptionalTemplateSecurity({
		resourceName,
		resourceDescription,
		autoRegisterActions: securityOptions?.autoRegisterActions ?? true
	});

	const handleSave = () => {
		if (onClickOk) {
			onClickOk();
		}
		onClose();
	};

	const handleCancel = () => {
		if (onClickCancel) {
			onClickCancel();
		}
		onClose();
	};

	const handleClose = () => {
		ArchbaseDialog.showWarning(getI18nextInstance().t('Click on Ok or Cancel to close'));
	};

	// Componente interno que contém toda a lógica
	const TemplateContent = () => (
		<Modal
			title={title}
			withOverlay={withOverlay}
			overlayProps={
				overlayProps || {
					color: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[6],
					opacity: 0.25,
				}
			}
			withCloseButton={withCloseButton}
			closeButtonProps={closeButtonProps}
			onClose={handleClose}
			opened={opened}
			fullScreen={fullScreen}
			centered={centered}
			closeOnEscape={closeOnEscape}
			size={size}
		>
			<ArchbaseSpaceFixed height={height}>
				<ArchbaseSpaceFill>
					<ArchbaseForm>{children}</ArchbaseForm>
				</ArchbaseSpaceFill>
				<ArchbaseSpaceBottom size="40px">
					<Flex justify="space-between" align="center">
						<Group>{userActions}</Group>
						<Group gap="md">
							<ArchbaseSmartActionButton
								actionName="save"
								actionDescription={`Salvar ${resourceDescription || 'registro'}`}
								leftSection={<IconCheck />}
								onClick={handleSave}
								variant={variant ?? appContext.variant}
								color="green"
							>{`${getI18nextInstance().t('Ok')}`}</ArchbaseSmartActionButton>
							{!onlyOkButton ? (
								<ArchbaseSmartActionButton
									actionName="cancel"
									actionDescription="Cancelar operação"
									leftSection={<IconX />}
									onClick={handleCancel}
									variant={variant ?? appContext.variant}
									color="red"
								>
									{onClickCancel ? `${getI18nextInstance().t('Cancel')}` : `${getI18nextInstance().t('Close')}`}
								</ArchbaseSmartActionButton>
							) : null}
						</Group>
					</Flex>
				</ArchbaseSpaceBottom>
			</ArchbaseSpaceFixed>
		</Modal>
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
