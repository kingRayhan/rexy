import { Test, TestingModule } from '@nestjs/testing';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken } from 'nestjs-typegoose';
import { AuthService } from './auth.service';
import { User } from '@/api/user/entities/user.entity';
import { UserModule } from '@/api/user/user.module';
import { AuthRegisterDTO } from '@/api/auth/dto/register.dto';
import { AppMessage } from '@/app/utils/messages.enum';
import { TestScaffoldModule } from '@/shared/test-scaffold/test-scaffold.module';
import { TestScaffoldService } from '@/shared/test-scaffold/test-scaffold.service';
import { SessionService } from '@/api/session/session.service';
import { FirebaseService } from '@/shared/firebase/firebase.service';
import { FirebaseModule } from '@/shared/firebase/firebase.module';
import { SessionModule } from '@/api/session/session.module';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: ReturnModelType<typeof User>;
  let testScaffoldService: TestScaffoldService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestScaffoldModule, UserModule, FirebaseModule, SessionModule],
      providers: [AuthService],
    }).compile();
    service = module.get<AuthService>(AuthService);
    userModel = module.get<ReturnModelType<typeof User>>(getModelToken('User'));
    testScaffoldService = module.get<TestScaffoldService>(TestScaffoldService);
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });
  afterAll(async () => {
    await userModel.deleteMany({});
  });

  // ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
  // I wish to delete users collection before each test
  // but it's not working as expected. Most likely I am doing something wrong.
  // Send PR if you know how to fix it.
  // beforeEach(async () => {
  //   await userModel.deleteMany({});
  // });
  // ☢️ For now: delete all users before each test menually 👺

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authService.register', () => {
    it('authService.register -> Register a new user', async () => {
      await userModel.deleteMany({});
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
      await userModel.deleteMany({});
    });

    it('authService.register -> throw 403 if username exists', async () => {
      await userModel.deleteMany({});
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
        expect(err.message).toBe(AppMessage.USERNAME_ALREADY_EXISTS);
      });
      await userModel.deleteMany({});
    });

    it('authService.register -> throw 403 if email exists', async () => {
      await userModel.deleteMany({});
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
        expect(err.message).toBe(AppMessage.EMAIL_ALREADY_EXISTS);
      });
      await userModel.deleteMany({});
    });
  });

  describe('authService.login', () => {
    it('authService.verifyCredential -> Get user for valid credential', async () => {
      const _user = await testScaffoldService.createTestUser();

      service
        .verifyCredential({
          user: _user.username,
          password: 'password',
        })
        .then((res) => {
          expect(res).toBeDefined();
          expect(res.name).toBe(_user.name);
          expect(res.email).toBe(_user.email);
          expect(res.username).toBe(_user.username);
        });
      await userModel.deleteMany({});
    });

    it('authService.verifyCredential -> get 403 for invalid username', async () => {
      const _user = await testScaffoldService.createTestUser();

      service
        .verifyCredential({
          user: 'wrong-username',
          password: 'password',
        })
        .catch((err) => {
          expect(err.status).toBe(403);
          expect(err.message).toBe(AppMessage.INVALID_CREDENTIALS);
        });
      await userModel.deleteMany({});
    });

    it('authService.verifyCredential -> get 403 for invalid password', async () => {
      const _user = await testScaffoldService.createTestUser();
      service
        .verifyCredential({
          user: _user.username,
          password: 'wrong---password',
        })
        .catch((err) => {
          expect(err.status).toBe(403);
          expect(err.message).toBe(AppMessage.INVALID_CREDENTIALS);
        });
      await userModel.deleteMany({});
    });
  });

  describe('authService.logout', () => {
    it('authService.logout -> Logout using session id', async () => {
      const { token } = await testScaffoldService.createTestUserAndToken();
      service.logout(token.session_id).then((res) => {
        expect(res).toBeDefined();
      });
    });

    it('authService.logout -> get deletedCount = 0 for wrong session_id', async () => {
      service.logout('62cd25d19278aeb09e0eab9f').then((res) => {
        expect(res).toBeDefined();
        expect(res.acknowledged).toBe(true);
        expect(res.deletedCount).toBe(0);
      });
    });
  });
});
