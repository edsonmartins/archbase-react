import { ComboboxItem, ComboboxLikeRenderOptionInput, MantineSize, MantineStyleProp, Select } from '@mantine/core'
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '../datasource'
import React, {
  FocusEventHandler,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { uniqueId } from 'lodash'
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks'
import { useDebouncedState } from '@mantine/hooks'
import { ArchbaseSelectProvider } from './ArchbaseSelect.context'
import {
  ArchbaseAsyncSelectContext,
  ArchbaseAsyncSelectContextValue
} from './ArchbaseAsyncSelect.context'

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
  /** Evento quando o foco sai do select */
  onFocusExit?: FocusEventHandler<T> | undefined
  /** Evento quando o select recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined
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
}

function buildGroupOptions(
  options,
) {
  let uniqueGroups: [] = options.map(item => item.group).filter((value, index, array) => array.indexOf(value) === index);
  let newOptions: any = []
  uniqueGroups.forEach(groupName => {
    const newOption = {
      group: groupName,
      items: options.filter(item => item.group === groupName).sort((a,b) => a.label.localeCompare(b.label)).map((item) => {
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
    console.log("options")
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
    console.log("initialOptions")
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
  value,
  defaultValue,
  filter,
  size,
  initiallyOpened,
  itemComponent: ItemComponent,
  onDropdownOpen,
  onDropdownClose,
  limit,
  nothingFound,
  zIndex,
  style = {},
  dropdownPosition,
  children,
  innerRef,
  options,
  customGetDataSourceFieldValue,
  customSetDataSourceFieldValue
}: ArchbaseSelectProps<T, ID, O>) {
  const innerComponentRef = innerRef || useRef<any>()
  const [selectedValue, setSelectedValue] = useState<any>(value)
  const [queryValue, setQueryValue] = useDebouncedState('', debounceTime)
  const [internalError, setInternalError] = useState<string | undefined>(error)
  const [updateCounter, setUpdateCounter] = useState(0)
  const sRef = useRef<any>()
  const selectContextValue = useContext<ArchbaseAsyncSelectContextValue>(ArchbaseAsyncSelectContext)
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

  useEffect(() => {
    setInternalError(undefined)
  }, [selectedValue])

  const loadDataSourceFieldValue = () => {
    let initialValue: any = value
    if (dataSource && dataField && !dataSource.isEmpty()) {
      initialValue = customGetDataSourceFieldValue
        ? customGetDataSourceFieldValue()
        : dataSource.getFieldValue(dataField)
      if (!initialValue) {
        initialValue = ''
      }
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
      }
      if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
        setInternalError(event.error)
        setUpdateCounter((prevCounter) => prevCounter + 1)
      }
    }
  }, [])

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
      ;(options as ArchbaseDataSource<T, ID>).addListener(dataSourceOptionsEvent)
    }
  })

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent)
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener)
    }

    if (options && options instanceof ArchbaseDataSource) {
      ;(options as ArchbaseDataSource<T, ID>).removeListener(dataSourceOptionsEvent)
    }
  })

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue()
  }, [])

  const handleChange = (vl: string | null, option: SelectItem) => {
    const value = option.origin
    setSelectedValue((_prev) => value)

    if (
      dataSource &&
      !dataSource.isBrowsing() &&
      dataField &&
      (customGetDataSourceFieldValue
        ? customGetDataSourceFieldValue()
        : dataSource.getFieldValue(dataField)) !== value
    ) {
      customSetDataSourceFieldValue
        ? customSetDataSourceFieldValue(value)
        : dataSource.setFieldValue(dataField, value)
    }

    if (onSelectValue) {
      onSelectValue(value, option ? option.origin : undefined)
    }
  }

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

  const handleDropdownScrollEnded = () => {
    //
  }

  const handleScrollPositionChange = (_position: { x: number; y: number }): void => {
    if (sRef && sRef.current) {
      if (sRef.current.scrollTop === sRef.current.scrollHeight - sRef.current.offsetHeight) {
        selectContextValue.handleDropdownScrollEnded!()
      }
    }
  }

  const isReadOnly = () => {
    let tmpRreadOnly = readOnly
    if (dataSource && !readOnly) {
      tmpRreadOnly = dataSource.isBrowsing()
    }
    return tmpRreadOnly
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

  return (
    <ArchbaseSelectProvider
      value={{
        handleDropdownScrollEnded: handleDropdownScrollEnded
      }}
    >
      <Select
        style={style}
        allowDeselect={allowDeselect}
        clearable={clearable}
        disabled={disabled}
        description={description}
        placeholder={placeholder}
        searchable={searchable}
        maxDropdownHeight={280}
        ref={innerComponentRef}
        label={label}
        error={internalError}
        data={currentOptions}
        size={size!}
        leftSection={icon}
        width={width}
        leftSectionWidth={iconWidth}
        readOnly={isReadOnly()}
        required={required}
        onChange={handleChange}
        onBlur={handleOnFocusExit}
        onFocus={handleOnFocusEnter}
        value={selectedValue}
        onSearchChange={setQueryValue}
        defaultValue={selectedValue && (options instanceof ArchbaseDataSource) ? getOptionLabel(selectedValue) : (selectedValue ?? defaultValue)}
        searchValue={selectedValue && (options instanceof ArchbaseDataSource) ? getOptionLabel(selectedValue) : (selectedValue ?? defaultValue)}
        // filter={filter}
        defaultDropdownOpened={initiallyOpened}
        onDropdownOpen={onDropdownOpen}
        onDropdownClose={onDropdownClose}
        limit={limit}
        nothingFoundMessage={nothingFound}
        scrollAreaProps={{
          viewportProps: { tabIndex: -1 },
          viewportRef: sRef,
          onScrollPositionChange: handleScrollPositionChange
        }}
        {...renderOption}
      />
    </ArchbaseSelectProvider>
  )
}

ArchbaseSelect.displayName = 'ArchbaseSelect'
