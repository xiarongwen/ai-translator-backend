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
}
