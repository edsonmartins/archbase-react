import { Chip, MantineNumberSize, MantineSize } from '@mantine/core'
import type { CSSProperties, FocusEventHandler } from 'react'
import React, { useState, useCallback, useRef } from 'react'

import {
  useArchbaseDidMount,
  useArchbaseDidUpdate,
  useArchbaseWillUnmount
} from '../hooks/lifecycle'

import type { DataSourceEvent, ArchbaseDataSource } from '../datasource'
import { DataSourceEventNames } from '../datasource'

export interface ArchbaseChipProps<T, ID> {
  /** Fonte de dados onde será atribuido o valor do chip */
  dataSource?: ArchbaseDataSource<T, ID>
  /** Campo onde deverá ser atribuido o valor do chip na fonte de dados */
  dataField?: string
  /** Indicador se o chip está desabilitado */
  disabled?: boolean
  /** Indicador se o chip é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean
  /** Indicador se o preenchimento do chip é obrigatório */
  required?: boolean
  /** Estilo do chip */
  style?: CSSProperties
  /** Chave de theme.radius ou qualquer valor CSS válido para definir border-radius, theme.defaultRadius por padrão */
  radius?: MantineNumberSize
  /** Valor quando o chip estiver true */
  trueValue?: any
  /** Valor quando o chip estiver false */
  falseValue?: any
  /** Indicador se o chip está marcado */
  isChecked?: boolean
  /** Título do chip */
  label?: string
  /** Largura do chip */
  width?: MantineNumberSize
  /** Valor de tamanho predefinido */
  size?: MantineSize
  /** Evento quando o foco sai do chip */
  onFocusExit?: FocusEventHandler<T> | undefined
  /** Evento quando o chip recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined
  /** Evento quando o valor do chip é alterado */
  onChangeValue?: (value: any) => void
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined
}

export function ArchbaseChip<T, ID>({
  dataSource,
  dataField,
  disabled = false,
  readOnly = false,
  required = false,
  style,
  trueValue = true,
  falseValue = false,
  isChecked,
  width,
  label,
  size,
  radius,
  onFocusExit = () => {},
  onFocusEnter = () => {},
  onChangeValue = () => {},
  innerRef
}: ArchbaseChipProps<T, ID>) {
  const [checked, setChecked] = useState<boolean>(isChecked ? true : false)
  const innerComponentRef = innerRef || useRef<any>()

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

  const handleChange = (changedChecked) => {
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
      onChangeValue(resultValue)
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
    <Chip
      disabled={disabled}
      readOnly={isReadOnly()}
      required={required}
      style={{ ...style, width }}
      checked={checked}
      ref={innerComponentRef}
      value={checked ? trueValue : falseValue}
      onChange={handleChange}
      onBlur={handleOnFocusExit}
      onFocus={handleOnFocusEnter}
      size={size}
      radius={radius}
    >
      {label}
    </Chip>
  )
}
