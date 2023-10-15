import { BasicType, AdvancedType } from '@emaileditor/core/index';

export function isTextBlock(blockType: any) {
  return blockType === BasicType.TEXT || blockType === AdvancedType.TEXT;
}