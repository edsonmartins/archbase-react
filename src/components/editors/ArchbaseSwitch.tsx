import { MantineColor, MantineNumberSize, MantineSize, Switch } from '@mantine/core'
import type { CSSProperties, FocusEventHandler } from 'react'
import React, { useState, useCallback, useRef, useEffect } from 'react'


import type { DataSourceEvent, ArchbaseDataSource } from '../datasource'
import { DataSourceEventNames } from '../datasource'
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks'

export interface ArchbaseSwitchProps<T, ID> {
  /** Fonte de dados onde será atribuido o valor do switch */
  dataSource?: ArchbaseDataSource<T, ID>
  /** Campo onde deverá ser atribuido o valor do switch na fonte de dados */
  dataField?: string
  /** Indicador se o switch está desabilitado */
  disabled?: boolean
  /** Indicador se o switch é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean
  /** Indicador se o preenchimento do switch é obrigatório */
  required?: boolean
  /** Estilo do switch */
  style?: CSSProperties
  /** Valor quando o switch estiver true */
  trueValue?: any
  /** Valor quando o switch estiver false */
  falseValue?: any
  /** Rótulo interno quando o switch está no estado desmarcado */
  offLabel?: React.ReactNode
  /** Rótulo interno quando o switch está no estado checado */
  onLabel?: React.ReactNode
  /** Mude a cor do estado marcado de theme.colors, padrão para theme.primaryColor*/
  color?: MantineColor
  /** Valor de tamanho predefinido */
  size?: MantineSize
  /** Chave de theme.radius ou qualquer valor CSS válido para definir border-radius, "xl" por padrão */
  radius?: MantineNumberSize
  /** Ícone dentro do polegar do interruptor */
  thumbIcon?: React.ReactNode
  /** Indicador se o switch está marcado */
  isChecked?: boolean
  /** Título do switch */
  label?: string
  /** Largura do switch */
  width?: MantineNumberSize
  /** Descrição do switch */
  description?: string
  /** Último erro ocorrido no switch */
  error?: string
  /** Evento quando o foco sai do switch */
  onFocusExit?: FocusEventHandler<T> | undefined
  /** Evento quando o switch recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined
  /** Evento quando o valor do switch é alterado */
  onChangeValue?: (value: any, event: any) => void
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined
}

export function ArchbaseSwitch<T, ID>({
  dataSource,
  dataField,
  disabled = false,
  readOnly = false,
  required = false,
  style,
  trueValue = true,
  falseValue = false,
  isChecked = false,
  width,
  label,
  description,
  error,
  offLabel,
  onLabel,
  size,
  radius,
  thumbIcon,
  onFocusExit = () => {},
  onFocusEnter = () => {},
  onChangeValue = () => {},
  innerRef
}: ArchbaseSwitchProps<T, ID>) {
  const [checked, setChecked] = useState<boolean|undefined>(isChecked)
  const innerComponentRef = useRef<any>()
  const [internalError, setInternalError] = useState<string|undefined>(error);

  useEffectt(()=>{
    setInternalError(undefined)
  },[checked])

  const loadDataSourceFieldValue = () => {
    let currentChecked = checked
    if (dataSource && dataField) {
      const fieldValue = dataSource.getFieldValue(dataField)
      if (fieldValue !== null && fieldValue !== undefined) {
        currentChecked = fieldValue === trueValue
      }
    }

    setChecked(currentChecked)
  }

  const fieldChangedListener = useCallback(() => {}, [])

  const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
    if (dataSource && dataField) {
      if (
        event.type === DataSourceEventNames.dataChanged ||
        event.type === DataSourceEventNames.fieldChanged ||
        event.type === DataSourceEventNames.recordChanged ||
        event.type === DataSourceEventNames.afterScroll ||
        event.type === DataSourceEventNames.afterCancel
      ) {
        loadDataSourceFieldValue()
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

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent)
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener)
    }
  })

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue()
  }, [])

  const handleChange = (event) => {
    const changedChecked = event.target.checked
    const resultValue = changedChecked ? trueValue : falseValue

    setChecked(changedChecked)

    if (
      dataSource &&
      !dataSource.isBrowsing() &&
      dataField &&
      dataSource.getFieldValue(dataField) !== resultValue
    ) {
      dataSource.setFieldValue(dataField, resultValue)
    }

    if (onChangeValue) {
      onChangeValue(resultValue, event)
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

  const isReadOnly = () => {
    let tmpRreadOnly = readOnly
    if (dataSource && !readOnly) {
      tmpRreadOnly = dataSource.isBrowsing()
    }
    return tmpRreadOnly
  }

  return (
    <Switch
      disabled={disabled}
      readOnly={isReadOnly()}
      required={required}
      style={{ ...style, width }}
      checked={checked}
      ref={innerRef||innerComponentRef}
      value={checked ? trueValue : falseValue}
      onChange={handleChange}
      onBlur={handleOnFocusExit}
      onFocus={handleOnFocusEnter}
      offLabel={offLabel}
      onLabel={onLabel}
      description={description}
      label={label}
      labelPosition="right"
      size={size}
      radius={radius}
      thumbIcon={thumbIcon}
      error={internalError}
    />
  )
}
