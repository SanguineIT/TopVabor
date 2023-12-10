import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateColorDto {
    @ApiProperty()
    @IsNotEmpty()
    id:number;
    @ApiProperty()
    @IsNotEmpty()
    colorName:string;
}
