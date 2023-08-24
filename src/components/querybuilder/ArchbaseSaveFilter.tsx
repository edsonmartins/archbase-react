import { Button, Group, Modal } from '@mantine/core';
import { ArchbaseForm } from '../../components/containers/form';
import { ArchbaseCheckbox, ArchbaseEdit } from '../../components/editors';
import { ArchbaseDialog } from '../../components/notification';
import React, { useState } from 'react';

interface ArchbaseSaveFilterProps {
  title: string;
  id: string;
  onClickOk?: (filterName: string, shared: boolean) => void;
  onClickCancel?: (event?: React.MouseEvent) => void;
  modalOpen?: string;
  placeholder?: string;
}

export const ArchbaseSaveFilter: React.FC<ArchbaseSaveFilterProps> = ({
  title,
  id,
  onClickCancel,
  onClickOk,
  modalOpen,
  placeholder,
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
        <Button onClick={(event) => onClick('btnOK', event)}>OK</Button>{' '}
        <Button color="red" onClick={(event) => onClick('btnCancel', event)}>
          Fechar
        </Button>
      </Group>
      <ArchbaseForm>
        <ArchbaseEdit
          placeholder={placeholder}
          style={{ width: '100%' }}
          onChangeValue={(value: any) => setFilterName(value)}
        />
        <ArchbaseCheckbox
          trueValue={true}
          falseValue={false}
          onChangeValue={(value: any) => setShared(value === true)}
          label="Filtro compartilhado ?"
        />
      </ArchbaseForm>
    </Modal>
  );
};


