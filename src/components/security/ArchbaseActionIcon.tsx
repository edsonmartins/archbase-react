import { ActionIcon, ActionIconProps, Button } from "@mantine/core";
import React from "react";
import { ArchbaseSecurityManager } from "./ArchbaseSecurityManager";

export interface ArchbaseActionIconProps extends ActionIconProps {
    securityManager?: ArchbaseSecurityManager;
    actionName?: string;
}

export function ArchbaseActionIcon(props: ArchbaseActionIconProps) {
    let disabled = props.disabled;
    if (props.securityManager && props.actionName) {
        disabled = props.securityManager.hasPermission(props.actionName)
    }
    return (
        <ActionIcon {...props} disabled={disabled}/>
    )
}