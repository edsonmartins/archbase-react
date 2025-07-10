import { ActionIcon, ActionIconVariant, Input, MantineColorScheme, MantineTheme, Tooltip } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import React, { Component } from 'react';

interface ArchbaseInputSearchProps {
	placeholder?: string | undefined;
	theme: MantineTheme;
	colorScheme: MantineColorScheme;
	onSearchClick?: () => void;
	variant?: ActionIconVariant;
}

export class ArchbaseInputSearch extends Component<ArchbaseInputSearchProps> {
	render = () => {
		const { theme, colorScheme, onSearchClick, variant } = this.props;
		return (
			<Input
				placeholder={this.props.placeholder}
				style={{ width: '100%' }}
				rightSection={
					<Tooltip withinPortal withArrow label={'Localizar'}>
						<ActionIcon
							style={{
								backgroundColor:
									colorScheme === 'dark' ? theme.colors[theme.primaryColor][5] : theme.colors[theme.primaryColor][6],
							}}
							tabIndex={-1}
							variant={variant}
							onClick={onSearchClick}
						>
							<IconSearch size="1rem" />
						</ActionIcon>
					</Tooltip>
				}
			></Input>
		);
	};
}
