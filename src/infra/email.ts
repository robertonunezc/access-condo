import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { IMailgunClient } from 'mailgun.js/Interfaces';

export class EmailService {
    private mailgun: IMailgunClient;
    constructor() {
        const mg = new Mailgun(formData);
        this.mailgun = mg.client({
            username: 'api',
            key: process.env.MAILGUN_API_KEY?? "fake",
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
            await this.mailgun.messages.create(process.env.MAILGUN_DOMAIN!, data);

    };
}