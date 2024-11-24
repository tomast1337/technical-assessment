import { expect } from 'chai';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as sinon from 'sinon';

import {
  validationBodyMiddleware,
  validationQueryMiddleware,
} from './validationMiddleware';

class TestDto {
  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  limit: number;

  @IsOptional()
  @IsString()
  shortBy?: string;

  @IsOptional()
  @IsBoolean()
  order?: boolean;
}

describe('Validation Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: sinon.SinonStub;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;

  beforeEach(() => {
    req = {};

    res = {
      status: function () {
        return this;
      },
      json: function () {
        return this;
      },
    };

    next = sinon.stub() as unknown as sinon.SinonStub;
    statusStub = sinon.stub(res, 'status').returns(res as any);
    jsonStub = sinon.stub(res, 'json').returns(res as any);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('validationBodyMiddleware', () => {
    it('should call next if validation passes', async () => {
      req.body = { page: 1, limit: 10, shortBy: 'name', order: true };

      const middleware = validationBodyMiddleware(TestDto);
      await middleware(req as Request, res as Response, next as NextFunction);

      expect(next.calledOnce).to.be.true;
      expect(statusStub.called).to.be.false;
      expect(jsonStub.called).to.be.false;
    });

    it('should return 400 if validation fails', async () => {
      req.body = { page: 0, limit: 10, shortBy: 'name', order: true };

      const middleware = validationBodyMiddleware(TestDto);
      await middleware(req as Request, res as Response, next as NextFunction);

      expect(next.called).to.be.false;
      expect(statusStub.calledOnceWith(StatusCodes.BAD_REQUEST)).to.be.true;
      expect(jsonStub.calledOnce).to.be.true;
      expect(jsonStub.firstCall.args[0]).to.have.property('message');
    });
  });

  describe('validationQueryMiddleware', () => {
    it('should call next if validation passes', async () => {
      req.query = { page: '1', limit: '10', shortBy: 'name', order: 'true' };

      const middleware = validationQueryMiddleware(TestDto);
      await middleware(req as Request, res as Response, next as NextFunction);

      expect(next.calledOnce).to.be.true;
      expect(statusStub.called).to.be.false;
      expect(jsonStub.called).to.be.false;
    });

    it('should return 400 if validation fails', async () => {
      req.query = { page: '0', limit: '10', shortBy: 'name', order: 'true' };

      const middleware = validationQueryMiddleware(TestDto);
      await middleware(req as Request, res as Response, next as NextFunction);

      expect(next.called).to.be.false;
      expect(statusStub.calledOnceWith(StatusCodes.BAD_REQUEST)).to.be.true;
      expect(jsonStub.calledOnce).to.be.true;
      expect(jsonStub.firstCall.args[0]).to.have.property('message');
    });
  });
});
