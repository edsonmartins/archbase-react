import React from 'react';
import { useFocusIdx } from '@emaileditor/editor/index';
import { InputWithUnitField } from '../../../components/Form';
import { pixelAdapter } from '../adapter';

export function FontSize() {
  const { focusIdx } = useFocusIdx();

  return (
    <InputWithUnitField
      label={t('Font size (px)')}
      name={`${focusIdx}.attributes.font-size`}
      config={pixelAdapter}
      autoComplete='off'
    />
  );
}
