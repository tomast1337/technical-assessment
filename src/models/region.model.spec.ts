import 'reflect-metadata';

import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';

import { RegionModel, UserModel } from '.';

import '../database';
import GeoLib from '../lib';
import '../server';

describe('Region model', () => {
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

  after(async () => {
    sinon.restore();
    await session.endSession();
  });

  beforeEach(async () => {
    await session.startTransaction();
  });

  afterEach(async () => {
    await RegionModel.deleteMany({});
    await UserModel.deleteMany({});
    await session.abortTransaction();
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

    const user = await UserModel.create({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      address: faker.location.streetAddress,
    });

    await RegionModel.create({
      name,
      coordinates,
      user,
    });

    const foundRegion = await RegionModel.findOne({ name });
    expect(foundRegion).to.exist;
    expect(foundRegion!._id.toString()).to.be.a('string');
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
    const regionInstance = new RegionModel({ name, coordinates, user, _id });

    await regionInstance.save();

    const foundRegion = await RegionModel.findOne({ name });
    expect(foundRegion).to.exist;
    expect(foundRegion!._id.toString()).to.equal(_id);
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

    const user = await UserModel.create({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      address: faker.location.streetAddress(),
    });

    const userId = user._id.toString();

    const regionInstance = new RegionModel({ name, coordinates, user: userId });
    await regionInstance.save();

    const foundUser = await UserModel.findById(userId);
    expect(foundUser).to.exist;
    expect(foundUser!.regions).to.include(regionInstance._id);
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

    const user = await UserModel.create({
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      address: faker.location.streetAddress(),
    });

    const userId = user._id.toString();

    const regionInstance = new RegionModel({ name, coordinates, user: userId });
    await regionInstance.save();

    const foundUser = await UserModel.findById(userId);
    expect(foundUser).to.exist;
    expect(foundUser!.regions).to.include(regionInstance._id);
  });
});
