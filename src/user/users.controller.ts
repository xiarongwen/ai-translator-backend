import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtServices } from '../auth/jwt.service';
import { User } from './user.entity';
// import { AuthService } from 'src/auth/auth.service';
interface LoginResponse {
  access_token: string;
  user: {
    username: string;
    email: string;
  };
}

@Controller('auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => JwtServices))
    private readonly JwtServices: JwtServices,
  ) {}

  @Post('register')
  async register(@Body() user: User) {
    const newUser = await this.usersService.createUser(
      user.username,
      user.email,
      user.password,
    );

    const token = await this.JwtServices.generateToken({
      username: newUser.username,
      email: newUser.email,
    });

    return {
      ...token,
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() user: Pick<User, 'email' | 'password'>,
  ): Promise<LoginResponse> {
    const validatedUser = await this.usersService.validateUserPassword(
      user.email,
      user.password,
    );

    if (!validatedUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.JwtServices.generateToken({
      username: validatedUser.username,
      email: validatedUser.email,
    });

    return {
      ...token,
      user: {
        username: validatedUser.username,
        email: validatedUser.email,
      },
    };
  }
}
