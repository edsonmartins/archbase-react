import React from 'react';
import { IBlockData } from '@emaileditor/core/typings';
import { BasicType } from '@emaileditor/core/constants';
import { createBlock } from '@emaileditor/core/utils/createBlock';
import { merge } from 'lodash';
import { t } from '@emaileditor/core/utils';
import { BasicBlock } from '@emaileditor/core/components/BasicBlock';

export type IRaw = IBlockData<{}, { content: string }>;

export const Raw = createBlock<IRaw>({
  get name() {
    return t('archbase:Raw');
  },
  type: BasicType.RAW,
  create: payload => {
    const defaultData: IRaw = {
      type: BasicType.RAW,
      data: {
        value: {
          content: '<% if (user) { %>',
        },
      },
      attributes: {},
      children: [],
    };
    return merge(defaultData, payload);
  },
  validParentType: [
    BasicType.PAGE,
    BasicType.WRAPPER,
    BasicType.SECTION,
    BasicType.GROUP,
    BasicType.COLUMN,
    BasicType.HERO,
  ],
  render(params) {
    return (
      <BasicBlock
        params={params}
        tag='mj-raw'
      >
        {params.data.data.value.content}
      </BasicBlock>
    );
  },
});
