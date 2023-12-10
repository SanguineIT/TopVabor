import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('dummy')
@ApiTags('dummy')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/dummy')
  @ApiBody({})
  async charge(@Body() paymentData: { amount: number, token: string }) {
    return this.paymentService.charge(paymentData);
  }
}

