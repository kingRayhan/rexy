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
      ],
      controllers: [AuthController],
      providers: [AuthService],
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

    it('Throw 403: For valid username & invalid password', async () => {
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

    it('Throw 403: For invalid username & valid password', async () => {
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
});
