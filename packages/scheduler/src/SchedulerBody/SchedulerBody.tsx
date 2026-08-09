import { Box, Flex, MantineTheme, Paper } from "@mantine/core";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import React, { useMemo, useRef } from "react";
import { useSnapshot } from "valtio";
import { SchedulerController } from "../controller/controller";
import gridClasses from "../Scheduler/SchedulerGrid.module.css";
import {
  DataFieldAccessor,
  useDateAccessor,
  useStringAccessor,
  useStringArrayAccessor,
} from "../utils";

import {
  DefaultNowMarker,
  NowMarkerController,
  NowMarkerProps,
} from "./NowMarker";
import { DefaultResourceLabel, ResourceLabelProps } from "./ResourceLabel";

import { isAfter, isBefore } from "date-fns";
import { Activity } from "react";
import { useSchedulerGestures } from "../controller/gestureControls";
import {
  DefaultSchedulerEntry,
  SchedulerEntryProps,
  SchedulerEntryRenderer,
} from "./SchedulerEntry/SchedulerEntry";
import { MomentStyleFn } from "./SchedulerMoment/momentStyling";
import { SchedulerMoments } from "./SchedulerMoment/SchedulerMoment";
export interface SchedulerBodyProps<TData, TResource> {
  startDate?: Date;
  endDate?: Date;
  data: TData[];
  resources: TResource[];
  startDateAccessor: DataFieldAccessor<TData, Date>;
  endDateAccessor: DataFieldAccessor<TData, Date>;
  dataIdAccessor: DataFieldAccessor<TData, string | number>;
  dataResourceIdAccessor: DataFieldAccessor<
    TData,
    string | number | string[] | number[]
  >;
  resourceIdAccessor: DataFieldAccessor<TResource, string | number>;
  controller: SchedulerController<TData, TResource>;
  rowHeight: number;
  resourceLabelComponent?: React.FC<ResourceLabelProps<TResource>>;
  entryComponent?: React.FC<SchedulerEntryProps<TData, TResource>>;
  nowMarkerComponent?: React.FC<NowMarkerProps>;

  momentStyle?: MomentStyleFn<TData, TResource>;
  enableVirtualizer?: boolean;
  gridLabelSize: number;
  totalGridSize: number;
  tz?: string;
  enableGestures?: boolean;
  theme: MantineTheme;
}

const SchedulerEntries = <TData, TResource>({
  data,
  rowHeight,
  getDataId,
  entryComponent,
  entryOffsets,
  getEndDate,
  getStartDate,
  controller,
  resource,
}: {
  data: TData[];
  getDataId: (dataItem: TData) => string;
  entryOffsets: Record<string, number | undefined>;
  getEndDate: (dataItem: TData) => Date;
  getStartDate: (dataItem: TData) => Date;
  entryComponent: NonNullable<
    SchedulerBodyProps<TData, TResource>["entryComponent"]
  >;
  rowHeight: number;
  controller: SchedulerController<TData, TResource>;
  resource: TResource;
}) => {
  const { viewStartDate, viewEndDate, calculateDistancePercentage } =
    useSnapshot(controller);
  const entryHeight = rowHeight * 0.8;
  return (
    <>
      {data.map((item) => {
        const startDate = getStartDate(item);
        const endDate = getEndDate(item);
        const isVisible =
          isBefore(viewStartDate, endDate) && isAfter(viewEndDate, startDate);

        const startDistance = calculateDistancePercentage(startDate, "left");
        const endDistance = calculateDistancePercentage(endDate, "right");

        const entryId = getDataId(item);
        const offsetMultiplier = entryOffsets[entryId] ?? 0;
        const top = rowHeight * offsetMultiplier + 0.1 * rowHeight;
        return (
          <Activity
            key={`entry_${entryId}`}
            mode={isVisible ? "visible" : "hidden"}
          >
            <SchedulerEntryRenderer
              CustomSchedulerEntry={entryComponent}
              style={{
                position: "absolute",
                top,
                left: `${startDistance}%`,
                height: entryHeight,
                right: `${endDistance}%`,
              }}
              data={item}
              resource={resource}
            />
          </Activity>
        );
      })}
    </>
  );
};

