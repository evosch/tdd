/**
 * Run the event
 * @param {*} structure the event structure
 * @param {*} nativeEvent the native event object
 * @returns {void}
 */
export function executeEvent(structure, nativeEvent) {
  this.events[structure.nodeName].call(this, structure, nativeEvent);
}
