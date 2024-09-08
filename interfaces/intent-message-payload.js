/**
 * @typedef {object} Location
 * @property {string} address
 * @property {boolean} bookmarked
 * @property {string} lat
 * @property {boolean} lng
 */

/**
 * @typedef {object} User
 * @property {string} displayName
 * @property {string} id
 */

/**
 * @typedef {object} ContextLocation
 * @property {Location} current
 * @property {Location} destination
 */

/**
 * @typedef {object} IntentMessageContext
 * @property {ContextLocation} location
 * @property {User} user
 */

/**
 * @type {IntentMessageContext}
 */
export const IIntentMessageContext = Object.freeze({});