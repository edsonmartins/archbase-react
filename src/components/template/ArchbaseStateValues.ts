export type ArchbaseStateValues = {
  values: Map<string, any>;
  setValue: (key: string, value: any) => void;
  existsValue: (key: string) => boolean;
  clearValue: (key: string) => void;
  clearAllValues: () =>void;
}
