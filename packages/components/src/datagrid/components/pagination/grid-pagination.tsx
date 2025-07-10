import React from 'react';
import { Group, Select, Text, ActionIcon, Pagination, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { PaginationProps } from '../../types';

/**
 * Componente de paginação para o grid
 */
export const GridPagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalRecords,
  pageSizeOptions = [10, 20, 30, 50, 100],
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  showNavigationButtons = true,
  showRecordInfo = true,
  labels
}) => {
  const { t } = useTranslation();
  
  // Garantir que os valores sejam números válidos
  const safePageSize = isNaN(pageSize) || pageSize <= 0 ? 10 : pageSize;
  const safeTotalRecords = isNaN(totalRecords) || totalRecords < 0 ? 0 : totalRecords;
  const safeCurrentPage = isNaN(currentPage) || currentPage <= 0 ? 1 : currentPage;
  
  // Calcular total de páginas com proteção contra divisão por zero
  const totalPages = (() => {
    // Se pageSize for zero ou inválido, retorna 1
    if (safePageSize <= 0) return 1;
    
    // Calcula o número de páginas
    const calculatedPages = Math.ceil(safeTotalRecords / safePageSize);
    
    // Verifica se o resultado é um número finito
    if (!Number.isFinite(calculatedPages) || calculatedPages <= 0) {
      return 1; // Se não for finito ou for menor que 1, retorna 1
    }
    
    return calculatedPages;
  })();
  
  // Validar página atual
  const validatedCurrentPage = Math.max(1, Math.min(safeCurrentPage, totalPages));
  
  // Calcular range de registros exibidos com proteção contra valores inválidos
  const recordRange = (() => {
    if (safeTotalRecords === 0) {
      return { start: 0, end: 0 };
    }
    const start = Math.min((validatedCurrentPage - 1) * safePageSize + 1, safeTotalRecords);
    const end = Math.min(validatedCurrentPage * safePageSize, safeTotalRecords);
    return { start, end };
  })();

  // Handler para mudança de página
  const handlePageChange = (newPage: number) => {
    if (newPage !== validatedCurrentPage) {
      onPageChange(newPage);
    }
  };

  // Handler para mudança do tamanho da página
  const handlePageSizeChange = (value: string | null) => {
    if (!value) return;
    const newSize = parseInt(value, 10);
    if (!isNaN(newSize) && newSize > 0 && newSize !== safePageSize) {
      onPageSizeChange(newSize);
    }
  };

  return (
    <Group className="archbase-data-grid-pagination" gap="lg" justify="space-between">
      {/* Informações sobre registros */}
      {showRecordInfo && (
        <Text size="sm" color="dimmed">
          {safeTotalRecords === 0 ? (
            t('archbase:Nenhum registro')
          ) : (
            `${recordRange.start}-${recordRange.end} ${labels.of || t('archbase:de')} ${safeTotalRecords} ${labels.totalRecords || t('archbase:registros')}`
          )}
        </Text>
      )}

      <Group gap="md">
        {/* Seletor de tamanho de página */}
        {showPageSizeSelector && (
          <Group gap="xs">
            <Text size="sm" color="dimmed">{labels.pageSize || t('archbase:Registros por página')}:</Text>
            <Select
              size="xs"
              value={safePageSize.toString()}
              onChange={handlePageSizeChange}
              data={pageSizeOptions.map(size => ({
                value: size.toString(),
                label: size.toString()
              }))}
              styles={{
                input: {
                  width: '70px'
                }
              }}
            />
          </Group>
        )}

        {/* Navegação de páginas */}
        {showNavigationButtons && totalPages > 0 && (
          <Group gap={4}>
            <ActionIcon
              size="sm"
              variant="subtle"
              disabled={validatedCurrentPage === 1}
              onClick={() => handlePageChange(validatedCurrentPage - 1)}
            >
              <IconChevronLeft size={16} />
            </ActionIcon>

            <Box style={{ width: 'auto', minWidth: '150px', textAlign: 'center' }}>
              <Pagination
                value={validatedCurrentPage}
                onChange={handlePageChange}
                total={isFinite(totalPages) ? totalPages : 1}
                size="sm"
                radius="xs"
                withControls={false}
                siblings={1}
                boundaries={1}
              />
            </Box>

            <ActionIcon
              size="sm"
              variant="subtle"
              disabled={validatedCurrentPage === totalPages}
              onClick={() => handlePageChange(validatedCurrentPage + 1)}
            >
              <IconChevronRight size={16} />
            </ActionIcon>
          </Group>
        )}
      </Group>
    </Group>
  );
};

export default GridPagination;
