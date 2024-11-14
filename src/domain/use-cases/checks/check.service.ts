import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
import { LogRepository } from '../../repository/log.repository';

interface CheckServiceUseCase {
  execute(url: string): Promise<boolean>;
}

type CheckSuccess = (() => void) | undefined;
type CheckError = ((error: string) => void) | undefined;

export class CheckService implements CheckServiceUseCase {
  constructor(
    private readonly logRepository: LogRepository,
    private readonly checkSuccess: CheckSuccess,
    private readonly checkError: CheckError
  ) {}
  public async execute(url: string): Promise<boolean> {
    const log = new LogEntity({
      message: `Service ${url} working`,
      level: LogSeverityLevel.low,
      origin: 'check.service.ts',
    });
    try {
      const req = await fetch(url);
      if (!req.ok) {
        throw new Error(`Error on check service ${url}`);
      }
      this.logRepository.saveLog(log);
      this.checkSuccess && this.checkSuccess();
      return true;
    } catch (error) {
      const errorMessage = `${error}`;
      log.message = errorMessage;
      log.level = LogSeverityLevel.high;
      this.logRepository.saveLog(log);
      this.checkError && this.checkError(errorMessage);
      return false;
    }
  }
}
