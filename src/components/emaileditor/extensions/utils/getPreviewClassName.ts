import { classnames } from '@emaileditor/extensions/AttributePanel/utils/classnames';
import { getNodeIdxClassName, getNodeTypeClassName } from '@emaileditor/core/index';

export function getPreviewClassName(idx: string | null, type: string) {
  return classnames('email-block',
    idx && getNodeIdxClassName(idx),
    getNodeTypeClassName(type));
}