import { PreviewEmailContext } from '@emaileditor/editor/components/Provider/PreviewEmailProvider';
import { useContext } from 'react';

export function usePreviewEmail() {
  return useContext(PreviewEmailContext);
}
