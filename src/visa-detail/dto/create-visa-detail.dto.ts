import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsString, Length } from 'class-validator';

export enum VisaStatus {
  Approved = 'approved',
  Pending = 'pending',
  Rejected = 'rejected',
}

export class CreateVisaDetailDto {
  @ApiProperty()
  id: number;

  // @ApiProperty()
  userId: number;

  @ApiProperty()
  visaOption: string;

  @ApiProperty()
  @Length(2, 50, { message: 'visaNumber should be between 2 and 50 characters.' })
  visaNumber: string;

  // @ApiProperty()
  // issueDate:Date;

  @ApiProperty()
  expiryDate: Date;

  // @ApiProperty()
  // country:string;

  @ApiProperty()
  passportImagePath: string;

  @ApiProperty()
  userPhotoPath: string;
}

export class VisaStatusDto {
  @ApiProperty()
  visaId: number;

  @ApiProperty({nullable:false})
  @Length(2, 500, { message: 'Remarks should be between 2 and 500.' })
  remarks:string;

  @ApiProperty({ default: 'pending' })
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(VisaStatus, { message: 'Invalid Visa Status' })
  status: VisaStatus;
}
