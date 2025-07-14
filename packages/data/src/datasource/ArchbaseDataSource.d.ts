import { DataSourceValidationError, IDataSourceValidator } from '@archbase/core';
export declare enum DataSourceEventNames {
    dataChanged = 0,
    recordChanged = 1,
    refreshData = 2,
    fieldChanged = 3,
    beforeClose = 4,
    afterClose = 5,
    beforeOpen = 6,
    afterOpen = 7,
    beforeAppend = 8,
    afterAppend = 9,
    beforeRemove = 10,
    afterRemove = 11,
    beforeInsert = 12,
    afterInsert = 13,
    beforeEdit = 14,
    afterEdit = 15,
    beforeSave = 16,
    afterSave = 17,
    beforeCancel = 18,
    afterCancel = 19,
    afterScroll = 20,
    onError = 21,
    onFieldError = 22
}
export type FilterFn<T> = (record: T) => boolean;
export interface DataSourceOptions<T> {
    records: T[];
    filters?: FilterFn<T>[];
    grandTotalRecords: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    filter?: string;
    sort?: string[];
    id?: any;
    defaultSortFields?: string[];
    originFilter?: any;
    originGlobalFilter?: any;
    originSort?: any;
    validator?: IDataSourceValidator;
    /**
 * Função opcional para retornar a identidade que será utilizada para identificar o registro.
 * Quando não definida, será utilizada por padrão o id.
 */
    getIdentity?: (record: T) => any;
}
export type DataSourceEventDataChangedType<T> = {
    type: DataSourceEventNames.dataChanged;
    data: T[];
};
export type DataSourceEventRecordChangedType<T> = {
    type: DataSourceEventNames.recordChanged;
    record: T;
    index: number;
};
export type DataSourceEventRefreshDataType<T> = {
    type: DataSourceEventNames.refreshData;
    options: DataSourceOptions<T>;
};
export type DataSourceEventFieldChangedType<T> = {
    type: DataSourceEventNames.fieldChanged;
    record: T;
    index: number;
    fieldName: string;
    oldValue: any;
    newValue: any;
};
export type DataSourceEventBeforeCloseType<_T> = {
    type: DataSourceEventNames.beforeClose;
};
export type DataSourceEventAfterCloseType<_T> = {
    type: DataSourceEventNames.afterClose;
};
export type DataSourceEventBeforeOpenType<_T> = {
    type: DataSourceEventNames.beforeOpen;
};
export type DataSourceEventAfterOpenType<_T> = {
    type: DataSourceEventNames.afterOpen;
};
export type DataSourceEventBeforeAppendType<T> = {
    type: DataSourceEventNames.beforeAppend;
    record?: T;
};
export type DataSourceEventAfterAppendType<T> = {
    type: DataSourceEventNames.afterAppend;
    record?: T;
    index: number;
};
export type DataSourceEventBeforeRemoveType<T> = {
    type: DataSourceEventNames.beforeRemove;
    record?: T;
    index: number;
};
export type DataSourceEventAfterRemoveType<T> = {
    type: DataSourceEventNames.afterRemove;
    record?: T;
    index: number;
};
export type DataSourceEventBeforeInsertType<_T> = {
    type: DataSourceEventNames.beforeInsert;
};
export type DataSourceEventAfterInsertType<T> = {
    type: DataSourceEventNames.afterInsert;
    record?: T;
    index: number;
};
export type DataSourceEventBeforeEditType<T> = {
    type: DataSourceEventNames.beforeEdit;
    record?: T;
    index: number;
};
export type DataSourceEventAfterEditType<T> = {
    type: DataSourceEventNames.afterEdit;
    record?: T;
    index: number;
};
export type DataSourceEventBeforeSaveType<T> = {
    type: DataSourceEventNames.beforeSave;
    record?: T;
    index: number;
};
export type DataSourceEventAfterSaveType<T> = {
    type: DataSourceEventNames.afterSave;
    record?: T;
    index: number;
};
export type DataSourceEventBeforeCancelType<T> = {
    type: DataSourceEventNames.beforeCancel;
    record?: T;
    index: number;
};
export type DataSourceEventAfterCancelType<T> = {
    type: DataSourceEventNames.afterCancel;
    record?: T;
    index: number;
};
export type DataSourceEventAfterScrollType<_T> = {
    type: DataSourceEventNames.afterScroll;
};
export type DataSourceEventOnErrorType<_T> = {
    type: DataSourceEventNames.onError;
    error: any;
    originalError: any;
};
export type DataSourceEventOnFieldErrorType<_T> = {
    type: DataSourceEventNames.onFieldError;
    error: any;
    originalError: any;
    fieldName: string;
};
export type DataSourceEvent<T> = DataSourceEventDataChangedType<T> | DataSourceEventRecordChangedType<T> | DataSourceEventRefreshDataType<T> | DataSourceEventFieldChangedType<T> | DataSourceEventBeforeCloseType<T> | DataSourceEventAfterCloseType<T> | DataSourceEventBeforeOpenType<T> | DataSourceEventAfterOpenType<T> | DataSourceEventBeforeAppendType<T> | DataSourceEventAfterAppendType<T> | DataSourceEventBeforeRemoveType<T> | DataSourceEventAfterRemoveType<T> | DataSourceEventBeforeInsertType<T> | DataSourceEventAfterInsertType<T> | DataSourceEventBeforeEditType<T> | DataSourceEventAfterEditType<T> | DataSourceEventBeforeSaveType<T> | DataSourceEventAfterSaveType<T> | DataSourceEventBeforeCancelType<T> | DataSourceEventAfterCancelType<T> | DataSourceEventAfterScrollType<T> | DataSourceEventOnErrorType<T> | DataSourceEventOnFieldErrorType<T>;
export type DataSourceListener<T> = (event: DataSourceEvent<T>) => void;
/**
 * Eventos gerados pelo DataSource
 */
