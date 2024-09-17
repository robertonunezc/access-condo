import Mailgun from 'mailgun-js';
import dotenv from 'dotenv';
import path from 'path';

const dotEnv = dotenv.config({
    path: path.resolve(__dirname, '../../.env'),
});
export class EmailService {
    private mailgun: Mailgun.Mailgun;
    constructor() {
        this.mailgun = new Mailgun({
            apiKey: dotEnv.parsed?.EMAIL_KEY ?? "fake",
            domain: dotEnv.parsed?.EMAIL_DOMAIN ?? "fake"
        });
    }
    async sendEmail(to: string, subject: string, text: string) {
        console.log("Sending email to", to);
        const data = {
            from: 'Condo App <soporte@puntoreica.com>',
            to: to,
            subject: subject,
            text: text
        };

        await this.mailgun.messages().send(data, (error, body) => {
            if (error) {
                console.error(error);
                throw new Error("Error sending email");
            }
            console.log(body);
        });
        
    };
}