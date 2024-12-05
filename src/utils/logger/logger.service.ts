import { ConsoleLogger } from '@nestjs/common';

export class Logger extends ConsoleLogger {
  log(message: any) {
    super.log(message);
  }
  error(message: any, trace: string) {
    super.error(message, trace);
  }
  warn(message: any) {
    super.warn(message);
  }
  debug(message: any) {
    super.debug(message);
  }
  verbose(message: any) {
    super.verbose(message);
  }
}
