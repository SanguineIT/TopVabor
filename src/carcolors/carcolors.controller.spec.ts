import { Test, TestingModule } from '@nestjs/testing';
import { CarcolorsController } from './carcolors.controller';
import { CarcolorsService } from './carcolors.service';

describe('CarcolorsController', () => {
  let controller: CarcolorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarcolorsController],
      providers: [CarcolorsService],
    }).compile();

    controller = module.get<CarcolorsController>(CarcolorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
