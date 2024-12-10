import { expect } from 'chai';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

import { Environment } from '@config/index'; // Adjust the path as necessary

describe('Environment Variables Validation', () => {
  it('should validate environment variables successfully', () => {
    const env = plainToClass(Environment, {
      MONGO_URI: 'mongodb://localhost:27017/test',
      JWT_SECRET: 'testsecret',
      JWT_EXPIRES_IN: '1d',
      JWT_REFRESH_SECRET: 'testrefreshsecret',
      JWT_REFRESH_EXPIRES_IN: '7d',
      PORT: 3000,
      NODE_ENV: 'development',
      GOOGLE_MAPS_API_KEY: 'testapikey',
    });

    const errors = validateSync(env, { skipMissingProperties: false });
    expect(errors.length).to.equal(0);
  });

  it('should fail validation if required environment variables are missing', () => {
    const env = plainToClass(Environment, {
      MONGO_URI: '',
      JWT_SECRET: '',
      JWT_EXPIRES_IN: '',
      JWT_REFRESH_SECRET: '',
      JWT_REFRESH_EXPIRES_IN: '',
      PORT: null,
      NODE_ENV: '',
      GOOGLE_MAPS_API_KEY: '',
    });

    const errors = validateSync(env, { skipMissingProperties: false });
    expect(errors.length).to.be.greaterThan(0);
  });

  it('should fail validation if PORT is not a number', () => {
    const env = plainToClass(Environment, {
      MONGO_URI: 'mongodb://localhost:27017/test',
      JWT_SECRET: 'testsecret',
      JWT_EXPIRES_IN: '1d',
      JWT_REFRESH_SECRET: 'testrefreshsecret',
      JWT_REFRESH_EXPIRES_IN: '7d',
      PORT: 'notanumber',
      NODE_ENV: 'development',
      GOOGLE_MAPS_API_KEY: 'testapikey',
    });

    const errors = validateSync(env, { skipMissingProperties: false });
    expect(errors.length).to.be.greaterThan(0);
  });
});
