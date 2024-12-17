import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtServices {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: { username: string; email: string }) {
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
