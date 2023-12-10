import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Req, UploadedFile, UploadedFiles } from '@nestjs/common';
import { CardetailsService } from './cardetails.service';
import { CreateCardetailDto } from './dto/create-cardetail.dto';
import { UpdateCardetailDto } from './dto/update-cardetail.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';
import { IPagination, IPaginationSwagger } from 'src/shared/paginationEum';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { checkFileSize, editFileName, validateImageFile } from 'src/helper';
import { WriteResponse } from 'src/shared/response';
import { CustomFileFieldsInterceptor } from 'src/interceptor/FileFieldCountInterceptor';

const storageConfig = diskStorage({
  destination: 'upload/cardetail',
  filename: editFileName,
});


@Controller('car-details')
@ApiTags('car-details')
export class CardetailsController {
  constructor(private readonly cardetailsService: CardetailsService) { }

  // @Post('create-or-update')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // create(@Body() createCardetailDto: CreateCardetailDto) {
  //   return this.cardetailsService.create(createCardetailDto);
  // }

  @Post('create-or-update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'carPicturePath', maxCount: 1 },
        { name: 'ImageList', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: 'upload/cardetail',
          filename: editFileName,
        }),
      },
    ),

    // new CustomFileFieldsInterceptor(

    // [
    //       { name: 'carPicturePath', maxCount: 1 },
    //       { name: 'ImageList', maxCount: 5 },
    //     ],
    //     {
    //       storage: diskStorage({
    //         destination: 'upload/cardetail',
    //         filename: editFileName,
    //       }),
    //     },
    // )
  )


  async create(
    @Req() req,
    @Body() data: CreateCardetailDto,
    @UploadedFiles()
    files: { carPicturePath: Express.Multer.File; ImageList: Express.Multer.File },
  ): Promise<any> {
    try {
      // console.log(files,"Car Details=========================================>>>>>>");
      if (files.carPicturePath) {
        if (files?.carPicturePath?.size > 5000000) {
          return WriteResponse(400, false, "image should be under 500kb")
        }

        if (!validateImageFile(files?.carPicturePath?.[0])) {
          return WriteResponse(400, false, 'Only image are allowed.');
        }
        if (checkFileSize(files?.carPicturePath?.[0].size)) {
          return WriteResponse(400, false, 'image must be less than 5 mb.');
        }
        if (files?.carPicturePath[0]) {
          data.carPicturePath = files?.carPicturePath?.[0].filename;
        }
      }

      let imgaesArray = []
      let allImages: any = files?.ImageList

      if (allImages?.length > 5) {
        return WriteResponse(400, false, 'Images less than and equal to 5');
      }
      if (files?.ImageList) {
        for (let i = 0; i < allImages.length; i++) {
          imgaesArray.push(allImages[i]?.filename)
        }
        data.ImageList = files?.carPicturePath?.filename;
      }
      data.ImageList = JSON.stringify(imgaesArray);
      if(imgaesArray.length == 0){
         delete data.ImageList;
      }
      return this.cardetailsService.create(data);
    } catch (err) {
      // console.log('the error ==> ' , err.message)
      return WriteResponse(400, false, err.message)
    }
  }

  @Get('getAll')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll() {
    return this.cardetailsService.findAll();
  }

  @Get('getOne/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.cardetailsService.findOne(+id);
  }
  
  @Post('/update/status')
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        status: false,
        carId: 0,
      },
    },
  })
  async updateStatus(@Body() body: { status: boolean; carId: number }) {
    return this.cardetailsService.updateStatus(body);
  }

  @Post('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.cardetailsService.remove(+id);
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
  async pagination(@Body() data: IPagination) {
    return await this.cardetailsService.pagination(data)
  }

  @Post('Admin-pagination')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: IPaginationSwagger,
    },
  })
  async Adminpagination(@Body() data: IPagination) {
    return await this.cardetailsService.Adminpagination(data)
  }

}
