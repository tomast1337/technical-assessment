import { expect } from 'chai';
import sinon from 'sinon';
import { Client } from '@googlemaps/google-maps-services-js';
import GeoLib from './lib';

describe('GeoLib', function () {
  let clientStub: sinon.SinonStubbedInstance<Client>;

  beforeEach(function () {
    clientStub = sinon.createStubInstance(Client);
    (GeoLib as any).client = clientStub;
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('getAddressFromCoordinates', function () {
    it('should return address for valid coordinates', async function () {
      const coordinates: [number, number] = [37.7749, -122.4194];
      const expectedAddress = 'San Francisco, CA, USA';

      clientStub.reverseGeocode.resolves({
        data: {
          results: [{ formatted_address: expectedAddress }],
        },
      } as any);

      const address = await GeoLib.getAddressFromCoordinates(coordinates);
      expect(address).to.equal(expectedAddress);
    });

    it('should throw an error if no address is found', async function () {
      const coordinates: [number, number] = [0, 0];

      clientStub.reverseGeocode.resolves({
        data: {
          results: [],
        },
      } as any);

      try {
        await GeoLib.getAddressFromCoordinates(coordinates);
        throw new Error('Expected method to reject.');
      } catch (err) {
        expect((err as any).message).to.equal(
          'Failed to get address from coordinates: No address found for the given coordinates',
        );
      }
    });
  });

  describe('getCoordinatesFromAddress', function () {
    it('should return coordinates for valid address', async function () {
      const address = 'San Francisco, CA, USA';
      const expectedCoordinates = { lat: 37.7749, lng: -122.4194 };

      clientStub.geocode.resolves({
        data: {
          results: [{ geometry: { location: expectedCoordinates } }],
        },
      } as any);

      const coordinates = await GeoLib.getCoordinatesFromAddress(address);
      expect(coordinates).to.deep.equal(expectedCoordinates);
    });

    it('should throw an error if no coordinates are found', async function () {
      const address = 'Unknown Place';

      clientStub.geocode.resolves({
        data: {
          results: [],
        },
      } as any);

      try {
        await GeoLib.getCoordinatesFromAddress(address);
        throw new Error('Expected method to reject.');
      } catch (err) {
        expect((err as any).message).to.equal(
          'Failed to get coordinates from address: No coordinates found for the given address',
        );
      }
    });
  });
});
