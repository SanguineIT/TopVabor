import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateBrandDto {
    @ApiProperty({required:true})
    @IsNotEmpty()
    id:number;
    @ApiProperty({required:true})
    @IsNotEmpty()
    brandName:string;
    // @ApiProperty()
    // brandImage:string;
    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: Express.Multer.File
}
