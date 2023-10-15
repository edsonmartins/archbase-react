import React, { useMemo } from 'react';
import { useFocusIdx } from '@emaileditor/editor/index';
import { TextField } from '../../../components/Form';

export function BorderWidth() {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      <TextField
        label={t('Width')}
        quickchange
        name={`${focusIdx}.attributes.border-width`}
      />
    );
  }, [focusIdx]);
}
