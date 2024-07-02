import i18next from 'i18next';
import React from 'react';
import { menuClasses, MenuItem, SubMenu } from 'react-pro-sidebar';

export function buildMenuItem(theme, collapsed, onMenuItemClick, item, index, iconsWithBackground, currentPathName, highlightActiveMenuItem) {
	if (item.links) {
		const iconsBackgroundColor = iconsWithBackground ? (theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][8] : theme.colors[theme.primaryColor][7]) : undefined;
		const iconsColor = iconsWithBackground ? (theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][0] : theme.colors[theme.primaryColor][0]) : undefined;
		return (
			<SubMenu
				rootStyles={{
					fontSize: '16px',
				}}
				key={index}
				id={item.label}
				icon={item.icon}
				defaultOpen={!item.disabled}
				label={collapsed ? '' : `${i18next.t(item.label)}`}
				disabled={item.disabled}
			>
				{item.links &&
					item.links
						.filter((itm) => itm.showInSidebar === true)
						.map((subItem, subIndex) => (
							<MenuItem
								onClick={() => onMenuItemClick(subItem)}
								rootStyles={{
									[`.${menuClasses.icon}`]: {
										background: iconsBackgroundColor,
										color: iconsColor,
									},
									[`.${menuClasses.button}`]: {
										paddingLeft: '40px !important',
									},
								}}
								key={subIndex}
								id={subItem.label}
								icon={subItem.icon}
								disabled={typeof subItem.disabled === 'function' ? subItem.disabled() : subItem.disabled}
								active={highlightActiveMenuItem && subItem.link === currentPathName}
							>
								{`${i18next.t(subItem.label)}`}
							</MenuItem>
						))}
			</SubMenu>
		);
	} else {
		if (item.showInSidebar) {
			return (
				<MenuItem
					rootStyles={{
						fontSize: '16px',
					}}
					key={index}
					id={item.label}
					disabled={typeof item.disabled === 'function' ? item.disabled() : item.disabled}
					onClick={() => onMenuItemClick(item)}
					icon={item.icon}
					active={highlightActiveMenuItem && item.link === currentPathName}
				>
					{collapsed ? '' : `${i18next.t(item.label)}`}
				</MenuItem>
			);
		}
	}
	return null;
}
