import React from 'react';
import {
  ColorPickerField,
  EditTabField,
  ImageUploaderField,
  InputWithUnitField,
  RadioGroupField,
  SelectField,
  TextField,
} from '@emaileditor/extensions/components/Form';
import { IconLink } from '@arco-design/web-react/icon';
import { Collapse, Grid, Space } from '@arco-design/web-react';
import { Stack, useArchbaseEmailEditorProps, useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { AttributesPanelWrapper } from '@emaileditor/extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Align } from '@emaileditor/extensions/AttributePanel/components/attributes/Align';
import { ICarousel } from '@emaileditor/core/index';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { t } from 'i18next';

const options = [
  {
    value: 'hidden',
    get label() {
      return t('archbase:hidden');
    },
  },
  {
    value: 'visible',
    get label() {
      return t('archbase:visible');
    },
  },
];

export function Carousel() {
  const { focusIdx } = useArchbaseEmailFocusIdx();
  return (
    <AttributesPanelWrapper style={{ padding: 0 }}>
      <CollapseWrapper defaultActiveKey={['0', '1', '2', '3', '4']}>
        <Collapse.Item
          name='0'
          header={t('archbase:Dimension')}
        >
          <Space direction='vertical'>
            <InputWithUnitField
              label={t('archbase:Thumbnail width')}
              name={`${focusIdx}.attributes.tb-width`}
              quickchange
              inline
            />

            <RadioGroupField
              label={t('archbase:Thumbnails')}
              name={`${focusIdx}.attributes.thumbnails`}
              options={options}
              inline
            />
            <Align inline />
          </Space>
        </Collapse.Item>
        <Collapse.Item
          name='4'
          contentStyle={{ padding: 0 }}
          header={t('archbase:Images')}
        >
          <Stack
            vertical
            spacing='tight'
          >
            <EditTabField
              tabPosition='top'
              name={`${focusIdx}.data.value.images`}
              label=''
              labelHidden
              renderItem={(item, index) => (
                <CarouselImage
                  item={item}
                  index={index}
                />
              )}
              additionItem={{
                src: 'https://www.mailjet.com/wp-content/uploads/2016/11/ecommerce-guide.jpg',
                target: '_blank',
              }}
            />
          </Stack>
        </Collapse.Item>
        <Collapse.Item
          name='3'
          header={t('archbase:Icon')}
        >
          <Grid.Row>
            <Grid.Col span={11}>
              <TextField
                label={t('archbase:Left icon')}
                name={`${focusIdx}.attributes.left-icon`}
              />
            </Grid.Col>
            <Grid.Col
              offset={1}
              span={11}
            >
              <TextField
                label={t('archbase:Right icon')}
                name={`${focusIdx}.attributes.right-icon`}
              />
            </Grid.Col>
          </Grid.Row>

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
            />
          </Grid.Row>
        </Collapse.Item>

        <Collapse.Item
          name='1'
          header={t('archbase:Border')}
        >
          <Grid.Row>
            <Grid.Col span={11}>
              <ColorPickerField
                label={t('archbase:Hovered border')}
                name={`${focusIdx}.attributes.tb-hover-border-color`}
              />
            </Grid.Col>
            <Grid.Col
              offset={1}
              span={11}
            >
              <ColorPickerField
                label={t('archbase:Selected Border')}
                name={`${focusIdx}.attributes.tb-selected-border-color`}
              />
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col span={11}>
              <TextField
                label={t('archbase:Border of the thumbnails')}
                name={`${focusIdx}.attributes.tb-border`}
              />
            </Grid.Col>
            <Grid.Col
              offset={1}
              span={11}
            >
              <TextField
                label={t('archbase:Border radius of the thumbnails')}
                name={`${focusIdx}.attributes.tb-border-radius`}
              />
            </Grid.Col>
          </Grid.Row>
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

function CarouselImage({
  item,
  index,
}: {
  item: ICarousel['data']['value']['images'];
  index: number;
}) {
  const { focusIdx } = useArchbaseEmailFocusIdx();
  const { onUploadImage } = useArchbaseEmailEditorProps();
  return (
    <Space direction='vertical'>
      <ImageUploaderField
        label={t('archbase:Image')}
        labelHidden
        name={`${focusIdx}.data.value.images.[${index}].src`}
        helpText={t(
          'The image suffix should be .jpg, jpeg, png, gif, etc. Otherwise, the picture may not be displayed normally.',
        )}
        uploadHandler={onUploadImage}
      />
      <Grid.Row>
        <Grid.Col span={11}>
          <TextField
            prefix={<IconLink />}
            label={t('archbase:Url')}
            name={`${focusIdx}.data.value.images.[${index}].href`}
          />
        </Grid.Col>
        <Grid.Col
          offset={1}
          span={11}
        >
          <SelectField
            label={t('archbase:Target')}
            name={`${focusIdx}.data.value.images.[${index}].target`}
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

      <TextField
        label={t('archbase:Title')}
        name={`${focusIdx}.data.value.image.[${index}].title`}
      />
    </Space>
  );
}
