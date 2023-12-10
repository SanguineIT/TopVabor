import { IsDate, IsEnum, IsInt, IsNotEmpty, IsPositive, isNotEmpty, isNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaymentStatus, BookingFor } from '../entities/car-booking.entity';
import { ApiProperty } from '@nestjs/swagger';


export class CreateCarBookingDto {

    // @ApiProperty()
    id : number

    @ApiProperty()
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    startDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    endDate: Date;

    // @ApiProperty()
    // @IsNotEmpty()
    // UserId: number;

    @ApiProperty()
    CarId: number;

    // @ApiProperty()
    // TourId : number

    // @ApiProperty()
    PaymnetStatus: string;

    @ApiProperty()
    @IsNotEmpty()
    BookingType: string;

    // @ApiProperty()
    DrivingLicence : string
}


export class CreteTourBookingDto{
    id : number

    @ApiProperty()
    TourId : number

    @ApiProperty()
    TickedQty : number

    PaymnetStatus: string;

    BookingType: string;
}
