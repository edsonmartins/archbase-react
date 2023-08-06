import { MantineNumberSize, MantineSize, Select, SelectItem } from '@mantine/core';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@components/datasource';
import React, { CSSProperties, FocusEventHandler, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { uniqueId } from 'lodash';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '@components/hooks';
import { useDebouncedState } from '@mantine/hooks';
import { ArchbaseSelectProvider } from './ArchbaseSelect.context';
import { CustomSelectScrollArea } from './ArchbaseAsyncSelect';

export interface ArchbaseSelectProps<T, ID, O> {
  /** Permite ou não delecionar um item */
  allowDeselect?: boolean;
  /** Indicador se permite limpar o select */
  clearable?: boolean;
  /** Fonte de dados onde será atribuido o item selecionado */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo onde deverá ser atribuido o item selecionado na fonte de dados */
  dataField?: string;
  /** Tempo de espero antes de realizar a busca */
  debounceTime?: number;
  /** Indicador se o select está desabilitado */
  disabled?: boolean;
  /** Indicador se o select é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean;
  /** Estilo do select */
  style?: CSSProperties;
  /** Texto explicativo do select */
  placeholder?: string;
  /** Título do select */
  label?: string;
  /** Descrição do select */
  description?: string;
  /** Último erro ocorrido no select */
  error?: string;
  /** Permite pesquisar no select */
  searchable?: boolean;
  /** Icon a esquerda do select */
  icon?: ReactNode;
  /** Largura do icone a esquerda do select */
  iconWidth?: MantineSize;
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
  /** Largura do select */
  width?: MantineNumberSize;
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
  /** Evento quando o foco sai do select */
  onFocusExit?: FocusEventHandler<T> | undefined;
  /** Evento quando o select recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined;
  /** Opções de seleção iniciais */
  initialOptions?: O[];
  /** Function que retorna o label de uma opção */
  getOptionLabel: (option: O) => string;
  /** Function que retorna o valor de uma opção */
  getOptionValue: (option: O) => any;
  /** Coleção de ArchbaseSelectItem[] que representam as opções do select */
  children?: ReactNode | ReactNode[];
  /** Indica se o select tem o preenchimento obrigatório */
  required?: boolean;
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement>|undefined;
  /** Selecione os dados usados ​​para renderizar itens no menu suspenso */
  data?: ReadonlyArray<string | SelectItem>;
  customGetDataSourceFieldValue?: () => any;
  customSetDataSourceFieldValue?: (value: any)=>void;
}
function buildOptions<O>(
  data?: ReadonlyArray<string | SelectItem>,
  initialOptions?: O[],
  children?: ReactNode | ReactNode[] | undefined,
  getOptionLabel?: (option: O) => string,
  getOptionValue?: (option: O) => any,
): any {
  if (!initialOptions && !children && !data) {
    return [];
  }
  if (data) {
    return data;
  }
  if (children) {
    return React.Children.toArray(children).map((item: any) => {
      return { label: item.props.label, value: item.props.value, origin: item.props.value, key: uniqueId('select') };
    });
  }
  return initialOptions!.map((item: O) => {
    return { label: getOptionLabel!(item), value: getOptionValue!(item), origin: item, key: uniqueId('select') };
  });
}

export function ArchbaseSelect<T, ID, O>({
  allowDeselect = true,
  clearable = true,
  dataSource,
  dataField,
  disabled = false,
  debounceTime = 500,
  readOnly = false,
  placeholder,
  initialOptions = [],
  searchable = true,
  label,
  description,
  error,
  icon,
  iconWidth,
  required,
  width,
  getOptionLabel,
  getOptionValue,
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
  children,
  innerRef,
  data,
  customGetDataSourceFieldValue,
  customSetDataSourceFieldValue
}: ArchbaseSelectProps<T, ID, O>) {
  const [options, _setOptions] = useState<any[]>(
    buildOptions<O>(data, initialOptions, children, getOptionLabel, getOptionValue),
  );
  const innerComponentRef = innerRef || useRef<any>();
  const [selectedValue, setSelectedValue] = useState<any>(value);
  const [queryValue, setQueryValue] = useDebouncedState('', debounceTime);

  const loadDataSourceFieldValue = () => {
    let initialValue: any = value;
    if (dataSource && dataField) {
      initialValue = customGetDataSourceFieldValue?customGetDataSourceFieldValue():dataSource.getFieldValue(dataField);
      if (!initialValue) {
        initialValue = '';
      }
    }

    setSelectedValue(initialValue);
  };

  const fieldChangedListener = useCallback(() => {}, []);

  const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
    if (dataSource && dataField) {
      if ((event.type === DataSourceEventNames.dataChanged) ||
          (event.type === DataSourceEventNames.fieldChanged) ||
          (event.type === DataSourceEventNames.recordChanged) ||
          (event.type === DataSourceEventNames.afterScroll) ||
          (event.type === DataSourceEventNames.afterCancel)) {
          loadDataSourceFieldValue();
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

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent)
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener)
    }
  })

  useEffect(() => {
    console.log(queryValue);
  }, [queryValue]);

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue();
  }, []);

  const handleChange = (value) => {
    setSelectedValue((_prev) => value);

    if (dataSource && !dataSource.isBrowsing() && dataField && (customGetDataSourceFieldValue?customGetDataSourceFieldValue():dataSource.getFieldValue(dataField)) !== value) {
      customSetDataSourceFieldValue?customSetDataSourceFieldValue(value):dataSource.setFieldValue(dataField, value);
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
    //
  };

  console.log(selectedValue)

  return (
    <ArchbaseSelectProvider
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
        ref={innerComponentRef}
        dropdownComponent={CustomSelectScrollArea}
        label={label}
        error={error}
        data={options}
        size={size!}
        icon={icon}
        width={width}
        iconWidth={iconWidth}
        readOnly={readOnly}
        required={required}
        onChange={handleChange}
        onBlur={handleOnFocusExit}
        onFocus={handleOnFocusEnter}
        value={selectedValue}
        onSearchChange={setQueryValue}
        defaultValue={selectedValue?getOptionLabel(selectedValue):defaultValue}
        searchValue={selectedValue?getOptionLabel(selectedValue):""}
        filter={filter}
        initiallyOpened={initiallyOpened}
        itemComponent={itemComponent}
        onDropdownOpen={onDropdownOpen}
        onDropdownClose={onDropdownClose}
        limit={limit}
        nothingFound={nothingFound}
        zIndex={9999}
        dropdownPosition={dropdownPosition}
      />
    </ArchbaseSelectProvider>
  );
}

ArchbaseSelect.displayName = 'ArchbaseSelect';