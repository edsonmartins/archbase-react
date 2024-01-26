import { createStyles, getSize, getStylesRef } from '@mantine/styles';
import type { ArchbaseListStylesParams } from './ArchbaseList.styles';

export default createStyles((theme, { spacing, center }: ArchbaseListStylesParams) => ({
	itemWrapper: {
		ref: getStylesRef('itemWrapper'),
		display: 'inline-flex',
		flexDirection: 'column',
		whiteSpace: 'normal',
	},

	item: {
		whiteSpace: 'nowrap',
		lineHeight: center ? 1 : theme.lineHeight,

		'&:not(:first-of-type)': {
			marginTop: getSize({ size: spacing, sizes: theme.spacing }),
		},

		'&[data-with-icon]': {
			listStyle: 'none',

			[`& .${getStylesRef('itemWrapper')}`]: {
				display: 'inline-flex',
				alignItems: center ? 'center' : 'flex-start',
				flexDirection: 'row',
			},
		},
	},

	itemIcon: {
		display: 'inline-block',
		verticalAlign: 'middle',
		marginRight: theme.spacing.sm,
	},
}));
