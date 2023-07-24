/* eslint-disable no-prototype-builtins, no-continue */
import { cloneDeep } from 'lodash'

export class ArchbaseJacksonParser {
  /**
   * Converte um objeto Json serializado com Anteros e Jackson
   * @param {*} json Json a ser convertido para objeto
   */
  static convertJsonToObject(json) {
    // Verifica se o objeto é um array
    const isObject = (value) => {
      return typeof value === 'object'
    }

    // Busca e armazena todas as chaves e referências
    const getKeys = (obj, key) => {
      let keys: any = []
      for (const i in obj) {
        // Pula métodos
        if (!obj.hasOwnProperty(i)) {
          continue
        }

        if (isObject(obj[i])) {
          keys = keys.concat(getKeys(obj[i], key))
        } else if (i === key) {
          keys.push({ key: obj[key], obj })
        }
      }

      return keys
    }

    const convertToObjectHelper = (json, key, keys) => {
      // Armazena todas as referêncuas e chaves num mapa
      if (!keys) {
        keys = getKeys(json, key)

        const convertedKeys = {}

        for (let i = 0; i < keys.length; i++) {
          convertedKeys[keys[i].key] = keys[i].obj
        }

        keys = convertedKeys
      }

      const obj = json

      // Troca recursivamente todas as referências para as chaves pelos objetos reais
      for (const j in obj) {
        // Pula métodos
        if (!obj.hasOwnProperty(j)) {
          continue
        }

        if (isObject(obj[j])) {
          // Propriedade é um objeto, processa os filhos recursivamente
          convertToObjectHelper(obj[j], key, keys)
        } else if (j === key) {
          // Remove a referência @id do objeto
          delete obj[j]
        } else if (keys[obj[j]]) {
          // Troca a referência pelo objeto real
          obj[j] = keys[obj[j]]
        }
      }

      return obj
    }

    return convertToObjectHelper(json, '@id', undefined)
  }

  /**
   * Converte um objeto para Json serializando com @id no formato Anteros e Jackson
   * @param {*} obj Objeto a ser serializado para json
   */
  static convertObjectToJson(obj) {
    const newObj = cloneDeep(obj)

    // Gera um id global randômico - GUID
    const guid = () => {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1)
      }

      return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
    }

    // Verifica se o valor é um objeto
    const isObject = (value) => {
      return typeof value === 'object'
    }

    // Verifica se o objeto é um array
    const isArray = (obj) => {
      return Object.prototype.toString.call(obj) === '[object Array]'
    }

    const convertToJsonHelper = (obj, key, objects) => {
      // Inicializa um array de objetos e guarda o root dentro se existir
      if (!objects) {
        objects = []

        if (isObject(obj) && !isArray(obj)) {
          obj[key] = guid()
          objects.push(obj)
        }
      }

      for (const i in obj) {
        // Pula métodos
        if (!obj.hasOwnProperty(i)) {
          continue
        }

        if (isObject(obj[i])) {
          const objIndex = objects.indexOf(obj[i])

          if (objIndex === -1) {
            // Objeto não foi processado; gera uma chave(GUID) e continua
            // (não gera chaves para arrays)
            if (!isArray(obj[i]) && obj[i] !== null && obj[i] !== undefined) {
              obj[i][key] = guid()
              objects.push(obj[i])
            }

            // Processa as propriedades dos filhos
            // recursivamente
            convertToJsonHelper(obj[i], key, objects)
          } else {
            // Objeto foi processado;
            // Troca a referência existente pela chave gerada GUID
            obj[i] = objects[objIndex][key]
          }
        }
      }

      return obj
    }

    return convertToJsonHelper(newObj, '@id', undefined)
  }
}
