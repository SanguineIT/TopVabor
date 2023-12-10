import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Length } from "class-validator";

export class CreateCategoryDto {
@ApiProperty()
id:number;

    @ApiProperty()
    @Length(1,255)
    categoryName: string;

    @ApiProperty()
    description: string;
}
