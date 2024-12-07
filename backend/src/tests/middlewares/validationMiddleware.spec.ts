import 'reflect-metadata';
import { expect } from 'chai';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SinonStub, restore, stub } from 'sinon';

import {
  validationBodyMiddleware,
  validationQueryMiddleware,
} from '@middlewares/validationMiddleware';

class TestDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsString()
  shortBy?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  order?: boolean;
}

class NestedDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  age: number;
}

class ParentDto {
  @Type(() => NestedDto)
  nested: NestedDto;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;
}

describe('Validation Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: SinonStub;
  let statusStub: SinonStub;
  let jsonStub: SinonStub;

  beforeEach(() => {
    req = {};

    res = {
      status: function () {
        return this;
      },
      json: function () {
        return this;
      },
    } as any;

    next = stub() as unknown as SinonStub;
    statusStub = stub(res, 'status').returns(res as any);
    jsonStub = stub(res, 'json').returns(res as any);
  });

  afterEach(() => {
    restore();
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

    it('should validate nested objects', async () => {
      req.body = { nested: { name: 'John Doe', age: 30 }, page: 1 };

      const middleware = validationBodyMiddleware(ParentDto);
      await middleware(req as Request, res as Response, next as NextFunction);

      expect(next.calledOnce).to.be.true;
      expect(statusStub.called).to.be.false;
      expect(jsonStub.called).to.be.false;
    });

    it('should return 400 if nested object validation fails', async () => {
      req.body = { nested: { name: 'John Doe', age: 0 }, page: 0 };

      const middleware = validationBodyMiddleware(ParentDto);
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
