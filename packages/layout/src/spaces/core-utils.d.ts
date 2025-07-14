import { ISpaceDefinition, SizeUnit, ISize } from "./core-types";
export declare function omit<K extends string, T extends Record<K, unknown>>(object: T, ...keys: K[]): Omit<T, K>;
export declare function shortuuid(): string;
export declare function getSizeString(size: SizeUnit): string;
export declare function css(size: ISize, dontAddCalc?: boolean): string;
export declare function coalesce<T>(...args: T[]): T;
export declare function adjustmentsEqual(item1: SizeUnit[], item2: SizeUnit[]): boolean;
export declare function throttle<F extends (...args: any) => any>(callback: F, limit: number): (...args: any) => void;
export declare function styleDefinition(space: ISpaceDefinition): string;
export declare function updateStyleDefinition(space: ISpaceDefinition): void;
export declare function removeStyleDefinition(space: ISpaceDefinition): void;
export declare function isServer(): boolean;
//# sourceMappingURL=core-utils.d.ts.map