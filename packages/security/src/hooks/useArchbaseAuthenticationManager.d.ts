export interface AuthenticationManagerReturnType {
    login: (username: string, password: string, rememberMe: boolean) => void;
    logout: () => void;
    username: string;
    isAuthenticating: boolean;
    isInitializing: boolean;
    isAuthenticated: boolean;
    isError: boolean;
    error: any;
    clearError: () => void;
    accessToken?: string | null;
}
export interface ArchbaseAuthenticationManagerProps {
    checkIntervalTokenHasExpired?: number;
    expirationThresholdOfToken?: number;
}
export declare const useArchbaseAuthenticationManager: ({ checkIntervalTokenHasExpired, expirationThresholdOfToken }: ArchbaseAuthenticationManagerProps) => AuthenticationManagerReturnType;
//# sourceMappingURL=useArchbaseAuthenticationManager.d.ts.map