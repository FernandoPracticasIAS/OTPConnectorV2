import { Inject, Injectable, Logger } from "@nestjs/common";
import { EMAIL_READER_PORT} from "src/domain/ports/EmailReaderPort";
import { NOTIFICATION_SENDER_PORT } from "src/domain/ports/NotificationSenderPort";
import type { EmailReaderPort } from "../../domain/ports/EmailReaderPort";
import type { NotificationSenderPort } from "../../domain/ports/NotificationSenderPort";
import { MessageRelevancePolicy } from "src/domain/services/MessageRelevancePolicy";
import { OtpExtractor } from "src/domain/services/OtpExtractor";
import { OtpFreshnessPolicy } from "src/domain/services/OtpFreshnessPolicy";

@Injectable()
export class ProcessIncomingEmailsUseCase {
    private readonly logger = new Logger(ProcessIncomingEmailsUseCase.name);
    constructor(
        @Inject(EMAIL_READER_PORT)
        private readonly emailReader: EmailReaderPort,

        @Inject(NOTIFICATION_SENDER_PORT)
        private readonly notificationSender: NotificationSenderPort,

        private readonly extractor: OtpExtractor,
        private readonly relevancePolicy: MessageRelevancePolicy,
        private readonly freshnessPolicy: OtpFreshnessPolicy,

    ) {}

    public async execute(){
        try {
            this.logger.log('Iniciando procesamiento de correos entrantes');
            const messages = await this.emailReader.fetchUnread();
            this.logger.log(`Mensajes no leídos obtenidos: ${messages.length}`);

            for (const message of messages){
                this.logger.debug(`Procesando mensaje uid=${message.uid} from=${message.from} subject=${message.subject}`);

                if (!this.relevancePolicy.isRelevant(message)){
                    this.logger.debug(`Mensaje no relevante uid=${message.uid}`);
                    await this.emailReader.markAsRead(message.uid);
                    continue;
                }

                if (!this.freshnessPolicy.isFresh(message.date)) {
                    this.logger.debug(`Mensaje fuera de frescura uid=${message.uid} date=${message.date.toISOString()}`);
                    await this.emailReader.markAsRead(message.uid);
                    continue;
                }

                const otp = this.extractor.extractOtpFromEmailBody(message.body);
                this.logger.log(`OTP extraído para uid=${message.uid}: ${otp ?? 'NINGUNO'}`);

                if (!otp) {
                    this.logger.debug(`No se encontró OTP en el mensaje uid=${message.uid}`);
                    await this.emailReader.markAsRead(message.uid);
                    continue;
                }

                await this.notificationSender.sendOtp(otp, message);
                await this.emailReader.markAsRead(message.uid);
            }
        } catch (error) {
            this.logger.error('Error en ProcessIncomingEmailsUseCase.execute', error);
            throw error;
        }
    }
}