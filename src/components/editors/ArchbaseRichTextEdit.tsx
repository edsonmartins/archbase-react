import React, { CSSProperties, FocusEventHandler } from 'react';
import 'suneditor/dist/css/suneditor.min.css';

import { ArchbaseDataSource } from '@components/datasource';
import SunEditor from 'suneditor-react';

const content =
  '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';

export interface ArchbaseRichTextEditProps<T, ID> {
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
  /** Texto sugestão do rich edit */
  placeholder?: string;
  /** Título do rich edit */
  label?: string;
  /** Descrição do rich edit */
  description?: string;
  /** Último erro ocorrido no rich edit */
  error?: string;
  /** Evento quando o foco sai do rich edit */
  onFocusExit?: FocusEventHandler<T> | undefined;
  /** Evento quando o rich edit recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined;
  /** Evento quando o valor do rich edit é alterado */
  onChangeValue?: (value: any, event: any) => void;
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement>|undefined;
}

export function ArchbaseRichTextEdit<T,ID>(_props: ArchbaseRichTextEditProps<T,ID>) {
  //const _innerComponentRef = innerRef || useRef<any>();

  return (
    <div>
      <p> My Other Contents </p>
      <SunEditor  defaultValue={content}/>
    </div>
  );
}
