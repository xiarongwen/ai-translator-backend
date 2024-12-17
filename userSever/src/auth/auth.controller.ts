import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(
      await this.authService.validateUser(loginDto.email, loginDto.password),
    );
  }
  @Post('register')
  async register(
    @Body() registerDto: { username: string; email: string; password: string },
  ) {
    return this.authService.register(registerDto);
  }

  @Post('resetPassword')
  async resetPassword(@Body() resetPasswordDto: { email: string; verificationCode: string; newPassword: string }) {
    console.log('Reset password endpoint hit', resetPasswordDto);
    return this.authService.resetPassword(resetPasswordDto);
  }
  
  @Post('sendResetPasswordEmail')
  async sendResetPasswordEmail(@Body() sendResetPasswordEmailDto: { email: string }) {
    return this.authService.sendPasswordResetEmail(sendResetPasswordEmailDto.email);
  }
}
