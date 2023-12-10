import { Test, TestingModule } from '@nestjs/testing';
import { CarBookingService } from './car-booking.service';

describe('CarBookingService', () => {
  let service: CarBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarBookingService],
    }).compile();

    service = module.get<CarBookingService>(CarBookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
