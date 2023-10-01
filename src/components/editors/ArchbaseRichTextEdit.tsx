import React, { CSSProperties, useCallback, useEffect, useState } from 'react'
import 'suneditor/dist/css/suneditor.min.css'
import {
  ArchbaseDataSource,
  DataSourceEvent,
  DataSourceEventNames
} from '../datasource'
import SunEditor from 'suneditor-react'
import { useTranslation } from 'react-i18next'
import {
  UploadBeforeHandler,
  UploadBeforeReturn,
  UploadInfo
} from 'suneditor-react/dist/types/upload'
import en from 'suneditor/src/lang/en'
import es from 'suneditor/src/lang/es'
import ptBR from 'suneditor/src/lang/pt_br'
import { Input } from '@mantine/core'
import {
  useArchbaseDidMount,
  useArchbaseDidUpdate,
  useArchbaseWillUnmount
} from '../hooks'
import { isBase64 } from '../core/utils'

function getInitialValue<T, ID>(
  value: any,
  dataSource?: ArchbaseDataSource<T, ID>,
  dataField?: string,
  disabledBase64Convertion?: boolean
): any {
  let initialValue: any = value
  if (dataSource && dataField) {
    initialValue = dataSource.getFieldValue(dataField)
    if (!initialValue) {
      initialValue = ''
    }
    if (isBase64(initialValue) && !disabledBase64Convertion) {
      initialValue = atob(initialValue)
    }
  }
  return initialValue
}

export interface ArchbaseRichTextEditProps<T, ID> {
  /** Indicador se o rich editor recebe o foco automaticamente */
  autoFocus?: boolean
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
  /** Largura do edit */
  width?: string | undefined
  /** Altura do edit */
  height?: string | undefined
  /** Título do rich edit */
  label?: string
  /** Descrição do rich edit */
  description?: string
  /** Último erro ocorrido no rich edit */
  error?: string
  /** Esconder barra de ações */
  hideToolbar?: boolean
  /** Desabilitar barra de açõess */
  disableToolbar?: boolean
  /** Valor inicial */
  value?: string
  /** Desabilita conversão do conteúdo em base64 antes de salvar na fonte de dados */
  disabledBase64Convertion?: boolean
  /** Evento quando o foco sai do rich edit */
  onFocusExit?: (event: FocusEvent) => void
  /** Evento quando o rich edit recebe o foco */
  onFocusEnter?: (event: FocusEvent) => void
  /** Evento quando o valor do rich edit é alterado */
  onChangeValue?: (value: any) => void
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined
  onScroll?: (event: UIEvent) => void
  onCopy?: (event: ClipboardEvent, clipboardData: ClipboardEvent['clipboardData']) => boolean
  onCut?: (event: ClipboardEvent, clipboardData: ClipboardEvent['clipboardData']) => boolean
  onClick?: (event: MouseEvent) => void
  onMouseDown?: (event: MouseEvent) => void
  onKeyUp?: (event: KeyboardEvent) => void
  onKeyDown?: (event: KeyboardEvent) => void
  onSave?: (contents: string) => void
  onSetToolbarButtons?: (buttonList: Array<any>) => void
  onLoad?: (reload: boolean) => void
  onDrop?: (
    event: DragEvent,
    cleanData: string,
    maxCharCount: boolean
  ) => boolean | Array<any> | void
  onPaste?: (event: ClipboardEvent, cleanData: string, maxCharCount: boolean) => void
  onImageUpload?: (
    targetImgElement: HTMLImageElement,
    index: number,
    state: 'create' | 'update' | 'delete',
    imageInfo: UploadInfo<HTMLImageElement>,
    remainingFilesCount: number
  ) => void
  onVideoUpload?: (
    targetElement: HTMLVideoElement,
    index: number,
    state: 'create' | 'update' | 'delete',
    videoInfo: UploadInfo<HTMLVideoElement>,
    remainingFilesCount: number
  ) => void
  onAudioUpload?: (
    targetElement: HTMLAudioElement,
    index: number,
    state: 'create' | 'update' | 'delete',
    audioInfo: UploadInfo<HTMLAudioElement>,
    remainingFilesCount: number
  ) => void
  onImageUploadBefore?: (
    files: Array<File>,
    info: object,
    uploadHandler: UploadBeforeHandler
  ) => UploadBeforeReturn
  onVideoUploadBefore?: (
    files: Array<File>,
    info: object,
    uploadHandler: UploadBeforeHandler
  ) => UploadBeforeReturn
  onAudioUploadBefore?: (
    files: Array<File>,
    info: object,
    uploadHandler: UploadBeforeHandler
  ) => UploadBeforeReturn
  onImageUploadError?: (errorMessage: string, result: any) => void
  onVideoUploadError?: (errorMessage: string, result: any) => void
  onAudioUploadError?: (errorMessage: string, result: any) => void
  toggleCodeView?: (isCodeView: boolean) => void
  toggleFullScreen?: (isFullScreen: boolean) => void
  showInline?: (toolbar: Element, context: any) => void
  showController?: (name: string, controllers: Array<any>) => void
  imageUploadHandler?: (
    xmlHttpRequest: XMLHttpRequest,
    info: {
      isUpdate: boolean
      linkValue: any
      element: Element
      align: any
      linkNewWindow: any
      [key: string]: any
    }
  ) => void
  onResizeEditor?: (height: number, prevHeight: number) => any
}

