import React, { Fragment, ReactNode, useMemo, useRef, useState } from 'react'
import type { ArchbaseDataSource } from '../datasource'
import {
  ArchbaseQueryBuilder,
  ArchbaseQueryFilter,
  ArchbaseQueryFilterDelegator,
  ArchbaseQueryFilterState,
  FilterOptions,
  getDefaultEmptyFilter
} from '../querybuilder'
import { ArchbaseAlert } from '../notification'
import { IconBug, IconEdit, IconEye } from '@tabler/icons-react'
import { t } from 'i18next'
import useComponentSize from '@rehooks/component-size'
import {
  Box,
  Button,
  Flex,
  Grid,
  MantineNumberSize,
  Pagination,
  Paper,
  ScrollArea,
  Text,
  Variants
} from '@mantine/core'
import { useArchbaseAppContext } from '../core'


export interface ArchbaseSpaceTemplateProps<T, ID> {
  title: string;
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>
  headerLeft?: ReactNode;
  headerMiddle?: ReactNode;
  headerRight?: ReactNode;
  footerLeft?: ReactNode;
  footerMiddle?: ReactNode;
  footerRight?: ReactNode;
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined;
  width?: number | string | undefined;
  height?: number | string | undefined;
  withBorder?: boolean;
  children?: React.ReactNode | React.ReactNode[];
  radius?: MantineNumberSize;
  debug?: boolean;
  isError?: boolean
  error?: string | undefined
  clearError?: () => void
}

export function ArchbaseSpaceTemplate<T extends object, ID>({
  title,
  innerRef,
  isError = false,
  error = '',
  clearError,
  width = '100%',
  height = '100%',
  withBorder = true,
  children,
  radius,
  debug = false,
  headerLeft,
  headerMiddle,
  headerRight,
  footerLeft,
  footerMiddle,
  footerRight,
  variant
}: ArchbaseSpaceTemplateProps<T, ID>) {
  const appContext = useArchbaseAppContext();
  const innerComponentRef = innerRef || useRef<any>()
  const filterRef = useRef<any>()
  let size = useComponentSize(innerComponentRef)

  return (
    <Paper
      ref={innerComponentRef}
      withBorder={withBorder}
      radius={radius}
      style={{ width: width, height: height, padding: 4 }}
    >
      <Box sx={{ height: 'auto' }}>
        <Grid m={0} gutter="xs" justify="center" align="center" grow>
          <Grid.Col sx={{ border: debug ? '1px dashed' : '', display:'flex', justifyContent:'flex-start', alignItems:'center'}} span="auto">
            {headerLeft}
          </Grid.Col>
          <Grid.Col span="auto" sx={{ border: debug ? '1px dashed' : '', display:'flex', justifyContent:'center', alignItems:'center'}}> 
          </Grid.Col>
          <Grid.Col span="content" sx={{ border: debug ? '1px dashed' : '', display:'flex', justifyContent:'flex-end', alignItems:'center'}}> 
            {headerRight}
          </Grid.Col>
        </Grid>
      </Box>
      <ScrollArea sx={{ border: debug ? '1px dashed' : '', height: 'auto', padding: 'calc(0.625rem / 2)' }}>
        {children ? (
          <Fragment>
            {isError ? (
              <ArchbaseAlert
                autoClose={20000}
                withCloseButton={true}
                withBorder={true}
                icon={<IconBug size="1.4rem" />}
                title={t('WARNING')}
                titleColor="rgb(250, 82, 82)"
                variant={variant??appContext.variant}
                onClose={() => clearError && clearError()}
              >
                <span>{error}</span>
              </ArchbaseAlert>
            ) : null}
            {children}
          </Fragment>
        ) : debug ? (
          <Flex
            style={{ height: '100%' }}
            gap="md"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Text size="lg">INSIRA O CONTEÚDO DO PAINEL AQUI.</Text>
          </Flex>
        ) : null}
      </ScrollArea>
      <Grid
        m={0}
        sx={{ height: 60, position: 'relative', bottom: 6, left: 0, right: 0 }}
        gutter="xs"
        justify="center"
        align="center"
        grow
      >
        <Grid.Col
          sx={{ border: debug ? '1px dashed' : '', height: debug ? '70%' : 'auto', display:'flex', justifyContent:'flex-start', alignItems:'center'}}
          span="auto"
        >
        </Grid.Col>
        <Grid.Col span="auto" sx={{ border: debug ? '1px dashed' : '', display:'flex', justifyContent:'center', alignItems:'center'}}>
        </Grid.Col>
        <Grid.Col span="auto" sx={{ border: debug ? '1px dashed' : '', display:'flex', justifyContent:'flex-end', alignItems:'center'}}> 
        </Grid.Col>
      </Grid>
    </Paper>
  )
}
