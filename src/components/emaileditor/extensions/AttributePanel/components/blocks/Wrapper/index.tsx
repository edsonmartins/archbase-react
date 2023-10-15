import React from 'react';
import { Padding } from '@emaileditor/extensions/AttributePanel/components/attributes//Padding';
import { Background } from '@emaileditor/extensions/AttributePanel/components/attributes//Background';
import { TextField } from '@emaileditor/extensions/components/Form';
import { AttributesPanelWrapper } from '@emaileditor/extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Collapse, Grid } from '@arco-design/web-react';
import { Stack, useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { t } from 'i18next';

export function Wrapper() {
  const { focusIdx } = useArchbaseEmailFocusIdx();
  return (
    <AttributesPanelWrapper style={{ padding: 0 }}>
      <CollapseWrapper defaultActiveKey={['0', '1', '2']}>
        <Collapse.Item name='0' header={t('archbase:Dimension')}>
          <Stack vertical spacing='tight'>
            <Padding />
          </Stack>
        </Collapse.Item>
        <Collapse.Item name='1' header={t('archbase:Background')}>
          <Stack vertical spacing='tight'>
            <Background />
          </Stack>
        </Collapse.Item>
        <Collapse.Item name='2' header={t('archbase:Border')}>
          <Stack vertical spacing='tight'>
            <TextField
              label={t('archbase:Border')}
              name={`${focusIdx}.attributes.border`}
              inline
            />
            <TextField
              label={t('archbase:Background border radius')}
              name={`${focusIdx}.attributes.border-radius`}
              inline
            />
          </Stack>
        </Collapse.Item>
        <Collapse.Item name='4' header={t('archbase:Extra')}>
          <Grid.Col span={24}>
            <ClassName />
          </Grid.Col>
        </Collapse.Item>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}
