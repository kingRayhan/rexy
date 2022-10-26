import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TestScaffoldModule } from '@/shared/test-scaffold/test-scaffold.module';
import { TestScaffoldService } from '@/shared/test-scaffold/test-scaffold.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('UserController', () => {
  let app: INestApplication;
  let controller: UserController;
  let testScaffoldService: TestScaffoldService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestScaffoldModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    testScaffoldService = module.get<TestScaffoldService>(TestScaffoldService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /user', () => {
    it('Get authenticated user using valid access token', async () => {
      const { token } = await testScaffoldService.createTestUserAndToken();

      const refreshAgain = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${token.accessToken}`);
    });
  });
});
