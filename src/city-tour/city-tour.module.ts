import { Module } from '@nestjs/common';
import { CityTourService } from './city-tour.service';
import { CityTourController } from './city-tour.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityTour } from './entities/city-tour.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CityTour])],
  controllers: [CityTourController],
  providers: [CityTourService]
})
export class CityTourModule {}
