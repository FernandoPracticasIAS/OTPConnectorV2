import { Subject } from "../value-objects/Subject";


export class EmailMessage {
  constructor(
    public readonly uid: number,
    public readonly from: string,
    public readonly subject: Subject,
    public readonly body: string,
    public readonly date: Date,
  ) {}
}
