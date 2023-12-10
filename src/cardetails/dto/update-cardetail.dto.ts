import { PartialType } from '@nestjs/mapped-types';
import { CreateCardetailDto } from './create-cardetail.dto';

export class UpdateCardetailDto extends PartialType(CreateCardetailDto) {}
