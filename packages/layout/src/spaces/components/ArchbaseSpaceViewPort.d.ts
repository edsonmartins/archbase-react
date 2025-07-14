import { SizeUnit } from "../core-types";
import * as React from "react";
import { IArchbaseSpaceCommonProps } from "../core-react";
interface IArchbaseSpaceViewPortProps extends IArchbaseSpaceCommonProps {
    left?: SizeUnit;
    right?: SizeUnit;
    top?: SizeUnit;
    bottom?: SizeUnit;
}
export declare const ArchbaseSpaceViewPort: React.FC<IArchbaseSpaceViewPortProps>;
export {};
//# sourceMappingURL=ArchbaseSpaceViewPort.d.ts.map