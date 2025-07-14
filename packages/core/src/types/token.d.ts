/**
 * Interface representing an access token used for authentication
 */
export interface ArchbaseAccessToken {
    token_type: string;
    scope: string;
    expires_in: number;
    ext_expires_in: number;
    access_token: string;
    refresh_token: string;
    id_token: string;
}
/**
 * Interface representing username and password credentials
 */
export interface ArchbaseUsernameAndPassword {
    username: string;
    password: string;
    remember: boolean;
}
/**
 * Interface representing a user in the system
 */
export interface ArchbaseUser {
    id: string;
    displayName: string;
    email: string;
    photo: string;
    isAdmin: boolean;
}
/**
 * Interface for token management operations
 */
export interface ArchbaseTokenManager {
    saveUsernameAndPassword(username: string, password: string): void;
    getUsernameAndPassword(): ArchbaseUsernameAndPassword | null;
    saveUsername(username: string): void;
    getUsername(): string | null;
    saveToken(accessToken?: ArchbaseAccessToken): void;
    clearToken(): void;
    clearUsernameAndPassword(): void;
    getToken(): ArchbaseAccessToken | null;
    isTokenExpired(token?: ArchbaseAccessToken, expirationThreshold?: number): boolean;
}
//# sourceMappingURL=token.d.ts.map