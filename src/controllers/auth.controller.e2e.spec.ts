import { faker } from '@faker-js/faker';
import { UserModel } from '@models/index';
import * as bcrypt from 'bcryptjs';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';

import axios from 'axios';
import '../database';
import GeoLib from '../lib';
import '../server';


describe('Auth Controler', () => {
  let axiosInstance;
  let session;
  let sandbox: sinon.SinonSandbox;
  const geoLibStub: Partial<typeof GeoLib> = {};

  before(async () => {
    axiosInstance = axios.create(
        {
            baseURL: 'http://localhost:3000/api',
            headers: {
            'Content-Type': 'application/json',
            },
        }
    );
    sandbox = sinon.createSandbox();
    session = await mongoose.startSession();
    // Mock GeoLib methods
    geoLibStub.getAddressFromCoordinates = sinon
      .stub(GeoLib, 'getAddressFromCoordinates')
      .resolves(faker.location.streetAddress({ useFullAddress: true }));

    geoLibStub.getCoordinatesFromAddress = sinon
      .stub(GeoLib, 'getCoordinatesFromAddress')
      .resolves({
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      });
  });

  after(async () => {
    sinon.restore();
    await session.endSession();
  });

  beforeEach(async () => {
    await session.startTransaction();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
    await session.abortTransaction();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
        const name = faker.person.firstName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const address = faker.location.streetAddress({ useFullAddress: true });
    
        const result = await axiosInstance.post('/auth/register', {
            name,
            email,
            password,
            address,
        });
    
        expect(result.data).to.have.property(
            'message',
            'User registered successfully',
        );
    });

    it('should throw an error if the user already exists', async () => {
        const name = faker.person.firstName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const address = faker.location.streetAddress({ useFullAddress: true });
    
        await axiosInstance.post('/auth/register', {
            name,
            email,
            password,
            address,
        });
    
        try {
            await axiosInstance.post('/auth/register', {
                name,
                email,
                password,
                address,
            });
        } catch (error) {
            expect(error.response.data

            ).to.have.property('message', 'User already exists');
        }
    });
  });

  describe('loginUser', () => {
    it('should login a user and return a token and refresh token', async () => {
        const name = faker.person.firstName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const address = faker.location.streetAddress({ useFullAddress: true });
    
        await axiosInstance.post('/auth/register', {
            name,
            email,
            password,
            address,
        });
    
        const result = await axiosInstance.post('/auth/login', {
            email,
            password,
        });
    
        expect(result.data).to.have.property('token');
        expect(result.data).to.have.property('refreshToken');
    });

    it('should throw an error if the credentials are invalid', async () => {
        const email = faker.internet.email();
        const password = faker.internet.password();
    
        try {
            await axiosInstance.post('/auth/login', {
                email,
                password,
            });
        } catch (error) {
            expect(error.response.data).to.have.property('message', 'Invalid credentials');
        }
    });
  });

  describe('updatePassword', () => {
    it('should update the user password', async () => {
        const name = faker.person.firstName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const address = faker.location.streetAddress({ useFullAddress: true });
    
        await UserModel.create({ name, email, password:bcrypt.hashSync(password, 10), address });
    
        const loggedUser = await axiosInstance.post('/auth/login', {
            email,
            password,
        });

        const newPassword = faker.internet.password();
        await axiosInstance.put(`/auth/update-password/`, {
            password: newPassword,
        },{
            headers: {
                Authorization: `Bearer ${loggedUser.data.token}`,
            },
        });
    
        // try to login with the new password
        const result = await axiosInstance.post('/auth/login', {
            email,
            password: newPassword,
        });

        expect(result.data).to.have.property('token');
        expect(result.data).to.have.property('refreshToken');

        // try to login with the old password and expect an error
        try {
            await axiosInstance.post('/auth/login', {
                email,
                password,
            });
        } catch (error) {
            expect(error.response.data).to.have.property('message', 'Invalid credentials');
        }
    });
  });
});
