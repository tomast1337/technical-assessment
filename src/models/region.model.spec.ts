import 'reflect-metadata';
import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { restore, stub } from 'sinon';

import GeoLib from '../lib';

import { RegionModel, UserModel } from '.';

import '@app/database';
import '@app/server';

describe('Region model', () => {
  let createRegionStub: sinon.SinonStub;
  let findOneRegionStub: sinon.SinonStub;
  let createUserStub: sinon.SinonStub;
  let findOneUserStub: sinon.SinonStub;
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

    createRegionStub = stub(RegionModel, 'create');
    findOneRegionStub = stub(RegionModel, 'findOne');
    createUserStub = stub(UserModel, 'create');
    findOneUserStub = stub(UserModel, 'findOne');
  });

  after(() => {
    restore();
  });

  beforeEach(() => {
    createRegionStub.reset();
    findOneRegionStub.reset();
    createUserStub.reset();
    findOneUserStub.reset();
  });

  it('should create a new region with a default _id', async () => {
    const name = faker.location.city();

    const coordinates: [number, number][][] = [
      [
        [10, 20],
        [30, 40],
        [50, 60],
      ],
    ];

    const user = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      address: faker.location.streetAddress(),
    };

    createUserStub.resolves(user);

    await UserModel.create(user);

    const region = {
      _id: new mongoose.Types.ObjectId().toString(),
      name,
      coordinates,
      user: user._id,
    };

    createRegionStub.resolves(region);

    await RegionModel.create(region);

    findOneRegionStub.resolves(region);

    const foundRegion = await RegionModel.findOne({ name });
    expect(foundRegion).to.exist;
    expect(foundRegion?._id.toString()).to.be.a('string');
    expect(foundRegion).to.have.property('name', name);
  });

  it('should use the provided _id if specified', async () => {
    const name = faker.location.city();
    const _id = new mongoose.Types.ObjectId().toString();

    const coordinates: [number, number][][] = [
      [
        [10, 20],
        [30, 40],
        [50, 60],
      ],
    ];

    const user = new mongoose.Types.ObjectId().toString();

    const regionInstance = {
      _id,
      name,
      coordinates,
      user,
    };

    createRegionStub.resolves(regionInstance);

    await RegionModel.create(regionInstance);

    findOneRegionStub.resolves(regionInstance);

    const foundRegion = await RegionModel.findOne({ name });
    expect(foundRegion).to.exist;
    expect(foundRegion?._id.toString()).to.equal(_id);
    expect(foundRegion).to.have.property('name', name);
  });

  it("should add the region to the user's regions array", async () => {
    const name = faker.location.city();

    const coordinates: [number, number][][] = [
      [
        [10, 20],
        [30, 40],
        [50, 60],
      ],
    ];

    const user = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      address: faker.location.streetAddress(),
      regions: [] as string[],
    };

    createUserStub.resolves(user);

    await UserModel.create(user);

    const userId = user._id.toString();

    const regionInstance = {
      _id: new mongoose.Types.ObjectId().toString(),
      name,
      coordinates,
      user: userId,
    };

    createRegionStub.resolves(regionInstance);

    await RegionModel.create(regionInstance);

    user.regions.push(regionInstance._id);

    findOneUserStub.resolves(user);

    const foundUser = await UserModel.findById(userId);
    expect(foundUser).to.exist;
    expect(foundUser?.regions).to.include(regionInstance._id);
  });
});
