import { Test, TestingModule } from '@nestjs/testing';
import { VisaDetailController } from './visa-detail.controller';
import { VisaDetailService } from './visa-detail.service';

describe('VisaDetailController', () => {
  let controller: VisaDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisaDetailController],
      providers: [VisaDetailService],
    }).compile();

    controller = module.get<VisaDetailController>(VisaDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
