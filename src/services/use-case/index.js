import { GetRideUseCase } from './get-ride.js';

/**
 *
 */
export class UseCaseService {
    #EVENT_SOURCE;
    #eventEmitter;
    #useCaseMap = {
      mobility: {
        get_ride: [GetRideUseCase],
        compare_rides: [],
        book_ride: [],
      },
    };
  
    /**
     * @param {Object} eventEmitter
     */
    constructor(eventEmitter) {
      this.#eventEmitter = eventEmitter;
    }
  
    /**
     * @param {String} domain
     * @returns {UseCase[]}
     */
    async getUseCaseByDomain(domain) {
      const [_, intent, serviceDomain, useCase] = domain.split('.');
      return this.#useCaseMap[serviceDomain][useCase];
    }
  }
  