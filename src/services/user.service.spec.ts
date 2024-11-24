import { faker } from '@faker-js/faker';
import { UserModel } from '@models/index';
import { PagingDto } from '@views/Paging.dto';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';

import '../database';
import GeoLib from '../lib';
import UserService from './user.service';

const { deleteUser, getUserById, getUsers, updateUser } = UserService;

describe('User Service', () => {
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
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await session.startTransaction();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
    await session.abortTransaction();
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const user = await UserModel.create({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        address: faker.location.streetAddress(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      });

      const foundUser = await getUserById(user, user._id.toString());
      expect(foundUser).to.exist;
      expect(foundUser._id.toString()).to.equal(user._id.toString());
    });

    it('should throw an error if the user is not found', async () => {
      try {
        await getUserById(null, faker.string.alphanumeric(10));
      } catch (error) {
        expect(error).to.have.property('message', 'User not found');
      }
    });
  });

  describe('updateUser', () => {
    it('should update a user by ID', async () => {
      const user = await UserModel.create({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        address: faker.location.streetAddress(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      });

      const updateData = { name: faker.person.firstName() };

      const updatedUser = await updateUser(
        user,
        user._id.toString(),
        updateData,
      );

      expect(updatedUser).to.exist;
      expect(updatedUser.name).to.equal(updateData.name);
    });

    it('should throw an error if the user is not found', async () => {
      try {
        await updateUser(null, faker.string.alphanumeric(10), {
          name: faker.person.firstName(),
        });
      } catch (error) {
        expect(error).to.have.property('message', 'User not found');
      }
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const user = await UserModel.create({
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        address: faker.location.streetAddress(),
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      });

      const deletedUser = await deleteUser(user, user._id.toString());
      expect(deletedUser).to.exist;
      expect(deletedUser._id.toString()).to.equal(user._id.toString());
    });

    it('should throw an error if the user is not found', async () => {
      try {
        await deleteUser(null, faker.string.alphanumeric(10));
      } catch (error) {
        expect(error).to.have.property('message', 'User not found');
      }
    });
  });

  describe('getUsers', () => {
    it('should return a list of users with pagination', async () => {
      const users = await UserModel.insertMany([
        {
          name: faker.person.firstName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          address: faker.location.streetAddress(),
          coordinates: [faker.location.longitude(), faker.location.latitude()],
        },
        {
          name: faker.person.firstName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          address: faker.location.streetAddress(),
          coordinates: [faker.location.longitude(), faker.location.latitude()],
        },
      ]);

      const query: PagingDto = {
        page: 1,
        limit: 1,
        order: true,
        shortBy: 'name',
      };

      const result = await getUsers(query);
      expect(result).to.have.lengthOf(1);
      expect(result[0]._id.toString()).to.equal(users[0]._id.toString());
    });
  });
});
