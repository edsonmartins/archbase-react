import React, { Activity, ReactElement, useLayoutEffect, useState } from 'react';
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

	return (
		<>
			<Activity mode={isActive ? 'visible' : 'hidden'}>
				{element}
			</Activity>

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
