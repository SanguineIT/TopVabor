import { JwtService } from '@nestjs/jwt';
import { HttpException, Injectable, Inject } from '@nestjs/common';
import {
  SocialLoginDto,
  UpdateUserdto,
  UserCountryDto,
  UserRoleDto,
} from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { WriteResponse, paginateResponse } from 'src/shared/response';
import { MailerService } from '@nestjs-modules/mailer';
import { IPagination } from 'src/shared/paginationEum';
import { AppGateway } from 'src/app.gateway';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private jwtService: JwtService,

    private readonly appGateway: AppGateway,
  ) {}
  // private otpStorage: { [key: string]: string } = {};
  private otpStorage: { [key: string]: { otp: string; timestamp: number } } =
    {};

  //User Create
  async Create(data: any): Promise<any> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
      isActive: true,
     
    });
    await this.userRepository.save(user);
    // return { data };
    return WriteResponse(200, data, 'Seccess');
  }

  //User Update
  async UpdateUser(updateUserdto: UpdateUserdto): Promise<any> {
    try {
      //let Mlength = updateUserdto.mobileNo.length;
      //if (Mlength < 8 || Mlength > 14) {
      //  return WriteResponse(400, false, 'Mobile Should be between 8 to 14');
      //}
      const user = await this.userRepository.findOne({
        where: { id: updateUserdto.id, isDeleted: false },
      });

      if (!user) {
        return WriteResponse(400, false, 'No User Found with this id');
      }

      let x = await this.userRepository.save(updateUserdto);
      return WriteResponse(200, x, 'User Data Updated Succesfully');
    } catch (e) {
      return WriteResponse(400, false, e.mesaage);
    }
  }

  // User Country Update
