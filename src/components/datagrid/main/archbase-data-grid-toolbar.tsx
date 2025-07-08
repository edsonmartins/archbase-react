import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Paper } from '@mantine/core';
import { Children, isValidElement } from 'react';
import debounce from 'lodash/debounce';
import GridToolbar from '../components/toolbar/grid-toolbar';
import GlobalSearchInput from '../components/toolbar/global-search-input';
import { ArchbaseDataGridToolbarProps } from './archbase-data-grid-types';

/**
 * Componente da barra de ferramentas da grid
 * Extraído para fora da grid para evitar problemas de foco em inputs
 */
export const ArchbaseDataGridToolbar = React.memo<ArchbaseDataGridToolbarProps>(({
  dataSource,
  filterModel,
  enableGlobalFilter = true,
  enableTopToolbarActions = true,
  allowExportData = true,
  allowPrintData = true,
  toolbarAlignment = 'right',
  toolbarLeftContent,
  renderToolbarActions,
  renderToolbarInternalActions,
  theme,
  onFilterModelChange,
  onRefresh,
  onExport,
  onPrint,
  apiRef,
  children
}) => {
  // Estado local para o filtro global para manter o valor entre re-renderizações
  const [globalFilterValue, setGlobalFilterValue] = useState(filterModel.quickFilterValues?.[0] || '');
  
  // Atualizar estado local quando o filterModel mudar
  useEffect(() => {
    setGlobalFilterValue(filterModel.quickFilterValues?.[0] || '');
  }, [filterModel.quickFilterValues]);

  // Função para aplicar o filtro global
  const applyGlobalFilter = useCallback((value: string | null) => {
    const newValue = value || '';
    setGlobalFilterValue(newValue);
    
    // Aplicar filtro no modelo
    onFilterModelChange({
      ...filterModel,
      quickFilterValues: newValue ? [newValue] : []
    });
  }, [filterModel, onFilterModelChange]);
  
  // Versão com debounce para evitar muitas chamadas durante digitação
  const debouncedApplyFilter = useMemo(() => 
    debounce((value: string | null) => applyGlobalFilter(value), 300), 
    [applyGlobalFilter]
  );
  
  // Limpar o debounce quando o componente for desmontado
  useEffect(() => {
    return () => {
      debouncedApplyFilter.cancel();
    };
  }, [debouncedApplyFilter]);
  
  // Função de refresh que também considera o filtro global
  const handleRefresh = useCallback(() => {
    // Garantir que o filtro global seja aplicado ao fazer refresh
    const currentFilter = {...filterModel};
    currentFilter.quickFilterValues = globalFilterValue ? [globalFilterValue] : [];
    
    // Primeiro atualizar o modelo de filtro
    onFilterModelChange(currentFilter);
    
    // Depois executar o refresh
    onRefresh();
  }, [onRefresh, onFilterModelChange, filterModel, globalFilterValue]);

  if (!toolbarLeftContent && !enableGlobalFilter && !enableTopToolbarActions) {
    return null;
  }
  return (
    <Paper
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 16px',
        borderBottom: `1px solid ${theme.colors.gray[theme.colorScheme === 'dark' ? 8 : 3]}`,
        borderTopLeftRadius: theme.radius.sm,
        borderTopRightRadius: theme.radius.sm
      }}
    >
      {/* Lado esquerdo da toolbar */}
      <Box style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {toolbarLeftContent}

        {/* Renderizar os children que não são do tipo Columns */}
        {Children.toArray(children).filter(
          (child) => isValidElement(child) && (child.type as any)?.componentName !== 'Columns'
        )}
      </Box>

      {/* Lado direito da toolbar (pesquisa e ações) */}
      <Box
        style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'flex-end' }}
      >
        {/* Pesquisa global à direita */}
        {enableGlobalFilter && (
          <GlobalSearchInput
            value={globalFilterValue}
            onChange={(value) => {
              setGlobalFilterValue(value || '');
              debouncedApplyFilter(value);
            }}
            onClear={() => {
              setGlobalFilterValue('');
              applyGlobalFilter(null);
            }}
          />
        )}

        {/* Botões de ação à direita */}
        {enableTopToolbarActions ? (
          <GridToolbar
            onRefresh={handleRefresh}
            onExport={onExport}
            onPrint={onPrint}
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={(value) => {
              setGlobalFilterValue(value || '');
              applyGlobalFilter(value);
            }}
            renderAdditionalActions={renderToolbarActions}
            enableGlobalFilter={false}
            allowExportData={allowExportData}
            allowPrintData={allowPrintData}
            toolbarAlignment={toolbarAlignment}
            toolbarLeftContent={null}
          />
        ) : renderToolbarInternalActions ? 
             renderToolbarInternalActions({ table: apiRef.current }) 
             : null}
      </Box>
    </Paper>
  );
});