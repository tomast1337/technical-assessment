import { getModelForClass } from '@typegoose/typegoose';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import * as sinon from 'sinon';
import { User } from './user.model';
import { Region } from './region.model';
import lib from '../lib';

const UserModel = getModelForClass(User);

describe('User Model', () => {
  let sandbox: sinon.SinonSandbox;
  let getAddressFromCoordinatesStub: sinon.SinonStub;
  let getCoordinatesFromAddressStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Mock Mongoose methods
    sandbox.stub(mongoose, 'connect').resolves(mongoose);
    sandbox.stub(mongoose.connection, 'close').resolves();

    // Mock lib methods
    getAddressFromCoordinatesStub = sandbox
      .stub(lib, 'getAddressFromCoordinates')
      .resolves('Mock Address');
    getCoordinatesFromAddressStub = sandbox
      .stub(lib, 'getCoordinatesFromAddress')
      .resolves({ lat: 10, lng: 20 });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create a new user with a default _id', async () => {
    const name = 'Test User';
    const email = 'test@example.com';
    const password = 'password';
    const address = '123 Test St';
    const coordinates: [number, number] = [10, 20];
    const userInstance = new UserModel({
      name,
      email,
      password,
      address,
      coordinates,
    });
    const saveStub = sandbox.stub(userInstance, 'save').resolves(userInstance);

    await userInstance.save();

    sandbox.stub(UserModel, 'findOne').resolves(userInstance);

    const foundUser = await UserModel.findOne({ email });
    expect(foundUser).to.exist;
    expect(foundUser!._id.toString()).to.be.a('string');
    expect(foundUser).to.have.property('name', name);
    sinon.assert.calledOnce(saveStub);
  });

  it('should update the address when coordinates are modified', async () => {
    const name = 'Test User';
    const email = 'test@example.com';
    const password = 'password';
    const address = 'Mock Address';
    const coordinates: [number, number] = [10, 20];
    const userInstance = new UserModel({
      name,
      email,
      password,
      address,
      coordinates,
    });
    const saveStub = sandbox.stub(userInstance, 'save').resolves(userInstance);

    userInstance.coordinates = [30, 40];
    await userInstance.save();

    expect(userInstance.address).to.equal('Mock Address');
  });

  it('should update the coordinates when address is modified', async () => {
    const name = 'Test User';
    const email = 'test@example.com';
    const password = 'password';
    const address = '123 Test St';
    const coordinates: [number, number] = [10, 20];
    const userInstance = new UserModel({
      name,
      email,
      password,
      address,
      coordinates,
    });
    const saveStub = sandbox.stub(userInstance, 'save').resolves(userInstance);

    userInstance.address = '456 New St';
    await userInstance.save();

    expect(userInstance.coordinates).to.deep.equal([10, 20]);
  });

  it("should add a region to the user's regions array", async () => {
    const name = 'Test User';
    const email = 'test@example.com';
    const password = 'password';
    const address = '123 Test St';
    const coordinates: [number, number] = [10, 20];
    const userInstance = new UserModel({
      name,
      email,
      password,
      address,
      coordinates,
      regions: [],
    });
    const saveStub = sandbox.stub(userInstance, 'save').resolves(userInstance);

    const regionId = 'test-region-id';
    userInstance.regions.push(regionId as any);
    await userInstance.save();

    expect(userInstance.regions).to.include(regionId);
    sinon.assert.calledOnce(saveStub);
  });
});