async updateUserCountry(updatecountryDto:UserCountryDto, uesr ): Promise<any>{
  try{
    const user = await this.userRepository.findOne({
      where: { id: uesr.id, isDeleted:false }
    });
    if(!user){
return WriteResponse(200,false,'Record Not Found');
    }
    await this.userRepository.update(
      { id: uesr.id },
      { country: updatecountryDto.country },
    );
    return WriteResponse(200,true, 'User Country Update seccessfully');

  }catch(error){
    return WriteResponse(500,false,'Something went worng')
  }
}

  //Admin Login
  async AdminLogin(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    // console.log('user ===> ', user);
    if (user.role !== 'admin') return null;
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return passwordValid;
    }
    if (!user) {
      // return false;
      return WriteResponse(400,false, 'Record Not Found');
    }

    if (user && passwordValid) {
      await this.userRepository.update(user.id, { lastLogin: new Date() });
      return user;
      // return WriteResponse(200,user,'Success');
    }
    // return WriteResponse(200,user,'Success')
    return user;
  }


  //User Login
  async LogIn(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email, provider: null },
    });
    if (!user) return null;
    if(user.isActive == false ) return "Blocked"
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return passwordValid;
    }
    if (!user) {
      // return false;
      return WriteResponse(400,false, 'Record Not Found');
    }

    if (user && passwordValid) {
      await this.userRepository.update(user.id, { lastLogin: new Date() });
      // return WriteResponse(200,user,'Success');
      return user;
    }
    // return WriteResponse(200,user,'Success');
     return user;
  }

  //Login with Social
  async singInWithSocialAccound(data: SocialLoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { ssoId: data.ssoId },
      });
      if (user) {
        const payload = { id: user.id, role: user.role };
        const token = await this.jwtService.signAsync(payload);
        await this.userRepository.update(user.id, {
          lastLogin: new Date(),
        });
        return WriteResponse(
          200,
          {
            token: token,
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          'Login successfully.',
        );
      } else {
        data['role'] = 'user';
        data['isActive'] = true;
        // data['isEmailVerified'] = true;
        data['lastLogin'] = new Date();
        const saveUser = await this.userRepository.save(data);
        const payload = { id: saveUser.id, role: saveUser.role };
        const token = await this.jwtService.signAsync(payload);
        return WriteResponse(
          200,
          {
            token: token,
            id: saveUser.id,
            name: saveUser.name,
            email: saveUser.email,
            role: saveUser.role,
          },
          'Login successfully.',
        );
      }
    } catch (e) {
      return WriteResponse(500, false,'Somthing went worng');
    }
  }

  async getUser(query: object): Promise<User> {
    return this.userRepository.findOne(query);
  }

  //Update Status
  async updateStatus({ status, userId }): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isDeleted: false },
    });
    if (!user) {
      return WriteResponse(400, false, 'User not found.');
    }
    const update = await this.userRepository.update(
      { id: userId },
      { isActive: status },
    );
    // console.log(status);
    if (status == false) {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'noreply@example.com',
        subject: 'Account deactivated',
        html: `
          <p>Hi ${user?.name},</p>
          <p>your account is deactivated by admin so if you want to activate then you will contact to admin</p>
          <p>Regards,</p>
          <p>topvabor</p>
        `,
      });
      this.appGateway.setUserInactive(userId);
    }

    return WriteResponse(200, true, 'User status updated successfully.');
  }

  //update user Role
  async updateRole(updateUserrole: UserRoleDto): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: updateUserrole.userId, isDeleted: false },
      });
      if (!user) {
        return WriteResponse(400, false, 'No User Found with this id');
      }
      let x = await this.userRepository.update(
        { id: updateUserrole.userId },
        { role: updateUserrole.role },
      );
      return WriteResponse(200, true, 'User Role Updated Succesfully');
    } catch (e) {
      return WriteResponse(400, false, e.mesaage);
    }
  }

  //user Mobile exists
  // async getUserByMobile(mobileNo: string): Promise<any> {
  //   return await this.userRepository.findOne({
  //     where: { mobileNo },
  //   });
  // }
  //User Email exists
  async getUserByEmail(email: string): Promise<any> {
    return await this.userRepository.findOne({
      where: { email: email, isDeleted: false },
    });
  }

  //GetAll
  async findAll() {
    const User = await this.userRepository.find({
      where: { isDeleted: false },
    });
    if (User.length) {
      return WriteResponse(200, User, 'User Found Successfully.');
    }
    return WriteResponse(404, false, 'User Not Found.');
  }

  //GetOne
  async findOne(id: number) {
    const User = await this.userRepository.findOne({
      where: { isDeleted: false, id: id },
    });
    if (User) {
      User.password = '';
      return WriteResponse(200, User, 'User Found Successfully.');
    }
    return WriteResponse(404, false, 'User Not Found.');
  }

  validateUserById(userId: any) {
    return this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });
  }

  //Reset Password
  async resetPassword(data) {
    const User = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (User) {
      User.password = bcrypt.hashSync(data.new_password, 10);
      this.userRepository.save(User);
      return WriteResponse(200, {}, 'Password change successfully.');
    }
    throw new HttpException(
      {
        statusCode: 404,
        message: 'User does not exists.',
      },
      200,
    );
  }

  //Change Password
  async changePassword(data,userData) {
    try {
      const User = await this.userRepository.findOne({
        where: { id: userData.id },
      });
      if (!User) {
        return WriteResponse(400, false, 'User not found.');
      }
      if (bcrypt.compareSync(data.oldPassword, User.password)) {
        User.password = bcrypt.hashSync(data.newPassword, 10);
        this.userRepository.save(User);
        return WriteResponse(200, true, 'Password change successfully.');
      }
      return WriteResponse(400, false, 'Old password not match.');
    } catch (e) {
      console.log(e);
      return WriteResponse(500, false, 'Something went wrong.');
    }
  }

  //Forget Password
  async forgetPassword(email, host) {
    try {
      let otp = Math.floor(1000 + Math.random() * 9000).toString();

      this.otpStorage[email.email] = { otp: otp, timestamp: Date.now() };
      console.log(this.otpStorage);
      let check = await this.userRepository.findOne({
        where: { email: email.email, isDeleted: false },
      });
      if (check) {
        return this.mailerService
          .sendMail({
            to: email.email,
            from: 'strangerpart128@gmail.com',
            subject: 'Forgot Password.',
            html: `
          Hi ${check.name},
          Forgot Password</a><br/><br/>
          Otp is :- ${otp}<br/>
          `,
            context: {
              username: 'voicerecord',
            },
          })
          .then((res) => {
            console.log(res);
            return WriteResponse(200, {}, 'OTP share to your email address.');
          })
          .catch((e) => WriteResponse(400, false, e.message));
      } else {
        return WriteResponse(203, false, 'Provided email does not exists.');
      }
    } catch (e) {
      return WriteResponse(400, false, e.message);
    }
  }

  //OTP Verify
  async verifyOtp(email: string, enteredOtp: string) {
    const storedOtp = this.otpStorage[email];
    const User = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!User) {
      throw new HttpException(
        {
          statusCode: 404,
          message: 'User does not exists.',
        },
        200,
      );
    }

    if (!storedOtp) {
      return WriteResponse(400, false, 'Enter a valid OTP');
    }

    const { otp, timestamp } = storedOtp;
    const currentTime = Date.now();

    if (otp === enteredOtp && currentTime - timestamp < 60000) {
      // OTP is valid and not expired
      delete this.otpStorage[email]; // Remove the OTP from storage after successful verification
      return WriteResponse(200, true, 'Success');
    } else if (otp !== enteredOtp) {
      return WriteResponse(400, false, 'Invalid OTP');
    } else {
      return WriteResponse(400, false, 'OTP has expired');
    }
  }
  //Delete
  async remove(id: number) {
    const User = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!User) {
      return WriteResponse(400, false, 'User Not found.');
    }
    await this.userRepository.update(id, { isDeleted: true });
    return WriteResponse(200, true, 'User Deleted Successfully.');
  }

  //Pagination
  async pagination(pagination: IPagination, req: any): Promise<any> {
    const { curPage, perPage } = pagination;

    const name = pagination.whereClause.find(
      (p: any) => p.key === 'name' && p.value,
    );
   
    const email = pagination.whereClause.find(
      (p: any) => p.key === 'email' && p.value,
    );
    const role = pagination.whereClause.find(
      (p: any) => p.key === 'role' && p.value,
    );
    const provider = pagination.whereClause.find(
      (p: any) => p.key === 'provider' && p.value,
    );

    const isActive = pagination.whereClause.find(
      (p: any) => p.key === 'isActive',
    );
    // const startDate = pagination.whereClause.find(
    //   (p: any) => p.key === 'startDate' && p.value,
    // );
    // const endDate = pagination.whereClause.find(
    //   (p: any) => p.key === 'endDate' && p.value,
    // );

    const all = pagination.whereClause.find(
      (p: any) => p.key === 'all' && p.value,
    );

    let builder = this.userRepository.createQueryBuilder('f');
    let lwhereClause = ` f.isDeleted = false and NOT f.role = 'admin'`;

    if (name) {
      lwhereClause += ` and f.name like  '${name.value}'`;
    }


    if (email) {
      lwhereClause += ` and f.email like  '${email.value}'`;
    }

    if (role) {
      lwhereClause += ` and f.role =  '${role.value}'`;
    }
    if (provider) {
      lwhereClause += ` and f.provider =  '${provider.value}'`;
    }
    if (isActive) {
      lwhereClause += ` and f.isActive =  ${isActive.value}`;
    }

    // if (startDate && endDate) {
    //   if (startDate.value === endDate.value) {
    //     lwhereClause += ` AND DATE(f.createdAt) = '${startDate.value}'`;
    //   } else {
    //     lwhereClause += ` AND f.createdAt >= '${startDate.value}' AND f.createdAt <= '${endDate.value}'`;
    //   }
    // } else if (startDate) {
    //   lwhereClause += ` AND f.createdAt >= '${startDate.value}'`;
    // } else if (endDate) {
    //   lwhereClause += ` AND f.createdAt <= '${endDate.value}'`;
    // }
    

    if (all) {
      lwhereClause += ` and (f.email like '%${all.value}%' or f.name like '%${all.value}%' or f.role like '%${all.value}%' or f.isActive like '%${all.value}%' or f.provider like '%${all.value}')`;
    }

    let skip = (curPage - 1) * perPage;
    let [list, count] = await builder
      .where(lwhereClause)
      .skip(skip)
      .take(perPage)
      .orderBy('f.createdAt', 'DESC')
      .getManyAndCount();
    return paginateResponse(list, count);
  }
}
