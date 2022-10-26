import { Test, TestingModule } from '@nestjs/testing';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken, TypegooseModule } from 'nestjs-typegoose';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { TestScaffoldService } from '@/shared/test-scaffold/test-scaffold.service';
import { TestScaffoldModule } from '@/shared/test-scaffold/test-scaffold.module';

describe('UserService', () => {
  let service: UserService;
  let model: ReturnModelType<typeof User>;
  let testScaffoldService: TestScaffoldService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestScaffoldModule, TypegooseModule.forFeature([User])],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    testScaffoldService = module.get<TestScaffoldService>(TestScaffoldService);
    model = module.get<ReturnModelType<typeof User>>(getModelToken('User'));
    await model.deleteMany();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(async () => {
    await model.deleteMany({});
  });

  afterAll(async () => {
    await model.deleteMany({});
  });

  describe('userService.create', () => {
    it('userService.create -> Create a new user', async () => {
      const userData = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@gmail.com',
        password: '123456',
      };
      service.create(userData).then((user) => {
        expect(user.name).toBe(userData.name);
        expect(user.username).toBe(userData.username);
        expect(user.email).toBe(userData.email);
        expect(user.password).not.toBe(userData.password); // 🤖: because password is hashed
      });
    });

    it('⛔ throw error for empty username, email and password', async () => {
      await model.deleteMany({});

      await expect(
        service.create({
          username: '',
          email: '',
          password: '',
        }),
      ).rejects.toThrow();
    });

    it('⛔ throw error for duplicate username', async () => {
      // Previously created user with username: johndoe
      await model.create({
        username: 'johndoe',
        email: 'example@example.com',
        password: '123456',
      });

      // Try to create a new user with same username
      await expect(
        service.create({
          username: 'johndoe',
          email: '123@example.com',
          password: '1234567',
        }),
      ).rejects.toThrow();
    });

    it('⛔ throw error for duplicate email', async () => {
      // Previously created user with email: 'example@example.com'
      await model.create({
        username: 'johndoe',
        email: 'example@example.com',
        password: '123456',
      });

      // Try to create a new user with same email
      await expect(
        service.create({
          username: 'johndoe1',
          email: 'example@example.com',
          password: '123456',
        }),
      ).rejects.toThrow();
    });
  });

  describe('userService.getUser', () => {
    it('fetch user using _id', async () => {
      const _user = await testScaffoldService.createTestUser();

      service.getUser({ _id: _user._id }).then((user) => {
        expect(user).toBeDefined();
        expect(user.username).toBe(_user.username);
        expect(user.email).toBe(_user.email);
      });
    });

    it('fetch user using username', async () => {
      const _user = await testScaffoldService.createTestUser();
      service.getUser({ username: _user.username }).then((user) => {
        expect(user).toBeDefined();
        expect(user.username).toBe(_user.username);
        expect(user.email).toBe(_user.email);
      });
    });

    it('return null if user not found', async () => {
      await model.deleteMany({});
      service.getUser({ username: 'notfound' }).then((user) => {
        expect(user).toBeNull();
      });
    });
  });

  describe('userService.delete', () => {
    it('Delete a user using username', async () => {
      const _test_user = await testScaffoldService.createTestUser();
      service.delete({ username: _test_user.username }).then((deleted) => {
        expect(deleted.acknowledged).toBe(true);
        expect(deleted.deletedCount).toBe(1);
      });
    });

    it('Delete a user using email', async () => {
      const _test_user = await testScaffoldService.createTestUser();
      service.delete({ email: _test_user.email }).then((deleted) => {
        expect(deleted.acknowledged).toBe(true);
        expect(deleted.deletedCount).toBe(1);
      });
    });

    it('⛔ throw error for user not found', async () => {
      await model.deleteMany({});
      await expect(
        service.delete({ username: 'notfound' }),
      ).rejects.toThrowError();
    });
  });

  describe('userService.update', () => {
    it('Update a user using username', async () => {
      await model.deleteMany({});
      const userData = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@gmail.com',
        password: '123456',
      };
      await model.create(userData);

      service
        .update({ username: userData.username }, { name: 'John Doe2' })
        .then((user) => {
          expect(user).toBeDefined();
          expect(user.name).toBe('John Doe2');
        });
    });

    it('⛔ throw error for user not found', async () => {
      await model.deleteMany({});
      await expect(
        service.update({ username: 'notfound' }, { name: 'John Doe2' }),
      ).rejects.toThrow();
    });
  });
});
