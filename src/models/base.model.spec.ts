import 'reflect-metadata';

import { expect } from 'chai';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';

import '../database';
import '../server';
import { Base } from './base.model';
import { Prop, getModelForClass } from '@typegoose/typegoose';
import { faker } from '@faker-js/faker';

// Create a derived class for testing purposes
class TestModel extends Base {
  @Prop({ required: true })
  name!: string;
}

const TestModelClass = getModelForClass(TestModel);

describe('Base Model', () => {
  let session;

  before(async () => {
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
    TestModelClass.deleteMany({});
    session.abortTransaction();
  });

  it('should create a new document', async () => {
    const name = faker.person.firstName();
    const testUser = await TestModelClass.create([{ name: name }]);
    expect(testUser[0].name).to.equal(name);
  });

  it('should find a document', async () => {
    const name = faker.person.firstName();
    await TestModelClass.create([{ name: name }]);
    const testUser = await TestModelClass.findOne({ name: name }, null);
    expect(testUser.name).to.equal(name);
  });
});
