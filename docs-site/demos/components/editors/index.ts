import type { MantineDemo } from '@mantinex/demo';
import { ArchbaseEditUsage } from './ArchbaseEditUsage';
import { ArchbaseEditWithDataSource } from './ArchbaseEditWithDataSource';
import { ArchbaseEditWithValidation } from './ArchbaseEditWithValidation';
import { ArchbaseEditWithSearch } from './ArchbaseEditWithSearch';
import { ArchbaseEditSizes } from './ArchbaseEditSizes';
import { ArchbaseEditStates } from './ArchbaseEditStates';
import { ArchbaseEditStylesApi } from '../../../styles-api/ArchbaseEdit.styles-api';

// Código para demonstração de uso básico
const usageCode = `
import { useState } from 'react';
import { ArchbaseEdit } from '@archbase/components';

function Demo() {
  const [value, setValue] = useState<string>('');

  return (
    <ArchbaseEdit
      label="Nome"
      placeholder="Digite seu nome..."
      value={value}
      onChangeValue={(newValue) => setValue(newValue)}
    />
  );
}
`;

export const usage: MantineDemo = {
  type: 'code',
  component: ArchbaseEditUsage,
  code: usageCode,
};

// Código para demonstração com DataSource
const withDataSourceCode = `
import { ArchbaseEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Person {
  id: string;
  nome: string;
  email: string;
  cidade: string;
}

const initialData: Person[] = [
  { id: '1', nome: 'João Silva', email: 'joao@email.com', cidade: 'São Paulo' },
];

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2<Person>({
    initialData,
    name: 'dsPessoas',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>
      <Button onClick={cancel} disabled={isBrowsing}>Cancelar</Button>

      <ArchbaseEdit
        dataSource={dataSource}
        dataField="nome"
        label="Nome"
        placeholder="Digite o nome..."
      />

      <ArchbaseEdit
        dataSource={dataSource}
        dataField="email"
        label="E-mail"
        placeholder="Digite o e-mail..."
      />
    </>
  );
}
`;

export const withDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseEditWithDataSource,
  code: withDataSourceCode,
};

// Código para demonstração com validação
const withValidationCode = `
import { useState } from 'react';
import { ArchbaseEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

function Demo() {
  const [errors, setErrors] = useState<string[]>([]);

  const { dataSource, current, edit, save, isBrowsing } = useArchbaseDataSourceV2({
    initialData: [{ id: '1', nome: '', email: '' }],
    name: 'dsCadastro',
  });

  const validateForm = () => {
    const errs = [];
    if (!current?.nome) errs.push('Nome é obrigatório');
    if (!current?.email) errs.push('E-mail é obrigatório');
    return errs;
  };

  const handleSave = () => {
    const errs = validateForm();
    if (errs.length > 0) {
      setErrors(errs);
    } else {
      save();
    }
  };

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={handleSave} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseEdit dataSource={dataSource} dataField="nome" label="Nome" required />
      <ArchbaseEdit dataSource={dataSource} dataField="email" label="E-mail" required />

      {errors.length > 0 && (
        <Alert color="red">{errors.join(', ')}</Alert>
      )}
    </>
  );
}
`;

export const withValidation: MantineDemo = {
  type: 'code',
  component: ArchbaseEditWithValidation,
  code: withValidationCode,
};

// Código para demonstração com botão de busca
const withSearchCode = `
import { useState } from 'react';
import { Modal, Table, Button } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { ArchbaseEdit } from '@archbase/components';

function Demo() {
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <>
      <ArchbaseEdit
        label="Cliente"
        placeholder="Clique no ícone para buscar..."
        value={selectedCliente?.nome || ''}
        readOnly
        icon={<IconSearch size={16} />}
        onActionSearchExecute={() => setModalOpened(true)}
        tooltipIconSearch="Buscar cliente"
        variant="filled"
      />

      <Modal opened={modalOpened} onClose={() => setModalOpened(false)}>
        {/* Lista de clientes para seleção */}
      </Modal>
    </>
  );
}
`;

export const withSearch: MantineDemo = {
  type: 'code',
  component: ArchbaseEditWithSearch,
  code: withSearchCode,
};

// Código para demonstração de tamanhos
const sizesCode = `
import { ArchbaseEdit } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseEdit size="xs" placeholder="Extra Small" />
      <ArchbaseEdit size="sm" placeholder="Small" />
      <ArchbaseEdit size="md" placeholder="Medium (padrão)" />
      <ArchbaseEdit size="lg" placeholder="Large" />
      <ArchbaseEdit size="xl" placeholder="Extra Large" />
    </>
  );
}
`;

export const sizes: MantineDemo = {
  type: 'code',
  component: ArchbaseEditSizes,
  code: sizesCode,
};

// Código para demonstração de estados
const statesCode = `
import { ArchbaseEdit } from '@archbase/components';

function Demo() {
  return (
    <>
      {/* Normal */}
      <ArchbaseEdit label="Campo normal" placeholder="Digite algo..." />

      {/* Obrigatório */}
      <ArchbaseEdit label="Campo obrigatório" required />

      {/* Desabilitado */}
      <ArchbaseEdit label="Campo desabilitado" value="Valor fixo" disabled />

      {/* Somente leitura */}
      <ArchbaseEdit label="Somente leitura" value="Não editável" readOnly />

      {/* Com erro */}
      <ArchbaseEdit label="Com erro" error="Este campo contém um erro" />

      {/* Com descrição */}
      <ArchbaseEdit label="Com descrição" description="Dica útil sobre o campo" />
    </>
  );
}
`;

export const states: MantineDemo = {
  type: 'code',
  component: ArchbaseEditStates,
  code: statesCode,
};

// Demo de Styles API (interativo)
export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: ArchbaseEditStylesApi,
  component: ArchbaseEditUsage,
  code: usageCode,
  centered: true,
  maxWidth: 500,
};

// ============================================================================
// ArchbaseTextArea Demos
// ============================================================================
import { ArchbaseTextAreaUsage } from './ArchbaseTextAreaUsage';
import { ArchbaseTextAreaWithDataSource } from './ArchbaseTextAreaWithDataSource';
import { ArchbaseTextAreaSizes } from './ArchbaseTextAreaSizes';
import { ArchbaseTextAreaStates } from './ArchbaseTextAreaStates';

const textAreaUsageCode = `
import { useState } from 'react';
import { ArchbaseTextArea } from '@archbase/components';

function Demo() {
  const [value, setValue] = useState<string>('');

  return (
    <ArchbaseTextArea
      label="Descricao"
      placeholder="Digite uma descricao detalhada..."
      onChangeValue={(event, newValue) => setValue(newValue)}
      autosize
      minRows={3}
      maxRows={6}
    />
  );
}
`;

export const textAreaUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseTextAreaUsage,
  code: textAreaUsageCode,
};

const textAreaWithDataSourceCode = `
import { ArchbaseTextArea } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Produto {
  id: string;
  nome: string;
  descricao: string;
}

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2<Produto>({
    initialData: [{ id: '1', nome: 'Produto', descricao: 'Descricao do produto...' }],
    name: 'dsProduto',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>
      <Button onClick={cancel} disabled={isBrowsing}>Cancelar</Button>

      <ArchbaseTextArea
        dataSource={dataSource}
        dataField="descricao"
        label="Descricao"
        autosize
        minRows={4}
        maxRows={10}
      />
    </>
  );
}
`;

export const textAreaWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseTextAreaWithDataSource,
  code: textAreaWithDataSourceCode,
};

const textAreaSizesCode = `
import { ArchbaseTextArea } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseTextArea size="xs" label="Extra Small" minRows={2} />
      <ArchbaseTextArea size="sm" label="Small" minRows={2} />
      <ArchbaseTextArea size="md" label="Medium" minRows={2} />
      <ArchbaseTextArea size="lg" label="Large" minRows={2} />
      <ArchbaseTextArea size="xl" label="Extra Large" minRows={2} />
    </>
  );
}
`;

export const textAreaSizes: MantineDemo = {
  type: 'code',
  component: ArchbaseTextAreaSizes,
  code: textAreaSizesCode,
};

const textAreaStatesCode = `
import { ArchbaseTextArea } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseTextArea label="Normal" placeholder="Digite algo..." minRows={2} />
      <ArchbaseTextArea label="Obrigatorio" required minRows={2} />
      <ArchbaseTextArea label="Desabilitado" disabled minRows={2} />
      <ArchbaseTextArea label="Somente leitura" readOnly minRows={2} />
      <ArchbaseTextArea label="Com erro" error="Erro de validacao" minRows={2} />
      <ArchbaseTextArea label="Com descricao" description="Dica util" minRows={2} />
      <ArchbaseTextArea label="Autosize" autosize minRows={2} maxRows={6} />
    </>
  );
}
`;

export const textAreaStates: MantineDemo = {
  type: 'code',
  component: ArchbaseTextAreaStates,
  code: textAreaStatesCode,
};

// ============================================================================
// ArchbasePasswordEdit Demos
// ============================================================================
import { ArchbasePasswordEditUsage } from './ArchbasePasswordEditUsage';
import { ArchbasePasswordEditWithDataSource } from './ArchbasePasswordEditWithDataSource';
import { ArchbasePasswordEditStates } from './ArchbasePasswordEditStates';

