import { expect } from 'chai';
import sinon from 'sinon';

import { UserModel } from '@models/index';
import { User } from '@models/user.model';

import UserService from './user.service';
import { PagingDto } from '../views/Paging.dto';

describe('UserService', () => {
  let findByIdStub: sinon.SinonStub;
  let findByIdAndUpdateStub: sinon.SinonStub;
  let findByIdAndDeleteStub: sinon.SinonStub;
  let findStub: sinon.SinonStub;

  beforeEach(() => {
    findByIdStub = sinon.stub(UserModel, 'findById').returns({
      select: sinon.stub().resolves({ _id: 'userId', name: 'John Doe' }),
    } as any);

    findByIdAndUpdateStub = sinon.stub(UserModel, 'findByIdAndUpdate').returns({
      select: sinon.stub().resolves({ _id: 'userId', name: 'Updated Name' }),
    } as any);

    findByIdAndDeleteStub = sinon
      .stub(UserModel, 'findByIdAndDelete')
      .resolves({
        _id: 'userId',
        name: 'John Doe',
      });

    findStub = sinon.stub(UserModel, 'find').returns({
      sort: sinon.stub().returnsThis(),
      skip: sinon.stub().returnsThis(),
      limit: sinon.stub().returnsThis(),
      select: sinon.stub().resolves([{ _id: 'userId', name: 'John Doe' }]),
    } as any);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getUserById', () => {
    it('should return a user if found', async () => {
      const user = { _id: 'userId', name: 'John Doe' };

      findByIdStub.returns({
        select: sinon.stub().resolves(user),
      } as any);

      const result = await UserService.getUserById(user as User, 'userId');

      expect(result).to.deep.equal(user);
      expect(findByIdStub.calledOnce).to.be.true;
    });

    it('should throw an error if the user is not found', async () => {
      findByIdStub.returns({
        select: sinon.stub().resolves(null),
      } as any);

      try {
        await UserService.getUserById({} as User, 'userId');
      } catch (error) {
        expect((error as any).message).to.equal('User not found');
      }

      expect(findByIdStub.calledOnce).to.be.true;
    });
  });

  describe('updateUser', () => {
    it('should update a user if found', async () => {
      const updateData = { name: 'Updated Name' };
      const updatedUser = { _id: 'userId', ...updateData };

      findByIdAndUpdateStub.returns({
        select: sinon.stub().resolves(updatedUser),
      } as any);

      const result = await UserService.updateUser(
        {} as User,
        'userId',
        updateData,
      );

      expect(result).to.deep.equal(updatedUser);
      expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    });

    it('should throw an error if the user is not found', async () => {
      findByIdAndUpdateStub.returns({
        select: sinon.stub().resolves(null),
      } as any);

      try {
        await UserService.updateUser({} as User, 'userId', {
          name: 'Updated Name',
        });
      } catch (error) {
        expect((error as any).message).to.equal('User not found');
      }

      expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    });
  });

  describe('deleteUser', () => {
    it('should delete a user if found', async () => {
      const user = { _id: 'userId', name: 'John Doe' };
      findByIdAndDeleteStub.resolves(user);

      const result = await UserService.deleteUser({} as User, 'userId');

      expect(result).to.deep.equal(user);
      expect(findByIdAndDeleteStub.calledOnce).to.be.true;
    });

    it('should throw an error if the user is not found', async () => {
      findByIdAndDeleteStub.resolves(null);

      try {
        await UserService.deleteUser({} as User, 'userId');
      } catch (error) {
        expect((error as any).message).to.equal('User not found');
      }

      expect(findByIdAndDeleteStub.calledOnce).to.be.true;
    });
  });

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      const users = [{ _id: 'userId', name: 'John Doe' }];

      findStub.returns({
        sort: sinon.stub().returnsThis(),
        skip: sinon.stub().returnsThis(),
        limit: sinon.stub().returnsThis(),
        select: sinon.stub().resolves(users),
      } as any);

      const query: PagingDto = { page: 1, limit: 10 };
      const result = await UserService.getUsers(query);

      expect(result).to.deep.equal(users);
      expect(findStub.calledOnce).to.be.true;
    });
  });
});
