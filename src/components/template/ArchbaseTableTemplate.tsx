import React, { Fragment, ReactNode, useRef } from 'react';
import type { ArchbaseDataSource } from '../datasource';
import { FilterOptions } from '@components/querybuilder';
import { ArchbaseAlert } from '@components/notification';
import { IconBug } from '@tabler/icons-react';
import { t } from 'i18next';
import { ArchbaseDataTable, ToolBarActions } from '@components/datatable';
import { Button, Flex, Paper } from '@mantine/core';
import "../../styles/template.scss";


export interface UserActionsOptions {
  visible?: boolean;
  labelAdd?: string;
  labelEdit?: string;
  labelRemove?: string;
  labelView?: string;
  allowRemove?: boolean;
  onAddExecute?: () => void;
  onEditExecute?: () => void;
  onRemoveExecute?: () => void;
  onView?: () => void;
}

export interface UserRowActionsOptions<T> {
  actions?: any;
  onAddRow?: (row: T) => void;
  onEditRow?: (row: T) => void;
  onRemoveRow?: (row: T) => void;
  onViewRow?: (row: T) => void;
}

export interface ArchbaseTableTemplateProps<T, ID> {
  title: string;
  printTitle?: string;
  logoPrint?: string;
  dataSource: ArchbaseDataSource<T, ID>;
  dataSourceEdition?: ArchbaseDataSource<T, ID> | undefined;
  filterOptions?: FilterOptions;
  pageSize?: number;
  columns: ReactNode;
  filterFields?: ReactNode | undefined;
  userActions?: UserActionsOptions;
  userRowActions?: UserRowActionsOptions<T>;
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined;
  isLoading?: boolean;
  isError?: boolean;
  error?: string | undefined;
  clearError?: () => void;
  width?: number | string | undefined;
  height?: number | string | undefined;
}

export function ArchbaseTableTemplate<T extends object, ID>({
  title,
  printTitle,
  dataSource,
//  dataSourceEdition,
//  filterOptions,
  pageSize,
  columns,
//  filterFields,
  logoPrint,
  userActions,
  userRowActions,
  innerRef,
  isLoading = false,
  isError = false,
  error = '',
  clearError = () => {},
  width = '100%',
  height = '100%',
}: ArchbaseTableTemplateProps<T, ID>) {
  const innerComponentRef = innerRef || useRef<any>();

  const buildRowActions = ({ row }): ReactNode | undefined => {
    if (!userRowActions && !userRowActions!.actions) {
      return;
    }
    const Comp: any = userRowActions!.actions;
    return (
      <Comp
        onEditRow={userRowActions!.onEditRow}
        onRemoveRow={userRowActions!.onRemoveRow}
        onViewRow={userRowActions!.onViewRow}
        row={row}
      />
    );
  };

  return (
    <Paper ref={innerComponentRef} style={{ overflow: 'none', height: '100%' }}>
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
      <ArchbaseDataTable<T, ID>
        printTitle={printTitle ? printTitle : title}
        logoPrint={logoPrint}
        width={width}
        height={height}
        dataSource={dataSource}
        withColumnBorders={true}
        striped={true}
        isLoading={isLoading}
        pageSize={pageSize}
        isError={isError}
        renderRowActions={buildRowActions}
        error={<span>{error}</span>}
      >
        {columns}
        <ToolBarActions>
          <Fragment>
            <h3 className="only-print">{printTitle?printTitle:title}</h3>
            <div className="no-print">
              <Flex gap="8px" rowGap="8px">
                <Button color="green" variant="filled" onClick={()=>userActions && userActions!.onAddExecute}>
                  {t('New')}
                </Button>
                <Button color="blue" variant="filled" onClick={()=>userActions && userActions!.onEditExecute}>
                  {t('Edit')}
                </Button>
                <Button color="red" variant="filled" onClick={()=>userActions && userActions!.onEditExecute}>
                  {t('Remove')}
                </Button>
              </Flex>
            </div>
          </Fragment>
        </ToolBarActions>
      </ArchbaseDataTable>
    </Paper>
  );
}
