import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/services/users.service';

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
}
