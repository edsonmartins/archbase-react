import { Box, Flex } from "@mantine/core";
import { formatDate } from "date-fns";
import { useSnapshot } from "valtio";
import { SchedulerController } from "../controller/controller";

export type MomentLabelProps<TData, TResource> = {
  moment: Date;
  controller: SchedulerController<TData, TResource>;
};

export function DefaultMomentLabel<TData, TResource>({
  controller,
  moment,
}: MomentLabelProps<TData, TResource>) {
  const snap = useSnapshot(controller);
  switch (snap.displayUnit) {
    case "year":
      return formatDate(moment, "yyyy");
    case "month":
      return formatDate(moment, "MMMM");
    case "week":
      return formatDate(moment, "w");
    case "day":
      return (
        <Flex direction="column">
          <Box>{formatDate(moment, "EEEE")}</Box>
          <Box>{formatDate(moment, "d MMMM")}</Box>
        </Flex>
      );
    case "hour":
      return formatDate(moment, "HH:mm aaa");
  }
}
