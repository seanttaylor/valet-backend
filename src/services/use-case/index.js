import { GetRideUseCase } from './get-ride.js';

/**
 *
 */
const UseCaseProvider = {
  mobility: {
    get_ride: [GetRideUseCase],
    compare_rides: [],
    book_ride: [],
  },
};

/**
 *
 */
export class UseCaseService {
  #EVENT_SOURCE = 'com.valet.backend.services.use_case';
  #sandbox;
  //#useCaseMap = UseCaseProvider;
  #useCaseMap = {
    mobility: {
      get_ride: [GetRideUseCase],
      compare_rides: [],
      book_ride: [],
    },
  };

  /**
   * @param {ISandbox} sandbox
   */
  constructor(sandbox) {
    this.#sandbox = sandbox;
  }

  /**
   *
   * @param {String} domain
   * @returns {Object[]}
   */
  async getUseCaseByDomain(domain) {
    const [_, intent, serviceDomain, useCase] = domain.split('.');
    return this.#useCaseMap[serviceDomain][useCase];
  }
}