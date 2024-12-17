import { Module } from '@nestjs/common';
import { MailService } from '../service/mall.service';
import { mailerConfig } from './mall.config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  providers: [MailService],
  exports: [MailService], // 导出 MailService 以供其他模块使用
})
export class MailModule {}