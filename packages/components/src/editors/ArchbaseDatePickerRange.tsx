import { Flex, Input, MantineSize } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import { IconArrowRight, IconCalendar } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { CSSProperties, ReactNode } from 'react';
import { ArchbaseDatePickerEdit } from './ArchbaseDatePickerEdit';
import { useValidationErrors } from '@archbase/core';

export interface ArchbaseDatePickerRangeProps {
	/** Indicador se o date picker range está desabilitado */
	disabled?: boolean;
	/** Indicador se o date picker range é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly?: boolean;
	/** Indicador se o preenchimento do date picker range é obrigatório */
	required?: boolean;
	/** Valor inicial */
	value?: string;
	/** Estilo do date picker range */
	style?: CSSProperties;
	/** Tamanho do date picker range */
	size?: MantineSize;
	/** Largura do date picker range */
	width?: string | number | undefined;
	/** Icone à direita */
	icon?: ReactNode;
	/** Texto sugestão do date picker range */
	placeholderStart?: string;
	/** Texto sugestão do date picker range */
	placeholderEnd?: string;
	/** Título do date picker range */
	label?: string;
	/** Descrição do date picker range */
	description?: string;
	/** Último erro ocorrido no date picker range */
	error?: string;
	/** Evento quando o foco sai do date picker range */
	onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o date picker range recebe o foco */
	onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o valor do date picker range é alterado */
	onChangeValue?: (value: any, event: any) => void;
	onKeyDown?: (event: any) => void;
	onKeyUp?: (event: any) => void;
	/** Evento quando o valor do range do date picker range é alterado */
	onSelectDateRange?: (value: DateValue[]) => void;
	/** Referência para o componente interno data inicial*/
	innerRefStart?: React.RefObject<HTMLInputElement> | undefined;
	/** Referência para o componente interno data final*/
	innerRefEnd?: React.RefObject<HTMLInputElement> | undefined;
}

export function ArchbaseDatePickerRange({
	label,
	disabled,
	readOnly,
	size,
	width,
	style,
	onSelectDateRange,
	onFocusEnter,
	onFocusExit,
	placeholderStart,
	placeholderEnd,
	error,
}: ArchbaseDatePickerRangeProps) {
	const [startDate, setStartDate] = useState<DateValue>();
	const [endDate, setEndDate] = useState<DateValue>();
	const [internalError, setInternalError] = useState<string | undefined>(error);

	// Contexto de validação (opcional - pode não existir)
	const validationContext = useValidationErrors();

	// Chave única para o field (usando label como fallback)
	const fieldKey = label || 'date-picker-range';

	// Recuperar erro do contexto se existir
	const contextError = validationContext?.getError(fieldKey);

	// ✅ CORRIGIDO: Apenas atualizar se o prop error vier definido
	// Não limpar o internalError se o prop error for undefined
	useEffect(() => {
		if (error !== undefined && error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	const handleSelectRange = (sDt?: DateValue, eDt?: DateValue) => {
		// ✅ Limpa erro quando usuário edita o campo (tanto do estado local quanto do contexto)
		const hasError = internalError || contextError;
		if (hasError) {
			setInternalError(undefined);
			validationContext?.clearError(fieldKey);
		}

		setStartDate(sDt);
		setEndDate(eDt);
		if (onSelectDateRange) {
			onSelectDateRange([sDt, eDt]);
		}
	};

	// Erro a ser exibido: local ou do contexto
	const displayError = internalError || contextError;

	return (
		<Input.Wrapper
			label={label}
			size={size!}
			error={displayError}
			style={{
				width,
				...style,
			}}
		>
			<Flex gap="sm" justify="flex-start" align="center" direction="row">
				<ArchbaseDatePickerEdit
					clearable={true}
					rightSection={<IconCalendar />}
					readOnly={readOnly}
					disabled={disabled}
					placeholder={placeholderStart}
					onFocusEnter={onFocusEnter}
					onFocusExit={onFocusExit}
					onChange={(value: DateValue) => handleSelectRange(value, endDate)}
					style={{ width: width ? width : 180 }}
				/>
				<IconArrowRight size={'1rem'} />
				<ArchbaseDatePickerEdit
					clearable={true}
					rightSection={<IconCalendar />}
					readOnly={readOnly}
					disabled={disabled}
					placeholder={placeholderEnd}
					onFocusEnter={onFocusEnter}
					onFocusExit={onFocusExit}
					onChange={(value: DateValue) => handleSelectRange(startDate, value)}
					style={{ width: width ? width : 180 }}
				/>
			</Flex>
		</Input.Wrapper>
	);
}
