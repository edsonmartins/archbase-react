import "reflect-metadata";
import { injectable, decorate } from 'inversify'
import { ArchbaseTokenManager, ArchbaseAccessToken, ArchbaseUsernameAndPassword, compressString, decompressString } from '@archbase/core'
import CryptoJS from 'crypto-js'
import { jwtDecode } from "jwt-decode";

export const ENCRYPTION_KEY = 'YngzI1guK3dGaElFcFY9MywqK3xgPzg/Ojg7eD8xRmg='
export const TOKEN_COOKIE_NAME = 'c1ab58e7-c113-4225-a190-a9e59d1207fc'
export const USER_NAME_AND_PASSWORD = '6faf6932-a0b5-457b-83b1-8d89ddbd91fd'
export const USER_NAME = '602b05c5-ec46-451e-aba6-187e463bc245'
export const CONTEXT_STORAGE_KEY = '8b4a7c2d-9e5f-4163-b8a7-3f2c9d8e5a1b'

export class DefaultArchbaseTokenManager implements ArchbaseTokenManager {
  getUsernameAndPassword(): ArchbaseUsernameAndPassword|null {
    try {
      const encryptedUserAndPassword = localStorage.getItem(USER_NAME_AND_PASSWORD)
      if (encryptedUserAndPassword){
        const decrypted = CryptoJS.AES.decrypt(encryptedUserAndPassword, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        const normal = atob(decrypted)
        const values = normal.split(':')
        return {username:values[0], password:values[1], remember: true}
      } else {
        return null
      }
    } catch (ex) {
        return null
    }
  }
  saveUsernameAndPassword(username: string, password: string): void {
    const usernameAndPassword = btoa(`${username}:${password}`)
    const encryptedPassword = CryptoJS.AES.encrypt(usernameAndPassword, ENCRYPTION_KEY).toString()    
    localStorage.setItem(USER_NAME_AND_PASSWORD, encryptedPassword)
  }

  getUsername(): string|null {
    try {
      const encryptedUsername = localStorage.getItem(USER_NAME)
      if (encryptedUsername){
        const decrypted = CryptoJS.AES.decrypt(encryptedUsername, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        return atob(decrypted)
      } else {
        return null
      }
    } catch (ex) {
        return null
    }
  }
  saveUsername(username: string): void {
    const usernameBase64 = btoa(username)
    const encryptedPassword = CryptoJS.AES.encrypt(usernameBase64, ENCRYPTION_KEY).toString()    
    localStorage.setItem(USER_NAME, encryptedPassword)
  }

  isTokenExpired(token?: ArchbaseAccessToken, expirationThreshold: number = 300 ): boolean {
    let currentToken = token
    if (!currentToken) {
      const currentToken = this.getToken()
      if (!currentToken) {
        return true
      }
    }
    try {
      const decodedToken : any = jwtDecode(currentToken!.access_token)
      if (!decodedToken) {
        return true
      }
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExpiration = decodedToken.exp;
      return currentTime > (tokenExpiration - expirationThreshold);
    } catch (error) {
      return true
    }
  }

  saveToken(accessToken?: ArchbaseAccessToken): void {
    if (accessToken){
        const newAuthToken = JSON.stringify(accessToken)
        const encryptedToken = CryptoJS.AES.encrypt(newAuthToken, ENCRYPTION_KEY).toString()
        const compressedToken = compressString(encryptedToken)
        localStorage.setItem(TOKEN_COOKIE_NAME, compressedToken)
    } else {
        this.clearToken()
    }
  }

  clearUsernameAndPassword(): void {
    localStorage.removeItem(USER_NAME_AND_PASSWORD)
    localStorage.removeItem(USER_NAME)
  }

  clearToken() {
    localStorage.removeItem(TOKEN_COOKIE_NAME)
  }

  getToken(): ArchbaseAccessToken | null {
    try {
        const compressedToken = localStorage.getItem(TOKEN_COOKIE_NAME)
        if (!compressedToken) {
            return null
        }
        const encryptedToken = decompressString(compressedToken)
        const strToken = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        return JSON.parse(strToken)
    } catch (ex) {
        return null
    }
  }

  saveContext(context: string): void {
    try {
      const encryptedContext = CryptoJS.AES.encrypt(context, ENCRYPTION_KEY).toString()
      localStorage.setItem(CONTEXT_STORAGE_KEY, encryptedContext)
    } catch (ex) {
      console.warn('Erro ao salvar contexto:', ex)
    }
  }

  getContext(): string | null {
    try {
      const encryptedContext = localStorage.getItem(CONTEXT_STORAGE_KEY)
      if (!encryptedContext) {
        return null
      }
      return CryptoJS.AES.decrypt(encryptedContext, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)
    } catch (ex) {
      return null
    }
  }

  clearContext(): void {
    localStorage.removeItem(CONTEXT_STORAGE_KEY)
  }
}


decorate(injectable(), DefaultArchbaseTokenManager);