const passwordUsageCode = `
import { useState } from 'react';
import { ArchbasePasswordEdit } from '@archbase/components';

function Demo() {
  const [value, setValue] = useState<string>('');

  return (
    <ArchbasePasswordEdit
      label="Senha"
      placeholder="Digite sua senha..."
      onChangeValue={(event, newValue) => setValue(newValue)}
    />
  );
}
`;

export const passwordEditUsage: MantineDemo = {
  type: 'code',
  component: ArchbasePasswordEditUsage,
  code: passwordUsageCode,
};

const passwordWithDataSourceCode = `
import { ArchbasePasswordEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Usuario {
  id: string;
  email: string;
  senha: string;
}

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2<Usuario>({
    initialData: [{ id: '1', email: 'usuario@email.com', senha: 'senha123' }],
    name: 'dsUsuario',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>
      <Button onClick={cancel} disabled={isBrowsing}>Cancelar</Button>

      <ArchbasePasswordEdit
        dataSource={dataSource}
        dataField="senha"
        label="Senha"
        required
      />
    </>
  );
}
`;

export const passwordEditWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbasePasswordEditWithDataSource,
  code: passwordWithDataSourceCode,
};

const passwordStatesCode = `
import { ArchbasePasswordEdit } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbasePasswordEdit label="Normal" placeholder="Digite sua senha..." />
      <ArchbasePasswordEdit label="Obrigatorio" required />
      <ArchbasePasswordEdit label="Desabilitado" value="senha" disabled />
      <ArchbasePasswordEdit label="Somente leitura" value="senha" readOnly />
      <ArchbasePasswordEdit label="Com erro" error="Senha muito fraca" />
      <ArchbasePasswordEdit label="Com descricao" description="Minimo 8 caracteres" />
    </>
  );
}
`;

export const passwordEditStates: MantineDemo = {
  type: 'code',
  component: ArchbasePasswordEditStates,
  code: passwordStatesCode,
};

// ============================================================================
// ArchbaseMaskEdit Demos
// ============================================================================
import { ArchbaseMaskEditUsage } from './ArchbaseMaskEditUsage';
import { ArchbaseMaskEditWithDataSource } from './ArchbaseMaskEditWithDataSource';
import { ArchbaseMaskEditPatterns } from './ArchbaseMaskEditPatterns';
import { ArchbaseMaskEditStates } from './ArchbaseMaskEditStates';

const maskUsageCode = `
import { useState } from 'react';
import { ArchbaseMaskEdit, MaskPattern } from '@archbase/components';

function Demo() {
  const [cpf, setCpf] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  return (
    <>
      <ArchbaseMaskEdit
        label="CPF"
        mask={MaskPattern.CPF}
        placeholder="Digite o CPF..."
        onChangeValue={(value) => setCpf(value)}
      />

      <ArchbaseMaskEdit
        label="Telefone"
        mask={MaskPattern.PHONE}
        placeholder="Digite o telefone..."
        onChangeValue={(value) => setPhone(value)}
      />
    </>
  );
}
`;

export const maskEditUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseMaskEditUsage,
  code: maskUsageCode,
};

const maskWithDataSourceCode = `
import { ArchbaseMaskEdit, MaskPattern } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Pessoa {
  id: string;
  cpf: string;
  telefone: string;
  cep: string;
}

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2<Pessoa>({
    initialData: [{ id: '1', cpf: '12345678901', telefone: '11999998888', cep: '01310100' }],
    name: 'dsPessoa',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>
      <Button onClick={cancel} disabled={isBrowsing}>Cancelar</Button>

      <ArchbaseMaskEdit dataSource={dataSource} dataField="cpf" label="CPF" mask={MaskPattern.CPF} />
      <ArchbaseMaskEdit dataSource={dataSource} dataField="telefone" label="Telefone" mask={MaskPattern.PHONE} />
      <ArchbaseMaskEdit dataSource={dataSource} dataField="cep" label="CEP" mask={MaskPattern.CEP} />
    </>
  );
}
`;

export const maskEditWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseMaskEditWithDataSource,
  code: maskWithDataSourceCode,
};

const maskPatternsCode = `
import { ArchbaseMaskEdit, MaskPattern } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseMaskEdit label="CPF" mask={MaskPattern.CPF} description="000.000.000-00" />
      <ArchbaseMaskEdit label="CNPJ" mask={MaskPattern.CNPJ} description="00.000.000/0000-00" />
      <ArchbaseMaskEdit label="CEP" mask={MaskPattern.CEP} description="00.000-000" />
      <ArchbaseMaskEdit label="Telefone" mask={MaskPattern.PHONE} description="(00) 00000-0000" />
      <ArchbaseMaskEdit label="Placa" mask={MaskPattern.PLACA} description="AAA-0X00" />
      <ArchbaseMaskEdit label="Customizado" mask="AAA-0000-AA" description="3 letras - 4 numeros - 2 letras" />
    </>
  );
}
`;

export const maskEditPatterns: MantineDemo = {
  type: 'code',
  component: ArchbaseMaskEditPatterns,
  code: maskPatternsCode,
};

const maskStatesCode = `
import { ArchbaseMaskEdit, MaskPattern } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseMaskEdit label="Normal" mask={MaskPattern.CPF} />
      <ArchbaseMaskEdit label="Com valor" mask={MaskPattern.CPF} value="12345678901" />
      <ArchbaseMaskEdit label="Desabilitado" mask={MaskPattern.CPF} value="12345678901" disabled />
      <ArchbaseMaskEdit label="Somente leitura" mask={MaskPattern.CPF} value="12345678901" readOnly />
      <ArchbaseMaskEdit label="Com erro" mask={MaskPattern.CPF} error="CPF invalido" />
      <ArchbaseMaskEdit label="Salva com mascara" mask={MaskPattern.CPF} saveWithMask />
    </>
  );
}
`;

export const maskEditStates: MantineDemo = {
  type: 'code',
  component: ArchbaseMaskEditStates,
  code: maskStatesCode,
};

// ============================================================================
// ArchbaseJsonEdit Demos
// ============================================================================
import { ArchbaseJsonEditUsage } from './ArchbaseJsonEditUsage';
import { ArchbaseJsonEditWithDataSource } from './ArchbaseJsonEditWithDataSource';
import { ArchbaseJsonEditStates } from './ArchbaseJsonEditStates';

const jsonUsageCode = `
import { useState } from 'react';
import { ArchbaseJsonEdit } from '@archbase/components';

function Demo() {
  const [value, setValue] = useState<string>('{"nome": "Produto", "preco": 99.90}');

  return (
    <ArchbaseJsonEdit
      label="Configuracao JSON"
      placeholder="Digite o JSON..."
      onChangeValue={(newValue) => setValue(newValue)}
      autosize
      minRows={4}
      maxRows={10}
    />
  );
}
`;

export const jsonEditUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseJsonEditUsage,
  code: jsonUsageCode,
};

const jsonWithDataSourceCode = `
import { ArchbaseJsonEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Configuracao {
  id: string;
  nome: string;
  config: string;
}

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2<Configuracao>({
    initialData: [{ id: '1', nome: 'Config', config: '{"tema": "light"}' }],
    name: 'dsConfig',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>
      <Button onClick={cancel} disabled={isBrowsing}>Cancelar</Button>

      <ArchbaseJsonEdit
        dataSource={dataSource}
        dataField="config"
        label="Configuracao JSON"
        autosize
        minRows={6}
        maxRows={15}
        disabledBase64Convertion
      />
    </>
  );
}
`;

export const jsonEditWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseJsonEditWithDataSource,
  code: jsonWithDataSourceCode,
};

const jsonStatesCode = `
import { ArchbaseJsonEdit } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseJsonEdit label="Normal" placeholder='{"chave": "valor"}' autosize minRows={3} />
      <ArchbaseJsonEdit label="Obrigatorio" required autosize minRows={3} />
      <ArchbaseJsonEdit label="Desabilitado" disabled autosize minRows={3} />
      <ArchbaseJsonEdit label="Somente leitura" readOnly autosize minRows={3} />
      <ArchbaseJsonEdit label="Com erro" error="JSON invalido" autosize minRows={3} />
      <ArchbaseJsonEdit label="Com descricao" description="JSON formatado ao sair" autosize minRows={3} />
      <ArchbaseJsonEdit label="Com limite" maxLength={500} autosize minRows={3} />
    </>
  );
}
`;

export const jsonEditStates: MantineDemo = {
  type: 'code',
  component: ArchbaseJsonEditStates,
  code: jsonStatesCode,
};

// ============================================================================
// ArchbaseSelect Demos
// ============================================================================
import { ArchbaseSelectUsage } from './ArchbaseSelectUsage';
import { ArchbaseSelectWithDataSource } from './ArchbaseSelectWithDataSource';
import { ArchbaseSelectStates } from './ArchbaseSelectStates';

const selectUsageCode = `
import { useState } from 'react';
import { ArchbaseSelect } from '@archbase/components';

interface Estado {
  sigla: string;
  nome: string;
}

const estados: Estado[] = [
  { sigla: 'SP', nome: 'Sao Paulo' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'MG', nome: 'Minas Gerais' },
];

function Demo() {
  const [value, setValue] = useState<Estado | null>(null);

  return (
    <ArchbaseSelect
      label="Estado"
      placeholder="Selecione um estado..."
      initialOptions={estados}
      getOptionLabel={(estado) => estado.nome}
      getOptionValue={(estado) => estado.sigla}
      onChangeValues={(estado) => setValue(estado)}
      searchable
      clearable
    />
  );
}
`;

