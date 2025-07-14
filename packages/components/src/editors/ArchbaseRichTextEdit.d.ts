import React, { CSSProperties } from 'react';
import { UploadBeforeHandler, UploadBeforeReturn, UploadInfo } from 'suneditor-react/dist/types/upload';
import 'suneditor/dist/css/suneditor.min.css';
import { ArchbaseDataSource } from '@archbase/data';
export interface ArchbaseRichTextEditProps<T, ID> {
    /** Indicador se o rich editor recebe o foco automaticamente */
    autoFocus?: boolean;
    /** Fonte de dados onde será atribuido o valor do rich edit*/
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do rich edit na fonte de dados */
    dataField?: string;
    /** Indicador se o rich edit está desabilitado */
    disabled?: boolean;
    /** Indicador se o rich edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Indicador se o preenchimento do rich edit é obrigatório */
    required?: boolean;
    /** Estilo do checkbox */
    style?: CSSProperties;
    /** Largura do edit */
    width?: string | undefined;
    /** Altura do edit */
    height?: string | undefined;
    /** Título do rich edit */
    label?: string;
    /** Descrição do rich edit */
    description?: string;
    /** Último erro ocorrido no rich edit */
    error?: string;
    /** Esconder barra de ações */
    hideToolbar?: boolean;
    /** Desabilitar barra de açõess */
    disableToolbar?: boolean;
    /** Valor inicial */
    value?: string;
    /** Desabilita conversão do conteúdo em base64 antes de salvar na fonte de dados */
    disabledBase64Convertion?: boolean;
    /** Evento quando o foco sai do rich edit */
    onFocusExit?: (event: FocusEvent) => void;
    /** Evento quando o rich edit recebe o foco */
    onFocusEnter?: (event: FocusEvent) => void;
    /** Evento quando o valor do rich edit é alterado */
    onChangeValue?: (value: any) => void;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
    onScroll?: (event: UIEvent) => void;
    onCopy?: (event: ClipboardEvent, clipboardData: ClipboardEvent['clipboardData']) => boolean;
    onCut?: (event: ClipboardEvent, clipboardData: ClipboardEvent['clipboardData']) => boolean;
    onClick?: (event: MouseEvent) => void;
    onMouseDown?: (event: MouseEvent) => void;
    onKeyUp?: (event: KeyboardEvent) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    onSave?: (contents: string) => void;
    onSetToolbarButtons?: (buttonList: Array<any>) => void;
    onLoad?: (reload: boolean) => void;
    onDrop?: (event: DragEvent, cleanData: string, maxCharCount: boolean) => boolean | Array<any> | void;
    onPaste?: (event: ClipboardEvent, cleanData: string, maxCharCount: boolean) => void;
    onImageUpload?: (targetImgElement: HTMLImageElement, index: number, state: 'create' | 'update' | 'delete', imageInfo: UploadInfo<HTMLImageElement>, remainingFilesCount: number) => void;
    onVideoUpload?: (targetElement: HTMLVideoElement, index: number, state: 'create' | 'update' | 'delete', videoInfo: UploadInfo<HTMLVideoElement>, remainingFilesCount: number) => void;
    onAudioUpload?: (targetElement: HTMLAudioElement, index: number, state: 'create' | 'update' | 'delete', audioInfo: UploadInfo<HTMLAudioElement>, remainingFilesCount: number) => void;
    onImageUploadBefore?: (files: Array<File>, info: object, uploadHandler: UploadBeforeHandler) => UploadBeforeReturn;
    onVideoUploadBefore?: (files: Array<File>, info: object, uploadHandler: UploadBeforeHandler) => UploadBeforeReturn;
    onAudioUploadBefore?: (files: Array<File>, info: object, uploadHandler: UploadBeforeHandler) => UploadBeforeReturn;
    onImageUploadError?: (errorMessage: string, result: any) => void;
    onVideoUploadError?: (errorMessage: string, result: any) => void;
    onAudioUploadError?: (errorMessage: string, result: any) => void;
    toggleCodeView?: (isCodeView: boolean) => void;
    toggleFullScreen?: (isFullScreen: boolean) => void;
    showInline?: (toolbar: Element, context: any) => void;
    showController?: (name: string, controllers: Array<any>) => void;
    imageUploadHandler?: (xmlHttpRequest: XMLHttpRequest, info: {
        isUpdate: boolean;
        linkValue: any;
        element: Element;
        align: any;
        linkNewWindow: any;
        [key: string]: any;
    }) => void;
    onResizeEditor?: (height: number, prevHeight: number) => any;
}
export declare function ArchbaseRichTextEdit<T, ID>({ autoFocus, dataSource, dataField, disabled, readOnly, required, label, description, error, width, height, hideToolbar, disableToolbar, value, disabledBase64Convertion, onFocusExit, onFocusEnter, onChangeValue, onScroll, onCopy, onCut, onClick, onMouseDown, onKeyUp, onKeyDown, onSave, onSetToolbarButtons, onLoad, onDrop, onPaste, onImageUpload, onVideoUpload, onAudioUpload, onImageUploadBefore, onVideoUploadBefore, onAudioUploadBefore, onImageUploadError, onVideoUploadError, onAudioUploadError, toggleCodeView, toggleFullScreen, showInline, showController, imageUploadHandler, }: ArchbaseRichTextEditProps<T, ID>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseRichTextEdit.d.ts.map