import { BasicType, AdvancedType } from '@emaileditor/core/index';

export function isButtonBlock(blockType: any) {
  return blockType === BasicType.BUTTON || blockType === AdvancedType.BUTTON;
}