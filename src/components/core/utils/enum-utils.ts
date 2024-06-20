export function getKeyByEnumValue<T>(enumObj: T, value: any): string | undefined {
    let keys = Object.keys(enumObj).filter(x => enumObj[x as keyof T] === value);
    return keys.length > 0 ? keys[0] : undefined;
}