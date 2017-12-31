'use strict';

/**
 * Route Http calls to the correct service
 * @param {*} request the request object
 * @param {*} response the response object
 * @returns {void}
 */
var HttpRouter = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
    var method, route, action;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            method = methodMapper[request.method];
            route = request.url.pathname;

            if (_routes2.default[route]) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', false);

          case 4:
            action = _routes2.default[route];


            console.log('calling ' + action + ':' + method);

            _context.next = 8;
            return _gateway2.default.service('router:before', request, response);

          case 8:
            return _context.abrupt('return', _gateway2.default.service(action + ':' + method, request, response));

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function HttpRouter(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _gateway = require('../gateway');

var _gateway2 = _interopRequireDefault(_gateway);

var _routes = require('../routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var methodMapper = {
  GET: 'read',
  POST: 'create',
  PUT: 'update',
  DELETE: 'delete'
};

_gateway2.default.register('entrypoint:read', HttpRouter);
_gateway2.default.register('entrypoint:create', HttpRouter);
_gateway2.default.register('entrypoint:update', HttpRouter);
_gateway2.default.register('entrypoint:delete', HttpRouter);
//# sourceMappingURL=http-router.js.map