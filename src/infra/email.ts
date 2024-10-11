import Mailgun from 'mailgun.js';
import dotenv from 'dotenv';
import path from 'path';
import formData from 'form-data';
import { IMailgunClient } from 'mailgun.js/Interfaces';
const dotEnv = dotenv.config({
    path: path.resolve(__dirname, '../../.env'),
});

export class EmailService {
    private mailgun: IMailgunClient;
    constructor() {
        const mg = new Mailgun(formData);
        this.mailgun = mg.client({
            username: 'api',
            key: dotEnv.parsed?.MAILGUN_API_KEY?? "fake",
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
            await this.mailgun.messages.create(dotEnv.parsed!.MAILGUN_DOMAIN, data);

    };
}