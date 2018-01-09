import fs from 'fs';
import path from 'path';
import gateway from '../gateway';

const fileMimeMap = {
};

const extMimeMap = {
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
  '.apng': 'image/apng',
};

/**
 * Service static files
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {void}
 */
function staticFile(req, res) {
  return new Promise((resolve, reject) => {
    let pathname = `./public${req.url.pathname}`;

    fs.stat(pathname, (err, stats) => {
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

      const fileStream = fs.createReadStream(pathname);
      fileStream.on('open', () => {
        // since we're serving a static file TODO only switch on live, since it suck while developing
        res.setHeader('Cache-Control', 'public,max-age=31536000,immutable');
        const baseName = path.basename(pathname);
        if (fileMimeMap[baseName]) {
          res.setHeader('Content-Type', extMimeMap[baseName]);
        } else {
          const ext = path.extname(pathname);
          res.setHeader('Content-Type', extMimeMap[ext] || 'text/plain');
        }
        res.setHeader('Content-Length', stats.size);
      });
      fileStream.on('error', (error) => {
        reject(error);
      });

      fileStream.pipe(res);
      return resolve(true);
    });
  });
}

gateway.register('entrypoint:read', staticFile);
