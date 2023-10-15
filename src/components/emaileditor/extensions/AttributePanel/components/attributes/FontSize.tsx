import React from 'react';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { InputWithUnitField } from '../../../components/Form';
import { pixelAdapter } from '../adapter';
import { t } from 'i18next';

export function FontSize() {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return (
    <InputWithUnitField
      label={t('archbase:Font size (px)')}
      name={`${focusIdx}.attributes.font-size`}
      config={pixelAdapter}
      autoComplete='off'
    />
  );
}
