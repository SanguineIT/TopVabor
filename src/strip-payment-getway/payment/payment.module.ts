import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule


@Module({
  imports: [ ConfigModule.forRoot()],
  controllers: [PaymentController],
  providers: [PaymentService], // Provide the PaymentRepository
})
export class PaymentModule {}
