/* eslint class-methods-use-this: "off" */
import { inject, injectable } from 'inversify'
import { ArchbaseApiClient, ArchbaseApiService } from '@components/service'
import { Produto } from '@demo/data/types'
import { API_TYPE } from '@demo/ioc/DemoIOCTypes'


@injectable()
export class FakeProdutoService extends ArchbaseApiService<Produto, string> {
  constructor(@inject(API_TYPE.ApiClient) client: ArchbaseApiClient) {
    super(client)
  }

  protected getEndpoint(): string {
    return 'api/produtos'
  }

  public getId(entity: Produto): string {
    return entity.id
  }
}