import {
  CSSProperties,
  MantineStyleProp,
  MantineTheme,
  Paper,
} from "@mantine/core";

import { DragEvent, useState } from "react";
import { useSnapshot } from "valtio";
import { SchedulerController } from "../../controller/controller";

import React from "react";
import {
  SchedulerMomentOnDragEndFn,
  SchedulerMomentOnDragStartOverFactory,
  SchedulerMomentSelectClickFnFactory,
} from "../../controller/selectControls";
import classes from "./SchedulerMoment.module.css";
import { MomentStyleFn } from "./momentStyling";

export interface SchedulerMomentsProps<TData, TResource> {
  resourceId: string;
  rowIndex: number;
  rowHeight: CSSProperties["height"];
  momentStyle?: MomentStyleFn<TData, TResource>;
  resourcesCount: number;
  controller: SchedulerController<TData, TResource>;
  resource: TResource;
  theme: MantineTheme;
}

const SchedulerMoment = React.memo(
  ({
    momentStyle,
    resourcesCount,
    nextMoment,
    draggingEnabled,
    setDraggingEnabled,
    distance,
    rowIndex,
    rowHeight,
    moment,
    resourceId,
    controller,
    resource,
    momentDragEnd,
    theme,
    isSelected,
    momentDragStartOver,
    momentSelectClick,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: SchedulerMomentsProps<any, any> & {
    distance: number;

    moment: Date;
    draggingEnabled: boolean;
    setDraggingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    nextMoment: Date;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    momentDragEnd?: SchedulerMomentOnDragEndFn<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    momentSelectClick?: SchedulerMomentSelectClickFnFactory<any>;
    momentDragStartOver?: SchedulerMomentOnDragStartOverFactory;
    isSelected: boolean;
  }) => {
    const onClick = momentSelectClick?.(resource, moment, nextMoment);
    const onDragEnd = momentDragEnd
      ? (event: DragEvent<HTMLDivElement>) =>
          momentDragEnd?.(event, resource, resourceId)
      : undefined;
    const onDragStartOver = momentDragStartOver?.(
      moment,
      nextMoment,
      resourceId,
    );
    const completeStyle: MantineStyleProp = {
      ...momentStyle?.({
        moment,
        controller,
        theme,
        isSelected,
      }),
      borderTopWidth: rowIndex === 0 ? undefined : 0,
      borderRightWidth: 0,

      borderBottomWidth: rowIndex === resourcesCount - 1 ? 0 : undefined,
    };

    return (
      <Paper
        radius={0}
        w={`${distance}%`}
        h={rowHeight}
        withBorder
        style={completeStyle}
        className={classes.schedulerMoment}
        data-selected={isSelected}
        onDragEnd={onDragEnd}
        onDragOver={onDragStartOver}
        onDragStart={onDragStartOver}
        onMouseDown={() => {
          setDraggingEnabled(true);
        }}
        onMouseUp={() => setDraggingEnabled(false)}
        draggable={draggingEnabled && !!(onDragEnd && onDragStartOver)}
        onClick={onClick}
      />
    );
  },
);

SchedulerMoment.displayName = "SchedulerMoment";

export const SchedulerMoments = <TData, TResource>({
  controller,
  resourceId,
  ...props
}: SchedulerMomentsProps<TData, TResource>) => {
  const subbedMoments = useSnapshot(controller.subbedMoments);
  const { momentDragEnd, momentSelectClick, momentDragStartOver } =
    useSnapshot(controller);

  const selectSnap = useSnapshot(controller.selectedMoments);

  const [draggingEnabled, setDraggingEnabled] = useState(false);

  return (
    <>
      {subbedMoments.map(([moment, distance], momentIndex) => {
        return (
          <SchedulerMoment
            key={`moment_${resourceId}_${momentIndex}`}
            {...props}
            distance={distance}
            draggingEnabled={draggingEnabled}
            setDraggingEnabled={setDraggingEnabled}
            moment={moment}
            nextMoment={
              momentIndex + 1 < subbedMoments.length
                ? subbedMoments[momentIndex + 1][0]
                : moment
            }
            controller={controller}
            isSelected={
              !!selectSnap[resourceId]?.[moment.toISOString()]?.isSelected
            }
            resourceId={resourceId}
            momentDragStartOver={momentDragStartOver}
            momentSelectClick={momentSelectClick}
            momentDragEnd={momentDragEnd}
          />
        );
      })}
    </>
  );
};
