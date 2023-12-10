import { Injectable } from '@nestjs/common';
import { CreateVisaDetailDto, VisaStatusDto } from './dto/create-visa-detail.dto';
import { UpdateVisaDetailDto } from './dto/update-visa-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VisaDetail } from './entities/visa-detail.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { WriteResponse, paginateResponse } from 'src/shared/response';
import { ChecktFileExtension, checkFileSize, deletefile } from 'src/helper';
import { serverUrl } from 'src/constent';
import { IPagination } from 'src/shared/paginationEum';
import { join } from 'path';
import { AppGateway } from 'src/app.gateway';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class VisaDetailService {
  constructor(
    @InjectRepository(VisaDetail)
    private readonly visaDetailsRepo: Repository<VisaDetail>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly appGateway: AppGateway,
    private readonly mailerService: MailerService,
  ) { }

  // Create
  async create(createVisaDetailDto: CreateVisaDetailDto, file, user): Promise<any> {
    createVisaDetailDto.userId = user.id
    try {
      if (createVisaDetailDto.id == 0) {
        if (!file.passportImage)
          return WriteResponse(400, false, 'Please select the image file ');
        if (!file.userImage)
          return WriteResponse(400, false, 'Please select the image file ');
      } else {
        let VisaData = await this.visaDetailsRepo.findOne({
          where: { id: createVisaDetailDto.id },
        });
        if (file.passportImage) {
          deletefile(VisaData.passportImagePath);
        }
        if (file.userImage) {
          deletefile(VisaData.userPhotoPath);
        }
      }
      // let isExitsVisa = await this.VisaByNumber(createVisaDetailDto.visaNumber);
      if (file.passportImage || file.userImage) {
        if (await this.CheckValidation(file)) {
          return await this.CheckValidation(file);
        }
      }
      const passportPath = file.passportImage?.[0]?.filename;
      const userImagePath = file.userImage?.[0]?.filename;
      if (passportPath) {
        createVisaDetailDto.passportImagePath = passportPath;
      }
      if (userImagePath) {
        createVisaDetailDto.userPhotoPath = userImagePath;
      }
      if (createVisaDetailDto.id == 0) {
        // if (isExitsVisa) {
        //   return WriteResponse(
        //     400,
        //     false,
        //     'Visa Already exists with Visa Number',
        //   );
        // }
        if (createVisaDetailDto.id == 0) {
          // if (isExitsVisa) {
          //   return WriteResponse(
          //     400,
          //     false,
          //     'Visa Already exists with Visa Number',
          //   );
          // }

          const newVisa = this.visaDetailsRepo.create(createVisaDetailDto);
          const data = await this.visaDetailsRepo.save(newVisa);
          return WriteResponse(200, data, 'Document uploaded successfully');
        } else {
          // if (isExitsVisa.id !== createVisaDetailDto.id) {
          //   return WriteResponse(
          //     400,
          //     false,
          //     'Visa Already exists with Visa Number',
          //   );
          // }
        }
      }
      // if (createVisaDetailDto.id == 0) {
      //   const newVisa = this.visaDetailsRepo.create(createVisaDetailDto);
      //   const data = await this.visaDetailsRepo.save(newVisa);
      //   return WriteResponse(200, data);
      // } 
      // console.log(createVisaDetailDto);
      return await this.update(createVisaDetailDto.id, createVisaDetailDto);
    } catch (error) {
      console.log(error);

      return WriteResponse(500, false);
    }
  }

  async CheckValidation(file) {
    if (file.passportImage) {
      if (ChecktFileExtension('passportImage', file.passportImage?.[0]?.filename))
        return WriteResponse(
          400,
          false,
          'image type shuld be ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tif", ".tiff", ".svg"',
        );
      if (checkFileSize(file.passportImage?.[0]?.size)) {
        return WriteResponse(
          400,
          false,
          'image file size must be less then 5mb',
        );
      }
    }
    if (file.userImage) {
      if (ChecktFileExtension('userImage', file.userImage?.[0]?.filename))
        return WriteResponse(
          400,
          false,
          'image type shuld be ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tif", ".tiff", ".svg"',
        );
      if (checkFileSize(file.userImage?.[0]?.size)) {
        return WriteResponse(
          400,
          false,
          'image file size must be less then 5mb',
        );
      }
    }
  }

  //Update
  async update(id: number, createVisaDetailDto: CreateVisaDetailDto): Promise<any> {
    try {
      // let isExitsVisa = await this.VisaByNumber(createVisaDetailDto.visaNumber);
      const existingVisa = await this.visaDetailsRepo.findOne({
        where: { id, isDeleted: false },
      });
      if (!existingVisa) {
        return WriteResponse(400, false, 'Record Not Found');
      }
      // if (isExitsVisa) {
      //   if (isExitsVisa.id != id) {
      //     return WriteResponse(
      //       400,
      //       false,
      //       'Visa Already exists with Visa Number',
      //     );
      //   }
      // }
      await this.visaDetailsRepo.update(id, createVisaDetailDto);
      return WriteResponse(200, true, 'Visa Details updated successfully.');
    } catch (err) {
      return WriteResponse(500, false, err.message);
    }
  }

  //visa exists
  async VisaByNumber(visaNumber: string): Promise<any> {
    return await this.visaDetailsRepo.findOne({
      where: { visaNumber },
    });
  }

  // Visa Status
  async updateVisaStatus(visaStatusDto: VisaStatusDto): Promise<any> {
    try {
      const visa = await this.visaDetailsRepo
      // .findOne({
      //   where: { id: visaStatusDto.visaId, isDeleted: false },
      // });
      .createQueryBuilder('visa')
      .leftJoinAndSelect('visa.user', 'user')
      .where('visa.id = :id', { id: visaStatusDto.visaId })
      .andWhere('visa.isDeleted = :isDeleted', { isDeleted: false })
      .getOne()
      if (!visa) {
        return WriteResponse(400, false, 'No Visa Found with this id');
      }
      let x = await this.visaDetailsRepo.update(
        { id: visaStatusDto.visaId },
        { status: visaStatusDto.status,remarks: visaStatusDto.remarks },
     
      );
      console.log(visaStatusDto);
     const statusV:any = visaStatusDto.status;
     console.log(statusV);
    if (statusV == "approved") {
        await this.mailerService.sendMail({
          to: visa.user.email,
          from: 'noreply@example.com',
          subject: 'Visa Approved',
          html: `
            <p>Hi ${visa.user.name},</p>
            <h1>Your Visa Application Has Been Approved by Admin</h1>
            <p>Congratulations! Your visa application has been approved.</p>
            <p>Thank you for choosing our service.</p>
            <p>Regards,</p>
            <p>topvabor</p>
          `,
        });
       
      }else if (statusV === 'rejected') {
              // Visa Rejection
              await this.mailerService.sendMail({
                to: visa.user.email,
                from: 'noreply@example.com',
                subject: 'Visa Rejected',
                html: `
                  <p>Hi ${visa.user.name},</p>
                  <h1>Your Visa Application Has Been Rejected</h1>
                  <p>We regret to inform you that your visa application has been rejected.</p>
                  <p>Reason: ${visaStatusDto.remarks}</p>
                  <p>If you have any questions, please contact our support team.</p>
                  <p>Regards,</p>
                  <p>topvabor</p>
                `,
              });
            }
      return WriteResponse(200, true, 'Visa Status Updated Succesfully');
    } catch (e) {
      return WriteResponse(400, false, e.mesaage);
    }
  }
  
  async findAll(): Promise<any> {
    try {
      const visa = await this.visaDetailsRepo
        .createQueryBuilder('visadetail')
        .leftJoinAndSelect('visadetail.user', 'user')
        .where('visadetail.isDeleted = false')
        .getMany();

      if (visa.length == 0) {
        WriteResponse(400, false, 'visa details not found.');
      }

      visa.map((i) => {
        i['passportImagePathUrl'] = `${serverUrl}visaDetail/${i.passportImagePath}`;
        i['userPhotoPathUrl'] = `${serverUrl}visaDetail/${i.userPhotoPath}`;
      });

      return WriteResponse(200, visa);
    } catch (error) {
      return WriteResponse(400, false, 'Something went wrong.');
    }
  }

  
// Find All Bookings of a single user
async findAllVisaForUser(id: number) {
  try {
    const visa = await this.visaDetailsRepo.find({
      where: { userId: id},
     
    });
    if (visa.length == 0) {
      WriteResponse(400, false, 'visa details not found.');
    }
    // console.log(visa);
    visa.map((i) => {
      i['passportImagePathUrl'] = `${serverUrl}visaDetail/${i.passportImagePath}`;
      i['userPhotoPathUrl'] = `${serverUrl}visaDetail/${i.userPhotoPath}`;
    });
    return WriteResponse(200, visa, 'visa details found Successefully');
  } catch (err) {
    return WriteResponse(400, false, err.message);
  }
}

  //Get One
  async findOne(id: number): Promise<any> {
    try {
      const visa = await this.visaDetailsRepo.findOne({
        where: { id, isDeleted: false },
        relations: ['user']
      });
      if (!visa) {
        return WriteResponse(400, false, 'Record Not Found');
      }
      visa['passportImagePathUrl'] = `${serverUrl}visaDetail/${visa.passportImagePath}`;
      visa['userPhotoPathUrl'] = `${serverUrl}visaDetail/${visa.userPhotoPath}`;
      return WriteResponse(200, visa, 'Seccess')
    } catch (err) {
      return WriteResponse(500, err.message)
    }

  }

  // Delete
  async delete(id: number): Promise<any> {
    const visa = await this.visaDetailsRepo.findOne({
      where: { id, isDeleted: false },
    });
    if (!visa) {
      return WriteResponse(400, false, 'Record Not Found');
    }
    try {
      await this.visaDetailsRepo.update(id, { isDeleted: true });
      return WriteResponse(200, true, 'Visa datail delete Successfully');
    } catch (err) {
      return WriteResponse(500, false, err.message);
    }

  }

  //Pagination
  async pagination(pagination: IPagination) {
    const { curPage, perPage } = pagination;
    const visaOption = pagination.whereClause.find(
      (p: any) => p.key === 'visaOption' && p.value,
    );
    const visaNumber = pagination.whereClause.find(
      (p: any) => p.key === 'visaNumber' && p.value,
    );
    const country = pagination.whereClause.find(
      (p: any) => p.key === 'country' && p.value,
    );
    const name = pagination.whereClause.find(
      (p: any) => p.key === 'name' && p.value,
    );
    const email = pagination.whereClause.find(
      (p: any) => p.key === 'email' && p.value,
    );
    const all = pagination.whereClause.find(
      (p: any) => p.key === 'all' && p.value,
    );
    const builder = this.visaDetailsRepo.createQueryBuilder('f');
    let lwhereClause = 'f.isDeleted = 0 and u.isDeleted = 0';
    if (visaOption) {
      lwhereClause += ` and f. visaOption like '${visaOption.value}'`;
    }
    if (visaNumber) {
      lwhereClause += ` and f.visaNumber like '${visaNumber.value}'`;
    }
    if (country) {
      lwhereClause += ` and f.country like '${country.value}'`;
    }
    if (name) {
      lwhereClause += ` and u. name like '${name.value}'`;
    }
    if (email) {
      lwhereClause += ` and u. email like '${email.value}'`;
    }
    if (all) {
      lwhereClause += ` AND (f.visaNumber like '%${all.value}%' OR f.visaOption like '%${all.value}%' OR f.country like '%${all.value}%' OR u.name like '%${all.value}%' OR u.email like '%${all.value}%')`;
    }
    const skip = (curPage - 1) * perPage;
    let [list, count] = await builder
      .leftJoinAndSelect('f.user', 'u', 'u.isDeleted=false')
      .where(lwhereClause)
      .skip(skip)
      .take(perPage)
      .orderBy('f.createdAt', 'DESC')
      .getManyAndCount();

    list.map((i) => {
      i['passportImagePathUrl'] = `${serverUrl}visaDetail/${i.passportImagePath}`;
      i['userPhotoPathUrl'] = `${serverUrl}visaDetail/${i.userPhotoPath}`;
    });

    return paginateResponse(list, count);
  }

  //Pagination
  async uservisapagination(pagination,user) {
    const { curPage, perPage } = pagination;
    const visaOption = pagination.whereClause.find(
      (p: any) => p.key === 'visaOption' && p.value,
    );
    const visaNumber = pagination.whereClause.find(
      (p: any) => p.key === 'visaNumber' && p.value,
    );
    const country = pagination.whereClause.find(
      (p: any) => p.key === 'country' && p.value,
    );
    const all = pagination.whereClause.find(
      (p: any) => p.key === 'all' && p.value,
    );
    const builder = this.visaDetailsRepo.createQueryBuilder('f');
    let lwhereClause = 'f.isDeleted = 0'
    if (visaOption) {
      lwhereClause += ` and f. visaOption like '${visaOption.value}'`;
    }
    if (visaNumber) {
      lwhereClause += ` and f.visaNumber like '${visaNumber.value}'`;
    }
    if (country) {
      lwhereClause += ` and f.country like '${country.value}'`;
    }
    if (all) {
      lwhereClause += ` AND (f.visaNumber like '%${all.value}%' OR f.visaOption like '%${all.value}%' OR f.country like '%${all.value}%')`;
    }

    if (user) {
      lwhereClause += ` and f.userId = ${user.id}`;
    }
    const skip = (curPage - 1) * perPage;
// For show last record only 

    // const subquery = this.visaDetailsRepo
    // .createQueryBuilder('sub')
    // .select('MAX(sub.createdAt)', 'maxCreatedAt')
    // .where('sub.userId = f.userId');

    let [list, count] = await builder
      .leftJoinAndSelect('f.user', 'u', 'u.isDeleted=false')
      .where(lwhereClause)
      // .andWhere('f.createdAt IN (' + subquery.getSql() + ')') 
      .skip(skip)
      .take(perPage)
      .orderBy('f.createdAt', 'DESC')
      .getManyAndCount();

    list.map((i) => {
      i['passportImagePathUrl'] = `${serverUrl}visaDetail/${i.passportImagePath}`;
      i['userPhotoPathUrl'] = `${serverUrl}visaDetail/${i.userPhotoPath}`;
    });

    return paginateResponse(list, count);
  }
}
