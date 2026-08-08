/**
 * Peças de apresentação compartilhadas pelas três abas do diagnóstico.
 *
 * <p>Ficam aqui, e não dentro de cada painel, porque são o que garante que um cartão vindo
 * de {@code additionalOverviewCards} saia idêntico a um cartão do framework. É a coerência
 * visual que faz valer a pena a aplicação entregar dado em vez de JSX.
 */
import React, { type ReactNode } from 'react';
import { Badge, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import type {
	ArchbaseDiagnosticAttribute,
	ArchbaseDiagnosticCard,
	ArchbaseDiagnosticFlag,
	ArchbaseDiagnosticSeverity,
} from './types';

/** Cor semântica — separada do acento visual do tema, de propósito. */
export const severityColor = (severity: ArchbaseDiagnosticSeverity): string => {
	switch (severity) {
		case 'critical':
			return 'red';
		case 'warning':
			return 'orange';
		case 'ok':
			return 'green';
		default:
			return 'gray';
	}
};

export interface MetricCardProps {
	card: ArchbaseDiagnosticCard;
	/**
	 * Abre o detalhe do card. Ausente quando a métrica não tem lista por trás — e aí o cartão não
	 * fica clicável, para não prometer uma navegação que não existe.
	 */
	onOpen?: (card: ArchbaseDiagnosticCard) => void;
}

/** Cartão de métrica: valor grande, denominador, rótulo e o porquê importa. */
export const MetricCard = ({ card, onOpen }: MetricCardProps) => {
	const clicavel = Boolean(onOpen && card.metric);
	return (
	<Paper
		withBorder
		radius="md"
		p="sm"
		role={clicavel ? 'button' : undefined}
		tabIndex={clicavel ? 0 : undefined}
		aria-label={clicavel ? `Ver os itens de ${card.label}` : undefined}
		onClick={clicavel ? () => onOpen?.(card) : undefined}
		onKeyDown={
			clicavel
				? (event) => {
						// Teclado precisa alcançar o mesmo que o mouse: o cartão virou controle.
						if (event.key === 'Enter' || event.key === ' ') {
							event.preventDefault();
							onOpen?.(card);
						}
					}
				: undefined
		}
		style={{
			borderLeft: `3px solid var(--mantine-color-${severityColor(card.severity)}-6)`,
			cursor: clicavel ? 'pointer' : undefined,
		}}>
		<Stack gap={4}>
			<Group gap={8} align="baseline" wrap="wrap">
				<Text fw={600} size="1.7rem" lh={1.05} c={severityColor(card.severity)}>
					{card.value}
				</Text>
				{card.of ? (
					<Text size="xs" c="dimmed">
						{card.of}
					</Text>
				) : null}
			</Group>
			<Text size="sm" fw={550}>
				{card.label}
			</Text>
			{card.description ? (
				<Text size="xs" c="dimmed" lh={1.45}>
					{card.description}
				</Text>
			) : null}
		</Stack>
	</Paper>
	);
};

export interface MetricCardsProps {
	cards: ArchbaseDiagnosticCard[];
	onOpenCard?: (card: ArchbaseDiagnosticCard) => void;
}

export const MetricCards = ({ cards, onOpenCard }: MetricCardsProps) => (
	<SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="xs">
		{cards.map((card, index) => (
			<MetricCard key={`${card.label}-${index}`} card={card} onOpen={onOpenCard} />
		))}
	</SimpleGrid>
);

export interface FlagStripProps {
	flags: ArchbaseDiagnosticFlag[];
}

/**
 * Faixa de proteções.
 *
 * <p>Vem antes dos números na tela porque contagem alta de permissões não significa nada se o
 * portão correspondente está inerte — e essa é a pergunta que o operador não sabe fazer.
 */
export const FlagStrip = ({ flags }: FlagStripProps) => (
	<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xs">
		{flags.map((flag) => (
			<Paper key={flag.key} withBorder radius="md" p="sm">
				<Stack gap={3}>
					<Text size="10px" c="dimmed" ff="monospace" style={{ wordBreak: 'break-all' }}>
						{flag.key}
					</Text>
					<Group gap={7} wrap="nowrap">
						<Badge size="xs" circle color={severityColor(flag.severity)} />
						<Text size="sm" fw={550}>
							{flag.value}
						</Text>
					</Group>
					{flag.description ? (
						<Text size="xs" c="dimmed" lh={1.4}>
							{flag.description}
						</Text>
					) : null}
				</Stack>
			</Paper>
		))}
	</SimpleGrid>
);

export interface AttributeListProps {
	attributes: ArchbaseDiagnosticAttribute[];
}

/** Lista rótulo/valor — o layout onde entram perfil, grupos, nível e os atributos de negócio. */
export const AttributeList = ({ attributes }: AttributeListProps) => (
	<Stack gap={7}>
		{attributes.map((attribute, index) => (
			<Group key={`${attribute.label}-${index}`} gap={12} wrap="nowrap" justify="space-between">
				<Text size="sm" c="dimmed">
					{attribute.label}
				</Text>
				<Text size="sm" fw={600} ta="right">
					{attribute.value}
				</Text>
			</Group>
		))}
	</Stack>
);

export interface SectionProps {
	title: string;
	hint?: string;
	children: ReactNode;
}

export const Section = ({ title, hint, children }: SectionProps) => (
	<Stack gap="xs">
		<Group gap={10} align="baseline" wrap="wrap">
			<Text size="xs" fw={650} tt="uppercase" style={{ letterSpacing: '.05em' }}>
				{title}
			</Text>
			{hint ? (
				<Text size="xs" c="dimmed">
					{hint}
				</Text>
			) : null}
		</Group>
		{children}
	</Stack>
);