export const selectUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseSelectUsage,
  code: selectUsageCode,
};

const selectWithDataSourceCode = `
import { ArchbaseSelect } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2({
    initialData: [{ id: '1', nome: 'Maria', estadoNascimento: 'SP' }],
    name: 'dsPessoa',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>
      <Button onClick={cancel} disabled={isBrowsing}>Cancelar</Button>

      <ArchbaseSelect
        dataSource={dataSource}
        dataField="estadoNascimento"
        label="Estado"
        initialOptions={estados}
        getOptionLabel={(e) => e.nome}
        getOptionValue={(e) => e.sigla}
        converter={(e) => e?.sigla}
        searchable
      />
    </>
  );
}
`;

export const selectWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseSelectWithDataSource,
  code: selectWithDataSourceCode,
};

const selectStatesCode = `
import { ArchbaseSelect } from '@archbase/components';

const opcoes = [
  { value: '1', label: 'Opcao 1' },
  { value: '2', label: 'Opcao 2' },
];

function Demo() {
  return (
    <>
      <ArchbaseSelect label="Normal" options={opcoes} getOptionLabel={(o) => o.label} getOptionValue={(o) => o.value} />
      <ArchbaseSelect label="Pesquisavel" options={opcoes} getOptionLabel={(o) => o.label} getOptionValue={(o) => o.value} searchable />
      <ArchbaseSelect label="Desabilitado" options={opcoes} getOptionLabel={(o) => o.label} getOptionValue={(o) => o.value} disabled />
      <ArchbaseSelect label="Com erro" options={opcoes} getOptionLabel={(o) => o.label} getOptionValue={(o) => o.value} error="Selecione uma opcao" />
    </>
  );
}
`;

export const selectStates: MantineDemo = {
  type: 'code',
  component: ArchbaseSelectStates,
  code: selectStatesCode,
};

// ============================================================================
// ArchbaseAsyncSelect Demos
// ============================================================================
import { ArchbaseAsyncSelectUsage } from './ArchbaseAsyncSelectUsage';
import { ArchbaseAsyncSelectWithDataSource } from './ArchbaseAsyncSelectWithDataSource';

const asyncSelectUsageCode = `
import { useState } from 'react';
import { ArchbaseAsyncSelect, OptionsResult } from '@archbase/components';

interface Cidade {
  id: string;
  nome: string;
  estado: string;
}

const searchCidades = async (page: number, query: string): Promise<OptionsResult<Cidade>> => {
  // Busca na API
  const response = await fetch(\`/api/cidades?q=\${query}&page=\${page}\`);
  return response.json();
};

function Demo() {
  const [value, setValue] = useState<Cidade | null>(null);

  return (
    <ArchbaseAsyncSelect
      label="Cidade"
      placeholder="Digite para buscar..."
      getOptions={searchCidades}
      getOptionLabel={(c) => \`\${c.nome} - \${c.estado}\`}
      getOptionValue={(c) => c.id}
      onChangeValues={(c) => setValue(c)}
      minCharsToSearch={2}
      clearable
    />
  );
}
`;

export const asyncSelectUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseAsyncSelectUsage,
  code: asyncSelectUsageCode,
};

const asyncSelectWithDataSourceCode = `
import { ArchbaseAsyncSelect, OptionsResult } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2({
    initialData: [{ id: '1', nome: 'Joao', cidadeId: '1' }],
    name: 'dsCliente',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseAsyncSelect
        dataSource={dataSource}
        dataField="cidadeId"
        label="Cidade"
        getOptions={searchCidades}
        getOptionLabel={(c) => c.nome}
        getOptionValue={(c) => c.id}
        converter={(c) => c?.id}
        getConvertedOption={getCidadeById}
      />
    </>
  );
}
`;

export const asyncSelectWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseAsyncSelectWithDataSource,
  code: asyncSelectWithDataSourceCode,
};

// ============================================================================
// ArchbaseRadioGroup Demos
// ============================================================================
import { ArchbaseRadioGroupUsage } from './ArchbaseRadioGroupUsage';
import { ArchbaseRadioGroupWithDataSource } from './ArchbaseRadioGroupWithDataSource';
import { ArchbaseRadioGroupDirections } from './ArchbaseRadioGroupDirections';

const radioGroupUsageCode = `
import { useState } from 'react';
import { ArchbaseRadioGroup } from '@archbase/components';

const opcoes = [
  { value: 'pequeno', label: 'Pequeno' },
  { value: 'medio', label: 'Medio' },
  { value: 'grande', label: 'Grande' },
];

function Demo() {
  const [value, setValue] = useState<string>('');

  return (
    <ArchbaseRadioGroup
      label="Tamanho"
      initialOptions={opcoes}
      getOptionLabel={(o) => o.label}
      getOptionValue={(o) => o.value}
      onChangeValues={(v) => setValue(v)}
    />
  );
}
`;

export const radioGroupUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseRadioGroupUsage,
  code: radioGroupUsageCode,
};

const radioGroupWithDataSourceCode = `
import { ArchbaseRadioGroup } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2({
    initialData: [{ id: '1', produto: 'Notebook', prioridade: 'normal' }],
    name: 'dsPedido',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseRadioGroup
        dataSource={dataSource}
        dataField="prioridade"
        label="Prioridade"
        initialOptions={prioridades}
        getOptionLabel={(o) => o.label}
        getOptionValue={(o) => o.value}
      />
    </>
  );
}
`;

export const radioGroupWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseRadioGroupWithDataSource,
  code: radioGroupWithDataSourceCode,
};

const radioGroupDirectionsCode = `
import { ArchbaseRadioGroup } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseRadioGroup
        label="Vertical (padrao)"
        initialOptions={opcoes}
        direction="vertical"
      />

      <ArchbaseRadioGroup
        label="Horizontal"
        initialOptions={opcoes}
        direction="horizontal"
      />
    </>
  );
}
`;

export const radioGroupDirections: MantineDemo = {
  type: 'code',
  component: ArchbaseRadioGroupDirections,
  code: radioGroupDirectionsCode,
};

// ============================================================================
// ArchbaseCheckbox Demos
// ============================================================================
import { ArchbaseCheckboxUsage } from './ArchbaseCheckboxUsage';
import { ArchbaseCheckboxWithDataSource } from './ArchbaseCheckboxWithDataSource';
import { ArchbaseCheckboxStates } from './ArchbaseCheckboxStates';

const checkboxUsageCode = `
import { useState } from 'react';
import { ArchbaseCheckbox } from '@archbase/components';

function Demo() {
  const [value, setValue] = useState<boolean>(false);

  return (
    <ArchbaseCheckbox
      label="Aceito os termos de uso"
      isChecked={value}
      onChangeValue={(newValue) => setValue(newValue)}
    />
  );
}
`;

export const checkboxUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseCheckboxUsage,
  code: checkboxUsageCode,
};

const checkboxWithDataSourceCode = `
import { ArchbaseCheckbox } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2({
    initialData: [{ id: '1', receberNotificacoes: true, aceitarTermos: false }],
    name: 'dsConfig',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseCheckbox dataSource={dataSource} dataField="receberNotificacoes" label="Receber notificacoes" />
      <ArchbaseCheckbox dataSource={dataSource} dataField="aceitarTermos" label="Aceito os termos" required />
    </>
  );
}
`;

export const checkboxWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseCheckboxWithDataSource,
  code: checkboxWithDataSourceCode,
};

const checkboxStatesCode = `
import { ArchbaseCheckbox } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseCheckbox label="Normal" />
      <ArchbaseCheckbox label="Marcado" isChecked />
      <ArchbaseCheckbox label="Obrigatorio" required />
      <ArchbaseCheckbox label="Desabilitado" disabled />
      <ArchbaseCheckbox label="Com erro" error="Voce deve aceitar" />
      <ArchbaseCheckbox label="Valores customizados (S/N)" trueValue="S" falseValue="N" />
    </>
  );
}
`;

export const checkboxStates: MantineDemo = {
  type: 'code',
  component: ArchbaseCheckboxStates,
  code: checkboxStatesCode,
};

// ============================================================================
// ArchbaseSwitch Demos
// ============================================================================
import { ArchbaseSwitchUsage } from './ArchbaseSwitchUsage';
import { ArchbaseSwitchWithDataSource } from './ArchbaseSwitchWithDataSource';
import { ArchbaseSwitchStates } from './ArchbaseSwitchStates';

const switchUsageCode = `
import { useState } from 'react';
import { ArchbaseSwitch } from '@archbase/components';

function Demo() {
  const [value, setValue] = useState<boolean>(false);

  return (
    <ArchbaseSwitch
      label="Modo escuro"
      isChecked={value}
      onChangeValue={(newValue) => setValue(newValue)}
      onLabel="ON"
      offLabel="OFF"
    />
  );
}
`;

export const switchUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseSwitchUsage,
  code: switchUsageCode,
};

const switchWithDataSourceCode = `
import { ArchbaseSwitch } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2({
    initialData: [{ id: '1', ativo: true, notificacoes: false }],
    name: 'dsUsuario',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseSwitch dataSource={dataSource} dataField="ativo" label="Usuario ativo" onLabel="SIM" offLabel="NAO" />
      <ArchbaseSwitch dataSource={dataSource} dataField="notificacoes" label="Receber notificacoes" />
    </>
  );
}
`;

