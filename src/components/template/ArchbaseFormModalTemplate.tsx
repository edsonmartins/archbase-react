import { Button, Flex, Group, Modal, ModalProps, useMantineColorScheme } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { IconBug } from '@tabler/icons-react';
import { t } from 'i18next';
import React, { ReactNode, useState } from 'react';
import { ArchbaseForm, ArchbaseSpaceBottom, ArchbaseSpaceFill, ArchbaseSpaceFixed } from '../containers';
import { useArchbaseAppContext } from '../core';
import { processDetailErrorMessage, processErrorMessage } from '../core/exceptions';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseDataSourceListener, useArchbaseTheme } from '../hooks';
import { ArchbaseAlert, ArchbaseDialog } from '../notification';

export interface ArchbaseFormModalTemplateProps<T extends object, ID> extends Omit<ModalProps, 'onClose'> {
	dataSource?: ArchbaseDataSource<T, ID>;
	height: string | number | undefined;
	userActions?: ReactNode;
	onCustomSave?: (record?: T, callback?: Function) => void;
	onAfterSave?: (record?: T) => void;
	onClickOk: (record?: T, result?: any) => void;
	onClickCancel: (record?: T) => void;
	onBeforeOk?: (record?: T) => Promise<any> | boolean | undefined;
	isError?: boolean;
	error?: string | undefined;
	clearError?: () => void;
	autoCloseAlertError?: number;
}

export function ArchbaseFormModalTemplate<T extends object, ID>({
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
	dataSource,
	height,
	userActions,
	onAfterSave,
	onClickOk,
	onClickCancel,
	onBeforeOk,
	onCustomSave,
	isError,
	error = '',
	clearError = () => {},
	autoCloseAlertError = 15000,
}: ArchbaseFormModalTemplateProps<T, ID>) {
	const appContext = useArchbaseAppContext();
	const theme = useArchbaseTheme();
	const { colorScheme } = useMantineColorScheme();
	const [isInternalError, setIsInternalError] = useState<boolean>(isError);
	const [internalError, setInternalError] = useState<string>(error);
	const forceUpdate = useForceUpdate();

	useArchbaseDataSourceListener<T, ID>({
		dataSource,
		listener: (event: DataSourceEvent<T>): void => {
			if (event.type === DataSourceEventNames.onError) {
				setIsInternalError(true);
				setInternalError(event.error);
			}
			if (event.type === DataSourceEventNames.afterEdit || event.type === DataSourceEventNames.afterInsert) {
				forceUpdate();
			}
		},
	});

	const save = async (): Promise<boolean> => {
		if (dataSource) {
			if (!dataSource.isBrowsing()) {
				try {
					await dataSource.save();
					onAfterSave && onAfterSave(dataSource.getCurrentRecord());
				} catch (ex) {
					ArchbaseDialog.showErrorWithDetails(
						`${t('archbase:Warning')}`,
						processErrorMessage(ex),
						processDetailErrorMessage(ex),
					);
					return false;
				}
			}
		}
		return true;
	};

	const cancel = () => {
		if (dataSource) {
			if (!dataSource.isBrowsing()) {
				try {
					dataSource.cancel();
				} catch (ex) {
					// null
				}
			}
		}
	};

	const handleSave = async () => {
		if (onCustomSave) {
			if (dataSource) {
				onCustomSave(dataSource.getCurrentRecord(), () => {
					onClickOk && onClickOk();
				});
			}
		} else {
			if (onBeforeOk) {
				const result = onBeforeOk(dataSource.getCurrentRecord());
				if (result instanceof Promise) {
					result
						.then(async () => {
							if (await save()) {
								onClickOk && onClickOk();
							}
						})
						.catch((error) => {
							ArchbaseDialog.showErrorWithDetails(
								`${t('archbase:Warning')}`,
								processErrorMessage(error),
								processDetailErrorMessage(error),
							);
						});
				}
			} else {
				if (await save()) {
					onClickOk && onClickOk();
				}
			}
		}
	};

	const handleCancel = () => {
		cancel();
		onClickCancel && onClickCancel();
	};

	const handleClose = () => {
		ArchbaseDialog.showWarning(t('archbase:Click on Ok or Cancel to close'));
	};

	const handleCloseAlert = () => {
		clearError && clearError();
		setIsInternalError(false);
		setInternalError('');
	};

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
				{isInternalError ? (
					<ArchbaseAlert
						autoClose={autoCloseAlertError}
						withCloseButton={true}
						withBorder={true}
						icon={<IconBug size="1.4rem" />}
						title={t('WARNING')}
						titleColor="rgb(250, 82, 82)"
						variant={variant ?? appContext.variant}
						onClose={handleCloseAlert}
					>
						<span>{internalError}</span>
					</ArchbaseAlert>
				) : null}
				<ArchbaseSpaceFill>
					<ArchbaseForm>{children}</ArchbaseForm>
				</ArchbaseSpaceFill>
				<ArchbaseSpaceBottom size="40px">
					<Flex justify="space-between" align="center">
						<Group>{userActions}</Group>
						{dataSource && !dataSource.isBrowsing() ? (
							<Group gap="md">
								<Button
									leftSection={<IconCheck />}
									onClick={handleSave}
									disabled={dataSource && dataSource.isBrowsing()}
									variant={variant ?? appContext.variant}
									color="green"
								>{`${t('Ok')}`}</Button>
								<Button
									leftSection={<IconX />}
									onClick={handleCancel}
									disabled={dataSource && dataSource.isBrowsing()}
									variant={variant ?? appContext.variant}
									color="red"
								>{`${t('Cancel')}`}</Button>
							</Group>
						) : (
							<Group gap="md">
								<Button leftSection={<IconX />} onClick={handleCancel} variant={variant ?? appContext.variant}>{`${t(
									'Close',
								)}`}</Button>
							</Group>
						)}
					</Flex>
				</ArchbaseSpaceBottom>
			</ArchbaseSpaceFixed>
		</Modal>
	);
}
