import { setFetchHeader } from './fetch';
import { get } from '../helpers';

const OAUTH_STATE = 'oauth2/token';

/**
 * Add the Bearer header to every request if a token is present
 * @returns {void}
 */
export default function oauth() {
  // let's see if it stored in the state
  let token;
  const response = get(this.store, OAUTH_STATE);
  if (response) {
    token = response.token;
    window.localStorage.setItem('token', token);
  } else {
    // check if there's a token in the storage
    token = window.localStorage.getItem('token');
  }
  if (token) {
    setFetchHeader('Bearer', token);
  }
}