export const switchWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseSwitchWithDataSource,
  code: switchWithDataSourceCode,
};

const switchStatesCode = `
import { ArchbaseSwitch } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseSwitch label="Normal" />
      <ArchbaseSwitch label="Ligado" isChecked />
      <ArchbaseSwitch label="Com labels" onLabel="ON" offLabel="OFF" />
      <ArchbaseSwitch label="Desabilitado" disabled />
      <ArchbaseSwitch label="Com erro" error="Ative esta opcao" />
      <ArchbaseSwitch label="Valores customizados (1/0)" trueValue={1} falseValue={0} />
    </>
  );
}
`;

export const switchStates: MantineDemo = {
  type: 'code',
  component: ArchbaseSwitchStates,
  code: switchStatesCode,
};

// ============================================================================
// ArchbaseDatePickerEdit Demos
// ============================================================================
import { ArchbaseDatePickerEditUsage } from './ArchbaseDatePickerEditUsage';
import { ArchbaseDatePickerEditWithDataSource } from './ArchbaseDatePickerEditWithDataSource';
import { ArchbaseDatePickerEditFormats } from './ArchbaseDatePickerEditFormats';
import { ArchbaseDatePickerEditStates } from './ArchbaseDatePickerEditStates';

const datePickerUsageCode = `
import { useState } from 'react';
import { ArchbaseDatePickerEdit } from '@archbase/components';

function Demo() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <ArchbaseDatePickerEdit
      label="Data de Nascimento"
      placeholder="Selecione a data..."
      onChange={(date) => setValue(date)}
      dateFormat="DD/MM/YYYY"
      clearable
    />
  );
}
`;

export const datePickerUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseDatePickerEditUsage,
  code: datePickerUsageCode,
};

const datePickerWithDataSourceCode = `
import { ArchbaseDatePickerEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2({
    initialData: [{ id: '1', nome: 'Maria', dataNascimento: '15/03/1990' }],
    name: 'dsPessoa',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseDatePickerEdit
        dataSource={dataSource}
        dataField="dataNascimento"
        label="Data de Nascimento"
        dateFormat="DD/MM/YYYY"
        clearable
      />
    </>
  );
}
`;

export const datePickerWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseDatePickerEditWithDataSource,
  code: datePickerWithDataSourceCode,
};

const datePickerFormatsCode = `
import { ArchbaseDatePickerEdit } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseDatePickerEdit label="DD/MM/YYYY" dateFormat="DD/MM/YYYY" />
      <ArchbaseDatePickerEdit label="DD-MM-YYYY" dateFormat="DD-MM-YYYY" />
      <ArchbaseDatePickerEdit label="YYYY/MM/DD" dateFormat="YYYY/MM/DD" />
      <ArchbaseDatePickerEdit label="YYYY-MM-DD" dateFormat="YYYY-MM-DD" />
    </>
  );
}
`;

export const datePickerFormats: MantineDemo = {
  type: 'code',
  component: ArchbaseDatePickerEditFormats,
  code: datePickerFormatsCode,
};

const datePickerStatesCode = `
import { ArchbaseDatePickerEdit } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseDatePickerEdit label="Normal" dateFormat="DD/MM/YYYY" clearable />
      <ArchbaseDatePickerEdit label="Obrigatorio" dateFormat="DD/MM/YYYY" required />
      <ArchbaseDatePickerEdit label="Desabilitado" value={new Date()} dateFormat="DD/MM/YYYY" disabled />
      <ArchbaseDatePickerEdit label="Somente leitura" value={new Date()} dateFormat="DD/MM/YYYY" readOnly />
      <ArchbaseDatePickerEdit label="Com erro" dateFormat="DD/MM/YYYY" error="Data invalida" />
      <ArchbaseDatePickerEdit label="Com limites" dateFormat="DD/MM/YYYY" minDate={new Date(2020, 0, 1)} maxDate={new Date(2025, 11, 31)} />
    </>
  );
}
`;

export const datePickerStates: MantineDemo = {
  type: 'code',
  component: ArchbaseDatePickerEditStates,
  code: datePickerStatesCode,
};

// ============================================================================
// ArchbaseNumberEdit Demos
// ============================================================================
import { ArchbaseNumberEditUsage } from './ArchbaseNumberEditUsage';
import { ArchbaseNumberEditWithDataSource } from './ArchbaseNumberEditWithDataSource';
import { ArchbaseNumberEditFormats } from './ArchbaseNumberEditFormats';
import { ArchbaseNumberEditStates } from './ArchbaseNumberEditStates';

const numberEditUsageCode = `
import { useState } from 'react';
import { ArchbaseNumberEdit } from '@archbase/components';

function Demo() {
  const [value, setValue] = useState<number | null>(0);

  return (
    <ArchbaseNumberEdit
      label="Valor"
      placeholder="Digite o valor..."
      onChangeValue={(masked, numValue) => setValue(numValue)}
      precision={2}
      decimalSeparator=","
      thousandSeparator="."
      clearable
    />
  );
}
`;

export const numberEditUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseNumberEditUsage,
  code: numberEditUsageCode,
};

const numberEditWithDataSourceCode = `
import { ArchbaseNumberEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2({
    initialData: [{ id: '1', nome: 'Notebook', preco: 2599.90, quantidade: 5 }],
    name: 'dsProduto',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseNumberEdit
        dataSource={dataSource}
        dataField="preco"
        label="Preco"
        precision={2}
        decimalSeparator=","
        thousandSeparator="."
        prefix="R$ "
      />

      <ArchbaseNumberEdit
        dataSource={dataSource}
        dataField="quantidade"
        label="Quantidade"
        integer
        suffix=" un"
      />
    </>
  );
}
`;

export const numberEditWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseNumberEditWithDataSource,
  code: numberEditWithDataSourceCode,
};

const numberEditFormatsCode = `
import { ArchbaseNumberEdit } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseNumberEdit label="Moeda (R$)" value={1234.56} precision={2} decimalSeparator="," thousandSeparator="." prefix="R$ " />
      <ArchbaseNumberEdit label="Moeda (USD)" value={1234.56} precision={2} decimalSeparator="." thousandSeparator="," prefix="$ " />
      <ArchbaseNumberEdit label="Inteiro" value={1000} integer thousandSeparator="." />
      <ArchbaseNumberEdit label="Percentual" value={25.5} precision={2} decimalSeparator="," suffix=" %" />
      <ArchbaseNumberEdit label="Permite negativos" value={-150.00} precision={2} allowNegative />
      <ArchbaseNumberEdit label="Com limites" value={50} precision={0} minValue={0} maxValue={100} />
    </>
  );
}
`;

export const numberEditFormats: MantineDemo = {
  type: 'code',
  component: ArchbaseNumberEditFormats,
  code: numberEditFormatsCode,
};

const numberEditStatesCode = `
import { ArchbaseNumberEdit } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseNumberEdit label="Normal" precision={2} decimalSeparator="," thousandSeparator="." clearable />
      <ArchbaseNumberEdit label="Com valor" value={1500.75} precision={2} decimalSeparator="," thousandSeparator="." />
      <ArchbaseNumberEdit label="Obrigatorio" precision={2} required />
      <ArchbaseNumberEdit label="Desabilitado" value={999.99} precision={2} disabled />
      <ArchbaseNumberEdit label="Somente leitura" value={999.99} precision={2} readOnly />
      <ArchbaseNumberEdit label="Com erro" precision={2} error="Valor deve ser maior que zero" />
    </>
  );
}
`;

export const numberEditStates: MantineDemo = {
  type: 'code',
  component: ArchbaseNumberEditStates,
  code: numberEditStatesCode,
};

// ============================================================================
// ArchbaseTimeEdit Demos
// ============================================================================
import { ArchbaseTimeEditUsage } from './ArchbaseTimeEditUsage';
import { ArchbaseTimeEditWithDataSource } from './ArchbaseTimeEditWithDataSource';
import { ArchbaseTimeEditStates } from './ArchbaseTimeEditStates';

const timeEditUsageCode = `
import { useState } from 'react';
import { ArchbaseTimeEdit } from '@archbase/components';

function Demo() {
  const [value, setValue] = useState<string>('');

  return (
    <ArchbaseTimeEdit
      label="Horario"
      placeholder="Selecione o horario..."
      value={value}
      onChangeValue={(newValue) => setValue(newValue || '')}
      clearable
    />
  );
}
`;

export const timeEditUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseTimeEditUsage,
  code: timeEditUsageCode,
};

const timeEditWithDataSourceCode = `
import { ArchbaseTimeEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Agendamento {
  id: string;
  descricao: string;
  horarioInicio: string;
  horarioFim: string;
}

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2<Agendamento>({
    initialData: [{ id: '1', descricao: 'Reuniao', horarioInicio: '09:00', horarioFim: '10:30' }],
    name: 'dsAgendamento',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseTimeEdit dataSource={dataSource} dataField="horarioInicio" label="Horario de Inicio" />
      <ArchbaseTimeEdit dataSource={dataSource} dataField="horarioFim" label="Horario de Fim" />
    </>
  );
}
`;

export const timeEditWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseTimeEditWithDataSource,
  code: timeEditWithDataSourceCode,
};

