import { EmailMessage } from "../entities/EmailMessage";
export const EMAIL_READER_PORT = Symbol("EMAIL_READER_PORT");

export interface EmailReaderPort {
    fetchUnread(): Promise<EmailMessage[]>;
    markAsRead(uid: number): Promise<void>;
}