export function ArchbaseRichTextEdit<T, ID>({
  autoFocus,
  dataSource,
  dataField,
  disabled,
  readOnly,
  required,
  placeholder,
  label,
  description,
  error,
  width,
  height,
  hideToolbar,
  disableToolbar,
  value,
  disabledBase64Convertion,
  onFocusExit,
  onFocusEnter,
  onChangeValue,
  onScroll,
  onCopy,
  onCut,
  onClick,
  onMouseDown,
  onKeyUp,
  onKeyDown,
  onSave,
  onSetToolbarButtons,
  onLoad,
  onDrop,
  onPaste,
  onImageUpload,
  onVideoUpload,
  onAudioUpload,
  onImageUploadBefore,
  onVideoUploadBefore,
  onAudioUploadBefore,
  onImageUploadError,
  onVideoUploadError,
  onAudioUploadError,
  toggleCodeView,
  toggleFullScreen,
  showInline,
  showController,
  imageUploadHandler
}: ArchbaseRichTextEditProps<T, ID>) {
  const { i18n } = useTranslation()
  const [currentValue, setCurrentValue] = useState<string | undefined>(
    getInitialValue(value, dataSource, dataField, disabledBase64Convertion)  )
  const [internalError, setInternalError] = useState<string|undefined>(error)

  useEffect(()=>{
    setInternalError(undefined)
  },[currentValue])

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

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue()
  }, [])

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent)
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener)
    }
  })

  const handleChange = (content: string) => {
    setCurrentValue((_prev) => content)

    if (
      dataSource &&
      !dataSource.isBrowsing() &&
      dataField &&
      dataSource.getFieldValue(dataField) !== content
    ) {
      dataSource.setFieldValue(dataField, disabledBase64Convertion ? content : btoa(content))
    }

    if (onChangeValue) {
      onChangeValue(content)
    }
  }
  const handleOnBlur = (event: FocusEvent, _editorContents: string) => {
    if (onFocusExit) {
      onFocusExit(event)
    }
  }

  const isReadOnly = () => {
    let _readOnly = readOnly
    if (dataSource && !readOnly) {
      _readOnly = dataSource.isBrowsing()
    }
    return _readOnly
  }

  return (
    <Input.Wrapper
      withAsterisk={required}
      label={label}
      placeholder={placeholder}
      description={description}
      error={internalError}
    >
      <SunEditor
        autoFocus={autoFocus}
        disable={disabled}
        readOnly={isReadOnly()}
        setAllPlugins={true}
        defaultValue={currentValue}
        hideToolbar={hideToolbar}
        disableToolbar={disableToolbar}
        width={width}
        height={height}
        onChange={handleChange}
        onScroll={onScroll}
        onCopy={onCopy}
        onCut={onCut}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        onFocus={onFocusEnter}
        onBlur={handleOnBlur}
        onSave={onSave}
        onSetToolbarButtons={onSetToolbarButtons}
        onLoad={onLoad}
        onDrop={onDrop}
        onPaste={onPaste}
        onImageUpload={onImageUpload}
        onVideoUpload={onVideoUpload}
        onAudioUpload={onAudioUpload}
        onImageUploadBefore={onImageUploadBefore}
        onVideoUploadBefore={onVideoUploadBefore}
        onAudioUploadBefore={onAudioUploadBefore}
        onImageUploadError={onImageUploadError}
        onVideoUploadError={onVideoUploadError}
        onAudioUploadError={onAudioUploadError}
        toggleCodeView={toggleCodeView}
        toggleFullScreen={toggleFullScreen}
        showInline={showInline}
        showController={showController}
        imageUploadHandler={imageUploadHandler}
        setOptions={{
          lang: i18n.language === 'es' ? es : i18n.language === 'pt-BR' ? ptBR : en
        }}
      />
    </Input.Wrapper>
  )
}
