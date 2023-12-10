import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from './user/user.module';
import { ConfigModule } from './config.module'; // Import the ConfigModule
import { ConfigService } from './config.service';
import { FileUploadModule } from './fileUpload.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { CardetailsModule } from './cardetails/cardetails.module';
import { ColorsModule } from './colors/colors.module';
import { CarcolorsModule } from './carcolors/carcolors.module';
import { VisaDetailModule } from './visa-detail/visa-detail.module';
import { SettingsModule } from './settings/settings.module';
import { CarBookingModule } from './car-booking/car-booking.module';
import { TourTicktsModule } from './tour-tickts/tour-tickts.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PaymentModule } from './strip-payment-getway/payment/payment.module';
import { StripeModule } from './stripe/stripe.module';
import { VisaOptionModule } from './visa_option/visa_option.module';
import { CityTourModule } from './city-tour/city-tour.module';


@Module({
  imports: [
    ConfigModule, // Add ConfigModule to the imports
    FileUploadModule, // Add FileUploadModule to the imports.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule here as well
      useFactory: (configService: ConfigService) =>
        configService.getTypeOrmConfig(),
      inject: [ConfigService], // Inject ConfigService
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule here as well
      useFactory: (configService: ConfigService) =>
        configService.getMailerConfig(),
      inject: [ConfigService], // Inject ConfigService
    }),
    UserModule,
    CategoryModule,
    BrandModule,
    CardetailsModule,
    ColorsModule,
    CarcolorsModule,
    VisaDetailModule,
    SettingsModule,
    CarBookingModule,
    TourTicktsModule,
    DashboardModule,
    PaymentModule,
    StripeModule,
    VisaOptionModule,
    CityTourModule
  ],
})
export class AppModule {}
