import fs from 'fs';

import { LogDatasource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

export class FileSystemDatasource implements LogDatasource {
  private readonly logPath = 'logs/';
  private readonly allLogsPath = 'logs/logs-low.log';
  private readonly mediumPath = 'logs/logs-medium.log';
  private readonly highPath = 'logs/logs-high.log';

  constructor() {
    this.createLogsFile();
  }

  private createLogsFile = () => {
    if (!fs.existsSync(this.logPath)) fs.mkdirSync(this.logPath);

    [this.allLogsPath, this.mediumPath, this.highPath].forEach((path) => {
      if (!fs.existsSync(path)) fs.writeFileSync(path, '');
    });
  };

  async saveLog(newLog: LogEntity): Promise<void> {
    const logJson = JSON.stringify(newLog).concat('\n');

    fs.appendFileSync(this.allLogsPath, logJson);

    if (newLog.level === LogSeverityLevel.medium) {
      fs.appendFileSync(this.mediumPath, logJson);
    }
    if (newLog.level === LogSeverityLevel.high) {
      fs.appendFileSync(this.highPath, logJson);
    }
  }

  private getLogsFromFile(path: string): LogEntity[] {
    const content = fs.readFileSync(path, 'utf-8');
    const logs = content.split('\n').map(LogEntity.fromJson);

    return logs;
  }

  async getLogs(logLevel: LogSeverityLevel): Promise<LogEntity[]> {
    switch (logLevel) {
      case LogSeverityLevel.low:
        return this.getLogsFromFile(this.allLogsPath);
      case LogSeverityLevel.medium:
        return this.getLogsFromFile(this.mediumPath);
      case LogSeverityLevel.high:
        return this.getLogsFromFile(this.highPath);

      default:
        throw new Error('LogSeverityLevel not implemented.');
    }
  }
}
