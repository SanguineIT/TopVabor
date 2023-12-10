import { PartialType } from '@nestjs/mapped-types';
import { CreateVisaOptionDto } from './create-visa_option.dto';

export class UpdateVisaOptionDto extends PartialType(CreateVisaOptionDto) {}
