import React from 'react';
import { Padding } from '../../attributes/Padding';

import { BackgroundColor } from '../../attributes/BackgroundColor';
import { Color } from '../../attributes/Color';
import { TextAreaField } from '../../../../components/Form';
import { FontSize } from '../../attributes/FontSize';
import { FontWeight } from '../../attributes/FontWeight';
import { FontFamily } from '../../attributes/FontFamily';
import { AttributesPanelWrapper } from '../../attributes/AttributesPanelWrapper';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { Collapse, Grid, Space } from '@arco-design/web-react';
import { t } from 'i18next';

export function AccordionTitle() {
  const { focusIdx } = useArchbaseEmailFocusIdx();
  return (
    <AttributesPanelWrapper>
      <Collapse defaultActiveKey={['0', '1', '2']}>
        <Collapse.Item name='0' header={t('archbase:Setting')}>
          <Space direction='vertical'>
            <TextAreaField
              label={t('archbase:Content')}
              name={`${focusIdx}.data.value.content`}
            />

            <Grid.Row>
              <Grid.Col span={11}>
                <Color />
              </Grid.Col>
              <Grid.Col offset={1} span={11}>
                <BackgroundColor />
              </Grid.Col>
            </Grid.Row>

            <Grid.Row>
              <Grid.Col span={11}>
                <FontSize />
              </Grid.Col>
              <Grid.Col offset={1} span={11}>
                <FontFamily />
              </Grid.Col>
            </Grid.Row>

            <Grid.Row>
              <Grid.Col span={11}>
                <FontWeight />
              </Grid.Col>
              <Grid.Col offset={1} span={11} />
            </Grid.Row>

            <Padding title={t('archbase:Padding')} attributeName='padding' />
          </Space>
        </Collapse.Item>
      </Collapse>
    </AttributesPanelWrapper>
  );
}
