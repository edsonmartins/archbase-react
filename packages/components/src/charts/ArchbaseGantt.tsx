/**
 * ArchbaseGantt — wrapper para gantt-task-react com suporte a DataSource.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { Box, Input, useMantineTheme, useComputedColorScheme } from '@mantine/core';
import {
  useArchbaseDataSourceListener,
  DataSourceEvent,
  DataSourceEventNames,
} from '@archbase/data';
import type { IArchbaseDataSourceBase } from '@archbase/data';
import { get } from 'lodash';

// Re-exporta tipos úteis do gantt-task-react
export { ViewMode } from 'gantt-task-react';
export type { Task } from 'gantt-task-react';

export interface ArchbaseGanttProps<T = any, ID = any> {
  /** DataSource que fornece a coleção de tarefas */
  dataSource?: IArchbaseDataSourceBase<T>;
  /** Campo que mapeia o id da tarefa */
  idField?: string;
  /** Campo que mapeia o nome da tarefa */
  nameField?: string;
  /** Campo que mapeia a data de início */
  startDateField?: string;
  /** Campo que mapeia a data de término */
  endDateField?: string;
  /** Campo que mapeia o progresso (0-100) */
  progressField?: string;
  /** Campo que mapeia dependências (array de IDs) */
  dependenciesField?: string;
  /** Campo que mapeia o tipo ('task' | 'milestone' | 'project') */
  typeField?: string;
  /** Campo que mapeia o ID do registro pai */
  parentIdField?: string;
  /** Tarefas standalone (quando não se usa dataSource) */
  tasks?: Task[];
  /** Modo de visualização do gantt */
  viewMode?: ViewMode;
  /** Locale para formatação de datas */
  locale?: string;
  /** Largura das células da lista de tarefas */
  listCellWidth?: string;
  /** Largura de cada coluna do gantt */
  columnWidth?: number;
  /** Altura de cada linha */
  rowHeight?: number;
  /** Percentual de preenchimento da barra */
  barFill?: number;
  /** Exibe a lista de tarefas à esquerda */
  showTaskList?: boolean;
  /** Callback quando uma tarefa é alterada (data arrastada) */
  onTaskChange?: (task: T) => void;
  /** Callback quando uma tarefa é deletada */
  onTaskDelete?: (task: T) => void;
  /** Callback quando o progresso de uma tarefa é alterado */
  onProgressChange?: (task: T, progress: number) => void;
  /** Callback ao dar duplo clique em uma tarefa */
  onDoubleClick?: (task: T) => void;
  /** Callback ao clicar em uma tarefa */
  onClick?: (task: T) => void;
  /** Callback ao selecionar/deselecionar uma tarefa */
  onSelect?: (task: T, isSelected: boolean) => void;
  /** Label do componente (usado com Input.Wrapper) */
  label?: React.ReactNode;
  /** Descrição do componente (usado com Input.Wrapper) */
  description?: React.ReactNode;
  /** Somente leitura — desabilita edição por drag */
  readOnly?: boolean;
  /** Estilo inline do container */
  style?: React.CSSProperties;
  /** Classe CSS do container */
  className?: string;
  /** Largura do container */
  width?: string | number;
  /** Altura do container */
  height?: string | number;
}

/**
 * Obtém valor de um campo usando notação de ponto.
 */
function getFieldValue(record: any, field: string, defaultValue?: any): any {
  return get(record, field, defaultValue);
}

/**
 * Converte registros do DataSource para o formato Task do gantt-task-react.
 */
function recordsToTasks<T>(
  records: T[],
  idField: string,
  nameField: string,
  startDateField: string,
  endDateField: string,
  progressField: string,
  dependenciesField: string,
  typeField: string,
  parentIdField: string,
): Task[] {
  return records.map((record: any) => {
    const id = String(getFieldValue(record, idField, ''));
    const name = getFieldValue(record, nameField, '');
    const startRaw = getFieldValue(record, startDateField);
    const endRaw = getFieldValue(record, endDateField);
    const progress = getFieldValue(record, progressField, 0);
    const deps: string[] = (getFieldValue(record, dependenciesField) || []).map(String);
    const type = getFieldValue(record, typeField, 'task') as 'task' | 'milestone' | 'project';
    const parentId = getFieldValue(record, parentIdField);

    const start = startRaw instanceof Date ? startRaw : new Date(startRaw);
    const end = endRaw instanceof Date ? endRaw : new Date(endRaw);

    const task: Task = {
      id,
      name,
      start,
      end,
      progress: typeof progress === 'number' ? progress : Number(progress) || 0,
      dependencies: deps,
      type,
      project: parentId != null ? String(parentId) : undefined,
      isDisabled: false,
    };

    return task;
  });
}

/**
 * Encontra o registro original pelo id da Task.
 */
function findRecordByTaskId<T>(
  records: T[],
  taskId: string,
  idField: string,
): T | undefined {
  return records.find((r: any) => String(getFieldValue(r, idField)) === taskId);
}

