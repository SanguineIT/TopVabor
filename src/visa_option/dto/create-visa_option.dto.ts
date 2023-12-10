import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";

export class CreateVisaOptionDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    @Length(2, 50, { message: 'visaOption should be between 2 and 50 characters.' })
    visaOption: string;

    @ApiProperty()
    @Length(2, 500, { message: 'description should be between 2 and 500 characters.' })
    description: string;

}
