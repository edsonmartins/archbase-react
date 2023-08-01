// import React, { useState, useEffect, useRef, CSSProperties, FocusEventHandler } from 'react';
// import lodash from 'lodash';
// import { ArchbaseDataSource } from '@components/datasource';

// export interface ArchbaseLookupEditProps<T,ID> {
//   /** Fonte de dados onde será atribuido o valor do edit */
//   dataSource?: ArchbaseDataSource<T, ID>;
//   /** Campo onde deverá ser atribuido o valor do edit na fonte de dados */
//   dataField?: string;
//   /** Indicador se o edit está desabilitado */
//   disabled?: boolean;
//   /** Indicador se o edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
//   readOnly?: boolean;
//   /** Indicador se o preenchimento do edit é obrigatório */
//   required?: boolean;
//   /** Estilo do checkbox */
//   style?: CSSProperties;
//   /** Texto sugestão do edit */
//   placeholder?: string;
//   /** Título do edit */
//   label?: string;
//   /** Descrição do edit */
//   description?: string;
//   /** Último erro ocorrido no edit */
//   error?: string;
//   /** Evento quando o foco sai do edit */
//   onFocusExit?: FocusEventHandler<T> | undefined;
//   /** Evento quando o edit recebe o foco */
//   onFocusEnter?: FocusEventHandler<T> | undefined;

//   lookupField: string;
//   value: string;
//   placeHolder?: string;
//   maxLenght?: number;
//   onButtonClick?: () => void;
//   onLookupData: (value: string) => Promise<string>;
//   icon?: string;
//   iconColor?: string;
//   image?: string;
//   validateOnExit?: boolean;
//   validateMessage?: string;
// }

// export const ArchbaseLookupEdit: React.FC<ArchbaseLookupEditProps<any,any>> = ({
//   dataSource,
//   dataField,
//   lookupField,
//   value: initialValue,
//   placeHolder,
//   disabled,
//   maxLenght = 0,
//   onButtonClick,
//   onLookupData,
//   icon,
//   iconColor,
//   image,
//   style,
//   readOnly = false,
//   validateOnExit = true,
//   validateMessage = 'Registro não encontrado.',
// }) => {
//   const [value, setValue] = useState<string>(initialValue);
//   const idEdit = useRef<string>(lodash.uniqueId('lkpEdit'));
//   const divInputRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const handleDataSourceEvent = (event: string) => {
//       let valueFromDataSource = dataSource?.fieldByName(lookupField) || '';
//       setValue(valueFromDataSource);
//     };

//     if (dataSource) {
//       dataSource.addEventListener(
//         [
//           dataSourceEvents.AFTER_CLOSE,
//           dataSourceEvents.AFTER_OPEN,
//           dataSourceEvents.AFTER_GOTO_PAGE,
//           dataSourceEvents.AFTER_CANCEL,
//           dataSourceEvents.AFTER_SCROLL,
//         ],
//         handleDataSourceEvent
//       );
//       dataSource.addEventListener(
//         dataSourceEvents.DATA_FIELD_CHANGED,
//         handleDataSourceEvent,
//         dataField
//       );

//       return () => {
//         dataSource.removeEventListener(
//           [
//             dataSourceEvents.AFTER_CLOSE,
//             dataSourceEvents.AFTER_OPEN,
//             dataSourceEvents.AFTER_GOTO_PAGE,
//             dataSourceEvents.AFTER_CANCEL,
//             dataSourceEvents.AFTER_SCROLL,
//           ],
//           handleDataSourceEvent
//         );
//         dataSource.removeEventListener(
//           dataSourceEvents.DATA_FIELD_CHANGED,
//           handleDataSourceEvent,
//           dataField
//         );
//       };
//     }
//   }, [dataSource, dataField, lookupField]);

//   useEffect(() => {
//     const valueFromProps = value !== undefined ? value : '';
//     setValue(valueFromProps);
//   }, [value]);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = event.target.value || '';
//     setValue(newValue);
//     if (onButtonClick) {
//       onButtonClick();
//     }
//   };

//   const onBlur = () => {
//     const inputValue = value !== undefined ? value : '';
//     if (dataSource && dataSource.getState() !== 'dsBrowse') {
//       if (inputValue !== dataSource.fieldByName(lookupField)) {
//         if (inputValue !== '' && inputValue !== '0') {
//           const promise = onLookupData(inputValue);
//           if (!(promise instanceof Promise)) {
//             throw new Error('onLookupData deve retornar um objeto Promise. AnterosLookupEdit.');
//           }
//           promise.then(
//             (data) => {
//               if (data === '' || data === undefined || data === null) {
//                 if (validateOnExit && onLookupDataError) {
//                   onLookupDataError(AnterosStringUtils.format(validateMessage, inputValue));
//                 }
//               }

//               const newData = AnterosJacksonParser.convertJsonToObject(data);
//               if (onLookupResult) {
//                 onLookupResult(newData);
//               }

