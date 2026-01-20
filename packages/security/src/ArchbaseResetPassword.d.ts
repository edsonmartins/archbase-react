import { CSSProperties } from "@mantine/core";
export interface ArchbaseResetPasswordProps {
    error?: string;
    initialEmail?: string;
    description?: string;
    onSendResetPasswordEmail: (email: string) => Promise<void>;
    onResetPassword: (email: string, passwordResetToken: string, newPassword: string) => Promise<void>;
    onClickBackToLogin: () => void;
    validatePassword?: () => string;
    validateToken?: () => string;
    /** Estilo do card */
    style?: CSSProperties;
}
export declare function ArchbaseResetPassword({ error, onSendResetPasswordEmail, onResetPassword, onClickBackToLogin, validatePassword, validateToken, initialEmail, description, style }: ArchbaseResetPasswordProps): import("react/jsx-runtime").JSX.Element;
