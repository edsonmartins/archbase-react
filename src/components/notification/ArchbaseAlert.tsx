import React, { useEffect, useState } from 'react';
import {
  Alert,
  DefaultProps,
  MantineColor,
  MantineNumberSize,
  Variants,
  useComponentDefaultProps,
} from '@mantine/core';

export interface ArchbaseAlertProps extends DefaultProps {
  title?: React.ReactNode;
  variant?: Variants<'filled' | 'outline' | 'light'>;
  children: React.ReactNode;
  color?: MantineColor;
  titleColor?: MantineColor;
  icon?: React.ReactNode;
  withCloseButton?: boolean;
  onClose?: () => void;
  autoClose?: number;
  closeButtonLabel?: string;
  radius?: MantineNumberSize;
  withBorder?: boolean;
  backgroundColor?: MantineColor;
}

const defaultProps: Partial<ArchbaseAlertProps> = {
  variant: 'light',
};

export function ArchbaseAlert(props: ArchbaseAlertProps) {
  const {
    className,
    color,
    radius,
    withCloseButton,
    title,
    icon,
    children,
    onClose,
    classNames,
    unstyled,
    variant,
    titleColor,
    autoClose = 0,
  } = useComponentDefaultProps('ArchbaseAlert', defaultProps, props);
  const [started] = useState(false);

  useEffect(() => {
    if (autoClose > 0 && !started) {
      setTimeout(() => (onClose ? onClose() : null), autoClose);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoClose]);

  return (
    <Alert
      onClose={onClose}
      classNames={classNames}
      styles={(theme) => ({
        title: {
          color: titleColor,
        },

        leftIcon: {
          marginRight: theme.spacing.md,
        },
      })}
      unstyled={unstyled}
      icon={icon}
      title={title}
      className={className}
      color={color}
      radius={radius}
      variant={variant}
      withCloseButton={withCloseButton}
    >
      {children}
    </Alert>
  );
}
