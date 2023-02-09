import { Test, TestingModule } from '@nestjs/testing';
import { AppCacheService } from './app-cache.service';

describe('AppCacheService', () => {
  let service: AppCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppCacheService],
    }).compile();

    service = module.get<AppCacheService>(AppCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
