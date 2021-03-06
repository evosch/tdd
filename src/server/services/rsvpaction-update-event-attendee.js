/**
 * update the Event Attendees when a RsvpAction is received
 * @param {HttpClientRequest} request the http request object
 * @param {*} response the response object
 * @returns {void}
 */
function updateAttendeeOnRsvpAction(request, response) {
  if (!request.input._type === 'RsvpAction') { return; }

  const eventId = request.input.event;
  const user = request.input.user;

  // TODO check if this user has RsvpAction access
  const event = gateway.call('document:read', {_id: eventId});

  // we only add the attendees to the Event
  if (request.input.rsvpResponse === 'Yes') {
    // if no there add it
    gateway.call('document:update', { _id: event, $addToSet: { attenddee: user }});
  } else {
    // if there remove it
    gateway.call('document:update', { _id: event, $pull: { attenddee: user }});
  }
}

gateway.register('update-attendee-on-rsvp-action', updateAttendeeOnRsvpAction);