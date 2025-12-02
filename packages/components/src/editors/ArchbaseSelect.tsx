import { ComboboxItem, ComboboxLikeRenderOptionInput, CSSProperties, MantineSize, MantineStyleProp, MantineTheme, Select, SelectProps, SelectStylesNames } from '@mantine/core'
import { useDebouncedState, useUncontrolled } from '@mantine/hooks'
import { uniqueId } from 'lodash'
import React, {
  FocusEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@archbase/data'
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '@archbase/data'
import { useArchbaseV1V2Compatibility } from '@archbase/data'
import { useForceUpdate } from '@mantine/hooks'
import { useValidationErrors } from '@archbase/core'


export interface SelectItem extends ComboboxItem {
  selected?: boolean
  group?: string
  [key: string]: any
}

export interface ArchbaseSelectProps<T, ID, O> {
  /** Permite ou não delecionar um item */
  allowDeselect?: boolean
  /** Indicador se permite limpar o select */
  clearable?: boolean
  /** Fonte de dados onde será atribuido o item selecionado */
  dataSource?: ArchbaseDataSource<T, ID>
  /** Campo onde deverá ser atribuido o item selecionado na fonte de dados */
  dataField?: string
  /** Tempo de espero antes de realizar a busca */
  debounceTime?: number
  /** Indicador se o select está desabilitado */
  disabled?: boolean
  /** Indicador se o select é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean
  /** Estilo do select */
  style?: MantineStyleProp
  /** Texto explicativo do select */
  placeholder?: string
  /** Título do select */
  label?: string
  /** Descrição do select */
  description?: string
  /** Último erro ocorrido no select */
  error?: string
  /** Permite pesquisar no select */
  searchable?: boolean
  /** Icon a esquerda do select */
  icon?: ReactNode
  /** Largura do icone a esquerda do select */
  iconWidth?: MantineSize
  /** Valor de entrada controlado */
  value?: any
  /** Valor padrão de entrada não controlado */
  defaultValue?: any
  /** Função com base em quais itens no menu suspenso são filtrados */
  filter?(value: string, item: any): boolean
  /** Tamanho de entrada */
  size?: MantineSize
  /** Estado aberto do menu suspenso inicial */
  initiallyOpened?: boolean
  /** Alterar renderizador de item */
  itemComponent?: React.FC<any>
  /** Largura do select */
  width?: string | number
  /** Estado do dropdown controlado*/
  dropdownOpened?: boolean;
  /** Chamado quando o menu suspenso é aberto */
  onDropdownOpen?(): void
  /** Chamado quando o menu suspenso é aberto */
  onDropdownClose?(): void
  /** Limite a quantidade de itens exibidos por vez para seleção pesquisável */
  limit?: number
  /** Rótulo nada encontrado */
  nothingFound?: React.ReactNode
  /** Índice z dropdown */
  zIndex?: React.CSSProperties['zIndex']
  /** Comportamento de posicionamento dropdown */
  dropdownPosition?: 'bottom' | 'top' | 'flip'
  /** Evento quando um valor é selecionado */
  onSelectValue?: (value: O, origin: any) => void
  /** Evento de click */
  onClick?: React.MouseEventHandler<HTMLInputElement>
  /** Evento quando o foco sai do select */
  onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Evento quando o select recebe o foco */
  onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Opções de seleção iniciais */
  initialOptions?: O[]
  /** Function que retorna o label de uma opção */
  getOptionLabel: (option: O) => string
  /** Function que retorna o valor de uma opção */
  getOptionValue: (option: O) => string
  /** Coleção de ArchbaseSelectItem[] que representam as opções do select */
  children?: ReactNode | ReactNode[]
  /** Indica se o select tem o preenchimento obrigatório */
  required?: boolean
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined
  /** Selecione os dados usados ​​para renderizar itens no menu suspenso */
  options?: ReadonlyArray<string | SelectItem> | ArchbaseDataSource<any, any>
  optionsLabelField?: string
  customGetDataSourceFieldValue?: () => any
  customSetDataSourceFieldValue?: (value: any) => void
  classNames?: Partial<Record<SelectStylesNames, string>> | ((theme: MantineTheme, props: SelectProps, ctx: unknown) => Partial<Record<SelectStylesNames, string>>)
  styles?: Partial<Record<SelectStylesNames, CSSProperties>> | ((theme: MantineTheme, props: SelectProps, ctx: unknown) => Partial<Record<SelectStylesNames, CSSProperties>>)
  /** Converte o valor antes de atribuir ao field do registro atual no datasource
   * Por exemplo: (obj) => obj.id para armazenar apenas o ID de um objeto
   */
  converter?: (value: O) => any
  /** Function que busca o valor original antes de converter pelo valor de retorno do converter
   * Por exemplo: (id) => fetchObjectById(id) para converter ID de volta ao objeto
   */
  getConvertedOption?: (value: any) => Promise<O>
}

function buildGroupOptions(
  options,
) {
  let uniqueGroups: [] = options.map(item => item.group).filter((value, index, array) => array.indexOf(value) === index);
  let newOptions: any = []
  uniqueGroups.forEach(groupName => {
    const newOption = {
      group: groupName,
      items: options.filter(item => item.group === groupName).sort((a, b) => a.label.localeCompare(b.label)).map((item) => {
        return {
          value: item.value,
          label: item.label,
          origin: item.origin !== undefined ? item.origin : item.value
        }
      })
    }
    newOptions.push(newOption)
  })
  return newOptions
}

function buildOptions<O>(
  options?: ReadonlyArray<string | SelectItem> | ArchbaseDataSource<any, any>,
  initialOptions?: O[],
  children?: ReactNode | ReactNode[] | undefined,
  getOptionLabel?: (option: O) => string,
  getOptionValue?: (option: O) => any,
  optionsLabelField?: string
): any {
  if (!initialOptions && !children && !options) {
    return []
  }
  if (
    options &&
    options instanceof ArchbaseDataSource &&
    getOptionLabel &&
    getOptionValue &&
    optionsLabelField
  ) {
    const ds = options as ArchbaseDataSource<any, any>
    ds.first()
    const result: SelectItem[] = []
    while (!ds.isEOF()) {
      result.push({
        label: ds.getFieldValue(optionsLabelField),
        value: getOptionValue!(ds.getCurrentRecord()),
        origin: ds.getCurrentRecord(),
        key: uniqueId('select')
      })
      ds.next()
    }
    ds.first()
    return result
  }
  if (options && Array.isArray(options) && options.length > 0 && options[0].group) {
    return buildGroupOptions(options)
  }
  if (options) {
    return options
  }
  if (children) {
    return React.Children.toArray(children).map((item: any) => {
      const { label, value, origin, ...others } = item.props
      return {
        label: label,
        value: value,
        origin: origin !== undefined ? origin : value,
        key: uniqueId('select'),
        ...others
      }
    })
  }
  return initialOptions!.map((item: O) => {
    return {
      label: getOptionLabel!(item),
      value: getOptionValue!(item),
      origin: item,
      key: uniqueId('select')
    }
  })
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
  searchable = false,
  label,
  description,
  error,
  icon,
  iconWidth,
  required,
  width,
  getOptionLabel,
  getOptionValue,
  optionsLabelField,
  onFocusEnter,
  onFocusExit,
  onSelectValue,
  onClick,
  value,
  defaultValue,
  filter,
  size,
  initiallyOpened,
  itemComponent: ItemComponent,
  dropdownOpened,
  onDropdownOpen,
  onDropdownClose,
  limit = Infinity,
  nothingFound,
  zIndex,
  style = {},
  dropdownPosition,
  children,
  innerRef,
  options,
  customGetDataSourceFieldValue,
  customSetDataSourceFieldValue,
  classNames,
  styles,
  converter,
  getConvertedOption
}: ArchbaseSelectProps<T, ID, O>) {
  const forceUpdate = useForceUpdate();

  // 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
  const v1v2Compatibility = useArchbaseV1V2Compatibility<any>(
    'ArchbaseSelect',
    dataSource,
    dataField,
    null
  );

  // 🔄 MIGRAÇÃO V1/V2: Debug info para desenvolvimento
  if (process.env.NODE_ENV === 'development' && dataSource) {
  }

  const innerComponentRef = useRef<any>(null)
  const [selectedValue, setSelectedValue] = useState<any>(value)
  const [queryValue, setQueryValue] = useDebouncedState('', debounceTime)
  const [internalError, setInternalError] = useState<string | undefined>(error)
  const [updateCounter, setUpdateCounter] = useState(0)
  const sRef = useRef<any>(null)
  const [currentLimit, setCurrentLimit] = useState(limit);

  // Contexto de validação (opcional - pode não existir)
  const validationContext = useValidationErrors();

  // Chave única para o field
  const fieldKey = `${dataField}`;

  // Recuperar erro do contexto se existir
  const contextError = validationContext?.getError(fieldKey);

  const currentOptions: any[] = useMemo(() => {
    return buildOptions<O>(
      options,
      initialOptions,
      children,
      getOptionLabel,
      getOptionValue,
      optionsLabelField
    )
  }, [
    updateCounter,
    options,
    initialOptions,
    children,
    getOptionLabel,
    getOptionValue,
    optionsLabelField
  ])

  const handleConverter = (value) => {
    if (converter && value) {
      return converter(value)
    }
    return value
  }

  const handleChange = (vl: string | null, option: SelectItem) => {
    const value = option && option.origin ? option.origin : vl;

    // ✅ Limpa erro quando usuário edita o campo (tanto do estado local quanto do contexto)
    const hasError = internalError || contextError;
    if (hasError) {
      setInternalError(undefined);
      validationContext?.clearError(fieldKey);
    }

    setSelectedValue((_prev) => value);

    // 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
    if (dataSource && dataField) {
      const convertedValue = handleConverter(value);
      if (customSetDataSourceFieldValue) {
        customSetDataSourceFieldValue(convertedValue);
      } else {
        v1v2Compatibility.handleValueChange(convertedValue);
      }
    }

    if (onSelectValue) {
      onSelectValue(value, option ? option.origin : undefined);
    }
  };

  const handleOnFocusExit = (event) => {
    if (onFocusExit) {
      onFocusExit(event)
    }
  }

  const handleOnFocusEnter = (event) => {
    if (onFocusEnter) {
      onFocusEnter(event)
    }
  }

  const handleScrollPositionChange = (_position: { x: number; y: number }): void => {
    if (sRef && sRef.current) {
      if (sRef.current.scrollTop === sRef.current.scrollHeight - sRef.current.offsetHeight) {
        if (limit !== Infinity) {
          setCurrentLimit(prevLimit => prevLimit + limit);
        }
      }
    }
  }

  const handleItemComponent = ({ option, checked }) => {
    if (!ItemComponent) {
      return undefined
    }
    return <ItemComponent {...option} checked={checked} />
  }

  const renderOption = ItemComponent
    ? {
      renderOption: ({ option, checked }: ComboboxLikeRenderOptionInput<ComboboxItem>) =>
        handleItemComponent({ option, checked })
    }
    : {}

  // ❌ REMOVIDO: Não limpar erro automaticamente quando valor muda
  // O erro deve ser limpo apenas quando o usuário EDITA o campo (no handleChange)
  // useEffect(() => {
  //   setInternalError(undefined)
  // }, [selectedValue])

  // ✅ CORRIGIDO: Apenas atualizar se o prop error vier definido
  // Não limpar o internalError se o prop error for undefined
  useEffect(() => {
    if (error !== undefined && error !== internalError) {
      setInternalError(error);
    }
  }, [error]);

  const loadDataSourceFieldValue = async () => {
    let initialValue: any = value
    if (dataSource && dataField && !dataSource.isEmpty()) {
      initialValue = customGetDataSourceFieldValue
        ? customGetDataSourceFieldValue()
        : dataSource.getFieldValue(dataField)
      if (!initialValue) {
        initialValue = ''
      }
    }

    if (getConvertedOption && converter && initialValue) {
      initialValue = await getConvertedOption(initialValue)
    }

    setSelectedValue(initialValue)
  }

  const fieldChangedListener = useCallback(() => {
    loadDataSourceFieldValue()
  }, [])

  const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
    if (dataSource && dataField) {
      if (
        event.type === DataSourceEventNames.dataChanged ||
        event.type === DataSourceEventNames.recordChanged ||
        event.type === DataSourceEventNames.afterScroll ||
        event.type === DataSourceEventNames.afterCancel
      ) {
        loadDataSourceFieldValue()
        // 🔄 MIGRAÇÃO V1/V2: forceUpdate apenas para V1
        if (!v1v2Compatibility.isDataSourceV2) {
          forceUpdate();
        }
      }
      if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
        setInternalError(event.error)
        // Salvar no contexto (se disponível)
        validationContext?.setError(fieldKey, event.error);
        setUpdateCounter((prevCounter) => prevCounter + 1)
        // Força re-render para garantir que o erro seja exibido
        if (!v1v2Compatibility.isDataSourceV2) {
          forceUpdate();
        }
      }
    }
  }, [v1v2Compatibility.isDataSourceV2, dataSource, dataField, loadDataSourceFieldValue, forceUpdate, validationContext, fieldKey])

  const dataSourceOptionsEvent = useCallback((event: DataSourceEvent<T>) => {
    if (dataSource && dataField) {
      if (event.type === DataSourceEventNames.dataChanged) {
        setUpdateCounter((prevCounter) => prevCounter + 1)
      }
    }
  }, [])

  useArchbaseDidMount(() => {
    loadDataSourceFieldValue()
    if (dataSource && dataField) {
      dataSource.addListener(dataSourceEvent)
      dataSource.addFieldChangeListener(dataField, fieldChangedListener)
    }

    if (options && options instanceof ArchbaseDataSource) {
      ; (options as ArchbaseDataSource<T, ID>).addListener(dataSourceOptionsEvent)
    }
  })

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent)
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener)
    }

    if (options && options instanceof ArchbaseDataSource) {
      ; (options as ArchbaseDataSource<T, ID>).removeListener(dataSourceOptionsEvent)
    }
  })

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue()
  }, [])

  const isReadOnly = () => {
    // 🔄 MIGRAÇÃO V1/V2: Usar padrão de compatibilidade para isReadOnly
    return readOnly || v1v2Compatibility.isReadOnly;
  };

  // Erro a ser exibido: local ou do contexto
  const displayError = internalError || contextError;

  return (
    <Select
      classNames={classNames}
      style={style}
      styles={styles}
      allowDeselect={allowDeselect}
      clearable={clearable}
      disabled={disabled}
      description={description}
      placeholder={placeholder}
      searchable={searchable}
      maxDropdownHeight={280}
      ref={innerRef || innerComponentRef}
      label={label}
      error={displayError}
      data={currentOptions}
      size={size!}
      leftSection={icon}
      width={width}
      leftSectionWidth={iconWidth}
      readOnly={isReadOnly()}
      required={required}
      onChange={(value, option) => handleChange(value, option as SelectItem)}
      onClick={onClick}
      onBlur={handleOnFocusExit}
      onFocus={handleOnFocusEnter}
      value={selectedValue !== undefined ? selectedValue : null}
      onSearchChange={setQueryValue}
      searchValue={selectedValue && getOptionLabel ? getOptionLabel(selectedValue) : queryValue}
      defaultValue={selectedValue && getOptionLabel ? getOptionLabel(selectedValue) : defaultValue || ''}
      // filter={filter}
      defaultDropdownOpened={initiallyOpened}
      dropdownOpened={dropdownOpened}
      onDropdownOpen={onDropdownOpen}
      onDropdownClose={onDropdownClose}
      limit={currentLimit}
      nothingFoundMessage={nothingFound}
      scrollAreaProps={{
        viewportProps: { tabIndex: -1 },
        viewportRef: sRef,
        onScrollPositionChange: handleScrollPositionChange
      }}
      {...renderOption}
    />
  )
}

ArchbaseSelect.displayName = 'ArchbaseSelect'
