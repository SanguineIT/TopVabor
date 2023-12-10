import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { CarBooking } from 'src/car-booking/entities/car-booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Cardetail } from 'src/cardetails/entities/cardetail.entity';
@Module({
  imports: [ConfigModule.forRoot(),TypeOrmModule.forFeature([CarBooking,Cardetail,User])],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
