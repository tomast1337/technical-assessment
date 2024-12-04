import { faker } from '@faker-js/faker';
import axios, { AxiosInstance } from 'axios';
import * as bcrypt from 'bcryptjs';
import { expect } from 'chai';
import mongoose from 'mongoose';
import { SinonSandbox, createSandbox, restore, stub } from 'sinon';

import { UserModel } from '@models/index';
import RegionService from '@services/region.service';

import GeoLib from '../lib';

import '@app/database';
import '@app/server';

describe('Region E2E', () => {
  let axiosInstance: AxiosInstance;
  let session: mongoose.ClientSession;
  let _sandbox: SinonSandbox;
  let token: string;
  const userId = new mongoose.Types.ObjectId().toString();
  const geoLibStub: Partial<typeof GeoLib> = {};

  before(async () => {
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
  });

  after(async () => {
    restore();
    await UserModel.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(() => {
    _sandbox = createSandbox();
  });

  afterEach(() => {
    _sandbox.restore();
  });

  describe('POST /api/region', () => {
    it('should create a new region', async () => {
      const regionData = {
        name: 'Test Region',
        coordinates: [
          [25.774, -80.19],
          [18.466, -66.118],
          [32.321, -64.757],
          [25.774, -80.19],
        ],
      };

      const res = await axiosInstance.post('/region', regionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(res.status).to.equal(201);
      expect(res.data).to.have.property('name', 'Test Region');
    });

    it('should return 400 if validation fails', async () => {
      const regionData = {
        name: 'Test Region',
        coordinates: [
          [25.774, -80.19],
          [18.466, -66.118],
        ],
      };

      try {
        await axiosInstance.post('/region', regionData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        expect((error as any).response.status).to.equal(400);
      }
    });
  });

  describe('GET /api/region/:id', () => {
    it('should get a region by ID', async () => {
      const region = await RegionService.createRegion(userId, {
        name: 'Test Region',
        coordinates: [
          [25.774, -80.19],
          [18.466, -66.118],
          [32.321, -64.757],
          [25.774, -80.19],
        ],
      });

      const res = await axiosInstance.get(`/region/${region._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property('name', 'Test Region');
    });

    it('should return 404 if region is not found', async () => {
      try {
        await axiosInstance.get(`/region/${new mongoose.Types.ObjectId()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        expect((error as any).response.status).to.equal(404);
      }
    });
  });

  describe('PUT /api/region/:id', () => {
    it('should update a region by ID', async () => {
      const region = await RegionService.createRegion(userId, {
        name: 'Test Region',
        coordinates: [
          [25.774, -80.19],
          [18.466, -66.118],
          [32.321, -64.757],
          [25.774, -80.19],
        ],
      });

      const updatedData = {
        name: 'Updated Region',
        coordinates: [
          [25.774, -80.19],
          [18.466, -66.118],
          [32.321, -64.757],
          [25.774, -80.19],
        ],
      };

      const res = await axiosInstance.put(
        `/region/${region._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      expect(res.status).to.equal(200);
      expect(res.data).to.have.property('name', 'Updated Region');
    });

    it('should return 404 if region is not found', async () => {
      const updatedData = {
        name: 'Updated Region',
        coordinates: [
          [25.774, -80.19],
          [18.466, -66.118],
          [32.321, -64.757],
          [25.774, -80.19],
        ],
      };

      try {
        await axiosInstance.put(
          `/region/${new mongoose.Types.ObjectId()}`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (error) {
        expect((error as any).response.status).to.equal(404);
      }
    });
  });

  describe('DELETE /api/region/:id', () => {
    it('should delete a region by ID', async () => {
      const region = await RegionService.createRegion(userId, {
        name: 'Test Region',
        coordinates: [
          [25.774, -80.19],
          [18.466, -66.118],
          [32.321, -64.757],
          [25.774, -80.19],
        ],
      });

      const res = await axiosInstance.delete(`/region/${region._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(res.status).to.equal(200);

      expect(res.data).to.have.property(
        'message',
        'Region deleted successfully',
      );
    });

    it('should return 404 if region is not found', async () => {
      try {
        await axiosInstance.delete(`/region/${new mongoose.Types.ObjectId()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        expect((error as any).response.status).to.equal(404);
      }
    });
  });

  describe('GET /api/region', () => {
    it('should get all regions for the current user', async () => {
      await RegionService.createRegion(userId, {
        name: 'Test Region 1',
        coordinates: [
          [25.774, -80.19],
          [18.466, -66.118],
          [32.321, -64.757],
          [25.774, -80.19],
        ],
      });

      await RegionService.createRegion(userId, {
        name: 'Test Region 2',
        coordinates: [
          [25.774, -80.19],
          [18.466, -66.118],
          [32.321, -64.757],
          [25.774, -80.19],
        ],
      });

      const res = await axiosInstance.get('/region', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: 1,
          limit: 2,
        },
      });

      expect(res.status).to.equal(200);
      expect(res.data).to.be.an('array');
      expect(res.data).to.have.lengthOf(2);
    });
  });
});
