import { Tooltip } from '@mantine/core';
import React from 'react';
import { menuClasses, MenuItem, SubMenu } from 'react-pro-sidebar';
import { archbaseI18next } from '@archbase/core';

export function buildMenuItem(theme, collapsed, onMenuItemClick, item, index, iconsWithBackground, currentPathName, highlightActiveMenuItem, sidebarTextColor, collapsedSubmenuWidth) {
	const iconsBackgroundColor = iconsWithBackground ? (theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][8] : theme.colors[theme.primaryColor][7]) : undefined;
	const iconsColor = iconsWithBackground ? (theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][0] : theme.colors[theme.primaryColor][0]) : undefined;
	if (item.links) {
		if (!(item.disabled && item.hideDisabledItem)) {
			return (
				<Tooltip disabled={!collapsed} label={archbaseI18next.t(item.label)}>
					<SubMenu
						rootStyles={{
							fontSize: '16px',
							[`.${menuClasses.button}`]: {
								'&:hover': {
									[`.${menuClasses.icon}`]: {
										color: "white",
									},
									[`.${menuClasses.label}`]: {
										color: "white",
									},
								}
							},
							[`.${menuClasses.subMenuContent}`]: {
								width: collapsed && collapsedSubmenuWidth
							},
						}}
						key={index}
						id={item.label}
						icon={item.icon}
						defaultOpen={!item.disabled}
						label={collapsed ? '' : archbaseI18next.t(item.label)}
						disabled={item.disabled}
					>
						{item.links &&
							item.links
								.filter((itm) => itm.showInSidebar === true && (!itm.disabled || !itm.hideDisabledItem))
								.map((subItem, subIndex) => (
									<MenuItem
										onClick={() => onMenuItemClick(subItem)}
										rootStyles={{
											[`.${menuClasses.icon}`]: {
												background: iconsBackgroundColor,
												color: highlightActiveMenuItem && subItem.link === currentPathName ? "white" : iconsColor,
											},
											[`.${menuClasses.label}`]: {
												color: highlightActiveMenuItem && subItem.link === currentPathName ? "white" : sidebarTextColor,
											},
											[`.${menuClasses.button}`]: {
												paddingLeft: '40px !important',
												'&:hover': {
													[`.${menuClasses.icon}`]: {
														color: "white",
													},
													[`.${menuClasses.label}`]: {
														color: "white",
													},
												}
											},
										}}
										key={subIndex}
										id={subItem.label}
										icon={subItem.icon}
										disabled={typeof subItem.disabled === 'function' ? subItem.disabled() : subItem.disabled}
										active={highlightActiveMenuItem && subItem.link === currentPathName}
									>
										{archbaseI18next.t(subItem.label)}
									</MenuItem>
								))}
					</SubMenu>
				</Tooltip>
			)
		}
	} else {
		if (item.showInSidebar && (!item.disabled || !item.hideDisabledItem)) {
			return (
				<Tooltip disabled={!collapsed} label={archbaseI18next.t(item.label)}>
					<MenuItem
						rootStyles={{
							fontSize: '16px',
							[`.${menuClasses.button}`]: {
								'&:hover': {
									[`.${menuClasses.icon}`]: {
										color: "white",
									},
									[`.${menuClasses.label}`]: {
										color: "white",
									},
								}
							},
							[`.${menuClasses.icon}`]: {
								background: iconsBackgroundColor,
								color: highlightActiveMenuItem && item.link === currentPathName ? "white" : iconsColor,
							},
							[`.${menuClasses.label}`]: {
								color: highlightActiveMenuItem && item.link === currentPathName ? "white" : sidebarTextColor,
							},
						}}
						key={index}
						id={item.label}
						disabled={typeof item.disabled === 'function' ? item.disabled() : item.disabled}
						onClick={() => onMenuItemClick(item)}
						icon={item.icon}
						active={highlightActiveMenuItem && item.link === currentPathName}
					>
						{collapsed ? '' : archbaseI18next.t(item.label)}
					</MenuItem>
				</Tooltip>
			);
		}
	}
	return null;
}
