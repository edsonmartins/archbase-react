import { ArchbaseEmailBlocksContext } from '@emaileditor/editor/components/Provider/BlocksProvider';
import { useContext } from 'react';

export function useArchbaseEmailFocusIdx() {
  const { focusIdx, setFocusIdx } = useContext(ArchbaseEmailBlocksContext);
  return {
    focusIdx,
    setFocusIdx,
  };
}
