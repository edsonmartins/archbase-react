import { Box, Group, MantineSize, Progress, Stack, Text } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import type { CSSProperties } from 'react';
import React, { useEffect, useMemo, useRef } from 'react';
import type {
	ArchbasePasswordPolicy,
	ArchbasePasswordStrength,
	ArchbasePasswordValidationResult,
} from '@archbase/core';
import {
	getArchbasePasswordStrengthLabel,
	resolveArchbasePasswordPolicy,
	validateArchbasePassword,
} from '@archbase/core';

export interface ArchbasePasswordStrengthMeterProps {
	/** Senha a ser avaliada */
	value?: string;
	/** Critérios de senha forte. `true` aplica a política padrão do Archbase */
	policy?: ArchbasePasswordPolicy | boolean;
	/** Indicador se a barra de força deve ser exibida */
	showStrengthBar?: boolean;
	/** Indicador se a lista de critérios deve ser exibida */
	showRequirements?: boolean;
	/** Exibe somente os critérios ainda não atendidos */
	onlyUnmetRequirements?: boolean;
	/** Tamanho do texto dos critérios */
	size?: MantineSize;
	/** Evento disparado sempre que o resultado da validação muda */
	onValidationChange?: (result: ArchbasePasswordValidationResult) => void;
	/** Estilo do container */
	style?: CSSProperties;
}

const STRENGTH_COLORS: Record<ArchbasePasswordStrength, string> = {
	empty: 'gray',
	weak: 'red',
	fair: 'orange',
	good: 'yellow',
	strong: 'teal',
};

export function ArchbasePasswordStrengthMeter({
	value = '',
	policy = true,
	showStrengthBar = true,
	showRequirements = true,
	onlyUnmetRequirements = false,
	size = 'xs',
	onValidationChange,
	style,
}: ArchbasePasswordStrengthMeterProps) {
	const resolvedPolicy = useMemo(() => resolveArchbasePasswordPolicy(policy), [policy]);

	const result = useMemo(
		() => (resolvedPolicy ? validateArchbasePassword(value, resolvedPolicy) : undefined),
		[value, resolvedPolicy]
	);

	// Notifica apenas quando o resultado realmente muda, evitando loops de render no consumidor.
	const lastNotifiedRef = useRef<string | undefined>(undefined);
	useEffect(() => {
		if (!result || !onValidationChange) {
			return;
		}
		const signature = `${result.valid}|${result.score}|${result.unmetRequirements
			.map((requirement) => requirement.key)
			.join(',')}`;
		if (lastNotifiedRef.current !== signature) {
			lastNotifiedRef.current = signature;
			onValidationChange(result);
		}
	}, [result, onValidationChange]);

	if (!result) {
		return null;
	}

	const color = STRENGTH_COLORS[result.strength];
	const requirements = onlyUnmetRequirements ? result.unmetRequirements : result.requirements;

	return (
		<Stack gap={4} mt={6} style={style}>
			{showStrengthBar && (
				<Box>
					<Progress value={result.score} color={color} size="sm" radius="xl" />
					{result.strength !== 'empty' && (
						<Text size={size} c={color} mt={2}>
							{getArchbasePasswordStrengthLabel(result.strength)}
						</Text>
					)}
				</Box>
			)}
			{showRequirements && requirements.length > 0 && (
				<Stack gap={2}>
					{requirements.map((requirement) => (
						<Group key={requirement.key} gap={6} wrap="nowrap" align="center">
							{requirement.satisfied ? (
								<IconCheck size={14} color="var(--mantine-color-teal-6)" />
							) : (
								<IconX size={14} color="var(--mantine-color-red-6)" />
							)}
							<Text size={size} c={requirement.satisfied ? 'teal' : 'dimmed'}>
								{requirement.label}
							</Text>
						</Group>
					))}
				</Stack>
			)}
		</Stack>
	);
}
