import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../user/users.module';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtServices } from './jwt.service';
import { CacheModule } from '@nestjs/cache-manager';
import { MailModule } from '../mall/service/mall.module';
import { AuthController } from '../auth/auth.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from 'src/mall/service/mall.config';
@Module({
  imports: [
    MailerModule.forRoot(mailerConfig),
    forwardRef(() => UsersModule), // 使用 forwardRef 解决循环依赖
    PassportModule,
    ConfigModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 900000, // 15 minutes in milliseconds
    }),
    MailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtServices,AuthController],
  exports: [AuthService, JwtModule, JwtServices,AuthController ],
  controllers: [AuthController]
})
export class AuthModule {}
