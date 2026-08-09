/* eslint-disable react-compiler/react-compiler */
import { isBefore, isEqual } from "date-fns";
import { DragEvent, useEffect, useRef } from "react";
import { SchedulerController } from "./controller";
export type OnSelectFn<TData, TResource> = (params: {
  firstMoment: Date;
  lastMoment: Date;
  controller: SchedulerController<TData, TResource>;
  resource: TResource;
}) => void;

export type SchedulerMomentOnDragStartOverFactory = (
  moment: Date,
  nextMoment: Date,
  resourceId: string,
) => (event: DragEvent<HTMLDivElement>) => void;
export type SchedulerMomentOnDragEndFn<TResource> = (
  event: DragEvent<HTMLDivElement>,
  resource: TResource,
  resourceId: string,
) => void;

export type SchedulerMomentSelectClickFnFactory<TResource> = (
  resource: TResource,
  moment: Date,
  nextMoment: Date,
) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;

export const useSchedulerSelect = <TData, TResource>(
  controller: SchedulerController<TData, TResource>,
  onSelect?: OnSelectFn<TData, TResource>,
) => {
  const constantDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    controller.momentDragStartOver = onSelect
      ? (moment: Date, nextMoment: Date, resourceId: string) => (event) => {
          if (
            !event.ctrlKey &&
            (controller.selectedResourceId === resourceId ||
              controller.selectedResourceId === null)
          ) {
            if (!constantDiv.current) {
              constantDiv.current = document.createElement("div");
            }
            event.dataTransfer.setDragImage(constantDiv.current, 0, 0);
            if (
              !controller.firstSelectedMoment ||
              isBefore(moment, controller.firstSelectedMoment)
            ) {
              controller.firstSelectedMoment = moment;
            } else if (
              !controller.lastSelectedMoment ||
              !isEqual(controller.lastSelectedMoment, nextMoment)
            ) {
              controller.lastSelectedMoment = nextMoment;
            }
            if (!controller.selectedResourceId) {
              controller.selectedResourceId = resourceId;
            }
            const selection = controller.selectedMoments[resourceId] ?? {};

            if (!controller.selectedMoments[resourceId]) {
              controller.selectedMoments[resourceId] = selection;
            }

            // mark as selected
            let isBetween = false;
            for (const [subMoment] of controller.subbedMoments) {
              if (isEqual(subMoment, controller.firstSelectedMoment)) {
                isBetween = true;
              }
              if (isEqual(subMoment, nextMoment)) {
                break;
              }
              if (
                isBetween &&
                !selection[subMoment.toISOString()]?.isSelected
              ) {
                selection[subMoment.toISOString()] = { isSelected: true };
              }
            }
          }
        }
      : undefined;
  }, [constantDiv, controller, onSelect]);

  useEffect(() => {
    controller.momentDragEnd = onSelect
      ? (event, resource, resourceId) => {
          event.preventDefault();
          if (
            !event.ctrlKey &&
            onSelect &&
            controller.firstSelectedMoment &&
            controller.lastSelectedMoment
          ) {
            onSelect({
              firstMoment: controller.firstSelectedMoment,
              lastMoment: controller.lastSelectedMoment,
              resource,
              controller,
            });

            controller.firstSelectedMoment = null;
            controller.lastSelectedMoment = null;
            controller.selectedMoments[resourceId] = {};
            controller.selectedResourceId = null;
          }
        }
      : undefined;
  }, [controller, onSelect]);
  useEffect(() => {
    controller.momentSelectClick = onSelect
      ? (resource, firstMoment, lastMoment) => (event) => {
          event.preventDefault();

          onSelect({
            controller,
            resource,
            firstMoment,
            lastMoment,
          });
        }
      : undefined;
  }, [controller, onSelect]);
};
