import React from 'react';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { RadioGroupField } from '../../../components/Form';
import { t } from 'i18next';

const options = [
  {
    value: 'left',
    get label() {
      return t('archbase:left');
    },
  },
  {
    value: 'center',
    get label() {
      return t('archbase:center');
    },
  },
  {
    value: 'right',
    get label() {
      return t('archbase:right');
    },
  },
];

export function Align({ inline }: { inline?: boolean }) {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return (
    <RadioGroupField
      label={t('archbase:Align')}
      name={`${focusIdx}.attributes.align`}
      options={options}
    />
  );
}
