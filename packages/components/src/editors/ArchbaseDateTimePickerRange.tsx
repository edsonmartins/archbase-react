import { Flex, Input, MantineSize } from '@mantine/core';
import { IconArrowRight, IconCalendar } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import { CSSProperties, ReactNode } from 'react';
import { ArchbaseDateTimePickerEdit } from './ArchbaseDateTimePickerEdit';
import type { ArchbaseDataSource } from '@archbase/data';

export interface ArchbaseDateTimePickerRangeProps<T, ID> {
  /** Data source where the range values will be assigned */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Field for start date in the data source */
  dataFieldStart?: string;
  /** Field for end date in the data source */
  dataFieldEnd?: string;
  /** Indicates if the date picker range is disabled */
  disabled?: boolean;
  /** Indicates if the date picker range is read-only */
  readOnly?: boolean;
  /** Indicates if filling the date picker range is required */
  required?: boolean;
  /** Initial value */
  value?: [Date | null, Date | null];
  /** Style of the date picker range */
  style?: CSSProperties;
  /** Size of the date picker range */
  size?: MantineSize;
  /** Width of the date picker range */
  width?: string | number | undefined;
  /** Custom right section icon */
  icon?: ReactNode;
  /** Placeholder text for start date */
  placeholderStart?: string;
  /** Placeholder text for end date */
  placeholderEnd?: string;
  /** Label for the date picker range */
  label?: string;
  /** Description for the date picker range */
  description?: string;
  /** Error message */
  error?: string;
  /** Event when range value changes */
  onRangeChange?: (value: [Date | null, Date | null]) => void;
  /** Event when key down */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Event when key up */
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Minimum date allowed */
  minDate?: Date;
  /** Maximum date allowed */
  maxDate?: Date;
  /** Date format */
  valueFormat?: string;
  /** With seconds input */
  withSeconds?: boolean;
  /** Clear button properties */
  clearButtonProps?: Record<string, any>;
}

export function ArchbaseDateTimePickerRange<T, ID>({
  dataSource,
  dataFieldStart,
  dataFieldEnd,
  label,
  disabled = false,
  readOnly = false,
  size,
  width,
  style,
  description,
  onRangeChange,
  placeholderStart,
  placeholderEnd,
  icon,
  error,
  value,
  minDate,
  maxDate,
  valueFormat = "DD/MM/YYYY HH:mm",
  withSeconds = false,
  clearButtonProps,
  required = false,
}: ArchbaseDateTimePickerRangeProps<T, ID>) {
  const [startDate, setStartDate] = useState<Date | null>(value?.[0] || null);
  const [endDate, setEndDate] = useState<Date | null>(value?.[1] || null);
  const [internalError, setInternalError] = useState<string | undefined>(error);

  useEffect(() => {
    setInternalError(error);
  }, [error]);

  useEffect(() => {
    if (value) {
      setStartDate(value[0]);
      setEndDate(value[1]);
    }
  }, [value]);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (onRangeChange) {
      onRangeChange([date, endDate]);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    if (onRangeChange) {
      onRangeChange([startDate, date]);
    }
  };

  const validateDateRange = (start: Date | null, end: Date | null): boolean => {
    if (start && end && start > end) {
      setInternalError('Data inicial não pode ser maior que a data final');
      return false;
    }
    setInternalError(undefined);
    return true;
  };

  return (
    <Input.Wrapper
      label={label}
      size={size}
      error={internalError}
      description={description}
      style={{
        width,
        ...style,
      }}
    >
      <Flex gap="sm" justify="flex-start" align="center" direction="row">
        <ArchbaseDateTimePickerEdit
          dataSource={dataSource}
          dataField={dataFieldStart}
          clearable
          rightSection={icon || <IconCalendar size="1rem" />}
          readOnly={readOnly}
          placeholder={placeholderStart}
          disabled={disabled}
          value={startDate}
          onChangeValue={handleStartDateChange}
          error={internalError}
          style={{ width: width ? width : 180 }}
          minDate={minDate}
          maxDate={endDate || maxDate}
          valueFormat={valueFormat}
          withSeconds={withSeconds}
          clearButtonProps={clearButtonProps}
          required={required}
          onChange={(value) => {
            if (validateDateRange(value, endDate)) {
              handleStartDateChange(value);
            }
          }}
        />
        <IconArrowRight size="1rem" />
        <ArchbaseDateTimePickerEdit
          dataSource={dataSource}
          dataField={dataFieldEnd}
          clearable
          rightSection={icon || <IconCalendar size="1rem" />}
          placeholder={placeholderEnd}
          readOnly={readOnly}
          disabled={disabled}
          value={endDate}
          onChangeValue={handleEndDateChange}
          error={internalError}
          style={{ width: width ? width : 180 }}
          minDate={startDate || minDate}
          maxDate={maxDate}
          valueFormat={valueFormat}
          withSeconds={withSeconds}
          clearButtonProps={clearButtonProps}
          required={required}
          onChange={(value) => {
            if (validateDateRange(startDate, value)) {
              handleEndDateChange(value);
            }
          }}
        />
      </Flex>
    </Input.Wrapper>
  );
}

ArchbaseDateTimePickerRange.displayName = 'ArchbaseDateTimePickerRange';
