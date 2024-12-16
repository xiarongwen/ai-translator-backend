import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../user/users.module';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtServices } from './jwt.service';

@Module({
  imports: [
    forwardRef(() => UsersModule), // 使用 forwardRef 解决循环依赖
    PassportModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtServices],
  exports: [AuthService, JwtModule, JwtServices],
})
export class AuthModule {}
