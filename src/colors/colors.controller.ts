import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('colors')
@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post('create-or-update')
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorsService.create(createColorDto);
  }

  @Get('getAll')
  findAll() {
    return this.colorsService.findAll();
  }

  @Get('getOne/:id')
  findOne(@Param('id') id: string) {
    return this.colorsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
  //   return this.colorsService.update(+id, updateColorDto);
  // }

  @Get('delete/:id')
  remove(@Param('id') id: string) {
    return this.colorsService.remove(+id);
  }
}
