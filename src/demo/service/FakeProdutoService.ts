/* eslint class-methods-use-this: "off" */
import "reflect-metadata";
import { decorate, inject, injectable } from 'inversify';
import type { ArchbaseRemoteApiClient } from '../../components/service';
import { ArchbaseRemoteApiService } from '../../components/service';
import { Produto } from '../data/types';
import { API_TYPE } from '../ioc/DemoIOCTypes';
import { IOCContainer } from '@components/core';

export class FakeProdutoService extends ArchbaseRemoteApiService<Produto, string> {
  constructor(@inject(API_TYPE.ApiClient) client: ArchbaseRemoteApiClient) {
    super(client || IOCContainer.getContainer().get<ArchbaseRemoteApiClient>(API_TYPE.ApiClient));
  }

  protected configureHeaders(): Record<string, string> {
    return {};
  }

  protected getEndpoint(): string {
    return 'api/produtos';
  }

  public getId(entity: Produto): string {
    return entity.id;
  }

  isNewRecord(entity: Produto): boolean {
    return true;
  }
}



decorate(injectable(), FakeProdutoService)