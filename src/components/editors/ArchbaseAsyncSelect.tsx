import { Loader, MantineSize, ScrollArea, ScrollAreaProps, Select } from '@mantine/core';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@components/datasource';
import React, {
  CSSProperties,
  FocusEventHandler,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { uniqueId } from 'lodash';
import { useArchbaseDidMount, useArchbaseDidUpdate } from '@components/hooks';
import { useDebouncedState } from '@mantine/hooks';
import ArchbaseAsyncSelectContext, {
  ArchbaseAsyncSelectContextValue,
  ArchbaseAsyncSelectProvider,
} from './ArchbaseAsyncSelect.context';
import { ArchbaseError } from '@components/core';

export type OptionsResult<O> = {
  options: O[];
  page: number;
  totalPages: number;
};

export interface ArchbaseAsyncSelectProps<T, ID, O> {
  allowDeselect?: boolean;
  clearable?: boolean;
  dataSource?: ArchbaseDataSource<T, ID>;
  debounceTime?: number;
  dataField?: string;
  disabled?: boolean;
  readOnly?: boolean;
  style?: CSSProperties;
  placeholder?: string;
  label?: string;
  description?: string;
  error?: string;
  searchable?: boolean;
  /** Valor de entrada controlado */
  value?: any;
  /** Valor padrão de entrada não controlado */
  defaultValue?: any;
  /** Função com base em quais itens no menu suspenso são filtrados */
  filter?(value: string, item: any): boolean;
  /** Tamanho de entrada */
  size?: MantineSize;
  /** Estado aberto do menu suspenso inicial */
  initiallyOpened?: boolean;
  /** Alterar renderizador de item */
  itemComponent?: React.FC<any>;
  /** Chamado quando o menu suspenso é aberto */
  onDropdownOpen?(): void;
  /** Chamado quando o menu suspenso é aberto */
  onDropdownClose?(): void;
  /** Limite a quantidade de itens exibidos por vez para seleção pesquisável */
  limit?: number;
  /** Rótulo nada encontrado */
  nothingFound?: React.ReactNode;
  /** Índice z dropdown */
  zIndex?: React.CSSProperties['zIndex'];
  /** Comportamento de posicionamento dropdown */
  dropdownPosition?: 'bottom' | 'top' | 'flip';
  /** Evento quando um valor é selecionado */
  onSelectValue?: (value: O) => void;
  onFocusExit?: FocusEventHandler<T> | undefined;
  onFocusEnter?: FocusEventHandler<T> | undefined;
  initialOptions?: OptionsResult<O>;
  getOptionLabel: (option: O) => string;
  getOptionValue: (option: O) => any;
  getOptions: (page: number, value: string) => Promise<OptionsResult<O>>;
  onErrorLoadOptions?: (error: string) => void;
}
function buildOptions<O>(
  initialOptions: O[],
  getOptionLabel: (option: O) => string,
  getOptionValue: (option: O) => any,
): any {
  if (!initialOptions) {
    return [];
  }
  return initialOptions.map((item: O) => {
    return { label: getOptionLabel(item), value: getOptionValue(item), origin: item, key: uniqueId('select') };
  });
}

export function ArchbaseAsyncSelect<T, ID, O>({
  allowDeselect = true,
  clearable = true,
  dataSource,
  dataField,
  disabled = false,
  debounceTime = 500,
  readOnly = false,
  placeholder,
  initialOptions = { options: [], page: 0, totalPages: 0 },
  searchable = true,
  label,
  description,
  error,
  getOptionLabel,
  getOptionValue,
  getOptions,
  onFocusEnter,
  onFocusExit,
  onSelectValue,
  value,
  defaultValue,
  filter,
  size,
  initiallyOpened,
  itemComponent,
  onDropdownOpen,
  onDropdownClose,
  limit,
  nothingFound,
  zIndex,
  dropdownPosition,
  onErrorLoadOptions,
}: ArchbaseAsyncSelectProps<T, ID, O>) {
  const [options, setOptions] = useState<any[]>(
    buildOptions<O>(initialOptions.options, getOptionLabel, getOptionValue),
  );
  const [selectedValue, setSelectedValue] = useState<any>(value);
  const [queryValue, setQueryValue] = useDebouncedState('', debounceTime);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialOptions.page);
  const [totalPages, setTotalPages] = useState(initialOptions.totalPages);
  const [_isLastPage, setIsLastPage] = useState(currentPage === totalPages - 1);
  const [originData, setOriginData] = useState(initialOptions.options);

  const loadDataSourceFieldValue = () => {
    let initialValue: any = value;

    if (dataSource && dataField) {
      initialValue = dataSource.getFieldValue(dataField);
      if (!initialValue) {
        initialValue = '';
      }
    }

    setSelectedValue(initialValue);
  };

  const fieldChangedListener = useCallback(() => {}, []);

  const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
    if (dataSource && dataField) {
      switch (event.type) {
        case (DataSourceEventNames.dataChanged,
        DataSourceEventNames.fieldChanged,
        DataSourceEventNames.recordChanged,
        DataSourceEventNames.afterScroll,
        DataSourceEventNames.afterCancel): {
          loadDataSourceFieldValue();
          break;
        }
        default:
      }
    }
  }, []);

  useArchbaseDidMount(() => {
    loadDataSourceFieldValue();
    if (dataSource && dataField) {
      dataSource.addListener(dataSourceEvent);
      dataSource.addFieldChangeListener(dataField, fieldChangedListener);
    }
  });

  useEffect(() => {
    if (queryValue && queryValue.length > 0 && queryValue != getOptionLabel(selectedValue)) {
      setLoading(true);
      loadOptions(0, false);
    }
  }, [queryValue]);

  useEffect(() => {}, [currentPage, totalPages]);

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue();
  }, []);

  const handleChange = (value) => {
    setSelectedValue((_prev) => value);

    if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== value) {
      dataSource.setFieldValue(dataField, value);
    }

    if (onSelectValue) {
      onSelectValue(value);
    }
  };

  const handleOnFocusExit = (event) => {
    if (onFocusExit) {
      onFocusExit(event);
    }
  };

  const handleOnFocusEnter = (event) => {
    if (onFocusEnter) {
      onFocusEnter(event);
    }
  };

  const handleDropdownScrollEnded = () => {
    console.log(
      'handleDropdownScrollEnded->currentPage ' +
        currentPage +
        ' queryValue: ' +
        queryValue +
        ' totalPages: ' +
        totalPages,
    );
    if (queryValue && queryValue.length > 0 && currentPage < totalPages - 1) {
      setLoading(true);
      loadOptions(currentPage + 1, true);
    }
  };

  const loadOptions = async (page: number, incremental: boolean = false) => {
    let promise = getOptions(page, queryValue);
    if (!(promise instanceof Promise)) {
      throw new ArchbaseError('getOptions deve retornar um objeto Promise<OptionsResult<?>>. ArchbaseAsyncSelect.');
    }
    promise.then(
      (data: OptionsResult<O>) => {
        setLoading(false);
        if (data === undefined || data == null) {
          if (onErrorLoadOptions) {
            onErrorLoadOptions('Reponse incorreto.');
          }
        }
        const options = incremental ? originData.concat(data.options) : data.options;
        setOriginData(options);
        setOptions(buildOptions<O>(options, getOptionLabel, getOptionValue));
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
        setIsLastPage(data.page === data.totalPages - 1);
      },
      (err) => {
        setLoading(false);
        if (onErrorLoadOptions) {
          onErrorLoadOptions(err);
        }
      },
    );
  };

  return (
    <ArchbaseAsyncSelectProvider
      value={{
        handleDropdownScrollEnded: handleDropdownScrollEnded,
      }}
    >
      <Select
        allowDeselect={allowDeselect}
        clearable={clearable}
        disabled={disabled}
        description={description}
        placeholder={placeholder}
        searchable={searchable}
        maxDropdownHeight={280}
        dropdownComponent={CustomSelectScrollArea}
        label={label}
        error={error}
        data={options}
        size={size!}
        readOnly={readOnly}
        onChange={handleChange}
        onBlur={handleOnFocusExit}
        onFocus={handleOnFocusEnter}
        value={selectedValue}
        onSearchChange={setQueryValue}
        defaultValue={defaultValue!}
        filter={filter}
        initiallyOpened={initiallyOpened}
        itemComponent={itemComponent}
        onDropdownOpen={onDropdownOpen}
        onDropdownClose={onDropdownClose}
        limit={limit}
        nothingFound={nothingFound}
        zIndex={zIndex}
        dropdownPosition={dropdownPosition}
        rightSection={loading ? <Loader size="xs" /> : null}
        rightSectionWidth={30}
      />
    </ArchbaseAsyncSelectProvider>
  );
}

export const CustomSelectScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ style, ...others }: ScrollAreaProps, _ref) => {
    const sRef = useRef<any>();
    const selectContextValue = useContext<ArchbaseAsyncSelectContextValue>(ArchbaseAsyncSelectContext);
    const handleScrollPositionChange = (_position: { x: number; y: number }): void => {
      if (sRef && sRef.current) {
        if (sRef.current.scrollTop === sRef.current.scrollHeight - sRef.current.offsetHeight) {
          selectContextValue.handleDropdownScrollEnded!();
        }
      }
    };
    return (
      <ScrollArea
        {...others}
        style={{ width: '100%', ...style }}
        viewportProps={{ tabIndex: -1 }}
        viewportRef={sRef}
        onScrollPositionChange={handleScrollPositionChange}
      >
        {others.children}
      </ScrollArea>
    );
  },
);

CustomSelectScrollArea.displayName = 'CustomSelectScrollArea';
