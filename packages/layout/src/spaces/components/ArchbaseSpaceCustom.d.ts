import { Type, SizeUnit, AnchorType, ResizeType } from "../core-types";
import * as React from "react";
import { IArchbaseSpaceCommonProps } from "../core-react";
import { IArchbaseAnchorProps } from "./ArchbaseSpaceAnchored";
type IArchbaseSpaceCustomProps = Omit<IArchbaseSpaceCommonProps & IArchbaseAnchorProps, "size"> & {
    type?: Type;
    anchor?: AnchorType;
    anchorSize?: SizeUnit;
    left?: SizeUnit | undefined;
    top?: SizeUnit | undefined;
    right?: SizeUnit | undefined;
    bottom?: SizeUnit | undefined;
    width?: SizeUnit | undefined;
    height?: SizeUnit | undefined;
    resizeTypes?: ResizeType[];
};
export declare const ArchbaseSpaceCustom: React.FC<IArchbaseSpaceCustomProps>;
export {};
//# sourceMappingURL=ArchbaseSpaceCustom.d.ts.map