import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { IMailgunClient } from 'mailgun.js/Interfaces';
import { config } from '../infra/config';
export class EmailService {
    private mailgun: IMailgunClient;
    constructor() {
        const mg = new Mailgun(formData);
        this.mailgun = mg.client({
            username: 'api',
            key: config.mailgunApiKey?? "fake",
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        console.log("Sending email to", to);
        const data = {
            from: 'Condo App <soporte@puntoreica.com>',
            to:[to],
            subject: subject,
            text: text,
            html: text,
        };
            await this.mailgun.messages.create(config.mailgunDomain, data);

    };
}