import { Test, TestingModule } from '@nestjs/testing';
import { VisaOptionService } from './visa_option.service';

describe('VisaOptionService', () => {
  let service: VisaOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisaOptionService],
    }).compile();

    service = module.get<VisaOptionService>(VisaOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
