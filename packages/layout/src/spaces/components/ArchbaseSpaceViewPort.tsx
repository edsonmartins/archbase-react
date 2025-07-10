import { Type, SizeUnit } from "../core-types";
import * as React from "react";
import { ArchbaseSpace } from "./ArchbaseSpace";
import * as PropTypes from "prop-types";
import { commonProps, IArchbaseSpaceCommonProps } from "../core-react";

interface IArchbaseSpaceViewPortProps extends IArchbaseSpaceCommonProps {
	left?: SizeUnit;
	right?: SizeUnit;
	top?: SizeUnit;
	bottom?: SizeUnit;
}

export const ArchbaseSpaceViewPort: React.FC<IArchbaseSpaceViewPortProps> = ({ left, top, right, bottom, children, ...commonProps }) => (
	<ArchbaseSpace {...commonProps} type={Type.ViewPort} position={{ left: left || 0, top: top || 0, right: right || 0, bottom: bottom || 0 }}>
		{children}
	</ArchbaseSpace>
);

ArchbaseSpaceViewPort.propTypes = {
	...commonProps,
	...{
		left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		right: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		bottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	},
};
