/**
 * Item de usuário para listas — avatar, nome e e-mail.
 */
import React, { useRef } from 'react';
import { Badge, Group, Text } from '@mantine/core';
import { isBase64Validate } from '@archbase/core';
import { useArchbaseListContext, type ArchbaseListCustomItemProps } from '@archbase/components';
import type { UserDto } from '@archbase/security';
import { NO_USER } from './noUserAvatar';

export const renderGroups = (user: UserDto) => {
	if (!user.groups) {
		return null;
	}
	return (
		<div style={{ display: 'flex' }}>
			{user.groups
				.slice()
				.sort((a, b) => (a.group?.name ?? '').localeCompare(b.group?.name ?? ''))
				.map((item, index) => (
					<div key={index} style={{ paddingRight: '2px' }}>
						<Badge color="blue">{item.group?.name}</Badge>
					</div>
				))}
		</div>
	);
};

export const renderProfile = (user: UserDto) => {
	if (!user.profile) {
		return null;
	}
	return <Badge color="green">{user.profile?.name}</Badge>;
};

export interface UserItemProps extends ArchbaseListCustomItemProps<UserDto, string> {}

export const UserItem = (props: UserItemProps) => {
	const theme = useArchbaseTheme();
	const listContextValue = useArchbaseListContext<UserDto, string>();
	const itemRef = useRef<any>(null);

	const handleClick = (event) => {
		event.preventDefault();
		if (!props.disabled) {
			if (listContextValue.handleSelectItem) {
				listContextValue.handleSelectItem(props.index, props.recordData!);
			}
		}
	};

	const avatar =
		props.recordData && props.recordData.avatar && isBase64Validate(props.recordData.avatar)
			? atob(props.recordData.avatar)
			: NO_USER;
	const backgroundColor = props.active ? listContextValue.activeBackgroundColor : '';
	const color = props.active ? listContextValue.activeColor : '';

	return (
		<div
			onClick={handleClick}
			style={{
				padding: '8px',
				backgroundColor,
				color,
				cursor: props.disabled ? 'not-allowed' : 'pointer',
			}}
			ref={itemRef}
			tabIndex={-1}
		>
			<Group wrap="nowrap">
				<img
					style={{ width: '48px', borderRadius: 50 }}
					src={avatar}
					alt={props.recordData ? props.recordData.userName : ''}
				/>
				<div>
					<Text size="sm">{props.recordData.name}</Text>
					<Text size="xs" opacity={0.65}>
						{props.recordData.email}
					</Text>
				</div>
			</Group>
		</div>
	);
};
