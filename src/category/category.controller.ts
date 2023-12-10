import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { IPagination, IPaginationSwagger } from 'src/shared/paginationEum';

@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create-or-update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('get-All')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('getOne/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }


  @Post('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }

 @Post('pagination')
 @UseGuards(JwtAuthGuard)
 @ApiBearerAuth()
 @ApiBody({
  schema: {
    type: 'object',
    properties: IPaginationSwagger,
  },
 })
 async pagination(@Body() data:IPagination){
  return await this.categoryService.pagination(data)
}


  
}
