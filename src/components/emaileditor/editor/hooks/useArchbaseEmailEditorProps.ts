import { ArchbaseEmailEditorPropsContext, ArchbaseEmailPropsProviderProps } from '@emaileditor/editor/components/Provider/PropsProvider';
import { useContext } from 'react';

export function useArchbaseEmailEditorProps<T extends ArchbaseEmailPropsProviderProps>(): T & {
  mergeTagGenerate: NonNullable<ArchbaseEmailPropsProviderProps['mergeTagGenerate']>;
} {
  return useContext(ArchbaseEmailEditorPropsContext) as any;
}
