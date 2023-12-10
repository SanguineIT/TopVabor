import { Test, TestingModule } from '@nestjs/testing';
import { VisaDetailService } from './visa-detail.service';

describe('VisaDetailService', () => {
  let service: VisaDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisaDetailService],
    }).compile();

    service = module.get<VisaDetailService>(VisaDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
