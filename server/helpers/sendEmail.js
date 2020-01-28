import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config()

export default async function sendEmail(toAddress, subject, body) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD
    }
  });

  let info = await transporter.sendMail({
    from: process.env.GMAIL_USERNAME,
    to: toAddress,
    subject: subject,
    html: body
  });

  return `Message sent: ${info.messageId}`;
}