import React, { useMemo } from 'react';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { SelectField } from '../../../components/Form';
import { t } from 'i18next';

const options = [
  {
    value: 'initial',
    get label() {
      return t('archbase:None');
    },
  },
  {
    value: 'uppercase',
    get label() {
      return t('archbase:uppercase');
    },
  },
  {
    value: 'lowercase',
    get label() {
      return t('archbase:lowercase');
    },
  },
  {
    value: 'capitalize',
    get label() {
      return t('archbase:capitalize');
    },
  },
];

export function TextTransform({ name }: { name?: string }) {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return useMemo(() => {
    return (
      <SelectField
        label={t('archbase:Text transform')}
        name={name || `${focusIdx}.attributes.text-transform`}
        options={options}
      />
    );
  }, [focusIdx, name]);
}
