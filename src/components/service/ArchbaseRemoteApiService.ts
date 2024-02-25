/* eslint max-classes-per-file: "off" */
import 'reflect-metadata'
import axios from 'axios'
import * as inversify from 'inversify'
import { ARCHBASE_IOC_API_TYPE, IOCContainer } from '../core/ioc'
import type { ArchbaseAuthenticator } from '../auth/ArchbaseAuthenticator'
import { ArchbaseJacksonParser } from '../core/json'
import { ArchbaseAccessToken } from '../auth/ArchbaseAccessToken'
import { ArchbaseTokenManager } from '../auth/ArchbaseTokenManager'

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

export interface ArchbaseRemoteApiClient {
  get<T>(url: string, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<T>
  post<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>
  put<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>
  postNoConvertId<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>
  putNoConvertId<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>
  binaryPut<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R>
  delete<T>(url: string, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<T>
}

export class ArchbaseAxiosRemoteApiClient implements ArchbaseRemoteApiClient {
  protected tokenManager: ArchbaseTokenManager

  constructor() {
    this.tokenManager = IOCContainer.getContainer().get(ARCHBASE_IOC_API_TYPE.TokenManager)
  }

  protected prepareHeaders(headers: Record<string, string> = {}, withoutToken: boolean = false): Record<string, string> {
    let finalHeaders = { 'Content-Type': 'application/json; charset=utf-8', ...headers };
  
    if (!withoutToken) {
      const token = this.tokenManager.getToken();
      if (token) {
        finalHeaders['Authorization'] = `Bearer ${token.access_token}`;
      }
    }
  
    return finalHeaders;
  }
  

  async get<T>(url: string, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<T> {
    const finalHeaders = this.prepareHeaders(headers, withoutToken);
    const response = await axios.get(url, { headers: finalHeaders, ...options })
    return ArchbaseJacksonParser.convertJsonToObject(response.data)
  }

  async post<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R> {
    const finalHeaders = this.prepareHeaders(headers, withoutToken);
    const response = await axios.post(
      url,
      ArchbaseJacksonParser.convertObjectToJson(data),
      {
        headers: finalHeaders,
        ...options
      }
    )
    return ArchbaseJacksonParser.convertJsonToObject(response.data)
  }

  async postNoConvertId<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R> {
    const finalHeaders = this.prepareHeaders(headers, withoutToken); 
    const response = await axios.post(
      url,
      data,
      {
        headers: finalHeaders,
        ...options
      }
    )
    return response.data
  }

  async put<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R> {
    const finalHeaders = this.prepareHeaders(headers, withoutToken); 
    const response = await axios.put(url, ArchbaseJacksonParser.convertObjectToJson(data), {
      headers: finalHeaders,
      ...options
    })
    return ArchbaseJacksonParser.convertJsonToObject(response.data)
  }

  async putNoConvertId<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<R> {
    const finalHeaders = this.prepareHeaders(headers, withoutToken); 
    const response = await axios.put(url, data, {
      headers: finalHeaders,
      ...options
    })
    return response.data
  }

  async binaryPut<T, R>(url: string, data: T, headers: Record<string, string>={}, withoutToken?: boolean, options?: any): Promise<R> {
    const finalHeaders = this.prepareHeaders(headers, withoutToken);
    options = options || {}
    const response = await axios.put(url, data, {
      headers: finalHeaders,
      ...options
    })
    return response.data
  }

  async delete<T>(url: string, headers?: Record<string, string>, withoutToken?: boolean, options?: any): Promise<T> {
    const finalHeaders = this.prepareHeaders(headers, withoutToken);
    const response = await axios.delete(url, { headers: finalHeaders, ...options })
    return ArchbaseJacksonParser.convertJsonToObject(response.data)
  }
}

inversify.decorate(inversify.injectable(), ArchbaseAxiosRemoteApiClient)

export interface ArchbaseEntityTransformer<T> {
  transform(entity : T): T
}

export abstract class ArchbaseRemoteApiService<T, ID> {
  protected readonly client: ArchbaseRemoteApiClient

  constructor(client: ArchbaseRemoteApiClient) {
    this.client = client
  }

  protected abstract getEndpoint(): string  

  public abstract getId(entity: T): ID

  protected abstract configureHeaders(): Record<string, string>

  protected transformPage(page: Page<T>) {
    if (page.content && page.content.length > 0) {
      for (let index = 0; index < page.content.length; index++) {
        const element = page.content[index];
        if (this.isTransformable()) {
          page.content[index] = this['transform'](element);
        }
      }
    }
  }

  protected transformList(list: T[]) {
    if (list && list.length > 0) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if (this.isTransformable()) {
          list[index] = this['transform'](element);
        }
      }
    }
  }

  private isTransformable(): boolean {
    return typeof this['transform'] === 'function'
  }


  async validate(entity: T): Promise<void> {
    const serviceSpecificHeaders = this.configureHeaders(); 
    return this.client.post<T, void>(`${this.getEndpoint()}/validate`, entity, serviceSpecificHeaders,false)
  }

  async validateGroup<R>(entity: T, groups: any[]): Promise<R> {
    const headers: Record<string, string> = { groups: JSON.stringify(groups) }
    const serviceSpecificHeaders = this.configureHeaders();
    const finalHeaders = { ...headers, ...serviceSpecificHeaders };
    return this.client.post<T, R>(`${this.getEndpoint()}/validateGroup`, entity, finalHeaders, false)
  }

  async exists(id: ID): Promise<boolean> {
    const serviceSpecificHeaders = this.configureHeaders();
    return this.client.get<boolean>(`${this.getEndpoint()}/exists/${id}`,serviceSpecificHeaders,false)
  }

  async findAll(page: number, size: number): Promise<Page<T>> {
    const serviceSpecificHeaders = this.configureHeaders();
    const result =  await this.client.get<Page<T>>(`${this.getEndpoint()}/findAll?page=${page}&size=${size}`,serviceSpecificHeaders,false)
    this.transformPage(result);
    return result;
  }

  async findAllWithSort(page: number, size: number, sort: string[]): Promise<Page<T>> {
    const serviceSpecificHeaders = this.configureHeaders();
    const result = await this.client.get<Page<T>>(
      `${this.getEndpoint()}/findAll?page=${page}&size=${size}&sort=${sort}`,serviceSpecificHeaders,false
    )
    this.transformPage(result);
    return result;
  }

  async findAllByIds(ids: ID[]): Promise<T[]> {
    const serviceSpecificHeaders = this.configureHeaders();
    const result = await this.client.get<T[]>(`${this.getEndpoint()}/findAll?ids=${ids}`,serviceSpecificHeaders,false)
    this.transformList(result);
    return result;
  }

  async findAllWithFilter(filter: string, page: number, size: number): Promise<Page<T>> {
    const serviceSpecificHeaders = this.configureHeaders();
    const result = await this.client.get<Page<T>>(
      `${this.getEndpoint()}/findWithFilter?page=${page}&size=${size}&filter=${encodeURIComponent(
        filter
      )}`
    ,serviceSpecificHeaders,false)
    this.transformPage(result);
    return result;
  }

  async findAllMultipleFields(
    value: string,
    fields: string,
    page: number,
    size: number,
    sort: string
  ): Promise<Page<T>> {
    const serviceSpecificHeaders = this.configureHeaders();
    const result = await this.client.get<Page<T>>(
      `${this.getEndpoint()}/findMultipleFields?page=${page}&size=${size}&fields=${encodeURIComponent(
        fields
      )}&filter=${encodeURIComponent(value)}&sort=${encodeURIComponent(sort)}`
    ,serviceSpecificHeaders,false)
    this.transformPage(result);
    return result;
  }

  async findAllWithFilterAndSort(
    filter: string,
    page: number,
    size: number,
    sort: string[]
  ): Promise<Page<T>> {
    const serviceSpecificHeaders = this.configureHeaders();
    const result = await this.client.get<Page<T>>(
      `${this.getEndpoint()}/findWithFilterAndSort?page=${page}&size=${size}&filter=${encodeURIComponent(
        filter
      )}&sort=${sort}`
    ,serviceSpecificHeaders,false)
    this.transformPage(result);
    return result;
  }

  async findOne(id: ID): Promise<T> {
    const serviceSpecificHeaders = this.configureHeaders();
    const result = await this.client.get<T>(`${this.getEndpoint()}/${id}`,serviceSpecificHeaders,false)
    if (this.isTransformable()){
      return this['transform'](result);
    }
    return result;
  }

  async findByComplexId<R>(id: T): Promise<R> {
    const serviceSpecificHeaders = this.configureHeaders();
    return this.client.post<T, R>(`${this.getEndpoint()}`, id,serviceSpecificHeaders,false)
  }

  async existsByComplexId(id: T): Promise<boolean> {
    const serviceSpecificHeaders = this.configureHeaders();
    return this.client.post<T, boolean>(`${this.getEndpoint()}`, id,serviceSpecificHeaders,false)
  }

  async save<R>(entity: T): Promise<R> {
    const serviceSpecificHeaders = this.configureHeaders();
    return this.client.post<T, R>(this.getEndpoint(), entity,serviceSpecificHeaders,false)
  }

  async delete<T>(id: ID): Promise<void> {
    const serviceSpecificHeaders = this.configureHeaders();
    return this.client.delete<void>(`${this.getEndpoint()}/${id}`,serviceSpecificHeaders,false)
  }
}

inversify.decorate(inversify.injectable(), ArchbaseRemoteApiService)

export class DefaultPage<T> implements Page<T> {
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
    this.content = content
    this.totalElements = totalElements
    this.totalPages = totalPages
    this.number = pageNumber
    this.size = pageSize
    this.sort = sort || { sorted: false, unsorted: true, empty: true }
    this.last = last !== undefined ? last : pageNumber === totalPages - 1
    this.first = first !== undefined ? first : pageNumber === 0
    this.numberOfElements = numberOfElements !== undefined ? numberOfElements : content.length
    this.empty = empty !== undefined ? empty : content.length === 0

    this.pageable = {
      sort: this.sort,
      offset: pageNumber * pageSize,
      pageSize,
      pageNumber,
      unpaged: false,
      paged: true
    }
  }

  static createFromValues<T>(
    content: T[],
    totalElements: number,
    totalPages: number,
    pageNumber: number,
    pageSize: number
  ): DefaultPage<T> {
    return new DefaultPage<T>(content, totalElements, totalPages, pageNumber, pageSize)
  }
}
