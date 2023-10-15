import { IArchbaseEmailTemplate } from '@emaileditor/editor/typings';
import { Form, useForm, useFormState, useField } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import React, { useMemo, useEffect, useState } from 'react';
import { ArchbaseEmailBlocksProvider } from '..//BlocksProvider';
import { ArchbaseEmailHoverIdxProvider } from '../HoverIdxProvider';
import { ArchbaseEmailPropsProvider, ArchbaseEmailPropsProviderProps } from '../PropsProvider';
import { ArchbaseEmailRecordProvider } from '../RecordProvider';
import { ArchbaseEmailScrollProvider } from '../ScrollProvider';
import { Config, FormApi, FormState } from 'final-form';
import setFieldTouched from 'final-form-set-field-touched';
import { ArchbaseEmailFocusBlockLayoutProvider } from '../FocusBlockLayoutProvider';
import { ArchbaseEmailPreviewEmailProvider } from '../PreviewEmailProvider';
import { overrideErrorLog, restoreErrorLog } from '@emaileditor/editor/utils/logger';

export interface ArchbaseEmailEditorProviderProps<T extends IArchbaseEmailTemplate = any>
  extends Omit<ArchbaseEmailPropsProviderProps, 'children'> {
  data: T;
  children: (
    props: FormState<T>,
    helper: FormApi<IArchbaseEmailTemplate, Partial<IArchbaseEmailTemplate>>,
  ) => React.ReactNode;
  onSubmit?: Config<IArchbaseEmailTemplate, Partial<IArchbaseEmailTemplate>>['onSubmit'];
  validationSchema?: Config<IArchbaseEmailTemplate, Partial<IArchbaseEmailTemplate>>['validate'];
}

export const ArchbaseEmailEditorProvider = <T extends any>(
  props: ArchbaseEmailEditorProviderProps & T,
) => {
  const { data, children, onSubmit = () => {}, validationSchema } = props;

  const initialValues = useMemo(() => {
    return {
      subject: data.subject,
      subTitle: data.subTitle,
      content: data.content,
    };
  }, [data]);

  useEffect(() => {
    overrideErrorLog();
    return () => {
      restoreErrorLog();
    };
  }, []);

  if (!initialValues.content) return null;

  return (
    <Form<IArchbaseEmailTemplate>
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
      validate={validationSchema}
      mutators={{ ...arrayMutators, setFieldTouched: setFieldTouched as any }}
      subscription={{ submitting: true, pristine: true }}
    >
      {() => (
        <>
          <ArchbaseEmailPropsProvider {...props}>
              <ArchbaseEmailPreviewEmailProvider>
                <ArchbaseEmailRecordProvider>
                  <ArchbaseEmailBlocksProvider>
                    <ArchbaseEmailHoverIdxProvider>
                      <ArchbaseEmailScrollProvider>
                        <ArchbaseEmailFocusBlockLayoutProvider>
                          <ArchbaseEmailFormWrapper children={children} />
                        </ArchbaseEmailFocusBlockLayoutProvider>
                      </ArchbaseEmailScrollProvider>
                    </ArchbaseEmailHoverIdxProvider>
                  </ArchbaseEmailBlocksProvider>
                </ArchbaseEmailRecordProvider>
              </ArchbaseEmailPreviewEmailProvider>
          </ArchbaseEmailPropsProvider>
          <RegisterFields />
        </>
      )}
    </Form>
  );
};

function ArchbaseEmailFormWrapper({ children }: { children: ArchbaseEmailEditorProviderProps['children'] }) {
  const data = useFormState<IArchbaseEmailTemplate>();
  const helper = useForm<IArchbaseEmailTemplate>();
  return <>{children(data, helper)}</>;
}

// final-form bug https://github.com/final-form/final-form/issues/169

const RegisterFields = React.memo(() => {
  const { touched } = useFormState<IArchbaseEmailTemplate>();
  const [touchedMap, setTouchedMap] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (touched) {
      Object.keys(touched)
        .filter(key => touched[key])
        .forEach(key => {
          setTouchedMap(obj => {
            obj[key] = true;
            return { ...obj };
          });
        });
    }
  }, [touched]);

  return (
    <>
      {Object.keys(touchedMap).map(key => {
        return (
          <RegisterField
            key={key}
            name={key}
          />
        );
      })}
    </>
  );
});

function RegisterField({ name }: { name: string }) {
  useField(name);
  return <></>;
}
