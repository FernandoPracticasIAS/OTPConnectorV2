import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtpListenerService } from './presentation/OtpListenerServise';
import { ProcessIncomingEmailsUseCase } from './application/use-cases/ProcessIncomingEmailsUseCase';
import { ImapEmailReaderAdapter } from './infrastructure/email/ImapEmailReaderAdapter';
import { TeamsWebhookAdapter } from './infrastructure/notifications/TeamsWebhookAdapter';
import { EMAIL_READER_PORT } from './domain/ports/EmailReaderPort';
import { NOTIFICATION_SENDER_PORT } from './domain/ports/NotificationSenderPort';
import { OtpExtractor } from './domain/services/OtpExtractor';
import { MessageRelevancePolicy } from './domain/services/MessageRelevancePolicy';
import { OtpFreshnessPolicy } from './domain/services/OtpFreshnessPolicy';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    OtpListenerService,
    ProcessIncomingEmailsUseCase,

    {
      provide: EMAIL_READER_PORT,
      useClass: ImapEmailReaderAdapter,
    },
    {
      provide: NOTIFICATION_SENDER_PORT,
      useClass: TeamsWebhookAdapter,
    },

    {
      provide: OtpExtractor,
      useFactory: () =>
        new OtpExtractor(
          new RegExp(process.env.EMAIL_OTP_REGEX ?? '\\b\\d{6}\\b')
        ),
    },

    {
      provide: MessageRelevancePolicy,
      useFactory: () =>
        new MessageRelevancePolicy(
          process.env.EMAIL_ALLOWED_SENDER
            ? new RegExp(process.env.EMAIL_ALLOWED_SENDER, 'i')
            : undefined,
          process.env.EMAIL_ALLOWED_SUBJECT
            ? new RegExp(process.env.EMAIL_ALLOWED_SUBJECT, 'i')
            : undefined,
        ),
    },

    {
      provide: OtpFreshnessPolicy,
      useFactory: () =>
        new OtpFreshnessPolicy(
          Number(process.env.EMAIL_OTP_TTL_SECONDS ?? 300)
        ),
    },
  ],
})
export class AppModule {}