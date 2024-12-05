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

  it('should create a new region with a default _id', async () => {
    const name = faker.location.city();

    const coordinates: [number, number][][] = [
      [
        [10, 20],
        [30, 40],
        [50, 60],
        [10, 20],
      ],
    ];

    const user = {
      _id: new mongoose.Types.ObjectId(),
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      address: faker.location.streetAddress(),
    };

    await UserModel.create([user], { session });

    const region = {
      _id: new mongoose.Types.ObjectId(),
      name,
      geometry: {
        type: 'Polygon',
        coordinates,
      },
      user: user._id,
    };

    await RegionModel.create([region], { session });

    const foundRegion = await RegionModel.findOne({ name }).session(session);
    expect(foundRegion).to.exist;
    expect(foundRegion?._id.toString()).to.be.a('string');
    expect(foundRegion).to.have.property('name', name);
  });

  it('should close the polygon if it is not closed', async () => {
    const name = faker.location.city();

    const coordinates: [number, number][] = [
      [10, 20],
      [30, 40],
      [50, 60],
      // The polygon is not closed
    ];

    const user = {
      _id: new mongoose.Types.ObjectId(),
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      address: faker.location.streetAddress(),
    };

    await UserModel.create([user], { session });

    const region = {
      _id: new mongoose.Types.ObjectId(),
      name,
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates],
      },
      user: user._id,
    };

    await RegionModel.create([region], { session });

    const foundRegion = await RegionModel.findOne({ name }).session(session);
    expect(foundRegion).to.exist;
    expect(foundRegion?.geometry.coordinates[0]).to.have.lengthOf(4);
    expect(foundRegion?.geometry.coordinates[0][3]).to.deep.equal([10, 20]);
  });

  it('should use the provided _id if specified', async () => {
    const user = {
      _id: new mongoose.Types.ObjectId(),
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      address: faker.location.streetAddress(),
    };

    await UserModel.create([user], { session });

    const coordinates: [number, number][] = [
      [10, 20],
      [30, 40],
      [50, 60],
      [10, 20],
    ];

    const regionInstance = {
      _id: new mongoose.Types.ObjectId(), // Cast to ObjectId
      name: faker.location.city(),
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates],
      },
      user: user._id,
    };

    await RegionModel.create([regionInstance], { session });

    const foundRegion = await RegionModel.findOne({
      name: regionInstance.name,
    }).session(session);

    expect(foundRegion).to.exist;
    expect(foundRegion?._id.toString()).to.equal(regionInstance._id.toString());
    expect(foundRegion).to.have.property('name', regionInstance.name);
  });

  it("should add the region to the user's regions array", async () => {
    const name = faker.location.city();

    const coordinates: [number, number][] = [
      [10, 20],
      [30, 40],
      [50, 60],
      [10, 20],
    ];

    const user = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      address: faker.location.streetAddress(),
    };

    await UserModel.create([user], { session });

    const region = {
      _id: new mongoose.Types.ObjectId().toString(),
      name,
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates],
      },
      user: user._id,
    };

    await RegionModel.create([region], { session });

    // Ensure the session is passed correctly to the findOne method
    const foundUser = await UserModel.findOne({ _id: user._id }).session(
      session,
    );

    if (!foundUser) {
      throw new Error('User not found');
    }

    expect(foundUser).to.exist;
    expect(foundUser.regions).to.be.an('array');
    expect(foundUser.regions).to.include(region._id);
  });
});
