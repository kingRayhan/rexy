import { TestDatabaseModule } from './../../shared/test-database/test-database.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypegooseModule } from 'nestjs-typegoose';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';
import { ConfigModule } from '@nestjs/config';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypegooseModule.forFeature([Session]),
        ConfigModule,
      ],
      providers: [SessionService],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sessionService.generateAccessAndRefreshTokens -> generate access and refresh token', async () => {
    const token = service.generateAccessAndRefreshTokens('user_xxx');
    console.log(token);
  });
});
