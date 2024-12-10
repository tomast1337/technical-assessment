import bcrypt from 'bcryptjs';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';

import lib from '@app/lib';
import { UserModel } from '@models/index';
import AuthService from '@services/auth.service';

describe('AuthService', () => {
  let findOneStub: sinon.SinonStub;
  let createStub: sinon.SinonStub;
  let hashStub: sinon.SinonStub;
  let compareStub: sinon.SinonStub;
  let signStub: sinon.SinonStub;
  let verifyStub: sinon.SinonStub;
  let updateOneStub: sinon.SinonStub;

  beforeEach(() => {
    findOneStub = sinon.stub(UserModel, 'findOne');
    createStub = sinon.stub(UserModel, 'create');
    hashStub = sinon.stub(bcrypt, 'hash');
    compareStub = sinon.stub(bcrypt, 'compare');
    signStub = sinon.stub(jwt, 'sign');
    verifyStub = sinon.stub(jwt, 'verify');
    updateOneStub = sinon.stub(UserModel, 'updateOne');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      findOneStub.resolves(null);
      hashStub.resolves('hashedPassword');
      createStub.resolves();

      const result = await AuthService.registerUser({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        address: '123 Main St',
      });

      expect(result).to.deep.equal({ message: 'User registered successfully' });
      expect(findOneStub.calledOnce).to.be.true;
      expect(hashStub.calledOnce).to.be.true;
      expect(createStub.calledOnce).to.be.true;
    });

    it('should throw an error if the user already exists', async () => {
      findOneStub.resolves({});

      try {
        await AuthService.registerUser({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          address: '123 Main St',
        });
      } catch (error) {
        expect((error as any).message).to.equal('User already exists');
      }

      expect(findOneStub.calledOnce).to.be.true;
    });

    it('should throw an error if both address and coordinates are provided', async () => {
      findOneStub.resolves(null);

      try {
        await AuthService.registerUser({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          address: '123 Main St',
          coordinates: [25.774, -80.19],
        });
      } catch (error) {
        expect((error as any).message).to.equal(
          'Either address or coordinates should be provided, not both',
        );
      }

      expect(findOneStub.calledOnce).to.be.true;
    });

    it('should throw an error if address is not provided and coordinates are invalid', async () => {
      findOneStub.resolves(null);
      sinon.stub(lib, 'getAddressFromCoordinates').resolves(null as any);

      try {
        await AuthService.registerUser({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          coordinates: [25.774, -80.19],
        });
      } catch (error) {
        expect((error as any).message).to.equal(
          'Invalid address or coordinates',
        );
      }

      expect(findOneStub.calledOnce).to.be.true;
      sinon.restore();
    });

    it('should throw an error if address is not provided and coordinates are not provided', async () => {
      findOneStub.resolves(null);

      try {
        await AuthService.registerUser({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });
      } catch (error) {
        expect((error as any).message).to.equal(
          'Invalid address or coordinates',
        );
      }

      expect(findOneStub.calledOnce).to.be.true;
    });
  });

  describe('loginUser', () => {
    it('should login a user and return tokens', async () => {
      const user = { _id: '1', name: 'John Doe', password: 'hashedPassword' };
      findOneStub.resolves(user);
      compareStub.resolves(true);

      signStub
        .onFirstCall()
        .returns('token')
        .onSecondCall()
        .returns('refreshToken');

      const result = await AuthService.loginUser({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(result).to.deep.equal({
        token: 'token',
        refreshToken: 'refreshToken',
      });

      expect(findOneStub.calledOnce).to.be.true;
      expect(compareStub.calledOnce).to.be.true;
      expect(signStub.calledTwice).to.be.true;
    });

    it('should throw an error if the credentials are invalid', async () => {
      findOneStub.resolves(null);

      try {
        await AuthService.loginUser({
          email: 'john@example.com',
          password: 'password123',
        });
      } catch (error) {
        expect((error as any).message).to.equal('Invalid credentials');
      }

      expect(findOneStub.calledOnce).to.be.true;
    });
  });

  describe('updatePassword', () => {
    it('should update the user password', async () => {
      const user = { _id: '1', password: 'oldPassword' };
      findOneStub.resolves(user);
      hashStub.resolves('newHashedPassword');
      updateOneStub.resolves();

      const result = await AuthService.updatePassword('1', 'newPassword123');

      expect(result).to.deep.equal({
        message: 'Password updated successfully',
      });

      expect(findOneStub.calledOnce).to.be.true;
      expect(hashStub.calledOnce).to.be.true;
      expect(updateOneStub.calledOnce).to.be.true;
    });

    it('should throw an error if the user is not found', async () => {
      findOneStub.resolves(null);

      try {
        await AuthService.updatePassword('1', 'newPassword123');
      } catch (error) {
        expect((error as any).message).to.equal('User not found');
      }

      expect(findOneStub.calledOnce).to.be.true;
    });
  });

  describe('RefreshToken', () => {
    it('should refresh the token and return new tokens', async () => {
      const payload = { id: '1', name: 'John Doe' };
      const user = { _id: '1', name: 'John Doe' };
      verifyStub.resolves(payload);
      findOneStub.resolves(user);

      signStub
        .onFirstCall()
        .returns('newToken')
        .onSecondCall()
        .returns('newRefreshToken');

      const result = await AuthService.RefreshToken('refreshToken');

      expect(result).to.deep.equal({
        token: 'newToken',
        refreshToken: 'newRefreshToken',
      });

      expect(verifyStub.calledOnce).to.be.true;
      expect(findOneStub.calledOnce).to.be.true;
      expect(signStub.calledTwice).to.be.true;
    });

    it('should throw an error if the token is invalid', async () => {
      verifyStub.throws(new Error('Invalid token'));

      try {
        await AuthService.RefreshToken('invalidToken');
      } catch (error) {
        expect((error as any).message).to.equal('Invalid token');
      }

      expect(verifyStub.calledOnce).to.be.true;
    });
  });
});
