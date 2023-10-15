import React from 'react';
import { InputWithUnitField } from '../../../components/Form';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { t } from 'i18next';

export function LetterSpacing({ name }: { name?: string; }) {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return (
    <InputWithUnitField
      label={t('archbase:Letter spacing')}
      name={name || `${focusIdx}.attributes.letter-spacing`}
    />
  );
}
