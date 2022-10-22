import { Test, TestingModule } from '@nestjs/testing';
import { RentsService } from './rents.service';

describe('RentsService', () => {
  let service: RentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentsService],
    }).compile();

    service = module.get<RentsService>(RentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
