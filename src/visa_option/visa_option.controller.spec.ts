import { Test, TestingModule } from '@nestjs/testing';
import { VisaOptionController } from './visa_option.controller';
import { VisaOptionService } from './visa_option.service';

describe('VisaOptionController', () => {
  let controller: VisaOptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisaOptionController],
      providers: [VisaOptionService],
    }).compile();

    controller = module.get<VisaOptionController>(VisaOptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
