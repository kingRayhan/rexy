import { TestDatabaseModule } from '../../shared/test-database/test-database.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypegooseModule } from 'nestjs-typegoose';
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

  beforeAll(async () => {
    await service.deleteAll();
  });
  afterAll(async () => {
    await service.deleteAll();
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

  // it('userService.findAll -> Get all users', async () => {});
});
