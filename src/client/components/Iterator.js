import renderer, { renderConnectedAttribute, RENDER_ALLOW_ARRAY, RENDER_FAIL_ON_UNDEFINED } from '../renderer';
import { SCOPE } from '..';

const ITERATOR = '::iterator';

/**
 * The Iterator object
 * @param {object} structure the structure object
 * @returns {DocumentFragment} fragment
 */
export default function Iterator(structure) {
  const iteratorName = structure.name;
  const fragment = document.createDocumentFragment();
  let data = [];

  try {
    data = renderConnectedAttribute.call(this, structure.data, structure, RENDER_ALLOW_ARRAY | RENDER_FAIL_ON_UNDEFINED);
  } catch (err) {
    return null;
  }

  if (!this.store[ITERATOR]) { this.store[ITERATOR] = {}; }

  // copy data to the store
  this.store[ITERATOR][iteratorName] = data;
  const rootNode = this.observableNode;

  data.forEach((item, index) => {
    this.observableNode = rootNode;
    this.context[SCOPE][iteratorName] = `${ITERATOR}/${iteratorName}/${index}`;
    this.store[iteratorName] = item;
    const itemContent = renderer.call(this, structure.children);
    if (itemContent !== null) {
      fragment.appendChild(itemContent);
    }
    // prevent any created observers to be overwritten (TODO check how it is possible)
    this.observerLastEnd = this.observers.length;
  });
  this.store[iteratorName] = null;
  return fragment;
}
