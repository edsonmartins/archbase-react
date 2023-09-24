import {
  Button,
  Group,
  LoadingOverlay,
  MantineNumberSize,
  Paper,
  ScrollArea,
  Space,
  Stack,
  Variants,
} from '@mantine/core';
import React, { useRef, useState } from 'react';
import { t } from 'i18next';
import { IconBug, IconDeviceFloppy } from '@tabler/icons-react';
import { ArchbaseAlert } from '../notification';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseAppContext } from '../core';
import { useArchbaseDataSourceListener } from '../hooks';
import { IconX } from '@tabler/icons-react';
import { processErrorMessage } from '../core/exceptions';

export interface ArchbaseFormTemplateProps<T, ID> {
  title: string;
  dataSource: ArchbaseDataSource<T, ID>;
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
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
  radius?: MantineNumberSize;
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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const innerComponentRef = innerRef || useRef<any>();
  const [isInternalError, setIsInternalError] = useState<boolean>(isError);
  const [internalError, setInternalError] = useState<string>(error);

  useArchbaseDataSourceListener<T, ID>({
    dataSource,
    listener: (event: DataSourceEvent<T>): void => {
      if (event.type === DataSourceEventNames.onError) {
        setIsInternalError(true);
        setInternalError(event.error);
      }
    },
  });

  const handleSave = async (entity) => {
    try {
      if (onSave) {
        onSave(entity);
      } else {
        onBeforeSave && onBeforeSave(entity);
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
      ref={innerComponentRef}
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
        <LoadingOverlay visible={isCanceling || isSaving} overlayOpacity={0.3} />
        {children}
        <Stack>
          <Space h="lg" />
          {dataSource && !dataSource.isBrowsing() ? (
            <Group spacing="md">
              <Button
                leftIcon={<IconDeviceFloppy />}
                onClick={() => handleSave(dataSource.getCurrentRecord())}
                disabled={dataSource && dataSource.isBrowsing()}
                variant={variant ?? appContext.variant}
                color="green"
              >{`${t('Ok')}`}</Button>
              <Button
                leftIcon={<IconX />}
                onClick={handleCancel}
                disabled={dataSource && dataSource.isBrowsing()}
                variant={variant ?? appContext.variant}
                color="red"
              >{`${t('Cancel')}`}</Button>
            </Group>
          ) : (
            <Group spacing="md">
              <Button leftIcon={<IconX />} onClick={handleCancel} variant={variant ?? appContext.variant}>{`${t(
                'Close',
              )}`}</Button>
            </Group>
          )}
        </Stack>
      </ScrollArea>
    </Paper>
  );
}
