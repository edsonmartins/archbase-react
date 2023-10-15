import React, { useMemo } from 'react';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { IconLink } from '@arco-design/web-react/icon';
import { SelectField, TextField } from '../../../components/Form';
import { Grid } from '@arco-design/web-react';
import { t } from 'i18next';

export function Link() {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return useMemo(() => {
    return (
      <Grid.Row>
        <Grid.Col span={11}>
          <TextField
            prefix={<IconLink />}
            label={<span>{t('archbase:Href')}&nbsp;&nbsp;&nbsp;</span>}
            name={`${focusIdx}.attributes.href`}
          />
        </Grid.Col>
        <Grid.Col offset={1} span={11}>
          <SelectField
            label={t('archbase:Target')}
            name={`${focusIdx}.attributes.target`}
            options={[
              {
                value: '',
                label: t('archbase:_self'),
              },
              {
                value: '_blank',
                label: t('archbase:_blank'),
              },
            ]}
          />
        </Grid.Col>
      </Grid.Row>
    );
  }, [focusIdx]);
}
