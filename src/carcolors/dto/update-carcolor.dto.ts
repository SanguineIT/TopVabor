import { PartialType } from '@nestjs/swagger';
import { CreateCarcolorDto } from './create-carcolor.dto';

export class UpdateCarcolorDto extends PartialType(CreateCarcolorDto) {}
