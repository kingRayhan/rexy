import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken } from 'nestjs-typegoose';
import * as request from 'supertest';
import validationOptions from '../../app/utils/validation-options';
import configs from '../../app/config';
import { AppMessage } from '../../app/utils/messages.enum';
import { TestDatabaseModule } from '../../shared/test-database/test-database.module';
import { SessionModule } from '../session/session.module';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { PassportJWTAccessTokenStrategy } from './passport-stategies/jwt-at';
import { PassportJWTRefreshTokenStrategy } from './passport-stategies/jwt-rt';

describe('AuthController', () => {
  let app: INestApplication;
  let controller: AuthController;
  let userModel: ReturnModelType<typeof User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs,
        }),
        TestDatabaseModule,
        UserModule,
        SessionModule,
        PassportModule,
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        PassportJWTAccessTokenStrategy,
        PassportJWTRefreshTokenStrategy,
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    userModel = module.get<ReturnModelType<typeof User>>(getModelToken('User'));

    app = module.createNestApplication();
    app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe(validationOptions));
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /auth/register', () => {
    it('Register route defined', () => {
      expect(controller.register).toBeDefined();
    });

    it('Register a new user', async () => {
      await userModel.deleteMany({});
      const user = {
        name: 'King Rayhan',
        username: 'rayhan',
        email: 'example@example.com',
        password: '123456',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.message).toBe(AppMessage.REGISTER_SUCCESS);
      expect(response.body.data).toBeDefined();
    });

    it('validation error (throw 422): For empty body', async () => {
      await userModel.deleteMany({});
      const user = {};

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user);

      expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(response.body.errors).toHaveProperty('name');
      expect(response.body.errors).toHaveProperty('username');
      expect(response.body.errors).toHaveProperty('email');
      expect(response.body.errors).toHaveProperty('password');
    });

    it('validation error (throw 422): For invalid email', async () => {
      await userModel.deleteMany({});

      const user = {
        name: 'King Rayhan',
        username: 'rayhan',
        email: 'example',
        password: '123456',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user);

      expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(response.body.errors).toHaveProperty('email');
    });

    it('validation error (throw 403): For already exists email', async () => {
      await userModel.deleteMany({});
      const user = {
        name: 'King Rayhan',
        username: 'rayhan',
        email: 'example@example.com',
        password: '123456',
      };
      await userModel.create(user);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...user, username: 'xxx' });

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
      expect(response.body.message).toBe(AppMessage.EMAIL_ALREADY_EXISTS);
    });

    it('validation error (throw 403): For already exists username', async () => {
      await userModel.deleteMany({});
      const user = {
        name: 'King Rayhan',
        username: 'rayhan',
        email: 'example@example.com',
        password: '123456',
      };
      await userModel.create(user);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...user, email: 'test@test123.com' });

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
      expect(response.body.message).toBe(AppMessage.USERNAME_ALREADY_EXISTS);
    });
  });

  describe('POST /auth/login', () => {
    it('Login route defined', () => {
      expect(controller.login).toBeDefined();
    });

    it('Login using username', async () => {
      await userModel.deleteMany({});
      userModel.create({
        name: 'King Rayhan',
        username: 'rayhan',
        email: 'example@example.com',
        password: '123456',
      });

      const res = await request(app.getHttpServer()).post('/auth/login').send({
        user: 'rayhan',
        password: '123456',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data.accessToken');
      expect(res.body).toHaveProperty('data.refreshToken');
    });

    it('Login using email', async () => {
      await userModel.deleteMany({});
      userModel.create({
        name: 'King Rayhan',
        username: 'rayhan',
        email: 'example@example.com',
        password: '123456',
      });

      const res = await request(app.getHttpServer()).post('/auth/login').send({
        user: 'example@example.com',
        password: '123456',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data.accessToken');
      expect(res.body).toHaveProperty('data.refreshToken');
    });

    it('⛔ Throw 403: For valid username & invalid password', async () => {
      await userModel.deleteMany({});
      userModel.create({
        name: 'King Rayhan',
        username: 'rayhan',
        email: 'example@example.com',
        password: '123456',
      });

      const res = await request(app.getHttpServer()).post('/auth/login').send({
        user: 'rayhan',
        password: 'wrong-password',
      });
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe(AppMessage.INVALID_CREDENTIALS);
    });

    it('⛔ Throw 403: For invalid username & valid password', async () => {
      await userModel.deleteMany({});
      userModel.create({
        name: 'King Rayhan',
        username: 'rayhan',
        email: 'example@example.com',
        password: '123456',
      });

      const res = await request(app.getHttpServer()).post('/auth/login').send({
        user: 'invalid-username',
        password: '123456',
      });
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe(AppMessage.INVALID_CREDENTIALS);
    });
  });

  describe('POST /auth/logout', () => {
    it('Logout route defined', () => {
      expect(controller.logout).toBeDefined();
    });

    it('Logout using a valid access token', async () => {
      await userModel.deleteMany({});
      userModel.create({
        name: 'King Rayhan',
        username: 'rayhan',
        email: 'example@example.com',
        password: '123456',
      });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          user: 'rayhan',
          password: '123456',
        });

      const accessToken = loginResponse.body.data.accessToken;

      const logoutResponse = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.body).toHaveProperty('message');
      expect(logoutResponse.body.message).toBe(AppMessage.LOGOUT_SUCCESS);
    });

    it('⛔ throw 401 for invalid access token', async () => {
      const logoutResponse = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer invalid-access-token`);

      expect(logoutResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(logoutResponse.body).toHaveProperty('message');
    });
  });

  describe('POST /auth/refresh', () => {
    it('Refresh route defined', () => {
      expect(controller.refresh).toBeDefined();
    });

    it('Refresh using valid refresh token', async () => {
      await userModel.deleteMany({});
      userModel.create({
        name: 'King Rayhan',
        username: 'rayhan',
        email: 'example@example.com',
        password: '123456',
      });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          user: 'rayhan',
          password: '123456',
        });
      const refreshToken = loginResponse.body.data.refreshToken;

      const refreshResponse = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`);

      expect(refreshResponse.status).toBe(200);
      expect(refreshResponse.body).toHaveProperty('message');
      expect(refreshResponse.body.message).toBe(AppMessage.TOKEN_REFRESH);
    });

    it('⛔ throw 401: For invalid refresh token', async () => {
      const refreshResponse = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer invalid-refresh-token`);
      expect(refreshResponse.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('⛔ throw 401: After refreshing using a refresh token then that token will not work again', async () => {
      await userModel.deleteMany({});
      userModel.create({
        name: 'King Rayhan',
        username: 'rayhan',
        email: 'example@example.com',
        password: '123456',
      });
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          user: 'rayhan',
          password: '123456',
        });
      const prev___refreshToken = loginResponse.body.data.refreshToken;

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${prev___refreshToken}`);

      const refreshAgain = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${prev___refreshToken}`);

      expect(refreshAgain.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
