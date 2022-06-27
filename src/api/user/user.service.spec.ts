import { Test, TestingModule } from '@nestjs/testing';
import { TypegooseModule } from 'nestjs-typegoose';
import { TestDatabaseModule } from '../../shared/test-database/test-database.module';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule, TypegooseModule.forFeature([User])],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    await service.deleteAll();
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
      name: 'John Doe' + Date.now(),
      username: 'johndoe' + Date.now(),
      email: 'john@gmail.com',
      password: '123456',
    };
    const savedUser = await service.create(userData);

    service.getUser({ _id: savedUser.id }).then((user) => {
      expect(user).toMatchObject(userData);
    });
  });

  it('userService.delete -> delete a user using username', async () => {
    const userData = {
      name: 'John Doe' + Date.now(),
      username: 'johndoe' + Date.now(),
      email: 'john@gmail.com' + Date.now(),
      password: '123456',
    };
    const savedUser = await service.create(userData);

    service.delete({ email: savedUser.email }).then((deleted) => {
      expect(deleted.deletedCount).toBe(1);
      expect(deleted.acknowledged).toBe(true);
    });
  });

  // it('userService.delete -> delete a user using username', async () => {
  //   const users = [
  //     {
  //       name: 'Nibbi',
  //       username: 'nibbi',
  //       email: 'nibbi@gmail.com',
  //       password: '123456',
  //     },
  //     {
  //       name: 'toxic',
  //       username: 'toxic',
  //       email: 'toxic@toxic.com',
  //       password: '123456',
  //     },
  //     {
  //       name: 'orchie',
  //       username: 'orchie',
  //       email: 'orchie@orchie.com',
  //       password: '123456',
  //     },
  //     {
  //       name: 'nishu',
  //       username: 'nishu',
  //       email: 'nishu@nishu.com',
  //       password: '123456',
  //     },
  //   ];

  //   model.insertMany(users);
  // });
});
