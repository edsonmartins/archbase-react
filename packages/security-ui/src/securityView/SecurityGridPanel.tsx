/**
 * O painel de uma aba da {@link ArchbaseSecurityView}.
 *
 * <p>As cinco abas eram o mesmo bloco escrito cinco vezes: um {@code Paper} que se esconde por
 * {@code display} e um {@code ArchbaseDataGrid} com quinze props idênticas. Só seis coisas
 * mudavam de uma para outra — e eram justamente elas que ficavam difíceis de achar no meio da
 * repetição.
 *
 * <p>A aba inativa é escondida por {@code display: none} em vez de desmontada, de propósito:
 * é o que preserva rolagem, filtro e seleção ao trocar de aba. Era assim antes e continua.
 */
import React, { type ReactNode } from 'react';
import { Paper } from '@mantine/core';
import { ArchbaseDataGrid, type ArchbaseDataGridRef } from '@archbase/components';
import type { IArchbaseDataSourceBase } from '@archbase/data';

export interface SecurityGridPanelProps<T extends object> {
	/** Aba visível. A escondida permanece montada. */
	active: boolean;
	printTitle: string;
	gridRef: React.MutableRefObject<ArchbaseDataGridRef | null>;
	dataSource: IArchbaseDataSourceBase<T>;
	isLoading: boolean;
	error?: string;
	getRowId: (row: T) => string;
	striped?: boolean;
	/** Recursos e tokens de acesso não têm ações por linha. */
	enableRowActions?: boolean;
	toolbarLeftContent?: ReactNode;
	renderRowActions?: (row: T) => ReactNode;
	actionsColumnWidth?: number;
	/** As colunas, no formato declarativo do grid. */
	children: ReactNode;
}

export function SecurityGridPanel<T extends object>({
	active,
	printTitle,
	gridRef,
	dataSource,
	isLoading,
	error,
	getRowId,
	striped = false,
	enableRowActions = true,
	toolbarLeftContent,
	renderRowActions,
	actionsColumnWidth,
	children,
}: SecurityGridPanelProps<T>) {
	return (
		<Paper
			withBorder
			mt="md"
			style={{
				display: active ? 'flex' : 'none',
				width: '100%',
				flex: 1,
				minHeight: 0,
				overflow: 'auto',
			}}
		>
			<ArchbaseDataGrid<T, string>
				gridRef={gridRef}
				printTitle={printTitle}
				width={'100%'}
				height={'100%'}
				withBorder={false}
				dataSource={dataSource}
				withColumnBorders={true}
				striped={striped}
				enableTopToolbar={true}
				enableRowActions={enableRowActions}
				pageSize={50}
				isLoading={isLoading}
				isError={!!error}
				error={error}
				enableGlobalFilter={true}
				getRowId={getRowId}
				toolbarLeftContent={toolbarLeftContent}
				renderRowActions={renderRowActions}
				actionsColumnWidth={actionsColumnWidth}
				children={children}
			/>
		</Paper>
	);
}
