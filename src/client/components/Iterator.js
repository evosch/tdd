import renderer, { renderConnectedAttribute, RENDER_ALLOW_ARRAY, RENDER_FAIL_ON_UNDEFINED } from '../renderer';

/**
 * The Iterator object
 * @param {object} structure the structure object
 * @returns {DocumentFragment} fragment
 */
export default function Iterator(structure) {
  const iteratorName = structure.name;
  const fragment = document.createDocumentFragment();

  try {
    structure.data = renderConnectedAttribute.call(this, structure.data, structure, RENDER_ALLOW_ARRAY | RENDER_FAIL_ON_UNDEFINED);
  } catch (err) {
    return null;
  }

  structure.data.forEach((item, index) => {
    this.context[iteratorName] = index;
    const itemContent = renderer.call(this, structure.children);
    if (itemContent !== null) {
      fragment.appendChild(itemContent);
    }
  });
  return fragment;
}
