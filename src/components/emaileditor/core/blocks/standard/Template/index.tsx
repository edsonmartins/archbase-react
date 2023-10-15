import React from 'react';
import { IBlockData } from '@emaileditor/core/typings';
import { BasicType } from '@emaileditor/core/constants';
import { createBlock } from '@emaileditor/core/utils/createBlock';
import { merge } from 'lodash';
import { BlockRenderer } from '@emaileditor/core/components/BlockRenderer';
import { t } from '@emaileditor/core/utils';

export type ITemplate = IBlockData<
  {},
  {
    idx?: string | null;
  }
>;

export const Template = createBlock<ITemplate>({
  get name() {
    return t('archbase:Template');
  },
  type: BasicType.TEMPLATE,
  create: (payload) => {
    const defaultData: ITemplate = {
      type: BasicType.TEMPLATE,
      data: {
        value: {
          idx: '',
        },
      },
      attributes: {},
      children: [],
    };
    return merge(defaultData, payload);
  },
  validParentType: [],
  render(params) {
    const { data } = params;
    return (
      <>
        {`
          ${data.children.map((child) => (
          <BlockRenderer {...params} data={child} />
        ))}
        `}
      </>
    );
  },
});
