import React from 'react';
import { Padding } from '@emaileditor/extensions/AttributePanel/components/attributes/Padding';
import {
  ColorPickerField,
  ImageUploaderField,
  SwitchField,
  TextField,
} from '@emaileditor/extensions/components/Form';
import { Width } from '@emaileditor/extensions/AttributePanel/components/attributes/Width';
import { Height } from '@emaileditor/extensions/AttributePanel/components/attributes/Height';
import { Link } from '@emaileditor/extensions/AttributePanel/components/attributes/Link';
import { Align } from '@emaileditor/extensions/AttributePanel/components/attributes/Align';

import { AttributesPanelWrapper } from '@emaileditor/extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Collapse, Grid, Space } from '@arco-design/web-react';
import { Border } from '@emaileditor/extensions/AttributePanel/components/attributes/Border';
import { Stack, useArchbaseEmailEditorProps, useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { imageHeightAdapter, pixelAdapter } from '../../adapter';
import { t } from 'i18next';

const fullWidthOnMobileAdapter = {
  format(obj: any) {
    return Boolean(obj);
  },
  parse(val: string) {
    if (!val) return undefined;

    return 'true';
  },
};

export function Image() {
  const { focusIdx } = useArchbaseEmailFocusIdx();
  const { onUploadImage } = useArchbaseEmailEditorProps();

  return (
    <AttributesPanelWrapper style={{ padding: 0 }}>
      <CollapseWrapper defaultActiveKey={['0', '1', '2', '3', '4']}>
        <Collapse.Item
          name='1'
          header={t('archbase:Setting')}
        >
          <Stack
            vertical
            spacing='tight'
          >
            <ImageUploaderField
              label={t('archbase:src')}
              labelHidden
              name={`${focusIdx}.attributes.src`}
              helpText={t(
                'The image suffix should be .jpg, jpeg, png, gif, etc. Otherwise, the picture may not be displayed normally.',
              )}
              uploadHandler={onUploadImage}
            />
            <ColorPickerField
              label={t('archbase:Background color')}
              name={`${focusIdx}.attributes.container-background-color`}
              inline
            />
            <SwitchField
              label={t('archbase:Full width on mobile')}
              name={`${focusIdx}.attributes.fluid-on-mobile`}
              config={fullWidthOnMobileAdapter}
            />
          </Stack>
        </Collapse.Item>

        <Collapse.Item
          name='0'
          header={t('archbase:Dimension')}
        >
          <Space direction='vertical'>
            <Grid.Row>
              <Grid.Col span={11}>
                <Width config={pixelAdapter} />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <Height config={imageHeightAdapter} />
              </Grid.Col>
            </Grid.Row>

            <Padding showResetAll />
            <Grid.Row>
              <Grid.Col span={24}>
                <Align />
              </Grid.Col>
            </Grid.Row>
          </Space>
        </Collapse.Item>

        <Collapse.Item
          name='2'
          header={t('archbase:Link')}
        >
          <Stack
            vertical
            spacing='tight'
          >
            <Link />
          </Stack>
        </Collapse.Item>

        <Collapse.Item
          name='3'
          header={t('archbase:Border')}
        >
          <Border />
        </Collapse.Item>

        <Collapse.Item
          name='4'
          header={t('archbase:Extra')}
        >
          <Grid.Row>
            <Grid.Col span={11}>
              <TextField
                label={t('archbase:title')}
                name={`${focusIdx}.attributes.title`}
              />
            </Grid.Col>
            <Grid.Col
              offset={1}
              span={11}
            >
              <TextField
                label={t('archbase:alt')}
                name={`${focusIdx}.attributes.alt`}
              />
            </Grid.Col>
          </Grid.Row>
          <Grid.Col span={24}>
            <TextField
              label={t('archbase:class name')}
              name={`${focusIdx}.attributes.css-class`}
            />
          </Grid.Col>
        </Collapse.Item>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}
