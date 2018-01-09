import { get, set } from '../helpers';
import { renderAttribute } from '../renderer';
import { SCOPE } from '..';

export const FETCH_STATE = '::fetch';

/**
 * Store the received data in the state
 * @param {string} url the requested url
 * @param {object} structure the structure
 * @param {any} data the responsed data
 * @returns {void}
 */
function setFetchState(url, structure, data) {
  const state = {};
  state[`${FETCH_STATE}/${url}`] = false;
  state[url] = data;
  if (structure.to) {
    this.context[SCOPE][structure.to] = url;
    state[structure.to] = data;
  }
  this.setState(state);
}

function addQueryString(baseUrl, data) {
  if (!data) { return baseUrl; }
  params = toQueryString(data);
  if (baseUrl.indexOf('?') === -1) {
    return `${baseUrl}?${params.toString()}`;
  }
  return `${baseUrl}&${params.toString()}`;
}


/**
 * Covert an object into a querystring
 * @param {object} data the object to add
 * @returns {string} the combined url
 */
function toQueryString(data) {
  const params = new window.URLSearchParams();

  // iterate over all the object keys
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      // if it's an array we add all the index seperate
      data[key].forEach((value) => {
        params.append(key, value);
      });
    }
    // if it's not an array we just add the key
    params.append(key, data[key]);
  });

  return params;
}

const headers = new Headers();

/**
 * set the fetch event global headers
 * @param {string} name the header name
 * @param {string} value the header value
 * @returns {void}
 */
export function setFetchHeader(name, value) {
  headers.append(name, value);
}

/**
 * fetch event to get remove data
 * @param {object} structure the event structure
 * @returns {void}
 */
export default function fetch(structure) {
  // resolve the url, so we allow it to have placeholders in it
  let url = renderAttribute.call(this, structure.url);

  // check if the data is already in memory
  const storedResponse = get(this.store, url);
  // loading
  const state = get(this.store, `${FETCH_STATE}/${url}`);

  if (!storedResponse && !state) {
    // set the store directly to prevent it from firing twice
    set(this.store, `${FETCH_STATE}/${url}`, true);

    // set the state for any listeners (is a bit double)
    this.setState(`${FETCH_STATE}/${url}`, true);

    const fetchOptions = { method: (structure.method || 'GET').toUpperCase(), headers };
    if (['POST', 'PUT'].indexOf(fetchOptions.method) !== -1) {
      fetchOptions.body = toQueryString(structure.data);
    } else {
      url = addQueryString(url, structure.data);
    }

    window.fetch(url, fetchOptions).then((response) => {
      if (response.status !== 200) {
        return Promise.reject();
      }
      return response.json();
    }).then((data) => {
      this.observerParentStructure = null; // weird behavior
      setFetchState.call(this, url, structure, data);
    });
  }
}
