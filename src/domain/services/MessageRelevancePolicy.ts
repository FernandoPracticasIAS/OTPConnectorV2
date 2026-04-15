import { EmailMessage } from "../entities/EmailMessage";

export class MessageRelevancePolicy {
    constructor(
        private readonly allowedSenders?: RegExp,
        private readonly allowedSubjects?: RegExp,
    ){}
    public isRelevant(message: EmailMessage): boolean {
        const senderOk = this.allowedSenders ? this.allowedSenders.test(message.from) : true;
        const subjectOk = this.allowedSubjects ? this.allowedSubjects.test(message.subject) : true;
        return senderOk && subjectOk;
    }
}