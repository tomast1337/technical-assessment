import 'reflect-metadata';
import { faker } from '@faker-js/faker';
import { Prop, getModelForClass } from '@typegoose/typegoose';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { restore, stub } from 'sinon';
import '../database';
import '../server';

import { Base } from './base.model';

// Create a derived class for testing purposes
class TestModel extends Base {
  @Prop({ required: true })
  name!: string;
}

const TestModelClass = getModelForClass(TestModel);

describe('Base Model', () => {
  let session: mongoose.ClientSession;
  let createStub: sinon.SinonStub;
  let findOneStub: sinon.SinonStub;

  before(() => {
    session = {
      startTransaction: stub(),
      abortTransaction: stub(),
      endSession: stub(),
    } as unknown as mongoose.ClientSession;

    createStub = stub(TestModelClass, 'create');
    findOneStub = stub(TestModelClass, 'findOne');
  });

  after(() => {
    restore();
  });

  beforeEach(() => {
    session.startTransaction();
  });

  afterEach(() => {
    createStub.reset();
    findOneStub.reset();
    session.abortTransaction();
  });

  it('should create a new document', async () => {
    const name = faker.person.firstName();
    const testUser = [{ name }];
    createStub.resolves(testUser);

    const result = await TestModelClass.create([{ name }]);
    expect(result[0].name).to.equal(name);
    expect(createStub.calledOnce).to.be.true;
  });

  it('should find a document', async () => {
    const name = faker.person.firstName();
    const testUser = { name };
    findOneStub.resolves(testUser);

    await TestModelClass.create([{ name }]);
    const result = await TestModelClass.findOne({ name });

    if (!result) {
      throw new Error('User not found');
    }

    expect(result.name).to.equal(name);
    expect(findOneStub.calledOnce).to.be.true;
  });
});
