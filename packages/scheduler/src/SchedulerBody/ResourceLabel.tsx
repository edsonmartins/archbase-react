import { Center } from "@mantine/core";

export interface ResourceLabelProps<TResource> {
  resource: TResource;
  getResourceId: (resource: TResource) => string;
}

export function DefaultResourceLabel<TResource>({
  resource,
  getResourceId,
}: ResourceLabelProps<TResource>) {
  return <Center>{getResourceId(resource)}</Center>;
}
