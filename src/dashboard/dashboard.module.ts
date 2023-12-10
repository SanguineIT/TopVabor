import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from 'src/settings/entities/Settings.entity';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { Cardetail } from 'src/cardetails/entities/cardetail.entity';
import { TourTickt } from 'src/tour-tickts/entities/tour-tickt.entity';
import { CarBooking } from 'src/car-booking/entities/car-booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cardetail,
      Settings,
      TourTickt,
      Category,
      CarBooking,
      User,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
