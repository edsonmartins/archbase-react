import React, { useMemo } from 'react';
import { NumberField, TextField } from '../../../components/Form';
import { useArchbaseEmailFocusIdx, Stack, TextStyle } from '@emaileditor/editor/index';
import { t } from 'i18next';

export function Decoration() {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return useMemo(() => {
    return (
      <Stack
        key={focusIdx}
        vertical
        spacing='extraTight'
      >
        <TextStyle
          variation='strong'
          size='large'
        >
          Decoration
        </TextStyle>
        <TextField
          label={t('archbase:Border radius')}
          name={`${focusIdx}.attributes.borderRadius`}
          inline
        />
        <TextField
          label={t('archbase:Border')}
          name={`${focusIdx}.attributes.border`}
          inline
        />
        <NumberField
          label={t('archbase:Opacity')}
          max={1}
          min={0}
          step={0.1}
          name={`${focusIdx}.attributes.opacity`}
          inline
        />
      </Stack>
    );
  }, [focusIdx]);
}
