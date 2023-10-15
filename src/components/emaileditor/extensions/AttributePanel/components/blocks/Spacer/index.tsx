import React from 'react';
import { Height } from '@emaileditor/extensions/AttributePanel/components/attributes/Height';
import { ContainerBackgroundColor } from '@emaileditor/extensions/AttributePanel/components/attributes/ContainerBackgroundColor';
import { Padding } from '@emaileditor/extensions/AttributePanel/components/attributes/Padding';
import { AttributesPanelWrapper } from '@emaileditor/extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Collapse, Grid, Space } from '@arco-design/web-react';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { t } from 'i18next';

export function Spacer() {
  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['-1', '0', '1', '2', '3']}>
        <Collapse.Item name='1' header={t('archbase:Dimension')}>
          <Space direction='vertical'>
            <Height />
            <Padding />
          </Space>
        </Collapse.Item>

        <Collapse.Item name='2' header={t('archbase:Background')}>
          <ContainerBackgroundColor title={t('archbase:Background color')} />
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
