import { faker } from '@faker-js/faker';
import axios, { AxiosInstance } from 'axios';
import * as bcrypt from 'bcryptjs';
import { expect } from 'chai';
import { SinonSandbox, createSandbox, restore, stub } from 'sinon';

import GeoLib from '@app/lib';
import { clearDatabase, closeDatabase, connect } from '@app/tests/db-handler';
import { UserModel } from '@models/index';

import '@app/server';

describe('User E2E', () => {
  let axiosInstance: AxiosInstance;
  let _sandbox: SinonSandbox;
  let name: string;
  let email: string;
  let password: string;
  let address: string;
  const geoLibStub: Partial<typeof GeoLib> = {};

  before(async () => {
    await connect();
    _sandbox = createSandbox();

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
  });

  after(async () => {
    restore();
    await closeDatabase();
  });

  beforeEach(async () => {
    name = faker.person.firstName();
    email = faker.internet.email();
    password = faker.internet.password();
    address = faker.location.streetAddress({ useFullAddress: true });

    await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      address,
    });

    const loggedUser = await axiosInstance.post('/auth/login', {
      email,
      password,
    });

    axiosInstance = axios.create({
      baseURL: 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loggedUser.data.token}`,
      },
    });
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe('GET /api/user/me', () => {
    it('should get the current user information', async () => {
      const result = await axiosInstance.get('/user/me', {});

      expect(result.data).to.have.property('name', name);
      expect(result.data).to.have.property('email', email);
      expect(result.data).to.have.property('address', address);
    });
  });

  describe('PUT /api/user/me', () => {
    it('should update the current user information', async () => {
      const newName = faker.person.firstName();
      const newAddress = faker.location.streetAddress({ useFullAddress: true });

      const result = await axiosInstance.put('/user/me', {
        name: newName,
        address: newAddress,
      });

      expect(result.data).to.have.property('name', newName);
      expect(result.data).to.have.property('address', newAddress);
    });
  });

  describe('DELETE /api/user/me', () => {
    it('should delete the current user account', async () => {
      const result = await axiosInstance.delete('/user/me', {});

      expect(result.data).to.have.property(
        'message',
        'User deleted successfully',
      );

      const foundUser = await UserModel.findOne({ email });
      expect(foundUser).to.be.null;
    });
  });

  describe('GET /api/user', () => {
    it('should get a list of users with pagination', async () => {
      try {
        const result = await axiosInstance.get('/user', {
          params: {
            page: 1,
            limit: 1,
            order: true,
            shortBy: 'name',
          },
        });

        expect(result.data).to.have.lengthOf(1);
      } catch (error) {
        console.log((error as any).response.data);
      }
    });
  });
});
