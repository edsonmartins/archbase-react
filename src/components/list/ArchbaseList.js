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
exports.ArchbaseList = void 0;
var react_1 = require("react");
var lodash_1 = require("lodash");
var ArchbaseListItem_1 = require("./ArchbaseListItem");
var datasource_1 = require("../datasource");
var core_1 = require("../core");
var hooks_1 = require("../hooks");
var core_2 = require("@mantine/core");
var ArchbaseList_styles_1 = require("./ArchbaseList.styles");
var ArchbaseList_context_1 = require("./ArchbaseList.context");
function ArchbaseList(props) {
    var theme = core_2.useMantineTheme();
    var _a = props.activeBackgroundColor, activeBackgroundColor = _a === void 0 ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 5] : _a, _b = props.activeColor, activeColor = _b === void 0 ? 'white' : _b, backgroundColor = props.backgroundColor, align = props.align, color = props.color, _c = props.height, height = _c === void 0 ? '20rem' : _c, _d = props.justify, justify = _d === void 0 ? 'flex-start' : _d, onSelectListItem = props.onSelectListItem, width = props.width, _e = props.withBorder, withBorder = _e === void 0 ? true : _e, borderRadius = props.borderRadius, _f = props.dataFieldText, dataFieldText = _f === void 0 ? 'text' : _f, _g = props.dataFieldId, dataFieldId = _g === void 0 ? 'id' : _g, _h = props.activeIndex, activeIndex = _h === void 0 ? 0 : _h, onItemEnter = props.onItemEnter, onItemLeave = props.onItemLeave, style = props.style, _j = props.id, id = _j === void 0 ? lodash_1.uniqueId('list') : _j, dataSource = props.dataSource, filter = props.filter, _k = props.horizontal, horizontal = _k === void 0 ? false : _k, onFilter = props.onFilter, children = props.children, _l = props.withPadding, withPadding = _l === void 0 ? false : _l, _m = props.listStyleType, listStyleType = _m === void 0 ? '' : _m, _o = props.center, center = _o === void 0 ? false : _o, _p = props.spacing, spacing = _p === void 0 ? 'md' : _p, _q = props.type, type = _q === void 0 ? 'none' : _q, icon = props.icon, image = props.image, imageRadius = props.imageRadius, imageWidth = props.imageWidth, imageHeight = props.imageHeight;
    var _r = react_1.useState(activeIndex
        ? activeIndex
        : children && children.length > 0
            ? 0
            : dataSource && dataSource.getTotalRecords() > 0
                ? 0
                : -1), activeIndexValue = _r[0], setActiveIndexValue = _r[1];
    var classes = ArchbaseList_styles_1["default"]({
        withPadding: withPadding,
        listStyleType: listStyleType,
        center: center,
        spacing: spacing,
        horizontal: horizontal,
        style: __assign({ width: width, height: height, overflowY: 'auto' }, style)
    }).classes;
    var _s = react_1.useState(filter), currentFilter = _s[0], setCurrentFilter = _s[1];
    var idList = react_1.useState(id)[0];
    hooks_1.useArchbaseDidMount(function () {
        if (dataSource) {
            dataSource.addListener(dataSourceEvent);
        }
    });
    hooks_1.useArchbaseWillUnmount(function () {
        if (dataSource) {
            dataSource.removeListener(dataSourceEvent);
        }
    });
    react_1.useEffect(function () {
        setActiveIndexValue(activeIndex);
        setCurrentFilter(filter);
    }, [activeIndex, filter]);
    var dataSourceEvent = function (event) {
        if (dataSource) {
            switch (event.type) {
                case datasource_1.DataSourceEventNames.afterScroll: {
                    if (onSelectListItem && !dataSource.isEmpty()) {
                        setActiveIndexValue(dataSource.getCurrentIndex());
                        onSelectListItem(dataSource.getCurrentIndex(), dataSource.getCurrentRecord());
                    }
                    break;
                }
                case (datasource_1.DataSourceEventNames.fieldChanged,
                    datasource_1.DataSourceEventNames.dataChanged,
                    datasource_1.DataSourceEventNames.recordChanged,
                    datasource_1.DataSourceEventNames.afterCancel):
                    {
                        setActiveIndexValue(dataSource.getCurrentIndex());
                        if (onSelectListItem && !dataSource.isEmpty()) {
                            onSelectListItem(dataSource.getCurrentIndex(), dataSource.getCurrentRecord());
                        }
                        break;
                    }
                default:
            }
        }
    };
    var handleSelectItem = function (index, data) {
        setActiveIndexValue(index);
        if (dataSource) {
            dataSource.gotoRecordByData(data);
        }
    };
    var handleKeyDown = function (event) {
        var keyActions = {
            38: function () { return handleArrowUp(); },
            37: function () { return handleArrowLeft(); },
            40: function () { return handleArrowDown(); },
            39: function () { return handleArrowRight(); },
            33: function () { return handlePageUp(); },
            34: function () { return handlePageDown(); },
            36: function () { return handleHome(); },
            35: function () { return handleEnd(); }
        };
        if (activeIndexValue >= 0 && rebuildedChildrens.length > 0) {
            var action = keyActions[event.keyCode];
            if (action) {
                event.preventDefault();
                action();
            }
        }
    };
    var handleArrowUp = function () {
        var index = activeIndexValue;
        if (index - 1 >= 0) {
            setActiveIndexValue(index - 1);
            handleSelectItem(index - 1, getRecordDataFromChildren(index - 1));
        }
    };
    var handleArrowLeft = function () {
        handleArrowUp();
    };
    var handleArrowDown = function () {
        var index = activeIndexValue;
        if (index + 1 < rebuildedChildrens.length) {
            setActiveIndexValue(index + 1);
            handleSelectItem(index + 1, getRecordDataFromChildren(index + 1));
        }
    };
    var handleArrowRight = function () {
        handleArrowDown();
    };
    var handlePageUp = function () {
        var index = Math.max(activeIndexValue - 5, 0);
        setActiveIndexValue(index);
        handleSelectItem(index, getRecordDataFromChildren(index));
    };
    var handlePageDown = function () {
        var index = Math.min(activeIndexValue + 5, rebuildedChildrens.length - 1);
        setActiveIndexValue(index);
        handleSelectItem(index, getRecordDataFromChildren(index));
    };
    var handleHome = function () {
        setActiveIndexValue(0);
        handleSelectItem(0, getRecordDataFromChildren(0));
    };
    var handleEnd = function () {
        var index = rebuildedChildrens.length - 1;
        setActiveIndexValue(index);
        handleSelectItem(index, getRecordDataFromChildren(index));
    };
    var buildChildrensFromDataSource = function (dataSource) {
        var sourceData = dataSource.browseRecords();
        if (sourceData.constructor !== Array) {
            throw new core_1.ArchbaseError('O dataSource deve ser obrigatoriamente um array de dados.');
        }
        return sourceData.map(function (record, index) {
            if (!record) {
                return null;
            }
            var itemIsValid = true;
            if (currentFilter && dataFieldText) {
                if (record[dataFieldText]) {
                    if (!record[dataFieldText].includes(currentFilter)) {
                        itemIsValid = false;
                    }
                }
            }
            if (onFilter) {
                itemIsValid = onFilter(record);
            }
            if (itemIsValid) {
                var active = record.active === undefined ? false : record.active;
                if (activeIndexValue >= 0) {
                    active = false;
                    if (activeIndexValue === index) {
                        active = true;
                    }
                }
                var component = props.component, id = props.id, dataSource = props.dataSource, rest = __rest(props, ["component", "id", "dataSource"]);
                if (component) {
                    var DynamicComponent = component.type;
                    var compProps = {};
                    if (component.props) {
                        compProps = component.props;
                    }
                    var newId = record[dataFieldId];
                    if (!newId) {
                        newId = idList + "_" + index;
                    }
                    var newKey = idList + "_" + index;
                    return (react_1["default"].createElement(DynamicComponent, __assign({ key: newKey, id: newId, active: active, index: index, dataSource: dataSource, recordData: record, disabled: record.disabled }, compProps, rest, component.props)));
                }
                else {
                    var newId = record[dataFieldId];
                    if (!newId) {
                        newId = idList + "_" + index;
                    }
                    var newKey = idList + "_" + index;
                    return (react_1["default"].createElement(ArchbaseListItem_1.ArchbaseListItem, { key: newKey, disabled: record.disabled, id: newId, index: index, active: active, align: record.align, justify: record.justify === undefined ? justify : record.justify, activeBackgroundColor: record.activeBackColor === undefined
                            ? activeBackgroundColor
                            : record.activeBackColor, activeColor: record.activeColor === undefined ? activeColor : record.activeColor, backgroundColor: record.backgroundColor === undefined ? backgroundColor : record.backgroundColor, color: record.color === undefined ? color : record.color, imageRadius: imageRadius, imageHeight: imageHeight, imageWidth: imageWidth, icon: record.icon ? record.icon : icon, image: image, spacing: spacing, caption: record[dataFieldText], withBorder: record.withBorder === undefined ? withBorder : record.withBorder, visible: true, recordData: record }));
                }
            }
            return null;
        });
    };
    var getRecordDataFromChildren = function (index) {
        var result;
        rebuildedChildrens.forEach(function (item) {
            if (item.props.index === index) {
                result = item.props.recordData;
            }
        });
        return result;
    };
    var rebuildChildrens = function () {
        return react_1["default"].Children.toArray(children).map(function (child, index) {
            if (child.props.visible)
                if (child.type && child.type.componentName !== 'ArchbaseListItem') {
                    throw new core_1.ArchbaseError('Apenas componentes do tipo ArchbaseListItem podem ser usados como filhos de ArchbaseList.');
                }
            if (!child.id) {
                throw new core_1.ArchbaseError('Todos os itens da lista devem conter um ID.');
            }
            var active = child.active;
            if (activeIndexValue >= 0) {
                active = false;
                if (activeIndexValue === index) {
                    active = true;
                }
            }
            return (react_1["default"].createElement(ArchbaseListItem_1.ArchbaseListItem, { key: child.id, disabled: child.disabled, id: child.id, index: index, active: active, align: align, justify: child.justify === undefined ? justify : child.justify, activeBackgroundColor: child.activeBackColor === undefined ? activeBackgroundColor : child.activeBackColor, activeColor: child.activeColor === undefined ? activeColor : child.activeColor, backgroundColor: child.backgroundColor === undefined ? backgroundColor : child.backgroundColor, color: child.color === undefined ? color : child.color, imageRadius: child.imageRadius ? child.imageRadius : imageRadius, imageHeight: child.imageHeight ? child.imageHeight : imageHeight, imageWidth: child.imageWidth ? child.imageWidth : imageWidth, icon: child.icon ? child.icon : icon, image: child.image ? child.image : image, spacing: child.spacing ? child.spacing : spacing, caption: child.caption, withBorder: child.withBorder === undefined ? withBorder : child.withBorder, visible: child.visible }, child.children));
        });
    };
    var rebuildedChildrens = react_1.useMemo(function () {
        if (dataSource) {
            return buildChildrensFromDataSource(dataSource);
        }
        else if (children) {
            return rebuildChildrens();
        }
        return [];
    }, [dataSource, children, activeIndexValue, props]);
    return (react_1["default"].createElement(core_2.Paper, { id: idList, tabIndex: -1, withBorder: withBorder, radius: borderRadius, onKeyDown: handleKeyDown },
        react_1["default"].createElement(core_2.Box, { component: type === 'unordered' ? 'ul' : type === 'ordered' ? 'ol' : 'div', className: classes.root, tabIndex: -1 },
            react_1["default"].createElement(ArchbaseList_context_1.ArchbaseListProvider, { value: {
                    dataSource: dataSource,
                    ownerId: id,
                    handleSelectItem: handleSelectItem,
                    activeBackgroundColor: activeBackgroundColor,
                    activeColor: activeColor,
                    type: type,
                    onItemEnter: onItemEnter,
                    onItemLeave: onItemLeave,
                    align: align
                } }, rebuildedChildrens))));
}
exports.ArchbaseList = ArchbaseList;
ArchbaseList.displayName = 'ArchbaseList';
