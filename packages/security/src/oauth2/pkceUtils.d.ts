export declare function getRandomInteger(range: number): number;
export declare function generateRandomString(length: number): string;
/**
 *  PKCE Code Challenge = base64url(hash(codeVerifier))
 */
export declare function generateCodeChallenge(codeVerifier: string): Promise<string>;
//# sourceMappingURL=pkceUtils.d.ts.map