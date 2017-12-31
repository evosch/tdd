import fetch from '../events/fetch';
import renderer, { renderConnectedAttribute, RENDER_FAIL_ON_UNDEFINED } from '../renderer';
import { get } from '../helpers';
import { watch } from '../observer';

/**
 * Reference an other file
 * @param {object} structure the partial structure
 * @returns {null|HTMLElement} the result
 */
export default function Partial(structure) {
  let ref;
  try {
    ref = renderConnectedAttribute.call(this, structure.ref, structure, RENDER_FAIL_ON_UNDEFINED);
  } catch (err) {
    return null;
  }

  // check if the partial is already in memory, if so render it, if not fetch it
  const response = get(this.store, ref);

  // add an observer to get notified when the ref is changed so we can re-render
  watch.call(this, ref, structure);

  if (response) {
    return renderer.call(this, response);
  } else if (!response) {
    fetch.call(this, { url: ref });
  }
  // it it's being loaded or there is no data, return nothing
  return null;
}
