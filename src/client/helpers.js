/**
 * check if the string starts with a capital
 * @param {string} string the string to check
 * @returns {boolean} if this string starts with a capital
 */
export function startsWithCapital(string) {
  return /^[A-Z]/.test(string);
}

/**
 * Check if the structure is a primitive (int,string,bool)
 * @param {object} structure the argument to check
 * @returns {boolean} if this structure is a primitive
 */
export function isPrimitive(structure) {
  const type = typeof structure;
  return structure === null || (type !== 'object' && type !== 'function');
}

/**
 * Turn a path into pathArray
 * @param {string|array} path path representation
 * @returns {array} the path
 */
export function toPath(path) {
  if (Array.isArray(path)) { return path; }
  return path.split('/');
}

/**
 * Resolve a value from an object
 * @param {object} object the object to search in
 * @param {string|array} path path to resolve
 * @returns {any} resolved value
 */
export function get(object, path) {
  const pc = toPath(path);
  let r = object;
  for (let i = 0; i < pc.length; i++) {
    if (typeof r[pc[i]] === 'undefined' || r[pc[i]] === null) { return undefined; }
    r = r[pc[i]];
  }
  return r;
}

/**
 * Set a value in an object
 * @param {object} object the object to store in
 * @param {string|array} path  path to store at
 * @param {any} value stored value
 * @returns {object} the object with the stored value
 */
export function set(object, path, value) {
  if (path === null) {
    return merge(object, value);
  }
  const pc = toPath(path);
  let r = object;
  for (let i = 0; i < pc.length - 1; i++) {
    if (typeof r[pc[i]] === 'undefined') { r[pc[i]] = {}; }
    r = r[pc[i]];
  }
  r[pc[pc.length - 1]] = merge(r[pc[pc.length - 1]], value);
  return object;
}

/**
 * Deep Merge two objects
 * @param {*} origin the object to add to
 * @param {*} extra the object to add
 * @returns {object} the merged object
 */
export function merge(origin, extra) {
  if (typeof origin !== typeof extra || origin == null) {
    return extra;
  }

  // if the types don't match return the type of extra
  if (Array.isArray(extra) && !Array.isArray(origin)) {
    origin = [];
  }
  if (!Array.isArray(extra) && Array.isArray(origin)) {
    origin = {};
  }


  Object.keys(extra).forEach((key) => {
    if (typeof origin[key] !== 'object') {
      origin[key] = extra[key];
    } else if (typeof extra[key] === 'object') {
      origin[key] = merge(origin[key], extra[key]);
    } else {
      origin[key] = extra[key];
    }
  });
  return origin;
}

export function cloneObject(obj) {
  return merge({}, obj);
}

export function emptyObject(obj) {
  return Object.keys(obj).length === 0;
}