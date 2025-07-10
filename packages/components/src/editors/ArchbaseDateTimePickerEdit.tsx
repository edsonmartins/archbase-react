import {
	DateTimePicker,
	DateTimePickerProps,
  } from '@mantine/dates';
  import { useForceUpdate } from '@mantine/hooks';
  import type { CSSProperties, FocusEventHandler, ForwardedRef } from 'react';
  import React, { useCallback, useEffect, useState } from 'react';
  import type { ArchbaseDataSource, DataSourceEvent } from '@archbase/data';
  import { DataSourceEventNames } from '@archbase/data';
  import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '@archbase/data';
  import { useArchbaseV1V2Compatibility } from '@archbase/data';
  
  type OmittedDateTimePickerProps = Omit<DateTimePickerProps, 'value' | 'onChange'>;
  
  export interface ArchbaseDateTimePickerEditProps<T, ID> extends OmittedDateTimePickerProps {
	/** Data source where the edit value will be assigned */
	dataSource?: ArchbaseDataSource<T, ID>;
	/** Field where the edit value should be assigned in the data source */
	dataField?: string;
	/** Indicates if the edit is disabled */
	disabled?: boolean;
	/** Indicates if the edit is read-only. Note: used in conjunction with data source status */
	readOnly?: boolean;
	/** Indicates if filling the edit is required */
	required?: boolean;
	/** Initial value */
	value?: Date | null;
	/** Edit style */
	style?: CSSProperties;
	/** Edit width */
	width?: string | number | undefined;
	/** Event occurs when focus exits the edit */
	onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Event occurs when the edit receives focus */
	onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Event when the edit value changes (internal use) */
	onChange?: (value: Date | null) => void;
	/** Event when the edit value changes (external use) */
	onChangeValue?: (value: Date | null) => void;
	/** Clear button properties */
	clearButtonProps?: Record<string, any>;
	/** With seconds input */
	withSeconds?: boolean;
	/** Value format */
	valueFormat?: string;
  }
  
  function ArchbaseDateTimePickerEditComponent<T, ID>({
	dataSource,
	dataField,
	disabled = false,
	readOnly = false,
	style,
	required,
	value,
	onFocusExit = () => {},
	onFocusEnter = () => {},
	onChange,
	onChangeValue = () => {},
	width,
	...rest
  }: ArchbaseDateTimePickerEditProps<T, ID>, ref: ForwardedRef<HTMLButtonElement>) {
	const [currentValue, setCurrentValue] = useState<Date | null>(value || null);
	const [internalError, setInternalError] = useState<string | undefined>(undefined);
	const forceUpdate = useForceUpdate();

	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
	const v1v2Compatibility = useArchbaseV1V2Compatibility<Date | null>(
		'ArchbaseDateTimePickerEdit',
		dataSource,
		dataField,
		null
	);

	// 🔄 MIGRAÇÃO V1/V2: Debug info para desenvolvimento
	if (process.env.NODE_ENV === 'development' && dataSource) {
		console.log(`[ArchbaseDateTimePickerEdit] DataSource version: ${v1v2Compatibility.dataSourceVersion}`);
	}
  
	useEffect(() => {
	  setInternalError(undefined);
	}, [currentValue]);
  
	const loadDataSourceFieldValue = () => {
	  let initialValue: Date | null = currentValue;
  
	  if (dataSource && dataField) {
		initialValue = dataSource.getFieldValue(dataField);
		if (!initialValue) {
		  initialValue = null;
		}
	  }
  
	  setCurrentValue(initialValue);
	};
  
	const fieldChangedListener = useCallback(() => {
	  loadDataSourceFieldValue();
	}, []);
  
	const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
	  if (dataSource && dataField) {
		if (
		  event.type === DataSourceEventNames.dataChanged ||
		  event.type === DataSourceEventNames.recordChanged ||
		  event.type === DataSourceEventNames.afterScroll ||
		  event.type === DataSourceEventNames.afterCancel ||
		  event.type === DataSourceEventNames.afterEdit
		) {
		  loadDataSourceFieldValue();
		  // 🔄 MIGRAÇÃO V1/V2: forceUpdate apenas para V1
		  if (!v1v2Compatibility.isDataSourceV2) {
			forceUpdate();
		  }
		}
  
		if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
		  setInternalError(event.error);
		}
	  }
	}, [v1v2Compatibility.isDataSourceV2]);
  
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
  
	const handleChange = (changedValue: string | null) => {
	  // Convert string to Date for internal use (maintaining compatibility)
	  const dateValue = changedValue ? new Date(changedValue) : null;
	  setCurrentValue(dateValue);
  
	  // 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
	  v1v2Compatibility.handleValueChange(dateValue);
  
	  if (onChange) {
		onChange(dateValue);
	  }
  
	  if (onChangeValue) {
		onChangeValue(dateValue);
	  }
	};
  
	useArchbaseWillUnmount(() => {
	  if (dataSource && dataField) {
		dataSource.removeListener(dataSourceEvent);
		dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
	  }
	});
  
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
	  // 🔄 MIGRAÇÃO V1/V2: Usar padrão de compatibilidade para isReadOnly
	  return v1v2Compatibility.isReadOnly(readOnly);
	};
  
	return (
	  <DateTimePicker
		{...rest}
		disabled={disabled}
		readOnly={isReadOnly()}
		value={currentValue ? currentValue.toISOString() : null}
		onChange={handleChange}
		onBlur={handleOnFocusExit}
		onFocus={handleOnFocusEnter}
		ref={ref}
		required={required}
		error={internalError}
		style={{
		  width,
		  ...style,
		}}
	  />
	);
  }
  
  export const ArchbaseDateTimePickerEdit = React.forwardRef(
	<T, ID>(
	  props: ArchbaseDateTimePickerEditProps<T, ID>,
	  ref: ForwardedRef<HTMLButtonElement>
	) => ArchbaseDateTimePickerEditComponent<T, ID>({ ...props }, ref)
  ) as <T, ID>(
	props: ArchbaseDateTimePickerEditProps<T, ID> & { ref?: ForwardedRef<HTMLButtonElement> }
  ) => React.JSX.Element;
  
  (ArchbaseDateTimePickerEdit as any).displayName = 'ArchbaseDateTimePickerEdit';
