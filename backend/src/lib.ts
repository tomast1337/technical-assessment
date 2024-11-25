import { Client } from '@googlemaps/google-maps-services-js';

import { env } from './config';
import logger from './logger';

const loggerLocal = logger.child({ label: 'GeoLib' });

type CoordinatesArr = [number, number];
type CoordinatesObj = { lat: number; lng: number };
type Coordinates = CoordinatesArr | CoordinatesObj;

class GeoLib {
  private client: Client;
  private apiKey: string;

  constructor() {
    this.client = new Client({});
    this.apiKey = env.GOOGLE_MAPS_API_KEY;
  }

  public async getAddressFromCoordinates(
    coordinates: Coordinates,
  ): Promise<string> {
    const latlng = Array.isArray(coordinates)
      ? { lat: coordinates[0], lng: coordinates[1] }
      : coordinates;

    try {
      const response = await this.client.reverseGeocode({
        params: {
          latlng,
          key: this.apiKey,
        },
      });

      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        loggerLocal.error('No address found for the given coordinates');
        throw new Error('No address found for the given coordinates');
      }
    } catch (error) {
      loggerLocal.error(
        `Failed to get address from coordinates: ${(error as any).message}`,
      );

      throw new Error(
        `Failed to get address from coordinates: ${(error as any).message}`,
      );
    }
  }

  public async getCoordinatesFromAddress(
    address: string,
  ): Promise<{ lat: number; lng: number }> {
    try {
      const response = await this.client.geocode({
        params: {
          address,
          key: this.apiKey,
        },
      });

      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      } else {
        throw new Error('No coordinates found for the given address');
      }
    } catch (error) {
      loggerLocal.error(
        `Failed to get coordinates from address: ${(error as any).message}`,
      );

      throw new Error(
        `Failed to get coordinates from address: ${(error as any).message}`,
      );
    }
  }
}

export default new GeoLib();
