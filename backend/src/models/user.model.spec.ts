import 'reflect-metadata';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import { restore, stub } from 'sinon';
import '@app/database';
import '@app/server';

import GeoLib from '../lib';

import { UserModel } from '.';

describe('User model', () => {
  let createUserStub: sinon.SinonStub;
  let findOneUserStub: sinon.SinonStub;
  let deleteOneUserStub: sinon.SinonStub;
  let updateUserStub: sinon.SinonStub;
  const geoLibStub: Partial<typeof GeoLib> = {};

  before(() => {
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

    createUserStub = stub(UserModel, 'create');
    findOneUserStub = stub(UserModel, 'findOne');
    deleteOneUserStub = stub(UserModel, 'deleteOne');
    updateUserStub = stub(UserModel, 'findOneAndUpdate');
  });

  after(() => {
    restore();
  });

  beforeEach(() => {
    createUserStub.reset();
    findOneUserStub.reset();
    deleteOneUserStub.reset();
    updateUserStub.reset();
  });

  it('should create a new document', async () => {
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const address = faker.location.streetAddress({ useFullAddress: true });

    const user = { name, email, password, address };
    createUserStub.resolves(user);

    const result = await UserModel.create({ name, email, password, address });
    expect(result.name).to.equal(name);
    expect(result.email).to.equal(email);
    expect(result.password).to.equal(password);
    expect(createUserStub.calledOnce).to.be.true;
  });

  it('should find a document', async () => {
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const address = faker.location.streetAddress({ useFullAddress: true });

    const user = { name, email, password, address };
    findOneUserStub.resolves(user);

    await UserModel.create({ name, email, password, address });
    const result = await UserModel.findOne({ name });

    if (!result) {
      throw new Error('User not found');
    }

    expect(result.name).to.equal(name);
    expect(result.email).to.equal(email);
    expect(result.password).to.equal(password);
    expect(findOneUserStub.calledOnce).to.be.true;
  });

  it('should update a document', async () => {
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const address = faker.location.streetAddress({ useFullAddress: true });

    const user = { name, email, password, address };
    createUserStub.resolves(user);

    const createdUser = await UserModel.create({
      name,
      email,
      password,
      address,
    });

    const updatedName = faker.person.firstName();
    const updatedUser = { ...createdUser, name: updatedName };
    updateUserStub.resolves(updatedUser);

    const result = await UserModel.findOneAndUpdate(
      { _id: createdUser._id },
      { name: updatedName },
      { new: true },
    );

    expect(result).to.exist;
    expect(result?.name).to.equal(updatedName);
    expect(updateUserStub.calledOnce).to.be.true;
  });

  it('should delete a document', async () => {
    const name = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const address = faker.location.streetAddress({ useFullAddress: true });

    const user = { name, email, password, address };
    createUserStub.resolves(user);

    const createdUser = await UserModel.create({
      name,
      email,
      password,
      address,
    });

    deleteOneUserStub.resolves({ deletedCount: 1 });

    await UserModel.deleteOne({ _id: createdUser._id });
  });
});
