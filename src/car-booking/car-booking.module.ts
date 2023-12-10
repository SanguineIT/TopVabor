import { Module } from '@nestjs/common';
import { CarBookingService } from './car-booking.service';
import { CarBookingController } from './car-booking.controller';
import { CarBooking } from './entities/car-booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';


@Module({
  imports : [TypeOrmModule.forFeature([CarBooking,User])],
  controllers: [CarBookingController],
  providers: [CarBookingService] 
})
export class CarBookingModule {}
