import { ArchbaseEmailPreviewEmailContext } from '@emaileditor/editor/components/Provider/PreviewEmailProvider';
import { useContext } from 'react';

export function useArchbaseEmailPreviewEmail() {
  return useContext(ArchbaseEmailPreviewEmailContext);
}
