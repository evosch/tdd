'use strict';

var _mongodb = require('mongodb');

var _gateway = require('../gateway');

var _gateway2 = _interopRequireDefault(_gateway);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoConnection = void 0;
var MONGO_URL = 'mongodb://localhost:27017/tdd2';
var EVERYBODY_AUDIENCE = 'everybody';
var GUEST_AUDIENCE = 'guests';

/**
 * @returns {Promise} the promise of a database connection
 */
function db() {
  if (mongoConnection) {
    return Promise.resolve(mongoConnection);
  }
  return _mongodb.MongoClient.connect(MONGO_URL).then(function (connection) {
    mongoConnection = connection;
    return Promise.resolve(mongoConnection);
  });
}

/**
 * Create a new document in our mongo store
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {void}
 */
function createDocument(req, res) {
  db().then(function (conn) {
    // TODO check if it's allowed to insert on this category/group/website

    // check if this user has the permission to create a document
    conn.insert(req.input);
  });
}

/**
 * Returns the memberships of the current user
 * @param {*} req the request object
 * @returns {array} of memberships
 */
function getMemberships(req) {
  if (req.user && req.user.memberships) {
    return [EVERYBODY_AUDIENCE].concat(req.user.memberships);
  }
  return [EVERYBODY_AUDIENCE, GUEST_AUDIENCE];
}

/**
 * Read one or multiple documents from the mongo store
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {void}
 */
function readDocument(req, res) {
  // add a security bit to the query
  req.query.potentialAction = { $elemMatch: { _type: 'ReadAction', agent: { $in: getMemberships(req) } } };

  // add to the query a condition to make sure the user only sees what it should see
  return db().then(function (conn) {
    return conn.collection('document').find(req.query).toArray().then(function (items) {
      res.setHeader('Content-Type', 'application/json');
      if (items.length === 1) {
        res.write(JSON.stringify(items[0]));
      } else {
        res.write(JSON.stringify(items));
      }
      res.end();
      return true;
    });
  });
}

/**
 * Update an existing document on the mongo store
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {void}
 */
function updateDocument(req, res) {
  // TODO check if this user can update the document
  // add to the query a condition to make sure the user only updates what it can update
  if (req.input._id) {
    req.shared.db().update({ _id: req.input._id }, req.input);
  }
}

/**
 * Remove a document from the mongo store
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {void}
 */
function deleteDocument(req, res) {
  // add to the query a condition to make sure the user only deletes what it can delete
  req.shared.db().remove(req.input);
}

_gateway2.default.register('document:create', createDocument);
_gateway2.default.register('document:read', readDocument);
_gateway2.default.register('document:update', updateDocument);
_gateway2.default.register('document:delete', deleteDocument);

// setup a database connection
db();
//# sourceMappingURL=document.js.map