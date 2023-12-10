import { Test, TestingModule } from '@nestjs/testing';
import { TourTicktsService } from './tour-tickts.service';

describe('TourTicktsService', () => {
  let service: TourTicktsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TourTicktsService],
    }).compile();

    service = module.get<TourTicktsService>(TourTicktsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
