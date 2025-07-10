// Tipos de teste padronizados
export interface Pessoa {
  id: number;
  nome: string;
  email: string;
  idade: number;
  ativo: boolean;
  dataNascimento: Date;
  endereco: {
    rua: string;
    cidade: string;
    cep: string;
  };
  contatos: Array<{
    tipo: 'EMAIL' | 'TELEFONE';
    valor: string;
    principal: boolean;
  }>;
}

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  ativo: boolean;
  descricao?: string;
}

export interface Pedido {
  id: number;
  numero: string;
  data: Date;
  clienteId: number;
  total: number;
  status: 'PENDENTE' | 'CONFIRMADO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';
  itens: Array<{
    id: number;
    produtoId: number;
    quantidade: number;
    valor: number;
    observacoes?: string;
  }>;
}

// Factory functions para criar dados de teste
export const createTestData = {
  pessoa: (overrides: Partial<Pessoa> = {}): Pessoa => ({
    id: Math.floor(Math.random() * 1000),
    nome: 'João Silva',
    email: 'joao@test.com',
    idade: 30,
    ativo: true,
    dataNascimento: new Date('1990-01-01'),
    endereco: {
      rua: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      cep: '01234-567'
    },
    contatos: [
      { tipo: 'EMAIL', valor: 'joao@test.com', principal: true },
      { tipo: 'TELEFONE', valor: '(11) 99999-9999', principal: false }
    ],
    ...overrides
  }),
  
  pessoaList: (count: number = 5): Pessoa[] => 
    Array.from({ length: count }, (_, i) => createTestData.pessoa({ 
      id: i + 1, 
      nome: `Pessoa ${i + 1}`,
      email: `pessoa${i + 1}@test.com`
    })),

  produto: (overrides: Partial<Produto> = {}): Produto => ({
    id: Math.floor(Math.random() * 1000),
    nome: 'Produto Teste',
    preco: 99.99,
    categoria: 'Eletrônicos',
    ativo: true,
    descricao: 'Descrição do produto teste',
    ...overrides
  }),

  produtoList: (count: number = 5): Produto[] =>
    Array.from({ length: count }, (_, i) => createTestData.produto({
      id: i + 1,
      nome: `Produto ${i + 1}`,
      preco: (i + 1) * 10
    })),

  pedido: (overrides: Partial<Pedido> = {}): Pedido => ({
    id: Math.floor(Math.random() * 1000),
    numero: `PED-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    data: new Date(),
    clienteId: 1,
    total: 199.99,
    status: 'PENDENTE',
    itens: [
      {
        id: 1,
        produtoId: 1,
        quantidade: 2,
        valor: 99.99,
        observacoes: 'Item de teste'
      }
    ],
    ...overrides
  }),

  pedidoList: (count: number = 5): Pedido[] =>
    Array.from({ length: count }, (_, i) => createTestData.pedido({
      id: i + 1,
      numero: `PED-${String(i + 1).padStart(4, '0')}`,
      clienteId: i + 1
    }))
};

// Dados de teste para casos específicos
export const testScenarios = {
  // Pessoa com dados complexos
  pessoaCompleta: (): Pessoa => createTestData.pessoa({
    nome: 'Maria Santos Silva',
    email: 'maria.santos@empresa.com.br',
    idade: 35,
    endereco: {
      rua: 'Avenida Paulista, 1000 - Apt 150',
      cidade: 'São Paulo',
      cep: '01310-100'
    },
    contatos: [
      { tipo: 'EMAIL', valor: 'maria.santos@empresa.com.br', principal: true },
      { tipo: 'EMAIL', valor: 'maria.pessoal@gmail.com', principal: false },
      { tipo: 'TELEFONE', valor: '(11) 98765-4321', principal: true },
      { tipo: 'TELEFONE', valor: '(11) 3456-7890', principal: false }
    ]
  }),

  // Lista vazia
  listaVazia: (): any[] => [],

  // Lista com um item
  listaUmItem: (): Pessoa[] => [createTestData.pessoa({ id: 1, nome: 'Único Item' })],

  // Lista grande para testes de performance
  listaGrande: (size: number = 1000): Pessoa[] => 
    Array.from({ length: size }, (_, i) => createTestData.pessoa({
      id: i + 1,
      nome: `Pessoa ${i + 1}`,
      email: `pessoa${i + 1}@test.com`
    })),

  // Dados com caracteres especiais
  dadosEspeciais: (): Pessoa => createTestData.pessoa({
    nome: 'José María Ñuñez',
    email: 'josé.maría@tëst.com',
    endereco: {
      rua: 'Rüa dos Açaí, 123 - Ãpartamento 45',
      cidade: 'São José dos Campos',
      cep: '12345-678'
    }
  }),

  // Dados com valores extremos
  valoresExtremos: (): Produto => createTestData.produto({
    nome: 'A'.repeat(255), // Nome muito longo
    preco: 0.01, // Preço muito baixo
    categoria: '',
    descricao: undefined
  })
};

// Helpers para asserções de teste
export const testAssertions = {
  // Verificar se é uma pessoa válida
  isValidPessoa: (pessoa: any): pessoa is Pessoa => {
    return (
      typeof pessoa === 'object' &&
      typeof pessoa.id === 'number' &&
      typeof pessoa.nome === 'string' &&
      typeof pessoa.email === 'string' &&
      typeof pessoa.idade === 'number' &&
      typeof pessoa.ativo === 'boolean' &&
      pessoa.dataNascimento instanceof Date &&
      typeof pessoa.endereco === 'object' &&
      Array.isArray(pessoa.contatos)
    );
  },

  // Verificar se é um produto válido
  isValidProduto: (produto: any): produto is Produto => {
    return (
      typeof produto === 'object' &&
      typeof produto.id === 'number' &&
      typeof produto.nome === 'string' &&
      typeof produto.preco === 'number' &&
      typeof produto.categoria === 'string' &&
      typeof produto.ativo === 'boolean'
    );
  },

  // Verificar estrutura de página de resultados
  isValidPage: (page: any): boolean => {
    return (
      typeof page === 'object' &&
      Array.isArray(page.content) &&
      typeof page.totalElements === 'number' &&
      typeof page.totalPages === 'number' &&
      typeof page.number === 'number' &&
      typeof page.size === 'number'
    );
  }
};