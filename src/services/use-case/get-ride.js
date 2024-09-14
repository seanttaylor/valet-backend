/**
 *
 */
export class GetRideUseCase {
  #EVENT_SOURCE = 'com.valet.use_cases.get_ride';
  #strategy;

  /**
   *
   */
  constructor() {}

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
