import React, { createContext, useContext, ReactElement, ReactNode, useLayoutEffect, useRef, useState } from 'react';
import type { RouteProps, RoutesProps } from 'react-router';
import { Route, Routes } from 'react-router-dom';

// ============================================================================
// CONTEXTO PARA GERENCIAR CACHE DE VIEWS (LAZY LOADING)
// ============================================================================

interface KeepAliveCacheContextValue {
	cache: Map<string, ReactNode>;
	requestedUnregister: Set<string>; // Set com paths que devem ser removidos
	register: (path: string, component: ReactNode) => void;
	unregister: (path: string) => void;
	requestUnregister: (path: string) => void; // Solicita remoção (quando aba fecha)
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
// COMPONENTE PRINCIPAL
// ============================================================================

export const ArchbaseAliveAbleRoutes = ({ children, ...props }: RoutesProps) => {
	const [cache, setCache] = useState<Map<string, ReactNode>>(new Map());
	const [requestedUnregister, setRequestedUnregister] = useState<Set<string>>(new Set());

	// Registra um componente no cache (lazy loading)
	const register = (path: string, component: ReactNode) => {
		if (!path || typeof path !== 'string') {
			console.error('[ArchbaseAliveAbleRoutes] Invalid path for component registration:', path);
			return;
		}
		if (component === undefined) {
			console.warn('[ArchbaseAliveAbleRoutes] Attempting to register undefined component for path:', path);
			return;
		}
		setCache((prev) => {
			// Só atualizar se realmente não existe no cache
			if (prev.has(path)) {
				return prev;
			}
			const next = new Map(prev);
			next.set(path, component);
			return next;
		});
	};

	// Remove um componente do cache (quando aba é fechada)
	const unregister = (path: string) => {
		if (!path) {
			console.error('[ArchbaseAliveAbleRoutes] Cannot unregister: invalid path');
			return;
		}
		setCache((prev) => {
			if (!prev.has(path)) {
				console.warn('[ArchbaseAliveAbleRoutes] Attempting to unregister non-existent path:', path);
			}
			const next = new Map(prev);
			next.delete(path);
			return next;
		});
		setRequestedUnregister((prev) => {
			const next = new Set(prev);
			next.delete(path);
			return next;
		});
	};

	// Solicita remoção (chamado pelo TabContainer ao fechar aba)
	const requestUnregister = (path: string) => {
		setRequestedUnregister((prev) => {
			const next = new Set(prev);
			next.add(path);
			return next;
		});
	};

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

	const contextValue: KeepAliveCacheContextValue = {
		cache,
		requestedUnregister,
		register,
		unregister,
		requestUnregister
	};

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
	const { cache, requestedUnregister, register, unregister } = contextValue;
	const [isActive, setIsActive] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const isInitializedRef = useRef(false);

	// Lazy loading: criar componente apenas quando a rota fica ativa pela primeira vez
	useLayoutEffect(() => {
		if (isActive && component && props.path && !isInitializedRef.current) {
			// Se component é uma função, instanciar; caso contrário, usar diretamente
			const element = typeof component === 'function'
				? React.createElement(component as React.ComponentType)
				: component;
			register(props.path, element);
			isInitializedRef.current = true;
		}
	}, [isActive, component, props.path, register]);

	// Verificar se foi solicitada a remoção do cache
	useLayoutEffect(() => {
		if (props.path && requestedUnregister.has(props.path)) {
			unregister(props.path);
			isInitializedRef.current = false;
		}
	}, [props.path, requestedUnregister, unregister]);

	// Obter o componente do cache
	const cachedElement = props.path ? cache.get(props.path) : null;

	return (
		<>
			{cachedElement && (
				<div
					ref={containerRef}
					style={{
						display: isActive ? 'block' : 'none',
						height: isActive ? '100%' : '0',
						overflow: isActive ? 'auto' : 'hidden'
					}}
				>
					{cachedElement}
				</div>
			)}

			<Routes {...routesProps}>
				<Route {...(props as any)} element={<RouteMatchInformant onRouteMatchChange={setIsActive} />} />
			</Routes>
		</>
	);
};

// ============================================================================
// ROUTE MATCH INFORMANT - DETECTA QUANDO A ROTA FICA ATIVA
// ============================================================================

interface RouteMatchInformantProps {
	onRouteMatchChange: (matches: boolean) => void;
}

const RouteMatchInformant = ({ onRouteMatchChange }: RouteMatchInformantProps) => {
	useLayoutEffect(() => {
		onRouteMatchChange(true);
		return () => {
			onRouteMatchChange(false);
		};
	}, [onRouteMatchChange]);

	return null;
};
