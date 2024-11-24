import { faker } from '@faker-js/faker';
import { UserModel } from '@models/index';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import * as bcrypt from 'bcryptjs';
import axios from 'axios';
import '../database';
import GeoLib from '../lib';
import '../server';

describe('User E2E', () => {
  let axiosInstance;
  let session;
  let sandbox: sinon.SinonSandbox;
  let token;
  const geoLibStub: Partial<typeof GeoLib> = {};

  before(async () => {
    axiosInstance = axios.create({
      baseURL: 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    sandbox = sinon.createSandbox();
    session = await mongoose.startSession();
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
    await session.endSession();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await session.startTransaction();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
    await session.abortTransaction();
  });

  describe('GET /api/user/me', () => {
    it('should get the current user information', async () => {
      const name = faker.person.firstName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const address = faker.location.streetAddress({ useFullAddress: true });

      await UserModel.create({ name, email, password: bcrypt.hashSync(password, 10), address });

      const loggedUser = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      const result = await axiosInstance.get('/user/me', {
        headers: {
          Authorization: `Bearer ${loggedUser.data.token}`,
        },
      });

      expect(result.data).to.have.property('name', name);
      expect(result.data).to.have.property('email', email);
      expect(result.data).to.have.property('address', address);
    });
  });

  describe('PUT /api/user/me', () => {
    it('should update the current user information', async () => {
      const name = faker.person.firstName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const address = faker.location.streetAddress({ useFullAddress: true });

      await UserModel.create({ name, email, password: bcrypt.hashSync(password, 10), address });

      const loggedUser = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      const newName = faker.person.firstName();
      const newAddress = faker.location.streetAddress({ useFullAddress: true });

      const result = await axiosInstance.put('/user/me', {
        name: newName,
        address: newAddress,
      }, {
        headers: {
          Authorization: `Bearer ${loggedUser.data.token}`,
        },
      });

      expect(result.data).to.have.property('name', newName);
      expect(result.data).to.have.property('address', newAddress);
    });
  });

  describe('DELETE /api/user/me', () => {
    it('should delete the current user account', async () => {
      const name = faker.person.firstName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const address = faker.location.streetAddress({ useFullAddress: true });

      await UserModel.create({ name, email, password: bcrypt.hashSync(password, 10), address });

      const loggedUser = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      const result = await axiosInstance.delete('/user/me', {
        headers: {
          Authorization: `Bearer ${loggedUser.data.token}`,
        },
      });

      expect(result.data).to.have.property('message', 'User deleted successfully');

      const foundUser = await UserModel.findOne({ email });
      expect(foundUser).to.be.null;
    });
  });

  describe('GET /api/user', () => {
    it('should get a list of users with pagination', async () => {
    
        const password = faker.internet.password();
    
        const users = await UserModel.insertMany([
        {
          name: faker.person.firstName(),
          email: faker.internet.email(),
          password: bcrypt.hashSync(password, 10),
          address: faker.location.streetAddress({ useFullAddress: true }),
        },
        {
          name: faker.person.firstName(),
          email: faker.internet.email(),
          password: bcrypt.hashSync(faker.internet.password(), 10),
          address: faker.location.streetAddress({ useFullAddress: true }),
        },
      ]);

      const loggedUser = await axiosInstance.post('/auth/login', {
        email: users[0].email,
        password: password,
      });

     try{
         const result = await axiosInstance.get('/user', {
        headers: {
          Authorization: `Bearer ${loggedUser.data.token}`,
        },
        params: {
          page: 1,
          limit: 1,
          order: true,
          shortBy: 'name',
        },
      });
      expect(result.data).to.have.lengthOf(1);
     } catch (error) {
        console.log(error.response.data);
      }

    });
  });
});