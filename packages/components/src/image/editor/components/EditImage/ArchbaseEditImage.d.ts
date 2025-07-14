import React from 'react';
import { IState } from '../../models/index.models';
import './ArchbaseEditImage.scss';
export interface ArchbaseEditImageProps {
    image: string | null | undefined;
    color: string;
    initialState: IState;
    saveUpdates: Function;
}
declare const ArchbaseEditImage: React.MemoExoticComponent<({ image, color, initialState, saveUpdates }: ArchbaseEditImageProps) => import("react/jsx-runtime").JSX.Element>;
export default ArchbaseEditImage;
//# sourceMappingURL=ArchbaseEditImage.d.ts.map