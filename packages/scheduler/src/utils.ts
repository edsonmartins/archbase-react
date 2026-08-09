import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addWeeks,
  addYears,
  isDate,
  subDays,
  subHours,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { useCallback } from "react";
import { SchedulerDisplayUnit } from "./controller/controller";

export type DataFieldAccessor<T, TValue> =
  | KeysOfValue<T, TValue>
  | ((data: T) => TValue);

export function useAccessor<T, TValue>(field: DataFieldAccessor<T, TValue>) {
  return useCallback(
    (obj: T) => {
      if (typeof field === "function") return field(obj);

      return obj[field];
    },

    [field],
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useStringAccessor<T>(field: DataFieldAccessor<T, any>) {
  const getValue = useAccessor(field);

  return useCallback(
    (obj: T) => {
      return String(getValue(obj));
    },
    [getValue],
  );
}

export function useDateAccessor<T>(field: DataFieldAccessor<T, Date>) {
  const getValue = useAccessor(field);

  return useCallback(
    (obj: T) => {
      const value = getValue(obj);
      if (isDate(value)) return value;
      throw TypeError(`Expected date value Received: ${value}`);
    },
    [getValue],
  );
}

export function useArrayAccessor<T, TValue>(
  field: DataFieldAccessor<T, TValue[] | TValue>,
) {
  const getValue = useAccessor(field);

  return useCallback(
    (obj: T) => {
      const value = getValue(obj);

      return Array.isArray(value) ? value : [value];
    },
    [getValue],
  );
}

export function useStringArrayAccessor<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: DataFieldAccessor<T, any[] | any>,
) {
  const getValue = useArrayAccessor(field);

  return useCallback(
    (obj: T) => {
      const value = getValue(obj);

      return value.map((item) => String(item));
    },
    [getValue],
  );
}

export function timeFraction(
  div: number,
  displayUnit: SchedulerDisplayUnit,
): [number, (date: Date, amount: number) => Date] {
  switch (displayUnit) {
    case "year":
      return [Math.floor(12 / div), addMonths];
    case "month":
      return [Math.floor(30 / div), addDays];
    case "week":
      return [Math.floor(168 / div), addHours];
    case "day":
      return [Math.floor(24 / div), addHours];
    case "hour":
      return [Math.floor(60 / div), addMinutes];
  }
}

export type KeysOfValue<T, TCondition> = {
  [K in keyof T]: T[K] extends TCondition ? K : never;
}[keyof T];

const displayUnitAddFuncs: Record<
  SchedulerDisplayUnit,
  (date: Date, amount: number) => Date
> = {
  year: addYears,
  month: addMonths,
  week: addWeeks,
  day: addDays,
  hour: addHours,
};

export function displayUnitAddFunc(displayUnit: SchedulerDisplayUnit) {
  return displayUnitAddFuncs[displayUnit];
}

const displayUnitSubFuncs: Record<
  SchedulerDisplayUnit,
  (date: Date, amount: number) => Date
> = {
  year: subYears,
  month: subMonths,
  week: subWeeks,
  day: subDays,
  hour: subHours,
};

export function displayUnitSubFunc(displayUnit: SchedulerDisplayUnit) {
  return displayUnitSubFuncs[displayUnit];
}
