import { Pedido } from "./types";

export const pedidosData : Pedido[] = [
    {
      "codigo": 1,
      "cliente": {
        "id": 1,
        "nome": "Fulano da Silva"
      },
      "dtPedido": "2023-07-30",
      "dtFaturamento": "2023-07-31",
      "status": 1,
      "vlTotal": 2500.00,
      "itens": [
        {
          "produto": {
            "id": "1",
            "descricao": "Celular Smartphone",
            "categoria": "Eletrônicos",
            "preco": 1500.00,
            "unidade": "un"
          },
          "quantidade": 1,
          "total": 1500.00
        },
        {
          "produto": {
            "id": "2",
            "descricao": "Fone de Ouvido Bluetooth",
            "categoria": "Eletrônicos",
            "preco": 100.00,
            "unidade": "un"
          },
          "quantidade": 2,
          "total": 200.00
        }
      ]
    },
    {
      "codigo": 2,
      "cliente": {
        "id": 2,
        "nome": "Ciclana Oliveira"
      },
      "dtPedido": "2023-07-29",
      "dtFaturamento": "2023-07-30",
      "status": 1,
      "vlTotal": 1800.00,
      "itens": [
        {
          "produto": {
            "id": "3",
            "descricao": "Notebook",
            "categoria": "Eletrônicos",
            "preco": 2500.00,
            "unidade": "un"
          },
          "quantidade": 1,
          "total": 2500.00
        },
        {
          "produto": {
            "id": "1",
            "descricao": "Celular Smartphone",
            "categoria": "Eletrônicos",
            "preco": 1500.00,
            "unidade": "un"
          },
          "quantidade": 1,
          "total": 1500.00
        }
      ]
    },
    {
      "codigo": 3,
      "cliente": {
        "id": 3,
        "nome": "Beltrano Santos"
      },
      "dtPedido": "2023-07-28",
      "dtFaturamento": "2023-07-29",
      "status": 2,
      "vlTotal": 4000.00,
      "itens": [
        {
          "produto": {
            "id": "4",
            "descricao": "TV LED 55 polegadas",
            "categoria": "Eletrônicos",
            "preco": 3000.00,
            "unidade": "un"
          },
          "quantidade": 1,
          "total": 3000.00
        },
        {
          "produto": {
            "id": "5",
            "descricao": "Console de Videogame",
            "categoria": "Eletrônicos",
            "preco": 1000.00,
            "unidade": "un"
          },
          "quantidade": 2,
          "total": 2000.00
        }
      ]
    },
    {
      "codigo": 4,
      "cliente": {
        "id": 4,
        "nome": "José da Silva"
      },
      "dtPedido": "2023-07-27",
      "dtFaturamento": "2023-07-28",
      "status": 0,
      "vlTotal": 250.00,
      "itens": [
        {
          "produto": {
            "id": "6",
            "descricao": "Mouse sem fio",
            "categoria": "Eletrônicos",
            "preco": 50.00,
            "unidade": "un"
          },
          "quantidade": 3,
          "total": 150.00
        },
        {
          "produto": {
            "id": "7",
            "descricao": "Teclado Gamer",
            "categoria": "Eletrônicos",
            "preco": 50.00,
            "unidade": "un"
          },
          "quantidade": 2,
          "total": 100.00
        }
      ]
    },
    {
      "codigo": 5,
      "cliente": {
        "id": 5,
        "nome": "Maria Oliveira"
      },
      "dtPedido": "2023-07-26",
      "dtFaturamento": "2023-07-27",
      "status": 0,
      "vlTotal": 750.00,
      "itens": [
        {
          "produto": {
            "id": "8",
            "descricao": "Câmera Digital",
            "categoria": "Eletrônicos",
            "preco": 500.00,
            "unidade": "un"
          },
          "quantidade": 1,
          "total": 500.00
        },
        {
          "produto": {
            "id": "9",
            "descricao": "Cartão de Memória",
            "categoria": "Eletrônicos",
            "preco": 50.00,
            "unidade": "un"
          },
          "quantidade": 10,
          "total": 500.00
        }
      ]
    }
  ];  