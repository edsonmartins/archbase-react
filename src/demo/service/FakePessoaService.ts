/* eslint class-methods-use-this: "off" */
import { inject, injectable } from 'inversify';
import { ArchbaseApiClient, ArchbaseApiService, DefaultPage, Page } from '@components/service';
import { Pessoa } from '@demo/data/types';
import { API_TYPE } from '@demo/ioc/DemoIOCTypes';
import { pessoasData } from '@demo/data/pessoasData';

@injectable()
export class FakePessoaService extends ArchbaseApiService<Pessoa, number> {
  constructor(@inject(API_TYPE.ApiClient) client: ArchbaseApiClient) {
    super(client);
  }

  protected getEndpoint(): string {
    return 'api/pessoas';
  }

  public getId(entity: Pessoa): number {
    return entity.id;
  }

  findAllWithFilter(filter: string, page: number, size: number): Promise<Page<Pessoa>> {
    return new Promise<Page<Pessoa>>((resolve, _reject) => {
      const pessoasFiltradas = pessoasData.sort((a, b) => {
        if (a.nome < b.nome) {
          return -1;
        }
        if (a.nome > b.nome) {
          return 1;
        }
        return 0;
      }).filter((pessoa) => pessoa.nome.toLowerCase().includes(filter.toLowerCase()));
      const totalPages = Math.ceil(pessoasFiltradas.length / size);
      const indexStart = page * size;
      const indexEnd = indexStart + size;
      const resultPage = pessoasFiltradas.slice(indexStart, indexEnd)
      console.log(resultPage);
      const result: Page<Pessoa> = DefaultPage.createFromValues<Pessoa>(resultPage, pessoasFiltradas.length, totalPages, page, size);
      setTimeout(() => {
        resolve(result);
      }, 3000);
    });
  }
}
