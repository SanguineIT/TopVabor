import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";

export class CreateCityTourDto {
    // @ApiProperty()
    id: number;

    @ApiProperty({nullable:false})
    @Length(2, 100, { message: 'citytourName should be between 2 and 100.' })
    citytourName: string;

    @ApiProperty()
    @Length(2, 20, { message: 'cityName should be between 2 and 20.' })
    cityName: string;

    @ApiProperty()
    picturePath: string;

    @ApiProperty()
    @Length(2, 50, { message: 'country should be between 2 and 50 characters.' })
    country: string;
}
