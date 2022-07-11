import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken, TypegooseModule } from 'nestjs-typegoose';
import configs from '../../app/config';
import { TestDatabaseModule } from './../../shared/test-database/test-database.module';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';

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

  it('session service should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('sessionService.storeSessionToDatabase -> Generate access & refresh token for a userId', async () => {
    const { accessToken, refreshToken } =
      service.generateAccessAndRefreshTokens(
        '62a9b253fc13ae4f6b000015',
        'rt_secret',
      );
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it('sessionService.createSession -> Store session to database', async () => {
    const subscriber = '62a9b253fc13ae4f6b000015';
    const session = await service.storeSessionToDatabase(
      subscriber,
      'rt_secret',
    );

    expect(session).toBeDefined();
    expect(session.subscriber.toString()).toBe(subscriber);
  });

  it('sessionService.claimToken -> Claim token for a userId', async () => {
    service
      .claimToken('62a9b253fc13ae4f6b000015')
      .then(({ accessToken, refreshToken }) => {
        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
      });
  });
});
