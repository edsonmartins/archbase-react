import { TZDate } from "@date-fns/tz";
import { Box, MantineStyleProps, Tooltip } from "@mantine/core";
import { formatDate } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { UnknownSchedulerController } from "../controller/controller";
export const NowMarkerController = ({
  markerComponent,
  distanceCalculator,
  tz,
}: {
  markerComponent: React.FC<NowMarkerProps>;
  distanceCalculator: UnknownSchedulerController["calculateDistancePercentage"];
  tz?: string;
}) => {
  const Marker = markerComponent;
  const [now, setNow] = useState(TZDate.tz(tz ?? "UTC"));

  const nowLeft = useMemo(() => {
    const distance = distanceCalculator(now, "left");
    if (!distance) return undefined;
    return `${distance}%`;
  }, [distanceCalculator, now]);

  useEffect(() => {
    const timeout = setTimeout(() => setNow(TZDate.tz(tz ?? "UTC")), 1000);

    return () => {
      clearTimeout(timeout);
    };
  });
  if (!nowLeft) return null;
  return <Marker left={nowLeft} now={now} />;
};

export interface NowMarkerProps {
  left: MantineStyleProps["left"];
  now: Date;
}

export const DefaultNowMarker = React.memo(
  ({ left, now, format }: NowMarkerProps & { format?: string }) => {
    return (
      <Tooltip.Floating label={formatDate(now, format ?? "pppp", {})}>
        <Box pos="absolute" left={left} bg="yellow" h="100%" w={1} />
      </Tooltip.Floating>
    );
  },
);

DefaultNowMarker.displayName = "DefaultNowMarker";
