'use strict';

/**
 * all the memberships of this user
 * @param {object} user the Person or Organization object
 * @returns {array} the list organizations
 */
var memberOf = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
    var db, memberships, organizations;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return database();

          case 2:
            db = _context.sent;
            memberships = [];

            if (!(user.memberOf && user.memberOf.length > 0)) {
              _context.next = 9;
              break;
            }

            _context.next = 7;
            return db.collection('documents').find({ alternateName: { $in: user.memberOf } }).toArray();

          case 7:
            organizations = _context.sent;

            console.log(organizations);

          case 9:
            return _context.abrupt('return', memberships);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function memberOf(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * The Oauth2 password grant procedure
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {Promise} the of a grant
 */


var passwordGrant = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var db, user, isValid, person, policy, accessToken, expiresIn;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return database();

          case 2:
            db = _context2.sent;
            _context2.next = 5;
            return db.collection('users').findOne({ username: req.body.username });

          case 5:
            user = _context2.sent;

            if (user) {
              _context2.next = 8;
              break;
            }

            throw 'user password combination not found';

          case 8:
            _context2.next = 10;
            return argon2.verify(user.password, req.body.password);

          case 10:
            isValid = _context2.sent;

            if (isValid) {
              _context2.next = 13;
              break;
            }

            throw 'invalid password';

          case 13:
            _context2.next = 15;
            return db.collection('documents').find({ alternateName: user.name });

          case 15:
            person = _context2.sent;
            _context2.next = 18;
            return memberOf(person);

          case 18:
            policy = _context2.sent;
            _context2.next = 21;
            return generateToken(48);

          case 21:
            accessToken = _context2.sent;
            expiresIn = 3600;

            // store the tokens

            _context2.next = 25;
            return db.collection('tokens').insert({ type: 'access_token', token: accessToken, policy: policy });

          case 25:

            // todo generate an access token / refresh token
            res.write(JSON.stringify({
              access_token: accessToken,
              token_type: 'Bearer',
              expires_in: expiresIn
            }));
            res.end();
            return _context2.abrupt('return', true);

          case 28:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function passwordGrant(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Oauth2 token service
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {Promise} the promise of a token
 */


var token = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = req.body.grant_type;
            _context3.next = _context3.t0 === 'password' ? 3 : 4;
            break;

          case 3:
            return _context3.abrupt('return', passwordGrant(req, res));

          case 4:
            throw 'grant_type not allowed';

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function token(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Register a new user
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {Promise} the promise of a registered user
 */


var register = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var db, password;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            db = database();
            _context4.next = 3;
            return argon2.hash(req.body.password);

          case 3:
            password = _context4.sent;
            _context4.next = 6;
            return db.collection('users').insert({ document_id: document_id, username: req.body.username, password: password });

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function register(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * Reset the password of a given user
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {Promise} the promise of a resetted password
 */


var resetPassword = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var db;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return database();

          case 2:
            db = _context5.sent;
            _context5.next = 5;
            return db.collection('users').update({ username: req.body.username }, { renew: true });

          case 5:
            return _context5.abrupt('return', true);

          case 6:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function resetPassword(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * Validate a send token and append the token data
 * @param {*} req the request object
 * @param {*} res the response object
 * @returns {Promise} the promise of a validated token
 */


var validateToken = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var receivedToken, db, _token;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            receivedToken = req.headers.bearer;

            if (receivedToken) {
              _context6.next = 3;
              break;
            }

            return _context6.abrupt('return', true);

          case 3:
            _context6.prev = 3;
            _context6.next = 6;
            return database();

          case 6:
            db = _context6.sent;
            _context6.next = 9;
            return db.collection('tokens').find({ type: 'access_token', token: receivedToken });

          case 9:
            _token = _context6.sent;
            _context6.next = 14;
            break;

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6['catch'](3);

          case 14:
            // TODO check expiration

            req.user = token.data;

            // set the cache control header to private
            res.setHeader('cache-control', 'private');
            return _context6.abrupt('return', true);

          case 17:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[3, 12]]);
  }));

  return function validateToken(_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}();

var _crypto = require('crypto');

var _argon = require('argon2');

var argon2 = _interopRequireWildcard(_argon);

var _mongodb = require('mongodb');

var _gateway = require('../gateway');

var _gateway2 = _interopRequireDefault(_gateway);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mongoConnection = void 0;
var MONGO_URL = 'mongodb://localhost:27017/tdd2';

/**
 * @returns {Promise} the promise of a database connection
 */
function database() {
  if (mongoConnection) {
    return Promise.resolve(mongoConnection);
  }
  return _mongodb.MongoClient.connect(MONGO_URL).then(function (connection) {
    mongoConnection = connection;
    return Promise.resolve(mongoConnection);
  });
}

/**
 * Generate a token
 * @param {*} size the length of the token
 * @returns {Promise} the promise of the token
 */
function generateToken(size) {
  return new Promise(function (resolve, reject) {
    (0, _crypto.randomBytes)(size, function (err, buffer) {
      if (err) {
        return reject(err);
      }
      return resolve(buffer.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_'));
    });
  });
}

_gateway2.default.register('router:before', validateToken);
_gateway2.default.register('oauth2.token:create', token);

database();
//# sourceMappingURL=oauth2.js.map