import {
  Box,
  Button,
  Center,
  Flex,
  MantineStyleProps,
  MantineTheme,
  Paper,
} from "@mantine/core";

import React, { useMemo } from "react";
import { useSnapshot } from "valtio";

import { formatDate, getDate, getYear } from "date-fns";
import {
  SchedulerController,
  SchedulerDisplayUnit,
} from "../controller/controller";
import gridClasses from "../Scheduler/SchedulerGrid.module.css";
import { MomentStyleFn } from "../SchedulerBody/SchedulerMoment/momentStyling";
import { DefaultMomentLabel, MomentLabelProps } from "./DefaultMomentLabel";
export type SchedulerHeaderOnClickFn<TData, TResource> = (params: {
  moment: Date;
  controller: SchedulerController<TData, TResource>;
}) => void;

export type SchedulerHeaderOnClickProp<TData, TResource> = Partial<
  Record<SchedulerDisplayUnit, SchedulerHeaderOnClickFn<TData, TResource>>
>;

export interface SchedulerHeaderProps<TData, TResource> {
  controller: SchedulerController<TData, TResource>;
  onClick?: SchedulerHeaderOnClickProp<TData, TResource>;
  momentLabelComponent?: React.FC<MomentLabelProps<TData, TResource>>;
  momentStyle?: MomentStyleFn<TData, TResource>;
  stickyHeader?: boolean;
  stickyHeaderOffset?: MantineStyleProps["top"];
  gridLabelSize: number;
  totalGridSize: number;
  theme: MantineTheme;
}

interface TopLabelProps {
  displayUnit: SchedulerDisplayUnit;
  moments: Date[];
}
const TopLabel = React.memo(({ displayUnit, moments }: TopLabelProps) => {
  if (moments.length < 2) return null;
  const firstMoment = moments[0];
  const lastMoment = moments[moments.length - 1];
  switch (displayUnit) {
    case "year":
      return null;
    case "month": {
      const firstMomentYear = getYear(firstMoment);
      const lastMomentYear = getYear(lastMoment);
      if (firstMomentYear === lastMomentYear) return lastMomentYear;
      return `${firstMomentYear} - ${lastMomentYear}`;
    }
    case "week":
      return null;
    case "day": {
      const firstMomentMonth = getYear(firstMoment);
      const lastMomentMonth = getYear(lastMoment);
      const firstMomentYear = getYear(firstMoment);
      const lastMomentYear = getYear(lastMoment);
      if (
        firstMomentMonth === lastMomentMonth &&
        firstMomentYear === lastMomentYear
      )
        return formatDate(lastMoment, "MMMM yyyy");
      return `${formatDate(firstMoment, "MMMM yyyy")} - ${formatDate(lastMoment, "MMMM yyyy")}`;
    }
    case "hour": {
      const firstMomentDate = getDate(firstMoment);
      const lastMomentDate = getDate(lastMoment);
      const firstMomentMonth = getYear(firstMoment);
      const lastMomentMonth = getYear(lastMoment);
      const firstMomentYear = getYear(firstMoment);
      const lastMomentYear = getYear(lastMoment);
      if (
        firstMomentDate === lastMomentDate &&
        firstMomentMonth === lastMomentMonth &&
        firstMomentYear === lastMomentYear
      )
        return formatDate(lastMoment, "dd MMMM yyyy");

      return `${formatDate(firstMoment, "dd MMMM yyyy")} - ${formatDate(lastMoment, "dd MMMM yyyy")}`;
    }
  }

  return null;
});

TopLabel.displayName = "TopLabel";

interface BottomLabelProps<TData, TResource> {
  moment: Date;
  momentLabelComponent?: SchedulerHeaderProps<
    TData,
    TResource
  >["momentLabelComponent"];
  onClick?: SchedulerHeaderOnClickFn<TData, TResource>;
  momentStyle?: MomentStyleFn<TData, TResource>;
  controller: SchedulerController<TData, TResource>;
  theme: MantineTheme;
}

const BottomLabel = <TData, TResource>({
  onClick,
  moment,
  momentLabelComponent,
  theme,
  momentStyle,
  controller,
}: BottomLabelProps<TData, TResource>) => {
  const wrappedOnClick = useMemo(
    () => (onClick ? () => onClick({ moment, controller }) : undefined),
    [controller, moment, onClick],
  );
  const MomentLabel = useMemo(
    () => momentLabelComponent ?? DefaultMomentLabel,
    [momentLabelComponent],
  );

  const resolvedStyle = useMemo(
    () => ({
      ...momentStyle?.({ moment, controller, theme }),
      height: "100%",
      width: "100%",
      padding: 0,
      margin: 0,
    }),
    [controller, moment, momentStyle, theme],
  );

  if (!wrappedOnClick)
    return (
      <Box style={resolvedStyle}>
        <Center>
          <MomentLabel controller={controller} moment={moment} />
        </Center>
      </Box>
    );
  return (
    <Button
      variant="subtle"
      radius={0}
      onClick={wrappedOnClick}
      style={resolvedStyle}
    >
      <MomentLabel controller={controller} moment={moment} />
    </Button>
  );
};

export function SchedulerHeader<TData, TResource>({
  controller,
  onClick,
  momentLabelComponent,
  momentStyle,
  stickyHeader,
  stickyHeaderOffset,
  totalGridSize,
  gridLabelSize,
  theme,
}: SchedulerHeaderProps<TData, TResource>) {
  const snap = useSnapshot(controller);
  const resolvedOnClick = useMemo(
    () => onClick?.[snap.displayUnit],
    [snap.displayUnit, onClick],
  );

  return (
    <Box
      className={gridClasses.subGrid}
      pos={stickyHeader ? "sticky" : undefined}
      top={stickyHeaderOffset}
      style={{
        zIndex: 2,
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
          h="100%"
          w="100%"
          radius={0}
          style={{
            borderTopWidth: 0,
            borderLeftWidth: 0,

            borderBottomWidth: 0,
          }}
        />
      </Box>
      <Box
        className={gridClasses.mainBody}
        style={{
          "--mantine-scheduler-grid-main-size": `span ${totalGridSize - gridLabelSize}`,
        }}
      >
        <Flex direction="column" w="100%">
          <Paper
            withBorder
            radius={0}
            style={{
              borderTopWidth: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0,
            }}
            p="xs"
          >
            <TopLabel
              displayUnit={snap.displayUnit}
              //  @ts-expect-error snap value is immutable
              moments={snap.moments}
            />
          </Paper>
          <Flex w="100%">
            {snap.moments
              .map((moment, index): [Date, number] => [
                moment,
                snap.momentWidths[index],
              ])
              .map(([moment, momentWidth], index) => {
                return (
                  <Paper
                    key={`header_moment_${moment.toISOString()}`}
                    withBorder
                    radius={0}
                    style={{
                      borderTopWidth: 0,
                      borderLeftWidth: 0,
                      borderBottomWidth: 0,
                      borderRightWidth:
                        index === snap.moments.length - 1 ? 0 : undefined,
                      overflow: "hidden",
                    }}
                    w={`${momentWidth}%`}
                  >
                    <BottomLabel
                      moment={moment}
                      onClick={resolvedOnClick}
                      momentLabelComponent={momentLabelComponent}
                      momentStyle={momentStyle}
                      controller={controller}
                      theme={theme}
                    />
                  </Paper>
                );
              })}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
