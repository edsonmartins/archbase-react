import { AdvancedType } from '@emaileditor/core/constants';

export function isAdvancedBlock(type: any) {
  return Object.values(AdvancedType).includes(type);
}
