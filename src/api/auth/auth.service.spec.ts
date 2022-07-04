import { ConfigModule } from '@nestjs/config';
import { TestDatabaseModule } from './../../shared/test-database/test-database.module';
import { Test, TestingModule } from '@nestjs/testing';
import configs from '../../app/config';
import { AuthService } from './auth.service';
import { AuthRegisterDTO } from './dto/register.dto';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken, TypegooseModule } from 'nestjs-typegoose';
import { User } from '../user/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: ReturnModelType<typeof User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs,
        }),
        TestDatabaseModule,
        TypegooseModule.forFeature([User]),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<ReturnModelType<typeof User>>(getModelToken('User'));

    await userModel.deleteMany({});
  });

  // afterAll(async () => {
  //   await userModel.deleteMany({});
  // });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('authService.register -> register', async () => {
    const saved = await userModel.create({
      email: 'john@gmail.com',
      password: '123456',
      name: 'John Doe',
      username: 'johndoe',
    });

    console.log({ saved });

    // const payload: AuthRegisterDTO = {
    //   email: 'john@gmail.com',
    //   password: '123456',
    //   name: 'John Doe',
    //   username: 'johndoe',
    // };
    // service.register(payload).then((user) => {
    //   expect(user).toBeDefined();
    //   expect(user.email).toBe(payload.email);
    //   expect(user.name).toBe(payload.name);
    //   expect(user.username).toBe(payload.username);
    // });
  });

  // it('authService.register -> throw 403 if email exists', async () => {
  //   const payload: AuthRegisterDTO = {
  //     email: 'john@gmail.com',
  //     password: '123456',
  //     name: 'John Doe',
  //     username: 'johndoe',
  //   };

  //   await userService.create(payload);

  //   service.register(payload).catch((err) => {
  //     expect(err.status).toBe(403);
  //   });
  // });
});
