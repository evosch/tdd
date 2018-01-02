import renderer, { renderConnectedAttribute } from '../renderer';

/**
 * Validate a condition
 * @param {object} condition the structure to validate
 * @returns {boolean} wether it's valid or not
 */
function validateCondition(arg1, operator, arg2) {
  switch (operator) {
    case '===':
      return arg1 === arg2;
    case 'null':
      return arg1 === null;
    default:
      console.warn(`unsupported operator ${operator}`);
  }
  return null;
}

/**
 * the Condition object
 * @param {object} structure the structure
 * @returns {null|HTMLElement} the dom result
 */
export default function Condition(structure) {
  structure.arg1 = renderConnectedAttribute.call(this, structure.data, structure);

  const valid = validateCondition(structure.arg1, structure.operator, structure.arg2);

  if (valid && structure.valid) {
    return renderer.call(this, structure.valid);
  }
  if (!valid && structure.invalid) {
    return renderer.call(this, structure.invalid);
  }
  return null;
}
