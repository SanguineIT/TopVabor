import { Injectable } from '@nestjs/common';
import {
  CreateCarBookingDto,
  CreteTourBookingDto,
} from './dto/create-car-booking.dto';
import { UpdateCarBookingDto } from './dto/update-car-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BookingFor,
  CarBooking,
  PaymentStatus,
} from './entities/car-booking.entity';
import { Repository } from 'typeorm';
import { WriteResponse, paginateResponse } from 'src/shared/response';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/user/entities/user.entity';
import { CreateTourTicktDto } from 'src/tour-tickts/dto/create-tour-tickt.dto';
@Injectable()
export class CarBookingService {
  constructor(
    @InjectRepository(CarBooking)
    private readonly CarBookingRepo: Repository<CarBooking>,
    @InjectRepository(User)
    private readonly UserRepo: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}
  async create(data: any, DrivingLicence, user) {
    try {
      // console.log(data);
      data.id = 0;
      data.UserId = user.id;
      data.PaymnetStatus = PaymentStatus.Pending;
      if (data.id == 0) {
        if (data.BookingType == 'Car') {
          if (!DrivingLicence) {
            return WriteResponse(
              400,
              false,
              'please provide the Driving Licence',
            );
          }
        }
        // console.log('data ==> ' ,data)
        let bookingData = await this.CarBookingRepo.save(data);
        return WriteResponse(200, bookingData, 'success');
      }
    } catch (err) {
      return WriteResponse(400, false, err.message);
    }
  }

  async createTourBook(creteTourBookingDto: any, user) {
    try {
      creteTourBookingDto.id = 0;
      creteTourBookingDto.BookingType = BookingFor.Trip;
      creteTourBookingDto.PaymnetStatus = PaymentStatus.Pending;
      creteTourBookingDto.UserId = user.id;
      let bookingData = await this.CarBookingRepo.save(creteTourBookingDto);
      return WriteResponse(200, bookingData, 'success');
    } catch (err) {
      return WriteResponse(400, false, err.message);
    }
  }

