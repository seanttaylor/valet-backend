/******** EVENT IDENTIFIERS ********/
/**
 * @readonly
 * @enum {string}
 */
export const Events = Object.freeze({
    EXECUTION_COMPLETED: 'evt.use_cases.strategy_execution_completed',
    EXECUTION_STARTED: 'evt.use_cases.strategy_execution_started',
});

/**
 * @typedef {Object} IEventEmitter
 * @property {Function} once - Registers an event to be handled exactly once.
 * @property {Function} on - Registers an event listener with the system.
 * @property {Function} emit - Emits a registered event to all listeners.
 */

/**
 * @type {IEventEmitter}
 */
export const IEventEmitter = Object.freeze({});
