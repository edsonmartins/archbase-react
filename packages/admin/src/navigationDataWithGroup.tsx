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
} from '@tabler/icons-react';
import { IconUserCog } from '@tabler/icons-react';
import React from 'react';
import { ArchbaseNavigationGroup, ArchbaseNavigationItem } from './types';

// Demo components placeholder - replace with actual components
const HomeView = () => React.createElement('div', null, 'Home View');
const PedidoForm = () => React.createElement('div', null, 'Pedido Form');
const PedidoView = () => React.createElement('div', null, 'Pedido View');
const PessoaForm = () => React.createElement('div', null, 'Pessoa Form');
const PessoaView = () => React.createElement('div', null, 'Pessoa View');
const PapelView = () => React.createElement('div', null, 'Papel View');
const PapelForm = () => React.createElement('div', null, 'Papel Form');

const groupPessoas: ArchbaseNavigationGroup = {
	icon: <IconUsers size="2.2rem" color="#63B1FB" stroke={1} />,
	label: 'Pessoas',
	name: 'grpPessoas',
	hint: 'Pessoas',
	indexOrder: 1,
};

const groupVendas: ArchbaseNavigationGroup = {
	icon: <IconReportMoney size="2.2rem" color="#63B1FB" stroke={1} />,
	label: 'Vendas',
	name: 'grpVendas',
	hint: 'Vendas',
	indexOrder: 2,
};

const groupConfiguracoes: ArchbaseNavigationGroup = {
	icon: <IconSettings size="2.2rem" color="#63B1FB" stroke={1} />,
	label: 'Configurações',
	name: 'grpConfiguracoes',
	hint: 'Configurações',
	indexOrder: 3,
};

// const groupConfiguracoes1: ArchbaseNavigationGroup = {
// 	icon: <IconSettings size="2.2rem" color="#63B1FB" stroke={1} />,
// 	label: 'Configurações1',
// 	name: 'grpConfiguracoes1',
// 	hint: 'Configurações',
// 	indexOrder: 3,
// };

// const groupConfiguracoes2: ArchbaseNavigationGroup = {
// 	icon: <IconSettings size="2.2rem" color="#63B1FB" stroke={1} />,
// 	label: 'Configurações2',
// 	name: 'grpConfiguracoes2',
// 	hint: 'Configurações',
// 	indexOrder: 3,
// };

// const groupConfiguracoes3: ArchbaseNavigationGroup = {
// 	icon: <IconSettings size="2.2rem" color="#63B1FB" stroke={1} />,
// 	label: 'Configurações3',
// 	name: 'grpConfiguracoes3',
// 	hint: 'Configurações',
// 	indexOrder: 3,
// };

// const groupConfiguracoes4: ArchbaseNavigationGroup = {
// 	icon: <IconSettings size="2.2rem" color="#63B1FB" stroke={1} />,
// 	label: 'Configurações4',
// 	name: 'grpConfiguracoes4',
// 	hint: 'Configurações',
// 	indexOrder: 3,
// };

// const groupConfiguracoes5: ArchbaseNavigationGroup = {
// 	icon: <IconSettings size="2.2rem" color="#63B1FB" stroke={1} />,
// 	label: 'Configurações5',
// 	name: 'grpConfiguracoes5',
// 	hint: 'Configurações',
// 	indexOrder: 3,
// };

// const groupConfiguracoes6: ArchbaseNavigationGroup = {
// 	icon: <IconSettings size="2.2rem" color="#63B1FB" stroke={1} />,
// 	label: 'Configurações6',
// 	name: 'grpConfiguracoes6',
// 	hint: 'Configurações',
// 	indexOrder: 3,
// };

const dashBoardView: ArchbaseNavigationItem = {
	label: 'Dashboard',
	icon: <IconDashboard />,
	link: '/dashboard',
	category: 'DASHBOARD',
	color: 'teal',
	component: <div />,
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
	group: groupPessoas,
};

const pessoaNovaView: ArchbaseNavigationItem = {
	label: 'Nova pessoa',
	link: '/pessoa/nova',
	icon: <IconUserPlus />,
	category: 'PESSOAS',
	color: 'pink',
	component: <PessoaForm />,
	showInSidebar: true,
	group: groupPessoas,
};

const papelConsultaView: ArchbaseNavigationItem = {
	label: 'Consulta lista papéis',
	link: '/pessoapapel/consulta',
	icon: <IconListSearch />,
	category: 'PESSOAS',
	color: 'pink',
	component: <PapelView />,
	showInSidebar: true,
	group: groupPessoas,
};

