import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AppGateway } from 'src/app.gateway';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topvabor', // Replace with your own secret key
      signOptions: { expiresIn: '10d' }, // Set your desired expiration time
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, AppGateway],
  exports: [UserModule],
})
export class UserModule {}