//               const newFieldValue = newData !== '' && newData !== undefined ? newData : null;
//               dataSource.setFieldByName(dataField, newFieldValue);
//             },
//             (err) => {
//               if (onLookupDataError) {
//                 onLookupDataError(err.message);
//               }
//               inputRef.current?.focus();
//             }
//           );
//         } else {
//           dataSource.setFieldByName(dataField, '');
//         }
//       }
//     } else {
//       if (inputValue !== '') {
//         const promise = onLookupData(inputValue);
//         if (!(promise instanceof Promise)) {
//           throw new Error('onLookupData deve retornar um objeto Promise. AnterosLookupEdit.');
//         }
//         promise.then(
//           (data) => {
//             if (data === '' || data === undefined || data === null) {
//               if (validateOnExit && onLookupDataError) {
//                 onLookupDataError(AnterosStringUtils.format(validateMessage, inputValue));
//               }
//             }
//             const newData = AnterosJacksonParser.convertJsonToObject(data);
//             if (onLookupResult) {
//               onLookupResult(newData);
//             }
//             const newValue = AnterosObjectUtils.getNestedProperty(newData, lookupField) || '';
//             setValue(newValue);
//           },
//           (err) => {
//             if (onLookupDataError) {
//               onLookupDataError(err.message);
//             }
//             inputRef.current?.focus();
//           }
//         );
//       }
//     }
//   };

//   const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (onKeyPress) {
//       onKeyPress(event);
//     }
//   };

//   const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (onKeyDown) {
//       onKeyDown(event);
//     }
//   };

//   const colClasses = buildGridClassNames(
//     {
//       extraSmall,
//       small,
//       medium,
//       large,
//       extraLarge,
//     },
//     false,
//     []
//   );

//   const handleIconClick = () => {
//     if (onButtonClick) {
//       onButtonClick();
//     }
//   };

//   const width = colClasses.length > 0 ? '' : style?.width || '';

//   const iconElement = icon ? (
//     <i
//       data-user={false}
//       onClick={handleIconClick}
//       className={icon}
//       style={{ color: iconColor }}
//     ></i>
//   ) : null;

//   const classNameAddOn = AnterosUtils.buildClassNames(
//     'input-group-addon',
//     primary || fullPrimary ? 'btn btn-primary' : '',
//     success || fullSucces ? 'btn btn-success' : '',
//     info || fullInfo ? 'btn btn-info' : '',
//     danger || fullDanger ? 'btn btn-danger' : '',
//     warning || fullWarning ? 'btn btn-warning' : '',
//     secondary || fullSecondary ? 'btn btn-secondary' : '',
//     default || fullDefault ? '' : ''
//   );

//   const classNameInput = AnterosUtils.buildClassNames(
//     colClasses.length > 0 || context.withinInputGroup || icon ? 'form-control' : '',
//     fullPrimary ? 'btn-primary' : '',
//     fullSucces ? 'btn-success' : '',
//     fullInfo ? 'btn-info' : '',
//     fullDanger ? 'btn-danger' : '',
//     fullWarning ? 'btn-warning' : '',
//     fullSecondary ? 'btn-secondary' : '',
//     fullDefault ? '' : ''
//   );

//   if (icon) {
//     return (
//       <div className={className} style={{ ...style, width }} ref={divInputRef}>
//         <input
//           disabled={disabled ? true : false}
//           id={idEdit.current}
//           ref={inputRef}
//           type="text"
//           value={value || ''}
//           style={{ ...style, margin: 0 }}
//           className={classNameInput}
//           data-balloon-pos={hintPosition}
//           aria-label={hint}
//           onChange={handleChange}
//           onKeyDown={onKeyDown}
//           onKeyPress={onKeyPress}
//           onBlur={onBlur}
//           readOnly={readOnly}
//         />
//         <div className={classNameAddOn} style={{ margin: 0 }} onClick={onButtonClick}>
//           <span>
//             {iconElement}
//             <img src={image} onClick={onButtonClick} />
//           </span>
//         </div>
//       </div>
//     );
//   } else {
//     const edit = (
//       <input
//         disabled={disabled ? true : false}
//         id={idEdit.current}
//         ref={inputRef}
//         type="text"
//         value={value || ''}
//         style={{ ...style, width }}
//         className={classNameInput}
//         data-balloon-pos={hintPosition}
//         aria-label={hint}
//         readOnly={readOnly}
//         onKeyDown={onKeyDown}
//         onKeyPress={onKeyPress}
//         onBlur={onBlur}
//         onChange={handleChange}
//       />
//     );
//     if (colClasses.length > 0) {
//       return <div className={AnterosUtils.buildClassNames(colClasses)}>{edit}</div>;
//     } else {
//       return edit;
//     }
//   }
// };


// ArchbaseLookupEdit.defaultProps = {
// value: '',
// maxLenght: 0,
// readOnly: false,
// validateOnExit: true,
// validateMessage: 'Registro não encontrado.',
// };


import React from "react";

export interface ArchbaseLookupEditProps {

}

export function ArchbaseLookupEdit(_props: ArchbaseLookupEditProps) {
    return <div></div>
}