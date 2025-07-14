export declare function useArchbasePasswordRemember(): {
    rememberMe: boolean;
    username: string;
    password: string;
    setRememberMe: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setUsername: import("react").Dispatch<import("react").SetStateAction<string>>;
    setPassword: import("react").Dispatch<import("react").SetStateAction<string>>;
    saveCredentials: (user: string, pass: string, remember: boolean) => void;
    clearCredentials: () => void;
};
//# sourceMappingURL=useArchbasePasswordRemember.d.ts.map