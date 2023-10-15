import { useContext } from 'react';
import { ArchbaseEmailBlocksContext } from '@emaileditor/editor/components/Provider/BlocksProvider';
import { IArchbaseEmailTemplate } from '@emaileditor/editor/typings';
import { useFormState, useForm } from 'react-final-form';

export function useArchbaseEmailEditorContext() {
  const formState = useFormState<IArchbaseEmailTemplate>();
  const helpers = useForm();
  const { initialized, setInitialized } = useContext(ArchbaseEmailBlocksContext);

  const { content } = formState.values;
  return {
    formState,
    formHelpers: helpers,
    initialized,
    setInitialized,
    pageData: content,
  };
}
