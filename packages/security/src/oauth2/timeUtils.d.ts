import { TTokenResponse } from './Types';
export declare const FALLBACK_EXPIRE_TIME = 600;
export declare const epochAtSecondsFromNow: (secondsFromNow: number) => number;
/**
 * Verifique se o token de acesso expirou.
 * Retornará True se o token expirou OU falta menos de 30 segundos para expirar.
 */
export declare function epochTimeIsPast(timestamp: number): boolean;
export declare function getRefreshExpiresIn(tokenExpiresIn: number, response: TTokenResponse): number;
//# sourceMappingURL=timeUtils.d.ts.map