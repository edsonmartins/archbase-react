import {
  InputSharedProps,
  InputStylesNames,
  InputWrapperBaseProps,
  InputWrapperStylesNames,
  useInputProps,
  Input,
  DefaultProps,
  MantineSize
} from '@mantine/core'
import { useId } from '@mantine/hooks'
import React, { forwardRef } from 'react'
import { IMaskInput } from 'react-imask'
import type { ArchbaseDataSource } from '../datasource'

export enum MaskPattern {
  CNPJ = '00.000.000/0000-00',
  CEP = '00.000-000',
  CPF = '000.000.000-00',
  PLACA = 'aaa-00*00',
  PHONE = '(00) 00000-0000'
}

export type ArchbaseMaskEditStylesNames = InputStylesNames | InputWrapperStylesNames

export interface ArchbaseMaskEditProps
  extends DefaultProps<ArchbaseMaskEditStylesNames>,
    InputSharedProps,
    InputWrapperBaseProps,
    Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
  type?: React.HTMLInputTypeAttribute
  wrapperProps?: Record<string, any>
  size?: MantineSize
  __staticSelector?: string
  dataSource?: ArchbaseDataSource<any, any>
  dataField?: string
  disabled?: boolean
  readOnly?: boolean
  value?: any
  placeholder?: string
  placeholderChar?: string
  showMask?: boolean
  mask?: MaskPattern | Function | string
}

const defaultProps: Partial<ArchbaseMaskEditProps> = {
  type: 'text',
  size: 'sm',
  __staticSelector: 'ArchbaseMaskEdit',
  value: '',
  readOnly: false,
  disabled: false,
  placeholderChar: '_',
  placeholder: '',
  mask: '',
  showMask: true
}

export const ArchbaseMaskEdit = forwardRef<HTMLInputElement, ArchbaseMaskEditProps>((props, ref) => {
  const { inputProps, wrapperProps, mask, placeholderChar, placeholder, ...others } = useInputProps(
    'ArchbaseMaskEdit',
    defaultProps,
    props
  )
  const id = useId()
  return (
    <Input.Wrapper {...wrapperProps}>
      <Input<any>
        {...inputProps}
        {...others}
        ref={ref}
        component={IMaskInput}
        mask={mask}
        lazy={false}
        placeholderChar={placeholderChar}
        id={id}
        placeholder={placeholder}
      />
    </Input.Wrapper>
  )
})

ArchbaseMaskEdit.displayName = 'ArchbaseMaskEdit'
