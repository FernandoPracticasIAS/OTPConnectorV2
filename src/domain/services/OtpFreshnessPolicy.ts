export class OtpFreshnessPolicy {
  constructor(
    private readonly freshnessThresholdSeconds: number,
  ) {}

  public isFresh(otpGenerationDate: Date): boolean {
    const age = (Date.now() - otpGenerationDate.getTime()) / 1000;
    return age <= this.freshnessThresholdSeconds;
  }
}