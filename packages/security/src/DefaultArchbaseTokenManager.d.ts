import "reflect-metadata";
import { ArchbaseTokenManager, ArchbaseAccessToken, ArchbaseUsernameAndPassword } from '@archbase/core';
export declare const ENCRYPTION_KEY = "YngzI1guK3dGaElFcFY9MywqK3xgPzg/Ojg7eD8xRmg=";
export declare const TOKEN_COOKIE_NAME = "c1ab58e7-c113-4225-a190-a9e59d1207fc";
export declare const USER_NAME_AND_PASSWORD = "6faf6932-a0b5-457b-83b1-8d89ddbd91fd";
export declare const USER_NAME = "602b05c5-ec46-451e-aba6-187e463bc245";
export declare class DefaultArchbaseTokenManager implements ArchbaseTokenManager {
    getUsernameAndPassword(): ArchbaseUsernameAndPassword | null;
    saveUsernameAndPassword(username: string, password: string): void;
    getUsername(): string | null;
    saveUsername(username: string): void;
    isTokenExpired(token?: ArchbaseAccessToken, expirationThreshold?: number): boolean;
    saveToken(accessToken?: ArchbaseAccessToken): void;
    clearUsernameAndPassword(): void;
    clearToken(): void;
    getToken(): ArchbaseAccessToken | null;
}
//# sourceMappingURL=DefaultArchbaseTokenManager.d.ts.map