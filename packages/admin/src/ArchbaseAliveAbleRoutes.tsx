import React, { createContext, useContext, ReactElement, ReactNode, useRef, useState, useMemo, useEffect, useCallback } from 'react';
import type { RouteProps, RoutesProps } from 'react-router';
import { Route, Routes, useLocation, matchPath, Params, useParams as useReactRouterParams, useOutlet } from 'react-router-dom';
import { KeepAlive, useKeepAliveContext, useKeepAliveRef, useEffectOnActive } from 'keepalive-for-react';
import type { KeepAliveRef } from 'keepalive-for-react';

// ============================================================================
// CONTEXTO PARA VISIBILIDADE (NOTIFICA COMPONENTES QUANDO TAB FICA VISÍVEL)
// ============================================================================

interface KeepAliveVisibilityContextValue {
	isVisible: boolean;
}

const KeepAliveVisibilityContext = createContext<KeepAliveVisibilityContextValue>({
	isVisible: true
});

/**
 * Hook para acessar o estado de visibilidade do componente keep-alive.
 */
export const useKeepAliveVisibility = (): KeepAliveVisibilityContextValue => {
	return useContext(KeepAliveVisibilityContext);
};

// ============================================================================
// CONTEXTO PARA PARÂMETROS DE ROTA
// ============================================================================

interface ArchbaseRouteParamsContextValue {
	params: Params<string>;
}

const ArchbaseRouteParamsContext = createContext<ArchbaseRouteParamsContextValue>({ params: {} });

export const useArchbaseRouteParams = <T extends Params<string> = Params<string>>(): T => {
	const context = useContext(ArchbaseRouteParamsContext);
	return context.params as T;
};

export const useParams = <T extends Params<string> = Params<string>>(): T => {
	const routerParams = useReactRouterParams();
	const keepAliveContext = useContext(ArchbaseRouteParamsContext);
	const keepAliveParams = keepAliveContext.params;

	const hasValidRouterParams = useMemo(() => {
		if (!routerParams) return false;
		const keys = Object.keys(routerParams);
		if (keys.length === 0) return false;
		return keys.some(key => (routerParams as Record<string, string | undefined>)[key] !== undefined);
	}, [routerParams]);

	return (hasValidRouterParams ? routerParams : keepAliveParams) as T;
};

// ============================================================================
// CONTEXTO PARA GERENCIAR CACHE (EXPÕE aliveRef)
// ============================================================================

interface KeepAliveCacheContextValue {
	/** @deprecated Use destroy() instead */
	requestUnregister: (path: string) => void;
	destroy: (cacheKey: string) => void;
	destroyAll: () => void;
	destroyOther: (cacheKey: string) => void;
	getCacheNodes: () => any[];
}

const KeepAliveCacheContext = createContext<KeepAliveCacheContextValue | null>(null);

export const useKeepAliveCache = () => useContext(KeepAliveCacheContext);

/**
 * Provider separado para o cache context. Deve envolver tanto o TabContainer
 * quanto o ArchbaseAliveAbleRoutes para que ambos tenham acesso ao cache.
 */
export const KeepAliveCacheProvider = ({ children }: { children: ReactNode }) => {
	const aliveRef = useKeepAliveRef();

	const cacheContextValue = useMemo<KeepAliveCacheContextValue>(() => ({
		requestUnregister: (path: string) => {
			aliveRef.current?.destroy(path);
		},
		destroy: (cacheKey: string) => {
			aliveRef.current?.destroy(cacheKey);
		},
		destroyAll: () => {
			aliveRef.current?.destroyAll();
		},
		destroyOther: (cacheKey: string) => {
			aliveRef.current?.destroyOther(cacheKey);
		},
		getCacheNodes: () => {
			return aliveRef.current?.getCacheNodes() || [];
		}
	}), [aliveRef]);

	return (
		<KeepAliveCacheContext.Provider value={cacheContextValue}>
			<KeepAliveAliveRefContext.Provider value={aliveRef}>
				{children}
			</KeepAliveAliveRefContext.Provider>
		</KeepAliveCacheContext.Provider>
	);
};

