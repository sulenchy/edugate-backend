import dotenv from 'dotenv';
import mailgun from 'mailgun-js';
const DOMAIN = 'sandbox1ac39a142ae44aee8b1a7d512b6f5e78.mailgun.org';

const API_KEY = 'df4e1c458e2abc88e4b8ea3b83a6241e-7fba8a4e-a24b6a10';

const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

dotenv.config()

export default function sendEmail({ toAddress, subject, body }) {
  const data = {
    from: `Edugate <${ process.env.GMAIL_USERNAME }>`,
    to: toAddress,
    subject,
    html: body
  };

  mg.messages().send(data, function (error, body) {
    if(error) return error;
    return body;
  });
}

