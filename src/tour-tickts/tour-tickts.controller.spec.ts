import { Test, TestingModule } from '@nestjs/testing';
import { TourTicktsController } from './tour-tickts.controller';
import { TourTicktsService } from './tour-tickts.service';

describe('TourTicktsController', () => {
  let controller: TourTicktsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TourTicktsController],
      providers: [TourTicktsService],
    }).compile();

    controller = module.get<TourTicktsController>(TourTicktsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
