import { MongoClient } from 'mongodb';
import gateway from '../gateway';

let mongoDB;
const MONGO_URL = 'mongodb://localhost:27017/tdd2';
const EVERYBODY_AUDIENCE = 'everybody';
const GUEST_AUDIENCE = 'guests';

/**
 * @returns {Promise} the promise of a database connection
 */
function db() {
  if (mongoDB) { return Promise.resolve(mongoDB); }
  return MongoClient.connect(MONGO_URL).then((client) => {
    mongoDB = client.db('tdd2');
    return Promise.resolve(mongoDB);
  });
}

/**
 * Create a new document in our mongo store
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {void}
 */
function createDocument(req, res) {
  db().then((conn) => {
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
  return db().then(conn => conn.collection('document').find(req.query).toArray().then((items) => {
    res.setHeader('Content-Type', 'application/json');
    if (items.length === 1) {
      res.write(JSON.stringify(items[0]));
    } else {
      res.write(JSON.stringify(items));
    }
    res.end();
    return true;
  }));
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

gateway.register('document:create', createDocument);
gateway.register('document:read', readDocument);
gateway.register('document:update', updateDocument);
gateway.register('document:delete', deleteDocument);

// setup a database connection
db();
