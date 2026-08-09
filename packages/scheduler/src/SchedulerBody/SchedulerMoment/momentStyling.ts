import { MantineStyleProp, MantineTheme } from "@mantine/core";
import { SchedulerController } from "../../controller/controller";

export type MomentStyleFn<TData, TResource> = (params: {
  moment: Date;
  controller: SchedulerController<TData, TResource>;
  theme: MantineTheme;
  isSelected?: boolean;
}) => MantineStyleProp | undefined;
