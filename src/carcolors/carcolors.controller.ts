import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { CarcolorsService } from './carcolors.service';
import { CreateCarcolorDto } from './dto/create-carcolor.dto';
import { UpdateCarcolorDto } from './dto/update-carcolor.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/helper';
@ApiTags('carcolors')
@Controller('carcolors')
export class CarcolorsController {
  constructor(private readonly carcolorsService: CarcolorsService) {}

  @Post('create-or-update')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'upload/carcolor',
        filename: editFileName,
      }),
    }),
  )
  create(
    @Body() createCarcolorDto: CreateCarcolorDto,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    createCarcolorDto['picturePath'] = file.filename;
    return this.carcolorsService.create(createCarcolorDto);
  }

  @Get('getAll')
  findAll() {
    return this.carcolorsService.findAll();
  }

  @Get('getOne/:id')
  findOne(@Param('id') id: string) {
    return this.carcolorsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCarcolorDto: UpdateCarcolorDto) {
  //   return this.carcolorsService.update(+id, updateCarcolorDto);
  // }
  @Get('getByCarId/:id')
  getByCarId(@Param('id') id: string) {
    return this.carcolorsService.getByCarId(+id);
  }

  @Get('delete/:id')
  remove(@Param('id') id: string) {
    return this.carcolorsService.remove(+id);
  }
}