function ArchbaseGanttInner<T = any, ID = any>(
  props: ArchbaseGanttProps<T, ID>,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    dataSource,
    idField = 'id',
    nameField = 'name',
    startDateField = 'startDate',
    endDateField = 'endDate',
    progressField = 'progress',
    dependenciesField = 'dependencies',
    typeField = 'type',
    parentIdField = 'parentId',
    tasks: standaloneTasks,
    viewMode = ViewMode.Day,
    locale = 'pt-BR',
    listCellWidth = '155px',
    columnWidth = 65,
    rowHeight = 50,
    barFill = 60,
    showTaskList = true,
    onTaskChange,
    onTaskDelete,
    onProgressChange,
    onDoubleClick,
    onClick,
    onSelect,
    label,
    description,
    readOnly = false,
    style,
    className,
    width,
    height,
  } = props;

  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');
  const isDark = colorScheme === 'dark';

  const [version, setVersion] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(undefined);
  const recordsRef = useRef<T[]>([]);

  // Obtém registros do DataSource
  const getRecords = useCallback((): T[] => {
    if (dataSource && dataSource.isActive() && !dataSource.isEmpty()) {
      return dataSource.browseRecords();
    }
    return [];
  }, [dataSource]);

  // Atualiza referência de registros
  useEffect(() => {
    recordsRef.current = getRecords();
  }, [getRecords, version]);

  // Listener para eventos do DataSource
  const handleDataSourceEvent = useCallback(
    (event: DataSourceEvent<T>) => {
      switch (event.type) {
        case DataSourceEventNames.dataChanged:
        case DataSourceEventNames.afterInsert:
        case DataSourceEventNames.afterRemove:
        case DataSourceEventNames.afterSave:
        case DataSourceEventNames.afterCancel:
        case DataSourceEventNames.refreshData:
          setVersion((v) => v + 1);
          break;
        case DataSourceEventNames.afterScroll: {
          const current = dataSource?.getCurrentRecord();
          if (current) {
            const id = String(getFieldValue(current, idField));
            setSelectedTaskId(id);
          }
          break;
        }
      }
    },
    [dataSource, idField],
  );

  if (dataSource) {
    useArchbaseDataSourceListener<T>({
      dataSource,
      listener: handleDataSourceEvent,
    });
  }

  // Converte registros para Tasks
  const ganttTasks: Task[] = useMemo(() => {
    if (standaloneTasks && standaloneTasks.length > 0) {
      return standaloneTasks;
    }
    const records = getRecords();
    if (records.length === 0) {
      return [];
    }
    return recordsToTasks(
      records,
      idField,
      nameField,
      startDateField,
      endDateField,
      progressField,
      dependenciesField,
      typeField,
      parentIdField,
    );
  }, [
    standaloneTasks,
    getRecords,
    version,
    idField,
    nameField,
    startDateField,
    endDateField,
    progressField,
    dependenciesField,
    typeField,
    parentIdField,
  ]);

  // Handler: data da tarefa alterada via drag
  const handleDateChange = useCallback(
    (task: Task) => {
      if (readOnly) return;
      if (dataSource) {
        const records = recordsRef.current;
        const record = findRecordByTaskId(records, task.id, idField);
        if (record && dataSource.isEditing()) {
          // Navega até o registro e atualiza os campos
          dataSource.gotoRecordByData(record);
          dataSource.setFieldValue(startDateField, task.start);
          dataSource.setFieldValue(endDateField, task.end);
        }
        if (record && onTaskChange) {
          onTaskChange(record);
        }
      } else if (onTaskChange) {
        onTaskChange(task as unknown as T);
      }
    },
    [readOnly, dataSource, idField, startDateField, endDateField, onTaskChange],
  );

  // Handler: progresso alterado via drag
  const handleProgressChange = useCallback(
    (task: Task) => {
      if (readOnly) return;
      if (dataSource) {
        const records = recordsRef.current;
        const record = findRecordByTaskId(records, task.id, idField);
        if (record && dataSource.isEditing()) {
          dataSource.gotoRecordByData(record);
          dataSource.setFieldValue(progressField, task.progress);
        }
        if (record && onProgressChange) {
          onProgressChange(record, task.progress);
        }
      } else if (onProgressChange) {
        onProgressChange(task as unknown as T, task.progress);
      }
    },
    [readOnly, dataSource, idField, progressField, onProgressChange],
  );

  // Handler: tarefa deletada
  const handleDelete = useCallback(
    (task: Task): boolean => {
      if (readOnly) return false;
      if (dataSource) {
        const records = recordsRef.current;
        const record = findRecordByTaskId(records, task.id, idField);
        if (record && onTaskDelete) {
          onTaskDelete(record);
        }
      } else if (onTaskDelete) {
        onTaskDelete(task as unknown as T);
      }
      return true;
    },
    [readOnly, dataSource, idField, onTaskDelete],
  );

  // Handler: duplo clique
  const handleDoubleClick = useCallback(
    (task: Task) => {
      if (dataSource) {
        const records = recordsRef.current;
        const record = findRecordByTaskId(records, task.id, idField);
        if (record) {
          dataSource.gotoRecordByData(record);
          if (onDoubleClick) onDoubleClick(record);
        }
      } else if (onDoubleClick) {
        onDoubleClick(task as unknown as T);
      }
    },
    [dataSource, idField, onDoubleClick],
  );

  // Handler: clique
  const handleClick = useCallback(
    (task: Task) => {
      if (dataSource) {
        const records = recordsRef.current;
        const record = findRecordByTaskId(records, task.id, idField);
        if (record) {
          dataSource.gotoRecordByData(record);
          if (onClick) onClick(record);
        }
      } else if (onClick) {
        onClick(task as unknown as T);
      }
    },
    [dataSource, idField, onClick],
  );

  // Handler: seleção
  const handleSelect = useCallback(
    (task: Task, isSelected: boolean) => {
      if (dataSource) {
        const records = recordsRef.current;
        const record = findRecordByTaskId(records, task.id, idField);
        if (record) {
          if (isSelected) {
            dataSource.gotoRecordByData(record);
          }
          if (onSelect) onSelect(record, isSelected);
        }
      } else if (onSelect) {
        onSelect(task as unknown as T, isSelected);
      }
    },
    [dataSource, idField, onSelect],
  );

  // Cores para dark mode
  const ganttColors = useMemo(() => {
    if (isDark) {
      return {
        barProgressColor: theme.colors.blue[6],
        barProgressSelectedColor: theme.colors.blue[4],
        barBackgroundColor: theme.colors.dark[4],
        barBackgroundSelectedColor: theme.colors.dark[3],
        projectProgressColor: theme.colors.teal[6],
        projectProgressSelectedColor: theme.colors.teal[4],
        projectBackgroundColor: theme.colors.dark[5],
        projectBackgroundSelectedColor: theme.colors.dark[4],
        milestoneBackgroundColor: theme.colors.orange[6],
        milestoneBackgroundSelectedColor: theme.colors.orange[4],
        arrowColor: theme.colors.gray[5],
        fontFamily: theme.fontFamily,
        todayColor: 'rgba(252, 196, 25, 0.15)',
      };
    }
    return {
      barProgressColor: theme.colors.blue[5],
      barProgressSelectedColor: theme.colors.blue[7],
      barBackgroundColor: theme.colors.gray[3],
      barBackgroundSelectedColor: theme.colors.gray[4],
      projectProgressColor: theme.colors.teal[5],
      projectProgressSelectedColor: theme.colors.teal[7],
      projectBackgroundColor: theme.colors.gray[4],
      projectBackgroundSelectedColor: theme.colors.gray[5],
      milestoneBackgroundColor: theme.colors.orange[5],
      milestoneBackgroundSelectedColor: theme.colors.orange[7],
      arrowColor: theme.colors.gray[6],
      fontFamily: theme.fontFamily,
      todayColor: 'rgba(252, 196, 25, 0.2)',
    };
  }, [isDark, theme]);

  // Se não houver tarefas, mostra mensagem ou vazio
  if (ganttTasks.length === 0) {
    const emptyContent = (
      <Box
        ref={ref}
        className={className}
        style={{
          width: width ?? '100%',
          height: height ?? 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDark ? theme.colors.dark[2] : theme.colors.gray[5],
          ...style,
        }}
      >
        Nenhuma tarefa para exibir
      </Box>
    );

    if (label || description) {
      return (
        <Input.Wrapper label={label} description={description}>
          {emptyContent}
        </Input.Wrapper>
      );
    }
    return emptyContent;
  }

  const ganttElement = (
    <Box
      ref={ref}
      className={className}
      style={{
        width: width ?? '100%',
        height: height ?? 'auto',
        overflow: 'auto',
        ...style,
      }}
    >
      <Gantt
        tasks={ganttTasks}
        viewMode={viewMode}
        locale={locale}
        listCellWidth={showTaskList ? listCellWidth : ''}
        columnWidth={columnWidth}
        rowHeight={rowHeight}
        barFill={barFill}
        onDateChange={readOnly ? undefined : handleDateChange}
        onProgressChange={readOnly ? undefined : handleProgressChange}
        onDelete={readOnly ? undefined : handleDelete}
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
        onSelect={handleSelect}
        {...ganttColors}
      />
    </Box>
  );

  if (label || description) {
    return (
      <Input.Wrapper label={label} description={description}>
        {ganttElement}
      </Input.Wrapper>
    );
  }

  return ganttElement;
}

export const ArchbaseGantt = React.forwardRef(ArchbaseGanttInner) as <T = any, ID = any>(
  props: ArchbaseGanttProps<T, ID> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

(ArchbaseGantt as any).displayName = 'ArchbaseGantt';
