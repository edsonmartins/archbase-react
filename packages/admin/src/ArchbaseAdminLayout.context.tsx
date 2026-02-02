import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ArchbaseUser } from '@archbase/security';
import { ArchbaseCompany, ArchbaseNavigationItem, ArchbaseOwner } from './types';
import { useArchbaseSecurityManager } from '@archbase/security';
import { ArchbaseAdminMainLayoutSecurityOptions } from './ArchbaseAdminMainLayout';
import { useUncontrolled } from '@mantine/hooks';

export interface ArchbaseAdminLayoutListener {
	onChangeLocationPath: (item: ArchbaseNavigationItem) => void;
}

export interface ArchbaseAdminLayoutContextValue {
	navigationData?: ArchbaseNavigationItem[];
	setNavigationData?: (navigationData: ArchbaseNavigationItem[]) => void;
	user?: ArchbaseUser;
	owner?: ArchbaseOwner;
	company?: ArchbaseCompany;
	navigationRootLink?: string;
	collapsed?: boolean;
	setCollapsed?: (value: boolean) => void;
	hidden?: boolean;
	setHidden?: (value: boolean) => void;
	onNavigationDataChange?: (navigationData: ArchbaseNavigationItem[]) => void;
	/** Indica se as permissões de navegação estão sendo carregadas */
	isLoadingPermissions?: boolean;
	/** Mensagem de erro ao carregar permissões (null se não houver erro) */
	permissionsError?: string | null;
}

export interface ArchbaseAdminLayoutContextProps {
	navigationData?: ArchbaseNavigationItem[];
	user?: ArchbaseUser;
	owner?: ArchbaseOwner;
	company?: ArchbaseCompany;
	navigationRootLink?: string;
	children?: ReactNode;
	opened?: boolean;
	enableSecurity?: boolean;
	securityOptions?: ArchbaseAdminMainLayoutSecurityOptions;
	onNavigationDataChange?: (navigationData: ArchbaseNavigationItem[]) => void;
	initialSidebarCollapsed?: boolean;
}

const ArchbaseAdminLayoutContext = React.createContext<ArchbaseAdminLayoutContextValue>({});

