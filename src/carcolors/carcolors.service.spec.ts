import { Test, TestingModule } from '@nestjs/testing';
import { CarcolorsService } from './carcolors.service';

describe('CarcolorsService', () => {
  let service: CarcolorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarcolorsService],
    }).compile();

    service = module.get<CarcolorsService>(CarcolorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
