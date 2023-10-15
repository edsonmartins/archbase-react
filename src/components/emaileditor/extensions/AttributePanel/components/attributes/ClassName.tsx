import React, { useMemo } from 'react';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { TextField } from '../../../components/Form';
import { t } from 'i18next';

export function ClassName() {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return useMemo(() => {
    return (
      <TextField label={t('archbase:Class name')} name={`${focusIdx}.attributes.css-class`} />
    );
  }, [focusIdx]);
}
