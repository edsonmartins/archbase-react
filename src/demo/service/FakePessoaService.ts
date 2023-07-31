/* eslint class-methods-use-this: "off" */
import { inject, injectable } from 'inversify'
import { ArchbaseApiClient, ArchbaseApiService } from '@components/service'
import { Pessoa } from '@demo/data/types'
import { API_TYPE } from '@demo/ioc/DemoIOCTypes'


@injectable()
export class FakePessoaService extends ArchbaseApiService<Pessoa, number> {
  constructor(@inject(API_TYPE.ApiClient) client: ArchbaseApiClient) {
    super(client)
  }

  protected getEndpoint(): string {
    return 'api/pessoas'
  }

  public getId(entity: Pessoa): number {
    return entity.id
  }
}