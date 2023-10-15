import React, { useMemo } from 'react';
import { useArchbaseEmailFocusIdx, Stack } from '@emaileditor/editor/index';
import { RadioGroupField } from '../../../components/Form';
import { t } from 'i18next';

const options = [
  {
    value: 'ltr',
    get label() {
      return t('archbase:ltr');
    },
  },
  {
    value: 'rtl',
    get label() {
      return t('archbase:rtl');
    },
  },
];

export function Direction() {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return useMemo(() => {
    return (
      <Stack>
        <RadioGroupField
          label={t('archbase:Direction')}
          name={`${focusIdx}.attributes.direction`}
          options={options}
          inline
        />
      </Stack>
    );
  }, [focusIdx]);
}
