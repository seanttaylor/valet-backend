import id from 'firebase-auto-ids';

class MyCustomEventTarget {
  constructor() {
    this.listeners = {}; // To store event listeners by event type
  }

  // Add event listener
  addEventListener(type, listener) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }

  // Remove event listener
  removeEventListener(type, listener) {
    if (!this.listeners[type]) {
      return;
    }
    this.listeners[type] = this.listeners[type].filter((l) => l !== listener);
  }

  // Dispatch event
  dispatchEvent(event) {
    const listeners = this.listeners[event.type];
    if (listeners) {
      listeners.forEach((listener) => {
        // Execute the listener function, passing the event
        listener.call(this, event);
      });
    }
  }
}

/**
 * The core of the application; registers and emits events
 */
export class Sandbox extends MyCustomEventTarget {
  /**
   * @param {String[]} modules
   * @param {Function} callback
   */
  constructor(modules, callback) {
    super();

    const factories = {};

    /**
     * An object with the `core` namespaces and event-related methods available to
     * all modules; provided in the callback to the `Sandbox` constructor
     */
    const sandbox = {
      my: {},
      core: {
        generateUUID: this.generateUUID,
        generateId: () => id(Date.now()),
        logger: {
          getLoggerInstance: () => console,
        },
      },
      // Binds event methods from the EventTarget (i.e. this) to ensure proper context
      addEventListener: this.addEventListener.bind(this),
      removeEventListener: this.removeEventListener.bind(this),
      dispatchEvent: this.dispatchEvent.bind(this),
    };

    // Create factories for each module
    modules.forEach((moduleName) => {
      factories[moduleName] = () => new Sandbox.modules[moduleName](sandbox);
    });

    // Lazily initialize the modules using `Object.defineProperty`
    Object.entries(factories).forEach(([moduleName, factory]) => {
      Object.defineProperty(sandbox.my, moduleName, {
        get: () => {
          if (!sandbox.my[`__${moduleName}`]) {
            try {
              sandbox.my[`__${moduleName}`] = factory(); // Create module lazily
            } catch (ex) {
              console.error(
                `INTERNAL_ERROR (sandbox): Could not create module (${moduleName}); ensure this module is registered via Sandbox.modules.of`
              );
              return;
            }
          }
          return sandbox.my[`__${moduleName}`];
        },
      });
    });

    // Instantiates provided modules and add them to the 'my' namespace

    // modules.forEach((moduleName) => {
    //   if (Sandbox.modules[moduleName]) {
    //     sandbox.my[moduleName] = new Sandbox.modules[moduleName](sandbox);
    //   } else {
    //     console.warn(`Module ${moduleName} is not defined`);
    //   }
    // });

    // Passes the sandbox object with `my` and `core` namespaces to the callback
    callback(sandbox);

    /**
     * Though Sandbox extends EventTarget we *only* return a `dispatchEvent` method to
     * ensure that event registrations occur inside the Sandbox. This prevents
     * "eavesdropping" on events by clients that are not sandboxed. All such clients
     * can do is notify the sandbox of an external event of interest
     */
    return {
      dispatchEvent: this.dispatchEvent.bind(this),
    };
  }

  /**
   * Generates a version 4 UUID
   * @returns {String}
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  /**
   *  Houses sandbox module definitions
   */
  static modules = {
    /**
     * @param {String} moduleName - the identifier for the module to be referenced by
     * @param {Object} moduleClass - module's constructor
     */
    of: function (moduleName, moduleClass) {
      Sandbox.modules[moduleName] = moduleClass;
    },
  };
}
