import { SizeUnit, Type, AnchorType, ResizeHandlePlacement } from "../core-types";
import * as React from "react";
import { Space } from "./Space";
import * as PropTypes from "prop-types";
import { commonProps, IReactSpaceCommonProps, IResizeHandleProps } from "../core-react";

export interface IResizableProps extends IReactSpaceCommonProps {
	size: SizeUnit;
	order?: number;
	handleSize?: number;
	touchHandleSize?: number;
	handlePlacement?: ResizeHandlePlacement;
	handleRender?: (handleProps: IResizeHandleProps) => React.ReactNode;
	minimumSize?: number;
	maximumSize?: number;
	onResizeStart?: () => void | boolean;
	onResizeEnd?: (newSize: SizeUnit) => void;
}

export const resizableProps = {
	...commonProps,
	...{
		size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		order: PropTypes.number,
		handleSize: PropTypes.number,
		touchHandleSize: PropTypes.number,
		handlePlacement: PropTypes.oneOf([ResizeHandlePlacement.Inside, ResizeHandlePlacement.OverlayBoundary, ResizeHandlePlacement.OverlayInside]),
		handleRender: PropTypes.func,
		minimumSize: PropTypes.number,
		maximumSize: PropTypes.number,
		onResizeStart: PropTypes.func,
		onResizeEnd: PropTypes.func,
	},
};

export interface IAnchorProps extends IResizableProps {
	resizable?: boolean;
}

export const anchoredProps = {
	...resizableProps,
	...{
		resizable: PropTypes.bool,
	},
};

export const LeftResizable: React.FC<IResizableProps> = ({ children, size, ...props }) => (
	<Space {...props} type={Type.Anchored} anchor={AnchorType.Left} position={{ left: 0, top: 0, bottom: 0, rightResizable: true, width: size }}>
		{children}
	</Space>
);

LeftResizable.propTypes = resizableProps;

export const Left: React.FC<IAnchorProps> = ({ size, children, resizable, ...commonProps }) => (
	<Space
		{...commonProps}
		type={Type.Anchored}
		anchor={AnchorType.Left}
		position={{ left: 0, top: 0, bottom: 0, rightResizable: resizable, width: size }}>
		{children}
	</Space>
);

Left.propTypes = anchoredProps;

export const TopResizable: React.FC<IResizableProps> = ({ children, size, ...props }) => (
	<Space {...props} type={Type.Anchored} anchor={AnchorType.Top} position={{ left: 0, top: 0, right: 0, bottomResizable: true, height: size }}>
		{children}
	</Space>
);

TopResizable.propTypes = resizableProps;

export const Top: React.FC<IAnchorProps> = ({ size, children, resizable, ...commonProps }) => (
	<Space
		{...commonProps}
		type={Type.Anchored}
		anchor={AnchorType.Top}
		position={{ left: 0, top: 0, right: 0, bottomResizable: resizable, height: size }}>
		{children}
	</Space>
);

Top.propTypes = anchoredProps;

export const RightResizable: React.FC<IResizableProps> = ({ children, size, ...props }) => (
	<Space {...props} type={Type.Anchored} anchor={AnchorType.Right} position={{ bottom: 0, top: 0, right: 0, leftResizable: true, width: size }}>
		{children}
	</Space>
);

RightResizable.propTypes = resizableProps;

export const Right: React.FC<IAnchorProps> = ({ size, children, resizable, ...commonProps }) => (
	<Space
		{...commonProps}
		type={Type.Anchored}
		anchor={AnchorType.Right}
		position={{ bottom: 0, top: 0, right: 0, leftResizable: resizable, width: size }}>
		{children}
	</Space>
);

Right.propTypes = anchoredProps;

export const BottomResizable: React.FC<IResizableProps> = ({ children, size, ...props }) => (
	<Space {...props} type={Type.Anchored} anchor={AnchorType.Bottom} position={{ bottom: 0, left: 0, right: 0, topResizable: true, height: size }}>
		{children}
	</Space>
);

BottomResizable.propTypes = resizableProps;

export const Bottom: React.FC<IAnchorProps> = ({ size, children, resizable, ...commonProps }) => (
	<Space
		{...commonProps}
		type={Type.Anchored}
		anchor={AnchorType.Bottom}
		position={{ bottom: 0, left: 0, right: 0, topResizable: resizable, height: size }}>
		{children}
	</Space>
);

Bottom.propTypes = anchoredProps;
