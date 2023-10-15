import React, { useMemo } from 'react';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { TextField } from '../../../components/Form';
import { t } from 'i18next';

export function BorderWidth() {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return useMemo(() => {
    return (
      <TextField
        label={t('archbase:Width')}
        quickchange
        name={`${focusIdx}.attributes.border-width`}
      />
    );
  }, [focusIdx]);
}
