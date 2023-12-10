import { Test, TestingModule } from '@nestjs/testing';
import { CardetailsController } from './cardetails.controller';
import { CardetailsService } from './cardetails.service';

describe('CardetailsController', () => {
  let controller: CardetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardetailsController],
      providers: [CardetailsService],
    }).compile();

    controller = module.get<CardetailsController>(CardetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
