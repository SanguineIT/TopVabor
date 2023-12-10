import { Module } from '@nestjs/common';
import { VisaOptionService } from './visa_option.service';
import { VisaOptionController } from './visa_option.controller';
import { VisaOption } from './entities/visa_option.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([VisaOption])],
  controllers: [VisaOptionController],
  providers: [VisaOptionService]
})
export class VisaOptionModule {}
