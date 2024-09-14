import { UseCaseStrategy } from './use-case-strategy.js';
import { ISandbox, IGeoLocation, IIntentMessageContext } from '../../../interfaces.js';

/******** STUBS ********/
import { getProducts, getRideEstimate } from '../../../stubs/uber/api.js';

/**
 * @typedef {Object} DependentServices
 * @property {IGeoLocation} GeoLocation - Manages location and mapping capablities
 */


/**
 * Strategy for implementing the `mobilitiy.get_ride` use case with Uber
 */
export class UberStrategy extends UseCaseStrategy {
  name = 'app.use_cases.strategy.UBER';
  #sandbox;
  
  /**
   * @param {ISandbox & { my: DependentServices }} sandbox
   */
  constructor(sandbox) {
    super(sandbox);
    this.#sandbox = sandbox;
  }

  /**
   * @param {IIntentMessageContext} useCaseContext
   * @returns {Result}
   */
  async execute(useCaseContext) {
    const address = useCaseContext.location.destination.name;
    const coords = await this.#sandbox.my.GeoLocation.getCoordinatesFromAddress(address);
    
    console.log(coords);
    
    // Get a list of products via Uber API
    const getProductsRequest = await fetch('https://httpbin.org/anything', {
      method: 'POST',
      body: JSON.stringify(getProducts.products),
      'content-type': 'application/json',
    });
    const getProductsResponse = await getProductsRequest.json();

    // Request ride estimate
    const getRideEstimateRequest = await fetch('https://httpbin.org/anything', {
      method: 'POST',
      body: JSON.stringify(getRideEstimate),
      'content-type': 'application/json',
    });

    const getRideEstimateResponse = await getRideEstimateRequest.json();
    return getRideEstimateResponse.json;
  }
}
