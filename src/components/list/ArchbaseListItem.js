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
exports.__esModule = true;
exports.ArchbaseListItem = void 0;
var react_1 = require("react");
var core_1 = require("@mantine/core");
var ArchbaseList_context_1 = require("./ArchbaseList.context");
function ArchbaseListItem(_a) {
    var active = _a.active, activeBackgroundColor = _a.activeBackgroundColor, activeColor = _a.activeColor, 
    //align,
    backgroundColor = _a.backgroundColor, caption = _a.caption, color = _a.color, disabled = _a.disabled, icon = _a.icon, id = _a.id, index = _a.index, image = _a.image, imageRadius = _a.imageRadius, imageHeight = _a.imageHeight, imageWidth = _a.imageWidth, _b = _a.justify, justify = _b === void 0 ? 'flex-start' : _b, children = _a.children, recordData = _a.recordData, _c = _a.spacing, spacing = _c === void 0 ? 'md' : _c;
    var listContextValue = react_1.useContext(ArchbaseList_context_1["default"]);
    var itemRef = react_1.useRef(null);
    react_1.useEffect(function () {
        if (itemRef.current && active) {
            itemRef.current.focus();
        }
    }, [active]);
    var onClick = function (event) {
        event.preventDefault();
        if (!disabled) {
            if (listContextValue.handleSelectItem) {
                listContextValue.handleSelectItem(index, recordData);
            }
        }
    };
    var handleMouseOver = function (event) {
        if (listContextValue.onItemEnter) {
            listContextValue.onItemEnter(event, recordData);
        }
    };
    var handleMouseOut = function (event) {
        if (listContextValue.onItemLeave) {
            listContextValue.onItemLeave(event, recordData);
        }
    };
    var style = {
        display: 'flex',
        backgroundColor: '',
        color: '',
        justifyContent: justify,
        alignItems: 'center'
    };
    if (activeBackgroundColor && activeColor && active) {
        style = __assign(__assign({}, style), { backgroundColor: activeBackgroundColor, color: activeColor });
    }
    else if (backgroundColor && color && !active) {
        style = __assign(__assign({}, style), { backgroundColor: backgroundColor, color: color });
    }
    var imageComp = image ? (typeof image === 'string' ? (react_1["default"].createElement(core_1.Image, { src: recordData[image], radius: imageRadius, width: imageWidth, height: imageHeight })) : (image)) : (image);
    var ComponentItem = listContextValue.type === 'ordered'
        ? 'ol'
        : listContextValue.type === 'unordered'
            ? 'ul'
            : 'div';
    return (react_1["default"].createElement(ComponentItem, { tabIndex: -1, ref: itemRef, style: style, onClick: onClick, onMouseOver: handleMouseOver, onMouseOut: handleMouseOut, id: "stItem_" + listContextValue.ownerId + "_" + id, key: "lstItem_" + listContextValue.ownerId + "_" + id },
        icon,
        icon ? react_1["default"].createElement(core_1.Space, { w: spacing }) : null,
        imageComp,
        imageComp ? react_1["default"].createElement(core_1.Space, { w: spacing }) : null,
        caption,
        children));
}
exports.ArchbaseListItem = ArchbaseListItem;
ArchbaseListItem.defaultProps = {
    align: 'left',
    justify: false,
    showBorder: false,
    disabled: false
};
ArchbaseListItem.displayName = 'ArchbaseListItem';
