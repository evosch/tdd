'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _http = require('http');

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _string_decoder = require('string_decoder');

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _gateway = require('../gateway');

var _gateway2 = _interopRequireDefault(_gateway);

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var methodMapping = {
  POST: 'create',
  GET: 'read',
  PUT: 'update',
  DELETE: 'delete'
};

/**
 * Handle an incomming request
 * @param {*} request the request object
 * @param {*} response the response object
 * @returns {void}
 */
function handleRequest(request, response) {
  // parse method
  var method = methodMapping[request.method];

  // call the services
  _gateway2.default.service('entrypoint:' + method, request, response).then(function (result) {
    // handle no response from server
    if (!result) {
      if (request.url.pathname.indexOf('.') === -1) {
        request.url.pathname = '/index.html';
        _gateway2.default.service('entrypoint:read', request, response);
      } else {
        // if it requested a file the file wasn't found
        response.statusCode = 404;
        response.write('Not Found');
        response.end();
      }
    }
  }).catch(function (err) {
    console.error(err);
    response.statusCode = 500;
    if ((typeof err === 'undefined' ? 'undefined' : _typeof(err)) === 'object') {
      err = err.toString();
    }
    response.write(err);
    response.end();
  });
}

/**
 * Parse any body send with te request
 * @param {*} request the request object
 * @param {*} response the response object
 * @param {array} buffer the buffer object
 * @returns {void}
 */
function parseBody(request, response, buffer) {
  request.rawBody = Buffer.concat(buffer);

  if (request.headers['content-type']) {
    var options = _querystring2.default.parse(request.headers['content-type'], ';');
    var contentType = Object.keys(options)[0];
    delete options[contentType];

    switch (contentType) {
      case 'application/x-www-form-urlencoded':
        var decoder = new _string_decoder.StringDecoder(options.charset || 'utf8');
        var decodedBody = decoder.end(request.rawBody);
        request.body = _querystring2.default.parse(decodedBody);
        break;
      // TODO implement 'multipart/form-data':
      default:
        response.statusCode = 415;
        response.write('Unsupported Media Type');
        response.end();
    }
  }
}

var httpServer = (0, _http.createServer)(function (request, response) {
  // parse url
  request.url = _url2.default.parse('http://' + request.headers.host + request.url);
  console.log(request.url.href);
  // parse querystring
  request.query = _querystring2.default.parse(request.url.query);

  var buffer = [];

  request.on('data', function (chunk) {
    buffer.push(chunk);
  });
  request.on('end', function () {
    // parse the body
    parseBody(request, response, buffer);

    handleRequest(request, response);
  });

  // TODO turn the request and response into a more generic interface
  // which would also work for websockets e.a.
});

httpServer.listen(80);
//# sourceMappingURL=http.js.map