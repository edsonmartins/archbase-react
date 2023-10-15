import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { IAccordionText } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type AccordionTextProps = RecursivePartial<IAccordionText['data']> &
  RecursivePartial<IAccordionText['attributes']> & {
    children?: MjmlBlockProps<IAccordionText>['children'];
  };

export function AccordionText(props: AccordionTextProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.ACCORDION_TEXT}
    >
      {props.children}
    </MjmlBlock>
  );
}
