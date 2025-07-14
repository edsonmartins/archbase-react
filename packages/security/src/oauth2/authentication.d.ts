import { TInternalConfig, TTokenResponse } from './Types';
export declare function redirectToLogin(config: TInternalConfig, customState?: string): Promise<void>;
export declare const fetchTokens: (config: TInternalConfig) => Promise<TTokenResponse>;
export declare const fetchWithRefreshToken: (props: {
    config: TInternalConfig;
    refreshToken: string;
}) => Promise<TTokenResponse>;
export declare function redirectToLogout(config: TInternalConfig, token: string, refresh_token?: string, idToken?: string, state?: string, logoutHint?: string): void;
export declare function validateState(urlParams: URLSearchParams): void;
//# sourceMappingURL=authentication.d.ts.map