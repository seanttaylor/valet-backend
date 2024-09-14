/**
 * Represents a single product in the Uber platform.
 * @typedef {Object} Product
 * @property {boolean} upfront_fare_enabled - Indicates if upfront fare is enabled.
 * @property {number} capacity - Maximum capacity of passengers for the service.
 * @property {string} product_id - Unique identifier for the product.
 * @property {string} image - URL to an image representing the product.
 * @property {boolean} cash_enabled - Indicates if cash payment is enabled.
 * @property {boolean} shared - Indicates if the ride is shared with other passengers.
 * @property {string} short_description - A brief description of the product.
 * @property {string} display_name - The display name of the product.
 * @property {string} product_group - The group or category of the product.
 * @property {string} description - A detailed description of the product.
 */

/**
 * Contains a list of products offered by the Uber platform.
 * @typedef {Object} ProductList
 * @property {Product[]} products - An array of products.
 */

/**
 * @type {ProductList}
 * @description - Complete list of available Uber product types
 */
export const IUberProductList = Object.freeze({});