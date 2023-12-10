import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Req, UploadedFile } from '@nestjs/common';
import { CityTourService } from './city-tour.service';
import { CreateCityTourDto } from './dto/create-city-tour.dto';
import { UpdateCityTourDto } from './dto/update-city-tour.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { checkFileSize, editFileName, validateImageFile } from 'src/helper';
import { WriteResponse } from 'src/shared/response';
import { IPagination, IPaginationSwagger } from 'src/shared/paginationEum';

@Controller('city-tour')
@ApiTags('city-tour')
export class CityTourController {
  constructor(private readonly cityTourService: CityTourService) {}

  // @Post('create-or-update')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // create(@Body() createCityTourDto: CreateCityTourDto) {
  //   return this.cityTourService.create(createCityTourDto);
  // }

  @Post('create-or-update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('picturePath', {
      storage: diskStorage({
        destination: 'upload/cityTour',
        filename: editFileName,
      }),
    }),
  )
  async create(
    @Req() req,
    @Body() data: CreateCityTourDto,
    @UploadedFile() picturePath: Express.Multer.File,
  ): Promise<any> {

    if(picturePath?.size > 5000000){
      return WriteResponse(400 , false , "image should be under 500kb")
    }

    if (!validateImageFile(picturePath)) {
      return WriteResponse(400, false, 'Only image are allowed.');
    }
    if (checkFileSize(picturePath.size)) {
      return WriteResponse(400, false, 'image must be less than 5 mb.');
    }
    if (picturePath) {
      data.picturePath = picturePath?.filename;
    }
    return this.cityTourService.create(data);
  }

  @Get('get-All')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll() {
    return this.cityTourService.findAll();
  }

  @Get('getOne/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.cityTourService.findOne(+id);
  }

  @Post('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.cityTourService.remove(+id);
  }

  //Pagination
  @Post('pagination')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type:'object',
      properties: IPaginationSwagger,
    },
  })
  pagination(@Body() pagination:IPagination){
    return this.cityTourService.pagination(pagination);
  }
}