export interface DataSourceEvents<T> {
    /**
     * Evento gerado pelo DataSource quando os dados são alterados.
     * @param data Dados alterados
     * @param options Opções usadas
     * @returns
     */
    dataChanged: (data: T[], options: DataSourceOptions<T>) => void;
    /**
     * Evento gerado pelo DataSource quando um registro é alterado
     * @param record Registro alterado
     * @param index Indice do registro dentro da coleção de dados
     * @returns
     */
    recordChanged: (record: T, index: number) => void;
    /**
     * Evento gerado pelo DataSource quando um campo é alterado. Comumente usado
     * para fazer bind bidirecional e atualizar componentes visuais.
     * @param record Registro alterado
     * @param index  Indice do registro alterado
     * @param fieldName Nome do campo alterado
     * @param oldValue Valor antigo
     * @param newValue Novo Valor
     * @returns
     */
    fieldChanged: (record: T, index: number, fieldName: string, oldValue: any, newValue: any) => void;
    /**
     * Evento gerado pelo DataSource antes dele ser fechado.
     */
    beforeClose: () => void;
    /**
     * Evento gerado pelo DataSource após ele ser fechado.
     */
    afterClose: () => void;
    /**
     * Evento gerado pelo DataSource antes de ser aberto.
     */
    beforeOpen: () => void;
    /**
     * Evento gerado pelo DataSource após ele ser aberto.
     */
    afterOpen: () => void;
    /**
     * Evento gerado pelo DataSource antes de um registro ser adicionado a coleção de dados.
     * @param record Registro adicionado
     * @returns
     */
    beforeAppend: (record: T) => void;
    /**
     * Evento gerado pelo DataSource após o registro ser adicionado a coleção de dados.
     * @param record Registro adicionado
     * @param index Posição onde o registro foi adicionado
     * @returns
     */
    afterAppend: (record: T, index: number) => void;
    /**
     * Evento gerado pelo DataSource antes de um registro ser removido
     * @param record Registro sendo removido
     * @param index Indice do registro sendo removido
     * @returns
     */
    beforeRemove: (record: T, index: number) => void;
    /**
     * Evento gerado pelo DataSource após o registro ser removido
     * @param record Registro removido
     * @param index Indice do registro removido
     * @returns
     */
    afterRemove: (record: T, index: number) => void;
    /**
     * Evento gerado pelo DataSource antes de um novo registro ser inserido para edição.
     * @returns
     */
    beforeInsert: () => void;
    /**
     * Evento gerado pelo DataSource após um registro ser inserido para edição.
     * @param record Registro inserido
     * @param index Indice do registro inserido
     * @returns
     */
    afterInsert: (record: T, index: number) => void;
    /**
     * Evento gerado pelo DataSource antes de um registro entrar no modo de edição.
     * Ouvindo este evento é possível por exemplo atribuir valores padrões ao registro
     * que não serão preenchidos pelo usuário.
     *
     * @param record Registro a ser editado
     * @param index Indice do registro que vai ser editado
     * @returns
     */
    beforeEdit: (record: T, index: number) => void;
    /**
     * Evento gerado pelo DataSource após o registro entrar no modo de edição.
     * @param record
     * @param index
     * @returns
     */
    afterEdit: (record: T, index: number) => void;
    /**
     * Evento gerado pelo DataSource que ocorre antes de salvar o registro sendo editado ou inserido.
     * Poderia ser usado para fazer validações ou logs caso necessário.
     * @param record Registro sendo salvo
     * @param index Indice do registro sendo salvo
     * @returns
     */
    beforeSave: (record: T, index: number) => void;
    /**
     * Evento gerado pelo DataSource após um registro ser salvo.
     * @param record Registro salvo
     * @param index Indice do registro salvo
     * @returns
     */
    afterSave: (record: T, index: number) => void;
    /**
     * Evento gerado pelo DataSource antes de ser cancelada a edição ou inserção de um registro.
     * @param record Registro sendo cancelado
     * @param index Indice do registro sendo cancelado
     * @returns
     */
    beforeCancel: (record: T, index: number) => void;
    /**
     * Evento gerado pelo DataSource após ser cancelada a edição/inserção do registro.
     * @param record
     * @param index
     * @returns
     */
    afterCancel: (record: T, index: number) => void;
    /**
     * Evento gerado pelo DataSource quando o indice da posição atual é alterada,
     * ou seja quando é posicionando em um novo registro.
     * @returns
     */
    afterScroll: () => void;
    /**
     * Evento gerado pelo DataSource quando ocorre algum erro em alguma das operações.
     * @param error Erro ocorrido já processado para apresentação.
     * @param originalError Erro original
     * @returns
     */
    onError: (error: any, originalError: any) => void;
}
export interface IDataSource<T> {
    open: (options: DataSourceOptions<T>) => void;
    close: () => void;
    clear: () => void;
    setData: (options: DataSourceOptions<T>) => void;
    insert: (record: T) => this;
    edit: () => this;
    remove: (callback?: Function) => Promise<T | undefined>;
    save: (callback?: Function) => Promise<T | undefined>;
    cancel: () => this;
    getName: () => string;
    getOptions: () => DataSourceOptions<T>;
    refreshData: (options?: DataSourceOptions<T>) => void;
    browseRecords: () => T[];
    getCurrentRecord: () => T | undefined;
    getTotalRecords: () => number;
    getGrandTotalRecords: () => number;
    getCurrentPage: () => number;
    getTotalPages: () => number;
    setFieldValue: (fieldName: string, value: any) => this;
    getFieldValue: (fieldName: string, defaultValue: any) => any;
    isEmptyField: (fieldName: string) => boolean;
    isBOF: () => boolean;
    isEOF: () => boolean;
    isEmpty: () => boolean;
    isFirst: () => boolean;
    isLast: () => boolean;
    isInserting: () => boolean;
    isEditing: () => boolean;
    isBrowsing: () => boolean;
    isActive: () => boolean;
    next: () => this;
    prior: () => this;
    first: () => this;
    last: () => this;
    goToPage: (pageNumber: number) => this;
    goToRecord: (recordIndex: number) => T | undefined;
    gotoRecordByData: (record: T) => boolean;
    disabledAllListeners: () => this;
    enableAllListeners: () => this;
    addListener: (...listener: DataSourceListener<T>[]) => this;
    removeListener: (...listener: DataSourceListener<T>[]) => this;
    addFieldChangeListener: (fieldName: string, listener: (fieldName: string, oldValue: any, newValue: any) => void) => this;
    removeFieldChangeListener: (fieldName: string, listener: (fieldName: string, oldValue: any, newValue: any) => void) => this;
    addFilter: (filterFn: FilterFn<T>) => this;
    removeFilter: (filterFn: FilterFn<T>) => this;
    clearFilters: () => this;
    locate(values: any): boolean;
    locateByFilter(filterFn: (record: T) => boolean): boolean;
    validate: () => boolean;
}
export type { DataSourceValidationError, IDataSourceValidator } from '@archbase/core';
export declare class ArchbaseDataSourceEventEmitter {
    private eventEmitter;
    private listenersDisable;
    constructor();
    disabledAllListeners(): this;
    enableAllListeners(): this;
    emit(event: string | symbol, ...args: any[]): boolean;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    off(event: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
}
export declare class ArchbaseDataSource<T, _ID> implements IDataSource<T> {
    protected fieldEventListeners: Record<string, ((fieldName: string, oldValue: any, newValue: any) => void)[]>;
    protected records: T[];
    protected filteredRecords: T[];
    protected filters?: FilterFn<T>[];
    protected grandTotalRecords: number;
    protected currentPageIndex: number;
    protected totalPages: number;
    protected pageSize: number;
    protected currentRecordIndex: number;
    protected currentRecord: T | undefined;
    protected oldRecord: T | undefined;
    protected oldRecordIndex: number;
    protected emitter: ArchbaseDataSourceEventEmitter;
    protected listeners: Set<DataSourceListener<T>>;
    protected listenersDisable: boolean;
    protected inserting: boolean;
    protected active: boolean;
    protected editing: boolean;
    protected name: string;
    protected label: string;
    readonly uuid: string;
    lastDataChangedAt: number;
    lastDataBrowsingOn: number;
    protected filter: string | undefined;
    protected sort: string[] | undefined;
    protected originFilter: any | undefined;
    protected originSort: any | undefined;
    protected originGlobalFilter: any | undefined;
    protected defaultSortFields: string[];
    protected validator?: IDataSourceValidator;
    protected getIdentity?: any;
    constructor(name: string, options: DataSourceOptions<T>, label?: string);
    private loadOptions;
    protected validateDataSourceActive(operation: string): void;
    getName(): string;
    /**
     * Limpa os dados do DataSource. Ao usar este método os seguintes eventos serão gerados:
     * beforeClose, afterOpen, dataChanged, afterScroll
     */
    clear(): void;
    open(options: DataSourceOptions<T>): void;
    close(): void;
    setData(options: DataSourceOptions<T>): void;
    goToPage(_pageNumber: number): this;
    goToRecord(recordIndex: number): T | undefined;
    disabledAllListeners(): this;
    enableAllListeners(): this;
    addFilter(filterFn: FilterFn<T>): this;
    removeFilter(filterFn: FilterFn<T>): this;
    clearFilters(): this;
    private applyFilters;
    protected emit(event: DataSourceEvent<T>): void;
    append(record: T): number;
    insert(record: T): this;
    edit(): this;
    remove(callback?: Function): Promise<T | undefined>;
    isBrowsing(): boolean;
    isEditing(): boolean;
    isInserting(): boolean;
    isActive(): boolean;
    getPageSize(): number;
    protected publishEventErrors: (errors: DataSourceValidationError[]) => void;
    protected publishEventError: (errorMessage: string, error: any) => void;
    validate(): boolean;
    save(callback?: Function): Promise<T>;
    cancel(): this;
    getCurrentPage(): number;
    getTotalPages(): number;
    getTotalRecords(): number;
    getGrandTotalRecords(): number;
    getFieldValue(fieldName: string, defaultValue?: any): any;
    private fieldValueByName;
    setFieldValue(fieldName: string, value: any): this;
    isEmptyField(fieldName: string): boolean;
    getOptions(): DataSourceOptions<T>;
    refreshData(options?: DataSourceOptions<T>): void;
    browseRecords(): T[];
    getCurrentIndex(): number;
    getCurrentRecord(): T | undefined;
    isEOF(): boolean;
    isBOF(): boolean;
    isEmpty(): boolean;
    isFirst(): boolean;
    isLast(): boolean;
    next(): this;
    prior(): this;
    first(): this;
    last(): this;
    gotoRecord(index: number): T | undefined;
    gotoRecordByData(record: any): boolean;
    locate(values: any): boolean;
    locateByFilter(filterFn: (record: T) => boolean): boolean;
    addListener(listener: DataSourceListener<T>): this;
    removeListener(listener: DataSourceListener<T>): this;
    on<K extends keyof DataSourceEvents<T>>(eventName: K, listener: DataSourceEvents<T>[K]): void;
    off<K extends keyof DataSourceEvents<T>>(eventName: K, listener: DataSourceEvents<T>[K]): void;
    addFieldChangeListener(fieldName: string, listener: (fieldName: string, oldValue: any, newValue: any) => void): this;
    removeFieldChangeListener(fieldName: string, listener: (fieldName: string, oldValue: any, newValue: any) => void): this;
    private emitFieldChangeEvent;
    /**
     * Define um erro para um campo específico
     * @param fieldName Nome do campo
     * @param errors Array de mensagens de erro
     */
    setFieldError(fieldName: string, errors: string[]): void;
}
//# sourceMappingURL=ArchbaseDataSource.d.ts.map