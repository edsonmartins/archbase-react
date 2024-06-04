/* eslint-disable no-unused-vars */
import { isDate, parse, parseISO } from 'date-fns';
import { EventEmitter } from 'events';
import i18next from 'i18next';
import { cloneDeep, uniqueId } from 'lodash';
import { ArchbaseDataSourceError } from '../core/exceptions';
import { ArchbaseObjectHelper } from '../core/helper';

export enum DataSourceEventNames {
	dataChanged,
	recordChanged,
	refreshData,
	fieldChanged,
	beforeClose,
	afterClose,
	beforeOpen,
	afterOpen,
	beforeAppend,
	afterAppend,
	beforeRemove,
	afterRemove,
	beforeInsert,
	afterInsert,
	beforeEdit,
	afterEdit,
	beforeSave,
	afterSave,
	beforeCancel,
	afterCancel,
	afterScroll,
	onError,
	onFieldError,
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
export type DataSourceEventBeforeCloseType<_T> = { type: DataSourceEventNames.beforeClose };
export type DataSourceEventAfterCloseType<_T> = { type: DataSourceEventNames.afterClose };
export type DataSourceEventBeforeOpenType<_T> = { type: DataSourceEventNames.beforeOpen };
export type DataSourceEventAfterOpenType<_T> = { type: DataSourceEventNames.afterOpen };
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
export type DataSourceEventBeforeInsertType<_T> = { type: DataSourceEventNames.beforeInsert };
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
export type DataSourceEventAfterScrollType<_T> = { type: DataSourceEventNames.afterScroll };
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

export type DataSourceEvent<T> =
	| DataSourceEventDataChangedType<T>
	| DataSourceEventRecordChangedType<T>
	| DataSourceEventRefreshDataType<T>
	| DataSourceEventFieldChangedType<T>
	| DataSourceEventBeforeCloseType<T>
	| DataSourceEventAfterCloseType<T>
	| DataSourceEventBeforeOpenType<T>
	| DataSourceEventAfterOpenType<T>
	| DataSourceEventBeforeAppendType<T>
	| DataSourceEventAfterAppendType<T>
	| DataSourceEventBeforeRemoveType<T>
	| DataSourceEventAfterRemoveType<T>
	| DataSourceEventBeforeInsertType<T>
	| DataSourceEventAfterInsertType<T>
	| DataSourceEventBeforeEditType<T>
	| DataSourceEventAfterEditType<T>
	| DataSourceEventBeforeSaveType<T>
	| DataSourceEventAfterSaveType<T>
	| DataSourceEventBeforeCancelType<T>
	| DataSourceEventAfterCancelType<T>
	| DataSourceEventAfterScrollType<T>
	| DataSourceEventOnErrorType<T>
	| DataSourceEventOnFieldErrorType<T>;

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
	addFieldChangeListener: (
		fieldName: string,
		listener: (fieldName: string, oldValue: any, newValue: any) => void,
	) => this;
	removeFieldChangeListener: (
		fieldName: string,
		listener: (fieldName: string, oldValue: any, newValue: any) => void,
	) => this;
	addFilter: (filterFn: FilterFn<T>) => this;
	removeFilter: (filterFn: FilterFn<T>) => this;
	clearFilters: () => this;
	locate(values: any): boolean;
	locateByFilter(filterFn: (record: T) => boolean): boolean;
	validate: () => boolean;
}

export type DataSourceValidationError = {
	errorMessage: string;
	debugMessage: string;
	fieldName: string;
};

export interface IDataSourceValidator {
	validateEntity<T>(value: T): DataSourceValidationError[];
}

export class ArchbaseDataSourceEventEmitter {
	private eventEmitter: EventEmitter;

	private listenersDisable = false;

	constructor() {
		this.eventEmitter = new EventEmitter();
	}

	public disabledAllListeners(): this {
		this.listenersDisable = true;

		return this;
	}

	public enableAllListeners(): this {
		this.listenersDisable = false;

		return this;
	}

	public emit(event: string | symbol, ...args: any[]): boolean {
		if (this.listenersDisable) return false;

		return this.eventEmitter.emit(event, args);
	}

	public addListener(event: string | symbol, listener: (...args: any[]) => void): this {
		this.eventEmitter.addListener(event, listener);

		return this;
	}

	public on(event: string | symbol, listener: (...args: any[]) => void): this {
		this.eventEmitter.on(event, listener);

		return this;
	}

	public once(event: string | symbol, listener: (...args: any[]) => void): this {
		this.eventEmitter.once(event, listener);

		return this;
	}

