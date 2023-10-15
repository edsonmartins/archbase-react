import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { IHero } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type HeroProps = RecursivePartial<IHero['data']> &
  RecursivePartial<IHero['attributes']> & {
    children?: MjmlBlockProps<IHero>['children'];
  };

export function Hero(props: HeroProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.HERO}
    >
      {props.children}
    </MjmlBlock>
  );
}
