/* eslint class-methods-use-this: "off" */
import { inject, injectable } from 'inversify';
import type { ArchbaseRemoteApiClient } from '../../components/service';
import { ArchbaseRemoteApiService } from '../../components/service';
import { Produto } from '../data/types';
import { API_TYPE } from '../ioc/DemoIOCTypes';

@injectable()
export class FakeProdutoService extends ArchbaseRemoteApiService<Produto, string> {
  constructor(@inject(API_TYPE.ApiClient) client: ArchbaseRemoteApiClient) {
    super(client);
  }

  protected getEndpoint(): string {
    return 'api/produtos';
  }

  public getId(entity: Produto): string {
    return entity.id;
  }
}
