/* eslint class-methods-use-this: "off" */
import "reflect-metadata";
import { injectable, decorate, inject } from 'inversify';
import type { ArchbaseRemoteApiClient } from '../../components/service';
import { ArchbaseRemoteApiService } from '../../components/service';
import { Pedido } from '../data/types';
import { API_TYPE } from '../ioc/DemoIOCTypes';
import { IOCContainer } from '@components/core';

export class FakePedidoService extends ArchbaseRemoteApiService<Pedido, number> {
  
  constructor(@inject(API_TYPE.ApiClient) client: ArchbaseRemoteApiClient) {
    super(client || IOCContainer.getContainer().get<ArchbaseRemoteApiClient>(API_TYPE.ApiClient));
  }

  protected configureHeaders(): Record<string, string> {
    throw new Error("Method not implemented.");
  }

  protected getEndpoint(): string {
    return 'api/pedidos';
  }

  public getId(entity: Pedido): number {
    return entity.codigo;
  }
}


decorate(injectable(), FakePedidoService)