import id from 'firebase-auto-ids';

export class EventEmitter {
  #logger = console;
  #eventListeners = [];
  #emittedEvents = [];
  #recentEvents = {};
  #oneTimeEventRegistrations = new Set();

  constructor() {}

  /**
   * @returns {String}
   */
  #generateId() {
    return id(Date.now());
  }

  /**
   * Registers an event exactly once since
   * there are some event registrations that occur within
   * the render logic of UI components
   * @param {String} event
   * @param {Function} handlerFn
   * @returns {void}
   */
  once(eventName, handlerFn) {
    if (!this.#oneTimeEventRegistrations.has(eventName)) {
      this.on(eventName, handlerFn);
      this.#oneTimeEventRegistrations.add(eventName);
    }
  }

  /**
   * Register an event listener with the core system
   * @param {String} event - the name of an event to listen for
   * @param {Function} listener - a function to execute when the named event is emitted
   * @param {Object} options - options for handling events (e.g., debounce time, subscriber identifier)
   * @returns {void}
   */
  on(event, listener, options = {}) {
    if (!this.#eventListeners[event]) {
      this.#eventListeners[event] = [];
    }

    this.#eventListeners[event].push({ listener, options });
    // console.log(`Core system registered listener for event (${event})`);
  }

  /**
   * Emit a registered event with data to all listeners
   * @param {String} event - the name of the event being emitted
   * @param {Any} data - data associated with the event
   * @param {object} meta - metadata about the event
   * @returns {void}
   */
  async emit(event, data, meta = {}) {
    // Should clear `emittedEvents` if there are more than 500 in temporary storage
    if (this.#emittedEvents.length >= 500) {
      this.#emittedEvents = [];
    }

    if (this.#eventListeners[event]) {
      const subscribers = [];
      const events = this.#eventListeners[event].map(
        async ({ listener, options }) => {
          if (options.subscriber) {
            subscribers.push(options.subscriber);
          }

          // Handling debouncing
          const now = Date.now();
          const lastEmitTime = this.#recentEvents[event] || 0;

          if (options.debounce && now - lastEmitTime < options.debounce) {
            //console.log(`debouncing ${event}...`);
            return; // Skip this listener if the event was emitted recently
          }

          this.#recentEvents[event] = now;
          const publishedEvent = {
            header: {
              meta,
              id: this.#generateId(),
              name: event,
              subscribers: subscribers.join(', '),
              timestamp: new Date().toISOString(),
            },
            payload: {
              ...data,
            },
          };

          this.#emittedEvents.push(publishedEvent);

          try {
            await listener(publishedEvent);
          } catch (ex) {
            this.#logger.error(
              `Error while emitting event (${event}). See details -> ${ex.message}`
            );
          }
        }
      );

      await Promise.all(events).catch((ex) => {
        this.#logger.error(ex);
      });
      // this.#logger.info(`Core system emitted event (${event})`);
    }
  }
}
