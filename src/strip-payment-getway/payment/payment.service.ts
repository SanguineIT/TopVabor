import { Injectable } from '@nestjs/common';
import Stripe from 'stripe'; // Import the Stripe package
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-08-16', // Specify your desired API version
    });
  }

  async charge(paymentData: { amount: number; token: string }) {
    try {
      const charge = await this.stripe.charges.create({
        amount: paymentData.amount,
        currency: 'usd',
        source: paymentData.token,
      });
      return charge;
    } catch (error) {
      throw error;
    }
  }
}
