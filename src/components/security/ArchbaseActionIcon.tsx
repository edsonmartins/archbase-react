import { ActionIcon, ActionIconProps, Button } from "@mantine/core";
import React from "react";
import { ArchbaseSecurityManager } from "./ArchbaseSecurityManager";

export interface ArchbaseActionIconSecurityProps {
    securityManager: ArchbaseSecurityManager;
    actionName: string;
    actionDescription: string;
}

export interface ArchbaseActionIconProps extends ActionIconProps {
    securityProps?: ArchbaseActionIconSecurityProps;
    onClick?: () => void;
}

export function ArchbaseActionIcon(props: ArchbaseActionIconProps) {
    const { securityProps, children, onClick, disabled, ...rest } = props;
    let isDisabled = disabled;
    if (securityProps) {
        securityProps.securityManager.registerAction(securityProps.actionName, securityProps.actionDescription)
        isDisabled = !securityProps.securityManager.hasPermission(securityProps.actionName)
    }
    return (
        <ActionIcon {...rest} disabled={isDisabled} onClick={onClick}>
            {children}
        </ActionIcon>
    )
}