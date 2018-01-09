import { createServer } from 'http';
import querystring from 'querystring';
import { StringDecoder } from 'string_decoder';
import url from 'url';
import gateway from '../gateway';

const methodMapping = {
  POST: 'create',
  GET: 'read',
  PUT: 'update',
  DELETE: 'delete',
};

/**
 * Handle an incomming request
 * @param {*} request the request object
 * @param {*} response the response object
 * @returns {void}
 */
function handleRequest(request, response) {
  // parse method
  const method = methodMapping[request.method];

  // call the services
  gateway.service(`entrypoint:${method}`, request, response).then((result) => {
    // handle no response from server
    if (!result) {
      if (request.url.pathname.indexOf('.') === -1) {
        request.url.pathname = '/index.html';
        gateway.service('entrypoint:read', request, response);
      } else {
        // if it requested a file the file wasn't found
        response.statusCode = 404;
        response.write('Not Found');
        response.end();
      }
    }
  }).catch((err) => {
    console.error(err);
    response.statusCode = 500;
    if (typeof err === 'object') {
      err = err.toString();
    }
    response.write(err);
    response.end();
  });
}

/**
 * decoded a application/x-www-form-urlencoded string
 * @param {*} request the request object
 * @param {*} options any options specified
 * @returns {void}
 */
function formUrlencoded(request, options) {
  const decoder = new StringDecoder(options.charset || 'utf8');
  const decodedBody = decoder.end(request.rawBody);
  request.body = querystring.parse(decodedBody);
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
    const options = querystring.parse(request.headers['content-type'], ';');
    const contentType = Object.keys(options)[0];
    delete options[contentType];

    switch (contentType) {
      case 'application/x-www-form-urlencoded':
        formUrlencoded(request, options);
        break;
      // TODO implement 'multipart/form-data':
      default:
        response.statusCode = 415;
        response.write('Unsupported Media Type');
        response.end();
    }
  }
}

const httpServer = createServer((request, response) => {
  // parse url
  request.url = url.parse(`http://${request.headers.host}${request.url}`);
  console.log(request.url.href);
  // parse querystring
  request.query = querystring.parse(request.url.query);

  const buffer = [];

  request.on('data', (chunk) => {
    buffer.push(chunk);
  });
  request.on('end', () => {
    // parse the body
    parseBody(request, response, buffer);

    handleRequest(request, response);
  });

  // TODO turn the request and response into a more generic interface
  // which would also work for websockets e.a.
});

httpServer.listen(8080);
