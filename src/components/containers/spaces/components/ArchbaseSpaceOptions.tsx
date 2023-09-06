import * as React from "react";
import { IArchbaseSpacesOptions, OptionsContext } from "../core-react";

interface IProps extends IArchbaseSpacesOptions {
	children?: React.ReactNode;
}

export const ArchbaseSpaceOptions: React.FC<IProps> = ({ children, ...opts }) => {
	return <OptionsContext.Provider value={opts}>{children}</OptionsContext.Provider>;
};
