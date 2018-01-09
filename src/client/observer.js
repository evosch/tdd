import { SCOPE } from '.';
import { copy } from './helpers';

/**
 * initialize the observers
 * @param {HTMLElement} target the rootElement
 * @returns {void}
 */
export function startObserver(target) {
  this.observers = [];
  setObserver.call(this, target);
}

/**
 * attach the current node to all new observers
 * @returns {void}
 */
export function observerAttachNode() {
  const unboundObservers = this.observers.slice(this.observerLastEnd);
  unboundObservers.forEach((observer) => {
    observer.node = this.observableNode;
  });
}

/**
 * Set the current observer state
 * @param {HTMLElement} target the current rendered HTMLElement
 * @returns {void}
 */
export function setObserver(target) {
  this.observableNode = target;
  this.observerLastEnd = this.observers.length;
}

/**
 * Remove all unused observers
 * @returns {void}
 */
export function cleanup() {
  this.observers = this.observers.filter(observer => this.rootElement.contains(observer.node));
}

/**
 * Monitor a store path for changes
 * @param {string} path the path to monitor
 * @param {object} structure the object to render
 * @returns {void}
 */
export function watch(path, structure) {
  // create a copy of the context object
  const context = copy(this.context); // Object.assign({}, this.context);
  const realPath = resolvePath.call(this, path);
  if (this.observerParentStructure) {
    const parentStructure = Object.assign({}, this.observerParentStructure);
    this.observers.push({ watch: realPath, structure: parentStructure, node: this.observableNode, context });
  } else {
    this.observers.push({ watch: realPath, structure, node: this.observableNode, context });
  }
}

function resolvePath(path) {
  const scopedKeys = Object.keys(this.context[SCOPE]);
  const relPath = path.split('/');
  const firstBranch = relPath.shift();
  if (scopedKeys.indexOf(firstBranch) !== -1) {
    return this.context[SCOPE][firstBranch] + '/' + relPath.join('/');
  }
  return path;
}