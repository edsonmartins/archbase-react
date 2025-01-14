/* eslint-disable no-prototype-builtins, no-continue */
import { cloneDeep } from 'lodash';

export class ArchbaseJacksonParser {
  // Helper para verificar se é um Map simples (string -> number/string)
  private static isSimpleMap(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;
    
    return Object.entries(obj).every(([key, value]) => 
      typeof key === 'string' && 
      (typeof value === 'number' || typeof value === 'string')
    );
  }

  // Helper para verificar se é um Array simples (de strings)
  private static isSimpleArray(obj: any): boolean {
    return Array.isArray(obj) && obj.every(item => typeof item === 'string');
  }

  // Helper para verificar se o objeto deve receber @id
  private static shouldAddId(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;
    
    return !ArchbaseJacksonParser.isSimpleMap(obj) && 
           !ArchbaseJacksonParser.isSimpleArray(obj) &&
           obj !== null &&
           obj !== undefined;
  }

  /**
   * Converte um objeto Json serializado com Anteros e Jackson
   * @param {*} json Json a ser convertido para objeto
   */
  static convertJsonToObject(json: any) {
    // Verifica se o valor é um objeto
    const isObject = (value: any) => {
      return typeof value === 'object';
    };

    // Busca e armazena todas as chaves e referências
    const getKeys = (obj: any, key: string) => {
      let keys: any = [];
      for (const i in obj) {
        // Pula métodos
        if (!obj.hasOwnProperty(i)) {
          continue;
        }
        if (isObject(obj[i])) {
          keys = keys.concat(getKeys(obj[i], key));
        } else if (i === key) {
          keys.push({ key: obj[key], obj });
        }
      }
      return keys;
    };

    const convertToObjectHelper = (json: any, key: string, keys: any) => {
      // Armazena todas as referências e chaves num mapa
      if (!keys) {
        keys = getKeys(json, key);
        const convertedKeys: any = {};
        for (let i = 0; i < keys.length; i++) {
          convertedKeys[keys[i].key] = keys[i].obj;
        }
        keys = convertedKeys;
      }

      const obj = json;
      // Troca recursivamente todas as referências para as chaves pelos objetos reais
      for (const j in obj) {
        // Pula métodos
        if (!obj.hasOwnProperty(j)) {
          continue;
        }
        if (isObject(obj[j])) {
          // Propriedade é um objeto, processa os filhos recursivamente
          convertToObjectHelper(obj[j], key, keys);
        } else if (j === key) {
          // Remove a referência @id do objeto
          delete obj[j];
        } else if (keys[obj[j]]) {
          // Troca a referência pelo objeto real
          obj[j] = keys[obj[j]];
        }
      }
      return obj;
    };

    return convertToObjectHelper(json, '@id', undefined);
  }

  /**
   * Converte um objeto para Json serializando com @id no formato Anteros e Jackson
   * @param {*} obj Objeto a ser serializado para json
   */
  static convertObjectToJson(obj: any) {
    const newObj = cloneDeep(obj);

    // Gera um id global randômico - GUID
    const guid = () => {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    };

    // Verifica se o valor é um objeto
    const isObject = (value: any) => {
      return typeof value === 'object';
    };

    const convertToJsonHelper = (obj: any, key: string, objects: any[]) => {
      // Inicializa um array de objetos e guarda o root dentro se existir
      if (!objects) {
        objects = [];
        if (ArchbaseJacksonParser.shouldAddId(obj)) {
          obj[key] = guid();
          objects.push(obj);
        }
      }

      for (const i in obj) {
        // Pula métodos
        if (!obj.hasOwnProperty(i)) {
          continue;
        }

        if (isObject(obj[i])) {
          const objIndex = objects.indexOf(obj[i]);
          
          if (objIndex === -1) {
            // Objeto não foi processado; gera uma chave(GUID) e continua
            if (ArchbaseJacksonParser.shouldAddId(obj[i])) {
              obj[i][key] = guid();
              objects.push(obj[i]);
            }
            // Processa as propriedades dos filhos recursivamente
            convertToJsonHelper(obj[i], key, objects);
          } else {
            // Objeto foi processado;
            // Troca a referência existente pela chave gerada GUID
            obj[i] = objects[objIndex][key];
          }
        }
      }

      return obj;
    };

    return convertToJsonHelper(newObj, '@id', undefined);
  }
}