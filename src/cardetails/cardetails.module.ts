import { Module } from '@nestjs/common';
import { CardetailsService } from './cardetails.service';
import { CardetailsController } from './cardetails.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cardetail } from './entities/cardetail.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cardetail,Category])],
  controllers: [CardetailsController],
  providers: [CardetailsService]
})
export class CardetailsModule {}
