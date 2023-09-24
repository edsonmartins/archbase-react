import { SizeUnit, Type } from '../core-types';
import * as React from 'react';
import { ArchbaseSpace } from './ArchbaseSpace';
import * as PropTypes from 'prop-types';
import { commonProps, IArchbaseSpaceCommonProps } from '../core-react';

interface IArchbaseSpaceFixedProps extends IArchbaseSpaceCommonProps {
  width?: SizeUnit;
  height: SizeUnit;
}

export const ArchbaseSpaceFixed: React.FC<IArchbaseSpaceFixedProps> = ({ width, height, children, ...commonProps }) => (
  <ArchbaseSpace {...commonProps} type={Type.Fixed} position={{ width: width, height: height }}>
    {children}
  </ArchbaseSpace>
);

ArchbaseSpaceFixed.propTypes = {
  ...commonProps,
  ...{
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  },
};
