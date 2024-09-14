import {
  ISandbox,
  IUseCaseStrategy,
  IDataAccessLayer,
} from '../../../interfaces/local.js';
import { UberStrategy } from './uber-strategy.js';

/**
 * @typedef {Object} DependentServices
 * @property {IDataAccessLayer} DataAccessLayer
 */

/**
 * Manages all strategies associated with application use cases
 */
export class StrategyService {
  #EVENT_SOURCE = 'com.valet.backend.services.strategy';
  #logger;
  //#strategyMap = {};
  #sandbox;

  /**
   * @param {ISandbox & { my: DependentServices }} sandbox
   */
  constructor(sandbox) {
    this.#sandbox = sandbox;
    this.#logger = sandbox.core.logger.getLoggerInstance();
  }

  /**
   * Provided a specified domain, selects the appropriate strategy
   * @param {String} domain
   * @returns {IUseCaseStrategy}
   */
  async getStrategyByDomain(domain) {
    return new UberStrategy(this.#sandbox);
  }

  /**
   * Fires when the strategy associated with a
   * use case has completed successfully
   * @param {IEvent<Object>} event
   */
  async onStrategyExecutionCompleted(event) {
    this.#logger.log(event);

    const { payload } = event;

    try {
      const client = this.#sandbox.my.DataAccessLayer.getDbClient();

      const { error } = await client
        .from('completed_strategy_executions')
        .insert({
          reply_id: payload.reply_id,
          payload,
        });

      if (error) {
        this.#logger.error(error.message);
      }
    } catch (ex) {
      this.#logger.error(
        `INTERNAL_ERROR (${
          this.#EVENT_SOURCE
        }): Exception while pushing completed strategy execution record to database. See details ->`,
        ex.message
      );
    }
  }
}