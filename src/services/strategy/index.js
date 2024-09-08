import { UberStrategy } from './strategies/uber-strategy.js';

export class StrategyService {
  #strategyMap = {};

  constructor() {}

  /**
   * @param {String} domain
   * @returns {object}
   */
  async getStrategyByDomain(domain) {
    return new UberStrategy();
  }
}