'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gateway = require('../gateway');

var _gateway2 = _interopRequireDefault(_gateway);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fileMimeMap = {};

var extMimeMap = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.webp': 'image/webp',
  '.apng': 'image/apng'
};

/**
 * Service static files
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {void}
 */
function staticFile(req, res) {
  return new Promise(function (resolve, reject) {
    var pathname = './public' + req.url.pathname;

    _fs2.default.stat(pathname, function (err, stats) {
      if (err) {
        if (err.errno === -4058) {
          return resolve(false);
        }
        return reject(err.message);
      }

      if (stats.isDirectory()) {
        // alter the request to fetch the index
        req.url.pathname += 'index.html';
        return staticFile(req, res);
      }

      // TODO add static gzip + brotli compression

      var fileStream = _fs2.default.createReadStream(pathname);
      fileStream.on('open', function () {
        var baseName = _path2.default.basename(pathname);
        if (fileMimeMap[baseName]) {
          res.setHeader('Content-Type', extMimeMap[baseName]);
        } else {
          var ext = _path2.default.extname(pathname);
          res.setHeader('Content-Type', extMimeMap[ext] || 'text/plain');
        }
        res.setHeader('Content-Length', stats.size);
      });
      fileStream.on('error', function (error) {
        reject(error);
      });

      fileStream.pipe(res);
      return resolve(true);
    });
  });
}

_gateway2.default.register('entrypoint:read', staticFile);
//# sourceMappingURL=static-file.js.map