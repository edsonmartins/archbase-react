import React, { ReactElement, useState, useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { RoutesProps, RouteProps } from 'react-router';

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
        return (
          <DisplayRoute key={route.key} {...route.props} routesProps={props} />
        );
      })}
      <Routes {...props} children={normalRoutes} />
    </>
  );
};

type DisplayRouteProps = RouteProps & {
  routesProps: RoutesProps;
}

const DisplayRoute = ({
  element,
  routesProps,
  ...props
}: DisplayRouteProps) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <div style={{ display: show ? 'unset' : 'none' }}>{element}</div>

      <Routes {...routesProps}>
        <Route
          {...props}
          element={<RouteMatchInformant onRouteMatchChange={setShow} />}
        />
      </Routes>
    </>
  );
};

interface RouteMatchInformantProps {
  onRouteMatchChange: (matches: boolean) => void;
}

const RouteMatchInformant = ({
  onRouteMatchChange,
}: RouteMatchInformantProps) => {
  useLayoutEffect(() => {
    onRouteMatchChange(true);
    return () => {
      onRouteMatchChange(false);
    };
  }, [onRouteMatchChange]);

  return null;
};



