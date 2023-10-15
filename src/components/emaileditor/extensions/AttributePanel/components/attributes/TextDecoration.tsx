import React, { useMemo } from 'react';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { SelectField } from '../../../components/Form';
import { t } from 'i18next';

const options = [
  {
    value: '',
    get label() {
      return t('archbase:None');
    },
  },
  {
    value: 'underline',
    get label() {
      return t('archbase:Underline');
    },
  },
  {
    value: 'overline',
    get label() {
      return t('archbase:Overline');
    },
  },
  {
    value: 'line-through',
    get label() {
      return t('archbase:Line through');
    },
  },
  {
    value: 'blink',
    get label() {
      return t('archbase:Blink');
    },
  },
  {
    value: 'inherit',
    get label() {
      return t('archbase:Inherit');
    },
  },
];

export function TextDecoration({ name }: { name?: string }) {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return useMemo(() => {
    return (
      <SelectField
        label={t('archbase:Text decoration')}
        name={name || `${focusIdx}.attributes.text-decoration`}
        options={options}
      />
    );
  }, [focusIdx, name]);
}
