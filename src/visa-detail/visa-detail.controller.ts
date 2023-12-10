import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Req } from '@nestjs/common';
import { VisaDetailService } from './visa-detail.service';
import { CreateVisaDetailDto, VisaStatusDto } from './dto/create-visa-detail.dto';
import { UpdateVisaDetailDto } from './dto/update-visa-detail.dto';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/helper';
import { VisaDetail } from './entities/visa-detail.entity';
import { IPagination, IPaginationSwagger } from 'src/shared/paginationEum';
import { WriteResponse } from 'src/shared/response';

@Controller('visa-detail')
@ApiTags('visa-detail')
export class VisaDetailController {
  constructor(private readonly visaDetailService: VisaDetailService) { }
//crate-update
  @Post('create-or-update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'passportImage', maxCount: 1 },
        { name: 'userImage', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: 'upload/visaDetail/',
          filename: editFileName,
        }),
      },
    ),
  )
  async uploadFiles(
    @Body() data: CreateVisaDetailDto,
    @UploadedFiles()
    files: { passportImage: Express.Multer.File; userImage: Express.Multer.File },
    @Req() req
  ) {
    return this.visaDetailService.create(data, files, req.user);
  }

// Visa Status
  @Post('/update/status')
  async updateStatus(@Body() visaStatusDto: VisaStatusDto){
    try{
        return await this.visaDetailService.updateVisaStatus(visaStatusDto);
    }catch (e) {
      return WriteResponse(500, false, 'Internal server error.');
    }
  }



  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     example: {
  //       status: 'Pending',
  //       visaId: 0,
  //     },
  //   },
  // })
  // async updateStatus(@Body() body: { status: boolean; visaId: number }) {
  //   return this.visaDetailService.updateStatus(body);
  // }

  //GetAll
  @Get('getAll')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(): Promise<VisaDetail[]> {
    return this.visaDetailService.findAll();
  }

  
// Find All Bookings of a single user
@Get('All-visa-user/:userId')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
findAllVisaForUser(@Param('userId') userId: string) {
return this.visaDetailService.findAllVisaForUser(+userId);
}
//GetOne
  @Get('getOne/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: number): Promise<VisaDetail | undefined> {
    return this.visaDetailService.findOne(id);
  }

//Delete
  @Post('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: number): Promise<void> {
    return this.visaDetailService.delete(id);
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
    return this.visaDetailService.pagination(pagination);
  }

  //Pagination
  @Post('/user-visa/pagination')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type:'object',
      properties: IPaginationSwagger,
    },
  })
  uservisapagination(@Body()data: IPagination, @Req() req: any){
    return this.visaDetailService.uservisapagination(data,req.user);
  }
}
