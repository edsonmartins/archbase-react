import type { MantineDemo } from '@mantinex/demo';
import { ArchbaseCompositeFiltersUsage } from './ArchbaseCompositeFiltersUsage';
import { ArchbaseCompositeFiltersWithDataSource } from './ArchbaseCompositeFiltersWithDataSource';
import { ArchbaseColumnSelectorUsage } from './ArchbaseColumnSelectorUsage';

const compositeFiltersUsageCode = `
import { ArchbaseCompositeFilters } from '@archbase/components';

function Demo() {
  return <ArchbaseCompositeFilters />;
}
`;

export const compositeFiltersUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseCompositeFiltersUsage,
  code: compositeFiltersUsageCode,
};

const compositeFiltersWithDataSourceCode = `
import { ArchbaseCompositeFilters } from '@archbase/components';

function Demo() {
  return <ArchbaseCompositeFilters />;
}
`;

export const compositeFiltersWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseCompositeFiltersWithDataSource,
  code: compositeFiltersWithDataSourceCode,
};

// ---------------------------------------------------------------------------
// ArchbaseColumnSelector
// ---------------------------------------------------------------------------

const columnSelectorUsageCode = `
import { useState } from 'react';
import { ArchbaseColumnSelector } from '@archbase/components';

function Demo() {
  const [columns, setColumns] = useState([
    { field: 'nome', label: 'Nome', visible: true, order: 0 },
    { field: 'email', label: 'E-mail', visible: true, order: 1 },
    { field: 'cidade', label: 'Cidade', visible: false, order: 2 },
    { field: 'telefone', label: 'Telefone', visible: true, order: 3 },
    { field: 'status', label: 'Status', visible: true, order: 4 },
  ]);

  return (
    <ArchbaseColumnSelector
      columns={columns}
      onChange={setColumns}
      label="Configurar Colunas"
      showSearch
      showSelectAll
    />
  );
}
`;

export const columnSelectorUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseColumnSelectorUsage,
  code: columnSelectorUsageCode,
};
