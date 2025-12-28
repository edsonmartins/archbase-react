import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group, Alert } from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { ArchbaseEdit } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

// Interface simples para o demo (sem decorators)
interface Cadastro {
  id: string;
  nome: string;
  email: string;
}

const initialData: Cadastro[] = [{ id: '1', nome: 'João Silva', email: 'joao@email.com' }];

export function ArchbaseEditWithValidation() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [initialized, setInitialized] = useState(false);

  const { dataSource } = useArchbaseDataSource<Cadastro, string>({
    initialData,
    name: 'dsCadastroValidation',
  });

  const currentRecord = dataSource.getCurrentRecord();
  const isBrowsing = dataSource.isBrowsing();
  const isEditing = dataSource.isEditing();

  const edit = () => dataSource.edit();
  const save = () => dataSource.save();
  const cancel = () => dataSource.cancel();

  // Inicializa em modo de edição após o mount
  useEffect(() => {
    if (!initialized && dataSource && isBrowsing) {
      try {
        edit();
        setInitialized(true);
      } catch (e) {
        // Ignorar se não conseguir editar no primeiro render
      }
    }
  }, [initialized, dataSource, isBrowsing]);

  const validateForm = (): string[] => {
    const errors: string[] = [];
    const data = currentRecord;

    if (!data) return errors;

    if (!data.nome || data.nome.trim() === '') {
      errors.push('Nome é obrigatório');
    } else if (data.nome.length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    }

    if (!data.email || data.email.trim() === '') {
      errors.push('E-mail é obrigatório');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('E-mail inválido');
    }

    return errors;
  };

  const handleSave = async () => {
    setValidationErrors([]);
    setIsValid(null);

    const errors = validateForm();

    if (errors.length > 0) {
      setValidationErrors(errors);
      setIsValid(false);
    } else {
      try {
        await save();
        setIsValid(true);
      } catch (error) {
        setValidationErrors(['Erro ao salvar']);
        setIsValid(false);
      }
    }
  };

  const handleEdit = () => {
    setValidationErrors([]);
    setIsValid(null);
    edit();
  };

  return (
    <Stack gap="md" p="md">
      <Group>
        <Button size="xs" onClick={handleEdit} disabled={isEditing} color="blue">
          Editar
        </Button>
        <Button size="xs" onClick={handleSave} disabled={isBrowsing} color="green">
          Salvar (Validar)
        </Button>
        <Button size="xs" onClick={cancel} disabled={isBrowsing} color="red">
          Cancelar
        </Button>
      </Group>

      <ArchbaseEdit
        dataSource={dataSource}
        dataField="nome"
        label="Nome"
        placeholder="Digite o nome (mínimo 3 caracteres)..."
        required
      />

      <ArchbaseEdit
        dataSource={dataSource}
        dataField="email"
        label="E-mail"
        placeholder="Digite um e-mail válido..."
        required
      />

      {isValid === true && (
        <Alert icon={<IconCheck size={16} />} color="green" title="Sucesso">
          Dados validados com sucesso!
        </Alert>
      )}

      {validationErrors.length > 0 && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" title="Erros de validação">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Dados atuais ({isBrowsing ? 'Navegando' : 'Editando'}):
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify(currentRecord, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
