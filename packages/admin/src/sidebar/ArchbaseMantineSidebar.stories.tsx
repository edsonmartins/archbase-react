import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, MantineProvider, SegmentedControl, Stack, Text, Group, Switch } from '@mantine/core';
import {
	IconHome,
	IconUsers,
	IconSettings,
	IconShoppingCart,
	IconChartBar,
	IconFileText,
	IconBuildingStore,
	IconPackage,
	IconTruck,
	IconCreditCard,
} from '@tabler/icons-react';
import { ArchbaseMantineSidebar } from './ArchbaseMantineSidebar';
import { SidebarVariant } from './types';
import { ArchbaseNavigationItem, ArchbaseNavigationGroup } from '../types';

// Grupos de exemplo
const grupoVendas: ArchbaseNavigationGroup = {
	name: 'vendas',
	label: 'Vendas',
	icon: <IconShoppingCart size={24} />,
	hint: 'Módulo de vendas',
	indexOrder: 1,
};

const grupoCadastros: ArchbaseNavigationGroup = {
	name: 'cadastros',
	label: 'Cadastros',
	icon: <IconFileText size={24} />,
	hint: 'Cadastros básicos',
	indexOrder: 2,
};

const grupoRelatorios: ArchbaseNavigationGroup = {
	name: 'relatorios',
	label: 'Relatórios',
	icon: <IconChartBar size={24} />,
	hint: 'Relatórios e análises',
	indexOrder: 3,
};

// Dados de navegação de exemplo
const navigationData: ArchbaseNavigationItem[] = [
	{
		label: 'Dashboard',
		icon: <IconHome size={20} />,
		link: '/dashboard',
		showInSidebar: true,
		group: grupoVendas,
	},
	{
		label: 'Pedidos',
		icon: <IconShoppingCart size={20} />,
		link: '/pedidos',
		showInSidebar: true,
		group: grupoVendas,
	},
	{
		label: 'Clientes',
		icon: <IconUsers size={20} />,
		showInSidebar: true,
		group: grupoCadastros,
		links: [
			{ label: 'Lista de Clientes', link: '/clientes', showInSidebar: true },
			{ label: 'Novo Cliente', link: '/clientes/novo', showInSidebar: true },
			{ label: 'Importar', link: '/clientes/importar', showInSidebar: true },
		],
	},
	{
		label: 'Produtos',
		icon: <IconPackage size={20} />,
		showInSidebar: true,
		group: grupoCadastros,
		links: [
			{ label: 'Catálogo', link: '/produtos', showInSidebar: true },
			{ label: 'Categorias', link: '/produtos/categorias', showInSidebar: true },
			{ label: 'Estoque', link: '/produtos/estoque', showInSidebar: true },
		],
	},
	{
		label: 'Fornecedores',
		icon: <IconBuildingStore size={20} />,
		link: '/fornecedores',
		showInSidebar: true,
		group: grupoCadastros,
	},
	{
		label: 'Entregas',
		icon: <IconTruck size={20} />,
		link: '/entregas',
		showInSidebar: true,
		group: grupoVendas,
	},
	{
		label: 'Financeiro',
		icon: <IconCreditCard size={20} />,
		showInSidebar: true,
		group: grupoRelatorios,
		links: [
			{ label: 'Contas a Receber', link: '/financeiro/receber', showInSidebar: true },
			{ label: 'Contas a Pagar', link: '/financeiro/pagar', showInSidebar: true },
			{ label: 'Fluxo de Caixa', link: '/financeiro/fluxo', showInSidebar: true },
		],
	},
	{
		label: 'Relatórios',
		icon: <IconChartBar size={20} />,
		showInSidebar: true,
		group: grupoRelatorios,
		links: [
			{ label: 'Vendas por Período', link: '/relatorios/vendas', showInSidebar: true },
			{ label: 'Produtos mais Vendidos', link: '/relatorios/produtos', showInSidebar: true },
			{ label: 'Clientes Ativos', link: '/relatorios/clientes', showInSidebar: true },
		],
	},
	{
		label: 'Configurações',
		icon: <IconSettings size={20} />,
		link: '/configuracoes',
		showInSidebar: true,
		group: grupoRelatorios,
	},
];

