import React, { useMemo } from 'react';
import { Padding } from '@emaileditor/extensions/AttributePanel/components/attributes/Padding';
import {
  EditGridTabField,
  ImageUploaderField,
  InputWithUnitField,
  RadioGroupField,
  TextField,
} from '@emaileditor/extensions/components/Form';
import { Align } from '@emaileditor/extensions/AttributePanel/components/attributes/Align';
import { IconLink } from '@arco-design/web-react/icon';
import { Color } from '@emaileditor/extensions/AttributePanel/components/attributes/Color';
import { ContainerBackgroundColor } from '@emaileditor/extensions/AttributePanel/components/attributes/ContainerBackgroundColor';
import { FontFamily } from '@emaileditor/extensions/AttributePanel/components/attributes/FontFamily';
import { FontSize } from '@emaileditor/extensions/AttributePanel/components/attributes/FontSize';
import { FontStyle } from '@emaileditor/extensions/AttributePanel/components/attributes/FontStyle';
import { FontWeight } from '@emaileditor/extensions/AttributePanel/components/attributes/FontWeight';

import { AttributesPanelWrapper } from '@emaileditor/extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Collapse, Grid, Space } from '@arco-design/web-react';
import { TextDecoration } from '@emaileditor/extensions/AttributePanel/components/attributes/TextDecoration';
import { LineHeight } from '@emaileditor/extensions/AttributePanel/components/attributes/LineHeight';
import { useArchbaseEmailBlock, useArchbaseEmailEditorProps, useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { ISocial } from '@emaileditor/core/index';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { t } from 'i18next';

const options = [
  {
    value: 'vertical',
    get label() {
      return t('archbase:vertical');
    },
  },
  {
    value: 'horizontal',
    get label() {
      return t('archbase:horizontal');
    },
  },
];

export function Social() {
  const { focusIdx } = useArchbaseEmailFocusIdx();
  const { focusBlock } = useArchbaseEmailBlock();
  const value = focusBlock?.data.value as ISocial['data']['value'];
  if (!value) return null;

  return (
    <AttributesPanelWrapper style={{ padding: 0 }}>
      <CollapseWrapper defaultActiveKey={['0', '1', '2', '3']}>
        <Collapse.Item
          name='1'
          header={t('archbase:Setting')}
        >
          <Space direction='vertical'>
            <RadioGroupField
              label={t('archbase:Mode')}
              name={`${focusIdx}.attributes.mode`}
              options={options}
            />

            <Align />
          </Space>
        </Collapse.Item>

        <Collapse.Item
          name='3'
          header={t('archbase:Typography')}
        >
          <Space direction='vertical'>
            <Grid.Row>
              <Grid.Col span={11}>
                <FontFamily />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <FontSize />
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col span={11}>
                <FontWeight />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <LineHeight />
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col span={11}>
                <Color />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <ContainerBackgroundColor title={t('archbase:Background color')} />
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col span={11}>
                <TextDecoration />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <FontStyle />
              </Grid.Col>
            </Grid.Row>
          </Space>
        </Collapse.Item>

        <Collapse.Item
          name='2'
          header={t('archbase:Social item')}
          contentStyle={{ padding: 10 }}
        >
          <EditGridTabField
            tabPosition='top'
            name={`${focusIdx}.data.value.elements`}
            label=''
            labelHidden
            renderItem={(item, index) => (
              <SocialElement
                item={item}
                index={index}
              />
            )}
          />
        </Collapse.Item>

        <Collapse.Item
          name='0'
          header={t('archbase:Dimension')}
        >
          <Space
            direction='vertical'
            size='large'
          >
            <Grid.Row>
              <Grid.Col span={11}>
                <InputWithUnitField
                  label={t('archbase:Icon width')}
                  name={`${focusIdx}.attributes.icon-size`}
                />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <TextField
                  label={t('archbase:Border radius')}
                  name={`${focusIdx}.attributes.border-radius`}
                />
              </Grid.Col>
            </Grid.Row>

            <Padding />
            <Padding
              attributeName='inner-padding'
              title={t('archbase:Icon padding')}
            />
            <Padding
              attributeName='text-padding'
              title={t('archbase:Text padding')}
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

function SocialElement({
  index,
}: {
  item: ISocial['data']['value']['elements'][0];
  index: number;
}) {
  const { focusIdx } = useArchbaseEmailFocusIdx();
  const { onUploadImage, socialIcons } = useArchbaseEmailEditorProps();

  const autoCompleteOptions = useMemo(() => {
    if (!socialIcons) return undefined;
    return socialIcons.map(icon => {
      return {
        label: icon.content,
        value: icon.image,
      };
    });
  }, [socialIcons]);

  return (
    <Space direction='vertical'>
      <ImageUploaderField
        label={t('archbase:Image')}
        autoCompleteOptions={autoCompleteOptions}
        labelHidden
        name={`${focusIdx}.data.value.elements.[${index}].src`}
        //helpText={t('archbase:The image suffix should be .jpg, jpeg, png, gif, etc. Otherwise, the picture may not be displayed normally.')}
        uploadHandler={onUploadImage}
      />

      <Grid.Row>
        <Grid.Col span={11}>
          <TextField
            label={t('archbase:Content')}
            name={`${focusIdx}.data.value.elements.[${index}].content`}
            quickchange
          />
        </Grid.Col>
        <Grid.Col
          offset={1}
          span={11}
        >
          <TextField
            prefix={<IconLink />}
            label={t('archbase:Link')}
            name={`${focusIdx}.data.value.elements.[${index}].href`}
          />
        </Grid.Col>
      </Grid.Row>
      {/* <Grid.Row>
        <Grid.Col span={11}>
          <InputWithUnitField
            label={t('archbase:Icon width')}
            name={`${focusIdx}.data.value.elements.[${index}].icon-size`}
          />
        </Grid.Col>
        <Grid.Col offset={1} span={11}>
          <InputWithUnitField
            label={t('archbase:Icon height')}
            name={`${focusIdx}.data.value.elements.[${index}].icon-height`}
          />
        </Grid.Col>
      </Grid.Row> */}
    </Space>
  );
}
