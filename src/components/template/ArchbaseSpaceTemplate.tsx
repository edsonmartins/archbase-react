import React, { Fragment, ReactNode, useMemo, useRef, useState } from 'react';
import type { ArchbaseDataSource } from '../datasource';
import {
  ArchbaseQueryBuilder,
  ArchbaseQueryFilter,
  ArchbaseQueryFilterDelegator,
  ArchbaseQueryFilterState,
  FilterOptions,
  getDefaultEmptyFilter,
} from '../querybuilder';
import { ArchbaseAlert } from '../notification';
import { IconBug, IconEdit, IconEye } from '@tabler/icons-react';
import { t } from 'i18next';
import useComponentSize from '@rehooks/component-size';
import {
  Box,
  Button,
  ColSpan,
  Flex,
  Grid,
  MantineNumberSize,
  Pagination,
  Paper,
  ScrollArea,
  Text,
  Variants,
} from '@mantine/core';
import { useArchbaseAppContext } from '../core';

interface ArchbaseBreakpointsColSpans {
  /** Col span em (min-width: theme.breakpoints.xs) */
  xs?: ColSpan;
  /** Col span em (min-width: theme.breakpoints.sm) */
  sm?: ColSpan;
  /** Col span em (min-width: theme.breakpoints.md) */
  md?: ColSpan;
  /** Col span em (min-width: theme.breakpoints.lg) */
  lg?: ColSpan;
  /** Col span em (min-width: theme.breakpoints.xl) */
  xl?: ColSpan;
}

export interface ArchbaseSpaceTemplateOptions {
  /** Indicar qual lado do header irá crescer para preencher o espaço sobrando (Válido somente quando headerGridColumns não é atribuído ao options) */
  headerFlexGrow?: 'left' | 'even' | 'right';
  /** Indicar os ColSpan das grids para cada parte do header (left, middle, right) de acordo com os breakpoints */
  headerGridColumns?: {
    right?: ArchbaseBreakpointsColSpans;
    middle?: ArchbaseBreakpointsColSpans;
    left?: ArchbaseBreakpointsColSpans;
  };
  /** Indicar qual lado do footer irá crescer para preencher o espaço sobrando (Válido somente quando footerGridColumns não é atribuído ao options) */
  footerFlexGrow?: 'left' | 'even' | 'right';
  /** Indicar os ColSpan das grids para cada parte do footer (left, middle, right) de acordo com os breakpoints */
  footerGridColumns?: {
    right?: ArchbaseBreakpointsColSpans;
    middle?: ArchbaseBreakpointsColSpans;
    left?: ArchbaseBreakpointsColSpans;
  };
}

export interface ArchbaseSpaceTemplateProps<T, ID> {
  title: string;
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
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
  isError?: boolean;
  error?: string | undefined;
  clearError?: () => void;
  /** Opções de personalização */
  options?: ArchbaseSpaceTemplateOptions;
}

