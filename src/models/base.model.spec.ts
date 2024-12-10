import 'reflect-metadata';
import { faker } from '@faker-js/faker';
import { Prop, getModelForClass } from '@typegoose/typegoose';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import db from '../database';

import { Base } from './base.model';

// Create a derived class for testing purposes
class TestModel extends Base {
  @Prop({ required: true })
  name!: string;
}

const TestModelClass = getModelForClass(TestModel);

describe('Base Model', () => {
  let session: mongoose.ClientSession;

  before(async () => {
    await db;
    session = await mongoose.startSession();
  });

  after(() => {
    session.endSession();
  });

  beforeEach(() => {
    session.startTransaction();
  });

  afterEach(async () => {
    try {
      await session.abortTransaction();
    } finally {
      session.endSession();
      session = await mongoose.startSession();
    }
  });

  it('should create a new document', async () => {
    const name = faker.person.firstName();

    const result = await TestModelClass.create([{ name }], { session });
    expect(result[0].name).to.equal(name);
  });

  it('should find a document', async () => {
    const name = faker.person.firstName();

    await TestModelClass.create([{ name }], { session });
    const result = await TestModelClass.findOne({ name }).session(session);

    if (!result) {
      throw new Error('User not found');
    }

    expect(result.name).to.equal(name);
  });
});
