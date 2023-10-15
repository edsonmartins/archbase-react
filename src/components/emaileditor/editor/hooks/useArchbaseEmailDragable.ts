import { ArchbaseEmailBlocksContext } from '@emaileditor/editor/components/Provider/BlocksProvider';
import { useContext } from 'react';

export function useArchbaseEmailDraggable() {
  const { dragEnabled, setDragEnabled } = useContext(ArchbaseEmailBlocksContext);
  return {
    dragEnabled,
    setDragEnabled,
  };
}
