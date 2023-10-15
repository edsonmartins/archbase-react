import React, { useMemo } from 'react';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { SelectField } from '../../../components/Form';
import { t } from 'i18next';

export const borderStyleOptions = [
  {
    value: 'dashed',
    get label() {
      return t('archbase:Dashed');
    },
  },
  {
    value: 'dotted',
    get label() {
      return t('archbase:Dotted');
    },
  },
  {
    value: 'solid',
    get label() {
      return t('archbase:Solid');
    },
  },
  {
    value: 'double',
    get label() {
      return t('archbase:double');
    },
  },
  {
    value: 'ridge',
    get label() {
      return t('archbase:ridge');
    },
  },
  {
    value: 'groove',
    get label() {
      return t('archbase:groove');
    },
  },
  {
    value: 'inset',
    get label() {
      return t('archbase:inset');
    },
  },
  {
    value: 'outset',
    get label() {
      return t('archbase:outset');
    },
  },
];

export function BorderStyle() {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return useMemo(() => {
    return (
      <SelectField
        label={t('archbase:Style')}
        name={`${focusIdx}.attributes.border-style`}
        options={borderStyleOptions}
      />
    );
  }, [focusIdx]);
}
