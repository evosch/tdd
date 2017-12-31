import fetch from './fetch';

/**
 * Turns a DOM Form Element into an object containing all information stored within the form
 * @param {FormElement} form the DOM Form element
 * @returns {object} the data
 */
function formToObject(form) {
  const formData = {};
  [].forEach.call(form.elements, (element) => {
    // Don't process elements without a name
    if (!element.name) { return; }

    // Don't process unchecked radios and checkboxes
    if (element.nodeName === 'INPUT' && ['radio', 'checkbox'].indexOf(element.type) !== -1 && element.checked === false) { return; }

    // Make checkboxes work
    if (element.nodeName === 'INPUT' && element.type === 'checkbox') {
      if (!Array.isArray(formData[element.name])) {
        formData[element.name] = [];
      }
      formData[element.name].push(element.value);
    } else {
      formData[element.name] = element.value;
    }

    // TODO select[multiselect]
  });
  return formData;
}

/**
 * Call a resource in using form input
 * @param {object} structure the structure to base the request on
 * @param {object} value the original event
 * @returns {void}
 */
export default function ajax(structure, value) {
  value.preventDefault();

  const form = value.target.nodeName === 'FORM' ? value.target : value.target.form;
  const fetchParams = {
    url: form.action,
    method: form.method || 'get',
    data: formToObject(form),
  };

  if (form.name) {
    fetchParams.to = form.name;
  }

  fetch.call(this, fetchParams, value);
}
