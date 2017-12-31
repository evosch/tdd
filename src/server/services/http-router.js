import gateway from '../gateway';
import routes from '../routes';

const methodMapper = {
  GET: 'read',
  POST: 'create',
  PUT: 'update',
  DELETE: 'delete',
};

/**
 * Route Http calls to the correct service
 * @param {*} request the request object
 * @param {*} response the response object
 * @returns {void}
 */
async function HttpRouter(request, response) {
  const method = methodMapper[request.method];
  const route = request.url.pathname;

  if (!routes[route]) {
    return false;
  }
  const action = routes[route];

  console.log(`calling ${action}:${method}`);

  await gateway.service('router:before', request, response);

  return gateway.service(`${action}:${method}`, request, response);
}

gateway.register('entrypoint:read', HttpRouter);
gateway.register('entrypoint:create', HttpRouter);
gateway.register('entrypoint:update', HttpRouter);
gateway.register('entrypoint:delete', HttpRouter);
