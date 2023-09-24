import * as React from 'react';
import { LayerContext } from '../core-react';
import * as PropTypes from 'prop-types';

interface IProps {
  zIndex: number;
  children?: React.ReactNode;
}

export const ArchbaseSpaceLayer: React.FC<IProps> = (props) => (
  <LayerContext.Provider value={props.zIndex}>{props.children}</LayerContext.Provider>
);

ArchbaseSpaceLayer.propTypes = {
  zIndex: PropTypes.number.isRequired,
};
