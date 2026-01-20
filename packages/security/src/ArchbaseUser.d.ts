import { ArchbaseUsernameAndPassword as IArchbaseUsernameAndPassword, ArchbaseUser as IArchbaseUser } from '@archbase/core';
export declare class ArchbaseUser implements IArchbaseUser {
    id: string;
    displayName: string;
    email: string;
    photo: string;
    isAdmin: boolean;
    constructor(data: any);
    static newInstance(): ArchbaseUser;
}
export declare class ArchbaseUsernameAndPasswordImpl implements IArchbaseUsernameAndPassword {
    username: string;
    password: string;
    remember: boolean;
    constructor(data: any);
    static newInstance(): ArchbaseUsernameAndPasswordImpl;
}
export { ArchbaseUsernameAndPasswordImpl as ArchbaseUsernameAndPassword };
export type { ArchbaseUsernameAndPassword as IArchbaseUsernameAndPassword } from '@archbase/core';