/**
 * Contexto interno para compartilhar o aliveRef entre o Provider e o ArchbaseAliveAbleRoutes
 */
const KeepAliveAliveRefContext = createContext<React.RefObject<KeepAliveRef | null> | null>(null);

// ============================================================================
// TIPOS
// ============================================================================

export interface ArchbaseKeepAliveRouteProps extends Omit<RouteProps, 'element'> {
	component?: ReactNode | React.ComponentType;
}

export const ArchbaseKeepAliveRoute = (props: ArchbaseKeepAliveRouteProps) => null;

// ============================================================================
// UTILITÁRIOS
// ============================================================================

const hasPathParams = (path: string): boolean => {
	return path.includes(':');
};

const getCacheKey = (pathPattern: string, currentPathname: string): string => {
	if (hasPathParams(pathPattern)) {
		return currentPathname;
	}
	return pathPattern;
};

// ============================================================================
// VISIBILITY WRAPPER
// ============================================================================

const KeepAliveVisibilityWrapper = ({ children }: { children: ReactNode }) => {
	const { active } = useKeepAliveContext();
	const routerParams = useReactRouterParams();
	const [savedParams, setSavedParams] = useState<Params<string>>(routerParams);

	useEffectOnActive(() => {
		setSavedParams(routerParams);
		setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 50);
	}, [routerParams]);

	useEffect(() => {
		if (active) {
			setSavedParams(routerParams);
		}
	}, [routerParams, active]);

	return (
		<KeepAliveVisibilityContext.Provider value={{ isVisible: active }}>
			<ArchbaseRouteParamsContext.Provider value={{ params: savedParams }}>
				{children}
			</ArchbaseRouteParamsContext.Provider>
		</KeepAliveVisibilityContext.Provider>
	);
};

// ============================================================================
// KEEP ALIVE LAYOUT - USA useOutlet + KeepAlive (SEMPRE MONTADO)
// ============================================================================

interface KeepAliveLayoutProps {
	keepAlivePaths: string[];
	maxKeepAliveTabs: number;
	aliveRef: React.RefObject<KeepAliveRef | null>;
}

/**
 * Prefixo para cache keys de rotas não-keepAlive.
 * Rotas com este prefixo são excluídas do cache via `exclude`.
 */
const NON_KEEPALIVE_PREFIX = '__nokeep__:';

const KeepAliveLayout = React.memo(({ keepAlivePaths, maxKeepAliveTabs, aliveRef }: KeepAliveLayoutProps) => {
	const location = useLocation();
	const outlet = useOutlet();

	// Determina se rota atual é keepAlive e gera cache key
	const { cacheKey, isKeepAlive } = useMemo(() => {
		const matchedPattern = keepAlivePaths.find(p =>
			matchPath({ path: p, end: true }, location.pathname)
		);
		if (matchedPattern) {
			return {
				cacheKey: getCacheKey(matchedPattern, location.pathname),
				isKeepAlive: true
			};
		}
		// Rota não-keepAlive: usa prefixo especial que será excluído do cache
		return {
			cacheKey: NON_KEEPALIVE_PREFIX + location.pathname,
			isKeepAlive: false
		};
	}, [keepAlivePaths, location.pathname]);

	// Exclude pattern: rotas com prefixo __nokeep__ nunca são cacheadas
	const excludePattern = useMemo(() => [/^__nokeep__:/], []);

	return (
		<KeepAlive
			activeCacheKey={cacheKey}
			max={maxKeepAliveTabs}
			aliveRef={aliveRef}
			exclude={excludePattern}
		>
			{outlet}
		</KeepAlive>
	);
});

