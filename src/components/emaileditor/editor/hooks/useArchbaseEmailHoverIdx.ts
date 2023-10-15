import { useCallback, useContext } from 'react';
import { ArchbaseEmailHoverIdxContext } from '@emaileditor/editor/components/Provider/HoverIdxProvider';
import { debounce } from 'lodash';

export function useArchbaseEmailHoverIdx() {
  const {
    hoverIdx,
    setHoverIdx,
    setIsDragging,
    isDragging,
    setDirection,
    direction,
  } = useContext(ArchbaseEmailHoverIdxContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setHoverIdxDebounce = useCallback(debounce(setHoverIdx), [setHoverIdx]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setDirectionDebounce = useCallback(debounce(setDirection), [
    setDirection,
  ]);

  return {
    hoverIdx,
    setHoverIdx: setHoverIdxDebounce,
    isDragging,
    setIsDragging,
    direction,
    setDirection: setDirectionDebounce,
  };
}
