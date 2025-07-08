import { Controller, Get, Logger } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('log')
export class LogController {
  private logger = new Logger();
  constructor(private readonly logService: LogService) {}

  @Get()
  getHello() {
    this.logger.debug('aaa', LogController.name);
    this.logger.error('bbb', LogController.name);
    this.logger.log('ccc', LogController.name);
    this.logger.verbose('ddd', LogController.name);
    this.logger.warn('eee', LogController.name);
    return this.logService.getHello();
  }
}
