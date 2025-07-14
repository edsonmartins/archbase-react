import React from 'react';
import { ProfileDto } from './SecurityDomain';
export interface RenderProfileUserItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
    description: string;
    origin: ProfileDto;
}
export declare const RenderProfileUserItem: React.ForwardRefExoticComponent<RenderProfileUserItemProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=RenderProfileUserItem.d.ts.map