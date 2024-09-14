import { createClient } from '@supabase/supabase-js';

/******** LOCAL DEPENDENCIES ********/
import { ISandbox } from '../../interfaces/local.js';
import { SystemEvent, Events } from '../events.js';
import { config } from '../../config.js';

/******** UTILITIES ********/
import { once } from '../utils/once.js';

export class DataAccessLayer {
  #client;
  #logger;
  #sandbox;
  #EVENT_SOURCE = 'com.valet.services.data_access_layer';
  #SUPABASE_KEY;
  #SUPABASE_URL;

  /**
   * @param {ISandbox} sandbox
   */
  constructor(sandbox) {
    this.#logger = sandbox.core.logger.getLoggerInstance();
    this.#sandbox = sandbox;
    this.#SUPABASE_KEY = config.keys.SUPABASE_PUBLIC_ANON_KEY;
    this.#SUPABASE_URL = config.vars.SUPABASE_URL;
  }

  /**
   * @returns {Object}
   */
  getDbClient() {
    if (this.#client) {
      return this.#client;
    }

    try {
      const client = createClient(this.#SUPABASE_URL, this.#SUPABASE_KEY);
      once(() => {
        this.#sandbox.dispatchEvent(
          new SystemEvent(
            Events.DATABASE_CONNECTED,
            { timestamp: new Date().toISOString() },
            { source: this.#EVENT_SOURCE }
          )
        );
      });

      this.#client = client;

      return client;
    } catch (ex) {
      this.#logger.log(
        `INTERNAL_ERROR (${
          this.#EVENT_SOURCE
        }): Could not create database client. See details ->`,
        ex.message
      );
    }
  }
}
