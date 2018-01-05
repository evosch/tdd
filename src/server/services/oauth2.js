import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import { MongoClient } from 'mongodb';

import gateway from '../gateway';

let mongoDB;
const MONGO_URL = 'mongodb://localhost:27017/tdd2';

/**
 * @returns {Promise} the promise of a database connection
 */
function database() {
  if (mongoDB) { return Promise.resolve(mongoDB); }
  return MongoClient.connect(MONGO_URL).then((client) => {
    mongoDB = client.db('tdd2');
    return Promise.resolve(mongoDB);
  });
}

/**
 * Generate a token
 * @param {*} size the length of the token
 * @returns {Promise} the promise of the token
 */
function generateToken(size) {
  return new Promise((resolve, reject) => {
    randomBytes(size, (err, buffer) => {
      if (err) { return reject(err); }
      return resolve(buffer.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_'));
    });
  });
}

/**
 * all the memberships of this user
 * @param {object} user the Person or Organization object
 * @returns {array} the list organizations
 */
async function memberOf(user) {
  const db = await database();
  const memberships = [];
  if (user.memberOf && user.memberOf.length > 0) {
    const organizations = await db.collection('documents').find({ alternateName: { $in: user.memberOf } }).toArray();
    console.log(organizations);
  }
  return memberships;
}

/**
 * The Oauth2 password grant procedure
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {Promise} the of a grant
 */
async function passwordGrant(req, res) {
  const db = await database();
  // verify user
  const user = await db.collection('users').findOne({ username: req.body.username });

  if (!user) {
    throw 'user password combination not found';
  }

  const isValid = await argon2.verify(user.password, req.body.password);

  if (!isValid) {
    throw 'invalid password';
  }

  // resolve the corresponding Person
  // BE CAREFUL THIS BYPASSES SECURITY!
  const person = await db.collection('documents').find({ alternateName: user.name });

  // resolve Organizations
  // BE CAREFUL THIS BYPASSES SECURITY!
  const policy = await memberOf(person);

  // generate tokens
  const accessToken = await generateToken(48);
  const expiresIn = 3600;

  // store the tokens
  await db.collection('tokens').insert({ type: 'access_token', token: accessToken, policy });

  // todo generate an access token / refresh token
  res.write(JSON.stringify({
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: expiresIn,
  }));
  res.end();
  return true;
}

/**
 * Oauth2 token service
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {Promise} the promise of a token
 */
async function token(req, res) {
  switch (req.body.grant_type) {
    case 'password': return passwordGrant(req, res);
    default:
      throw 'grant_type not allowed';
  }
}

/**
 * Register a new user
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {Promise} the promise of a registered user
 */
async function register(req, res) {
  const db = database();

  const password = await argon2.hash(req.body.password);

  await db.collection('users').insert({ document_id, username: req.body.username, password });
}

/**
 * Reset the password of a given user
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {Promise} the promise of a resetted password
 */
async function resetPassword(req, res) {
  const db = await database();

  // TODO generate a temporary authentication token with a short lifetime

  // set a flag to create a new password
  await db.collection('users').update({ username: req.body.username }, { renew: true });
  return true;
}

/**
 * Validate a send token and append the token data
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {Promise} the promise of a validated token
 */
async function validateToken(req, res) {
  const receivedToken = req.headers.bearer;
  if (!receivedToken) { return true; }
  try {
    const db = await database();
    const token = await db.collection('tokens').find({ type: 'access_token', token: receivedToken });
  } catch (err) {
    // TODO if token not found throw error
  }
  // TODO check expiration

  req.user = token.data;

  // set the cache control header to private
  res.setHeader('cache-control', 'private');
  return true;
}

gateway.register('router:before', validateToken);
gateway.register('oauth2.token:create', token);

database();
