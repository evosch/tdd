import renderer from './renderer';
import BASE_COMPONENTS from './components';
import BASE_EVENTS from './events';
import { startObserver, observerAttachNode, cleanup } from './observer';
import { set, get, cloneObject, emptyObject } from './helpers';

export const SCOPE = '::scope';
/**
 * The generic app class
 */
class App {
  /**
   * The app constructor
   * @param {HTMLElement} target the dom node to base it on
   * @param {string} ref the view to load
   */
  constructor(target, ref) {
    this.rootElement = target;
    this.store = {
      url: window.location,
    };
    this.components = BASE_COMPONENTS;
    this.events = BASE_EVENTS;
    this.rendering = false;
    this.futureState = {};
    
    this.context = {};
    this.context[SCOPE] = {};

    startObserver.call(this, target);

    renderer.call(this, {
      nodeName: 'Partial',
      ref,
      cursorStart: 0,
      cursorEnd: 0,
      cursorLength: 0,
    });

    observerAttachNode.call(this);
  }

  /**
   * A static method to boot an app {@link App#constructor}
   * @param {HTMLElement} target targ
   * @param {string} ref the view to load
   * @returns {App} the app
   */
  static boot(target, ref) {
    return new App(target, ref);
  }

  /**
 * set the new state and trigger a re-render
 * @param {object} newState the new state
 * @param {any} value optional value
 * @returns {void}
 */
  setState(newState, value) {
    // convert a key value pair into an object
    if (typeof newState === 'string') {
      const convState = {};
      convState[newState] = value;
      newState = convState;
    }

    const paths = Object.keys(newState);
    if (this.rendering) {
      paths.forEach((path) => {
        this.futureState[path] = newState[path];
      });
      return;
    }

    this.rendering = true;

    // update the store with the new data
    paths.forEach((path) => {
      set(this.store, path, newState[path]);
    });

    // check if any of the observers start with this path
    const activeObservers = this.observers.filter(observer =>
      paths.find(path => observer.watch.startsWith(path)),
    );

    // only perform actions on the topNodes
    const reducedActiveObservers = activeObservers;

    // perform the render action on these nodes
    reducedActiveObservers.forEach((observer) => {
      this.context = observer.context;
      // re-move scope
      Object.keys(this.context[SCOPE]).forEach((key) => {
        const path = this.context[SCOPE][key];
        this.store[key] = get(this.store, path);
      });

      this.observableNode = observer.node;
      // create a copy of the cursor so we know where the old node was
      const cursorStart = observer.structure.cursorStart;
      const cursorEnd = observer.structure.cursorEnd;
      const rendered = renderer.call(this, observer.structure);
      // remove if anything is rendered
      for (let i = cursorEnd; i > cursorStart; i--) {
        const child = observer.node.children[i];
        observer.node.removeChild(child);
      }
      // add the new data if any
      if (rendered !== null) {
        observer.node.appendChild(rendered);
      }

      // remove the observer because it will have be added again
      const observerIndex = this.observers.indexOf(observer);
      this.observers.splice(observerIndex, 1);
    });

    // remove all un-attached observers
    cleanup.call(this);

    this.rendering = false;
    if (!emptyObject(this.futureState)) {
      const stateClone = cloneObject(this.futureState);
      this.futureState = {};
      this.setState(stateClone);
    }
  }
}

const target = document.querySelector('body');
App.boot(target, 'views/application.json');
