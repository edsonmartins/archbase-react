import React, { FC } from 'react';
import { ObjectName } from './object/ObjectName';
import { ArchbaseObjectPreview } from './ArchbaseObjectPreview';

export const ArchbaseObjectRootLabel: FC<any> = ({ name, data }) => {
  if (typeof name === 'string') {
    return (
      <span>
        <ObjectName name={name} />
        <span>: </span>
        <ArchbaseObjectPreview data={data} />
      </span>
    );
  } else {
    return <ArchbaseObjectPreview data={data} />;
  }
};
