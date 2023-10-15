import React from 'react';
import { useArchbaseEmailEditorProps, useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { AttributesPanelWrapper } from '@emaileditor/extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { BackgroundColor } from '@emaileditor/extensions/AttributePanel/components/attributes/BackgroundColor';
import { FontFamily } from '@emaileditor/extensions/AttributePanel/components/attributes/FontFamily';
import { Padding } from '@emaileditor/extensions/AttributePanel/components/attributes/Padding';
import {
  ImageUploaderField,
  InputWithUnitField,
  RadioGroupField,
  SelectField,
  TextField,
} from '@emaileditor/extensions/components/Form';
import { Collapse, Grid, Space } from '@arco-design/web-react';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { t } from 'i18next';

const positionOptions = [
  {
    value: 'left',
    get label() {
      return t('archbase:Left');
    },
  },
  {
    value: 'right',
    get label() {
      return t('archbase:Right');
    },
  },
];

const alignOptions = [
  {
    value: 'top',
    get label() {
      return t('archbase:top');
    },
  },
  {
    value: 'middle',
    get label() {
      return t('archbase:middle');
    },
  },
  {
    value: 'bottom',
    get label() {
      return t('archbase:bottom');
    },
  },
];

export function Accordion() {
  const { focusIdx } = useArchbaseEmailFocusIdx();
  const { onUploadImage } = useArchbaseEmailEditorProps();

  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['0', '1', '2']}>
        <Collapse.Item
          name='0'
          header={t('archbase:Setting')}
        >
          <Space direction='vertical'>
            <Grid.Row>
              <Grid.Col span={11}>
                <BackgroundColor />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <FontFamily />
              </Grid.Col>
            </Grid.Row>

            <Padding />

            <Grid.Row>
              <Grid.Col span={11}>
                <InputWithUnitField
                  label={t('archbase:Icon width')}
                  name={`${focusIdx}.attributes.icon-width`}
                />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <InputWithUnitField
                  label={t('archbase:Icon height')}
                  name={`${focusIdx}.attributes.icon-height`}
                />
              </Grid.Col>
            </Grid.Row>

            <Grid.Row>
              <Grid.Col span={11}>
                <ImageUploaderField
                  label={t('archbase:Unwrapped icon')}
                  name={`${focusIdx}.attributes.icon-unwrapped-url`}
                  //helpText={t('archbase:The image suffix should be .jpg, jpeg, png, gif, etc. Otherwise, the picture may not be displayed normally.')}
                  uploadHandler={onUploadImage}
                />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <ImageUploaderField
                  label={t('archbase:Wrapped icon')}
                  name={`${focusIdx}.attributes.icon-wrapped-url`}
                  uploadHandler={onUploadImage}
                />
              </Grid.Col>
            </Grid.Row>

            <Grid.Row>
              <Grid.Col span={11}>
                <RadioGroupField
                  label={t('archbase:Icon position')}
                  name={`${focusIdx}.attributes.icon-position`}
                  options={positionOptions}
                />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <SelectField
                  style={{ width: 120 }}
                  label={t('archbase:Icon align')}
                  name={`${focusIdx}.attributes.icon-align`}
                  options={alignOptions}
                />
              </Grid.Col>
            </Grid.Row>

            <TextField
              label={t('archbase:Border')}
              name={`${focusIdx}.attributes.border`}
            />
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
