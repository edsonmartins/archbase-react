import { MantineSize, Rating } from '@mantine/core';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@components/datasource';
import { useArchbaseDidMount, useArchbaseDidUpdate } from '@components/hooks';
import React, { CSSProperties, FocusEventHandler, useCallback, useRef, useState } from 'react';

export interface ArchbaseRatingProps<T, ID> {
  /** Fonte de dados onde será atribuido o valor do rating*/
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo onde deverá ser atribuido o valor do rating na fonte de dados */
  dataField?: string;
  /** Indicador se o rating está desabilitado */
  disabled?: boolean;
  /** Indicador se o rating é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean;
  /** Indicador se o preenchimento do rating é obrigatório */
  required?: boolean;
  /** Quantidade de controles a ser renderizado */
  count: number;
  /** Valor inicial */
  value?: number;
  /** O ícone que é exibido quando o símbolo está vazio*/
  emptySymbol?: React.ReactNode | ((value: number) => React.ReactNode);
  /** Este ícone que é exibido quando o símbolo está cheio */
  fullSymbol?: React.ReactNode | ((value: number) => React.ReactNode);
  /** Número de frações em que cada item pode ser dividido, 1 por padrão */
  fractions?: number;
  /** Chamado quando o item é pairado */
  onHover?(value: number): void;
  /** A função deve retornar labelText para os símbolos */
  getSymbolLabel?: (value: number) => string;
  /** Nome da avaliação, deve ser único na página */
  name?: string;
  /** Se verdadeiro, apenas o símbolo selecionado mudará para símbolo completo */
  highlightSelectedOnly?: boolean;
  /** Estilo do rating */
  style?: CSSProperties;
  /** Texto sugestão do rating */
  placeholder?: string;
  /** Título do rating */
  label?: string;
  /** Descrição do rating */
  description?: string;
  /** Último erro ocorrido no rating */
  error?: string;
  /** Tamanho do rating */
  size?: MantineSize;
  /** Evento quando o foco sai do rating */
  onFocusExit?: FocusEventHandler<T> | undefined;
  /** Evento quando o rating recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined;
  /** Evento quando o valor do rating é alterado */
  onChangeValue?: (value?: number) => void;
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined;
}

export function ArchbaseRating<T, ID>({
  dataSource,
  dataField,
  readOnly = false,
  style,
  placeholder,
  size,
  innerRef,
  value,
  fractions,
  onFocusExit = () => {},
  onFocusEnter = () => {},
  onChangeValue = () => {},
}: ArchbaseRatingProps<T, ID>) {
  const [currentValue, setCurrentValue] = useState<number | undefined>(value);
  const innerComponentRef = innerRef || useRef<any>();

  const loadDataSourceFieldValue = () => {
    let initialValue: number | undefined = currentValue;

    if (dataSource && dataField) {
      initialValue = dataSource.getFieldValue(dataField);
      if (!initialValue) {
        initialValue = 0;
      }
    }

    setCurrentValue(initialValue);
  };

  const fieldChangedListener = useCallback(() => {}, []);

  const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
    if (dataSource && dataField) {
      if (
        event.type === DataSourceEventNames.dataChanged ||
        event.type === DataSourceEventNames.fieldChanged ||
        event.type === DataSourceEventNames.recordChanged ||
        event.type === DataSourceEventNames.afterScroll ||
        event.type === DataSourceEventNames.afterCancel
      ) {
        loadDataSourceFieldValue();
      }
    }
  }, []);

  useArchbaseDidMount(() => {
    loadDataSourceFieldValue();
    if (dataSource && dataField) {
      dataSource.addListener(dataSourceEvent);
      dataSource.addFieldChangeListener(dataField, fieldChangedListener);
    }
  });

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue();
  }, []);

  const handleChange = (value?: number) => {
    setCurrentValue((_prev) => value);

    if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== value) {
      dataSource.setFieldValue(dataField, value);
    }

    if (onChangeValue) {
      onChangeValue(value);
    }
  };

  const handleOnFocusExit = (event) => {
    if (onFocusExit) {
      onFocusExit(event);
    }
  };

  const handleOnFocusEnter = (event) => {
    if (onFocusEnter) {
      onFocusEnter(event);
    }
  };

  const isReadOnly = () => {
    let _readOnly = readOnly;
    if (dataSource && !readOnly) {
      _readOnly = dataSource.isBrowsing();
    }

    return _readOnly;
  };

  return (
    <Rating
      readOnly={isReadOnly()}
      size={size!}
      style={style}
      fractions={fractions}
      value={currentValue}
      ref={innerComponentRef}
      onChange={handleChange}
      onBlur={handleOnFocusExit}
      onFocus={handleOnFocusEnter}
      placeholder={placeholder}
    />
  );
}
