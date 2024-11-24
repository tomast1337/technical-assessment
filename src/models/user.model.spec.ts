import 'reflect-metadata';

import { expect } from 'chai';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';

import '../database';
import '../server';
import { faker } from '@faker-js/faker';

import GeoLib from '../lib';

import { UserModel } from '.';

describe('User model', () => {
  let user;
  let session;
  const geoLibStub: Partial<typeof GeoLib> = {};

  before(async () => {
    geoLibStub.getAddressFromCoordinates = sinon
      .stub(GeoLib, 'getAddressFromCoordinates')
      .resolves(faker.location.streetAddress({ useFullAddress: true }));

    geoLibStub.getCoordinatesFromAddress = sinon
      .stub(GeoLib, 'getCoordinatesFromAddress')
      .resolves({
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      });

    session = await mongoose.startSession();
  });

  after(() => {
    sinon.restore();
    session.endSession();
  });

  beforeEach(() => {
    session.startTransaction();
  });

  afterEach(() => {
    UserModel.deleteMany({});
    session.commitTransaction();
  });

  it('should create a new document', async () => {
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const address = faker.location.streetAddress({ useFullAddress: true });
    const user = await UserModel.create({ name, email, password, address });
    expect(user.name).to.equal(name);
    expect(user.email).to.equal(email);
    expect(user.password).to.equal(password);
  });

  it('should find a document', async () => {
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const address = faker.location.streetAddress({ useFullAddress: true });
    await UserModel.create({ name, email, password, address });
    const user = await UserModel.findOne({ name: name }, null);
    expect(user.name).to.equal(name);
    expect(user.email).to.equal(email);
    expect(user.password).to.equal(password);
  });

  it('should update a document', async () => {
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const address = faker.location.streetAddress({ useFullAddress: true });
    const user = await UserModel.create({ name, email, password, address });
    const updatedName = faker.person.firstName();
    user.name = updatedName;
    await user.save();
    expect(user.name).to.equal(updatedName);
  });

  it('should delete a document', async () => {
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const address = faker.location.streetAddress({ useFullAddress: true });
    const user = await UserModel.create({ name, email, password, address });

    await UserModel.deleteOne({
      _id: user._id,
    });

    const foundUser = await UserModel.findOne({ name });
    expect(foundUser).to.be.null;
  });
});
