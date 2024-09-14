import id from 'firebase-auto-ids';

class MyCustomEvent {
  /**
   * @param {String} type
   * @param {Object.<string, Object>} eventInitDict
   */
  constructor(type, eventInitDict = {}) {
    this.type = type;
    this.detail = eventInitDict.detail || null;
  }
}

/******** EVENT IDENTIFIERS ********/
/**
 * @readonly
 * @enum {string}
 */
export const Events = Object.freeze({
  APP_INITIALIZED: 'evt.app.app_initialized',
  DATABASE_CONNECTED: 'evt.database.database_client_connected',
  STRATEGY_EXECUTION_COMPLETED: 'evt.use_cases.strategy_execution_completed',
  STRATEGY_EXECUTION_STARTED: 'evt.use_cases.strategy_execution_started'
});

/**
 *
 */
export class SystemEvent {
  header = {
    id: id(Date.now()),
    timestamp: new Date().toISOString(),
    meta: { _open: {} },
    name: null,
  };
  payload;

  /**
   * @param {String} name
   * @param {Object.<string, Object>} payload
   * @param {Object.<string, Object>} metadata
   */
  constructor(name, payload = {}, metadata = {}) {
    this.header.meta._open = { ...metadata };
    this.header.name = name;
    this.payload = payload;

    return new MyCustomEvent(name, {
      detail: this,
    });
  }
}
