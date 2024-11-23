import { getModelForClass } from '@typegoose/typegoose';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import * as sinon from 'sinon';
import { Region } from './region.model';
import { UserModel } from './index';

const RegionModel = getModelForClass(Region);

describe('Region Model', () => {
  let sandbox: sinon.SinonSandbox;
  let userFindOneStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Mock Mongoose methods
    sandbox.stub(mongoose, 'connect').resolves(mongoose);
    sandbox.stub(mongoose.connection, 'close').resolves();

    userFindOneStub = sandbox.stub(UserModel, 'findOne').resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create a new region with a default _id', async () => {
    const name = 'Test Region';
    const coordinates: [number, number][][] = [
      [
        [10, 20],
        [30, 40],
        [50, 60],
      ],
    ];
    const user = new Types.ObjectId().toString();
    const regionInstance = new RegionModel({ name, coordinates, user });
    const saveStub = sandbox
      .stub(regionInstance, 'save')
      .resolves(regionInstance);

    await regionInstance.save();

    sandbox.stub(RegionModel, 'findOne').resolves(regionInstance);

    const foundRegion = await RegionModel.findOne({ name });
    expect(foundRegion).to.exist;
    expect(foundRegion!._id.toString()).to.be.a('string');
    expect(foundRegion).to.have.property('name', name);
    sinon.assert.calledOnce(saveStub);
  });

  it('should use the provided _id if specified', async () => {
    const name = 'Test Region';
    const coordinates: [number, number][][] = [
      [
        [10, 20],
        [30, 40],
        [50, 60],
      ],
    ];
    const user = new Types.ObjectId().toString();
    const customId = new Types.ObjectId().toString();
    const regionInstance = new RegionModel({
      _id: customId,
      name,
      coordinates,
      user,
    });
    const saveStub = sandbox
      .stub(regionInstance, 'save')
      .resolves(regionInstance);

    await regionInstance.save();

    sandbox.stub(RegionModel, 'findOne').resolves(regionInstance);

    const foundRegion = await RegionModel.findOne({ name });
    expect(foundRegion).to.exist;
    expect(foundRegion!._id.toString()).to.equal(customId);
    expect(foundRegion).to.have.property('name', name);
    sinon.assert.calledOnce(saveStub);
  });

  it("should add the region to the user's regions array", async () => {
    const name = 'Test Region';
    const coordinates: [number, number][][] = [
      [
        [10, 20],
        [30, 40],
        [50, 60],
      ],
    ];
    const user = 'test-user-id';
    const regionInstance = new RegionModel({ name, coordinates, user });
    const saveStub = sandbox
      .stub(regionInstance, 'save')
      .resolves(regionInstance);

    const userInstance = new UserModel({
      _id: user,
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      regions: [regionInstance._id.toString()],
    });
    userFindOneStub.resolves(userInstance);

    const userSaveStub = sandbox
      .stub(userInstance, 'save')
      .resolves(userInstance);

    await regionInstance.save();

    expect(userInstance.regions).to.include(regionInstance._id.toString());
  });
});