const timeEditStatesCode = `
import { ArchbaseTimeEdit } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseTimeEdit label="Normal" placeholder="Selecione..." clearable />
      <ArchbaseTimeEdit label="Com valor" value="14:30" />
      <ArchbaseTimeEdit label="Obrigatorio" required />
      <ArchbaseTimeEdit label="Desabilitado" value="09:00" disabled />
      <ArchbaseTimeEdit label="Somente leitura" value="18:45" readOnly />
      <ArchbaseTimeEdit label="Com erro" error="Horario invalido" />
    </>
  );
}
`;

export const timeEditStates: MantineDemo = {
  type: 'code',
  component: ArchbaseTimeEditStates,
  code: timeEditStatesCode,
};

// ============================================================================
// ArchbaseDateTimePickerEdit Demos
// ============================================================================
import { ArchbaseDateTimePickerEditUsage } from './ArchbaseDateTimePickerEditUsage';
import { ArchbaseDateTimePickerEditWithDataSource } from './ArchbaseDateTimePickerEditWithDataSource';
import { ArchbaseDateTimePickerEditStates } from './ArchbaseDateTimePickerEditStates';

const dateTimePickerUsageCode = `
import { useState } from 'react';
import { ArchbaseDateTimePickerEdit } from '@archbase/components';

function Demo() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <ArchbaseDateTimePickerEdit
      label="Data e Hora"
      placeholder="Selecione data e hora..."
      value={value}
      onChangeValue={(newValue) => setValue(newValue)}
      clearable
    />
  );
}
`;

export const dateTimePickerUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseDateTimePickerEditUsage,
  code: dateTimePickerUsageCode,
};

const dateTimePickerWithDataSourceCode = `
import { ArchbaseDateTimePickerEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Evento {
  id: string;
  titulo: string;
  dataHoraInicio: Date;
  dataHoraFim: Date;
}

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2<Evento>({
    initialData: [{ id: '1', titulo: 'Reuniao', dataHoraInicio: new Date(2024, 0, 15, 9, 0), dataHoraFim: new Date(2024, 0, 15, 11, 0) }],
    name: 'dsEvento',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseDateTimePickerEdit dataSource={dataSource} dataField="dataHoraInicio" label="Inicio" />
      <ArchbaseDateTimePickerEdit dataSource={dataSource} dataField="dataHoraFim" label="Fim" />
    </>
  );
}
`;

export const dateTimePickerWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseDateTimePickerEditWithDataSource,
  code: dateTimePickerWithDataSourceCode,
};

const dateTimePickerStatesCode = `
import { ArchbaseDateTimePickerEdit } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseDateTimePickerEdit label="Normal" placeholder="Selecione..." clearable />
      <ArchbaseDateTimePickerEdit label="Com valor" value={new Date(2024, 5, 15, 14, 30)} />
      <ArchbaseDateTimePickerEdit label="Obrigatorio" required />
      <ArchbaseDateTimePickerEdit label="Desabilitado" value={new Date()} disabled />
      <ArchbaseDateTimePickerEdit label="Somente leitura" value={new Date()} readOnly />
      <ArchbaseDateTimePickerEdit label="Com erro" error="Data e hora invalidas" />
    </>
  );
}
`;

export const dateTimePickerStates: MantineDemo = {
  type: 'code',
  component: ArchbaseDateTimePickerEditStates,
  code: dateTimePickerStatesCode,
};

// ============================================================================
// ArchbaseRating Demos
// ============================================================================
import { ArchbaseRatingUsage } from './ArchbaseRatingUsage';
import { ArchbaseRatingWithDataSource } from './ArchbaseRatingWithDataSource';
import { ArchbaseRatingSizes } from './ArchbaseRatingSizes';
import { ArchbaseRatingStates } from './ArchbaseRatingStates';

const ratingUsageCode = `
import { useState } from 'react';
import { ArchbaseRating } from '@archbase/components';

function Demo() {
  const [value, setValue] = useState<number>(0);

  return (
    <ArchbaseRating
      label="Avaliacao"
      value={value}
      onChangeValue={(newValue) => setValue(newValue || 0)}
    />
  );
}
`;

export const ratingUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseRatingUsage,
  code: ratingUsageCode,
};

const ratingWithDataSourceCode = `
import { ArchbaseRating } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Produto {
  id: string;
  nome: string;
  avaliacao: number;
}

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2<Produto>({
    initialData: [{ id: '1', nome: 'Smartphone XYZ', avaliacao: 4 }],
    name: 'dsProduto',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseRating dataSource={dataSource} dataField="avaliacao" label="Avaliacao do Produto" />
    </>
  );
}
`;

export const ratingWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseRatingWithDataSource,
  code: ratingWithDataSourceCode,
};

const ratingSizesCode = `
import { ArchbaseRating } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseRating label="Extra pequeno (xs)" value={3} size="xs" />
      <ArchbaseRating label="Pequeno (sm)" value={3} size="sm" />
      <ArchbaseRating label="Medio (md)" value={3} size="md" />
      <ArchbaseRating label="Grande (lg)" value={3} size="lg" />
      <ArchbaseRating label="Extra grande (xl)" value={3} size="xl" />
    </>
  );
}
`;

export const ratingSizes: MantineDemo = {
  type: 'code',
  component: ArchbaseRatingSizes,
  code: ratingSizesCode,
};

const ratingStatesCode = `
import { ArchbaseRating } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseRating label="Normal" value={0} />
      <ArchbaseRating label="Com valor" value={4} />
      <ArchbaseRating label="10 estrelas" value={7} count={10} />
      <ArchbaseRating label="Com fracao (meia estrela)" value={3.5} fractions={2} />
      <ArchbaseRating label="Desabilitado" value={3} disabled />
      <ArchbaseRating label="Somente leitura" value={5} readOnly />
    </>
  );
}
`;

export const ratingStates: MantineDemo = {
  type: 'code',
  component: ArchbaseRatingStates,
  code: ratingStatesCode,
};

// ============================================================================
// ArchbaseLookupEdit Demos
// ============================================================================
import { ArchbaseLookupEditUsage } from './ArchbaseLookupEditUsage';
import { ArchbaseLookupEditWithDataSource } from './ArchbaseLookupEditWithDataSource';
import { ArchbaseLookupEditStates } from './ArchbaseLookupEditStates';

const lookupEditUsageCode = `
import { useState } from 'react';
import { Modal, Table, Button } from '@mantine/core';
import { ArchbaseLookupEdit } from '@archbase/components';

interface Cliente {
  id: string;
  nome: string;
  email: string;
}

function Demo() {
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <>
      <ArchbaseLookupEdit
        label="Cliente"
        placeholder="Clique no icone para buscar..."
        value={selectedCliente?.nome || ''}
        readOnly
        onActionSearchExecute={() => setModalOpened(true)}
        tooltipIconSearch="Buscar cliente"
        clearable
        onClear={() => setSelectedCliente(null)}
      />

      <Modal opened={modalOpened} onClose={() => setModalOpened(false)}>
        {/* Lista de clientes para selecao */}
      </Modal>
    </>
  );
}
`;

export const lookupEditUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseLookupEditUsage,
  code: lookupEditUsageCode,
};

const lookupEditWithDataSourceCode = `
import { ArchbaseLookupEdit, ArchbaseEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2({
    initialData: [{ id: '1', descricao: 'Pedido', clienteId: '1', clienteNome: 'Joao' }],
    name: 'dsPedido',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseEdit dataSource={dataSource} dataField="descricao" label="Descricao" />

      <ArchbaseLookupEdit
        dataSource={dataSource}
        dataField="clienteNome"
        label="Cliente"
        readOnly
        onActionSearchExecute={() => setModalOpened(true)}
        clearable
        onClear={() => {
          dataSource.setFieldValue('clienteId', '');
          dataSource.setFieldValue('clienteNome', '');
        }}
      />
    </>
  );
}
`;

export const lookupEditWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseLookupEditWithDataSource,
  code: lookupEditWithDataSourceCode,
};

const lookupEditStatesCode = `
import { ArchbaseLookupEdit } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseLookupEdit label="Normal" onActionSearchExecute={() => alert('Buscar')} />
      <ArchbaseLookupEdit label="Com valor" value="Joao Silva" readOnly onActionSearchExecute={() => {}} clearable />
      <ArchbaseLookupEdit label="Obrigatorio" required onActionSearchExecute={() => {}} />
      <ArchbaseLookupEdit label="Desabilitado" value="Maria" disabled onActionSearchExecute={() => {}} />
      <ArchbaseLookupEdit label="Com erro" error="Selecione um cliente" onActionSearchExecute={() => {}} />
    </>
  );
}
`;

export const lookupEditStates: MantineDemo = {
  type: 'code',
  component: ArchbaseLookupEditStates,
  code: lookupEditStatesCode,
};

// ============================================================================
// ArchbaseImageEdit Demos
// ============================================================================
import { ArchbaseImageEditUsage } from './ArchbaseImageEditUsage';
import { ArchbaseImageEditWithDataSource } from './ArchbaseImageEditWithDataSource';
import { ArchbaseImageEditStates } from './ArchbaseImageEditStates';

