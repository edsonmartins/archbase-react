import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';
import { ArchbaseFormTemplate } from './ArchbaseFormTemplate';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseEdit } from '@archbase/components';

interface Pessoa {
  id: number;
  name: string;
  email: string;
}

const starterRecords: Pessoa[] = [
  { id: 1, name: 'Felipe', email: 'felipe@example.com' }
];

const ArchbaseFormTemplateExample = () => {
  const { dataSource, isBrowsing, isEmpty, edit } = useArchbaseDataSourceV2<Pessoa>({
    initialData: starterRecords,
    name: 'form-story',
  });

  useEffect(() => {
    if (isBrowsing && !isEmpty) {
      edit();
    }
  }, [isBrowsing, isEmpty, edit]);

  return (
    <div style={{ width: '100%', maxWidth: 600 }}>
      <ArchbaseFormTemplate
        title="Cadastro rápido"
        dataSource={dataSource}
        renderForm={() => (
          <>
            <ArchbaseEdit dataSource={dataSource} dataField="name" label="Nome" />
            <ArchbaseEdit dataSource={dataSource} dataField="email" label="Email" />
          </>
        )}
        onSave={(entity) => alert(`Saved ${entity?.name ?? 'registro'}`)}
      />
    </div>
  );
};

const meta: Meta<typeof ArchbaseFormTemplate> = {
  title: 'Templates/ArchbaseFormTemplate',
  component: ArchbaseFormTemplate,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseFormTemplate é um template de formulário com estrutura padronizada.

## Características
- Estrutura de formulário padronizada
- Integração com DataSource V2
- Ações de salvar/cancelar
- Título customizável
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ArchbaseFormTemplate>;

export const Basic: Story = {
  name: 'Exemplo Básico',
  render: () => <ArchbaseFormTemplateExample />,
};
