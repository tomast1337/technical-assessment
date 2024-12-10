import { faker } from '@faker-js/faker';
import axios, { AxiosInstance } from 'axios';
import * as bcrypt from 'bcryptjs';
import { expect } from 'chai';
import mongoose from 'mongoose';
import { SinonSandbox, createSandbox, restore, stub } from 'sinon';

import GeoLib from '@app/lib';
import { clearDatabase, closeDatabase, connect } from '@app/tests/db-handler';
import { UserModel } from '@models/index';
import RegionService from '@services/region.service';

import '@app/server';

describe('Region E2E', () => {
  let axiosInstance: AxiosInstance;
  let _sandbox: SinonSandbox;
  let token: string;
  const userId = new mongoose.Types.ObjectId().toString();
  const geoLibStub: Partial<typeof GeoLib> = {};

  before(async () => {
    await connect();

    // Mock GeoLib methods
    geoLibStub.getAddressFromCoordinates = stub(
      GeoLib,
      'getAddressFromCoordinates',
    ).resolves(faker.location.streetAddress({ useFullAddress: true }));

    geoLibStub.getCoordinatesFromAddress = stub(
      GeoLib,
      'getCoordinatesFromAddress',
    ).resolves({
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
    });

    axiosInstance = axios.create({
      baseURL: 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    _sandbox = createSandbox();

    // Create a test user and get a JWT token
    const password = bcrypt.hashSync('password123', 10);

    await UserModel.create({
      _id: userId,
      name: 'Test User',
      email: 'test@example.com',
      address: '123 Main St',
      coordinates: [25.774, -80.19],
      password,
    });

    const res = await axiosInstance.post('/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });

    token = res.data.token;

    // create 2 test regions

    // inside and near the point
    await RegionService.createRegion(userId, {
      name: 'Test Region 1',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0],
          ],
        ],
      },
    });

    // near the point
    await RegionService.createRegion(userId, {
      name: 'Test Region 2',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 1],
            [1, 1],
          ],
        ],
      },
    });

    // outside the point
    await RegionService.createRegion(userId, {
      name: 'Test Region 3',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2, 2],
            [2, 3],
            [3, 3],
            [3, 2],
            [2, 2],
          ],
        ],
      },
    });

    // far from the point
    await RegionService.createRegion(userId, {
      name: 'Test Region 4',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10, 10],
            [10, 11],
            [11, 11],
            [11, 10],
            [10, 10],
          ],
        ],
      },
    });
  });

  after(async () => {
    restore();
    await closeDatabase();
  });

  beforeEach(() => {
    _sandbox = createSandbox();
  });

  afterEach(async () => {
    _sandbox.restore();
    await clearDatabase();
  });

  describe('GET /api/region-actions/containing-point', () => {
    it('should return a list of regions containing a specific point', async () => {
      const lat = 0;
      const lng = 0;

      const res = await axiosInstance.get(
        `/region-actions/containing-point?lat=${lat}&lng=${lng}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      expect(res.status).to.equal(200);
      expect(res.data).to.be.an('array');
    });
  });

  describe('PUT /api/region-actions/near-point', () => {
    it('should return a list of regions near a specific point', async () => {
      const lat = 0;
      const lng = 0;

      const res = await axiosInstance.get(
        `/region-actions/near-point?lat=${lat}&lng=${lng}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      expect(res.status).to.equal(200);
      expect(res.data).to.be.an('array');
    });
  });
});
