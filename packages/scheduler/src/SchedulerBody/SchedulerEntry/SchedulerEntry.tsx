import { Paper, useMantineTheme } from "@mantine/core";
import React from "react";
export interface SchedulerEntryProps<TData, TResource> {
  data: TData;
  resource: TResource;

  style: React.CSSProperties;
}

export type SchedulerEntryComponent<TData, TResource> = React.FC<
  SchedulerEntryProps<TData, TResource>
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DefaultSchedulerEntry: SchedulerEntryComponent<any, any> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data,
  style,
  ...props
}) => {
  const theme = useMantineTheme();

  return (
    <Paper
      bg={theme.primaryColor}
      style={{ ...style, overflow: "hidden" }}
      {...props}
    >
      Pass your own component to entryComponent prop to render your own thing
      here
    </Paper>
  );
};

interface SchedulerEntryRendererProps<TData, TResource>
  extends SchedulerEntryProps<TData, TResource> {
  CustomSchedulerEntry: SchedulerEntryComponent<TData, TResource>;
}

export function SchedulerEntryRenderer<TData, TResource>({
  CustomSchedulerEntry,
  ...props
}: SchedulerEntryRendererProps<TData, TResource>) {
  return <CustomSchedulerEntry {...props} />;
}
