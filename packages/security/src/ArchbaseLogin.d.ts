import { ReactNode } from "react";
export interface ArchbaseLoginProps {
    onLogin: (username: string, password: string, rememberMe: boolean) => Promise<void>;
    error?: string;
    onClickForgotPassword?: () => void;
    loginLabel?: string;
    loginPlaceholder?: string;
    afterInputs?: ReactNode;
}
export declare function ArchbaseLogin({ onLogin, error, onClickForgotPassword, loginLabel, loginPlaceholder, afterInputs, }: ArchbaseLoginProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseLogin.d.ts.map