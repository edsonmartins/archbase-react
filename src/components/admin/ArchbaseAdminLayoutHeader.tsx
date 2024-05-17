import {
	Avatar,
	Badge,
	Box,
	Burger,
	Button,
	Center,
	Flex,
	Group,
	Image,
	Menu,
	px,
	Text,
	Tooltip,
	useMantineColorScheme,
	useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { spotlight, Spotlight, SpotlightActionData } from '@mantine/spotlight';
import { IconMoonStars, IconSearch, IconSun, IconTerminal } from '@tabler/icons-react';
import i18next, { t } from 'i18next';
import React, { Component, CSSProperties, ReactNode, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArchbaseUser } from '../auth/ArchbaseUser';
import { ArchbaseAdminLayoutContext, ArchbaseAdminLayoutContextValue } from './ArchbaseAdminLayout.context';
import classes from './ArchbaseAdminLayout.module.css';
import { ArchbaseChangeLanguageAction } from './ArchbaseChangeLanguageAction';
import { ArchbaseColorSchemeAction } from './ArchbaseColorSchemeAction';
import { ArchbaseHeaderNavAction } from './ArchbaseHeaderNavAction';
import { ArchbaseCompany, ArchbaseNavigationItem, ArchbaseOwner } from './types';
import { ArchbaseChangeLanguageMenuItem } from './ArchbaseChangeLanguageMenuItem';

export const defaultAvatar =
	'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';

export interface ArchbaseSpotlightActionData extends SpotlightActionData {
	category: string;
	image?: string;
	link?: string;
}

function CustomCommand({ category, title, color, description, image, onClick }: ArchbaseSpotlightActionData) {
	return (
		<Spotlight.Action key={title} className={classes.action} onClick={onClick}>
			<Group wrap="nowrap" w="100%">
				{category && <Badge color={color}>{`${i18next.t(category)}`}</Badge>}
				{image && (
					<Center>
						<Image src={image} alt={`${i18next.t(title)}`} width={50} height={50} />
					</Center>
				)}

				<div style={{ flex: 1 }}>
					<Text>{`${i18next.t(title)}`}</Text>

					{description && (
						<Text c="dimmed" size="xs">
							{`${i18next.t(description)}`}
						</Text>
					)}
				</div>
			</Group>
		</Spotlight.Action>
	);
}

interface CommandPaletteButtonProps {
	commands: ArchbaseSpotlightActionData[];
	theme: string;
}

interface CommandPaletteButtonState {
	commandOpen: boolean;
	query: string;
}

class CommandPaletteButton extends Component<CommandPaletteButtonProps, CommandPaletteButtonState> {
	constructor(props: CommandPaletteButtonProps) {
		super(props);
		this.state = { commandOpen: false, query: '' };
	}

	onButtonClick = (_event) => {
		this.setState({ ...this.state, commandOpen: !this.state.commandOpen });
	};

	onRequestClose = () => {
		this.setState({ ...this.state, commandOpen: false });
	};

	onAfterOpen = () => {
		this.setState({ ...this.state, commandOpen: true });
	};

	render() {
		const filteredCommands = this.props.commands
			.filter((item) => {
				const sItem = `${t(item.title)}`;
				return sItem && item.title.toLowerCase().includes(this.state.query.toLowerCase().trim());
			})
			.map((item) => CustomCommand(item));

		return (
			<>
				<Tooltip withinPortal withArrow label={`${t('archbase:Comandos ⌘M')}`}>
					<Button leftSection={<IconTerminal size="24px" />} onClick={() => spotlight.open()} />
				</Tooltip>

				<Spotlight.Root
					shortcut={['mod + M', '/']}
					onQueryChange={(query: string) => {
						this.setState({ ...this.state, query });
					}}
					query={this.state.query}
				>
					<Spotlight.Search placeholder={`${t('archbase:Localizar...')}`} leftSection={<IconSearch size="1.2rem" />} />
					<Spotlight.ActionsList>
						{filteredCommands.length > 0 ? filteredCommands : <Spotlight.Empty>Nothing found...</Spotlight.Empty>}
					</Spotlight.ActionsList>
				</Spotlight.Root>
			</>
		);
	}
}

export type ArchbaseAdminLayoutHeaderProps = {
	logo: string;
	styleLogo?: CSSProperties;
	userMenuItems: ReactNode;
	showUserMenuToggleColorScheme?: boolean;
	userMenuToggleColorSchemeIconSize?: string | number;
	showUserMenuOptionsLabel?: boolean;
	showMenuItemsAfterToggleColorScheme?: boolean;
	userMenuItemsAfterToggleColorScheme?: ReactNode;
	showMenuItemsBeforeToggleColorScheme?: boolean;
	userMenuItemsBeforeToggleColorScheme?: ReactNode;
	hideAutoHeaderActionsOnUserMenu?: boolean;
	hideAutoHeaderActionsOnUserMenuBreakPoint?: string;
	withDividerAfterUserMenuToggleColorScheme?: boolean;
	user?: ArchbaseUser;
	owner?: ArchbaseOwner;
	company?: ArchbaseCompany;
	navigationData: ArchbaseNavigationItem[] | undefined;
	headerActions?: ReactNode | ReactNode[];
	headerLeftContent?: ReactNode | ReactNode[];
	showLanguageSelector?: boolean;
	showHeaderToggleColorScheme?: boolean;
	showUserMenuLanguageSelector?: boolean;
	showHeaderActions?: boolean;
	sideBarHiddenBreakPoint?: string | number;
	toggleColorScheme?: () => void;
};

export const ArchbaseAdminLayoutHeader: React.FC<ArchbaseAdminLayoutHeaderProps> = ({
	userMenuItems,
	showUserMenuToggleColorScheme = true,
	showUserMenuOptionsLabel = true,
	userMenuToggleColorSchemeIconSize = 14,
	showMenuItemsAfterToggleColorScheme = true,
	userMenuItemsAfterToggleColorScheme,
	showMenuItemsBeforeToggleColorScheme = true,
	userMenuItemsBeforeToggleColorScheme,
	hideAutoHeaderActionsOnUserMenu = true,
	showHeaderActions = true,
	showHeaderToggleColorScheme = true,
	hideAutoHeaderActionsOnUserMenuBreakPoint,
	withDividerAfterUserMenuToggleColorScheme = true,
	showUserMenuLanguageSelector = true,
	user,
	navigationData: navigationItems,
	logo,
	headerActions,
	styleLogo,
	showLanguageSelector = false,
	sideBarHiddenBreakPoint,
	headerLeftContent,
	toggleColorScheme: toggleColorSchemeExternal,
}) => {
	const theme = useMantineTheme();
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const navigate = useNavigate();
	const adminLayoutContextValue = useContext<ArchbaseAdminLayoutContextValue>(ArchbaseAdminLayoutContext);
	const isSideBarHiddenBreakPoint = useMediaQuery(
		`(max-width: ${sideBarHiddenBreakPoint ? px(sideBarHiddenBreakPoint) : theme.breakpoints.md})`,
	);
	const isHideAutoBreakPoint = useMediaQuery(
		`(max-width: ${hideAutoHeaderActionsOnUserMenuBreakPoint ? px(hideAutoHeaderActionsOnUserMenuBreakPoint) : theme.breakpoints.md})`,
	);
	const commands = useMemo(() => {
		const result = new Array<ArchbaseSpotlightActionData>();
		if (navigationItems) {
			navigationItems.forEach((item) => {
				if (item.links) {
					item.links.forEach((subItem) => {
						if (!subItem.disabled && subItem.showInSidebar) {
							result.push({
								id: subItem.label,
								category: subItem.category ? subItem.category.toUpperCase() : '',
								c: 'white',
								bg: subItem.color,
								title: subItem.label,
								link: subItem.link,
								onClick: () => {
									return navigate(subItem.link);
								},
							});
						}
					});
				} else {
					if (!item.disabled && item.showInSidebar) {
						result.push({
							id: item.label,
							onClick: () => {
								return navigate(item.link);
							},
							category: item.category ? item.category.toUpperCase() : '',
							c: 'white',
							bg: item.color,
							title: item.label,
							link: item.link,
						});
					}
				}
			});
		}

		return result;
	}, [navigationItems, navigate]);

	if (hideAutoHeaderActionsOnUserMenu) {
		showHeaderActions = !isHideAutoBreakPoint
		showHeaderToggleColorScheme = !isHideAutoBreakPoint
		showUserMenuToggleColorScheme = isHideAutoBreakPoint
		showUserMenuOptionsLabel = isHideAutoBreakPoint
		showMenuItemsBeforeToggleColorScheme = isHideAutoBreakPoint
		withDividerAfterUserMenuToggleColorScheme = isHideAutoBreakPoint
		showLanguageSelector = !isHideAutoBreakPoint
		showUserMenuLanguageSelector = isHideAutoBreakPoint
	}

	return (
		<>
			<Flex style={{ width: 300, height: 50 }} align="center">
				<img
					style={{
						height: 50,
						...styleLogo,
					}}
					alt="logo"
					src={logo}
				/>
			</Flex>
			<Burger
				opened={adminLayoutContextValue.hidden ? adminLayoutContextValue.hidden : false}
				onClick={() => adminLayoutContextValue.setHidden(!adminLayoutContextValue.hidden)}
				size="sm"
				color={theme.colors.gray[7]}
				mx="xl"
				display={isSideBarHiddenBreakPoint ? '' : 'none'}
			/>
			<div>
				{commands && commands.length > 0 ? <CommandPaletteButton commands={commands} theme={colorScheme} /> : null}
			</div>
			<Box style={{ flex: 1 }}>{headerLeftContent}</Box>
			<ArchbaseHeaderNavAction>
				{showHeaderActions && headerActions}
				{showHeaderToggleColorScheme && <ArchbaseColorSchemeAction toggleColorScheme={toggleColorSchemeExternal} />}
				{showLanguageSelector && <ArchbaseChangeLanguageAction />}
				<Menu shadow="md" width={200} position="bottom-end">
					<Menu.Target>
						<div>
							<Avatar
								style={{ cursor: 'pointer' }}
								radius="xl"
								ml={8}
								src={user ? user.photo : defaultAvatar}
								alt={user ? user.displayName : ''}
							/>
							{user && user.isAdmin ? (
								<div
									style={{
										width: '16px',
										display: 'flex',
										border: '1px solid yellow',
										justifyContent: 'center',
										alignItems: 'center',
										height: '16px',
										bottom: 5,
										right: 5,
										position: 'absolute',
										zIndex: 400,
										borderRadius: 50,
										backgroundColor: 'green',
									}}
								>
									<Text size="xs" c="white">
										A
									</Text>
								</div>
							) : null}
						</div>
					</Menu.Target>

					<Menu.Dropdown>
						{userMenuItems}
						{showUserMenuOptionsLabel && <Menu.Label>{`${i18next.t("archbase:Opções")}`}</Menu.Label>}
						{showMenuItemsBeforeToggleColorScheme && userMenuItemsBeforeToggleColorScheme}
						{
							showUserMenuToggleColorScheme &&
							<Menu.Item
								leftSection={colorScheme === 'dark' ? <IconSun size={userMenuToggleColorSchemeIconSize} /> : <IconMoonStars size={userMenuToggleColorSchemeIconSize} />}
								onClick={toggleColorSchemeExternal ? toggleColorSchemeExternal : toggleColorScheme}
							>
								{`${i18next.t("archbase:toggleColorScheme")}`}
							</Menu.Item>
						}
						{showUserMenuLanguageSelector && <ArchbaseChangeLanguageMenuItem />}

						{withDividerAfterUserMenuToggleColorScheme && <Menu.Divider />}
						{showMenuItemsAfterToggleColorScheme && userMenuItemsAfterToggleColorScheme}
					</Menu.Dropdown>
				</Menu>
			</ArchbaseHeaderNavAction>
		</>
	);
};