	public removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
		this.eventEmitter.removeListener(event, listener);

		return this;
	}

	public off(event: string | symbol, listener: (...args: any[]) => void): this {
		this.eventEmitter.off(event, listener);

		return this;
	}

	public removeAllListeners(event?: string | symbol): this {
		this.eventEmitter.removeAllListeners(event);

		return this;
	}
}

export class ArchbaseDataSource<T, _ID> implements IDataSource<T> {
	protected fieldEventListeners: Record<string, ((fieldName: string, oldValue: any, newValue: any) => void)[]>;

	protected records: T[];

	protected filteredRecords: T[];

	protected filters?: FilterFn<T>[];

	protected grandTotalRecords = 0;

	protected currentPageIndex = 0;

	protected totalPages = 0;

	protected pageSize = 0;

	protected currentRecordIndex = -1;

	protected currentRecord: T | undefined;

	protected oldRecord: T | undefined;

	protected oldRecordIndex = -1;

	protected emitter: ArchbaseDataSourceEventEmitter;

	protected listeners: Set<DataSourceListener<T>> = new Set();

	protected listenersDisable = false;

	protected inserting = false;

	protected active = false;

	protected editing = false;

	protected name: string;

	protected label: string;

	public readonly uuid: string;

	public lastDataChangedAt: number = new Date().getTime();

	public lastDataBrowsingOn: number = new Date().getTime();

	protected filter: string | undefined;

	protected sort: string[] | undefined;

	protected originFilter: any | undefined;

	protected originSort: any | undefined;

	protected originGlobalFilter: any | undefined;

	protected defaultSortFields: string[] = [];

	protected validator?: IDataSourceValidator;

	protected getIdentity?: any;

	constructor(name: string, options: DataSourceOptions<T>, label?: string) {
		this.name = name;
		this.label = label || name;
		this.records = [];
		this.filteredRecords = [];
		this.loadOptions(options);
		this.fieldEventListeners = {};
		this.emitter = new ArchbaseDataSourceEventEmitter();
		this.uuid = uniqueId();
		this.validator = options.validator;
		this.getIdentity = options.getIdentity;
	}

	private loadOptions(options: DataSourceOptions<T>) {
		this.records = options.records;
		this.filters = [];
		if (options.filters) {
			this.filters = options.filters;
		}
		this.currentRecord = undefined;
		this.currentRecordIndex = -1;
		this.filteredRecords = this.applyFilters();
		if (this.filteredRecords.length > 0) {
			this.currentRecordIndex = 0;
			this.currentRecord = this.filteredRecords[this.currentRecordIndex];
		}
		this.grandTotalRecords = options.grandTotalRecords;
		this.currentPageIndex = options.currentPage;
		this.totalPages = options.totalPages;
		this.pageSize = options.pageSize;
		this.active = true;
		this.filter = options.filter;
		this.sort = options.sort;
		this.originFilter = options.originFilter;
		this.originSort = options.originSort;
		this.originGlobalFilter = options.originGlobalFilter;
		this.defaultSortFields = options.defaultSortFields ? options.defaultSortFields : [];
	}

