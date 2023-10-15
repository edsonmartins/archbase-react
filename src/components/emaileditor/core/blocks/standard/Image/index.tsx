import React, { CSSProperties } from 'react';
import { IBlock, IBlockData } from '@emaileditor/core/typings';
import { BasicType } from '@emaileditor/core/constants';
import { createBlock } from '@emaileditor/core/utils/createBlock';
import { merge } from 'lodash';
import { t } from '@emaileditor/core/utils';
import { BasicBlock } from '@emaileditor/core/components/BasicBlock';

export type IImage = IBlockData<{
  alt?: string;
  src?: string;
  title?: string;
  href?: string;
  target?: string;
  border?: string;
  height?: string;
  'text-decoration'?: string;
  'text-transform'?: CSSProperties['textTransform'];
  align?: CSSProperties['textAlign'];
  'container-background-color'?: string;
  width?: string;
  padding?: string;
}>;

export const Image: IBlock<IImage> = createBlock({
  get name() {
    return t('archbase:Image');
  },
  type: BasicType.IMAGE,
  create: payload => {
    const defaultData: IImage = {
      type: BasicType.IMAGE,
      data: {
        value: {},
      },
      attributes: {
        align: 'center',
        height: 'auto',
        padding: '10px 25px 10px 25px',
        src: '',
      },
      children: [],
    };
    return merge(defaultData, payload);
  },
  validParentType: [BasicType.COLUMN, BasicType.HERO],
  render(params) {
    return (
      <BasicBlock
        params={params}
        tag='mj-image'
      />
    );
  },
});
