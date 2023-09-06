"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ArchbaseDataSource = exports.ArchbaseDataSourceEventEmitter = exports.DataSourceEventNames = void 0;
/* eslint-disable no-unused-vars */
var date_fns_1 = require("date-fns");
var events_1 = require("events");
var i18next_1 = require("i18next");
var lodash_1 = require("lodash");
var exceptions_1 = require("../core/exceptions");
var helper_1 = require("../core/helper");
var dataSourceDatetimeFormat = 'YYYY-MM-DDTHH:mm:ss.SSS';
// this._displayDatetimeFormat = "DD/MM/YYYY HH:mm:ss";
// this._displayDateFormat = "DD/MM/YYYY";
// this._displayTimeFormat = "HH:mm:ss";
var DataSourceEventNames;
(function (DataSourceEventNames) {
    DataSourceEventNames[DataSourceEventNames["dataChanged"] = 0] = "dataChanged";
    DataSourceEventNames[DataSourceEventNames["recordChanged"] = 1] = "recordChanged";
    DataSourceEventNames[DataSourceEventNames["refreshData"] = 2] = "refreshData";
    DataSourceEventNames[DataSourceEventNames["fieldChanged"] = 3] = "fieldChanged";
    DataSourceEventNames[DataSourceEventNames["beforeClose"] = 4] = "beforeClose";
    DataSourceEventNames[DataSourceEventNames["afterClose"] = 5] = "afterClose";
    DataSourceEventNames[DataSourceEventNames["beforeOpen"] = 6] = "beforeOpen";
    DataSourceEventNames[DataSourceEventNames["afterOpen"] = 7] = "afterOpen";
    DataSourceEventNames[DataSourceEventNames["beforeAppend"] = 8] = "beforeAppend";
    DataSourceEventNames[DataSourceEventNames["afterAppend"] = 9] = "afterAppend";
    DataSourceEventNames[DataSourceEventNames["beforeRemove"] = 10] = "beforeRemove";
    DataSourceEventNames[DataSourceEventNames["afterRemove"] = 11] = "afterRemove";
    DataSourceEventNames[DataSourceEventNames["beforeInsert"] = 12] = "beforeInsert";
    DataSourceEventNames[DataSourceEventNames["afterInsert"] = 13] = "afterInsert";
    DataSourceEventNames[DataSourceEventNames["beforeEdit"] = 14] = "beforeEdit";
    DataSourceEventNames[DataSourceEventNames["afterEdit"] = 15] = "afterEdit";
    DataSourceEventNames[DataSourceEventNames["beforeSave"] = 16] = "beforeSave";
    DataSourceEventNames[DataSourceEventNames["afterSave"] = 17] = "afterSave";
    DataSourceEventNames[DataSourceEventNames["beforeCancel"] = 18] = "beforeCancel";
    DataSourceEventNames[DataSourceEventNames["afterCancel"] = 19] = "afterCancel";
    DataSourceEventNames[DataSourceEventNames["afterScroll"] = 20] = "afterScroll";
    DataSourceEventNames[DataSourceEventNames["onError"] = 21] = "onError";
})(DataSourceEventNames = exports.DataSourceEventNames || (exports.DataSourceEventNames = {}));
var ArchbaseDataSourceEventEmitter = /** @class */ (function () {
    function ArchbaseDataSourceEventEmitter() {
        this.listenersDisable = false;
        this.eventEmitter = new events_1.EventEmitter();
    }
    ArchbaseDataSourceEventEmitter.prototype.disabledAllListeners = function () {
        this.listenersDisable = true;
        return this;
    };
    ArchbaseDataSourceEventEmitter.prototype.enableAllListeners = function () {
        this.listenersDisable = false;
        return this;
    };
    ArchbaseDataSourceEventEmitter.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.listenersDisable)
            return false;
        return this.eventEmitter.emit(event, args);
    };
    ArchbaseDataSourceEventEmitter.prototype.addListener = function (event, listener) {
        this.eventEmitter.addListener(event, listener);
        return this;
    };
    ArchbaseDataSourceEventEmitter.prototype.on = function (event, listener) {
        this.eventEmitter.on(event, listener);
        return this;
    };
    ArchbaseDataSourceEventEmitter.prototype.once = function (event, listener) {
        this.eventEmitter.once(event, listener);
        return this;
    };
    ArchbaseDataSourceEventEmitter.prototype.removeListener = function (event, listener) {
        this.eventEmitter.removeListener(event, listener);
        return this;
    };
    ArchbaseDataSourceEventEmitter.prototype.off = function (event, listener) {
        this.eventEmitter.off(event, listener);
        return this;
    };
    ArchbaseDataSourceEventEmitter.prototype.removeAllListeners = function (event) {
        this.eventEmitter.removeAllListeners(event);
        return this;
    };
    return ArchbaseDataSourceEventEmitter;
}());
exports.ArchbaseDataSourceEventEmitter = ArchbaseDataSourceEventEmitter;
var ArchbaseDataSource = /** @class */ (function () {
    function ArchbaseDataSource(name, options) {
        this.grandTotalRecords = 0;
        this.currentPageIndex = 0;
        this.totalPages = 0;
        this.pageSize = 0;
        this.currentRecordIndex = -1;
        this.oldRecordIndex = -1;
        this.listeners = new Set();
        this.listenersDisable = false;
        this.inserting = false;
        this.active = false;
        this.editing = false;
        this.defaultSortFields = [];
        this.name = name;
        this.records = [];
        this.filteredRecords = [];
        this.loadOptions(options);
        this.fieldEventListeners = {};
        this.emitter = new ArchbaseDataSourceEventEmitter();
        this.uuid = lodash_1.uniqueId();
    }
    ArchbaseDataSource.prototype.loadOptions = function (options) {
        this.records = options.records;
        this.filters = [];
        if (options.filters) {
            this.filters = options.filters;
        }
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
    };
    ArchbaseDataSource.prototype.validateDataSourceActive = function (operation) {
        if (!this.isActive()) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('operationNotAllowed', { dataSourceName: this.name, operation: operation }));
        }
    };
    ArchbaseDataSource.prototype.clear = function () {
        if (!this.isActive()) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('operationNotAllowed', { dataSourceName: this.name, operation: 'clear' }));
        }
        this.emitter.emit('beforeClose');
        this.emit({ type: DataSourceEventNames.beforeClose });
        this.loadOptions({
            records: [],
            totalPages: 0,
            grandTotalRecords: 0,
            currentPage: 0,
            pageSize: 0
        });
        this.active = true;
        this.emitter.emit('afterOpen');
        this.emit({ type: DataSourceEventNames.afterOpen });
        this.emitter.emit('dataChanged');
        this.emit({ type: DataSourceEventNames.dataChanged, data: this.records });
        this.emitter.emit('afterScroll');
        this.emit({ type: DataSourceEventNames.afterScroll });
    };
    ArchbaseDataSource.prototype.open = function (options) {
        this.active = false;
        this.emitter.emit('beforeClose');
        this.emit({ type: DataSourceEventNames.beforeClose });
        this.loadOptions(options);
        this.active = true;
        this.emitter.emit('afterOpen');
        this.emit({ type: DataSourceEventNames.afterOpen });
        this.emitter.emit('dataChanged');
        this.emit({ type: DataSourceEventNames.dataChanged, data: this.records });
        this.emitter.emit('afterScroll');
        this.emit({ type: DataSourceEventNames.afterScroll });
    };
    ArchbaseDataSource.prototype.close = function () {
        this.validateDataSourceActive('close');
        this.emitter.emit('beforeClose');
        this.emit({ type: DataSourceEventNames.beforeClose });
        this.active = false;
        this.emitter.emit('afterOpen');
        this.emit({ type: DataSourceEventNames.afterOpen });
        this.emitter.emit('afterScroll');
        this.emit({ type: DataSourceEventNames.afterScroll });
    };
    ArchbaseDataSource.prototype.setData = function (options) {
        this.validateDataSourceActive('setData');
        this.loadOptions(options);
        this.emitter.emit('dataChanged');
        this.emit({ type: DataSourceEventNames.dataChanged, data: this.records });
    };
    ArchbaseDataSource.prototype.goToPage = function (_pageNumber) {
        this.validateDataSourceActive('goToPage');
        return this;
    };
    ArchbaseDataSource.prototype.goToRecord = function (recordIndex) {
        this.validateDataSourceActive('goToRecord');
        if (this.inserting || this.editing || this.isBOF() || this.isEOF()) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('notAllowedBrowseRecords', { dataSourceName: this.name }));
        }
        if (recordIndex <= this.getTotalRecords() - 1) {
            this.currentRecordIndex = recordIndex;
            this.emitter.emit('afterScroll');
            this.emit({ type: DataSourceEventNames.afterScroll });
        }
        return undefined;
    };
    ArchbaseDataSource.prototype.disabledAllListeners = function () {
        this.listenersDisable = true;
        this.emitter.disabledAllListeners();
        return this;
    };
    ArchbaseDataSource.prototype.enableAllListeners = function () {
        this.listenersDisable = false;
        this.emitter.enableAllListeners();
        return this;
    };
    ArchbaseDataSource.prototype.addFilter = function (filterFn) {
        var _a;
        (_a = this.filters) === null || _a === void 0 ? void 0 : _a.push(filterFn);
        return this;
    };
    ArchbaseDataSource.prototype.removeFilter = function (filterFn) {
        var _a, _b;
        var index = (_a = this.filters) === null || _a === void 0 ? void 0 : _a.indexOf(filterFn);
        if (index && index >= 0) {
            (_b = this.filters) === null || _b === void 0 ? void 0 : _b.splice(index, 1);
        }
        return this;
    };
    ArchbaseDataSource.prototype.clearFilters = function () {
        this.filters = [];
        return this;
    };
    ArchbaseDataSource.prototype.applyFilters = function () {
        var _a;
        if (!this.filters || this.filters.length === 0) {
            return this.records;
        }
        var result = __spreadArrays(this.records);
        (_a = this.filters) === null || _a === void 0 ? void 0 : _a.forEach(function (filter) {
            result = result.filter(filter);
        });
        return result;
    };
    ArchbaseDataSource.prototype.emit = function (event) {
        if (this.listenersDisable)
            return;
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(event);
        }
    };
    ArchbaseDataSource.prototype.append = function (record) {
        this.validateDataSourceActive('append');
        if (this.inserting || this.editing) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('insertRecordIsNotAllowed', { dataSourceName: this.name }));
        }
        this.emitter.emit('beforeAppend', record);
        this.emit({ type: DataSourceEventNames.beforeAppend, record: record });
        this.records.push(record);
        this.filteredRecords = this.applyFilters();
        this.grandTotalRecords++;
        if (!this.gotoRecordByData(record)) {
            this.currentRecordIndex = -1;
        }
        this.emitter.emit('afterAppend', record);
        this.emit({
            type: DataSourceEventNames.afterAppend,
            record: record,
            index: this.currentRecordIndex
        });
        this.emitter.emit('afterScroll');
        this.emit({ type: DataSourceEventNames.afterScroll });
        return this.currentRecordIndex;
    };
    ArchbaseDataSource.prototype.insert = function (record) {
        this.validateDataSourceActive('insert');
        if (this.inserting || this.editing) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('insertRecordIsNotAllowed', { dataSourceName: this.name }));
        }
        this.emitter.emit('beforeInsert');
        this.emit({ type: DataSourceEventNames.beforeInsert });
        this.oldRecord = this.getCurrentRecord();
        this.oldRecordIndex = this.currentRecordIndex;
        this.grandTotalRecords++;
        var nextRecord = this.getTotalRecords();
        this.filteredRecords.push(record);
        this.currentRecordIndex = nextRecord;
        this.currentRecord = record;
        this.inserting = true;
        this.emitter.emit('afterInsert', record);
        this.emit({
            type: DataSourceEventNames.afterInsert,
            record: record,
            index: this.currentRecordIndex
        });
        this.emitter.emit('afterScroll');
        this.emit({ type: DataSourceEventNames.afterScroll });
        return this;
    };
    ArchbaseDataSource.prototype.edit = function () {
        this.validateDataSourceActive('edit');
        if (this.inserting || this.editing) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('editRecordIsNotAllowed', { dataSourceName: this.name }));
        }
        if (this.isEmpty() || !this.currentRecord) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('noRecordsToEdit', { dataSourceName: this.name }));
        }
        if (this.isBOF()) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('BOFDataSource', { dataSourceName: this.name }));
        }
        if (this.isEOF()) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('EOFDataSource', { dataSourceName: this.name }));
        }
        this.emitter.emit('beforeEdit', this.currentRecord, this.currentRecordIndex);
        this.emit({
            type: DataSourceEventNames.beforeEdit,
            record: this.currentRecord,
            index: this.getCurrentIndex()
        });
        this.editing = true;
        this.currentRecord = lodash_1.cloneDeep(this.currentRecord);
        this.emitter.emit('afterEdit');
        this.emit({
            type: DataSourceEventNames.afterEdit,
            record: this.currentRecord,
            index: this.getCurrentIndex()
        });
        return this;
    };
    ArchbaseDataSource.prototype.remove = function (callback) {
        return __awaiter(this, void 0, Promise, function () {
            var index, deletedRecord, deletedIndex;
            var _this = this;
            return __generator(this, function (_a) {
                this.validateDataSourceActive('remove');
                if (this.inserting || this.editing) {
                    throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('removingRecordIsNotAllowed', { dataSourceName: this.name }));
                }
                if (this.isEmpty() || !this.currentRecord) {
                    throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('noRecordsToEdit', { dataSourceName: this.name }));
                }
                if (this.isBOF()) {
                    throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('BOFDataSource', { dataSourceName: this.name }));
                }
                if (this.isEOF()) {
                    throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('EOFDataSource', { dataSourceName: this.name }));
                }
                this.emitter.emit('beforeRemove', this.currentRecord, this.currentRecordIndex);
                this.emit({
                    type: DataSourceEventNames.beforeRemove,
                    record: this.currentRecord,
                    index: this.getCurrentIndex()
                });
                index = -1;
                deletedRecord = this.currentRecord;
                deletedIndex = this.currentRecordIndex;
                this.records.forEach(function (item, idx) {
                    if (_this.currentRecord === item) {
                        index = idx;
                    }
                });
                if (index >= 0) {
                    this.records.splice(index, 1);
                }
                this.filteredRecords.splice(this.getCurrentIndex(), 1);
                this.grandTotalRecords--;
                if (this.filteredRecords.length === 0) {
                    this.currentRecord = undefined;
                    this.currentRecordIndex = -1;
                }
                else {
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
                    index: deletedIndex
                });
                if (callback) {
                    callback();
                }
                return [2 /*return*/, deletedRecord];
            });
        });
    };
    ArchbaseDataSource.prototype.isBrowsing = function () {
        return !this.isEditing() && !this.isInserting() && this.isActive();
    };
    ArchbaseDataSource.prototype.isEditing = function () {
        return this.editing;
    };
    ArchbaseDataSource.prototype.isInserting = function () {
        return this.inserting;
    };
    ArchbaseDataSource.prototype.isActive = function () {
        return this.active;
    };
    ArchbaseDataSource.prototype.getPageSize = function () {
        return this.pageSize;
    };
    ArchbaseDataSource.prototype.save = function (callback) {
        return __awaiter(this, void 0, Promise, function () {
            var index;
            var _this = this;
            return __generator(this, function (_a) {
                this.validateDataSourceActive('save');
                if (!this.inserting || !this.editing) {
                    throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('saveRecordIsNotAllowed', { dataSourceName: this.name }));
                }
                if (!this.currentRecord) {
                    throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('noRecordToSave', { dataSourceName: this.name }));
                }
                this.emitter.emit('beforeSave');
                this.emit({
                    type: DataSourceEventNames.beforeSave,
                    record: this.currentRecord,
                    index: this.getCurrentIndex()
                });
                if (this.editing) {
                    this.filteredRecords[this.getCurrentIndex()] = this.currentRecord;
                }
                index = -1;
                this.records.forEach(function (item, idx) {
                    if (item === _this.currentRecord) {
                        index = idx;
                    }
                });
                if (index >= 0) {
                    this.records[index] = this.currentRecord;
                }
                else {
                    this.records.push(this.currentRecord);
                }
                this.editing = false;
                this.inserting = false;
                this.emitter.emit('afterSave');
                this.emit({
                    type: DataSourceEventNames.afterSave,
                    record: this.currentRecord,
                    index: this.getCurrentIndex()
                });
                if (callback) {
                    callback();
                }
                return [2 /*return*/, this.currentRecord];
            });
        });
    };
    ArchbaseDataSource.prototype.cancel = function () {
        this.validateDataSourceActive('cancel');
        if (!this.inserting || !this.editing) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('notAllowCancelRecord', { dataSourceName: this.name }));
        }
        this.emitter.emit('beforeCancel', this.currentRecord, this.currentRecordIndex);
        this.emit({
            type: DataSourceEventNames.beforeCancel,
            record: this.currentRecord,
            index: this.getCurrentIndex()
        });
        if (this.inserting) {
            this.filteredRecords.splice(this.currentRecordIndex, 1);
            this.currentRecord = this.oldRecord;
            this.currentRecordIndex = this.oldRecordIndex;
            this.grandTotalRecords--;
            this.emitter.emit('afterScroll');
            this.emit({ type: DataSourceEventNames.afterScroll });
        }
        else {
            this.currentRecord = this.filteredRecords[this.currentRecordIndex];
        }
        this.inserting = false;
        this.editing = false;
        this.emitter.emit('afterCancel', this.currentRecord, this.currentRecordIndex);
        this.emit({
            type: DataSourceEventNames.afterCancel,
            record: this.currentRecord,
            index: this.getCurrentIndex()
        });
        return this;
    };
    ArchbaseDataSource.prototype.getCurrentPage = function () {
        return this.currentPageIndex;
    };
    ArchbaseDataSource.prototype.getTotalPages = function () {
        return this.totalPages;
    };
    ArchbaseDataSource.prototype.getTotalRecords = function () {
        return this.filteredRecords.length;
    };
    ArchbaseDataSource.prototype.getGrandTotalRecords = function () {
        return this.grandTotalRecords;
    };
    ArchbaseDataSource.prototype.getFieldValue = function (fieldName, defaultValue) {
        if (defaultValue === void 0) { defaultValue = ''; }
        this.validateDataSourceActive('getFieldValue');
        if (!fieldName) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('invalidFieldName', { dataSourceName: this.name }));
        }
        if (this.isEmpty() || this.isBOF()) {
            return;
        }
        if (this.isEOF() && !this.inserting) {
            return;
        }
        var record = this.filteredRecords[this.currentRecordIndex];
        if (this.editing) {
            record = this.currentRecord;
        }
        var value = this.fieldValueByName(record, fieldName);
        if (value === undefined && defaultValue !== undefined) {
            value = defaultValue;
        }
        return value;
    };
    ArchbaseDataSource.prototype.fieldValueByName = function (record, fieldName) {
        if (record === undefined)
            return;
        var value = helper_1.ArchbaseObjectHelper.getNestedProperty(record, fieldName);
        if (value === undefined) {
            return undefined;
        }
        if (date_fns_1.isDate(value)) {
            return date_fns_1.parse(value, dataSourceDatetimeFormat, new Date());
        }
        return value;
    };
    ArchbaseDataSource.prototype.setFieldValue = function (fieldName, value) {
        this.validateDataSourceActive('setFieldValue');
        if (this.isEmpty() || !this.currentRecord) {
            return this;
        }
        if (!(this.inserting || this.editing || this.isBOF() || this.isEOF())) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('recordNotBeingEdited', { dataSourceName: this.name }));
        }
        var newValue = value;
        var oldValue = helper_1.ArchbaseObjectHelper.getNestedProperty(this.currentRecord, fieldName);
        if (date_fns_1.isDate(value)) {
            newValue = date_fns_1.parse(value, dataSourceDatetimeFormat, new Date());
        }
        var split = fieldName.split('.');
        if (split.length > 1) {
            helper_1.ArchbaseObjectHelper.setNestedProperty(this.currentRecord, fieldName, newValue);
        }
        else {
            this.currentRecord[fieldName] = newValue;
        }
        this.emitFieldChangeEvent(fieldName, oldValue, newValue);
        this.emitter.emit('fieldChanged', {});
        this.emit({
            type: DataSourceEventNames.fieldChanged,
            record: this.currentRecord,
            index: this.getCurrentIndex(),
            fieldName: fieldName,
            oldValue: oldValue,
            newValue: newValue
        });
        return this;
    };
    ArchbaseDataSource.prototype.isEmptyField = function (fieldName) {
        this.validateDataSourceActive('isEmptyField');
        return (this.getFieldValue(fieldName, '') === undefined || this.getFieldValue(fieldName, '') === '');
    };
    ArchbaseDataSource.prototype.getOptions = function () {
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
            originGlobalFilter: this.originGlobalFilter
        };
    };
    ArchbaseDataSource.prototype.refreshData = function (options) {
        if (options) {
            this.emitter.emit('refreshData', options);
            this.emit({ type: DataSourceEventNames.refreshData, options: options });
        }
        else {
            var currentOptions = this.getOptions();
            this.emitter.emit('refreshData', currentOptions);
            this.emit({ type: DataSourceEventNames.refreshData, options: currentOptions });
        }
    };
    ArchbaseDataSource.prototype.browseRecords = function () {
        return this.filteredRecords;
    };
    ArchbaseDataSource.prototype.getCurrentIndex = function () {
        return this.currentRecordIndex;
    };
    ArchbaseDataSource.prototype.getCurrentRecord = function () {
        return this.currentRecord;
    };
    ArchbaseDataSource.prototype.isEOF = function () {
        return this.currentRecordIndex > this.getTotalRecords() - 1 || this.isEmpty();
    };
    ArchbaseDataSource.prototype.isBOF = function () {
        return this.currentRecordIndex === -1;
    };
    ArchbaseDataSource.prototype.isEmpty = function () {
        return this.getTotalRecords() === 0;
    };
    ArchbaseDataSource.prototype.isFirst = function () {
        return this.currentRecordIndex === 0;
    };
    ArchbaseDataSource.prototype.isLast = function () {
        return this.currentRecordIndex === this.getTotalRecords() - 1;
    };
    ArchbaseDataSource.prototype.next = function () {
        this.validateDataSourceActive('next');
        if (this.inserting || this.editing || this.isBOF() || this.isEOF()) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('notAllowedBrowseRecords', { dataSourceName: this.name }));
        }
        if (this.currentRecordIndex + 1 > this.getTotalRecords() - 1) {
            this.currentRecordIndex++;
            this.currentRecord = undefined;
        }
        else {
            this.currentRecordIndex++;
            this.currentRecord = this.filteredRecords[this.currentRecordIndex];
            this.emitter.emit('afterScroll');
            this.emit({ type: DataSourceEventNames.afterScroll });
        }
        return this;
    };
    ArchbaseDataSource.prototype.prior = function () {
        this.validateDataSourceActive('prior');
        if (!this.inserting || !this.editing || this.isBOF() || this.isEOF()) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('notAllowedBrowseRecords', { dataSourceName: this.name }));
        }
        if (this.currentRecordIndex - 1 < 0) {
            this.currentRecordIndex = -1;
            this.currentRecord = undefined;
        }
        else {
            this.currentRecordIndex--;
            this.currentRecord = this.filteredRecords[this.currentRecordIndex];
            this.emitter.emit('afterScroll');
            this.emit({ type: DataSourceEventNames.afterScroll });
        }
        return this;
    };
    ArchbaseDataSource.prototype.first = function () {
        this.validateDataSourceActive('first');
        if (this.inserting || this.editing) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('notAllowedBrowseRecords', { dataSourceName: this.name }));
        }
        if (this.getTotalRecords() === 0) {
            this.currentRecordIndex = -1;
            this.currentRecord = undefined;
        }
        else {
            this.currentRecordIndex = 0;
            this.currentRecord = this.filteredRecords[this.currentRecordIndex];
            this.emitter.emit('afterScroll');
            this.emit({ type: DataSourceEventNames.afterScroll });
        }
        return this;
    };
    ArchbaseDataSource.prototype.last = function () {
        this.validateDataSourceActive('last');
        if (this.inserting || this.editing) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('notAllowedBrowseRecords', { dataSourceName: this.name }));
        }
        if (this.getTotalRecords() === 0) {
            this.currentRecordIndex = -1;
            this.currentRecord = undefined;
        }
        else {
            this.currentRecordIndex = this.getTotalRecords() - 1;
            this.currentRecord = this.filteredRecords[this.currentRecordIndex];
            this.emitter.emit('afterScroll');
            this.emit({ type: DataSourceEventNames.afterScroll });
        }
        return this;
    };
    ArchbaseDataSource.prototype.gotoRecord = function (index) {
        this.validateDataSourceActive('gotoRecord');
        if (!this.inserting || !this.editing || this.isBOF() || this.isEOF()) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('notAllowedBrowseRecords', { dataSourceName: this.name }));
        }
        if (index < 0 || index >= this.filteredRecords.length) {
            throw new exceptions_1.ArchbaseDataSourceError('Index out of range.');
        }
        if (this.currentRecordIndex - 1 < 0) {
            this.currentRecordIndex = -1;
            this.currentRecord = undefined;
        }
        else {
            this.currentRecordIndex--;
            this.currentRecord = this.filteredRecords[this.currentRecordIndex];
            this.emitter.emit('afterScroll');
            this.emit({ type: DataSourceEventNames.afterScroll });
        }
        return this.currentRecord;
    };
    ArchbaseDataSource.prototype.gotoRecordByData = function (record) {
        var _this = this;
        this.validateDataSourceActive('gotoRecordByData');
        if (this.inserting || this.editing || this.isBOF() || this.isEOF()) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('notAllowedBrowseRecords', { dataSourceName: this.name }));
        }
        if (this.isEmpty()) {
            return false;
        }
        if (this.currentRecord === record) {
            return true;
        }
        var found = false;
        this.filteredRecords.forEach(function (r, index) {
            if (record === r) {
                _this.currentRecordIndex = index;
                _this.currentRecord = r;
                _this.emitter.emit('afterScroll');
                _this.emit({ type: DataSourceEventNames.afterScroll });
                found = true;
            }
        });
        return found;
    };
    ArchbaseDataSource.prototype.locate = function (values) {
        var _this = this;
        if (!this.isBrowsing()) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('notAllowedBrowseRecords', { dataSourceName: this.name }));
        }
        if (this.isEmpty()) {
            return false;
        }
        var found = -1;
        var index = -1;
        this.records.forEach(function (record) {
            index++;
            for (var propertyName in values) {
                if (_this.fieldValueByName(record, propertyName) === values[propertyName]) {
                    found = index;
                }
            }
        });
        if (found >= 0) {
            this.gotoRecord(found);
        }
        return found >= 0;
    };
    ArchbaseDataSource.prototype.locateByFilter = function (filterFn) {
        this.validateDataSourceActive('locate');
        if (!this.inserting || !this.editing) {
            throw new exceptions_1.ArchbaseDataSourceError(i18next_1["default"].t('notAllowedBrowseRecords', { dataSourceName: this.name }));
        }
        if (this.isEmpty()) {
            return false;
        }
        var index = this.filteredRecords.findIndex(filterFn);
        if (index !== -1) {
            this.gotoRecord(index);
        }
        return index >= 0;
    };
    ArchbaseDataSource.prototype.addListener = function (listener) {
        if (!this.listeners.has(listener)) {
            this.listeners.add(listener);
        }
        return this;
    };
    ArchbaseDataSource.prototype.removeListener = function (listener) {
        if (this.listeners.has(listener)) {
            this.listeners["delete"](listener);
        }
        return this;
    };
    ArchbaseDataSource.prototype.on = function (eventName, listener) {
        this.emitter.on(eventName, listener);
    };
    ArchbaseDataSource.prototype.off = function (eventName, listener) {
        this.emitter.off(eventName, listener);
    };
    ArchbaseDataSource.prototype.addFieldChangeListener = function (fieldName, listener) {
        if (!this.fieldEventListeners["field:" + String(fieldName)]) {
            this.fieldEventListeners["field:" + String(fieldName)] = [];
        }
        this.fieldEventListeners["field:" + String(fieldName)].push(listener);
        return this;
    };
    ArchbaseDataSource.prototype.removeFieldChangeListener = function (fieldName, listener) {
        var listeners = this.fieldEventListeners["field:" + String(fieldName)];
        if (listeners) {
            var index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
        return this;
    };
    ArchbaseDataSource.prototype.emitFieldChangeEvent = function (fieldName, oldValue, newValue) {
        var listeners = this.fieldEventListeners["field:" + String(fieldName)];
        if (listeners) {
            listeners.forEach(function (listener) { return listener(fieldName, oldValue, newValue); });
        }
    };
    return ArchbaseDataSource;
}());
exports.ArchbaseDataSource = ArchbaseDataSource;
