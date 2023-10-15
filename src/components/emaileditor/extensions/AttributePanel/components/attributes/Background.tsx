import React, { useMemo } from 'react';
import { ImageUploaderField, SelectField, TextField } from '../../../components/Form';
import { useArchbaseEmailFocusIdx, useArchbaseEmailEditorProps } from '@emaileditor/editor/index';
import { BackgroundColor } from './BackgroundColor';
import { Grid, Space } from '@arco-design/web-react';
import { t } from 'i18next';

const backgroundRepeatOptions = [
  {
    value: 'no-repeat',
    get label() {
      return t('archbase:No repeat');
    },
  },
  {
    value: 'repeat',
    get label() {
      return t('archbase:Repeat');
    },
  },
  {
    value: 'repeat-x',
    get label() {
      return t('archbase:Repeat X');
    },
  },
  {
    value: 'repeat-y',
    get label() {
      return t('archbase:Repeat Y');
    },
  },
];

export function Background() {
  const { focusIdx } = useArchbaseEmailFocusIdx();
  const { onUploadImage } = useArchbaseEmailEditorProps();
  return useMemo(() => {
    return (
      <Space
        key={focusIdx}
        direction='vertical'
      >
        <ImageUploaderField
          label={t('archbase:Background image')}
          name={`${focusIdx}.attributes.background-url`}
          helpText={t(
            'The image suffix should be .jpg, jpeg, png, gif, etc. Otherwise, the picture may not be displayed normally.',
          )}
          uploadHandler={onUploadImage}
        />

        <Grid.Row>
          <Grid.Col span={11}>
            <BackgroundColor />
          </Grid.Col>
          <Grid.Col
            offset={1}
            span={11}
          >
            <SelectField
              label={t('archbase:Background repeat')}
              name={`${focusIdx}.attributes.background-repeat`}
              options={backgroundRepeatOptions}
            />
          </Grid.Col>
        </Grid.Row>
        <TextField
          label={t('archbase:Background size')}
          name={`${focusIdx}.attributes.background-size`}
        />
      </Space>
    );
  }, [focusIdx, onUploadImage]);
}
