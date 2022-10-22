import { Test, TestingModule } from '@nestjs/testing';
import { RentsController } from './rents.controller';
import { RentsService } from './rents.service';

describe('RentsController', () => {
  let controller: RentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentsController],
      providers: [RentsService],
    }).compile();

    controller = module.get<RentsController>(RentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
