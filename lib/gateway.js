'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var services = {};

exports.default = {
  register: function register(name, service) {
    if (typeof services[name] === 'undefined') {
      services[name] = [];
    }
    services[name].push(service);
  },
  service: function service(name) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!services[name]) {
      console.log('no service registered for ' + name);
      return false;
    }
    console.log('running ' + name + ' (' + services[name].length + ')');
    return services[name].reduce(function (promise, service) {
      return promise.then(function (result) {
        if (result === false) {
          console.log('- calling ' + service.name);
          return service.call.apply(service, [null].concat(_toConsumableArray(args)));
        }
        return result;
      });
    }, Promise.resolve(false));
  }
};
//# sourceMappingURL=gateway.js.map