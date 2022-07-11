import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken } from 'nestjs-typegoose';
import configs from '../../app/config';
import { TestDatabaseModule } from '../../shared/test-database/test-database.module';
import { SessionModule } from '../session/session.module';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthRegisterDTO } from './dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: ReturnModelType<typeof User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs,
        }),
        TestDatabaseModule,

        //--
        UserModule,
        SessionModule,
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<ReturnModelType<typeof User>>(getModelToken('User'));
    await userModel.deleteMany({});
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('authService.register -> Register a new user', async () => {
    const payload: AuthRegisterDTO = {
      email: 'john@gmail.com',
      password: '123456',
      name: 'John Doe',
      username: 'johndoe',
    };
    service.register(payload).then((user) => {
      expect(user).toBeDefined();
      expect(user.email).toBe(payload.email);
      expect(user.name).toBe(payload.name);
      expect(user.username).toBe(payload.username);
      expect(user.password).not.toBe(payload.password);
    });
  });

  it('authService.register -> throw 403 if username exists', async () => {
    const payload: AuthRegisterDTO = {
      name: 'John Doe1',
      username: 'johndoe1',
      email: 'john1@gmail.com',
      password: '123456',
    };
    // create a user document
    await userModel.create(payload);

    service.register({ ...payload, email: 'xxx1@xx.com' }).catch((err) => {
      expect(err.status).toBe(403);
      expect(err.message).toBe('Username already exists');
    });
  });

  it('authService.register -> throw 403 if email exists', async () => {
    const payload: AuthRegisterDTO = {
      name: 'John Doed',
      username: 'johndoe1',
      email: 'johdn@gmail.com',
      password: '123456',
    };
    // create a user document
    await userModel.create(payload);

    service.register({ ...payload, username: 'xxx1' }).catch((err) => {
      expect(err.status).toBe(403);
      expect(err.message).toBe('Email already exists');
    });
  });

  it('authService.login -> Get access and refresh token using username and password', async () => {
    const payload: AuthRegisterDTO = {
      email: 'john@gmail.com',
      password: '123456',
      name: 'John Doe',
      username: 'johndoe',
    };
    await userModel.create(payload);

    service
      .login({
        user: payload.username,
        password: '123456',
      })
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.accessToken).toBeDefined();
        expect(res.refreshToken).toBeDefined();
      });
  });

  it('authService.login -> get 403 for invalid username', async () => {
    const payload: AuthRegisterDTO = {
      email: 'john@gmail.com',
      password: '123456',
      name: 'John Doe',
      username: 'johndoe',
    };
    await userModel.create(payload);

    service
      .login({
        user: 'wrong-username',
        password: payload.password,
      })
      .catch((err) => {
        expect(err.status).toBe(403);
        expect(err.message).toBe('Invalid credential');
      });
  });

  it('authService.login -> get 403 for invalid password', async () => {
    const payload: AuthRegisterDTO = {
      email: 'john@gmail.com',
      password: '123456',
      name: 'John Doe',
      username: 'johndoe',
    };
    await userModel.create(payload);
    service
      .login({
        user: payload.username,
        password: 'wrong---password',
      })
      .catch((err) => {
        expect(err.status).toBe(403);
        expect(err.message).toBe('Invalid credential');
      });
  });
});
