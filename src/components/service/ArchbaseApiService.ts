/* eslint max-classes-per-file: "off" */
import 'reflect-metadata'
import axios from 'axios'
import { injectable, inject } from 'inversify'
import { API_TYPE } from '../core/ioc'
import type { ArchbaseAuthenticator } from '../auth/ArchbaseAuthenticator'
import { ArchbaseJacksonParser } from '../core/json'


export interface Page<T> {
  content: T[]
  pageable: Pageable
  totalElements: number
  totalPages: number
  last: boolean
  sort: Sort
  number: number
  size: number
  first: boolean
  numberOfElements: number
  empty: boolean
}

export interface Pageable {
  sort: Sort
  offset: number
  pageSize: number
  pageNumber: number
  unpaged: boolean
  paged: boolean
}

export interface Sort {
  sorted: boolean
  unsorted: boolean
  empty: boolean
}

export interface ArchbaseApiClient {
  get<T>(url: string, headers?: Record<string, string>): Promise<T>
  post<T, R>(url: string, data: T, headers?: Record<string, string>): Promise<R>
  put<T, R>(url: string, data: T, headers?: Record<string, string>): Promise<R>
  delete<T>(url: string, headers?: Record<string, string>): Promise<T>
}

@injectable()
export class ArchbaseAxiosApiClient implements ArchbaseApiClient {
  protected authenticator: ArchbaseAuthenticator

  constructor(@inject(API_TYPE.Authenticator) authenticator: ArchbaseAuthenticator) {
    this.authenticator = authenticator
  }

  async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const token = this.authenticator.getToken()
    const headersTemp = { ...headers, Authorization: `Bearer ${token}` }
    const response = await axios.get(url, { headers: headersTemp })
    return ArchbaseJacksonParser.convertJsonToObject(response.data)
  }

  async post<T, R>(url: string, data: T, headers?: Record<string, string>): Promise<R> {
    const token = this.authenticator.getToken()
    const headersTemp = {
      ...headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
    const response = await axios.post(
      url,
      JSON.stringify(ArchbaseJacksonParser.convertObjectToJson(data)),
      {
        headers: headersTemp
      }
    )
    return ArchbaseJacksonParser.convertJsonToObject(response.data)
  }

  async put<T, R>(url: string, data: T, headers?: Record<string, string>): Promise<R> {
    const token = this.authenticator.getToken()
    const headersTemp = {
      ...headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
    const response = await axios.put(url, JSON.stringify(data), {
      headers: headersTemp
    })
    return ArchbaseJacksonParser.convertJsonToObject(response.data)
  }

  async delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const token = this.authenticator.getToken()
    const headersTemp = {
      ...headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
    const response = await axios.delete(url, { headers: headersTemp })
    return ArchbaseJacksonParser.convertJsonToObject(response.data)
  }
}

@injectable()
export abstract class ArchbaseApiService<T, ID> {
  protected readonly client: ArchbaseApiClient

  constructor(client: ArchbaseApiClient) {
    this.client = client
  }

  protected abstract getEndpoint(): string

  public abstract getId(entity: T): ID

  async validate(entity: T): Promise<void> {
    return this.client.post<T, void>(`${this.getEndpoint()}/validate`, entity)
  }

  async validateGroup<R>(entity: T, groups: any[]): Promise<R> {
    const headers: Record<string, string> = { groups: JSON.stringify(groups) }
    return this.client.post<T, R>(`${this.getEndpoint()}/validateGroup`, entity, headers)
  }

  async exists(id: ID): Promise<boolean> {
    return this.client.get<boolean>(`${this.getEndpoint()}/exists/${id}`)
  }

  async findAll(page: number, size: number): Promise<Page<T>> {
    return this.client.get<Page<T>>(`${this.getEndpoint()}/findAll?page=${page}&size=${size}`)
  }

  async findAllWithSort(page: number, size: number, sort: string[]): Promise<Page<T>> {
    return this.client.get<Page<T>>(
      `${this.getEndpoint()}/findAll?page=${page}&size=${size}&sort=${sort}`
    )
  }

  async findAllByIds(ids: ID[]): Promise<T[]> {
    return this.client.get<T[]>(`${this.getEndpoint()}/findAll?ids=${ids}`)
  }

  async findAllWithFilter(filter: string, page: number, size: number): Promise<Page<T>> {
    return this.client.get<Page<T>>(
      `${this.getEndpoint()}/findWithFilter?page=${page}&size=${size}&filter=${encodeURIComponent(
        filter
      )}`
    )
  }

  async findAllMultipleFields(value: string, fields: string, page: number, size: number, sort: string): Promise<Page<T>> {
    return this.client.get<Page<T>>(
      `${this.getEndpoint()}/findMultipleFields?page=${page}&size=${size}&fields=${encodeURIComponent(fields)}&filter=${encodeURIComponent(
        value
      )}&sort=${encodeURIComponent(sort)}`
    )
  }

  async findAllWithFilterAndSort(
    filter: string,
    page: number,
    size: number,
    sort: string[]
  ): Promise<Page<T>> {
    return this.client.get<Page<T>>(
      `${this.getEndpoint()}/findWithFilterAndSort?page=${page}&size=${size}&filter=${encodeURIComponent(
        filter
      )}&sort=${sort}`
    )
  }

  async findOne(id: ID): Promise<T> {
    return this.client.get<T>(`${this.getEndpoint()}/${id}`)
  }

  async findByComplexId<R>(id: T): Promise<R> {
    return this.client.post<T, R>(`${this.getEndpoint()}`, id)
  }

  async existsByComplexId(id: T): Promise<boolean> {
    return this.client.post<T, boolean>(`${this.getEndpoint()}`, id)
  }

  async save<R>(entity: T): Promise<R> {
    return this.client.post<T, R>(this.getEndpoint(), entity)
  }

  async delete<_T>(id: ID): Promise<void> {
    return this.client.delete<void>(`${this.getEndpoint()}/${id}`)
  }
}


export class DefaultPage<T> implements Page<T> {
  content: T[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  sort: Sort;
  number: number;
  size: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;

  constructor(
    content: T[],
    totalElements: number,
    totalPages: number,
    pageNumber: number,
    pageSize: number,
    sort?: Sort,
    last?: boolean,
    first?: boolean,
    numberOfElements?: number,
    empty?: boolean
  ) {
    this.content = content;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
    this.number = pageNumber;
    this.size = pageSize;
    this.sort = sort || { sorted: false, unsorted: true, empty: true };
    this.last = last !== undefined ? last : pageNumber === totalPages - 1;
    this.first = first !== undefined ? first : pageNumber === 0;
    this.numberOfElements = numberOfElements !== undefined ? numberOfElements : content.length;
    this.empty = empty !== undefined ? empty : content.length === 0;

    this.pageable = {
      sort: this.sort,
      offset: pageNumber * pageSize,
      pageSize: pageSize,
      pageNumber: pageNumber,
      unpaged: false,
      paged: true,
    };
  }

  static createFromValues<T>(
    content: T[],
    totalElements: number,
    totalPages: number,
    pageNumber: number,
    pageSize: number
  ): DefaultPage<T> {
    return new DefaultPage<T>(content, totalElements, totalPages, pageNumber, pageSize);
  }
}

