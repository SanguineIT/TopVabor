import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VisaOptionService } from './visa_option.service';
import { CreateVisaOptionDto } from './dto/create-visa_option.dto';
import { UpdateVisaOptionDto } from './dto/update-visa_option.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';

@Controller('visa-option')
@ApiTags('visa-option')
export class VisaOptionController {
  constructor(private readonly visaOptionService: VisaOptionService) {}

  @Post('create-or-update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createVisaOptionDto: CreateVisaOptionDto) {
    return this.visaOptionService.create(createVisaOptionDto);
  }

  @Get('get-All')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll() {
    return this.visaOptionService.findAll();
  }

  @Get('getOne/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.visaOptionService.findOne(+id);
  }

  @Post('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.visaOptionService.remove(+id);
  }
}
