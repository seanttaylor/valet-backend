/**
 * Configuration for specified location information received from the client
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
 * Used for requests that required location information from the client
 * @typedef {object} ContextLocation
 * @property {Location} current
 * @property {Location} destination
 */

/**
 * Metadata included with incoming requests to the agent backend; information
 * may or may not be used in every request
 * @typedef {object} IntentMessageContext
 * @property {ContextLocation} location
 * @property {User} user
 */

/**
 * @type {IntentMessageContext}
 */
export const IIntentMessageContext = Object.freeze({});