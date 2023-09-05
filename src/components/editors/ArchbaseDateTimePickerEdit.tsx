/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-nested-ternary */
import dayjs from 'dayjs';
import React, { forwardRef, useState, useEffect, useRef } from 'react';
import {
  DefaultProps,
  InputSharedProps,
  InputWrapperBaseProps,
  InputStylesNames,
  InputWrapperStylesNames,
  useInputProps,
  Input,
  PopoverProps,
  Popover,
  CloseButton,
  createStyles,
} from '@mantine/core';
import { useUncontrolled, useDidUpdate } from '@mantine/hooks';
import { IMaskInput } from 'react-imask';
import {
  Calendar,
  CalendarBaseProps,
  CalendarLevel,
  CalendarStylesNames,
  DateValue,
  DecadeLevelSettings,
  HiddenDatesInput,
  MonthLevelSettings,
  YearLevelSettings,
  pickCalendarProps,
  useDatesContext,
} from '@mantine/dates';
import type { ArchbaseDataSource } from '@components/datasource';

const ARCHBASE_DATETIME_PICKER_EDIT = 'ArchbaseDateTimePickerEdit';

const useStyles = createStyles((theme) => ({
  timeWrapper: {
    display: 'flex',
    marginTop: theme.spacing.md,
  },

  timeInput: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
}));

const dateFormats = {
  'DD/MM/YYYY HH:MM:SS': {
    mask: '00/00/0000 00:00:00',
    format: (date: Date) => {
      if (!date) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const year = date.getFullYear();
      let result = [day, month, year].join('/');
      if (Number(hour) > 0 || Number(minutes) > 0 || Number(seconds) > 0) {
        result = result.concat(' ').concat(hour).concat(':').concat(minutes).concat(':').concat(seconds);
      }

      return result;
    },
    parse: (str) => {
      const dt = str.substring(0, 10);
      const tm = str.substring(11);
      const [day, month, year] = dt.split('/');
      const [hour, minute, second] = tm.split(':');

      return new Date(year, month - 1, day, hour, minute, second, 0);
    },
  },
  'DD-MM-YYYY HH:MM:SS': {
    mask: '00-00-0000 00:00:00',
    format: (date) => {
      if (!date) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const year = date.getFullYear();
      let result = [day, month, year].join('/');
      if (Number(hour) > 0 || Number(minutes) > 0 || Number(seconds) > 0) {
        result = result.concat(' ').concat(hour).concat(':').concat(minutes).concat(':').concat(seconds);
      }

      return result;
    },
    parse: (str) => {
      const dt = str.substring(0, 10);
      const tm = str.substring(11);
      const [day, month, year] = dt.split('-');
      const [hour, minute, second] = tm.split(':');

      return new Date(year, month - 1, day, hour, minute, second, 0);
    },
  },
  'YYYY/MM/DD HH:MM:SS': {
    mask: '`0000/00/00 00:00:00',
    format: (date) => {
      if (!date) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const year = date.getFullYear();
      let result = [day, month, year].join('/');
      if (Number(hour) > 0 || Number(minutes) > 0 || Number(seconds) > 0) {
        result = result.concat(' ').concat(hour).concat(':').concat(minutes).concat(':').concat(seconds);
      }

      return result;
    },
    parse: (str) => {
      const dt = str.substring(0, 10);
      const tm = str.substring(11);
      const [year, month, day] = dt.split('/');
      const [hour, minute, second] = tm.split(':');

      return new Date(year, month - 1, day, hour, minute, second, 0);
    },
  },
  'YYYY-MM-DD HH:MM:SS': {
    mask: '`0000-00-00 00:00:00',
    format: (date) => {
      if (!date) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const year = date.getFullYear();
      let result = [day, month, year].join('/');
      if (Number(hour) > 0 || Number(minutes) > 0 || Number(seconds) > 0) {
        result = result.concat(' ').concat(hour).concat(':').concat(minutes).concat(':').concat(seconds);
      }

      return result;
    },
    parse: (str) => {
      const dt = str.substring(0, 10);
      const tm = str.substring(11);
      const [year, month, day] = dt.split('-');
      const [hour, minute, second] = tm.split(':');

      return new Date(year, month - 1, day, hour, minute, second, 0);
    },
  },
};

