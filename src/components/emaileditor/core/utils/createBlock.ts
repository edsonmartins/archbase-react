import { IBlock, IBlockData } from '@emaileditor/core/typings';

export function createBlock<T extends IBlockData>(block: IBlock<T>): IBlock<T> {
  return block;
}
