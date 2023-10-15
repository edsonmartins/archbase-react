import React from 'react';
import { Stack } from '@emaileditor/editor/index';
import { BasicType } from '@emaileditor/core/index';

import { BlockMaskWrapper } from '@emaileditor/extensions/ShortcutToolbar/components/BlockMaskWrapper';

const list = [
  {
    payload: {
      type: BasicType.RAW,
      data: {
        value: {
          content: '<% if (user) { %>'
        },
      },
    },
  },
  {
    payload: {
      type: BasicType.RAW,
      data: {
        value: {
          content: '<% } %>'
        },
      },
    },
  },
];

export function RawBlockItem() {
  return (
    <Stack.Item fill>
      <Stack vertical>
        {list.map((item, index) => {
          return (
            <BlockMaskWrapper
              key={index}
              type={BasicType.RAW}
              payload={item.payload}
            >

              <div style={{ width: '100%', paddingLeft: 20 }}>
                {item.payload.data.value.content}
              </div>

            </BlockMaskWrapper>
          );
        })}
      </Stack>
    </Stack.Item>
  );
}
