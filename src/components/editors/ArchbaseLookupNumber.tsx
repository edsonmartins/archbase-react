import { ActionIcon, MantineNumberSize, MantineSize, Tooltip, useMantineTheme } from '@mantine/core';
import type { CSSProperties, FocusEventHandler, ReactNode } from 'react';
import React, { useCallback, useRef, useState } from 'react';

import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks/lifecycle';

import { IconSearch } from '@tabler/icons-react';
import type { ArchbaseDataSource, DataSourceEvent } from '../datasource';
import { DataSourceEventNames } from '../datasource';
import { formatStr } from '@components/core';
import { ArchbaseObjectHelper } from '@components/core/helper';
import { ArchbaseNumberEdit } from './ArchbaseNumberEdit';

export interface ArchbaseLookupNumberProps<T, ID, O> {
  /** Fonte de dados onde será atribuido o valor do lookup edit */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo onde deverá ser atribuido o valor do lookup edit na fonte de dados */
  dataField?: string;
  /** Campo da fonte de dados que será usado para apresentar o valor no lookup edit */
  lookupField?: string;
  /** Indicador se o lookup edit está desabilitado */
  disabled?: boolean;
  /** Indicador se o lookup edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean;
  /** Indicador se o preenchimento do lookup edit é obrigatório */
  required?: boolean;
  /** Validar ao sair do campo se localizou o valor */
  validateOnExit?: boolean;
  /** Mensagem caso falhe ao localizar o valor */
  validateMessage?: string;
  /** Estilo do lookup edit */
  style?: CSSProperties;
  /** Tamanho do campo */
  size?: MantineSize;
  /** Largura do lookup edit */
  width?: MantineNumberSize;
  /** Texto sugestão do lookup edit */
  placeholder?: string;
  /** Título do lookup edit */
  label?: string;
  /** Descrição do lookup edit */
  description?: string;
  /** Último erro ocorrido no lookup edit */
  error?: string;
  /** Icone para apresentar lado direito do lookup edit que representa a busca */
  iconSearch?: ReactNode;
  /** Dica para botão localizar */
  tooltipIconSearch?: String;
  /** Evento ocorre quando clica no botão localizar */
  onActionSearchExecute?: () => void;
  /** Evento quando o foco sai do lookup edit */
  onFocusExit?: FocusEventHandler<T> | undefined;
  /** Evento quando o lookup edit recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined;
  /** Evento quando o valor do lookup edit é alterado */
  onChangeValue?: (value: any, event: any) => void;
  /** Evento ocorre quando um valor é localizado */
  onLookupResult?: (value: O) => void;
  /** Evento ocorre quando se obtém um erro ao localizar valor */
  onLookupError?: (error: string) => void;
  /** Função responsável por localizar um valor */
  lookupValueDelegator: (value: any) => Promise<O>;
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined;
}

export function ArchbaseLookupNumber<T, ID, O>({
  dataSource,
  dataField,
  lookupField,
  iconSearch,
  disabled = false,
  readOnly = false,
  style,
  placeholder,
  label,
  description,
  error,
  required,
  size,
  width,
  lookupValueDelegator,
  onLookupError,
  onLookupResult,
  validateMessage,
  tooltipIconSearch = 'Clique aqui para Localizar',
  validateOnExit = true,
  onFocusExit = () => {},
  onFocusEnter = () => {},
  onChangeValue = () => {},
  onActionSearchExecute = () => {},
  innerRef,
}: ArchbaseLookupNumberProps<T, ID, O>) {
  const theme = useMantineTheme();
  const [value, setValue] = useState<any | undefined>('');
  const [currentError, setCurrentError] = useState<string | undefined>(error);
  const innerComponentRef = innerRef || useRef<any>();
  const loadDataSourceFieldValue = () => {
    let initialValue: any = value;

    if (dataSource && lookupField) {
      initialValue = dataSource.getFieldValue(lookupField);
      if (!initialValue) {
        initialValue = '';
      }
    }

    setValue(initialValue);
    setCurrentError(undefined);
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
    if (dataSource && lookupField) {
      dataSource.addListener(dataSourceEvent);
      dataSource.addFieldChangeListener(lookupField, fieldChangedListener);
    }
  });

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue();
  }, []);

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent);
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
    }
  });

  const handleChange = (_maskValue: any, value: number, event: any) => {
    setCurrentError(undefined);
    setValue((_prev) => value);

    if (onChangeValue) {
      onChangeValue(event, value);
    }
  };

  const lookupValue = () => {
    if (dataSource && dataField && !dataSource.isBrowsing() && lookupField) {
      if (value != dataSource.getFieldValue(lookupField)) {
        const promise = lookupValueDelegator(value);
        promise
          .then((data: O) => {
            if (!data || data == null) {
              if (validateOnExit && validateMessage) {
                if (onLookupError) {
                  onLookupError(formatStr(validateMessage, value));
                }
              }
            }
            if (onLookupResult) {
              onLookupResult(data);
            }
            dataSource.setFieldValue(dataField, data);
          })
          .catch((error) => {
            dataSource.setFieldValue(dataField, undefined);
            innerComponentRef.current?.focus();
            if (validateMessage) {
              setCurrentError(formatStr(validateMessage, value));
            }
            if (onLookupError) {
              onLookupError(error);
            }
          });
      }
    } else {
      if (value && value != null) {
        const promise = lookupValueDelegator(value);
        promise
          .then((data: O) => {
            if (!data || data == null) {
              if (validateOnExit && validateMessage) {
                if (onLookupError) {
                  onLookupError(formatStr(validateMessage, value));
                }
              }
            }
            if (onLookupResult) {
              onLookupResult(data);
            }
            let newValue = ArchbaseObjectHelper.getNestedProperty(data, lookupField);
            if (!newValue) {
              newValue = '';
            }
            setValue(newValue);
          })
          .catch((error) => {
            setValue(undefined);
            if (validateMessage) {
              setCurrentError(formatStr(validateMessage, value));
            }
            innerComponentRef.current?.focus();
            if (onLookupError) {
              onLookupError(error);
            }
          });
      }
    }
  };

  const handleOnFocusExit = (event) => {
    lookupValue();
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

  const icon = iconSearch ? iconSearch : <IconSearch size="1rem" />;

  return (
    <ArchbaseNumberEdit
      disabled={disabled}
      required={required}
      value={value}
      readOnly={isReadOnly()}
      onChangeValue={handleChange}
      innerRef={innerComponentRef}
      onFocusEnter={handleOnFocusEnter}
      onFocusExit={handleOnFocusExit}
      placeholder={placeholder}
      description={description}
      label={label}
      error={currentError}
      style={style}
      size={size}
      width={width}
      rightSection={
        <Tooltip label={tooltipIconSearch}>
          <ActionIcon
            sx={{
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors[theme.primaryColor][5]
                  : theme.colors[theme.primaryColor][6],
            }}
            tabIndex={-1}
            variant="filled"
            onClick={onActionSearchExecute}
          >
            {icon}
          </ActionIcon>
        </Tooltip>
      }
    />
  );
}
