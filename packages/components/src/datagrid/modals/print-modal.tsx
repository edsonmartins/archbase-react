import React, { useState, useCallback } from 'react';
import { Modal, Stack, Group, Button, TextInput, Checkbox, Select, Box, ScrollArea } from '@mantine/core';
import { useArchbaseTranslation } from '@archbase/core';
import { PrintConfig } from './print-data';

// Props do modal de impressão
export interface PrintModalProps {
  opened: boolean;
  onClose: () => void;
  onPrint: (config: PrintConfig) => void;
  columns: any[];
  defaultConfig?: Partial<PrintConfig>;
}

// Componente Modal para configuração de impressão com ScrollArea
export function PrintModal({
  opened,
  onClose,
  onPrint,
  columns,
  defaultConfig = {}
}: PrintModalProps) {
  const { t } = useArchbaseTranslation();
  const [config, setConfig] = useState<PrintConfig>({
    orientation: 'landscape',
    pageSize: 'A4',
    showHeader: true,
    showFooter: true,
    showPageNumbers: true,
    showDate: true,
    selectedColumns: columns.map((col) => col.id),
    ...defaultConfig
  });

  const handlePrint = useCallback(() => {
    onPrint(config);
  }, [config, onPrint]);

  const handleOrientationChange = useCallback((value: string | null) => {
    if (value && (value === 'portrait' || value === 'landscape')) {
      setConfig((prev) => ({ ...prev, orientation: value as 'portrait' | 'landscape' }));
    }
  }, []);

  const handlePageSizeChange = useCallback((value: string | null) => {
    if (value && (value === 'A4' || value === 'A3' || value === 'Letter')) {
      setConfig((prev) => ({ ...prev, pageSize: value as 'A4' | 'A3' | 'Letter' }));
    }
  }, []);

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={`${t('Configuração de Impressão')}`} 
      size="lg"
      styles={{
        body: {
          padding: 0, // Removendo padding para o ScrollArea ocupar todo o espaço
          paddingBottom: 60 // Espaço para os botões fixos
        }
      }}
    >
      <ScrollArea.Autosize mah="70vh" p="md" offsetScrollbars>
        <Stack gap="md" pb={8}>
          <TextInput
            label={`${t('Título')}`}
            value={config.title}
            onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
          />

          <TextInput
            label={`${t('Subtítulo')}`}
            value={config.subtitle}
            onChange={(e) => setConfig((prev) => ({ ...prev, subtitle: e.target.value }))}
          />

          <Group grow>
            <Select
              label={`${t('Tamanho da Página')}`}
              value={config.pageSize}
              onChange={handlePageSizeChange}
              data={[
                { value: 'A4', label: 'A4' },
                { value: 'A3', label: 'A3' },
                { value: 'Letter', label: 'Carta' }
              ]}
            />

            <Select
              label={`${t('Orientação')}`}
              value={config.orientation}
              onChange={handleOrientationChange}
              data={[
                { value: 'portrait', label: `${t('Retrato')}` },
                { value: 'landscape', label: `${t('Paisagem')}` }
              ]}
            />
          </Group>

          <Box>
            <Box mb="xs">{`${t('Opções')}`}</Box>
            <Stack gap="xs">
              <Checkbox
                label={`${t('Mostrar Cabeçalho')}`}
                checked={config.showHeader}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, showHeader: e.currentTarget.checked }))
                }
              />
              {config.showHeader && (
                <TextInput
                  label={`${t('Texto do Cabeçalho')}`}
                  value={config.headerText}
                  onChange={(e) => setConfig((prev) => ({ ...prev, headerText: e.target.value }))}
                />
              )}

              <Checkbox
                label={`${t('Mostrar Rodapé')}`}
                checked={config.showFooter}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, showFooter: e.currentTarget.checked }))
                }
              />
              {config.showFooter && (
                <TextInput
                  label={`${t('Texto do Rodapé')}`}
                  value={config.footerText}
                  onChange={(e) => setConfig((prev) => ({ ...prev, footerText: e.target.value }))}
                />
              )}

              <Checkbox
                label={`${t('Mostrar Números das Páginas')}`}
                checked={config.showPageNumbers}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    showPageNumbers: e.currentTarget.checked
                  }))
                }
              />

              <Checkbox
                label={`${t('Mostrar Data')}`}
                checked={config.showDate}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, showDate: e.currentTarget.checked }))
                }
              />
            </Stack>
          </Box>

          <Box>
            <Box mb="xs">{`${t('Selecionar Colunas')}`}</Box>
            <Stack gap="xs">
              {columns.map((column) => (
                <Checkbox
                  key={column.id}
                  label={column.title}
                  checked={config.selectedColumns?.includes(column.id)}
                  onChange={(e) => {
                    const checked = e.currentTarget.checked;
                    setConfig((prev) => ({
                      ...prev,
                      selectedColumns: checked
                        ? [...(prev.selectedColumns || []), column.id]
                        : prev.selectedColumns?.filter((id) => id !== column.id)
                    }));
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </ScrollArea.Autosize>
      
      {/* Botões fixos na parte inferior */}
      <Group 
        justify="right" 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          borderTop: '1px solid #e0e0e0',
          background: 'white',
          marginTop: 'auto'
        }}
      >
        <Button variant="light" onClick={onClose}>
          {`${t('Cancelar')}`}
        </Button>
        <Button onClick={handlePrint}>{`${t('Imprimir')}`}</Button>
      </Group>
    </Modal>
  );
}
