export class OtpExtractor {
  constructor(
    private readonly otpRegex: RegExp,
  ) {}
  public extractOtpFromEmailBody(emailBody: string): string | null {
    const match = emailBody.match(this.otpRegex);
    return match ? match[0] : null;
  }
}