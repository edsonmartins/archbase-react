import 'reflect-metadata';
import { ArchbaseTokenManager } from '@archbase/core';
export interface Page<T> {
    content: T[];
    pageable?: Pageable;
    page?: SimplePage;
    totalElements: number;
    totalPages: number;
    last: boolean;
    sort: Sort;
    number: number;
    size: number;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
export interface SimplePage {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}
export interface Pageable {
    sort: Sort;
    offset: number;
    pageSize: number;
    pageNumber: number;
    unpaged: boolean;
    paged: boolean;
}
export interface Sort {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}
export interface ArchbaseRemoteApiClient {
    get<T>(url: string, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<T>;
    post<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>;
    put<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>;
    postNoConvertId<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>;
    putNoConvertId<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>;
    binaryPut<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>;
    delete<T>(url: string, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<T>;
    patch<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>;
    patchNoConvertId<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>;
}
export declare class ArchbaseAxiosRemoteApiClient implements ArchbaseRemoteApiClient {
    protected tokenManager: ArchbaseTokenManager;
    constructor(tokenManager: ArchbaseTokenManager);
    protected prepareHeaders(headers?: Record<string, string>, withoutToken?: boolean): Record<string, string>;
    get<T>(url: string, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<T>;
    post<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>;
    postNoConvertId<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>;
    put<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>;
    putNoConvertId<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>;
    binaryPut<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>;
    delete<T>(url: string, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<T>;
    patch<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>;
    patchNoConvertId<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>;
}
export interface ArchbaseEntityTransformer<T> {
    transform(entity: T): T;
}
export declare abstract class ArchbaseRemoteApiService<T, ID> {
    protected readonly client: ArchbaseRemoteApiClient;
    constructor(client: ArchbaseRemoteApiClient);
    protected abstract getEndpoint(): string;
    abstract getId(entity: T): ID;
    protected abstract configureHeaders(): Record<string, string>;
    protected transformPage(page: Page<T>): void;
    protected transformList(list: T[]): void;
    private isTransformable;
    validate(entity: T): Promise<void>;
    validateGroup<R>(entity: T, groups: any[]): Promise<R>;
    exists(id: ID): Promise<boolean>;
    findAll(page: number, size: number): Promise<Page<T>>;
    findAllWithSort(page: number, size: number, sort: string[]): Promise<Page<T>>;
    findAllByIds(ids: ID[]): Promise<T[]>;
    findAllWithFilter(filter: string, page: number, size: number): Promise<Page<T>>;
    findAllMultipleFields(value: string, fields: string, page: number, size: number, sort: string): Promise<Page<T>>;
    findAllWithFilterAndSort(filter: string, page: number, size: number, sort: string[]): Promise<Page<T>>;
    findOne(id: ID): Promise<T>;
    findByComplexId<R>(id: T): Promise<R>;
    existsByComplexId(id: T): Promise<boolean>;
    save<R>(entity: T): Promise<R>;
    delete<T>(id: ID): Promise<void>;
    abstract isNewRecord(entity: T): boolean;
}
export declare class DefaultPage<T> implements Page<T> {
    content: T[];
    pageable: Pageable;
    totalElements: number;
    totalPages: number;
    last: boolean;
    sort: Sort;
    number: number;
    size: number;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
    constructor(content: T[], totalElements: number, totalPages: number, pageNumber: number, pageSize: number, sort?: Sort, last?: boolean, first?: boolean, numberOfElements?: number, empty?: boolean);
    static createFromValues<T>(content: T[], totalElements: number, totalPages: number, pageNumber: number, pageSize: number): DefaultPage<T>;
}
//# sourceMappingURL=ArchbaseRemoteApiService.d.ts.map