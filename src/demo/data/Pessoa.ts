import { IsNotEmpty } from "../../components/validator";
import { PessoaStatus, Sexo } from "./types";

export class Pessoa {
    id: number;
    nome: string;
    idade?: number;
    @IsNotEmpty({
      message: "CPF é obrigatório"
    })
    cpf?: string;
    rg?: string;
    data_nasc?: string;
    sexo?: Sexo;
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
    observacao?: string;
    codigoJson?: string;
    creditoOK?: boolean;
  
    constructor(pessoa: any) {
      this.id = pessoa.id;
      this.nome = pessoa.nome;
      this.idade = pessoa.idade;
      this.cpf = pessoa.cpf;
      this.rg = pessoa.rg;
      this.data_nasc = pessoa.data_nasc;
      this.sexo = pessoa.sexo;
      this.signo = pessoa.signo;
      this.mae = pessoa.mae;
      this.pai = pessoa.pai;
      this.email = pessoa.email;
      this.senha = pessoa.senha;
      this.cep = pessoa.cep;
      this.endereco = pessoa.endereco;
      this.numero = pessoa.numero;
      this.bairro = pessoa.bairro;
      this.cidade = pessoa.cidade;
      this.estado = pessoa.estado;
      this.telefone_fixo = pessoa.telefone_fixo;
      this.celular = pessoa.celular;
      this.altura = pessoa.altura;
      this.peso = pessoa.peso;
      this.avaliacao = pessoa.avaliacao;
      this.tipo_sanguineo = pessoa.tipo_sanguineo;
      this.cor = pessoa.cor;
      this.foto = pessoa.foto;
      this.status = pessoa.status;
      this.observacao = pessoa.observacao;
      this.codigoJson = pessoa.codigoJson;
      this.creditoOK = pessoa.creditoOK;
    }
  
    static newInstance = () => {
      return new Pessoa({})
    }
  }