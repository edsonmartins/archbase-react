export enum PessoaStatus {
  APROVADO,
  REJEITADO,
  PENDENTE
}
export interface Pessoa {
  id: number;
  nome: string;
  idade?: number;
  cpf?: string;
  rg?: string;
  data_nasc?: string;
  sexo?: string;
  signo?: string;
  mae?: string;
  pai?: string;
  email?: string;
  senha?: string;
  cep?: string;
  endereco?: string;
  numero?: number;
  bairro?: string;
  cidade?: string;
  estado?: string;
  telefone_fixo?: string;
  celular?: string;
  altura?: string;
  peso?: number;
  avaliacao?: number;
  tipo_sanguineo?: string;
  cor?: string;
  foto?: string;
  status?: PessoaStatus;
  observacao?:string;
  codigoJson?:string;
}

export interface Produto {
  id: string;
  descricao: string;
  categoria: string;
  preco: number;
  unidade: string;
}

export enum PedidoStatus {
  PENDENTE = 0,
  FATURADO = 1,
  CANCELADO= 2
}

export interface PedidoItem {
  produto: Produto;
  quantidade: number;
  total: number;
}

export interface Pedido {
  codigo: number;
  cliente: Pessoa;
  dtPedido : string;
  dtFaturamento: string;
  status : PedidoStatus;
  vlTotal : number;
  itens: PedidoItem[]
}