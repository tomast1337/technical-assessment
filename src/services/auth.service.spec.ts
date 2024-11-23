import { faker } from '@faker-js/faker';
import { UserModel } from '@models/index';
import * as bcrypt from 'bcryptjs';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';

import '../database';
import GeoLib from '../lib';
import '../server';
import { loginUser, registerUser, updatePassword } from './auth.service';
describe('Auth Service', () => {
  let session;
  let sandbox: sinon.SinonSandbox;
  const geoLibStub: Partial<typeof GeoLib> = {};

  before(async () => {
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
  });

  beforeEach(async () => {
    await session.startTransaction();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
    await session.abortTransaction();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const name = faker.person.firstName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const address = faker.location.streetAddress({ useFullAddress: true });

      const result = await registerUser({ name, email, password, address });

      expect(result).to.have.property(
        'message',
        'User registered successfully',
      );
    });

    it('should throw an error if the user already exists', async () => {
      const name = faker.person.firstName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const address = faker.location.streetAddress({ useFullAddress: true });

      await registerUser({ name, email, password, address });

      try {
        await registerUser({ name, email, password, address });
      } catch (error) {
        expect(error).to.have.property('message', 'User already exists');
      }
    });
  });

  describe('loginUser', () => {
    it('should login a user and return a token and refresh token', async () => {
      const name = faker.person.firstName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const address = faker.location.streetAddress({ useFullAddress: true });

      await registerUser({ name, email, password, address });

      const result = await loginUser({ email, password });

      expect(result).to.have.property('token');
      expect(result).to.have.property('refreshToken');
    });

    it('should throw an error if the credentials are invalid', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      try {
        await loginUser({ email, password });
      } catch (error) {
        expect(error).to.have.property('message', 'Invalid credentials');
      }
    });
  });

  describe('updatePassword', () => {
    it('should update the user password', async () => {
      const name = faker.person.firstName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const address = faker.location.streetAddress({ useFullAddress: true });

      await registerUser({ name, email, password, address });

      const user = await UserModel.findOne({ email });

      const newPassword = faker.internet.password();
      await updatePassword(user._id, newPassword);

      const updatedUser = await UserModel.findById(user._id);
      const isMatch = await bcrypt.compare(newPassword, updatedUser.password);

      expect(isMatch).to.be.true;
    });

    it('should throw an error if the user is not found', async () => {
      const newPassword = faker.internet.password();

      try {
        await updatePassword(faker.string.alphanumeric(10), newPassword);
      } catch (error) {
        expect(error).to.have.property('message', 'User not found');
      }
    });
  });
});
