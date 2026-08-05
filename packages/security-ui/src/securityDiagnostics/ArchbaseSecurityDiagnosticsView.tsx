/**
 * ArchbaseSecurityDiagnosticsView — o <b>leitor</b> da segurança.
 *
 * <p>Deliberadamente separada da {@link ArchbaseSecurityView}, que é o <b>editor</b>: aquela
 * tem uma aba por tabela e serve para mudar o estado; esta responde perguntas e não escreve
 * nada. Misturá-las produziria uma tela com dois motivos para mudar.
 *
 * <p>Extensão pelo objeto {@code slots} — ver {@link ArchbaseSecurityDiagnosticsSlots} para a
 * regra dos três verbos ({@code before}/{@code after}, {@code additional}, {@code render}).
 *
 * @status experimental
 */
import React, { useState } from 'react';
import { Paper, Tabs } from '@mantine/core';
import { IconChartBar, IconListSearch, IconShieldSearch } from '@tabler/icons-react';
import { OverviewPanel } from './OverviewPanel';
import { EffectiveAccessPanel } from './EffectiveAccessPanel';
import { SimulationPanel } from './SimulationPanel';
import type { ArchbaseSecurityDiagnosticsViewProps } from './types';

const TODAS: Array<'overview' | 'effective' | 'simulate'> = ['overview', 'effective', 'simulate'];

export function ArchbaseSecurityDiagnosticsView({
	height = '100%',
	width = '100%',
	defaultTab = 'overview',
	tabs = TODAS,
	slots,
	onError,
}: ArchbaseSecurityDiagnosticsViewProps) {
	const [abaAtiva, setAbaAtiva] = useState<string | null>(defaultTab);

	const mostra = (aba: 'overview' | 'effective' | 'simulate') => tabs.includes(aba);

	return (
		<Paper style={{ height, width }} p="md" withBorder={false}>
			<Tabs value={abaAtiva} onChange={setAbaAtiva} variant="pills" keepMounted={false}>
				<Tabs.List mb="md">
					{mostra('overview') ? (
						<Tabs.Tab value="overview" leftSection={<IconChartBar size="1rem" />}>
							Panorama
						</Tabs.Tab>
					) : null}
					{mostra('effective') ? (
						<Tabs.Tab value="effective" leftSection={<IconListSearch size="1rem" />}>
							Efetivo do usuário
						</Tabs.Tab>
					) : null}
					{mostra('simulate') ? (
						<Tabs.Tab value="simulate" leftSection={<IconShieldSearch size="1rem" />}>
							Simular
						</Tabs.Tab>
					) : null}
				</Tabs.List>

				{mostra('overview') ? (
					<Tabs.Panel value="overview">
						<OverviewPanel slots={slots} onError={onError} />
					</Tabs.Panel>
				) : null}
				{mostra('effective') ? (
					<Tabs.Panel value="effective">
						<EffectiveAccessPanel slots={slots} onError={onError} />
					</Tabs.Panel>
				) : null}
				{mostra('simulate') ? (
					<Tabs.Panel value="simulate">
						<SimulationPanel slots={slots} onError={onError} />
					</Tabs.Panel>
				) : null}
			</Tabs>
		</Paper>
	);
}