function dateStringParser(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime()) || !dateString) {
    return null;
  }

  return date;
}

export function assignTime(originalDate: DateValue, resultDate: DateValue) {
  if (!originalDate || !resultDate) {
    return resultDate;
  }

  const hours = originalDate.getHours();
  const minutes = originalDate.getMinutes();
  const seconds = originalDate.getSeconds();
  const ms = originalDate.getMilliseconds();

  const result = new Date(resultDate);
  result.setHours(hours);
  result.setMinutes(minutes);
  result.setSeconds(seconds);
  result.setMilliseconds(ms);

  return result;
}

interface IsDateValid {
  date: DateValue;
  maxDate?: Date;
  minDate?: Date;
}

function isDateValid({ date, maxDate, minDate }: IsDateValid) {
  if (date == null) {
    return false;
  }

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  if (maxDate && dayjs(date).isAfter(maxDate, 'date')) {
    return false;
  }

  if (minDate && dayjs(date).isBefore(minDate, 'date')) {
    return false;
  }

  return true;
}

export type ArchbaseDateTimePickerEditStylesNames = CalendarStylesNames | InputStylesNames | InputWrapperStylesNames;

export interface ArchbaseDateTimePickerEditProps
  extends DefaultProps<ArchbaseDateTimePickerEditStylesNames>,
    InputSharedProps,
    InputWrapperBaseProps,
    CalendarBaseProps,
    DecadeLevelSettings,
    YearLevelSettings,
    MonthLevelSettings,
    Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'value' | 'defaultValue' | 'onChange'> {
  /** Analisa a entrada do usuário para convertê-la em um objeto Date */
  dateParser?: (value: string) => DateValue;

  /** Valor do componente controlado */
  value?: DateValue;

  /** Valor padrão para componente não controlado */
  defaultValue?: DateValue;

  /** Chamado quando o valor muda */
  onChange?(value: DateValue): void;

  /** Adereços adicionados ao componente Popover */
  popoverProps?: Partial<Omit<PopoverProps, 'children'>>;

  /** Determina se o valor de entrada pode ser limpo, adiciona o botão limpar à seção direita, falso por padrão */
  clearable?: boolean;

  /** Adereços adicionados ao botão limpar */
  clearButtonProps?: React.ComponentPropsWithoutRef<'button'>;

  /** Determina se o valor de entrada deve ser revertido para o último valor válido conhecido no desfoque, verdadeiro por padrão */
  fixOnBlur?: boolean;

  /** Determina se o valor pode ser desmarcado quando o usuário clica na data selecionada no calendário ou apaga o conteúdo da entrada, verdadeiro se prop limpável estiver definido, falso por padrão */
  allowDeselect?: boolean;

  /** Determina se o tempo (horas, minutos, segundos e milissegundos) deve ser preservado quando uma nova data é escolhida, verdadeiro por padrão */
  preserveTime?: boolean;

  /** Nível máximo que o usuário pode atingir (década, ano, mês), o padrão é década */
  maxLevel?: CalendarLevel;

  /** Nível inicial exibido ao usuário (década, ano, mês), usado para componente não controlado */
  defaultLevel?: CalendarLevel;

  /** Nível atual exibido ao usuário (década, ano, mês), usado para componente controlado */
  level?: CalendarLevel;

  /** Chamado quando o nível muda */
  onLevelChange?(level: CalendarLevel): void;

  dataSource?: ArchbaseDataSource<any, any>;
  dataField?: string;
  disabled?: boolean;
  readOnly?: boolean;
  dateFormat?: 'DD/MM/YYYY HH:MM:SS' | 'DD-MM-YYYY HH:MM:SS' | 'YYYY/MM/DD HH:MM:SS' | 'YYYY-MM-DD HH:MM:SS';
  placeholderChar?: string;
  showPlaceholderFormat?: boolean;
  onFocusExit?: React.FocusEvent<HTMLInputElement>;
  onFocusEnter?: React.FocusEvent<HTMLInputElement>;
  /** Indica se o date time picker tem o preenchimento obrigatório */
  required?: boolean;
}

