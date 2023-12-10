import { Test, TestingModule } from '@nestjs/testing';
import { CardetailsService } from './cardetails.service';

describe('CardetailsService', () => {
  let service: CardetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardetailsService],
    }).compile();

    service = module.get<CardetailsService>(CardetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
