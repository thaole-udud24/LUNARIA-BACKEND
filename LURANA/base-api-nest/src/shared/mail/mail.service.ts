import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    const host = this.config.get<string>('mail.host');
    const port = this.config.get<number>('mail.port');
    const user = this.config.get<string>('mail.user');
    const pass = this.config.get<string>('mail.pass');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: { user, pass },
    });
  }

  private loadTemplate(fileName: string) {
    const p = path.join(__dirname, 'templates', fileName);
    return fs.readFileSync(p, 'utf8');
  }

  async sendVerifyEmail(to: string, code: string) {
    const from = this.config.get<string>('mail.from');
    const html = this.loadTemplate('verify-email.html').replace('{{CODE}}', code);

    await this.transporter.sendMail({
      from,
      to,
      subject: 'Xác thực email - Cosmetics Shop',
      html,
    });
  }

  async sendResetCode(to: string, code: string) {
    const from = this.config.get<string>('mail.from');
    const html = this.loadTemplate('reset-code.html').replace('{{CODE}}', code);

    await this.transporter.sendMail({
      from,
      to,
      subject: 'Mã khôi phục mật khẩu - Cosmetics Shop',
      html,
    });
  }
}