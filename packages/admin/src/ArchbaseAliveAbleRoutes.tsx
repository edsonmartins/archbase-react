import React, { createContext, useContext, ReactElement, ReactNode, useLayoutEffect, useRef, useState, useMemo, useEffect, useCallback } from 'react';
import type { RouteProps, RoutesProps } from 'react-router';
import { Route, Routes, useLocation, matchPath, Params, useParams as useReactRouterParams } from 'react-router-dom';

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
 * Use este hook quando precisar reagir a mudanças de visibilidade da tab,
 * por exemplo, para recalcular dimensões de grids ou gráficos.
 *
 * @example
 * import { useKeepAliveVisibility } from '@archbase/admin';
 *
 * function MeuGrid() {
 *   const { isVisible } = useKeepAliveVisibility();
 *   const gridRef = useRef();
 *
 *   useEffect(() => {
 *     if (isVisible && gridRef.current) {
 *       // Força recálculo de dimensões quando tab fica visível
 *       gridRef.current.api?.sizeColumnsToFit();
 *     }
 *   }, [isVisible]);
 *
 *   return <DataGrid ref={gridRef} ... />;
 * }
 */
export const useKeepAliveVisibility = (): KeepAliveVisibilityContextValue => {
	return useContext(KeepAliveVisibilityContext);
};

// ============================================================================
// CONTEXTO PARA PARÂMETROS DE ROTA (SUBSTITUI useParams para componentes keep-alive)
// ============================================================================

interface ArchbaseRouteParamsContextValue {
	params: Params<string>;
}

const ArchbaseRouteParamsContext = createContext<ArchbaseRouteParamsContextValue>({ params: {} });

/**
 * Hook para acessar os parâmetros da rota atual.
 * Este hook funciona tanto dentro quanto fora do contexto do React Router Routes,
 * sendo essencial para componentes que usam keepAlive.
 *
 * @example
 * // Dentro de um componente com keepAlive
 * const { id } = useArchbaseRouteParams();
 */
export const useArchbaseRouteParams = <T extends Params<string> = Params<string>>(): T => {
	const context = useContext(ArchbaseRouteParamsContext);
	return context.params as T;
};

/**
 * Hook de compatibilidade que funciona tanto com React Router quanto com keep-alive.
 *
 * Este hook tenta obter os parâmetros do React Router primeiro. Se não encontrar
 * parâmetros (objeto vazio ou todos os valores undefined), usa o contexto do keep-alive.
 *
 * Use este hook como substituto direto do useParams do React Router para garantir
 * compatibilidade com componentes que podem ou não usar keepAlive.
 *
 * @example
 * // Substitui useParams do react-router-dom
 * import { useParams } from '@archbase/admin';
 * const { id } = useParams<{ id: string }>();
 *
 * @example
 * // Funciona tanto com keepAlive: true quanto keepAlive: false
 * const { id, slug } = useParams<{ id: string; slug: string }>();
 */
export const useParams = <T extends Params<string> = Params<string>>(): T => {
	// Tenta obter do React Router primeiro
	const routerParams = useReactRouterParams();

	// Obtém do contexto keep-alive
	const keepAliveContext = useContext(ArchbaseRouteParamsContext);
	const keepAliveParams = keepAliveContext.params;

	// Verifica se os parâmetros do React Router são válidos (não vazios e com valores definidos)
	const hasValidRouterParams = useMemo(() => {
		if (!routerParams) return false;
		const keys = Object.keys(routerParams);
		if (keys.length === 0) return false;
		// Verifica se pelo menos um valor não é undefined
		return keys.some(key => (routerParams as Record<string, string | undefined>)[key] !== undefined);
	}, [routerParams]);

	// Se o React Router tem parâmetros válidos, usa eles; senão, usa do keep-alive
	return (hasValidRouterParams ? routerParams : keepAliveParams) as T;
};

// ============================================================================
// CONTEXTO PARA GERENCIAR CACHE DE VIEWS (LAZY LOADING)
// ============================================================================

interface CachedComponent {
	element: ReactNode;
	params: Params<string>;
	lastAccessedAt: number;
}

interface KeepAliveCacheContextValue {
	cache: Map<string, CachedComponent>;
	requestedUnregister: Set<string>;
	register: (cacheKey: string, component: ReactNode, params: Params<string>) => void;
	unregister: (cacheKey: string) => void;
	updateParams: (cacheKey: string, params: Params<string>) => void;
	requestUnregister: (path: string) => void;
	touchAccess: (cacheKey: string) => void;
	maxKeepAliveTabs: number;
}

