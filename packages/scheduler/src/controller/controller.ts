import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  addYears,
  differenceInHours,
  differenceInMinutes,
  isAfter,
  isBefore,
  isEqual,
  startOfDay,
  startOfHour,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from "date-fns";
import { useEffect, useRef } from "react";
import { proxy, subscribe } from "valtio";
import { unstable_enableOp } from "valtio/vanilla";
import { timeFraction } from "../utils";
import {
  OnSelectFn,
  SchedulerMomentOnDragEndFn,
  SchedulerMomentOnDragStartOverFactory,
  SchedulerMomentSelectClickFnFactory,
  useSchedulerSelect,
} from "./selectControls";
export type SchedulerDisplayUnit = "year" | "month" | "week" | "day" | "hour";
export type DetermineSubMomentCountsFn = (
  displayUnit: SchedulerDisplayUnit,
) => number;
export interface SchedulerControllerParams<TData, TResource> {
  viewStartDate?: Date;
  viewEndDate?: Date;
  clip?: boolean;
  determineSubMomentsCount?: DetermineSubMomentCountsFn;
  determineDisplayUnit?: (hoursDiff: number) => SchedulerDisplayUnit;
  onSelect?: OnSelectFn<TData, TResource>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface SchedulerController<TData, TResource> {
  moments: Date[];
  momentWidths: number[];
  viewStartDate: Date;
  viewEndDate: Date;
  displayUnit: SchedulerDisplayUnit;
  subbedMoments: [Date, number][];
  calculateDistancePercentage: (
    date: Date,
    leftOrRight: "left" | "right",
  ) => number;

  momentDragEnd?: SchedulerMomentOnDragEndFn<TResource>;
  momentDragStartOver?: SchedulerMomentOnDragStartOverFactory;
  momentSelectClick?: SchedulerMomentSelectClickFnFactory<TResource>;
  firstSelectedMoment: Date | null;
  lastSelectedMoment: Date | null;

  selectedMoments: Record<
    string,
    Record<string, { isSelected: boolean } | undefined> | undefined
  >;
  selectedResourceId: string | null;
}
export type UnknownSchedulerController = SchedulerController<unknown, unknown>;

const hoursInYearThreshold = 365 * 24;
const hoursInMonthThreshold = 25 * 24;

export function determineDisplayUnit(hoursDiff: number): SchedulerDisplayUnit {
  if (hoursDiff > hoursInYearThreshold) return "year";
  if (hoursDiff > hoursInMonthThreshold) return "month";

  if (hoursDiff > 24) return "day";

  return "hour";
}

const getNextMoment: Record<SchedulerDisplayUnit, (moment: Date) => Date> = {
  day: (moment) => startOfDay(addDays(moment, 1)),
  hour: (moment) => startOfHour(addHours(moment, 1)),
  week: (moment) => startOfWeek(addWeeks(moment, 1)),
  month: (moment) => startOfMonth(addMonths(moment, 1)),
  year: (moment) => startOfYear(addYears(moment, 1)),
};

function clipStartViewDate(date: Date, displayUnit: SchedulerDisplayUnit) {
  switch (displayUnit) {
    case "year":
      return startOfYear(date);
    case "month":
      return startOfMonth(date);
    case "week":
      return startOfWeek(date);
    case "day":
      return startOfDay(date);
    case "hour":
      return startOfHour(date);
  }
}

function calculateDisplayUnit(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controller: SchedulerController<any, any>,
  calcFn?: (hoursDiff: number) => SchedulerDisplayUnit,
) {
  const hoursDiff = differenceInHours(
    controller.viewEndDate,
    controller.viewStartDate,
  );

  const customDetermineDisplayUnit = calcFn ?? determineDisplayUnit;
  const newDisplayUnit = customDetermineDisplayUnit(hoursDiff);
  if (newDisplayUnit !== controller.displayUnit) {
    controller.displayUnit = newDisplayUnit;
  }
}

const displayUnitDiffFuncs: Record<
  SchedulerDisplayUnit,
  (laterDate: Date, earlierDate: Date) => number
> = {
  hour: (laterDate, earlierDate) =>
    differenceInMinutes(laterDate, earlierDate) / 60,
  day: (laterDate, earlierDate) =>
    differenceInMinutes(laterDate, earlierDate) / (60 * 24),
  week: (laterDate, earlierDate) =>
    differenceInMinutes(laterDate, earlierDate) / (60 * 24 * 7),
  month: (laterDate, earlierDate) =>
    differenceInMinutes(laterDate, earlierDate) / (60 * 24 * 28),
  year: (laterDate, earlierDate) =>
    differenceInMinutes(laterDate, earlierDate) / (60 * 24 * 365),
};

function calculateMoments(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controller: SchedulerController<any, any>,
  clip?: boolean,
) {
  const maybeClippedViewStartDate = clip
    ? clipStartViewDate(controller.viewStartDate, controller.displayUnit)
    : controller.viewStartDate;
  const maybeClippedViewEndDate = clip
    ? getNextMoment[controller.displayUnit](controller.viewEndDate)
    : controller.viewEndDate;

  const displayUnitDiffFunc = displayUnitDiffFuncs[controller.displayUnit];
  const displayUnitDiff = Math.abs(
    displayUnitDiffFunc(maybeClippedViewEndDate, maybeClippedViewStartDate),
  );

  let diff = displayUnitDiff;
  const moments: Date[] = [maybeClippedViewStartDate];
  let latestAddition = maybeClippedViewStartDate;
  while (diff >= 1) {
    diff -= 1;
    const newMoment = getNextMoment[controller.displayUnit](latestAddition);
    if (isEqual(newMoment, maybeClippedViewEndDate)) break;
    moments.push(newMoment);
    latestAddition = newMoment;
  }
  controller.moments = moments;
  const momentWidths = moments.map((moment, index, array) => {
    const distance =
      index < array.length - 1
        ? Math.abs(displayUnitDiffFunc(array[index + 1], moment))
        : Math.abs(displayUnitDiffFunc(maybeClippedViewEndDate, moment));

    return (distance / (moments.length - 1)) * 100;
  });

  controller.momentWidths = momentWidths;

  controller.calculateDistancePercentage = (
    date: Date,
    leftOrRight: "left" | "right",
  ) => {
    if (
      isBefore(date, maybeClippedViewStartDate) ||
      isAfter(date, maybeClippedViewEndDate)
    )
      return 0;

    let left = maybeClippedViewStartDate;
    let right = date;

    if (leftOrRight === "right") {
      left = date;
      right = maybeClippedViewEndDate;
    }

    return (displayUnitDiffFunc(right, left) / displayUnitDiff) * 100;
  };
}

function calculateSubMoments( // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controller: SchedulerController<any, any>,
  determineSubMomentCounts?: DetermineSubMomentCountsFn,
) {
  const { momentWidths, moments } = controller;

  const firstMomentLoss = (momentWidths[0] / 100) * (momentWidths.length - 1);
  const lastMomentLoss =
    (momentWidths[momentWidths.length - 1] / 100) * (momentWidths.length - 1);
  const zippedMoments = moments.map((moment, index): [Date, number] => [
    moment,
    momentWidths[index],
  ]);
  const subMomentCount =
    determineSubMomentCounts?.(controller.displayUnit) ?? 0;
  const subbedMoments = zippedMoments.flatMap(
    ([moment, distance], momentIndex): [Date, number][] => {
      const loss =
        momentIndex === 0
          ? firstMomentLoss
          : momentIndex === zippedMoments.length
            ? lastMomentLoss
            : 1;
      const subMomentCountWithLoss = Math.ceil(subMomentCount * loss);
      if (subMomentCountWithLoss < 2) return [[moment, distance]];
      const newDistance = distance / subMomentCountWithLoss;
      const newMoments = [moment];
      let newestMoment = moment;
      const [fractionValue, addFraction] = timeFraction(
        subMomentCountWithLoss,
        controller.displayUnit,
      );
      for (let i = 1; i < subMomentCountWithLoss; i++) {
        newestMoment = addFraction(newestMoment, fractionValue);
        newMoments.push(newestMoment);
      }
      return newMoments.map((newMoment) => [newMoment, newDistance]);
    },
  );
  controller.subbedMoments = subbedMoments;
}

export function useSchedulerController<TData, TResource>({
  viewEndDate: viewEndDateInput,
  viewStartDate: viewViewStartDateInput,
  clip,

  onSelect,
  determineSubMomentsCount: determineSubMomentsCountParam,

  determineDisplayUnit: determineDisplayUnitParam,
}: SchedulerControllerParams<TData, TResource>): SchedulerController<
  TData,
  TResource
> {
  useEffect(() => {
    unstable_enableOp(true);
  }, []);

  const controller = useRef(
    proxy<SchedulerController<TData, TResource>>({
      calculateDistancePercentage: () => 0,
      displayUnit: "day",
      firstSelectedMoment: null,
      lastSelectedMoment: null,
      moments: [],
      momentWidths: [],

      subbedMoments: [],
      viewStartDate: subDays(new Date(), 7),
      viewEndDate: addDays(new Date(), 7),
      selectedMoments: {},
      selectedResourceId: null,
    }),
  ).current;

  useEffect(() => {
    if (
      viewViewStartDateInput &&
      !isEqual(viewViewStartDateInput, controller.viewStartDate)
    ) {
      controller.viewStartDate = viewViewStartDateInput;
    }
    if (
      viewEndDateInput &&
      !isEqual(viewEndDateInput, controller.viewEndDate)
    ) {
      controller.viewEndDate = viewEndDateInput;
    }
  }, [controller, viewEndDateInput, viewViewStartDateInput]);

  useEffect(() => {
    calculateDisplayUnit(controller, determineDisplayUnitParam);
    const unsubscribe = subscribe(controller, (ops) => {
      if (
        !ops.find(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([op, key]) => key[0] === "viewStartDate" || key[0] === "viewEndDate",
        )
      ) {
        return;
      }
      calculateDisplayUnit(controller, determineDisplayUnitParam);
    });

    return () => {
      unsubscribe();
    };
  }, [controller, determineDisplayUnitParam]);

  useEffect(() => {
    calculateMoments(controller, clip);
    const unsubscribe = subscribe(controller, (ops) => {
      if (
        !ops.find(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([op, key]) =>
            key[0] === "viewStartDate" ||
            key[0] === "viewEndDate" ||
            key[0] === "displayUnit",
        )
      )
        return;
      calculateMoments(controller, clip);
    });
    return () => {
      unsubscribe();
    };
  }, [clip, controller, determineSubMomentsCountParam]);

  useEffect(() => {
    calculateSubMoments(controller, determineSubMomentsCountParam);
    const unsubscribe = subscribe(controller, (ops) => {
      if (
        !ops.find(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([op, key]) =>
            key[0] === "moments" ||
            key[0] === "momentWidths" ||
            key[0] === "displayUnit",
        )
      )
        return;
      calculateSubMoments(controller, determineSubMomentsCountParam);
    });
    return () => {
      unsubscribe();
    };
  }, [clip, controller, determineSubMomentsCountParam]);

  useSchedulerSelect(controller, onSelect);

  return controller;
}
