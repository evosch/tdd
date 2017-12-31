'use strict';

var validation = {
  alternateName: 'undefined',
  input: 'required'
};

function autoAlternateName(request) {
  if (typeof request.input.alternateName === 'undefined' && request.input.name) {
    // TODO turn é into e etc..
    request.input.alternateName = request.input.name.replace(' ', '-');
  }
}
//# sourceMappingURL=thing-auto-alternate-name.js.map