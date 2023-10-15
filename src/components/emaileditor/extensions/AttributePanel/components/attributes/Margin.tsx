import React, { useMemo } from 'react';
import { TextField } from '../../../components/Form';
import { useArchbaseEmailFocusIdx, Stack, TextStyle } from '@emaileditor/editor/index';
import { t } from 'i18next';

export function Margin() {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return useMemo(() => {
    return (
      <Stack vertical spacing='extraTight'>
        <TextStyle size='large'>{t('archbase:Margin')}</TextStyle>
        <Stack wrap={false}>
          <Stack.Item fill>
            <TextField
              label={t('archbase:Top')}
              quickchange
              name={`${focusIdx}.attributes.marginTop`}
              inline
            />
          </Stack.Item>
          <Stack.Item fill>
            <TextField
              label={t('archbase:Bottom')}
              quickchange
              name={`${focusIdx}.attributes.marginBottom`}
              inline
            />
          </Stack.Item>
        </Stack>

        <Stack wrap={false}>
          <Stack.Item fill>
            <TextField
              label={t('archbase:Left')}
              quickchange
              name={`${focusIdx}.attributes.marginLeft`}
              inline
            />
          </Stack.Item>
          <Stack.Item fill>
            <TextField
              label={t('archbase:Right')}
              quickchange
              name={`${focusIdx}.attributes.marginRight`}
              inline
            />
          </Stack.Item>
        </Stack>
      </Stack>
    );
  }, [focusIdx]);
}
