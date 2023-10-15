import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { INavbar } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type NavbarProps = RecursivePartial<INavbar['data']> &
  RecursivePartial<INavbar['attributes']> & {
    children?: MjmlBlockProps<INavbar>['children'];
  };

export function Navbar(props: NavbarProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.NAVBAR}
    >
      {props.children}
    </MjmlBlock>
  );
}