function SchedulerBodyRow<TData, TResource>({
  customNowMarker,
  data,
  resourceId,
  getEndDate,
  getStartDate,
  resourcesCount,
  multipliedRowHeight,
  rowIndex,
  momentStyle,
  rowHeight,
  getDataId,
  entryComponent,
  controller,
  resource,
  theme,
  tz,
  entryOffsets,
}: {
  data: TData[];
  tz?: string;
  resourcesCount: number;
  customNowMarker: NonNullable<
    SchedulerBodyProps<TData, TResource>["nowMarkerComponent"]
  >;
  getDataId: (dataItem: TData) => string;
  entryOffsets: Record<string, number | undefined>;
  getEndDate: (dataItems: TData) => Date;
  getStartDate: (dataItem: TData) => Date;

  resourceId: string;
  entryComponent: NonNullable<
    SchedulerBodyProps<TData, TResource>["entryComponent"]
  >;
  theme: MantineTheme;
  multipliedRowHeight: number;
  rowHeight: number;
  rowIndex: number;

  momentStyle?: MomentStyleFn<TData, TResource>;
  controller: SchedulerController<TData, TResource>;
  resource: TResource;
}) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  const { calculateDistancePercentage } = useSnapshot(controller);

  return (
    <Flex pos="relative" ref={rowRef} style={{ touchAction: "pan-y" }}>
      <NowMarkerController
        distanceCalculator={calculateDistancePercentage}
        markerComponent={customNowMarker}
        tz={tz}
      />
      <SchedulerEntries
        data={data}
        getEndDate={getEndDate}
        getStartDate={getStartDate}
        entryComponent={entryComponent}
        controller={controller}
        getDataId={getDataId}
        resource={resource}
        entryOffsets={entryOffsets}
        rowHeight={rowHeight}
      />
      <SchedulerMoments
        resourceId={resourceId}
        resourcesCount={resourcesCount}
        rowHeight={multipliedRowHeight}
        rowIndex={rowIndex}
        momentStyle={momentStyle}
        resource={resource}
        controller={controller}
        theme={theme}
      />
    </Flex>
  );
}

