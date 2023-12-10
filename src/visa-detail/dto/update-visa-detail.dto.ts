import { PartialType } from '@nestjs/mapped-types';
import { CreateVisaDetailDto } from './create-visa-detail.dto';

export class UpdateVisaDetailDto extends PartialType(CreateVisaDetailDto) {}
