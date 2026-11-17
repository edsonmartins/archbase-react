/**
 * ArchbaseMentionInput — input com suporte a mentions (@user, #tag, etc.) integrado ao DataSource (v1/v2).
 * Wrapper sobre o `Mentions` do @mantine/core (9.8+) com validacao.
 *
 * Ate a 4.13 era construido sobre react-mentions. A troca preserva o contrato publico:
 * - o markup padrao continua `[__display__](__id__)` (SEM o gatilho). O padrao do Mantine e
 *   `@[__display__](__id__)`; adota-lo silenciosamente faria as mencoes ja gravadas deixarem de ser
 *   reconhecidas;
 * - `data` como funcao continua aceitando a assinatura de callback do react-mentions
 *   `(search, callback) => void`, alem da forma do Mantine que retorna array/Promise;
 * - `onChangeValue(value, event)` continua recebendo `event.target.value`.
 * @status stable
 */
import { Mentions, MantineSize } from '@mantine/core';
import type { MentionDataFn, MentionItem, MentionsChangePayload } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames, useArchbaseDidUpdate, useArchbaseV1V2Compatibility } from '@archbase/data';
import { useValidationErrors } from '@archbase/core';

/** Markup gravado por padrao. Mantido igual ao da versao baseada em react-mentions. */
export const ARCHBASE_MENTION_DEFAULT_MARKUP = '[__display__](__id__)';

export type ArchbaseMentionItem = { id: string; display: string };

export type ArchbaseMentionDataFn =
	| ((search: string, callback: (data: ArchbaseMentionItem[]) => void) => void)
	| ((search: string) => ArchbaseMentionItem[] | Promise<ArchbaseMentionItem[]>);

/**
 * Converte `data` para a forma do Mantine. Funcoes no estilo react-mentions entregam o resultado
 * pelo callback e retornam undefined; funcoes no estilo Mantine retornam o array (ou a Promise).
 * Aceitamos as duas: o que chegar primeiro resolve.
 */
export function toMantineMentionData(
	data: ArchbaseMentionItem[] | ArchbaseMentionDataFn,
): MentionItem[] | MentionDataFn {
	if (typeof data !== 'function') {
		return data;
	}
	return (query: string) =>
		new Promise<MentionItem[]>((resolve, reject) => {
			let settled = false;
			const done = (items: ArchbaseMentionItem[] | undefined | null) => {
				if (!settled) {
					settled = true;
					resolve(items ?? []);
				}
			};
			try {
				const result = (data as any)(query, done);
				if (result !== undefined) {
					Promise.resolve(result).then(done, (err) => {
						if (!settled) {
							settled = true;
							reject(err);
						}
					});
				}
			} catch (err) {
				settled = true;
				reject(err);
			}
		});
}

export interface ArchbaseMentionConfig {
	/** Caractere gatilho da mention (ex: '@', '#') */
	trigger: string;
	/**
	 * Lista estatica, ou funcao de busca: `(search, callback) => void` (estilo react-mentions) ou
	 * `(search) => itens | Promise<itens>`.
	 */
	data: ArchbaseMentionItem[] | ArchbaseMentionDataFn;
	/** Markup template. Padrao: '[__display__](__id__)' */
	markup?: string;
	/** Funcao para transformar exibicao */
	displayTransform?: (id: string, display: string) => string;
	/** Permite espacos na busca */
	allowSpaceInQuery?: boolean;
	/** Estilos customizados para a mention */
	style?: React.CSSProperties;
	/** Classe CSS aplicada as mencoes deste gatilho */
	className?: string;
}

export interface ArchbaseMentionInputProps<T, ID> {
	/** Fonte de dados onde sera atribuido o valor (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo onde devera ser atribuido o valor na fonte de dados */
	dataField?: string;
	/** Valor controlado (standalone) */
	value?: string;
	/** Valor padrao (standalone) */
	defaultValue?: string;
	/** Titulo do campo */
	label?: string;
	/** Descricao do campo */
	description?: string;
	/** Ultimo erro ocorrido */
	error?: string;
	/** Texto sugestao */
	placeholder?: string;
	/** Indicador se o preenchimento e obrigatorio */
	required?: boolean;
	/** Indicador se o campo esta desabilitado */
	disabled?: boolean;
	/** Indicador se o campo e somente leitura */
	readOnly?: boolean;
	/** Configuracoes de mention (triggers, data, etc.) */
	mentions: ArchbaseMentionConfig[];
	/** Modo linha unica */
	singleLine?: boolean;
	/** Permitir sugestoes acima do cursor */
	allowSuggestionsAboveCursor?: boolean;
	/** Evento quando o valor e alterado */
	onChangeValue?: (value: string, event: any) => void;
	/** Evento quando o campo recebe foco */
	onFocusEnter?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
	/** Evento quando o foco sai do campo */
	onFocusExit?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
	/** Referencia para o componente interno */
	innerRef?: React.RefObject<HTMLTextAreaElement | HTMLInputElement>;
	/** Estilos customizados */
	style?: CSSProperties;
	/** Classes CSS customizadas */
	className?: string;
	/** Largura do campo */
	width?: string | number;
	/** Altura do campo */
	height?: string | number;
	/** Tamanho do campo (Mantine) */
	size?: MantineSize;
}

