import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames, DataSourceOptions } from 'components/datasource';

/**
 * Hook para estabilizar o comportamento da Grid e evitar chamadas duplicadas à busca,
 * além de preservar o foco em inputs durante interações.
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

  // Refs para controle de estado
  const blockUpdates = useRef<boolean>(false);
  const pendingUpdate = useRef<boolean>(false);
  const refreshInProgress = useRef<boolean>(false);
  const refreshTimestampRef = useRef<number>(0);
  const lastRefreshRequestRef = useRef<number>(0);

  // Um Map para rastrear quais eventos foram processados recentemente
  // Chave: tipo de evento, Valor: timestamp
  const processedEvents = useRef<Map<DataSourceEventNames, number>>(new Map());

  // Função debounce para atualizar os dados de forma eficiente
  const debouncedUpdateData = useRef(
    debounce(() => {
      if (blockUpdates.current) {
        pendingUpdate.current = true;
        return;
      }

      // Verificar se uma atualização já foi feita recentemente
      const now = Date.now();
      if (now - refreshTimestampRef.current < debounceTime) {
        return;
      }

      try {
        setRows(dataSource.browseRecords());
        setTotalRecords(dataSource.getGrandTotalRecords());
        setIsLoading(false);
        refreshTimestampRef.current = now;
        refreshInProgress.current = false;
      } catch (error) {
        console.error('Erro ao atualizar dados:', error);
        setIsLoading(false);
        refreshInProgress.current = false;
      }
    }, debounceTime)
  ).current;

  // Função para forçar atualização dos dados com proteção contra chamadas duplicadas
  const refreshData = () => {
    const now = Date.now();

    // Verificar se uma requisição de refresh já foi feita recentemente
    if (now - lastRefreshRequestRef.current < debounceTime || refreshInProgress.current) {
      console.log('Ignorando refresh duplicado');
      return;
    }

    lastRefreshRequestRef.current = now;
    refreshInProgress.current = true;
    setIsLoading(true);

    // Usar uma referência para rastrear este refresh especificamente
    const refreshId = now;
    const eventKey = Symbol('refreshEvent');

    // Armazenar o ID do refresh para verificação posterior
    (window as any)[eventKey] = refreshId;

    // Chamar refresh com um ID que podemos verificar
    dataSource.refreshData();

    // Limpar a referência após um tempo
    setTimeout(() => {
      delete (window as any)[eventKey];
    }, debounceTime * 2);
  };

  // Efeito para gerenciar eventos do DataSource
  useEffect(() => {
    const handleDataSourceEvent = (event: DataSourceEvent<T>) => {
      // Lista de eventos que causam atualização de dados
      const dataUpdateEvents = [
        DataSourceEventNames.refreshData,
        DataSourceEventNames.dataChanged,
        DataSourceEventNames.afterRemove,
        DataSourceEventNames.afterSave,
        DataSourceEventNames.afterAppend,
        DataSourceEventNames.afterCancel
      ];

      if (dataUpdateEvents.includes(event.type)) {
        const now = Date.now();
        const lastProcessed = processedEvents.current.get(event.type) || 0;

        // Verificar se processamos este tipo de evento recentemente
        if (now - lastProcessed < debounceTime) {
          console.log(`Ignorando evento ${DataSourceEventNames[event.type]} próximo demais ao anterior`);
          return;
        }

        // Marcar este evento como processado
        processedEvents.current.set(event.type, now);

        // Se um componente de input estiver com foco, adiar a atualização
        if (document.activeElement &&
            ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
          pendingUpdate.current = true;
          return;
        }

        // Atualizar com debounce para coalescer múltiplos eventos
        debouncedUpdateData();
      }
    };

    // Adicionar listener ao dataSource
    dataSource.addListener(handleDataSourceEvent);

    // Gerenciamento de foco para preservar experiência de usuário
    const handleFocusIn = () => {
      const activeElement = document.activeElement;
      if (activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName)) {
        blockUpdates.current = true;
      }
    };

    const handleFocusOut = () => {
      blockUpdates.current = false;

      // Aplicar atualizações pendentes após perder o foco
      if (pendingUpdate.current) {
        pendingUpdate.current = false;
        debouncedUpdateData();
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    // Limpar quando o componente for desmontado
    return () => {
      dataSource.removeListener(handleDataSourceEvent);
      debouncedUpdateData.cancel();
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [dataSource, debouncedUpdateData, debounceTime]);

  return {
    rows,
    totalRecords,
    isLoading,
    refreshData
  };
}
