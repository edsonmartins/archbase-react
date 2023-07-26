/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-nested-ternary */
import {
  DefaultProps,
  InputSharedProps,
  InputStylesNames,
  InputWrapperBaseProps,
  InputWrapperStylesNames,
  TextInput,
  CloseButton
} from '@mantine/core'
import type { CSSProperties, FocusEventHandler } from 'react'
import React, { useCallback, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import {
  useArchbaseDidMount,
  useArchbaseDidUpdate,
  useArchbasePrevious,
  useArchbaseWillMount,
  useArchbaseWillUnmount
} from '../hooks/lifecycle'

import type { DataSourceEvent, ArchbaseDataSource } from '../datasource'
import { DataSourceEventNames } from '../datasource'

function formatNumber(
  value,
  precision = 2,
  decimalSeparator = '.',
  thousandSeparator = ',',
  allowNegative = false,
  prefix = '',
  suffix = ''
) {
  if (precision < 0) {
    precision = 0
  }
  if (precision > 20) {
    precision = 20
  }
  if (value === null || value === undefined) {
    return {
      value: 0,
      maskedValue: ''
    }
  }
  value = String(value)
  if (value.length === 0) {
    return {
      value: 0,
      maskedValue: ''
    }
  }
  let digits = value.match(/\d/g) || ['0']
  let numberIsNegative = false
  if (allowNegative) {
    const negativeSignCount = (value.match(/-/g) || []).length
    numberIsNegative = negativeSignCount % 2 === 1
    let allDigitsAreZero = true
    for (let idx = 0; idx < digits.length; idx += 1) {
      if (digits[idx] !== '0') {
        allDigitsAreZero = false
        break
      }
    }
    if (allDigitsAreZero) {
      numberIsNegative = false
    }
  }
  while (digits.length <= precision) {
    digits.unshift('0')
  }
  if (precision > 0) {
    digits.splice(digits.length - precision, 0, '.')
  }
  digits = Number(digits.join('')).toFixed(precision).split('')
  let raw = Number(digits.join(''))
  let decimalpos = digits.length - precision - 1
  if (precision > 0) {
    digits[decimalpos] = decimalSeparator
  } else {
    decimalpos = digits.length
  }
  for (let x = decimalpos - 3; x > 0; x -= 3) {
    digits.splice(x, 0, thousandSeparator)
  }
  if (prefix.length > 0) {
    digits.unshift(prefix)
  }
  if (suffix.length > 0) {
    digits.push(suffix)
  }
  if (allowNegative && numberIsNegative) {
    digits.unshift('-')
    raw = -raw
  }
  return {
    value: raw,
    maskedValue: digits.join('').trim()
  }
}

export type ArchbaseNumberEditStylesNames = InputStylesNames | InputWrapperStylesNames

export interface ArchbaseNumberEditProps<T>
  extends DefaultProps<ArchbaseNumberEditStylesNames>,
    InputSharedProps,
    InputWrapperBaseProps,
    Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'value' | 'defaultValue' | 'onChange'>,
    React.RefAttributes<HTMLInputElement> {
  /** Determina se o valor de entrada pode ser limpo, adiciona o botão limpar à seção direita, falso por padrão */
  clearable?: boolean
  /** Adereços adicionados ao botão limpar */
  clearButtonProps?: React.ComponentPropsWithoutRef<'button'>
  dataSource?: ArchbaseDataSource<T, any>
  dataField?: string
  disabled: boolean
  readOnly: boolean
  style?: CSSProperties | undefined
  className?: string
  onFocusExit: FocusEventHandler<T> | undefined
  onFocusEnter: FocusEventHandler<T> | undefined
  onChangeValue: (maskValue: any, value: any, event: any) => void
  value: string
  decimalSeparator: string
  thousandSeparator: string
  precision: number
  allowNegative: boolean
  allowEmpty: boolean
  prefix: string
  suffix: string
  integer: boolean
}

export function ArchbaseNumberEdit<T>({
  dataSource,
  dataField,
  disabled = false,
  readOnly = false,
  style,
  className = '',
  onFocusExit = () => {},
  onFocusEnter = () => {},
  onChangeValue = () => {},
  value = '0',
  decimalSeparator = ',',
  thousandSeparator = '.',
  precision = 2,
  allowNegative = true,
  allowEmpty = false,
  clearable = true,
  prefix = '',
  suffix = '',
  integer = false,
  wrapperProps,
  clearButtonProps,
  rightSection,
  unstyled,
  classNames,
  ...others
}: ArchbaseNumberEditProps<T>) {
  const [isOpen, _setIsOpen] = useState(false)
  const [maskedValue, setMaskedValue] = useState<string>('')
  const maskedValuePrev = useArchbasePrevious(maskedValue)
  const [_currentValue, setCurrentValue] = useState<number|undefined>()
  const theInput = useRef<any>()
  const [_inputSelectionStart, setInputSelectionStart] = useState(0)
  const [inputSelectionEnd, setInputSelectionEnd] = useState(0)


  const prepareProps = () => {
    let initialValue: any = value

    if (dataSource && dataField) {
      initialValue = dataSource.getFieldValue(dataField)
      if (!initialValue) {
        initialValue = ''
      }
    }

    if (!initialValue || initialValue === null) {
      initialValue = allowEmpty ? null : ''
    } else {
      if (typeof initialValue === 'string') {
        if (thousandSeparator === '.') {
          initialValue = initialValue.replace(/\./g, '')
        }
        if (decimalSeparator !== '.') {
          initialValue = initialValue.replace(new RegExp(decimalSeparator, 'g'), '.')
        }
        initialValue = initialValue.replace(/[^0-9-.]/g, '')
        initialValue = Number.parseFloat(initialValue)
      }
      initialValue = Number(initialValue).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: precision,
        maximumFractionDigits: precision
      })
    }
    const result = formatNumber(
      initialValue,
      precision,
      decimalSeparator,
      thousandSeparator,
      allowNegative,
      prefix,
      suffix
    )
    return { maskedValue: result.maskedValue, value: result.value }
  }

  useArchbaseWillMount(() => {
    //
  })

  const fieldChangedListener = useCallback(() => {}, [])

  const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
    if (dataSource && dataField) {
      switch (event.type) {
        case (DataSourceEventNames.dataChanged,
        DataSourceEventNames.recordChanged,
        DataSourceEventNames.afterScroll,
        DataSourceEventNames.afterCancel): {
          const value = dataSource.getFieldValue(dataField)
          const result = formatNumber(
            value,
            precision,
            decimalSeparator,
            thousandSeparator,
            allowNegative,
            prefix,
            suffix
          )
          setMaskedValue(result.maskedValue)
          setCurrentValue(0)
          break
        }
        default:
      }
    }
  }, [])

  useArchbaseDidMount(() => {
    const result = prepareProps()
    setMaskedValue(result.maskedValue)
    setCurrentValue(result.value)
    if (dataSource && dataField) {
      dataSource.addListener(dataSourceEvent)
      dataSource.addFieldChangeListener(dataField, fieldChangedListener)
    }
    const input = ReactDOM.findDOMNode(theInput.current) as HTMLInputElement
    const selectionEnd = Math.min(
      input.selectionEnd ? input.selectionEnd : 0,
      input.value ? input.value.length - suffix.length : 0
    )
    const selectionStart = Math.min(input.selectionStart ? input.selectionStart : 0, selectionEnd)
    input.setSelectionRange(selectionStart, selectionEnd)
  })

  useArchbaseDidUpdate(() => {
    const input = ReactDOM.findDOMNode(theInput.current) as HTMLInputElement
    const value = theInput?.current ? input.value : ''
    const isNegative = (value.match(/-/g) || []).length % 2 === 1
    const minPos = prefix.length + (isNegative ? 1 : 0)
    let selectionEnd = Math.max(minPos, Math.min(inputSelectionEnd, value.length - suffix.length))
    let selectionStart = Math.max(minPos, Math.min(inputSelectionEnd, selectionEnd))
    const regexEscapeRegex = /[-[\]{}()*+?.,\\^$|#\s]/g
    const separatorsRegex = new RegExp(
      `${decimalSeparator.replace(regexEscapeRegex, '\\$&')}|${thousandSeparator.replace(
        regexEscapeRegex,
        '\\$&'
      )}`,
      'g'
    )
    if (maskedValue) {
      const prevValue = `${maskedValuePrev}`
      const currSeparatorCount = (maskedValue.match(separatorsRegex) || []).length
      const prevSeparatorCount = (prevValue.match(separatorsRegex) || []).length
      const adjustment = Math.max(currSeparatorCount - prevSeparatorCount, 0)

      selectionEnd += adjustment
      selectionStart += adjustment

      const baselength =
        suffix.length + prefix.length + decimalSeparator.length + Number(precision) + 1

      if (maskedValue.length === baselength) {
        selectionEnd = value.length - suffix.length
        selectionStart = selectionEnd
      }

      input.setSelectionRange(selectionStart, selectionEnd)
      setInputSelectionEnd(selectionEnd)
      setInputSelectionStart(selectionStart)
    }
  }, [isOpen])

  useArchbaseDidUpdate(() => {
    const result = prepareProps()
    setMaskedValue(result.maskedValue)
    setCurrentValue(result.value)
  }, [])

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent)
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener)
    }
  })

  const handleChange = (event) => {
    event.preventDefault()
    const { maskedValue: changedMaskedValue, value: changedValue } = formatNumber(
      event.target.value,
      precision,
      decimalSeparator,
      thousandSeparator,
      allowNegative,
      prefix,
      suffix
    )

    if (dataSource && !dataSource.isBrowsing() && dataField) {
      dataSource.setFieldValue(dataField, changedValue)
    }

    event.persist()
    setMaskedValue((_prev) => changedMaskedValue)
    setCurrentValue((_prev) => changedValue)
    if (onChangeValue) {
      onChangeValue(event, changedMaskedValue, changedValue)
    }
  }

  const handleOnFocusExit = (event) => {
    setInputSelectionEnd(0)
    setInputSelectionStart(0)
    if (onFocusExit) {
      onFocusExit(event)
    }
  }

  const handleOnFocusEnter = (event) => {
    const input = ReactDOM.findDOMNode(theInput.current) as HTMLInputElement
    const value = theInput?.current ? input.value : ''
    const selectionEnd = value.length - suffix.length
    const isNegative = (value.match(/-/g) || []).length % 2 === 1
    const selectionStart = prefix.length + (isNegative ? 1 : 0)
    event.target.setSelectionRange(selectionStart, selectionEnd)
    setInputSelectionEnd(selectionEnd)
    setInputSelectionStart(selectionStart)
  }

  const _rightSection =
    rightSection ||
    (clearable && value && !readOnly ? (
      <CloseButton
        variant="transparent"
        onMouseDown={(event) => event.preventDefault()}
        tabIndex={-1}
        onClick={() => {
          setMaskedValue((_prev) => '')
          setCurrentValue((_prev) => 0)
        }}
        unstyled={unstyled}
        {...clearButtonProps}
      />
    ) : null)

  let _readOnly = readOnly
  if (dataSource && !readOnly) {
    _readOnly = dataSource.isBrowsing()
  }

  return (
    <TextInput
      disabled={!!disabled}
      {...others}
      className={className}
      ref={theInput}
      type={'text'}
      value={maskedValue}
      rightSection={_rightSection}
      readOnly={_readOnly}
      onChange={handleChange}
      onBlur={handleOnFocusExit}
      onFocus={handleOnFocusEnter}
      onMouseUp={handleOnFocusExit}
      styles={{
        input: {
          textAlign: 'right'
        }
      }}
    />
  )
}

ArchbaseNumberEdit.defaultProps = {
  onChangeValue: ()=>{},
  value: '0',
  decimalSeparator: ',',
  thousandSeparator: '.',
  precision: 2,
  inputType: 'text',
  allowNegative: false,
  prefix: '',
  suffix: '',
  readOnly: false,
  integer: false,
  disabled: false,
  onFocusExit: () => {},
  onFocusEnter: () => {},
  allowEmpty: true
}

ArchbaseNumberEdit.displayName = 'ArchbaseNumberEdit'
