import React from 'react';
import { IBlock, IBlockData } from '@emaileditor/core/typings';
import { BasicType } from '@emaileditor/core/constants';
import { createBlock } from '@emaileditor/core/utils/createBlock';
import { merge } from 'lodash';
import { BasicBlock } from '@emaileditor/core/components/BasicBlock';
import { t } from '@emaileditor/core/utils';

export type ISpacer = IBlockData<{
  'container-background-color'?: string;
  height?: string;
  padding?: string;
}>;

export const Spacer: IBlock<ISpacer> = createBlock({
  get name() {
    return t('Spacer');
  },
  type: BasicType.SPACER,
  create: (payload) => {
    const defaultData: ISpacer = {
      type: BasicType.SPACER,
      data: {
        value: {},
      },
      attributes: {
        height: '20px',
      },
      children: [],
    };
    return merge(defaultData, payload);
  },
  validParentType: [BasicType.COLUMN, BasicType.HERO],
  render(params) {
    return <BasicBlock params={params} tag="mj-spacer" />;
  },
});
