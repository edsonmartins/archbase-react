import { Button, ButtonProps } from "@mantine/core"
import React from "react"
import { SecurityProps } from "./SecurityProps";

export interface ArchbaseActionButtonProps extends ButtonProps {
    securityProps?: SecurityProps;
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