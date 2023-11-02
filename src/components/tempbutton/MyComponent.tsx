// MyComponent.tsx
import {
	Box,
	DefaultProps,
	MantineNumberSize,
	Selectors,
	useMantineColorScheme,
	useMantineTheme,
} from '@mantine/core';
import {
	MantineReactTable,
	type MRT_ColumnDef,
	useMantineReactTable,
} from 'mantine-react-table';
import React from 'react';
import { useMemo } from 'react';
import useStyles, { MyComponentStylesParams } from './MyComponent.styles';

// This type will contain a union with all selectors defined in useStyles,
// in this case it will be `'root' | 'title' | 'description'`
type MyComponentStylesNames = Selectors<typeof useStyles>;

// DefaultProps adds system props support (margin, padding, sx, unstyled, styles and classNames).
// It accepts 2 types: styles names and styles params, both of them are optional
interface MyComponentProps
	extends DefaultProps<MyComponentStylesNames, MyComponentStylesParams> {
	radius?: MantineNumberSize;
}

type Person = {
	name: {
		firstName: string;
		lastName: string;
	};
	address: string;
	city: string;
	state: string;
};

//nested data is ok, see accessorKeys in ColumnDef below
const data: Person[] = [
	{
		name: {
			firstName: 'Zachary',
			lastName: 'Davis',
		},
		address: '261 Battle Ford',
		city: 'Columbus',
		state: 'Ohio',
	},
	{
		name: {
			firstName: 'Robert',
			lastName: 'Smith',
		},
		address: '566 Brakus Inlet',
		city: 'Westerville',
		state: 'West Virginia',
	},
	{
		name: {
			firstName: 'Kevin',
			lastName: 'Yan',
		},
		address: '7777 Kuhic Knoll',
		city: 'South Linda',
		state: 'West Virginia',
	},
	{
		name: {
			firstName: 'John',
			lastName: 'Upton',
		},
		address: '722 Emie Stream',
		city: 'Huntington',
		state: 'Washington',
	},
	{
		name: {
			firstName: 'Nathan',
			lastName: 'Harris',
		},
		address: '1 Kuhic Knoll',
		city: 'Ohiowa',
		state: 'Nebraska',
	},
];

const Example = () => {
	//should be memoized or stable
	const columns = useMemo<MRT_ColumnDef<Person>[]>(
		() => [
			{
				accessorKey: 'name.firstName', //access nested data with dot notation
				header: 'First Name',
			},
			{
				accessorKey: 'name.lastName',
				header: 'Last Name',
			},
			{
				accessorKey: 'address', //normal accessorKey
				header: 'Address',
			},
			{
				accessorKey: 'city',
				header: 'City',
			},
			{
				accessorKey: 'state',
				header: 'State',
			},
		],
		[],
	);

	const table = useMantineReactTable({
		columns,
		data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
	});

	return <MantineReactTable table={table} />;
};

export function MyComponent({
	classNames,
	styles,
	unstyled,
	radius,
	className,
	...others
}: MyComponentProps) {
	const theme = useMantineTheme();
	const colorScheme = useMantineColorScheme();
	const { classes, cx } = useStyles(
		// First argument of useStyles is styles params
		{ radius },
		// Second argument is responsible for styles api integration
		{ name: 'MyComponent', classNames, styles, unstyled },
	);

	// Use Box component as a base and spread ...others prop.
	// By doing so, you will add sx, padding (pt, pb, px, etc.) and margin (my, m, mt, etc.) props support
	return (
		<Box className={cx(classes.root, className)} {...others}>
			<div className={classes.title}>Awesome component</div>
			<div className={classes.description}>With Styles API support</div>
			<Example />
		</Box>
	);
}
