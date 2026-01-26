import { ArchbaseEntityTransformer, ArchbaseRemoteApiClient, ArchbaseRemoteApiService } from "@archbase/data";
import { UserDto } from "./SecurityDomain";
export declare class ArchbaseUserService extends ArchbaseRemoteApiService<UserDto, string> implements ArchbaseEntityTransformer<UserDto> {
    constructor(client: ArchbaseRemoteApiClient);
    protected configureHeaders(): Record<string, string>;
    transform(entity: UserDto): UserDto;
    protected getEndpoint(): string;
    getId(entity: UserDto): string;
    isNewRecord(entity: UserDto): boolean;
    getUserByEmail(email: string): Promise<UserDto>;
}
