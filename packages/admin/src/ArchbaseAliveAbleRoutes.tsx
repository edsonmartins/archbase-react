import React, { createContext, useContext, ReactElement, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { RouteProps, RoutesProps } from 'react-router';
import { Route, Routes } from 'react-router-dom';

// ============================================================================
// CONTEXTO PARA GERENCIAR CACHE DE VIEWS (LAZY LOADING)
// ============================================================================

interface KeepAliveCacheContextValue {
	cache: Map<string, ReactNode>;
	register: (path: string, component: ReactNode) => void;
	unregister: (path: string) => void;
	activePaths: Set<string>;
	setActive: (path: string, active: boolean) => void;
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
	const [activePaths, setActivePaths] = useState<Set<string>>(new Set());

	// Registra um componente no cache (lazy loading)
	const register = (path: string, component: ReactNode) => {
		setCache((prev) => {
			const next = new Map(prev);
			if (!next.has(path)) {
				next.set(path, component);
			}
			return next;
		});
	};

	// Remove um componente do cache (quando aba é fechada)
	const unregister = (path: string) => {
		setCache((prev) => {
			const next = new Map(prev);
			next.delete(path);
			return next;
		});
		setActivePaths((prev) => {
			const next = new Set(prev);
			next.delete(path);
			return next;
		});
	};

	// Marca uma rota como ativa ou inativa
	const setActive = (path: string, active: boolean) => {
		setActivePaths((prev) => {
			const next = new Set(prev);
			if (active) {
				next.add(path);
			} else {
				next.delete(path);
			}
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
		register,
		unregister,
		activePaths,
		setActive
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
	const { cache, register, unregister, activePaths, setActive } = useKeepAliveCache()!;
	const [isActive, setIsActive] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Lazy loading: criar componente apenas quando a rota fica ativa pela primeira vez
	useLayoutEffect(() => {
		if (isActive && component && props.path) {
			// Se component é uma função, instanciar; caso contrário, usar diretamente
			const element = typeof component === 'function'
				? React.createElement(component as React.ComponentType)
				: component;
			register(props.path, element);
		}
		return () => {
			// Cleanup: remover do cache se a rota não está mais ativa
			if (props.path && !activePaths.has(props.path)) {
				unregister(props.path);
			}
		};
	}, [isActive, component, props.path, register, unregister, activePaths]);

	// Sincronizar isActive com o estado global
	useEffect(() => {
		if (props.path) {
			setActive(props.path, isActive);
		}
	}, [isActive, props.path, setActive]);

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