const imageEditUsageCode = `
import { useState } from 'react';
import { ArchbaseImageEdit } from '@archbase/components';

function Demo() {
  const [imageBase64, setImageBase64] = useState<string>('');

  return (
    <ArchbaseImageEdit
      label="Foto do Produto"
      width={200}
      height={200}
      onChangeImage={(base64) => setImageBase64(base64 || '')}
      allowClear
    />
  );
}
`;

export const imageEditUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseImageEditUsage,
  code: imageEditUsageCode,
};

const imageEditWithDataSourceCode = `
import { ArchbaseImageEdit, ArchbaseEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Produto {
  id: string;
  nome: string;
  foto: string;
}

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2<Produto>({
    initialData: [{ id: '1', nome: 'Notebook', foto: '' }],
    name: 'dsProduto',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseEdit dataSource={dataSource} dataField="nome" label="Nome" />
      <ArchbaseImageEdit dataSource={dataSource} dataField="foto" label="Foto" width={200} height={200} allowClear />
    </>
  );
}
`;

export const imageEditWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseImageEditWithDataSource,
  code: imageEditWithDataSourceCode,
};

const imageEditStatesCode = `
import { ArchbaseImageEdit } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseImageEdit label="Normal" width={120} height={120} allowClear />
      <ArchbaseImageEdit label="Obrigatorio" width={120} height={120} required />
      <ArchbaseImageEdit label="Desabilitado" width={120} height={120} disabled />
      <ArchbaseImageEdit label="Somente leitura" width={120} height={120} readOnly />
      <ArchbaseImageEdit label="Com erro" width={120} height={120} error="Imagem obrigatoria" />
    </>
  );
}
`;

export const imageEditStates: MantineDemo = {
  type: 'code',
  component: ArchbaseImageEditStates,
  code: imageEditStatesCode,
};

// ============================================================================
// ArchbaseChip Demos
// ============================================================================
import { ArchbaseChipUsage } from './ArchbaseChipUsage';
import { ArchbaseChipWithDataSource } from './ArchbaseChipWithDataSource';
import { ArchbaseChipStates } from './ArchbaseChipStates';

const chipUsageCode = `
import { useState } from 'react';
import { ArchbaseChip } from '@archbase/components';

function Demo() {
  const [checked, setChecked] = useState(false);

  return (
    <ArchbaseChip
      label="Ativo"
      checked={checked}
      onChangeValue={(value) => setChecked(value)}
    />
  );
}
`;

export const chipUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseChipUsage,
  code: chipUsageCode,
};

const chipWithDataSourceCode = `
import { ArchbaseChip } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2({
    initialData: [{ id: '1', notificacoesAtivas: true, modoEscuro: false }],
    name: 'dsConfig',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseChip dataSource={dataSource} dataField="notificacoesAtivas" label="Notificacoes" />
      <ArchbaseChip dataSource={dataSource} dataField="modoEscuro" label="Modo Escuro" />
    </>
  );
}
`;

export const chipWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseChipWithDataSource,
  code: chipWithDataSourceCode,
};

const chipStatesCode = `
import { ArchbaseChip } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseChip label="Normal" checked={false} />
      <ArchbaseChip label="Selecionado" checked={true} />
      <ArchbaseChip label="Desabilitado" checked={false} disabled />
      <ArchbaseChip label="Extra small" size="xs" />
      <ArchbaseChip label="Large" size="lg" />
      <ArchbaseChip label="Blue" color="blue" checked />
      <ArchbaseChip label="Green" color="green" checked />
    </>
  );
}
`;

export const chipStates: MantineDemo = {
  type: 'code',
  component: ArchbaseChipStates,
  code: chipStatesCode,
};

// ============================================================================
// ArchbaseChipGroup Demos
// ============================================================================
import { ArchbaseChipGroupUsage } from './ArchbaseChipGroupUsage';
import { ArchbaseChipGroupWithDataSource } from './ArchbaseChipGroupWithDataSource';
import { ArchbaseChipGroupStates } from './ArchbaseChipGroupStates';

const chipGroupUsageCode = `
import { useState } from 'react';
import { ArchbaseChipGroup } from '@archbase/components';

const categorias = [
  { value: 'eletronicos', label: 'Eletronicos' },
  { value: 'roupas', label: 'Roupas' },
  { value: 'alimentos', label: 'Alimentos' },
];

function Demo() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <ArchbaseChipGroup
      label="Categorias"
      initialOptions={categorias}
      getOptionLabel={(opt) => opt.label}
      getOptionValue={(opt) => opt.value}
      onChangeValues={(values) => setSelectedValues(values)}
      multiple
    />
  );
}
`;

export const chipGroupUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseChipGroupUsage,
  code: chipGroupUsageCode,
};

const chipGroupWithDataSourceCode = `
import { ArchbaseChipGroup, ArchbaseEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

const categorias = [
  { value: 'eletronicos', label: 'Eletronicos' },
  { value: 'informatica', label: 'Informatica' },
  { value: 'games', label: 'Games' },
];

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2({
    initialData: [{ id: '1', nome: 'Notebook', categorias: ['eletronicos', 'informatica'] }],
    name: 'dsProduto',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseEdit dataSource={dataSource} dataField="nome" label="Nome" />
      <ArchbaseChipGroup
        dataSource={dataSource}
        dataField="categorias"
        label="Categorias"
        initialOptions={categorias}
        getOptionLabel={(opt) => opt.label}
        getOptionValue={(opt) => opt.value}
        multiple
      />
    </>
  );
}
`;

export const chipGroupWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseChipGroupWithDataSource,
  code: chipGroupWithDataSourceCode,
};

const chipGroupStatesCode = `
import { ArchbaseChipGroup } from '@archbase/components';

const opcoes = [
  { value: 'opcao1', label: 'Opcao 1' },
  { value: 'opcao2', label: 'Opcao 2' },
  { value: 'opcao3', label: 'Opcao 3' },
];

function Demo() {
  return (
    <>
      <ArchbaseChipGroup label="Selecao unica" initialOptions={opcoes} getOptionLabel={(o) => o.label} getOptionValue={(o) => o.value} />
      <ArchbaseChipGroup label="Selecao multipla" initialOptions={opcoes} getOptionLabel={(o) => o.label} getOptionValue={(o) => o.value} multiple />
      <ArchbaseChipGroup label="Desabilitado" initialOptions={opcoes} getOptionLabel={(o) => o.label} getOptionValue={(o) => o.value} disabled />
      <ArchbaseChipGroup label="Obrigatorio" initialOptions={opcoes} getOptionLabel={(o) => o.label} getOptionValue={(o) => o.value} required />
    </>
  );
}
`;

export const chipGroupStates: MantineDemo = {
  type: 'code',
  component: ArchbaseChipGroupStates,
  code: chipGroupStatesCode,
};

// ============================================================================
// ArchbaseKeyValueEditor Demos
// ============================================================================
import { ArchbaseKeyValueEditorUsage } from './ArchbaseKeyValueEditorUsage';
import { ArchbaseKeyValueEditorWithDataSource } from './ArchbaseKeyValueEditorWithDataSource';
import { ArchbaseKeyValueEditorStates } from './ArchbaseKeyValueEditorStates';

const keyValueEditorUsageCode = `
import { useState } from 'react';
import { ArchbaseKeyValueEditor } from '@archbase/components';

function Demo() {
  const [values, setValues] = useState<Record<string, string>>({
    API_URL: 'https://api.example.com',
    API_KEY: 'abc123',
  });

  return (
    <ArchbaseKeyValueEditor
      label="Variaveis de Ambiente"
      value={values}
      onChange={setValues}
      keyPlaceholder="Nome da variavel"
      valuePlaceholder="Valor"
    />
  );
}
`;

export const keyValueEditorUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseKeyValueEditorUsage,
  code: keyValueEditorUsageCode,
};

const keyValueEditorWithDataSourceCode = `
import { ArchbaseKeyValueEditor, ArchbaseEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2({
    initialData: [{ id: '1', nome: 'Config', parametros: { DB: 'localhost' } }],
    name: 'dsConfig',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseEdit dataSource={dataSource} dataField="nome" label="Nome" />
      <ArchbaseKeyValueEditor dataSource={dataSource} dataField="parametros" label="Parametros" />
    </>
  );
}
`;

export const keyValueEditorWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseKeyValueEditorWithDataSource,
  code: keyValueEditorWithDataSourceCode,
};

const keyValueEditorStatesCode = `
import { ArchbaseKeyValueEditor } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseKeyValueEditor label="Normal" value={{}} onChange={() => {}} />
      <ArchbaseKeyValueEditor label="Com valores" value={{ chave1: 'valor1' }} onChange={() => {}} />
      <ArchbaseKeyValueEditor label="Obrigatorio" value={{}} onChange={() => {}} required />
      <ArchbaseKeyValueEditor label="Desabilitado" value={{ API: 'secret' }} onChange={() => {}} disabled />
      <ArchbaseKeyValueEditor label="Somente leitura" value={{ DB: 'prod' }} onChange={() => {}} readOnly />
    </>
  );
}
`;

export const keyValueEditorStates: MantineDemo = {
  type: 'code',
  component: ArchbaseKeyValueEditorStates,
  code: keyValueEditorStatesCode,
};

// ============================================================================
// ArchbaseFileAttachment Demos
// ============================================================================
import { ArchbaseFileAttachmentUsage } from './ArchbaseFileAttachmentUsage';
import { ArchbaseFileAttachmentWithDataSource } from './ArchbaseFileAttachmentWithDataSource';
import { ArchbaseFileAttachmentStates } from './ArchbaseFileAttachmentStates';

