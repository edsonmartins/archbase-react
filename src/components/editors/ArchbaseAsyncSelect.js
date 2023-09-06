"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.CustomSelectScrollArea = exports.ArchbaseAsyncSelect = void 0;
var core_1 = require("@mantine/core");
var datasource_1 = require("../datasource");
var react_1 = require("react");
var lodash_1 = require("lodash");
var hooks_1 = require("../hooks");
var hooks_2 = require("@mantine/hooks");
var ArchbaseAsyncSelect_context_1 = require("./ArchbaseAsyncSelect.context");
function buildOptions(initialOptions, getOptionLabel, getOptionValue, getOptionImage) {
    if (!initialOptions) {
        return [];
    }
    if (getOptionImage) {
        return initialOptions.map(function (item) {
            return {
                label: getOptionLabel(item),
                value: getOptionValue(item),
                image: getOptionImage(item),
                origin: item,
                key: lodash_1.uniqueId('select')
            };
        });
    }
    return initialOptions.map(function (item) {
        return {
            label: getOptionLabel(item),
            value: getOptionValue(item),
            origin: item,
            key: lodash_1.uniqueId('select')
        };
    });
}
function ArchbaseAsyncSelect(_a) {
    var _this = this;
    var _b = _a.allowDeselect, allowDeselect = _b === void 0 ? true : _b, _c = _a.clearable, clearable = _c === void 0 ? true : _c, dataSource = _a.dataSource, dataField = _a.dataField, _d = _a.disabled, disabled = _d === void 0 ? false : _d, _e = _a.debounceTime, debounceTime = _e === void 0 ? 100 : _e, _f = _a.readOnly, readOnly = _f === void 0 ? false : _f, placeholder = _a.placeholder, _g = _a.initialOptions, initialOptions = _g === void 0 ? { options: [], page: 0, totalPages: 0 } : _g, _h = _a.searchable, searchable = _h === void 0 ? true : _h, label = _a.label, description = _a.description, error = _a.error, icon = _a.icon, iconWidth = _a.iconWidth, required = _a.required, getOptionLabel = _a.getOptionLabel, getOptionValue = _a.getOptionValue, getOptionImage = _a.getOptionImage, getOptions = _a.getOptions, onFocusEnter = _a.onFocusEnter, onFocusExit = _a.onFocusExit, onSelectValue = _a.onSelectValue, value = _a.value, defaultValue = _a.defaultValue, filter = _a.filter, size = _a.size, style = _a.style, width = _a.width, initiallyOpened = _a.initiallyOpened, itemComponent = _a.itemComponent, onDropdownOpen = _a.onDropdownOpen, onDropdownClose = _a.onDropdownClose, limit = _a.limit, nothingFound = _a.nothingFound, zIndex = _a.zIndex, dropdownPosition = _a.dropdownPosition, onErrorLoadOptions = _a.onErrorLoadOptions, innerRef = _a.innerRef;
    var _j = react_1.useState(buildOptions(initialOptions.options, getOptionLabel, getOptionValue, getOptionImage)), options = _j[0], setOptions = _j[1];
    var _k = react_1.useState(value), selectedValue = _k[0], setSelectedValue = _k[1];
    var _l = hooks_2.useDebouncedState('', debounceTime), queryValue = _l[0], setQueryValue = _l[1];
    var _m = react_1.useState(false), loading = _m[0], setLoading = _m[1];
    var _o = react_1.useState(initialOptions.page), currentPage = _o[0], setCurrentPage = _o[1];
    var _p = react_1.useState(initialOptions.totalPages), totalPages = _p[0], setTotalPages = _p[1];
    var _q = react_1.useState(currentPage === totalPages - 1), _isLastPage = _q[0], setIsLastPage = _q[1];
    var _r = react_1.useState(initialOptions.options), originData = _r[0], setOriginData = _r[1];
    var innerComponentRef = innerRef || react_1.useRef();
    var loadDataSourceFieldValue = function () {
        var initialValue = value;
        if (dataSource && dataField) {
            initialValue = dataSource.getFieldValue(dataField);
            if (!initialValue) {
                initialValue = '';
            }
        }
        setSelectedValue(initialValue);
    };
    var fieldChangedListener = react_1.useCallback(function () { }, []);
    var dataSourceEvent = react_1.useCallback(function (event) {
        if (dataSource && dataField) {
            if (event.type === datasource_1.DataSourceEventNames.dataChanged ||
                event.type === datasource_1.DataSourceEventNames.fieldChanged ||
                event.type === datasource_1.DataSourceEventNames.recordChanged ||
                event.type === datasource_1.DataSourceEventNames.afterScroll ||
                event.type === datasource_1.DataSourceEventNames.afterCancel) {
                loadDataSourceFieldValue();
            }
        }
    }, []);
    hooks_1.useArchbaseDidMount(function () {
        loadDataSourceFieldValue();
        if (dataSource && dataField) {
            dataSource.addListener(dataSourceEvent);
            dataSource.addFieldChangeListener(dataField, fieldChangedListener);
        }
    });
    hooks_1.useArchbaseWillUnmount(function () {
        if (dataSource && dataField) {
            dataSource.removeListener(dataSourceEvent);
            dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
        }
    });
    react_1.useEffect(function () {
        if (queryValue && queryValue.length > 0 && queryValue != getOptionLabel(selectedValue)) {
            setLoading(true);
            loadOptions(0, false);
        }
    }, [queryValue]);
    react_1.useEffect(function () { }, [currentPage, totalPages]);
    hooks_1.useArchbaseDidUpdate(function () {
        loadDataSourceFieldValue();
    }, []);
    var handleChange = function (value) {
        setSelectedValue(function (_prev) { return value; });
        if (dataSource &&
            !dataSource.isBrowsing() &&
            dataField &&
            dataSource.getFieldValue(dataField) !== value) {
            dataSource.setFieldValue(dataField, value);
        }
        if (onSelectValue) {
            onSelectValue(value);
        }
    };
    var handleOnFocusExit = function (event) {
        if (onFocusExit) {
            onFocusExit(event);
        }
    };
    var handleOnFocusEnter = function (event) {
        if (onFocusEnter) {
            onFocusEnter(event);
        }
    };
    var handleDropdownScrollEnded = function () {
        if (queryValue && queryValue.length > 0 && currentPage < totalPages - 1) {
            setLoading(true);
            loadOptions(currentPage + 1, true);
        }
    };
    var loadOptions = function (page, incremental) {
        if (incremental === void 0) { incremental = false; }
        return __awaiter(_this, void 0, void 0, function () {
            var promise;
            return __generator(this, function (_a) {
                promise = getOptions(page, queryValue);
                promise.then(function (data) {
                    setLoading(false);
                    if (data === undefined || data == null) {
                        if (onErrorLoadOptions) {
                            onErrorLoadOptions('Response incorreto.');
                        }
                    }
                    var options = incremental ? originData.concat(data.options) : data.options;
                    setOriginData(options);
                    setOptions(buildOptions(options, getOptionLabel, getOptionValue, getOptionImage));
                    setCurrentPage(data.page);
                    setTotalPages(data.totalPages);
                    setIsLastPage(data.page === data.totalPages - 1);
                }, function (err) {
                    setLoading(false);
                    if (onErrorLoadOptions) {
                        onErrorLoadOptions(err);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    var isReadOnly = function () {
        var _readOnly = readOnly;
        if (dataSource && !readOnly) {
            _readOnly = dataSource.isBrowsing();
        }
        return _readOnly;
    };
    return (react_1["default"].createElement(ArchbaseAsyncSelect_context_1.ArchbaseAsyncSelectProvider, { value: {
            handleDropdownScrollEnded: handleDropdownScrollEnded
        } },
        react_1["default"].createElement(core_1.Select, { allowDeselect: allowDeselect, clearable: clearable, disabled: disabled, description: description, placeholder: placeholder, searchable: searchable, maxDropdownHeight: 280, dropdownComponent: exports.CustomSelectScrollArea, ref: innerComponentRef, label: label, error: error, data: options, size: size, style: __assign({ width: width }, style), icon: icon, iconWidth: iconWidth, readOnly: isReadOnly(), onChange: handleChange, onBlur: handleOnFocusExit, onFocus: handleOnFocusEnter, value: selectedValue, onSearchChange: setQueryValue, defaultValue: selectedValue ? getOptionLabel(selectedValue) : defaultValue, searchValue: selectedValue ? getOptionLabel(selectedValue) : queryValue, required: required, filter: filter, initiallyOpened: initiallyOpened, itemComponent: itemComponent, onDropdownOpen: onDropdownOpen, onDropdownClose: onDropdownClose, limit: limit, nothingFound: nothingFound, zIndex: zIndex, dropdownPosition: dropdownPosition, rightSection: loading ? react_1["default"].createElement(core_1.Loader, { size: "xs" }) : null, rightSectionWidth: 30 })));
}
exports.ArchbaseAsyncSelect = ArchbaseAsyncSelect;
exports.CustomSelectScrollArea = react_1.forwardRef(function (_a, _ref) {
    var style = _a.style, others = __rest(_a, ["style"]);
    var sRef = react_1.useRef();
    var selectContextValue = react_1.useContext(ArchbaseAsyncSelect_context_1["default"]);
    var handleScrollPositionChange = function (_position) {
        if (sRef && sRef.current) {
            if (sRef.current.scrollTop === sRef.current.scrollHeight - sRef.current.offsetHeight) {
                selectContextValue.handleDropdownScrollEnded();
            }
        }
    };
    return (react_1["default"].createElement(core_1.ScrollArea, __assign({}, others, { style: __assign({ width: '100%' }, style), viewportProps: { tabIndex: -1 }, viewportRef: sRef, onScrollPositionChange: handleScrollPositionChange }), others.children));
});
exports.CustomSelectScrollArea.displayName = 'CustomSelectScrollArea';
