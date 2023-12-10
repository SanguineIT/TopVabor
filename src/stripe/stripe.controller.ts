import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WriteResponse } from './../shared/response';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('/payment-link')
  @ApiTags('payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async generatePaymentLink(
    @Query('amount') amount: number,
    @Query('BookingId') BookingId : number,
  ): Promise<any> {
   try{ 
    return await this.stripeService.createPaymentLink(amount,BookingId);
  }catch(err){
    return WriteResponse(400 , false , err.message)
  }
  }

  @Get('/tour-payment-link')
  @ApiTags('payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getTourPaymentLink(
    @Query('amount') amount: number,
    @Query('BookingId') BookingId : number,
  ): Promise<any>{
    try{
      return await this.stripeService.createtourPaymentLink(amount,BookingId);
    }catch(err){
      return WriteResponse(400 , false , err.message)
    }
  }

}