	protected validateDataSourceActive(operation: string) {
		if (!this.isActive()) {
			const msg = i18next.t('archbase:operationNotAllowed', { dataSourceName: this.name, operation });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
	}

	public getName(): string {
		return this.name;
	}

	/**
	 * Limpa os dados do DataSource. Ao usar este método os seguintes eventos serão gerados:
	 * beforeClose, afterOpen, dataChanged, afterScroll
	 */
	public clear(): void {
		if (!this.isActive()) {
			const msg = i18next.t('archbase:operationNotAllowed', { dataSourceName: this.name, operation: 'clear' });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}

		this.emitter.emit('beforeClose');
		this.emit({ type: DataSourceEventNames.beforeClose });

		this.loadOptions({
			records: [],
			totalPages: 0,
			grandTotalRecords: 0,
			currentPage: 0,
			pageSize: 0,
		});

		this.active = true;
		this.editing = false;
		this.inserting = false;

		this.emitter.emit('afterOpen');
		this.emit({ type: DataSourceEventNames.afterOpen });

		this.emitter.emit('dataChanged', this.records);
		this.emit({ type: DataSourceEventNames.dataChanged, data: this.records });

		this.emitter.emit('afterScroll');
		this.emit({ type: DataSourceEventNames.afterScroll });
		this.lastDataBrowsingOn = new Date().getTime();
		this.lastDataChangedAt = new Date().getTime();
	}

	public open(options: DataSourceOptions<T>): void {
		this.active = false;

		this.emitter.emit('beforeClose');
		this.emit({ type: DataSourceEventNames.beforeClose });

		this.loadOptions(options);

		this.active = true;

		this.emitter.emit('afterOpen');
		this.emit({ type: DataSourceEventNames.afterOpen });

		this.emitter.emit('dataChanged', this.records);
		this.emit({ type: DataSourceEventNames.dataChanged, data: this.records });

		this.emitter.emit('afterScroll');
		this.emit({ type: DataSourceEventNames.afterScroll });
		this.lastDataBrowsingOn = new Date().getTime();
		this.lastDataChangedAt = new Date().getTime();
	}

	public close(): void {
		this.validateDataSourceActive('close');

		this.emitter.emit('beforeClose');
		this.emit({ type: DataSourceEventNames.beforeClose });

		this.active = false;

		this.emitter.emit('afterClose');
		this.emit({ type: DataSourceEventNames.afterClose });

		this.emitter.emit('afterScroll');
		this.emit({ type: DataSourceEventNames.afterScroll });
		this.lastDataBrowsingOn = new Date().getTime();
		this.lastDataChangedAt = new Date().getTime();
	}

	public setData(options: DataSourceOptions<T>): void {
		this.validateDataSourceActive('setData');

		this.loadOptions(options);

		this.emitter.emit('dataChanged', this.records);
		this.emit({ type: DataSourceEventNames.dataChanged, data: this.records });
		this.lastDataChangedAt = new Date().getTime();
	}

	public goToPage(_pageNumber: number): this {
		this.validateDataSourceActive('goToPage');

		return this;
	}

	public goToRecord(recordIndex: number): T | undefined {
		this.validateDataSourceActive('goToRecord');
		if (this.inserting || this.editing || this.isBOF() || this.isEOF()) {
			const msg = i18next.t('archbase:notAllowedBrowseRecords', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		if (recordIndex <= this.getTotalRecords() - 1) {
			this.currentRecordIndex = recordIndex;
			this.emitter.emit('afterScroll');
			this.emit({ type: DataSourceEventNames.afterScroll });
			this.lastDataBrowsingOn = new Date().getTime();
		}

		return undefined;
	}

	public disabledAllListeners(): this {
		this.listenersDisable = true;
		this.emitter.disabledAllListeners();

		return this;
	}

	public enableAllListeners(): this {
		this.listenersDisable = false;
		this.emitter.enableAllListeners();

		return this;
	}

	public addFilter(filterFn: FilterFn<T>): this {
		this.filters?.push(filterFn);

		return this;
	}

	public removeFilter(filterFn: FilterFn<T>): this {
		const index = this.filters?.indexOf(filterFn);
		if (index && index >= 0) {
			this.filters?.splice(index, 1);
		}

		return this;
	}

	public clearFilters(): this {
		this.filters = [];

		return this;
	}

	private applyFilters(): T[] {
		if (!this.filters || this.filters.length === 0) {
			return this.records;
		}
		let result = [...this.records];
		this.filters?.forEach((filter) => {
			result = result.filter(filter);
		});

		return result;
	}

	protected emit(event: DataSourceEvent<T>): void {
		if (this.listenersDisable) return;

		for (const listener of this.listeners) {
			listener(event);
		}
	}

	public append(record: T): number {
		this.validateDataSourceActive('append');
		if (this.inserting || this.editing) {
			const msg = i18next.t('archbase:insertRecordIsNotAllowed', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		this.emitter.emit('beforeAppend', record);
		this.emit({ type: DataSourceEventNames.beforeAppend, record });

		this.records.push(record);
		this.filteredRecords = this.applyFilters();
		this.grandTotalRecords++;
		let found = false;
		this.filteredRecords.forEach((r, index) => {
			if (record === r) {
				this.currentRecordIndex = index;
				this.currentRecord = this.filteredRecords[this.currentRecordIndex];
				this.emitter.emit('afterScroll');
				this.emit({ type: DataSourceEventNames.afterScroll });
				this.lastDataBrowsingOn = new Date().getTime();
				found = true;
			}
		});

		this.emitter.emit('afterAppend', record, this.currentRecordIndex);
		this.emit({
			type: DataSourceEventNames.afterAppend,
			record,
			index: this.currentRecordIndex,
		});
		this.emitter.emit('afterScroll');
		this.emit({ type: DataSourceEventNames.afterScroll });

		this.lastDataBrowsingOn = new Date().getTime();
		this.lastDataChangedAt = new Date().getTime();

		return this.currentRecordIndex;
	}

	public insert(record: T): this {
		this.validateDataSourceActive('insert');
		if (this.inserting || this.editing) {
			const msg = i18next.t('archbase:insertRecordIsNotAllowed', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		this.emitter.emit('beforeInsert');
		this.emit({ type: DataSourceEventNames.beforeInsert });

		this.oldRecord = this.getCurrentRecord();
		this.oldRecordIndex = this.currentRecordIndex;

		this.grandTotalRecords++;
		const nextRecordIndex = this.getTotalRecords();
		this.filteredRecords.push(record);
		this.currentRecordIndex = nextRecordIndex;
		this.currentRecord = record;
		this.inserting = true;

		this.emitter.emit('afterInsert', record, this.currentRecordIndex);
		this.emit({
			type: DataSourceEventNames.afterInsert,
			record,
			index: this.currentRecordIndex,
		});

		this.emitter.emit('afterScroll');
		this.emit({ type: DataSourceEventNames.afterScroll });
		this.lastDataBrowsingOn = new Date().getTime();
		this.lastDataChangedAt = new Date().getTime();

		return this;
	}

	public edit(): this {
		this.validateDataSourceActive('edit');
		if (this.inserting || this.editing) {
			const msg = i18next.t('archbase:editRecordIsNotAllowed', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		if (this.isEmpty() || !this.currentRecord) {
			const msg = i18next.t('archbase:noRecordsToEdit', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		if (this.isBOF()) {
			const msg = i18next.t('archbase:BOFDataSource', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		if (this.isEOF()) {
			const msg = i18next.t('archbase:EOFDataSource', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}

		this.emitter.emit('beforeEdit', this.currentRecord, this.currentRecordIndex);
		this.emit({
			type: DataSourceEventNames.beforeEdit,
			record: this.currentRecord,
			index: this.getCurrentIndex(),
		});

		this.editing = true;
		this.currentRecord = cloneDeep(this.currentRecord);

		this.emitter.emit('afterEdit', this.currentRecord, this.getCurrentIndex());
		this.emit({
			type: DataSourceEventNames.afterEdit,
			record: this.currentRecord,
			index: this.getCurrentIndex(),
		});

		return this;
	}

	public async remove(callback?: Function): Promise<T | undefined> {
		this.validateDataSourceActive('remove');
		if (this.inserting || this.editing) {
			const msg = i18next.t('archbase:removingRecordIsNotAllowed', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		if (this.isEmpty() || !this.currentRecord) {
			const msg = i18next.t('archbase:noRecordsToEdit', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		if (this.isBOF()) {
			const msg = i18next.t('archbase:BOFDataSource', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		if (this.isEOF()) {
			const msg = i18next.t('archbase:EOFDataSource', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}

		this.emitter.emit('beforeRemove', this.currentRecord, this.currentRecordIndex);
		this.emit({
			type: DataSourceEventNames.beforeRemove,
			record: this.currentRecord,
			index: this.getCurrentIndex(),
		});

		let index = -1;
		const deletedRecord = this.currentRecord;
		const deletedIndex = this.currentRecordIndex;
		this.records.forEach((item, idx) => {
			if (this.currentRecord === item) {
				index = idx;
			}
		});
		if (index >= 0) {
			this.records.splice(index, 1);
		}
		if (this.records !== this.filteredRecords) {
			this.filteredRecords.splice(this.getCurrentIndex(), 1);
		}
		this.grandTotalRecords--;
		if (this.filteredRecords.length === 0) {
			this.currentRecord = undefined;
			this.currentRecordIndex = -1;
		} else {
			if (this.currentRecordIndex > this.filteredRecords.length - 1) {
				this.currentRecordIndex--;
			}
			this.currentRecord = this.filteredRecords[this.currentRecordIndex];
		}
		this.editing = false;
		this.inserting = false;

		this.emitter.emit('afterScroll');
		this.emit({ type: DataSourceEventNames.afterScroll });
		this.emitter.emit('afterRemove', deletedRecord, deletedIndex);
		this.emit({
			type: DataSourceEventNames.afterRemove,
			record: deletedRecord,
			index: deletedIndex,
		});

		this.lastDataBrowsingOn = new Date().getTime();
		this.lastDataChangedAt = new Date().getTime();

		if (callback) {
			callback();
		}

		return deletedRecord;
	}

	public isBrowsing(): boolean {
		return !this.isEditing() && !this.isInserting() && this.isActive();
	}

	public isEditing(): boolean {
		return this.editing;
	}

	public isInserting(): boolean {
		return this.inserting;
	}

	public isActive(): boolean {
		return this.active;
	}

	public getPageSize(): number {
		return this.pageSize;
	}

	protected publishEventErrors = (errors: DataSourceValidationError[]) => {
		errors.forEach((error) => {
			if (error.fieldName) {
				this.emitter.emit('onFieldError', error.fieldName, error.errorMessage);
				this.emit({
					type: DataSourceEventNames.onFieldError,
					fieldName: error.fieldName,
					error: error.errorMessage,
					originalError: error,
				});
			} else {
				this.publishEventError(error.errorMessage, error);
			}
		});
	};

	protected publishEventError = (errorMessage: string, error: any) => {
		this.emitter.emit('onError', errorMessage);
		this.emit({
			type: DataSourceEventNames.onError,
			error: errorMessage,
			originalError: error,
		});
	};

	public validate(): boolean {
		if (this.validator && this.currentRecord) {
			const errors = this.validator.validateEntity<T>(this.currentRecord);
			if (errors && errors.length > 0) {
				this.publishEventErrors(errors);
				if (!errors[0].fieldName) {
					throw new ArchbaseDataSourceError(errors[0].errorMessage);
				} else {
					const msg = i18next.t('archbase:errorSavingRecord', { dataSourceName: this.label });
					throw new ArchbaseDataSourceError(msg);
				}
			}
		}
		return true;
	}

	public async save(callback?: Function): Promise<T> {
		this.validateDataSourceActive('save');
		if (!this.inserting && !this.editing) {
			const msg = i18next.t('archbase:saveRecordIsNotAllowed', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		if (!this.currentRecord) {
			const msg = i18next.t('archbase:noRecordToSave', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}

		this.emitter.emit('beforeSave', this.currentRecord, this.getCurrentIndex());
		this.emit({
			type: DataSourceEventNames.beforeSave,
			record: this.currentRecord,
			index: this.getCurrentIndex(),
		});

		if (this.validator) {
			const errors = this.validator.validateEntity<T>(this.currentRecord);
			if (errors && errors.length > 0) {
				this.publishEventErrors(errors);
				if (!errors[0].fieldName) {
					throw new ArchbaseDataSourceError(errors[0].errorMessage);
				} else {
					const msg = i18next.t('archbase:errorSavingRecord', { dataSourceName: this.label });
					throw new ArchbaseDataSourceError(msg);
				}
			}
		}

		if (this.editing) {
			this.filteredRecords[this.getCurrentIndex()] = this.currentRecord;
		}

		let index = -1;
		this.records.forEach((item, idx) => {
			const recordIdentity = this.getIdentity ? this.getIdentity(item) : item["id"];
			const currentRecordIdentity = this.getIdentity ? this.getIdentity(this.currentRecord) : this.currentRecord["id"];
			
			if (recordIdentity !== undefined && (recordIdentity === currentRecordIdentity || item === this.currentRecord)) {
					index = idx;
			}
		});
		if (index >= 0) {
			this.records[index] = this.currentRecord;
		} else {
			this.records.push(this.currentRecord);
		}
		this.editing = false;
		this.inserting = false;

		this.lastDataChangedAt = new Date().getTime();

		this.emitter.emit('afterSave', this.currentRecord, this.getCurrentIndex());
		this.emit({
			type: DataSourceEventNames.afterSave,
			record: this.currentRecord,
			index: this.getCurrentIndex(),
		});

		if (callback) {
			callback();
		}

		return this.currentRecord;
	}

	public cancel(): this {
		this.validateDataSourceActive('cancel');
		if (!this.inserting && !this.editing) {
			const msg = i18next.t('archbase:notAllowCancelRecord', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}

		this.emitter.emit('beforeCancel', this.currentRecord, this.currentRecordIndex);
		this.emit({
			type: DataSourceEventNames.beforeCancel,
			record: this.currentRecord,
			index: this.getCurrentIndex(),
		});

		if (this.inserting) {
			this.filteredRecords.splice(this.currentRecordIndex, 1);
			this.currentRecord = this.oldRecord;
			this.currentRecordIndex = this.oldRecordIndex;
			this.grandTotalRecords--;
			this.emitter.emit('afterScroll');
			this.emit({ type: DataSourceEventNames.afterScroll });
			this.lastDataBrowsingOn = new Date().getTime();
		} else {
			this.currentRecord = this.filteredRecords[this.currentRecordIndex];
		}
		this.inserting = false;
		this.editing = false;

		this.emitter.emit('afterCancel', this.currentRecord, this.currentRecordIndex);
		this.emit({
			type: DataSourceEventNames.afterCancel,
			record: this.currentRecord,
			index: this.getCurrentIndex(),
		});
		this.lastDataChangedAt = new Date().getTime();

		return this;
	}

	public getCurrentPage(): number {
		return this.currentPageIndex;
	}

	public getTotalPages(): number {
		return this.totalPages;
	}

	public getTotalRecords(): number {
		return this.filteredRecords.length;
	}

	public getGrandTotalRecords(): number {
		return this.grandTotalRecords;
	}

	getFieldValue(fieldName: string, defaultValue: any = ''): any {
		this.validateDataSourceActive('getFieldValue');
		if (!fieldName) {
			const msg = i18next.t('archbase:invalidFieldName', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		if (this.isEmpty() || this.isBOF()) {
			return;
		}

		if (this.isEOF() && !this.inserting) {
			return;
		}

		let record: T | undefined = this.filteredRecords[this.currentRecordIndex];
		if (this.editing) {
			record = this.currentRecord;
		}

		let value = this.fieldValueByName(record, fieldName);
		if (value === undefined && defaultValue !== undefined) {
			value = defaultValue;
		}

		return value;
	}

	private fieldValueByName(record: T | undefined, fieldName: string): any {
		if (record === undefined) return;
		const value = ArchbaseObjectHelper.getNestedProperty(record, fieldName);
		if (value === undefined) {
			return undefined;
		}
		if (isDate(value)) {
			return parseISO(value);
		}

		return value;
	}

	public setFieldValue(fieldName: string, value: any): this {
		this.validateDataSourceActive('setFieldValue');
		if (this.isEmpty() || !this.currentRecord) {
			return this;
		}
		if (!(this.inserting || this.editing || this.isBOF() || this.isEOF())) {
			const msg = i18next.t('archbase:recordNotBeingEdited', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}

		let newValue: any = value;
		const oldValue: any = ArchbaseObjectHelper.getNestedProperty(this.currentRecord, fieldName);
		if (isDate(value)) {
			newValue = parseISO(value);
		}
		const split = fieldName.split('.');
		if (split.length > 1) {
			ArchbaseObjectHelper.setNestedProperty(this.currentRecord, fieldName, newValue);
		} else {
			this.currentRecord[fieldName] = newValue;
		}
		this.lastDataChangedAt = new Date().getTime();
		this.emitFieldChangeEvent(fieldName, oldValue, newValue);
		this.emitter.emit('fieldChanged', this.currentRecord, this.getCurrentIndex(), fieldName, oldValue, newValue);
		this.emit({
			type: DataSourceEventNames.fieldChanged,
			record: this.currentRecord,
			index: this.getCurrentIndex(),
			fieldName,
			oldValue,
			newValue,
		});

		return this;
	}

	public isEmptyField(fieldName: string): boolean {
		this.validateDataSourceActive('isEmptyField');

		return this.getFieldValue(fieldName) === undefined || this.getFieldValue(fieldName, '') === '';
	}

	public getOptions(): DataSourceOptions<T> {
		return {
			pageSize: this.getPageSize(),
			currentPage: this.getCurrentPage(),
			records: this.records,
			filters: this.filters,
			grandTotalRecords: this.getGrandTotalRecords(),
			totalPages: this.getTotalPages(),
			filter: this.filter,
			sort: this.sort,
			originFilter: this.originFilter,
			originSort: this.originSort,
			originGlobalFilter: this.originGlobalFilter,
		};
	}

	public refreshData(options?: DataSourceOptions<T>) {
		if (options) {
			this.emitter.emit('refreshData', options);
			this.emit({ type: DataSourceEventNames.refreshData, options });
		} else {
			const currentOptions = this.getOptions();
			this.emitter.emit('refreshData', currentOptions);
			this.emit({ type: DataSourceEventNames.refreshData, options: currentOptions });
		}
		this.lastDataBrowsingOn = new Date().getTime();
		this.lastDataChangedAt = new Date().getTime();
	}

	public browseRecords(): T[] {
		return this.filteredRecords;
	}

	public getCurrentIndex(): number {
		return this.currentRecordIndex;
	}

	public getCurrentRecord(): T | undefined {
		return this.currentRecord;
	}

	public isEOF(): boolean {
		return this.currentRecordIndex > this.getTotalRecords() - 1 || this.isEmpty();
	}

	public isBOF(): boolean {
		return this.currentRecordIndex === -1;
	}

	public isEmpty() {
		return this.getTotalRecords() === 0;
	}

	public isFirst() {
		return this.currentRecordIndex === 0;
	}

	public isLast() {
		return this.currentRecordIndex === this.getTotalRecords() - 1;
	}

	public next(): this {
		this.validateDataSourceActive('next');
		if (this.inserting || this.editing || this.isBOF() || this.isEOF()) {
			const msg = i18next.t('archbase:notAllowedBrowseRecords', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		if (this.currentRecordIndex + 1 > this.getTotalRecords() - 1) {
			this.currentRecordIndex++;
			this.currentRecord = undefined;
		} else {
			this.currentRecordIndex++;
			this.currentRecord = this.filteredRecords[this.currentRecordIndex];
			this.emitter.emit('afterScroll');
			this.emit({ type: DataSourceEventNames.afterScroll });
			this.lastDataBrowsingOn = new Date().getTime();
		}

		return this;
	}

	public prior(): this {
		this.validateDataSourceActive('prior');
		if (!this.inserting || !this.editing || this.isBOF() || this.isEOF()) {
			const msg = i18next.t('archbase:notAllowedBrowseRecords', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		if (this.currentRecordIndex - 1 < 0) {
			this.currentRecordIndex = -1;
			this.currentRecord = undefined;
		} else {
			this.currentRecordIndex--;
			this.currentRecord = this.filteredRecords[this.currentRecordIndex];
			this.emitter.emit('afterScroll');
			this.emit({ type: DataSourceEventNames.afterScroll });
			this.lastDataBrowsingOn = new Date().getTime();
		}

		return this;
	}

	public first(): this {
		this.validateDataSourceActive('first');
		if (this.inserting || this.editing) {
			const msg = i18next.t('archbase:notAllowedBrowseRecords', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		if (this.getTotalRecords() === 0) {
			this.currentRecordIndex = -1;
			this.currentRecord = undefined;
		} else {
			this.currentRecordIndex = 0;
			this.currentRecord = this.filteredRecords[this.currentRecordIndex];
			this.emitter.emit('afterScroll');
			this.emit({ type: DataSourceEventNames.afterScroll });
			this.lastDataBrowsingOn = new Date().getTime();
		}

		return this;
	}

	public last(): this {
		this.validateDataSourceActive('last');
		if (this.inserting || this.editing) {
			const msg = i18next.t('archbase:notAllowedBrowseRecords', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		if (this.getTotalRecords() === 0) {
			this.currentRecordIndex = -1;
			this.currentRecord = undefined;
		} else {
			this.currentRecordIndex = this.getTotalRecords() - 1;
			this.currentRecord = this.filteredRecords[this.currentRecordIndex];
			this.emitter.emit('afterScroll');
			this.emit({ type: DataSourceEventNames.afterScroll });
			this.lastDataBrowsingOn = new Date().getTime();
		}

		return this;
	}

	public gotoRecord(index: number): T | undefined {
		if (index === this.currentRecordIndex) {
			return this.currentRecord;
		}
		this.validateDataSourceActive('gotoRecord');
		if (this.inserting || this.editing || this.isBOF() || this.isEOF()) {
			const msg = i18next.t('archbase:notAllowedBrowseRecords', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		if (index < 0 || index >= this.filteredRecords.length) {
			const msg = 'Indice fora da faixa.';
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		this.currentRecordIndex = index;
		this.currentRecord = this.filteredRecords[this.currentRecordIndex];
		this.emitter.emit('afterScroll');
		this.emit({ type: DataSourceEventNames.afterScroll });
		this.lastDataBrowsingOn = new Date().getTime();

		return this.currentRecord;
	}

	public gotoRecordByData(record): boolean {
		this.validateDataSourceActive('gotoRecordByData');
		if (this.inserting || this.editing || this.isBOF() || this.isEOF()) {
			const msg = i18next.t('archbase:notAllowedBrowseRecords', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}

		if (this.isEmpty()) {
			return false;
		}
		if (this.currentRecord === record) {
			this.emitter.emit('afterScroll');
			this.emit({ type: DataSourceEventNames.afterScroll });
			this.lastDataBrowsingOn = new Date().getTime();
			return true;
		}

		let found = false;
		this.filteredRecords.forEach((r, index) => {
			if (record === r) {
				this.currentRecordIndex = index;
				this.currentRecord = r;
				this.emitter.emit('afterScroll');
				this.emit({ type: DataSourceEventNames.afterScroll });
				this.lastDataBrowsingOn = new Date().getTime();
				found = true;
			}
		});

		return found;
	}

	locate(values: any) {
		if (!this.isBrowsing()) {
			const msg = i18next.t('archbase:notAllowedBrowseRecords', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}

		if (this.isEmpty()) {
			return false;
		}

		let found = -1;
		let index = -1;
		this.records.forEach((record) => {
			index++;
			for (const propertyName in values) {
				if (this.fieldValueByName(record, propertyName) === values[propertyName]) {
					found = index;
				}
			}
		});

		if (found >= 0) {
			this.gotoRecord(found);
		}

		return found >= 0;
	}

	public locateByFilter(filterFn: (record: T) => boolean): boolean {
		this.validateDataSourceActive('locate');
		if (this.inserting || this.editing) {
			const msg = i18next.t('archbase:notAllowedBrowseRecords', { dataSourceName: this.name });
			this.publishEventError(msg, {});
			throw new ArchbaseDataSourceError(msg);
		}
		if (this.isEmpty()) {
			return false;
		}
		const index = this.filteredRecords.findIndex(filterFn);
		if (index !== -1) {
			this.gotoRecord(index);
		}

		return index >= 0;
	}

	public addListener(listener: DataSourceListener<T>): this {
		if (!this.listeners.has(listener)) {
			this.listeners.add(listener);
		}

		return this;
	}

	public removeListener(listener: DataSourceListener<T>): this {
		if (this.listeners.has(listener)) {
			this.listeners.delete(listener);
		}

		return this;
	}

	public on<K extends keyof DataSourceEvents<T>>(eventName: K, listener: DataSourceEvents<T>[K]) {
		this.emitter.on(eventName, listener);
	}

	public off<K extends keyof DataSourceEvents<T>>(eventName: K, listener: DataSourceEvents<T>[K]) {
		this.emitter.off(eventName, listener);
	}

	public addFieldChangeListener(
		fieldName: string,
		listener: (fieldName: string, oldValue: any, newValue: any) => void,
	): this {
		// Divide o fieldName em partes para registrar listeners em todos os níveis do caminho.
		const fieldParts = fieldName.split('.');
		let currentPath = '';

		fieldParts.forEach((part, index) => {
			// Construa o caminho gradualmente para cada nível do campo.
			currentPath = index === 0 ? part : `${currentPath}.${part}`;

			// Verifique se já existe um array de listeners para o caminho atual, se não, crie-o.
			if (!this.fieldEventListeners[`field:${currentPath}`]) {
				this.fieldEventListeners[`field:${currentPath}`] = [];
			}

			// Adicione o listener para este nível do campo, se ainda não estiver presente.
			if (!this.fieldEventListeners[`field:${currentPath}`].includes(listener)) {
				this.fieldEventListeners[`field:${currentPath}`].push(listener);
			}
		});

		return this;
	}

	public removeFieldChangeListener(
		fieldName: string,
		listener: (fieldName: string, oldValue: any, newValue: any) => void,
	): this {
		// Similarmente, para remover, consideramos todos os níveis do campo.
		const fieldParts = fieldName.split('.');
		let currentPath = '';

		fieldParts.forEach((part, index) => {
			currentPath = index === 0 ? part : `${currentPath}.${part}`;
			const listeners = this.fieldEventListeners[`field:${currentPath}`];

			// Remova o listener deste nível do campo, se estiver presente.
			if (listeners) {
				const index = listeners.indexOf(listener);
				if (index !== -1) {
					listeners.splice(index, 1);
				}
			}
		});

		return this;
	}

	private emitFieldChangeEvent(fieldName: string, oldValue: any, newValue: any) {
		// Divida o fieldName em partes baseado no '.' para verificar subcampos
		const fieldParts = fieldName.split('.');

		// Assegure-se de que partialFieldName é inicializada corretamente antes do uso
		let partialFieldName = '';

		// Itere sobre as partes para emitir eventos para todos os níveis de campo relevantes
		for (const part of fieldParts) {
			// Construa o nome do campo parcial para os níveis relevantes
			partialFieldName = partialFieldName ? `${partialFieldName}.${part}` : part;

			// Recupere os ouvintes para o nome de campo atual
			const listeners = this.fieldEventListeners[`field:${partialFieldName}`];
			if (listeners) {
				// Se existem ouvintes, notifique-os da mudança
				listeners.forEach((listener) => listener(partialFieldName, oldValue, newValue));
			}
		}
	}
}
