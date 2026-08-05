/**
 * Os gestos de uma entidade da {@link ArchbaseSecurityView}: adicionar, ver, editar, remover,
 * salvar, cancelar e abrir permissões.
 *
 * <p><b>Por que existe.</b> A view tinha cinco famílias destes handlers, uma por entidade,
 * quase idênticas. "Quase" era o problema: {@code handleUserEditRow} chamava {@code edit()}
 * sem a guarda {@code isEditing()} que grupo e perfil tinham — a guarda foi acrescentada em
 * dois dos três e nunca retroportada. Diferenças assim compilam igual e se comportam
 * diferente, e ninguém as vê enquanto o código está repetido cinco vezes.
 *
 * <p>A guarda agora vale para todos. É mudança de comportamento no fluxo de usuário, feita de
 * propósito: chamar {@code edit()} sobre uma edição em curso não tinha intenção por trás.
 *
 * <p>Coberto por {@code test/ArchbaseSecurityView.fluxos.test.tsx}.
 */
import { ArchbaseDialog } from '@archbase/components';
import type { IArchbaseDataSourceBase } from '@archbase/data';
import type { TranslateFn } from './columns';

export interface SecurityEntityActionsParams<T> {
	dataSource: IArchbaseDataSourceBase<T>;
	/** Discriminador usado para saber qual modal abrir. */
	securityType: string;
	/** Fábrica do registro novo — {@code UserDto.newInstance()} e afins. */
	newInstance: () => T;
	/** Quando falso, o id do registro novo é apagado antes de inserir. */
	createEntitiesWithId: boolean;
	/**
	 * Chave da mensagem de confirmação de remoção, já com o artigo e o substantivo:
	 * {@code 'archbase:Deseja remover o usuário '}. O nome do registro é concatenado.
	 */
	removeMessageKey: string;
	setOpenedModal: (valor: string) => void;
	setOpenedPermissionsModal: (valor: string) => void;
	validationContext?: { clearAll: () => void };
	t: TranslateFn;
}

export interface SecurityEntityActions<T> {
	handleAdd: () => void;
	handleViewRow: (row: any) => void;
	handleEditRow: (row: any) => void;
	handleRemoveRow: (row: any) => void;
	handleSaveModal: () => Promise<void>;
	handleCancelModal: () => void;
	handleOpenPermissionsModal: () => void;
}

export function useSecurityEntityActions<T>({
	dataSource,
	securityType,
	newInstance,
	createEntitiesWithId,
	removeMessageKey,
	setOpenedModal,
	setOpenedPermissionsModal,
	validationContext,
	t,
}: SecurityEntityActionsParams<T>): SecurityEntityActions<T> {
	const ds = dataSource as any;

	/** Posiciona no registro da linha. Devolve nulo quando não há onde posicionar. */
	const posicionarEm = (row: any) => {
		if (ds.isEmpty()) {
			return null;
		}
		return ds.gotoRecordByData(row) ?? null;
	};

	const handleAdd = () => {
		const registro = newInstance();
		if (!createEntitiesWithId) {
			(registro as any).id = undefined;
		}
		ds.insert(registro);
		setOpenedModal(securityType);
	};

	const handleViewRow = (row: any) => {
		if (posicionarEm(row)) {
			setOpenedModal(securityType);
		}
	};

	const handleEditRow = (row: any) => {
		if (!posicionarEm(row)) {
			return;
		}
		// A guarda que faltava no fluxo de usuário — ver o cabeçalho deste arquivo.
		if (!ds.isEditing()) {
			ds.edit();
		}
		setOpenedModal(securityType);
	};

	const handleRemoveRow = (row: any) => {
		if (!posicionarEm(row)) {
			return;
		}
		ArchbaseDialog.showConfirmDialogYesNo(
			`${t('archbase:Confirme')}`,
			`${t(removeMessageKey)}${row.name} ?`,
			() => {
				ds.remove();
			},
			() => {},
		);
	};

	const handleSaveModal = async () => {
		try {
			await ds.save();
		} catch (_error) {
			// Erro de gravação mantém o modal aberto para o operador corrigir.
			return;
		}
		setOpenedModal('');
		validationContext?.clearAll();
	};

	const handleCancelModal = () => {
		setOpenedModal('');
		if (!ds.isBrowsing()) {
			ds.cancel();
		}
		validationContext?.clearAll();
	};

	const handleOpenPermissionsModal = () => {
		setOpenedPermissionsModal(securityType);
	};

	return {
		handleAdd,
		handleViewRow,
		handleEditRow,
		handleRemoveRow,
		handleSaveModal,
		handleCancelModal,
		handleOpenPermissionsModal,
	};
}
