import { Injectable } from "@nestjs/common";
import axios from "axios";
import { NotificationSenderPort } from "../../domain/ports/NotificationSenderPort";

@Injectable()
export class TeamsWebhookAdapter implements NotificationSenderPort {

  async sendOtp(otp: string, metadata: any): Promise<void> {

    const payload = {
      type: "message",
      attachments: [
        {
          contentType: "application/vnd.microsoft.card.adaptive",
          content: {
            type: "AdaptiveCard",
            body: [
              {
                type: "TextBlock",
                text: "**OTP Detectado**",
                size: "Large",
                weight: "Bolder",
                color: "Accent"
              },
              {
                type: "FactSet",
                facts: [
                  { title: "Código:", value: otp },
                  { title: "Remitente:", value: metadata.from },
                  { title: "Asunto:", value: metadata.subject },
                  { title: "Fecha:", value: metadata.date.toLocaleString() }
                ]
              }
            ],
            $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
            version: "1.4"
          }
        }
      ]
    };
    const url = process.env.TEAMS_WEBHOOK_URL?.replace(/&amp;/g, '&');
    await axios.post(url!, payload);
  }
}