  findAll() {
    return `This action returns all carBooking`;
  }
  async ApproveStatus(id, UserData) {
    try {
      let ApproveBooking = await this.CarBookingRepo.findOne({
        where: { id: id },
      });
      let user = await this.UserRepo.findOne({
        where: { id: ApproveBooking.UserId },
      });
      if (UserData.id != user.id) {
        return WriteResponse(400, false, 'Invalid Request');
      }
      ApproveBooking.PaymnetStatus = PaymentStatus.Approve;
      if (ApproveBooking.BookingType == BookingFor.Car) {
        ApproveBooking.deductedAmount = Math.ceil(
          (ApproveBooking.totalAmount * 15) / 100,
        );
        ApproveBooking.remainingAmount = Math.floor(
          ApproveBooking.totalAmount - ApproveBooking.deductedAmount,
        );
      } else {
        ApproveBooking.deductedAmount = ApproveBooking.totalAmount;
      }
      await this.CarBookingRepo.save(ApproveBooking);
      return this.mailerService
        .sendMail({
          to: user.email,
          from: 'strangerpart128@gmail.com',
          subject: 'Paymnet Confirmation.',
          html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Confirmation</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
        
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                }
        
                h1 {
                    color: #333;
                }
        
                p {
                    color: #666;
                }
        
                .booking-details {
                    background-color: #f9f9f9;
                    padding: 10px;
                    border-radius: 5px;
                }
        
                .booking-details h2 {
                    margin-top: 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Booking Successful!</h1>
                <p>Thank you for booking with us. Your booking has been successfully confirmed. Below are the details of your booking:</p>
                
                <div class="booking-details">
                    <h2>Booking Details:</h2>
                    <p><strong>Booking ID:</strong>${ApproveBooking.id}</p>
                    <p><strong>Booking Date:</strong> ${new Date()}</p>
                    <p><strong>Location:</strong> ${ApproveBooking.Place}</p>
                    <p><strong>Total Amount:</strong>${
                      ApproveBooking.totalAmount
                    }</p>
                    <p><strong>Amount remaining Amount:</strong>${
                      ApproveBooking.remainingAmount
                    }</p>
                    <p><strong>Amount Deducted Amount:</strong>${
                      ApproveBooking.deductedAmount
                    }</p>
                    ${
                      ApproveBooking?.startDate
                        ? `<p><strong>start Date:</strong>${ApproveBooking.startDate}</p>`
                        : ''
                    }
                    ${
                      ApproveBooking?.endDate
                        ? `<p><strong>end Date:</strong>${ApproveBooking.endDate}</p>`
                        : ''
                    }
                </div>
                
                <p>If you have any questions or need further assistance, please don't hesitate to contact us. We look forward to seeing you at the event!</p>
            </div>
        </body>
        </html>
      `,
          context: {
            username: 'TAPVABOR',
          },
        })
        .then((res) => {
          return WriteResponse(200, true, 'Booking done successfully');
        })
        .catch((e) => WriteResponse(400, false, e.message));
    } catch (err) {
      return WriteResponse(400, false, err.message);
    }
  }

  async RejectStatus(id, user) {
    try {
      let RejectBooking = await this.CarBookingRepo.findOne({
        where: { id: id },
      });
      RejectBooking.PaymnetStatus = PaymentStatus.Reject;
      let userData = await this.UserRepo.findOne({
        where: { id: RejectBooking.id },
      });

      if (userData.id == user.id) {
        let data = this.CarBookingRepo.save(RejectBooking);
        if (data) {
          return WriteResponse(200, false, 'Payment Rejected');
        }
      }
      return WriteResponse(400, false, 'invalid request');
    } catch (err) {
      return WriteResponse(400, false, err.message);
    }
  }

  async findOne(id: any) {
    try {
      let data = await this.CarBookingRepo.findOne({
        where: { id: id },
        relations: ['user', 'cardetail'],
      });
      return WriteResponse(200, data, 'success');
    } catch (err) {
      return WriteResponse(400, false, err.message);
    }
  }

  
  update(id: number, updateCarBookingDto: UpdateCarBookingDto) {
    return `This action updates a #${id} carBooking`;
  }

  remove(id: number) {
    return `This action removes a #${id} carBooking`;
  }

  async pagination(pagination) {
    const { curPage, perPage } = pagination;
    const Place = pagination.whereClause.find(
      (p: any) => p.key === 'Place' && p.value,
    );
    const BookingType = pagination.whereClause.find(
      (p: any) => p.key === 'BookingType' && p.value,
    );

    const name = pagination.whereClause.find(
      (p: any) => p.key === 'name' && p.value,
    );
    const email = pagination.whereClause.find(
      (p: any) => p.key === 'email' && p.value,
    );
    const model = pagination.whereClause.find(
      (p: any) => p.key === 'model' && p.value,
    );
    const all = pagination.whereClause.find(
      (p: any) => p.key === 'all' && p.value,
    );

    const builder = this.CarBookingRepo.createQueryBuilder('f');
    let lwhereClause = 'f.id > 0 ';

    if (Place) {
      lwhereClause += ` and f.Place like '${Place.value}'`;
    }
    if (BookingType) {
      lwhereClause += ` and f.BookingType like '${BookingType.value}'`;
    }
    if (name) {
      lwhereClause += ` and u.name like '${name.value}'`;
    }
    if (email) {
      lwhereClause += ` and u.email like '${email.value}'`;
    }
    if (model) {
      lwhereClause += ` and cd.model like '${model.value}'`;
    }
    if (all) {
      lwhereClause += ` AND (cd.model like '%${all.value}%' OR u.email like '%${all.value}%' OR u.name like '%${all.value}%' OR f.Place like '%${all.value}%'OR f.BookingType like '%${all.value}%')`;
    }

    let skip = (curPage - 1) * perPage;
    let [list, count] = await builder
      .leftJoinAndSelect('f.user', 'u', 'u.isDeleted=false')
      .leftJoinAndSelect('f.cardetail', 'cd', 'cd.isDeleted=false')
      .leftJoinAndSelect('cd.category', 'cdc', 'cdc.isDeleted=false')
      .where(lwhereClause)
      .skip(skip)
      .take(perPage)
      // .orderBy('CreatedAt', 'DESC')
      .getManyAndCount();
    return paginateResponse(list, count);
  }
  async userBookingPagination(pagination, user) {
    const { curPage, perPage } = pagination;
    const Place = pagination.whereClause.find(
      (p: any) => p.key === 'Place' && p.value,
    );
    const BookingType = pagination.whereClause.find(
      (p: any) => p.key === 'BookingType' && p.value,
    );

    const name = pagination.whereClause.find(
      (p: any) => p.key === 'name' && p.value,
    );
    const email = pagination.whereClause.find(
      (p: any) => p.key === 'email' && p.value,
    );
    const model = pagination.whereClause.find(
      (p: any) => p.key === 'model' && p.value,
    );
    const all = pagination.whereClause.find(
      (p: any) => p.key === 'all' && p.value,
    );

    const builder = this.CarBookingRepo.createQueryBuilder('f');
    let lwhereClause = 'f.id > 0 ';

    if (Place) {
      lwhereClause += ` and f.Place like '${Place.value}'`;
    }
    if (BookingType) {
      lwhereClause += ` and f.BookingType like '${BookingType.value}'`;
    }
    if (name) {
      lwhereClause += ` and u.name like '${name.value}'`;
    }
    if (email) {
      lwhereClause += ` and u.email like '${email.value}'`;
    }
    if (model) {
      lwhereClause += ` and cd.model like '${model.value}'`;
    }
    if (all) {
      lwhereClause += ` AND (cd.model like '%${all.value}%' OR u.email like '%${all.value}%' OR u.name like '%${all.value}%' OR f.Place like '%${all.value}%'OR f.BookingType like '%${all.value}%')`;
    }

    if (user) {
      lwhereClause += ` and f.userId = ${user.id}`;
    }

    let skip = (curPage - 1) * perPage;
    let [list, count] = await builder
      .leftJoinAndSelect('f.user', 'u', 'u.isDeleted=false')
      .leftJoinAndSelect('f.cardetail', 'cd', 'cd.isDeleted=false')
      .leftJoinAndSelect('cd.category', 'cdc', 'cdc.isDeleted=false')
      .where(lwhereClause)
      .skip(skip)
      .take(perPage)
      // .orderBy('CreatedAt', 'DESC')
      .getManyAndCount();
    return paginateResponse(list, count);
  }
}
