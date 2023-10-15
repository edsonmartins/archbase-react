import { getNodeIdxClassName } from '@emaileditor/core/index';
import { getBlockNodes } from './getBlockNodes';

export const getBlockNodeByIdx = (idx: string): HTMLElement | null => {
  if (!idx) return null;
  const idxClassName = getNodeIdxClassName(idx);
  const node = getBlockNodes().find((item) =>
    item.classList?.contains(idxClassName)
  ) as HTMLElement;
  return node;
};
