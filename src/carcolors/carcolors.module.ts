import { Module } from '@nestjs/common';
import { CarcolorsService } from './carcolors.service';
import { CarcolorsController } from './carcolors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carcolor } from './entities/carcolor.entity';

@Module({
  controllers: [CarcolorsController],
  providers: [CarcolorsService],
  imports:[TypeOrmModule.forFeature([Carcolor])]
})
export class CarcolorsModule {}
