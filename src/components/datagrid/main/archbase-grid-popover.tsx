import React, { useState, useEffect, useRef } from 'react';
import { GridRowId } from '@mui/x-data-grid';
import { Popover, HoverCard, Box, Title, ActionIcon, Group } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

/**
 * Componente para renderizar o painel de detalhes como popover quando não há espaço suficiente
 */
export function ArchbaseDetailPopover<T extends object = any>({ 
  rowId,
  rowData, 
  renderDetailPanel,
  onClose,
  theme,
  className,
  style,
  opened,
  targetRef, // Referência ao elemento alvo (botão de expandir)
  width = 'auto',
  maxHeight = 600
}: { 
  rowId: GridRowId;
  rowData: T;
  renderDetailPanel: (props: { row: T }) => React.ReactNode;
  onClose: (rowId: GridRowId) => void;
  theme: any;
  className?: string;
  style?: React.CSSProperties;
  opened: boolean;
  targetRef: React.RefObject<HTMLElement>;
  width?: number | string;
  maxHeight?: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  
  // Medir a altura do conteúdo para ajustar o popover
  useEffect(() => {
    if (contentRef.current && opened) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [opened, rowData]);
  
  // Renderizar o conteúdo do painel de detalhes
  const detailContent = renderDetailPanel({ row: rowData });
  
  return (
    <Popover
      opened={opened}
      position="bottom"
      width={width}
      shadow="md"
      withinPortal={true}
      onClose={() => onClose(rowId)}
    >
      <Popover.Target>
        {targetRef.current ? (
          <div style={{ display: 'inline-block' }}>
            {/* Esta div é necessária porque o Popover.Target precisa de um ReactNode */}
            {/* O ref real está sendo usado apenas para posicionar o popover */}
            <span ref={(node) => {
              // Isso é um hack para garantir que o popover seja ancorado no botão
              if (node && targetRef.current) {
                // Copiar posição do botão real para este elemento
                const rect = targetRef.current.getBoundingClientRect();
                node.style.position = 'absolute';
                node.style.left = `${rect.left}px`;
                node.style.top = `${rect.top}px`;
                node.style.width = `${rect.width}px`;
                node.style.height = `${rect.height}px`;
              }
            }} />
          </div>
        ) : <span />}
      </Popover.Target>
      
      <Popover.Dropdown>
        <Box 
          ref={contentRef}
          className={`detail-panel-container ${className || ''}`}
          style={{
            padding: theme.spacing.md,
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
            width: '100%',
            maxHeight: `${Math.min(contentHeight + 40, maxHeight)}px`,
            overflow: 'auto',
            ...style
          }}
        >
          <Group justify="apart" mb="xs">
            <Title order={4} style={{ fontSize: '1rem', fontWeight: 500 }}>Detalhes</Title>
            <ActionIcon 
              onClick={() => onClose(rowId)} 
              size="sm" 
              color="gray"
            >
              <IconX size={16} />
            </ActionIcon>
          </Group>
          
          <Box>{detailContent}</Box>
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
}

/**
 * Componente alternativo usando HoverCard (útil quando quiser mostrar detalhes ao passar o mouse)
 */
export function ArchbaseDetailHoverCard<T extends object = any>({ 
  rowId,
  rowData, 
  renderDetailPanel,
  onClose,
  theme,
  className,
  style,
  targetRef,
  width = 'auto'
}: { 
  rowId: GridRowId;
  rowData: T;
  renderDetailPanel: (props: { row: T }) => React.ReactNode;
  onClose: (rowId: GridRowId) => void;
  theme: any;
  className?: string;
  style?: React.CSSProperties;
  targetRef: React.RefObject<HTMLElement>;
  width?: number | string;
}) {
  // Renderizar o conteúdo do painel de detalhes
  const detailContent = renderDetailPanel({ row: rowData });
  
  return (
    <HoverCard
      position="bottom"
      width={width}
      shadow="md"
      withinPortal={true}
      onClose={() => onClose(rowId)}
    >
      <HoverCard.Target>
        {targetRef.current ? (
          <div style={{ display: 'inline-block' }}>
            <span ref={(node) => {
              if (node && targetRef.current) {
                const rect = targetRef.current.getBoundingClientRect();
                node.style.position = 'absolute';
                node.style.left = `${rect.left}px`;
                node.style.top = `${rect.top}px`;
                node.style.width = `${rect.width}px`;
                node.style.height = `${rect.height}px`;
              }
            }} />
          </div>
        ) : <span />}
      </HoverCard.Target>
      
      <HoverCard.Dropdown>
        <Box 
          className={`detail-panel-container ${className || ''}`}
          style={{
            padding: theme.spacing.md,
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
            width: '100%',
            maxHeight: '500px',
            overflow: 'auto',
            ...style
          }}
        >
          <Group justify="apart" mb="xs">
            <Title order={4} style={{ fontSize: '1rem', fontWeight: 500 }}>Detalhes</Title>
            <ActionIcon 
              onClick={() => onClose(rowId)} 
              size="sm" 
              color="gray"
            >
              <IconX size={16} />
            </ActionIcon>
          </Group>
          
          {detailContent}
        </Box>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}