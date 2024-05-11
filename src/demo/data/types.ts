import { Pessoa } from "./Pessoa";

export enum PessoaStatus {
  APROVADO,
  REJEITADO,
  PENDENTE
}

export enum Sexo {
  MASCULINO="Masculino",
  FEMININO="Feminino"
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