/**
 * @typedef {object} IEventHeader
 * @property {object} meta - metadata associated with the event
 * @property {object} meta._open - unstructured data that can arbitrarily be packaged with event;
 * this field should be considered **VOLATILE** and may or **MAY NOT** be present on any or all events
 * @property {string} id - unique identifier for the event
 * @property {string} name - name of the event
 * @property {string} timestamp - timestamp when the event was generated
 */

/**
 * @template T
 * @typedef {object} IEvent
 * @property {IEventHeader} header - header information of the event
 * @property {T} payload - payload of the event
 */

/**
 * @type {IEvent}
 */
export const IEvent = Object.freeze({});
