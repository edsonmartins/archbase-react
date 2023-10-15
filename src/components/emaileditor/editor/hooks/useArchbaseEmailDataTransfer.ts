import { useCallback, useContext, useMemo } from 'react';
import { ArchbaseEmailHoverIdxContext } from '@emaileditor/editor/components/Provider/HoverIdxProvider';
import { debounce } from 'lodash';

export function useArchbaseEmailDataTransfer() {
  const { dataTransfer, setDataTransfer } = useContext(ArchbaseEmailHoverIdxContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setDataTransferDebounce = useCallback(debounce(setDataTransfer), [
    setDataTransfer,
  ]);

  return useMemo(
    () => ({
      dataTransfer,
      setDataTransfer: setDataTransferDebounce,
    }),
    [dataTransfer, setDataTransferDebounce]
  );
}
