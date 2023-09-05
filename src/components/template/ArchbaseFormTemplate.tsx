import { Button, Group, MantineNumberSize, Paper, ScrollArea, Space, Stack, Variants } from '@mantine/core';
import React, { useRef } from 'react';
import { t } from 'i18next';
import { IconBug } from '@tabler/icons-react';
import { ArchbaseAlert } from '../notification';
import { ArchbaseDataSource } from '@components/datasource';
import { useArchbaseAppContext } from '@components/core';

export interface ArchbaseFormTemplateProps<T, ID> {
  title: string;
  dataSource: ArchbaseDataSource<T, ID>;
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined;
  isLoading?: boolean;
  isError?: boolean;
  error?: string | undefined;
  clearError?: () => void;
  width?: number | string | undefined;
  height?: number | string | undefined;
  withBorder?: boolean;
  children?: React.ReactNode | React.ReactNode[];
  radius?: MantineNumberSize;
  onBeforeSave?: (entityToSave: T) => void;
  onAfterSave?: (savedEntity: T) => void;
  onBeforeCancel?: () => void;
  onAfterCancel?: () => void;
}

export function ArchbaseFormTemplate<T extends object, ID>({
  //title,
  innerRef,
  //isLoading = false,
  isError = false,
  error = '',
  clearError = () => {},
  width = '100%',
  height = '100%',
  withBorder = true,
  children,
  radius,
  variant,
}: ArchbaseFormTemplateProps<T, ID>) {
  const appContext = useArchbaseAppContext();
  const innerComponentRef = innerRef || useRef<any>();

  return (
    <Paper
      ref={innerComponentRef}
      withBorder={withBorder}
      radius={radius}
      style={{ width: width, height: height, padding: 20 }}
    >
      {isError ? (
        <ArchbaseAlert
          autoClose={20000}
          withCloseButton={true}
          withBorder={true}
          icon={<IconBug size="1.4rem" />}
          title={t('WARNING')}
          titleColor="rgb(250, 82, 82)"
          variant={variant ?? appContext.variant}
          onClose={() => clearError && clearError()}
        >
          <span>{error}</span>
        </ArchbaseAlert>
      ) : null}
      <ScrollArea h={`calc(100% - ${isError ? '80px' : '0px'})`}>
        {children}
        <Stack>
          <Space h="lg" />
          <Group>
            <Button variant={variant ?? appContext.variant} color="green">{`${t('Save')}`}</Button>
            <Button variant={variant ?? appContext.variant} color="red">{`${t('Cancel')}`}</Button>
          </Group>
        </Stack>
      </ScrollArea>
    </Paper>
  );
}
