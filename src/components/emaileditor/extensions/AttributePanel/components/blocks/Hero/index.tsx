import React from 'react';
import { BackgroundColor } from '@emaileditor/extensions/AttributePanel/components/attributes/BackgroundColor';
import { ImageUploaderField, InputWithUnitField, RadioGroupField, TextField } from '@emaileditor/extensions/components/Form';
import { Width } from '@emaileditor/extensions/AttributePanel/components/attributes/Width';
import { Height } from '@emaileditor/extensions/AttributePanel/components/attributes/Height';
import { VerticalAlign } from '@emaileditor/extensions/AttributePanel/components/attributes/VerticalAlign';
import { Padding } from '@emaileditor/extensions/AttributePanel/components/attributes/Padding';
import { Collapse, Grid, Space } from '@arco-design/web-react';
import { useArchbaseEmailEditorProps, useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { AttributesPanelWrapper } from '@emaileditor/extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { t } from 'i18next';

const options = [
  {
    value: 'fluid-height',
    get label() {
      return t('archbase:Fluid height');
    },
  },
  {
    value: 'fixed-height',
    get label() {
      return t('archbase:Fixed height');
    },
  },
];

export function Hero() {
  const { focusIdx } = useArchbaseEmailFocusIdx();
  const { onUploadImage } = useArchbaseEmailEditorProps();

  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['0', '1', '2']}>
        <Collapse.Item
          name='0'
          header={t('archbase:Dimension')}
        >
          <Space direction='vertical'>
            <RadioGroupField
              label={t('archbase:Mode')}
              name={`${focusIdx}.attributes.mode`}
              options={options}
            />
            <Grid.Row>
              <Grid.Col span={11}>
                <Width />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <Height />
              </Grid.Col>
            </Grid.Row>

            <Padding />
            <VerticalAlign />
          </Space>
        </Collapse.Item>
        <Collapse.Item
          name='1'
          header={t('archbase:Background')}
        >
          <Space direction='vertical'>
            <ImageUploaderField
              label={t('archbase:src')}
              name={`${focusIdx}.attributes.background-url`}
              helpText={t(
                'The image suffix should be .jpg, jpeg, png, gif, etc. Otherwise, the picture may not be displayed normally.',
              )}
              uploadHandler={onUploadImage}
            />

            <Grid.Row>
              <Grid.Col span={11}>
                <InputWithUnitField
                  label={t('archbase:Background width')}
                  name={`${focusIdx}.attributes.background-width`}
                />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <InputWithUnitField
                  label={t('archbase:Background height')}
                  name={`${focusIdx}.attributes.background-height`}
                />
              </Grid.Col>
            </Grid.Row>

            <Grid.Row>
              <Grid.Col span={11}>
                <TextField
                  label={t('archbase:Background position')}
                  name={`${focusIdx}.attributes.background-position`}
                />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <InputWithUnitField
                  label={t('archbase:Border radius')}
                  name={`${focusIdx}.attributes.border-radius`}
                  unitOptions='percent'
                />
              </Grid.Col>
              <Grid.Col span={11}>
                <BackgroundColor />
              </Grid.Col>
            </Grid.Row>
          </Space>
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
