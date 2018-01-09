import { get } from '../helpers';
import { watch } from '../observer';
import transformers from '../transformers';
import { renderConnectedAttribute, RENDER_FAIL_ON_UNDEFINED } from '../renderer';

/**
 * Fetch the value from a placeholder
 * @param {object} structure the structure to render
 * @returns {any} the value of the placeholder
 */
export default function Placeholder(structure) {
  let value;
  let ref;
  try {
    ref = renderConnectedAttribute.call(this, structure.ref, structure, RENDER_FAIL_ON_UNDEFINED);
  } catch (err) {
    return null;
  }

  value = get(this.store, ref);
  watch.call(this, ref, structure);

  if (structure.transform) {
    value = transformers[structure.transform](value, structure);
  }
  return value;
}
