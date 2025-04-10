import React, { useState, useCallback } from 'react';
import { Modal, Stack, Group, Button, TextInput, Checkbox, Select, Box, ScrollArea } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ExportConfig, ExportFormat } from './export-data';

// Props para o modal de exportação
export interface ExportModalProps {
  opened: boolean;
  onClose: () => void;
  onExport: (config: ExportConfig) => void;
  columns: any[];
  defaultConfig?: Partial<ExportConfig>;
}

// Componente Modal para configuração de exportação com ScrollArea
export function ExportModal({
  opened,
  onClose,
  onExport,
  columns,
  defaultConfig = {}
}: ExportModalProps) {
  const { t } = useTranslation();
  const [config, setConfig] = useState<ExportConfig>({
    format: 'excel',
    filename: 'export',
    includeHeaders: true,
    delimiter: ',',
    encoding: 'utf-8',
    sheetName: 'Sheet1',
    selectedColumns: columns.map(col => col.id),
    dateFormat: 'dd/MM/yyyy',
    numberFormat: '#,##0.00',
    ...defaultConfig
  });

  const handleExport = useCallback(() => {
    onExport(config);
  }, [config, onExport]);

  const handleFormatChange = useCallback((value: string | null) => {
    if (value && (value === 'excel' || value === 'csv' || value === 'pdf')) {
      setConfig(prev => ({ ...prev, format: value as ExportFormat }));
    }
  }, []);

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={t('Exportar Dados')}
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
          <Select
            label={t('Formato de Exportação')}
            value={config.format}
            onChange={handleFormatChange}
            data={[
              { value: 'excel', label: 'Excel (.xlsx)' },
              { value: 'csv', label: 'CSV' },
              { value: 'pdf', label: 'PDF' }
            ]}
          />

          <TextInput
            label={t('Nome do Arquivo')}
            value={config.filename}
            onChange={(e) => setConfig(prev => ({ ...prev, filename: e.target.value }))}
          />

          {config.format === 'csv' && (
            <>
              <TextInput
                label={t('Delimitador')}
                value={config.delimiter}
                onChange={(e) => setConfig(prev => ({ ...prev, delimiter: e.target.value }))}
              />
              <Select
                label={t('Codificação')}
                value={config.encoding}
                onChange={(value: string | null) => setConfig(prev => ({ 
                  ...prev, 
                  encoding: value || 'utf-8' 
                }))}
                data={[
                  { value: 'utf-8', label: 'UTF-8' },
                  { value: 'ascii', label: 'ASCII' },
                  { value: 'iso-8859-1', label: 'ISO-8859-1' }
                ]}
              />
            </>
          )}

          {config.format === 'excel' && (
            <TextInput
              label={t('Nome da Planilha')}
              value={config.sheetName}
              onChange={(e) => setConfig(prev => ({ ...prev, sheetName: e.target.value }))}
            />
          )}

          <Box>
            <Checkbox
              label={t('Incluir Cabeçalhos')}
              checked={config.includeHeaders}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                includeHeaders: e.currentTarget.checked 
              }))}
            />
          </Box>

          <Box>
            <Box mb="xs">{t('Selecionar Colunas')}</Box>
            <Stack gap="xs">
              {columns.map(column => (
                <Checkbox
                  key={column.id}
                  label={column.title}
                  checked={config.selectedColumns?.includes(column.id)}
                  onChange={(e) => {
                    const checked = e.currentTarget.checked;
                    setConfig(prev => ({
                      ...prev,
                      selectedColumns: checked
                        ? [...(prev.selectedColumns || []), column.id]
                        : prev.selectedColumns?.filter(id => id !== column.id)
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
          {t('Cancelar')}
        </Button>
        <Button onClick={handleExport}>
          {t('Exportar')}
        </Button>
      </Group>
    </Modal>
  );
}