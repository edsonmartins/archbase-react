/* eslint class-methods-use-this: "off" */
import { inject, injectable } from 'inversify'
import type { ArchbaseRemoteApiClient } from '@components/service'
import { ArchbaseRemoteApiService } from '@components/service'
import { Pedido } from '@demo/data/types'
import { API_TYPE } from '@demo/ioc/DemoIOCTypes'


@injectable()
export class FakePedidoService extends ArchbaseRemoteApiService<Pedido, number> {
  constructor(@inject(API_TYPE.ApiClient) client: ArchbaseRemoteApiClient) {
    super(client)
  }

  protected getEndpoint(): string {
    return 'api/pedidos'
  }

  public getId(entity: Pedido): number {
    return entity.codigo
  }
}