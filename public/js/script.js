/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.startsWithCapital = startsWithCapital;
exports.isPrimitive = isPrimitive;
exports.toPath = toPath;
exports.get = get;
exports.set = set;
exports.merge = merge;
exports.cloneObject = cloneObject;
exports.emptyObject = emptyObject;
/**
 * check if the string starts with a capital
 * @param {string} string the string to check
 * @returns {boolean} if this string starts with a capital
 */
function startsWithCapital(string) {
  return (/^[A-Z]/.test(string)
  );
}

/**
 * Check if the structure is a primitive (int,string,bool)
 * @param {object} structure the argument to check
 * @returns {boolean} if this structure is a primitive
 */
function isPrimitive(structure) {
  var type = typeof structure === 'undefined' ? 'undefined' : _typeof(structure);
  return structure === null || type !== 'object' && type !== 'function';
}

/**
 * Turn a path into pathArray
 * @param {string|array} path path representation
 * @returns {array} the path
 */
function toPath(path) {
  if (Array.isArray(path)) {
    return path;
  }
  return path.split('/');
}

/**
 * Resolve a value from an object
 * @param {object} object the object to search in
 * @param {string|array} path path to resolve
 * @returns {any} resolved value
 */
function get(object, path) {
  var pc = toPath(path);
  var r = object;
  for (var i = 0; i < pc.length; i++) {
    if (typeof r[pc[i]] === 'undefined' || r[pc[i]] === null) {
      return undefined;
    }
    r = r[pc[i]];
  }
  return r;
}

/**
 * Set a value in an object
 * @param {object} object the object to store in
 * @param {string|array} path  path to store at
 * @param {any} value stored value
 * @returns {object} the object with the stored value
 */
function set(object, path, value) {
  if (path === null) {
    return merge(object, value);
  }
  var pc = toPath(path);
  var r = object;
  for (var i = 0; i < pc.length - 1; i++) {
    if (typeof r[pc[i]] === 'undefined') {
      r[pc[i]] = {};
    }
    r = r[pc[i]];
  }
  r[pc[pc.length - 1]] = merge(r[pc[pc.length - 1]], value);
  return object;
}

/**
 * Deep Merge two objects
 * @param {*} origin the object to add to
 * @param {*} extra the object to add
 * @returns {object} the merged object
 */
function merge(origin, extra) {
  if ((typeof origin === 'undefined' ? 'undefined' : _typeof(origin)) !== (typeof extra === 'undefined' ? 'undefined' : _typeof(extra)) || origin == null) {
    return extra;
  }

  // if the types don't match return the type of extra
  if (Array.isArray(extra) && !Array.isArray(origin)) {
    origin = [];
  }
  if (!Array.isArray(extra) && Array.isArray(origin)) {
    origin = {};
  }

  Object.keys(extra).forEach(function (key) {
    if (_typeof(origin[key]) !== 'object') {
      origin[key] = extra[key];
    } else if (_typeof(extra[key]) === 'object') {
      origin[key] = merge(origin[key], extra[key]);
    } else {
      origin[key] = extra[key];
    }
  });
  return origin;
}

function cloneObject(obj) {
  return merge({}, obj);
}

function emptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RENDER_ALLOW_ARRAY = exports.RENDER_PARENT_STRUCTURE = exports.RENDER_AS_ATTRIBUTE = exports.RENDER_FAIL_ON_UNDEFINED = undefined;
exports.renderConnectedAttribute = renderConnectedAttribute;
exports.renderAttribute = renderAttribute;
exports.default = render;

var _helpers = __webpack_require__(0);

var _observer = __webpack_require__(2);

var _event = __webpack_require__(5);

var IGNORE_PROPERTIES = ['nodeName', 'children'];

/**
 * Returns the numer of elements inside this object
 * @param {null|DocumentFragment|HTMLElement} object the object to count
 * @returns {int} the number of elements inside this object
 */
function length(object) {
  if (object === null) {
    return 0;
  }
  if (object instanceof DocumentFragment) {
    return object.childElementCount;
  }
  return 1;
}

