export const NOTIFICATION_SENDER_PORT = Symbol("NOTIFICATION_SENDER_PORT");

export interface NotificationSenderPort {
    sendOtp(otp: string, metadata: any): Promise<void>;
}