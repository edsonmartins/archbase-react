import { Modal } from '@arco-design/web-react';
import { Stack, useArchbaseEmailBlock, useArchbaseEmailEditorProps } from '@emaileditor/editor/index';
import React from 'react';
import { Form } from 'react-final-form';
import { v4 as uuidv4 } from 'uuid';
import { ImageUploaderField, TextAreaField, TextField } from '../Form';
import { t } from 'i18next';

export const AddToCollection: React.FC<{
  visible: boolean;
  setVisible: (v: boolean) => void;
}> = ({ visible, setVisible }) => {
  const { focusBlock: focusBlockData } = useArchbaseEmailBlock();
  const { onAddCollection, onUploadImage } = useArchbaseEmailEditorProps();

  const onSubmit = (values: {
    label: string;
    helpText: string;
    thumbnail: string;
  }) => {
    if (!values.label) return;
    const uuid = uuidv4();
    onAddCollection?.({
      label: values.label,
      helpText: values.helpText,
      data: focusBlockData!,
      thumbnail: values.thumbnail,
      id: uuid,
    });
    setVisible(false);
  };

  return (
    <Form
      initialValues={{ label: '', helpText: '', thumbnail: '' }}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <Modal
          maskClosable={false}
          style={{ zIndex: 2000 }}
          visible={visible}
          title={t('archbase:Add to collection')}
          onOk={() => handleSubmit()}
          onCancel={() => setVisible(false)}
        >
          <Stack vertical>
            <Stack.Item />
            <TextField
              label={t('archbase:Title')}
              name='label'
              validate={(val: string) => {
                if (!val) return t('archbase:Title required!');
                return undefined;
              }}
            />
            <TextAreaField label={t('archbase:Description')} name='helpText' />
            <ImageUploaderField
              label={t('archbase:Thumbnail')}
              name={'thumbnail'}
              uploadHandler={onUploadImage}
              validate={(val: string) => {
                if (!val) return t('archbase:Thumbnail required!');
                return undefined;
              }}
            />
          </Stack>
        </Modal>
      )}
    </Form>
  );
};
