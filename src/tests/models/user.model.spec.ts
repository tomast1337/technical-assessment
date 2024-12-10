import '@app/database';
import '@app/server';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import 'reflect-metadata';
import mongoose from 'mongoose';
import { restore, stub } from 'sinon';

import GeoLib from '@app/lib';
import { UserModel } from '@models/index';

describe('User model', () => {
  let session: mongoose.ClientSession;

  const geoLibStub: Partial<typeof GeoLib> = {};

  before(async () => {
    session = await mongoose.startSession();
  });

  after(() => {
    session.endSession();
  });

  beforeEach(() => {
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

    session.startTransaction();
  });

  afterEach(async () => {
    try {
      await session.abortTransaction();
    } finally {
      session.endSession();
      session = await mongoose.startSession();
      restore();
    }
  });

  it('should create a new document', async () => {
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const address = faker.location.streetAddress({ useFullAddress: true });

    const user = { name, email, password, address };

    const result = (
      await UserModel.create([user], {
        session,
      })
    )[0];

    expect(result.name).to.equal(name);
    expect(result.email).to.equal(email);
    expect(result.password).to.equal(password);
  });

  it('should find a document', async () => {
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const address = faker.location.streetAddress({ useFullAddress: true });

    const user = { name, email, password, address };

    await UserModel.create([user], { session });
    const result = await UserModel.findOne({ name }).session(session);

    if (!result) {
      throw new Error('User not found');
    }

    expect(result.name).to.equal(name);
    expect(result.email).to.equal(email);
    expect(result.password).to.equal(password);
  });

  it('should update a document', async () => {
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const address = faker.location.streetAddress({ useFullAddress: true });

    const user = { name, email, password, address };

    const createdUser = (await UserModel.create([user], { session }))[0];

    const updatedName = faker.person.firstName();

    const result = await UserModel.findOneAndUpdate(
      { _id: createdUser._id },
      { name: updatedName },
      { new: true, session },
    );

    expect(result).to.exist;
    expect(result?.name).to.equal(updatedName);
  });

  it('should delete a document', async () => {
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const address = faker.location.streetAddress({ useFullAddress: true });

    const user = { name, email, password, address };

    const createdUser = (await UserModel.create([user], { session }))[0];

    await UserModel.deleteOne({ _id: createdUser._id }, { session });
  });
});
