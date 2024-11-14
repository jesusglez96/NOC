import { SendEmailLogs } from '../domain/use-cases/email/send-email-logs';
import { FileSystemDatasource } from '../infrastructure/datasources/file-system.datasource';
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.impl';
import { EmailService } from './email/email.service';

const fileSystemLogRepository = new LogRepositoryImpl(
  new FileSystemDatasource()
);
const emailService = new EmailService();

export class Server {
  public static start() {
    console.log('Server started...');

    new SendEmailLogs(emailService, fileSystemLogRepository).execute(
      'jgleni96@gmail.com'
    );
    // emailService.sendEmailWithAtttach('jgleni96@gmail.com');
    // emailService.sendEmail({
    //   to: 'jgleni96@gmail.com',
    //   subject: 'System Logs',
    //   htmlBody: `
    //     <h3>System Logs - NOC</h3>
    //     <p>TEST</p>
    //     <p>Check attached files</p>
    //   `,
    // });
    // CronService.createJob('*/5 * * * * *', () => {
    //   new CheckService(
    //     fileSystemLogRepository,
    //     () => {
    //       console.log('success');
    //     },
    //     (error) => {
    //       console.error(error);
    //     }
    //   ).execute('https://www.google.com');
    //   // ).execute('http://localhost:3000');
    //   // new CheckService().execute('http://localhost:3000');
    // });
  }
}
