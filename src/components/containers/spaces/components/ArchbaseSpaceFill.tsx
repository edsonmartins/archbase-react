import { Type } from "../core-types";
import * as React from "react";
import { ArchbaseSpace } from "./ArchbaseSpace";
import { commonProps, IArchbaseSpaceCommonProps } from "../core-react";

export const ArchbaseSpaceFill: React.FC<IArchbaseSpaceCommonProps> = (props) => (
	<ArchbaseSpace {...props} type={Type.Fill} position={{ left: 0, top: 0, right: 0, bottom: 0 }}>
		{props.children}
	</ArchbaseSpace>
);

ArchbaseSpaceFill.propTypes = commonProps;
