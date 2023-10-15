import React from 'react';
import { IBlockData } from '@emaileditor/core/typings';
import { BasicType } from '@emaileditor/core/constants';
import { createBlock } from '@emaileditor/core/utils/createBlock';
import { merge } from 'lodash';
import { BasicBlock } from '@emaileditor/core/components/BasicBlock';
import { t } from '@emaileditor/core/utils';

export type IText = IBlockData<
  {
    color?: string;
    'font-family'?: string;
    'font-size'?: string;
    'font-style'?: string;
    'font-weight'?: string;
    'line-height'?: string;
    'letter-spacing'?: string;
    height?: string;
    'text-decoration'?: string;
    'text-transform'?: string;
    align?: string;
    'container-background-color'?: string;
    width?: string;
    padding?: string;
  },
  {
    content: string;
  }
>;

export const Text = createBlock<IText>({
  get name() {
    return t('archbase:Text');
  },
  type: BasicType.TEXT,
  create: payload => {
    const defaultData: IText = {
      type: BasicType.TEXT,
      data: {
        value: {
          content: t('archbase:Make it easy for everyone to compose emails!'),
        },
      },
      attributes: {
        padding: '10px 25px 10px 25px',
        align: 'left',
      },
      children: [],
    };
    return merge(defaultData, payload);
  },
  validParentType: [BasicType.COLUMN, BasicType.HERO],
  render(params) {
    const { data } = params;
    return (
      <BasicBlock
        params={params}
        tag='mj-text'
      >
        {data.data.value.content}
      </BasicBlock>
    );
  },
});
