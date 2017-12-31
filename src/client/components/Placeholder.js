import { get } from '../helpers';
import { watch } from '../observer';
import transformers from '../transformers';

/**
 * Fetch the value from a placeholder
 * @param {object} structure the structure to render
 * @returns {any} the value of the placeholder
 */
export default function Placeholder(structure) {
  let value;
  if (structure.ref.startsWith('$')) {
    value = this.context[structure.ref.slice(1)];
  } else {
    value = get(this.store, structure.ref);
    watch.call(this, structure.ref, structure);
  }
  if (structure.transform) {
    value = transformers[structure.transform](value, structure);
  }
  return value;
}
