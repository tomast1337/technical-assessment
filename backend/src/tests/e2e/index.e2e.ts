import { faker } from '@faker-js/faker';
import { mongoose } from '@typegoose/typegoose';
import axios, { AxiosInstance } from 'axios';
import * as bcrypt from 'bcryptjs';
import { expect } from 'chai';
import sinon from 'sinon';

import db from '@app/database';
import GeoLib from '@app/lib';
import server from '@app/server';
import { RegionModel, UserModel } from '@models/index';
import RegionService from '@services/region.service';

describe('E2E', () => {
  before(async () => {
    await db;
    await server;
  });

  after(async () => {
    await UserModel.deleteMany({});
    await RegionModel.deleteMany({});
    await mongoose.disconnect();
  });

  describe('Auth E2E', () => {
    let axiosInstance: AxiosInstance;
    const geoLibStub: Partial<typeof GeoLib> = {};
    let _sandbox: sinon.SinonSandbox;

    before(async () => {
      axiosInstance = axios.create({
        baseURL: 'http://localhost:3000/api',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      _sandbox = sinon.createSandbox();
    });

    after(async () => {
      sinon.restore();
    });

    beforeEach(async () => {
      geoLibStub.getAddressFromCoordinates = _sandbox
        .stub(GeoLib, 'getAddressFromCoordinates')
        .resolves(faker.location.streetAddress({ useFullAddress: true }));

      geoLibStub.getCoordinatesFromAddress = _sandbox
        .stub(GeoLib, 'getCoordinatesFromAddress')
        .resolves({
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        });
    });

    afterEach(async () => {
      _sandbox.restore();
      await UserModel.deleteMany({});
    });

    describe('POST /auth/register', () => {
      it('should register a new user with address', async () => {
        const name = faker.person.firstName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const address = faker.location.streetAddress({ useFullAddress: true });

        try {
          const result = await axiosInstance.post('/auth/register', {
            name,
            email,
            password,
            address,
          });

          expect(result.data).to.have.property(
            'message',
            'User registered successfully',
          );
        } catch (error) {
          console.log((error as any).response.data);
        }
      });

      it('should register a new user with coords', async () => {
        const name = faker.person.firstName();
        const email = faker.internet.email();
        const password = faker.internet.password();

        const coordinates = [
          faker.location.latitude(),
          faker.location.longitude(),
        ];

        try {
          const result = await axiosInstance.post('/auth/register', {
            name,
            email,
            password,
            coordinates,
          });

          expect(result.data).to.have.property(
            'message',
            'User registered successfully',
          );
        } catch (error) {
          console.log((error as any).response.data);
          throw error;
        }
      });

      it('should throw an error if both address and coords are provided', async () => {
        const name = faker.person.firstName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const address = faker.location.streetAddress({ useFullAddress: true });

        try {
          await axiosInstance.post('/auth/register', {
            name,
            email,
            password,
            address,
            coordinates: [
              faker.location.latitude(),
              faker.location.longitude(),
            ],
          });
        } catch (error) {
          expect((error as any).response.data).to.have.property(
            'message',
            'Either address or coordinates should be provided, not both',
          );
        }
      });

      it('should throw an error if neither address nor coords are provided', async () => {
        const name = faker.person.firstName();
        const email = faker.internet.email();
        const password = faker.internet.password();

        try {
          await axiosInstance.post('/auth/register', {
            name,
            email,
            password,
          });
        } catch (error) {
          expect((error as any).response.data).to.have.property(
            'message',
            'Invalid address or coordinates',
          );
        }
      });

      it('should throw an error if the user already exists', async () => {
        const name = faker.person.firstName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const address = faker.location.streetAddress({ useFullAddress: true });

        await axiosInstance.post('/auth/register', {
          name,
          email,
          password,
          address,
        });

        try {
          await axiosInstance.post('/auth/register', {
            name,
            email,
            password,
            address,
          });
        } catch (error) {
          expect((error as any).response.data).to.have.property(
            'message',
            'User already exists',
          );
        }
      });
    });

    describe('POST /auth/login', () => {
      it('should login a user and return a token and refresh token', async () => {
        const name = faker.person.firstName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const address = faker.location.streetAddress({ useFullAddress: true });

        await axiosInstance.post('/auth/register', {
          name,
          email,
          password,
          address,
        });

        const result = await axiosInstance.post('/auth/login', {
          email,
          password,
        });

        expect(result.data).to.have.property('token');
        expect(result.data).to.have.property('refreshToken');
      });

      it('should throw an error if the credentials are invalid', async () => {
        const email = faker.internet.email();
        const password = faker.internet.password();

        try {
          await axiosInstance.post('/auth/login', {
            email,
            password,
          });
        } catch (error) {
          expect((error as any).response.data).to.have.property(
            'message',
            'Invalid credentials',
          );
        }
      });
    });

    describe('POST /auth/update-password/', () => {
      it('should update the user password', async () => {
        const name = faker.person.firstName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const address = faker.location.streetAddress({ useFullAddress: true });

        await UserModel.create([
          {
            name,
            email,
            password: bcrypt.hashSync(password, 10),
            address,
          },
        ]);

        const loggedUser = await axiosInstance.post('/auth/login', {
          email,
          password,
        });

        const newPassword = faker.internet.password();

        await axiosInstance.patch(
          `/auth/update-password/`,
          {
            password: newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${loggedUser.data.token}`,
            },
          },
        );

        // try to login with the new password
        const result = await axiosInstance.post('/auth/login', {
          email,
          password: newPassword,
        });

        expect(result.data).to.have.property('token');
        expect(result.data).to.have.property('refreshToken');

        // try to login with the old password and expect an error
        try {
          await axiosInstance.post('/auth/login', {
            email,
            password,
          });
        } catch (error) {
          expect((error as any).response.data).to.have.property(
            'message',
            'Invalid credentials',
          );
        }
      });
    });
  });

  describe('Region E2E', () => {
    let axiosInstance: AxiosInstance;
    let token: string;
    const userId = new mongoose.Types.ObjectId().toString();
    const geoLibStub: Partial<typeof GeoLib> = {};

    after(async () => {
      sinon.restore();
    });

    beforeEach(async () => {
      // Mock GeoLib methods
      geoLibStub.getAddressFromCoordinates = sinon
        .stub(GeoLib, 'getAddressFromCoordinates')
        .resolves(faker.location.streetAddress({ useFullAddress: true }));

      geoLibStub.getCoordinatesFromAddress = sinon
        .stub(GeoLib, 'getCoordinatesFromAddress')
        .resolves({
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        });

      axiosInstance = axios.create({
        baseURL: 'http://localhost:3000/api',
        headers: {
          'Content-Type': 'application/json',
        },
      });

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

      // create 4 test regions

      // inside and near the point
      await RegionService.createRegion(userId, {
        name: 'Test Region 1',

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
      });

      // near the point
      await RegionService.createRegion(userId, {
        name: 'Test Region 2',

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
      });

      // outside the point
      await RegionService.createRegion(userId, {
        name: 'Test Region 3',

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
      });

      // far from the point
      await RegionService.createRegion(userId, {
        name: 'Test Region 4',
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
      });
    });

    afterEach(async () => {
      sinon.restore();
      await RegionModel.deleteMany({});
      await UserModel.deleteMany({});
    });

    describe('POST /api/region', () => {
      it('should create a new region', async () => {
        const regionData = {
          name: faker.location.city(),

          type: 'Polygon',
          coordinates: [
            [
              [25.774, -80.19],
              [18.466, -66.118],
              [32.321, -64.757],
              [25.774, -80.19],
            ],
          ],
        };

        const res = await axiosInstance.post('/region', regionData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        expect(res.status).to.equal(201);
        expect(res.data).to.have.property('name', regionData.name);
      });

      it('should return 400 if validation fails', async () => {
        const regionData = {
          name: 123, // name must be a string

          type: 'Polygon',

          coordinates: [
            [
              [25.774, -80.19],
              [18.466, -66.118],
              [32.321, -64.757],
            ],
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

          type: 'Polygon',
          coordinates: [
            [
              [25.774, -80.19],
              [18.466, -66.118],
              [32.321, -64.757],
              [25.774, -80.19],
            ],
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

    describe('PATCH /api/region/:id', () => {
      it('should update a region by ID', async () => {
        const region = await RegionService.createRegion(userId, {
          name: 'Test Region',

          type: 'Polygon',
          coordinates: [
            [
              [25.774, -80.19],
              [18.466, -66.118],
              [32.321, -64.757],
              [25.774, -80.19],
            ],
          ],
        });

        const updatedData = {
          name: 'Updated Region',

          type: 'Polygon',
          coordinates: [
            [
              [25.774, -80.19],
              [18.466, -66.118],
              [32.321, -64.757],
              [25.774, -80.19],
            ],
          ],
        };

        try {
          const res = await axiosInstance.patch(
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
        } catch (error) {
          console.log((error as any).response.data);
          throw error;
        }
      });

      it('should return 404 if region is not found', async () => {
        const updatedData = {
          name: 'Updated Region',

          type: 'Polygon',
          coordinates: [
            [
              [25.774, -80.19],
              [18.466, -66.118],
              [32.321, -64.757],
              [25.774, -80.19],
            ],
          ],
        };

        try {
          await axiosInstance.patch(`/region/i-dont-exist`, updatedData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.log((error as any).response.data);
          expect((error as any).response.status).to.equal(404);
        }
      });
    });

    describe('DELETE /api/region/:id', () => {
      it('should delete a region by ID', async () => {
        const region = await RegionService.createRegion(userId, {
          name: 'Test Region',

          type: 'Polygon',
          coordinates: [
            [
              [25.774, -80.19],
              [18.466, -66.118],
              [32.321, -64.757],
              [25.774, -80.19],
            ],
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
          await axiosInstance.delete(
            `/region/${new mongoose.Types.ObjectId()}`,
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

    describe('GET /api/region', () => {
      it('should get a page of regions', async () => {
        for (let i = 0; i < 10; i++) {
          const coordinates = Array.from({ length: 3 }, () => [
            faker.location.longitude({
              min: -180,
              max: 180,
              precision: 3,
            }),
            faker.location.latitude({
              min: -90,
              max: 90,
              precision: 3,
            }),
          ]) as [number, number][];

          coordinates.push(coordinates[0]);

          await RegionService.createRegion(userId, {
            name: faker.location.city(),

            type: 'Polygon',
            coordinates: [coordinates],
          });
        }

        const res = await axiosInstance.get('/region', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: 1,
            limit: 5,
          },
        });

        expect(res.status).to.equal(200);
        expect(res.data.data).to.be.an('array');
        expect(res.data.data).to.have.lengthOf(5);
      });
    });
  });

  describe('Region Actions E2E', () => {
    let axiosInstance: AxiosInstance;

    let token: string;
    const userId = new mongoose.Types.ObjectId().toString();
    const geoLibStub: Partial<typeof GeoLib> = {};

    beforeEach(async () => {
      // Mock GeoLib methods
      geoLibStub.getAddressFromCoordinates = sinon
        .stub(GeoLib, 'getAddressFromCoordinates')
        .resolves(faker.location.streetAddress({ useFullAddress: true }));

      geoLibStub.getCoordinatesFromAddress = sinon
        .stub(GeoLib, 'getCoordinatesFromAddress')
        .resolves({
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        });

      axiosInstance = axios.create({
        baseURL: 'http://localhost:3000/api',
        headers: {
          'Content-Type': 'application/json',
        },
      });

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

      await RegionService.createRegion(userId, {
        name: 'Test Region 1',

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
      });

      await RegionService.createRegion(userId, {
        name: 'Test Region 2',

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
      });

      await RegionService.createRegion(userId, {
        name: 'Test Region 3',

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
      });

      await RegionService.createRegion(userId, {
        name: 'Test Region 4',

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
      });
    });

    afterEach(async () => {
      sinon.restore();
      await RegionModel.deleteMany({});
      await UserModel.deleteMany({});
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
        expect(res.data).to.have.lengthOf(1);
      });
    });

    describe('GET /api/region-actions/near-point', () => {
      it('should return a list of regions near a specific point', async () => {
        const lat = 0;
        const lng = 0;
        const maxDistance = 50;

        const res = await axiosInstance.get('/region-actions/near-point', {
          params: {
            lat,
            lng,
            maxDistance,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        expect(res.status).to.equal(200);
        expect(res.data).to.be.an('array');
        expect(res.data).to.have.lengthOf(1);
      });
    });
  });

  describe('User E2E', () => {
    let axiosInstance: AxiosInstance;
    let token: string;
    const userId = new mongoose.Types.ObjectId().toString();
    // Create a test user and get a JWT token
    const password = bcrypt.hashSync('password123', 10);
    const user = {
      _id: userId,
      name: 'Test User',
      email: 'test@example.com',
      address: '123 Main St',
      coordinates: [25.774, -80.19],
      password,
    };
    const geoLibStub: Partial<typeof GeoLib> = {};

    before(async () => {
      // Mock GeoLib methods
      geoLibStub.getAddressFromCoordinates = sinon
        .stub(GeoLib, 'getAddressFromCoordinates')
        .resolves(faker.location.streetAddress({ useFullAddress: true }));

      geoLibStub.getCoordinatesFromAddress = sinon
        .stub(GeoLib, 'getCoordinatesFromAddress')
        .resolves({
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        });
    });

    after(async () => {
      sinon.restore();
    });

    beforeEach(async () => {
      axiosInstance = axios.create({
        baseURL: 'http://localhost:3000/api',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await UserModel.create(user);

      const res = await axiosInstance.post('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });

      token = res.data.token;
    });

    afterEach(async () => {
      await UserModel.deleteMany({});
    });

    describe('GET /api/user/me', () => {
      it('should get the current user information', async () => {
        const result = await axiosInstance.get('/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        expect(result.data).to.have.property('name');
        expect(result.data).to.have.property('email');
        expect(result.data).to.have.property('address');
      });
    });

    describe('PATCH /api/user/me', () => {
      it('should update the current user information', async () => {
        const newName = faker.person.firstName();

        const newAddress = faker.location.streetAddress({
          useFullAddress: true,
        });

        const result = await axiosInstance.patch(
          '/user/me',
          {
            name: newName,
            address: newAddress,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        expect(result.data).to.have.property('name', newName);
        expect(result.data).to.have.property('address', newAddress);
      });
    });

    describe('DELETE /api/user/me', () => {
      it('should delete the current user account', async () => {
        const result = await axiosInstance.delete('/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        expect(result.data).to.have.property(
          'message',
          'User deleted successfully',
        );

        const foundUser = await UserModel.findOne({ email: user.email });
        expect(foundUser).to.be.null;
      });
    });

    describe('GET /api/user', () => {
      it('should get a list of users with pagination', async () => {
        const result = await axiosInstance.get('/user', {
          params: {
            page: 1,
            limit: 1,
            order: true,
            shortBy: 'name',
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        expect(result.data.data).to.have.lengthOf(1);
      });
    });
  });
});
