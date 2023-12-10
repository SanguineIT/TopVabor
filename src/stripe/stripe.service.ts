// src/stripe/stripe.service.ts

import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CarBooking } from 'src/car-booking/entities/car-booking.entity';
import { Repository } from 'typeorm';
import { Cardetail } from 'src/cardetails/entities/cardetail.entity';
import { User } from 'src/user/entities/user.entity';
import { WriteResponse } from 'src/shared/response';
@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(@InjectRepository(CarBooking)
    private readonly CarBookingRepo : Repository<CarBooking>,
    @InjectRepository(Cardetail)
    private readonly CardetailRepo : Repository<Cardetail>,
    @InjectRepository(User)
    private readonly UserRepo : Repository<User>,
    private configService: ConfigService,
    ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-08-16', // Replace with the desired Stripe API version
    });
  }

  async createPaymentLink(amount: number, BookingId : any): Promise<any> {
    try{
    let currency = 'USD'
    let BookingData = await this.CarBookingRepo.findOne({ where : { id : BookingId}})
    BookingData.totalAmount = amount
    this.CarBookingRepo.save(BookingData)
    let CarDetails = await this.CardetailRepo.findOne({ where : { id : BookingData.CarId }})
    let payingAmount = Math.ceil((amount*15)/100)
    let userData = await this.UserRepo.findOne({ where : { id : BookingData.UserId}})
    console.log(userData);
    
    if(userData.country == '2'){
      currency = 'AED'
    }else{
      currency = 'UZS'
    }
    if(payingAmount > 10000){
      return WriteResponse(400 , false , "price canot be greater then 10000")
    }
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency : currency,
            product_data: {
              "name": "Booking",
              "description": "This is a sample product.",
              "metadata": {
                "custom_field": "value",
                "image_url": "https://example.com/product_image.jpg"
              }
            },
            unit_amount: Math.ceil((payingAmount)*100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://restroreff.microlent.com/success?BookingId=${BookingId}`,
      cancel_url: `https://restroreff.microlent.com/cancel?BookingId=${BookingId}`,
    });
    return WriteResponse(200,session.url,'Seccuss');
    }catch(err){
      return WriteResponse(500,false,'Somthing went worng');
    }
  }
  

  async createtourPaymentLink(amount,BookingId): Promise<any> {
    try{
      if(amount > 10000){
        return WriteResponse(400 , false , "price canot be greater then 10000")
      }
    let currency = 'USD'
    let BookingData = await this.CarBookingRepo.findOne({ where : { id : BookingId}})
    BookingData.totalAmount = amount
    this.CarBookingRepo.save(BookingData)
    let userData = await this.UserRepo.findOne({ where : { id : BookingData.UserId}})
    if(userData.country == '2'){
      currency = 'AED'
    }else{
      currency = 'UZS'
    }
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {          price_data: {
            currency : currency,
            product_data: {
              "name": "Booking Details",
              "description": "Booking",
            },
            unit_amount: Math.ceil(amount * 100),
          },
          quantity: 1,
        }
        ],
        mode: 'payment',
        success_url: `https://restroreff.microlent.com/success?BookingId=${BookingId}`,
        cancel_url: `https://restroreff.microlent.com/cancel?BookingId=${BookingId}`,
      });
      return WriteResponse(200,session.url,'Seccuss');
    }catch(error){
      console.log(error);
      
      return WriteResponse(500,false,'Somthing went worng')
    }
    
  }
}
