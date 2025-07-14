import { AlertProps, AlertVariant, MantineColor } from '@mantine/core';
import React from 'react';
export interface ArchbaseAlertProps extends AlertProps {
    title?: React.ReactNode;
    variant?: AlertVariant | string;
    children: React.ReactNode;
    color?: MantineColor;
    titleColor?: MantineColor;
    icon?: React.ReactNode;
    withCloseButton?: boolean;
    onClose?: () => void;
    autoClose?: number;
    closeButtonLabel?: string;
    radius?: string | number | undefined;
    withBorder?: boolean;
    backgroundColor?: MantineColor;
}
export declare function ArchbaseAlert(props: ArchbaseAlertProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseAlert.d.ts.map