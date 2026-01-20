import { ReactNode } from "react";
import { CardProps } from "@mantine/core";
export interface MockUser {
    email: string;
    password: string;
    type: string;
}
export interface ArchbaseLoginOptions {
    customContentBefore?: React.ReactNode;
    afterInputs?: React.ReactNode;
    customContentAfter?: React.ReactNode;
    cardProps?: CardProps;
}
export interface ArchbaseLoginProps {
    onLogin: (username: string, password: string, rememberMe: boolean) => Promise<void>;
    error?: string;
    onClickForgotPassword?: () => void;
    loginLabel?: string;
    loginPlaceholder?: string;
    afterInputs?: ReactNode;
    showMockUsersSelector?: boolean;
    mockUsers?: MockUser[];
    mockUsersGroupMap?: Record<string, string>;
    options?: ArchbaseLoginOptions;
    onChangeUsername?: (username: string) => void;
    disabledLogin?: boolean;
    isCheckingUsername?: boolean;
    showSignIn?: boolean;
}
export declare function ArchbaseLogin({ onLogin, error, onClickForgotPassword, loginLabel, loginPlaceholder, afterInputs, showMockUsersSelector, mockUsers, mockUsersGroupMap, options, onChangeUsername, disabledLogin, isCheckingUsername, showSignIn, }: ArchbaseLoginProps): import("react/jsx-runtime").JSX.Element;
