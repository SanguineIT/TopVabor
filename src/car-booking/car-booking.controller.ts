import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CarBookingService } from './car-booking.service';
import {
  CreateCarBookingDto,
  CreteTourBookingDto,
} from './dto/create-car-booking.dto';
import { UpdateCarBookingDto } from './dto/update-car-booking.dto';
import { WriteResponse } from 'src/shared/response';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { checkFileSize, editFileName, validateImageFile } from 'src/helper';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { IPagination, IPaginationSwagger } from 'src/shared/paginationEum';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';
import { CreateTourTicktDto } from 'src/tour-tickts/dto/create-tour-tickt.dto';
import { User } from 'src/user/entities/user.entity';

@Controller('booking')
@ApiTags('Booking')
export class CarBookingController {
  constructor(private readonly carBookingService: CarBookingService) {}

  @Post('create-or-update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('DrivingLicence', {
      storage: diskStorage({
        destination: 'upload/carDetail',
        filename: editFileName,
      }),
    }),
  )
  async create(
    @Req() req,
    @Body() CreateCarBookingDto: CreateCarBookingDto,
    @UploadedFile() DrivingLicence: Express.Multer.File,
  ): Promise<any> {
    // console.log(DrivingLicence,"Bookinggggggg=========================================>>>>>>");

    if (DrivingLicence?.size > 5000000) {
      return WriteResponse(400, false, 'image should be under 500kb');
    }
    if (!validateImageFile(DrivingLicence)) {
      return WriteResponse(400, false, 'Only Image and pdf are Allowed');
    }
    if (checkFileSize(DrivingLicence.size)) {
      return WriteResponse(400, false, 'Image and pdf must be less than 5 Mb');
    }
    if (DrivingLicence) {
      CreateCarBookingDto.DrivingLicence = DrivingLicence.filename;
    }
    return this.carBookingService.create(
      CreateCarBookingDto,
      DrivingLicence,
      req.user,
    );
  }

  @Post('create-tour-booking')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createtourBooking(
    @Req() req,
    @Body() creteTourBookingDto: CreteTourBookingDto,
  ) {
    return this.carBookingService.createTourBook(creteTourBookingDto, req.user);
  }

  @Get('Reject-Booking/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async RejectBooking(@Param('id') id: string, @Req() req) {
    return this.carBookingService.RejectStatus(id, req.User);
  }

  // @Get()
  // findAll() {
  //   try{

  //   }catch(err){
  //     return WriteResponse(400 , false , err.message)
  //   }
  //  }

  @Get('findone/:id')
  findOne(@Param('id') id: string) {
    return this.carBookingService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCarBookingDto: UpdateCarBookingDto) {
  //   return this.carBookingService.update(+id, updateCarBookingDto);
  // }

  @Get('Booking-Confirmation/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  ApproveBooking(@Param('id') id: string, @Req() req) {
    return this.carBookingService.ApproveStatus(id, req.user);
  }

  // @Post('delete/:id')
  // remove(@Param('id') id: string) {
  //   try{

  //   }catch(err){
  //     return WriteResponse(400 , false , err.message)
  //   }  }

  @Post('pagination')
  @ApiBody({
    schema: {
      type: 'object',
      properties: IPaginationSwagger,
    },
  })
  async pagination(@Body() data: IPagination) {
    return await this.carBookingService.pagination(data);
  }

  @Post('/users-booking/pagination')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: IPaginationSwagger,
    },
  })
  async usersBookingPagination(@Body() data: IPagination, @Req() req: any) {
    return await this.carBookingService.userBookingPagination(data, req.user);
  }
}
