import { PartialType } from '@nestjs/swagger';
import { CreateCarBookingDto } from './create-car-booking.dto';

export class UpdateCarBookingDto extends PartialType(CreateCarBookingDto) {}
