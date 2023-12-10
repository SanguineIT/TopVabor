import { Module } from '@nestjs/common';
import { VisaDetailService } from './visa-detail.service';
import { VisaDetailController } from './visa-detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisaDetail } from './entities/visa-detail.entity';
import { User } from 'src/user/entities/user.entity';
import { AppGateway } from 'src/app.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([VisaDetail,User])],
  controllers: [VisaDetailController],
  providers: [VisaDetailService, AppGateway]
})
export class VisaDetailModule {}
