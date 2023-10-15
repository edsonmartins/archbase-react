import React, { useMemo } from 'react';
import { useArchbaseEmailFocusIdx, Stack } from '@emaileditor/editor/index';
import { SelectField } from '../../../components/Form';
import { t } from 'i18next';

const options = [
  {
    value: 'top',
    get label() {
      return t('archbase:top');
    },
  },
  {
    value: 'middle',
    get label() {
      return t('archbase:middle');
    },
  },
  {
    value: 'bottom',
    get label() {
      return t('archbase:bottom');
    },
  },
];

export function VerticalAlign({
  attributeName = 'vertical-align',
}: {
  attributeName?: string;
}) {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return useMemo(() => {
    return (
      <Stack>
        <SelectField
          style={{ width: 120 }}
          label={t('archbase:Vertical align')}
          name={`${focusIdx}.attributes.${attributeName}`}
          options={options}
        />
      </Stack>
    );
  }, [attributeName, focusIdx]);
}
