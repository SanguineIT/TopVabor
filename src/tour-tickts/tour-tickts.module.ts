import { Module } from '@nestjs/common';
import { TourTicktsService } from './tour-tickts.service';
import { TourTicktsController } from './tour-tickts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourTickt } from './entities/tour-tickt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TourTickt])],
  controllers: [TourTicktsController],
  providers: [TourTicktsService]
})
export class TourTicktsModule {}
