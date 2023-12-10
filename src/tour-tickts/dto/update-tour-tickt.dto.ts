import { PartialType } from '@nestjs/mapped-types';
import { CreateTourTicktDto } from './create-tour-tickt.dto';

export class UpdateTourTicktDto extends PartialType(CreateTourTicktDto) {}
