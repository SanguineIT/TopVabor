import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";

export class CreateTourTicktDto {
    @ApiProperty()
    id:number;

    @ApiProperty()
    @Length(2, 50, { message: 'tourName should be between 2 and 50 characters.' })
    tourName: string;

    @ApiProperty()
    @Length(2, 500, { message: 'title should be between 2 and 500 characters.' })
    title: string;

    @ApiProperty()
    picturePath: string;

    @ApiProperty()
    price:number;
}
