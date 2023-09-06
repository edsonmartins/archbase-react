import * as React from "react";

interface IProps {
	children?: React.ReactNode;
}

export const ArchbaseSpaceCenteredVertically: React.FC<IProps> = (props) => <div className={`spaces-centered-vertically`}>{props.children}</div>;
