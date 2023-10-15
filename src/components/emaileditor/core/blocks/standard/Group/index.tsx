import React from 'react';
import { IBlock, IBlockData } from '@emaileditor/core/typings';
import { BasicType } from '@emaileditor/core/constants';
import { createBlock } from '@emaileditor/core/utils/createBlock';
import { merge } from 'lodash';
import { t } from '@emaileditor/core/utils';
import { BasicBlock } from '@emaileditor/core/components/BasicBlock';

export type IGroup = IBlockData<{
  width?: string;
  'vertical-align'?: 'middle' | 'top' | 'bottom';
  'background-color'?: string;
  direction?: 'ltr' | 'rtl';
}>;

export const Group: IBlock<IGroup> = createBlock({
  get name() {
    return t('Group');
  },
  type: BasicType.GROUP,
  create: (payload) => {
    const defaultData: IGroup = {
      type: BasicType.GROUP,
      data: {
        value: {},
      },
      attributes: {
        'vertical-align': 'top',
        direction: 'ltr',
      },
      children: [],
    };
    return merge(defaultData, payload);
  },
  validParentType: [BasicType.SECTION],

  render(params) {
    return <BasicBlock params={params} tag="mj-group" />;
  },
});
