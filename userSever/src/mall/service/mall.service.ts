import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendPasswordResetEmail(to: string, verificationCode: string) {
    console.log('Sending password reset email to:', this.configService.get('MAIL_HOST'));
    const mailOptions = {
      from: this.configService.get('MAIL_FROM'),
      to,
      subject: '密码重置验证码',
      html: `
        <h1>密码重置</h1>
        <p>您的验证码是: <strong>${verificationCode}</strong></p>
        <p>验证码有效期为15分钟，请尽快完成密码重置。</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}