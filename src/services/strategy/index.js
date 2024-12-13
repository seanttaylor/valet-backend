import { UberStrategy } from './strategies/uber-strategy.js';

/**
 * Wraps all known domain strategies
 */
export class StrategyService {
  #strategyMap = {};

  constructor() {}

  /**
   * Identfies the appropriate strategy for a specified domain; hardcoded
   * to Uber for demo purposes
   * @param {String} domain
   * @returns {object}
   */
  async getStrategyByDomain(domain) {
    return new UberStrategy();
  }
}