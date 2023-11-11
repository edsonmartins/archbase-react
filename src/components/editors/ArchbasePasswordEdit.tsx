import {
  ActionIcon,
  MantineNumberSize,
  MantineSize,
  PasswordInput,
  TextInput,
  Tooltip,
  Variants,
  useMantineTheme
} from '@mantine/core'
import type { CSSProperties, FocusEventHandler, ReactNode } from 'react'
import React, { useState, useCallback, useRef, useEffect } from 'react'

import {
  useArchbaseDidMount,
  useArchbaseDidUpdate,
  useArchbaseWillUnmount
} from '../hooks/lifecycle'

import type { DataSourceEvent, ArchbaseDataSource } from '../datasource'
import { DataSourceEventNames } from '../datasource'
import { useForceUpdate } from '@mantine/hooks'

export interface ArchbasePasswordEditProps<T, ID> {
  /** Fonte de dados onde será atribuido o valor do edit */
  dataSource?: ArchbaseDataSource<T, ID>
  /** Campo onde deverá ser atribuido o valor do edit na fonte de dados */
  dataField?: string
  /** Indicador se o edit está desabilitado */
  disabled?: boolean
  /** Indicador se o edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean
  /** Indicador se o preenchimento do edit é obrigatório */
  required?: boolean
  /** Valor inicial */
  value?: string
  /** Estilo do edit */
  style?: CSSProperties
  /** Tamanho do edit */
  size?: MantineSize
  /** Largura do edit */
  width?: MantineNumberSize
  /** Texto sugestão do edit */
  placeholder?: string
  /** Título do edit */
  label?: string
  /** Descrição do edit */
  description?: string
  /** Último erro ocorrido no edit */
  error?: string
  /** Evento quando o foco sai do edit */
  onFocusExit?: FocusEventHandler<T> | undefined
  /** Evento quando o edit recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined
  /** Evento quando o valor do edit é alterado */
  onChangeValue?: (value: any, event: any) => void
  onKeyDown?: (event: any) => void
  onKeyUp?: (event: any) => void
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>
}

export function ArchbasePasswordEdit<T, ID>({
  dataSource,
  dataField,
  disabled = false,
  readOnly = false,
  style,
  placeholder,
  label,
  description,
  error,
  required,
  size,
  width,
  innerRef,
  value,
  onKeyDown,
  onKeyUp,
  onFocusExit = () => {},
  onFocusEnter = () => {},
  onChangeValue = () => {},
  variant
}: ArchbasePasswordEditProps<T, ID>) {
  const [currentValue, setCurrentValue] = useState<string>(value || '')
  const innerComponentRef = useRef<any>()
  const theme = useMantineTheme()
  const [internalError, setInternalError] = useState<string|undefined>(error);
  const forceUpdate = useForceUpdate()

  useEffect(()=>{
    setInternalError(undefined)
  },[currentValue])

  useEffect(()=>{
    if (error !== internalError){
      setInternalError(error)
    }
  },[error])


  const loadDataSourceFieldValue = () => {
    let initialValue: any = currentValue

    if (dataSource && dataField) {
      initialValue = dataSource.getFieldValue(dataField)
      if (!initialValue) {
        initialValue = ''
      }
    }

    setCurrentValue(initialValue)
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
        event.type === DataSourceEventNames.afterCancel ||
        event.type === DataSourceEventNames.afterEdit
        ) {
          loadDataSourceFieldValue()
          forceUpdate()
      }

      if (event.type === DataSourceEventNames.onFieldError && event.fieldName===dataField){
        setInternalError(event.error)
      }
    }
  }, [])

  useArchbaseDidMount(() => {
    loadDataSourceFieldValue()
    if (dataSource && dataField) {
      dataSource.addListener(dataSourceEvent)
      dataSource.addFieldChangeListener(dataField, fieldChangedListener)
    }
  })

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue()
  }, [])

  const handleChange = (event) => {
    event.preventDefault()
    const changedValue = event.target.value

    event.persist()
    setCurrentValue((_prev) => changedValue)

    if (
      dataSource &&
      !dataSource.isBrowsing() &&
      dataField &&
      dataSource.getFieldValue(dataField) !== changedValue
    ) {
      dataSource.setFieldValue(dataField, changedValue)
    }

    if (onChangeValue) {
      onChangeValue(event, changedValue)
    }
  }

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent)
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener)
    }
  })

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

  const isReadOnly = () => {
    let tmpRreadOnly = readOnly
    if (dataSource && !readOnly) {
      tmpRreadOnly = dataSource.isBrowsing()
    }
    return tmpRreadOnly
  }

  return (
    <PasswordInput
      disabled={disabled}
      readOnly={isReadOnly()}
      size={size!}
      style={{
        width,
        ...style
      }}
      value={currentValue}
      ref={innerRef || innerComponentRef}
      required={required}
      onChange={handleChange}
      onBlur={handleOnFocusExit}
      onFocus={handleOnFocusEnter}
      placeholder={placeholder}
      description={description}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      label={label}
      error={internalError}
    />
  )
}
