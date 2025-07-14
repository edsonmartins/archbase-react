import { SizeUnit, ResizeType } from "../core-types";
import * as React from "react";
import { IArchbaseSpaceCommonProps } from "../core-react";
interface IArchbaseSpacePositionedProps extends IArchbaseSpaceCommonProps {
    left?: SizeUnit;
    top?: SizeUnit;
    right?: SizeUnit;
    bottom?: SizeUnit;
    width?: SizeUnit;
    height?: SizeUnit;
    resizable?: ResizeType[];
    onResizeStart?: () => void | boolean;
    onResizeEnd?: (newSize: SizeUnit) => void;
}
export declare const ArchbaseSpacePositioned: React.FC<IArchbaseSpacePositionedProps>;
export {};
//# sourceMappingURL=ArchbaseSpacePositioned.d.ts.map