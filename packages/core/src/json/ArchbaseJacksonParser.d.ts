export declare class ArchbaseJacksonParser {
    private static isSimpleMap;
    private static isSimpleArray;
    private static shouldAddId;
    /**
     * Converte um objeto Json serializado com Anteros e Jackson
     * @param {*} json Json a ser convertido para objeto
     */
    static convertJsonToObject(json: any): any;
    /**
     * Converte um objeto para Json serializando com @id no formato Anteros e Jackson
     * @param {*} obj Objeto a ser serializado para json
     */
    static convertObjectToJson(obj: any): any;
}
//# sourceMappingURL=ArchbaseJacksonParser.d.ts.map