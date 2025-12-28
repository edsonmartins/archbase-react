import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Paper } from '@mantine/core';
import { Children, isValidElement } from 'react';
import debounce from 'lodash/debounce';
import GridToolbar from '../components/toolbar/grid-toolbar';
import GlobalSearchInput from '../components/toolbar/global-search-input';
import { ArchbaseCompositeFilters } from '../../filters';
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
  children,
  // Props para ArchbaseCompositeFilters
  useCompositeFilters = false,
  filterDefinitions,
  activeFilters,
  onFiltersChange,
  hideMuiFilters = false,
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
    console.log('[Toolbar] applyGlobalFilter chamado com:', value, '-> newValue:', newValue);
    setGlobalFilterValue(newValue);

    const newFilterModel = {
      ...filterModel,
      quickFilterValues: newValue ? [newValue] : []
    };
    console.log('[Toolbar] Chamando onFilterModelChange com:', newFilterModel);
    // Aplicar filtro no modelo
    onFilterModelChange(newFilterModel);
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
  
  // Função de refresh - apenas executa o refresh mantendo o estado atual
  // Não deve chamar onFilterModelChange pois isso resetaria a página para 0
  // O grid já considera o filtro atual no seu próprio handleRefresh
  const handleRefresh = useCallback(() => {
    console.log('[Toolbar] handleRefresh chamado - executando apenas onRefresh');
    onRefresh();
  }, [onRefresh]);

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
        {/* ArchbaseCompositeFilters ou Pesquisa global */}
        {useCompositeFilters && filterDefinitions ? (
          <ArchbaseCompositeFilters
            filters={filterDefinitions}
            value={activeFilters}
            onChange={onFiltersChange}
            variant="compact"
            enablePresets={true}
            enableHistory={true}
            enableQuickFilters={true}
          />
        ) : !hideMuiFilters && enableGlobalFilter ? (
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
        ) : null}

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
