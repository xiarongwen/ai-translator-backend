import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
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
    console.log('registerDto', registerDto);
    return this.usersService.createUser(
      registerDto.username,
      registerDto.email,
      registerDto.password,
    );
  }
}
