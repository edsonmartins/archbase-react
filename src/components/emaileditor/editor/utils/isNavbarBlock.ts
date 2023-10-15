import { BasicType, AdvancedType } from '@emaileditor/core/index';

export function isNavbarBlock(blockType: any) {
  return blockType === BasicType.NAVBAR || blockType === AdvancedType.NAVBAR;
}