const defaultProps: Partial<ArchbaseDateTimePickerEditProps> = {
  fixOnBlur: true,
  preserveTime: true,
  size: 'sm',
  readOnly: false,
  disabled: false,
  clearable: true,
  required: false,
  placeholderChar: '_',
  showPlaceholderFormat: true,
  dateFormat: 'DD/MM/YYYY HH:MM:SS',
};

export const ArchbaseDateTimePickerEdit = forwardRef<HTMLInputElement, ArchbaseDateTimePickerEditProps>(
  (props, ref) => {
    const {
      inputProps,
      wrapperProps,
      value,
      defaultValue,
      onChange,
      clearable,
      clearButtonProps,
      popoverProps,
      getDayProps,
      locale,
      dateParser,
      minDate,
      maxDate,
      fixOnBlur,
      onFocus,
      onBlur,
      onClick,
      readOnly,
      name,
      form,
      rightSection,
      unstyled,
      classNames,
      styles,
      allowDeselect,
      preserveTime,
      date,
      defaultDate,
      onDateChange,
      showPlaceholderFormat,
      placeholderChar,
      dateFormat,
      ...rest
    } = useInputProps(ARCHBASE_DATETIME_PICKER_EDIT, defaultProps, props);

    const { calendarProps, others } = pickCalendarProps(rest);
    const ctx = useDatesContext();
    useStyles(undefined, {
      name: ARCHBASE_DATETIME_PICKER_EDIT,
      classNames,
      styles,
      unstyled,
    });
    const defaultDateParser = (val: string) => {
      const parsedDate = dateFormats[dateFormat!].parse(val);

      return Number.isNaN(parsedDate.getTime()) ? dateStringParser(val) : parsedDate;
    };

    const timeInputRef = useRef<any>();

    const _dateParser = dateParser || defaultDateParser;
    const _allowDeselect = clearable || allowDeselect;

    const formatValue = (val: DateValue) => (val ? dateFormats[dateFormat!].format(val) : '');

    const [_value, setValue, controlled] = useUncontrolled({
      value,
      defaultValue,
      finalValue: null,
      onChange,
    });

    const [_date, setDate] = useUncontrolled({
      value: date,
      defaultValue: defaultValue || defaultDate,
      finalValue: null,
      onChange: onDateChange,
    });

    useEffect(() => {
      if (controlled) {
        setDate(value!);
      }
    }, [controlled, value]);

    const [inputValue, setInputValue] = useState(formatValue(_value));

    useEffect(() => {
      setInputValue(formatValue(_value));
    }, [ctx.getLocale(locale)]);

    const [dropdownOpened, setDropdownOpened] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const val = event.currentTarget.value;
      setInputValue(val);

      if (val.trim() === '' && _allowDeselect) {
        setValue(null);
      } else {
        const dateValue = _dateParser(val);
        if (isDateValid({ date: dateValue, minDate, maxDate })) {
          setValue(dateValue);
          setDate(dateValue);
        }
      }
    };

    const handleComplete = (maskValue) => {
      if (maskValue.trim() === '' && _allowDeselect) {
        setValue(null);
        onChange!(null);
      } else if (maskValue && maskValue.length === dateFormats[dateFormat!].mask.length) {
        const dateValue = dateFormats[dateFormat!].parse(maskValue);
        if (isDateValid({ date: dateValue, minDate, maxDate })) {
          setValue(dateValue);
          setDate(dateValue);
          onChange!(dateValue);
          !controlled && setInputValue(formatValue(dateValue));
        }
      }
    };

    const handleDateChange = (date: Date) => {
      setValue(assignTime(_value, date));
      timeInputRef.current?.focus();
    };

    const handleAccept = (_maskValue: string, maskRef) => {
      if (maskRef.masked.rawInputValue === '' && _allowDeselect) {
        setValue(null);
        setDate(null);
        !controlled && setInputValue('');
      }
    };

    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(event);
      setDropdownOpened(false);
      fixOnBlur && setInputValue(formatValue(_value));
    };

    const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(event);
      setDropdownOpened(true);
    };

    const handleInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
      onClick?.(event);
      setDropdownOpened(true);
    };

    const _getDayProps = (day: Date) => ({
      ...getDayProps?.(day),
      selected: dayjs(_value).isSame(day, 'day'),
      onClick: () => {
        const valueWithTime = preserveTime ? assignTime(_value, day) : day;
        const val = _allowDeselect ? (dayjs(_value).isSame(day, 'day') ? null : valueWithTime) : valueWithTime;
        setValue(val);
        !controlled && setInputValue(formatValue(val));
        setDropdownOpened(false);
      },
    });

    const _rightSection =
      rightSection ||
      (clearable && _value && !readOnly ? (
        <CloseButton
          variant="transparent"
          onMouseDown={(event) => event.preventDefault()}
          tabIndex={-1}
          onClick={() => {
            setValue(null);
            !controlled && setInputValue('');
          }}
          unstyled={unstyled}
          {...clearButtonProps}
        />
      ) : null);

    useDidUpdate(() => {
      value !== undefined && !dropdownOpened && setInputValue(formatValue(value));
    }, [value]);

    return (
      <>
        <Input.Wrapper {...wrapperProps}>
          <Popover
            opened={dropdownOpened}
            trapFocus={false}
            position="bottom-start"
            disabled={readOnly}
            withRoles={false}
            {...popoverProps}
          >
            <Popover.Target>
              <Input.Wrapper required={props.required} __staticSelector={ARCHBASE_DATETIME_PICKER_EDIT}>
                <Input<any>
                  data-dates-input
                  data-read-only={readOnly || undefined}
                  autoComplete="off"
                  ref={ref}
                  component={IMaskInput}
                  rightSection={_rightSection}
                  lazy={!showPlaceholderFormat}
                  placeholderChar={placeholderChar}
                  mask={dateFormats[dateFormat!].mask}
                  onBlur={handleInputBlur}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onComplete={handleComplete}
                  onChange={handleInputChange}
                  onAccept={handleAccept}
                  readOnly={readOnly}
                  value={inputValue}
                  {...inputProps}
                  {...others}
                  format={(date) => {
                    if (!date) return '';
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();

                    return [day, month, year].join('/');
                  }}
                  parse={(str) => {
                    const [day, month, year] = str.split('/');

                    return new Date(year, month - 1, day);
                  }}
                />
              </Input.Wrapper>
            </Popover.Target>
            <Popover.Dropdown onMouseDown={(event) => event.preventDefault()} data-dates-dropdown>
              <Calendar
                __staticSelector={ARCHBASE_DATETIME_PICKER_EDIT}
                {...calendarProps}
                classNames={classNames}
                styles={styles}
                unstyled={unstyled}
                __preventFocus
                minDate={minDate}
                maxDate={maxDate}
                locale={locale}
                getDayProps={_getDayProps}
                size={inputProps.size}
                date={_date ? _date : undefined}
                onDateChange={handleDateChange}
              />
            </Popover.Dropdown>
          </Popover>
          <HiddenDatesInput name={name ? name : ''} form={form ? form : ''} value={_value} type="default" />
        </Input.Wrapper>
      </>
    );
  },
);

ArchbaseDateTimePickerEdit.displayName = ARCHBASE_DATETIME_PICKER_EDIT;
