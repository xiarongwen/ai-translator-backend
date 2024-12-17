import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcryptjs';
// import { UpdateProfileDto } from '../dto/updata-profile.dto';
import { UserServiceResponse } from '../../utils/user/interface';
const SALT_ROUNDS = 10;
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<UserServiceResponse> {
    try {
      const existingUser = await this.findUserByEmail(email);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          error: '无效的邮箱格式',
        };
      }
      if (existingUser) {
        return {
          success: false,
          error: '邮箱已存在',
        };
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await this.userModel.create({
        username,
        email,
        password: hashedPassword,
      });

      return {
        success: true,
        user: user as User,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error,
      };
    }
  }

  async findUserByEmail(email: string): Promise<User | any> {
    return this.userModel.findOne({ email }).select('-password').lean().exec();
  }

  async validateUserPassword(
    email: string,
    password: string,
  ): Promise<UserServiceResponse> {
    try {
      const user = await this.userModel
        .findOne({ email })
        .select('+password')
        .exec();

      if (!user) {
        return {
          success: false,
          error: '用户不存在',
        };
      }
      if (password.length < 9) {
        return {
          success: false,
          error: '密码最小9位',
        };
      }
      const passwordRegex = /^[a-zA-Z0-9]{9}$/;
      if (!passwordRegex.test(password)) {
        return {
          success: false,
          error: '密码必须是9位且只能包含字母和数字',
        };
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          error: '无效的密码',
        };
      }

      const { password: _, ...userWithoutPassword } = user.toObject();
      console.log('userWithoutPassword', _);
      return {
        success: true,
        user: userWithoutPassword as User,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error,
      };
    }
  }
}