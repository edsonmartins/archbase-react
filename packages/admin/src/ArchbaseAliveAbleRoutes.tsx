import React, { ReactElement, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { RouteProps, RoutesProps } from 'react-router';
import { Route, Routes } from 'react-router-dom';

export const ArchbaseKeepAliveRoute = (props: RouteProps) => null;

export const ArchbaseAliveAbleRoutes = ({ children, ...props }: RoutesProps) => {
	const routes = React.Children.toArray(children);

	const keepAliveRoutes = routes.filter((route) => {
		if (!React.isValidElement(route)) return false;
		return route.type === ArchbaseKeepAliveRoute;
	}) as ReactElement[];

	const normalRoutes = routes.filter((route) => {
		if (!React.isValidElement(route)) return false;
		return route.type !== ArchbaseKeepAliveRoute;
	}) as ReactElement[];

	return (
		<>
			{keepAliveRoutes.map((route) => {
				return <DisplayRoute key={route.key} {...(route.props as any)} routesProps={props} />;
			})}
			<Routes {...props}>{normalRoutes}</Routes>
		</>
	);
};

type DisplayRouteProps = RouteProps & {
	routesProps: RoutesProps;
};

const DisplayRoute = ({ element, routesProps, ...props }: DisplayRouteProps) => {
	const [isActive, setIsActive] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Quando não está ativo, pausar timers e animações
	useEffect(() => {
		if (!isActive && containerRef.current) {
			// Pausar todos os vídeos e iframes
			const mediaElements = containerRef.current.querySelectorAll('video, iframe, audio');
			mediaElements.forEach((el) => {
				if (el instanceof HTMLMediaElement) {
					el.pause();
				}
			});
		}
	}, [isActive]);

	return (
		<>
			<div
				ref={containerRef}
				style={{
					display: isActive ? 'block' : 'none',
					height: isActive ? '100%' : '0',
					overflow: isActive ? 'auto' : 'hidden'
				}}
			>
				{element}
			</div>

			<Routes {...routesProps}>
				<Route {...(props as any)} element={<RouteMatchInformant onRouteMatchChange={setIsActive} />} />
			</Routes>
		</>
	);
};

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
