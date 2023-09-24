/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { Component } from 'react';
import './ArchbaseJsonPathPicker.css';
import { IconArrowBigRightFilled } from '@tabler/icons-react';
import { t } from 'i18next';

export interface ArchbaseJsonPathPickerOptions {
  outputCollapsed: boolean;
  outputWithQuotes: boolean;
  pathNotation: string;
  pathQuotesType: string;
  processKeys: boolean;
  keyReplaceRegexPattern: string | undefined;
  keyReplaceRegexFlags: string | undefined;
  keyReplacementText: string;
  pickerIcon: string;
  withoutPicker: boolean;
}

const defaultOptions: ArchbaseJsonPathPickerOptions = {
  outputCollapsed: false,
  outputWithQuotes: false,
  pathNotation: 'dots',
  pathQuotesType: 'single',
  processKeys: false,
  keyReplaceRegexPattern: undefined,
  keyReplaceRegexFlags: undefined,
  keyReplacementText: '',
  pickerIcon: '#x1f4cb',
  withoutPicker: false,
};

export interface ArchbaseJsonPathPickerProps {
  data: any;
  onSelect: (path: string) => void;
  options?: ArchbaseJsonPathPickerOptions;
}

function siblings(el, sel, callback) {
  var sibs: any[] = [];

  for (var i = 0; i < el.parentNode.children.length; i += 1) {
    var child = el.parentNode.children[i];

    if (child !== el && typeof sel === 'string' && child.matches(sel)) {
      sibs.push(child);
    }
  }
  if (callback && typeof callback === 'function') {
    for (var _i = 0; _i < sibs.length; _i += 1) {
      callback(sibs[_i]);
    }
  }

  return sibs;
}
function fireClick(node) {
  var doc;
  if (node.ownerDocument) {
    doc = node.ownerDocument;
  } else if (node.nodeType === 9) {
    doc = node;
  } else {
    throw new Error('Invalid node passed to fireEvent: '.concat(node.id));
  }

  if (node.dispatchEvent) {
    var eventClass = 'MouseEvents';
    var event = doc.createEvent(eventClass);
    event.initEvent('click', true, true);

    event.synthetic = true;
    node.dispatchEvent(event, true);
  } else if (node.fireEvent) {
    var _event = doc.createEventObject();
    _event.synthetic = true;
    node.fireEvent('onclick', _event);
  }
}

function isHidden(elem) {
  var width = elem.offsetWidth;
  var height = elem.offsetHeight;

  return (width === 0 && height === 0) || window.getComputedStyle(elem).display === 'none';
}

function getParents(elem, sel) {
  var result: any[] = [];

  for (var p = elem && elem.parentElement; p; p = p.parentElement) {
    if (typeof sel === 'string' && p.matches(sel)) {
      result.push(p);
    }
  }

  return result;
}

function isCollapsable(arg) {
  return arg instanceof Object && Object.keys(arg).length > 0;
}

function isUrl(string) {
  var regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#:.?+=&%@!\-/]))?/;

  return regexp.test(string);
}

export class ArchbaseJsonPathPicker extends Component<ArchbaseJsonPathPickerProps> {
  static defaultProps = {
    options: defaultOptions,
  };
  private pickerRef: any;
  private destRef: any;
  private jsonPathPickerInstance: any;
  constructor(props: ArchbaseJsonPathPickerProps) {
    super(props);
    this.pickerRef = React.createRef();
  }

  json2jsx = (json, options) => {
    if (typeof json === 'string') {
      const tmp = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      if (isUrl(tmp)) {
        return (
          <a href={tmp} className="json-string">
            {tmp}
          </a>
        );
      } else {
        return <span className="json-string">{`"${tmp}"`}</span>;
      }
    } else if (typeof json === 'number') {
      return <span className="json-literal">{json}</span>;
    } else if (typeof json === 'boolean') {
      return <span className="json-literal">{json}</span>;
    } else if (json === null) {
      return <span className="json-literal">null</span>;
    } else if (Array.isArray(json)) {
      if (json.length > 0) {
        return (
          <span>
            [
            <ol className="json-array">
              {json.map((item, index) => (
                <li key={index} data-key-type="array" data-key={index}>
                  {isCollapsable(item) && <a href="" className="json-toggle"></a>}
                  {this.json2jsx(item, options)}
                  {index < json.length - 1 && ','}
                </li>
              ))}
            </ol>
            ]
          </span>
        );
      } else {
        return '[]';
      }
    } else if (typeof json === 'object') {
      const keys = Object.keys(json);

      if (keys.length > 0) {
        return (
          <span>
            {'{'}
            <ul className="json-dict">
              {keys.map((key, index) => (
                <li key={key} data-key-type="object" data-key={key}>
                  {isCollapsable(json[key]) ? (
                    <a href="" className="json-toggle">
                      {options.outputWithQuotes ? <span className="json-string">{`"${key}"`}</span> : key}
                    </a>
                  ) : options.outputWithQuotes ? (
                    <span className="json-string">{`"${key}"`}</span>
                  ) : (
                    key
                  )}
                  <span className="pick-path" title={`${t('archbase:Pick path')}`}>
                    <IconArrowBigRightFilled size="1.0rem" />
                  </span>
                  : {this.json2jsx(json[key], options)}
                  {index < keys.length - 1 && ','}
                </li>
              ))}
            </ul>
            {'}'}
          </span>
        );
      } else {
        return '{}';
      }
    }
  };

