import React, { useCallback, useState } from 'react';
import { ArchbaseSelect, ArchbaseSelectProps } from './ArchbaseSelect';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '../../components/datasource';
import { ArchbaseError } from '../../components/core';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../../components/hooks';
import { SelectItem } from '@mantine/core';

export interface ArchbaseLookupSelectProps<T, ID, O> extends ArchbaseSelectProps<T, ID, O> {
  lookupDataSource: ArchbaseDataSource<O, ID> | undefined;
  lookupDataFieldText: string | ((record: any) => string);
  lookupDataFieldId: string;
  simpleValue?: boolean;
  options?: Array<SelectItem> | undefined;
}

const getTextValue = (lookupDataFieldText: string | ((record: any) => string), record: any) => {
  if (typeof lookupDataFieldText === 'function') {
    return lookupDataFieldText(record);
  } else {
    return record[lookupDataFieldText];
  }
};

function rebuildOptions<_T,ID,O>(lookupDataSource: ArchbaseDataSource<O, ID> | undefined,
  lookupDataFieldText: string | ((record: any) => string),
  lookupDataFieldId: string): SelectItem[] | undefined {
  let options: SelectItem[] = [];
  if (lookupDataSource && lookupDataSource.getTotalRecords() > 0) {
    lookupDataSource.browseRecords().map((record: any) => {
      if (!record.hasOwnProperty(lookupDataFieldId) || !record[lookupDataFieldId]) {
        throw new ArchbaseError('Foi encontrado um registro sem ID no dataSource passado para o Select.');
      }
      if (typeof lookupDataFieldText !== 'function') {
        if (!record.hasOwnProperty(lookupDataFieldText) || !record[lookupDataFieldText]) {
          throw new ArchbaseError('Foi encontrado um registro sem o texto no dataSource passado para a Select.');
        }
      }

      options.push({
        label: record.label ? record.label : getTextValue(lookupDataFieldText, record),
        disabled: record.disabled,
        value: record[lookupDataFieldId],
      });
    });
  }

  return options;
}

export function ArchbaseLookupSelect<T, ID, O>({
  lookupDataSource,
  lookupDataFieldText,
  lookupDataFieldId,
  simpleValue,
  children,
  dataSource,
  dataField,
  options,
  ...otherProps
}: ArchbaseLookupSelectProps<T, ID, O>) {
  const [currentOptions, setCurrentOptions] = useState<SelectItem[] | undefined>(() => rebuildOptions(lookupDataSource,
    lookupDataFieldText,
    lookupDataFieldId));

  const lookupDataSourceEvent = useCallback((event: DataSourceEvent<O>) => {
    if (dataSource && dataField) {
      if (
        event.type === DataSourceEventNames.dataChanged ||
        event.type === DataSourceEventNames.fieldChanged ||
        event.type === DataSourceEventNames.recordChanged ||
        event.type === DataSourceEventNames.afterScroll ||
        event.type === DataSourceEventNames.afterCancel
      ) {
        if (lookupDataSource) {
          setCurrentOptions(rebuildOptions(lookupDataSource,
            lookupDataFieldText,
            lookupDataFieldId));
        }
      }
    }
  }, []);


  const getDataSourceFieldValue = () => {
    let result = '';
    if (dataSource && dataField) {
      result = dataSource.getFieldValue(dataField);
      if (result && !simpleValue) {
        if (typeof lookupDataFieldText === 'function') {
          result = lookupDataFieldText(dataSource.getCurrentRecord());
        } else {
          result = result[lookupDataFieldId];
        }
      } else if (!result) {
        result = '';
      }
    }
    return result;
  };

  const setDataSourceFieldValue = (value: any) => {
    if (value !== undefined && value !== '') {
      if (
        dataField &&
        lookupDataSource &&
        lookupDataFieldId &&
        lookupDataSource.locate({
          [lookupDataFieldId]: value,
        })
      ) {
        if (dataSource) {
          if (!simpleValue) {
            dataSource.setFieldValue(dataField, lookupDataSource.getCurrentRecord());
          } else {
            dataSource.setFieldValue(dataField, value);
          }
        }
      }
    } else {
      if (dataSource && dataField) {
        dataSource.setFieldValue(dataField, null);
      }
    }
  };

  useArchbaseDidMount(() => {
    setCurrentOptions(rebuildOptions(lookupDataSource,
      lookupDataFieldText,
      lookupDataFieldId,));
    if (lookupDataSource) {
      lookupDataSource.addListener(lookupDataSourceEvent);
    }
  });

  useArchbaseDidUpdate(() => {
    setCurrentOptions(rebuildOptions(lookupDataSource,
      lookupDataFieldText,
      lookupDataFieldId,));
  }, []);

  useArchbaseWillUnmount(() => {
    if (lookupDataSource) {
      lookupDataSource.removeListener(lookupDataSourceEvent);
    }
  });

  return (
    <ArchbaseSelect
      {...otherProps}
      dataSource={dataSource}
      dataField={dataField}
      customGetDataSourceFieldValue={getDataSourceFieldValue}
      customSetDataSourceFieldValue={setDataSourceFieldValue}
      data={currentOptions}
    >
      {children}
    </ArchbaseSelect>
  );
}
