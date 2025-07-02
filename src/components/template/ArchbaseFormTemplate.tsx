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
import { t } from 'i18next';
import React, { useRef, useState } from 'react';
import { useArchbaseAppContext } from '../core';
import { processErrorMessage } from '../core/exceptions';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseDataSourceListener } from '../hooks';
import { ArchbaseAlert } from '../notification';
import { useArchbaseV1V2Compatibility } from '../core/patterns/ArchbaseV1V2CompatibilityPattern';

export interface ArchbaseFormTemplateProps<T, ID> {
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
}: ArchbaseFormTemplateProps<T, ID>) {
	const appContext = useArchbaseAppContext();
	const innerComponentRef = useRef<any>();
	const [isInternalError, setIsInternalError] = useState<boolean>(isError);
	const [internalError, setInternalError] = useState<string>(error);
	const forceUpdate = useForceUpdate();

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

	return (
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
					title={t('WARNING')}
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
							<Button
								leftSection={<IconDeviceFloppy />}
								onClick={() => handleSave(dataSource.getCurrentRecord())}
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
				</Stack>
			</ScrollArea>
		</Paper>
	);
}
