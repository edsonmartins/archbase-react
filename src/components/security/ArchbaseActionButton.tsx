import { Button, ButtonProps } from "@mantine/core"
import React from "react"
import { ArchbaseSecurityManager } from "./ArchbaseSecurityManager";

export interface ArchbaseActionButtonProps extends ButtonProps {
    securityManager?: ArchbaseSecurityManager;
    actionName?: string;
    onClick?: () => void;
}

export function ArchbaseActionButton(props: ArchbaseActionButtonProps) {
    const { securityManager, actionName, children, onClick, disabled, ...rest } = props;
    let isDisabled = disabled;
    if (securityManager && actionName) {
        isDisabled = securityManager.hasPermission(actionName)
    }
    return (
        <Button {...rest} disabled={isDisabled} onClick={onClick}>
            {children}
        </Button>
    )
}