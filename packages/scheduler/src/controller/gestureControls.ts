/* eslint-disable react-compiler/react-compiler */
import { useGesture } from "@use-gesture/react";
import { isBefore } from "date-fns";
import { displayUnitAddFunc, displayUnitSubFunc } from "../utils";
import { SchedulerController } from "./controller";

export const useSchedulerGestures = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controller: SchedulerController<any, any>,
  bodyRef: React.RefObject<HTMLDivElement | null>,
  enabled?: boolean,
) => {
  useGesture(
    {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onWheel({ ctrlKey, movement: [x, y], event }) {
        if (ctrlKey) {
          event.preventDefault();

          const subDisplayUnit = displayUnitSubFunc(controller.displayUnit);
          const newStartDate = subDisplayUnit(
            controller.viewStartDate,
            y / 420,
          );
          const addDisplayUnit = displayUnitAddFunc(controller.displayUnit);
          const newEndDate = addDisplayUnit(controller.viewEndDate, y / 420);

          if (isBefore(newStartDate, newEndDate)) {
            controller.viewStartDate = newStartDate;
            controller.viewEndDate = newEndDate;
          }
        }
      },
      onMove({ ctrlKey, pressed, delta: [x], event }) {
        if (ctrlKey && pressed) {
          event.preventDefault();
          const movement = x / 7;
          const subDisplayUnit = displayUnitSubFunc(controller.displayUnit);
          const newStartDate = subDisplayUnit(
            controller.viewStartDate,
            movement,
          );

          const newEndDate = subDisplayUnit(controller.viewEndDate, movement);
          controller.viewStartDate = newStartDate;
          controller.viewEndDate = newEndDate;
        }
      },
    },
    {
      target: bodyRef,
      eventOptions: { passive: false },
      move: { threshold: 1 },
      enabled: enabled ?? false,
    },
  );
};
