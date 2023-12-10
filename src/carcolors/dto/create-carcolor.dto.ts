import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCarcolorDto {
    @ApiProperty()
    @IsNotEmpty()
    id:number;
    @ApiProperty()
    @IsNotEmpty()
    colorId:number;
    @ApiProperty()
    @IsNotEmpty()
    carId:number;
    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: Express.Multer.File
}
