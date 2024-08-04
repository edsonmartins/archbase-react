import { Button, Flex, Group, Modal, ModalProps, useMantineColorScheme } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { t } from 'i18next';
import React, { ReactNode } from 'react';
import { ArchbaseForm, ArchbaseSpaceBottom, ArchbaseSpaceFill, ArchbaseSpaceFixed } from '../containers';
import { useArchbaseAppContext } from '../core';
import { useArchbaseTheme } from '../hooks';
import { ArchbaseDialog } from '../notification';
import { ArchbaseActionButton } from '@components/security/ArchbaseActionButton';
import { SecurityProps } from '@components/security/SecurityProps';

export interface ArchbaseModalTemplateProps extends ModalProps {
	height: string | number | undefined;
	userActions?: ReactNode;
	onlyOkButton?: boolean;
	onClickOk?: () => void;
	onClickCancel?: () => void;
	securityProps?: SecurityProps;
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
	securityProps,
}: ArchbaseModalTemplateProps) {
	const appContext = useArchbaseAppContext();
	const theme = useArchbaseTheme();
	const { colorScheme } = useMantineColorScheme();

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
		ArchbaseDialog.showWarning(t('Click on Ok or Cancel to close'));
	};

	const actionName = `Ok ${title}`;

	return (
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
						<ArchbaseActionButton
								securityProps={securityProps?.securityManager && {
									securityManager: securityProps.securityManager,
									actionName: securityProps.actionName ? securityProps.actionName : actionName,
									actionDescription: securityProps.actionDescription ? securityProps.actionDescription : actionName,
								}}
								leftSection={<IconCheck />}
								onClick={handleSave}
								variant={variant ?? appContext.variant}
								color="green"
							>{`${t('Ok')}`}</ArchbaseActionButton>
							{!onlyOkButton ? (
								<Button
									leftSection={<IconX />}
									onClick={handleCancel}
									variant={variant ?? appContext.variant}
									color="red"
								>
									{onClickCancel ? `${t('Cancel')}` : `${t('Close')}`}
								</Button>
							) : null}
						</Group>
					</Flex>
				</ArchbaseSpaceBottom>
			</ArchbaseSpaceFixed>
		</Modal>
	);
}
