/**
 * Conversão entre o valor dos pickers do @mantine/dates (`YYYY-MM-DD`) e o campo do DataSource.
 */
import dayjs from 'dayjs';

/** Como a data é gravada no DataSource: string `YYYY-MM-DD` ou objeto `Date` (meia-noite local). */
export type ArchbaseDateFieldValueType = 'string' | 'date';

/** Lê `Date` ou string ISO (`YYYY-MM-DD`, com ou sem hora) do campo e devolve `YYYY-MM-DD`. */
export function dateFieldToDateString(fieldValue: unknown): string | null {
	if (fieldValue === null || fieldValue === undefined || fieldValue === '') return null;
	if (fieldValue instanceof Date) {
		return Number.isNaN(fieldValue.getTime()) ? null : dayjs(fieldValue).format('YYYY-MM-DD');
	}
	if (typeof fieldValue === 'string') {
		// Pega só a parte da data: evita que `2024-05-15T00:00:00Z` vire dia 14 por fuso.
		const match = /^(\d{4}-\d{2}-\d{2})/.exec(fieldValue);
		return match ? match[1] : null;
	}
	return null;
}

export function dateStringToDateField(value: string | null, valueType: ArchbaseDateFieldValueType): string | Date | null {
	if (!value) return null;
	const date = value.slice(0, 10);
	if (valueType === 'date') {
		const [y, m, d] = date.split('-').map(Number);
		return new Date(y, m - 1, d);
	}
	return date;
}
