import React, { CSSProperties, Fragment, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import type { ArchbaseDataSource } from '../datasource';
import {
  ArchbaseQueryBuilder,
  ArchbaseQueryFilter,
  ArchbaseQueryFilterDelegator,
  ArchbaseQueryFilterState,
  FilterOptions,
  getDefaultEmptyFilter,
} from '../querybuilder';
import {
  ArchbaseSpaceTop,
  ArchbaseSpaceFill,
  ArchbaseSpaceBottom,
  ArchbaseSpaceFixed,
} from '@components/containers/spaces';
import { ArchbaseAlert } from '../notification';
import { IconBug, IconEdit, IconEye } from '@tabler/icons-react';
import { t } from 'i18next';
import useComponentSize, { ComponentSize } from '@rehooks/component-size';
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
  SystemProp,
  Text,
  Variants,
  px,
} from '@mantine/core';
import { useArchbaseAppContext } from '../core';
import { useHotkeys, useUncontrolled } from '@mantine/hooks';
import { ArchbaseDebugOptions } from './ArchbaseTemplateCommonTypes';
import { ArchbaseDebugInspector } from '@components/views/objectinspector';

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
  /** Justificar o conteúdo interno da parte direita do header.*/
  headerFlexRightJustifyContent?: SystemProp<CSSProperties['justifyContent']>;
  /** Justificar o conteúdo interno da parte esquerda do header.*/
  headerFlexLeftJustifyContent?: SystemProp<CSSProperties['justifyContent']>;
  /** Indicar os ColSpan das grids para cada parte do header (left, middle, right) de acordo com os breakpoints */
  headerGridColumns?: {
    right?: ArchbaseBreakpointsColSpans;
    middle?: ArchbaseBreakpointsColSpans;
    left?: ArchbaseBreakpointsColSpans;
  };
  /** Indicar qual lado do footer irá crescer para preencher o espaço sobrando (Válido somente quando footerGridColumns não é atribuído ao options) */
  footerFlexGrow?: 'left' | 'even' | 'right';
  /** Justificar o conteúdo interno da parte direita do footer.*/
  footerFlexRightJustifyContent?: SystemProp<CSSProperties['justifyContent']>;
  /** Justificar o conteúdo interno da parte esquerda do footer.*/
  footerFlexLeftJustifyContent?: SystemProp<CSSProperties['justifyContent']>;
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
  children?: React.ReactNode;
  radius?: MantineNumberSize;
  debug?: boolean;
  defaultDebug?: boolean;
  isError?: boolean;
  error?: string | undefined;
  clearError?: () => void;
  /** Opções de personalização */
  options?: ArchbaseSpaceTemplateOptions;
  style?: CSSProperties;
  debugOptions?: ArchbaseDebugOptions;
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
    const headerFlexRightJustifyContent =
      options && options.headerFlexRightJustifyContent ? options.headerFlexRightJustifyContent : 'flex-end';
    const headerFlexLeftJustifyContent =
      options && options.headerFlexLeftJustifyContent ? options.headerFlexLeftJustifyContent : 'flex-start';

    return (
      <Flex justify={'space-between'}>
        <Flex
          w={headerFlexGrow === 'left' || headerFlexGrow === 'even' ? '100%' : undefined}
          maw={headerFlexGrow === 'left' || headerFlexGrow === 'even' ? undefined : '100%'}
          align={'center'}
          justify={headerFlexLeftJustifyContent}
          sx={{
            border: debug ? '1px dashed' : '',
          }}
        >
          {headerLeft}
        </Flex>
        <Flex
          w={headerFlexGrow === 'right' || headerFlexGrow === 'even' ? '100%' : undefined}
          maw={headerFlexGrow === 'right' || headerFlexGrow === 'even' ? undefined : '100%'}
          align={'center'}
          justify={headerFlexRightJustifyContent}
          sx={{
            border: debug ? '1px dashed' : '',
          }}
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
        // sx={{ height: 60, position: 'relative', bottom: 6, left: 0, right: 0 }}
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
          style={{
            border: debug ? '1px dashed' : '',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
          span="content"
        >
          {footerLeft}
        </Grid.Col>
        <Grid.Col
          xs={footerGridColumnsMiddle.xs}
          sm={footerGridColumnsMiddle.sm}
          md={footerGridColumnsMiddle.md}
          lg={footerGridColumnsMiddle.lg}
          style={{
            border: debug ? '1px dashed' : '',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          span="auto"
        ></Grid.Col>
        <Grid.Col
          xs={footerGridColumnsRight.xs}
          sm={footerGridColumnsRight.sm}
          md={footerGridColumnsRight.md}
          lg={footerGridColumnsRight.lg}
          style={{
            border: debug ? '1px dashed' : '',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          span="content"
        >
          {footerRight}
        </Grid.Col>
      </Grid>
    );
  } else {
    const footerFlexGrow = options && options.footerFlexGrow ? options.footerFlexGrow : 'even';
    const footerFlexRightJustifyContent =
      options && options.footerFlexRightJustifyContent ? options.footerFlexRightJustifyContent : 'flex-end';
    const footerFlexLeftJustifyContent =
      options && options.footerFlexLeftJustifyContent ? options.footerFlexLeftJustifyContent : 'flex-start';

    return (
      <Flex justify={'space-between'}>
        <Flex
          w={footerFlexGrow === 'left' || footerFlexGrow === 'even' ? '100%' : undefined}
          maw={footerFlexGrow === 'left' || footerFlexGrow === 'even' ? undefined : '100%'}
          align={'center'}
          justify={footerFlexLeftJustifyContent}
          sx={{ border: debug ? '1px dashed' : '', height: 'auto', padding: 'calc(0.625rem / 2)' }}
        >
          {footerLeft}
        </Flex>
        <Flex
          w={footerFlexGrow === 'right' || footerFlexGrow === 'even' ? '100%' : undefined}
          maw={footerFlexGrow === 'right' || footerFlexGrow === 'even' ? undefined : '100%'}
          align={'center'}
          justify={footerFlexRightJustifyContent}
          sx={{ border: debug ? '1px dashed' : '', height: 'auto', padding: 'calc(0.625rem / 2)' }}
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
  debug,
  defaultDebug,
  headerLeft,
  headerMiddle,
  headerRight,
  footerLeft,
  footerMiddle,
  footerRight,
  variant,
  options = {},
  style,
  debugOptions,
}: ArchbaseSpaceTemplateProps<T, ID>) {
  const [_debug, setDebug] = useUncontrolled({
    value: debug,
    defaultValue: defaultDebug,
    finalValue: false,
  });
  useHotkeys([[debugOptions && debugOptions.debugLayoutHotKey, () => setDebug(!_debug)]]);
  const appContext = useArchbaseAppContext();
  const innerComponentRef = innerRef || useRef<any>();
  const headerRef = useRef<any>();
  const footerRef = useRef<any>();
  let headerSize = useComponentSize(headerRef);
  let footerSize = useComponentSize(footerRef);
  let innerComponentSize = useComponentSize(innerComponentRef);
  let contentSize: ComponentSize = {
    height: innerComponentSize.height - headerSize.height - footerSize.height - px('0.625rem'),
    width: innerComponentSize.width - headerSize.width - footerSize.width,
  };

  const debugRef = useRef<boolean>(defaultDebug);

  useEffect(() => {
    if (defaultDebug !== debugRef.current) {
      setDebug(defaultDebug);
      debugRef.current = defaultDebug;
    }
  }, [defaultDebug, setDebug]);

  return (
    <>
      <Paper
        ref={innerComponentRef}
        withBorder={withBorder}
        radius={radius}
        style={{ width: width, height: height, padding: 4, ...style }}
      >
        <ArchbaseSpaceFixed height={'100%'}>
          <ArchbaseSpaceTop size={headerSize.height}>
            <div ref={headerRef}>{buildHeader(options, headerLeft, headerRight, _debug)}</div>
          </ArchbaseSpaceTop>
          <ArchbaseSpaceFill>
            <ScrollArea
              h={contentSize.height}
              sx={{ border: _debug ? '1px dashed' : '', padding: 'calc(0.625rem / 2)' }}
            >
              {children ? (
                <Fragment>
                  {isError && (
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
                  )}
                  {children}
                </Fragment>
              ) : (
                _debug && (
                  <Flex h={contentSize.height + 80} justify="center" align="center" wrap="wrap">
                    <Text size="lg">INSIRA O CONTEÚDO DO PAINEL AQUI.</Text>
                  </Flex>
                )
              )}
            </ScrollArea>
          </ArchbaseSpaceFill>
          <ArchbaseSpaceBottom size={footerSize.height}>
            <div ref={footerRef}>{buildFooter(options, footerLeft, footerRight, _debug)}</div>
          </ArchbaseSpaceBottom>
        </ArchbaseSpaceFixed>
      </Paper>
      <ArchbaseDebugInspector
        debugObjectInspectorHotKey={debugOptions && debugOptions.debugObjectInspectorHotKey}
        objectsToInspect={debugOptions && debugOptions.objectsToInspect}
      />
    </>
  );
}
