import React, { useState } from 'react';
import { Group, ActionIcon, Tooltip, Menu } from '@mantine/core';
import { IconRefresh, IconDownload, IconPrinter, IconSearch } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useArchbaseTheme } from '@archbase/core';


interface GridToolbarProps {
  onRefresh: () => void;
  onExport: () => void;
  onPrint: () => void;
  globalFilterValue: string;
  onGlobalFilterChange: (value: string) => void;
  renderAdditionalActions?: () => React.ReactNode;
  enableGlobalFilter?: boolean;
  allowExportData?: boolean;
  allowPrintData?: boolean;
  toolbarAlignment?: 'left' | 'right' | 'center';
  toolbarLeftContent?: React.ReactNode;
}

/**
 * Componente para a barra de ferramentas do grid
 */
export const GridToolbar: React.FC<GridToolbarProps> = ({
  onRefresh,
  onExport,
  onPrint,
  globalFilterValue,
  onGlobalFilterChange,
  renderAdditionalActions,
  enableGlobalFilter = true,
  allowExportData = true,
  allowPrintData = true,
  toolbarAlignment = 'right', // Mantido como 'right' por padrão
  toolbarLeftContent
}) => {
  const { t } = useTranslation();
  const theme = useArchbaseTheme();
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Limpar o filtro global
  const handleClearGlobalFilter = () => {
    onGlobalFilterChange('');
  };

  // Botões de ação
  const renderActionButtons = () => (
    <Group gap="2">
      <Tooltip label={t('Atualizar')}>
        <ActionIcon
          size="lg"
          onClick={onRefresh}
          color={theme.primaryColor}
          variant="filled"
        >
          <IconRefresh size={20} />
        </ActionIcon>
      </Tooltip>

      {allowExportData && (
        <Menu opened={showExportMenu} onChange={setShowExportMenu}>
          <Menu.Target>
            <Tooltip label={t('Exportar')}>
              <ActionIcon
                size="lg"
                color={theme.primaryColor}
                variant="filled"
              >
                <IconDownload size={20} />
              </ActionIcon>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={onExport}>{t('Exportar')}</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}

      {allowPrintData && (
        <Tooltip label={t('Imprimir')}>
          <ActionIcon
            size="lg"
            onClick={onPrint}
            color={theme.primaryColor}
            variant="filled"
          >
            <IconPrinter size={20} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );

  return (
    <Group gap="md">
      {/* Renderizamos os botões independentemente do alinhamento */}
      {renderActionButtons()}

      {/* Ações customizadas */}
      {renderAdditionalActions && renderAdditionalActions()}
    </Group>
  );
};

export default GridToolbar;
