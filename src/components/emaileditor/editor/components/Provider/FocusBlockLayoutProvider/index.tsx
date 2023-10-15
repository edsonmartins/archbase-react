import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/hooks/useArchbaseEmailFocusIdx';
import React, { useEffect, useMemo, useState } from 'react';
import { getBlockNodeByIdx, getShadowRoot } from '@emaileditor/editor/utils';
import { DATA_RENDER_COUNT } from '@emaileditor/editor/constants';
import { useArchbaseEmailEditorContext } from '@emaileditor/editor/hooks/useArchbaseEmailEditorContext';
import { useArchbaseEmailRefState } from '@emaileditor/editor/hooks/useArchbaseEmailRefState';

export const ArchbaseEmailFocusBlockLayoutContext = React.createContext<{
  focusBlockNode: HTMLElement | null;
}>({
  focusBlockNode: null,
});

export const ArchbaseEmailFocusBlockLayoutProvider: React.FC<{
  children?: React.ReactNode;
}> = props => {
  const [focusBlockNode, setFocusBlockNode] = useState<HTMLElement | null>(null);
  const { initialized } = useArchbaseEmailEditorContext();
  const { focusIdx } = useArchbaseEmailFocusIdx();
  const focusIdxRef = useArchbaseEmailRefState(focusIdx);

  const root = useMemo(() => {
    return initialized ? getShadowRoot()?.querySelector(`[${DATA_RENDER_COUNT}]`) : null;
  }, [initialized]);

  useEffect(() => {
    if (!root) return;
    let lastCount: any = '0';
    const ms = new MutationObserver(() => {
      const currentCount = root.getAttribute(DATA_RENDER_COUNT);
      if (lastCount !== currentCount) {
        lastCount = currentCount;

        const ele = getBlockNodeByIdx(focusIdxRef.current);
        if (ele) {
          setFocusBlockNode(ele);
        }
      }
    });
    ms.observe(root, {
      attributeFilter: [DATA_RENDER_COUNT],
    });

    return () => {
      ms.disconnect();
    };
  }, [focusIdxRef, root]);

  useEffect(() => {
    if (!root) return;
    if (focusIdx) {
      root.setAttribute(DATA_RENDER_COUNT, (+new Date()).toString());
    }
  }, [focusIdx, root]);

  const value = useMemo(() => {
    return {
      focusBlockNode,
    };
  }, [focusBlockNode]);

  return (
    <ArchbaseEmailFocusBlockLayoutContext.Provider value={value}>
      {props.children}
    </ArchbaseEmailFocusBlockLayoutContext.Provider>
  );
};
