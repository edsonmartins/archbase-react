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
  get<T>(url: string, headers?: Record<string, string>, withoutToken?: boolean): Promise<T>
  post<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean): Promise<R>
  put<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean): Promise<R>
  delete<T>(url: string, headers?: Record<string, string>, withoutToken?: boolean): Promise<T>
}

export class ArchbaseAxiosRemoteApiClient implements ArchbaseRemoteApiClient {
  protected tokenManager: ArchbaseTokenManager

  constructor() {
    this.tokenManager = IOCContainer.getContainer().get(ARCHBASE_IOC_API_TYPE.TokenManager)
  }

  async get<T>(url: string, headers?: Record<string, string>, withoutToken?: boolean): Promise<T> {
    let headersTemp = headers
    if (!withoutToken) {
      const token = this.tokenManager.getToken()
      if (token){
        headersTemp = { ...headers, Authorization: `Bearer ${token.access_token}` }
      }
    }
    const response = await axios.get(url, { headers: headersTemp })
    return ArchbaseJacksonParser.convertJsonToObject(response.data)
  }

  async post<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean): Promise<R> {
    let headersTemp = headers
    if (!withoutToken) {
      const token = this.tokenManager.getToken()
      if (token){
        headersTemp = {
          ...headers,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access_token}`
        }
      }
    } else {
      headersTemp = {
        ...headers,
        'Content-Type': 'application/json',
      }
    }   
    const response = await axios.post(
      url,
      ArchbaseJacksonParser.convertObjectToJson(data),
      {
        headers: headersTemp
      }
    )
    return ArchbaseJacksonParser.convertJsonToObject(response.data)
  }

  async put<T, R>(url: string, data: T, headers?: Record<string, string>, withoutToken?: boolean): Promise<R> {
    let headersTemp = headers
    if (!withoutToken) {
      const token = this.tokenManager.getToken()
      if (token){
        headersTemp = {
          ...headers,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access_token}`
        }
      }
    } else {
      headersTemp = {
        ...headers,
        'Content-Type': 'application/json',
      }
    }

    const response = await axios.put(url, ArchbaseJacksonParser.convertObjectToJson(data), {
      headers: headersTemp
    })
    return ArchbaseJacksonParser.convertJsonToObject(response.data)
  }

  async delete<T>(url: string, headers?: Record<string, string>, withoutToken?: boolean): Promise<T> {
    let headersTemp = headers
    if (!withoutToken) {
      const token = this.tokenManager.getToken()
      if (token){
        headersTemp = {
          ...headers,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access_token}`
        }
      }
    } else {
      headersTemp = {
        ...headers,
        'Content-Type': 'application/json',
      }
    }
    const response = await axios.delete(url, { headers: headersTemp })
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
    return this.client.post<T, void>(`${this.getEndpoint()}/validate`, entity, {},false)
  }

  async validateGroup<R>(entity: T, groups: any[]): Promise<R> {
    const headers: Record<string, string> = { groups: JSON.stringify(groups) }
    return this.client.post<T, R>(`${this.getEndpoint()}/validateGroup`, entity, headers, false)
  }

  async exists(id: ID): Promise<boolean> {
    return this.client.get<boolean>(`${this.getEndpoint()}/exists/${id}`,{},false)
  }

  async findAll(page: number, size: number): Promise<Page<T>> {
    const result =  await this.client.get<Page<T>>(`${this.getEndpoint()}/findAll?page=${page}&size=${size}`,{},false)
    this.transformPage(result);
    return result;
  }

  async findAllWithSort(page: number, size: number, sort: string[]): Promise<Page<T>> {
    const result = await this.client.get<Page<T>>(
      `${this.getEndpoint()}/findAll?page=${page}&size=${size}&sort=${sort}`,{},false
    )
    this.transformPage(result);
    return result;
  }

  async findAllByIds(ids: ID[]): Promise<T[]> {
    const result = await this.client.get<T[]>(`${this.getEndpoint()}/findAll?ids=${ids}`,{},false)
    this.transformList(result);
    return result;
  }

  async findAllWithFilter(filter: string, page: number, size: number): Promise<Page<T>> {
    const result = await this.client.get<Page<T>>(
      `${this.getEndpoint()}/findWithFilter?page=${page}&size=${size}&filter=${encodeURIComponent(
        filter
      )}`
    ,{},false)
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
    const result = await this.client.get<Page<T>>(
      `${this.getEndpoint()}/findMultipleFields?page=${page}&size=${size}&fields=${encodeURIComponent(
        fields
      )}&filter=${encodeURIComponent(value)}&sort=${encodeURIComponent(sort)}`
    ,{},false)
    this.transformPage(result);
    return result;
  }

  async findAllWithFilterAndSort(
    filter: string,
    page: number,
    size: number,
    sort: string[]
  ): Promise<Page<T>> {
    const result = await this.client.get<Page<T>>(
      `${this.getEndpoint()}/findWithFilterAndSort?page=${page}&size=${size}&filter=${encodeURIComponent(
        filter
      )}&sort=${sort}`
    ,{},false)
    this.transformPage(result);
    return result;
  }

  async findOne(id: ID): Promise<T> {
    const result = await this.client.get<T>(`${this.getEndpoint()}/${id}`,{},false)
    if (this.isTransformable()){
      return this['transform'](result);
    }
    return result;
  }

  async findByComplexId<R>(id: T): Promise<R> {
    return this.client.post<T, R>(`${this.getEndpoint()}`, id,{},false)
  }

  async existsByComplexId(id: T): Promise<boolean> {
    return this.client.post<T, boolean>(`${this.getEndpoint()}`, id,{},false)
  }

  async save<R>(entity: T): Promise<R> {
    return this.client.post<T, R>(this.getEndpoint(), entity,{},false)
  }

  async delete<T>(id: ID): Promise<void> {
    return this.client.delete<void>(`${this.getEndpoint()}/${id}`,{},false)
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