const meta: Meta<typeof ArchbaseMantineSidebar> = {
	title: 'Admin/ArchbaseMantineSidebar',
	component: ArchbaseMantineSidebar,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ArchbaseMantineSidebar>;

/**
 * Story interativa que permite alternar entre as variantes
 */
export const VariantSelector: Story = {
	render: () => {
		const [variant, setVariant] = useState<SidebarVariant>('rail');
		const [collapsed, setCollapsed] = useState(false);
		const [showSearch, setShowSearch] = useState(false);

		return (
			<Box style={{ display: 'flex', height: '100vh' }}>
				<ArchbaseMantineSidebar
					navigationData={navigationData}
					variant={variant}
					width={280}
					collapsedWidth={60}
					height="100%"
					collapsed={collapsed}
					onCollapsedChange={setCollapsed}
					showSearch={showSearch}
					backgroundLightColor="#3B5998"
					backgroundDarkColor="#3B5998"
					textLightColor="white"
					textDarkColor="white"
					iconLightColor="white"
					iconDarkColor="white"
					activeColor="blue"
					header={
						<Box p="md" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
							<Text c="white" fw={700} size="lg">
								{collapsed ? 'A' : 'Archbase'}
							</Text>
						</Box>
					}
					footer={
						<Box p="md" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
							<Text c="white" size="sm">
								{collapsed ? 'v3' : 'Versão 3.0.15'}
							</Text>
						</Box>
					}
				/>
				<Box p="xl" style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
					<Stack gap="md">
						<Text size="xl" fw={700}>Configurações da Sidebar</Text>

						<Group>
							<Text>Variante:</Text>
							<SegmentedControl
								value={variant}
								onChange={(value) => setVariant(value as SidebarVariant)}
								data={[
									{ label: 'Standard', value: 'standard' },
									{ label: 'Minimal', value: 'minimal' },
									{ label: 'Rail', value: 'rail' },
								]}
							/>
						</Group>

						<Group>
							<Switch
								label="Colapsado"
								checked={collapsed}
								onChange={(e) => setCollapsed(e.currentTarget.checked)}
							/>
							<Switch
								label="Mostrar Busca"
								checked={showSearch}
								onChange={(e) => setShowSearch(e.currentTarget.checked)}
							/>
						</Group>

						<Box mt="xl">
							<Text size="lg" fw={600} mb="md">Descrição das Variantes:</Text>
							<Stack gap="sm">
								<Box p="md" style={{ backgroundColor: 'white', borderRadius: 8 }}>
									<Text fw={600}>Standard</Text>
									<Text size="sm" c="dimmed">
										Menu accordion tradicional com subitems aninhados. Inspiração: Notion, Slack.
									</Text>
								</Box>
								<Box p="md" style={{ backgroundColor: 'white', borderRadius: 8 }}>
									<Text fw={600}>Minimal</Text>
									<Text size="sm" c="dimmed">
										Apenas ícones com tooltips. Subitems aparecem em menus flutuantes. Inspiração: VSCode, Outlook.
									</Text>
								</Box>
								<Box p="md" style={{ backgroundColor: 'white', borderRadius: 8 }}>
									<Text fw={600}>Rail</Text>
									<Text size="sm" c="dimmed">
										Painel duplo com coluna de grupos à esquerda. Inspiração: Discord, Supabase.
									</Text>
								</Box>
							</Stack>
						</Box>
					</Stack>
				</Box>
			</Box>
		);
	},
};

/**
 * Variante Standard - Menu accordion tradicional
 */
export const Standard: Story = {
	args: {
		navigationData,
		variant: 'standard',
		width: 280,
		collapsedWidth: 60,
		height: '600px',
		backgroundLightColor: '#1a1b1e',
		backgroundDarkColor: '#1a1b1e',
		textLightColor: '#c1c2c5',
		textDarkColor: '#c1c2c5',
		activeColor: 'blue',
		showSearch: true,
	},
};

/**
 * Variante Minimal - Apenas ícones
 */
export const Minimal: Story = {
	args: {
		navigationData,
		variant: 'minimal',
		width: 60,
		collapsedWidth: 60,
		height: '600px',
		backgroundLightColor: '#25262b',
		backgroundDarkColor: '#25262b',
		iconLightColor: '#c1c2c5',
		iconDarkColor: '#c1c2c5',
		activeColor: 'violet',
	},
};

/**
 * Variante Rail - Painel duplo com grupos
 */
export const Rail: Story = {
	args: {
		navigationData,
		variant: 'rail',
		width: 280,
		collapsedWidth: 60,
		groupColumnWidth: 60,
		height: '600px',
		backgroundLightColor: '#3B5998',
		backgroundDarkColor: '#3B5998',
		textLightColor: 'white',
		textDarkColor: 'white',
		iconLightColor: 'white',
		iconDarkColor: 'white',
		activeColor: 'blue',
		groupBackgroundColor: '#2d4373',
		selectedGroupColor: '#4a69a8',
		groupColor: 'white',
	},
};

/**
 * Com estado de carregamento
 */
export const Loading: Story = {
	args: {
		navigationData: [],
		variant: 'standard',
		width: 280,
		height: '600px',
		isLoading: true,
		backgroundLightColor: '#1a1b1e',
		backgroundDarkColor: '#1a1b1e',
	},
};

/**
 * Com mensagem de erro
 */
export const WithError: Story = {
	args: {
		navigationData: [],
		variant: 'standard',
		width: 280,
		height: '600px',
		loadingError: 'Falha ao carregar menu. Tente novamente.',
		backgroundLightColor: '#1a1b1e',
		backgroundDarkColor: '#1a1b1e',
	},
};
