import { Test, TestingModule } from '@nestjs/testing';
import { CityTourService } from './city-tour.service';

describe('CityTourService', () => {
  let service: CityTourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CityTourService],
    }).compile();

    service = module.get<CityTourService>(CityTourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
