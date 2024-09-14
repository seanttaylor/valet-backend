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

/**
 * @typedef {object} Core
 * @property {function(): string} generateUUID - generatea a v4 UUID
 * @property {function(): string} generateId - generates a unique Id
 * @property {Logger} logger
 */

/**
 * @typedef {object} Logger
 * @property {function(): LoggerInstance} getLoggerInstance - returns a logger
 */

/**
 * @typedef {object} LoggerInstance
 * @property {function(): string} log
 * @property {function(): string} info
 * @property {function(): string} error
 */

/**
 * @typedef {object} Sandbox
 * @property {Object.<string, Object>} my - a namespace for custom user-defined functionalities
 * @property {Core} core - the core functionalities of the sandbox environment
 * @property {function(EventType, EventListener): void} addEventListener - method to add an event listener, bound to the context of the original object
 * @property {function(EventType, EventListener): void} removeEventListener - method to remove an event listener, bound to the context of the original object
 * @property {function(Event): boolean} dispatchEvent - method to dispatch an event, bound to the context of the original object
 */

/**
 * @type {Sandbox}
 * @description - A sandbox environment object which encapsulates the core functionalities along with event handling methods
 */
export const ISandbox = Object.freeze({
  my: {},
  core: {},
});

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
 * @description a configuration object containing user and location data pertinent to the request
 */
export const IIntentMessageContext = Object.freeze({});

/**
 * @typedef {object} IntentSpecification
 * @property {IntentMessageContext} context
 * @property {String} domain
 * @property {String} reply_id
 */

/**
 * @type {IntentSpecification}
 * @description a configuration object containing all data related to a specified request
 */
export const IIntentSpecification = Object.freeze({});

/**
 * @typedef {object} UseCaseStrategy
 * @property {function(): object } execute
 */

/**
 * @type {UseCaseStrategy}
 * @description a means of satisfying a specific use case
 */
export const IUseCaseStrategy = Object.freeze({});

/**
 * @typedef {Object} StrategyService
 * @property {function(string): Promise<Strategy>} getStrategyByDomain - Method to retrieve a strategy based on domain.
 */

/**
 * @type {StrategyService}
 * @description manages strategies for different domain use cases
 */
export const IStrategyService = Object.freeze({});

/**
 * @typedef {Object} UseCaseService
 * @property {function(string): Promise<Function[]>} getUseCaseByDomain - Method to retrieve use case constructors based on domain.
 */

/**
 * @type {UseCaseService}
 * @description - manages application domain use cases
 */
export const IUseCaseService = Object.freeze({});

/**
 * @typedef {object} DataAccessLayer
 * @property {function(): object} getDbClient - fetches a client for data access
 */

/**
 * @type {DataAccessLayer}
 * @description - API for all data access regardless of implementation
 */
export const IDataAccessLayer = Object.freeze({});

/**
 * @typedef {object} GeoLocation
 * @property {function(): Promise<object>} getCoordinatesFromAddress - returns latitude and longitude for a plain text address
 */

/**
 * @type {GeoLocation}
 * @description - API for all data access regardless of implementation
 */
export const IGeoLocation = Object.freeze({});


// Google Maps Geocode Request Response

/**
 * @typedef {Object} AddressComponent
 * @property {string} long_name - The full text description or name of the address component.
 * @property {string} short_name - An abbreviated textual name for the address component.
 * @property {string[]} types - An array indicating the type of the address component.
 */

/**
 * @typedef {Object} Location
 * @property {number} lat - Latitude of the location.
 * @property {number} lng - Longitude of the location.
 */

/**
 * @typedef {Object} Viewport
 * @property {Location} northeast - The northeast corner of the viewport bounding box.
 * @property {Location} southwest - The southwest corner of the viewport bounding box.
 */

/**
 * @typedef {Object} Geometry
 * @property {Location} location - The geocoded latitude and longitude value.
 * @property {string} location_type - Location type returned by the Geocoder.
 * @property {Viewport} viewport - The recommended viewport for displaying the returned result.
 */

/**
 * @typedef {Object} PlusCode
 * @property {string} compound_code - A short code representing a location within a city.
 * @property {string} global_code - A code representing a location anywhere on the globe.
 */

/**
 * @typedef {Object} Result
 * @property {AddressComponent[]} address_components - An array of objects containing address component information.
 * @property {string} formatted_address - The human-readable address of this location.
 * @property {Geometry} geometry - More detailed information about the location's geometry.
 * @property {string} place_id - A unique identifier for this place.
 * @property {PlusCode} plus_code - An encoded location reference, derived from latitude and longitude.
 * @property {string[]} types - An array indicating the type of the address component.
 */

/**
 * @typedef {Object} GeoCodeResponse
 * @property {Result[]} results - An array containing the geocoding results.
 * @property {string} status - The status of the geocode request.
 */

/**
 * @type {GeoCodeResponse}
 * @description - API for all data access regardless of implementation
 */
export const IGeoCodeResponse = Object.freeze({});