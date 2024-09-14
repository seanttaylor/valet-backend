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
 * @typedef {object} IIntentSpecification
 * @property {IntentMessageContext} context
 * @property {String} domain
 * @property {String} reply_id
 */

/**
 * @type {IIntentSpecification}
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
