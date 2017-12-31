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
  const context = Object.assign({}, this.context);
  if (this.observerParentStructure) {
    const parentStructure = Object.assign({}, this.observerParentStructure);
    this.observers.push({ watch: path, structure: parentStructure, node: this.observableNode, context });
  } else {
    this.observers.push({ watch: path, structure, node: this.observableNode, context });
  }
}
