import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Req, UploadedFile } from '@nestjs/common';
import { TourTicktsService } from './tour-tickts.service';
import { CreateTourTicktDto } from './dto/create-tour-tickt.dto';
import { UpdateTourTicktDto } from './dto/update-tour-tickt.dto';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { checkFileSize, editFileName, validateImageFile } from 'src/helper';
import { WriteResponse } from 'src/shared/response';
import { IPagination, IPaginationSwagger } from 'src/shared/paginationEum';

@Controller('tour-tickts')
@ApiTags('tour-tickts')
export class TourTicktsController {
  constructor(private readonly tourTicktsService: TourTicktsService) {}

  // @Post()
  // create(@Body() createTourTicktDto: CreateTourTicktDto) {
  //   return this.tourTicktsService.create(createTourTicktDto);
  // }

  @Post('create-or-update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('picturePath', {
      storage: diskStorage({
        destination: 'upload/tourTicket',
        filename: editFileName,
      }),
    }),
  )
  async create(
    @Req() req,
    @Body() data: CreateTourTicktDto,
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
    return this.tourTicktsService.create(data);
  }

  @Get('get-All')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll() {
    return this.tourTicktsService.findAll();
  }

  @Get('getOne/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.tourTicktsService.findOne(+id);
  }


  @Post('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.tourTicktsService.remove(+id);
  }
@Post('pagination')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiBody({
  schema:{
    type:'object',
    properties: IPaginationSwagger,
  },
})
async pagination(@Body() data:IPagination){
  return await this.tourTicktsService.pagination(data)
}

}
