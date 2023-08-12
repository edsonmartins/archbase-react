import { Pedido, PessoaStatus, Sexo } from "./types";

export const pedidosData : Pedido[] = [
    {
      "codigo": 1,
      "cliente": {
        "id": 1,
        "nome": "Cláudio Ruan Mendes",
        "idade": 31,
        "cpf": "25936544575",
        "rg": "292597332",
        "data_nasc": "1992-04-19",
        "sexo": Sexo.MASCULINO,
        "signo": "Áries",
        "mae": "Alice Raimunda",
        "pai": "Theo Guilherme Joaquim Mendes",
        "email": "claudio_mendes@magicday.com.br",
        "senha": "SgtJnYhxfi",
        "cep": "79602120",
        "endereco": "Rua David Alexandria",
        "numero": 562,
        "bairro": "Centro",
        "cidade": "Três Lagoas",
        "estado": "MS",
        "telefone_fixo": "6728092269",
        "celular": "67991332777",
        "altura": "1.89",
        "peso": 63,
        "tipo_sanguineo": "AB+",
        "cor": "preto",
        "foto": "https://randomuser.me/api/portraits/men/57.jpg",
        "status":PessoaStatus.APROVADO
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
        "nome": "Elaine Bianca Mariah Silveira",
        "idade": 35,
        "cpf": "65858382622",
        "rg": "225418228",
        "data_nasc": "1988-03-23",
        "sexo": Sexo.FEMININO,
        "signo": "Áries",
        "mae": "Brenda Francisca Clara",
        "pai": "Enrico Arthur Silveira",
        "email": "elaine_silveira@gmx.ca",
        "senha": "lybirgt20s",
        "cep": "97090646",
        "endereco": "Rua João Leonel Teixeira",
        "numero": 926,
        "bairro": "Itararé",
        "cidade": "Santa Maria",
        "estado": "RS",
        "telefone_fixo": "5525711181",
        "celular": "55996033294",
        "altura": "1.57",
        "peso": 88,
        "tipo_sanguineo": "O-",
        "cor": "vermelho",
        "foto": "https://randomuser.me/api/portraits/women/44.jpg",
        "status":PessoaStatus.APROVADO
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
        "nome": "Bento Cauã Gomes",
        "idade": 39,
        "cpf": "69509967807",
        "rg": "187178380",
        "data_nasc": "1984-04-07",
        "sexo": Sexo.MASCULINO,
        "signo": "Câncer",
        "mae": "Tereza Alessandra",
        "pai": "Severino Murilo Lucas Gomes",
        "email": "bentocauagomes@contabilidaderangel.com.br",
        "senha": "fuZC7FOcEm",
        "cep": "49063196",
        "endereco": "Rua K",
        "numero": 126,
        "bairro": "Japãozinho",
        "cidade": "Aracaju",
        "estado": "SE",
        "telefone_fixo": "7939507802",
        "celular": "79991842089",
        "altura": "1.98",
        "peso": 73,
        "tipo_sanguineo": "AB-",
        "cor": "amarelo",
        "foto": "https://randomuser.me/api/portraits/men/51.jpg",
        "status":PessoaStatus.APROVADO
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
        "nome": "Raimunda Regina Adriana Almeida",
        "idade": 65,
        "cpf": "88842788058",
        "rg": "212138248",
        "data_nasc": "1958-02-04",
        "sexo": Sexo.FEMININO,
        "signo": "Áries",
        "mae": "Larissa Ayla Caroline",
        "pai": "Samuel Severino Almeida",
        "email": "raimunda.regina.almeida@grupoblackout.com.br",
        "senha": "DX62Dm9fFT",
        "cep": "50030260",
        "endereco": "Rua do Brum",
        "numero": 887,
        "bairro": "Recife",
        "cidade": "Recife",
        "estado": "PE",
        "telefone_fixo": "8128508832",
        "celular": "81987247839",
        "altura": "1.60",
        "peso": 75,
        "tipo_sanguineo": "O+",
        "cor": "azul",
        "foto": "https://randomuser.me/api/portraits/women/37.jpg",
        "status":PessoaStatus.APROVADO
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
        "nome": "José Victor Leonardo da Mata",
        "idade": 61,
        "cpf": "21374616257",
        "rg": "287562219",
        "data_nasc": "10/05/1962",
        "sexo": Sexo.MASCULINO,
        "signo": "Touro",
        "mae": "Daiane Rita Antonella",
        "pai": "Anderson Caio Rodrigo da Mata",
        "email": "josevictordamata@santosdumonthospital.com",
        "senha": "i2IrZITEQ0",
        "cep": "88701001",
        "endereco": "Avenida Marcolino Martins Cabral",
        "numero": 379,
        "bairro": "Centro",
        "cidade": "Tubarão",
        "estado": "SC",
        "telefone_fixo": "4827685959",
        "celular": "48991649655",
        "altura": "1.88",
        "peso": 99,
        "tipo_sanguineo": "O-",
        "cor": "azul",
        "foto": "https://randomuser.me/api/portraits/men/79.jpg",
        "status":PessoaStatus.APROVADO
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