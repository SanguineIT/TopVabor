import { PartialType } from '@nestjs/mapped-types';
import { CreateCityTourDto } from './create-city-tour.dto';

export class UpdateCityTourDto extends PartialType(CreateCityTourDto) {}
