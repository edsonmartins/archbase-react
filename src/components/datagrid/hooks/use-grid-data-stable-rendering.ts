import { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from 'components/datasource';

/**
 * Hook para estabilizar o comportamento da Grid e evitar perda de foco em inputs
 * ao interagir com a Grid.
 */
export function useArchbaseDataGridStableRendering<T extends object, ID>({
  dataSource,
  debounceTime = 300
}: {
  dataSource: ArchbaseDataSource<T, ID>;
  debounceTime?: number;
}) {
  // Estados para controle da grid
  const [rows, setRows] = useState<T[]>(() => dataSource.browseRecords());
  const [totalRecords, setTotalRecords] = useState<number>(() => dataSource.getGrandTotalRecords());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Ref para controlar operações em andamento e evitar loops
  const blockUpdates = useRef<boolean>(false);
  const pendingUpdate = useRef<boolean>(false);

  // Função debounce para atualizar os dados de forma eficiente
  const debouncedUpdateData = useRef(
    debounce(() => {
      if (blockUpdates.current) {
        pendingUpdate.current = true;
        return;
      }

      try {
        // Atualizar os dados
        setRows(dataSource.browseRecords());
        setTotalRecords(dataSource.getGrandTotalRecords());
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao atualizar dados:', error);
        setIsLoading(false);
      }
    }, debounceTime)
  ).current;

  // Efeito para gerenciar eventos do DataSource
  useEffect(() => {
    const handleDataSourceEvent = (event: DataSourceEvent<T>) => {
      // Eventos que causam atualização de dados
      if ([
        DataSourceEventNames.refreshData,
        DataSourceEventNames.dataChanged,
        DataSourceEventNames.afterRemove,
        DataSourceEventNames.afterSave,
        DataSourceEventNames.afterAppend,
        DataSourceEventNames.afterCancel
      ].includes(event.type)) {
        // Se um componente de input estiver com foco, adiar a atualização
        if (document.activeElement &&
            ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
          // Marcar que há uma atualização pendente
          pendingUpdate.current = true;

          // Não atualizar imediatamente para evitar perda de foco
          return;
        }

        // Caso contrário, atualizar normalmente com debounce
        debouncedUpdateData();
      }
    };

    // Adicionar listener ao dataSource
    dataSource.addListener(handleDataSourceEvent);

    // Verificar se há foco em um input e aplicar eventos de monitoramento
    const handleFocusIn = () => {
      const activeElement = document.activeElement;
      if (activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName)) {
        blockUpdates.current = true;
      }
    };

    const handleFocusOut = () => {
      blockUpdates.current = false;

      // Se houve uma atualização pendente enquanto o input estava em foco, aplicá-la agora
      if (pendingUpdate.current) {
        pendingUpdate.current = false;
        debouncedUpdateData();
      }
    };

    // Tratamento para evitar perda de foco durante digitação
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    // Limpar quando o componente for desmontado
    return () => {
      dataSource.removeListener(handleDataSourceEvent);
      debouncedUpdateData.cancel();
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [dataSource, debouncedUpdateData]);

  // Função para forçar atualização dos dados
  const refreshData = () => {
    setIsLoading(true);
    dataSource.refreshData();
  };

  return {
    rows,
    totalRecords,
    isLoading,
    refreshData
  };
}
