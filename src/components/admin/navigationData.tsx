import React from 'react';
import {
  IconDashboard,
  IconFilePlus,
  IconHome2,
  IconListSearch,
  IconNews,
  IconSettings,
  IconUserPlus,
  IconUsers,
} from '@tabler/icons-react';

import { ArchbaseNavigationItem } from './types';
import { PessoaForm } from '../../demo/view/PessoaForm';
import { PessoaView } from '../../demo/view/PessoaView';
import { PedidoView } from '../../demo/view/PedidoView';
import { PedidoForm } from '../../demo/view/PedidoForm';
import { HomeView } from '../../demo/view/HomeView';

const dashBoardView: ArchbaseNavigationItem = {
  label: 'Dashboard',
  icon: <IconDashboard />,
  link: '/dashboard',
  category: 'DASHBOARD',
  color: 'teal',
  component: <div></div>,
  showInSidebar: true,
};

const homeView: ArchbaseNavigationItem = {
  label: 'Home',
  icon: <IconHome2 />,
  link: '/home',
  category: 'HOME',
  color: 'teal',
  component: <HomeView />,
  showInSidebar: true,
};

const pessoaConsultaView: ArchbaseNavigationItem = {
  label: 'Consulta lista pessoas',
  link: '/pessoa/consulta',
  icon: <IconListSearch />,
  category: 'PESSOAS',
  color: 'pink',
  component: <PessoaView />,
  showInSidebar: true,
};

const pessoaNovaView: ArchbaseNavigationItem = {
  label: 'Nova pessoa',
  link: '/pessoa/nova',
  icon: <IconUserPlus />,
  category: 'PESSOAS',
  color: 'pink',
  component: <PessoaForm />,
  showInSidebar: true,
};

const pessoasMenu: ArchbaseNavigationItem = {
  label: 'Pessoas',
  icon: <IconUsers />,
  links: [pessoaConsultaView, pessoaNovaView],
  category: 'PESSOAS',
  color: 'pink',
  showInSidebar: true,
};

const pedidoConsultaView: ArchbaseNavigationItem = {
  label: 'Consulta lista pedidos',
  link: '/pedido/consulta',
  icon: <IconListSearch />,
  category: 'PEDIDOS',
  color: 'yellow',
  component: <PedidoView />,
  showInSidebar: true,
};

const pedidoNovoView: ArchbaseNavigationItem = {
  label: 'Novo pedido',
  link: '/pedido/novo',
  icon: <IconFilePlus />,
  category: 'PEDIDOS',
  color: 'yellow',
  component: <PedidoForm />,
  showInSidebar: true,
};

const pedidosMenu: ArchbaseNavigationItem = {
  label: 'Pedidos',
  icon: <IconNews />,
  links: [pedidoConsultaView, pedidoNovoView],
  category: 'PEDIDOS',
  color: 'yellow',
  showInSidebar: true,
};

const configuracoesView: ArchbaseNavigationItem = {
  label: 'Configurações',
  link: '/config',
  icon: <IconSettings />,
  category: 'CONFIGURAÇÕES',
  color: 'lime',
  component: <div></div>,
  showInSidebar: true,
};

export const navigationDataSample: ArchbaseNavigationItem[] = [
  homeView,
  dashBoardView,
  pessoasMenu,
  pedidosMenu,
  configuracoesView,
];
