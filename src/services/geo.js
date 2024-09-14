/******** LOCAL DEPENDENCIES ********/
import { ISandbox, IGeoCodeResponse } from '../../interfaces.js';
import { config } from '../../config.js';

export class GeoLocation {
  #sandbox;
  #GOOGLE_MAPS_GEOCODE_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

  /**
   * 
   * @param {ISandbox} sandbox 
   */
  constructor(sandbox) {
    this.#sandbox = sandbox;
  }

  /**
   * Returns a coordinate pair for a plain text address
   * @param {String} address
   * @return {Object}
   */
  async getCoordinatesFromAddress(address) {
    const queryAddress = encodeURIComponent(address);
    const url = `${this.#GOOGLE_MAPS_GEOCODE_API_URL}${queryAddress}&key=${config.keys.GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);

    /**
     * @type {IGeoCodeResponse}
     */
    const { results } = await response.json();
    const [ geodata ] = results;
    
    return {
      address,
      latitude: geodata.geometry.location.lat,
      longitude: geodata.geometry.location.lng
    }    
  }
}
