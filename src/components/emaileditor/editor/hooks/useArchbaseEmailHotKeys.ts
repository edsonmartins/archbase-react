import { useEffect } from 'react';
import isHotkey from 'is-hotkey';
import { useArchbaseEmailBlock } from './useArchbaseEmailBlock';
import { getEditorRoot, getShadowRoot } from '@emaileditor/editor/utils';
import { useArchbaseEmailFocusIdx } from './useArchbaseEmailFocusIdx';
import { useArchbaseEmailEditorContext } from './useArchbaseEmailEditorContext';
import { getNodeIdxFromClassName } from '@emaileditor/core/index';
import { getBlockNodeByChildEle } from '@emaileditor/editor/utils/getBlockNodeByChildEle';

function isArchbaseEmailContentEditFocus() {
  const isShadowRootFocus = document.activeElement === getEditorRoot();
  if (isShadowRootFocus) {
    if (
      getEditorRoot()?.shadowRoot?.activeElement?.getAttribute(
        'contenteditable'
      ) === 'true'
    ) {
      return true;
    }
  } else {
    if (
      ['input', 'textarea'].includes(
        document.activeElement?.tagName.toLocaleLowerCase() || ''
      ) ||
      document.activeElement?.getAttribute('contenteditable') === 'true'
    ) {
      return true;
    }
  }
  return false;
}

export function useHotKeys() {
  const { redo, undo, removeBlock } = useArchbaseEmailBlock();
  const { focusIdx, setFocusIdx } = useArchbaseEmailFocusIdx();
  const {
    formState: { values },
  } = useArchbaseEmailEditorContext();

  const root = getShadowRoot();
  // redo/undo
  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (isArchbaseEmailContentEditFocus()) return;
      if (isHotkey('mod+z', ev)) {
        ev.preventDefault();
        undo();
      }
      if (isHotkey('mod+y', ev) || isHotkey('mod+shift+z', ev)) {
        ev.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [redo, undo]);

  // delete
  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      const isShadowRootFocus = document.activeElement === getEditorRoot();

      if (!isShadowRootFocus) return;
      if (isArchbaseEmailContentEditFocus()) return;
      // if (isHotkey('delete', ev) || isHotkey('backspace', ev)) {
      //   removeBlock(focusIdx);
      // }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [focusIdx, removeBlock]);

  // focus
  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      const isShadowRootFocus = document.activeElement === getEditorRoot();

      if (!isShadowRootFocus) return;
      if (isHotkey('tab', ev) || isHotkey('shift+tab', ev)) {
        setTimeout(() => {
          const activeElement = getShadowRoot().activeElement;
          if (activeElement instanceof HTMLElement) {
            const blockNode = getBlockNodeByChildEle(activeElement);
            if (blockNode) {
              const idx = getNodeIdxFromClassName(blockNode.classList)!;
              setFocusIdx(idx);
            }
          }
        }, 0);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [focusIdx, removeBlock, setFocusIdx, values]);
}
