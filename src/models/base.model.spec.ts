import { Prop, getModelForClass } from '@typegoose/typegoose';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';

import { Base } from './base.model'; // Adjust the path as necessary

// Create a derived class for testing purposes
class TestModel extends Base {
  @Prop({ required: true })
  name!: string;
}

const TestModelClass = getModelForClass(TestModel);

describe('Base Model', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Mock Mongoose methods
    sandbox.stub(mongoose, 'connect').resolves(mongoose);
    sandbox.stub(mongoose.connection, 'close').resolves();
    sandbox.stub(TestModelClass, 'findOne').resolves();
    sandbox.stub(TestModelClass, 'deleteMany').resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create a new document with a default _id', async () => {
    const name = 'Test Name';
    const testDoc = new TestModelClass({ name });
    const saveStub = sandbox.stub(testDoc, 'save').resolves(testDoc);

    await testDoc.save();

    (TestModelClass.findOne as sinon.SinonStub).resolves(testDoc);

    const foundDoc = await TestModelClass.findOne({ name });
    expect(foundDoc).to.exist;
    expect(foundDoc).to.have.property('_id').that.is.a('string');
    expect(foundDoc).to.have.property('name', name);
    sinon.assert.calledOnce(saveStub);
  });

  it('should use the provided _id if specified', async () => {
    const name = 'Test Name';
    const customId = new mongoose.Types.ObjectId().toString();
    const testDoc = new TestModelClass({ _id: customId, name });
    const saveStub = sandbox.stub(testDoc, 'save').resolves(testDoc);

    await testDoc.save();

    (TestModelClass.findOne as sinon.SinonStub).resolves(testDoc);

    const foundDoc = await TestModelClass.findOne({ name });
    expect(foundDoc).to.exist;
    expect(foundDoc).to.have.property('_id', customId);
    expect(foundDoc).to.have.property('name', name);
    sinon.assert.calledOnce(saveStub);
  });
});
