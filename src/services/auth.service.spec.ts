import { faker } from '@faker-js/faker';
import { UserModel } from '@models/index';
import * as bcrypt from 'bcryptjs';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';

import GeoLib from '../lib';
import { loginUser, me, registerUser, updatePassword } from './auth.service';
describe('Auth Service', () => {
  let sandbox: sinon.SinonSandbox;
  const geoLibStub: Partial<typeof GeoLib> = {};

  beforeEach(() => {
    sandbox = sinon.createSandbox();

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

  afterEach(() => {
    sandbox.restore();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const name = faker.person.firstName() + ' ' + faker.person.lastName();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const address = faker.location.streetAddress();

      (UserModel.findOne as sinon.SinonStub).resolves(null);
      const userInstance = new UserModel({ name, email, password, address });
      (userInstance.save as sinon.SinonStub).resolves(userInstance);

      const result = await registerUser({ name, email, password, address });

      expect(result).to.have.property(
        'message',
        'User registered successfully',
      );

      sinon.assert.calledOnce(userInstance.save as sinon.SinonStub);

      sinon.assert.calledOnce(
        GeoLib.getCoordinatesFromAddress as sinon.SinonStub,
      );
    });

    it('should throw an error if the user already exists', async () => {
      const email = faker.internet.email();

      sandbox.stub(UserModel, 'findOne').resolves({
        name: faker.person.firstName(),
        email,
        password: faker.internet.password(),
        address: faker.location.streetAddress(),
      });

      try {
        await registerUser({
          name: faker.person.firstName(),
          email,
          password: faker.internet.password(),
          address: faker.location.streetAddress(),
        });
      } catch (error) {
        expect(error).to.have.property('message', 'User already exists');
      }
    });
  });

  describe('loginUser', () => {
    it('should login a user and return a token', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const hashedPassword = await bcrypt.hash(password, 10);

      sandbox.stub(UserModel, 'findOne').resolves({
        _id: new mongoose.Types.ObjectId(),
        name: faker.person.firstName(),
        email,
        password: hashedPassword,
      });

      const result = await loginUser({ email, password });

      expect(result).to.have.property('token');
    });

    it('should throw an error if the credentials are invalid', async () => {
      sandbox.stub(UserModel, 'findOne').resolves(null);

      try {
        await loginUser({
          email: faker.internet.email(),
          password: faker.internet.password(),
        });
      } catch (error) {
        expect(error).to.have.property('message', 'Invalid credentials');
      }
    });
  });

  describe('me', () => {
    it('should return the user details', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      const user = {
        _id: new mongoose.Types.ObjectId(),
        name: faker.person.firstName() + ' ' + faker.person.lastName(),
        email,
        password,
      };

      sandbox.stub(UserModel, 'findOne').resolves(user);

      const result = await me(user._id.toString());

      expect(result).to.have.property('email', email);
    });

    it('should throw an error if the user is not found', async () => {
      sandbox.stub(UserModel, 'findOne').resolves(null);

      try {
        await me(new mongoose.Types.ObjectId().toString());
      } catch (error) {
        expect(error).to.have.property('message', 'User not found');
      }
    });
  });

  describe('updatePassword', () => {
    it('should update the user password', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      const user = {
        _id: new mongoose.Types.ObjectId(),
        name: faker.person.firstName(),
        email,
        password: bcrypt.hashSync(password, 10),
        address: faker.location.streetAddress(),
      };

      sandbox.stub(UserModel, 'findOne').resolves(user);

      const newPassword = faker.internet.password();
      const result = await updatePassword(user._id.toString(), newPassword);

      expect(result).to.have.property(
        'message',
        'Password updated successfully',
      );
    });

    it('should throw an error if the user is not found', async () => {
      sandbox.stub(UserModel, 'findOne').resolves(null);

      try {
        await updatePassword(
          new mongoose.Types.ObjectId().toString(),
          faker.internet.password(),
        );
      } catch (error) {
        expect(error).to.have.property('message', 'User not found');
      }
    });
  });
});
