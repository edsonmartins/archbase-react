import { useMantineColorScheme } from '@mantine/core';
import useComponentSize from '@rehooks/component-size';
import React, { ReactNode, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { matchPath } from 'react-router';
import { ArchbaseAdvancedTabItem, ArchbaseAdvancedTabs } from '@archbase/layout';
import { getI18nextInstance, useArchbaseTranslation } from '@archbase/core';
import { ArchbaseAdminLayoutContext, ArchbaseAdminLayoutContextValue } from './ArchbaseAdminLayout.context';
import { ArchbaseNavigationContext, useArchbaseNavigationContext } from './ArchbaseNavigation.context';
import { ArchbaseNavigationItem, ArchbaseTabItem } from './types';
import { useKeepAliveCache } from './ArchbaseAliveAbleRoutes';

export interface ArchbaseAdminTabContainerProps {
	navigationData: ArchbaseNavigationItem[];
	onChangeActiveTabId?: (activeTabId: any) => void;
	onChangeOpenedTabs?: (openedTabs: ArchbaseTabItem[]) => void;
	activeTabId?: any;
	openedTabs?: ArchbaseTabItem[];
}

interface ResultItem {
	item: ArchbaseNavigationItem | undefined;
	title: string | undefined;
	link: string;
	redirect?: string;
	customTitle?: string;
}

export function ArchbaseAdminTabContainer({
	navigationData,
	onChangeOpenedTabs,
	onChangeActiveTabId,
	activeTabId: defaultActiveTabId,
	openedTabs: defaultOpenedTabs = [],
}: ArchbaseAdminTabContainerProps) {
	const [isPending, startTransition] = React.useTransition();
	const navigate = useNavigate();
	const { colorScheme } = useMantineColorScheme();
	const [openedTabs, setOpenedTabs] = useState<ArchbaseTabItem[]>(defaultOpenedTabs);
	const [activeTabId, setActiveTabId] = useState<any>(defaultActiveTabId);
	const currentLocation = useLocation();
	const tabsRef = useRef<any>([]);
	const size = useComponentSize(tabsRef);
	const navigationContext = useArchbaseNavigationContext();
	const { state, dispatch } = navigationContext;
	const adminLayoutContextValue = useContext<ArchbaseAdminLayoutContextValue>(ArchbaseAdminLayoutContext);
	const keepAliveCache = useKeepAliveCache();

	// Refs para os callbacks - evita dependências nos useEffects
	const onChangeOpenedTabsRef = useRef(onChangeOpenedTabs);
	const onChangeActiveTabIdRef = useRef(onChangeActiveTabId);

	useEffect(() => {
		onChangeOpenedTabsRef.current = onChangeOpenedTabs;
		onChangeActiveTabIdRef.current = onChangeActiveTabId;
	});

	// Flag para rastrear se a mudança veio das props (externa) ou local
	const isExternalUpdateRef = useRef(false);

	const handleOnClose = useCallback((id: string, payload?: { redirectUrl?: string }) => {
		console.log(`[TabContainer] handleOnClose called for: ${id}`);
		// Solicita remoção do cache keep-alive quando aba é fechada
		if (!keepAliveCache) {
			console.error('[ArchbaseAdminTabContainer] keepAliveCache context not available. Tab cache cleanup will not occur. This may cause memory leaks.');
		} else {
			keepAliveCache.requestUnregister(id);
		}

		const closedIndex = openedTabs.findIndex((tab) => tab.path === id);
		// Prioridade: payload.redirectUrl > tab.redirect
		let redirect: string | undefined = payload?.redirectUrl;
		if (!redirect && closedIndex >= 0) {
			redirect = openedTabs[closedIndex].redirect;
		}
		const tmpTabs = openedTabs.filter((f) => f.id !== id);
		let idx = -1;
		tmpTabs.forEach((f, index) => f.id === activeTabId && (idx = index));
		let tmpCurrent: string | null = null;
		if (tmpTabs.length > 0 && tmpTabs[idx]) {
			tmpCurrent = tmpTabs[idx].id;
		} else if (tmpTabs.length > 0) {
			tmpCurrent = tmpTabs[tmpTabs.length - 1].id;
		} else {
			tmpCurrent = null;
		}
		const nextTabs = tmpTabs.map((tab) => ({
			...tab,
			active: tmpCurrent === tab.id,
		}));
		setOpenedTabs(nextTabs);
		if (tmpCurrent && tmpCurrent != null) {
			setActiveTabId(tmpCurrent);
			if (redirect) {
				navigate(redirect);
			} else {
				navigate(tmpCurrent);
			}
		} else {
			setActiveTabId(undefined);
			if (!adminLayoutContextValue.navigationRootLink) {
				console.error('[ArchbaseAdminTabContainer] navigationRootLink is not configured. Cannot navigate to root.');
				return;
			}
			navigate(adminLayoutContextValue.navigationRootLink);
		}
		dispatch({ type: 'DONE', link: '' });
	}, [openedTabs, activeTabId, navigate, adminLayoutContextValue.navigationRootLink, dispatch, keepAliveCache]);

	useEffect(() => {
		if (state?.linkClosed) {
			console.log(`[TabContainer] useEffect - linkClosed: ${state?.linkClosed}`);
			handleOnClose(state?.linkClosed, state?.payload);
		}
	}, [state?.linkClosed, state?.payload, handleOnClose]);

	const getNavigationItemByLink = (link: string): ResultItem => {
		const result: ResultItem = {
			item: undefined,
			title: undefined,
			link,
			redirect: undefined,
			customTitle: undefined,
		};
		navigationData.forEach((item) => {
			if (item.links) {
				item.links.forEach((subItem) => {
					const found = matchPath({ path: subItem.link || '' }, location.pathname);
					if (found) {
						result.item = subItem;
						result.title = `${getI18nextInstance().t(subItem.label)}`;
						result.redirect = subItem.redirect;
						result.customTitle = subItem.customTitle;
					}
				});
			} else if (item.link && !result.item) {
				const found = matchPath({ path: item.link }, location.pathname);
				if (found) {
					if (found.params && Object.keys(found.params).length > 0) {
						result.title = `${found.params[Object.keys(found.params)[0]]}`;
					} else {
						result.title = `${getI18nextInstance().t(item.label)}`;
					}
					result.item = item;
					result.redirect = item.redirect;
					result.customTitle = item.customTitle;
				}
			}
		});
		if (result.customTitle) {
			result.customTitle = result.customTitle.replace("$title", result.title)
		}

		return result;
	};

	useEffect(() => {
		setOpenedTabs(defaultOpenedTabs);
		isExternalUpdateRef.current = true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(defaultOpenedTabs)]);

	// Efeito separado para notificar o pai quando openedTabs ou activeTabId mudam
	// Usa setTimeout para evitar atualizar durante o render
	const prevOpenedTabsRef = useRef<ArchbaseTabItem[]>(openedTabs);
	const prevActiveTabIdRef = useRef<any>(activeTabId);

	useEffect(() => {
		// Se a mudança veio das props, não notificar de volta
		if (isExternalUpdateRef.current) {
			isExternalUpdateRef.current = false;
			prevOpenedTabsRef.current = openedTabs;
			prevActiveTabIdRef.current = activeTabId;
			return;
		}

		// Só notificar se houver mudança real
		const tabsChanged = JSON.stringify(prevOpenedTabsRef.current) !== JSON.stringify(openedTabs);
		const activeTabChanged = prevActiveTabIdRef.current !== activeTabId;

		if (tabsChanged || activeTabChanged) {
			// Notificar o pai de forma assíncrona para evitar atualizar durante render
			const timeoutId = setTimeout(() => {
				onChangeOpenedTabsRef.current?.(openedTabs);
				onChangeActiveTabIdRef.current?.(activeTabId);
			}, 0);

			prevOpenedTabsRef.current = openedTabs;
			prevActiveTabIdRef.current = activeTabId;

			return () => clearTimeout(timeoutId);
		}
	}, [openedTabs, activeTabId]);

	// Ref para rastrear a última localização processada
	// Inicializa com string vazia para garantir que a primeira navegação (acesso direto por URL) seja processada
	const lastProcessedPathRef = useRef<string>('');

	useEffect(() => {
		// Evita reprocessar a mesma localização
		if (lastProcessedPathRef.current === currentLocation.pathname) {
			return;
		}

		lastProcessedPathRef.current = currentLocation.pathname;
		const resultItem: ResultItem = getNavigationItemByLink(currentLocation.pathname);
		if (resultItem && resultItem.item) {
			const index = openedTabs.findIndex((tab) => tab.path === resultItem.link);
			if (index !== -1) {
				// Atualizar título da aba existente se mudou
				if (openedTabs[index].title !== resultItem.title) {
					const updatedTabs = [...openedTabs];
					updatedTabs[index] = { ...updatedTabs[index], title: resultItem.title! };
					setOpenedTabs(updatedTabs);
				}
				setActiveTabId(openedTabs[index].id);
			} else {
				// Criar nova aba
				const newTab: ArchbaseTabItem = {
					id: `${resultItem.link}`,
					title: `${resultItem.title}`,
					path: `${resultItem.link}`,
					active: true,
					content: resultItem.item.component,
					iconClass: resultItem.item.icon,
					closeButton: true,
					redirect: resultItem.redirect,
					customTitle: resultItem.customTitle,
				};

				// Desativar todas as abas existentes e adicionar a nova
				const nextTabs = [...openedTabs.map((tab) => ({ ...tab, active: false })), newTab];
				setOpenedTabs(nextTabs);
				setActiveTabId(newTab.id);
			}
		}
	}, [currentLocation.pathname]);

	const handleOnActive = (id: string) => {
		const items = openedTabs.filter((item) => item.id === id);
		if (items && items.length > 0) {
			if (currentLocation.pathname !== items[0].path) {
				navigate(items[0].path);
			}
		}
		startTransition(() => {
			setActiveTabId(id);
		});
	};

	const handleOnCloseRequest = (id: string) => {
		console.log(`[TabContainer] handleOnCloseRequest - User clicked close on tab: ${id}`);
		try {
			dispatch({ type: 'USER_CLOSE_REQUEST', link: id });
		} catch (error) {
			console.error('[TabContainer] Dispatch failed:', error);
		}
	};

	// Funções para fechar múltiplas abas
	const handleCloseAllTabs = useCallback(() => {
		setOpenedTabs([]);
		setActiveTabId(undefined);
		if (!adminLayoutContextValue.navigationRootLink) {
			console.error('[ArchbaseAdminTabContainer] navigationRootLink is not configured. Cannot navigate to root.');
			return;
		}
		navigate(adminLayoutContextValue.navigationRootLink);
	}, [navigate, adminLayoutContextValue.navigationRootLink]);

	const handleCloseLeftTabs = useCallback((tabId: string) => {
		const currentIndex = openedTabs.findIndex((tab) => tab.id === tabId);
		if (currentIndex <= 0) return; // Não há abas à esquerda

		const tabsToKeep = openedTabs.slice(currentIndex);
		const tmpCurrent = tabsToKeep.find((tab) => tab.id === activeTabId)?.id || tabsToKeep[0]?.id;

		const nextTabs = tabsToKeep.map((tab) => ({
			...tab,
			active: tab.id === tmpCurrent,
		}));

		setOpenedTabs(nextTabs);

		if (tmpCurrent) {
			setActiveTabId(tmpCurrent);
			const targetTab = nextTabs.find((t) => t.id === tmpCurrent);
			if (targetTab && currentLocation.pathname !== targetTab.path) {
				navigate(targetTab.path);
			}
		}
	}, [openedTabs, activeTabId, navigate, currentLocation.pathname]);

	const handleCloseRightTabs = useCallback((tabId: string) => {
		const currentIndex = openedTabs.findIndex((tab) => tab.id === tabId);
		if (currentIndex === -1 || currentIndex >= openedTabs.length - 1) return; // Não há abas à direita

		const tabsToKeep = openedTabs.slice(0, currentIndex + 1);
		const tmpCurrent = tabsToKeep.find((tab) => tab.id === activeTabId)?.id || tabsToKeep[tabsToKeep.length - 1]?.id;

		const nextTabs = tabsToKeep.map((tab) => ({
			...tab,
			active: tab.id === tmpCurrent,
		}));

		setOpenedTabs(nextTabs);

		if (tmpCurrent) {
			setActiveTabId(tmpCurrent);
			const targetTab = nextTabs.find((t) => t.id === tmpCurrent);
			if (targetTab && currentLocation.pathname !== targetTab.path) {
				navigate(targetTab.path);
			}
		}
	}, [openedTabs, activeTabId, navigate, currentLocation.pathname]);

	const handleCloseOtherTabs = useCallback((tabId: string) => {
		const currentTab = openedTabs.find((tab) => tab.id === tabId);
		if (!currentTab) return;

		const nextTabs = [{ ...currentTab, active: true }];
		setOpenedTabs(nextTabs);
		setActiveTabId(tabId);

		if (currentLocation.pathname !== currentTab.path) {
			navigate(currentTab.path);
		}
	}, [openedTabs, navigate, currentLocation.pathname]);

	const buildAdvancedTabs = (openedTabs: ArchbaseTabItem[]): ArchbaseAdvancedTabItem[] => {
		return openedTabs.map((tab) => {
			const result: ArchbaseAdvancedTabItem = {
				key: tab.id,
				favicon: tab.iconClass,
				title: tab.title,
				customTitle: tab.customTitle
			};

			return result;
		});
	};
	return (
		<div ref={tabsRef}>
			<ArchbaseAdvancedTabs
				buttonCloseOnlyActiveTab={true}
				onClick={(key: any) => handleOnActive(key)}
				onTabClose={(key: any) => handleOnCloseRequest(key)}
				onTabChange={(_tabs: ArchbaseAdvancedTabItem[]) => {
					return null;
				}}
				onCloseAllTabs={handleCloseAllTabs}
				onCloseLeftTabs={handleCloseLeftTabs}
				onCloseRightTabs={handleCloseRightTabs}
				onCloseOtherTabs={handleCloseOtherTabs}
				currentTabs={buildAdvancedTabs(openedTabs)}
				activeTab={activeTabId}
				dark={colorScheme === 'dark'}
			></ArchbaseAdvancedTabs>
		</div>
	);
}
