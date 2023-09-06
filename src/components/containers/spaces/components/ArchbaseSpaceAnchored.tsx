import { SizeUnit, Type, AnchorType, ResizeHandlePlacement } from "../core-types";
import * as React from "react";
import { ArchbaseSpace } from "./ArchbaseSpace";
import * as PropTypes from "prop-types";
import { commonProps, IArchbaseSpaceCommonProps, IResizeHandleProps } from "../core-react";

export interface IArchbaseResizableProps extends IArchbaseSpaceCommonProps {
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

export interface IArchbaseAnchorProps extends IArchbaseResizableProps {
	resizable?: boolean;
}

export const anchoredProps = {
	...resizableProps,
	...{
		resizable: PropTypes.bool,
	},
};

export const ArchbaseSpaceLeftResizable: React.FC<IArchbaseResizableProps> = ({ children, size, ...props }) => (
	<ArchbaseSpace {...props} type={Type.Anchored} anchor={AnchorType.Left} position={{ left: 0, top: 0, bottom: 0, rightResizable: true, width: size }}>
		{children}
	</ArchbaseSpace>
);

ArchbaseSpaceLeftResizable.propTypes = resizableProps;

export const ArchbaseSpaceLeft: React.FC<IArchbaseAnchorProps> = ({ size, children, resizable, ...commonProps }) => (
	<ArchbaseSpace
		{...commonProps}
		type={Type.Anchored}
		anchor={AnchorType.Left}
		position={{ left: 0, top: 0, bottom: 0, rightResizable: resizable, width: size }}>
		{children}
	</ArchbaseSpace>
);

ArchbaseSpaceLeft.propTypes = anchoredProps;

export const ArchbaseSpaceTopResizable: React.FC<IArchbaseResizableProps> = ({ children, size, ...props }) => (
	<ArchbaseSpace {...props} type={Type.Anchored} anchor={AnchorType.Top} position={{ left: 0, top: 0, right: 0, bottomResizable: true, height: size }}>
		{children}
	</ArchbaseSpace>
);

ArchbaseSpaceTopResizable.propTypes = resizableProps;

export const ArchbaseSpaceTop: React.FC<IArchbaseAnchorProps> = ({ size, children, resizable, ...commonProps }) => (
	<ArchbaseSpace
		{...commonProps}
		type={Type.Anchored}
		anchor={AnchorType.Top}
		position={{ left: 0, top: 0, right: 0, bottomResizable: resizable, height: size }}>
		{children}
	</ArchbaseSpace>
);

ArchbaseSpaceTop.propTypes = anchoredProps;

export const ArchbaseSpaceRightResizable: React.FC<IArchbaseResizableProps> = ({ children, size, ...props }) => (
	<ArchbaseSpace {...props} type={Type.Anchored} anchor={AnchorType.Right} position={{ bottom: 0, top: 0, right: 0, leftResizable: true, width: size }}>
		{children}
	</ArchbaseSpace>
);

ArchbaseSpaceRightResizable.propTypes = resizableProps;

export const ArchbaseSpaceRight: React.FC<IArchbaseAnchorProps> = ({ size, children, resizable, ...commonProps }) => (
	<ArchbaseSpace
		{...commonProps}
		type={Type.Anchored}
		anchor={AnchorType.Right}
		position={{ bottom: 0, top: 0, right: 0, leftResizable: resizable, width: size }}>
		{children}
	</ArchbaseSpace>
);

ArchbaseSpaceRight.propTypes = anchoredProps;

export const BottomResizable: React.FC<IArchbaseResizableProps> = ({ children, size, ...props }) => (
	<ArchbaseSpace {...props} type={Type.Anchored} anchor={AnchorType.Bottom} position={{ bottom: 0, left: 0, right: 0, topResizable: true, height: size }}>
		{children}
	</ArchbaseSpace>
);

BottomResizable.propTypes = resizableProps;

export const ArchbaseSpaceBottom: React.FC<IArchbaseAnchorProps> = ({ size, children, resizable, ...commonProps }) => (
	<ArchbaseSpace
		{...commonProps}
		type={Type.Anchored}
		anchor={AnchorType.Bottom}
		position={{ bottom: 0, left: 0, right: 0, topResizable: resizable, height: size }}>
		{children}
	</ArchbaseSpace>
);

ArchbaseSpaceBottom.propTypes = anchoredProps;
