import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugints';
import path from 'path';

interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

interface Attachment {
  filename: string;
  path: string;
}

export class EmailService {
  private transporter = nodemailer.createTransport({
    // host: 'smtp.gamil.com',
    service: envs.MAILER_SERVICE,
    pool: true,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments = [] } = options;
    try {
      await this.transporter.sendMail({
        to,
        subject,
        html: htmlBody,
        attachments,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async sendEmailWithAtttach(to: string | string[]): Promise<boolean> {
    const attachments: Attachment[] = [
      {
        filename: 'logs-low.log',
        path: path.join(`${__dirname}`, '../../../logs/logs-low.log'),
      },
      {
        filename: 'logs-low.medium',
        path: path.join(`${__dirname}`, '../../../logs/logs-medium.log'),
      },
      {
        filename: 'logs-low.high',
        path: path.join(`${__dirname}`, '../../../logs/logs-high.log'),
      },
    ];
    try {
      await this.transporter.sendMail({
        to,
        subject: 'Logs',
        html: 'Check Logs',
        attachments,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
