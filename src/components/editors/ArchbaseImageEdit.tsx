import { ImageProps, Input, MantineNumberSize } from '@mantine/core'
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '../datasource'
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import { isBase64 } from '../core'
import { ArchbaseImagePickerEditor } from '../image'
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks'
import { useForceUpdate } from '@mantine/hooks'

export interface ArchbaseImageEditProps<T, ID> extends ImageProps {
  /** Fonte de dados onde será atribuido o valor do rich edit*/
  dataSource?: ArchbaseDataSource<T, ID>
  /** Campo onde deverá ser atribuido o valor do rich edit na fonte de dados */
  dataField?: string
  /** Indicador se o rich edit está desabilitado */
  disabled?: boolean
  /** Indicador se o rich edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean
  /** Indicador se o preenchimento do rich edit é obrigatório */
  required?: boolean
  /** Estilo do checkbox */
  style?: CSSProperties
  /** Texto sugestão do rich edit */
  placeholder?: string
  /** Título do rich edit */
  label?: string
  /** Descrição do rich edit */
  description?: string
  /** Último erro ocorrido no rich edit */
  error?: string
  variant?: string
  /** Image src */
  src?: string | null
  /** Texto alternativo da imagem, usado como título para espaço reservado se a imagem não foi carregada */
  alt?: string
  /** Largura da imagem, padrão de 100%, não pode exceder 100% */
  width?: number | string
  /** Altura da imagem, o padrão é a altura da imagem original ajustada para determinada largura */
  height?: number | string
  /** Chave de theme.radius ou qualquer valor CSS válido para definir border-radius, 0 por padrão */
  radius?: MantineNumberSize
  /** Ativar espaço reservado quando a imagem está carregando e quando a imagem falha ao carregar */
  withPlaceholder?: boolean
  /** Obter ref do elemento de imagem */
  imageRef?: React.ForwardedRef<HTMLImageElement>
  /** Legenda da imagem, exibida abaixo da imagem */
  caption?: React.ReactNode
  aspectRatio?: number | null
  objectFit?: "cover" | "contain" | "fill" | "revert" | "scale-down"
  compressInitial?: number | undefined | null
  onChangeImage?: (image : any) => void
  /** Desabilita conversão do conteúdo em base64 antes de salvar na fonte de dados */
  disabledBase64Convertion?: boolean
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined
}

export function ArchbaseImageEdit<T, ID>({
  width = 240,
  height = 240,
  dataSource,
  dataField,
  disabled,
  readOnly,
  required,
  placeholder,
  label,
  description,
  error,
  src,
  radius = '4px',
  aspectRatio,
  objectFit= "contain",
  compressInitial=80,
  onChangeImage,
  disabledBase64Convertion,
  innerRef,
  ...otherProps
}: ArchbaseImageEditProps<T, ID>) {
  const [value, setValue] = useState<string|undefined>(undefined)
  const innerComponentRef = useRef<any>()
  const [internalError, setInternalError] = useState<string|undefined>(error)
  const forceUpdate = useForceUpdate()

  useEffect(()=>{
    setInternalError(undefined)
  },[value])

  const loadDataSourceFieldValue = () => {
    let initialValue: any = value

    if (dataSource && dataField) {
      initialValue = dataSource.getFieldValue(dataField)
      if (!initialValue) {
        initialValue = ''
      }
    }

    if (isBase64(initialValue) && !disabledBase64Convertion) {
      initialValue = atob(initialValue)
    }

    setValue(initialValue)
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

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent)
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener)
    }
  })

  const handleChangeImage = (image : string | undefined) => {
    const changedValue = image
    setValue((_prev) => changedValue)

    if (
      dataSource &&
      !dataSource.isBrowsing() &&
      dataField &&
      dataSource.getFieldValue(dataField) !== changedValue
    ) {
      if (!changedValue) {
        dataSource.setFieldValue(
          dataField,undefined
        )
      } else {
        dataSource.setFieldValue(
          dataField,
          disabledBase64Convertion ? changedValue : btoa(changedValue)
        )
      }
    }
    if (onChangeImage){
      onChangeImage(image)
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
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Input.Wrapper
        withAsterisk={required}
        label={label}
        placeholder={placeholder}
        description={description}
        error={internalError}
        ref={innerRef || innerComponentRef}
      >
        <ArchbaseImagePickerEditor
          imageSrcProp={value}
          config={{ 
              borderRadius: radius, 
              width, 
              height, 
              objectFit, 
              compressInitial, 
              showImageSize: !isReadOnly(),
              hideDeleteBtn: isReadOnly(),
              hideDownloadBtn: isReadOnly(),
              hideEditBtn: isReadOnly(),
              hideAddBtn: isReadOnly(), 
              onChangeImage: handleChangeImage
            }
          }
        />
      </Input.Wrapper>
    </div>
  )
}
