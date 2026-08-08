/**
 * Panorama — o estado da segurança do tenant.
 *
 * <p>A ordem da tela é uma afirmação: as <b>proteções</b> vêm antes das contagens. Um número
 * alto de permissões não diz nada quando o portão correspondente está desligado, e essa é
 * exatamente a leitura que a auditoria mostrou faltar.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Loader, Stack, Text } from '@mantine/core';
import { ARCHBASE_IOC_API_TYPE, processErrorMessage } from '@archbase/core';
import { useArchbaseRemoteServiceApi } from '@archbase/data';
import type { ArchbaseAccessOverview, ArchbaseSecurityDiagnosticsService } from '@archbase/security';
import { FlagStrip, MetricCards, Section } from './DiagnosticPrimitives';
import { OverviewItemsDrawer } from './OverviewItemsDrawer';
import type { ArchbaseDiagnosticCard, ArchbaseDiagnosticFlag, ArchbaseSecurityDiagnosticsSlots } from './types';

export interface OverviewPanelProps {
	slots?: ArchbaseSecurityDiagnosticsSlots;
	onError?: (message: string) => void;
}

const percent = (part: number, whole: number): string => (whole > 0 ? ` · ${Math.round((part / whole) * 100)}%` : '');

/** As proteções configuráveis, traduzidas para "ligado / desligado" e o que isso custa. */
const buildFlags = (overview: ArchbaseAccessOverview): ArchbaseDiagnosticFlag[] => {
	const flags = overview.flags;
	return [
		{
			key: 'archbase.security.access.require-active',
			label: 'Filtro de ativo',
			value: flags.requireActive ? 'Ligado' : 'Desligado',
			severity: flags.requireActive ? 'ok' : 'critical',
			description: flags.requireActive
				? 'Permissão para ação inativa não decide.'
				: 'Permissão para ação inativa ainda decide.',
		},
		{
			key: 'archbase.security.admin-endpoints.policy',
			label: 'Endpoints administrativos',
			value: flags.adminEndpointsPolicy,
			severity: flags.adminEndpointsPolicy === 'permit' ? 'critical' : 'ok',
			description:
				flags.adminEndpointsPolicy === 'permit'
					? 'permit = qualquer autenticado administra segurança.'
					: 'Restrito.',
		},
		{
			key: 'ArchbaseRoleResolver',
			label: 'Resolver de papel',
			value: flags.roleResolverRegistered ? 'Registrado' : 'Ausente',
			severity: flags.roleResolverRegistered ? 'ok' : 'warning',
			description: flags.roleResolverRegistered
				? '@RequireRole é avaliado.'
				: '@RequireRole não restringe nada sem ele.',
		},
		{
			key: 'scan',
			label: 'Varredura de capacidades',
			value: flags.scanConfigured ? 'Configurada' : 'Não configurada',
			severity: flags.scanConfigured ? 'ok' : 'warning',
			description: flags.scanConfigured
				? 'O catálogo se alimenta do código.'
				: 'O catálogo não se alimenta do código.',
		},
	];
};

const buildCards = (overview: ArchbaseAccessOverview): ArchbaseDiagnosticCard[] => [
	{
		severity: 'critical',
		value: overview.permissionsPointingToInactive,
		metric: 'PERMISSIONS_POINTING_TO_INACTIVE',
		of: `de ${overview.permissions}${percent(overview.permissionsPointingToInactive, overview.permissions)}`,
		label: 'Permissões inertes',
		description: 'Apontam para ação ou recurso inativo. É o acesso que o operador acredita ter concedido.',
	},
	{
		severity: 'warning',
		value: overview.administrators,
		metric: 'ADMINISTRATORS',
		of: `de ${overview.users} usuários`,
		label: 'Administradores',
		description: 'Passam direto pelo portão GRANT. Nada configurado nesta tela se aplica a eles.',
	},
	{
		severity: 'warning',
		value: overview.actionsInactive,
		metric: 'ACTIONS_INACTIVE',
		of: `de ${overview.actions} ações`,
		label: 'Ações inativas',
		description: 'Capacidades do catálogo que não valem. São a origem das permissões inertes.',
	},
	{
		severity: 'warning',
		value: overview.apiResourcesInactive,
		metric: 'API_RESOURCES_INACTIVE',
		of: `de ${overview.apiResources} recursos API`,
		label: 'Recursos API desativados',
		description: 'Desativados pela varredura por não terem @HasPermission correspondente.',
	},
	{
		severity: 'neutral',
		value: overview.resourcesWithoutAction,
		metric: 'RESOURCES_WITHOUT_ACTION',
		of: `de ${overview.resources} recursos`,
		label: 'Recursos sem ação',
		description: 'Telas ainda não abertas neste tenant. Indicador operacional, não alerta.',
	},
	{
		severity: 'warning',
		value: overview.actionsWithoutPermission,
		metric: 'ACTIONS_WITHOUT_PERMISSION',
		of: 'ações',
		label: 'Ninguém tem',
		description: 'Capacidade existe no catálogo e não foi concedida a ninguém.',
	},
];

export const OverviewPanel = ({ slots, onError }: OverviewPanelProps) => {
	const api = useArchbaseRemoteServiceApi<ArchbaseSecurityDiagnosticsService>(
		ARCHBASE_IOC_API_TYPE.SecurityDiagnostics,
	);
	const [overview, setOverview] = useState<ArchbaseAccessOverview | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | undefined>(undefined);
	// O cartão cuja lista está aberta. Null = painel fechado.
	const [cartaoAberto, setCartaoAberto] = useState<ArchbaseDiagnosticCard | null>(null);

	useEffect(() => {
		let vivo = true;
		setLoading(true);
		api
			.getOverview()
			.then((resultado) => {
				if (vivo) {
					setOverview(resultado);
					setError(undefined);
				}
			})
			.catch((erro) => {
				if (vivo) {
					const mensagem = processErrorMessage(erro);
					setError(mensagem);
					onError?.(mensagem);
				}
			})
			.finally(() => {
				if (vivo) {
					setLoading(false);
				}
			});
		return () => {
			vivo = false;
		};
	}, [api]);

	const flags = useMemo(
		() => (overview ? [...buildFlags(overview), ...(slots?.additionalFlags?.(overview) ?? [])] : []),
		[overview, slots],
	);
	const cards = useMemo(
		() => (overview ? [...buildCards(overview), ...(slots?.additionalOverviewCards?.(overview) ?? [])] : []),
		[overview, slots],
	);

	if (loading) {
		return <Loader size="sm" />;
	}
	if (error) {
		return (
			<Alert color="red" title="Não foi possível ler o diagnóstico">
				{error}
			</Alert>
		);
	}
	if (!overview) {
		return null;
	}

	return (
		<Stack gap="lg">
			<Section title="Proteções" hint="de AccessOverview.flags">
				<FlagStrip flags={flags} />
				<Text size="xs" c="dimmed" lh={1.45}>
					Todas nascem com o padrão compatível — ligadas só quando alguém decide.
				</Text>
			</Section>

			<Section title="Catálogo e concessões" hint="contagens vivas">
				<MetricCards cards={cards} onOpenCard={setCartaoAberto} />
			</Section>

			{slots?.afterOverview?.(overview)}

			<OverviewItemsDrawer card={cartaoAberto} onClose={() => setCartaoAberto(null)} />
		</Stack>
	);
};