const ArchbaseAdminLayoutProvider: React.FC<ArchbaseAdminLayoutContextProps> = ({
	navigationData: initialNavigationData,
	user,
	owner,
	company,
	navigationRootLink,
	children,
	enableSecurity,
	securityOptions,
	onNavigationDataChange,
	initialSidebarCollapsed,
}) => {
	const [collapsed, setCollapsed] = useState<boolean>(initialSidebarCollapsed);
	const [hidden, setHidden] = useState<boolean>(false);
	const [isLoadingPermissions, setIsLoadingPermissions] = useState<boolean>(enableSecurity === true);
	const [permissionsError, setPermissionsError] = useState<string | null>(null);

	// Ref para evitar processamento duplicado das permissões
	const permissionsProcessedRef = useRef<boolean>(false);
	const [navigationData, setNavigationData] = useUncontrolled({
		value: onNavigationDataChange !== undefined ? initialNavigationData : undefined,
		defaultValue: enableSecurity ? [] : initialNavigationData,
		finalValue: [],
		onChange: onNavigationDataChange,
	});

	// navigationData change listener
	useEffect(() => {
		// Effect for navigation data changes
	}, [navigationData, enableSecurity]);

	const { securityManager } = useArchbaseSecurityManager({
		resourceName: securityOptions?.navigationResourceName ? securityOptions.navigationResourceName : "ArchbaseAdvancedSidebar",
		resourceDescription: securityOptions?.navigationResourceDescription ? securityOptions.navigationResourceDescription : "archbase:Navegação",
		enableSecurity
	});

	// Reset da ref quando o usuário muda
	useEffect(() => {
		permissionsProcessedRef.current = false;
	}, [user?.id]);

	useEffect(() => {
		// Se segurança não está habilitada, não precisa carregar permissões
		if (!enableSecurity) {
			setIsLoadingPermissions(false);
			return;
		}

		// Se já processou as permissões, não faz nada
		if (permissionsProcessedRef.current) {
			return;
		}

		const filteredData = initialNavigationData.filter(item => item.showInSidebar);

		filteredData.forEach(item => {
			securityManager.registerAction(item.label, item.label);
			item?.links?.forEach(itemChild => securityManager.registerAction(`${item.label} -> ${itemChild.label}`, `${item.label} -> ${itemChild.label}`));
		});

		// Função para processar as permissões e atualizar o navigationData
		const processPermissions = () => {
			permissionsProcessedRef.current = true;

			const updatedNavigationData = initialNavigationData.map(item => ({
				...item,
				disabled: !securityManager.hasPermission(item.label),
				links: item.links && item.links.map(itemChild => {
					const childHasPermission = securityManager.hasPermission(`${item.label} -> ${itemChild.label}`)
					return {
						...itemChild,
						disabled: !childHasPermission
					}
				})
			}))

			setNavigationData(updatedNavigationData);
			setIsLoadingPermissions(false);
			setPermissionsError(null);
		};

		// Verifica o estado do securityManager (pode ser instância cacheada)
		const isAlreadyLoaded = !securityManager.isLoading() && !securityManager.isError();
		const hasError = securityManager.isError();

		if (hasError) {
			permissionsProcessedRef.current = true;
			const errorMessage = securityManager.getError() || 'Erro ao carregar permissões de navegação';
			setPermissionsError(errorMessage);
			setIsLoadingPermissions(false);
			setNavigationData(initialNavigationData);
			return;
		}

		if (isAlreadyLoaded) {
			processPermissions();
			return;
		}

		// SecurityManager ainda não aplicado, inicia o carregamento
		setIsLoadingPermissions(true);
		setPermissionsError(null);

		// Flag para evitar atualizações após cleanup
		let isCancelled = false;

		// Intervalo para verificar erros do securityManager
		const errorCheckInterval = setInterval(() => {
			if (isCancelled) return;

			if (securityManager.isError()) {
				clearInterval(errorCheckInterval);
				permissionsProcessedRef.current = true;
				const errorMessage = securityManager.getError() || 'Erro ao carregar permissões de navegação';
				setPermissionsError(errorMessage);
				setIsLoadingPermissions(false);
				setNavigationData(initialNavigationData);
			}
		}, 100);

		// Timeout máximo para evitar loading infinito (3 segundos)
		const timeoutId = setTimeout(() => {
			if (isCancelled) return;

			clearInterval(errorCheckInterval);
			setIsLoadingPermissions((currentLoading) => {
				if (currentLoading) {
					permissionsProcessedRef.current = true;
					console.warn('[ArchbaseAdminLayout] Timeout ao carregar permissões - carregando menu sem filtro de segurança');
					setNavigationData(initialNavigationData);
					return false;
				}
				return currentLoading;
			});
		}, 3000);

		securityManager.apply(() => {
			if (isCancelled) return;

			clearInterval(errorCheckInterval);
			clearTimeout(timeoutId);

			processPermissions();
		});

		// Cleanup
		return () => {
			isCancelled = true;
			clearInterval(errorCheckInterval);
			clearTimeout(timeoutId);
		};
	}, [user?.id, enableSecurity, initialNavigationData, securityManager, setNavigationData]);

	return (
		<ArchbaseAdminLayoutContext.Provider
			value={{
				navigationData,
				setNavigationData,
				user,
				owner,
				company,
				navigationRootLink,
				collapsed,
				setCollapsed,
				hidden,
				setHidden,
				onNavigationDataChange,
				isLoadingPermissions,
				permissionsError
			}}
		>
			{children}
		</ArchbaseAdminLayoutContext.Provider>
	);
};

export { ArchbaseAdminLayoutContext, ArchbaseAdminLayoutProvider };
