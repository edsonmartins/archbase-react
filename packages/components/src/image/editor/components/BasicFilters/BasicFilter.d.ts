import React from 'react';
import { IBasicFilterState } from '../../models/index.models';
export interface BasicFilterProps {
    color: string;
    initialState: IBasicFilterState | undefined | null;
    changeFilter: Function;
}
declare const BasicFilter: React.MemoExoticComponent<({ color, initialState, changeFilter }: BasicFilterProps) => import("react/jsx-runtime").JSX.Element>;
export default BasicFilter;
//# sourceMappingURL=BasicFilter.d.ts.map