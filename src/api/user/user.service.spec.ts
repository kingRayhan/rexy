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

  it('userService.getUser -> fetch a user using username and email', async () => {
    const users = [
      {
        name: 'Nibbi',
        username: 'nibbi',
        email: 'nibbi@gmail.com',
        password: '123456',
      },
      {
        name: 'toxic',
        username: 'toxic',
        email: 'toxic@toxic.com',
        password: '123456',
      },
      {
        name: 'adhu',
        username: 'adhunika',
        email: 'adhunika92@gmail.com',
        password: '123456',
      },
      {
        name: 'orchie',
        username: 'orchie',
        email: 'orchie@orchie.com',
        password: '123456',
      },
      {
        name: 'nishu',
        username: 'nishu',
        email: 'nishu@nishu.com',
        password: '123456',
      },
    ];

    await model.insertMany(users);

    service.getUser({ username: users[0].username }).then((user) => {
      expect(user).toBeDefined();
      expect(user.name).toBe(users[0].name);
      expect(user.username).toBe(users[0].username);
      expect(user.email).toBe(users[0].email);
    });

    service.getUser({ email: users[1].email }).then((user) => {
      expect(user).toBeDefined();
      expect(user.name).toBe(users[1].name);
      expect(user.username).toBe(users[1].username);
      expect(user.email).toBe(users[1].email);
    });
  });

  it('userService.delete -> delete a user using username', async () => {
    service.delete({ username: 'nibbi' }).then((deleted) => {
      expect(deleted.acknowledged).toBe(true);
    });
  });

  it('userService.delete -> delete a user using email', async () => {
    service.delete({ email: 'nishu@nishu.com' }).then((deleted) => {
      expect(deleted.acknowledged).toBe(true);
    });
  });

  it('userService.update -> update a user using username', async () => {
    const userData = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@gmail.com',
      password: '123456',
    };
    await model.create(userData);
    const updatedUser = {
      name: 'John Doe 2',
      username: 'johndoe2',
    };
    service
      .update({ username: userData.username }, updatedUser)
      .then((user) => {
        expect(user.name).toBe(updatedUser.name);
        expect(user.username).toBe(updatedUser.username);
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
