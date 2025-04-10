import React from 'react';
import { Paper } from '@mantine/core';
import GridPagination from '../components/pagination/grid-pagination';
import { ArchbaseDataGridPaginationProps } from './archbase-data-grid-types';

/**
 * Componente de paginação da grid
 * Extraído para fora da grid para melhor organização
 */
export const ArchbaseDataGridPagination = React.memo<ArchbaseDataGridPaginationProps>(({
  paginationModel,
  totalRecords,
  onPaginationModelChange,
  paginationLabels,
  bottomToolbarMinHeight,
  theme
}) => {
  // Garantir que totalRecords seja um número válido e finito
  const safeTotalRecords = Number.isFinite(totalRecords) && !isNaN(totalRecords) && totalRecords >= 0
    ? totalRecords
    : 0;

  // Garantir que o modelo de paginação tenha valores válidos
  const safePaginationModel = {
    page: Number.isFinite(paginationModel?.page) && !isNaN(paginationModel?.page) ? 
      Math.max(0, paginationModel.page) : 0,
    pageSize: Number.isFinite(paginationModel?.pageSize) && !isNaN(paginationModel?.pageSize) ? 
      Math.max(1, paginationModel.pageSize) : 10
  };

  return (
    <Paper
      style={{
        minHeight: bottomToolbarMinHeight || 'auto',
        padding: '8px 16px',
        borderTop: `1px solid ${theme.colors.gray[theme.colorScheme === 'dark' ? 8 : 3]}`,
        borderBottomLeftRadius: theme.radius.sm,
        borderBottomRightRadius: theme.radius.sm
      }}
    >
      <GridPagination
        currentPage={safePaginationModel.page + 1} // MUI é base 0, nossa API é base 1
        pageSize={safePaginationModel.pageSize === Infinity ? 1 : safePaginationModel.pageSize}
        totalRecords={safeTotalRecords}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        onPageChange={(page) => {
          const newPage = Math.max(0, page - 1); // Converter de base 1 para base 0, nunca negativo
          onPaginationModelChange({ ...safePaginationModel, page: newPage });
        }}
        onPageSizeChange={(newPageSize) => {
          const safeNewPageSize = Math.max(1, newPageSize); // Garantir no mínimo 1
          onPaginationModelChange({ ...safePaginationModel, pageSize: safeNewPageSize });
        }}
        showPageSizeSelector={true}
        showNavigationButtons={true}
        showRecordInfo={true}
        labels={paginationLabels || {}}
      />
    </Paper>
  );
});

export default ArchbaseDataGridPagination;