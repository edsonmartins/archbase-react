import React from 'react'
import i18next from "i18next";
import { MenuItem, SubMenu, menuClasses } from "react-pro-sidebar";
import { useMantineTheme } from '@mantine/styles';

export function buildMenuItem(collapsed, onMenuItemClick, item, index) {
    const theme = useMantineTheme()
    return item.links ? (
    <SubMenu
        rootStyles={{
            fontSize: '16px',
        }}
        key={index}
        id={item.label}
        icon={item.icon}
        defaultOpen={true}
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
                                background:
                                    theme.colorScheme === 'dark'
                                        ? theme.colors[theme.primaryColor][8]
                                        : theme.colors[theme.primaryColor][7],
                                color:
                                    theme.colorScheme === 'dark'
                                        ? theme.colors[theme.primaryColor][0]
                                        : theme.colors[theme.primaryColor][0],
                            },
                        }}
                        key={subIndex}
                        id={subItem.label}
                        icon={subItem.icon}
                        disabled={subItem.disabled}
                    >
                        {`${i18next.t(subItem.label)}`}
                    </MenuItem>
                ))}
    </SubMenu>
) : (
    <MenuItem
        rootStyles={{
            fontSize: '16px',
        }}
        key={index}
        id={item.label}
        disabled={item.disabled}
        onClick={() => onMenuItemClick(item)}
        icon={item.icon}
    >
        {collapsed ? '' : `${i18next.t(item.label)}`}
    </MenuItem>
)
}