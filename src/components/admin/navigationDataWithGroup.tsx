import React from 'react'
import {
  IconDashboard,
  IconFilePlus,
  IconHome2,
  IconListSearch,
  IconNews,
  IconReportMoney,
  IconSettings,
  IconUserPlus,
  IconUsers,
} from '@tabler/icons-react'

import { ArchbaseNavigationGroup, ArchbaseNavigationItem } from './types'
import { PessoaForm } from '../../demo/view/PessoaForm'
import { PessoaView } from '../../demo/view/PessoaView'
import { PedidoView } from '../../demo/view/PedidoView'
import { PedidoForm } from '../../demo/view/PedidoForm'
import { HomeView } from '../../demo/view/HomeView'
import { IconUserCog } from '@tabler/icons-react'

const groupPessoas: ArchbaseNavigationGroup = {
  icon: <IconUsers size="2.2rem" color="#63B1FB" stroke={1} />,
  label: 'Pessoas',
  name: 'grpPessoas',
  hint: 'Pessoas',
  indexOrder: 1,
}

const groupVendas: ArchbaseNavigationGroup = {
  icon: <IconReportMoney size="2.2rem" color="#63B1FB" stroke={1} />,
  label: 'Vendas',
  name: 'grpVendas',
  hint: 'Vendas',
  indexOrder: 2,
}

const groupConfiguracoes: ArchbaseNavigationGroup = {
  icon: <IconSettings size="2.2rem" color="#63B1FB" stroke={1} />,
  label: 'Configurações',
  name: 'grpConfiguracoes',
  hint: 'Configurações',
  indexOrder: 3,
}

const dashBoardView: ArchbaseNavigationItem = {
  label: 'Dashboard',
  icon: <IconDashboard />,
  link: '/dashboard',
  category: 'DASHBOARD',
  color: 'teal',
  component: <div />,
  showInSidebar: true,
}

const homeView: ArchbaseNavigationItem = {
  label: 'Home',
  icon: <IconHome2 />,
  link: '/home',
  category: 'HOME',
  color: 'teal',
  component: <HomeView />,
  showInSidebar: true,
}

const pessoaConsultaView: ArchbaseNavigationItem = {
  label: 'Consulta lista pessoas',
  link: '/pessoa/consulta',
  icon: <IconListSearch />,
  category: 'PESSOAS',
  color: 'pink',
  component: <PessoaView />,
  showInSidebar: true,
  group: groupPessoas,
}

const pessoaNovaView: ArchbaseNavigationItem = {
  label: 'Nova pessoa',
  link: '/pessoa/nova',
  icon: <IconUserPlus />,
  category: 'PESSOAS',
  color: 'pink',
  component: <PessoaForm />,
  showInSidebar: true,
  group: groupPessoas,
}

const papelConsultaView: ArchbaseNavigationItem = {
  label: 'Consulta lista papéis',
  link: '/pessoapapel/consulta',
  icon: <IconListSearch />,
  category: 'PESSOAS',
  color: 'pink',
  component: <div />,
  showInSidebar: true,
  group: groupPessoas,
}

const pessoasMenu: ArchbaseNavigationItem = {
  label: 'Pessoas',
  icon: <IconUsers />,
  links: [pessoaConsultaView, pessoaNovaView],
  category: 'PESSOAS',
  color: 'pink',
  showInSidebar: true,
  group: groupPessoas,
}

const papelNovoView: ArchbaseNavigationItem = {
  label: 'Novo papel da pessoa',
  link: '/pessoapapel/novo',
  icon: <IconUserCog />,
  category: 'PESSOAS',
  color: 'pink',
  component: <div />,
  showInSidebar: true,
  group: groupPessoas,
}

const papelMenu: ArchbaseNavigationItem = {
  label: 'Papéis',
  icon: <IconListSearch />,
  links: [papelConsultaView, papelNovoView],
  category: 'PESSOAS',
  color: 'pink',
  showInSidebar: true,
  group: groupPessoas,
}

const pedidoConsultaView: ArchbaseNavigationItem = {
  label: 'Consulta lista pedidos',
  link: '/pedido/consulta',
  icon: <IconListSearch />,
  category: 'PEDIDOS',
  color: 'yellow',
  component: <PedidoView />,
  showInSidebar: true,
  group: groupVendas,
}

const pedidoNovoView: ArchbaseNavigationItem = {
  label: 'Novo pedido',
  link: '/pedido/novo',
  icon: <IconFilePlus />,
  category: 'PEDIDOS',
  color: 'yellow',
  component: <PedidoForm />,
  showInSidebar: true,
  group: groupVendas,
}

const pedidosMenu: ArchbaseNavigationItem = {
  label: 'Pedidos',
  icon: <IconNews />,
  links: [pedidoConsultaView, pedidoNovoView],
  category: 'PEDIDOS',
  color: 'yellow',
  showInSidebar: true,
  group: groupVendas,
}

const configuracoesView: ArchbaseNavigationItem = {
  label: 'Configurações',
  link: '/config',
  icon: <IconSettings />,
  category: 'CONFIGURAÇÕES',
  color: 'lime',
  component: <div />,
  showInSidebar: true,
  group: groupConfiguracoes,
}

export const navigationDataSampleWithGroup: ArchbaseNavigationItem[] = [
  homeView,
  dashBoardView,
  pessoasMenu,
  papelMenu,
  pedidosMenu,
  configuracoesView,
]
