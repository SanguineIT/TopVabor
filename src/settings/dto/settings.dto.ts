import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsInt,
  IsPositive,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SettingsDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  settingName:string;

  @ApiProperty()
  settingValue: string;

//   @ApiProperty()
//   @IsString()
//   termAndConditionUrl: string;
//   @ApiProperty()
//   @IsString()
//   privacyPolicyUrl: string;
//   @ApiProperty()
//   @IsString()
//   faq: string;
//   @ApiProperty()
//   @IsString()
//   legalNotice: string;
//   @ApiProperty()
//   @Transform(({ value }) => parseInt(value))
//   @IsInt()
//   @IsPositive()
//   flashSequence: number;
//   @ApiProperty()
//   @Transform(({ value }) => parseInt(value))
//   @IsInt()
//   @IsPositive()
//   timerDuration: number;
//   @ApiProperty()
//   logo: string;
//   @ApiProperty()
//   favicon: string;
}
