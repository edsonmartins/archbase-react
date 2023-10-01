/* eslint class-methods-use-this: "off" */
import { inject, injectable } from 'inversify';
import type { ArchbaseRemoteApiClient, Page } from '../../components/service';
import { ArchbaseRemoteApiService, DefaultPage } from '../../components/service';
import { Pessoa } from '../data/types';
import { API_TYPE } from '../ioc/DemoIOCTypes';
import { pessoasData } from '../data/pessoasData';

@injectable()
export class FakePessoaService extends ArchbaseRemoteApiService<Pessoa, number> {
  constructor(@inject(API_TYPE.ApiClient) client: ArchbaseRemoteApiClient) {
    super(client);
  }

  protected getEndpoint(): string {
    return 'api/pessoas';
  }

  public getId(entity: Pessoa): number {
    return entity.id;
  }

  findOne(id: number): Promise<Pessoa> {
    return new Promise<Pessoa>((resolve, reject) => {
      const result = pessoasData.filter((pessoa) => pessoa.id === id);
      if (result.length === 0) {
        reject('Pessoa ' + id + ' não encontrada.');
      }
      resolve(result[0]);
    });
  }

  findAll(page: number, size: number): Promise<Page<Pessoa>> {
    return new Promise<Page<Pessoa>>((resolve, _reject) => {
      const totalPages = Math.ceil(pessoasData.length / size);
      const indexStart = page * size;
      const indexEnd = indexStart + size;
      const resultPage = pessoasData.slice(indexStart, indexEnd);
      const result: Page<Pessoa> = DefaultPage.createFromValues<Pessoa>(resultPage, pessoasData.length, totalPages, page, size);
      setTimeout(() => {
        resolve(result);
      }, 3000);
    });
  }

  findAllWithFilter(filter: string, page: number, size: number): Promise<Page<Pessoa>> {
    return new Promise<Page<Pessoa>>((resolve, _reject) => {
      const pessoasFiltradas = pessoasData
        .sort((a, b) => {
          if (a.nome < b.nome) {
            return -1;
          }
          if (a.nome > b.nome) {
            return 1;
          }

          return 0;
        })
        .filter((pessoa) => pessoa.nome.toLowerCase().includes(filter.toLowerCase()));
      const totalPages = Math.ceil(pessoasFiltradas.length / size);
      const indexStart = page * size;
      const indexEnd = indexStart + size;
      const resultPage = pessoasFiltradas.slice(indexStart, indexEnd);
      const result: Page<Pessoa> = DefaultPage.createFromValues<Pessoa>(resultPage, pessoasFiltradas.length, totalPages, page, size);
      setTimeout(() => {
        resolve(result);
      }, 3000);
    });
  }
}
