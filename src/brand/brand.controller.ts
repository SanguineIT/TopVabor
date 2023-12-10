import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/helper';
import { IPaginationSwagger, IPagination} from 'src/shared/paginationEum';
@ApiTags('brand')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('create-or-update')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'upload/brand',
        filename: editFileName,
      }),
    }),
  )
  create(@Body() createBrandDto: CreateBrandDto, @Req() req,
  @UploadedFile() file: Express.Multer.File,) {
    createBrandDto["brandImage"] = file.filename;
    return this.brandService.create(createBrandDto);
  }

  @Get('getAll')
  findAll() {
    return this.brandService.findAll();
  }

  @Get('getOne/:id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
  //   return this.brandService.update(+id, updateBrandDto);
  // }

  @Get('delete/:id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }

  @Post('pagination')
  @ApiBody({ schema: { properties: IPaginationSwagger } })
  async pagination(@Body() IPagination: IPagination, @Req() req: any) {
    return await this.brandService.pagination(IPagination, req.user);
  }

}
