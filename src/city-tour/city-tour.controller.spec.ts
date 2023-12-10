import { Test, TestingModule } from '@nestjs/testing';
import { CityTourController } from './city-tour.controller';
import { CityTourService } from './city-tour.service';

describe('CityTourController', () => {
  let controller: CityTourController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityTourController],
      providers: [CityTourService],
    }).compile();

    controller = module.get<CityTourController>(CityTourController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