const KeepAliveCacheContext = createContext<KeepAliveCacheContextValue | null>(null);

export const useKeepAliveCache = () => useContext(KeepAliveCacheContext);

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

/**
 * Verifica se um path contém parâmetros dinâmicos (ex: :id, :slug)
 */
const hasPathParams = (path: string): boolean => {
	return path.includes(':');
};

/**
 * Gera a chave de cache baseada no path e na URL atual.
 * Para rotas com parâmetros dinâmicos, usa a URL real.
 * Para rotas estáticas, usa o path pattern.
 */
const getCacheKey = (pathPattern: string, currentPathname: string): string => {
	if (hasPathParams(pathPattern)) {
		// Para rotas dinâmicas, usa a URL real como chave
		return currentPathname;
	}
	// Para rotas estáticas, usa o path pattern
	return pathPattern;
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export interface ArchbaseAliveAbleRoutesProps extends RoutesProps {
	/** Número máximo de abas keepAlive mantidas em cache. Padrão: 10 */
	maxKeepAliveTabs?: number;
}

export const ArchbaseAliveAbleRoutes = ({ children, maxKeepAliveTabs = 10, ...props }: ArchbaseAliveAbleRoutesProps) => {
	const [cache, setCache] = useState<Map<string, CachedComponent>>(new Map());
	const [requestedUnregister, setRequestedUnregister] = useState<Set<string>>(new Set());

	/**
	 * Encontra a entrada menos recentemente usada no cache,
	 * excluindo a chave que está sendo adicionada (ativa atual)
	 */
	const findLeastRecentlyUsed = useCallback((
		currentCache: Map<string, CachedComponent>,
		excludeKey: string
	): string | null => {
		let lruKey: string | null = null;
		let lruTime = Infinity;

		currentCache.forEach((value, key) => {
			if (key === excludeKey) return;

			if (value.lastAccessedAt < lruTime) {
				lruTime = value.lastAccessedAt;
				lruKey = key;
			}
		});

		return lruKey;
	}, []);

	// Registra um componente no cache com lógica LRU
	const register = useCallback((cacheKey: string, component: ReactNode, params: Params<string>) => {
		if (!cacheKey || typeof cacheKey !== 'string') {
			console.error('[ArchbaseAliveAbleRoutes] Invalid cacheKey for component registration:', cacheKey);
			return;
		}
		if (component === undefined) {
			console.warn('[ArchbaseAliveAbleRoutes] Attempting to register undefined component for cacheKey:', cacheKey);
			return;
		}
		setCache((prev) => {
			// Se já existe, apenas atualiza o timestamp
			if (prev.has(cacheKey)) {
				const next = new Map(prev);
				const existing = prev.get(cacheKey)!;
				next.set(cacheKey, { ...existing, lastAccessedAt: Date.now() });
				return next;
			}

			const next = new Map(prev);

			// LRU: remover menos usada se atingiu limite
			if (next.size >= maxKeepAliveTabs) {
				const lruKey = findLeastRecentlyUsed(next, cacheKey);
				if (lruKey) {
					next.delete(lruKey);
					console.log(`[ArchbaseAliveAbleRoutes] LRU eviction: removed "${lruKey}" (cache size: ${next.size}/${maxKeepAliveTabs})`);
				}
			}

			next.set(cacheKey, {
				element: component,
				params,
				lastAccessedAt: Date.now()
			});

			return next;
		});
	}, [maxKeepAliveTabs, findLeastRecentlyUsed]);

	// Atualiza o timestamp de acesso quando uma aba fica ativa
	const touchAccess = useCallback((cacheKey: string) => {
		setCache((prev) => {
			const cached = prev.get(cacheKey);
			if (!cached) return prev;

			// Threshold de 1s para evitar updates excessivos
			const now = Date.now();
			if (now - cached.lastAccessedAt < 1000) return prev;

			const next = new Map(prev);
			next.set(cacheKey, { ...cached, lastAccessedAt: now });
			return next;
		});
	}, []);

	// Atualiza os parâmetros de um componente no cache
	const updateParams = useCallback((cacheKey: string, params: Params<string>) => {
		setCache((prev) => {
			const cached = prev.get(cacheKey);
			if (!cached) {
				return prev;
			}
			// Verifica se os parâmetros realmente mudaram
			const paramsChanged = JSON.stringify(cached.params) !== JSON.stringify(params);
			if (!paramsChanged) {
				return prev;
			}
			const next = new Map(prev);
			next.set(cacheKey, { ...cached, params, lastAccessedAt: Date.now() });
			return next;
		});
	}, []);

	// Remove um componente do cache
	const unregister = useCallback((cacheKey: string) => {
		if (!cacheKey) {
			console.error('[ArchbaseAliveAbleRoutes] Cannot unregister: invalid cacheKey');
			return;
		}
		setCache((prev) => {
			if (!prev.has(cacheKey)) {
				console.warn('[ArchbaseAliveAbleRoutes] Attempting to unregister non-existent cacheKey:', cacheKey);
			}
			const next = new Map(prev);
			next.delete(cacheKey);
			return next;
		});
		setRequestedUnregister((prev) => {
			const next = new Set(prev);
			next.delete(cacheKey);
			return next;
		});
	}, []);

	// Solicita remoção (chamado pelo TabContainer ao fechar aba)
	// Nota: O TabContainer usa a URL real como identificador da aba
	const requestUnregister = useCallback((path: string) => {
		setRequestedUnregister((prev) => {
			const next = new Set(prev);
			next.add(path);
			return next;
		});
	}, []);

	// Separar rotas keepAlive das rotas normais
	const routes = React.Children.toArray(children);
	const keepAliveRoutes = routes.filter((route) => {
		if (!React.isValidElement(route)) return false;
		return route.type === ArchbaseKeepAliveRoute;
	}) as ReactElement[];

	const normalRoutes = routes.filter((route) => {
		if (!React.isValidElement(route)) return false;
		return route.type !== ArchbaseKeepAliveRoute;
	}) as ReactElement[];

	const contextValue: KeepAliveCacheContextValue = useMemo(() => ({
		cache,
		requestedUnregister,
		register,
		unregister,
		updateParams,
		requestUnregister,
		touchAccess,
		maxKeepAliveTabs
	}), [cache, requestedUnregister, register, unregister, updateParams, requestUnregister, touchAccess, maxKeepAliveTabs]);

	return (
		<KeepAliveCacheContext.Provider value={contextValue}>
			{keepAliveRoutes.map((route) => {
				return <DisplayRoute key={route.key} {...(route.props as ArchbaseKeepAliveRouteProps)} routesProps={props} />;
			})}
			<Routes {...props}>{normalRoutes}</Routes>
		</KeepAliveCacheContext.Provider>
	);
};

// ============================================================================
// DISPLAY ROUTE - GERENCIA A EXIBIÇÃO DA VIEW
// ============================================================================

type DisplayRouteProps = ArchbaseKeepAliveRouteProps & {
	routesProps: RoutesProps;
};

const DisplayRoute = ({ component, routesProps, ...props }: DisplayRouteProps) => {
	const contextValue = useKeepAliveCache();
	if (!contextValue) {
		throw new Error('DisplayRoute must be used within ArchbaseAliveAbleRoutes provider');
	}
	const { cache, requestedUnregister, register, unregister, updateParams, touchAccess } = contextValue;
	const [isActive, setIsActive] = useState(false);
	const [currentParams, setCurrentParams] = useState<Params<string>>({});
	const containerRef = useRef<HTMLDivElement>(null);
	const location = useLocation();

	// Calcula a chave de cache baseada no path e URL atual
	const cacheKey = useMemo(() => {
		if (!props.path) return null;
		return getCacheKey(props.path, location.pathname);
	}, [props.path, location.pathname]);

	// Extrai os parâmetros da URL atual
	const extractedParams = useMemo(() => {
		if (!props.path) return {};
		const match = matchPath({ path: props.path, end: true }, location.pathname);
		return match?.params || {};
	}, [props.path, location.pathname]);

	// Ref para rastrear se este cacheKey específico já foi inicializado
	const initializedCacheKeysRef = useRef<Set<string>>(new Set());

	// Lazy loading: criar componente apenas quando a rota fica ativa pela primeira vez
	useLayoutEffect(() => {
		if (isActive && component && cacheKey && !initializedCacheKeysRef.current.has(cacheKey)) {
			const element = typeof component === 'function'
				? React.createElement(component as React.ComponentType)
				: component;
			register(cacheKey, element, extractedParams);
			initializedCacheKeysRef.current.add(cacheKey);
		}
	}, [isActive, component, cacheKey, register, extractedParams]);

	// Atualiza os parâmetros quando a URL muda (para a mesma rota)
	useLayoutEffect(() => {
		if (isActive && cacheKey && initializedCacheKeysRef.current.has(cacheKey)) {
			updateParams(cacheKey, extractedParams);
			setCurrentParams(extractedParams);
		}
	}, [isActive, cacheKey, extractedParams, updateParams]);

	// LRU: Atualiza o timestamp de acesso quando a rota fica ativa
	useEffect(() => {
		if (isActive && cacheKey && cache.has(cacheKey)) {
			touchAccess(cacheKey);
		}
	}, [isActive, cacheKey, touchAccess, cache]);

	// Verificar se foi solicitada a remoção do cache
	// O TabContainer usa a URL real como identificador, então verificamos com a URL
	useLayoutEffect(() => {
		if (cacheKey && requestedUnregister.has(cacheKey)) {
			unregister(cacheKey);
			initializedCacheKeysRef.current.delete(cacheKey);
		}
	}, [cacheKey, requestedUnregister, unregister]);

	// Obter o componente do cache
	const cachedData = cacheKey ? cache.get(cacheKey) : null;

	// Parâmetros a serem fornecidos via contexto
	const paramsForContext = useMemo(() => {
		// Se está ativo, usa os parâmetros extraídos da URL atual
		if (isActive) {
			return extractedParams;
		}
		// Se não está ativo mas tem dados em cache, usa os parâmetros do cache
		if (cachedData) {
			return cachedData.params;
		}
		return currentParams;
	}, [isActive, extractedParams, cachedData, currentParams]);

	// Ref para rastrear o estado anterior de isActive
	const prevIsActiveRef = useRef(isActive);

	// Dispara evento de resize quando tab fica visível
	// Isso força componentes como grids e gráficos a recalcular suas dimensões
	useEffect(() => {
		const wasActive = prevIsActiveRef.current;
		prevIsActiveRef.current = isActive;

		// Só dispara quando a tab VOLTA a ficar ativa (de false para true)
		if (isActive && !wasActive && containerRef.current) {
			// Pequeno delay para garantir que o CSS foi aplicado
			const timeoutId = setTimeout(() => {
				// Dispara resize para componentes que escutam window.resize
				window.dispatchEvent(new Event('resize'));

				// Dispara evento customizado no container para componentes específicos
				containerRef.current?.dispatchEvent(
					new CustomEvent('keepalive:visible', { bubbles: true })
				);
			}, 50);

			return () => clearTimeout(timeoutId);
		}
	}, [isActive]);

	return (
		<>
			{cachedData && (
				<KeepAliveVisibilityContext.Provider value={{ isVisible: isActive }}>
					<ArchbaseRouteParamsContext.Provider value={{ params: paramsForContext }}>
						<div
							ref={containerRef}
							style={{
								// Usa visibility + position ao invés de display:none
								// para manter dimensões e permitir que ResizeObserver funcione
								position: isActive ? 'relative' : 'absolute',
								visibility: isActive ? 'visible' : 'hidden',
								pointerEvents: isActive ? 'auto' : 'none',
								width: '100%',
								height: '100%',
								top: isActive ? undefined : 0,
								left: isActive ? undefined : 0,
								zIndex: isActive ? 1 : -1,
								overflow: isActive ? 'auto' : 'hidden'
							}}
						>
							{cachedData.element}
						</div>
					</ArchbaseRouteParamsContext.Provider>
				</KeepAliveVisibilityContext.Provider>
			)}

			<Routes {...routesProps}>
				<Route
					{...(props as any)}
					element={
						<RouteMatchInformant
							onRouteMatchChange={setIsActive}
							onParamsChange={setCurrentParams}
						/>
					}
				/>
			</Routes>
		</>
	);
};

// ============================================================================
// ROUTE MATCH INFORMANT - DETECTA QUANDO A ROTA FICA ATIVA E CAPTURA PARAMS
// ============================================================================

interface RouteMatchInformantProps {
	onRouteMatchChange: (matches: boolean) => void;
	onParamsChange: (params: Params<string>) => void;
}

const RouteMatchInformant = ({ onRouteMatchChange, onParamsChange }: RouteMatchInformantProps) => {
	const location = useLocation();

	useLayoutEffect(() => {
		onRouteMatchChange(true);
		return () => {
			onRouteMatchChange(false);
		};
	}, [onRouteMatchChange]);

	// Notifica sobre mudanças na URL (que podem significar mudanças nos params)
	useLayoutEffect(() => {
		// Os params são extraídos no DisplayRoute usando matchPath
		// Aqui apenas notificamos que a localização mudou
	}, [location.pathname, onParamsChange]);

	return null;
};