export function SchedulerBody<TData, TResource>({
  resources,
  resourceIdAccessor: resourceIdField,
  data,
  dataResourceIdAccessor: dataResourceIdField,
  endDateAccessor: endDateField,
  startDateAccessor: startDateField,
  resourceLabelComponent,
  entryComponent,
  nowMarkerComponent,

  rowHeight,
  controller,
  momentStyle,
  dataIdAccessor,
  enableVirtualizer,
  totalGridSize,
  gridLabelSize,
  tz,
  enableGestures,
  theme,
}: SchedulerBodyProps<TData, TResource>) {
  const localBodyRef = useRef<HTMLDivElement | null>(null);
  useSchedulerGestures(controller, localBodyRef, enableGestures);
  const getResourceId = useStringAccessor(resourceIdField);
  const getDataResourceId = useStringArrayAccessor(dataResourceIdField);
  const getStartDate = useDateAccessor(startDateField);
  const getEndDate = useDateAccessor(endDateField);
  const getDataId = useStringAccessor(dataIdAccessor);
  const CustomResourceLabel = useMemo(
    () => resourceLabelComponent ?? DefaultResourceLabel,
    [resourceLabelComponent],
  );
  const customSchedulerEntry = useMemo(
    () => entryComponent ?? DefaultSchedulerEntry,
    [entryComponent],
  );
  const customNowMarker = useMemo(
    () => nowMarkerComponent ?? DefaultNowMarker,
    [nowMarkerComponent],
  );
  const groupedData = useMemo(() => {
    const res: Record<string, TData[] | undefined> = {};

    for (const entry of data) {
      const resourceIds = getDataResourceId(entry);
      for (const resourceId of resourceIds) {
        const existingData = res[resourceId];
        if (!existingData) {
          res[resourceId] = [entry];
        } else {
          existingData.push(entry);
        }
      }
    }
    return res;
  }, [data, getDataResourceId]);

  const [rowMultipliers, entryPosMultipliers] = useMemo(() => {
    const rows: Record<string, number | undefined> = {};
    const entries: Record<string, number | undefined> = {};
    for (const resource of resources) {
      const resourceId = getResourceId(resource);
      const resourceData = groupedData[resourceId] ?? [];
      let rowMultiplier = 1;
      for (let i = 0; i < resourceData.length; i++) {
        const entry1 = resourceData[i];
        const entryId1 = getDataId(entry1);

        const startDate1 = getStartDate(entry1);
        const endDate1 = getEndDate(entry1);

        const entry1Offset = entries[entryId1] ?? 0;

        let entryCollisions = 1;
        for (let j = i + 1; j < resourceData.length; j++) {
          const entry2 = resourceData[j];
          const startDate2 = getStartDate(entry2);
          const endDate2 = getEndDate(entry2);
          const entryId2 = getDataId(entry2);
          const entry2Offset = entries[entryId2];
          if (isBefore(startDate1, endDate2) && isAfter(endDate1, startDate2)) {
            entryCollisions += 1;
            if (!entry2Offset) {
              entries[entryId2] = entry1Offset + entryCollisions - 1;
            }
          }
        }
        if (entryCollisions > rowMultiplier) {
          rowMultiplier = entryCollisions;
        }
      }

      rows[resourceId] = rowMultiplier;
    }

    return [rows, entries];
  }, [
    getDataId,
    getEndDate,
    getResourceId,
    getStartDate,
    groupedData,
    resources,
  ]);

  const virtualizer = useWindowVirtualizer({
    count: resources.length,
    estimateSize: (index) => {
      const resource = resources[index];
      const resourceId = getResourceId(resource);
      const multiplier = rowMultipliers[resourceId] ?? 1;
      return rowHeight * multiplier;
    },
    enabled: enableVirtualizer,
    overscan: 5,
    scrollMargin: localBodyRef.current?.offsetTop ?? 0,
  });
  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const paddingTop = useMemo(
    () =>
      virtualItems.length > 0
        ? virtualItems?.[0]?.start
          ? virtualItems?.[0]?.start - (localBodyRef.current?.offsetTop ?? 0)
          : 0
        : 0,
    [virtualItems],
  );
  const paddingBottom = useMemo(
    () =>
      virtualItems.length > 0
        ? totalSize -
          (virtualItems?.[virtualItems.length - 1]?.end || 0) +
          (localBodyRef.current?.offsetTop ?? 0)
        : 0,
    [totalSize, virtualItems],
  );

  return (
    <Box
      className={gridClasses.subGrid}
      ref={localBodyRef}
      w="100%"
      style={{
        "--mantine-scheduler-grid-size": `span ${totalGridSize}`,
        height: `${totalSize}px`,
        zIndex: 1,
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <Box
        className={gridClasses.subGrid}
        w="100%"
        style={{
          "--mantine-scheduler-grid-size": `span ${totalGridSize}`,
          height: `${totalSize}px`,
          zIndex: 1,
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {paddingTop ? (
          <Box className={gridClasses.fullRow} style={{ height: paddingTop }} />
        ) : null}
        {virtualItems.map((virtualItem, rowIndex) => {
          const resource = resources[virtualItem.index];
          const resourceId = getResourceId(resource);

          const multipliedRowHeight =
            rowHeight * (rowMultipliers[resourceId] ?? 1);
          return (
            <Box
              key={`resource_row_${virtualItem.key}`}
              className={gridClasses.subGrid}
              style={{
                "--mantine-scheduler-grid-size": `span ${totalGridSize}`,
              }}
            >
              <Box
                className={gridClasses.resourceLabels}
                style={{
                  "--mantine-scheduler-grid-label-size": `span ${gridLabelSize}`,
                }}
              >
                <Paper
                  withBorder
                  radius={0}
                  w="100%"
                  mah={multipliedRowHeight}
                  style={{
                    borderLeftWidth: 0,
                    borderBottomWidth: 0,
                    borderRightWidth: 0,
                  }}
                >
                  <CustomResourceLabel
                    resource={resource}
                    getResourceId={getResourceId}
                  />
                </Paper>
              </Box>
              <Box
                className={gridClasses.mainBody}
                style={{
                  "--mantine-scheduler-grid-main-size": `span ${totalGridSize - gridLabelSize}`,
                }}
              >
                <SchedulerBodyRow
                  key={`row_content_${resourceId}`}
                  rowIndex={rowIndex}
                  customNowMarker={customNowMarker}
                  data={groupedData[resourceId] ?? []}
                  entryComponent={customSchedulerEntry}
                  getEndDate={getEndDate}
                  getStartDate={getStartDate}
                  resourceId={resourceId}
                  rowHeight={rowHeight}
                  multipliedRowHeight={multipliedRowHeight}
                  momentStyle={momentStyle}
                  getDataId={getDataId}
                  resourcesCount={resources.length}
                  controller={controller}
                  entryOffsets={entryPosMultipliers}
                  tz={tz}
                  resource={resource}
                  theme={theme}
                />
              </Box>
            </Box>
          );
        })}
        {paddingBottom ? (
          <Box
            className={gridClasses.fullRow}
            style={{ height: paddingBottom }}
          />
        ) : null}
      </Box>
    </Box>
  );
}
