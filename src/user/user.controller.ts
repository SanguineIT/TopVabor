import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  ForgetPassword,
  LoginDTO,
  ResetPassDto,
  SocialLoginDto,
  UserCountryDto,
  UserRoleDto,
  VerifyDto,
} from './dto/create-user.dto';
import { UpdateUserdto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { WriteResponse } from 'src/shared/response';
import { JwtService } from '@nestjs/jwt';
import { IPagination, IPaginationSwagger } from 'src/shared/paginationEum';
import { JwtAuthGuard } from './jwt-auth.guard';
import { filter } from 'rxjs';
import { serverUrl } from 'src/constent';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('/signup')
  async SingIn(@Body() CreateUserDto: CreateUserDto) {
    try {
      let isExits = await this.userService.getUserByEmail(CreateUserDto.email);
      if (isExits) {
        return WriteResponse(400, false, 'Email already exists.');
      }
      let email = CreateUserDto.email;
      let password = CreateUserDto.password;
      let user: any = await this.userService.Create(CreateUserDto);
      let loginData: any = await this.LogIn({
        email: email,
        password: password,
      });

      const payload = { id: loginData.id };
      const token = await this.jwtService.signAsync(payload);
      return {
        statusCode: 200,
        message: 'User registration successfully.',
        data: loginData.data,
      };
    } catch (e) {
      WriteResponse(400, false, 'Something went wrong.');
    }
  }

  @Post('social-login')
  async SingInWithSocialAccound(@Body() socialLogin: SocialLoginDto) {
    return await this.userService.singInWithSocialAccound(socialLogin);
  }

  @Post('/Update-user')
  async UpateUser(@Body() updateUserdto: UpdateUserdto) {
    try {
      // if(updateUserdto.mobileNo){
      //   let ismobile = await this.userService.getUserByMobile(
      //     updateUserdto.mobileNo,
      //   );
      //   if (ismobile) {
      //     if (ismobile.id !== updateUserdto.id) {
      //       return WriteResponse(400, false, 'Mobile No. already exists.');
      //     }
      //   }
      // }

      return await this.userService.UpdateUser(updateUserdto);
    } catch (e) {
      return WriteResponse(500, false, 'Internal server error.');
    }
  }

  @Post('/update/role')
  async updateuserRole(@Body() updateUserrole: UserRoleDto) {
    try {
      return await this.userService.updateRole(updateUserrole);
    } catch (e) {
      return WriteResponse(500, false, 'Internal server error.');
    }
  }

  @Post('/update/status')
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        status: false,
        userId: 0,
      },
    },
  })
  async updateStatus(@Body() body: { status: boolean; userId: number }) {
    return this.userService.updateStatus(body);
  }

  //User Login
  @Post('/login')
  async LogIn(@Body() data: LoginDTO) {
    let user = await this.userService.LogIn(data.email, data.password);

    if (!user) {
      return WriteResponse(401, data, 'invalid credentials');
    }
    if (user == 'Blocked') {
      return WriteResponse(400, false, 'user is blocked ');
    }
    // if (!user.isEmailVerified) {
    //   await this.userService.sendOtp({
    //     email: data.email,
    //   });
    //   return WriteResponse(1001, false, 'Email is not verified.');
    // }
    let PdfURl = `${serverUrl}termsandconditionD.pdf`;
    const payload = { id: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return WriteResponse(
      200,
      {
        token: token,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
        TermsUrl: PdfURl,
        dateOfBirth: user.dateOfBirth,
      },
      'Login successfully.',
    );
  }

  //Admin Login
  @Post('/Admin-login')
  async AdminLogin(@Body() data: LoginDTO) {
    let user = await this.userService.AdminLogin(data.email, data.password);

    if (!user) {
      return WriteResponse(
        401,
        data,
        'invalid credentials or user is not a Admin.',
      );
    }

    const payload = { id: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload);
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
  }

  @Get('get-All')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll() {
    return this.userService.findAll();
  }

  @Get('getOne/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @Req() req) {
    return this.userService.findOne(+id);
  }

  //Reset Password
  @Post('reset-password')
  async resetPassword(@Body() data: ResetPassDto) {
    return this.userService.resetPassword(data);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changePassword(@Body() data: ChangePasswordDto, @Req() req: any) {
    return await this.userService.changePassword(data, req.user);
  }

  // Update user Country
  @Post('/update/country')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateUserCountry(
    @Body() updatecountryDto: UserCountryDto,
    @Req() req: any,
  ) {
    try {
      return await this.userService.updateUserCountry(
        updatecountryDto,
        req.user,
      );
    } catch (error) {
      return WriteResponse(500, false, 'Something went worng ');
    }
  }

  //Forget Password
  @Post('forget-password')
  async forgetPassword(@Query() email: ForgetPassword, @Req() req: any) {
    return await this.userService.forgetPassword(email, req.get('host'));
  }

  //OTP Verify
  @Post('verify-otp')
  verifyOtp(@Body() verifyDto: VerifyDto) {
    return this.userService.verifyOtp(verifyDto.email, verifyDto.otp);
  }

  @Get('delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
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
  pagination(@Body() pagination: IPagination, @Req() req) {
    return this.userService.pagination(pagination, req);
  }
}
