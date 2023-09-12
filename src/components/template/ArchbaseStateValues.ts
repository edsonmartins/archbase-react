export type ArchbaseStateValues = {
  values: Map<string, any>;
  setValue: (key: string, value: any) => void;
  getValue: (key) => any;
  existsValue: (key: string) => boolean;
  clearValue: (key: string) => void;
  clearAllValues: () => void;
  reset: () =>void;
}
