import { AdvancedType, BasicType } from '@emaileditor/core/constants';
import React from 'react';
import { AdvancedBlock, generateAdvancedBlock } from './generateAdvancedBlock';
import { getPreviewClassName } from '@emaileditor/core/utils/getPreviewClassName';
import { classnames } from '@emaileditor/core/utils/classnames';
import { BlockRenderer } from '@emaileditor/core/components/BlockRenderer';
import { getChildIdx } from '@emaileditor/core/utils';

export function generateAdvancedLayoutBlock<T extends AdvancedBlock>(option: {
  type: string;
  baseType: BasicType;
  validParentType: string[];
}) {
  return generateAdvancedBlock<T>({
    ...option,
    getContent: (params) => {
      const { data, idx, mode, index } = params;
      const { iteration } = data.data.value;

      const blockData = {
        ...data,
        type: option.baseType,
      };

      // Column 必须设置宽度
      if (data.type === AdvancedType.COLUMN && iteration?.enabled) {
        data.attributes.width = data.attributes.width || '100%';
      }

      const previewClassName =
        mode === 'testing'
          ? classnames(
            index === 0 && idx && getPreviewClassName(idx, data.type)
          )
          : '';

      return (
        <BlockRenderer
          idx={null}
          data={{
            ...blockData,
            attributes: {
              ...blockData.attributes,
              'css-class': classnames(
                data.attributes['css-class'],
                previewClassName
              )
            }
          }}
        >
          {blockData.children.map((child, index) => {
            return (
              <BlockRenderer
                key={index}
                {...params}
                data={child}
                idx={idx ? getChildIdx(idx, index) : null}
              />
            );
          })}
        </BlockRenderer>
      );

    },
  });
}
