// ArchbaseDetailPanel.tsx
import React, { useMemo } from 'react';
import { Box, ActionIcon, Group, Title, Modal, Drawer } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { GridRowId } from '@mui/x-data-grid';

/**
 * Componente para renderizar o painel de detalhes inline (diretamente abaixo da linha na grid)
 */
export function ArchbaseDetailPanel<T extends object = any>({ 
  rowData, 
  rowId,
  renderDetailPanel,
  onClose,
  theme,
  className,
  style,
  title = 'Detalhes',
  fixed = true // Nova prop para controlar se o painel é fixo
}: { 
  rowData: T;
  rowId: GridRowId; 
  renderDetailPanel: (props: { row: T }) => React.ReactNode;
  onClose: (rowId: GridRowId) => void;
  theme: any;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  fixed?: boolean; // Se true, o painel será fixo no topo da grid
}) {
  // Memoizar o conteúdo do painel para evitar renderizações desnecessárias
  const detailContent = useMemo(() => {
    return renderDetailPanel({ row: rowData });
  }, [rowData, renderDetailPanel]);

  return (
    <Box 
      className={`detail-panel-container ${className || ''}`}
      style={{
        padding: theme.spacing.md,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        borderTop: `1px solid ${theme.colors.gray[theme.colorScheme === 'dark' ? 7 : 3]}`,
        width: '100%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        ...style
      }}
    >
      <Group justify="apart" mb="xs">
        <Title order={4} style={{ fontSize: '1rem', fontWeight: 500 }}>{title}</Title>
        <ActionIcon 
          onClick={() => onClose(rowId)} 
          size="sm" 
          color="gray"
        >
          <IconX size={16} />
        </ActionIcon>
      </Group>
      
      <Box>{/* detailContent */}</Box>
    </Box>
  );
}

/**
 * Componente para renderizar o painel de detalhes como modal
 */
export function ArchbaseDetailModal<T extends object = any>({ 
  rowId,
  rowData, 
  renderDetailPanel,
  onClose,
  theme,
  className,
  style,
  opened,
  title = 'Detalhes'
}: { 
  rowId: GridRowId;
  rowData: T;
  renderDetailPanel: (props: { row: T }) => React.ReactNode;
  onClose: (rowId: GridRowId) => void;
  theme: any;
  className?: string;
  style?: React.CSSProperties;
  opened: boolean;
  title?: string;
}) {
  // Importar Modal dinamicamente para evitar problemas se o componente não existir
  
  
  // Memoizar o conteúdo do painel para evitar renderizações desnecessárias
  const detailContent = useMemo(() => {
    return renderDetailPanel({ row: rowData });
  }, [rowData, renderDetailPanel]);
  
  return (
    <Modal
      opened={opened}
      onClose={() => onClose(rowId)}
      title={
        <Title order={4} style={{ fontSize: '1.1rem', fontWeight: 500 }}>
          {title}
        </Title>
      }
      size="80%"
      centered
    >
      <Box 
        className={`detail-panel-container ${className || ''}`}
        style={{
          padding: 0,
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
          width: '100%',
          maxHeight: '70vh',
          overflow: 'auto',
          ...style
        }}
      >
        {detailContent}
      </Box>
    </Modal>
  );
}

/**
 * Componente para renderizar o painel de detalhes como drawer (desliza da direita/esquerda)
 */
export function ArchbaseDetailDrawer<T extends object = any>({ 
  rowId,
  rowData, 
  renderDetailPanel,
  onClose,
  theme,
  className,
  style,
  opened,
  title = 'Detalhes',
  position = 'right',
  size = 'md'
}: { 
  rowId: GridRowId;
  rowData: T;
  renderDetailPanel: (props: { row: T }) => React.ReactNode;
  onClose: (rowId: GridRowId) => void;
  theme: any;
  className?: string;
  style?: React.CSSProperties;
  opened: boolean;
  title?: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: string | number;
}) {
  // Gerar o conteúdo do painel usando a função renderDetailPanel
  const detailContent = useMemo(() => {
    return renderDetailPanel({ row: rowData });
  }, [rowData, renderDetailPanel]);
    
  return (
    <Drawer
      opened={opened}
      onClose={() => onClose(rowId)}
      title={
        <Title order={4} style={{ fontSize: '1.1rem', fontWeight: 500 }}>
          {title}
        </Title>
      }
      position={position}
      size={size}
      padding="md"
      zIndex={1000} // Garantir que fique acima de outros elementos
    >
      <Box 
        className={`detail-panel-container ${className || ''}`}
        style={{
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
          width: '100%',
          height: '100%',
          overflow: 'auto',
          ...style
        }}
      >
        {detailContent}
      </Box>
    </Drawer>
  );
}
