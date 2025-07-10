import { Alert, AlertProps, AlertVariant, MantineColor, useProps } from '@mantine/core';
import React, { useEffect, useState } from 'react';

export interface ArchbaseAlertProps extends AlertProps {
	title?: React.ReactNode;
	variant?: AlertVariant | string;
	children: React.ReactNode;
	color?: MantineColor;
	titleColor?: MantineColor;
	icon?: React.ReactNode;
	withCloseButton?: boolean;
	onClose?: () => void;
	autoClose?: number;
	closeButtonLabel?: string;
	radius?: string | number | undefined;
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
	} = useProps('ArchbaseAlert', defaultProps, props);
	const [started] = useState(false);

	useEffect(() => {
		if (autoClose > 0 && !started) {
			setTimeout(() => (onClose ? onClose() : null), autoClose);
		}
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
