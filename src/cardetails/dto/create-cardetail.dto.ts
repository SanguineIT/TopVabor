import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsString, Length, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateCardetailDto {
    @ApiProperty()
    id: number;
    
    @ApiProperty()
     @Length(2, 50, { message: 'country should be between 2 and 50 characters.' })
    country : string;

    @ApiProperty()
    categoryId: number;

    // @ApiProperty()
    // @IsNumber()
    // brandId: number;

    @ApiProperty()
    @Length(2, 20, { message: 'model should be between 2 and 20 characters.' })
    model: string;

    // @ApiProperty()
    // year: number;

    // @ApiProperty()
    // vin: string;

    // @ApiProperty()
    // mileage: number;

    @ApiProperty()
    pricePerDay: number;

    // @ApiProperty()
    // pricePerWeek: number;

    // @ApiProperty()
    // pricePerMonth: number;

    // @ApiProperty()
    carPicturePath: string;

    // @ApiProperty()
    // power: number;

    @ApiProperty()
    seats: number;

    // @ApiProperty()
    // maxSpeed: number;

    // @ApiProperty()
    ImageList : string

    @ApiProperty()
    @Length(2, 255, { message: 'Remark should be between 2 and 255.' })
    remark: string;


}
