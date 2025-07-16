import { ArchbaseForm } from '@archbase/layout';
import { ArchbaseEdit } from '@archbase/components';
import { ArchbaseDialog } from '@archbase/components';
import { Button, ButtonVariant, Checkbox, Group, Modal } from '@mantine/core';
import { getI18nextInstance, useArchbaseTranslation } from '@archbase/core';
import React, { useState } from 'react';

interface ArchbaseSaveFilterProps {
	title: string;
	id: string;
	onClickOk?: (filterName: string, shared: boolean) => void;
	onClickCancel?: (event?: React.MouseEvent) => void;
	modalOpen?: string;
	placeholder?: string;
	variant?: ButtonVariant;
}

export const ArchbaseSaveFilter: React.FC<ArchbaseSaveFilterProps> = ({
	title,
	id,
	onClickCancel,
	onClickOk,
	modalOpen,
	placeholder,
	variant,
}) => {
	const [filterName, setFilterName] = useState<string>();
	const [shared, setShared] = useState(true);

	const onClick = (id: string, event: React.MouseEvent) => {
		if (id === 'btnOK') {
			if (!filterName || filterName === '') {
				ArchbaseDialog.showWarning('Informe o nome do filtro.');
				return;
			}
			if (onClickOk) {
				onClickOk(filterName, shared);
			}
		} else if (id === 'btnCancel') {
			if (onClickCancel) {
				onClickCancel(event);
			}
		}
	};

	const onCloseButton = () => {
		if (onClickCancel) {
			onClickCancel();
		}
	};

	return (
		<Modal title={title} id={id} opened={modalOpen === id} onClose={onCloseButton}>
			<Group>
				<Button variant={variant} onClick={(event) => onClick('btnOK', event)}>
					OK
				</Button>{' '}
				<Button variant={variant} color="red" onClick={(event) => onClick('btnCancel', event)}>
					Fechar
				</Button>
			</Group>
			<ArchbaseForm>
				<ArchbaseEdit
					placeholder={placeholder}
					style={{ width: '100%' }}
					onChangeValue={(value: any) => setFilterName(value)}
				/>
				<Checkbox
					onChange={(event: any) => setShared(event.currentTarget.checked)}
					label={getI18nextInstance().t('archbase:Filtro compartilhado ?')}
				/>
			</ArchbaseForm>
		</Modal>
	);
};
