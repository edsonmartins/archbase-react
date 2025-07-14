export interface ResetPasswordReturnType {
    sendResetPasswordEmail: (email: string) => Promise<void>;
    resetPassword: (email: string, passwordResetToken: string, newPassword: string) => Promise<void>;
    isError: boolean;
    error: any;
    clearError: () => void;
}
export declare const useArchbaseResetPassword: () => ResetPasswordReturnType;
//# sourceMappingURL=useArchbaseResetPassword.d.ts.map