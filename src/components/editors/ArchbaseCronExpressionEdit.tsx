import React, { useState } from 'react';
import { TextInput, ActionIcon, Modal, Button, Group } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { ArchbaseCronExpressionEditor } from './ArchbaseCronExpressionEditor';


interface ArchbaseCronExpressionEditProps {
  /** The current cron expression value */
  value: string;
  /** Callback function to handle changes in the cron expression */
  onChange: (newValue: string) => void;
  /** Label for the input field */
  label?: string;
  /** Error message to display (if any) */
  error?: string;
  /** Whether the component is in a read-only state */
  readOnly?: boolean;
  /** Placeholder text for the input field */
  placeholder?: string;
}

export function ArchbaseCronExpressionEdit({
  value,
  onChange,
  label,
  error,
  readOnly = false,
  placeholder = 'Expressão Cron'
}: ArchbaseCronExpressionEditProps) {
  const [modalOpened, setModalOpened] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onChange(tempValue);
    setModalOpened(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setModalOpened(false);
  };

  const handleModalOpen = () => {
    setTempValue(value);
    setModalOpened(true);
  };

  return (
    <>
      <TextInput
        value={value}
        readOnly={true}
        label={label}
        error={error}
        placeholder={placeholder}
        rightSection={
          !readOnly && (
            <ActionIcon onClick={handleModalOpen} disabled={readOnly}>
              <IconClock size="1.1rem" />
            </ActionIcon>
          )
        }
      />

      <Modal 
        opened={modalOpened} 
        onClose={handleCancel}
        title="Editar Expressão Cron"
        size="lg"
      >
        <ArchbaseCronExpressionEditor
          initialValue={tempValue}
          onChange={setTempValue}
        />
        <Group justify="flex-end" mt="xl">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </Group>
      </Modal>
    </>
  );
}