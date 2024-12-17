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
import { UsersService } from './services/users.service';
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
    console.log('newUser', newUser);
    if (!newUser.success) {
      throw new UnauthorizedException(newUser.error);
    }

    const token = await this.JwtServices.generateToken({
      username: newUser?.user?.username,
      email: newUser?.user?.email,
    });

    return {
      ...token,
      user: {
        username: newUser?.user?.username,
        email: newUser?.user?.email,
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

    if (!validatedUser.success) {
      throw new UnauthorizedException(validatedUser.error);
    }

    const token = await this.JwtServices.generateToken({
      username: validatedUser.user?.username,
      email: validatedUser.user?.email,
    });

    return {
      ...token,
      user: {
        username: validatedUser.user?.username,
        email: validatedUser.user?.email,
      },
    };
  }
}
