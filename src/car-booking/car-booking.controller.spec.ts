import { Test, TestingModule } from '@nestjs/testing';
import { CarBookingController } from './car-booking.controller';
import { CarBookingService } from './car-booking.service';

describe('CarBookingController', () => {
  let controller: CarBookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarBookingController],
      providers: [CarBookingService],
    }).compile();

    controller = module.get<CarBookingController>(CarBookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
