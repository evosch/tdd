import renderer from '../renderer';

/**
 * Validate a condition
 * @param {object} condition the structure to validate
 * @returns {boolean} wether it's valid or not
 */
function validateCondition(condition) {
  switch (condition[1]) {
    case '===':
      return condition[0] === condition[1];
    default:
      console.warn(`unsupported operator ${condition[1]}`);
  }
  return null;
}

/**
 * the Condition object
 * @param {object} structure the structure
 * @returns {null|HTMLElement} the dom result
 */
export default function Condition(structure) {
  const valid = validateCondition(structure.condition);

  if (valid && structure.valid) {
    return renderer(structure.valid);
  }
  if (!valid && structure.invalid) {
    return renderer(structure.invalid);
  }
  return null;
}
