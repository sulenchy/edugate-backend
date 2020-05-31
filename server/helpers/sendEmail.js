import dotenv from 'dotenv';
import mailgun from 'mailgun-js';

dotenv.config()

const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

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

