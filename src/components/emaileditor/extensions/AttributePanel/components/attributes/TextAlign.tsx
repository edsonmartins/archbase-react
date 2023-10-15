import React, { useMemo } from 'react';
import { useArchbaseEmailFocusIdx, Stack } from '@emaileditor/editor/index';
import { RadioGroupField } from '../../../components/Form';
import { t } from 'i18next';

const options = [
  {
    value: 'left',
    get label() {
      return t('archbase:Left');
    },
  },
  {
    value: 'center',
    get label() {
      return t('archbase:Center');
    },
  },
  {
    value: 'right',
    get label() {
      return t('archbase:Right');
    },
  },
];

export function TextAlign({ name }: { name?: string }) {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return useMemo(() => {
    return (
      <Stack>
        <RadioGroupField
          label={t('archbase:Text align')}
          name={name || `${focusIdx}.attributes.text-align`}
          options={options}
        />
      </Stack>
    );
  }, [focusIdx, name]);
}