var RENDER_FAIL_ON_UNDEFINED = exports.RENDER_FAIL_ON_UNDEFINED = 1;
var RENDER_AS_ATTRIBUTE = exports.RENDER_AS_ATTRIBUTE = 2;
var RENDER_PARENT_STRUCTURE = exports.RENDER_PARENT_STRUCTURE = 4;
var RENDER_ALLOW_ARRAY = exports.RENDER_ALLOW_ARRAY = 8;

/**
 * Render one of the existing components
 * @param {object} structure the component structure
 * @param {boolean} flags return the raw value or an HTMLElement
 * @returns {null|HTMLElement} the rendered component
 */
function renderComponent(structure, flags) {
  if (structure.onload) {
    _event.executeEvent.call(this, structure.onload);
  }
  var componentStructure = this.components[structure.nodeName].call(this, structure);
  if (flags & RENDER_AS_ATTRIBUTE) {
    return renderAttribute.call(this, componentStructure, flags);
  }
  return render.call(this, componentStructure);
}

/**
 * Render an attributes value but any observer will update the whole component
 * @param {*} structure the structure to render
 * @param {*} parentStructure the structure to render on update (the parent)
 * @param {*} flags any flags
 * @returns {any} the result of the render call
 */
function renderConnectedAttribute(structure, parentStructure, flags) {
  var freshObserver = false;
  if (!this.observerParentStructure) {
    this.observerParentStructure = parentStructure;
    freshObserver = true;
  }
  var value = renderAttribute.call(this, structure, flags);
  if (freshObserver) {
    this.observerParentStructure = null;
  }
  return value;
}

/**
 * Turns a structure into a Attribute Value
 * @param {object} structure the attribute value
 * @param {int} flags flags
 * @returns {any} the attribute value
 */
function renderAttribute(structure, flags) {
  var _this = this;

  if (typeof structure === 'undefined') {
    if (flags & RENDER_FAIL_ON_UNDEFINED) {
      throw 'Attribute value not set';
    }
    return null;
  }
  if (Array.isArray(structure)) {
    var attr = structure.map(function (item) {
      return renderAttribute.call(_this, item, flags);
    });
    if (flags & RENDER_ALLOW_ARRAY) {
      return attr;
    }
    return attr.join('');
  }
  if ((0, _helpers.startsWithCapital)(structure.nodeName)) {
    return renderComponent.call(this, structure, flags | RENDER_AS_ATTRIBUTE);
  }
  if ((0, _helpers.isPrimitive)(structure)) {
    return structure;
  }
  return null;
}

/**
 * Turns an html-structure into a HTMLElement
 * @param {object} structure the structure
 * @param {HTMLElement} node dom node
 * @returns {null|HTMLElement} the HTMLElement
 */
function renderHtml(structure) {
  var _this2 = this;

  // since we're creating a new html node, all observers can be added to the previous node
  _observer.observerAttachNode.call(this);

  var node = document.createElement(structure.nodeName);
  // set the new observable node
  _observer.setObserver.call(this, node);

  Object.keys(structure).forEach(function (property) {
    if (IGNORE_PROPERTIES.indexOf(property) !== -1) {
      return;
    }
    if (property.startsWith('on')) {
      node.addEventListener(property.substr(2), function (nativeEvent) {
        structure[property].forEach(function (event) {
          _event.executeEvent.call(_this2, event, nativeEvent);
        });
      });
    }
    var attributeValue = renderAttribute.call(_this2, structure[property]);
    if (attributeValue) {
      node.setAttribute(property, attributeValue);
    }
  });

  if (Array.isArray(structure.children)) {
    var cursorPosition = 0;
    var rootNode = this.observableNode;
    structure.children.forEach(function (childStructure) {
      _this2.observableNode = rootNode;
      var childRendered = render.call(_this2, childStructure);
      if (!(0, _helpers.isPrimitive)(childStructure)) {
        childStructure.cursorStart = cursorPosition;
        childStructure.cursorLength = length(childRendered);
        cursorPosition = childStructure.cursorStart + childStructure.cursorLength;
        childStructure.cursorEnd = cursorPosition;
      }
      if (childRendered !== null) {
        node.appendChild(childRendered);
      }
    });
  }

  return node;
}

/**
 * Render an array
 * @param {array} structure the array to render
 * @returns {HTMLElement} a fragment containing all elements
 */
