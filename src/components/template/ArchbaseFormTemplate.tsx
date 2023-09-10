import { Button, Group, MantineNumberSize, Paper, ScrollArea, Space, Stack, Variants } from '@mantine/core'
import React, { useRef, useState } from 'react'
import { t } from 'i18next'
import { IconBug } from '@tabler/icons-react'
import { ArchbaseAlert } from '../notification'
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '../datasource'
import { useArchbaseAppContext } from '../core'
import { useArchbaseDataSourceListener } from '../hooks'

export interface ArchbaseFormTemplateProps<T, ID> {
  title: string
  dataSource: ArchbaseDataSource<T,ID>
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined
  isLoading?: boolean
  isError?: boolean
  error?: string | undefined
  clearError?: () => void
  autoCloseAlertError?: number
  width?: number | string | undefined
  height?: number | string | undefined
  withBorder?: boolean
  children?: React.ReactNode | React.ReactNode[]
  radius?: MantineNumberSize
  onBeforeSave?: (entityToSave : T) => void
  onAfterSave?: (savedEntity : T)=>void
  onBeforeCancel?: ()=>void
  onAfterCancel?: ()=>void;
}

export function ArchbaseFormTemplate<T extends object, ID>({
  innerRef,
  isError = false,
  error = '',
  clearError = () => {},
  autoCloseAlertError = 15000,
  width = '100%',
  height = '100%',
  withBorder = true,
  children,
  radius,
  variant,
  dataSource
}: ArchbaseFormTemplateProps<T, ID>) {
  const appContext = useArchbaseAppContext();
  const innerComponentRef = innerRef || useRef<any>()
  const [isInternalError, setIsInternalError] = useState<boolean>(isError)
  const [internalError, setInternalError] = useState<string>(error);

  useArchbaseDataSourceListener<T, ID>({
    dataSource,
    listener: (event: DataSourceEvent<T>): void => {
      if (event.type === DataSourceEventNames.onError) {
        setIsInternalError(true);
        setInternalError(event.error);
      }
    }
  })

  const handleSave = () =>{
      dataSource.save()
  }

  const handleCancel = () => {
      dataSource.cancel()
  }

  const handleCloseAlert = () => {
    clearError && clearError()
    setIsInternalError(false)
    setInternalError("")
  }

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
          variant={variant??appContext.variant}
          onClose={handleCloseAlert}
        >
          <span>{internalError}</span>
        </ArchbaseAlert>
      ) : null}
      <ScrollArea h={`calc(100% - ${isError?'80px':'0px'})`}>
        {children}  
        <Stack>
          <Space h="lg" />
          <Group>
            <Button onClick={handleSave} disabled={dataSource.isBrowsing()} variant={variant??appContext.variant} color="green">{`${t('Save')}`}</Button>
            <Button onClick={handleCancel} disabled={dataSource.isBrowsing()} variant={variant??appContext.variant} color="red">{`${t('Cancel')}`}</Button>
          </Group>
        </Stack>
      </ScrollArea>
    </Paper>
  )
}
