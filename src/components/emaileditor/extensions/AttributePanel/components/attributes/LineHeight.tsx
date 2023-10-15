import React from 'react';
import { InputWithUnitField } from '../../../components/Form';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { t } from 'i18next';

export function LineHeight({ name }: { name?: string; }) {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return (
    <InputWithUnitField
      label={t('archbase:Line height')}
      unitOptions='percent'
      name={name || `${focusIdx}.attributes.line-height`}
    />
  );
}
