/**
 * Store a component in memory for later use
 * @param {object} structure the components structure
 * @returns {void}
 */
export default function Component(structure) {
  if (!Array.isArray(this.components)) {
    this.components = {};
  }
  this.components[structure.name] = structure.children;
  return null;
}
