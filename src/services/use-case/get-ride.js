import { IEventEmitter } from '../../../interfaces/event-emitter.js';

/**
 *
 */
export class GetRideUseCase {
  #EVENT_SOURCE = 'com.beepboop.use_cases.get_ride';
  #eventEmitter;
  #strategy;

  /**
   * @param {IEventEmitter} eventEmitter - an instance of the EventEmitter interface
   *
   */
  constructor(eventEmitter) {
    this.#eventEmitter = eventEmitter;
  }

  /**
   * @param {Object} strategy
   */
  setStrategy(strategy) {
    this.#strategy = strategy;
  }

  /**
   * @param {Object} context
   */
  async run(context) {
    try {
      this.#eventEmitter.emit(
        'evt.use_cases.strategy_execution_started',
        { name: this.#strategy.name },
        { source: this.#EVENT_SOURCE }
      );

      const result = await this.#strategy.execute(context);
      return result;
    } catch (ex) {
      console.error(
        `Could not execute strategy ${this.#strategy.name}. See details -> ${
          ex.message
        }`
      );
    }
  }
}
