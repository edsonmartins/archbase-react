import React from 'react';

import { Collapse, Grid, Space } from '@arco-design/web-react';
import { AttributesPanelWrapper } from '@emaileditor/extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Padding } from '@emaileditor/extensions/AttributePanel/components/attributes/Padding';
import { Width } from '@emaileditor/extensions/AttributePanel/components/attributes/Width';
import { VerticalAlign } from '@emaileditor/extensions/AttributePanel/components/attributes/VerticalAlign';
import { Background } from '@emaileditor/extensions/AttributePanel/components/attributes/Background';
import { Border } from '@emaileditor/extensions/AttributePanel/components/attributes/Border';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { BackgroundColor } from '../../attributes';
import { t } from 'i18next';

export function Column() {
  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['0', '1', '2']}>
        <Collapse.Item
          name='0'
          header={t('archbase:Dimension')}
        >
          <Space direction='vertical'>
            <Grid.Row>
              <Grid.Col span={11}>
                <Width />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <VerticalAlign />
              </Grid.Col>
            </Grid.Row>

            <Padding />
          </Space>
        </Collapse.Item>
        <Collapse.Item
          name='1'
          header={t('archbase:Background')}
        >
          <BackgroundColor />
        </Collapse.Item>
        <Collapse.Item
          name='2'
          header={t('archbase:Border')}
        >
          <Border />
        </Collapse.Item>
        <Collapse.Item
          name='4'
          header={t('archbase:Extra')}
        >
          <Grid.Col span={24}>
            <ClassName />
          </Grid.Col>
        </Collapse.Item>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}
