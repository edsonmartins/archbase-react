/* eslint max-classes-per-file: "off" */
import 'reflect-metadata';
import { decorate, inject, injectable } from 'inversify';
import type { ArchbaseRemoteApiClient } from '../../components/service';
import type { ArchbaseAuthenticator } from '../../components/auth';
import { API_TYPE } from '../ioc/DemoIOCTypes';
import { IOCContainer } from '@components/core';

export class FakeRemoteApiClient implements ArchbaseRemoteApiClient {
  protected authenticator: ArchbaseAuthenticator;

  constructor(@inject(API_TYPE.Authenticator) authenticator: ArchbaseAuthenticator) {
    this.authenticator = authenticator||IOCContainer.getContainer().get<ArchbaseAuthenticator>(API_TYPE.Authenticator);
  }

  async get<T>(_url: string, _headers?: Record<string, string>): Promise<T> {
    throw new Error('Esta api não deve ser usada diretamente');
  }

  async post<T, R>(_url: string, _data: T, _headers?: Record<string, string>): Promise<R> {
    throw new Error('Esta api não deve ser usada diretamente');
  }

  async put<T, R>(_url: string, _data: T, _headers?: Record<string, string>): Promise<R> {
    throw new Error('Esta api não deve ser usada diretamente');
  }

  async delete<T>(_url: string, _headers?: Record<string, string>): Promise<T> {
    throw new Error('Esta api não deve ser usada diretamente');
  }
}


decorate(injectable(), FakeRemoteApiClient)