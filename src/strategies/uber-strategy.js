import { UseCaseStrategy } from './use-case-strategy.js';

/******** STUBS ********/
import { getProducts, getRideEstimate } from '../stubs/uber/api.js';

/**
 * Strategy for implementing the `mobilitiy.get_ride` use case with Uber
 */
export class UberStrategy extends UseCaseStrategy {
  name = 'app.use_cases.strategy.UBER';

  constructor() {
    super();
  }

  /**
   * @param {object} useCaseContext
   * @returns {Result}
   */
  async execute(useCaseContext) {
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
