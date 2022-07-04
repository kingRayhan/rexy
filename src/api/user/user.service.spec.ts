import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypegooseModule, getModelToken } from 'nestjs-typegoose';
import { TestDatabaseModule } from '../../shared/test-database/test-database.module';
import { User } from './entities/user.entity';
import configs from '../../app/config';
import { UserService } from './user.service';
import { ReturnModelType } from '@typegoose/typegoose';

describe('UserService', () => {
  let service: UserService;
  let model: ReturnModelType<typeof User>;

  beforeEach(async () => {
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

    await model.deleteMany();
  });
  afterEach(async () => {
    await model.deleteMany();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userService.create -> Create a new user', async () => {
    const userData = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@gmail.com',
      password: '123456',
    };
    const user = await service.create(userData);
    expect(user).toMatchObject(userData);
  });

  it('userService.getUser -> Get a single user using _id', async () => {
    const userData = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@gmail.com',
      password: '123456',
    };
    const savedUser = await service.create(userData);

    service.getUser({ _id: savedUser.id }).then((user) => {
      expect(user).toMatchObject(userData);
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
      expect(user).toMatchObject(users[0]);
    });

    service.getUser({ email: users[1].email }).then((user) => {
      expect(user).toMatchObject(users[1]);
    });
  });

  it('userService.delete -> delete a user using username', async () => {
    const userData = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@gmail.com',
      password: '123456',
    };
    const savedUser = await service.create(userData);

    service.delete({ email: savedUser.email }).then((deleted) => {
      expect(deleted.acknowledged).toBe(true);
    });
  });

  it('userService.update -> update a user using username and email', async () => {
    const userData = {
      name: 'John doe',
      username: 'johndoe',
      email: 'johndoe@gmail.com',
      password: '123456',
    };
    const savedUser = await service.create(userData);

    const updatedUser = {
      name: 'John Doe 2',
      username: 'johndoe2',
    };

    // Update user using email
    service.update({ email: savedUser.email }, updatedUser).then((user) => {
      // console.log({ user });
      expect(user.name).toBe(updatedUser.name);
      expect(user.username).toBe(updatedUser.username);
    });

    // Update user using username
    service.update({ username: 'johndoe2' }, updatedUser).then((user) => {
      // console.log({ user });
      expect(user.name).toBe(updatedUser.name);
      expect(user.username).toBe(updatedUser.username);
    });
  });
});
