import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken, TypegooseModule } from 'nestjs-typegoose';
import configs from '../../app/config';
import { TestDatabaseModule } from '../../shared/test-database/test-database.module';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let model: ReturnModelType<typeof User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs,
        }),
        TestDatabaseModule,
        TypegooseModule.forFeature([User]),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<ReturnModelType<typeof User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
  // I wish to delete users collection before each test
  // but it's not working as expected. Most likely I am doing something wrong.
  // Send PR if you know how to fix it.
  // beforeEach(async () => {
  //   // await model.deleteMany({});
  // });
  // ☢️ For now: delete all users before each test menually 👺

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
      await expect(
        service.create({
          username: '',
          email: '',
          password: '',
        }),
      ).rejects.toThrow();
    });

    // it('⛔ throw error for duplicate username', async () => {
    //   await model.create({
    //     username: 'johndoe',
    //     email: 'example@example.com',
    //     password: '123456',
    //   });

    //   await expect(
    //     service.create({
    //       username: 'johndoe',
    //       email: '123@example.com',
    //       password: '1234567',
    //     }),
    //   ).rejects.toThrow();
    // });

    // it('⛔ throw error for duplicate email', async () => {
    //   await model.create({
    //     username: 'johndoe',
    //     email: 'example@example.com',
    //     password: '123456',
    //   });

    //   await expect(
    //     service.create({
    //       username: 'johndoe1',
    //       email: 'example@example.com',
    //       password: '123456',
    //     }),
    //   ).rejects.toThrow();
    // });
  });

  describe('userService.getUser', () => {
    it('fetch user using _id', async () => {
      const user = {
        name: 'Nibbi',
        username: 'nibbi',
        email: 'nibbi@gmail.com',
        password: '123456',
      };
      const saved = await model.create(user);

      service.getUser({ _id: saved._id }).then((user) => {
        expect(user).toBeDefined();
        expect(user.name).toBe(user.name);
        expect(user.username).toBe(user.username);
        expect(user.email).toBe(user.email);
      });
    });

    it('fetch user using username', async () => {
      const user = {
        name: 'orchie',
        username: 'orchie',
        email: 'orchie@orchie.com',
        password: '123456',
      };
      const saved = await model.create(user);

      service.getUser({ username: saved.username }).then((user) => {
        expect(user).toBeDefined();
        expect(user.name).toBe(user.name);
        expect(user.username).toBe(user.username);
        expect(user.email).toBe(user.email);
      });
    });

    it('return null if user not found', async () => {
      service.getUser({ username: 'notfound' }).then((user) => {
        expect(user).toBeNull();
      });
    });
  });

  describe('userService.delete', () => {
    it('Delete a user using username', async () => {
      const user = {
        name: 'Nibbi',
        username: 'nibbi',
        email: 'nibbi@nibbi.com',
        password: '123456',
      };
      const saved = await model.create(user);

      service.delete({ username: saved.username }).then((deleted) => {
        expect(deleted.acknowledged).toBe(true);
        expect(deleted.deletedCount).toBe(1);
      });
    });
    it('Delete a user using email', async () => {
      const user = {
        name: 'nishu',
        username: 'nishu',
        email: 'nishu@nishu.com',
        password: '123456',
      };
      const saved = await model.create(user);

      service.delete({ email: saved.email }).then((deleted) => {
        expect(deleted.acknowledged).toBe(true);
        expect(deleted.deletedCount).toBe(1);
      });
    });
    it('⛔ throw error for user not found', async () => {
      await expect(
        service.delete({ username: 'notfound' }),
      ).rejects.toThrowError();
    });
  });

  describe('userService.update', () => {
    it('Update a user using username', async () => {
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
      await expect(
        service.update({ username: 'notfound' }, { name: 'John Doe2' }),
      ).rejects.toThrow();
    });
  });

  it('userService.comparePassword -> Compare user password', async () => {
    const user = await model.create({
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@gmail.com',
      password: 'valid-password',
    });

    const matchResult1 = service.comparePassword(user, 'valid-password');
    expect(matchResult1).toBe(true);

    const matchResult2 = service.comparePassword(user, 'wrong-password');
    expect(matchResult2).toBe(false);
  });
});