function buildHeader(
  options: ArchbaseSpaceTemplateOptions,
  headerLeft: ReactNode,
  headerRight: ReactNode,
  debug: boolean,
) {
  if (options && options.headerGridColumns) {
    const footerGridColumnsLeft: ArchbaseBreakpointsColSpans = options.headerGridColumns.left
      ? options.headerGridColumns.left
      : { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto' };
    const footerGridColumnsMiddle: ArchbaseBreakpointsColSpans = options.headerGridColumns.middle
      ? options.headerGridColumns.middle
      : { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto' };
    const headerGridColumnsRight: ArchbaseBreakpointsColSpans = options.headerGridColumns.right
      ? options.headerGridColumns.right
      : { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto' };

    return (
      <Grid m={0} gutter="xs" justify="center" align="center" grow>
        <Grid.Col
          xs={footerGridColumnsLeft.xs}
          sm={footerGridColumnsLeft.sm}
          md={footerGridColumnsLeft.md}
          lg={footerGridColumnsLeft.lg}
          sx={{
            border: debug ? '1px dashed' : '',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {headerLeft}
        </Grid.Col>
        <Grid.Col
          xs={footerGridColumnsMiddle.xs}
          sm={footerGridColumnsMiddle.sm}
          md={footerGridColumnsMiddle.md}
          lg={footerGridColumnsMiddle.lg}
          sx={{
            border: debug ? '1px dashed' : '',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        ></Grid.Col>
        <Grid.Col
          xs={headerGridColumnsRight.xs}
          sm={headerGridColumnsRight.sm}
          md={headerGridColumnsRight.md}
          lg={headerGridColumnsRight.lg}
          sx={{
            border: debug ? '1px dashed' : '',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          {headerRight}
        </Grid.Col>
      </Grid>
    );
  } else {
    const headerFlexGrow = options && options.headerFlexGrow ? options.headerFlexGrow : 'even';

    return (
      <Flex justify={'space-between'}>
        <Flex
          w={headerFlexGrow === 'left' || headerFlexGrow === 'even' ? '100%' : undefined}
          maw={headerFlexGrow === 'left' || headerFlexGrow === 'even' ? undefined : '100%'}
          align={'center'}
        >
          {headerLeft}
        </Flex>
        <Flex
          w={headerFlexGrow === 'right' || headerFlexGrow === 'even' ? '100%' : undefined}
          maw={headerFlexGrow === 'right' || headerFlexGrow === 'even' ? undefined : '100%'}
          align={'center'}
        >
          {headerRight}
        </Flex>
      </Flex>
    );
  }
}

function buildFooter(
  options: ArchbaseSpaceTemplateOptions,
  footerLeft: ReactNode,
  footerRight: ReactNode,
  debug: boolean,
) {
  if (options && options.footerGridColumns) {
    const footerGridColumnsLeft: ArchbaseBreakpointsColSpans = options.footerGridColumns.left
      ? options.footerGridColumns.left
      : { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto' };
    const footerGridColumnsMiddle: ArchbaseBreakpointsColSpans = options.footerGridColumns.middle
      ? options.footerGridColumns.middle
      : { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto' };
    const footerGridColumnsRight: ArchbaseBreakpointsColSpans = options.footerGridColumns.right
      ? options.footerGridColumns.right
      : { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto' };

    return (
      <Grid
        m={0}
        sx={{ height: 60, position: 'relative', bottom: 6, left: 0, right: 0 }}
        gutter="xs"
        justify="center"
        align="center"
        grow
      >
        <Grid.Col
          xs={footerGridColumnsLeft.xs}
          sm={footerGridColumnsLeft.sm}
          md={footerGridColumnsLeft.md}
          lg={footerGridColumnsLeft.lg}
          sx={{
            border: debug ? '1px dashed' : '',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {footerLeft}
        </Grid.Col>
        <Grid.Col
          xs={footerGridColumnsMiddle.xs}
          sm={footerGridColumnsMiddle.sm}
          md={footerGridColumnsMiddle.md}
          lg={footerGridColumnsMiddle.lg}
          sx={{
            border: debug ? '1px dashed' : '',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        ></Grid.Col>
        <Grid.Col
          xs={footerGridColumnsRight.xs}
          sm={footerGridColumnsRight.sm}
          md={footerGridColumnsRight.md}
          lg={footerGridColumnsRight.lg}
          sx={{
            border: debug ? '1px dashed' : '',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          {footerRight}
        </Grid.Col>
      </Grid>
    );
  } else {
    const footerFlexGrow = options && options.footerFlexGrow ? options.footerFlexGrow : 'even';

    return (
      <Flex justify={'space-between'}>
        <Flex
          w={footerFlexGrow === 'left' || footerFlexGrow === 'even' ? '100%' : undefined}
          maw={footerFlexGrow === 'left' || footerFlexGrow === 'even' ? undefined : '100%'}
          align={'center'}
        >
          {footerLeft}
        </Flex>
        <Flex
          w={footerFlexGrow === 'right' || footerFlexGrow === 'even' ? '100%' : undefined}
          maw={footerFlexGrow === 'right' || footerFlexGrow === 'even' ? undefined : '100%'}
          align={'center'}
        >
          {footerRight}
        </Flex>
      </Flex>
    );
  }
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
  variant,
  options,
}: ArchbaseSpaceTemplateProps<T, ID>) {
  const appContext = useArchbaseAppContext();
  const innerComponentRef = innerRef || useRef<any>();
  const filterRef = useRef<any>();
  let size = useComponentSize(innerComponentRef);

  return (
    <Paper
      ref={innerComponentRef}
      withBorder={withBorder}
      radius={radius}
      style={{ width: width, height: height, padding: 4 }}
    >
      <Box sx={{ height: 'auto' }}>{buildHeader(options, headerLeft, headerRight, debug)}</Box>
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
                variant={variant ?? appContext.variant}
                onClose={() => clearError && clearError()}
              >
                <span>{error}</span>
              </ArchbaseAlert>
            ) : null}
            {children}
          </Fragment>
        ) : debug ? (
          <Flex style={{ height: '100%' }} gap="md" justify="center" align="center" direction="row" wrap="wrap">
            <Text size="lg">INSIRA O CONTEÚDO DO PAINEL AQUI.</Text>
          </Flex>
        ) : null}
      </ScrollArea>
      {buildFooter(options, footerLeft, footerRight, debug)}
    </Paper>
  );
}