export function ArchbaseMentionInput<T, ID>({
	dataSource,
	dataField,
	value: valueProp,
	defaultValue,
	label,
	description,
	error,
	placeholder,
	required = false,
	disabled = false,
	readOnly = false,
	mentions,
	singleLine = false,
	allowSuggestionsAboveCursor = true,
	onChangeValue,
	onFocusEnter,
	onFocusExit,
	innerRef,
	style,
	className,
	width,
	height,
	size,
}: ArchbaseMentionInputProps<T, ID>) {
	const v1v2Compatibility = useArchbaseV1V2Compatibility<string>(
		'ArchbaseMentionInput',
		dataSource,
		dataField,
		'',
	);

	const [currentValue, setCurrentValue] = useState<string>(valueProp ?? defaultValue ?? '');
	const innerComponentRef = useRef<any>(null);
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();

	const validationContext = useValidationErrors();
	const fieldKey = `${dataField}`;
	const contextError = validationContext?.getError(fieldKey);

	useEffect(() => {
		if (error !== undefined && error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	// Sincronizar prop value quando nao tem datasource
	useEffect(() => {
		if (!dataSource && valueProp !== undefined) {
			setCurrentValue(valueProp);
		}
	}, [valueProp, dataSource]);

	const loadDataSourceFieldValue = () => {
		let initialValue: any = valueProp ?? defaultValue ?? '';

		if (dataSource && dataField) {
			initialValue = dataSource.getFieldValue(dataField);
			if (!initialValue) {
				initialValue = '';
			}
		}

		setCurrentValue(initialValue);
	};

	const fieldChangedListener = useCallback(() => {
		loadDataSourceFieldValue();
	}, []);

	const dataSourceEvent = useCallback(
		(event: DataSourceEvent<T>) => {
			if (dataSource && dataField) {
				if (
					event.type === DataSourceEventNames.dataChanged ||
					event.type === DataSourceEventNames.recordChanged ||
					event.type === DataSourceEventNames.afterScroll ||
					event.type === DataSourceEventNames.afterCancel ||
					event.type === DataSourceEventNames.afterInsert ||
					event.type === DataSourceEventNames.afterEdit
				) {
					loadDataSourceFieldValue();
					if (!v1v2Compatibility.isDataSourceV2) {
						forceUpdate();
					}
				}

				if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
					setInternalError(event.error);
					validationContext?.setError(fieldKey, event.error);
					if (!v1v2Compatibility.isDataSourceV2) {
						forceUpdate();
					}
				}
			}
		},
		[v1v2Compatibility.isDataSourceV2, dataSource, dataField, loadDataSourceFieldValue, forceUpdate, validationContext, fieldKey],
	);

	const dataSourceEventRef = useRef(dataSourceEvent);
	useEffect(() => {
		dataSourceEventRef.current = dataSourceEvent;
	}, [dataSourceEvent]);

	const stableDataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
		dataSourceEventRef.current(event);
	}, []);

	useEffect(() => {
		loadDataSourceFieldValue();
		if (dataSource && dataField) {
			const hasFieldListener = typeof (dataSource as any).addFieldChangeListener === 'function';
			dataSource.addListener(stableDataSourceEvent);
			if (hasFieldListener) {
				(dataSource as any).addFieldChangeListener(dataField, fieldChangedListener);
			}

			return () => {
				dataSource.removeListener(stableDataSourceEvent);
				if (hasFieldListener) {
					(dataSource as any).removeFieldChangeListener(dataField, fieldChangedListener);
				}
			};
		}
	}, [dataSource, dataField, stableDataSourceEvent, fieldChangedListener]);

	useArchbaseDidUpdate(() => {
		loadDataSourceFieldValue();
	}, []);

	const handleChange = (payload: MentionsChangePayload) => {
		const newValue = payload.value;
		const hasError = internalError || contextError;
		if (hasError) {
			setInternalError(undefined);
			validationContext?.clearError(fieldKey);
		}

		setCurrentValue(newValue);

		if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== newValue) {
			v1v2Compatibility.handleValueChange(newValue);
		}

		if (onChangeValue) {
			// Mesmo formato de evento que o react-mentions entregava (`event.target.value`), com o
			// payload completo do Mantine anexado para quem quiser mentions/plainTextValue.
			onChangeValue(newValue, { target: { value: newValue }, payload });
		}
	};

	const handleOnFocusExit = (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		if (onFocusExit) {
			onFocusExit(event);
		}
	};

	const handleOnFocusEnter = (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		if (onFocusEnter) {
			onFocusEnter(event);
		}
	};

	const isReadOnly = () => {
		return readOnly || v1v2Compatibility.isReadOnly;
	};

	const displayError = internalError || contextError;

	const mentionSources = useMemo(
		() =>
			mentions.map((config) => ({
				config,
				data: toMantineMentionData(config.data),
			})),
		[mentions],
	);

	return (
		<Mentions
			label={label}
			description={description}
			error={displayError}
			required={required}
			size={size}
			value={currentValue}
			onChange={handleChange}
			onBlur={handleOnFocusExit}
			onFocus={handleOnFocusEnter}
			placeholder={placeholder}
			disabled={disabled}
			readOnly={isReadOnly()}
			singleLine={singleLine}
			suggestionsPlacement={allowSuggestionsAboveCursor ? 'auto' : 'below'}
			ref={(innerRef || innerComponentRef) as any}
			className={className}
			style={{ width, ...style }}
			styles={height !== undefined ? { input: { minHeight: height } } : undefined}
		>
			{mentionSources.map(({ config, data }, index) => (
				<Mentions.Mention
					key={`${config.trigger}-${index}`}
					trigger={config.trigger}
					data={data}
					markup={config.markup || ARCHBASE_MENTION_DEFAULT_MARKUP}
					displayTransform={config.displayTransform}
					allowSpaceInQuery={config.allowSpaceInQuery}
					style={config.style}
					className={config.className}
				/>
			))}
		</Mentions>
	);
}

ArchbaseMentionInput.displayName = 'ArchbaseMentionInput';