const fileAttachmentUsageCode = `
import { useState } from 'react';
import { ArchbaseFileAttachment } from '@archbase/components';

function Demo() {
  const [files, setFiles] = useState([]);

  return (
    <ArchbaseFileAttachment
      label="Anexos"
      onFilesChange={(newFiles) => setFiles(newFiles)}
      accept="image/*,.pdf,.doc,.docx"
      maxSize={5 * 1024 * 1024} // 5MB
      multiple
    />
  );
}
`;

export const fileAttachmentUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseFileAttachmentUsage,
  code: fileAttachmentUsageCode,
};

const fileAttachmentWithDataSourceCode = `
import { ArchbaseFileAttachment, ArchbaseEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2({
    initialData: [{ id: '1', titulo: 'Contrato', anexos: '[]' }],
    name: 'dsDocumento',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseEdit dataSource={dataSource} dataField="titulo" label="Titulo" />
      <ArchbaseFileAttachment dataSource={dataSource} dataField="anexos" label="Anexos" accept=".pdf" multiple />
    </>
  );
}
`;

export const fileAttachmentWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseFileAttachmentWithDataSource,
  code: fileAttachmentWithDataSourceCode,
};

const fileAttachmentStatesCode = `
import { ArchbaseFileAttachment } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseFileAttachment label="Normal" accept="*" multiple />
      <ArchbaseFileAttachment label="Arquivo unico" accept="*" multiple={false} />
      <ArchbaseFileAttachment label="Apenas imagens" accept="image/*" multiple />
      <ArchbaseFileAttachment label="Apenas PDF" accept=".pdf" multiple />
      <ArchbaseFileAttachment label="Limite 2MB" accept="*" maxSize={2 * 1024 * 1024} multiple />
      <ArchbaseFileAttachment label="Desabilitado" accept="*" disabled />
      <ArchbaseFileAttachment label="Obrigatorio" accept="*" required />
      <ArchbaseFileAttachment label="Com erro" accept="*" error="Anexe pelo menos um arquivo" />
    </>
  );
}
`;

export const fileAttachmentStates: MantineDemo = {
  type: 'code',
  component: ArchbaseFileAttachmentStates,
  code: fileAttachmentStatesCode,
};

// ============================================================================
// ArchbaseRichTextEdit Demos
// ============================================================================
import { ArchbaseRichTextEditUsage } from './ArchbaseRichTextEditUsage';
import { ArchbaseRichTextEditWithDataSource } from './ArchbaseRichTextEditWithDataSource';
import { ArchbaseRichTextEditStates } from './ArchbaseRichTextEditStates';

const richTextEditUsageCode = `
import { useState } from 'react';
import { ArchbaseRichTextEdit } from '@archbase/components';

function Demo() {
  const [content, setContent] = useState<string>('');

  return (
    <ArchbaseRichTextEdit
      label="Descricao"
      placeholder="Digite o texto rico..."
      value={content}
      onChangeValue={(newValue) => setContent(newValue || '')}
      height={300}
    />
  );
}
`;

export const richTextEditUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseRichTextEditUsage,
  code: richTextEditUsageCode,
};

const richTextEditWithDataSourceCode = `
import { ArchbaseRichTextEdit, ArchbaseEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Artigo {
  id: string;
  titulo: string;
  conteudo: string;
}

function Demo() {
  const { dataSource, edit, save, cancel, isBrowsing } = useArchbaseDataSourceV2<Artigo>({
    initialData: [{ id: '1', titulo: 'Meu Artigo', conteudo: '' }],
    name: 'dsArtigo',
  });

  return (
    <>
      <Button onClick={edit} disabled={!isBrowsing}>Editar</Button>
      <Button onClick={() => save()} disabled={isBrowsing}>Salvar</Button>

      <ArchbaseEdit dataSource={dataSource} dataField="titulo" label="Titulo" />
      <ArchbaseRichTextEdit dataSource={dataSource} dataField="conteudo" label="Conteudo" height={300} />
    </>
  );
}
`;

export const richTextEditWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseRichTextEditWithDataSource,
  code: richTextEditWithDataSourceCode,
};

const richTextEditStatesCode = `
import { ArchbaseRichTextEdit } from '@archbase/components';

function Demo() {
  return (
    <>
      <ArchbaseRichTextEdit label="Normal" height={200} />
      <ArchbaseRichTextEdit label="Com conteudo" value="<p>Texto <b>negrito</b></p>" height={200} />
      <ArchbaseRichTextEdit label="Obrigatorio" height={200} required />
      <ArchbaseRichTextEdit label="Desabilitado" height={200} disabled />
      <ArchbaseRichTextEdit label="Somente leitura" value="<p>Nao editavel</p>" height={200} readOnly />
      <ArchbaseRichTextEdit label="Com erro" height={200} error="Conteudo obrigatorio" />
    </>
  );
}
`;

export const richTextEditStates: MantineDemo = {
  type: 'code',
  component: ArchbaseRichTextEditStates,
  code: richTextEditStatesCode,
};

// ============================================================================
// ArchbaseAsyncMultiSelect Demos
// ============================================================================
import { ArchbaseAsyncMultiSelectUsage } from './ArchbaseAsyncMultiSelectUsage';
import { ArchbaseAsyncMultiSelectWithDataSource } from './ArchbaseAsyncMultiSelectWithDataSource';

const asyncMultiSelectUsageCode = `
import { useState } from 'react';
import { ArchbaseAsyncMultiSelect, OptionsResult } from '@archbase/components';

interface Tag {
  id: string;
  nome: string;
}

const mockTags: Tag[] = [
  { id: '1', nome: 'React' },
  { id: '2', nome: 'Vue' },
  { id: '3', nome: 'Angular' },
];

const searchTags = async (page: number, query: string): Promise<OptionsResult<Tag>> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const filtered = mockTags.filter(t => t.nome.toLowerCase().includes(query.toLowerCase()));
  return { options: filtered, page: 0, totalPages: 1 };
};

function Demo() {
  const [values, setValues] = useState<Tag[]>([]);

  return (
    <ArchbaseAsyncMultiSelect
      label="Tecnologias"
      placeholder="Digite para buscar tecnologias..."
      getOptions={searchTags}
      getOptionLabel={(tag) => tag.nome}
      getOptionValue={(tag) => tag.id}
      onChangeValues={(selected) => setValues(selected)}
      minCharsToSearch={1}
      clearable
      searchable
    />
  );
}
`;

export const asyncMultiSelectUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseAsyncMultiSelectUsage,
  code: asyncMultiSelectUsageCode,
};

const asyncMultiSelectWithDataSourceCode = `
import { ArchbaseAsyncMultiSelect, OptionsResult } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Produto {
  id: string;
  nome: string;
  tags: string[];
}

interface Tag {
  id: string;
  nome: string;
}

const mockTags: Tag[] = [
  { id: '1', nome: 'Eletronicos' },
  { id: '2', nome: 'Roupas' },
];

const searchTags = async (page: number, query: string): Promise<OptionsResult<Tag>> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const filtered = mockTags.filter(t => t.nome.toLowerCase().includes(query.toLowerCase()));
  return { options: filtered, page: 0, totalPages: 1 };
};

const getTagsByIds = async (ids: string[]): Promise<Tag[]> => {
  return mockTags.filter(t => ids.includes(t.id));
};

function Demo() {
  const produtoData: Produto = {
    id: '1',
    nome: 'Notebook Dell',
    tags: ['1', '2'],
  };

  const { dataSource } = useArchbaseDataSource<Produto, string>({
    initialData: [produtoData],
    name: 'dsProdutoAsyncMultiSelect',
  });

  return (
    <>
      <Button onClick={() => dataSource.edit()}>Editar</Button>
      <Button onClick={() => dataSource.save()}>Salvar</Button>

      <ArchbaseAsyncMultiSelect<Produto, string, Tag>
        dataSource={dataSource}
        dataField="tags"
        label="Tags"
        placeholder="Selecione as tags..."
        getOptions={searchTags}
        getOptionLabel={(tag) => tag.nome}
        getOptionValue={(tag) => tag.id}
        converter={(tags) => tags.map(t => t.id)}
        getConvertedOptions={getTagsByIds}
        minCharsToSearch={0}
        searchable
      />
    </>
  );
}
`;

export const asyncMultiSelectWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseAsyncMultiSelectWithDataSource,
  code: asyncMultiSelectWithDataSourceCode,
};

// ============================================================================
// ArchbaseTreeSelect Demos
// ============================================================================
import { ArchbaseTreeSelectUsage } from './ArchbaseTreeSelectUsage';

const treeSelectUsageCode = `
import { useState } from 'react';
import { ArchbaseTreeSelect, ArchbaseTreeNode } from '@archbase/components';

const treeData: ArchbaseTreeNode[] = [
  {
    id: '1',
    label: 'Eletronicos',
    value: 'eletronicos',
    children: [
      {
        id: '1-1',
        label: 'Celulares',
        value: 'celulares',
        children: [
          { id: '1-1-1', label: 'iPhone', value: 'iphone' },
          { id: '1-1-2', label: 'Samsung', value: 'samsung' },
        ],
      },
    ],
  },
];

function Demo() {
  const [value, setValue] = useState<ArchbaseTreeNode | null>(null);

  return (
    <ArchbaseTreeSelect
      label="Categoria"
      placeholder="Selecione uma categoria..."
      options={treeData}
      getOptionLabel={(node) => node.label}
      getOptionValue={(node) => node.value}
      onChangeValues={(node) => setValue(node)}
    />
  );
}
`;

