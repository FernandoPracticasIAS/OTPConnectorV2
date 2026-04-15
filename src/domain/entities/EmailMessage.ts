
export class EmailMessage {
  constructor(
    public readonly uid: number,
    public readonly from: string,
    public readonly subject: string,
    public readonly body: string,
    public readonly date: Date,
  ) {}
}
