import { Button, ButtonProps } from "@mantine/core"
import React from "react"
import { ArchbaseSecurityManager } from "./ArchbaseSecurityManager";

export interface ArchbaseActionButtonSecurityProps {
    securityManager: ArchbaseSecurityManager;
    actionName: string;
    actionDescription: string;
}

export interface ArchbaseActionButtonProps extends ButtonProps {
    securityProps?: ArchbaseActionButtonSecurityProps;
    onClick?: () => void;
}

export function ArchbaseActionButton(props: ArchbaseActionButtonProps) {
    const { securityProps, children, onClick, disabled, ...rest } = props;
    let isDisabled = disabled;
    if (securityProps) {
        securityProps.securityManager.registerAction(securityProps.actionName, securityProps.actionDescription)
        isDisabled = !securityProps.securityManager.hasPermission(securityProps.actionName)
    }
    return (
        <Button {...rest} disabled={isDisabled} onClick={onClick}>
            {children}
        </Button>
    )
}