const pessoasMenu: ArchbaseNavigationItem = {
	label: 'Pessoas',
	icon: <IconUsers />,
	links: [pessoaConsultaView, pessoaNovaView],
	category: 'PESSOAS',
	color: 'pink',
	showInSidebar: true,
	group: groupPessoas,
};

const papelNovoView: ArchbaseNavigationItem = {
	label: 'Novo papel da pessoa',
	link: '/pessoapapel/novo',
	icon: <IconUserCog />,
	category: 'PESSOAS',
	color: 'pink',
	component: <PapelForm />,
	showInSidebar: true,
	group: groupPessoas,
};

const papelMenu: ArchbaseNavigationItem = {
	label: 'Papéis',
	icon: <IconListSearch />,
	links: [papelConsultaView, papelNovoView],
	category: 'PESSOAS',
	color: 'pink',
	showInSidebar: true,
	group: groupPessoas,
};

const pedidoConsultaView: ArchbaseNavigationItem = {
	label: 'Consulta lista pedidos',
	link: '/pedido/consulta',
	icon: <IconListSearch />,
	category: 'PEDIDOS',
	color: 'yellow',
	component: <PedidoView />,
	showInSidebar: true,
	group: groupVendas,
};

const pedidoNovoView: ArchbaseNavigationItem = {
	label: 'Novo pedido',
	link: '/pedido/novo',
	icon: <IconFilePlus />,
	category: 'PEDIDOS',
	color: 'yellow',
	component: <PedidoForm />,
	showInSidebar: true,
	group: groupVendas,
};

const pedidosMenu: ArchbaseNavigationItem = {
	label: 'Pedidos',
	icon: <IconNews />,
	links: [pedidoConsultaView, pedidoNovoView],
	category: 'PEDIDOS',
	color: 'yellow',
	showInSidebar: true,
	group: groupVendas,
};

const configuracoesView: ArchbaseNavigationItem = {
	label: 'Configurações',
	link: '/config',
	icon: <IconSettings />,
	category: 'CONFIGURAÇÕES',
	color: 'lime',
	component: <div />,
	showInSidebar: true,
	group: groupConfiguracoes,
};

// const configuracoesView1: ArchbaseNavigationItem = {
// 	label: 'Configurações',
// 	link: '/config',
// 	icon: <IconSettings />,
// 	category: 'CONFIGURAÇÕES',
// 	color: 'lime',
// 	component: <div />,
// 	showInSidebar: true,
// 	group: groupConfiguracoes1,
// };

// const configuracoesView2: ArchbaseNavigationItem = {
// 	label: 'Configurações',
// 	link: '/config',
// 	icon: <IconSettings />,
// 	category: 'CONFIGURAÇÕES',
// 	color: 'lime',
// 	component: <div />,
// 	showInSidebar: true,
// 	group: groupConfiguracoes2,
// };

// const configuracoesView3: ArchbaseNavigationItem = {
// 	label: 'Configurações',
// 	link: '/config',
// 	icon: <IconSettings />,
// 	category: 'CONFIGURAÇÕES',
// 	color: 'lime',
// 	component: <div />,
// 	showInSidebar: true,
// 	group: groupConfiguracoes3,
// };

// const configuracoesView4: ArchbaseNavigationItem = {
// 	label: 'Configurações',
// 	link: '/config',
// 	icon: <IconSettings />,
// 	category: 'CONFIGURAÇÕES',
// 	color: 'lime',
// 	component: <div />,
// 	showInSidebar: true,
// 	group: groupConfiguracoes4,
// };

// const configuracoesView5: ArchbaseNavigationItem = {
// 	label: 'Configurações',
// 	link: '/config',
// 	icon: <IconSettings />,
// 	category: 'CONFIGURAÇÕES',
// 	color: 'lime',
// 	component: <div />,
// 	showInSidebar: true,
// 	group: groupConfiguracoes5,
// };

// const configuracoesView6: ArchbaseNavigationItem = {
// 	label: 'Configurações',
// 	link: '/config',
// 	icon: <IconSettings />,
// 	category: 'CONFIGURAÇÕES',
// 	color: 'lime',
// 	component: <div />,
// 	showInSidebar: true,
// 	group: groupConfiguracoes6,
// };

export const navigationDataSampleWithGroup: ArchbaseNavigationItem[] = [
	homeView,
	dashBoardView,
	pessoasMenu,
	papelMenu,
	pedidosMenu,
	configuracoesView,
	// configuracoesView1,
	// configuracoesView2,
	// configuracoesView3,
	// configuracoesView4,
	// configuracoesView5,
	// configuracoesView6,
];
