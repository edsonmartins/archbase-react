// archbase-expand-button.tsx
import React, { useRef } from 'react';
import { ActionIcon } from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { GridRowId } from '@mui/x-data-grid';

/**
 * Componente que renderiza o botão de expansão para mostrar/ocultar detalhes
 */
export function ArchbaseExpandButton({ 
  rowId, 
  expanded, 
  onClick,
  buttonRef
}: { 
  rowId: GridRowId; 
  expanded: boolean; 
  onClick: (rowId: GridRowId) => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}) {
  // Criar ref interna se não for fornecida externamente
  const internalRef = useRef<HTMLButtonElement>(null);
  const ref = buttonRef || internalRef;
  
  return (
    <ActionIcon
      className="archbase-expand-button"
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onClick(rowId);
      }}
      size="md"
      color="blue"
      variant="subtle"
      aria-label={expanded ? "Recolher detalhes" : "Expandir detalhes"}
      title={expanded ? "Recolher detalhes" : "Expandir detalhes"}
      data-row-id={rowId}
    >
      {expanded ? <IconChevronDown size={18} /> : <IconChevronRight size={18} />}
    </ActionIcon>
  );
}

/**
 * Função auxiliar para criar a coluna de expansão com referências aos botões
 */
export function createExpandColumn(
  expandedRowIds: Set<GridRowId>, 
  onToggleExpand: (rowId: GridRowId) => void,
  buttonRefs?: Map<GridRowId, React.RefObject<HTMLButtonElement>>
) {
  return {
    field: 'expandColumn',
    headerName: '',
    sortable: false,
    filterable: false,
    width: 50,
    renderCell: (params: any) => {
      // Função para criar uma ref para o botão atual
      const getRef = () => {
        if (!buttonRefs) return undefined;
        
        const rowId = params.id;
        if (!buttonRefs.has(rowId)) {
          buttonRefs.set(rowId, React.createRef<HTMLButtonElement>());
        }
        
        return buttonRefs.get(rowId);
      };
      
      return (
        <ArchbaseExpandButton 
          rowId={params.id}
          expanded={expandedRowIds.has(params.id)}
          onClick={onToggleExpand}
          buttonRef={getRef()}
        />
      );
    }
  };
}