  handlerEventToggle = (elm, event) => {
    elm.classList.toggle('collapsed');
    var subTarget = siblings(elm, 'ul.json-dict, ol.json-array', function (el) {
      el.style.display = el.style.display === '' || el.style.display === 'block' ? 'none' : 'block';
    });

    for (var i = 0; i < subTarget.length; i += 1) {
      if (!isHidden(subTarget[i])) {
        siblings(subTarget[i], '.json-placeholder', function (el) {
          return el.parentNode.removeChild(el);
        });
      } else {
        var childs = subTarget[i].children;
        var count = 0;

        for (var j = 0; j < childs.length; j += 1) {
          if (childs[j].tagName === 'LI') {
            count += 1;
          }
        }
        var placeholder = count + (count > 1 ? ' items' : ' item');
        subTarget[i].insertAdjacentHTML('afterend', '<a href class="json-placeholder">'.concat(placeholder, '</a>'));
      }
    }
    event.stopPropagation();
    event.preventDefault();
  };

  toggleEventListener = (event) => {
    var t = event.target;

    while (t && t !== this) {
      if (typeof t.matches == 'function') {
        if (t.matches('a.json-toggle')) {
          this.handlerEventToggle.call(null, t, event);
          event.stopPropagation();
          event.preventDefault();
        }
      }

      t = t.parentNode;
    }
  };

  simulateClickHandler = (elm, event) => {
    siblings(elm, 'a.json-toggle', function (el) {
      return fireClick(el);
    });
    event.stopPropagation();
    event.preventDefault();
  };

  simulateClickEventListener = (event) => {
    var t = event.target;

    while (t && t !== this) {
      if (typeof t.matches == 'function') {
        if (t.matches('a.json-placeholder')) {
          this.simulateClickHandler.call(null, t, event);
        }
      }

      t = t.parentNode;
    }
  };

  pickPathHandler = (elm) => {
    var $parentsList = getParents(elm, 'li').reverse();
    var pathSegments: any[] = [];

    for (var i = 0; i < $parentsList.length; i += 1) {
      var key = $parentsList[i].dataset.key;
      var keyType = $parentsList[i].dataset.keyType;

      if (
        keyType === 'object' &&
        typeof key !== 'number' &&
        this.props.options!.processKeys &&
        this.props.options!.keyReplaceRegexPattern !== undefined
      ) {
        var keyReplaceRegex = new RegExp(
          this.props.options!.keyReplaceRegexPattern,
          this.props.options!.keyReplaceRegexFlags,
        );
        var keyReplacementText =
          this.props.options!.keyReplacementText === undefined ? '' : this.props.options!.keyReplacementText;
        key = key.replace(keyReplaceRegex, keyReplacementText);
      }

      pathSegments.push({
        key: key,
        keyType: keyType,
      });
    }

    var quotes = {
      none: '',
      single: "'",
      double: '"',
    };
    var quote = quotes[this.props.options!.pathQuotesType];
    pathSegments = pathSegments.map((segment, idx) => {
      var isBracketsNotation = this.props.options!.pathNotation === 'brackets';
      var isKeyForbiddenInDotNotation = !/^\w+$/.test(segment.key) || typeof segment.key === 'number';

      if (segment.keyType === 'array' || segment.isKeyANumber) {
        return '['.concat(segment.key, ']');
      }

      if (isBracketsNotation || isKeyForbiddenInDotNotation) {
        return '['.concat(quote).concat(segment.key).concat(quote, ']');
      }

      if (idx > 0) {
        return '.'.concat(segment.key);
      }

      return segment.key;
    });
    var path = pathSegments.join('');

    if (this.props.onSelect) {
      this.props.onSelect(path);
    }
  };

  pickEventListener = (event) => {
    let t = event.target;
    while (t && t !== this) {
      if (typeof t.matches == 'function') {
        if (t.matches('.pick-path')) {
          this.pickPathHandler.call(null, t);
        }
      }
      t = t.parentNode;
    }
  };

  componentDidMount() {
    this.pickerRef.current.addEventListener('click', this.toggleEventListener);
    this.pickerRef.current.addEventListener('click', this.simulateClickEventListener);
    this.pickerRef.current.addEventListener('click', this.pickEventListener);
  }

  render() {
    return <div ref={this.pickerRef}>{this.json2jsx(this.props.data, {})}</div>;
  }
}
