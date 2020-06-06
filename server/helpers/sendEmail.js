import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config()

export default async function sendEmail({ toAddress, subject, body }) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  try{
    let info = await transporter.sendMail({
      from: process.env.GMAIL_USERNAME,
      to: toAddress,
      subject: subject,
      html: body
    });
    return {
      status: 200,
      messageId: info.id,
      message: 'Please, verify your account by clicking the link sent to your email.',
      info
    };
  }
  catch(error){
    return {
      message: 'Unfortunately, the verification email could not be sent at this time.',
      error
    }
  }
}
