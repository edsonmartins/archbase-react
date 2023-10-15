import React from 'react';
import { InputWithUnitField } from '../../../components/Form';
import { useFocusIdx } from '@emaileditor/editor/index';

export function LetterSpacing({ name }: { name?: string; }) {
  const { focusIdx } = useFocusIdx();

  return (
    <InputWithUnitField
      label={t('Letter spacing')}
      name={name || `${focusIdx}.attributes.letter-spacing`}
    />
  );
}
