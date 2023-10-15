import React from 'react';
import { IBlockData } from '@emaileditor/core/typings';
import { BasicType } from '@emaileditor/core/constants';
import { createBlock } from '@emaileditor/core/utils/createBlock';
import { merge } from 'lodash';
import { BasicBlock } from '@emaileditor/core/components/BasicBlock';
import { t } from '@emaileditor/core/utils';

export type ITable = IBlockData<{}, { content: string; }>;

export const Table = createBlock<ITable>({
  get name() {
    return t('Table');
  },
  type: BasicType.TABLE,
  create: (payload) => {
    const defaultData: ITable = {
      type: BasicType.TABLE,
      data: {
        value: {
          content: '',
        },
      },
      attributes: {},
      children: [],
    };
    return merge(defaultData, payload);
  },
  validParentType: [BasicType.COLUMN],
  render(params) {
    const { data } = params;
    return <BasicBlock params={params} tag="mj-table">{data.data.value.content}</BasicBlock>;
  },

});
