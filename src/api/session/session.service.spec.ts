import { TestDatabaseModule } from './../../shared/test-database/test-database.module';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, TypegooseModule } from 'nestjs-typegoose';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';
import configs from '../../app/config';
import { ConfigModule } from '@nestjs/config';
import { ReturnModelType } from '@typegoose/typegoose';

describe('SessionService', () => {
  let service: SessionService;
  let model: ReturnModelType<typeof Session>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs,
        }),
        TestDatabaseModule,
        TypegooseModule.forFeature([Session]),
      ],
      providers: [SessionService],
    }).compile();

    service = module.get<SessionService>(SessionService);
    model = module.get<ReturnModelType<typeof Session>>(
      getModelToken('Session'),
    );

    await model.deleteMany();
  });
  beforeEach(async () => {
    await model.deleteMany();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('sessionService.generateAccessAndRefreshTokens -> generate access and refresh token', async () => {
    const { accessToken, refreshToken } =
      service.generateAccessAndRefreshTokens(
        '62a9b253fc13ae4f6b000015',
        'rt_secret',
      );
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it('sessionService.createSession -> create session', async () => {
    const subscriber = '62a9b253fc13ae4f6b000015';
    const session = await service.storeSessionToDatabase(
      subscriber,
      'rt_secret',
    );

    expect(session).toBeDefined();
    expect(session.subscriber.toString()).toBe(subscriber);
  });

  // it('sessionService.generateRefreshTokenSecret -> generate a new refresh token secret for a given user id', async () => {
  //   const secret = service.generateRefreshTokenSecret(
  //     '62a9b253fc13ae4f6b000015',
  //   );
  //   expect(secret).toBeDefined();
  // });
});
