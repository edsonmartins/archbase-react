import React from 'react';
import { ColorPickerField } from '../../../components/Form';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { t } from 'i18next';

export function Color({ title = t('archbase:Color') }: { title?: string; inline?: boolean }) {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return (
    <ColorPickerField
      label={title}
      name={`${focusIdx}.attributes.color`}
    />
  );
}
