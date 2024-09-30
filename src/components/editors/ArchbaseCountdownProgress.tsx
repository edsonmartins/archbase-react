import React, { useState, useEffect } from 'react';
import { Progress, Text } from '@mantine/core';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { t } from 'i18next';
dayjs.extend(duration);


export const ArchbaseCountdownProgress = ({ targetDate, color }) => {
  const calculateTimeLeft = () => {
    const now = dayjs();
    const end = dayjs(targetDate);
    const diff = end.diff(now);

    return {
      days: Math.floor(dayjs.duration(diff).asDays()),
      hours: dayjs.duration(diff).hours(),
      minutes: dayjs.duration(diff).minutes(),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const totalDuration = dayjs(targetDate).diff(dayjs());
  const progress = ((totalDuration - dayjs.duration(timeLeft).asMilliseconds()) / totalDuration) * 100;

  return (
    <div>
      <Progress.Root size="xl">
        <Progress.Section value={progress} color={color}>
          <Progress.Label>
            {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`}
          </Progress.Label>
        </Progress.Section>
      </Progress.Root>
      <Text ta="center" mt="sm">
        {t('archbase:Faltam {{days}} dias, {{hours}} horas e {{minutes}} minutos', {
          days: timeLeft.days,
          hours: timeLeft.hours,
          minutes: timeLeft.minutes,
        })}
      </Text>
    </div>
  );
};