export const treeSelectUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseTreeSelectUsage,
  code: treeSelectUsageCode,
};

// ============================================================================
// ArchbaseLookupSelect Demos
// ============================================================================
import { ArchbaseLookupSelectUsage } from './ArchbaseLookupSelectUsage';

const lookupSelectUsageCode = `
import { useState } from 'react';
import { ArchbaseLookupSelect } from '@archbase/components';

interface Cliente {
  id: string;
  nome: string;
  tipoClienteId: string;
}

interface TipoCliente {
  id: string;
  descricao: string;
}

const tiposClienteData: TipoCliente[] = [
  { id: '1', descricao: 'Pessoa Fisica' },
  { id: '2', descricao: 'Pessoa Juridica' },
  { id: '3', descricao: 'Governamental' },
];

function Demo() {
  const [value, setValue] = useState<TipoCliente | null>(null);

  return (
    <ArchbaseLookupSelect<Cliente, string, TipoCliente>
      label="Tipo de Cliente"
      placeholder="Selecione o tipo..."
      value={value}
      onChangeValue={setValue}
      initialOptions={tiposClienteData}
      getOptionLabel={(tipo) => tipo.descricao}
      getOptionValue={(tipo) => tipo.id}
      onChangeValues={(tipo) => setValue(tipo)}
      clearable
    />
  );
}
`;

export const lookupSelectUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseLookupSelectUsage,
  code: lookupSelectUsageCode,
};

// ============================================================================
// ArchbaseLookupNumber Demos
// ============================================================================
import { ArchbaseLookupNumberUsage } from './ArchbaseLookupNumberUsage';

const lookupNumberUsageCode = `
import { useState } from 'react';
import { ArchbaseLookupNumber } from '@archbase/components';

interface Produto {
  id: string;
  nome: string;
  precoUnitario: number;
}

interface ProdutoPreco {
  id: string;
  nome: string;
  preco: number;
}

const lookupProdutoPreco = async (codigo: string): Promise<ProdutoPreco> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    id: codigo,
    nome: 'Notebook Dell',
    preco: 3500.50,
  };
};

function Demo() {
  const [value, setValue] = useState<number>(0);

  return (
    <ArchbaseLookupNumber<Produto, string, ProdutoPreco>
      label="Preco Unitario"
      placeholder="Digite o codigo..."
      value={value}
      onChangeValue={setValue}
      lookupValueDelegator={lookupProdutoPreco}
      onLookupResult={(result) => {
        setValue(result.preco);
      }}
      decimalSeparator=","
      thousandSeparator="."
      precision={2}
      allowNegative={false}
    />
  );
}
`;

export const lookupNumberUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseLookupNumberUsage,
  code: lookupNumberUsageCode,
};

// ============================================================================
// ArchbaseOperationHoursEditor Demos
// ============================================================================
import { ArchbaseOperationHoursEditorUsage } from './ArchbaseOperationHoursEditorUsage';
import { ArchbaseOperationHoursEditorStates } from './ArchbaseOperationHoursEditorStates';

const operationHoursEditorUsageCode = `
import { useState } from 'react';
import { ArchbaseOperatingHoursEditor } from '@archbase/components';

function Demo() {
  const [value, setValue] = useState<string>('');

  return (
    <ArchbaseOperatingHoursEditor
      label="Horário de Funcionamento"
      initialValue={value}
      onChange={setValue}
    />
  );
}
`;

export const operationHoursEditorUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseOperationHoursEditorUsage,
  code: operationHoursEditorUsageCode,
};

const operationHoursEditorStatesCode = `
import { useState } from 'react';
import { ArchbaseOperatingHoursEditor } from '@archbase/components';

function Demo() {
  const [preFilledValue, setPreFilledValue] = useState<string>(
    'MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY|09:00-18:00;SATURDAY,SUNDAY|10:00-14:00'
  );

  return (
    <>
      <ArchbaseOperatingHoursEditor
        label="Normal"
        initialValue={''}
        onChange={() => {}}
      />
      <ArchbaseOperatingHoursEditor
        label="Com valores preenchidos"
        initialValue={preFilledValue}
        onChange={setPreFilledValue}
      />
      <ArchbaseOperatingHoursEditor
        label="Somente leitura"
        initialValue={preFilledValue}
        onChange={() => {}}
        readOnly
      />
    </>
  );
}
`;

export const operationHoursEditorStates: MantineDemo = {
  type: 'code',
  component: ArchbaseOperationHoursEditorStates,
  code: operationHoursEditorStatesCode,
};

// ============================================================================
// ArchbaseCronExpressionEdit Demos
// ============================================================================
import { ArchbaseCronExpressionEditUsage } from './ArchbaseCronExpressionEditUsage';
import { ArchbaseCronExpressionEditStates } from './ArchbaseCronExpressionEditStates';

const cronExpressionEditUsageCode = `
import { useState } from 'react';
import { ArchbaseCronExpressionEdit } from '@archbase/components';

function Demo() {
  const [value, setValue] = useState<string>('0 0 * * *');

  return (
    <ArchbaseCronExpressionEdit
      label="Expressão Cron"
      value={value}
      onChange={setValue}
      placeholder="Digite a expressão cron..."
    />
  );
}
`;

export const cronExpressionEditUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseCronExpressionEditUsage,
  code: cronExpressionEditUsageCode,
};

const cronExpressionEditStatesCode = `
import { useState } from 'react';
import { ArchbaseCronExpressionEdit } from '@archbase/components';

function Demo() {
  const [dailyValue, setDailyValue] = useState<string>('0 0 * * *');
  const [weeklyValue, setWeeklyValue] = useState<string>('0 0 * * 0');
  const [hourlyValue, setHourlyValue] = useState<string>('0 * * * *');

  return (
    <>
      <ArchbaseCronExpressionEdit
        label="Diariamente (meia-noite)"
        value={dailyValue}
        onChange={setDailyValue}
      />
      <ArchbaseCronExpressionEdit
        label="Semanalmente (domingo à meia-noite)"
        value={weeklyValue}
        onChange={setWeeklyValue}
      />
      <ArchbaseCronExpressionEdit
        label="A cada hora"
        value={hourlyValue}
        onChange={setHourlyValue}
      />
      <ArchbaseCronExpressionEdit
        label="Somente leitura"
        value={dailyValue}
        onChange={() => {}}
        readOnly
      />
    </>
  );
}
`;

export const cronExpressionEditStates: MantineDemo = {
  type: 'code',
  component: ArchbaseCronExpressionEditStates,
  code: cronExpressionEditStatesCode,
};

// ============================================================================
// ArchbaseCompositeFilters Demos
// ============================================================================
import { ArchbaseCompositeFiltersUsage } from '../filters/ArchbaseCompositeFiltersUsage';
import { ArchbaseCompositeFiltersWithDataSource } from '../filters/ArchbaseCompositeFiltersWithDataSource';

const compositeFiltersUsageCode = `
import { useState } from 'react';
import { ArchbaseCompositeFilters } from '@archbase/components';

const filterDefinitions = [
  { key: 'nome', label: 'Nome', type: 'text' },
  { key: 'idade', label: 'Idade', type: 'integer' },
  { key: 'ativo', label: 'Status', type: 'enum', options: [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
  ]},
];

function Demo() {
  const [filters, setFilters] = useState([]);

  return (
    <ArchbaseCompositeFilters
      filters={filterDefinitions}
      value={filters}
      onChange={(filters, rsql) => {
        console.log('RSQL:', rsql); // "nome=like=*João*;idade>18"
        setFilters(filters);
      }}
    />
  );
}
`;

export const compositeFiltersUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseCompositeFiltersUsage,
  code: compositeFiltersUsageCode,
};

const compositeFiltersWithDataSourceCode = `
import { useState } from 'react';
import { ArchbaseCompositeFilters, ArchbaseDataGrid } from '@archbase/components';

const quickFilters = [
  {
    id: 'ativos',
    name: 'Usuários Ativos',
    filters: [
      {
        key: 'ativo',
        label: 'Status',
        type: 'enum',
        operator: '=',
        value: 'ativo',
        displayValue: 'Ativo',
      },
    ],
  },
];

function Demo() {
  const [filters, setFilters] = useState([]);
  const [rsql, setRsql] = useState('');

  // Filtra dados baseado no RSQL
  const filteredData = data.filter(item => {
    // Aplicar filtros...
  });

  return (
    <>
      <ArchbaseCompositeFilters
        filters={filterDefinitions}
        value={filters}
        onChange={(newFilters, rsql) => {
          setFilters(newFilters);
          setRsql(rsql);
        }}
        quickFilters={quickFilters}
      />

      <ArchbaseDataGrid
        dataSource={{ records: filteredData }}
        columns={colunas}
      />
    </>
  );
}
`;

export const compositeFiltersWithDataSource: MantineDemo = {
  type: 'code',
  component: ArchbaseCompositeFiltersWithDataSource,
  code: compositeFiltersWithDataSourceCode,
};
