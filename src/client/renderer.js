import { startsWithCapital, isPrimitive } from './helpers';
import { observerAttachNode, setObserver } from './observer';
import { executeEvent } from './event';

const IGNORE_PROPERTIES = ['nodeName', 'children'];

/**
 * Returns the numer of elements inside this object
 * @param {null|DocumentFragment|HTMLElement} object the object to count
 * @returns {int} the number of elements inside this object
 */
function length(object) {
  if (object === null) { return 0; }
  if (object instanceof DocumentFragment) { return object.childElementCount; }
  return 1;
}

export const RENDER_FAIL_ON_UNDEFINED = 1;
export const RENDER_AS_ATTRIBUTE = 2;
export const RENDER_PARENT_STRUCTURE = 4;
export const RENDER_ALLOW_ARRAY = 8;

/**
 * Render one of the existing components
 * @param {object} structure the component structure
 * @param {boolean} flags return the raw value or an HTMLElement
 * @returns {null|HTMLElement} the rendered component
 */
function renderComponent(structure, flags) {
  if (structure.onload) {
    executeEvent.call(this, structure.onload);
  }
  const componentStructure = this.components[structure.nodeName].call(this, structure);
  if (flags & RENDER_AS_ATTRIBUTE) {
    return renderAttribute.call(this, componentStructure, flags);
  }
  return render.call(this, componentStructure);
}

/**
 * Render an attributes value but any observer will update the whole component
 * @param {*} structure the structure to render
 * @param {*} parentStructure the structure to render on update (the parent)
 * @param {*} flags any flags
 * @returns {any} the result of the render call
 */
export function renderConnectedAttribute(structure, parentStructure, flags) {
  let freshObserver = false;
  if (!this.observerParentStructure) {
    this.observerParentStructure = parentStructure;
    freshObserver = true;
  }
  const value = renderAttribute.call(this, structure, flags);
  if (freshObserver) {
    this.observerParentStructure = null;
  }
  return value;
}

/**
 * Turns a structure into a Attribute Value
 * @param {object} structure the attribute value
 * @param {int} flags flags
 * @returns {any} the attribute value
 */
export function renderAttribute(structure, flags) {
  if (typeof structure === 'undefined') {
    if (flags & RENDER_FAIL_ON_UNDEFINED) {
      throw 'Attribute value not set';
    }
    return null;
  }
  if (Array.isArray(structure)) {
    const attr = structure.map(item => renderAttribute.call(this, item, flags));
    if (flags & RENDER_ALLOW_ARRAY){
      return attr;
    }
    return attr.join('');
  }
  if (startsWithCapital(structure.nodeName)) {
    return renderComponent.call(this, structure, flags | RENDER_AS_ATTRIBUTE);
  }
  if (isPrimitive(structure)) {
    return structure;
  }
  return null;
}

/**
 * Turns an html-structure into a HTMLElement
 * @param {object} structure the structure
 * @param {HTMLElement} node dom node
 * @returns {null|HTMLElement} the HTMLElement
 */
function renderHtml(structure) {
  // since we're creating a new html node, all observers can be added to the previous node
  observerAttachNode.call(this);

  const node = document.createElement(structure.nodeName);
  // set the new observable node
  setObserver.call(this, node);

  Object.keys(structure).forEach((property) => {
    if (IGNORE_PROPERTIES.indexOf(property) !== -1) { return; }
    if (property.startsWith('on')) {
      node.addEventListener(property.substr(2), (nativeEvent) => {
        structure[property].forEach((event) => {
          executeEvent.call(this, event, nativeEvent);
        });
      });
    }
    const attributeValue = renderAttribute.call(this, structure[property]);
    if (attributeValue) {
      node.setAttribute(property, attributeValue);
    }
  });

  if (Array.isArray(structure.children)) {
    let cursorPosition = 0;
    const rootNode = this.observableNode;
    structure.children.forEach((childStructure) => {
      this.observableNode = rootNode;
      const childRendered = render.call(this, childStructure);
      if (!isPrimitive(childStructure)) {
        childStructure.cursorStart = cursorPosition;
        childStructure.cursorLength = length(childRendered);
        cursorPosition = childStructure.cursorStart + childStructure.cursorLength;
        childStructure.cursorEnd = cursorPosition;
      }
      if (childRendered !== null) {
        node.appendChild(childRendered);
      }
    });
  }

  return node;
}

/**
 * Render an array
 * @param {array} structure the array to render
 * @returns {HTMLElement} a fragment containing all elements
 */
function renderArray(structure) {
  const fragment = document.createDocumentFragment();
  const currentNode = this.observableNode;
  structure.forEach((item) => {
    const renderedItem = render.call(this, item);
    if (renderedItem !== null) {
      fragment.appendChild(renderedItem);
    }
  });
  this.observableNode = currentNode;
  return fragment;
}

/**
 * Turns a structure into a DOM Object
 * @param {object} structure the structure to render
 * @returns {null|HTMLElement} the rendered structure
 */
export default function render(structure) {
  switch (true) {
    case structure === null:
      return null;
    case structure instanceof DocumentFragment:
      return structure;
    case Array.isArray(structure):
      return renderArray.call(this, structure);
    case isPrimitive(structure):
      return document.createTextNode(structure !== null ? structure : '');
    case startsWithCapital(structure.nodeName): // is a component
      return renderComponent.call(this, structure);
    default:
      return renderHtml.call(this, structure);
  }
}
