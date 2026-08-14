/**
 * Modelo ficticio de teste.
 *
 * Nao existe, nao corresponde a nenhum produto e nao deve corresponder. Todo
 * dado aqui e sintetizado. Cobre deliberadamente os casos de borda do contrato
 * de metadados: membro sem `meta`, formato fora do vocabulario, `i18n` parcial e
 * membro sem `title`.
 */
import type { RawMetaResponse } from '../../src/meta/types';

export const FAKE_META: RawMetaResponse = {
  cubes: [
    {
      name: 'pedidos',
      title: 'Pedidos',
      type: 'view',
      measures: [
        {
          name: 'pedidos.receita_cents',
          title: 'Receita',
          type: 'number',
          aggType: 'sum',
          meta: {
            i18n: { 'pt-BR': 'Receita', en: 'Revenue' },
            i18n_description: {
              'pt-BR': 'Soma do valor dos pedidos, em centavos',
              en: 'Sum of order value, in cents',
            },
            format: 'currency_cents',
            group: 'Financeiro',
            default_viz: 'bar',
          },
        },
        {
          name: 'pedidos.itens_total',
          title: 'Itens',
          type: 'number',
          // Sem `aggType`: o formato passa a decidir o valor de preenchimento.
          // i18n so em pt-BR: exercita o fallback para `title` em outros locales.
          meta: {
            i18n: { 'pt-BR': 'Itens' },
            format: 'integer',
            group: 'Volume',
          },
        },
        {
          name: 'pedidos.margem_ratio',
          title: 'Margem',
          type: 'number',
          meta: {
            i18n: { 'pt-BR': 'Margem', en: 'Margin' },
            format: 'percent',
            group: 'Financeiro',
          },
        },
        {
          name: 'pedidos.peso_medio',
          title: 'Peso medio',
          type: 'number',
          aggType: 'avg',
          meta: {
            format: 'decimal',
            precision: 3,
            group: 'Logistica',
          },
        },
        {
          // Sem `meta`: formato resolve para `text`, sem visualizacao default.
          name: 'pedidos.sem_metadado',
          title: 'Sem metadado',
          type: 'number',
        },
        {
          // Formato fora do vocabulario: degrada para `text` com aviso.
          name: 'pedidos.formato_estranho',
          title: 'Formato estranho',
          type: 'number',
          meta: { format: 'parsecs' },
        },
      ],
      dimensions: [
        {
          name: 'pedidos.canal',
          title: 'Canal',
          type: 'string',
          meta: {
            i18n: { 'pt-BR': 'Canal', en: 'Channel', es: 'Canal' },
            format: 'text',
            group: 'Origem',
          },
        },
        {
          name: 'pedidos.regiao',
          title: 'Regiao',
          type: 'string',
          meta: {
            i18n: { 'pt-BR': 'Regiao' },
            format: 'text',
            group: 'Origem',
          },
        },
        {
          name: 'pedidos.criado_em',
          title: 'Criado em',
          type: 'time',
          meta: {
            i18n: { 'pt-BR': 'Criado em', en: 'Created at' },
            format: 'datetime',
            group: 'Tempo',
          },
        },
        {
          // Sem `title` e sem `i18n`: ultimo recurso da cadeia e o proprio nome.
          name: 'pedidos.sem_titulo',
          type: 'string',
        },
      ],
    },
  ],
};

/**
 * Introspeccao de um leitor de escopo restrito: o mesmo modelo sem os membros
 * financeiros. Usado nos testes de degradacao de consulta salva.
 */
export const FAKE_META_RESTRITA: RawMetaResponse = {
  cubes: [
    {
      name: 'pedidos',
      title: 'Pedidos',
      type: 'view',
      measures: [
        {
          name: 'pedidos.itens_total',
          title: 'Itens',
          type: 'number',
          meta: { i18n: { 'pt-BR': 'Itens' }, format: 'integer', group: 'Volume' },
        },
      ],
      dimensions: [
        {
          name: 'pedidos.canal',
          title: 'Canal',
          type: 'string',
          meta: { i18n: { 'pt-BR': 'Canal' }, format: 'text', group: 'Origem' },
        },
      ],
    },
  ],
};
