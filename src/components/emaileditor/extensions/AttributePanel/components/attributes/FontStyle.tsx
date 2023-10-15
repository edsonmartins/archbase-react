import React from 'react';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { RadioGroupField } from '../../../components/Form';
import { t } from 'i18next';

const options = [
  {
    value: 'normal',
    get label() {
      return t('archbase:Normal');
    },
  },
  {
    value: 'italic',
    get label() {
      return t('archbase:Italic');
    },
  },
];

export function FontStyle({ name }: { name?: string }) {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return (
    <RadioGroupField
      label={t('archbase:Font style')}
      name={name || `${focusIdx}.attributes.font-style`}
      options={options}
    />
  );
}
