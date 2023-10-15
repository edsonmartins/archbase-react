import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { IAccordionTitle } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type AccordionTitleProps = RecursivePartial<IAccordionTitle['data']> &
  RecursivePartial<IAccordionTitle['attributes']> & {
    children?: MjmlBlockProps<IAccordionTitle>['children'];
  };

export function AccordionTitle(props: AccordionTitleProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.ACCORDION_TITLE}
    >
      {props.children}
    </MjmlBlock>
  );
}
