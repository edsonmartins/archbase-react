import React, { useMemo } from 'react';
import { TextField } from '../../../components/Form';
import { useArchbaseEmailFocusIdx, Stack } from '@emaileditor/editor/index';
import { UseFieldConfig } from 'react-final-form';
import { t } from 'i18next';

export function Height({
  inline,
  config,
}: {
  inline?: boolean;
  config?: UseFieldConfig<any>;
}) {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return useMemo(() => {
    return (
      <Stack wrap={false}>
        <Stack.Item fill>
          <TextField
            label={t('archbase:Height')}
            name={`${focusIdx}.attributes.height`}
            quickchange
            inline={inline}
            config={config}
          />
        </Stack.Item>
      </Stack>
    );
  }, [focusIdx, inline]);
}
