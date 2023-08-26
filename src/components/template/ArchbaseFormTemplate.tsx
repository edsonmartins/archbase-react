import { Button, Group, MantineNumberSize, Paper, Space, Stack } from '@mantine/core';
import React, { useRef } from 'react';
import { t } from 'i18next';
import { IconBug } from '@tabler/icons-react';
import { ArchbaseAlert } from '@components/notification';

export interface ArchbaseFormTemplateProps<_T, _ID> {
  title: string;
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
}: ArchbaseFormTemplateProps<T, ID>) {
  const innerComponentRef = innerRef || useRef<any>();

  return (
    <Paper
      ref={innerComponentRef}
      withBorder={withBorder}
      radius={radius}
      style={{ width: width, height: height, padding: 4 }}
    >
      {isError ? (
        <ArchbaseAlert
          autoClose={20000}
          withCloseButton={true}
          withBorder={true}
          icon={<IconBug size="1.4rem" />}
          title={t('WARNING')}
          titleColor="rgb(250, 82, 82)"
          variant="filled"
          onClose={() => clearError && clearError()}
        >
          <span>{error}</span>
        </ArchbaseAlert>
      ) : null}

      <Stack>
        <Space h="lg" />
        <Group>
          <Button color="green">{`${t('Save')}`}</Button>
          <Button color="red">{`${t('Cancel')}`}</Button>
        </Group>
        {children}
      </Stack>
    </Paper>
  );
}
