import React, { useMemo } from 'react';
import { InputWithUnitField, TextField } from '../../../components/Form';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { Grid } from '@arco-design/web-react';
import { t } from 'i18next';

export function Border() {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return useMemo(() => {
    return (
      <Grid.Row>
        <Grid.Col span={11}>
          <TextField label={t('archbase:Border')} name={`${focusIdx}.attributes.border`} />
        </Grid.Col>
        <Grid.Col offset={1} span={11}>
          <InputWithUnitField
            label={t('archbase:Border radius')}
            name={`${focusIdx}.attributes.border-radius`}
            unitOptions='percent'
          />
        </Grid.Col>
      </Grid.Row>
    );
  }, [focusIdx]);
}
