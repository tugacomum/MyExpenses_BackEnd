import fs from 'fs'

import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';

export default new class SendMailService {
  private client: Transporter;

  constructor() {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_SECRET,
        pass: process.env.PASSWORD_SECRET
      }
    });

    this.client = transporter;
  };


  async execute(to: string, subject: string, variables: object, path: string) {
    const templateFileContent = fs.readFileSync(path).toString('utf8');

    const mailTemplateParse = handlebars.compile(templateFileContent);

    const html = mailTemplateParse(variables);

    await this.client.sendMail({
      to,
      subject,
      html,
      from: 'MyExpenses <noreply@myexpenses.pt>'
    });
  }
}