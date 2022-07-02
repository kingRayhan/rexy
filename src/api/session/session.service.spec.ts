import { TestDatabaseModule } from './../../shared/test-database/test-database.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypegooseModule } from 'nestjs-typegoose';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypegooseModule.forFeature([Session]),
        ConfigModule,
      ],
      providers: [
        SessionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'auth.at_secret') {
                return 'at_secret';
              }
              if (key === 'auth.rt_secret') {
                return 'rt_secret';
              }

              if (key === 'database.test_url') {
                return 'mongodb+srv://rayhan:rayhan123@cluster0.dymuq.mongodb.net/rexy-test?retryWrites=true&w=majority';
              }

              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sessionService.generateAccessAndRefreshTokens -> generate access and refresh token', async () => {
    const { accessToken, refreshToken } =
      service.generateAccessAndRefreshTokens('user_xxx', 'rt_secret');

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it('sessionService.createSession -> create session', async () => {
    const subscriber = '62a9b253fc13ae4f6b000015';
    const session = await service.createSession(subscriber);

    expect(session).toBeDefined();
    expect(session.subscriber.toString()).toBe(subscriber);
  });

  // it('sessionService.generateRefreshTokenSecret -> generate a new refresh token secret for a given user id', async () => {
  //   const secret = service.generateRefreshTokenSecret('user_xxx');
  //   expect(secret).toBeDefined();
  // });
});
