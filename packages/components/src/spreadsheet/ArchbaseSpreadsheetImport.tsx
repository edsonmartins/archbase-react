import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Button, Group, Text, Stack, Paper, Progress, Alert } from '@mantine/core';
import { useArchbaseTranslation } from '@archbase/core';
import { ReactSpreadsheetImport } from 'react-spreadsheet-import';
import type {
  ArchbaseSpreadsheetImportProps,
  SpreadsheetField,
  SpreadsheetRow,
} from './ArchbaseSpreadsheetImport.types';

type RsiField = {
  label: string;
  key: string;
  description?: string;
  alternateMatches?: string[];
  validations?: any[];
  fieldType: { type: 'input' } | { type: 'checkbox'; booleanMatches?: { [key: string]: boolean } } | { type: 'select'; options: { label: string; value: string }[] };
  example?: string;
};

function convertFieldToRsi(field: SpreadsheetField): RsiField {
  const baseField: RsiField = {
    label: field.label,
    key: field.key,
    fieldType: { type: 'input' },
  };

  if (field.fieldType === 'boolean') {
    baseField.fieldType = { type: 'checkbox' };
  } else if (field.fieldType === 'select' && field.options) {
    baseField.fieldType = {
      type: 'select',
      options: field.options.map((opt) => ({ label: opt, value: opt })),
    };
  }

  // Add validations
  if (field.validations) {
    baseField.validations = [];

    if (field.validations.pattern) {
      baseField.validations!.push({
        rule: 'regex',
        value: field.validations.pattern,
        errorMessage: 'Invalid format',
      });
    }
  }

  return baseField;
}

export function ArchbaseSpreadsheetImport<T = any>({
  dataSource,
  onDataLoaded,
  onRowAdded,
  fields,
  isOpen = true,
  onClose,
  title,
  description,
  allowedFileTypes = ['csv', 'xlsx', 'xls'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxRows = 1000,
  customHeaderComponent,
  customButtonComponent,
  translations,
  style,
  className,
  disabled = false,
  initialData,
  mapRows,
  validationCallback,
}: ArchbaseSpreadsheetImportProps<T>) {
  const { t } = useArchbaseTranslation();
  const [isOpenState, setIsOpenState] = useState(isOpen);
  const [step, setStep] = useState<'upload' | 'review' | 'complete'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [resultData, setResultData] = useState<{ validCount: number; invalidCount: number } | null>(null);

  const rsiFields = useMemo(() => {
    if (!fields) return undefined;

    return fields.map(convertFieldToRsi) as RsiField[];
  }, [fields]);

  const defaultFields = useMemo<RsiField[]>(() => {
    if (rsiFields) return rsiFields;

    return [
      { label: 'Column 1', key: 'column1', fieldType: { type: 'input' }, validations: [{ rule: 'required' }] },
      { label: 'Column 2', key: 'column2', fieldType: { type: 'input' } },
      { label: 'Column 3', key: 'column3', fieldType: { type: 'input' } },
    ];
  }, [rsiFields]);

  const rsiTranslations = useMemo(() => ({
    uploadStep: {
      title: translations?.uploadStep || String(t('Import Spreadsheet')),
      description: translations?.dragDrop || String(t('Drag and drop your file here')),
      fileFormatError: translations?.supportedFormats || String(t('Supported formats: CSV, XLSX, XLS')),
      maxSizeError: `File size exceeds ${maxFileSize} bytes`,
    },
    selectHeaderStep: {
      title: String(t('Select File')),
      description: String(t('Upload File')),
    },
    matchColumnsStep: {
      title: translations?.reviewStep || String(t('Review Data')),
      description: translations?.reviewDescription || String(t('Review and edit your data before importing')),
    },
    validationStep: {
      title: translations?.confirmStep || String(t('Confirm Import')),
      description: translations?.confirmDescription || String(t('Confirm the data to be imported')),
    },
  }), [translations, t, maxFileSize]);

  const handleClose = useCallback(() => {
    setIsOpenState(false);
    setStep('upload');
    setResultData(null);
    setErrors([]);
    onClose?.();
  }, [onClose]);

  const handleSubmit = useCallback(async (data: any, file: File) => {
    setIsProcessing(true);
    setStep('complete');

    try {
      // Combine valid and invalid data
      const allData = [...data.validData, ...data.invalidData];

      // Map rows if mapper provided
      const mappedData = mapRows ? mapRows(allData as SpreadsheetRow[]) : (allData as unknown[] as T[]);

      // Add to data source if provided
      if (dataSource && mappedData.length > 0) {
        for (const row of mappedData) {
          onRowAdded?.(row);
        }
      }

      // Set result data
      setResultData({
        validCount: data.validData.length,
        invalidCount: data.invalidData.length,
      });

      // Callback with loaded data
      onDataLoaded?.(mappedData);

      setIsProcessing(false);
    } catch (error) {
      setErrors([String(error)]);
      setIsProcessing(false);
    }
  }, [mapRows, dataSource, onRowAdded, onDataLoaded]);

  const controlledIsOpen = isOpen !== undefined ? isOpen : isOpenState;

  return (
    <Modal
      opened={controlledIsOpen}
      onClose={handleClose}
      size={step === 'complete' ? 'md' : 'xl'}
      title={title || String(t('Import Spreadsheet'))}
      style={style}
      className={className}
    >
      <Stack gap="md">
        {description && <Text size="sm">{description}</Text>}

        {errors.length > 0 && (
          <Alert color="red" title={String(t('Error'))}>
            {errors.map((error, i) => (
              <Text key={i} size="sm">{error}</Text>
            ))}
          </Alert>
        )}

        {isProcessing && (
          <Progress value={undefined} size="sm" />
        )}

        {step === 'complete' && resultData ? (
          <Stack align="center" gap="md">
            <Text size="lg" fw={500}>
              {resultData.validCount} {String(t('rows imported'))}
            </Text>
            {resultData.invalidCount > 0 && (
              <Text size="sm" c="orange">
                {resultData.invalidCount} {String(t('rows skipped'))}
              </Text>
            )}
            <Button onClick={handleClose}>
              {translations?.closeButton || String(t('Close'))}
            </Button>
          </Stack>
        ) : (
          <ReactSpreadsheetImport
            isOpen={controlledIsOpen}
            onClose={handleClose}
            onSubmit={handleSubmit}
            fields={defaultFields}
            translations={rsiTranslations}
            maxRecords={maxRows}
            maxFileSize={maxFileSize}
          />
        )}
      </Stack>
    </Modal>
  );
}

// Export types
export type {
  ArchbaseSpreadsheetImportProps,
  SpreadsheetField,
  SpreadsheetRow,
  SpreadsheetFileType,
} from './ArchbaseSpreadsheetImport.types';
