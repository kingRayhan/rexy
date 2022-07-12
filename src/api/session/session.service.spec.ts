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
          isGlobal: true,
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
        'rt_token',
        '62cd1533fc13ae3c95000002',
      );
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it('sessionService.createSession -> Store session to database', async () => {
    const subscriber = '62a9b253fc13ae4f6b000015';
    const session = await service.storeSessionToDatabase(
      subscriber,
      'rt_token',
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

  describe('sessionService.getSession', () => {
    it('sessionService.getSession -> fetch using session id', async () => {
      const subscriber = '62cd18c89278aeb09e0eab9c';
      const { _id } = await model.create({
        subscriber,
        rt_token: 'rt_token',
      });

      service.getSession({ _id }).then((session) => {
        expect(session).toBeDefined();
        expect(session.subscriber.toString()).toBe(subscriber);
      });
    });

    it('sessionService.getSession -> fetch using session subscriber', async () => {
      const subscriber = '62cd18c89278aeb09e0eab9c';
      await model.create({
        subscriber,
        rt_token: 'rt_token',
      });

      service.getSession({ subscriber }).then((session) => {
        expect(session).toBeDefined();
        expect(session.subscriber.toString()).toBe(subscriber);
      });
    });

    it('sessionService.getSession -> return null for invalid session id', async () => {
      service
        .getSession({ _id: '62cd192d9278aeb09e0eab9d' })
        .then((session) => {
          expect(session).toBeNull();
        });
    });
  });

  describe('sessionService.getSessions', () => {
    it('sessionService.getSessions -> fetch all sessions of a subscriber', async () => {
      const subscriber = '62cd18c89278aeb09e0eab9c';

      const mockSessions = [
        {
          subscriber,
          rt_token: 'rt_token1',
        },
        {
          subscriber,
          rt_token: 'rt_token2',
        },
        {
          subscriber,
          rt_token: 'rt_token3',
        },
      ];

      await model.insertMany(mockSessions);
      service.getSessions({ subscriber }).then((sessions) => {
        expect(sessions).toBeDefined();
        expect(sessions.length).toBe(3);

        sessions.forEach((session) => {
          expect(session.subscriber.toString()).toBe(subscriber);
        });
      });
    });
  });

  describe('sessionService.deleteSession', () => {
    it('sessionService.deleteSession -> delete using session id', async () => {
      const subscriber = '62cd18c89278aeb09e0eab9c';
      const { _id } = await model.create({
        subscriber,
        rt_token: 'rt_token',
      });

      service.deleteSession({ _id }).then((res) => {
        expect(res).toBeDefined();
        expect(res.acknowledged).toBe(true);

        service.getSession({ _id }).then((session) => {
          expect(session).toBeNull();
        });
      });
    });

    it('sessionService.deleteSession -> delete all sessions of a specific subscriber', async () => {
      const subscriber1 = '62cd18c89278aeb09e0eab9c';
      const subscriber2 = '62cd18c89278aeb09e0eab9d';

      const mockSessions = [
        {
          subscriber: subscriber1,
          rt_token: 'rt_token1',
        },
        {
          subscriber: subscriber1,
          rt_token: 'rt_token2',
        },
        {
          subscriber: subscriber2,
          rt_token: 'rt_token3',
        },
      ];

      await model.insertMany(mockSessions);

      service.deleteSession({ subscriber: subscriber1 }).then((res) => {
        expect(res).toBeDefined();
        expect(res.acknowledged).toBe(true);
        expect(res.deletedCount).toBe(2);
      });
    });
  });
});
