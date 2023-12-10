import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}
