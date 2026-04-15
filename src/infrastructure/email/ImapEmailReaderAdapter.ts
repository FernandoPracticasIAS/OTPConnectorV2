import { Injectable, Logger } from "@nestjs/common";
import { connect } from "imap-simple";
import { simpleParser } from "mailparser";
import { EmailReaderPort } from "../../domain/ports/EmailReaderPort";
import { EmailMessage } from "../../domain/entities/EmailMessage";

@Injectable()
export class ImapEmailReaderAdapter implements EmailReaderPort {

  private readonly logger = new Logger(ImapEmailReaderAdapter.name);
  private connection: any;

  private async getConnection(){
     if(this.connection) return this.connection;

     this.connection = await connect({
        imap:{
            user:process.env.EMAIL_USER,
            password:process.env.EMAIL_PASSWORD,
            host:process.env.EMAIL_HOST,
            port:Number(process.env.EMAIL_PORT ?? 993),
            tls:true,
            authTimeout:30000,
             tlsOptions:{
               rejectUnauthorized:false
             }
        }
     });

     await this.connection.openBox(process.env.EMAIL_MAILBOX ?? 'INBOX');

     return this.connection;
  }

  async fetchUnread(): Promise<EmailMessage[]> {

    const connection = await this.getConnection();

  const messages = await connection.search(['UNSEEN'],{bodies:[''],struct:true});

    const results:EmailMessage[] = [];

    for(const msg of messages){

      const part = msg.parts.find((p:any)=>p.which === '');
      const parsed = await simpleParser(part.body);

      results.push(
        new EmailMessage(
          msg.attributes.uid,
          parsed.from?.text ?? '',
          parsed.subject ?? '',
          parsed.text ?? parsed.html ?? '',
          parsed.date ?? new Date()
        )
      )
    }

    this.logger.log(`fetchUnread: ${results.length} mensajes no leídos encontrados`);
    return results;
  }

  async markAsRead(uid: number): Promise<void> {
     this.logger.debug(`Marcando mensaje como leído uid=${uid}`);
     const connection = await this.getConnection();
     await connection.addFlags(uid,'\\Seen');
  }
}