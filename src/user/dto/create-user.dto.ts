import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';


export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export enum CountryUpdate {
  Uzbekistan = '1',
  UAE = '2',
}
export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(3, 50)
  name: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  @Matches(new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), {
    message: 'invalid email',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'invalid Password',
  })
  @Length(8)
  password: string;


}
export class SocialLoginDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  ssoId: string;

  @ApiProperty()
  provider: string;
}

export class UpdateUserdto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsString()
  @Length(3, 50)
  name: string;

  @ApiProperty()
  dateOfBirth: Date;


}

export class LoginDTO {
  @ApiProperty()
  email: string;


  @ApiProperty()
  password: string;
}

export class ResetPassDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Required a strong password ( one upper , one special , one number )',
  })
  @Length(8)
  new_password: string;
}

export class ChangePasswordDto {
  // @ApiProperty()
  // @IsNumber()
  // id: number;

  @ApiProperty({
    type: 'string',
    description: 'Please enter old password.',
    required: true,
  })
  oldPassword: string;

  @ApiProperty({
    type: 'string',
    description: 'Please enter new password.',
    required: true,
  })
  newPassword: string;
}
export class ForgetPassword {
  @ApiProperty()
  email: string;
}
export class VerifyDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  otp: string;
}
export class UserRoleDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(UserRole, { message: 'Invalid user role' })
  role: UserRole;
}
  export class UserCountryDto{

    // @ApiProperty()
  userId: number;
  
    @ApiProperty({enum : ['1','2']})
    @IsEnum(CountryUpdate)
    country: 'enum';

  
  }

