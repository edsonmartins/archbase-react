"use strict";
exports.__esModule = true;
exports.ArchbaseSelect = void 0;
var core_1 = require("@mantine/core");
var datasource_1 = require("../datasource");
var react_1 = require("react");
var lodash_1 = require("lodash");
var hooks_1 = require("../hooks");
var hooks_2 = require("@mantine/hooks");
var ArchbaseSelect_context_1 = require("./ArchbaseSelect.context");
var ArchbaseAsyncSelect_1 = require("./ArchbaseAsyncSelect");
function buildOptions(data, initialOptions, children, getOptionLabel, getOptionValue) {
    if (!initialOptions && !children && !data) {
        return [];
    }
    if (data) {
        return data;
    }
    if (children) {
        return react_1["default"].Children.toArray(children).map(function (item) {
            return {
                label: item.props.label,
                value: item.props.value,
                origin: item.props.value,
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
function ArchbaseSelect(_a) {
    var _b = _a.allowDeselect, allowDeselect = _b === void 0 ? true : _b, _c = _a.clearable, clearable = _c === void 0 ? true : _c, dataSource = _a.dataSource, dataField = _a.dataField, _d = _a.disabled, disabled = _d === void 0 ? false : _d, _e = _a.debounceTime, debounceTime = _e === void 0 ? 500 : _e, _f = _a.readOnly, readOnly = _f === void 0 ? false : _f, placeholder = _a.placeholder, _g = _a.initialOptions, initialOptions = _g === void 0 ? [] : _g, _h = _a.searchable, searchable = _h === void 0 ? true : _h, label = _a.label, description = _a.description, error = _a.error, icon = _a.icon, iconWidth = _a.iconWidth, required = _a.required, width = _a.width, getOptionLabel = _a.getOptionLabel, getOptionValue = _a.getOptionValue, onFocusEnter = _a.onFocusEnter, onFocusExit = _a.onFocusExit, onSelectValue = _a.onSelectValue, value = _a.value, defaultValue = _a.defaultValue, filter = _a.filter, size = _a.size, initiallyOpened = _a.initiallyOpened, itemComponent = _a.itemComponent, onDropdownOpen = _a.onDropdownOpen, onDropdownClose = _a.onDropdownClose, limit = _a.limit, nothingFound = _a.nothingFound, zIndex = _a.zIndex, dropdownPosition = _a.dropdownPosition, children = _a.children, innerRef = _a.innerRef, data = _a.data, customGetDataSourceFieldValue = _a.customGetDataSourceFieldValue, customSetDataSourceFieldValue = _a.customSetDataSourceFieldValue;
    var _j = react_1.useState(buildOptions(data, initialOptions, children, getOptionLabel, getOptionValue)), options = _j[0], _setOptions = _j[1];
    var innerComponentRef = innerRef || react_1.useRef();
    var _k = react_1.useState(value), selectedValue = _k[0], setSelectedValue = _k[1];
    var _l = hooks_2.useDebouncedState('', debounceTime), queryValue = _l[0], setQueryValue = _l[1];
    var loadDataSourceFieldValue = function () {
        var initialValue = value;
        if (dataSource && dataField && !dataSource.isEmpty()) {
            initialValue = customGetDataSourceFieldValue
                ? customGetDataSourceFieldValue()
                : dataSource.getFieldValue(dataField);
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
    hooks_1.useArchbaseDidUpdate(function () {
        loadDataSourceFieldValue();
    }, []);
    var handleChange = function (value) {
        setSelectedValue(function (_prev) { return value; });
        if (dataSource &&
            !dataSource.isBrowsing() &&
            dataField &&
            (customGetDataSourceFieldValue
                ? customGetDataSourceFieldValue()
                : dataSource.getFieldValue(dataField)) !== value) {
            customSetDataSourceFieldValue
                ? customSetDataSourceFieldValue(value)
                : dataSource.setFieldValue(dataField, value);
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
        //
    };
    var isReadOnly = function () {
        // let tmpRreadOnly = readOnly
        // if (dataSource && !readOnly) {
        //   tmpRreadOnly = dataSource.isBrowsing()
        // }
        // return tmpRreadOnly
        return false;
    };
    return (react_1["default"].createElement(ArchbaseSelect_context_1.ArchbaseSelectProvider, { value: {
            handleDropdownScrollEnded: handleDropdownScrollEnded
        } },
        react_1["default"].createElement(core_1.Select, { allowDeselect: allowDeselect, clearable: clearable, disabled: disabled, description: description, placeholder: placeholder, searchable: searchable, maxDropdownHeight: 280, ref: innerComponentRef, dropdownComponent: ArchbaseAsyncSelect_1.CustomSelectScrollArea, label: label, error: error, data: options, size: size, icon: icon, width: width, iconWidth: iconWidth, readOnly: isReadOnly(), required: required, onChange: handleChange, onBlur: handleOnFocusExit, onFocus: handleOnFocusEnter, value: selectedValue, onSearchChange: setQueryValue, defaultValue: selectedValue ? getOptionLabel(selectedValue) : defaultValue, searchValue: selectedValue ? selectedValue : '', filter: filter, initiallyOpened: initiallyOpened, itemComponent: itemComponent, onDropdownOpen: onDropdownOpen, onDropdownClose: onDropdownClose, limit: limit, nothingFound: nothingFound, zIndex: zIndex, dropdownPosition: dropdownPosition })));
}
exports.ArchbaseSelect = ArchbaseSelect;
ArchbaseSelect.displayName = 'ArchbaseSelect';
