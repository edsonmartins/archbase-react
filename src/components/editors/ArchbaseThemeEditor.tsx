import { MantineNumberSize, MantineSize, Card, ColorPicker } from '@mantine/core'
import type { CSSProperties, FocusEventHandler, ReactNode } from 'react'
import React, { useState, useCallback } from 'react'

import {
  useArchbaseDidMount,
  useArchbaseDidUpdate,
  useArchbaseWillUnmount
} from '../hooks/lifecycle'

import type { DataSourceEvent, ArchbaseDataSource } from '../datasource'
import { DataSourceEventNames } from '../datasource'

export interface ArchbaseThemeEditorProps<T, ID> {
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
  /** Icone à direita */
  icon?: ReactNode
  /** Dica para botão localizar */
  tooltipIconSearch?: String
  /** Evento ocorre quando clica no botão localizar */
  onActionSearchExecute?: () => void
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
}

export function ArchbaseThemeEditor<T, ID>({
  dataSource,
  dataField,
  value
}: ArchbaseThemeEditorProps<T, ID>) {
  const [currentValue, setCurrentValue] = useState<string>(value || '')

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

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue()
  }, [])

  // const handleChange = (event) => {
  //   event.preventDefault();
  //   const changedValue = event.target.value;

  //   event.persist();
  //   setCurrentValue((_prev) => changedValue);

  //   if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== changedValue) {
  //     dataSource.setFieldValue(dataField, changedValue);
  //   }

  //   if (onChangeValue) {
  //     onChangeValue(event, changedValue);
  //   }
  // };

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent)
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener)
    }
  })

  // const handleOnFocusExit = (event) => {
  //   if (onFocusExit) {
  //     onFocusExit(event);
  //   }
  // };

  // const handleOnFocusEnter = (event) => {
  //   if (onFocusEnter) {
  //     onFocusEnter(event);
  //   }
  // };

  // const isReadOnly = () => {
  //   let _readOnly = readOnly;
  //   if (dataSource && !readOnly) {
  //     _readOnly = dataSource.isBrowsing();
  //   }

  //   return _readOnly;
  // };

  return (
    <Card>
      <ColorPicker />
    </Card>
  )
}
