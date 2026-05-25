import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { TabStoreProvider } from './components/TabStoreProvider';

export interface StatefulRouteProps {
  path: string;
  element: React.ReactElement;
}

export interface ArchbaseStatefulRoutesProps {
  /** Lista de rotas a serem renderizadas com estado persistente */
  routes: StatefulRouteProps[];
  /** Elemento de fallback para rotas nao encontradas */
  fallback?: React.ReactNode;
  /**
   * Funcao para gerar ID unico da tab a partir do pathname e search.
   * Por padrao usa pathname + search.
   */
  getTabId?: (pathname: string, search: string) => string;
}

/**
 * Componente que renderiza rotas com estado persistente por tab.
 * Cada rota recebe um TabStoreProvider que gerencia seu estado local.
 * Quando o usuario troca de tab, o estado e salvo no TabRegistryStore.
 * Quando retorna a tab, o estado e restaurado automaticamente.
 */
export const ArchbaseStatefulRoutes: React.FC<ArchbaseStatefulRoutesProps> = ({
  routes,
  fallback,
  getTabId = (pathname, search) => pathname + search,
}) => {
  const location = useLocation();
  const tabId = getTabId(location.pathname, location.search);

  return (
    <TabStoreProvider tabId={tabId} key={tabId}>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        {fallback && <Route path="*" element={<>{fallback}</>} />}
      </Routes>
    </TabStoreProvider>
  );
};