KeepAliveLayout.displayName = 'KeepAliveLayout';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export interface ArchbaseAliveAbleRoutesProps extends RoutesProps {
	/** Número máximo de abas keepAlive mantidas em cache. Padrão: 10 */
	maxKeepAliveTabs?: number;
}

export const ArchbaseAliveAbleRoutes = ({ children, maxKeepAliveTabs = 10, ...props }: ArchbaseAliveAbleRoutesProps) => {
	// Usa aliveRef do KeepAliveCacheProvider se disponível, senão cria um local
	const localAliveRef = useKeepAliveRef();
	const providerAliveRef = useContext(KeepAliveAliveRefContext);
	const aliveRef = providerAliveRef || localAliveRef;

	// Extrair paths e converter routes - usa ref para estabilizar
	const prevResultRef = useRef<{ keepAlivePaths: string[]; routeElements: ReactElement[] } | null>(null);
	const prevChildrenKeyRef = useRef<string>('');

	const { keepAlivePaths, routeElements } = useMemo(() => {
		const routes = React.Children.toArray(children);

		// Gera uma chave estável baseada nos paths dos children
		const childrenKey = routes.map((route) => {
			if (React.isValidElement(route)) {
				const p = (route.props as any)?.path || '';
				const isKA = route.type === ArchbaseKeepAliveRoute;
				return `${p}:${isKA}`;
			}
			return '';
		}).join('|');

		// Se os children não mudaram estruturalmente, retorna resultado anterior
		if (prevResultRef.current && prevChildrenKeyRef.current === childrenKey) {
			return prevResultRef.current;
		}
		prevChildrenKeyRef.current = childrenKey;

		const paths: string[] = [];
		const elements: ReactElement[] = [];

		routes.forEach((route) => {
			if (!React.isValidElement(route)) return;

			if (route.type === ArchbaseKeepAliveRoute) {
				const routeProps = route.props as ArchbaseKeepAliveRouteProps;
				if (routeProps.path) {
					paths.push(routeProps.path);
				}
				const component = routeProps.component;
				const element = typeof component === 'function'
					? React.createElement(component as React.ComponentType)
					: component;
				elements.push(
					<Route
						key={routeProps.path || route.key}
						path={routeProps.path}
						element={
							<KeepAliveVisibilityWrapper>
								{element}
							</KeepAliveVisibilityWrapper>
						}
					/>
				);
			} else {
				elements.push(route as ReactElement);
			}
		});

		const result = { keepAlivePaths: paths, routeElements: elements };
		prevResultRef.current = result;
		return result;
	}, [children]);

	// Se não há Provider externo, cria um contexto local como fallback
	const existingCacheContext = useContext(KeepAliveCacheContext);

	const localCacheContextValue = useMemo<KeepAliveCacheContextValue>(() => ({
		requestUnregister: (path: string) => {
			aliveRef.current?.destroy(path);
		},
		destroy: (cacheKey: string) => {
			aliveRef.current?.destroy(cacheKey);
		},
		destroyAll: () => {
			aliveRef.current?.destroyAll();
		},
		destroyOther: (cacheKey: string) => {
			aliveRef.current?.destroyOther(cacheKey);
		},
		getCacheNodes: () => {
			return aliveRef.current?.getCacheNodes() || [];
		}
	}), [aliveRef]);

	const routesContent = (
		<Routes {...props}>
			<Route element={
				<KeepAliveLayout
					keepAlivePaths={keepAlivePaths}
					maxKeepAliveTabs={maxKeepAliveTabs}
					aliveRef={aliveRef}
				/>
			}>
				{routeElements}
			</Route>
		</Routes>
	);

	// Se já existe um Provider externo (KeepAliveCacheProvider), não cria outro
	if (existingCacheContext) {
		return routesContent;
	}

	return (
		<KeepAliveCacheContext.Provider value={localCacheContextValue}>
			{routesContent}
		</KeepAliveCacheContext.Provider>
	);
};
