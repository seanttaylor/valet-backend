import { UseCaseStrategy } from './use-case-strategy.js';
import { ISandbox, IGeoLocation, IIntentMessageContext } from '../../../interfaces/local.js';
import { IUberProductList } from '../../../interfaces/vendor/uber.js';
import { config } from '../../../config.js';

/******** STUBS ********/
import { getProducts, getRideEstimate } from '../../../stubs/uber/api.js';

/**
 * @typedef {Object} DependentServices
 * @property {IGeoLocation} GeoLocation - Manages location and mapping capablities
 */

const UberClient = {
  /**
   * @returns {Object}
   */
  async getRideEstimate() {

  },
  /**
   * @param {String} lat
   * @param {String} lng
   * @returns {IUberProductList}
   */
  async getAvailableProducts(lat, lng) {
    const response = await fetch(`${config.vars.UBER_API_URL}/products?latitude=${lat}&${lng}`, {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${config.keys.UBER_ACCESS_TOKEN}`
      }
     })
  },
  /**
   * @returns {Object}
   */
  async requestRide() {

  }
};


/**
 * Strategy for implementing the `mobilitiy.get_ride` use case with Uber
 */
export class UberStrategy extends UseCaseStrategy {
  name = 'app.use_cases.strategy.UBER';
  UBER_API_URL = config.vars.UBER_API_URL;
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
