import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ProcessIncomingEmailsUseCase } from '../application/use-cases/ProcessIncomingEmailsUseCase';

@Injectable()
export class OtpListenerService implements OnModuleInit {

  private readonly logger = new Logger(OtpListenerService.name);

  constructor(
    private readonly processEmails: ProcessIncomingEmailsUseCase
  ) {}

  async onModuleInit() {
    this.logger.log('OTP Listener iniciado');

    const interval =
      Number(process.env.EMAIL_POLL_INTERVAL_SECONDS ?? 30) * 1000;

    this.logger.log(`Polling de correo cada ${interval / 1000}s`);

   setInterval(async () => {
  this.logger.debug('Ejecutando polling de correos...');
  try {
    await this.processEmails.execute();
    this.logger.debug('Polling completado');
  } catch (error) {
    this.logger.error('Error ejecutando el caso de uso de correo', error);
  }
}, interval);
  }
}