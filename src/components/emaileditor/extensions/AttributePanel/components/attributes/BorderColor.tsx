import React, { useMemo } from 'react';
import { ColorPickerField } from '../../../components/Form';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { t } from 'i18next';

export function BorderColor() {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return useMemo(() => {
    return (
      <ColorPickerField
        label={t('archbase:Color')}
        name={`${focusIdx}.attributes.border-color`}
      />
    );
  }, [focusIdx]);
}