function renderArray(structure) {
  var _this3 = this;

  var fragment = document.createDocumentFragment();
  var currentNode = this.observableNode;
  structure.forEach(function (item) {
    var renderedItem = render.call(_this3, item);
    if (renderedItem !== null) {
      fragment.appendChild(renderedItem);
    }
  });
  this.observableNode = currentNode;
  return fragment;
}

/**
 * Turns a structure into a DOM Object
 * @param {object} structure the structure to render
 * @returns {null|HTMLElement} the rendered structure
 */
function render(structure) {
  switch (true) {
    case structure === null:
      return null;
    case structure instanceof DocumentFragment:
      return structure;
    case Array.isArray(structure):
      return renderArray.call(this, structure);
    case (0, _helpers.isPrimitive)(structure):
      return document.createTextNode(structure !== null ? structure : '');
    case (0, _helpers.startsWithCapital)(structure.nodeName):
      // is a component
      return renderComponent.call(this, structure);
    default:
      return renderHtml.call(this, structure);
  }
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startObserver = startObserver;
exports.observerAttachNode = observerAttachNode;
exports.setObserver = setObserver;
exports.cleanup = cleanup;
exports.watch = watch;
/**
 * initialize the observers
 * @param {HTMLElement} target the rootElement
 * @returns {void}
 */
function startObserver(target) {
  this.observers = [];
  setObserver.call(this, target);
}

/**
 * attach the current node to all new observers
 * @returns {void}
 */
function observerAttachNode() {
  var _this = this;

  var unboundObservers = this.observers.slice(this.observerLastEnd);
  unboundObservers.forEach(function (observer) {
    observer.node = _this.observableNode;
  });
}

/**
 * Set the current observer state
 * @param {HTMLElement} target the current rendered HTMLElement
 * @returns {void}
 */
function setObserver(target) {
  this.observableNode = target;
  this.observerLastEnd = this.observers.length;
}

/**
 * Remove all unused observers
 * @returns {void}
 */
function cleanup() {
  var _this2 = this;

  this.observers = this.observers.filter(function (observer) {
    return _this2.rootElement.contains(observer.node);
  });
}

/**
 * Monitor a store path for changes
 * @param {string} path the path to monitor
 * @param {object} structure the object to render
 * @returns {void}
 */
function watch(path, structure) {
  // create a copy of the context object
  var context = Object.assign({}, this.context);
  if (this.observerParentStructure) {
    var parentStructure = Object.assign({}, this.observerParentStructure);
    this.observers.push({ watch: path, structure: parentStructure, node: this.observableNode, context: context });
  } else {
    this.observers.push({ watch: path, structure: structure, node: this.observableNode, context: context });
  }
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FETCH_STATE = undefined;
exports.setFetchHeader = setFetchHeader;
exports.default = fetch;

var _helpers = __webpack_require__(0);

var _renderer = __webpack_require__(1);

var FETCH_STATE = exports.FETCH_STATE = '::fetch';

/**
 * Store the received data in the state
 * @param {string} url the requested url
 * @param {object} structure the structure
 * @param {any} data the responsed data
 * @returns {void}
 */
function setFetchState(url, structure, data) {
  var state = {};
  state[url] = data;
  if (structure.to) {
    state[structure.to] = data;
  }
  this.setState(state);
}

function addQueryString(baseUrl, data) {
  if (!data) {
    return baseUrl;
  }
  params = toQueryString(data);
  if (baseUrl.indexOf('?') === -1) {
    return baseUrl + '?' + params.toString();
  }
  return baseUrl + '&' + params.toString();
}

/**
 * Covert an object into a querystring
 * @param {object} data the object to add
 * @returns {string} the combined url
 */
function toQueryString(data) {
  var params = new window.URLSearchParams();

  // iterate over all the object keys
  Object.keys(data).forEach(function (key) {
    if (Array.isArray(data[key])) {
      // if it's an array we add all the index seperate
      data[key].forEach(function (value) {
        params.append(key, value);
      });
    }
    // if it's not an array we just add the key
    params.append(key, data[key]);
  });

  return params;
}

var headers = new Headers();

/**
 * set the fetch event global headers
 * @param {string} name the header name
 * @param {string} value the header value
 * @returns {void}
 */
function setFetchHeader(name, value) {
  headers.append(name, value);
}

/**
 * fetch event to get remove data
 * @param {object} structure the event structure
 * @returns {void}
 */
function fetch(structure) {
  var _this = this;

  // resolve the url, so we allow it to have placeholders in it
  var url = _renderer.renderAttribute.call(this, structure.url);

  // check if the data is already in memory
  var storedResponse = (0, _helpers.get)(this.store, url);
  // loading
  var state = (0, _helpers.get)(this.store, FETCH_STATE + '/' + url);

  if (!storedResponse && !state) {
    this.setState(FETCH_STATE + '/' + url, true);

    var fetchOptions = { method: (structure.method || 'GET').toUpperCase(), headers: headers };
    if (['POST', 'PUT'].indexOf(fetchOptions.method) !== -1) {
      fetchOptions.body = toQueryString(structure.data);
    } else {
      url = addQueryString(url, structure.data);
    }

    window.fetch(url, fetchOptions).then(function (response) {
      if (response.status !== 200) {
        return Promise.reject();
      }
      return response.json();
    }).then(function (data) {
      _this.setState(FETCH_STATE + '/' + url, false);
      setFetchState.call(_this, url, structure, data);
    });
  }
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = __webpack_require__(1);

var _renderer2 = _interopRequireDefault(_renderer);

var _components = __webpack_require__(6);

var _components2 = _interopRequireDefault(_components);

var _events = __webpack_require__(14);

var _events2 = _interopRequireDefault(_events);

var _observer = __webpack_require__(2);

var _helpers = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The generic app class
 */
var App = function () {
  /**
   * The app constructor
   * @param {HTMLElement} target the dom node to base it on
   * @param {string} ref the view to load
   */
  function App(target, ref) {
    _classCallCheck(this, App);

    this.rootElement = target;
    this.store = {
      url: window.location
    };
    this.components = _components2.default;
    this.events = _events2.default;
    this.rendering = false;
    this.futureState = {};

    _observer.startObserver.call(this, target);

    _renderer2.default.call(this, {
      nodeName: 'Partial',
      ref: ref,
      cursorStart: 0,
      cursorEnd: 0,
      cursorLength: 0
    });

    _observer.observerAttachNode.call(this);
  }

  /**
   * A static method to boot an app {@link App#constructor}
   * @param {HTMLElement} target targ
   * @param {string} ref the view to load
   * @returns {App} the app
   */


  _createClass(App, [{
    key: 'setState',


    /**
    * set the new state and trigger a re-render
    * @param {object} newState the new state
    * @param {any} value optional value
    * @returns {void}
    */
    value: function setState(newState, value) {
      var _this = this;

      // convert a key value pair into an object
      if (typeof newState === 'string') {
        var convState = {};
        convState[newState] = value;
        newState = convState;
      }

      var paths = Object.keys(newState);
      if (this.rendering) {
        paths.forEach(function (path) {
          _this.futureState[path] = newState[path];
        });
        return;
      }

      this.rendering = true;

      // update the store with the new data
      paths.forEach(function (path) {
        (0, _helpers.set)(_this.store, path, newState[path]);
      });

      // check if any of the observers start with this path
      var activeObservers = this.observers.filter(function (observer) {
        return paths.find(function (path) {
          return observer.watch.startsWith(path);
        });
      });

      // only perform actions on the topNodes
      var reducedActiveObservers = activeObservers;

      // perform the render action on these nodes
      reducedActiveObservers.forEach(function (observer) {
        _this.context = observer.context;
        _this.observableNode = observer.node;
        // create a copy of the cursor so we know where the old node was
        var cursorStart = observer.structure.cursorStart;
        var cursorEnd = observer.structure.cursorEnd;
        var rendered = _renderer2.default.call(_this, observer.structure);
        // remove if anything is rendered
        for (var i = cursorEnd; i > cursorStart; i--) {
          var child = observer.node.children[i];
          observer.node.removeChild(child);
        }
        // add the new data if any
        if (rendered !== null) {
          observer.node.appendChild(rendered);
        }

        // remove the observer because it will have be added again
        var observerIndex = _this.observers.indexOf(observer);
        _this.observers.splice(observerIndex, 1);
      });

      // remove all un-attached observers
      _observer.cleanup.call(this);

      this.rendering = false;
      if (!(0, _helpers.emptyObject)(this.futureState)) {
        var stateClone = (0, _helpers.cloneObject)(this.futureState);
        this.futureState = {};
        this.setState(stateClone);
      }
    }
  }], [{
    key: 'boot',
    value: function boot(target, ref) {
      return new App(target, ref);
    }
  }]);

  return App;
}();

var target = document.querySelector('body');
App.boot(target, 'views/application.json');

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeEvent = executeEvent;
/**
 * Run the event
 * @param {*} structure the event structure
 * @param {*} nativeEvent the native event object
 * @returns {void}
 */
function executeEvent(structure, nativeEvent) {
  this.events[structure.nodeName].call(this, structure, nativeEvent);
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Component = __webpack_require__(7);

var _Component2 = _interopRequireDefault(_Component);

var _Condition = __webpack_require__(8);

var _Condition2 = _interopRequireDefault(_Condition);

var _Partial = __webpack_require__(9);

var _Partial2 = _interopRequireDefault(_Partial);

var _Iterator = __webpack_require__(10);

var _Iterator2 = _interopRequireDefault(_Iterator);

var _Placeholder = __webpack_require__(11);

var _Placeholder2 = _interopRequireDefault(_Placeholder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Component: _Component2.default,
  Iterator: _Iterator2.default,
  Partial: _Partial2.default,
  Condition: _Condition2.default,
  Placeholder: _Placeholder2.default
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Component;
/**
 * Store a component in memory for later use
 * @param {object} structure the components structure
 * @returns {void}
 */
function Component(structure) {
  if (!Array.isArray(this.components)) {
    this.components = {};
  }
  this.components[structure.name] = structure.children;
  return null;
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Condition;

var _renderer = __webpack_require__(1);

var _renderer2 = _interopRequireDefault(_renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Validate a condition
 * @param {object} condition the structure to validate
 * @returns {boolean} wether it's valid or not
 */
function validateCondition(condition) {
  switch (condition[1]) {
    case '===':
      return condition[0] === condition[1];
    default:
      console.warn('unsupported operator ' + condition[1]);
  }
  return null;
}

/**
 * the Condition object
 * @param {object} structure the structure
 * @returns {null|HTMLElement} the dom result
 */
function Condition(structure) {
  var valid = validateCondition(structure.condition);

  if (valid && structure.valid) {
    return (0, _renderer2.default)(structure.valid);
  }
  if (!valid && structure.invalid) {
    return (0, _renderer2.default)(structure.invalid);
  }
  return null;
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Partial;

var _fetch = __webpack_require__(3);

var _fetch2 = _interopRequireDefault(_fetch);

var _renderer = __webpack_require__(1);

var _renderer2 = _interopRequireDefault(_renderer);

var _helpers = __webpack_require__(0);

var _observer = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Reference an other file
 * @param {object} structure the partial structure
 * @returns {null|HTMLElement} the result
 */
function Partial(structure) {
  var ref = void 0;
  try {
    ref = _renderer.renderConnectedAttribute.call(this, structure.ref, structure, _renderer.RENDER_FAIL_ON_UNDEFINED);
  } catch (err) {
    return null;
  }

  // check if the partial is already in memory, if so render it, if not fetch it
  var response = (0, _helpers.get)(this.store, ref);

  // add an observer to get notified when the ref is changed so we can re-render
  _observer.watch.call(this, ref, structure);

  if (response) {
    return _renderer2.default.call(this, response);
  } else if (!response) {
    _fetch2.default.call(this, { url: ref });
  }
  // it it's being loaded or there is no data, return nothing
  return null;
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Iterator;

var _renderer = __webpack_require__(1);

var _renderer2 = _interopRequireDefault(_renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The Iterator object
 * @param {object} structure the structure object
 * @returns {DocumentFragment} fragment
 */
function Iterator(structure) {
  var _this = this;

  var iteratorName = structure.name;
  var fragment = document.createDocumentFragment();

  try {
    structure.data = _renderer.renderConnectedAttribute.call(this, structure.data, structure, _renderer.RENDER_ALLOW_ARRAY | _renderer.RENDER_FAIL_ON_UNDEFINED);
  } catch (err) {
    return null;
  }

  structure.data.forEach(function (item, index) {
    _this.context[iteratorName] = index;
    var itemContent = _renderer2.default.call(_this, structure.children);
    if (itemContent !== null) {
      fragment.appendChild(itemContent);
    }
  });
  return fragment;
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Placeholder;

var _helpers = __webpack_require__(0);

var _observer = __webpack_require__(2);

var _transformers = __webpack_require__(12);

var _transformers2 = _interopRequireDefault(_transformers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Fetch the value from a placeholder
 * @param {object} structure the structure to render
 * @returns {any} the value of the placeholder
 */
function Placeholder(structure) {
  var value = void 0;
  if (structure.ref.startsWith('$')) {
    value = this.context[structure.ref.slice(1)];
  } else {
    value = (0, _helpers.get)(this.store, structure.ref);
    _observer.watch.call(this, structure.ref, structure);
  }
  if (structure.transform) {
    value = _transformers2.default[structure.transform](value, structure);
  }
  return value;
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ArrayJoin = __webpack_require__(13);

var _ArrayJoin2 = _interopRequireDefault(_ArrayJoin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  ArrayJoin: _ArrayJoin2.default
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ArrayJoin;
function ArrayJoin(value, _ref) {
  var _ref$seperator = _ref.seperator,
      seperator = _ref$seperator === undefined ? "," : _ref$seperator;

  return value.join(seperator);
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fetch = __webpack_require__(3);

var _fetch2 = _interopRequireDefault(_fetch);

var _ajax = __webpack_require__(15);

var _ajax2 = _interopRequireDefault(_ajax);

var _oauth = __webpack_require__(16);

var _oauth2 = _interopRequireDefault(_oauth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  fetch: _fetch2.default,
  ajax: _ajax2.default,
  oauth: _oauth2.default
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ajax;

var _fetch = __webpack_require__(3);

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Turns a DOM Form Element into an object containing all information stored within the form
 * @param {FormElement} form the DOM Form element
 * @returns {object} the data
 */
function formToObject(form) {
  var formData = {};
  [].forEach.call(form.elements, function (element) {
    // Don't process elements without a name
    if (!element.name) {
      return;
    }

    // Don't process unchecked radios and checkboxes
    if (element.nodeName === 'INPUT' && ['radio', 'checkbox'].indexOf(element.type) !== -1 && element.checked === false) {
      return;
    }

    // Make checkboxes work
    if (element.nodeName === 'INPUT' && element.type === 'checkbox') {
      if (!Array.isArray(formData[element.name])) {
        formData[element.name] = [];
      }
      formData[element.name].push(element.value);
    } else {
      formData[element.name] = element.value;
    }

    // TODO select[multiselect]
  });
  return formData;
}

/**
 * Call a resource in using form input
 * @param {object} structure the structure to base the request on
 * @param {object} value the original event
 * @returns {void}
 */
function ajax(structure, value) {
  value.preventDefault();

  var form = value.target.nodeName === 'FORM' ? value.target : value.target.form;
  var fetchParams = {
    url: form.action,
    method: form.method || 'get',
    data: formToObject(form)
  };

  if (form.name) {
    fetchParams.to = form.name;
  }

  _fetch2.default.call(this, fetchParams, value);
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = oauth;

var _fetch = __webpack_require__(3);

var _helpers = __webpack_require__(0);

var OAUTH_STATE = 'oauth2/token';

/**
 * Add the Bearer header to every request if a token is present
 * @returns {void}
 */
function oauth() {
  // let's see if it stored in the state
  var token = void 0;
  var response = (0, _helpers.get)(this.store, OAUTH_STATE);
  if (response) {
    token = response.token;
    window.localStorage.setItem('token', token);
  } else {
    // check if there's a token in the storage
    token = window.localStorage.getItem('token');
  }
  if (token) {
    (0, _fetch.setFetchHeader)('Bearer', token);
  }
}

/***/ })
/******/ ]);
//# sourceMappingURL=script.js.map