import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/services/users.service';
import { MailService } from '../mall/service/mall.service';
import { BadRequestException } from '../utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private readonly mailService: MailService, // 需要注入邮件服务
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const username = await this.usersService.validateUserPassword(email, pass);
    if (username) {
      return { username };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: {
    username: string;
    email: string;
    password: string;
  }) {
    const newUser = await this.usersService.createUser(
      registerDto.username,
      registerDto.email,
      registerDto.password,
    );
    if (!newUser.success) {
      throw new UnauthorizedException(newUser.error);
    }
    return this.login(newUser.user);
  }
  async sendPasswordResetEmail(email: string) {
    console.log('Sending password reset email for:', email);
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      return {
        success: false,
        error: '用户不存在',
      };
    }

    // 生成6位数验证码
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 将验证码保存到缓存中，设置15分钟过期
    const cacheKey = `password_reset_${email}`;
    await this.cacheManager.set(cacheKey, verificationCode, 900000);

    // 发送重置密码邮件
    await this.mailService.sendPasswordResetEmail(email, verificationCode);

    return { message: '重置密码邮件已发送，请查收' };
  }

  async resetPassword(dto: {
    email: string;
    verificationCode: string;
    newPassword: string;
  }) {
    const { email, verificationCode, newPassword } = dto;
    
    // 验证验证码
    const cacheKey = `password_reset_${email}`;
    const savedCode = await this.cacheManager.get(cacheKey);
    
    if (!savedCode || savedCode !== verificationCode) {
      return {
        success: false,
        error: '验证码无效或已过期',
      };
    }

    // 更新密码
    const result = await this.usersService.updatePassword(email, newPassword);
    if (!result.success) {
      throw BadRequestException('密码重置失败');
    }

    // 删除缓存中的验证码
    await this.cacheManager.del(cacheKey);

    return { message: '密码重置成功' };
  }
  

}
